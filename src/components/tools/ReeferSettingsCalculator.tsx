"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Thermometer,
  Snowflake,
  Sun,
  Droplets,
  Wind,
  Info,
  AlertTriangle,
  Clock,
  Leaf,
  Package,
  CheckCircle2,
  Container,
  RefreshCw,
  Download,
  Share2,
  BookOpen,
  HelpCircle,
  Settings,
  Layers,
  BarChart3,
  ArrowRight,
  Zap,
  Shield,
  Target,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReeferSettings {
  setTemperature: string;
  ventilation: string;
  humidity: string;
  atmosphere: string;
  preCooling: boolean;
  monitoring: string[];
  warnings: string[];
  recommendations: string[];
}

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Temperature settings for different commodities
const commoditySettings: Record<string, { name: string; temp: string; tempF: string; ventilation: string; humidity: string; atmosphere: string; notes: string[]; shelfLife: string; minTemp: number; maxTemp: number }> = {
  bananas: {
    name: "Bananas",
    temp: "13.3",
    tempF: "56",
    ventilation: "15-30 CBM/h",
    humidity: "85-95%",
    atmosphere: "Controlled Atmosphere recommended",
    notes: ["Ripening can be triggered by ethylene", "Avoid temperature fluctuations", "Monitor for chilling injury below 12°C"],
    shelfLife: "21-35 days",
    minTemp: 13,
    maxTemp: 14,
  },
  apples: {
    name: "Apples",
    temp: "-0.5 to 3",
    tempF: "31-37",
    ventilation: "0-5 CBM/h",
    humidity: "90-95%",
    atmosphere: "CA storage: 1-2% O2, 1-3% CO2",
    notes: ["Sensitive to ethylene", "Long storage possible with CA", "Avoid freezing"],
    shelfLife: "60-180 days",
    minTemp: -0.5,
    maxTemp: 3,
  },
  oranges: {
    name: "Citrus (Oranges)",
    temp: "3-9",
    tempF: "37-48",
    ventilation: "10-15 CBM/h",
    humidity: "85-90%",
    atmosphere: "Standard",
    notes: ["Variety-dependent temperatures", "Sensitive to chilling", "Check for decay regularly"],
    shelfLife: "21-56 days",
    minTemp: 3,
    maxTemp: 9,
  },
  grapes: {
    name: "Grapes",
    temp: "-1 to 0",
    tempF: "30-32",
    ventilation: "0-5 CBM/h",
    humidity: "90-95%",
    atmosphere: "SO2 treatment recommended",
    notes: ["Very sensitive to moisture loss", "Use SO2 pads for decay prevention", "Handle with extreme care"],
    shelfLife: "14-60 days",
    minTemp: -1,
    maxTemp: 0,
  },
  berries: {
    name: "Berries (Strawberries)",
    temp: "-0.5 to 0",
    tempF: "31-32",
    ventilation: "5-10 CBM/h",
    humidity: "90-95%",
    atmosphere: "Standard or Modified Atmosphere",
    notes: ["Very short shelf life", "Pre-cool rapidly", "Highly perishable"],
    shelfLife: "5-7 days",
    minTemp: -0.5,
    maxTemp: 0,
  },
  tomatoes: {
    name: "Tomatoes",
    temp: "12-15",
    tempF: "54-59",
    ventilation: "10-20 CBM/h",
    humidity: "85-90%",
    atmosphere: "Standard",
    notes: ["Ripening fruit", "Sensitive to chilling below 10°C", "Ethylene producer"],
    shelfLife: "7-21 days",
    minTemp: 12,
    maxTemp: 15,
  },
  lettuce: {
    name: "Lettuce & Leafy Greens",
    temp: "0-2",
    tempF: "32-36",
    ventilation: "5-10 CBM/h",
    humidity: "95-100%",
    atmosphere: "Standard",
    notes: ["Very high humidity needed", "Rapid pre-cooling essential", "Sensitive to ethylene"],
    shelfLife: "7-21 days",
    minTemp: 0,
    maxTemp: 2,
  },
  meat_fresh: {
    name: "Fresh Meat",
    temp: "-1.5 to 0",
    tempF: "29-32",
    ventilation: "0 CBM/h",
    humidity: "85-90%",
    atmosphere: "Standard",
    notes: ["Strict temperature control", "USDA/FDA compliance required", "Monitor for temperature abuse"],
    shelfLife: "7-14 days",
    minTemp: -1.5,
    maxTemp: 0,
  },
  meat_frozen: {
    name: "Frozen Meat",
    temp: "-18 to -25",
    tempF: "0 to -13",
    ventilation: "0 CBM/h",
    humidity: "N/A",
    atmosphere: "N/A",
    notes: ["No temperature fluctuations", "Check cold chain integrity", "Maintain below -18°C"],
    shelfLife: "180-365 days",
    minTemp: -25,
    maxTemp: -18,
  },
  fish_fresh: {
    name: "Fresh Fish/Seafood",
    temp: "-1 to 2",
    tempF: "30-36",
    ventilation: "0 CBM/h",
    humidity: "90-95%",
    atmosphere: "Standard",
    notes: ["Use ice or gel packs", "Very short shelf life", "Strict hygiene required"],
    shelfLife: "3-7 days",
    minTemp: -1,
    maxTemp: 2,
  },
  fish_frozen: {
    name: "Frozen Fish",
    temp: "-18 to -25",
    tempF: "0 to -13",
    ventilation: "0 CBM/h",
    humidity: "N/A",
    atmosphere: "N/A",
    notes: ["IQF or block frozen", "Maintain cold chain", "No re-freezing"],
    shelfLife: "180-365 days",
    minTemp: -25,
    maxTemp: -18,
  },
  dairy: {
    name: "Dairy Products",
    temp: "2-4",
    tempF: "36-39",
    ventilation: "0 CBM/h",
    humidity: "80-85%",
    atmosphere: "Standard",
    notes: ["Varies by product type", "Avoid temperature abuse", "Check expiration dates"],
    shelfLife: "14-30 days",
    minTemp: 2,
    maxTemp: 4,
  },
  chocolate: {
    name: "Chocolate",
    temp: "10-18",
    tempF: "50-64",
    ventilation: "0 CBM/h",
    humidity: "< 70%",
    atmosphere: "N/A",
    notes: ["Avoid humidity above 70%", "Temperature stable environment", "Prevent fat bloom"],
    shelfLife: "180-365 days",
    minTemp: 10,
    maxTemp: 18,
  },
  pharmaceuticals: {
    name: "Pharmaceuticals",
    temp: "2-8",
    tempF: "36-46",
    ventilation: "0 CBM/h",
    humidity: "Per product spec",
    atmosphere: "N/A",
    notes: ["GDP compliance required", "Temperature logging mandatory", "Qualified equipment only"],
    shelfLife: "Per product",
    minTemp: 2,
    maxTemp: 8,
  },
  vaccines: {
    name: "Vaccines (Cold Chain)",
    temp: "2-8",
    tempF: "36-46",
    ventilation: "0 CBM/h",
    humidity: "Per product spec",
    atmosphere: "N/A",
    notes: ["Critical temperature range", "Continuous monitoring required", "Excursion protocols needed"],
    shelfLife: "Per product",
    minTemp: 2,
    maxTemp: 8,
  },
  ice_cream: {
    name: "Ice Cream",
    temp: "-18 to -25",
    tempF: "0 to -13",
    ventilation: "0 CBM/h",
    humidity: "N/A",
    atmosphere: "N/A",
    notes: ["Maintain below -18°C", "Avoid temperature spikes", "Texture damage if thawed"],
    shelfLife: "180-365 days",
    minTemp: -25,
    maxTemp: -18,
  },
};

