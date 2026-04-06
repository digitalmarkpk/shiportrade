"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Briefcase,
  BarChart3,
  Calculator,
  Target,
  Zap,
  Activity,
  Timer,
  UserCheck,
  Layers,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  RefreshCw,
  Building2,
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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";

// Brand Colors
const BRAND_COLORS = {
  oceanBlue: "#0F4C81",
  logisticsGreen: "#2E8B57",
  oceanBlueLight: "#3D6A9F",
  greenLight: "#4CAF50",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
};

// Interfaces
interface WorkloadTask {
  id: string;
  name: string;
  category: "receiving" | "picking" | "packing" | "shipping" | "inventory";
  unitsPerHour: number;
  totalUnits: number;
  priority: "high" | "medium" | "low";
  assignedWorkers: number;
}

interface Shift {
  id: string;
  name: string;
  startHour: number;
  endHour: number;
  workers: number;
  isActive: boolean;
  overtimeAllowed: boolean;
  maxOvertimeHours: number;
}

interface WorkerRequirement {
  category: string;
  currentWorkers: number;
  requiredWorkers: number;
  gap: number;
  costPerHour: number;
  weeklyHours: number;
}

interface ProductivityMetric {
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: number;
}

interface OvertimePlan {
  shiftId: string;
  shiftName: string;
  regularHours: number;
  overtimeHours: number;
  workers: number;
  overtimeRate: number;
  cost: number;
}

interface LaborCostBreakdown {
  category: string;
  regularCost: number;
  overtimeCost: number;
  totalCost: number;
  hours: number;
}

// Sample data
const sampleWorkloadTasks: WorkloadTask[] = [
  { id: "task-1", name: "Container Unloading", category: "receiving", unitsPerHour: 45, totalUnits: 1250, priority: "high", assignedWorkers: 8 },
  { id: "task-2", name: "Order Picking - Zone A", category: "picking", unitsPerHour: 35, totalUnits: 2100, priority: "high", assignedWorkers: 12 },
  { id: "task-3", name: "Order Picking - Zone B", category: "picking", unitsPerHour: 30, totalUnits: 1800, priority: "medium", assignedWorkers: 10 },
  { id: "task-4", name: "Standard Packing", category: "packing", unitsPerHour: 60, totalUnits: 3200, priority: "medium", assignedWorkers: 15 },
  { id: "task-5", name: "Special Handling Pack", category: "packing", unitsPerHour: 25, totalUnits: 450, priority: "high", assignedWorkers: 4 },
  { id: "task-6", name: "Loading - Outbound", category: "shipping", unitsPerHour: 40, totalUnits: 1600, priority: "high", assignedWorkers: 6 },
  { id: "task-7", name: "Cycle Counting", category: "inventory", unitsPerHour: 80, totalUnits: 2400, priority: "low", assignedWorkers: 3 },
  { id: "task-8", name: "Replenishment", category: "inventory", unitsPerHour: 50, totalUnits: 1000, priority: "medium", assignedWorkers: 5 },
];

const defaultShifts: Shift[] = [
  { id: "shift-1", name: "Morning Shift", startHour: 6, endHour: 14, workers: 25, isActive: true, overtimeAllowed: true, maxOvertimeHours: 2 },
  { id: "shift-2", name: "Afternoon Shift", startHour: 14, endHour: 22, workers: 30, isActive: true, overtimeAllowed: true, maxOvertimeHours: 2 },
  { id: "shift-3", name: "Night Shift", startHour: 22, endHour: 6, workers: 15, isActive: true, overtimeAllowed: false, maxOvertimeHours: 0 },
];

const productivityMetrics: ProductivityMetric[] = [
  { name: "Units Picked/Hour", current: 42, target: 50, unit: "units", trend: 8 },
  { name: "Orders Completed/Hour", current: 18, target: 22, unit: "orders", trend: 12 },
  { name: "Pick Accuracy", current: 98.5, target: 99.5, unit: "%", trend: 0.3 },
  { name: "On-Time Shipment", current: 94, target: 98, unit: "%", trend: -2 },
  { name: "Units Per Labor Hour", current: 28, target: 32, unit: "units", trend: 5 },
  { name: "Downtime Percentage", current: 8, target: 5, unit: "%", trend: -3 },
];

