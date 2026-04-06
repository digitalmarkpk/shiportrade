"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  Calculator,
  Info,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Calendar,
  Ruler,
  Weight,
  DollarSign,
  ArrowRight,
  Clock3,
  Boxes,
  Route,
  Timer,
  Sparkles,
  BarChart3,
  PieChart,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  Navigation,
  Shield,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Delivery zones configuration
const DELIVERY_ZONES = {
  ZONE_A: {
    id: "ZONE_A",
    name: "Zone A - Metro Core",
    description: "Central business district, 0-10 km from hub",
    baseRate: 5.0,
    perKmRate: 0.5,
    maxDistance: 10,
    color: OCEAN_BLUE,
    sameDaySurcharge: 1.5,
    nextDayDiscount: 0.9,
  },
  ZONE_B: {
    id: "ZONE_B",
    name: "Zone B - Suburban",
    description: "Suburban areas, 10-25 km from hub",
    baseRate: 7.5,
    perKmRate: 0.6,
    maxDistance: 25,
    color: LOGISTICS_GREEN,
    sameDaySurcharge: 1.75,
    nextDayDiscount: 0.85,
  },
  ZONE_C: {
    id: "ZONE_C",
    name: "Zone C - Extended",
    description: "Extended delivery zone, 25-50 km from hub",
    baseRate: 12.0,
    perKmRate: 0.75,
    maxDistance: 50,
    color: "#F59E0B",
    sameDaySurcharge: 2.0,
    nextDayDiscount: 0.8,
  },
  ZONE_D: {
    id: "ZONE_D",
    name: "Zone D - Remote",
    description: "Remote areas, 50+ km from hub",
    baseRate: 18.0,
    perKmRate: 1.0,
    maxDistance: 100,
    color: "#EF4444",
    sameDaySurcharge: 2.5,
    nextDayDiscount: 0.75,
  },
};

// Delivery types configuration
const DELIVERY_TYPES = {
  SAME_DAY: {
    id: "SAME_DAY",
    name: "Same-Day Delivery",
    description: "Delivery within business hours today",
    icon: Zap,
    timeEstimate: "2-6 hours",
    color: OCEAN_BLUE,
    priority: 1,
  },
  NEXT_DAY: {
    id: "NEXT_DAY",
    name: "Next-Day Delivery",
    description: "Delivery by end of next business day",
    icon: Calendar,
    timeEstimate: "18-24 hours",
    color: LOGISTICS_GREEN,
    priority: 2,
  },
  STANDARD: {
    id: "STANDARD",
    name: "Standard Delivery",
    description: "Economical 3-5 business day delivery",
    icon: Truck,
    timeEstimate: "3-5 business days",
    color: "#6B7280",
    priority: 3,
  },
};

// Package size categories
const PACKAGE_SIZES = {
  SMALL: {
    id: "SMALL",
    name: "Small",
    description: "Up to 1 kg, max 30x20x10 cm",
    maxWeight: 1,
    maxDimensions: { length: 30, width: 20, height: 10 },
    weightSurcharge: 0,
    dimensionalSurcharge: 0,
    icon: "📦",
  },
  MEDIUM: {
    id: "MEDIUM",
    name: "Medium",
    description: "1-5 kg, max 50x40x30 cm",
    maxWeight: 5,
    maxDimensions: { length: 50, width: 40, height: 30 },
    weightSurcharge: 2.0,
    dimensionalSurcharge: 1.5,
    icon: "📦",
  },
  LARGE: {
    id: "LARGE",
    name: "Large",
    description: "5-15 kg, max 80x60x40 cm",
    maxWeight: 15,
    maxDimensions: { length: 80, width: 60, height: 40 },
    weightSurcharge: 5.0,
    dimensionalSurcharge: 3.0,
    icon: "📦",
  },
  EXTRA_LARGE: {
    id: "EXTRA_LARGE",
    name: "Extra Large",
    description: "15-30 kg, max 120x80x60 cm",
    maxWeight: 30,
    maxDimensions: { length: 120, width: 80, height: 60 },
    weightSurcharge: 10.0,
    dimensionalSurcharge: 6.0,
    icon: "📦",
  },
  CUSTOM: {
    id: "CUSTOM",
    name: "Custom",
    description: "Enter custom weight & dimensions",
    maxWeight: 100,
    maxDimensions: { length: 200, width: 150, height: 150 },
    weightSurcharge: 0,
    dimensionalSurcharge: 0,
    icon: "📦",
  },
};

