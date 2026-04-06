"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Calculator, Info, Truck, Container, DollarSign, Clock, Building } from 'lucide-react';

interface TrailerPool {
  name: string;
  type: 'dry-van' | 'reefer' | 'flatbed' | 'tanker';
  totalUnits: number;
  owned: number;
  leased: number;
  inUse: number;
  available: number;
  maintenance: number;
  avgTurnaroundDays: number;
  dailyRate: number;
  monthlyLeaseCost: number;
}

interface PoolMetrics {
  totalTrailers: number;
  utilizationRate: number;
  ownedRatio: number;
  leasedRatio: number;
  totalRevenue: number;
  totalCost: number;
  netMargin: number;
  avgTurnaround: number;
}

const defaultPoolData: TrailerPool[] = [
  { name: 'Dry Van Fleet A', type: 'dry-van', totalUnits: 120, owned: 80, leased: 40, inUse: 95, available: 18, maintenance: 7, avgTurnaroundDays: 2.5, dailyRate: 65, monthlyLeaseCost: 1200 },
  { name: 'Dry Van Fleet B', type: 'dry-van', totalUnits: 85, owned: 50, leased: 35, inUse: 68, available: 12, maintenance: 5, avgTurnaroundDays: 2.8, dailyRate: 65, monthlyLeaseCost: 1200 },
  { name: 'Reefer Fleet', type: 'reefer', totalUnits: 45, owned: 30, leased: 15, inUse: 40, available: 3, maintenance: 2, avgTurnaroundDays: 3.2, dailyRate: 95, monthlyLeaseCost: 1800 },
  { name: 'Flatbed Fleet', type: 'flatbed', totalUnits: 30, owned: 25, leased: 5, inUse: 24, available: 4, maintenance: 2, avgTurnaroundDays: 2.1, dailyRate: 85, monthlyLeaseCost: 1500 },
  { name: 'Tanker Fleet', type: 'tanker', totalUnits: 20, owned: 15, leased: 5, inUse: 17, available: 2, maintenance: 1, avgTurnaroundDays: 3.5, dailyRate: 120, monthlyLeaseCost: 2200 },
];

const COLORS = ['#0F4C81', '#2E8B57', '#FFA500', '#8884d8', '#FF6B6B'];

