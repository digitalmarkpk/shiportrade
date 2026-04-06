"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Ruler,
  Scale,
  Box,
  Thermometer,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Ship,
  Truck,
  Package,
  HelpCircle,
  FileText,
  BarChart3,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { containerSpecs } from "@/lib/constants/units";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast } from "sonner";

type ContainerType = keyof typeof containerSpecs;

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Chart colors
const CHART_COLORS = [OCEAN_BLUE, LOGISTICS_GREEN, "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

interface ContainerVisualProps {
  type: ContainerType;
  fillPercentage?: number;
}

function ContainerVisual({ type, fillPercentage = 0 }: ContainerVisualProps) {
  const spec = containerSpecs[type];
  const isHighCube = spec.type === "High Cube";
  const isReefer = spec.type === "Reefer";
  const isOpenTop = spec.type === "Open Top";
  const isFlatRack = spec.type === "Flat Rack";
  const isTank = spec.type === "Tank";

  return (
    <div className="relative w-full aspect-[2/1] flex items-center justify-center">
      <div
        className={`relative border-2 rounded-sm ${
          isReefer ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30" :
          isOpenTop ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30 border-dashed" :
          isFlatRack ? "border-gray-400 bg-gray-50 dark:bg-gray-950/30" :
          isTank ? "border-gray-400 rounded-full bg-gray-50 dark:bg-gray-950/30" :
          `border-[${OCEAN_BLUE}] bg-[${OCEAN_BLUE}]/5`
        }`}
        style={{
          width: "90%",
          height: isHighCube ? "75%" : "65%",
          borderColor: isReefer ? undefined : isOpenTop ? undefined : isFlatRack ? undefined : isTank ? undefined : OCEAN_BLUE,
          backgroundColor: isReefer ? undefined : isOpenTop ? undefined : isFlatRack ? undefined : isTank ? undefined : `${OCEAN_BLUE}08`,
        }}
      >
        {fillPercentage > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-500"
            style={{ height: `${fillPercentage}%`, backgroundColor: `${LOGISTICS_GREEN}33` }}
          />
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{spec.name}</div>
            <div className="text-sm text-muted-foreground">{spec.capacity} CBM</div>
          </div>
        </div>

        {!isFlatRack && !isTank && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-1/3 bg-current opacity-30" />
        )}

        {isReefer && (
          <div className="absolute left-2 top-2">
            <Thermometer className="h-5 w-5 text-blue-500" />
          </div>
        )}
      </div>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
        {spec.internalLength}m × {spec.internalWidth}m × {spec.internalHeight}m
      </div>
    </div>
  );
}

// FAQ Data
const containerFAQ = [
  {
    question: "What is the difference between a 20' and 40' container?",
    answer: "A 20' container (1 TEU) has approximately 33.2 CBM capacity and is ideal for heavy, dense cargo. A 40' container (2 TEU) offers 67.7 CBM capacity, making it better for voluminous cargo. While a 40' container doubles the volume of a 20', the maximum payload is similar (~28,000 kg), so 20' containers are often preferred for heavy cargo like minerals, metals, or machinery, while 40' containers suit lighter goods like furniture, clothing, or consumer products.",
  },
  {
    question: "When should I choose a High Cube container over a standard container?",
    answer: "High Cube containers are 9'6\" tall compared to standard containers at 8'6\", providing an extra foot of height. This translates to approximately 10-12% more volume. Choose High Cube when shipping voluminous but lightweight cargo such as furniture, insulation materials, or tall items that exceed standard height. They're particularly popular in e-commerce and retail logistics where maximizing volume per shipment reduces per-unit shipping costs. Note that High Cube containers may have restrictions on certain routes or vessels.",
  },
  {
    question: "What cargo types require refrigerated (Reefer) containers?",
    answer: "Reefer containers are essential for temperature-sensitive cargo including fresh produce (fruits, vegetables, meat, seafood), pharmaceuticals, chemicals requiring specific temperature ranges, and certain beverages. Modern reefers maintain temperatures from -25°C to +25°C with precise control. They're also used for goods requiring humidity control. The higher shipping cost is offset by reduced spoilage and compliance with food safety regulations. Always verify the specific temperature requirements of your cargo with the shipping line.",
  },
  {
    question: "How do I determine the right container for oversized cargo?",
    answer: "Oversized cargo that exceeds standard dimensions requires special containers. Open Top containers allow top-loading for tall items and cargo that cannot be loaded through doors. Flat Rack containers have no sides or roof, perfect for heavy machinery, construction equipment, and oddly-shaped items. Platform containers are similar but without end walls. For extremely large items, consider breakbulk shipping. Always measure your cargo precisely, including packaging, and consult with freight forwarders who specialize in project cargo.",
  },
  {
    question: "What is TEU and why is it important in shipping?",
    answer: "TEU (Twenty-foot Equivalent Unit) is the standard unit for measuring container capacity. One TEU equals one 20' standard container. A 40' container equals 2 TEU. This standardization allows ports, ships, and terminals to communicate capacity uniformly. Container vessels are rated by TEU capacity (e.g., 20,000 TEU vessels). Terminal capacity, storage fees, and throughput statistics all use TEU measurements. Understanding TEU helps in comparing shipping costs and planning logistics operations effectively.",
  },
  {
    question: "How is container payload capacity calculated and enforced?",
    answer: "Payload capacity is the maximum cargo weight a container can safely carry, calculated as Maximum Gross Weight minus Tare Weight. Gross weight includes the container, cargo, and any securing equipment. Exceeding payload capacity risks container failure, can damage vessels and handling equipment, and violates international safety regulations. Weighbridges at ports verify container weights. Overweight containers may be denied loading, incur penalties, or require partial offloading. Always weigh cargo accurately and factor in packaging weight.",
  },
  {
    question: "What are Tank containers and when are they used?",
    answer: "Tank containers (ISO Tanks) are standardized cylindrical vessels within a steel framework, designed for transporting bulk liquids, gases, and powders. They're used for chemicals, food-grade liquids, fuels, and hazardous materials. Advantages include reduced packaging costs, lower risk of contamination, and intermodal capability. A typical 20' tank holds approximately 24,000 liters. Tank containers must meet stringent safety standards (IMO, ADR, RID) for hazardous materials. They require specialized handling and cleaning facilities between uses.",
  },
];

// Educational content sections
const educationalContent = {
  containerTypes: {
    title: "Understanding Container Types",
    content: `Shipping containers are categorized by their design and intended use. Dry Van containers, also known as General Purpose (GP) containers, are the most common type used in global trade. They feature weatherproof steel construction with doors at one end and are suitable for most types of cargo that don't require special handling. The 20' Standard and 40' Standard are the workhorses of international shipping, while 40' High Cube containers offer additional height for voluminous cargo. Refrigerated containers, or Reefers, are equipped with integrated refrigeration units that maintain precise temperature control throughout the journey. They're essential for perishable goods, pharmaceuticals, and temperature-sensitive chemicals. Open Top containers feature a removable canvas top, allowing top-loading of tall or heavy cargo using cranes. Flat Rack containers have no roof or side walls, just end walls, making them ideal for oversized items like heavy machinery and construction equipment. Tank containers combine a cylindrical vessel within an ISO frame for liquid and gas transport.`,
  },
  dimensions: {
    title: "Internal vs External Dimensions",
    content: `Understanding the distinction between internal and external dimensions is crucial for effective cargo planning. External dimensions are fixed by ISO standards: a 20' container measures approximately 6.058m × 2.438m × 2.591m externally, while a 40' container is roughly 12.192m × 2.438m × 2.591m (or 2.896m for High Cube). Internal dimensions are smaller due to wall thickness, flooring, and corrugation. For a 20' container, internal dimensions are approximately 5.898m × 2.352m × 2.393m. This difference of 10-15cm per dimension affects cargo loading calculations significantly. Door openings are even smaller, typically 2.343m wide × 2.280m high for standard containers, or 2.585m high for High Cube. Always measure your cargo against door dimensions, not just internal dimensions, to ensure it can be loaded. For palletized cargo, the usable floor space is limited to the area inside the door posts.`,
  },
  payload: {
    title: "Payload Capacity and Cube Utilization",
    content: `Payload capacity represents the maximum cargo weight a container can legally carry, determined by subtracting the container's tare weight from its maximum gross weight. Modern 20' containers typically have payload capacities around 28,000 kg, while 40' containers are similar at 28,000-29,000 kg despite their larger volume. This is because road weight limits, not structural capacity, often constrain payload. Cube utilization measures how effectively you use the available volume. A perfectly loaded 40' HC with 76.3 CBM capacity rarely achieves more than 85-90% utilization due to cargo shapes and stowage requirements. Heavy cargo fills weight capacity before volume, while light cargo fills volume before weight. The goal is to optimize both—shipping "full" means achieving maximum weight for heavy cargo or maximum volume for light cargo. Calculate your cargo's stowage factor (CBM per MT) to determine which container size offers the best value.`,
  },
  selection: {
    title: "Container Selection Criteria",
    content: `Selecting the right container type involves analyzing multiple factors including cargo characteristics, value, destination requirements, and cost considerations. Start by determining if your cargo requires special handling—temperature control, humidity control, ventilation, or special loading access. Consider cargo dimensions carefully: measure the longest, widest, and tallest points including packaging. For cargo exceeding 2.35m width or 2.39m height, consider Open Top or Flat Rack options. Weight distribution matters—concentrated heavy loads may require floor reinforcement or weight distribution beams. Transit time and route affect container choice: longer voyages may necessitate better ventilation or climate control. Budget constraints influence decisions: special containers cost 50-200% more than standard dry vans. Finally, consider availability—seasonal demand spikes can limit container availability, especially for reefers during harvest seasons. Building flexibility into your supply chain with alternative container types can prevent costly delays.`,
  },
  specialContainers: {
    title: "Special Containers for Special Cargo",
    content: `Beyond standard containers, the shipping industry offers specialized containers engineered for specific cargo requirements. Flat Rack containers feature collapsible end walls and reinforced floors for heavy, oversized cargo. They can be loaded from any direction and stacked when empty. Open Top containers with removable canvas covers enable top-loading of tall items and are used for cargo requiring crane loading. Platform containers are similar to flat racks but without end walls, offering maximum flexibility for extreme dimensions. Ventilated containers have special air circulation systems for cargo requiring airflow, such as coffee, cocoa, and certain chemicals. Tank containers hold liquids, gases, and powders in a cylindrical vessel within an ISO frame, meeting international safety standards for hazardous materials. Insulated containers maintain temperature without active refrigeration, suitable for shorter voyages. Each special container type has unique handling requirements, certification standards, and cost structures that must be factored into logistics planning.`,
  },
};

export function ContainerSizeGuide() {
  const [selectedType, setSelectedType] = useState<ContainerType>("40hc");
  const [expandedSpec, setExpandedSpec] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const selectedSpec = containerSpecs[selectedType];

  // Calculate statistics
  const totalContainerTypes = Object.keys(containerSpecs).length;
  const dryVanTypes = Object.values(containerSpecs).filter(s => s.type === "Dry Van" || s.type === "High Cube").length;
  const specialTypes = totalContainerTypes - dryVanTypes;
  const avgCapacity = (Object.values(containerSpecs).reduce((sum, s) => sum + s.capacity, 0) / totalContainerTypes).toFixed(1);

  const containerCategories = [
    {
      name: "Dry Van",
      description: "Standard containers for general cargo",
      types: ["20std", "40std", "40hc", "45hc"] as ContainerType[],
      color: OCEAN_BLUE,
    },
    {
      name: "Refrigerated",
      description: "Temperature-controlled containers",
      types: ["20rf", "40rf"] as ContainerType[],
      color: "#3b82f6",
    },
    {
      name: "Special",
      description: "Open top, flat rack, and tank containers",
      types: ["20ot", "40ot", "20fr", "40fr", "20tk"] as ContainerType[],
      color: LOGISTICS_GREEN,
    },
  ];

  // Chart data
  const capacityData = Object.entries(containerSpecs).map(([key, spec]) => ({
    name: spec.name.replace("'", ""),
    capacity: spec.capacity,
    payload: spec.maxPayload / 1000,
  }));

  const typeDistribution = [
    { name: "Dry Van", value: Object.values(containerSpecs).filter(s => s.type === "Dry Van").length, color: OCEAN_BLUE },
    { name: "High Cube", value: Object.values(containerSpecs).filter(s => s.type === "High Cube").length, color: LOGISTICS_GREEN },
    { name: "Reefer", value: Object.values(containerSpecs).filter(s => s.type === "Reefer").length, color: "#3b82f6" },
    { name: "Open Top", value: Object.values(containerSpecs).filter(s => s.type === "Open Top").length, color: "#f59e0b" },
    { name: "Flat Rack", value: Object.values(containerSpecs).filter(s => s.type === "Flat Rack").length, color: "#8b5cf6" },
    { name: "Tank", value: Object.values(containerSpecs).filter(s => s.type === "Tank").length, color: "#ec4899" },
  ];

  const utilizationData = [
    { name: "20' STD", volume: 85, weight: 65 },
    { name: "40' STD", volume: 88, weight: 62 },
    { name: "40' HC", volume: 92, weight: 58 },
    { name: "45' HC", volume: 95, weight: 55 },
  ];

  const toggleSpec = (type: string) => {
    setExpandedSpec(expandedSpec === type ? null : type);
  };

  const handleExport = () => {
    const data = Object.entries(containerSpecs).map(([key, spec]) => ({
      Name: spec.name,
      Type: spec.type,
      "Internal Length (m)": spec.internalLength,
      "Internal Width (m)": spec.internalWidth,
      "Internal Height (m)": spec.internalHeight,
      "Capacity (CBM)": spec.capacity,
      "Max Payload (kg)": spec.maxPayload,
      "Tare Weight (kg)": spec.tareWeight,
      TEU: spec.teu,
    }));

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => Object.values(row).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "container-specifications.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Container specifications exported to CSV");
  };

  const handleShare = async () => {
    const shareData = {
      title: "Container Size Guide - Shiportrade",
      text: "Check out this comprehensive container size guide with all ISO specifications.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully");
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Container className="h-3 w-3 mr-1" />
              Container Reference
            </Badge>
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">ISO Container Specifications</h2>
          <p className="text-white/80 max-w-2xl mb-6">
            Comprehensive guide to shipping container types, dimensions, and capacities.
            Essential for cargo planning, logistics calculations, and optimizing your supply chain.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <Container className="h-4 w-4" />
                <span className="text-sm text-white/70">Container Types</span>
              </div>
              <div className="text-2xl font-bold">{totalContainerTypes}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4" />
                <span className="text-sm text-white/70">Dry Van Types</span>
              </div>
              <div className="text-2xl font-bold">{dryVanTypes}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="h-4 w-4" />
                <span className="text-sm text-white/70">Special Types</span>
              </div>
              <div className="text-2xl font-bold">{specialTypes}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm text-white/70">Avg. Capacity</span>
              </div>
              <div className="text-2xl font-bold">{avgCapacity} CBM</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Export/Share Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="secondary" size="sm" onClick={handleShare} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 gap-2 h-auto p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-2">
            <Eye className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="specifications" className="flex items-center gap-2 py-2">
            <FileText className="h-4 w-4" />
            Specifications
          </TabsTrigger>
          <TabsTrigger value="selection" className="flex items-center gap-2 py-2">
            <Package className="h-4 w-4" />
            Selection Guide
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center gap-2 py-2">
            <BarChart3 className="h-4 w-4" />
            Visual Guide
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 py-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* Educational Content: Container Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                {educationalContent.containerTypes.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{educationalContent.containerTypes.content}</p>
            </CardContent>
          </Card>

          {/* Container Categories */}
          <div className="grid md:grid-cols-3 gap-6">
            {containerCategories.map((category) => (
              <Card key={category.name} className="overflow-hidden">
                <div className="h-1" style={{ backgroundColor: category.color }} />
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.types.map((type) => {
                      const spec = containerSpecs[type];
                      return (
                        <div key={type}>
                          <button
                            onClick={() => toggleSpec(type)}
                            className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Container className="h-4 w-4" style={{ color: category.color }} />
                              <span className="font-medium">{spec.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">{spec.capacity} CBM</Badge>
                              {expandedSpec === type ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {expandedSpec === type && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-3 text-sm text-muted-foreground border-l-2 ml-6 mt-2" style={{ borderColor: category.color }}>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>Length: {spec.internalLength}m</div>
                                    <div>Width: {spec.internalWidth}m</div>
                                    <div>Height: {spec.internalHeight}m</div>
                                    <div>Max Payload: {(spec.maxPayload / 1000).toFixed(1)} MT</div>
                                    <div>Tare: {(spec.tareWeight / 1000).toFixed(2)} MT</div>
                                    <div>TEU: {spec.teu}</div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Reference Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4" style={{ borderLeftColor: OCEAN_BLUE }}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ruler className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                  TEU (Twenty-foot Equivalent Unit)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Standard unit for measuring container capacity. A 20&apos; container = 1 TEU, 
                  a 40&apos; container = 2 TEU. Used for port statistics and ship capacity.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4" style={{ borderLeftColor: LOGISTICS_GREEN }}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Box className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                  CBM (Cubic Meter)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Volume measurement for cargo. 1 CBM = 1m × 1m × 1m. Essential for calculating 
                  freight costs and container utilization.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Specifications */}
        <TabsContent value="specifications" className="space-y-6">
          {/* Educational Content: Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                {educationalContent.dimensions.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{educationalContent.dimensions.content}</p>
            </CardContent>
          </Card>

          {/* Educational Content: Payload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                {educationalContent.payload.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{educationalContent.payload.content}</p>
            </CardContent>
          </Card>

          {/* Complete Specifications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Container Specifications</CardTitle>
              <CardDescription>
                All ISO container types with detailed dimensions and capacities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Container</th>
                      <th className="text-left py-3 px-4 font-semibold">Internal (L × W × H)</th>
                      <th className="text-left py-3 px-4 font-semibold">Door (W × H)</th>
                      <th className="text-left py-3 px-4 font-semibold">Capacity</th>
                      <th className="text-left py-3 px-4 font-semibold">Payload</th>
                      <th className="text-left py-3 px-4 font-semibold">Tare</th>
                      <th className="text-left py-3 px-4 font-semibold">TEU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(containerSpecs).map(([key, spec]) => (
                      <tr key={key} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: spec.type === "Dry Van" ? OCEAN_BLUE :
                                spec.type === "High Cube" ? LOGISTICS_GREEN :
                                spec.type === "Reefer" ? "#3b82f6" : "#f59e0b",
                              color: spec.type === "Dry Van" ? OCEAN_BLUE :
                                spec.type === "High Cube" ? LOGISTICS_GREEN :
                                spec.type === "Reefer" ? "#3b82f6" : "#f59e0b"
                            }}
                          >
                            {spec.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">{spec.name}</td>
                        <td className="py-3 px-4">
                          {spec.internalLength} × {spec.internalWidth} × {spec.internalHeight}m
                        </td>
                        <td className="py-3 px-4">
                          {spec.doorWidth ? `${spec.doorWidth} × ${spec.doorHeight}m` : "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium" style={{ color: LOGISTICS_GREEN }}>{spec.capacity}</span> CBM
                        </td>
                        <td className="py-3 px-4">{(spec.maxPayload / 1000).toFixed(1)} MT</td>
                        <td className="py-3 px-4">{(spec.tareWeight / 1000).toFixed(2)} MT</td>
                        <td className="py-3 px-4">{spec.teu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Visual Comparison */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Container Visual Comparison
              </CardTitle>
              <CardDescription>
                Click on a container type to see detailed specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as ContainerType)}>
                <TabsList className="grid grid-cols-4 lg:grid-cols-11 gap-1 h-auto p-1">
                  {Object.entries(containerSpecs).map(([key, spec]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="text-xs px-2 py-1.5 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white"
                    >
                      {spec.name.replace("'", "'")}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(containerSpecs).map(([key, spec]) => (
                  <TabsContent key={key} value={key} className="mt-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <ContainerVisual type={key as ContainerType} />
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <Ruler className="h-5 w-5 mx-auto mb-2" style={{ color: OCEAN_BLUE }} />
                            <div className="text-sm text-muted-foreground">Internal</div>
                            <div className="font-medium">
                              {spec.internalLength}×{spec.internalWidth}×{spec.internalHeight}m
                            </div>
                          </div>
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <Box className="h-5 w-5 mx-auto mb-2" style={{ color: LOGISTICS_GREEN }} />
                            <div className="text-sm text-muted-foreground">Capacity</div>
                            <div className="font-medium" style={{ color: LOGISTICS_GREEN }}>{spec.capacity} CBM</div>
                          </div>
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <Scale className="h-5 w-5 mx-auto mb-2 text-purple-500" />
                            <div className="text-sm text-muted-foreground">Max Payload</div>
                            <div className="font-medium">{(spec.maxPayload / 1000).toFixed(1)} MT</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold mb-3">Key Specifications</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type</span>
                              <span className="font-medium">{spec.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">TEU</span>
                              <span className="font-medium">{spec.teu}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tare Weight</span>
                              <span className="font-medium">{(spec.tareWeight / 1000).toFixed(2)} MT</span>
                            </div>
                            {spec.doorWidth && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Door Width</span>
                                  <span className="font-medium">{spec.doorWidth}m</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Door Height</span>
                                  <span className="font-medium">{spec.doorHeight}m</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border" style={{ borderColor: `${OCEAN_BLUE}30`, backgroundColor: `${OCEAN_BLUE}08` }}>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Info className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                            Best For
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {spec.type === "Dry Van" && (
                              <>
                                <li>• General cargo and consumer goods</li>
                                <li>• Palletized cargo</li>
                                <li>• Boxes and cartons</li>
                                <li>• Most common container type</li>
                              </>
                            )}
                            {spec.type === "High Cube" && (
                              <>
                                <li>• Tall cargo and voluminous goods</li>
                                <li>• Light but bulky items</li>
                                <li>• Maximizes volume per shipment</li>
                                <li>• Popular for e-commerce</li>
                              </>
                            )}
                            {spec.type === "Reefer" && (
                              <>
                                <li>• Perishable goods and food</li>
                                <li>• Pharmaceuticals</li>
                                <li>• Temperature-sensitive cargo</li>
                                <li>• Maintains -25°C to +25°C</li>
                              </>
                            )}
                            {spec.type === "Open Top" && (
                              <>
                                <li>• Oversized cargo</li>
                                <li>• Heavy machinery (top loading)</li>
                                <li>• Tall items that won&apos;t fit through doors</li>
                                <li>• Project cargo</li>
                              </>
                            )}
                            {spec.type === "Flat Rack" && (
                              <>
                                <li>• Heavy machinery and equipment</li>
                                <li>• Oversized cargo</li>
                                <li>• Construction materials</li>
                                <li>• No height restrictions</li>
                              </>
                            )}
                            {spec.type === "Tank" && (
                              <>
                                <li>• Liquid bulk cargo</li>
                                <li>• Chemicals and hazardous liquids</li>
                                <li>• Food-grade liquids</li>
                                <li>• Oil and fuel products</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Selection Guide */}
        <TabsContent value="selection" className="space-y-6">
          {/* Educational Content: Selection Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                {educationalContent.selection.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{educationalContent.selection.content}</p>
            </CardContent>
          </Card>

          {/* Educational Content: Special Containers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                {educationalContent.specialContainers.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{educationalContent.specialContainers.content}</p>
            </CardContent>
          </Card>

          {/* Selection Decision Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Container Selection Decision Matrix</CardTitle>
              <CardDescription>
                Choose the right container based on your cargo characteristics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    cargo: "General Cargo (Boxes, Cartons)",
                    container: "20' STD or 40' STD",
                    reason: "Most cost-effective for standard shipments",
                    icon: Package,
                  },
                  {
                    cargo: "Light, Bulky Cargo (Furniture, Cotton)",
                    container: "40' HC or 45' HC",
                    reason: "Maximum volume utilization for lightweight goods",
                    icon: Box,
                  },
                  {
                    cargo: "Heavy, Dense Cargo (Metals, Minerals)",
                    container: "20' STD",
                    reason: "Weight limit reached before volume is filled",
                    icon: Scale,
                  },
                  {
                    cargo: "Perishable Goods (Food, Pharma)",
                    container: "20' RF or 40' RF",
                    reason: "Temperature control for sensitive cargo",
                    icon: Thermometer,
                  },
                  {
                    cargo: "Oversized Cargo (Machinery, Equipment)",
                    container: "Open Top or Flat Rack",
                    reason: "No height/width restrictions for large items",
                    icon: Container,
                  },
                  {
                    cargo: "Liquids (Chemicals, Oil, Food-grade)",
                    container: "20' Tank",
                    reason: "Specialized vessel for safe liquid transport",
                    icon: Truck,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${CHART_COLORS[index % CHART_COLORS.length]}15` }}
                    >
                      <item.icon className="h-5 w-5" style={{ color: CHART_COLORS[index % CHART_COLORS.length] }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.cargo}</div>
                      <div className="text-sm" style={{ color: LOGISTICS_GREEN }}>
                        Recommended: {item.container}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{item.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cargo Weight vs Volume Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Cargo Weight vs. Volume Considerations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                      <Scale className="h-6 w-6" style={{ color: OCEAN_BLUE }} />
                    </div>
                    <div>
                      <div className="font-semibold">Heavy Cargo</div>
                      <div className="text-sm text-muted-foreground">Weight &gt; 500 kg/CBM</div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                    <p className="text-sm">
                      <strong>Rule:</strong> Weight capacity is reached before volume is filled.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Examples: Steel products, tiles, machinery parts, minerals, paper.
                    </p>
                    <p className="text-sm" style={{ color: LOGISTICS_GREEN }}>
                      <strong>Tip:</strong> Use 20&apos; containers to maximize payload efficiency.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${LOGISTICS_GREEN}15` }}>
                      <Box className="h-6 w-6" style={{ color: LOGISTICS_GREEN }} />
                    </div>
                    <div>
                      <div className="font-semibold">Light Cargo</div>
                      <div className="text-sm text-muted-foreground">Weight &lt; 250 kg/CBM</div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                    <p className="text-sm">
                      <strong>Rule:</strong> Volume capacity is reached before weight limit.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Examples: Furniture, clothing, toys, insulation, plastic products.
                    </p>
                    <p className="text-sm" style={{ color: LOGISTICS_GREEN }}>
                      <strong>Tip:</strong> Use 40&apos; HC for maximum volume at similar freight cost.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Visual Guide */}
        <TabsContent value="visual" className="space-y-6">
          {/* Capacity Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Capacity Comparison by Container Type
              </CardTitle>
              <CardDescription>
                Visual comparison of volume (CBM) and payload (MT) across all container types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capacityData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="capacity" name="Capacity (CBM)" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="payload" name="Payload (MT)" fill={LOGISTICS_GREEN} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Container Type Distribution */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Container Type Distribution</CardTitle>
                <CardDescription>
                  Breakdown of container types in the global fleet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {typeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volume Utilization Analysis</CardTitle>
                <CardDescription>
                  Typical utilization rates for standard containers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={utilizationData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} className="text-muted-foreground" />
                      <YAxis dataKey="name" type="category" className="text-muted-foreground" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="volume" name="Volume Utilization %" fill={OCEAN_BLUE} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="weight" name="Weight Utilization %" fill={LOGISTICS_GREEN} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visual Container Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Size Comparison Visual</CardTitle>
              <CardDescription>
                Relative size comparison of major container types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["20std", "40std", "40hc", "45hc"].map((type, index) => {
                  const spec = containerSpecs[type as ContainerType];
                  const width = (spec.internalLength / 13.556) * 100;
                  const height = (spec.internalHeight / 2.698) * 100;
                  
                  return (
                    <div key={type} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium">{spec.name}</div>
                      <div className="flex-1 flex items-center justify-center">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="relative border-2 rounded-sm flex items-center justify-center"
                          style={{ 
                            height: `${height * 1.5}px`,
                            minWidth: "80px",
                            borderColor: CHART_COLORS[index],
                            backgroundColor: `${CHART_COLORS[index]}15`
                          }}
                        >
                          <span className="text-xs font-medium">{spec.capacity} CBM</span>
                        </motion.div>
                      </div>
                      <div className="w-20 text-sm text-muted-foreground text-right">
                        {spec.teu} TEU
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about container specifications and selection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {containerFAQ.map((faq, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${OCEAN_BLUE}15` }}
                        >
                          <span className="text-sm font-medium" style={{ color: OCEAN_BLUE }}>{index + 1}</span>
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                      {expandedFAQ === index ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 pl-16">
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Help Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4" style={{ borderLeftColor: OCEAN_BLUE }}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                  Important Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: LOGISTICS_GREEN }} />
                    Always verify actual dimensions with your shipping line
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: LOGISTICS_GREEN }} />
                    Door dimensions may limit cargo that fits inside
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: LOGISTICS_GREEN }} />
                    Weight limits vary by country and transport mode
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: LOGISTICS_GREEN }} />
                    Container availability can affect your choice
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: LOGISTICS_GREEN }}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ship className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                  Need More Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our logistics experts are available to help you choose the right container for your cargo.
                </p>
                <Button className="w-full" style={{ backgroundColor: LOGISTICS_GREEN }}>
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