// Vehicle types for last mile
const VEHICLE_TYPES = {
  BIKE: { name: "Bicycle/Courier", maxWeight: 10, costPerKm: 0.3, icon: "🚴" },
  SCOOTER: { name: "Electric Scooter", maxWeight: 20, costPerKm: 0.35, icon: "🛵" },
  VAN: { name: "Delivery Van", maxWeight: 500, costPerKm: 0.5, icon: "🚐" },
  TRUCK: { name: "Small Truck", maxWeight: 2000, costPerKm: 0.7, icon: "🚚" },
};

// FAQs data
const FAQs = [
  {
    question: "How is the last mile delivery cost calculated?",
    answer: "The cost is calculated based on several factors: delivery zone (distance from hub), delivery type (same-day, next-day, or standard), package weight and dimensions, and any additional services like signature confirmation or insurance. Each zone has a base rate plus a per-kilometer charge.",
  },
  {
    question: "What is the difference between volumetric and actual weight?",
    answer: "Actual weight is the physical weight of your package. Volumetric weight is calculated from the package dimensions (L x W x H / 5000). Carriers charge based on whichever is higher, as large but light packages still take up significant space in delivery vehicles.",
  },
  {
    question: "Why do remote zones cost more?",
    answer: "Remote zones (Zone D) have higher costs due to increased fuel consumption, longer driver hours, fewer delivery density, and additional logistics coordination. These areas may also have limited delivery frequency and require specialized routing.",
  },
  {
    question: "What is the cutoff time for same-day delivery?",
    answer: "Same-day delivery orders must be placed before 12:00 PM (noon) local time for same-day dispatch. Orders received after this cutoff will be processed for next business day delivery. Cutoff times may vary by zone.",
  },
  {
    question: "How can I reduce my last mile delivery costs?",
    answer: "Consider these strategies: 1) Use standard delivery for non-urgent shipments, 2) Optimize package dimensions to reduce volumetric weight, 3) Consolidate multiple items into single shipments, 4) Use next-day instead of same-day for 10-25% savings, 5) Pre-plan shipments to avoid rush charges.",
  },
  {
    question: "What additional services are available?",
    answer: "We offer Priority Handling ($3.00) for expedited processing, Signature Required ($1.50) for proof of delivery, Insurance (2% of declared value, minimum $2) for valuable items, and Fuel Surcharge (typically 5%) which fluctuates with fuel prices.",
  },
  {
    question: "How are delivery zones determined?",
    answer: "Delivery zones are based on distance from the distribution hub: Zone A (0-10 km) covers metro cores, Zone B (10-25 km) covers suburban areas, Zone C (25-50 km) covers extended regions, and Zone D (50+ km) covers remote areas. Each zone has different base rates and delivery timeframes.",
  },
  {
    question: "What vehicles are used for last mile delivery?",
    answer: "Vehicle selection depends on package weight and size: Bicycle/Courier for packages up to 10 kg, Electric Scooter for up to 20 kg, Delivery Van for up to 500 kg, and Small Truck for heavier shipments. The system automatically recommends the appropriate vehicle.",
  },
];

interface CalculationResult {
  baseCost: number;
  distanceCost: number;
  weightSurcharge: number;
  dimensionalSurcharge: number;
  deliveryTypeSurcharge: number;
  zoneSurcharge: number;
  totalCost: number;
  estimatedTime: string;
  recommendedVehicle: string;
  volumetricWeight: number;
  chargeableWeight: number;
  fuelSurcharge: number;
  distance: number;
  zone: typeof DELIVERY_ZONES[keyof typeof DELIVERY_ZONES];
  deliveryType: typeof DELIVERY_TYPES[keyof typeof DELIVERY_TYPES];
}