export default function TrailerPoolingCalculator() {
  const [poolData, setPoolData] = useState<TrailerPool[]>(defaultPoolData);
  const [totalUnits, setTotalUnits] = useState<number>(100);
  const [ownedUnits, setOwnedUnits] = useState<number>(60);
  const [leasedUnits, setLeasedUnits] = useState<number>(40);
  const [avgUtilization, setAvgUtilization] = useState<number>(80);
  const [dailyRate, setDailyRate] = useState<number>(65);
  const [leaseCost, setLeaseCost] = useState<number>(1200);
  const [avgTurnaround, setAvgTurnaround] = useState<number>(2.5);
  const [operatingDays, setOperatingDays] = useState<number>(25);

  const metrics: PoolMetrics = useMemo(() => {
    const utilizationRate = avgUtilization;
    const ownedRatio = totalUnits > 0 ? (ownedUnits / totalUnits) * 100 : 0;
    const leasedRatio = totalUnits > 0 ? (leasedUnits / totalUnits) * 100 : 0;
    const inUseUnits = Math.round(totalUnits * (avgUtilization / 100));
    const totalRevenue = inUseUnits * dailyRate * operatingDays;
    const totalCost = (leasedUnits * leaseCost) + (ownedUnits * 200 * operatingDays / 30);
    const netMargin = totalRevenue - totalCost;
    const avgTurnaroundCalc = avgTurnaround;

    return {
      totalTrailers: totalUnits,
      utilizationRate,
      ownedRatio: Math.round(ownedRatio * 10) / 10,
      leasedRatio: Math.round(leasedRatio * 10) / 10,
      totalRevenue: Math.round(totalRevenue),
      totalCost: Math.round(totalCost),
      netMargin: Math.round(netMargin),
      avgTurnaround: avgTurnaroundCalc
    };
  }, [totalUnits, ownedUnits, leasedUnits, avgUtilization, dailyRate, leaseCost, avgTurnaround, operatingDays]);

  const ownershipData = useMemo(() => [
    { name: 'Owned', value: metrics.ownedRatio, color: '#0F4C81' },
    { name: 'Leased', value: metrics.leasedRatio, color: '#2E8B57' },
  ], [metrics]);

  const utilizationByType = useMemo(() => {
    return poolData.map(pool => ({
      name: pool.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      utilization: Math.round((pool.inUse / pool.totalUnits) * 100 * 10) / 10,
      inUse: pool.inUse,
      available: pool.available,
      maintenance: pool.maintenance,
    }));
  }, [poolData]);

  const costComparisonData = useMemo(() => {
    return poolData.map(pool => ({
      name: pool.name.split(' ').slice(0, 2).join(' '),
      revenue: pool.inUse * pool.dailyRate * 25,
      leaseCost: pool.leased * pool.monthlyLeaseCost,
      ownedCost: pool.owned * 200 * 25 / 30,
      netMargin: (pool.inUse * pool.dailyRate * 25) - ((pool.leased * pool.monthlyLeaseCost) + (pool.owned * 200 * 25 / 30)),
    }));
  }, [poolData]);

  const trendData = [
    { month: 'Jan', utilization: 78, margin: 45000, units: 280 },
    { month: 'Feb', utilization: 82, margin: 52000, units: 295 },
    { month: 'Mar', utilization: 80, margin: 48000, units: 290 },
    { month: 'Apr', utilization: 85, margin: 58000, units: 300 },
    { month: 'May', utilization: 83, margin: 55000, units: 298 },
    { month: 'Jun', utilization: 88, margin: 65000, units: 310 },
  ];

  const recommendations = useMemo(() => {
    const recs: { type: 'success' | 'warning' | 'error' | 'info'; message: string; action: string }[] = [];

    if (metrics.utilizationRate >= 85) {
      recs.push({ type: 'success', message: 'Excellent utilization rate', action: 'Consider expanding fleet capacity to capture more demand' });
    } else if (metrics.utilizationRate >= 75) {
      recs.push({ type: 'info', message: 'Good utilization rate', action: 'Monitor demand patterns for optimization opportunities' });
    } else {
      recs.push({ type: 'warning', message: 'Low utilization rate', action: 'Evaluate leasing options or seek additional customers' });
    }

    if (metrics.leasedRatio > 50) {
      recs.push({ type: 'warning', message: 'High lease dependency', action: 'Consider purchasing more units to reduce long-term costs' });
    } else if (metrics.leasedRatio < 20) {
      recs.push({ type: 'info', message: 'Low lease flexibility', action: 'Consider leasing options for seasonal demand spikes' });
    }

    if (metrics.netMargin < 0) {
      recs.push({ type: 'error', message: 'Negative margin detected', action: 'Review pricing strategy and cost structure immediately' });
    } else if (metrics.netMargin > metrics.totalCost * 0.3) {
      recs.push({ type: 'success', message: 'Strong profit margin', action: 'Current fleet mix is optimal for profitability' });
    }

    return recs;
  }, [metrics]);

  const getRecommendationStyle = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default: return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-[#0F4C81]" />
            Trailer Pooling Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Optimize trailer fleet mix between owned and leased assets for maximum profitability
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="fleet-mix">Fleet Mix</TabsTrigger>
          <TabsTrigger value="cost-analysis">Cost Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fleet Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalUnits">Total Trailer Units</Label>
                    <Input
                      id="totalUnits"
                      type="number"
                      value={totalUnits}
                      onChange={(e) => setTotalUnits(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownedUnits">Owned Units</Label>
                    <Input
                      id="ownedUnits"
                      type="number"
                      value={ownedUnits}
                      onChange={(e) => setOwnedUnits(Number(e.target.value))}
                      min={0}
                      max={totalUnits}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leasedUnits">Leased Units</Label>
                    <Input
                      id="leasedUnits"
                      type="number"
                      value={leasedUnits}
                      onChange={(e) => setLeasedUnits(Number(e.target.value))}
                      min={0}
                      max={totalUnits}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avgUtilization">Utilization Rate (%)</Label>
                    <Input
                      id="avgUtilization"
                      type="number"
                      value={avgUtilization}
                      onChange={(e) => setAvgUtilization(Number(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyRate">Daily Rental Rate ($)</Label>
                    <Input
                      id="dailyRate"
                      type="number"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaseCost">Monthly Lease Cost ($)</Label>
                    <Input
                      id="leaseCost"
                      type="number"
                      value={leaseCost}
                      onChange={(e) => setLeaseCost(Number(e.target.value))}
                      min={0}
                    />
                  </div>
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
                    <Label htmlFor="operatingDays">Operating Days/Month</Label>
                    <Input
                      id="operatingDays"
                      type="number"
                      value={operatingDays}
                      onChange={(e) => setOperatingDays(Number(e.target.value))}
                      min={1}
                      max={31}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pool Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Container className="h-5 w-5" />
                      <span className="text-sm font-medium">Total Fleet</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{metrics.totalTrailers}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metrics.ownedRatio}% owned / {metrics.leasedRatio}% leased
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-sm font-medium">Utilization</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{metrics.utilizationRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: 80-85%
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <DollarSign className="h-5 w-5" />
                      <span className="text-sm font-medium">Monthly Revenue</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">${metrics.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Gross revenue
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${metrics.netMargin >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <div className={`flex items-center gap-2 ${metrics.netMargin >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      <Calculator className="h-5 w-5" />
                      <span className="text-sm font-medium">Net Margin</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">${Math.abs(metrics.netMargin).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metrics.netMargin >= 0 ? 'Profit' : 'Loss'}
                    </p>
                  </div>
                </div>

                {/* Ownership Distribution */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Ownership Distribution</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={ownershipData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {ownershipData.map((entry, index) => (
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

          {/* Cost Breakdown */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Monthly Operating Cost</p>
                  <p className="text-xl font-bold">${metrics.totalCost.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Lease + Owned maintenance</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Cost per Trailer</p>
                  <p className="text-xl font-bold">${Math.round(metrics.totalCost / totalUnits).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Monthly average</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Revenue per Trailer</p>
                  <p className="text-xl font-bold">${Math.round(metrics.totalRevenue / totalUnits).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Monthly average</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Margin per Trailer</p>
                  <p className="text-xl font-bold">${Math.round(metrics.netMargin / totalUnits).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Monthly average</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fleet-mix" className="space-y-4">
          {/* Utilization by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Utilization by Trailer Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={utilizationByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="utilization" fill="#0F4C81" name="Utilization %" />
                  <Bar dataKey="available" stackId="a" fill="#2E8B57" name="Available" />
                  <Bar dataKey="maintenance" stackId="a" fill="#FFA500" name="Maintenance" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fleet Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Fleet Inventory Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Fleet Name</th>
                      <th className="text-center p-3">Type</th>
                      <th className="text-center p-3">Total</th>
                      <th className="text-center p-3">Owned</th>
                      <th className="text-center p-3">Leased</th>
                      <th className="text-center p-3">In Use</th>
                      <th className="text-center p-3">Utilization</th>
                      <th className="text-center p-3">Daily Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poolData.map((pool) => {
                      const utilization = Math.round((pool.inUse / pool.totalUnits) * 100 * 10) / 10;
                      return (
                        <tr key={pool.name} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{pool.name}</td>
                          <td className="p-3 text-center capitalize">{pool.type.replace('-', ' ')}</td>
                          <td className="p-3 text-center">{pool.totalUnits}</td>
                          <td className="p-3 text-center text-blue-600">{pool.owned}</td>
                          <td className="p-3 text-center text-green-600">{pool.leased}</td>
                          <td className="p-3 text-center">{pool.inUse}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-1 rounded text-sm ${
                              utilization >= 85 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                              utilization >= 75 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                              'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {utilization}%
                            </span>
                          </td>
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

        <TabsContent value="cost-analysis" className="space-y-4">
          {/* Cost vs Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Cost by Fleet</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={costComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#0F4C81" name="Revenue" />
                  <Bar dataKey="leaseCost" fill="#FF6B6B" name="Lease Cost" />
                  <Bar dataKey="ownedCost" fill="#FFA500" name="Owned Cost" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Net Margin Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="margin" stroke="#2E8B57" fill="#2E8B57" fillOpacity={0.3} name="Net Margin ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="utilization" stroke="#0F4C81" strokeWidth={2} name="Utilization %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Owned Trailer Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span>Depreciation (per unit/month)</span>
                  <span className="font-bold">$450</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span>Maintenance Reserve</span>
                  <span className="font-bold">$150</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span>Insurance</span>
                  <span className="font-bold">$85</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span>Licensing & Registration</span>
                  <span className="font-bold">$25</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-2 border-blue-200">
                  <span className="font-semibold">Total Owned Cost/Unit</span>
                  <span className="font-bold text-blue-600">$710/month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leased Trailer Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span>Base Monthly Lease</span>
                  <span className="font-bold">$1,200</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span>Insurance Surcharge</span>
                  <span className="font-bold">$45</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span>Maintenance (Included)</span>
                  <span className="font-bold">$0</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span>Admin Fees</span>
                  <span className="font-bold">$15</span>
                </div>
                <div className="flex justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded border-2 border-green-200">
                  <span className="font-semibold">Total Lease Cost/Unit</span>
                  <span className="font-bold text-green-600">$1,260/month</span>
                </div>
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
                Fleet Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-4 border rounded-lg ${getRecommendationStyle(rec.type)}`}>
                  <p className="font-medium">{rec.message}</p>
                  <p className="text-sm text-muted-foreground mt-1">{rec.action}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Optimal Mix Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Optimal Fleet Mix Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">For Stable Demand (Low Seasonality)</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Recommendation: <span className="font-medium">70% Owned / 30% Leased</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    With predictable demand, owning more trailers reduces long-term costs and provides asset appreciation benefits.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">For Seasonal Demand (High Variability)</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Recommendation: <span className="font-medium">50% Owned / 50% Leased</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Higher lease ratio allows flexibility to scale down during off-peak periods without fixed asset costs.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">For Growing Operations</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Recommendation: <span className="font-medium">40% Owned / 60% Leased</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Start with more leases to preserve capital for growth investments, gradually increase ownership as operations stabilize.
                  </p>
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
                  <summary className="font-semibold cursor-pointer">What is trailer pooling and why is it beneficial?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Trailer pooling involves managing a mixed fleet of owned and leased trailers to optimize costs and flexibility. Benefits include reduced capital requirements, ability to scale with demand, access to newer equipment through leases, and lower maintenance responsibilities for leased units.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">Should I buy or lease trailers for my fleet?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    The decision depends on your operation type. Buy when you have stable, predictable demand and want to build equity. Lease when you need flexibility for seasonal fluctuations, want to preserve capital, or prefer predictable monthly costs without maintenance surprises.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is a good trailer utilization rate?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Target utilization is 80-85%. Below 75% indicates excess capacity and wasted resources. Above 90% risks service failures during demand spikes and provides no buffer for maintenance. The optimal range balances revenue maximization with operational flexibility.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How do I calculate trailer fleet costs?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    For owned trailers, factor in depreciation, maintenance reserve, insurance, licensing, and financing costs. For leased trailers, include base lease payments, insurance surcharges, and any over-mileage or damage charges. Compare total cost per mile or per day to determine optimal mix.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What factors affect trailer lease rates?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Lease rates are influenced by trailer type (dry van, reefer, flatbed), lease term length, mileage allowances, trailer age and condition, geographic region, and current market supply/demand. Longer terms typically offer lower rates but reduce flexibility.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How often should I review my fleet mix?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Conduct a formal fleet mix review quarterly. Monitor utilization rates monthly, and reassess ownership ratios annually or when significant changes occur in demand patterns, routes, or customer contracts. A proactive approach prevents both capacity shortages and excess inventory.
                  </p>
                </details>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-[#0F4C81]/20 bg-[#0F4C81]/5">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Pro Tips for Fleet Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Negotiate flexible lease terms that allow seasonal adjustments to your fleet size</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Track per-trailer profitability to identify units that should be sold or returned</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Maintain 10-15% spare capacity for demand spikes and maintenance windows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Consider trailer type diversification to capture different market segments</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
