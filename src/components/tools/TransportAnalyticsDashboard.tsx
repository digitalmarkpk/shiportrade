"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Route,
  Fuel,
  DollarSign,
  Users,
  BarChart3,
  LineChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Info,
  Calendar,
  RefreshCw,
  Download,
  Zap,
  Gauge,
  Percent,
  BoxIcon,
  XCircle,
  Navigation,
  Timer,
  MapPin,
  UserCheck,
  Droplet,
  Settings,
  Target,
  PieChart,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  ComposedChart,
  Area,
  AreaChart,
  ReferenceLine,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Brand colors
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  oceanLight: "#3B7CB8",
  logisticsLight: "#4CAF7D",
  warning: "#F59E0B",
  danger: "#EF4444",
  critical: "#DC2626",
  neutral: "#6B7280",
};

// Time periods for filtering
const TIME_PERIODS = [
  { id: "7d", name: "Last 7 Days" },
  { id: "30d", name: "Last 30 Days" },
  { id: "90d", name: "Last 90 Days" },
  { id: "12m", name: "Last 12 Months" },
  { id: "ytd", name: "Year to Date" },
] as const;

// Fleet regions
const FLEET_REGIONS = [
  { id: "all", name: "All Regions" },
  { id: "north", name: "North Region" },
  { id: "south", name: "South Region" },
  { id: "east", name: "East Region" },
  { id: "west", name: "West Region" },
] as const;

// Fleet Performance Metrics
const FLEET_PERFORMANCE = {
  totalVehicles: 248,
  activeVehicles: 231,
  vehiclesInMaintenance: 12,
  vehiclesOutOfService: 5,
  averageAge: 4.2,
  fleetUtilization: 87.3,
  onTimeDelivery: 94.2,
  averageSpeed: 62.5,
  totalDistance: 1250000,
  totalTrips: 8420,
};

// Cost Analysis Data
const COST_DATA = {
  monthly: {
    fuel: 485000,
    maintenance: 125000,
    labor: 320000,
    insurance: 45000,
    tolls: 38000,
    depreciation: 95000,
    other: 42000,
  },
  perKm: {
    fuel: 0.38,
    maintenance: 0.10,
    labor: 0.25,
    insurance: 0.04,
    tolls: 0.03,
    depreciation: 0.08,
    other: 0.03,
  },
  trend: [
    { month: "Jan", fuel: 425000, maintenance: 118000, labor: 305000, total: 965000 },
    { month: "Feb", fuel: 438000, maintenance: 122000, labor: 310000, total: 998000 },
    { month: "Mar", fuel: 452000, maintenance: 120000, labor: 312000, total: 1018000 },
    { month: "Apr", fuel: 445000, maintenance: 125000, labor: 315000, total: 1003000 },
    { month: "May", fuel: 462000, maintenance: 128000, labor: 318000, total: 1043000 },
    { month: "Jun", fuel: 478000, maintenance: 130000, labor: 320000, total: 1078000 },
    { month: "Jul", fuel: 485000, maintenance: 125000, labor: 320000, total: 1090000 },
    { month: "Aug", fuel: 492000, maintenance: 122000, labor: 322000, total: 1102000 },
    { month: "Sep", fuel: 488000, maintenance: 128000, labor: 318000, total: 1096000 },
    { month: "Oct", fuel: 475000, maintenance: 130000, labor: 316000, total: 1077000 },
    { month: "Nov", fuel: 482000, maintenance: 125000, labor: 319000, total: 1084000 },
    { month: "Dec", fuel: 485000, maintenance: 125000, labor: 320000, total: 1090000 },
  ],
};

// Utilization Metrics
const UTILIZATION_DATA = {
  current: {
    fleetUtilization: 87.3,
    capacityUtilization: 78.5,
    driverUtilization: 82.1,
    trailerUtilization: 71.2,
    averageLoadFactor: 84.6,
    deadheadPercentage: 12.8,
  },
  target: {
    fleetUtilization: 90,
    capacityUtilization: 85,
    driverUtilization: 85,
    trailerUtilization: 80,
    averageLoadFactor: 90,
    deadheadPercentage: 10,
  },
  trend: [
    { week: "W1", fleet: 85.2, capacity: 76.8, driver: 80.5 },
    { week: "W2", fleet: 86.1, capacity: 77.2, driver: 81.2 },
    { week: "W3", fleet: 87.0, capacity: 78.0, driver: 81.8 },
    { week: "W4", fleet: 87.3, capacity: 78.5, driver: 82.1 },
  ],
};

