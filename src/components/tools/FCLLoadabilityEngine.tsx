"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Container,
  Box,
  Weight,
  Ruler,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Package,
  Truck,
  Ship,
  ArrowRight,
  Layers,
  Sparkles,
  TrendingUp,
  Gauge,
  Boxes,
  Maximize2,
  ClipboardList,
  HelpCircle,
  BookOpen,
  Zap,
  Target,
  AlertCircle,
} from "lucide-react";
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
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";

// Container specifications
const CONTAINERS = {
  "20GP": {
    name: "20' General Purpose",
    internalLength: 5.898,
    internalWidth: 2.352,
    internalHeight: 2.393,
    capacity: 33.2, // CBM
    maxPayload: 21700, // kg
    tareWeight: 2300, // kg
    doorWidth: 2.343,
    doorHeight: 2.280,
    color: "#0F4C81",
    description: "Standard dry container for general cargo",
    bestFor: ["Dry goods", "Palletized cargo", "Boxes", "Machinery parts"],
  },
  "40GP": {
    name: "40' General Purpose",
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.393,
    capacity: 67.7,
    maxPayload: 25800,
    tareWeight: 3750,
    doorWidth: 2.343,
    doorHeight: 2.280,
    color: "#2E8B57",
    description: "Standard 40ft container for larger shipments",
    bestFor: ["Large shipments", "Volume cargo", "Furniture", "Appliances"],
  },
  "40HC": {
    name: "40' High Cube",
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.698,
    capacity: 76.3,
    maxPayload: 26330,
    tareWeight: 3950,
    doorWidth: 2.343,
    doorHeight: 2.585,
    color: "#0F4C81",
    description: "Extra height for voluminous cargo",
    bestFor: ["Light voluminous cargo", "Tall items", "Furniture", "Cotton/textiles"],
  },
  "45HC": {
    name: "45' High Cube",
    internalLength: 13.556,
    internalWidth: 2.352,
    internalHeight: 2.698,
    capacity: 86.0,
    maxPayload: 25500,
    tareWeight: 4700,
    doorWidth: 2.343,
    doorHeight: 2.585,
    color: "#2E8B57",
    description: "Maximum capacity dry container",
    bestFor: ["Maximum volume shipments", "Light cargo", "E-commerce"],
  },
  "20RF": {
    name: "20' Refrigerated",
    internalLength: 5.456,
    internalWidth: 2.290,
    internalHeight: 2.260,
    capacity: 28.3,
    maxPayload: 21150,
    tareWeight: 2940,
    doorWidth: 2.290,
    doorHeight: 2.238,
    color: "#3B82F6",
    description: "Temperature controlled container",
    bestFor: ["Perishables", "Pharmaceuticals", "Frozen foods", "Chemicals"],
  },
  "40RF": {
    name: "40' Refrigerated",
    internalLength: 11.584,
    internalWidth: 2.290,
    internalHeight: 2.268,
    capacity: 60.1,
    maxPayload: 24810,
    tareWeight: 4370,
    doorWidth: 2.290,
    doorHeight: 2.246,
    color: "#3B82F6",
    description: "Large temperature controlled container",
    bestFor: ["Large perishable shipments", "Cold chain logistics"],
  },
  "20OT": {
    name: "20' Open Top",
    internalLength: 5.898,
    internalWidth: 2.352,
    internalHeight: 2.346,
    capacity: 32.7,
    maxPayload: 21740,
    tareWeight: 2360,
    doorWidth: 2.340,
    doorHeight: 2.330,
    color: "#F59E0B",
    description: "Open top for over-height cargo",
    bestFor: ["Over-height cargo", "Heavy machinery", "Glass sheets", "Wood logs"],
  },
  "40OT": {
    name: "40' Open Top",
    internalLength: 12.032,
    internalWidth: 2.340,
    internalHeight: 2.350,
    capacity: 66.2,
    maxPayload: 26140,
    tareWeight: 3860,
    doorWidth: 2.330,
    doorHeight: 2.340,
    color: "#F59E0B",
    description: "Large open top container",
    bestFor: ["Large over-height items", "Project cargo"],
  },
  "20FR": {
    name: "20' Flat Rack",
    internalLength: 5.634,
    internalWidth: 2.210,
    internalHeight: 2.127,
    capacity: 26.5,
    maxPayload: 22110,
    tareWeight: 2690,
    doorWidth: 0,
    doorHeight: 0,
    color: "#EF4444",
    description: "Platform for heavy/oversized cargo",
    bestFor: ["Heavy machinery", "Oversized equipment", "Vehicles", "Project cargo"],
  },
  "40FR": {
    name: "40' Flat Rack",
    internalLength: 11.752,
    internalWidth: 2.124,
    internalHeight: 1.965,
    capacity: 49.0,
    maxPayload: 39400,
    tareWeight: 5500,
    doorWidth: 0,
    doorHeight: 0,
    color: "#EF4444",
    description: "Large platform for heavy cargo",
    bestFor: ["Heavy oversized cargo", "Construction equipment", "Industrial machinery"],
  },
};