// Reefer container types
const reeferTypes = [
  {
    id: "20rf",
    name: "20' Refrigerated",
    capacity: "28.4 CBM",
    payload: "27,400 kg",
    features: ["Standard refrigeration", "Temperature range: -25°C to +25°C", "Ideal for smaller shipments"],
    bestFor: ["Pharmaceuticals", "Small perishable shipments", "High-value cargo"],
  },
  {
    id: "40rf",
    name: "40' Refrigerated (Standard)",
    capacity: "59.1 CBM",
    payload: "28,800 kg",
    features: ["Standard refrigeration", "Temperature range: -25°C to +25°C", "Most common reefer size"],
    bestFor: ["Fruits and vegetables", "General perishables", "Medium shipments"],
  },
  {
    id: "40hc_rf",
    name: "40' HC Refrigerated",
    capacity: "67.7 CBM",
    payload: "29,200 kg",
    features: ["High cube design", "Extra volume capacity", "Temperature range: -25°C to +25°C"],
    bestFor: ["Volume-intensive cargo", "Lightweight perishables", "Palletized goods"],
  },
  {
    id: "20ca",
    name: "20' Controlled Atmosphere",
    capacity: "28.4 CBM",
    payload: "27,200 kg",
    features: ["O2/CO2 control", "Extended shelf life capability", "Real-time monitoring"],
    bestFor: ["Long-transit fruits", "Premium produce", "Extended shelf life requirements"],
  },
  {
    id: "40ca",
    name: "40' Controlled Atmosphere",
    capacity: "59.1 CBM",
    payload: "28,600 kg",
    features: ["O2/CO2 control", "Extended shelf life capability", "Remote monitoring systems"],
    bestFor: ["Bananas", "Apples", "Long-transit perishables"],
  },
];

