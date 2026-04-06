"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Warehouse,
  Calculator,
  TrendingUp,
  Target,
  CircleDot,
  Truck,
  DollarSign,
  RefreshCw,
  Plus,
  Trash2,
  Info,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Settings,
  Layers,
  Route,
  Zap,
  Globe,
  Building2,
  Users,
  Package,
  LineChart,
  PieChart as PieChartIcon,
  ArrowRight,
  Lightbulb,
  Save,
  Download,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie,
  Legend,
  ComposedChart,
  Area,
  Line,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Types
interface DistributionCenter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  fixedCost: number;
  variableCost: number;
  isActive: boolean;
  type: "primary" | "regional" | "cross-dock";
}

interface CustomerLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  demand: number;
  serviceLevel: number;
  assignedDC: string | null;
}

interface DemandPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  demand: number;
  seasonality: number;
  growthRate: number;
  priority: "high" | "medium" | "low";
}

interface CostModel {
  facilityCost: number;
  transportCostPerKm: number;
  handlingCost: number;
  inventoryHoldingCost: number;
  fixedOperatingCost: number;
}

interface NetworkResult {
  totalCost: number;
  facilityCost: number;
  transportCost: number;
  handlingCost: number;
  avgDistance: number;
  coveragePercentage: number;
  utilizationRate: number;
  serviceLevel: number;
  recommendations: OptimizationRecommendation[];
  costBreakdown: { name: string; value: number; percentage: number }[];
  dcUtilization: { dc: string; capacity: number; utilized: number; percentage: number }[];
  monthlyProjection: { month: string; cost: number; demand: number }[];
}

interface OptimizationRecommendation {
  id: string;
  type: "cost" | "service" | "capacity" | "coverage";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
  potentialSavings: number;
}

// Sample data
const SAMPLE_DCS: DistributionCenter[] = [
  { id: "dc1", name: "Los Angeles DC", lat: 34.0522, lng: -118.2437, capacity: 50000, fixedCost: 150000, variableCost: 2.5, isActive: true, type: "primary" },
  { id: "dc2", name: "Phoenix Hub", lat: 33.4484, lng: -112.074, capacity: 35000, fixedCost: 100000, variableCost: 2.2, isActive: true, type: "regional" },
  { id: "dc3", name: "Seattle Fulfillment", lat: 47.6062, lng: -122.3321, capacity: 25000, fixedCost: 120000, variableCost: 2.8, isActive: true, type: "regional" },
];

const SAMPLE_CUSTOMERS: CustomerLocation[] = [
  { id: "c1", name: "San Diego Retail", lat: 32.7157, lng: -117.1611, demand: 8000, serviceLevel: 95, assignedDC: null },
  { id: "c2", name: "Las Vegas Store", lat: 36.1699, lng: -115.1398, demand: 5000, serviceLevel: 90, assignedDC: null },
  { id: "c3", name: "Portland Distribution", lat: 45.5152, lng: -122.6784, demand: 6000, serviceLevel: 92, assignedDC: null },
  { id: "c4", name: "Tucson Warehouse", lat: 32.2226, lng: -110.9747, demand: 3500, serviceLevel: 88, assignedDC: null },
  { id: "c5", name: "Fresno Center", lat: 36.7378, lng: -119.7871, demand: 4200, serviceLevel: 90, assignedDC: null },
];

const SAMPLE_DEMAND_POINTS: DemandPoint[] = [
  { id: "d1", name: "Los Angeles Metro", lat: 34.0522, lng: -118.2437, demand: 15000, seasonality: 1.2, growthRate: 5, priority: "high" },
  { id: "d2", name: "Bay Area", lat: 37.7749, lng: -122.4194, demand: 12000, seasonality: 1.1, growthRate: 8, priority: "high" },
  { id: "d3", name: "Inland Empire", lat: 34.07, lng: -117.4, demand: 8000, seasonality: 1.3, growthRate: 12, priority: "medium" },
];

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 9);

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"];
const PRIORITY_COLORS = { high: "#EF4444", medium: "#F59E0B", low: "#22C55E" };

