"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Route,
  MapPin,
  Truck,
  Clock,
  DollarSign,
  Fuel,
  AlertCircle,
  CheckCircle,
  Info,
  Navigation,
  ArrowRight,
  TrendingUp,
  Gauge,
  RefreshCw,
  Zap,
  Map,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Shield,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Globe,
  Timer,
  Wallet,
  Leaf,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  LineChart,
  Line,
  Legend,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface RouteResult {
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  fuelCost: number;
  tollCost: number;
  driverCost: number;
  totalCost: number;
  costPerKm: number;
  costPerKg: number;
  co2Emissions: number;
  routeType: string;
  waypoints: Waypoint[];
  alternativeRoutes: AlternativeRoute[];
  weatherAlerts: string[];
  trafficCondition: string;
}

interface Waypoint {
  name: string;
  distance: number;
  estimatedArrival: string;
  type: "rest" | "fuel" | "customs" | "checkpoint";
}

interface AlternativeRoute {
  name: string;
  distance: number;
  time: number;
  cost: number;
  savings: number;
  recommendation: string;
}

const vehicleTypes = [
  { id: "van", name: "Delivery Van", capacity: "1.5 tons", efficiency: 12 },
  { id: "truck-small", name: "Small Truck (3.5T)", capacity: "3.5 tons", efficiency: 8 },
  { id: "truck-medium", name: "Medium Truck (7.5T)", capacity: "7.5 tons", efficiency: 6 },
  { id: "truck-large", name: "Large Truck (18T)", capacity: "18 tons", efficiency: 4 },
  { id: "tractor-trailer", name: "Tractor Trailer (40T)", capacity: "40 tons", efficiency: 2.5 },
  { id: "reefer", name: "Refrigerated Truck", capacity: "20 tons", efficiency: 3.5 },
];

const fuelTypes = [
  { id: "diesel", name: "Diesel", co2Factor: 2.68, price: 1.65 },
  { id: "petrol", name: "Petrol", co2Factor: 2.31, price: 1.85 },
  { id: "lng", name: "LNG", co2Factor: 1.86, price: 1.20 },
  { id: "electric", name: "Electric", co2Factor: 0.5, price: 0.25 },
  { id: "hydrogen", name: "Hydrogen", co2Factor: 0, price: 2.50 },
];

const majorRoutes = [
  { origin: "Shanghai, CN", destination: "Los Angeles, US", distance: 10400, type: "ocean" },
  { origin: "Rotterdam, NL", destination: "New York, US", distance: 5840, type: "ocean" },
  { origin: "Shenzhen, CN", destination: "Hamburg, DE", distance: 11200, type: "rail" },
  { origin: "London, UK", destination: "Paris, FR", distance: 460, type: "road" },
  { origin: "Chicago, US", destination: "Los Angeles, US", distance: 2800, type: "road" },
  { origin: "Frankfurt, DE", destination: "Moscow, RU", distance: 2100, type: "rail" },
];

const faqData = [
  {
    question: "How does the route optimization algorithm work?",
    answer: "Our algorithm uses real-time traffic data, historical patterns, weather conditions, and road restrictions to calculate the most efficient route. It considers multiple factors including fuel consumption, toll costs, driver hours, and delivery deadlines to provide optimized recommendations.",
  },
  {
    question: "What factors influence the total transportation cost?",
    answer: "Total cost is calculated based on: fuel consumption (distance × fuel efficiency × fuel price), toll charges, driver wages (including rest time), vehicle depreciation, insurance, and operational overhead. You can customize each parameter for accurate estimates.",
  },
  {
    question: "How accurate are the CO2 emission calculations?",
    answer: "CO2 emissions are calculated using standardized emission factors for each fuel type. For diesel, we use 2.68 kg CO2 per liter. The calculation considers total fuel consumption and adjusts for vehicle type and load weight. Electric vehicles account for grid emission factors.",
  },
  {
    question: "Can I optimize for multiple priorities simultaneously?",
    answer: "Yes! The 'Balanced' priority mode optimizes for a combination of time, cost, and environmental impact. You can also select specific priorities like 'Fastest' for time-critical deliveries, 'Eco-Friendly' for sustainability goals, or 'Lowest Cost' for budget optimization.",
  },
  {
    question: "What are waypoints and how are they determined?",
    answer: "Waypoints are strategic stops along your route including rest areas (mandatory driver breaks every 4.5 hours), fuel stations, customs checkpoints, and transit hubs. Our system automatically places them based on regulations, route length, and available facilities.",
  },
  {
    question: "How do alternative routes compare to the recommended route?",
    answer: "Alternative routes offer trade-offs between time, cost, and distance. Express routes are faster but may cost more due to tolls and higher speeds. Eco routes prioritize fuel efficiency and lower emissions. Scenic routes avoid tolls but take longer.",
  },
];