// Pallet specifications
const PALLETS = {
  "EUR": { name: "Euro Pallet", length: 1.2, width: 0.8, height: 0.144, maxWeight: 1500 },
  "US": { name: "US Standard", length: 1.219, width: 1.016, height: 0.152, maxWeight: 2000 },
  "ISO": { name: "ISO Pallet", length: 1.0, width: 1.2, height: 0.144, maxWeight: 1500 },
  "ASIA": { name: "Asian Pallet", length: 1.1, width: 1.1, height: 0.144, maxWeight: 1000 },
};

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is the difference between a 40GP and 40HC container?",
    answer: "The main difference is the internal height. A 40GP (General Purpose) has an internal height of 2.393m, while a 40HC (High Cube) has an internal height of 2.698m - approximately 30cm taller. This extra height translates to about 8.6 CBM more capacity (67.7 CBM vs 76.3 CBM). High Cube containers are ideal for voluminous but lightweight cargo, while standard containers are better for denser cargo where weight limits are reached before volume limits. The choice between GP and HC should be based on your cargo's density and stacking requirements.",
  },
  {
    question: "How do I know if my container is weight-limited or volume-limited?",
    answer: "A container is weight-limited when you reach the maximum payload weight before filling the volume capacity. This typically happens with dense cargo like metals, minerals, or heavy machinery. A container is volume-limited when you fill the cubic capacity before reaching the weight limit, common with light goods like cotton, foam, or empty packaging. To determine this, calculate both your volume utilization percentage (total volume / container capacity) and weight utilization percentage (total weight / max payload). Whichever reaches 100% first is your limiting factor. Understanding this helps you optimize container selection and potentially reduce shipping costs per unit.",
  },
  {
    question: "What is the optimal pallet arrangement for a 40' container?",
    answer: "For a standard 40' container, the optimal pallet arrangement depends on your pallet type. Euro pallets (1.2m × 0.8m) can fit approximately 25 pallets in a single tier when loaded lengthwise (5 rows of 5 pallets). US Standard pallets (1.219m × 1.016m) typically fit 20 pallets. For High Cube containers, you may be able to double-stack pallets if your cargo allows, effectively doubling capacity to 40-50 pallets. Always consider the pallet overhang restrictions, load stability, and proper air circulation requirements when planning your pallet arrangement. Using palletized loading can improve efficiency but typically results in 10-15% volume utilization loss compared to floor-loaded cargo.",
  },
  {
    question: "Can I mix different cargo types in one FCL container?",
    answer: "Yes, you can mix different cargo types in one FCL container, but there are important considerations. First, ensure compatibility - don't mix hazardous materials with food products, or chemicals with consumer goods. Second, consider weight distribution - heavier items should be loaded at the bottom and distributed evenly across the container floor. Third, be aware of stowage requirements - some cargo may need specific temperature control or ventilation. Fourth, consider insurance implications as mixed cargo may require comprehensive coverage. Finally, proper documentation is essential - each commodity type should be clearly listed on the packing list and bill of lading with accurate weights and dimensions.",
  },
  {
    question: "What happens if I exceed the container's payload weight?",
    answer: "Exceeding the container's payload weight has serious consequences. First, the container may not be accepted by the shipping line, causing delays and additional costs. Second, if loaded overweight, the container risks structural failure during handling or transport, potentially causing cargo damage and safety hazards. Third, overweight containers may be refused at ports, resulting in expensive re-handling fees, storage charges, and possible fines. Fourth, road transport weight limits (often 20-24 tons per container depending on jurisdiction) may be exceeded, leading to regulatory violations. If your cargo exceeds capacity, solutions include using multiple containers, switching to a higher payload container type (like 40' Flat Rack for heavy cargo), or reducing shipment weight.",
  },
  {
    question: "How does temperature affect container loadability?",
    answer: "Temperature affects container loadability in several ways. For standard dry containers, extreme temperatures can cause cargo expansion or contraction, requiring additional spacing. Moisture-sensitive goods may require desiccants, reducing usable space. For refrigerated containers (reefers), the cooling unit occupies space, reducing effective capacity by 2-4 CBM compared to standard containers. Temperature-controlled shipments also require proper air circulation - cargo should never touch container walls or block airflow, typically requiring a 10-15cm gap, which reduces effective loading space. Additionally, temperature-stable cargo may require insulated blankets or special packaging that adds to dimensions and weight.",
  },
  {
    question: "What documentation is required for FCL shipments?",
    answer: "FCL shipments require comprehensive documentation. Essential documents include: (1) Booking Confirmation - confirms space reservation with the shipping line; (2) Bill of Lading - the contract of carriage and receipt of goods; (3) Commercial Invoice - declares cargo value for customs; (4) Packing List - details all items, weights, and dimensions; (5) Container Load Plan - shows cargo placement within the container; (6) Certificate of Origin - may be required for preferential duty rates; (7) Customs Declaration - for export clearance; (8) Dangerous Goods Declaration - if shipping hazardous materials; (9) Insurance Certificate - proof of cargo insurance; (10) VGM (Verified Gross Mass) Declaration - mandatory under SOLAS regulations. Proper documentation ensures smooth customs clearance and reduces the risk of delays or penalties.",
  },
];