export default function WarehouseLaborPlanner() {
  const [activeTab, setActiveTab] = useState("overview");

  // Input states
  const [dailyOrderVolume, setDailyOrderVolume] = useState("2500");
  const [averageUnitsPerOrder, setAverageUnitsPerOrder] = useState("3.5");
  const [workingDays, setWorkingDays] = useState("22");
  const [baseWageRate, setBaseWageRate] = useState("18.50");
  const [overtimeMultiplier, setOvertimeMultiplier] = useState("1.5");
  const [targetProductivity, setTargetProductivity] = useState("95");
  const [shifts, setShifts] = useState<Shift[]>(defaultShifts);
  const [workloadTasks, setWorkloadTasks] = useState<WorkloadTask[]>(sampleWorkloadTasks);

  // Computed values
  const laborCalculations = useMemo(() => {
    const orderVolume = parseFloat(dailyOrderVolume) || 2500;
    const unitsPerOrder = parseFloat(averageUnitsPerOrder) || 3.5;
    const days = parseFloat(workingDays) || 22;
    const wageRate = parseFloat(baseWageRate) || 18.50;
    const otMultiplier = parseFloat(overtimeMultiplier) || 1.5;
    const productivity = parseFloat(targetProductivity) || 95;

    // Total daily workload
    const totalDailyUnits = orderVolume * unitsPerOrder;
    const totalTaskUnits = workloadTasks.reduce((sum, t) => sum + t.totalUnits, 0);

    // Calculate required labor hours per task
    const taskHours = workloadTasks.map(task => ({
      ...task,
      requiredHours: task.totalUnits / task.unitsPerHour,
      requiredWorkers: Math.ceil((task.totalUnits / task.unitsPerHour) / 8), // Assuming 8-hour shifts
    }));

    // Total required workers per shift
    const totalWorkers = shifts.filter(s => s.isActive).reduce((sum, s) => sum + s.workers, 0);
    const totalShiftHours = shifts.filter(s => s.isActive).reduce((sum, s) => {
      const hours = s.endHour > s.startHour ? s.endHour - s.startHour : (24 - s.startHour) + s.endHour;
      return sum + hours;
    }, 0);

    // Weekly labor cost
    const regularHoursPerWorker = 40;
    const regularCost = totalWorkers * regularHoursPerWorker * wageRate;

    // Overtime calculations
    const overtimeHours = shifts
      .filter(s => s.isActive && s.overtimeAllowed)
      .reduce((sum, s) => sum + (s.workers * s.maxOvertimeHours), 0);
    const overtimeCost = overtimeHours * wageRate * otMultiplier;

    // Monthly projections
    const monthlyRegularCost = regularCost * (days / 5); // Convert weekly to monthly
    const monthlyOvertimeCost = overtimeCost * 4; // Weekly overtime * 4 weeks
    const totalMonthlyCost = monthlyRegularCost + monthlyOvertimeCost;

    // Productivity impact
    const productivityFactor = productivity / 100;
    const adjustedWorkersNeeded = Math.ceil(totalWorkers / productivityFactor);

    // Worker requirements by category
    const workerRequirements: WorkerRequirement[] = [
      { category: "Receiving", currentWorkers: 12, requiredWorkers: 14, gap: 2, costPerHour: wageRate, weeklyHours: 480 },
      { category: "Picking", currentWorkers: 22, requiredWorkers: 25, gap: 3, costPerHour: wageRate * 1.05, weeklyHours: 880 },
      { category: "Packing", currentWorkers: 19, requiredWorkers: 18, gap: -1, costPerHour: wageRate, weeklyHours: 760 },
      { category: "Shipping", currentWorkers: 10, requiredWorkers: 12, gap: 2, costPerHour: wageRate * 1.1, weeklyHours: 400 },
      { category: "Inventory", currentWorkers: 8, requiredWorkers: 8, gap: 0, costPerHour: wageRate, weeklyHours: 320 },
    ];

    return {
      totalDailyUnits,
      totalTaskUnits,
      taskHours,
      totalWorkers,
      totalShiftHours,
      regularCost,
      overtimeHours,
      overtimeCost,
      monthlyRegularCost,
      monthlyOvertimeCost,
      totalMonthlyCost,
      productivityFactor,
      adjustedWorkersNeeded,
      workerRequirements,
    };
  }, [dailyOrderVolume, averageUnitsPerOrder, workingDays, baseWageRate, overtimeMultiplier, targetProductivity, shifts, workloadTasks]);

  // Overtime planning
  const overtimePlans: OvertimePlan[] = useMemo(() => {
    return shifts
      .filter(s => s.isActive && s.overtimeAllowed)
      .map(shift => {
        const regularHours = shift.endHour > shift.startHour 
          ? shift.endHour - shift.startHour 
          : (24 - shift.startHour) + shift.endHour;
        const wageRate = parseFloat(baseWageRate) || 18.50;
        const otMultiplier = parseFloat(overtimeMultiplier) || 1.5;
        const overtimeRate = wageRate * otMultiplier;

        return {
          shiftId: shift.id,
          shiftName: shift.name,
          regularHours,
          overtimeHours: shift.maxOvertimeHours,
          workers: shift.workers,
          overtimeRate,
          cost: shift.workers * shift.maxOvertimeHours * overtimeRate,
        };
      });
  }, [shifts, baseWageRate, overtimeMultiplier]);

  // Labor cost breakdown by category
  const laborCostBreakdown: LaborCostBreakdown[] = useMemo(() => {
    const wageRate = parseFloat(baseWageRate) || 18.50;
    const otMultiplier = parseFloat(overtimeMultiplier) || 1.5;

    return laborCalculations.workerRequirements.map(req => {
      const regularCost = req.currentWorkers * req.weeklyHours * req.costPerHour;
      const overtimeCost = req.currentWorkers * 4 * req.costPerHour * otMultiplier; // Assume 4 OT hours per week
      return {
        category: req.category,
        regularCost,
        overtimeCost,
        totalCost: regularCost + overtimeCost,
        hours: req.currentWorkers * req.weeklyHours,
      };
    });
  }, [laborCalculations.workerRequirements, baseWageRate, overtimeMultiplier]);

  // Chart data
  const shiftDistributionData = shifts.filter(s => s.isActive).map(shift => ({
    name: shift.name,
    workers: shift.workers,
    fill: shift.workers === Math.max(...shifts.map(s => s.workers)) 
      ? BRAND_COLORS.oceanBlue 
      : BRAND_COLORS.logisticsGreen,
  }));

  const taskWorkloadData = workloadTasks.map(task => ({
    name: task.name.substring(0, 15),
    hours: task.totalUnits / task.unitsPerHour,
    priority: task.priority,
  }));

  const productivityTrendData = [
    { day: "Mon", productivity: 92, target: 95 },
    { day: "Tue", productivity: 94, target: 95 },
    { day: "Wed", productivity: 91, target: 95 },
    { day: "Thu", productivity: 96, target: 95 },
    { day: "Fri", productivity: 93, target: 95 },
    { day: "Sat", productivity: 88, target: 95 },
    { day: "Sun", productivity: 85, target: 95 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(Math.round(num));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      receiving: BRAND_COLORS.oceanBlue,
      picking: BRAND_COLORS.logisticsGreen,
      packing: BRAND_COLORS.purple,
      shipping: BRAND_COLORS.cyan,
      inventory: BRAND_COLORS.warning,
    };
    return colors[category] || BRAND_COLORS.oceanBlue;
  };

  const updateShiftWorkers = (shiftId: string, workers: number) => {
    setShifts(prev => prev.map(s => 
      s.id === shiftId ? { ...s, workers } : s
    ));
  };

  const toggleShiftOvertime = (shiftId: string) => {
    setShifts(prev => prev.map(s => 
      s.id === shiftId ? { ...s, overtimeAllowed: !s.overtimeAllowed } : s
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: BRAND_COLORS.oceanBlue }}>
            <Users className="h-8 w-8" />
            Warehouse Labor Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive labor planning, shift management, and cost optimization for Shiportrade.com
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm py-1 px-3">
            <Activity className="h-4 w-4 mr-1" style={{ color: BRAND_COLORS.logisticsGreen }} />
            Real-Time Planning
          </Badge>
          <Badge style={{ backgroundColor: BRAND_COLORS.logisticsGreen }} className="text-white text-sm py-1 px-3">
            {laborCalculations.totalWorkers} Workers Active
          </Badge>
        </div>
      </div>

      {/* Configuration Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2" style={{ color: BRAND_COLORS.oceanBlue }}>
            <Calculator className="h-5 w-5" />
            Labor Planning Configuration
          </CardTitle>
          <CardDescription>Configure your warehouse labor parameters for accurate planning</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dailyOrders" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" style={{ color: BRAND_COLORS.logisticsGreen }} />
                Daily Order Volume
              </Label>
              <Input
                id="dailyOrders"
                type="number"
                value={dailyOrderVolume}
                onChange={(e) => setDailyOrderVolume(e.target.value)}
                placeholder="2,500"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitsPerOrder" className="flex items-center gap-2">
                <Layers className="h-4 w-4" style={{ color: BRAND_COLORS.logisticsGreen }} />
                Avg Units Per Order
              </Label>
              <Input
                id="unitsPerOrder"
                type="number"
                step="0.1"
                value={averageUnitsPerOrder}
                onChange={(e) => setAverageUnitsPerOrder(e.target.value)}
                placeholder="3.5"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingDays" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: BRAND_COLORS.logisticsGreen }} />
                Working Days/Month
              </Label>
              <Input
                id="workingDays"
                type="number"
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
                placeholder="22"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseWage" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" style={{ color: BRAND_COLORS.logisticsGreen }} />
                Base Wage Rate ($/hr)
              </Label>
              <Input
                id="baseWage"
                type="number"
                step="0.01"
                value={baseWageRate}
                onChange={(e) => setBaseWageRate(e.target.value)}
                placeholder="18.50"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtimeMultiplier">Overtime Multiplier</Label>
              <Input
                id="overtimeMultiplier"
                type="number"
                step="0.1"
                value={overtimeMultiplier}
                onChange={(e) => setOvertimeMultiplier(e.target.value)}
                placeholder="1.5"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetProductivity">Target Productivity (%)</Label>
              <Input
                id="targetProductivity"
                type="number"
                value={targetProductivity}
                onChange={(e) => setTargetProductivity(e.target.value)}
                placeholder="95"
                className="h-11"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" style={{ color: BRAND_COLORS.oceanBlue }} />
                Quick Presets
              </Label>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDailyOrderVolume("1500");
                    setBaseWageRate("16.00");
                  }}
                >
                  Small Warehouse
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDailyOrderVolume("3500");
                    setBaseWageRate("20.00");
                  }}
                >
                  Large Warehouse
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDailyOrderVolume("5000");
                    setBaseWageRate("22.00");
                    setOvertimeMultiplier("2.0");
                  }}
                >
                  Peak Season
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="workload" className="text-xs md:text-sm">Workload</TabsTrigger>
          <TabsTrigger value="shifts" className="text-xs md:text-sm">Shift Planning</TabsTrigger>
          <TabsTrigger value="workers" className="text-xs md:text-sm">Workers</TabsTrigger>
          <TabsTrigger value="costs" className="text-xs md:text-sm">Labor Costs</TabsTrigger>
          <TabsTrigger value="overtime" className="text-xs md:text-sm">Overtime</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Workforce</span>
                </div>
                <p className="text-3xl font-bold">{laborCalculations.totalWorkers}</p>
                <p className="text-sm opacity-80 mt-1">Total Workers</p>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Shifts Active:</span>
                    <span>{shifts.filter(s => s.isActive).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Workload</span>
                </div>
                <p className="text-3xl font-bold">{formatNumber(laborCalculations.totalDailyUnits)}</p>
                <p className="text-sm opacity-80 mt-1">Units/Day</p>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Tasks:</span>
                    <span>{workloadTasks.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Hours</span>
                </div>
                <p className="text-3xl font-bold">{laborCalculations.totalShiftHours}h</p>
                <p className="text-sm opacity-80 mt-1">Daily Operation</p>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">OT Hours:</span>
                    <span>{laborCalculations.overtimeHours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Monthly</span>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(laborCalculations.totalMonthlyCost)}</p>
                <p className="text-sm opacity-80 mt-1">Labor Cost</p>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">OT Cost:</span>
                    <span>{formatCurrency(laborCalculations.monthlyOvertimeCost)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shift Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Shift Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={shiftDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="workers"
                        nameKey="name"
                        label={({ name, workers }) => `${name}: ${workers}`}
                        labelLine={false}
                      >
                        {shiftDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Productivity Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                  Weekly Productivity Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={productivityTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="productivity"
                        stroke={BRAND_COLORS.oceanBlue}
                        fill={BRAND_COLORS.oceanBlue}
                        fillOpacity={0.3}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke={BRAND_COLORS.danger}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Quick Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                    {formatNumber(parseFloat(dailyOrderVolume))}
                  </p>
                  <p className="text-xs text-muted-foreground">Daily Orders</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>
                    {averageUnitsPerOrder}
                  </p>
                  <p className="text-xs text-muted-foreground">Units/Order</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.warning }}>
                    {baseWageRate}
                  </p>
                  <p className="text-xs text-muted-foreground">Base Wage ($/hr)</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.purple }}>
                    {overtimeMultiplier}x
                  </p>
                  <p className="text-xs text-muted-foreground">OT Multiplier</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.cyan }}>
                    {targetProductivity}%
                  </p>
                  <p className="text-xs text-muted-foreground">Target Productivity</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.danger }}>
                    {laborCalculations.adjustedWorkersNeeded}
                  </p>
                  <p className="text-xs text-muted-foreground">Adjusted Workers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workload Tab */}
        <TabsContent value="workload" className="space-y-6 mt-6">
          {/* Workload Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2" style={{ borderColor: BRAND_COLORS.oceanBlue }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Total Workload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                    {formatNumber(laborCalculations.totalTaskUnits)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Units to Process</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.logisticsGreen }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Timer className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                  Estimated Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>
                    {Math.round(laborCalculations.taskHours.reduce((sum, t) => sum + t.requiredHours, 0))}h
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Total Labor Hours</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.warning }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                  High Priority Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.warning }}>
                    {workloadTasks.filter(t => t.priority === "high").length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Tasks Requiring Attention</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Workload Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Task Workload Distribution
              </CardTitle>
              <CardDescription>Hours required per task based on productivity rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskWorkloadData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" unit=" hrs" />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)} hours`, "Required"]} />
                    <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                      {taskWorkloadData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.priority === "high" ? BRAND_COLORS.danger :
                                entry.priority === "medium" ? BRAND_COLORS.warning :
                                BRAND_COLORS.logisticsGreen}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Workload Tasks List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                Active Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3 pr-4">
                  {laborCalculations.taskHours.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{task.name}</p>
                            <Badge
                              style={{ backgroundColor: getCategoryColor(task.category) }}
                              className="text-white text-xs"
                            >
                              {task.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                task.priority === "high" ? "border-red-500 text-red-600" :
                                task.priority === "medium" ? "border-amber-500 text-amber-600" :
                                "border-slate-500 text-slate-600"
                              }
                            >
                              {task.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.unitsPerHour} units/hr • {formatNumber(task.totalUnits)} total units
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-semibold">{task.requiredHours.toFixed(1)} hrs</p>
                            <p className="text-xs text-muted-foreground">Required</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{task.assignedWorkers} workers</p>
                            <p className="text-xs text-muted-foreground">Assigned</p>
                          </div>
                          <div className="w-20">
                            <Progress
                              value={(task.assignedWorkers / task.requiredWorkers) * 100}
                              className="h-2"
                            />
                            <p className="text-xs text-center mt-1">
                              {Math.min(100, Math.round((task.assignedWorkers / task.requiredWorkers) * 100))}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shift Planning Tab */}
        <TabsContent value="shifts" className="space-y-6 mt-6">
          {/* Shift Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shifts.map((shift, index) => (
              <motion.div
                key={shift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full ${shift.isActive ? "border-2" : "opacity-60"}`} 
                      style={{ borderColor: shift.isActive ? BRAND_COLORS.oceanBlue : undefined }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4" style={{ color: BRAND_COLORS.oceanBlue }} />
                        {shift.name}
                      </CardTitle>
                      <Switch
                        checked={shift.isActive}
                        onCheckedChange={(checked) => {
                          setShifts(prev => prev.map(s => 
                            s.id === shift.id ? { ...s, isActive: checked } : s
                          ));
                        }}
                      />
                    </div>
                    <CardDescription>
                      {shift.startHour.toString().padStart(2, "0")}:00 - {shift.endHour.toString().padStart(2, "0")}:00
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Number of Workers</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateShiftWorkers(shift.id, Math.max(0, shift.workers - 1))}
                          disabled={!shift.isActive}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={shift.workers}
                          onChange={(e) => updateShiftWorkers(shift.id, parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                          disabled={!shift.isActive}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateShiftWorkers(shift.id, shift.workers + 1)}
                          disabled={!shift.isActive}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <Label className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4" style={{ color: BRAND_COLORS.warning }} />
                        Allow Overtime
                      </Label>
                      <Switch
                        checked={shift.overtimeAllowed}
                        onCheckedChange={() => toggleShiftOvertime(shift.id)}
                        disabled={!shift.isActive}
                      />
                    </div>

                    {shift.overtimeAllowed && shift.isActive && (
                      <div className="space-y-2">
                        <Label className="text-sm">Max OT Hours</Label>
                        <Select
                          value={shift.maxOvertimeHours.toString()}
                          onValueChange={(value) => {
                            setShifts(prev => prev.map(s => 
                              s.id === shift.id ? { ...s, maxOvertimeHours: parseInt(value) } : s
                            ));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="2">2 hours</SelectItem>
                            <SelectItem value="3">3 hours</SelectItem>
                            <SelectItem value="4">4 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shift Duration:</span>
                        <span className="font-medium">
                          {shift.endHour > shift.startHour 
                            ? shift.endHour - shift.startHour 
                            : (24 - shift.startHour) + shift.endHour} hours
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Shift Schedule Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                24-Hour Coverage
              </CardTitle>
              <CardDescription>Visual representation of shift coverage throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                {shifts.filter(s => s.isActive).map((shift, index) => {
                  const startPercent = (shift.startHour / 24) * 100;
                  const endPercent = (shift.endHour / 24) * 100;
                  const width = shift.endHour > shift.startHour 
                    ? endPercent - startPercent 
                    : (100 - startPercent) + endPercent;
                  
                  return (
                    <div key={shift.id}>
                      {shift.endHour > shift.startHour ? (
                        <div
                          className="absolute top-0 h-full flex items-center justify-center text-white text-xs font-medium"
                          style={{
                            left: `${startPercent}%`,
                            width: `${width}%`,
                            backgroundColor: index === 0 ? BRAND_COLORS.oceanBlue : 
                                            index === 1 ? BRAND_COLORS.logisticsGreen : 
                                            BRAND_COLORS.purple,
                          }}
                        >
                          {shift.name} ({shift.workers})
                        </div>
                      ) : (
                        <>
                          <div
                            className="absolute top-0 h-full flex items-center justify-center text-white text-xs font-medium"
                            style={{
                              left: `${startPercent}%`,
                              width: `${100 - startPercent}%`,
                              backgroundColor: index === 0 ? BRAND_COLORS.oceanBlue : 
                                              index === 1 ? BRAND_COLORS.logisticsGreen : 
                                              BRAND_COLORS.purple,
                            }}
                          >
                            {shift.name} ({shift.workers})
                          </div>
                          <div
                            className="absolute top-0 h-full flex items-center justify-center text-white text-xs font-medium"
                            style={{
                              left: "0%",
                              width: `${endPercent}%`,
                              backgroundColor: index === 0 ? BRAND_COLORS.oceanBlue : 
                                              index === 1 ? BRAND_COLORS.logisticsGreen : 
                                              BRAND_COLORS.purple,
                            }}
                          >
                            {shift.name}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
                {/* Hour markers */}
                <div className="absolute bottom-0 left-0 right-0 h-4 flex">
                  {[0, 6, 12, 18, 24].map((hour) => (
                    <div
                      key={hour}
                      className="absolute text-[10px] text-muted-foreground"
                      style={{ left: `${(hour / 24) * 100}%`, transform: "translateX(-50%)" }}
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workers Tab */}
        <TabsContent value="workers" className="space-y-6 mt-6">
          {/* Worker Requirements Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2" style={{ borderColor: BRAND_COLORS.logisticsGreen }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                  Adequate Staffing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>
                    {laborCalculations.workerRequirements.filter(r => r.gap <= 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Categories with sufficient workers</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.warning }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                  Staff Shortage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.warning }}>
                    {laborCalculations.workerRequirements.filter(r => r.gap > 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Categories needing more workers</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.oceanBlue }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Total Gap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                    {laborCalculations.workerRequirements.reduce((sum, r) => sum + Math.max(0, r.gap), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Workers needed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Worker Requirements Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Worker Requirements by Category
              </CardTitle>
              <CardDescription>Current staffing vs. required workers per department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {laborCalculations.workerRequirements.map((req, index) => (
                  <motion.div
                    key={req.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-lg">{req.category}</p>
                        <p className="text-sm text-muted-foreground">
                          Weekly Hours: {req.weeklyHours}h • Rate: ${req.costPerHour.toFixed(2)}/hr
                        </p>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{req.currentWorkers}</p>
                          <p className="text-xs text-muted-foreground">Current</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                            {req.requiredWorkers}
                          </p>
                          <p className="text-xs text-muted-foreground">Required</p>
                        </div>
                        <div className="text-center">
                          <div className={`flex items-center gap-1 ${req.gap > 0 ? "text-red-500" : req.gap < 0 ? "text-green-500" : "text-slate-500"}`}>
                            {req.gap > 0 ? (
                              <ArrowUpRight className="h-5 w-5" />
                            ) : req.gap < 0 ? (
                              <ArrowDownRight className="h-5 w-5" />
                            ) : null}
                            <span className="text-2xl font-bold">
                              {req.gap > 0 ? `+${req.gap}` : req.gap}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Gap</p>
                        </div>
                        <div className="w-32">
                          <Progress
                            value={(req.currentWorkers / req.requiredWorkers) * 100}
                            className="h-3"
                          />
                          <p className="text-xs text-center mt-1">
                            {Math.round((req.currentWorkers / req.requiredWorkers) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Productivity Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                Productivity Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productivityMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{metric.name}</p>
                      <div className={`flex items-center gap-1 ${metric.trend >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {metric.trend >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        <span className="text-xs">{Math.abs(metric.trend)}%</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                        {metric.current}{metric.unit === "%" ? "%" : ""}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        / {metric.target}{metric.unit === "%" ? "%" : ` ${metric.unit}`}
                      </p>
                    </div>
                    <Progress
                      value={(metric.current / metric.target) * 100}
                      className="h-2 mt-2"
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Labor Costs Tab */}
        <TabsContent value="costs" className="space-y-6 mt-6">
          {/* Cost Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Monthly</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(laborCalculations.totalMonthlyCost)}</p>
                <p className="text-sm opacity-80 mt-1">Total Labor Cost</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Regular</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(laborCalculations.monthlyRegularCost)}</p>
                <p className="text-sm opacity-80 mt-1">Regular Hours Cost</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Overtime</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(laborCalculations.monthlyOvertimeCost)}</p>
                <p className="text-sm opacity-80 mt-1">Overtime Cost</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Per Unit</span>
                </div>
                <p className="text-2xl font-bold">
                  ${(laborCalculations.totalMonthlyCost / (laborCalculations.totalDailyUnits * parseFloat(workingDays))).toFixed(2)}
                </p>
                <p className="text-sm opacity-80 mt-1">Cost Per Unit</p>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Labor Cost Breakdown by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={laborCostBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="regularCost" name="Regular Cost" fill={BRAND_COLORS.oceanBlue} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="overtimeCost" name="Overtime Cost" fill={BRAND_COLORS.warning} radius={[4, 4, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cost Details Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                Detailed Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72">
                <div className="space-y-3 pr-4">
                  {laborCostBreakdown.map((item, index) => (
                    <motion.div
                      key={item.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.hours.toLocaleString()} labor hours/month
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(item.regularCost)}</p>
                            <p className="text-xs text-muted-foreground">Regular</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold" style={{ color: BRAND_COLORS.warning }}>
                              {formatCurrency(item.overtimeCost)}
                            </p>
                            <p className="text-xs text-muted-foreground">Overtime</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg" style={{ color: BRAND_COLORS.oceanBlue }}>
                              {formatCurrency(item.totalCost)}
                            </p>
                            <p className="text-xs text-muted-foreground">Total</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overtime Planning Tab */}
        <TabsContent value="overtime" className="space-y-6 mt-6">
          {/* Overtime Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-2" style={{ borderColor: BRAND_COLORS.warning }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                  Total OT Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.warning }}>
                    {overtimePlans.reduce((sum, p) => sum + (p.workers * p.overtimeHours), 0)}h
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Weekly Capacity</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.danger }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" style={{ color: BRAND_COLORS.danger }} />
                  OT Cost/Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.danger }}>
                    {formatCurrency(overtimePlans.reduce((sum, p) => sum + p.cost, 0))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Additional Weekly Cost</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.oceanBlue }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  OT Eligible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                    {overtimePlans.reduce((sum, p) => sum + p.workers, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Workers Can Work OT</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.logisticsGreen }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                  OT Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>
                    ${((parseFloat(baseWageRate) || 18.50) * (parseFloat(overtimeMultiplier) || 1.5)).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Per Hour</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overtime Plans by Shift */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Overtime Plan by Shift
              </CardTitle>
              <CardDescription>Detailed overtime allocation and cost per shift</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overtimePlans.map((plan, index) => (
                  <motion.div
                    key={plan.shiftId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-lg">{plan.shiftName}</p>
                          <Badge style={{ backgroundColor: BRAND_COLORS.warning }} className="text-white">
                            {plan.overtimeHours}h OT Available
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Regular: {plan.regularHours}h/shift • Workers: {plan.workers} • Rate: ${plan.overtimeRate.toFixed(2)}/hr
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xl font-bold">{plan.workers * plan.overtimeHours}h</p>
                          <p className="text-xs text-muted-foreground">Total OT Hours</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold" style={{ color: BRAND_COLORS.danger }}>
                            {formatCurrency(plan.cost)}
                          </p>
                          <p className="text-xs text-muted-foreground">Weekly OT Cost</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overtime Cost Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                Overtime Cost Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={overtimePlans.map(p => ({
                        name: p.shiftName,
                        value: p.cost,
                        fill: BRAND_COLORS.oceanBlue,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    >
                      {overtimePlans.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? BRAND_COLORS.oceanBlue :
                                index === 1 ? BRAND_COLORS.logisticsGreen :
                                BRAND_COLORS.purple}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Overtime Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                Overtime Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Cross-Training Opportunity</p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Implement cross-training between shifts to reduce overtime dependency. 
                        Estimated savings: {formatCurrency(laborCalculations.monthlyOvertimeCost * 0.15)}/month.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200">Peak Season Alert</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Consider hiring temporary workers for peak periods. Current overtime cost suggests 
                        potential savings with 3-5 additional staff members.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">Shift Optimization</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Rebalancing workers from {laborCalculations.workerRequirements.find(r => r.gap < 0)?.category || "Packing"} 
                        to {laborCalculations.workerRequirements.find(r => r.gap > 0)?.category || "Picking"} could reduce 
                        overtime by approximately 20%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
