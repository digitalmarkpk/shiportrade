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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
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
  ReferenceLine,
  ComposedChart,
  Area,
  Line,
} from "recharts";

// Types
interface CustomerLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  demand: number;
  transportCost: number;
}

interface WarehouseLocation {
  id: string;
  lat: number;
  lng: number;
  customerAssignments: string[];
  totalDemand: number;
  avgTransportCost: number;
}

interface OptimizationResult {
  optimalWarehouseCount: number;
  warehouses: WarehouseLocation[];
  centerOfGravity: { lat: number; lng: number };
  totalCost: number;
  avgDistance: number;
  coveragePercentage: number;
  serviceLevelScore: number;
  recommendations: string[];
  costSavings: number;
  demandCoverage: { warehouse: string; demand: number; percentage: number }[];
  distanceMatrix: { from: string; to: string; distance: number; cost: number }[];
}

// Sample customer locations for different regions
const SAMPLE_LOCATIONS: Record<string, CustomerLocation[]> = {
  "us-west": [
    { id: "1", name: "Los Angeles", lat: 34.0522, lng: -118.2437, demand: 4500, transportCost: 2.5 },
    { id: "2", name: "San Francisco", lat: 37.7749, lng: -122.4194, demand: 3200, transportCost: 2.8 },
    { id: "3", name: "Seattle", lat: 47.6062, lng: -122.3321, demand: 2800, transportCost: 3.2 },
    { id: "4", name: "Portland", lat: 45.5152, lng: -122.6784, demand: 1800, transportCost: 3.0 },
    { id: "5", name: "Phoenix", lat: 33.4484, lng: -112.074, demand: 2200, transportCost: 2.6 },
    { id: "6", name: "San Diego", lat: 32.7157, lng: -117.1611, demand: 1900, transportCost: 2.4 },
    { id: "7", name: "Las Vegas", lat: 36.1699, lng: -115.1398, demand: 1500, transportCost: 2.7 },
    { id: "8", name: "Denver", lat: 39.7392, lng: -104.9903, demand: 2100, transportCost: 3.5 },
  ],
  "us-east": [
    { id: "1", name: "New York", lat: 40.7128, lng: -74.006, demand: 6500, transportCost: 3.5 },
    { id: "2", name: "Boston", lat: 42.3601, lng: -71.0589, demand: 2800, transportCost: 3.8 },
    { id: "3", name: "Philadelphia", lat: 39.9526, lng: -75.1652, demand: 2400, transportCost: 3.2 },
    { id: "4", name: "Miami", lat: 25.7617, lng: -80.1918, demand: 3200, transportCost: 2.8 },
    { id: "5", name: "Atlanta", lat: 33.749, lng: -84.388, demand: 3800, transportCost: 2.6 },
    { id: "6", name: "Chicago", lat: 41.8781, lng: -87.6298, demand: 4200, transportCost: 2.9 },
    { id: "7", name: "Washington DC", lat: 38.9072, lng: -77.0369, demand: 2900, transportCost: 3.4 },
    { id: "8", name: "Charlotte", lat: 35.2271, lng: -80.8431, demand: 1800, transportCost: 2.5 },
  ],
  europe: [
    { id: "1", name: "London", lat: 51.5074, lng: -0.1278, demand: 5500, transportCost: 4.2 },
    { id: "2", name: "Paris", lat: 48.8566, lng: 2.3522, demand: 4200, transportCost: 3.8 },
    { id: "3", name: "Frankfurt", lat: 50.1109, lng: 8.6821, demand: 3800, transportCost: 3.5 },
    { id: "4", name: "Amsterdam", lat: 52.3676, lng: 4.9041, demand: 3200, transportCost: 3.6 },
    { id: "5", name: "Milan", lat: 45.4642, lng: 9.19, demand: 2800, transportCost: 3.2 },
    { id: "6", name: "Madrid", lat: 40.4168, lng: -3.7038, demand: 2400, transportCost: 2.9 },
    { id: "7", name: "Barcelona", lat: 41.3851, lng: 2.1734, demand: 2000, transportCost: 2.8 },
    { id: "8", name: "Brussels", lat: 50.8503, lng: 4.3517, demand: 1800, transportCost: 3.4 },
  ],
  asia: [
    { id: "1", name: "Shanghai", lat: 31.2304, lng: 121.4737, demand: 8500, transportCost: 1.8 },
    { id: "2", name: "Tokyo", lat: 35.6762, lng: 139.6503, demand: 6200, transportCost: 2.5 },
    { id: "3", name: "Singapore", lat: 1.3521, lng: 103.8198, demand: 4800, transportCost: 2.2 },
    { id: "4", name: "Hong Kong", lat: 22.3193, lng: 114.1694, demand: 4200, transportCost: 2.4 },
    { id: "5", name: "Seoul", lat: 37.5665, lng: 126.978, demand: 3800, transportCost: 2.3 },
    { id: "6", name: "Bangkok", lat: 13.7563, lng: 100.5018, demand: 2800, transportCost: 1.5 },
    { id: "7", name: "Kuala Lumpur", lat: 3.139, lng: 101.6869, demand: 2200, transportCost: 1.6 },
    { id: "8", name: "Manila", lat: 14.5995, lng: 120.9842, demand: 2400, transportCost: 1.4 },
  ],
};