// Optimization Tips
const OPTIMIZATION_TIPS = [
  {
    title: "Maximize Floor Space",
    description: "Load cargo from floor to ceiling to utilize vertical space. Use stackable cartons and ensure proper weight distribution at the bottom.",
    icon: Layers,
  },
  {
    title: "Choose the Right Container",
    description: "High Cube containers offer 12% more volume for voluminous cargo. Flat Racks handle heavy machinery better than standard containers.",
    icon: Container,
  },
  {
    title: "Optimize Pallet Selection",
    description: "Euro pallets (1.2m × 0.8m) fit more efficiently in containers than US standard pallets. Consider pallet dimensions when packaging products.",
    icon: Boxes,
  },
  {
    title: "Consider Cargo Density",
    description: "For cargo density over 500 kg/CBM, you're likely weight-limited. For under 300 kg/CBM, you're volume-limited. Adjust container choice accordingly.",
    icon: Weight,
  },
  {
    title: "Use Double-Stacking",
    description: "In High Cube containers, palletized cargo can often be double-stacked. Ensure bottom pallets can support the weight and cargo is stackable.",
    icon: Maximize2,
  },
  {
    title: "Plan Door Space",
    description: "Leave adequate space near container doors for customs inspection. Consider bracing requirements for cargo that may shift during transport.",
    icon: Package,
  },
];

interface CargoItem {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  stackable: boolean;
  stackLimit: number;
}

interface LoadabilityResult {
  totalVolume: number;
  totalWeight: number;
  volumeUtilization: number;
  weightUtilization: number;
  itemsFit: number;
  remainingVolume: number;
  remainingWeight: number;
  palletsFit: number;
  recommendation: string;
  warningLevel: "safe" | "caution" | "danger";
  cargoDensity: number;
  limitingFactor: "weight" | "volume" | "balanced";
}