// Temperature chart data
const temperatureChartData = Object.entries(commoditySettings).slice(0, 10).map(([key, value]) => ({
  name: value.name.split(" ")[0],
  minTemp: value.minTemp,
  maxTemp: value.maxTemp,
  avgTemp: (value.minTemp + value.maxTemp) / 2,
}));

// Humidity requirements data
const humidityChartData = [
  { name: "Leafy Greens", humidity: 97, color: LOGISTICS_GREEN },
  { name: "Berries", humidity: 92, color: OCEAN_BLUE },
  { name: "Fresh Fish", humidity: 92, color: "#3b82f6" },
  { name: "Citrus", humidity: 87, color: "#f59e0b" },
  { name: "Dairy", humidity: 82, color: "#8b5cf6" },
  { name: "Chocolate", humidity: 65, color: "#6b7280" },
];

// Shelf life comparison data
const shelfLifeData = [
  { name: "Frozen Meat", days: 275, category: "Frozen" },
  { name: "Frozen Fish", days: 275, category: "Frozen" },
  { name: "Apples (CA)", days: 120, category: "Fresh" },
  { name: "Citrus", days: 38, category: "Fresh" },
  { name: "Bananas", days: 28, category: "Fresh" },
  { name: "Fresh Meat", days: 10, category: "Fresh" },
  { name: "Fresh Fish", days: 5, category: "Fresh" },
  { name: "Berries", days: 6, category: "Fresh" },
];