// Floating particles component
function FloatingParticles() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const particles = [...Array(15)].map((_, i) => ({
    id: i,
    x: ((i * 73) % 100),
    y: ((i * 47 + 25) % 100),
    duration: 10 + (i % 10),
    delay: (i % 5) * 0.5,
  }));

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.id % 2 === 0 ? OCEAN_BLUE : LOGISTICS_GREEN,
          }}
          animate={{
            y: [0, -500],
            opacity: [0.2, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

export function LastMileCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");

  // Input states
  const [deliveryZone, setDeliveryZone] = useState<keyof typeof DELIVERY_ZONES>("ZONE_A");
  const [deliveryType, setDeliveryType] = useState<keyof typeof DELIVERY_TYPES>("STANDARD");
  const [packageSize, setPackageSize] = useState<keyof typeof PACKAGE_SIZES>("SMALL");
  const [distance, setDistance] = useState<string>("5");
  const [weight, setWeight] = useState<string>("0.5");
  const [length, setLength] = useState<string>("20");
  const [width, setWidth] = useState<string>("15");
  const [height, setHeight] = useState<string>("10");

  // Advanced options
  const [includeFuelSurcharge, setIncludeFuelSurcharge] = useState(true);
  const [fuelSurchargePercent, setFuelSurchargePercent] = useState<string>("5");
  const [priorityHandling, setPriorityHandling] = useState(false);
  const [signatureRequired, setSignatureRequired] = useState(false);
  const [insuranceRequired, setInsuranceRequired] = useState(false);
  const [insuranceValue, setInsuranceValue] = useState<string>("100");

  // Determine recommended vehicle based on weight
  const pkgWeight = parseFloat(weight) || 0;
  let recommendedVehicle = { key: "TRUCK", ...VEHICLE_TYPES.TRUCK };
  for (const [key, vehicle] of Object.entries(VEHICLE_TYPES)) {
    if (pkgWeight <= vehicle.maxWeight) {
      recommendedVehicle = { key, ...vehicle };
      break;
    }
  }

  // Calculate volumetric weight
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const volumetricWeight = (l * w * h) / 5000;

  // Calculate chargeable weight
  const actualWeight = parseFloat(weight) || 0;
  const chargeableWeight = Math.max(actualWeight, volumetricWeight);

  // Main calculation
  const zone = DELIVERY_ZONES[deliveryZone];
  const type = DELIVERY_TYPES[deliveryType];
  const pkgSize = PACKAGE_SIZES[packageSize];

  const distanceNum = parseFloat(distance) || 0;

  // Base cost from zone
  const baseCost = zone.baseRate;

  // Distance cost
  const distanceCost = distanceNum * zone.perKmRate;

  // Weight surcharge
  let weightSurcharge = pkgSize.weightSurcharge;
  if (packageSize === "CUSTOM") {
    weightSurcharge = Math.max(0, (chargeableWeight - 1) * 0.5);
  }

  // Dimensional surcharge
  let dimensionalSurcharge = pkgSize.dimensionalSurcharge;
  if (packageSize === "CUSTOM") {
    if (volumetricWeight > 10) {
      dimensionalSurcharge = (volumetricWeight - 10) * 0.3;
    }
  }

  // Delivery type modifier
  let deliveryTypeSurcharge = 0;
  if (deliveryType === "SAME_DAY") {
    deliveryTypeSurcharge = baseCost * (zone.sameDaySurcharge - 1);
  } else if (deliveryType === "NEXT_DAY") {
    deliveryTypeSurcharge = -(baseCost * (1 - zone.nextDayDiscount));
  }

  // Zone surcharge for remote areas
  const zoneSurcharge = deliveryZone === "ZONE_D" ? 5.0 : deliveryZone === "ZONE_C" ? 2.5 : 0;

  // Calculate subtotal before surcharges
  const subtotal = baseCost + distanceCost + weightSurcharge + dimensionalSurcharge + deliveryTypeSurcharge + zoneSurcharge;

  // Fuel surcharge
  const fuelSurcharge = includeFuelSurcharge ? subtotal * (parseFloat(fuelSurchargePercent) / 100) : 0;

  // Additional services
  let additionalServices = 0;
  if (priorityHandling) additionalServices += 3.0;
  if (signatureRequired) additionalServices += 1.5;
  if (insuranceRequired) {
    const insValue = parseFloat(insuranceValue) || 0;
    additionalServices += Math.max(2.0, insValue * 0.02);
  }

  const totalCost = Math.max(3.0, subtotal + fuelSurcharge + additionalServices);

  // Time estimate based on delivery type and zone
  let estimatedTime = type.timeEstimate;
  if (deliveryType === "SAME_DAY") {
    if (deliveryZone === "ZONE_A") estimatedTime = "1-3 hours";
    else if (deliveryZone === "ZONE_B") estimatedTime = "2-4 hours";
    else if (deliveryZone === "ZONE_C") estimatedTime = "3-6 hours";
    else estimatedTime = "4-8 hours";
  } else if (deliveryType === "NEXT_DAY") {
    estimatedTime = "Next business day";
  }

  const calculation: CalculationResult = {
    baseCost,
    distanceCost,
    weightSurcharge,
    dimensionalSurcharge,
    deliveryTypeSurcharge,
    zoneSurcharge,
    totalCost,
    estimatedTime,
    recommendedVehicle: recommendedVehicle.name,
    volumetricWeight,
    chargeableWeight,
    fuelSurcharge,
    distance: distanceNum,
    zone,
    deliveryType: type,
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Compare delivery types
  const deliveryTypeComparison = Object.entries(DELIVERY_TYPES).map(([key, typeData]) => {
    let cost = baseCost + distanceCost;
    if (key === "SAME_DAY") {
      cost = cost * zone.sameDaySurcharge;
    } else if (key === "NEXT_DAY") {
      cost = cost * zone.nextDayDiscount;
    }
    cost += weightSurcharge + dimensionalSurcharge + zoneSurcharge;
    if (includeFuelSurcharge) {
      cost += cost * (parseFloat(fuelSurchargePercent) / 100);
    }
    return {
      key,
      ...typeData,
      cost: Math.max(3.0, cost),
    };
  });

  // Cost breakdown for visualization
  const costBreakdownData = [
    { name: "Base Rate", value: calculation.baseCost, color: OCEAN_BLUE },
    { name: "Distance", value: calculation.distanceCost, color: LOGISTICS_GREEN },
    { name: "Weight", value: calculation.weightSurcharge, color: "#F59E0B" },
    { name: "Dimensions", value: calculation.dimensionalSurcharge, color: "#8B5CF6" },
    { name: "Delivery Type", value: Math.abs(calculation.deliveryTypeSurcharge), color: "#EC4899" },
    { name: "Zone Surcharge", value: calculation.zoneSurcharge, color: "#EF4444" },
    { name: "Fuel", value: calculation.fuelSurcharge, color: "#6B7280" },
  ].filter(item => item.value > 0);

  // Zone comparison data
  const zoneComparisonData = Object.entries(DELIVERY_ZONES).map(([key, zoneData]) => {
    let cost = zoneData.baseRate + distanceNum * zoneData.perKmRate;
    if (deliveryType === "SAME_DAY") {
      cost = cost * zoneData.sameDaySurcharge;
    } else if (deliveryType === "NEXT_DAY") {
      cost = cost * zoneData.nextDayDiscount;
    }
    cost += weightSurcharge + dimensionalSurcharge;
    if (includeFuelSurcharge) {
      cost += cost * (parseFloat(fuelSurchargePercent) / 100);
    }
    return {
      key,
      name: zoneData.name.split(" - ")[1],
      cost: Math.max(3.0, cost),
      color: zoneData.color,
    };
  });

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-t-xl">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${OCEAN_BLUE}15 0%, ${LOGISTICS_GREEN}10 50%, ${OCEAN_BLUE}10 100%)`,
            }}
          />
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${OCEAN_BLUE}20` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: `${LOGISTICS_GREEN}20` }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `linear-gradient(${OCEAN_BLUE}10 1px, transparent 1px), linear-gradient(90deg, ${OCEAN_BLUE}10 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        <FloatingParticles />

        {/* Content */}
        <div className="relative z-10 px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Badge 
                className="px-4 py-1.5 text-sm font-medium border"
                style={{ 
                  backgroundColor: `${OCEAN_BLUE}10`,
                  borderColor: `${OCEAN_BLUE}30`,
                  color: OCEAN_BLUE,
                }}
              >
                <Navigation className="h-3.5 w-3.5 mr-1.5" />
                Last Mile Delivery Calculator
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span style={{ color: OCEAN_BLUE }}>Calculate</span> Your
              <br />
              <span style={{ color: LOGISTICS_GREEN }}>Last Mile</span> Delivery Costs
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Get instant, accurate delivery cost estimates based on zones, package details, 
              and delivery speed. Optimize your logistics budget with real-time calculations.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 md:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: MapPin, label: "4 Zones", value: "Coverage" },
                { icon: Zap, label: "Same-Day", value: "Available" },
                { icon: Calculator, label: "Instant", value: "Quotes" },
                { icon: Shield, label: "Insurance", value: "Options" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <stat.icon className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                  <span className="font-medium text-sm">{stat.label}</span>
                  <span className="text-muted-foreground text-sm">{stat.value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{
          background: `linear-gradient(90deg, transparent, ${OCEAN_BLUE}50, ${LOGISTICS_GREEN}50, transparent)`,
        }} />
      </section>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="calculator" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Calculator className="h-4 w-4" />
              <span>Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <PieChart className="h-4 w-4" />
              <span>Compare</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="zones" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <MapPin className="h-4 w-4" />
              <span>Zones</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <HelpCircle className="h-4 w-4" />
              <span>FAQs</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 p-6 mt-0">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Inputs */}
            <div className="space-y-6">
              {/* Delivery Zone & Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Delivery Zone & Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Delivery Zone</Label>
                    <Select value={deliveryZone} onValueChange={(v) => setDeliveryZone(v as keyof typeof DELIVERY_ZONES)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DELIVERY_ZONES).map(([key, zoneData]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zoneData.color }} />
                              <span>{zoneData.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {DELIVERY_ZONES[deliveryZone].description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Type</Label>
                    <RadioGroup
                      value={deliveryType}
                      onValueChange={(v) => setDeliveryType(v as keyof typeof DELIVERY_TYPES)}
                      className="grid grid-cols-3 gap-2"
                    >
                      {Object.entries(DELIVERY_TYPES).map(([key, typeData]) => {
                        const Icon = typeData.icon;
                        return (
                          <div key={key} className="relative">
                            <RadioGroupItem
                              value={key}
                              id={key}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={key}
                              className="flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all peer-data-[state=checked]:border-[var(--ocean)] peer-data-[state=checked]:bg-[var(--ocean)]/5 hover:bg-muted/50"
                            >
                              <Icon className="h-5 w-5 mb-1" style={{ color: typeData.color }} />
                              <span className="text-xs font-medium text-center">{typeData.name.split(" ")[0]}</span>
                            </label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock3 className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                      <span className="text-muted-foreground">Estimated delivery:</span>
                      <span className="font-medium">{calculation.estimatedTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Distance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Route className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Distance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance from Hub (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      step="0.1"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      {[5, 10, 20, 30, 50].map((d) => (
                        <Button
                          key={d}
                          variant="outline"
                          size="sm"
                          onClick={() => setDistance(String(d))}
                          className="flex-1"
                        >
                          {d} km
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Package Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Package Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Package Size</Label>
                    <Select value={packageSize} onValueChange={(v) => setPackageSize(v as keyof typeof PACKAGE_SIZES)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PACKAGE_SIZES).map(([key, size]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span>{size.icon}</span>
                              <span>{size.name}</span>
                              <span className="text-muted-foreground text-xs">
                                ({size.description})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {packageSize === "CUSTOM" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Recommended Vehicle</Label>
                          <div className="p-2 bg-muted/50 rounded-lg text-sm">
                            <span className="mr-2">{recommendedVehicle.icon}</span>
                            {recommendedVehicle.name}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Dimensions (cm)</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            type="number"
                            placeholder="L"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="W"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="H"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Volumetric Weight</p>
                          <p className="font-medium">{volumetricWeight.toFixed(2)} kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Chargeable Weight</p>
                          <p className="font-medium" style={{ color: OCEAN_BLUE }}>{chargeableWeight.toFixed(2)} kg</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {packageSize !== "CUSTOM" && (
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                      <p className="text-muted-foreground">{PACKAGE_SIZES[packageSize].description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Additional Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPriorityHandling(!priorityHandling)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        priorityHandling
                          ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <Zap className={`h-4 w-4 mb-1 ${priorityHandling ? "text-[var(--ocean)]" : "text-muted-foreground"}`} />
                      <p className="text-sm font-medium">Priority Handling</p>
                      <p className="text-xs text-muted-foreground">+$3.00</p>
                    </button>

                    <button
                      onClick={() => setSignatureRequired(!signatureRequired)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        signatureRequired
                          ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <CheckCircle2 className={`h-4 w-4 mb-1 ${signatureRequired ? "text-[var(--ocean)]" : "text-muted-foreground"}`} />
                      <p className="text-sm font-medium">Signature Required</p>
                      <p className="text-xs text-muted-foreground">+$1.50</p>
                    </button>

                    <button
                      onClick={() => setInsuranceRequired(!insuranceRequired)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        insuranceRequired
                          ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <Info className={`h-4 w-4 mb-1 ${insuranceRequired ? "text-[var(--ocean)]" : "text-muted-foreground"}`} />
                      <p className="text-sm font-medium">Insurance</p>
                      <p className="text-xs text-muted-foreground">2% of value (min $2)</p>
                    </button>

                    <button
                      onClick={() => setIncludeFuelSurcharge(!includeFuelSurcharge)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        includeFuelSurcharge
                          ? "border-[var(--logistics)] bg-[var(--logistics)]/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <Truck className={`h-4 w-4 mb-1 ${includeFuelSurcharge ? "text-[var(--logistics)]" : "text-muted-foreground"}`} />
                      <p className="text-sm font-medium">Fuel Surcharge</p>
                      <p className="text-xs text-muted-foreground">{fuelSurchargePercent}% of base</p>
                    </button>
                  </div>

                  <AnimatePresence>
                    {insuranceRequired && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="insuranceValue">Declared Value ($)</Label>
                        <Input
                          id="insuranceValue"
                          type="number"
                          value={insuranceValue}
                          onChange={(e) => setInsuranceValue(e.target.value)}
                          placeholder="100"
                        />
                      </motion.div>
                    )}

                    {includeFuelSurcharge && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="fuelPercent">Fuel Surcharge (%)</Label>
                        <Input
                          id="fuelPercent"
                          type="number"
                          step="0.5"
                          value={fuelSurchargePercent}
                          onChange={(e) => setFuelSurchargePercent(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {/* Main Result */}
              <Card style={{ borderColor: `${OCEAN_BLUE}30` }}>
                <div className="h-2 rounded-t-lg" style={{
                  background: `linear-gradient(90deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})`,
                }} />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Delivery Cost Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-4">
                    <motion.div
                      key={calculation.totalCost}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-bold"
                      style={{ color: OCEAN_BLUE }}
                    >
                      {formatCurrency(calculation.totalCost)}
                    </motion.div>
                    <p className="text-muted-foreground mt-2">
                      Estimated delivery cost
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Badge className="gradient-logistics text-white">
                        {calculation.zone.name}
                      </Badge>
                      <Badge variant="outline">
                        {calculation.deliveryType.name}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Cost Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">Cost Breakdown</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Rate ({calculation.zone.name.split(" - ")[0]})</span>
                        <span>{formatCurrency(calculation.baseCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance ({calculation.distance} km)</span>
                        <span>{formatCurrency(calculation.distanceCost)}</span>
                      </div>
                      {calculation.weightSurcharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight Surcharge</span>
                          <span>{formatCurrency(calculation.weightSurcharge)}</span>
                        </div>
                      )}
                      {calculation.dimensionalSurcharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimensional Surcharge</span>
                          <span>{formatCurrency(calculation.dimensionalSurcharge)}</span>
                        </div>
                      )}
                      {calculation.zoneSurcharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remote Area Surcharge</span>
                          <span>{formatCurrency(calculation.zoneSurcharge)}</span>
                        </div>
                      )}
                      {calculation.deliveryTypeSurcharge !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {deliveryType === "SAME_DAY" ? "Same-Day Premium" : "Next-Day Discount"}
                          </span>
                          <span className={calculation.deliveryTypeSurcharge < 0 ? "text-[var(--logistics)]" : ""}>
                            {calculation.deliveryTypeSurcharge < 0 ? "-" : "+"}
                            {formatCurrency(Math.abs(calculation.deliveryTypeSurcharge))}
                          </span>
                        </div>
                      )}
                      {calculation.fuelSurcharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fuel Surcharge ({fuelSurchargePercent}%)</span>
                          <span>{formatCurrency(calculation.fuelSurcharge)}</span>
                        </div>
                      )}
                      {priorityHandling && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Priority Handling</span>
                          <span>$3.00</span>
                        </div>
                      )}
                      {signatureRequired && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Signature Required</span>
                          <span>$1.50</span>
                        </div>
                      )}
                      {insuranceRequired && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Insurance</span>
                          <span>{formatCurrency(Math.max(2.0, (parseFloat(insuranceValue) || 0) * 0.02))}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Timer className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${OCEAN_BLUE}10` }}>
                      <Clock className="h-5 w-5 mx-auto mb-1" style={{ color: OCEAN_BLUE }} />
                      <p className="text-xs text-muted-foreground">Estimated Time</p>
                      <p className="font-bold" style={{ color: OCEAN_BLUE }}>{calculation.estimatedTime}</p>
                    </div>
                    <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${LOGISTICS_GREEN}10` }}>
                      <Truck className="h-5 w-5 mx-auto mb-1" style={{ color: LOGISTICS_GREEN }} />
                      <p className="text-xs text-muted-foreground">Vehicle Type</p>
                      <p className="font-bold" style={{ color: LOGISTICS_GREEN }}>{calculation.recommendedVehicle}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                      <span className="text-muted-foreground">Zone:</span>
                      <span className="font-medium">{calculation.zone.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      {calculation.zone.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card style={{ borderColor: `${LOGISTICS_GREEN}30`, backgroundColor: `${LOGISTICS_GREEN}05` }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                    <Sparkles className="h-4 w-4" />
                    Savings Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                      <span>Choose Next-Day for 10-25% savings vs Same-Day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                      <span>Standard delivery offers best value for non-urgent items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                      <span>Optimize package dimensions to reduce volumetric weight charges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                      <span>Consolidate multiple items into single shipment when possible</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 p-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Delivery Type Comparison
              </CardTitle>
              <CardDescription>
                Compare costs across different delivery speeds for your shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {deliveryTypeComparison.map((typeData) => {
                  const Icon = typeData.icon;
                  const isSelected = typeData.key === deliveryType;
                  return (
                    <motion.div
                      key={typeData.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${typeData.color}20` }}>
                            <Icon className="h-5 w-5" style={{ color: typeData.color }} />
                          </div>
                          <span className="font-medium">{typeData.name}</span>
                        </div>
                        {isSelected && (
                          <Badge className="gradient-ocean text-white">Selected</Badge>
                        )}
                      </div>

                      <div className="text-center py-4">
                        <p className="text-3xl font-bold" style={{ color: typeData.color }}>
                          {formatCurrency(typeData.cost)}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-muted-foreground" />
                          <span>{typeData.timeEstimate}</span>
                        </div>
                        <p className="text-muted-foreground">{typeData.description}</p>
                      </div>

                      <Button
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full mt-4 ${isSelected ? "gradient-ocean text-white" : ""}`}
                        onClick={() => setDeliveryType(typeData.key as keyof typeof DELIVERY_TYPES)}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              {deliveryType === "SAME_DAY" && (
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-700 dark:text-amber-300">
                        Same-Day Delivery Notice
                      </p>
                      <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                        Same-day delivery orders must be placed before 12:00 PM for same-day dispatch.
                        Orders received after cutoff will be delivered the next business day.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 p-6 mt-0">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Cost Distribution
                </CardTitle>
                <CardDescription>
                  Visual breakdown of your delivery cost components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costBreakdownData.map((item, index) => {
                    const maxValue = Math.max(...costBreakdownData.map(d => d.value));
                    const percentage = maxValue > 0 ? (item.value / calculation.totalCost) * 100 : 0;
                    const widthPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span>{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatCurrency(item.value)}</span>
                            <span className="text-muted-foreground">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPercentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Cost</span>
                    <span className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>
                      {formatCurrency(calculation.totalCost)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Zone Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Zone Cost Comparison
                </CardTitle>
                <CardDescription>
                  Compare delivery costs across all zones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zoneComparisonData.map((zoneData, index) => {
                    const maxCost = Math.max(...zoneComparisonData.map(z => z.cost));
                    const isSelected = zoneData.key === deliveryZone;
                    const widthPercentage = maxCost > 0 ? (zoneData.cost / maxCost) * 100 : 0;
                    
                    return (
                      <motion.div
                        key={zoneData.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected ? "border-[var(--ocean)] bg-[var(--ocean)]/5" : "border-transparent bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zoneData.color }} />
                            <span className="font-medium text-sm">{zoneData.name}</span>
                          </div>
                          <span className="font-bold" style={{ color: zoneData.color }}>
                            {formatCurrency(zoneData.cost)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: zoneData.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPercentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Savings Indicator */}
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${LOGISTICS_GREEN}10` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-medium text-sm" style={{ color: LOGISTICS_GREEN }}>Potential Savings</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {deliveryType === "SAME_DAY" ? (
                      <>Switching to <strong>Next-Day</strong> could save you {formatCurrency(calculation.totalCost - deliveryTypeComparison.find(t => t.key === "NEXT_DAY")!.cost)}</>
                    ) : deliveryType === "NEXT_DAY" ? (
                      <>Switching to <strong>Standard</strong> could save you {formatCurrency(calculation.totalCost - deliveryTypeComparison.find(t => t.key === "STANDARD")!.cost)}</>
                    ) : (
                      <>You&apos;re already using the most economical option</>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Delivery Performance Metrics
                </CardTitle>
                <CardDescription>
                  Key metrics for your selected delivery configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                      <Clock className="h-6 w-6" style={{ color: OCEAN_BLUE }} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Delivery Speed</p>
                    <p className="text-lg font-bold" style={{ color: OCEAN_BLUE }}>{calculation.estimatedTime}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${LOGISTICS_GREEN}15` }}>
                      <Route className="h-6 w-6" style={{ color: LOGISTICS_GREEN }} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Total Distance</p>
                    <p className="text-lg font-bold" style={{ color: LOGISTICS_GREEN }}>{distanceNum} km</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                      <Weight className="h-6 w-6" style={{ color: OCEAN_BLUE }} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Chargeable Weight</p>
                    <p className="text-lg font-bold" style={{ color: OCEAN_BLUE }}>{chargeableWeight.toFixed(2)} kg</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${LOGISTICS_GREEN}15` }}>
                      <DollarSign className="h-6 w-6" style={{ color: LOGISTICS_GREEN }} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Cost per km</p>
                    <p className="text-lg font-bold" style={{ color: LOGISTICS_GREEN }}>
                      {distanceNum > 0 ? formatCurrency(calculation.totalCost / distanceNum) : '$0.00'}
                    </p>
                  </div>
                </div>

                {/* Cost Efficiency Score */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cost Efficiency Score</span>
                    <span className="text-sm font-bold" style={{ color: LOGISTICS_GREEN }}>
                      {deliveryType === "STANDARD" ? "Excellent" : deliveryType === "NEXT_DAY" ? "Good" : "Premium"}
                    </span>
                  </div>
                  <Progress 
                    value={deliveryType === "STANDARD" ? 95 : deliveryType === "NEXT_DAY" ? 75 : 50} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {deliveryType === "STANDARD" 
                      ? "You're getting the best value for your delivery"
                      : deliveryType === "NEXT_DAY"
                      ? "Good balance between speed and cost"
                      : "Premium service for urgent deliveries"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Zone Map Tab */}
        <TabsContent value="zones" className="space-y-6 p-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Delivery Zone Information
              </CardTitle>
              <CardDescription>
                Understanding delivery zones and their pricing structures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(DELIVERY_ZONES).map(([key, zoneData]) => {
                  const isSelected = key === deliveryZone;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                      onClick={() => setDeliveryZone(key as keyof typeof DELIVERY_ZONES)}
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                          style={{ backgroundColor: zoneData.color }}
                        >
                          {key.split("_")[1]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{zoneData.name}</h4>
                            {isSelected && (
                              <Badge className="gradient-ocean text-white text-xs">Selected</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{zoneData.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Base Rate:</span>
                              <span className="font-medium ml-1">{formatCurrency(zoneData.baseRate)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Per km:</span>
                              <span className="font-medium ml-1">{formatCurrency(zoneData.perKmRate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Visual Zone Map */}
              <div className="mt-8 p-6 rounded-xl bg-muted/30 border">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Navigation className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                  Zone Distance Visualization
                </h4>
                <div className="relative h-16 rounded-lg overflow-hidden bg-muted">
                  <div className="absolute inset-0 flex">
                    {Object.entries(DELIVERY_ZONES).map(([key, zoneData], index, arr) => {
                      const width = index === 0 ? "25%" : index === 1 ? "25%" : index === 2 ? "25%" : "25%";
                      return (
                        <div
                          key={key}
                          className="relative flex items-center justify-center text-white text-xs font-medium"
                          style={{ 
                            width, 
                            backgroundColor: zoneData.color,
                            opacity: key === deliveryZone ? 1 : 0.6,
                          }}
                        >
                          <span className="hidden sm:inline">{zoneData.name.split(" - ")[1]}</span>
                          <span className="sm:hidden">{key.split("_")[1]}</span>
                          {index < arr.length - 1 && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-full bg-white/20" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Distance marker */}
                  <div 
                    className="absolute top-full mt-2 w-1 h-4 rounded-full"
                    style={{ 
                      left: `${Math.min(100, Math.max(0, (distanceNum / 100) * 100))}%`,
                      backgroundColor: OCEAN_BLUE,
                    }}
                  >
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                      {distanceNum} km
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 p-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Get answers to common questions about last mile delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {FAQs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border rounded-lg px-4 data-[state=open]:border-[var(--ocean)] data-[state=open]:bg-[var(--ocean)]/5"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${OCEAN_BLUE}15` }}
                        >
                          <HelpCircle className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11 pb-4 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Help */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4" style={{ borderColor: `${OCEAN_BLUE}30` }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                  <Calculator className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Need Help Calculating?</h4>
                  <p className="text-sm text-muted-foreground">
                    Use our calculator tab to get instant cost estimates for your delivery.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4" style={{ borderColor: `${LOGISTICS_GREEN}30` }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${LOGISTICS_GREEN}15` }}>
                  <MapPin className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Not Sure About Your Zone?</h4>
                  <p className="text-sm text-muted-foreground">
                    Check the Zones tab to understand delivery areas and pricing.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4" style={{ borderColor: `${OCEAN_BLUE}30` }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                  <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Want to Save?</h4>
                  <p className="text-sm text-muted-foreground">
                    Visit the Analytics tab to compare costs and find savings opportunities.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