export default function DistributionNetworkDesigner() {
  // State
  const [activeTab, setActiveTab] = useState("network");
  const [distributionCenters, setDistributionCenters] = useState<DistributionCenter[]>(SAMPLE_DCS);
  const [customers, setCustomers] = useState<CustomerLocation[]>(SAMPLE_CUSTOMERS);
  const [demandPoints, setDemandPoints] = useState<DemandPoint[]>(SAMPLE_DEMAND_POINTS);
  const [serviceRadius, setServiceRadius] = useState(300);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<NetworkResult | null>(null);
  
  const [costModel, setCostModel] = useState<CostModel>({
    facilityCost: 100000,
    transportCostPerKm: 1.5,
    handlingCost: 0.5,
    inventoryHoldingCost: 0.15,
    fixedOperatingCost: 50000,
  });

  const [showAddDC, setShowAddDC] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddDemand, setShowAddDemand] = useState(false);
  
  // New item forms
  const [newDC, setNewDC] = useState<Partial<DistributionCenter>>({
    name: "",
    lat: 34.05,
    lng: -118.24,
    capacity: 25000,
    fixedCost: 100000,
    variableCost: 2.5,
    isActive: true,
    type: "regional",
  });
  
  const [newCustomer, setNewCustomer] = useState<Partial<CustomerLocation>>({
    name: "",
    lat: 34.05,
    lng: -118.24,
    demand: 5000,
    serviceLevel: 90,
    assignedDC: null,
  });
  
  const [newDemandPoint, setNewDemandPoint] = useState<Partial<DemandPoint>>({
    name: "",
    lat: 34.05,
    lng: -118.24,
    demand: 5000,
    seasonality: 1.0,
    growthRate: 5,
    priority: "medium",
  });

  // Callbacks
  const addDistributionCenter = useCallback(() => {
    if (!newDC.name) return;
    const dc: DistributionCenter = {
      id: generateId(),
      name: newDC.name || "",
      lat: newDC.lat || 0,
      lng: newDC.lng || 0,
      capacity: newDC.capacity || 25000,
      fixedCost: newDC.fixedCost || 100000,
      variableCost: newDC.variableCost || 2.5,
      isActive: newDC.isActive ?? true,
      type: newDC.type || "regional",
    };
    setDistributionCenters(prev => [...prev, dc]);
    setNewDC({ name: "", lat: 34.05, lng: -118.24, capacity: 25000, fixedCost: 100000, variableCost: 2.5, isActive: true, type: "regional" });
    setShowAddDC(false);
  }, [newDC]);

  const removeDistributionCenter = useCallback((id: string) => {
    setDistributionCenters(prev => prev.filter(dc => dc.id !== id));
  }, []);

  const addCustomer = useCallback(() => {
    if (!newCustomer.name) return;
    const customer: CustomerLocation = {
      id: generateId(),
      name: newCustomer.name || "",
      lat: newCustomer.lat || 0,
      lng: newCustomer.lng || 0,
      demand: newCustomer.demand || 5000,
      serviceLevel: newCustomer.serviceLevel || 90,
      assignedDC: null,
    };
    setCustomers(prev => [...prev, customer]);
    setNewCustomer({ name: "", lat: 34.05, lng: -118.24, demand: 5000, serviceLevel: 90, assignedDC: null });
    setShowAddCustomer(false);
  }, [newCustomer]);

  const removeCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  const addDemandPoint = useCallback(() => {
    if (!newDemandPoint.name) return;
    const dp: DemandPoint = {
      id: generateId(),
      name: newDemandPoint.name || "",
      lat: newDemandPoint.lat || 0,
      lng: newDemandPoint.lng || 0,
      demand: newDemandPoint.demand || 5000,
      seasonality: newDemandPoint.seasonality || 1.0,
      growthRate: newDemandPoint.growthRate || 5,
      priority: newDemandPoint.priority || "medium",
    };
    setDemandPoints(prev => [...prev, dp]);
    setNewDemandPoint({ name: "", lat: 34.05, lng: -118.24, demand: 5000, seasonality: 1.0, growthRate: 5, priority: "medium" });
    setShowAddDemand(false);
  }, [newDemandPoint]);

  const removeDemandPoint = useCallback((id: string) => {
    setDemandPoints(prev => prev.filter(dp => dp.id !== id));
  }, []);

  const toggleDCActive = useCallback((id: string) => {
    setDistributionCenters(prev =>
      prev.map(dc => dc.id === id ? { ...dc, isActive: !dc.isActive } : dc)
    );
  }, []);

  // Main optimization
  const runOptimization = useCallback(() => {
    setIsCalculating(true);

    setTimeout(() => {
      const activeDCs = distributionCenters.filter(dc => dc.isActive);
      
      if (activeDCs.length === 0) {
        setResult(null);
        setIsCalculating(false);
        return;
      }

      // Assign customers to nearest DC
      const customerAssignments = customers.map(customer => {
        const distances = activeDCs.map(dc => ({
          dc,
          distance: calculateDistance(customer.lat, customer.lng, dc.lat, dc.lng),
        }));
        const nearest = distances.sort((a, b) => a.distance - b.distance)[0];
        return { ...customer, assignedDC: nearest.dc.id, distance: nearest.distance };
      });

      // Calculate costs
      let totalTransportCost = 0;
      let totalHandlingCost = 0;
      let coveredDemand = 0;
      const totalDemand = customers.reduce((s, c) => s + c.demand, 0);
      const totalDemandPoints = demandPoints.reduce((s, d) => s + d.demand, 0);

      const dcUtilization: { dc: string; capacity: number; utilized: number; percentage: number }[] = [];
      
      activeDCs.forEach(dc => {
        const assignedCustomers = customerAssignments.filter(c => c.assignedDC === dc.id);
        const utilized = assignedCustomers.reduce((s, c) => s + c.demand, 0);
        dcUtilization.push({
          dc: dc.name,
          capacity: dc.capacity,
          utilized,
          percentage: Math.min(100, (utilized / dc.capacity) * 100),
        });

        assignedCustomers.forEach(customer => {
          if ("distance" in customer) {
            const dist = customer.distance as number;
            const transportCost = dist * customer.demand * costModel.transportCostPerKm;
            totalTransportCost += transportCost;
            totalHandlingCost += customer.demand * costModel.handlingCost;
            
            if (dist <= serviceRadius) {
              coveredDemand += customer.demand;
            }
          }
        });
      });

      // Facility costs
      const totalFacilityCost = activeDCs.reduce((s, dc) => s + dc.fixedCost + dc.variableCost * 10000, 0);
      
      // Calculate service level
      const avgDistance = customerAssignments.reduce((s, c) => s + ((c as { distance?: number }).distance || 0), 0) / customers.length;
      const coveragePercentage = (coveredDemand / totalDemand) * 100;
      const utilizationRate = dcUtilization.reduce((s, d) => s + d.percentage, 0) / dcUtilization.length;
      const serviceLevel = Math.min(100, Math.round(coveragePercentage * 0.4 + (100 - avgDistance / 5) * 0.3 + utilizationRate * 0.3));

      // Total cost
      const totalCost = totalFacilityCost + totalTransportCost + totalHandlingCost;

      // Cost breakdown
      const costBreakdown = [
        { name: "Facility Costs", value: totalFacilityCost, percentage: (totalFacilityCost / totalCost) * 100 },
        { name: "Transport Costs", value: totalTransportCost, percentage: (totalTransportCost / totalCost) * 100 },
        { name: "Handling Costs", value: totalHandlingCost, percentage: (totalHandlingCost / totalCost) * 100 },
      ];

      // Monthly projection (12 months)
      const monthlyProjection = Array.from({ length: 12 }, (_, i) => {
        const seasonalFactor = 1 + Math.sin((i / 12) * Math.PI * 2) * 0.15;
        const demandGrowth = 1 + (demandPoints.reduce((s, d) => s + d.growthRate, 0) / demandPoints.length / 100) * (i / 12);
        return {
          month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
          cost: Math.round(totalCost / 12 * seasonalFactor * demandGrowth),
          demand: Math.round((totalDemand + totalDemandPoints) * seasonalFactor * demandGrowth),
        };
      });

      // Generate recommendations
      const recommendations: OptimizationRecommendation[] = [];
      
      if (utilizationRate > 90) {
        recommendations.push({
          id: generateId(),
          type: "capacity",
          priority: "high",
          title: "Capacity Near Limit",
          description: "One or more distribution centers are operating near capacity. Consider expanding capacity or adding new facilities.",
          impact: "Risk of service delays during peak periods",
          potentialSavings: totalCost * 0.05,
        });
      }
      
      if (coveragePercentage < 85) {
        recommendations.push({
          id: generateId(),
          type: "coverage",
          priority: "high",
          title: "Coverage Gap Detected",
          description: `${(100 - coveragePercentage).toFixed(1)}% of demand is outside the service radius. Consider adding a regional DC.`,
          impact: "Increased delivery times and customer dissatisfaction",
          potentialSavings: totalTransportCost * 0.1,
        });
      }
      
      if (avgDistance > serviceRadius * 0.6) {
        recommendations.push({
          id: generateId(),
          type: "service",
          priority: "medium",
          title: "Optimize DC Locations",
          description: `Average delivery distance (${avgDistance.toFixed(0)} km) is high. Consider relocating or adding cross-dock facilities.`,
          impact: "Higher transport costs and longer delivery times",
          potentialSavings: totalTransportCost * 0.15,
        });
      }
      
      if (totalFacilityCost / totalCost > 0.6) {
        recommendations.push({
          id: generateId(),
          type: "cost",
          priority: "medium",
          title: "High Fixed Cost Ratio",
          description: "Facility costs represent a large portion of total costs. Consider shared facilities or 3PL partnerships.",
          impact: "Reduced flexibility during demand fluctuations",
          potentialSavings: totalFacilityCost * 0.2,
        });
      }
      
      if (serviceLevel >= 85) {
        recommendations.push({
          id: generateId(),
          type: "service",
          priority: "low",
          title: "Well-Optimized Network",
          description: "Your distribution network is performing well. Focus on continuous improvement and monitoring.",
          impact: "Maintain current service levels",
          potentialSavings: 0,
        });
      }

      setResult({
        totalCost,
        facilityCost: totalFacilityCost,
        transportCost: totalTransportCost,
        handlingCost: totalHandlingCost,
        avgDistance,
        coveragePercentage,
        utilizationRate,
        serviceLevel,
        recommendations,
        costBreakdown,
        dcUtilization,
        monthlyProjection,
      });

      setIsCalculating(false);
    }, 800);
  }, [distributionCenters, customers, demandPoints, costModel, serviceRadius]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Chart data
  const costPieData = useMemo(() => {
    if (!result) return [];
    return result.costBreakdown.map((item, i) => ({
      name: item.name,
      value: item.value,
      percentage: item.percentage,
      color: [COLORS[0], COLORS[1], COLORS[2]][i],
    }));
  }, [result]);

  const scatterData = useMemo(() => {
    const dcs = distributionCenters.filter(dc => dc.isActive).map((dc, i) => ({
      name: dc.name,
      lat: dc.lat,
      lng: dc.lng,
      type: "dc",
      color: COLORS[i % COLORS.length],
    }));
    
    const custs = customers.map((c, i) => ({
      name: c.name,
      lat: c.lat,
      lng: c.lng,
      type: "customer",
      color: COLORS[i % COLORS.length],
    }));
    
    const demands = demandPoints.map((d, i) => ({
      name: d.name,
      lat: d.lat,
      lng: d.lng,
      type: "demand",
      color: COLORS[i % COLORS.length],
    }));
    
    return [...dcs, ...custs, ...demands];
  }, [distributionCenters, customers, demandPoints]);

  // Reset
  const resetAll = useCallback(() => {
    setDistributionCenters([]);
    setCustomers([]);
    setDemandPoints([]);
    setResult(null);
    setServiceRadius(300);
    setCostModel({
      facilityCost: 100000,
      transportCostPerKm: 1.5,
      handlingCost: 0.5,
      inventoryHoldingCost: 0.15,
      fixedOperatingCost: 50000,
    });
  }, []);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="demand" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Demand
          </TabsTrigger>
          <TabsTrigger value="cost" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Costs
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="optimize" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Optimize
          </TabsTrigger>
        </TabsList>

        {/* Network Tab */}
        <TabsContent value="network" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-[#0F4C81]">Distribution Centers</h3>
              <p className="text-sm text-muted-foreground">Configure your warehouse network</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Dialog open={showAddDC} onOpenChange={setShowAddDC}>
                <DialogTrigger asChild>
                  <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add DC
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Distribution Center</DialogTitle>
                    <DialogDescription>Add a new distribution center to your network</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Name</Label>
                      <Input value={newDC.name} onChange={(e) => setNewDC({ ...newDC, name: e.target.value })} placeholder="e.g., East Coast Hub" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Latitude</Label>
                        <Input type="number" step="0.0001" value={newDC.lat} onChange={(e) => setNewDC({ ...newDC, lat: parseFloat(e.target.value) })} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Longitude</Label>
                        <Input type="number" step="0.0001" value={newDC.lng} onChange={(e) => setNewDC({ ...newDC, lng: parseFloat(e.target.value) })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Capacity (units)</Label>
                        <Input type="number" value={newDC.capacity} onChange={(e) => setNewDC({ ...newDC, capacity: parseInt(e.target.value) })} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Type</Label>
                        <Select value={newDC.type} onValueChange={(v) => setNewDC({ ...newDC, type: v as "primary" | "regional" | "cross-dock" })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="regional">Regional</SelectItem>
                            <SelectItem value="cross-dock">Cross-Dock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Fixed Cost ($/year)</Label>
                        <Input type="number" value={newDC.fixedCost} onChange={(e) => setNewDC({ ...newDC, fixedCost: parseInt(e.target.value) })} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Variable Cost ($/unit)</Label>
                        <Input type="number" step="0.1" value={newDC.variableCost} onChange={(e) => setNewDC({ ...newDC, variableCost: parseFloat(e.target.value) })} />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addDistributionCenter} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">Add Center</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* DC Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {distributionCenters.map((dc, index) => (
                <motion.div
                  key={dc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`border-l-4 ${!dc.isActive ? "opacity-60" : ""}`} style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Warehouse className="h-5 w-5" style={{ color: COLORS[index % COLORS.length] }} />
                          <CardTitle className="text-base">{dc.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={dc.type === "primary" ? "default" : dc.type === "regional" ? "secondary" : "outline"}>
                            {dc.type}
                          </Badge>
                          <Switch checked={dc.isActive} onCheckedChange={() => toggleDCActive(dc.id)} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <p className="font-medium">{dc.lat.toFixed(2)}, {dc.lng.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Capacity:</span>
                          <p className="font-medium">{dc.capacity.toLocaleString()} units</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fixed Cost:</span>
                          <p className="font-medium">{formatCurrency(dc.fixedCost)}/yr</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Variable:</span>
                          <p className="font-medium">${dc.variableCost}/unit</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive" onClick={() => removeDistributionCenter(dc.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Separator />

          {/* Customer Locations */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-[#2E8B57]">Customer Locations</h3>
              <p className="text-sm text-muted-foreground">{customers.length} locations configured</p>
            </div>
            <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57]/10">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Customer Location</DialogTitle>
                  <DialogDescription>Add a new customer or delivery point</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} placeholder="e.g., NYC Retail Store" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Latitude</Label>
                      <Input type="number" step="0.0001" value={newCustomer.lat} onChange={(e) => setNewCustomer({ ...newCustomer, lat: parseFloat(e.target.value) })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Longitude</Label>
                      <Input type="number" step="0.0001" value={newCustomer.lng} onChange={(e) => setNewCustomer({ ...newCustomer, lng: parseFloat(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Demand (units/month)</Label>
                      <Input type="number" value={newCustomer.demand} onChange={(e) => setNewCustomer({ ...newCustomer, demand: parseInt(e.target.value) })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Target Service Level (%)</Label>
                      <Input type="number" value={newCustomer.serviceLevel} onChange={(e) => setNewCustomer({ ...newCustomer, serviceLevel: parseInt(e.target.value) })} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addCustomer} className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">Add Customer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
            {customers.map((customer, index) => (
              <Card key={customer.id} className="border-l-2" style={{ borderLeftColor: COLORS[index % COLORS.length] + "80" }}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: COLORS[index % COLORS.length] }} />
                      <span className="font-medium">{customer.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeCustomer(customer.id)} className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                    <span>Demand: {customer.demand.toLocaleString()}</span>
                    <span>SL: {customer.serviceLevel}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Demand Tab */}
        <TabsContent value="demand" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-[#0F4C81]">Demand Points</h3>
              <p className="text-sm text-muted-foreground">Configure demand centers and seasonality</p>
            </div>
            <Dialog open={showAddDemand} onOpenChange={setShowAddDemand}>
              <DialogTrigger asChild>
                <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Demand Point
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Demand Point</DialogTitle>
                  <DialogDescription>Add a demand concentration area</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input value={newDemandPoint.name} onChange={(e) => setNewDemandPoint({ ...newDemandPoint, name: e.target.value })} placeholder="e.g., Metro Area" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Latitude</Label>
                      <Input type="number" step="0.0001" value={newDemandPoint.lat} onChange={(e) => setNewDemandPoint({ ...newDemandPoint, lat: parseFloat(e.target.value) })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Longitude</Label>
                      <Input type="number" step="0.0001" value={newDemandPoint.lng} onChange={(e) => setNewDemandPoint({ ...newDemandPoint, lng: parseFloat(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label>Demand</Label>
                      <Input type="number" value={newDemandPoint.demand} onChange={(e) => setNewDemandPoint({ ...newDemandPoint, demand: parseInt(e.target.value) })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Seasonality</Label>
                      <Input type="number" step="0.1" value={newDemandPoint.seasonality} onChange={(e) => setNewDemandPoint({ ...newDemandPoint, seasonality: parseFloat(e.target.value) })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Growth %</Label>
                      <Input type="number" value={newDemandPoint.growthRate} onChange={(e) => setNewDemandPoint({ ...newDemandPoint, growthRate: parseInt(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Priority</Label>
                    <Select value={newDemandPoint.priority} onValueChange={(v) => setNewDemandPoint({ ...newDemandPoint, priority: v as "high" | "medium" | "low" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addDemandPoint} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">Add Point</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Demand Points Cards */}
          <div className="grid gap-4">
            <AnimatePresence>
              {demandPoints.map((dp, index) => (
                <motion.div
                  key={dp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-l-4" style={{ borderLeftColor: PRIORITY_COLORS[dp.priority] }}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5" style={{ color: PRIORITY_COLORS[dp.priority] }} />
                          <span className="font-semibold text-lg">{dp.name}</span>
                          <Badge style={{ backgroundColor: PRIORITY_COLORS[dp.priority], color: "white" }}>{dp.priority}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeDemandPoint(dp.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Demand</span>
                          <p className="font-bold text-lg">{dp.demand.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Seasonality</span>
                          <p className="font-bold text-lg">{dp.seasonality}x</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Growth</span>
                          <p className="font-bold text-lg text-[#2E8B57]">+{dp.growthRate}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Location</span>
                          <p className="font-medium">{dp.lat.toFixed(2)}, {dp.lng.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Peak Demand</span>
                          <p className="font-bold text-lg text-[#0F4C81]">{Math.round(dp.demand * dp.seasonality).toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Total Demand Summary */}
          <Card className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0F4C81]">{demandPoints.reduce((s, d) => s + d.demand, 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Demand</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#2E8B57]">{(demandPoints.reduce((s, d) => s + d.growthRate, 0) / demandPoints.length).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Avg Growth</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">{demandPoints.filter(d => d.priority === "high").length}</p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{Math.round(demandPoints.reduce((s, d) => s + d.demand * d.seasonality, 0)).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Peak Demand</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Modeling Tab */}
        <TabsContent value="cost" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Settings className="h-5 w-5" />
                Cost Model Configuration
              </CardTitle>
              <CardDescription>Define cost parameters for network optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Transport Cost */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#2E8B57]" />
                      Transport Cost ($/km/unit)
                    </Label>
                    <Badge variant="secondary">${costModel.transportCostPerKm.toFixed(2)}</Badge>
                  </div>
                  <Slider
                    value={[costModel.transportCostPerKm * 100]}
                    onValueChange={(v) => setCostModel({ ...costModel, transportCostPerKm: v[0] / 100 })}
                    min={50}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>

                {/* Handling Cost */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#0F4C81]" />
                      Handling Cost ($/unit)
                    </Label>
                    <Badge variant="secondary">${costModel.handlingCost.toFixed(2)}</Badge>
                  </div>
                  <Slider
                    value={[costModel.handlingCost * 100]}
                    onValueChange={(v) => setCostModel({ ...costModel, handlingCost: v[0] / 100 })}
                    min={10}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>

                {/* Facility Cost */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-600" />
                    Base Facility Cost ($/year)
                  </Label>
                  <Input
                    type="number"
                    value={costModel.facilityCost}
                    onChange={(e) => setCostModel({ ...costModel, facilityCost: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Fixed Operating Cost */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-600" />
                    Fixed Operating Cost ($/year)
                  </Label>
                  <Input
                    type="number"
                    value={costModel.fixedOperatingCost}
                    onChange={(e) => setCostModel({ ...costModel, fixedOperatingCost: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Inventory Holding Cost */}
                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#2E8B57]" />
                      Inventory Holding Cost (% of inventory value)
                    </Label>
                    <Badge variant="secondary">{(costModel.inventoryHoldingCost * 100).toFixed(0)}%</Badge>
                  </div>
                  <Slider
                    value={[costModel.inventoryHoldingCost * 1000]}
                    onValueChange={(v) => setCostModel({ ...costModel, inventoryHoldingCost: v[0] / 1000 })}
                    min={5}
                    max={35}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              {/* Service Radius */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <CircleDot className="h-4 w-4 text-[#0F4C81]" />
                    Service Coverage Radius (km)
                  </Label>
                  <Badge variant="secondary">{serviceRadius} km</Badge>
                </div>
                <Slider
                  value={[serviceRadius]}
                  onValueChange={setServiceRadius}
                  min={50}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum delivery distance from distribution center to customer
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Run Optimization */}
          <div className="flex justify-center">
            <Button
              onClick={runOptimization}
              disabled={isCalculating || distributionCenters.filter(dc => dc.isActive).length === 0 || customers.length === 0}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Network...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Run Network Analysis
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6 mt-6">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* KPI Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Annual</span>
                    </div>
                    <p className="text-3xl font-bold">{formatCurrency(result.totalCost)}</p>
                    <p className="text-sm opacity-80 mt-1">Total Cost</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Coverage</span>
                    </div>
                    <p className="text-3xl font-bold">{result.coveragePercentage.toFixed(1)}%</p>
                    <p className="text-sm opacity-80 mt-1">Service Radius</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Truck className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Avg</span>
                    </div>
                    <p className="text-3xl font-bold">{result.avgDistance.toFixed(0)} km</p>
                    <p className="text-sm opacity-80 mt-1">Delivery Distance</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Score</span>
                    </div>
                    <p className="text-3xl font-bold">{result.serviceLevel}</p>
                    <p className="text-sm opacity-80 mt-1">Service Level</p>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Breakdown & Utilization */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Cost Breakdown Pie */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                      <PieChartIcon className="h-5 w-5" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={costPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                        >
                          {costPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* DC Utilization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2E8B57]">
                      <Building2 className="h-5 w-5" />
                      DC Utilization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.dcUtilization.map((dc, index) => (
                      <div key={dc.dc} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{dc.dc}</span>
                          <span className="text-muted-foreground">{dc.utilized.toLocaleString()} / {dc.capacity.toLocaleString()}</span>
                        </div>
                        <Progress value={dc.percentage} className="h-2" style={{ backgroundColor: COLORS[index % COLORS.length] + "20" }} />
                        <p className="text-xs text-right font-medium" style={{ color: dc.percentage > 90 ? "#EF4444" : dc.percentage > 70 ? "#F59E0B" : "#22C55E" }}>
                          {dc.percentage.toFixed(1)}%
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Projection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <LineChart className="h-5 w-5" />
                    12-Month Cost Projection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={result.monthlyProjection}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="cost" fill="#0F4C81" name="Cost ($)" />
                      <Line yAxisId="right" type="monotone" dataKey="demand" stroke="#2E8B57" strokeWidth={2} name="Demand" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                <p className="text-muted-foreground mb-4">Configure your network and run the analysis to see results</p>
                <Button onClick={() => setActiveTab("cost")} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                  Configure & Run Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimize" className="space-y-6 mt-6">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F4C81]">Network Optimization Suggestions</h3>
                  <p className="text-sm text-muted-foreground">AI-powered recommendations to improve your network</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Plan
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Recommendations */}
              <div className="grid gap-4">
                <AnimatePresence>
                  {result.recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-l-4 ${rec.priority === "high" ? "border-red-500" : rec.priority === "medium" ? "border-amber-500" : "border-green-500"}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${rec.type === "cost" ? "bg-green-100" : rec.type === "service" ? "bg-blue-100" : rec.type === "capacity" ? "bg-amber-100" : "bg-purple-100"}`}>
                                {rec.type === "cost" && <DollarSign className="h-5 w-5 text-green-600" />}
                                {rec.type === "service" && <Truck className="h-5 w-5 text-blue-600" />}
                                {rec.type === "capacity" && <Building2 className="h-5 w-5 text-amber-600" />}
                                {rec.type === "coverage" && <Target className="h-5 w-5 text-purple-600" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{rec.title}</h4>
                                  <Badge variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"}>
                                    {rec.priority}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm mb-2">{rec.description}</p>
                                <p className="text-sm"><span className="font-medium">Impact:</span> {rec.impact}</p>
                              </div>
                            </div>
                            {rec.potentialSavings > 0 && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Potential Savings</p>
                                <p className="text-xl font-bold text-[#2E8B57]">{formatCurrency(rec.potentialSavings)}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => { setActiveTab("network"); setShowAddDC(true); }}>
                      <Plus className="h-5 w-5" />
                      <span>Add New DC</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab("cost")}>
                      <Settings className="h-5 w-5" />
                      <span>Adjust Parameters</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={runOptimization}>
                      <RefreshCw className="h-5 w-5" />
                      <span>Re-run Analysis</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Total Savings Potential */}
              <Card className="bg-gradient-to-r from-[#2E8B57]/10 to-[#0F4C81]/10">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Potential Annual Savings</p>
                      <p className="text-3xl font-bold text-[#2E8B57]">
                        {formatCurrency(result.recommendations.reduce((s, r) => s + r.potentialSavings, 0))}
                      </p>
                    </div>
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Optimized Total Cost</p>
                      <p className="text-3xl font-bold text-[#0F4C81]">
                        {formatCurrency(result.totalCost - result.recommendations.reduce((s, r) => s + r.potentialSavings, 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Run Analysis First</h3>
                <p className="text-muted-foreground mb-4">Complete network analysis to receive optimization suggestions</p>
                <Button onClick={() => setActiveTab("cost")} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                  Go to Cost Configuration
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
