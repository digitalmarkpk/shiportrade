"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Container,
  Package,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Info,
  Calculator,
  Download,
  Printer,
  Shield,
  Anchor,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  BookOpen,
  HelpCircle,
  Zap,
  Building2,
  Globe,
  CheckCircle,
  XCircle,
  ArrowRight,
  AlertCircle,
  Layers,
  Weight,
  Ship,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
  ComposedChart,
} from "recharts";

interface VGMResult {
  containerTare: number;
  cargoWeight: number;
  dunnageWeight: number;
  totalVGM: number;
  maxPayload: number;
  maxGross: number;
  isWithinLimit: boolean;
  utilizationPercent: number;
  exceededBy: number;
  remainingCapacity: number;
}

// Container specifications (weights in kg)
const containerSpecs: Record<string, { name: string; tare: number; maxPayload: number; maxGross: number; category: string }> = {
  "20GP": { name: "20' General Purpose", tare: 2300, maxPayload: 21700, maxGross: 24000, category: "Dry" },
  "40GP": { name: "40' General Purpose", tare: 3800, maxPayload: 26200, maxGross: 30000, category: "Dry" },
  "40HC": { name: "40' High Cube", tare: 3900, maxPayload: 26100, maxGross: 30000, category: "Dry" },
  "45HC": { name: "45' High Cube", tare: 4500, maxPayload: 25500, maxGross: 30000, category: "Dry" },
  "20RF": { name: "20' Refrigerated", tare: 3080, maxPayload: 23920, maxGross: 27000, category: "Reefer" },
  "40RF": { name: "40' Refrigerated", tare: 4500, maxPayload: 27500, maxGross: 32000, category: "Reefer" },
  "40HCRF": { name: "40' High Cube Reefer", tare: 4400, maxPayload: 27600, maxGross: 32000, category: "Reefer" },
  "20OT": { name: "20' Open Top", tare: 2400, maxPayload: 26600, maxGross: 29000, category: "Special" },
  "40OT": { name: "40' Open Top", tare: 4100, maxPayload: 26900, maxGross: 31000, category: "Special" },
  "20FR": { name: "20' Flat Rack", tare: 2900, maxPayload: 31100, maxGross: 34000, category: "Special" },
  "40FR": { name: "40' Flat Rack", tare: 5500, maxPayload: 39500, maxGross: 45000, category: "Special" },
  "20TK": { name: "20' Tank", tare: 3600, maxPayload: 23400, maxGross: 27000, category: "Tank" },
  "40TK": { name: "40' Tank", tare: 4900, maxPayload: 31100, maxGross: 36000, category: "Tank" },
  "20PL": { name: "20' Platform", tare: 2700, maxPayload: 31300, maxGross: 34000, category: "Special" },
  "40PL": { name: "40' Platform", tare: 5400, maxPayload: 39600, maxGross: 45000, category: "Special" },
};

const weighingMethods = [
  { 
    id: "method1", 
    name: "Method 1: Weigh Entire Container", 
    description: "Weigh the packed container at a certified weighbridge or using calibrated weighing equipment",
    icon: Scale,
    accuracy: "± 1%",
    recommended: "High accuracy, single measurement"
  },
  { 
    id: "method2", 
    name: "Method 2: Weigh All Contents", 
    description: "Weigh all cargo, packaging, and dunnage separately, then add to container tare weight",
    icon: Package,
    accuracy: "± 2%",
    recommended: "When weighbridge not available"
  },
];

// Sample port data for VGM deadlines
const portDeadlines = [
  { port: "Los Angeles", region: "US West Coast", deadline: "24 hours", cutoff: "VGM must be submitted 24h before vessel arrival" },
  { port: "Long Beach", region: "US West Coast", deadline: "24 hours", cutoff: "VGM must be submitted 24h before vessel arrival" },
  { port: "New York", region: "US East Coast", deadline: "48 hours", cutoff: "VGM must be submitted 48h before vessel arrival" },
  { port: "Rotterdam", region: "Europe", deadline: "24 hours", cutoff: "VGM cutoff 24h before loading" },
  { port: "Antwerp", region: "Europe", deadline: "24 hours", cutoff: "VGM cutoff 24h before loading" },
  { port: "Hamburg", region: "Europe", deadline: "24 hours", cutoff: "VGM cutoff 24h before loading" },
  { port: "Singapore", region: "Asia", deadline: "12 hours", cutoff: "VGM cutoff 12-24h before loading" },
  { port: "Hong Kong", region: "Asia", deadline: "12 hours", cutoff: "VGM cutoff 12h before loading" },
  { port: "Shanghai", region: "Asia", deadline: "24 hours", cutoff: "VGM cutoff 24h before loading" },
  { port: "Dubai", region: "Middle East", deadline: "24 hours", cutoff: "VGM cutoff 24h before vessel arrival" },
];

