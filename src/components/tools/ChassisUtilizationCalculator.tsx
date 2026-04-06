"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Calculator, Info, Truck, Container, DollarSign, Clock } from 'lucide-react';

interface ChassisPool {
  name: string;
  totalChassis: number;
  inUse: number;
  available: number;
  maintenance: number;
  avgTurnaroundDays: number;
  dailyRate: number;
  utilizationTarget: number;
}

interface ChassisMetrics {
  totalUnits: number;
  activeUtilization: number;
  idleRate: number;
  maintenanceRate: number;
  avgTurnaround: number;
  dailyRevenue: number;
  monthlyCost: number;
  efficiency: number;
}

const defaultPoolData: ChassisPool[] = [
  { name: "Pool A - LA/LB", totalChassis: 450, inUse: 380, available: 45, maintenance: 25, avgTurnaroundDays: 3.2, dailyRate: 85, utilizationTarget: 85 },
  { name: "Pool B - NY/NJ", totalChassis: 320, inUse: 260, available: 40, maintenance: 20, avgTurnaroundDays: 3.8, dailyRate: 92, utilizationTarget: 85 },
  { name: "Pool C - Savannah", totalChassis: 180, inUse: 145, available: 25, maintenance: 10, avgTurnaroundDays: 2.9, dailyRate: 78, utilizationTarget: 80 },
  { name: "Pool D - Houston", totalChassis: 220, inUse: 175, available: 30, maintenance: 15, avgTurnaroundDays: 3.5, dailyRate: 80, utilizationTarget: 82 },
  { name: "Pool E - Oakland", totalChassis: 150, inUse: 118, available: 22, maintenance: 10, avgTurnaroundDays: 3.1, dailyRate: 88, utilizationTarget: 80 },
];

const COLORS = ['#0F4C81', '#2E8B57', '#FF6B6B', '#FFA500'];