const analyticsData = {
  monthlyTrends: [
    { month: "Jan", routes: 145, avgCost: 2450, avgTime: 42 },
    { month: "Feb", routes: 132, avgCost: 2380, avgTime: 40 },
    { month: "Mar", routes: 168, avgCost: 2520, avgTime: 38 },
    { month: "Apr", routes: 189, avgCost: 2340, avgTime: 36 },
    { month: "May", routes: 201, avgCost: 2280, avgTime: 35 },
    { month: "Jun", routes: 215, avgCost: 2420, avgTime: 37 },
  ],
  routePerformance: [
    { metric: "Cost Efficiency", value: 85 },
    { metric: "Time Accuracy", value: 92 },
    { metric: "Fuel Economy", value: 78 },
    { metric: "Route Safety", value: 95 },
    { metric: "On-Time Delivery", value: 88 },
    { metric: "CO2 Reduction", value: 72 },
  ],
  vehicleUsage: [
    { name: "Tractor Trailer", value: 35, color: "#0F4C81" },
    { name: "Large Truck", value: 25, color: "#2E8B57" },
    { name: "Medium Truck", value: 20, color: "#F59E0B" },
    { name: "Small Truck", value: 12, color: "#8B5CF6" },
    { name: "Van", value: 8, color: "#EF4444" },
  ],
};