// Carrier VGM submission methods
const carrierMethods = [
  { carrier: "Maersk", method: "Website Portal / EDI", fee: "Free", notes: "Preferred: INTTRA or website" },
  { carrier: "MSC", method: "Website Portal / E-mail", fee: "Free", notes: "Accepts Excel template" },
  { carrier: "CMA CGM", method: "Website Portal / EDI", fee: "Free", notes: "INTTRA supported" },
  { carrier: "COSCO", method: "Website Portal", fee: "Free", notes: "24h before cutoff" },
  { carrier: "Hapag-Lloyd", method: "Website Portal / INTTRA", fee: "Free", notes: "Real-time confirmation" },
  { carrier: "ONE", method: "Website Portal / EDI", fee: "Free", notes: "INTTRA supported" },
  { carrier: "Evergreen", method: "Website Portal / E-mail", fee: "Free", notes: "PDF declaration accepted" },
  { carrier: "Yang Ming", method: "Website Portal", fee: "Free", notes: "EDI preferred" },
];

const COLORS = ['#0F4C81', '#2E8B57', '#F59E0B', '#EF4444', '#8B5CF6'];

export function VGMCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [containerNumber, setContainerNumber] = useState<string>("");
  const [containerType, setContainerType] = useState<string>("40HC");
  const [weighingMethod, setWeighingMethod] = useState<string>("method2");
  const [cargoWeight, setCargoWeight] = useState<string>("");
  const [dunnageWeight, setDunnageWeight] = useState<string>("100");
  const [customTare, setCustomTare] = useState<string>("");
  const [weighbridgeWeight, setWeighbridgeWeight] = useState<string>("");
  const [responsibleParty, setResponsibleParty] = useState<string>("");
  const [signatureDate, setSignatureDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookingNumber, setBookingNumber] = useState<string>("");

  const selectedContainer = containerSpecs[containerType];

  const calculation = useMemo<VGMResult>(() => {
    const tare = customTare ? parseFloat(customTare) : selectedContainer.tare;
    const cargo = parseFloat(cargoWeight) || 0;
    const dunnage = parseFloat(dunnageWeight) || 0;
    
    let totalVGM = 0;
    if (weighingMethod === "method1") {
      totalVGM = parseFloat(weighbridgeWeight) || 0;
    } else {
      totalVGM = tare + cargo + dunnage;
    }

    const isWithinLimit = totalVGM <= selectedContainer.maxGross;
    const exceededBy = isWithinLimit ? 0 : totalVGM - selectedContainer.maxGross;
    const utilizationPercent = (totalVGM / selectedContainer.maxGross) * 100;
    const remainingCapacity = isWithinLimit ? selectedContainer.maxGross - totalVGM : 0;

    return {
      containerTare: tare,
      cargoWeight: cargo,
      dunnageWeight: dunnage,
      totalVGM,
      maxPayload: selectedContainer.maxPayload,
      maxGross: selectedContainer.maxGross,
      isWithinLimit,
      utilizationPercent,
      exceededBy,
      remainingCapacity,
    };
  }, [containerType, weighingMethod, cargoWeight, dunnageWeight, customTare, weighbridgeWeight, selectedContainer]);

  const validateContainerNumber = (number: string): boolean => {
    const regex = /^[A-Z]{4}[0-9]{7}$/;
    return regex.test(number.toUpperCase());
  };

  const formatWeight = (weight: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(weight) + " kg";
  };

  // Weight composition data for pie chart
  const weightCompositionData = useMemo(() => {
    if (weighingMethod === "method1") {
      return [
        { name: "Total VGM", value: calculation.totalVGM, color: COLORS[0] }
      ];
    }
    return [
      { name: "Container Tare", value: calculation.containerTare, color: COLORS[0] },
      { name: "Cargo Weight", value: calculation.cargoWeight, color: COLORS[1] },
      { name: "Dunnage/Packaging", value: calculation.dunnageWeight, color: COLORS[2] }
    ];
  }, [calculation, weighingMethod]);

  // Container comparison data
  const containerComparisonData = useMemo(() => {
    return Object.entries(containerSpecs)
      .filter(([key]) => key.includes(containerType.substring(0, 2)))
      .map(([key, spec]) => ({
        name: key,
        tare: spec.tare,
        payload: spec.maxPayload,
        maxGross: spec.maxGross,
        current: key === containerType ? calculation.totalVGM : 0
      }));
  }, [containerType, calculation.totalVGM]);

  // Historical tracking data (simulated)
  const historicalData = [
    { month: "Jan", containers: 45, avgUtilization: 82, violations: 2 },
    { month: "Feb", containers: 52, avgUtilization: 85, violations: 1 },
    { month: "Mar", containers: 48, avgUtilization: 79, violations: 0 },
    { month: "Apr", containers: 61, avgUtilization: 88, violations: 3 },
    { month: "May", containers: 55, avgUtilization: 84, violations: 1 },
    { month: "Jun", containers: 58, avgUtilization: 86, violations: 2 },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#0a3658] p-8 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#2E8B57]/20"
            animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Maritime Safety
              </Badge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-[#2E8B57]/80 hover:bg-[#2E8B57] text-white border-[#2E8B57] px-4 py-1.5 text-sm">
                <Anchor className="h-4 w-4 mr-2" />
                SOLAS Compliance
              </Badge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-amber-500/80 hover:bg-amber-500 text-white border-amber-500 px-4 py-1.5 text-sm">
                <Globe className="h-4 w-4 mr-2" />
                IMO Regulation
              </Badge>
            </motion.div>
          </div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            VGM Calculator
          </motion.h1>
          
          <motion.p
            className="text-xl text-white/80 max-w-3xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Verified Gross Mass calculation tool for SOLAS Chapter VI compliance. 
            Calculate and certify container weights before vessel loading.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-6 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70">Real-time calculation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-white/70">15 container types</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-white/70" />
              <span className="text-white/70">PDF Certificate export</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Methods</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
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

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Container className="h-5 w-5 text-[var(--logistics)]" />
                    Container Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="containerNumber">Container Number</Label>
                      <Input
                        id="containerNumber"
                        value={containerNumber}
                        onChange={(e) => setContainerNumber(e.target.value.toUpperCase())}
                        placeholder="e.g., MSCU1234567"
                        className={`font-mono ${containerNumber && !validateContainerNumber(containerNumber) ? "border-red-500" : ""}`}
                      />
                      {containerNumber && !validateContainerNumber(containerNumber) && (
                        <p className="text-xs text-red-500">Format: 4 letters + 7 digits</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bookingNumber">Booking Number</Label>
                      <Input
                        id="bookingNumber"
                        value={bookingNumber}
                        onChange={(e) => setBookingNumber(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Container Type</Label>
                    <Select value={containerType} onValueChange={setContainerType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dry" disabled className="font-semibold text-muted-foreground">
                          Dry Containers
                        </SelectItem>
                        {Object.entries(containerSpecs)
                          .filter(([, spec]) => spec.category === "Dry")
                          .map(([code, spec]) => (
                            <SelectItem key={code} value={code}>
                              {code} - {spec.name}
                            </SelectItem>
                          ))}
                        <SelectItem value="reefer" disabled className="font-semibold text-muted-foreground">
                          Refrigerated Containers
                        </SelectItem>
                        {Object.entries(containerSpecs)
                          .filter(([, spec]) => spec.category === "Reefer")
                          .map(([code, spec]) => (
                            <SelectItem key={code} value={code}>
                              {code} - {spec.name}
                            </SelectItem>
                          ))}
                        <SelectItem value="special" disabled className="font-semibold text-muted-foreground">
                          Special Containers
                        </SelectItem>
                        {Object.entries(containerSpecs)
                          .filter(([, spec]) => spec.category === "Special" || spec.category === "Tank")
                          .map(([code, spec]) => (
                            <SelectItem key={code} value={code}>
                              {code} - {spec.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg text-sm dark:from-[#0F4C81]/20 dark:to-[#2E8B57]/20">
                    <div className="text-center">
                      <div className="font-bold text-lg text-[var(--ocean)]">{formatWeight(selectedContainer.tare)}</div>
                      <div className="text-xs text-muted-foreground">Tare Weight</div>
                    </div>
                    <div className="text-center border-x border-border">
                      <div className="font-bold text-lg text-[var(--logistics)]">{formatWeight(selectedContainer.maxPayload)}</div>
                      <div className="text-xs text-muted-foreground">Max Payload</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-amber-600">{formatWeight(selectedContainer.maxGross)}</div>
                      <div className="text-xs text-muted-foreground">Max Gross</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5 text-[var(--ocean)]" />
                    Weighing Method
                  </CardTitle>
                  <CardDescription>
                    Choose how the VGM will be determined
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {weighingMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = weighingMethod === method.id;
                      return (
                        <div
                          key={method.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? "border-[var(--ocean)] bg-[var(--ocean)]/5 dark:bg-[var(--ocean)]/10" 
                              : "border-border hover:border-[var(--ocean)]/50"
                          }`}
                          onClick={() => setWeighingMethod(method.id)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`h-5 w-5 ${isSelected ? "text-[var(--ocean)]" : "text-muted-foreground"}`} />
                            <span className={`font-medium ${isSelected ? "text-[var(--ocean)]" : ""}`}>
                              Method {method.id.slice(-1)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{method.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {method.accuracy}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <AnimatePresence mode="wait">
                    {weighingMethod === "method1" ? (
                      <motion.div
                        key="method1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="weighbridgeWeight">Weighbridge Reading (Total Weight)</Label>
                        <div className="relative">
                          <Input
                            id="weighbridgeWeight"
                            type="number"
                            value={weighbridgeWeight}
                            onChange={(e) => setWeighbridgeWeight(e.target.value)}
                            placeholder="Enter total container weight from weighbridge"
                            className="pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kg</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm">
                          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                          <p className="text-blue-700 dark:text-blue-300">
                            The weighbridge must be certified and calibrated according to national standards. 
                            Keep the weighbridge ticket for records.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="method2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="customTare">Container Tare Weight (Override)</Label>
                          <div className="relative">
                            <Input
                              id="customTare"
                              type="number"
                              value={customTare}
                              onChange={(e) => setCustomTare(e.target.value)}
                              placeholder={`Default: ${selectedContainer.tare} kg`}
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kg</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Leave empty to use door plate tare weight
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cargoWeight">Cargo Weight *</Label>
                          <div className="relative">
                            <Input
                              id="cargoWeight"
                              type="number"
                              value={cargoWeight}
                              onChange={(e) => setCargoWeight(e.target.value)}
                              placeholder="Total cargo weight"
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kg</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dunnageWeight">Dunnage & Packaging Weight</Label>
                          <div className="relative">
                            <Input
                              id="dunnageWeight"
                              type="number"
                              value={dunnageWeight}
                              onChange={(e) => setDunnageWeight(e.target.value)}
                              placeholder="Pallets, straps, etc."
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kg</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Include pallets, straps, dunnage bags, cardboard, blocking, and bracing
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[var(--logistics)]" />
                    Declaration Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsibleParty">Responsible Party (Shipper)</Label>
                    <Input
                      id="responsibleParty"
                      value={responsibleParty}
                      onChange={(e) => setResponsibleParty(e.target.value)}
                      placeholder="Company name as per booking"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signatureDate">Declaration Date</Label>
                    <Input
                      id="signatureDate"
                      type="date"
                      value={signatureDate}
                      onChange={(e) => setSignatureDate(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Result */}
              <Card className={`overflow-hidden ${calculation.isWithinLimit ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}`}>
                <div className={`h-2 ${calculation.isWithinLimit ? "bg-gradient-to-r from-[#2E8B57] to-green-400" : "bg-gradient-to-r from-red-500 to-red-400"}`} />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    VGM Calculation Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-5xl font-bold ${calculation.isWithinLimit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {formatWeight(calculation.totalVGM)}
                    </motion.div>
                    <div className="text-lg text-muted-foreground mt-1">
                      Verified Gross Mass
                    </div>
                    <div className="flex justify-center mt-4 gap-2">
                      {calculation.isWithinLimit ? (
                        <>
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Within Limits
                          </Badge>
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            {formatWeight(calculation.remainingCapacity)} remaining
                          </Badge>
                        </>
                      ) : (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Over Limit by {formatWeight(calculation.exceededBy)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Weight Breakdown */}
                  {weighingMethod === "method2" && calculation.totalVGM > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Container Tare</span>
                          <span className="font-medium">{formatWeight(calculation.containerTare)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cargo Weight</span>
                          <span className="font-medium">{formatWeight(calculation.cargoWeight)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Dunnage & Packaging</span>
                          <span className="font-medium">{formatWeight(calculation.dunnageWeight)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Utilization Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Max Gross Utilization</span>
                      <span className={`font-medium ${calculation.utilizationPercent > 100 ? "text-red-600" : calculation.utilizationPercent > 90 ? "text-amber-600" : "text-green-600"}`}>
                        {calculation.utilizationPercent.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(calculation.utilizationPercent, 100)} 
                      className={`h-4 ${calculation.utilizationPercent > 100 ? "[&>div]:bg-red-500" : calculation.utilizationPercent > 90 ? "[&>div]:bg-amber-500" : "[&>div]:bg-green-500"}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0</span>
                      <span>{formatWeight(selectedContainer.maxGross)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* VGM Certificate Preview */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">VGM Declaration</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-lg bg-white dark:bg-card text-sm space-y-4">
                    <div className="text-center border-b pb-3">
                      <h3 className="font-bold text-lg">VERIFIED GROSS MASS DECLARATION</h3>
                      <p className="text-xs text-muted-foreground">SOLAS Chapter VI, Regulation 2 - Container Weight Requirement</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Container Number</span>
                        <div className="font-mono font-bold">{containerNumber || "____________"}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Container Type</span>
                        <div className="font-bold">{selectedContainer.name}</div>
                      </div>
                    </div>

                    {bookingNumber && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-muted-foreground">Booking Number</span>
                          <div className="font-bold">{bookingNumber}</div>
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded text-center dark:from-[#0F4C81]/20 dark:to-[#2E8B57]/20">
                      <span className="text-xs text-muted-foreground block">Verified Gross Mass (VGM)</span>
                      <div className="text-2xl font-bold">{formatWeight(calculation.totalVGM)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Weighing Method:</span>
                        <div className="font-medium">{weighingMethod === "method1" ? "Method 1 - Weighbridge" : "Method 2 - Calculated"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Declaration Date:</span>
                        <div className="font-medium">{signatureDate}</div>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="text-xs text-muted-foreground mb-1">Declared by (Shipper):</div>
                      <div className="font-medium">{responsibleParty || "________________________________"}</div>
                    </div>

                    <div className="text-xs text-muted-foreground text-center italic">
                      This declaration is made in accordance with SOLAS Chapter VI, Regulation 2
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warning */}
              {!calculation.isWithinLimit && calculation.totalVGM > 0 && (
                <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <div className="text-sm text-red-700 dark:text-red-300">
                        <p className="font-semibold mb-2">Overweight Container Warning</p>
                        <p>
                          The container exceeds its maximum gross weight by {formatWeight(calculation.exceededBy)}. 
                          This container <strong>cannot be loaded</strong> onto a vessel in its current state. 
                          You must reduce cargo weight to comply with safety regulations.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Methods */}
        <TabsContent value="methods" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Method 1 */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-[var(--ocean)]" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[var(--ocean)]/10">
                    <Scale className="h-6 w-6 text-[var(--ocean)]" />
                  </div>
                  <div>
                    <CardTitle>Method 1: Weigh Entire Container</CardTitle>
                    <CardDescription>Weigh the packed container using certified equipment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    Method 1 involves weighing the entire packed container after all cargo, packaging, and dunnage 
                    have been loaded. This is performed using calibrated and certified weighing equipment such as 
                    weighbridges, scales, or lifting equipment with built-in weighing capability. The entire container 
                    is placed on or suspended from the weighing device, and the total weight is recorded as the VGM.
                  </p>
                  <p className="text-muted-foreground">
                    This method is generally considered the most accurate and straightforward approach, as it 
                    eliminates the need to weigh individual components and reduces the potential for calculation 
                    errors. The accuracy of Method 1 is typically within ±1% of the actual weight, making it 
                    the preferred choice when certified weighbridge facilities are readily accessible.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Advantages
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Single measurement captures total weight</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Higher accuracy (±1%) compared to Method 2</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>No need to weigh individual cargo items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Reduces documentation requirements</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Considerations
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>Requires access to certified weighbridge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>May involve additional costs for weighing service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>Transportation to weighbridge required</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-[var(--ocean)]/5 dark:bg-[var(--ocean)]/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Equipment Requirements</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <span>Certified weighbridge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-muted-foreground" />
                      <span>Platform scale</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span>Lifting equipment with scale</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Calibration certificate</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Method 2 */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-[var(--logistics)]" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[var(--logistics)]/10">
                    <Package className="h-6 w-6 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <CardTitle>Method 2: Weigh All Contents</CardTitle>
                    <CardDescription>Calculate VGM from individual component weights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    Method 2 requires weighing all individual components that will be loaded into the container, 
                    then summing these weights together with the container&apos;s tare weight to determine the VGM. 
                    This includes all cargo items, packaging materials, pallets, dunnage, blocking, bracing, and 
                    any other materials that will be inside the container during transport.
                  </p>
                  <p className="text-muted-foreground">
                    The container&apos;s tare weight can be obtained from the door plate or CSC plate affixed to 
                    the container. All weighing equipment used must be certified and calibrated according to 
                    national standards. This method is particularly useful when weighbridge facilities are not 
                    readily available or when cargo is loaded at multiple locations before containerization.
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm">
                  <div className="text-center text-muted-foreground mb-2">VGM Formula</div>
                  <div className="text-center font-bold">
                    VGM = Tare + Cargo + Dunnage + Packaging
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Advantages
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>No need for weighbridge access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Can be performed at loading location</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Useful for multi-location loading</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Detailed weight breakdown available</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Considerations
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>More documentation required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>Lower accuracy (±2%) due to cumulative errors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>Risk of missing items in calculation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>Must verify tare weight from door plate</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-[var(--logistics)]/5 dark:bg-[var(--logistics)]/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Components to Include</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>Cargo items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span>Pallets & skids</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Container className="h-4 w-4 text-muted-foreground" />
                      <span>Inner packaging</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span>Dunnage bags</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carrier Submission Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-[var(--ocean)]" />
                Carrier VGM Submission Methods
              </CardTitle>
              <CardDescription>
                How to submit VGM to major ocean carriers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Carrier</th>
                      <th className="text-left py-3 px-4 font-semibold">Submission Method</th>
                      <th className="text-left py-3 px-4 font-semibold">Fee</th>
                      <th className="text-left py-3 px-4 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrierMethods.map((carrier, index) => (
                      <tr key={carrier.carrier} className={`border-b ${index % 2 === 0 ? "bg-muted/30" : ""}`}>
                        <td className="py-3 px-4 font-medium">{carrier.carrier}</td>
                        <td className="py-3 px-4">{carrier.method}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {carrier.fee}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{carrier.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weight Composition Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[var(--ocean)]" />
                  Weight Composition
                </CardTitle>
                <CardDescription>
                  Breakdown of container weight components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={weightCompositionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {weightCompositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatWeight(value)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Container Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--logistics)]" />
                  Container Weight Limits Comparison
                </CardTitle>
                <CardDescription>
                  Compare weight specifications across container types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={containerComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => `${(value / 1000).toFixed(0)}t`} />
                      <Tooltip 
                        formatter={(value: number) => formatWeight(value)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="tare" name="Tare Weight" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="payload" name="Max Payload" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="maxGross" name="Max Gross" stroke={COLORS[3]} strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Utilization Analysis */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--ocean)]">
                  {calculation.utilizationPercent.toFixed(1)}%
                </div>
                <Progress 
                  value={Math.min(calculation.utilizationPercent, 100)} 
                  className="mt-2 h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {calculation.isWithinLimit 
                    ? `${formatWeight(calculation.remainingCapacity)} remaining capacity`
                    : `${formatWeight(calculation.exceededBy)} overweight`
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Payload Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--logistics)]">
                  {((calculation.cargoWeight / selectedContainer.maxPayload) * 100).toFixed(1)}%
                </div>
                <Progress 
                  value={Math.min((calculation.cargoWeight / selectedContainer.maxPayload) * 100, 100)} 
                  className="mt-2 h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {formatWeight(calculation.cargoWeight)} of {formatWeight(selectedContainer.maxPayload)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Container Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {selectedContainer.category}
                </div>
                <Badge variant="outline" className="mt-2">
                  {containerType}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedContainer.name}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Historical Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                Historical VGM Tracking (Sample Data)
              </CardTitle>
              <CardDescription>
                Monthly container weighing statistics and compliance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="containers" 
                      name="Containers Weighed" 
                      stroke={COLORS[0]} 
                      fill={COLORS[0]}
                      fillOpacity={0.3}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="avgUtilization" 
                      name="Avg Utilization %" 
                      stroke={COLORS[1]} 
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="violations" 
                      name="Overweight Violations" 
                      stroke={COLORS[3]} 
                      strokeWidth={2}
                      dot={{ fill: COLORS[3] }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Port Deadlines Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--logistics)]" />
                VGM Submission Deadlines by Port
              </CardTitle>
              <CardDescription>
                Key cutoff times for major ports worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Port</th>
                      <th className="text-left py-3 px-4 font-semibold">Region</th>
                      <th className="text-left py-3 px-4 font-semibold">Deadline</th>
                      <th className="text-left py-3 px-4 font-semibold">Cutoff Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portDeadlines.map((port, index) => (
                      <tr key={port.port} className={`border-b ${index % 2 === 0 ? "bg-muted/30" : ""}`}>
                        <td className="py-3 px-4 font-medium">{port.port}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{port.region}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-[var(--ocean)]">{port.deadline}</span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{port.cutoff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {/* What is SOLAS VGM */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--ocean)]" />
                  What is SOLAS VGM?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The International Convention for the Safety of Life at Sea (SOLAS) is an international maritime 
                  treaty that sets minimum safety standards for merchant ships. In 2016, amendments to SOLAS 
                  Chapter VI, Regulation 2 came into effect, requiring that every packed container must have a 
                  Verified Gross Mass (VGM) before it can be loaded onto a vessel. This regulation was developed 
                  in response to numerous maritime accidents caused by misdeclared container weights, which led 
                  to vessel instability, stack collapses, and even ship casualties.
                </p>
                <p className="text-muted-foreground">
                  The SOLAS VGM requirement mandates that the shipper is responsible for providing the verified 
                  gross mass of a packed container to the carrier and terminal representative sufficiently in 
                  advance of vessel loading. Without a valid VGM declaration, the container must not be loaded 
                  onto the ship. This requirement applies to all packed containers intended for carriage on 
                  international sea voyages, regardless of size or cargo type.
                </p>
                <p className="text-muted-foreground">
                  The International Maritime Organization (IMO) developed these requirements in collaboration 
                  with the shipping industry to enhance maritime safety and prevent accidents related to 
                  overweight containers. The regulation has significantly improved safety standards across 
                  the global container shipping industry since its implementation on July 1, 2016.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-[var(--ocean)]" />
                    <div className="font-semibold">Effective Date</div>
                    <div className="text-sm text-muted-foreground">July 1, 2016</div>
                  </div>
                  <div className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-[var(--logistics)]" />
                    <div className="font-semibold">Regulation</div>
                    <div className="text-sm text-muted-foreground">SOLAS Chapter VI, Reg 2</div>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-lg text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                    <div className="font-semibold">Jurisdiction</div>
                    <div className="text-sm text-muted-foreground">Global (IMO)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Who is Responsible */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[var(--logistics)]" />
                  Who is Responsible for VGM Declaration?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Under the SOLAS VGM requirements, the shipper is defined as the legal entity or person 
                  named on the bill of lading or sea waybill, or equivalent transport document, as the 
                  party consigning the container for transportation by sea. This means the shipper bears 
                  the ultimate responsibility for obtaining and providing the verified gross mass, 
                  regardless of whether they physically performed the weighing themselves or contracted 
                  a third party to do so.
                </p>
                <p className="text-muted-foreground">
                  The shipper&apos;s responsibilities include: selecting the appropriate weighing method, 
                  ensuring weighing equipment is certified and calibrated, maintaining proper documentation 
                  of the weighing process, providing the VGM to the carrier in the required format and 
                  timeframe, and ensuring the accuracy of the declared weight. In cases where the shipper 
                  is not the party who packed the container, the shipper must still ensure they receive 
                  accurate weight information from the packing party.
                </p>
                <p className="text-muted-foreground">
                  Carriers and terminal operators also have responsibilities under the regulation. They 
                  must ensure that containers without a valid VGM are not loaded onto vessels. Many 
                  terminals have implemented systems to verify VGM declarations and may randomly weigh 
                  containers to validate declared weights. Discrepancies between declared and actual 
                  weights can result in penalties, delays, and additional costs.
                </p>
              </CardContent>
            </Card>

            {/* VGM Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-[var(--ocean)]" />
                  VGM Declaration Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The VGM declaration process begins well before the container arrives at the port. 
                  Shippers should plan their weighing activities to ensure the VGM can be submitted 
                  within the carrier&apos;s specified cutoff times. The typical workflow involves several 
                  key steps that must be completed accurately and on time to avoid shipment delays.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--ocean)] text-white flex items-center justify-center font-bold">1</div>
                      <span className="font-semibold">Pack Container</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Load all cargo, packaging, and dunnage into the container
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--logistics)] text-white flex items-center justify-center font-bold">2</div>
                      <span className="font-semibold">Obtain Weight</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use Method 1 or Method 2 to determine the VGM
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">3</div>
                      <span className="font-semibold">Submit VGM</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Send declaration to carrier before cutoff
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">4</div>
                      <span className="font-semibold">Confirm Receipt</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Verify carrier acknowledgment of VGM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Container Weight Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Weight className="h-5 w-5 text-[var(--logistics)]" />
                  Understanding Container Weight Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Every shipping container has three critical weight specifications that must be 
                  understood and respected: Tare Weight, Payload Capacity, and Maximum Gross Weight. 
                  The Tare Weight is the empty weight of the container itself, including all permanent 
                  fittings but excluding any cargo, packaging, or temporary fittings. This weight is 
                  typically stamped on the container&apos;s door plate or CSC plate and varies by container 
                  type, size, and manufacturer.
                </p>
                <p className="text-muted-foreground">
                  The Payload Capacity represents the maximum weight of cargo that can be safely loaded 
                  into the container. This is calculated by subtracting the tare weight from the maximum 
                  gross weight. The Maximum Gross Weight is the total permissible weight of the container 
                  when fully loaded, including the container itself, all cargo, packaging, dunnage, and 
                  any other contents. Exceeding the maximum gross weight can result in structural damage 
                  to the container, handling equipment failures, and safety hazards during transport.
                </p>
                <p className="text-muted-foreground">
                  It is important to note that road and rail weight limits may be lower than the 
                  container&apos;s maximum gross weight. Even if a container is within its weight limits 
                  for marine transport, it may need to be partially unloaded for inland transportation 
                  if road weight restrictions apply. Shippers should always verify applicable weight 
                  limits for all legs of the journey, not just the ocean portion.
                </p>
              </CardContent>
            </Card>

            {/* Common Mistakes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  Common VGM Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-red-700 dark:text-red-300">Missing the VGM Deadline</div>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          Submitting VGM after the carrier&apos;s cutoff time results in container rollover 
                          and additional charges. Always check deadlines for your specific port and carrier.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-red-700 dark:text-red-300">Forgetting Dunnage Weight</div>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          When using Method 2, forgetting to include pallets, straps, and dunnage bags 
                          in the calculation leads to under-declaration. Always include all materials.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-red-700 dark:text-red-300">Using Uncertified Scales</div>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          All weighing equipment must be certified and calibrated according to national 
                          standards. Using uncertified equipment invalidates the VGM declaration.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-red-700 dark:text-red-300">Ignoring Road Weight Limits</div>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          A container within vessel limits may exceed road weight restrictions. 
                          Plan for potential transloading or partial unloading requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about SOLAS VGM requirements and procedures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="faq1" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 font-semibold">
                      <Badge className="bg-[var(--ocean)]">Q1</Badge>
                      What happens if I don&apos;t submit the VGM on time?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      If the VGM is not submitted before the carrier&apos;s cutoff deadline, the container 
                      will not be loaded onto the vessel. This is a mandatory requirement under SOLAS 
                      regulations, and carriers cannot make exceptions. The container will be rolled to 
                      the next available vessel, which can result in significant delays and additional costs.
                    </p>
                    <p>
                      Most carriers charge rollover fees that can range from $100 to $500 or more, 
                      depending on the carrier and route. Additionally, you may incur storage charges 
                      at the terminal and potential penalties from your customers for delayed delivery. 
                      Some terminals may also impose their own fines for late or missing VGM submissions.
                    </p>
                    <p>
                      To avoid these issues, always check the VGM cutoff time for your specific booking 
                      and port. Submit the VGM well in advance of the deadline, and retain proof of 
                      submission. Many carriers provide confirmation emails or portal notifications 
                      when VGM is successfully received.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq2" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 font-semibold">
                      <Badge className="bg-[var(--logistics)]">Q2</Badge>
                      Can I use my own scale for Method 2 weighing?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Yes, you can use your own weighing equipment for Method 2, but the equipment 
                      must meet specific certification and calibration requirements. All scales and 
                      weighing devices used for VGM determination must be certified and calibrated 
                      according to your country&apos;s national standards and metrology regulations.
                    </p>
                    <p>
                      The certification process typically involves initial verification by a recognized 
                      metrology authority, followed by periodic recalibration. Calibration certificates 
                      must be current and available for inspection. The accuracy class of the scale 
                      must be appropriate for the weights being measured, and the scale must be 
                      suitable for the type of cargo being weighed.
                    </p>
                    <p>
                      If you&apos;re uncertain about your equipment&apos;s certification status, many 
                      third-party weighing services are available. These services have certified 
                      equipment and can provide proper documentation for your VGM declaration. The 
                      cost is typically modest compared to the potential penalties for inaccurate 
                      or invalid VGM submissions.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq3" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 font-semibold">
                      <Badge className="bg-amber-500">Q3</Badge>
                      Is VGM required for all container types?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Yes, the SOLAS VGM requirement applies to all packed containers intended for 
                      carriage on international sea voyages. This includes standard dry containers, 
                      refrigerated containers, open-top containers, flat racks, platform containers, 
                      tank containers, and any other type of freight container as defined by the 
                      International Convention for Safe Containers (CSC).
                    </p>
                    <p>
                      The requirement applies regardless of the size of the container. While most 
                      containers are 20-foot or 40-foot standard sizes, VGM is also required for 
                      45-foot containers, 10-foot containers, and non-standard sizes. Even empty 
                      containers being repositioned may require VGM if they contain any items such 
                      as dunnage, spare parts, or personal effects.
                    </p>
                    <p>
                      There are very limited exceptions, such as containers carried on certain types 
                      of vessels under specific conditions, but these exceptions are narrow and should 
                      be verified with your carrier. When in doubt, always provide a VGM declaration 
                      to ensure compliance and avoid loading delays.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq4" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 font-semibold">
                      <Badge className="bg-purple-500">Q4</Badge>
                      What if the terminal&apos;s scale shows a different weight?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      If a terminal weighs your container and the result differs significantly from 
                      your declared VGM, several scenarios may unfold. Small discrepancies within the 
                      accepted tolerance range (typically ±1-2%) are usually not problematic. However, 
                      larger discrepancies can trigger investigations, delays, and potential penalties.
                    </p>
                    <p>
                      If the terminal&apos;s weighing shows your container is overweight (exceeding the 
                      maximum gross weight), the container will not be loaded until the issue is 
                      resolved. This may require removing some cargo or, in extreme cases, completely 
                      repacking the container. The shipper bears all costs associated with such 
                      corrections, including handling fees, storage charges, and potential vessel 
                      booking changes.
                    </p>
                    <p>
                      For significant under-declarations (where actual weight exceeds declared weight 
                      by a substantial margin), carriers may impose penalties and may require the 
                      shipper to provide corrective declarations. Repeated discrepancies can result 
                      in increased scrutiny of future shipments and potential loss of carrier 
                      privileges. Always double-check your VGM calculations and use certified 
                      weighing methods to minimize discrepancies.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq5" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 font-semibold">
                      <Badge className="bg-red-500">Q5</Badge>
                      How long must VGM records be retained?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      While the SOLAS convention itself does not specify a mandatory record retention 
                      period, most national maritime authorities and industry best practices recommend 
                      retaining VGM documentation for a minimum of three years. This aligns with 
                      typical commercial document retention periods and provides adequate coverage 
                      for potential audits, investigations, or disputes.
                    </p>
                    <p>
                      The documentation you should retain includes: the VGM declaration itself, 
                      weighing certificates or weighbridge tickets, calibration certificates for 
                      weighing equipment used, records of individual cargo weights (for Method 2), 
                      and any carrier confirmations of VGM receipt. For Method 2 declarations, also 
                      keep records of the tare weight source (door plate reading or documentation).
                    </p>
                    <p>
                      Electronic records are generally acceptable, provided they are securely stored 
                      and can be readily retrieved when needed. Many shippers use document management 
                      systems to organize and retain VGM records. Having complete documentation readily 
                      available can be invaluable if questions arise about a particular shipment or 
                      if your VGM practices are ever audited by authorities.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq6" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2 font-semibold">
                      <Badge className="bg-green-500">Q6</Badge>
                      Can I amend a VGM after submission?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Yes, VGM declarations can generally be amended after submission, but the process 
                      and timing requirements vary by carrier. Most carriers allow VGM amendments through 
                      their web portals or via email/EDI up until the VGM cutoff time. After the cutoff, 
                      amendments may still be possible but typically require direct communication with 
                      the carrier and may incur additional fees.
                    </p>
                    <p>
                      To amend a VGM, you&apos;ll need to submit a revised declaration with the correct 
                      weight, along with an explanation for the change. Some carriers require supporting 
                      documentation, especially if the weight difference is significant. The amendment 
                      must be submitted by the same party that made the original declaration (or their 
                      authorized representative).
                    </p>
                    <p>
                      Be aware that frequent amendments may trigger additional scrutiny from carriers 
                      and terminals. While honest mistakes can happen, a pattern of corrections may 
                      suggest inadequate weighing procedures and could lead to increased verification 
                      requirements. If you discover an error in your VGM, correct it promptly, but also 
                      review your weighing and documentation processes to prevent similar errors in the future.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5 dark:from-[#0F4C81]/20 dark:to-[#0F4C81]/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Method 1 Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--ocean)]">±1%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Weighbridge weighing is more accurate
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#2E8B57]/10 to-[#2E8B57]/5 dark:from-[#2E8B57]/20 dark:to-[#2E8B57]/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Method 2 Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--logistics)]">±2%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Accumulated errors from multiple weighings
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Typical Cutoff</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">24-48h</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Before vessel arrival at most ports
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