export default function ChassisUtilizationCalculator() {
  const [poolData, setPoolData] = useState<ChassisPool[]>(defaultPoolData);
  const [totalChassis, setTotalChassis] = useState<number>(200);
  const [inUse, setInUse] = useState<number>(160);
  const [available, setAvailable] = useState<number>(30);
  const [inMaintenance, setInMaintenance] = useState<number>(10);
  const [avgTurnaround, setAvgTurnaround] = useState<number>(3.5);
  const [dailyRate, setDailyRate] = useState<number>(85);
  const [storageDays, setStorageDays] = useState<number>(30);

  const metrics: ChassisMetrics = useMemo(() => {
    const activeUtilization = totalChassis > 0 ? (inUse / totalChassis) * 100 : 0;
    const idleRate = totalChassis > 0 ? (available / totalChassis) * 100 : 0;
    const maintenanceRate = totalChassis > 0 ? (inMaintenance / totalChassis) * 100 : 0;
    const turnsPerMonth = avgTurnaround > 0 ? 30 / avgTurnaround : 0;
    const dailyRevenue = inUse * dailyRate;
    const monthlyCost = totalChassis * dailyRate * 0.4 * storageDays;
    const efficiency = activeUtilization * (turnsPerMonth / 10);
    
    return {
      totalUnits: totalChassis,
      activeUtilization: Math.round(activeUtilization * 10) / 10,
      idleRate: Math.round(idleRate * 10) / 10,
      maintenanceRate: Math.round(maintenanceRate * 10) / 10,
      avgTurnaround: avgTurnaround,
      dailyRevenue: Math.round(dailyRevenue),
      monthlyCost: Math.round(monthlyCost),
      efficiency: Math.round(efficiency * 10) / 10
    };
  }, [totalChassis, inUse, available, inMaintenance, avgTurnaround, dailyRate, storageDays]);

  const utilizationChartData = useMemo(() => [
    { name: 'In Use', value: metrics.activeUtilization, color: '#0F4C81' },
    { name: 'Available', value: metrics.idleRate, color: '#2E8B57' },
    { name: 'Maintenance', value: metrics.maintenanceRate, color: '#FFA500' },
  ], [metrics]);

  const trendData = [
    { month: 'Jan', utilization: 78, revenue: 12500, turns: 8.5 },
    { month: 'Feb', utilization: 82, revenue: 13200, turns: 9.1 },
    { month: 'Mar', utilization: 80, revenue: 12800, turns: 8.8 },
    { month: 'Apr', utilization: 85, revenue: 14100, turns: 9.5 },
    { month: 'May', utilization: 83, revenue: 13500, turns: 9.2 },
    { month: 'Jun', utilization: 88, revenue: 14800, turns: 9.8 },
  ];

  const poolComparisonData = useMemo(() => {
    return poolData.map(pool => ({
      name: pool.name.split(' - ')[1],
      utilization: Math.round((pool.inUse / pool.totalChassis) * 100 * 10) / 10,
      target: pool.utilizationTarget,
      gap: Math.round((pool.utilizationTarget - (pool.inUse / pool.totalChassis) * 100) * 10) / 10,
      turns: Math.round((30 / pool.avgTurnaroundDays) * 10) / 10,
    }));
  }, [poolData]);

  const recommendations = useMemo(() => {
    const recs: { type: 'success' | 'warning' | 'error'; message: string }[] = [];
    
    if (metrics.activeUtilization >= 85) {
      recs.push({ type: 'success', message: 'Excellent utilization rate! Consider expanding capacity to meet demand.' });
    } else if (metrics.activeUtilization >= 75) {
      recs.push({ type: 'success', message: 'Good utilization rate. Minor optimization opportunities exist.' });
    } else if (metrics.activeUtilization >= 65) {
      recs.push({ type: 'warning', message: 'Below optimal utilization. Review idle chassis allocation.' });
    } else {
      recs.push({ type: 'error', message: 'Low utilization detected. Consider reducing pool size or redeploying assets.' });
    }

    if (metrics.maintenanceRate > 10) {
      recs.push({ type: 'warning', message: 'High maintenance ratio detected. Review maintenance schedules and chassis condition.' });
    }

    if (metrics.avgTurnaround > 4) {
      recs.push({ type: 'warning', message: 'Slow turnaround times. Investigate detention and port congestion issues.' });
    }

    if (metrics.avgTurnaround < 2.5) {
      recs.push({ type: 'success', message: 'Excellent turnaround times! Efficient drayage operations.' });
    }

    return recs;
  }, [metrics]);

  const getRecommendationStyle = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      case 'error': return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-[#0F4C81]" />
            Chassis Utilization Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Optimize chassis pool efficiency and track utilization metrics across terminals
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="pools">Pool Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chassis Pool Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalChassis">Total Chassis Units</Label>
                    <Input
                      id="totalChassis"
                      type="number"
                      value={totalChassis}
                      onChange={(e) => setTotalChassis(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inUse">Currently In Use</Label>
                    <Input
                      id="inUse"
                      type="number"
                      value={inUse}
                      onChange={(e) => setInUse(Number(e.target.value))}
                      min={0}
                      max={totalChassis}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="available">Available Units</Label>
                    <Input
                      id="available"
                      type="number"
                      value={available}
                      onChange={(e) => setAvailable(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance">In Maintenance</Label>
                    <Input
                      id="maintenance"
                      type="number"
                      value={inMaintenance}
                      onChange={(e) => setInMaintenance(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="avgTurnaround">Avg Turnaround (days)</Label>
                    <Input
                      id="avgTurnaround"
                      type="number"
                      value={avgTurnaround}
                      onChange={(e) => setAvgTurnaround(Number(e.target.value))}
                      min={0}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dailyRate">Daily Chassis Rate ($)</Label>
                    <Input
                      id="dailyRate"
                      type="number"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageDays">Analysis Period (days)</Label>
                  <Input
                    id="storageDays"
                    type="number"
                    value={storageDays}
                    onChange={(e) => setStorageDays(Number(e.target.value))}
                    min={1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Utilization Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Container className="h-5 w-5" />
                      <span className="text-sm font-medium">Active Utilization</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{metrics.activeUtilization}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metrics.activeUtilization >= 80 ? 'Optimal' : metrics.activeUtilization >= 70 ? 'Good' : 'Below Target'}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm font-medium">Turns/Month</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{avgTurnaround > 0 ? (30 / avgTurnaround).toFixed(1) : '0'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: 8-10 turns
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <DollarSign className="h-5 w-5" />
                      <span className="text-sm font-medium">Daily Revenue</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">${metrics.dailyRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      At ${dailyRate}/day rate
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                      <Calculator className="h-5 w-5" />
                      <span className="text-sm font-medium">Efficiency Score</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{metrics.efficiency}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Utilization × Turns
                    </p>
                  </div>
                </div>

                {/* Utilization Breakdown */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Status Breakdown</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={utilizationChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {utilizationChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Idle Rate</p>
                  <p className="text-xl font-bold">{metrics.idleRate}%</p>
                  <p className="text-xs text-muted-foreground">{available} units</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Maintenance Rate</p>
                  <p className="text-xl font-bold">{metrics.maintenanceRate}%</p>
                  <p className="text-xs text-muted-foreground">{inMaintenance} units</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Monthly Cost</p>
                  <p className="text-xl font-bold">${Math.round(metrics.monthlyCost).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Est. operating cost</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Net Margin</p>
                  <p className="text-xl font-bold">${Math.round((metrics.dailyRevenue * storageDays) - metrics.monthlyCost).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{storageDays} day period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pools" className="space-y-4">
          {/* Pool Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Chassis Pool Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare utilization across different terminal pools
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={poolComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 15]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="utilization" fill="#0F4C81" name="Utilization %" />
                  <Bar yAxisId="left" dataKey="target" fill="#2E8B57" name="Target %" />
                  <Line yAxisId="right" type="monotone" dataKey="turns" stroke="#FF6B6B" strokeWidth={2} name="Turns/Month" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pool Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Pool Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Pool Name</th>
                      <th className="text-center p-3">Total Units</th>
                      <th className="text-center p-3">In Use</th>
                      <th className="text-center p-3">Available</th>
                      <th className="text-center p-3">Maintenance</th>
                      <th className="text-center p-3">Utilization</th>
                      <th className="text-center p-3">Avg Turnaround</th>
                      <th className="text-center p-3">Daily Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poolData.map((pool) => {
                      const utilization = Math.round((pool.inUse / pool.totalChassis) * 100 * 10) / 10;
                      return (
                        <tr key={pool.name} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{pool.name}</td>
                          <td className="p-3 text-center">{pool.totalChassis}</td>
                          <td className="p-3 text-center">{pool.inUse}</td>
                          <td className="p-3 text-center text-green-600">{pool.available}</td>
                          <td className="p-3 text-center text-orange-600">{pool.maintenance}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-1 rounded text-sm ${
                              utilization >= 85 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                              utilization >= 75 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                              'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {utilization}%
                            </span>
                          </td>
                          <td className="p-3 text-center">{pool.avgTurnaroundDays} days</td>
                          <td className="p-3 text-center">${pool.dailyRate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Utilization Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Utilization Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="utilization" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.3} name="Utilization %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue and Turns Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="revenue" stroke="#2E8B57" strokeWidth={2} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Turns Per Month Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[7, 12]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="turns" stroke="#FF6B6B" strokeWidth={2} name="Turns" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-4 border rounded-lg ${getRecommendationStyle(rec.type)}`}>
                  <p className="font-medium">{rec.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle>Best Practices for Chassis Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Utilization Optimization
                  </h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Target 80-85% utilization for optimal balance</li>
                    <li>• Maintain 10-15% buffer for peak demand</li>
                    <li>• Keep maintenance ratio below 8%</li>
                    <li>• Aim for 8-10 turns per month</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    Cost Management
                  </h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Negotiate pool agreements for volume discounts</li>
                    <li>• Monitor detention fees closely</li>
                    <li>• Consider street turns to reduce empty miles</li>
                    <li>• Track per-unit costs weekly</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    Turnaround Efficiency
                  </h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Target 2.5-3.5 day average turnaround</li>
                    <li>• Implement pre-trip inspections</li>
                    <li>• Use appointment systems at terminals</li>
                    <li>• Monitor port congestion impacts</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Container className="h-4 w-4 text-purple-500" />
                    Fleet Management
                  </h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Regular maintenance scheduling</li>
                    <li>• Age-based replacement planning</li>
                    <li>• Mix of 20&apos;, 40&apos;, and 45&apos; chassis</li>
                    <li>• Track damage and repair costs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is chassis utilization and why is it important?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Chassis utilization measures the percentage of available chassis actively in use for container transport. High utilization (80-85%) indicates efficient asset deployment and maximum revenue generation. Low utilization suggests excess capacity and wasted resources, while very high utilization may indicate insufficient capacity for demand spikes.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is a good turnaround time for chassis?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Optimal turnaround times range from 2.5-3.5 days, meaning a chassis completes a round trip from port to consignee and back within this window. Faster turnarounds increase monthly turns and revenue per unit. Turnarounds exceeding 4 days often indicate detention issues, port congestion, or inefficient drayage operations.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How do I calculate chassis efficiency?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Chassis efficiency combines utilization rate with turnover speed: Efficiency = Utilization % × (Turns per Month / 10). A score above 70 indicates excellent performance. For example, 85% utilization with 9 turns/month yields an efficiency score of 76.5. This metric helps balance capacity utilization with operational speed.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What factors affect chassis availability?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Key factors include port congestion, vessel arrival delays, container dwell time at terminals, drayage capacity, maintenance schedules, seasonal demand fluctuations, and chassis pool agreements. Understanding these factors helps predict availability and plan operations accordingly.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">Should I maintain my own chassis or use a pool?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    The choice depends on volume, routes, and operational flexibility. Owned chassis provide guaranteed availability but require maintenance and storage costs. Pool chassis offer flexibility and reduced capital requirements but may have availability constraints during peak periods. Many operators use a hybrid approach.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How can I reduce chassis detention costs?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Strategies include improving appointment compliance at terminals, implementing street turns (direct container exchange), negotiating free time in contracts, monitoring per-diems closely, and optimizing drayage routes. Pre-planning container returns and maintaining visibility of all chassis locations also help reduce detention.
                  </p>
                </details>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-[#0F4C81]/20 bg-[#0F4C81]/5">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Pro Tips for Chassis Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Monitor utilization weekly and compare against seasonal patterns to anticipate capacity needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Use street turns to reduce empty chassis miles and improve overall pool efficiency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Track maintenance costs per chassis to identify units requiring replacement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Negotiate pool agreements with tiered pricing based on volume commitments</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