// Helper function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
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

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Create default customer location
const createDefaultLocation = (index: number): CustomerLocation => ({
  id: generateId(),
  name: `Customer ${index + 1}`,
  lat: 40 + Math.random() * 10,
  lng: -100 + Math.random() * 20,
  demand: 1000 + Math.floor(Math.random() * 3000),
  transportCost: 2 + Math.random() * 2,
});

const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"];

export default function WarehouseLocationOptimizer() {
  const [activeTab, setActiveTab] = useState("input");
  const [locations, setLocations] = useState<CustomerLocation[]>(SAMPLE_LOCATIONS["us-west"]);
  const [selectedRegion, setSelectedRegion] = useState("us-west");
  const [serviceRadius, setServiceRadius] = useState(300);
  const [maxWarehouses, setMaxWarehouses] = useState(5);
  const [transportCostFactor, setTransportCostFactor] = useState(1.0);
  const [warehouseCost, setWarehouseCost] = useState(50000);
  const [optimizationGoal, setOptimizationGoal] = useState("balanced");
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Add customer location
  const addLocation = useCallback(() => {
    setLocations((prev) => [...prev, createDefaultLocation(prev.length)]);
  }, []);

  // Remove customer location
  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  }, []);

  // Update customer location
  const updateLocation = useCallback((id: string, updates: Partial<CustomerLocation>) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc))
    );
  }, []);

  // Load sample data
  const loadSampleData = useCallback((region: string) => {
    setSelectedRegion(region);
    setLocations(SAMPLE_LOCATIONS[region] || []);
  }, []);

  // Calculate center of gravity (weighted by demand)
  const calculateCenterOfGravity = useCallback((locs: CustomerLocation[]) => {
    const totalDemand = locs.reduce((sum, loc) => sum + loc.demand, 0);
    const weightedLat = locs.reduce((sum, loc) => sum + loc.lat * loc.demand, 0) / totalDemand;
    const weightedLng = locs.reduce((sum, loc) => sum + loc.lng * loc.demand, 0) / totalDemand;
    return { lat: weightedLat, lng: weightedLng };
  }, []);

  // K-means clustering for warehouse placement
  const kMeansClustering = useCallback(
    (locs: CustomerLocation[], k: number, maxIterations: number = 100): WarehouseLocation[] => {
      if (locs.length === 0 || k <= 0) return [];

      // Initialize centroids using k-means++ method
      const centroids: { lat: number; lng: number }[] = [];
      
      // First centroid: center of gravity
      centroids.push(calculateCenterOfGravity(locs));

      // Subsequent centroids: choose points far from existing centroids
      while (centroids.length < k) {
        const distances = locs.map((loc) => {
          const minDist = Math.min(
            ...centroids.map((c) => calculateDistance(loc.lat, loc.lng, c.lat, c.lng))
          );
          return { loc, dist: minDist * minDist };
        });
        const totalDist = distances.reduce((sum, d) => sum + d.dist, 0);
        let random = Math.random() * totalDist;
        for (const d of distances) {
          random -= d.dist;
          if (random <= 0) {
            centroids.push({ lat: d.loc.lat, lng: d.loc.lng });
            break;
          }
        }
      }

      // Run k-means iterations
      let assignments: number[] = new Array(locs.length).fill(0);

      for (let iter = 0; iter < maxIterations; iter++) {
        // Assign points to nearest centroid
        const newAssignments = locs.map((loc) => {
          const distances = centroids.map((c, i) => ({
            index: i,
            dist: calculateDistance(loc.lat, loc.lng, c.lat, c.lng),
          }));
          return distances.sort((a, b) => a.dist - b.dist)[0].index;
        });

        // Check for convergence
        if (JSON.stringify(newAssignments) === JSON.stringify(assignments)) break;
        assignments = newAssignments;

        // Update centroids (weighted by demand)
        for (let i = 0; i < k; i++) {
          const cluster = locs.filter((_, j) => assignments[j] === i);
          if (cluster.length > 0) {
            const totalDemand = cluster.reduce((sum, loc) => sum + loc.demand, 0);
            centroids[i] = {
              lat: cluster.reduce((sum, loc) => sum + loc.lat * loc.demand, 0) / totalDemand,
              lng: cluster.reduce((sum, loc) => sum + loc.lng * loc.demand, 0) / totalDemand,
            };
          }
        }
      }

      // Create warehouse locations
      const warehouses: WarehouseLocation[] = centroids.map((c, i) => {
        const assignedCustomers = locs.filter((_, j) => assignments[j] === i);
        return {
          id: `W${i + 1}`,
          lat: c.lat,
          lng: c.lng,
          customerAssignments: assignedCustomers.map((loc) => loc.id),
          totalDemand: assignedCustomers.reduce((sum, loc) => sum + loc.demand, 0),
          avgTransportCost:
            assignedCustomers.length > 0
              ? assignedCustomers.reduce((sum, loc) => sum + loc.transportCost, 0) /
                assignedCustomers.length
              : 0,
        };
      });

      return warehouses.filter((w) => w.customerAssignments.length > 0);
    },
    [calculateCenterOfGravity]
  );

  // Calculate optimal number of warehouses using elbow method
  const findOptimalWarehouseCount = useCallback(
    (locs: CustomerLocation[], maxK: number): number => {
      if (locs.length <= 1) return 1;

      const costs: number[] = [];
      for (let k = 1; k <= Math.min(maxK, locs.length); k++) {
        const warehouses = kMeansClustering(locs, k);
        let totalDistance = 0;
        warehouses.forEach((w) => {
          const assignedLocs = locs.filter((l) => w.customerAssignments.includes(l.id));
          assignedLocs.forEach((loc) => {
            totalDistance += calculateDistance(w.lat, w.lng, loc.lat, loc.lng) * loc.demand;
          });
        });
        costs.push(totalDistance + k * warehouseCost * 0.001); // Normalize warehouse cost
      }

      // Find elbow point using second derivative
      if (costs.length < 3) return 1;

      const optimalIndex = costs.findIndex((cost, i) => {
        if (i === 0) return false;
        const improvement = costs[i - 1] - cost;
        const nextImprovement = i < costs.length - 1 ? cost - costs[i + 1] : 0;
        return improvement < nextImprovement * 2 || improvement < costs[0] * 0.05;
      });

      return Math.max(1, optimalIndex === -1 ? Math.ceil(costs.length / 2) : optimalIndex + 1);
    },
    [kMeansClustering, warehouseCost]
  );

  // Main optimization function
  const runOptimization = useCallback(() => {
    setIsCalculating(true);

    setTimeout(() => {
      if (locations.length === 0) {
        setResult(null);
        setIsCalculating(false);
        return;
      }

      // Find optimal warehouse count
      const optimalCount = findOptimalWarehouseCount(locations, maxWarehouses);

      // Run k-means clustering
      const warehouses = kMeansClustering(locations, optimalCount);

      // Calculate center of gravity
      const centerOfGravity = calculateCenterOfGravity(locations);

      // Calculate metrics
      let totalCost = 0;
      let totalDistance = 0;
      let coveredDemand = 0;
      const totalDemand = locations.reduce((sum, loc) => sum + loc.demand, 0);
      const distanceMatrix: { from: string; to: string; distance: number; cost: number }[] = [];

      warehouses.forEach((warehouse) => {
        const assignedLocs = locations.filter((l) => warehouse.customerAssignments.includes(l.id));
        assignedLocs.forEach((loc) => {
          const distance = calculateDistance(warehouse.lat, warehouse.lng, loc.lat, loc.lng);
          const cost = distance * loc.demand * loc.transportCost * transportCostFactor;
          totalDistance += distance * loc.demand;
          totalCost += cost;
          distanceMatrix.push({
            from: loc.name,
            to: warehouse.id,
            distance: Math.round(distance),
            cost: Math.round(cost),
          });

          if (distance <= serviceRadius) {
            coveredDemand += loc.demand;
          }
        });
      });

      // Add fixed warehouse costs
      totalCost += warehouses.length * warehouseCost;

      const avgDistance = totalDistance / totalDemand;
      const coveragePercentage = (coveredDemand / totalDemand) * 100;

      // Calculate service level score (0-100)
      const serviceLevelScore = Math.min(
        100,
        Math.round(
          coveragePercentage * 0.5 +
            (100 - avgDistance / 10) * 0.3 +
            (100 - totalCost / totalDemand / 100) * 0.2
        )
      );

      // Generate demand coverage data
      const demandCoverage = warehouses.map((w) => ({
        warehouse: w.id,
        demand: w.totalDemand,
        percentage: (w.totalDemand / totalDemand) * 100,
      }));

      // Generate recommendations
      const recommendations: string[] = [];
      if (coveragePercentage < 90) {
        recommendations.push(
          `Increase service radius or add more warehouses to improve coverage from ${coveragePercentage.toFixed(1)}%`
        );
      }
      if (avgDistance > serviceRadius * 0.5) {
        recommendations.push(
          `Consider relocating warehouses to reduce average delivery distance of ${avgDistance.toFixed(0)} km`
        );
      }
      if (warehouses.length > 1) {
        const maxDemandWarehouse = warehouses.sort((a, b) => b.totalDemand - a.totalDemand)[0];
        const minDemandWarehouse = warehouses.sort((a, b) => a.totalDemand - b.totalDemand)[0];
        if (maxDemandWarehouse.totalDemand > minDemandWarehouse.totalDemand * 3) {
          recommendations.push(
            "Demand distribution is highly uneven - consider rebalancing warehouse assignments"
          );
        }
      }
      if (serviceLevelScore >= 85) {
        recommendations.push("Excellent configuration! Network is well-optimized for current demand");
      }

      // Calculate cost savings vs single warehouse
      const singleWarehouseCost =
        locations.reduce((sum, loc) => {
          const dist = calculateDistance(centerOfGravity.lat, centerOfGravity.lng, loc.lat, loc.lng);
          return sum + dist * loc.demand * loc.transportCost * transportCostFactor;
        }, 0) + warehouseCost;
      const costSavings = singleWarehouseCost - totalCost;

      setResult({
        optimalWarehouseCount: optimalCount,
        warehouses,
        centerOfGravity,
        totalCost,
        avgDistance,
        coveragePercentage,
        serviceLevelScore,
        recommendations,
        costSavings,
        demandCoverage,
        distanceMatrix,
      });

      setIsCalculating(false);
    }, 800);
  }, [
    locations,
    maxWarehouses,
    serviceRadius,
    transportCostFactor,
    warehouseCost,
    findOptimalWarehouseCount,
    kMeansClustering,
    calculateCenterOfGravity,
  ]);

  // Reset all
  const resetAll = useCallback(() => {
    setLocations([]);
    setResult(null);
    setServiceRadius(300);
    setMaxWarehouses(5);
    setTransportCostFactor(1.0);
    setWarehouseCost(50000);
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Scatter chart data
  const scatterData = useMemo(() => {
    if (!result) return { customers: [], warehouses: [] };

    const customers = locations.map((loc, index) => ({
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      demand: loc.demand,
      color: COLORS[index % COLORS.length],
    }));

    const warehouses = result.warehouses.map((w, index) => ({
      name: w.id,
      lat: w.lat,
      lng: w.lng,
      demand: w.totalDemand,
      color: COLORS[index % COLORS.length],
    }));

    return { customers, warehouses };
  }, [result, locations]);

  // Coverage pie chart data
  const coveragePieData = useMemo(() => {
    if (!result) return [];
    return result.demandCoverage.map((d, i) => ({
      name: d.warehouse,
      value: d.demand,
      percentage: d.percentage,
      color: COLORS[i % COLORS.length],
    }));
  }, [result]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input">Customer Locations</TabsTrigger>
          <TabsTrigger value="settings">Optimization Settings</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Map</TabsTrigger>
        </TabsList>

        {/* Customer Locations Input Tab */}
        <TabsContent value="input" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {locations.length} location{locations.length !== 1 ? "s" : ""}
              </Badge>
              <Select value={selectedRegion} onValueChange={loadSampleData}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Load sample data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-west">US West Coast</SelectItem>
                  <SelectItem value="us-east">US East Coast</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia Pacific</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={addLocation} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>
          </div>

          {/* Location Cards */}
          <div className="grid gap-4">
            <AnimatePresence>
              {locations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-l-4" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5" style={{ color: COLORS[index % COLORS.length] }} />
                          <Input
                            value={location.name}
                            onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                            className="w-48 font-semibold"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLocation(location.id)}
                          disabled={locations.length === 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Latitude</Label>
                          <Input
                            type="number"
                            step="0.0001"
                            value={location.lat.toFixed(4)}
                            onChange={(e) =>
                              updateLocation(location.id, { lat: parseFloat(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Longitude</Label>
                          <Input
                            type="number"
                            step="0.0001"
                            value={location.lng.toFixed(4)}
                            onChange={(e) =>
                              updateLocation(location.id, { lng: parseFloat(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Demand (units/month)</Label>
                          <Input
                            type="number"
                            value={location.demand}
                            onChange={(e) =>
                              updateLocation(location.id, { demand: parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Transport Cost ($/km/unit)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={location.transportCost.toFixed(2)}
                            onChange={(e) =>
                              updateLocation(location.id, {
                                transportCost: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Est. Monthly Revenue</Label>
                          <div className="p-2 bg-muted/50 rounded-lg text-sm font-medium">
                            {formatCurrency(location.demand * location.transportCost * 100)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Summary */}
          {locations.length > 0 && (
            <Card className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
              <CardContent className="pt-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0F4C81]">{locations.length}</p>
                    <p className="text-sm text-muted-foreground">Locations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#2E8B57]">
                      {locations.reduce((s, l) => s + l.demand, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Demand</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">
                      {(
                        locations.reduce((s, l) => s + l.transportCost, 0) / locations.length
                      ).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Transport Cost</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(
                        locations.reduce((s, l) => s + l.demand * l.transportCost * 100, 0)
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">Est. Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Optimization Settings Tab */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Settings className="h-5 w-5" />
                Optimization Parameters
              </CardTitle>
              <CardDescription>
                Configure the parameters for warehouse location optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Service Radius */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <CircleDot className="h-4 w-4 text-[#2E8B57]" />
                      Service Radius (km)
                    </Label>
                    <Badge variant="secondary">{serviceRadius} km</Badge>
                  </div>
                  <Slider
                    value={[serviceRadius]}
                    onValueChange={(v) => setServiceRadius(v[0])}
                    min={50}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum delivery distance from warehouse to customer
                  </p>
                </div>

                {/* Max Warehouses */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Warehouse className="h-4 w-4 text-[#0F4C81]" />
                      Maximum Warehouses
                    </Label>
                    <Badge variant="secondary">{maxWarehouses}</Badge>
                  </div>
                  <Slider
                    value={[maxWarehouses]}
                    onValueChange={(v) => setMaxWarehouses(v[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upper limit for number of warehouses in optimization
                  </p>
                </div>

                {/* Transport Cost Factor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-amber-600" />
                      Transport Cost Factor
                    </Label>
                    <Badge variant="secondary">{transportCostFactor.toFixed(2)}x</Badge>
                  </div>
                  <Slider
                    value={[transportCostFactor * 100]}
                    onValueChange={(v) => setTransportCostFactor(v[0] / 100)}
                    min={50}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Multiplier for transport costs (fuel surcharge, tolls, etc.)
                  </p>
                </div>

                {/* Warehouse Cost */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    Annual Warehouse Cost ($)
                  </Label>
                  <Input
                    type="number"
                    step="1000"
                    value={warehouseCost}
                    onChange={(e) => setWarehouseCost(parseInt(e.target.value) || 0)}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Fixed annual operating cost per warehouse
                  </p>
                </div>
              </div>

              <Separator />

              {/* Optimization Goal */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#0F4C81]" />
                  Optimization Goal
                </Label>
                <Select value={optimizationGoal} onValueChange={setOptimizationGoal}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cost">Minimize Cost</SelectItem>
                    <SelectItem value="service">Maximize Service Level</SelectItem>
                    <SelectItem value="balanced">Balanced Approach</SelectItem>
                    <SelectItem value="coverage">Maximize Coverage</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {optimizationGoal === "cost" &&
                    "Prioritize lowest total cost including transport and warehouse operations"}
                  {optimizationGoal === "service" &&
                    "Prioritize fastest delivery times and highest service reliability"}
                  {optimizationGoal === "balanced" &&
                    "Balance between cost efficiency and service quality"}
                  {optimizationGoal === "coverage" &&
                    "Maximize the percentage of customers within service radius"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Run Optimization Button */}
          <div className="flex justify-center">
            <Button
              onClick={runOptimization}
              disabled={isCalculating || locations.length === 0}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Run Optimization
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6 mt-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Summary Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Warehouse className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Optimal</span>
                    </div>
                    <p className="text-3xl font-bold">{result.optimalWarehouseCount}</p>
                    <p className="text-sm opacity-80 mt-1">Warehouses</p>
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
                      <DollarSign className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Annual</span>
                    </div>
                    <p className="text-3xl font-bold">{formatCurrency(result.totalCost)}</p>
                    <p className="text-sm opacity-80 mt-1">Total Cost</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Service</span>
                    </div>
                    <p className="text-3xl font-bold">{result.serviceLevelScore}</p>
                    <p className="text-sm opacity-80 mt-1">Service Score</p>
                  </CardContent>
                </Card>
              </div>

              {/* Center of Gravity */}
              <Card className="border-[#0F4C81]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Globe className="h-5 w-5" />
                    Center of Gravity Analysis
                  </CardTitle>
                  <CardDescription>
                    Weighted center point based on demand distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#0F4C81]/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Latitude</p>
                      <p className="text-2xl font-bold text-[#0F4C81]">
                        {result.centerOfGravity.lat.toFixed(4)}
                      </p>
                    </div>
                    <div className="p-4 bg-[#2E8B57]/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Longitude</p>
                      <p className="text-2xl font-bold text-[#2E8B57]">
                        {result.centerOfGravity.lng.toFixed(4)}
                      </p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Avg Distance to CoG</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {result.avgDistance.toFixed(0)} km
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warehouse Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Layers className="h-5 w-5" />
                    Warehouse Assignments
                  </CardTitle>
                  <CardDescription>
                    Customer locations assigned to each warehouse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {result.warehouses.map((warehouse, index) => (
                      <motion.div
                        key={warehouse.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border-2 rounded-lg"
                        style={{ borderColor: COLORS[index % COLORS.length] + "40" }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-semibold text-lg">{warehouse.id}</span>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span>
                              <span className="text-muted-foreground">Location:</span>{" "}
                              {warehouse.lat.toFixed(2)}, {warehouse.lng.toFixed(2)}
                            </span>
                            <span>
                              <span className="text-muted-foreground">Demand:</span>{" "}
                              {warehouse.totalDemand.toLocaleString()} units
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {warehouse.customerAssignments.map((custId) => {
                            const customer = locations.find((l) => l.id === custId);
                            return customer ? (
                              <Badge key={custId} variant="outline" className="text-xs">
                                {customer.name} ({customer.demand.toLocaleString()})
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cost Savings */}
              <Card className="border-[#2E8B57]/20 bg-[#2E8B57]/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#2E8B57]/20 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-[#2E8B57]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Savings vs Single Warehouse</p>
                        <p className="text-2xl font-bold text-[#2E8B57]">
                          {formatCurrency(Math.abs(result.costSavings))}
                          {result.costSavings < 0 && " (additional cost)"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Cost Reduction</p>
                      <p className="text-xl font-bold">
                        {result.costSavings > 0
                          ? ((result.costSavings / (result.totalCost + result.costSavings)) * 100).toFixed(1)
                          : "0"}
                        %
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Zap className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg"
                      >
                        {rec.includes("Excellent") ? (
                          <CheckCircle2 className="h-5 w-5 text-[#2E8B57] shrink-0 mt-0.5" />
                        ) : (
                          <Info className="h-5 w-5 text-[#0F4C81] shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Calculator className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Run optimization to see results
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Configure settings and click &quot;Run Optimization&quot; to analyze warehouse locations
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Coverage Map Tab */}
        <TabsContent value="coverage" className="space-y-6 mt-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Scatter Plot Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <MapPin className="h-5 w-5" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>
                    Visual representation of customer locations and warehouse positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          type="number"
                          dataKey="lng"
                          name="Longitude"
                          domain={["dataMin - 5", "dataMax + 5"]}
                          tickFormatter={(v) => v.toFixed(1)}
                        />
                        <YAxis
                          type="number"
                          dataKey="lat"
                          name="Latitude"
                          domain={["dataMin - 5", "dataMax + 5"]}
                          tickFormatter={(v) => v.toFixed(1)}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            name === "demand" ? value.toLocaleString() : value.toFixed(4),
                            name === "demand" ? "Demand" : name,
                          ]}
                        />
                        {/* Customers */}
                        <Scatter
                          name="Customers"
                          data={scatterData.customers}
                          fill="#0F4C81"
                          shape="circle"
                        >
                          {scatterData.customers.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Scatter>
                        {/* Warehouses */}
                        <Scatter
                          name="Warehouses"
                          data={scatterData.warehouses}
                          fill="#2E8B57"
                          shape="diamond"
                        />
                        {/* Center of Gravity */}
                        <ReferenceLine
                          x={result.centerOfGravity.lng}
                          stroke="#F59E0B"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                        />
                        <ReferenceLine
                          y={result.centerOfGravity.lat}
                          stroke="#F59E0B"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#0F4C81]" />
                      <span>Customer Locations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rotate-45 bg-[#2E8B57]" />
                      <span>Warehouses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-amber-500" />
                      <span>Center of Gravity</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demand Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <BarChart3 className="h-5 w-5" />
                    Demand Distribution by Warehouse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={coveragePieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                          >
                            {coveragePieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => [value.toLocaleString(), "Demand"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Coverage Statistics</h4>
                      <div className="space-y-3">
                        {result.warehouses.map((w, index) => {
                          const coverage = result.demandCoverage.find((d) => d.warehouse === w.id);
                          return (
                            <div key={w.id} className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{w.id}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {coverage?.percentage.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${coverage?.percentage || 0}%`,
                                      backgroundColor: COLORS[index % COLORS.length],
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Distance Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Route className="h-5 w-5" />
                    Distance & Cost Matrix
                  </CardTitle>
                  <CardDescription>
                    Transportation distances and costs from customers to assigned warehouses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto max-h-80">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">Customer</th>
                          <th className="text-left py-2 px-3">Warehouse</th>
                          <th className="text-right py-2 px-3">Distance (km)</th>
                          <th className="text-right py-2 px-3">Transport Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.distanceMatrix.map((row, index) => (
                          <tr key={index} className="border-b border-muted">
                            <td className="py-2 px-3 font-medium">{row.from}</td>
                            <td className="py-2 px-3">{row.to}</td>
                            <td className="py-2 px-3 text-right">{row.distance.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right">{formatCurrency(row.cost)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No coverage data available
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Run optimization to view coverage analysis
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Educational Content */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <Info className="h-5 w-5" />
            About Warehouse Location Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-[#2E8B57]">Center of Gravity Method</h4>
              <p className="text-sm text-muted-foreground">
                The weighted center point of all customer locations, calculated by weighting each
                location&apos;s coordinates by its demand. Ideal for single warehouse placement.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-[#2E8B57]">K-Means Clustering</h4>
              <p className="text-sm text-muted-foreground">
                An algorithm that partitions customer locations into k clusters, with each cluster
                centered around a warehouse location. Optimal for multi-warehouse networks.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-[#2E8B57]">Service Coverage</h4>
              <p className="text-sm text-muted-foreground">
                The percentage of customers within the defined service radius from their assigned
                warehouse. Higher coverage means better delivery times and service quality.
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-[#0F4C81]/5 rounded-lg">
              <h4 className="font-semibold text-[#0F4C81] mb-2">Key Factors to Consider</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Customer demand distribution and growth projections</li>
                <li>• Transportation costs and infrastructure</li>
                <li>• Real estate and labor costs in potential locations</li>
                <li>• Regulatory requirements and tax incentives</li>
                <li>• Proximity to suppliers and distribution channels</li>
              </ul>
            </div>
            <div className="p-4 bg-[#2E8B57]/5 rounded-lg">
              <h4 className="font-semibold text-[#2E8B57] mb-2">Optimization Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reduced transportation costs by 15-30%</li>
                <li>• Improved delivery times and customer satisfaction</li>
                <li>• Better inventory management across network</li>
                <li>• Enhanced resilience through geographic diversification</li>
                <li>• Scalability for future growth</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