export function ReeferSettingsCalculator() {
  const [commodity, setCommodity] = useState<string>("bananas");
  const [customTemp, setCustomTemp] = useState<string>("");
  const [transitDays, setTransitDays] = useState<string>("14");
  const [containerType, setContainerType] = useState<string>("40rf");
  const [preCooling, setPreCooling] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("calculator");

  const settings = useMemo<ReeferSettings>(() => {
    const commodityData = commoditySettings[commodity];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    const monitoring: string[] = [];

    // Get temperature
    const setTemp = customTemp || commodityData.temp;

    // Generate warnings
    if (setTemp.includes("-") && parseFloat(setTemp.split(" ")[0]) > -2) {
      warnings.push("Temperature near freezing - verify product tolerance");
    }
    if (setTemp.startsWith("-") && !commodity.includes("frozen")) {
      warnings.push("Frozen temperature for fresh product?");
    }
    if (commodityData.ventilation !== "0 CBM/h" && parseFloat(transitDays) > 21) {
      warnings.push("Long transit - ensure adequate ventilation capacity");
    }

    // Generate recommendations
    if (preCooling) {
      recommendations.push("Pre-cool container to set temperature before loading");
    }
    if (commodityData.atmosphere.includes("CA")) {
      recommendations.push("Consider Controlled Atmosphere (CA) container for extended transit");
    }
    recommendations.push("Verify cargo temperature matches set point before loading");
    recommendations.push("Document temperature at loading for chain of custody");

    // Monitoring requirements
    monitoring.push("Continuous temperature logging");
    if (commodityData.humidity !== "N/A") {
      monitoring.push("Humidity monitoring");
    }
    if (parseFloat(transitDays) > 14) {
      monitoring.push("Daily temperature reports");
    }

    return {
      setTemperature: setTemp,
      ventilation: commodityData.ventilation,
      humidity: commodityData.humidity,
      atmosphere: commodityData.atmosphere,
      preCooling,
      monitoring,
      warnings,
      recommendations,
    };
  }, [commodity, customTemp, transitDays, preCooling]);

  const selectedCommodity = commoditySettings[commodity];

  const getTempColor = (temp: string) => {
    const tempNum = parseFloat(temp.split(" ")[0]);
    if (tempNum < -15) return "text-blue-400";
    if (tempNum < 0) return "text-blue-500";
    if (tempNum < 10) return "text-cyan-500";
    if (tempNum < 20) return "text-green-500";
    return "text-orange-500";
  };

  const handleExport = () => {
    const data = {
      commodity: selectedCommodity.name,
      settings,
      transitDays,
      containerType,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reefer-settings-${commodity}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Reefer Container Settings",
          text: `Temperature settings for ${selectedCommodity.name}: ${settings.setTemperature}°C`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Reefer Settings for ${selectedCommodity.name}\nTemperature: ${settings.setTemperature}°C\nVentilation: ${settings.ventilation}\nHumidity: ${settings.humidity}`
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81]/10 via-cyan-50 to-[#2E8B57]/10 dark:from-[#0F4C81]/20 dark:via-slate-900 dark:to-[#2E8B57]/20 p-8 border border-cyan-200 dark:border-cyan-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#0F4C81]/20 to-transparent rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-[#2E8B57]/20 to-transparent rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge 
              className="mb-4 px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white border-0"
            >
              <motion.span
                className="inline-flex items-center gap-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Thermometer className="h-4 w-4" />
                Temperature Control
              </motion.span>
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Reefer Container Settings Calculator
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Calculate optimal temperature, humidity, and ventilation settings for your refrigerated cargo. 
              Get expert recommendations for maintaining cold chain integrity.
            </p>
          </motion.div>

          {/* Key Metrics Cards */}
          <motion.div
            className="grid grid-cols-3 gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-cyan-200 dark:border-cyan-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                    <Thermometer className="h-5 w-5 text-[#0F4C81]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#0F4C81]">-25°C to +25°C</div>
                    <div className="text-sm text-muted-foreground">Temperature Range</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-[#2E8B57]/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                    <Droplets className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#2E8B57]">60-100%</div>
                    <div className="text-sm text-muted-foreground">Humidity Control</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-cyan-200 dark:border-cyan-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                    <Wind className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-600">0-30 CBM/h</div>
                    <div className="text-sm text-muted-foreground">CO₂ Level Control</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="commodity" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Commodity Guide</span>
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Container className="h-4 w-4" />
            <span className="hidden sm:inline">Reefer Types</span>
          </TabsTrigger>
          <TabsTrigger value="practices" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Best Practices</span>
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
                    <Package className="h-5 w-5 text-[var(--logistics)]" />
                    Commodity Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Commodity</Label>
                    <Select value={commodity} onValueChange={setCommodity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        <SelectItem value="bananas">🍌 Bananas</SelectItem>
                        <SelectItem value="apples">🍎 Apples</SelectItem>
                        <SelectItem value="oranges">🍊 Citrus (Oranges)</SelectItem>
                        <SelectItem value="grapes">🍇 Grapes</SelectItem>
                        <SelectItem value="berries">🍓 Berries</SelectItem>
                        <SelectItem value="tomatoes">🍅 Tomatoes</SelectItem>
                        <SelectItem value="lettuce">🥬 Lettuce & Leafy Greens</SelectItem>
                        <SelectItem value="meat_fresh">🥩 Fresh Meat</SelectItem>
                        <SelectItem value="meat_frozen">🧊 Frozen Meat</SelectItem>
                        <SelectItem value="fish_fresh">🐟 Fresh Fish/Seafood</SelectItem>
                        <SelectItem value="fish_frozen">❄️ Frozen Fish</SelectItem>
                        <SelectItem value="dairy">🧀 Dairy Products</SelectItem>
                        <SelectItem value="chocolate">🍫 Chocolate</SelectItem>
                        <SelectItem value="pharmaceuticals">💊 Pharmaceuticals</SelectItem>
                        <SelectItem value="vaccines">💉 Vaccines</SelectItem>
                        <SelectItem value="ice_cream">🍨 Ice Cream</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customTemp">Override Temperature (°C)</Label>
                      <Input
                        id="customTemp"
                        type="text"
                        value={customTemp}
                        onChange={(e) => setCustomTemp(e.target.value)}
                        placeholder={selectedCommodity.temp}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transitDays">Transit Duration (Days)</Label>
                      <Input
                        id="transitDays"
                        type="number"
                        value={transitDays}
                        onChange={(e) => setTransitDays(e.target.value)}
                        placeholder="14"
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
                        <SelectItem value="20rf">20&apos; Refrigerated</SelectItem>
                        <SelectItem value="40rf">40&apos; Refrigerated (Standard)</SelectItem>
                        <SelectItem value="40hc_rf">40&apos; HC Refrigerated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Pre-Cooling Required</Label>
                      <p className="text-xs text-muted-foreground">
                        Cool container before loading
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preCooling}
                      onChange={(e) => setPreCooling(e.target.checked)}
                      className="h-4 w-4 accent-[var(--logistics)]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Export/Share Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleExport} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export Settings
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Temperature Display */}
              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-cyan-600" />
                    Recommended Settings
                  </CardTitle>
                  <CardDescription>
                    Optimal conditions for {selectedCommodity.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-5xl font-bold ${getTempColor(settings.setTemperature)}`}
                    >
                      {settings.setTemperature}°C
                    </motion.div>
                    <div className="text-lg text-muted-foreground mt-1">
                      Set Temperature
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ({selectedCommodity.tempF}°F)
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <Wind className="h-5 w-5 mx-auto mb-1 text-[var(--ocean)]" />
                      <div className="text-sm font-medium">{settings.ventilation}</div>
                      <div className="text-xs text-muted-foreground">Ventilation</div>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <Droplets className="h-5 w-5 mx-auto mb-1 text-[var(--logistics)]" />
                      <div className="text-sm font-medium">{settings.humidity}</div>
                      <div className="text-xs text-muted-foreground">Humidity</div>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <Leaf className="h-5 w-5 mx-auto mb-1 text-green-500" />
                      <div className="text-xs font-medium">{settings.atmosphere}</div>
                      <div className="text-xs text-muted-foreground">Atmosphere</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-[var(--ocean)]" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {selectedCommodity.notes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Warnings */}
              <AnimatePresence>
                {settings.warnings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          {settings.warnings.map((warning, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                              <span>{warning}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Monitoring Requirements */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[var(--logistics)]" />
                    Monitoring Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {settings.monitoring.map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommendations */}
          <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div className="text-sm text-green-700 dark:text-green-300">
                  <p className="font-semibold mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {settings.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualizations */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#0F4C81]" />
                  Temperature Range by Commodity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={temperatureChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[-30, 25]} className="text-xs" />
                      <YAxis dataKey="name" type="category" width={80} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="minTemp" fill={OCEAN_BLUE} name="Min Temp (°C)" />
                      <Bar dataKey="maxTemp" fill={LOGISTICS_GREEN} name="Max Temp (°C)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-[#2E8B57]" />
                  Humidity Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={humidityChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis domain={[0, 100]} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="humidity" name="Humidity (%)">
                        {humidityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shelf Life Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0F4C81]" />
                Shelf Life Comparison (Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={shelfLifeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="3 3" label="30 days" />
                    <Area
                      type="monotone"
                      dataKey="days"
                      stroke={OCEAN_BLUE}
                      fill={OCEAN_BLUE}
                      fillOpacity={0.3}
                      name="Shelf Life (days)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Commodity Guide */}
        <TabsContent value="commodity" className="space-y-6">
          {/* Educational Content */}
          <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-[#0F4C81]" />
                What is a Reefer Container?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                A reefer container, or refrigerated container, is a specialized shipping container equipped with a built-in refrigeration unit designed to maintain precise temperature conditions during transport. These containers are essential for the global cold chain logistics industry, enabling the safe transportation of temperature-sensitive cargo across vast distances by sea, rail, and road. Modern reefer containers can maintain temperatures ranging from -25°C to +25°C, making them suitable for everything from frozen foods to delicate pharmaceuticals.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The refrigeration system in a reefer container operates by circulating chilled air throughout the container interior. Cold air is forced from the floor, rises through the cargo, and returns to the refrigeration unit. This continuous circulation ensures uniform temperature distribution and prevents hot spots that could compromise cargo quality. Advanced reefer containers also feature humidity control systems, ventilation capabilities for fresh produce, and controlled atmosphere (CA) technology that can extend shelf life by regulating oxygen and carbon dioxide levels.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Understanding the specific requirements of your commodity is crucial for successful reefer shipping. Different products have varying optimal temperature ranges, humidity requirements, and ventilation needs. For example, bananas require temperatures around 13.3°C with active ventilation to remove ethylene gas, while frozen fish needs temperatures below -18°C with no ventilation. Improper settings can lead to chilling injury, freezer burn, accelerated ripening, or complete cargo loss.
              </p>
            </CardContent>
          </Card>

          {/* Temperature Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-[#0F4C81]" />
                Commodity Temperature Reference Table
              </CardTitle>
              <CardDescription>
                Complete temperature, humidity, and ventilation requirements by commodity type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Commodity</TableHead>
                      <TableHead>Temperature (°C)</TableHead>
                      <TableHead>Temperature (°F)</TableHead>
                      <TableHead>Humidity</TableHead>
                      <TableHead>Ventilation</TableHead>
                      <TableHead>Shelf Life</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(commoditySettings).map(([key, value]) => (
                      <TableRow key={key} className="cursor-pointer hover:bg-muted/50" onClick={() => {
                        setCommodity(key);
                        setActiveTab("calculator");
                      }}>
                        <TableCell className="font-medium">{value.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {value.temp}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{value.tempF}</TableCell>
                        <TableCell>{value.humidity}</TableCell>
                        <TableCell>{value.ventilation}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{value.shelfLife}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Common Reefer Cargo Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#2E8B57]" />
                Common Reefer Cargo Types
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Reefer containers transport a diverse range of products across several major categories. Fresh fruits and vegetables represent the largest segment, including tropical fruits like bananas and mangoes, temperate fruits like apples and citrus, and perishable vegetables like lettuce and tomatoes. Each commodity type has specific requirements for temperature, humidity, and ventilation to maintain optimal quality during transit.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Meat and seafood products are another significant category, requiring strict temperature control to ensure food safety. Fresh meat is typically shipped at temperatures just above freezing (-1.5°C to 0°C), while frozen meat and seafood require temperatures of -18°C or lower. The pharmaceutical industry also relies heavily on reefer containers for transporting temperature-sensitive medicines, vaccines, and biological products, with most requiring the strict 2°C to 8°C range.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Other common reefer cargo includes dairy products like cheese and butter, confectionery items like chocolate, and specialty products like cut flowers and live plants. The temperature sensitivity of these products varies widely - chocolate can suffer fat bloom if exposed to temperature fluctuations, while cut flowers require both precise temperature and humidity control to prevent wilting and premature senescence.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Reefer Types */}
        <TabsContent value="types" className="space-y-6">
          <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Container className="h-5 w-5 text-[#0F4C81]" />
                Types of Reefer Containers
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                The shipping industry utilizes several types of refrigerated containers, each designed for specific cargo requirements and operational needs. Standard reefer containers come in 20-foot and 40-foot configurations, with high-cube variants offering additional volume for lightweight cargo. These standard units are equipped with basic refrigeration systems capable of maintaining set temperatures throughout the transit period.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Controlled Atmosphere (CA) containers represent the premium tier of reefer technology. These specialized units feature advanced systems that regulate not just temperature, but also the atmospheric composition within the container. By controlling oxygen, carbon dioxide, and nitrogen levels, CA containers can dramatically extend the shelf life of respiring products like fruits and vegetables. This technology is particularly valuable for long-transit shipments where standard refrigeration alone would be insufficient.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Modern reefer containers are increasingly equipped with IoT sensors and real-time monitoring capabilities. These smart containers can transmit temperature, humidity, and atmospheric data to shippers and logistics providers throughout the journey. This visibility enables proactive intervention if conditions deviate from specifications, helping to prevent cargo loss and ensuring cold chain integrity from origin to destination.
              </p>
            </CardContent>
          </Card>

          {/* Reefer Types Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reeferTypes.map((type) => (
              <Card key={type.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#0F4C81]">{type.id.toUpperCase()}</Badge>
                    <Container className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-base mt-2">{type.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-muted/50 rounded">
                      <div className="text-muted-foreground">Capacity</div>
                      <div className="font-medium">{type.capacity}</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <div className="text-muted-foreground">Payload</div>
                      <div className="font-medium">{type.payload}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Features</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {type.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <CheckCircle2 className="h-3 w-3 text-[#2E8B57] mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Best For</div>
                    <div className="flex flex-wrap gap-1">
                      {type.bestFor.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Best Practices */}
        <TabsContent value="practices" className="space-y-6">
          <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#0F4C81]" />
                Cold Chain Management Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Cold chain management encompasses all activities involved in maintaining temperature-sensitive products within their required temperature range from production to consumption. The integrity of the cold chain is paramount for perishable goods, as even brief temperature excursions can cause irreversible damage, reduce shelf life, or create food safety risks. Effective cold chain management requires coordination among all stakeholders, from producers and shippers to carriers and receivers.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Temperature monitoring is the cornerstone of cold chain integrity. Modern reefer containers are equipped with continuous temperature recording devices that provide a complete history of conditions throughout the journey. These records serve multiple purposes: verifying compliance with specifications, documenting chain of custody, and identifying any temperature excursions that may have occurred. For pharmaceuticals and certain food products, regulatory agencies require detailed temperature documentation.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Pre-shipment preparation is equally important for successful reefer operations. Cargo should be pre-cooled to the target temperature before loading to avoid thermal shock to the refrigeration system. The container itself should be pre-cooled to the set point, and loading should proceed quickly to minimize exposure to ambient conditions. Proper stowage is critical - cargo must be arranged to allow adequate air circulation around all packages while maximizing container utilization.
              </p>
            </CardContent>
          </Card>

          {/* Best Practices Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-[#2E8B57]">
                  <Target className="h-5 w-5" />
                  Do&apos;s
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    { icon: Thermometer, text: "Pre-cool container to set point before loading" },
                    { icon: CheckCircle2, text: "Verify cargo temperature matches specifications" },
                    { icon: Clock, text: "Document temperature at loading and discharge" },
                    { icon: Shield, text: "Use calibrated temperature monitoring devices" },
                    { icon: Wind, text: "Ensure proper airflow around all cargo packages" },
                    { icon: Zap, text: "Respond quickly to any temperature alarms" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="p-1 rounded bg-[#2E8B57]/10">
                        <item.icon className="h-4 w-4 text-[#2E8B57]" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-red-500">
                  <XCircle className="h-5 w-5" />
                  Don&apos;ts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    { icon: AlertTriangle, text: "Never load warm cargo into a cooled container" },
                    { icon: Snowflake, text: "Avoid temperature fluctuations during transit" },
                    { icon: Package, text: "Don't block air circulation channels" },
                    { icon: Clock, text: "Never exceed recommended transit times" },
                    { icon: Thermometer, text: "Don't mix commodities with different requirements" },
                    { icon: RefreshCw, text: "Avoid re-freezing thawed products" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="p-1 rounded bg-red-100 dark:bg-red-900/30">
                        <item.icon className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Handling Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#0F4C81]" />
                Handling Instructions for Perishables
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Proper handling of perishable cargo requires attention to detail at every stage of the supply chain. Before loading, inspect the container for cleanliness, damage, and proper functioning of the refrigeration unit. Check that the container floor is free of debris that could block airflow, and verify that all air vents are open and unobstructed. Set the container to the required temperature and allow it to stabilize before loading begins.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                During loading, work quickly to minimize the time doors remain open. Use curtain strips or air doors where possible to reduce heat infiltration. Stack cargo to allow air to circulate around all packages - typically maintaining a gap of at least 10cm between the cargo and container walls. For ventilated cargo, ensure that packages are not wrapped in plastic film that would block gas exchange. Monitor cargo temperature during loading with a probe thermometer.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                After loading, verify that the refrigeration unit is operating correctly and that temperature is being maintained. Seal the container and record the seal number. Ensure that temperature recording devices are active and properly configured. During transit, monitor container status remotely if available, and plan for prompt unloading at destination. On arrival, check temperature records for any excursions and inspect cargo for quality before accepting delivery.
              </p>
            </CardContent>
          </Card>

          {/* Accordion for additional content */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="fresh-vs-frozen">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Snowflake className="h-4 w-4 text-blue-400" />
                  Fresh vs Frozen Cargo
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Sun className="h-4 w-4 text-orange-400" />
                      Fresh/Chilled Cargo
                    </h4>
                    <p>
                      Requires temperatures above freezing (typically 0°C to 15°C). 
                      Ventilation is often needed to remove ethylene and CO₂. 
                      Humidity control is critical to prevent dehydration.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Snowflake className="h-4 w-4 text-blue-400" />
                      Frozen Cargo
                    </h4>
                    <p>
                      Requires temperatures below -18°C. No ventilation needed. 
                      Humidity is not a concern. Focus is on maintaining cold chain 
                      integrity and avoiding temperature fluctuations.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="atmosphere">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-500" />
                  Controlled Atmosphere (CA)
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Controlled Atmosphere technology allows precise control of O₂, CO₂, and 
                    N₂ levels inside the container, significantly extending shelf life for 
                    many commodities.
                  </p>
                  <ul className="space-y-2">
                    <li><strong>Reduced O₂:</strong> Slows respiration and ripening</li>
                    <li><strong>Elevated CO₂:</strong> Inhibits microbial growth</li>
                    <li><strong>Better quality:</strong> Maintains product firmness and color</li>
                    <li><strong>Longer transit:</strong> Enables shipping to distant markets</li>
                  </ul>
                  <p className="text-amber-600 dark:text-amber-400">
                    CA containers cost more but can extend shelf life by 2-3x for certain commodities.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="precooling">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-cyan-500" />
                  Pre-Cooling Best Practices
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Pre-cooling removes field heat from produce and brings it to the 
                    optimal storage temperature before loading into the container.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span>Pre-cool container to set point before loading</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span>Load product at correct temperature (avoid warm loading)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span>Close doors quickly during loading to maintain temperature</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span>Never pre-cool frozen containers (causes ice buildup)</span>
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about reefer container settings and cold chain management
              </CardDescription>
            </CardHeader>
          </Card>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <Card>
              <AccordionItem value="q1" className="border-0">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Badge className="bg-[#0F4C81]">Q1</Badge>
                    <span className="font-medium">What temperature should I set for fresh fruits versus frozen products?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Fresh fruits and frozen products require fundamentally different temperature approaches. Fresh fruits are typically stored at temperatures just above their freezing point to slow respiration while avoiding chilling injury. For example, apples are best at -0.5°C to 3°C, bananas at 13.3°C, and citrus at 3-9°C. The specific temperature depends on the fruit type, its origin, and susceptibility to chilling injury.
                    </p>
                    <p>
                      Frozen products, in contrast, must be maintained at -18°C or below throughout the supply chain. This ensures complete preservation and prevents thawing, which can cause texture damage, ice crystal formation, and food safety concerns. Frozen meat, fish, and ice cream all require temperatures between -18°C and -25°C. The key is maintaining a stable temperature - fluctuations can cause freezer burn and quality degradation even if the product remains frozen.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>

            <Card>
              <AccordionItem value="q2" className="border-0">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Badge className="bg-[#2E8B57]">Q2</Badge>
                    <span className="font-medium">How do I determine the right ventilation settings for my cargo?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Ventilation settings depend primarily on whether your cargo is respiring (living) or non-respiring. Fresh fruits and vegetables continue to respire after harvest, producing carbon dioxide and ethylene gas. Without proper ventilation, these gases can accumulate to harmful levels, causing accelerated ripening, off-flavors, or even spoilage. Ventilation rates typically range from 5-30 CBM/h depending on the commodity.
                    </p>
                    <p>
                      For commodities like bananas and avocados that produce significant ethylene, higher ventilation rates (15-30 CBM/h) are recommended. For commodities sensitive to ethylene but not producing it, like lettuce and cut flowers, moderate ventilation (5-15 CBM/h) is sufficient to remove any ambient ethylene. Frozen products and most pharmaceuticals require no ventilation (0 CBM/h) as they do not respire and benefit from a sealed environment.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>

            <Card>
              <AccordionItem value="q3" className="border-0">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Badge className="bg-[#0F4C81]">Q3</Badge>
                    <span className="font-medium">What is Controlled Atmosphere (CA) and when should I use it?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Controlled Atmosphere (CA) technology actively manages the composition of gases inside a reefer container, typically reducing oxygen levels and increasing carbon dioxide levels beyond what standard refrigeration achieves. This slows the respiration rate of fresh produce, effectively putting it into a dormant state that dramatically extends shelf life. CA containers can extend the marketable life of apples by 2-3 times compared to standard refrigeration.
                    </p>
                    <p>
                      CA is most beneficial for long-transit shipments (over 14 days), high-value commodities, and products with specific atmospheric requirements. Common CA applications include apples (1-2% O2, 1-3% CO2), bananas (controlled ripening), kiwifruit, and pomegranates. The technology requires specialized containers and comes at a premium cost, but can enable market access that would otherwise be impossible due to transit time constraints.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>

            <Card>
              <AccordionItem value="q4" className="border-0">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Badge className="bg-[#2E8B57]">Q4</Badge>
                    <span className="font-medium">How critical is pre-cooling before loading reefer containers?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Pre-cooling is one of the most critical steps in ensuring successful reefer shipments. Field heat - the heat accumulated in produce during harvest and handling - can be substantial. If warm cargo is loaded into a reefer container, the refrigeration unit must work extremely hard to remove this heat, potentially struggling to achieve the set point. This can create temperature gradients within the cargo, with outer layers cooling faster than inner layers.
                    </p>
                    <p>
                      Best practice is to pre-cool both the cargo and the container. Cargo should be brought to the target temperature in a pre-cooling facility before loading. The container should be set to the target temperature and allowed to stabilize before loading begins. Loading should proceed quickly, with doors closed as much as possible. For most fresh produce, failure to pre-cool can reduce shelf life by days or even weeks, representing a significant quality and financial risk.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>

            <Card>
              <AccordionItem value="q5" className="border-0">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Badge className="bg-[#0F4C81]">Q5</Badge>
                    <span className="font-medium">What happens if there is a temperature excursion during transit?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Temperature excursions - periods when cargo temperature deviates from the specified range - can have serious consequences depending on the commodity and severity. For fresh produce, brief excursions may accelerate ripening or reduce shelf life without causing immediate visible damage. However, for temperature-sensitive products like pharmaceuticals, even short excursions can render products ineffective or unsafe, potentially resulting in complete cargo rejection.
                    </p>
                    <p>
                      When an excursion is detected, immediate action is required. The first step is to determine the cause and duration of the excursion. Check if it was a recording error, a temporary power interruption, or an actual temperature deviation. For fresh produce, assess cargo quality at the earliest opportunity. For pharmaceuticals, follow established excursion protocols - many products have documented acceptable excursion limits. Document everything thoroughly for insurance and regulatory purposes.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>

            <Card>
              <AccordionItem value="q6" className="border-0">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Badge className="bg-[#2E8B57]">Q6</Badge>
                    <span className="font-medium">Can I ship different commodities together in the same reefer container?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Mixed commodity shipments are possible but require careful planning to ensure compatibility. The primary considerations are temperature, ethylene sensitivity, and odor transfer. All commodities in the container must be able to tolerate the same temperature setting. For example, you could potentially ship apples and citrus together at around 4°C, but you could not ship bananas (13°C) with frozen products (-18°C).
                    </p>
                    <p>
                      Ethylene compatibility is equally important. Ethylene-producing fruits (bananas, apples, tomatoes, avocados) should not be shipped with ethylene-sensitive products (lettuce, cucumbers, cut flowers) as this can cause premature senescence, yellowing, or off-flavors. Some commodities also have strong odors that can be absorbed by other products - onions and garlic are notorious for this. When in doubt, consult with a cold chain specialist or ship commodities separately to avoid quality issues.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>

            <Card>
              <AccordionItem value="q7" className="border-0">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Badge className="bg-[#0F4C81]">Q7</Badge>
                    <span className="font-medium">What documentation is required for pharmaceutical cold chain shipments?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Pharmaceutical cold chain shipments require comprehensive documentation to comply with Good Distribution Practice (GDP) regulations. This includes temperature mapping data showing continuous compliance throughout the supply chain, calibration certificates for temperature monitoring devices, and detailed chain of custody records. The temperature data must demonstrate that the product remained within its specified range at all times.
                    </p>
                    <p>
                      Key documents include the temperature recorder download or printout, packaging qualification documentation, transportation validation records, and any deviation reports for excursions. Many pharmaceutical products require batch-level traceability, with documentation linking the shipment to specific manufacturing batches. For international shipments, additional regulatory requirements may apply depending on the countries involved and the type of pharmaceutical product. Working with a GDP-certified logistics provider ensures compliance with these complex requirements.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