export function FCLLoadabilityEngine() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [containerType, setContainerType] = useState<keyof typeof CONTAINERS>("40HC");
  const [palletType, setPalletType] = useState<keyof typeof PALLETS>("EUR");
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([
    { id: "1", name: "Box A", length: 0.6, width: 0.4, height: 0.3, weight: 25, quantity: 100, stackable: true, stackLimit: 3 },
  ]);
  const [palletizedMode, setPalletizedMode] = useState(true);
  const [dimensionUnit, setDimensionUnit] = useState<"m" | "cm" | "ft">("m");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");

  const container = CONTAINERS[containerType];

  // Calculate loadability
  const result = useMemo((): LoadabilityResult => {
    let totalVolume = 0;
    let totalWeight = 0;
    let itemsFit = 0;

    cargoItems.forEach((item) => {
      const itemVolume = item.length * item.width * item.height * item.quantity;
      const itemWeight = item.weight * item.quantity;
      totalVolume += itemVolume;
      totalWeight += itemWeight;
      itemsFit += item.quantity;
    });

    const volumeUtilization = (totalVolume / container.capacity) * 100;
    const weightUtilization = (totalWeight / container.maxPayload) * 100;
    const remainingVolume = container.capacity - totalVolume;
    const remainingWeight = container.maxPayload - totalWeight;

    // Calculate pallet fit
    const pallet = PALLETS[palletType];
    const palletArea = pallet.length * pallet.width;
    const containerFloorArea = container.internalLength * container.internalWidth;
    const palletsFit = Math.floor(containerFloorArea / palletArea);

    // Calculate cargo density
    const cargoDensity = totalVolume > 0 ? totalWeight / totalVolume : 0;

    // Determine limiting factor
    let limitingFactor: "weight" | "volume" | "balanced" = "balanced";
    if (weightUtilization > volumeUtilization + 10) {
      limitingFactor = "weight";
    } else if (volumeUtilization > weightUtilization + 10) {
      limitingFactor = "volume";
    }

    // Determine recommendation
    let recommendation = "";
    let warningLevel: "safe" | "caution" | "danger" = "safe";

    if (weightUtilization > 100) {
      recommendation = "OVERWEIGHT: Reduce cargo weight or use multiple containers";
      warningLevel = "danger";
    } else if (volumeUtilization > 100) {
      recommendation = "OVERVOLUME: Cargo exceeds container capacity";
      warningLevel = "danger";
    } else if (weightUtilization > 90 && volumeUtilization < 70) {
      recommendation = "Weight-limited: Consider high-cube or light-weight solutions";
      warningLevel = "caution";
    } else if (volumeUtilization > 90 && weightUtilization < 70) {
      recommendation = "Volume-limited: Consider denser packing or pallet optimization";
      warningLevel = "caution";
    } else if (volumeUtilization > 80 && weightUtilization > 80) {
      recommendation = "Excellent utilization: Both volume and weight optimized";
      warningLevel = "safe";
    } else {
      recommendation = "Good utilization with room for optimization";
      warningLevel = "safe";
    }

    return {
      totalVolume,
      totalWeight,
      volumeUtilization: Math.min(volumeUtilization, 100),
      weightUtilization: Math.min(weightUtilization, 100),
      itemsFit,
      remainingVolume,
      remainingWeight,
      palletsFit,
      recommendation,
      warningLevel,
      cargoDensity,
      limitingFactor,
    };
  }, [cargoItems, container, palletType]);

  // Chart data for utilization
  const utilizationData = [
    { name: "Volume", value: result.volumeUtilization, fill: "#0F4C81" },
    { name: "Weight", value: result.weightUtilization, fill: "#2E8B57" },
  ];

  // Chart data for space distribution
  const spaceData = [
    { name: "Used", value: result.totalVolume, fill: "#0F4C81" },
    { name: "Available", value: Math.max(result.remainingVolume, 0), fill: "#E5E7EB" },
  ];

  // Container comparison data
  const containerComparisonData = Object.entries(CONTAINERS).slice(0, 5).map(([key, c]) => ({
    name: key,
    capacity: c.capacity,
    payload: c.maxPayload / 1000,
    efficiency: (c.capacity / (c.maxPayload / 1000)).toFixed(2),
  }));

  // Cargo distribution chart data
  const cargoDistributionData = cargoItems.map((item) => ({
    name: item.name,
    volume: item.length * item.width * item.height * item.quantity,
    weight: item.weight * item.quantity / 1000,
  }));

  // Utilization gauge data for radar
  const utilizationRadarData = [
    { subject: "Volume", A: result.volumeUtilization, fullMark: 100 },
    { subject: "Weight", A: result.weightUtilization, fullMark: 100 },
    { subject: "Efficiency", A: Math.min(result.volumeUtilization, result.weightUtilization), fullMark: 100 },
    { subject: "Balance", A: 100 - Math.abs(result.volumeUtilization - result.weightUtilization), fullMark: 100 },
  ];

  const COLORS = ["#0F4C81", "#E5E7EB"];

  const addItem = () => {
    setCargoItems([
      ...cargoItems,
      {
        id: Date.now().toString(),
        name: `Item ${cargoItems.length + 1}`,
        length: 0.5,
        width: 0.4,
        height: 0.3,
        weight: 20,
        quantity: 50,
        stackable: true,
        stackLimit: 3,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setCargoItems(cargoItems.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof CargoItem, value: string | number | boolean) => {
    setCargoItems(
      cargoItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const getWarningColor = (level: "safe" | "caution" | "danger") => {
    switch (level) {
      case "danger":
        return "text-destructive";
      case "caution":
        return "text-yellow-500";
      default:
        return "text-[var(--logistics)]";
    }
  };

  const handleExport = () => {
    const data = {
      container: containerType,
      containerSpecs: container,
      cargoItems,
      results: result,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fcl-loadability-${containerType}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const shareText = `FCL Loadability Report\nContainer: ${container.name}\nVolume: ${result.totalVolume.toFixed(2)} CBM (${result.volumeUtilization.toFixed(1)}%)\nWeight: ${(result.totalWeight / 1000).toFixed(2)}t (${result.weightUtilization.toFixed(1)}%)\nStatus: ${result.recommendation}`;
    if (navigator.share) {
      navigator.share({
        title: "FCL Loadability Report",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const handleReset = () => {
    setCargoItems([
      { id: "1", name: "Box A", length: 0.6, width: 0.4, height: 0.3, weight: 25, quantity: 100, stackable: true, stackLimit: 3 },
    ]);
    setContainerType("40HC");
    setPalletType("EUR");
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ocean)] via-[var(--ocean)]/90 to-[var(--logistics)] p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
              <Sparkles className="h-3 w-3 mr-1" />
              Container Optimization
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">FCL Loadability Engine</h2>
            <p className="text-white/80 max-w-2xl text-lg">
              Maximize your container utilization with intelligent loadability calculations.
              Optimize cargo placement, compare container types, and achieve cost-efficient shipping.
            </p>
          </motion.div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Container className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Container Type</p>
                  <p className="text-xl font-bold">{containerType}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">CBM Used</p>
                  <p className="text-xl font-bold">{result.totalVolume.toFixed(2)} / {container.capacity}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Gauge className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Weight Utilization</p>
                  <p className="text-xl font-bold">{result.weightUtilization.toFixed(1)}%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="flex items-center gap-1">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="containers" className="flex items-center gap-1">
            <Container className="h-4 w-4" />
            <span className="hidden sm:inline">Container Types</span>
          </TabsTrigger>
          <TabsTrigger value="3d" className="flex items-center gap-1">
            <Box className="h-4 w-4" />
            <span className="hidden sm:inline">3D View</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Optimization</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Container Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Container className="h-5 w-5 text-[var(--ocean)]" />
                    Container Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(CONTAINERS).slice(0, 5).map(([key, c]) => (
                      <div
                        key={key}
                        onClick={() => setContainerType(key as keyof typeof CONTAINERS)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                          containerType === key
                            ? "border-[var(--ocean)] bg-[var(--ocean)]/10"
                            : "border-border hover:border-[var(--ocean)]/50"
                        }`}
                      >
                        <p className="font-bold text-sm">{key}</p>
                        <p className="text-xs text-muted-foreground">{c.capacity} CBM</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mode Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Cargo Configuration
                  </CardTitle>
                  <CardDescription>Add your cargo items for loadability analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Layers className="h-5 w-5 text-[var(--ocean)]" />
                      <div>
                        <p className="font-medium">Palletized Mode</p>
                        <p className="text-sm text-muted-foreground">Cargo loaded on pallets</p>
                      </div>
                    </div>
                    <Switch
                      checked={palletizedMode}
                      onCheckedChange={setPalletizedMode}
                    />
                  </div>

                  {palletizedMode && (
                    <div>
                      <Label>Pallet Type</Label>
                      <Select value={palletType} onValueChange={(v) => setPalletType(v as keyof typeof PALLETS)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PALLETS).map(([key, pallet]) => (
                            <SelectItem key={key} value={key}>
                              {pallet.name} ({pallet.length}m × {pallet.width}m)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Unit Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Dimension Unit</Label>
                      <Select value={dimensionUnit} onValueChange={(v) => setDimensionUnit(v as "m" | "cm" | "ft")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="m">Meters (m)</SelectItem>
                          <SelectItem value="cm">Centimeters (cm)</SelectItem>
                          <SelectItem value="ft">Feet (ft)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Weight Unit</Label>
                      <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as "kg" | "lb")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="lb">Pounds (lb)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cargo Items */}
              {cargoItems.map((item, index) => (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Box className="h-5 w-5 text-[var(--ocean)]" />
                        {item.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Item Name</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label>Length ({dimensionUnit})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.length}
                          onChange={(e) => updateItem(item.id, "length", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Width ({dimensionUnit})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.width}
                          onChange={(e) => updateItem(item.id, "width", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Height ({dimensionUnit})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.height}
                          onChange={(e) => updateItem(item.id, "height", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Weight ({weightUnit})</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={item.weight}
                          onChange={(e) => updateItem(item.id, "weight", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={item.stackable}
                          onCheckedChange={(v) => updateItem(item.id, "stackable", v)}
                        />
                        <Label>Stackable</Label>
                      </div>
                      {item.stackable && (
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-muted-foreground">Max Stack:</Label>
                          <Input
                            type="number"
                            className="w-16"
                            value={item.stackLimit}
                            onChange={(e) => updateItem(item.id, "stackLimit", parseInt(e.target.value) || 1)}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addItem} variant="outline" className="w-full">
                <Package className="h-4 w-4 mr-2" />
                Add Another Item
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Summary Cards */}
              <Card className="border-[var(--ocean)]/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Volume Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[var(--ocean)]">
                    {result.totalVolume.toFixed(2)} CBM
                  </p>
                  <Progress value={result.volumeUtilization} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.volumeUtilization.toFixed(1)}% of {container.capacity} CBM
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[var(--logistics)]/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Weight Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[var(--logistics)]">
                    {(result.totalWeight / 1000).toFixed(2)}t
                  </p>
                  <Progress value={result.weightUtilization} className="mt-2 h-2" style={{ backgroundColor: '#E5E7EB' }} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.weightUtilization.toFixed(1)}% of {(container.maxPayload / 1000).toFixed(1)}t payload
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">Cargo Density</p>
                    <Badge variant="secondary">{result.cargoDensity.toFixed(1)} kg/CBM</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Limiting Factor</p>
                    <Badge style={{
                      backgroundColor: result.limitingFactor === 'weight' ? '#0F4C8120' : result.limitingFactor === 'volume' ? '#2E8B5720' : '#F59E0B20',
                      color: result.limitingFactor === 'weight' ? '#0F4C81' : result.limitingFactor === 'volume' ? '#2E8B57' : '#F59E0B'
                    }}>
                      {result.limitingFactor.charAt(0).toUpperCase() + result.limitingFactor.slice(1)}-limited
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation */}
              <Card className={`border-${result.warningLevel === "danger" ? "destructive" : result.warningLevel === "caution" ? "yellow-500" : "[var(--logistics)]"}/20`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    {result.warningLevel === "danger" ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : result.warningLevel === "caution" ? (
                      <Info className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                    )}
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${getWarningColor(result.warningLevel)}`}>
                    {result.recommendation}
                  </p>
                </CardContent>
              </Card>

              {/* Utilization Chart */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Utilization Gauge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={utilizationData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <YAxis dataKey="name" type="category" width={60} />
                        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {utilizationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Item Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Item Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Dimensions</th>
                      <th className="text-right py-2">Unit Vol.</th>
                      <th className="text-right py-2">Total Vol.</th>
                      <th className="text-right py-2">Total Wt.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargoItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.name}</td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">
                          {item.length}×{item.width}×{item.height}
                        </td>
                        <td className="text-right">
                          {(item.length * item.width * item.height).toFixed(3)} CBM
                        </td>
                        <td className="text-right">
                          {(item.length * item.width * item.height * item.quantity).toFixed(2)} CBM
                        </td>
                        <td className="text-right">
                          {(item.weight * item.quantity).toFixed(1)} {weightUnit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td className="py-2">Total</td>
                      <td className="text-right">{result.itemsFit}</td>
                      <td></td>
                      <td></td>
                      <td className="text-right">{result.totalVolume.toFixed(2)} CBM</td>
                      <td className="text-right">{result.totalWeight.toFixed(1)} {weightUnit}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Container Types */}
        <TabsContent value="containers" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-[var(--ocean)]/20 bg-gradient-to-br from-[var(--ocean)]/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                Understanding FCL Container Types
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Full Container Load (FCL) shipping offers a variety of container types, each designed to accommodate specific cargo requirements. Understanding the differences between container types is crucial for optimizing your shipping costs and ensuring cargo safety. The most common container types include General Purpose (GP) containers for standard dry cargo, High Cube (HC) containers for voluminous lightweight goods, Refrigerated (RF) containers for temperature-sensitive cargo, Open Top (OT) containers for over-height items, and Flat Rack (FR) containers for heavy or oversized cargo that cannot fit in standard containers.
              </p>
              <p className="text-muted-foreground mt-4">
                When selecting a container type, consider not only the dimensions and capacity but also the nature of your cargo, handling requirements, and specific shipping route limitations. For instance, High Cube containers may not be available on all routes, and Open Top containers require special tarpaulin covers. Refrigerated containers require power connections throughout the journey, including at transshipment ports. Flat Rack containers are typically used for project cargo and may require specialized handling equipment at origin and destination ports. Understanding these nuances helps you make informed decisions and avoid unexpected costs or delays during shipment.
              </p>
            </CardContent>
          </Card>

          {/* Container Selection Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(CONTAINERS).map(([key, c]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  containerType === key ? "ring-2 ring-[var(--ocean)]" : ""
                }`}
                onClick={() => setContainerType(key as keyof typeof CONTAINERS)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${c.color}20` }}
                      >
                        <Container className="h-5 w-5" style={{ color: c.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{key}</CardTitle>
                        <p className="text-xs text-muted-foreground">{c.name.split("'")[1]}</p>
                      </div>
                    </div>
                    {containerType === key && (
                      <CheckCircle2 className="h-5 w-5 text-[var(--ocean)]" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="text-xs text-muted-foreground">Capacity</p>
                      <p className="font-bold">{c.capacity} CBM</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="text-xs text-muted-foreground">Max Payload</p>
                      <p className="font-bold">{(c.maxPayload / 1000).toFixed(1)}t</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Internal Dimensions:</p>
                    <p className="text-sm">{c.internalLength}m × {c.internalWidth}m × {c.internalHeight}m</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Best For:</p>
                    <div className="flex flex-wrap gap-1">
                      {c.bestFor.slice(0, 2).map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Container Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Container Capacity Comparison</CardTitle>
              <CardDescription>Compare capacity and payload across container types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={containerComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="capacity" name="Capacity (CBM)" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="payload" name="Payload (t)" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Specifications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Container Specifications Reference</CardTitle>
              <CardDescription>Detailed specifications for all container types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-right py-3 px-4 font-semibold">Length (m)</th>
                      <th className="text-right py-3 px-4 font-semibold">Width (m)</th>
                      <th className="text-right py-3 px-4 font-semibold">Height (m)</th>
                      <th className="text-right py-3 px-4 font-semibold">Capacity (CBM)</th>
                      <th className="text-right py-3 px-4 font-semibold">Payload (kg)</th>
                      <th className="text-right py-3 px-4 font-semibold">Tare (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(CONTAINERS).map(([key, c]) => (
                      <tr key={key} className="border-b hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <Badge style={{ backgroundColor: `${c.color}20`, color: c.color }}>{key}</Badge>
                        </td>
                        <td className="py-3 px-4">{c.name}</td>
                        <td className="text-right py-3 px-4">{c.internalLength}</td>
                        <td className="text-right py-3 px-4">{c.internalWidth}</td>
                        <td className="text-right py-3 px-4">{c.internalHeight}</td>
                        <td className="text-right py-3 px-4 font-medium">{c.capacity}</td>
                        <td className="text-right py-3 px-4">{c.maxPayload.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">{c.tareWeight.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 3D View */}
        <TabsContent value="3d" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5 text-[var(--ocean)]" />
                3D Container Visualization
              </CardTitle>
              <CardDescription>Visual representation of cargo loading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* 3D Container Visualization */}
                <div className="absolute inset-4 border-2 border-[var(--ocean)]/30 rounded-lg">
                  <div className="absolute top-0 left-0 bg-[var(--ocean)]/10 p-2 rounded-br">
                    <Ship className="h-4 w-4 text-[var(--ocean)]" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 space-y-2">
                    {cargoItems.slice(0, 3).map((item, idx) => (
                      <div
                        key={item.id}
                        className="h-8 bg-[var(--ocean)]/40 rounded flex items-center px-2"
                        style={{ width: `${Math.min((item.length * item.width * item.height * item.quantity / container.capacity) * 100, 100)}%` }}
                      >
                        <span className="text-xs text-white font-medium truncate">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-4xl font-bold text-[var(--ocean)]">{result.volumeUtilization.toFixed(0)}%</p>
                    <p className="text-sm text-muted-foreground">Volume Utilized</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Container</p>
                  <p className="font-bold">{containerType}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="font-bold">{container.capacity} CBM</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Loaded</p>
                  <p className="font-bold">{result.totalVolume.toFixed(1)} CBM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Space Distribution */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Space Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spaceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)} CBM`}
                      >
                        {spaceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)} CBM`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cargo Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cargoDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" name="Volume (CBM)" />
                      <YAxis yAxisId="right" orientation="right" name="Weight (t)" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="volume" name="Volume (CBM)" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="weight" name="Weight (t)" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Utilization Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Utilization Analysis</CardTitle>
              <CardDescription>Multi-dimensional view of container utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={utilizationRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Utilization" dataKey="A" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.5} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Optimization Guide */}
        <TabsContent value="optimization" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-[var(--logistics)]/20 bg-gradient-to-br from-[var(--logistics)]/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--logistics)]" />
                Maximizing Container Utilization
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Container utilization optimization is both an art and a science that directly impacts your shipping costs and profitability. The goal is to achieve the highest possible utilization percentage for both volume and weight without exceeding either limit. A well-optimized container typically achieves 80-90% volume utilization while staying within 85-95% of weight capacity. Understanding the concept of cargo density is fundamental - it determines whether your container will be volume-limited or weight-limited. Cargo with density above 500 kg/CBM typically faces weight limitations, while cargo below 300 kg/CBM is volume-limited.
              </p>
              <p className="text-muted-foreground mt-4">
                Weight-limited versus volume-limited containers require different optimization strategies. For weight-limited shipments, consider using containers with higher payload ratings, such as 40' Flat Racks for heavy machinery or consolidating dense cargo. For volume-limited shipments, focus on packing efficiency, consider High Cube containers for additional height, and optimize pallet configurations. The choice between palletized and floor-loaded cargo significantly impacts utilization - palletized cargo offers handling efficiency but typically sacrifices 10-15% of volume capacity due to pallet dimensions and air gaps between pallets. Floor-loaded cargo can achieve higher density but requires more labor for loading and unloading.
              </p>
              <p className="text-muted-foreground mt-4">
                Advanced optimization techniques include implementing mixed cargo strategies where high-density and low-density items are combined to balance weight and volume utilization. Using stackable packaging designs, optimizing carton dimensions to fit perfectly within container width, and considering double-stacking in High Cube containers can significantly improve utilization rates. Modern load planning software can help visualize and optimize cargo placement, but understanding the fundamental principles allows you to make better decisions even without specialized tools. Regular analysis of your shipment data can reveal patterns and opportunities for improvement in your supply chain.
              </p>
            </CardContent>
          </Card>

          {/* Optimization Tips Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OPTIMIZATION_TIPS.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-[var(--ocean)]/10">
                        <tip.icon className="h-6 w-6 text-[var(--ocean)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Density Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Cargo Density Analysis</CardTitle>
              <CardDescription>Understanding your cargo&apos;s limiting factor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 ${result.cargoDensity > 500 ? 'border-[var(--ocean)] bg-[var(--ocean)]/10' : 'border-border'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="h-5 w-5 text-[var(--ocean)]" />
                    <span className="font-medium">Weight-Limited</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Density &gt; 500 kg/CBM</p>
                  <p className="text-2xl font-bold mt-2">{result.cargoDensity > 500 ? 'Your Cargo' : '—'}</p>
                </div>
                <div className={`p-4 rounded-lg border-2 ${result.cargoDensity >= 300 && result.cargoDensity <= 500 ? 'border-[var(--logistics)] bg-[var(--logistics)]/10' : 'border-border'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-5 w-5 text-[var(--logistics)]" />
                    <span className="font-medium">Balanced</span>
                  </div>
                  <p className="text-sm text-muted-foreground">300-500 kg/CBM</p>
                  <p className="text-2xl font-bold mt-2">{result.cargoDensity >= 300 && result.cargoDensity <= 500 ? 'Your Cargo' : '—'}</p>
                </div>
                <div className={`p-4 rounded-lg border-2 ${result.cargoDensity < 300 ? 'border-amber-500 bg-amber-500/10' : 'border-border'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Boxes className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Volume-Limited</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Density &lt; 300 kg/CBM</p>
                  <p className="text-2xl font-bold mt-2">{result.cargoDensity < 300 ? 'Your Cargo' : '—'}</p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Your Cargo Density</span>
                  <Badge variant="secondary">{result.cargoDensity.toFixed(1)} kg/CBM</Badge>
                </div>
                <Progress value={Math.min((result.cargoDensity / 600) * 100, 100)} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Light (100 kg/CBM)</span>
                  <span>Heavy (600+ kg/CBM)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Palletized vs Loose Cargo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--ocean)]" />
                Palletized vs Loose Cargo
              </CardTitle>
              <CardDescription>Understanding the trade-offs between loading methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                    Palletized Cargo
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-2 rounded bg-[var(--logistics)]/5">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span className="text-sm">Faster loading/unloading operations</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded bg-[var(--logistics)]/5">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span className="text-sm">Better cargo protection and stability</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded bg-[var(--logistics)]/5">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span className="text-sm">Easier inventory management</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded bg-[var(--logistics)]/5">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span className="text-sm">Suitable for fragile goods</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg mt-2">
                    <p className="text-xs text-muted-foreground">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      Volume loss: 10-15% due to pallet dimensions and air gaps
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Loose/Floor-Loaded Cargo
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-2 rounded bg-[var(--ocean)]/5">
                      <CheckCircle2 className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                      <span className="text-sm">Maximum volume utilization</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded bg-[var(--ocean)]/5">
                      <CheckCircle2 className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                      <span className="text-sm">No pallet weight or cost</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded bg-[var(--ocean)]/5">
                      <CheckCircle2 className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                      <span className="text-sm">Flexible carton sizing</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded bg-[var(--ocean)]/5">
                      <CheckCircle2 className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                      <span className="text-sm">Lower per-CBM shipping cost</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg mt-2">
                    <p className="text-xs text-muted-foreground">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      Higher labor costs for manual loading/unloading
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card className="border-[var(--ocean)]/20 bg-gradient-to-br from-[var(--ocean)]/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about FCL container shipping and loadability</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium hover:text-[var(--ocean)]">
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

          {/* Quick Reference Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Container className="h-4 w-4 text-[var(--ocean)]" />
                  Most Popular
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[var(--ocean)]">40HC</p>
                <p className="text-sm text-muted-foreground">High Cube container offers 76.3 CBM capacity and is ideal for voluminous cargo</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Weight className="h-4 w-4 text-[var(--logistics)]" />
                  Heaviest Payload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[var(--logistics)]">40FR</p>
                <p className="text-sm text-muted-foreground">Flat Rack handles up to 39.4 tonnes for heavy machinery and project cargo</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-amber-500" />
                  Largest Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-500">45HC</p>
                <p className="text-sm text-muted-foreground">Maximum capacity at 86 CBM for lightweight voluminous shipments</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