// Route Efficiency Data
const ROUTE_DATA = {
  topRoutes: [
    { route: "Shanghai-Nanjing", distance: 300, avgTime: 4.2, onTime: 96.5, costPerKm: 0.42, trips: 245 },
    { route: "Beijing-Tianjin", distance: 120, avgTime: 1.8, onTime: 98.2, costPerKm: 0.38, trips: 312 },
    { route: "Guangzhou-Shenzhen", distance: 140, avgTime: 2.1, onTime: 95.8, costPerKm: 0.40, trips: 287 },
    { route: "Chengdu-Chongqing", distance: 270, avgTime: 3.5, onTime: 94.2, costPerKm: 0.45, trips: 198 },
    { route: "Wuhan-Changsha", distance: 350, avgTime: 4.8, onTime: 93.5, costPerKm: 0.43, trips: 156 },
  ],
  efficiency: {
    totalRoutes: 48,
    optimizedRoutes: 35,
    routesNeedingReview: 13,
    averageEfficiency: 87.2,
    fuelSavings: 12500,
    timeSavings: 320,
  },
  bottlenecks: [
    { location: "Port Entry Gate", avgDelay: 45, frequency: "Daily", impact: "High" },
    { location: "City Center Checkpoint", avgDelay: 30, frequency: "Daily", impact: "Medium" },
    { location: "Highway Toll Plaza", avgDelay: 15, frequency: "Weekly", impact: "Low" },
  ],
};

// Driver Performance Data
const DRIVER_DATA = {
  summary: {
    totalDrivers: 185,
    activeDrivers: 172,
    averageRating: 4.6,
    averageTripsPerDriver: 45.2,
    safetyScore: 92.5,
    fuelEfficiency: 8.2,
  },
  topPerformers: [
    { name: "Zhang Wei", rating: 4.9, trips: 62, fuelEfficiency: 9.1, safetyScore: 98, onTime: 97.8 },
    { name: "Li Ming", rating: 4.8, trips: 58, fuelEfficiency: 8.8, safetyScore: 97, onTime: 96.5 },
    { name: "Wang Chen", rating: 4.8, trips: 55, fuelEfficiency: 8.7, safetyScore: 96, onTime: 96.2 },
    { name: "Liu Yang", rating: 4.7, trips: 53, fuelEfficiency: 8.5, safetyScore: 95, onTime: 95.8 },
    { name: "Chen Hao", rating: 4.7, trips: 51, fuelEfficiency: 8.4, safetyScore: 94, onTime: 95.5 },
  ],
  performanceDistribution: [
    { range: "5.0", count: 15 },
    { range: "4.5-4.9", count: 68 },
    { range: "4.0-4.4", count: 52 },
    { range: "3.5-3.9", count: 28 },
    { range: "<3.5", count: 9 },
  ],
  metrics: [
    { name: "Safety", value: 92.5, target: 95 },
    { name: "Fuel Eff.", value: 87.3, target: 90 },
    { name: "On-Time", value: 94.2, target: 95 },
    { name: "Customer", value: 92.0, target: 90 },
    { name: "Compliance", value: 98.5, target: 98 },
  ],
};