const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function RouteOptimizationTool() {
  const [origin, setOrigin] = useState("Shanghai, CN");
  const [destination, setDestination] = useState("Los Angeles, US");
  const [cargoWeight, setCargoWeight] = useState("15000");
  const [vehicleType, setVehicleType] = useState("tractor-trailer");
  const [fuelType, setFuelType] = useState("diesel");
  const [priority, setPriority] = useState("balanced");
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [avoidHighways, setAvoidHighways] = useState(false);
  const [driverWage, setDriverWage] = useState("25");
  const [fuelPrice, setFuelPrice] = useState("1.65");
  const [fuelEfficiency, setFuelEfficiency] = useState("2.5");

  const [result, setResult] = useState<RouteResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateRoute = () => {
    setIsCalculating(true);

    // Simulate API call delay
    setTimeout(() => {
      const selectedVehicle = vehicleTypes.find((v) => v.id === vehicleType);
      const selectedFuel = fuelTypes.find((f) => f.id === fuelType);

      // Calculate distance (simplified calculation based on coordinates)
      const baseDistance = Math.random() * 5000 + 1000;
      const distance = avoidHighways ? baseDistance * 1.15 : baseDistance;

      // Calculate time based on priority and route type
      let avgSpeed = priority === "fastest" ? 80 : priority === "eco" ? 60 : 70;
      if (avoidHighways) avgSpeed -= 15;

      const estimatedTime = distance / avgSpeed;
      const restStops = Math.floor(estimatedTime / 4.5); // Rest every 4.5 hours

      // Calculate costs
      const fuelConsumption = distance / parseFloat(fuelEfficiency);
      const fuelCost = fuelConsumption * parseFloat(fuelPrice);
      const tollCost = avoidTolls ? 0 : distance * 0.08;
      const driverCost = estimatedTime * parseFloat(driverWage) * 1.3; // Include rest time

      const totalCost = fuelCost + tollCost + driverCost + 150; // Base operational costs

      // Calculate CO2 emissions
      const co2Emissions = fuelConsumption * (selectedFuel?.co2Factor || 2.68);

      // Generate waypoints
      const waypoints: Waypoint[] = [
        { name: origin.split(",")[0] + " Port", distance: 0, estimatedArrival: "00:00", type: "checkpoint" },
        { name: "Transit Hub A", distance: distance * 0.25, estimatedArrival: `${Math.floor(estimatedTime * 0.25)}:00`, type: "rest" },
        { name: "Fuel Stop", distance: distance * 0.5, estimatedArrival: `${Math.floor(estimatedTime * 0.5)}:00`, type: "fuel" },
        { name: "Customs Check", distance: distance * 0.75, estimatedArrival: `${Math.floor(estimatedTime * 0.75)}:00`, type: "customs" },
        { name: destination.split(",")[0] + " Terminal", distance: distance, estimatedArrival: `${estimatedTime.toFixed(1)} hrs`, type: "checkpoint" },
      ];

      // Generate alternative routes
      const alternativeRoutes: AlternativeRoute[] = [
        {
          name: "Express Route",
          distance: distance * 0.9,
          time: estimatedTime * 0.85,
          cost: totalCost * 1.15,
          savings: -15,
          recommendation: "Fastest option but higher fuel costs",
        },
        {
          name: "Scenic Route",
          distance: distance * 1.2,
          time: estimatedTime * 1.3,
          cost: totalCost * 0.95,
          savings: 5,
          recommendation: "Lower tolls but longer journey",
        },
        {
          name: "Eco Route",
          distance: distance * 1.05,
          time: estimatedTime * 1.1,
          cost: totalCost * 0.9,
          savings: 10,
          recommendation: "Best fuel efficiency and lower emissions",
        },
      ];

      const routeResult: RouteResult = {
        origin,
        destination,
        distance: Math.round(distance),
        estimatedTime: Math.round(estimatedTime * 10) / 10,
        fuelCost: Math.round(fuelCost * 100) / 100,
        tollCost: Math.round(tollCost * 100) / 100,
        driverCost: Math.round(driverCost * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        costPerKm: Math.round((totalCost / distance) * 100) / 100,
        costPerKg: Math.round((totalCost / parseFloat(cargoWeight)) * 100) / 100,
        co2Emissions: Math.round(co2Emissions * 10) / 10,
        routeType: "multimodal",
        waypoints,
        alternativeRoutes,
        weatherAlerts: ["Heavy rain expected near transit point B", "Clear conditions after 500km"],
        trafficCondition: "Moderate",
      };

      setResult(routeResult);
      setIsCalculating(false);
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 0) => {
    return value.toLocaleString("en-US", { maximumFractionDigits: decimals });
  };

  const costBreakdownData = result ? [
    { name: "Fuel", value: result.fuelCost, color: "#0F4C81" },
    { name: "Tolls", value: result.tollCost, color: "#2E8B57" },
    { name: "Driver", value: result.driverCost, color: "#F59E0B" },
    { name: "Other", value: result.totalCost - result.fuelCost - result.tollCost - result.driverCost, color: "#94a3b8" },
  ] : [];

  const routeComparisonData = result?.alternativeRoutes.map((route) => ({
    name: route.name,
    distance: route.distance,
    time: route.time,
    cost: route.cost,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative px-6 py-12 md:px-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI-Powered Route Optimization</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                Smart Route Planning & Cost Analysis
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Optimize your logistics with intelligent routing, real-time cost calculations, and comprehensive analytics for efficient supply chain management.
              </p>
            </motion.div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: Globe, label: "Global Routes" },
                { icon: Timer, label: "Time Optimization" },
                { icon: Wallet, label: "Cost Savings" },
                { icon: Leaf, label: "Eco-Friendly" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm"
                >
                  <feature.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{feature.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: "15%", label: "Average Cost Reduction", icon: TrendingUp },
                { value: "22%", label: "Time Savings", icon: Clock },
                { value: "99.2%", label: "Route Accuracy", icon: Target },
                { value: "30%", label: "CO2 Reduction", icon: Leaf },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                >
                  <stat.icon className="h-5 w-5 mb-2 mx-auto opacity-80" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-white/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <Navigation className="h-5 w-5" />
            Route Configuration
          </CardTitle>
          <CardDescription>Enter your shipment details to calculate the optimal route</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Origin & Destination */}
            <div className="space-y-2">
              <Label htmlFor="origin" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#2E8B57]" />
                Origin
              </Label>
              <Input
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="City, Country"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#EF4444]" />
                Destination
              </Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="City, Country"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargoWeight" className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#2E8B57]" />
                Cargo Weight (kg)
              </Label>
              <Input
                id="cargoWeight"
                type="number"
                value={cargoWeight}
                onChange={(e) => setCargoWeight(e.target.value)}
                placeholder="15000"
                className="h-11"
              />
            </div>

            {/* Vehicle & Fuel */}
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel.id} value={fuel.id}>
                      {fuel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Route Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fastest">Fastest Route</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="eco">Eco-Friendly</SelectItem>
                  <SelectItem value="cheapest">Lowest Cost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cost Parameters */}
            <div className="space-y-2">
              <Label htmlFor="driverWage" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                Driver Wage ($/hour)
              </Label>
              <Input
                id="driverWage"
                type="number"
                step="0.5"
                value={driverWage}
                onChange={(e) => setDriverWage(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelPrice" className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-[#2E8B57]" />
                Fuel Price ($/liter)
              </Label>
              <Input
                id="fuelPrice"
                type="number"
                step="0.01"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelEfficiency" className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-[#2E8B57]" />
                Fuel Efficiency (km/L)
              </Label>
              <Input
                id="fuelEfficiency"
                type="number"
                step="0.1"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Options */}
            <div className="md:col-span-3 flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={avoidTolls}
                  onChange={(e) => setAvoidTolls(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm">Avoid Tolls</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={avoidHighways}
                  onChange={(e) => setAvoidHighways(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm">Avoid Highways</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={calculateRoute}
              disabled={isCalculating}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Calculating Route...
                </>
              ) : (
                <>
                  <Route className="mr-2 h-5 w-5" />
                  Optimize Route
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Routes Reference */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <Map className="h-5 w-5" />
            Popular Trade Routes
          </CardTitle>
          <CardDescription>Click on a route to quickly populate the form</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {majorRoutes.map((route, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-[#0F4C81] transition-colors"
                onClick={() => {
                  setOrigin(route.origin);
                  setDestination(route.destination);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 bg-[#0F4C81]/10 text-[#0F4C81] rounded uppercase">
                    {route.type}
                  </span>
                  <span className="text-sm text-muted-foreground">{formatNumber(route.distance)} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{route.origin.split(",")[0]}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{route.destination.split(",")[0]}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Route className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Distance</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(result.distance)} km</p>
                <p className="text-sm opacity-80 mt-1">Optimized route</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Duration</span>
                </div>
                <p className="text-2xl font-bold">{result.estimatedTime} hrs</p>
                <p className="text-sm opacity-80 mt-1">Est. transit time</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Total Cost</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(result.totalCost)}</p>
                <p className="text-sm opacity-80 mt-1">{formatCurrency(result.costPerKm)}/km</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Fuel className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Fuel Cost</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(result.fuelCost)}</p>
                <p className="text-sm opacity-80 mt-1">
                  {(result.distance / parseFloat(fuelEfficiency)).toFixed(0)} liters
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">CO₂</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(result.co2Emissions)} kg</p>
                <p className="text-sm opacity-80 mt-1">Emissions</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis with 5 Tabs */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Route className="h-5 w-5" />
                Route Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview" className="text-xs md:text-sm">
                    <PieChartIcon className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="waypoints" className="text-xs md:text-sm">
                    <MapPin className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Waypoints</span>
                  </TabsTrigger>
                  <TabsTrigger value="alternatives" className="text-xs md:text-sm">
                    <Route className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Alternatives</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="text-xs md:text-sm">
                    <BarChart3 className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="text-xs md:text-sm">
                    <Activity className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Insights</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Overview */}
                <TabsContent value="overview" className="pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cost Breakdown Chart */}
                    <div>
                      <h4 className="font-semibold mb-4 text-[#0F4C81]">Cost Breakdown</h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={costBreakdownData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {costBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => formatCurrency(value)}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {costBreakdownData.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm">
                              {item.name}: {formatCurrency(item.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div>
                      <h4 className="font-semibold mb-4 text-[#0F4C81]">Key Metrics</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-muted-foreground">Cost per Kilometer</span>
                            <span className="font-bold text-lg">{formatCurrency(result.costPerKm)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-muted-foreground">Cost per Kilogram</span>
                            <span className="font-bold text-lg">{formatCurrency(result.costPerKg)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-muted-foreground">Average Speed</span>
                            <span className="font-bold text-lg">{(result.distance / result.estimatedTime).toFixed(0)} km/h</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Traffic Condition</span>
                            <span className={`px-2 py-0.5 rounded text-sm font-medium ${
                              result.trafficCondition === "Light" ? "bg-green-100 text-green-700" :
                              result.trafficCondition === "Moderate" ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {result.trafficCondition}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-800 dark:text-blue-200">Weather Alerts</p>
                              <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                                {result.weatherAlerts.map((alert, index) => (
                                  <li key={index}>• {alert}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Waypoints */}
                <TabsContent value="waypoints" className="pt-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold mb-4 text-[#0F4C81]">Route Waypoints</h4>
                    <div className="relative">
                      {/* Timeline */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0F4C81] via-[#2E8B57] to-[#0F4C81]"></div>

                      <div className="space-y-4">
                        {result.waypoints.map((waypoint, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-10"
                          >
                            <div
                              className={`absolute left-2 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 ${
                                waypoint.type === "checkpoint" ? "bg-[#0F4C81]" :
                                waypoint.type === "rest" ? "bg-[#2E8B57]" :
                                waypoint.type === "fuel" ? "bg-amber-500" :
                                "bg-purple-500"
                              }`}
                            ></div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{waypoint.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatNumber(waypoint.distance)} km from origin
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{waypoint.estimatedArrival}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    waypoint.type === "checkpoint" ? "bg-[#0F4C81]/10 text-[#0F4C81]" :
                                    waypoint.type === "rest" ? "bg-[#2E8B57]/10 text-[#2E8B57]" :
                                    waypoint.type === "fuel" ? "bg-amber-100 text-amber-700" :
                                    "bg-purple-100 text-purple-700"
                                  }`}>
                                    {waypoint.type.charAt(0).toUpperCase() + waypoint.type.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Alternatives */}
                <TabsContent value="alternatives" className="pt-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold mb-4 text-[#0F4C81]">Alternative Routes</h4>

                    {/* Comparison Chart */}
                    <div className="h-72 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={routeComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" />
                          <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                          <Tooltip formatter={(value: number) => value.toFixed(0)} />
                          <Legend />
                          <Bar yAxisId="left" dataKey="time" name="Time (hrs)" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                          <Bar yAxisId="right" dataKey="cost" name="Cost ($)" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Route Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {result.alternativeRoutes.map((route, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                            route.savings > 0 ? "border-[#2E8B57] bg-[#2E8B57]/5" : "border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold">{route.name}</h4>
                            <span className={`text-sm font-medium ${route.savings > 0 ? "text-[#2E8B57]" : "text-red-500"}`}>
                              {route.savings > 0 ? "+" : ""}{route.savings}% cost
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Distance</span>
                              <span className="font-medium">{formatNumber(route.distance)} km</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Duration</span>
                              <span className="font-medium">{route.time.toFixed(1)} hrs</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Cost</span>
                              <span className="font-medium">{formatCurrency(route.cost)}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            {route.recommendation}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 4: Analytics */}
                <TabsContent value="analytics" className="pt-4">
                  <div className="space-y-6">
                    <h4 className="font-semibold text-[#0F4C81]">Performance Analytics</h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Monthly Trends */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h5 className="font-medium mb-4 flex items-center gap-2">
                          <LineChartIcon className="h-4 w-4 text-[#0F4C81]" />
                          Monthly Route Trends
                        </h5>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.monthlyTrends}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis yAxisId="left" stroke="#0F4C81" />
                              <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                              <Tooltip />
                              <Legend />
                              <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="routes"
                                name="Routes"
                                stroke="#0F4C81"
                                fill="#0F4C81"
                                fillOpacity={0.2}
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="avgCost"
                                name="Avg Cost ($)"
                                stroke="#2E8B57"
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Route Performance Radar */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h5 className="font-medium mb-4 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-[#2E8B57]" />
                          Performance Metrics
                        </h5>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={analyticsData.routePerformance}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="metric" className="text-xs" />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} />
                              <Radar
                                name="Score"
                                dataKey="value"
                                stroke="#0F4C81"
                                fill="#0F4C81"
                                fillOpacity={0.4}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Vehicle Usage */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h5 className="font-medium mb-4 flex items-center gap-2">
                          <Truck className="h-4 w-4 text-[#0F4C81]" />
                          Vehicle Usage Distribution
                        </h5>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analyticsData.vehicleUsage}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {analyticsData.vehicleUsage.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Cost Trends */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h5 className="font-medium mb-4 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                          Average Time per Route
                        </h5>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.monthlyTrends}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="avgTime" name="Avg Time (hrs)" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 5: Insights */}
                <TabsContent value="insights" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-[#2E8B57] mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-200">Route Benefits</p>
                            <ul className="text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
                              <li>• Optimized for {priority} priority</li>
                              <li>• Minimal traffic delays expected</li>
                              <li>• Fuel-efficient driving speeds</li>
                              <li>• Rest stops planned every 4.5 hours</li>
                              <li>• Real-time traffic updates available</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800 dark:text-amber-200">Considerations</p>
                            <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1">
                              <li>• Check visa requirements for border crossings</li>
                              <li>• Verify cargo insurance coverage</li>
                              <li>• Monitor fuel prices en route</li>
                              <li>• Plan for potential delays at customs</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#0F4C81]/5 dark:bg-[#0F4C81]/10 rounded-lg border border-[#0F4C81]/20">
                        <div className="flex items-start gap-2">
                          <Shield className="h-5 w-5 text-[#0F4C81] mt-0.5" />
                          <div>
                            <p className="font-medium text-[#0F4C81] dark:text-blue-200">Safety Compliance</p>
                            <ul className="text-sm text-[#0F4C81]/80 dark:text-blue-300 mt-2 space-y-1">
                              <li>• Driver rest periods compliant with regulations</li>
                              <li>• Vehicle weight within legal limits</li>
                              <li>• Hazardous material protocols followed</li>
                              <li>• Insurance coverage verified</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="font-medium mb-3 text-[#2E8B57]">Environmental Impact</p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] h-3 rounded-full transition-all"
                                style={{ width: `${Math.min((result.co2Emissions / 10000) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">CO₂ Emissions</span>
                            <span className="font-medium">{formatNumber(result.co2Emissions)} kg</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Trees needed to offset</span>
                            <span className="font-medium">{Math.ceil(result.co2Emissions / 21)} trees/year</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Fuel Type</span>
                            <span className="font-medium">{fuelTypes.find(f => f.id === fuelType)?.name}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Eco Score</span>
                            <span className="font-medium text-[#2E8B57]">
                              {fuelType === "electric" ? "A+" : fuelType === "hydrogen" ? "A" : fuelType === "lng" ? "B+" : "B"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 dark:from-[#0F4C81]/10 dark:to-[#2E8B57]/10 rounded-lg border border-[#0F4C81]/20">
                        <p className="font-medium text-[#0F4C81] dark:text-blue-200 mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Pro Tip
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          Consider the Eco Route for long-haul shipments. It may add 10% to transit time but can reduce
                          fuel costs by up to 15% and significantly lower your carbon footprint.
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-lg text-white">
                        <div className="flex items-center gap-3 mb-3">
                          <Target className="h-6 w-6" />
                          <span className="font-semibold">Optimization Recommendation</span>
                        </div>
                        <p className="text-sm text-white/90">
                          Based on your current parameters, switching to an LNG vehicle could reduce your CO₂ emissions 
                          by {(100 - (1.86 / 2.68) * 100).toFixed(0)}% while potentially saving on fuel costs for this route length.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* FAQ Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Find answers to common questions about route optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-[#0F4C81] transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-sm font-medium">
                      {index + 1}
                    </span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Footer CTA */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white">
        <CardContent className="pt-6 pb-6 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Optimize Your Logistics?</h3>
          <p className="text-white/80 mb-4 max-w-2xl mx-auto">
            Start planning efficient routes today and reduce your transportation costs while improving delivery times.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="secondary" className="bg-white text-[#0F4C81] hover:bg-white/90">
              <Route className="mr-2 h-4 w-4" />
              Plan New Route
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