// Fuel Consumption Data
const FUEL_DATA = {
  summary: {
    totalConsumption: 328500,
    averageConsumption: 8.2,
    costPerLiter: 1.48,
    totalCost: 486180,
    co2Emissions: 856.1,
    efficiencyTrend: 3.2,
  },
  byVehicleType: [
    { type: "Heavy Truck", count: 85, avgConsumption: 12.5, totalFuel: 185000 },
    { type: "Medium Truck", count: 68, avgConsumption: 8.2, totalFuel: 95000 },
    { type: "Light Truck", count: 52, avgConsumption: 5.8, totalFuel: 38000 },
    { type: "Van", count: 43, avgConsumption: 3.2, totalFuel: 10500 },
  ],
  trend: [
    { month: "Jan", consumption: 285000, efficiency: 7.8, cost: 421800 },
    { month: "Feb", consumption: 292000, efficiency: 7.9, cost: 439500 },
    { month: "Mar", consumption: 305000, efficiency: 8.0, cost: 465600 },
    { month: "Apr", consumption: 298000, efficiency: 8.0, cost: 447000 },
    { month: "May", consumption: 312000, efficiency: 8.1, cost: 474200 },
    { month: "Jun", consumption: 325000, efficiency: 8.1, cost: 500500 },
    { month: "Jul", consumption: 338000, efficiency: 8.2, cost: 527300 },
    { month: "Aug", consumption: 342000, efficiency: 8.2, cost: 540300 },
    { month: "Sep", consumption: 335000, efficiency: 8.1, cost: 515900 },
    { month: "Oct", consumption: 322000, efficiency: 8.2, cost: 486200 },
    { month: "Nov", consumption: 318000, efficiency: 8.2, cost: 483300 },
    { month: "Dec", consumption: 328500, efficiency: 8.2, cost: 486180 },
  ],
  fuelStations: [
    { name: "Main Depot", usage: 125000, price: 1.45 },
    { name: "Highway Station A", usage: 85000, price: 1.52 },
    { name: "Highway Station B", usage: 72000, price: 1.48 },
    { name: "Partner Network", usage: 46500, price: 1.50 },
  ],
};

// Alerts data
const ALERTS = [
  {
    id: 1,
    type: "warning",
    category: "Fleet",
    message: "5 vehicles overdue for scheduled maintenance",
    severity: "medium",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "critical",
    category: "Fuel",
    message: "Fuel costs increased 5.2% vs last month",
    severity: "high",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    type: "success",
    category: "Routes",
    message: "Route optimization saved 12,500L fuel this month",
    severity: "low",
    timestamp: "1 day ago",
  },
  {
    id: 4,
    type: "warning",
    category: "Driver",
    message: "3 drivers below safety score threshold",
    severity: "medium",
    timestamp: "1 day ago",
  },
  {
    id: 5,
    type: "info",
    category: "Utilization",
    message: "Fleet utilization reached 87.3% (target: 90%)",
    severity: "low",
    timestamp: "2 days ago",
  },
];

// Helper functions
const getScoreColor = (value: number, target: number): string => {
  const ratio = value / target;
  if (ratio >= 1) return COLORS.logistics;
  if (ratio >= 0.9) return COLORS.ocean;
  if (ratio >= 0.8) return COLORS.warning;
  return COLORS.danger;
};

const getTrendIcon = (trend: number) => {
  if (trend > 0) return <ArrowUpRight className="h-4 w-4 text-[var(--logistics)]" />;
  if (trend < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-yellow-500" />;
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "critical":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />;
    default:
      return <Info className="h-5 w-5 text-[var(--ocean)]" />;
  }
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

// Metric Card Component
function MetricCard({
  title,
  value,
  unit,
  target,
  icon: Icon,
  trend,
  description,
}: {
  title: string;
  value: number;
  unit: string;
  target: number;
  icon: React.ElementType;
  trend?: number;
  description?: string;
}) {
  const percentage = (value / target) * 100;
  const isOnTarget = value >= target;

  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${COLORS.ocean}15` }}
            >
              <Icon className="h-4 w-4" style={{ color: COLORS.ocean }} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          {trend !== undefined && getTrendIcon(trend)}
        </div>

        <div className="flex items-end gap-2 mb-2">
          <span
            className="text-2xl font-bold"
            style={{ color: getScoreColor(value, target) }}
          >
            {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : formatNumber(value)}
          </span>
          <span className="text-muted-foreground text-sm mb-1">{unit}</span>
        </div>

        <Progress value={Math.min(percentage, 100)} className="h-2 mb-2" />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Target: {target}{unit}</span>
          <Badge variant={isOnTarget ? "default" : "secondary"} className={isOnTarget ? "bg-[var(--logistics)]" : ""}>
            {percentage.toFixed(0)}%
          </Badge>
        </div>

        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Cost Breakdown Pie Chart Component
function CostBreakdownChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const COLORS_ARRAY = [COLORS.ocean, COLORS.logistics, COLORS.warning, COLORS.danger, "#8B5CF6", "#EC4899", "#6B7280"];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS_ARRAY[index % COLORS_ARRAY.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export function TransportAnalyticsDashboard() {
  const [timePeriod, setTimePeriod] = useState<string>("30d");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Calculate total monthly cost
  const totalMonthlyCost = useMemo(() => {
    return Object.values(COST_DATA.monthly).reduce((a, b) => a + b, 0);
  }, []);

  // Calculate cost per km
  const costPerKm = useMemo(() => {
    return Object.values(COST_DATA.perKm).reduce((a, b) => a + b, 0);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FLEET_REGIONS.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Overall Score Card */}
          <Card className="border-[var(--ocean)]/20">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="relative">
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center"
                    style={{
                      background: `conic-gradient(${COLORS.logistics} 88 * 3.6deg, oklch(0.93 0.005 240) 0deg)`,
                    }}
                  >
                    <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold" style={{ color: COLORS.logistics }}>
                          88
                        </span>
                        <p className="text-xs text-muted-foreground">/ 100</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">Transport Operations Score</h3>
                    <Badge className="bg-[var(--logistics)]">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Improving
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-[var(--logistics)] mb-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Strengths</span>
                      </div>
                      <p className="text-xs text-muted-foreground">High on-time delivery (94.2%), strong safety score (92.5)</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-500 mb-1">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Focus Areas</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Fleet utilization below target, fuel costs trending up</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-[var(--ocean)] mb-1">
                        <Target className="h-4 w-4" />
                        <span className="text-sm font-medium">Next Target</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Achieve 90% fleet utilization by Q2</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Fleet Utilization"
              value={FLEET_PERFORMANCE.fleetUtilization}
              unit="%"
              target={90}
              icon={Truck}
              trend={2.1}
            />
            <MetricCard
              title="On-Time Delivery"
              value={FLEET_PERFORMANCE.onTimeDelivery}
              unit="%"
              target={95}
              icon={Clock}
              trend={1.4}
            />
            <MetricCard
              title="Cost per KM"
              value={costPerKm}
              unit="$/km"
              target={0.8}
              icon={DollarSign}
              trend={-0.5}
            />
            <MetricCard
              title="Fuel Efficiency"
              value={FUEL_DATA.summary.averageConsumption}
              unit="km/L"
              target={9}
              icon={Fuel}
              trend={3.2}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Vehicles"
              value={FLEET_PERFORMANCE.activeVehicles}
              unit={`/${FLEET_PERFORMANCE.totalVehicles}`}
              target={FLEET_PERFORMANCE.totalVehicles}
              icon={Truck}
            />
            <MetricCard
              title="Total Trips"
              value={FLEET_PERFORMANCE.totalTrips}
              unit="trips"
              target={9000}
              icon={Route}
              trend={5.8}
            />
            <MetricCard
              title="Driver Score"
              value={DRIVER_DATA.summary.averageRating}
              unit="/5.0"
              target={4.8}
              icon={Users}
              trend={0.2}
            />
            <MetricCard
              title="Safety Score"
              value={DRIVER_DATA.summary.safetyScore}
              unit="%"
              target={95}
              icon={Activity}
              trend={1.5}
            />
          </div>

          {/* Performance Radar and Alerts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Performance Radar
                </CardTitle>
                <CardDescription>Current performance vs targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={DRIVER_DATA.metrics}>
                      <PolarGrid strokeDasharray="3 3" opacity={0.3} />
                      <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Current"
                        dataKey="value"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Target"
                        dataKey="target"
                        stroke={COLORS.logistics}
                        fill="transparent"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[var(--ocean)]" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>Latest performance notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72">
                  <div className="space-y-3">
                    {ALERTS.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        {getAlertIcon(alert.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {alert.category}
                            </Badge>
                            <Badge
                              className={
                                alert.severity === "high"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  : alert.severity === "medium"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              }
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fleet Tab */}
        <TabsContent value="fleet" className="space-y-6 mt-6">
          {/* Fleet Summary Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Vehicles</p>
                    <p className="text-2xl font-bold">{formatNumber(FLEET_PERFORMANCE.totalVehicles)}</p>
                  </div>
                  <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
                    <Truck className="h-6 w-6 text-[var(--ocean)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-[var(--logistics)]">{formatNumber(FLEET_PERFORMANCE.activeVehicles)}</p>
                  </div>
                  <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-[var(--logistics)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Maintenance</p>
                    <p className="text-2xl font-bold text-yellow-500">{FLEET_PERFORMANCE.vehiclesInMaintenance}</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Settings className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Out of Service</p>
                    <p className="text-2xl font-bold text-red-500">{FLEET_PERFORMANCE.vehiclesOutOfService}</p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fleet Performance Details */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Vehicle Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={FUEL_DATA.byVehicleType} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="type" type="category" tick={{ fontSize: 12 }} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" name="Vehicle Count" fill={COLORS.ocean} radius={[0, 4, 4, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                  Fleet Utilization Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={UTILIZATION_DATA.trend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="fleet"
                        name="Fleet Utilization %"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.2}
                      />
                      <ReferenceLine y={90} stroke={COLORS.logistics} strokeDasharray="3 3" label="Target" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fleet Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Fleet Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Vehicle Age</p>
                  <p className="text-xl font-bold">{FLEET_PERFORMANCE.averageAge} years</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Distance</p>
                  <p className="text-xl font-bold">{formatNumber(FLEET_PERFORMANCE.totalDistance)} km</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Speed</p>
                  <p className="text-xl font-bold">{FLEET_PERFORMANCE.averageSpeed} km/h</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Trips This Period</p>
                  <p className="text-xl font-bold">{formatNumber(FLEET_PERFORMANCE.totalTrips)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs" className="space-y-6 mt-6">
          {/* Cost Summary */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-[var(--ocean)]/20 bg-[var(--ocean)]/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
                <p className="text-2xl font-bold text-[var(--ocean)]">{formatCurrency(totalMonthlyCost)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500">+3.2%</span> vs last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Cost per KM</p>
                <p className="text-2xl font-bold">${costPerKm.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-[var(--logistics)]">-1.5%</span> vs last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Fuel Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(COST_DATA.monthly.fuel)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(COST_DATA.monthly.fuel / totalMonthlyCost * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Labor Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(COST_DATA.monthly.labor)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(COST_DATA.monthly.labor / totalMonthlyCost * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cost Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[var(--ocean)]" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CostBreakdownChart data={COST_DATA.monthly} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                  Cost Trends (12 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={COST_DATA.trend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="fuel" name="Fuel" fill={COLORS.ocean} stackId="a" />
                      <Bar dataKey="maintenance" name="Maintenance" fill={COLORS.logistics} stackId="a" />
                      <Bar dataKey="labor" name="Labor" fill={COLORS.warning} stackId="a" />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total"
                        stroke={COLORS.danger}
                        strokeWidth={2}
                        dot={{ fill: COLORS.danger }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost per KM Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cost per Kilometer Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(COST_DATA.perKm).map(([key, value]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground capitalize">{key}</p>
                    <p className="text-xl font-bold">${value.toFixed(2)}/km</p>
                    <Progress value={(value / costPerKm) * 100} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {((value / costPerKm) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilization Tab */}
        <TabsContent value="utilization" className="space-y-6 mt-6">
          {/* Utilization Summary */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(UTILIZATION_DATA.current).map(([key, value]) => {
              const target = UTILIZATION_DATA.target[key as keyof typeof UTILIZATION_DATA.target];
              const isInverse = key === "deadheadPercentage";
              const displayValue = isInverse ? 100 - value : value;
              const displayTarget = isInverse ? 100 - target : target;
              const percentage = (displayValue / displayTarget) * 100;

              return (
                <Card key={key} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <Badge variant={value >= target ? "default" : "secondary"} className={value >= target ? "bg-[var(--logistics)]" : ""}>
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-end gap-2">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: getScoreColor(isInverse ? 100 - value : value, isInverse ? 100 - target : target) }}
                      >
                        {value.toFixed(1)}%
                      </span>
                      <span className="text-sm text-muted-foreground mb-1">
                        / {target}% target
                      </span>
                    </div>
                    <Progress value={Math.min(percentage, 100)} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Utilization Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Weekly Utilization Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={UTILIZATION_DATA.trend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fleet" name="Fleet %" fill={COLORS.ocean} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="capacity" name="Capacity %" fill={COLORS.logistics} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="driver" name="Driver %" fill={COLORS.warning} radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Target vs Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: "Fleet", actual: UTILIZATION_DATA.current.fleetUtilization, target: UTILIZATION_DATA.target.fleetUtilization },
                        { name: "Capacity", actual: UTILIZATION_DATA.current.capacityUtilization, target: UTILIZATION_DATA.target.capacityUtilization },
                        { name: "Driver", actual: UTILIZATION_DATA.current.driverUtilization, target: UTILIZATION_DATA.target.driverUtilization },
                        { name: "Trailer", actual: UTILIZATION_DATA.current.trailerUtilization, target: UTILIZATION_DATA.target.trailerUtilization },
                        { name: "Load", actual: UTILIZATION_DATA.current.averageLoadFactor, target: UTILIZATION_DATA.target.averageLoadFactor },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="actual" name="Actual %" fill={COLORS.ocean} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="target" name="Target %" fill={COLORS.logistics} opacity={0.5} radius={[0, 4, 4, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deadhead Analysis */}
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                Deadhead Analysis
              </CardTitle>
              <CardDescription>Empty miles need optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Current Deadhead</p>
                  <p className="text-2xl font-bold">{UTILIZATION_DATA.current.deadheadPercentage}%</p>
                  <p className="text-xs text-muted-foreground">Target: {UTILIZATION_DATA.target.deadheadPercentage}%</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Empty Miles</p>
                  <p className="text-2xl font-bold">{formatNumber(Math.round(FLEET_PERFORMANCE.totalDistance * UTILIZATION_DATA.current.deadheadPercentage / 100))} km</p>
                  <p className="text-xs text-muted-foreground">This period</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Potential Savings</p>
                  <p className="text-2xl font-bold text-[var(--logistics)]">{formatCurrency(Math.round(FLEET_PERFORMANCE.totalDistance * (UTILIZATION_DATA.current.deadheadPercentage - UTILIZATION_DATA.target.deadheadPercentage) / 100 * costPerKm))}</p>
                  <p className="text-xs text-muted-foreground">If target achieved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-6 mt-6">
          {/* Route Efficiency Summary */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Routes</p>
                <p className="text-2xl font-bold">{ROUTE_DATA.efficiency.totalRoutes}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Optimized</p>
                <p className="text-2xl font-bold text-[var(--logistics)]">{ROUTE_DATA.efficiency.optimizedRoutes}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Need Review</p>
                <p className="text-2xl font-bold text-yellow-500">{ROUTE_DATA.efficiency.routesNeedingReview}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Fuel Saved</p>
                <p className="text-2xl font-bold">{formatNumber(ROUTE_DATA.efficiency.fuelSavings)} L</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold">{ROUTE_DATA.efficiency.timeSavings} hrs</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Routes Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-[var(--ocean)]" />
                Top Routes Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Route</th>
                      <th className="text-center py-3 px-4">Distance</th>
                      <th className="text-center py-3 px-4">Avg Time</th>
                      <th className="text-center py-3 px-4">On-Time %</th>
                      <th className="text-center py-3 px-4">Cost/km</th>
                      <th className="text-center py-3 px-4">Trips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROUTE_DATA.topRoutes.map((route, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{route.route}</td>
                        <td className="text-center py-3 px-4">{route.distance} km</td>
                        <td className="text-center py-3 px-4">{route.avgTime} hrs</td>
                        <td className="text-center py-3 px-4">
                          <Badge
                            style={{
                              backgroundColor: route.onTime >= 95 ? COLORS.logistics : COLORS.ocean,
                              color: "white",
                            }}
                          >
                            {route.onTime}%
                          </Badge>
                        </td>
                        <td className="text-center py-3 px-4">${route.costPerKm}</td>
                        <td className="text-center py-3 px-4">{route.trips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Route Efficiency Chart */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Route Cost Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={ROUTE_DATA.topRoutes}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="route" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="costPerKm" name="Cost $/km" fill={COLORS.ocean} radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-[var(--ocean)]" />
                  Bottleneck Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ROUTE_DATA.bottlenecks.map((bottleneck, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{bottleneck.location}</span>
                        <Badge
                          className={
                            bottleneck.impact === "High"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : bottleneck.impact === "Medium"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }
                        >
                          {bottleneck.impact} Impact
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Avg Delay: {bottleneck.avgDelay} min</span>
                        <span>Frequency: {bottleneck.frequency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers" className="space-y-6 mt-6">
          {/* Driver Summary */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Drivers</p>
                <p className="text-2xl font-bold">{DRIVER_DATA.summary.totalDrivers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-[var(--logistics)]">{DRIVER_DATA.summary.activeDrivers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{DRIVER_DATA.summary.averageRating}/5.0</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Safety Score</p>
                <p className="text-2xl font-bold text-[var(--logistics)]">{DRIVER_DATA.summary.safetyScore}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Avg Trips/Driver</p>
                <p className="text-2xl font-bold">{DRIVER_DATA.summary.averageTripsPerDriver}</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[var(--ocean)]" />
                Top Performing Drivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Driver</th>
                      <th className="text-center py-3 px-4">Rating</th>
                      <th className="text-center py-3 px-4">Trips</th>
                      <th className="text-center py-3 px-4">Fuel Eff.</th>
                      <th className="text-center py-3 px-4">Safety</th>
                      <th className="text-center py-3 px-4">On-Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DRIVER_DATA.topPerformers.map((driver, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-[var(--ocean)]">
                                {driver.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium">{driver.name}</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge className="bg-[var(--logistics)]">{driver.rating}</Badge>
                        </td>
                        <td className="text-center py-3 px-4">{driver.trips}</td>
                        <td className="text-center py-3 px-4">{driver.fuelEfficiency} km/L</td>
                        <td className="text-center py-3 px-4">
                          <span className="text-[var(--logistics)] font-medium">{driver.safetyScore}%</span>
                        </td>
                        <td className="text-center py-3 px-4">{driver.onTime}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Driver Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={DRIVER_DATA.performanceDistribution}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" name="Drivers" fill={COLORS.ocean} radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={DRIVER_DATA.metrics}>
                      <PolarGrid strokeDasharray="3 3" opacity={0.3} />
                      <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Current"
                        dataKey="value"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Target"
                        dataKey="target"
                        stroke={COLORS.logistics}
                        fill="transparent"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Fuel Consumption Section (always visible) */}
      {activeTab === "overview" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-[var(--ocean)]" />
              Fuel Consumption Overview
            </CardTitle>
            <CardDescription>Monthly fuel consumption and efficiency trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Fuel</p>
                    <p className="text-xl font-bold">{formatNumber(FUEL_DATA.summary.totalConsumption)} L</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                    <p className="text-xl font-bold">{FUEL_DATA.summary.averageConsumption} km/L</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-xl font-bold">{formatCurrency(FUEL_DATA.summary.totalCost)}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">CO2 Emissions</p>
                    <p className="text-xl font-bold">{FUEL_DATA.summary.co2Emissions} t</p>
                  </div>
                </div>

                <div className="p-3 bg-[var(--logistics)]/10 rounded-lg border border-[var(--logistics)]/30">
                  <div className="flex items-center gap-2 text-[var(--logistics)] mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Efficiency Trend</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fuel efficiency improved by {FUEL_DATA.summary.efficiencyTrend}% compared to last year
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={FUEL_DATA.trend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="consumption" name="Consumption (L)" fill={COLORS.ocean} opacity={0.8} radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency (km/L)" stroke={COLORS.logistics} strokeWidth={2} dot={{ fill: COLORS.logistics }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
