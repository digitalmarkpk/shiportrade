"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Zap, Building, Thermometer, Lightbulb, DollarSign, Leaf } from 'lucide-react';

interface EnergyUsage {
  category: string;
  kWh: number;
  cost: number;
  percentage: number;
}

interface EnergyMetrics {
  totalKwh: number;
  totalCost: number;
  costPerSqFt: number;
  kwhPerSqFt: number;
  kwhPerPallet: number;
  carbonFootprint: number;
  peakDemand: number;
  loadFactor: number;
}

const defaultEnergyData: EnergyUsage[] = [
  { category: 'Lighting', kWh: 45000, cost: 5400, percentage: 22 },
  { category: 'HVAC', kWh: 85000, cost: 10200, percentage: 42 },
  { category: 'Material Handling', kWh: 35000, cost: 4200, percentage: 17 },
  { category: 'Refrigeration', kWh: 25000, cost: 3000, percentage: 12 },
  { category: 'Other', kWh: 13000, cost: 1560, percentage: 7 },
];

const COLORS = ['#0F4C81', '#2E8B57', '#FFA500', '#FF6B6B', '#8884d8'];

export default function WarehouseEnergyCalculator() {
  const [energyData, setEnergyData] = useState<EnergyUsage[]>(defaultEnergyData);
  const [warehouseSqFt, setWarehouseSqFt] = useState<number>(100000);
  const [palletPositions, setPalletPositions] = useState<number>(5000);
  const [electricityRate, setElectricityRate] = useState<number>(0.12);
  const [operatingHours, setOperatingHours] = useState<number>(16);
  const [lightingWatts, setLightingWatts] = useState<number>(150);
  const [hvacTons, setHvacTons] = useState<number>(50);
  const [hvacSeer, setHvacSeer] = useState<number>(14);
  const [forkliftCount, setForkliftCount] = useState<number>(10);
  const [forkliftHours, setForkliftHours] = useState<number>(8);

  const metrics: EnergyMetrics = useMemo(() => {
    const totalKwh = energyData.reduce((sum, e) => sum + e.kWh, 0);
    const totalCost = energyData.reduce((sum, e) => sum + e.cost, 0);
    const costPerSqFt = warehouseSqFt > 0 ? totalCost / warehouseSqFt : 0;
    const kwhPerSqFt = warehouseSqFt > 0 ? totalKwh / warehouseSqFt : 0;
    const kwhPerPallet = palletPositions > 0 ? totalKwh / palletPositions : 0;
    const carbonFootprint = totalKwh * 0.42;
    const peakDemand = totalKwh / (operatingHours * 30);
    const avgDemand = totalKwh / (operatingHours * 30 * 0.75);
    const loadFactor = avgDemand / peakDemand * 100;

    return {
      totalKwh,
      totalCost,
      costPerSqFt: Math.round(costPerSqFt * 100) / 100,
      kwhPerSqFt: Math.round(kwhPerSqFt * 100) / 100,
      kwhPerPallet: Math.round(kwhPerPallet * 10) / 10,
      carbonFootprint: Math.round(carbonFootprint),
      peakDemand: Math.round(peakDemand),
      loadFactor: Math.round(loadFactor)
    };
  }, [energyData, warehouseSqFt, palletPositions, operatingHours]);

  const detailedCalculation = useMemo(() => {
    const lightingKwh = (lightingWatts * warehouseSqFt / 1000) * operatingHours * 30;
    const hvacKwh = (hvacTons * 12000 / hvacSeer) * operatingHours * 30 * 0.7;
    const forkliftKwh = forkliftCount * forkliftHours * 5 * 30;
    const totalCalculatedKwh = lightingKwh + hvacKwh + forkliftKwh;

    return {
      lighting: {
        kwh: Math.round(lightingKwh),
        cost: Math.round(lightingKwh * electricityRate),
        wpsqft: Math.round(lightingWatts / 1000 * 100) / 100
      },
      hvac: {
        kwh: Math.round(hvacKwh),
        cost: Math.round(hvacKwh * electricityRate),
        tonsPerSqFt: Math.round(hvacTons / warehouseSqFt * 10000) / 10000
      },
      forklift: {
        kwh: Math.round(forkliftKwh),
        cost: Math.round(forkliftKwh * electricityRate),
        kwhPerUnit: Math.round(forkliftHours * 5 * 30)
      },
      totalCalculatedKwh: Math.round(totalCalculatedKwh)
    };
  }, [lightingWatts, warehouseSqFt, operatingHours, hvacTons, hvacSeer, forkliftCount, forkliftHours, electricityRate]);

  const monthlyTrend = [
    { month: 'Jan', kwh: 195000, cost: 23400, temp: 45 },
    { month: 'Feb', kwh: 180000, cost: 21600, temp: 48 },
    { month: 'Mar', kwh: 165000, cost: 19800, temp: 58 },
    { month: 'Apr', kwh: 175000, cost: 21000, temp: 65 },
    { month: 'May', kwh: 190000, cost: 22800, temp: 72 },
    { month: 'Jun', kwh: 210000, cost: 25200, temp: 82 },
    { month: 'Jul', kwh: 225000, cost: 27000, temp: 88 },
    { month: 'Aug', kwh: 220000, cost: 26400, temp: 86 },
    { month: 'Sep', kwh: 200000, cost: 24000, temp: 78 },
    { month: 'Oct', kwh: 180000, cost: 21600, temp: 68 },
    { month: 'Nov', kwh: 185000, cost: 22200, temp: 55 },
    { month: 'Dec', kwh: 200000, cost: 24000, temp: 42 },
  ];

  const comparisonData = [
    { name: 'Your Facility', lighting: 22, hvac: 42, material: 17, other: 19 },
    { name: 'Industry Avg', lighting: 28, hvac: 38, material: 20, other: 14 },
    { name: 'Best Practice', lighting: 18, hvac: 35, material: 22, other: 25 },
  ];

  const recommendations = useMemo(() => {
    const recs: { type: 'success' | 'warning' | 'error' | 'info'; title: string; savings: string; detail: string }[] = [];

    if (detailedCalculation.lighting.wpsqft > 1.5) {
      recs.push({
        type: 'warning',
        title: 'LED Retrofit Opportunity',
        savings: '30-50% lighting savings',
        detail: 'Consider upgrading to LED fixtures with occupancy sensors to reduce lighting energy consumption'
      });
    }

    if (detailedCalculation.hvac.tonsPerSqFt > 0.0006) {
      recs.push({
        type: 'info',
        title: 'HVAC Optimization',
        savings: '15-25% HVAC savings',
        detail: 'Implement setback schedules during non-operating hours and consider upgrading to higher SEER units'
      });
    }

    if (metrics.loadFactor < 70) {
      recs.push({
        type: 'warning',
        title: 'Peak Demand Management',
        savings: '10-15% demand charge reduction',
        detail: 'Stagger equipment start times and consider battery storage to flatten peak demand'
      });
    }

    if (metrics.kwhPerSqFt > 25) {
      recs.push({
        type: 'error',
        title: 'Above Industry Benchmark',
        savings: 'Potential 20-30% total savings',
        detail: 'Your facility exceeds typical warehouse energy intensity. Conduct energy audit immediately.'
      });
    } else if (metrics.kwhPerSqFt < 15) {
      recs.push({
        type: 'success',
        title: 'Efficient Operations',
        savings: 'Below industry average',
        detail: 'Your facility performs better than industry benchmarks. Share best practices with other locations.'
      });
    }

    return recs;
  }, [detailedCalculation, metrics]);

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
            <Zap className="h-6 w-6 text-[#0F4C81]" />
            Warehouse Energy Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Analyze and optimize warehouse energy consumption, costs, and carbon footprint
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Energy</p>
                    <p className="text-xl font-bold">{(metrics.totalKwh / 1000).toFixed(0)} MWh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Cost</p>
                    <p className="text-xl font-bold">${metrics.totalCost.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">kWh/Sq Ft</p>
                    <p className="text-xl font-bold">{metrics.kwhPerSqFt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-emerald-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">CO2 (tons/yr)</p>
                    <p className="text-xl font-bold">{Math.round(metrics.carbonFootprint * 12 / 2000)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Energy Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={energyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="kWh"
                      label={({ category, percentage }) => `${category}: ${percentage}%`}
                    >
                      {energyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()} kWh`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={energyData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" formatter={(value) => `$${value}`} />
                    <YAxis dataKey="category" type="category" width={100} />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Bar dataKey="cost" fill="#0F4C81" name="Monthly Cost" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Benchmark Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Your kWh/Sq Ft</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.kwhPerSqFt}</p>
                  <p className="text-xs text-muted-foreground mt-1">Monthly</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Industry Average</p>
                  <p className="text-2xl font-bold">18.5</p>
                  <p className="text-xs text-muted-foreground mt-1">kWh/Sq Ft</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Best Practice</p>
                  <p className="text-2xl font-bold">12.0</p>
                  <p className="text-xs text-muted-foreground mt-1">kWh/Sq Ft</p>
                </div>
                <div className={`p-4 rounded-lg text-center ${metrics.kwhPerSqFt <= 15 ? 'bg-green-50 dark:bg-green-900/20' : metrics.kwhPerSqFt <= 20 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <p className="text-sm text-muted-foreground">Performance</p>
                  <p className="text-2xl font-bold">{metrics.kwhPerSqFt <= 15 ? 'Excellent' : metrics.kwhPerSqFt <= 20 ? 'Average' : 'Below Avg'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Facility Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Warehouse Size (sq ft)</Label>
                    <Input
                      type="number"
                      value={warehouseSqFt}
                      onChange={(e) => setWarehouseSqFt(Number(e.target.value))}
                      min={10000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pallet Positions</Label>
                    <Input
                      type="number"
                      value={palletPositions}
                      onChange={(e) => setPalletPositions(Number(e.target.value))}
                      min={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Electricity Rate ($/kWh)</Label>
                    <Input
                      type="number"
                      value={electricityRate}
                      onChange={(e) => setElectricityRate(Number(e.target.value))}
                      min={0.05}
                      step={0.01}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Operating Hours/Day</Label>
                    <Input
                      type="number"
                      value={operatingHours}
                      onChange={(e) => setOperatingHours(Number(e.target.value))}
                      min={8}
                      max={24}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Equipment Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Lighting (W/sq ft)</Label>
                    <Input
                      type="number"
                      value={lightingWatts}
                      onChange={(e) => setLightingWatts(Number(e.target.value))}
                      min={0.5}
                      max={3}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>HVAC Capacity (tons)</Label>
                    <Input
                      type="number"
                      value={hvacTons}
                      onChange={(e) => setHvacTons(Number(e.target.value))}
                      min={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>HVAC SEER Rating</Label>
                    <Input
                      type="number"
                      value={hvacSeer}
                      onChange={(e) => setHvacSeer(Number(e.target.value))}
                      min={10}
                      max={25}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Forklift Count</Label>
                    <Input
                      type="number"
                      value={forkliftCount}
                      onChange={(e) => setForkliftCount(Number(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Forklift Hours/Day</Label>
                    <Input
                      type="number"
                      value={forkliftHours}
                      onChange={(e) => setForkliftHours(Number(e.target.value))}
                      min={1}
                      max={16}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculated Results */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Breakdown by System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">Lighting</span>
                  </div>
                  <p className="text-2xl font-bold">{(detailedCalculation.lighting.kwh / 1000).toFixed(1)} MWh</p>
                  <p className="text-sm text-muted-foreground">${detailedCalculation.lighting.cost.toLocaleString()}/month</p>
                  <p className="text-xs text-muted-foreground mt-1">{detailedCalculation.lighting.wpsqft} W/sq ft</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold">HVAC</span>
                  </div>
                  <p className="text-2xl font-bold">{(detailedCalculation.hvac.kwh / 1000).toFixed(1)} MWh</p>
                  <p className="text-sm text-muted-foreground">${detailedCalculation.hvac.cost.toLocaleString()}/month</p>
                  <p className="text-xs text-muted-foreground mt-1">{hvacTons} tons capacity</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Material Handling</span>
                  </div>
                  <p className="text-2xl font-bold">{(detailedCalculation.forklift.kwh / 1000).toFixed(1)} MWh</p>
                  <p className="text-sm text-muted-foreground">${detailedCalculation.forklift.cost.toLocaleString()}/month</p>
                  <p className="text-xs text-muted-foreground mt-1">{forkliftCount} forklifts @ {forkliftHours}hrs/day</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Estimated Monthly Consumption</span>
                  <span className="text-2xl font-bold">{(detailedCalculation.totalCalculatedKwh / 1000).toFixed(1)} MWh</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground">Estimated Monthly Cost</span>
                  <span className="font-bold">${Math.round(detailedCalculation.totalCalculatedKwh * electricityRate).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Annual Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Annual Energy Consumption Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[30, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="kwh" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.3} name="kWh" />
                  <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#FF6B6B" strokeWidth={2} name="Avg Temp (°F)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Cost Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Energy Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Bar dataKey="cost" fill="#2E8B57" name="Cost ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Comparison with Industry */}
          <Card>
            <CardHeader>
              <CardTitle>Category Comparison vs Industry</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 50]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lighting" fill="#FFA500" name="Lighting %" />
                  <Bar dataKey="hvac" fill="#0F4C81" name="HVAC %" />
                  <Bar dataKey="material" fill="#2E8B57" name="Material Handling %" />
                  <Bar dataKey="other" fill="#8884d8" name="Other %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                Energy Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-4 border rounded-lg ${getRecommendationStyle(rec.type)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{rec.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{rec.detail}</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">{rec.savings}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Energy Saving Ideas */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Wins for Energy Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Lighting (30-50% savings)
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• LED retrofit with occupancy sensors</li>
                    <li>• Daylight harvesting systems</li>
                    <li>• Task lighting instead of ambient</li>
                    <li>• Timer controls for low-traffic areas</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    HVAC (15-25% savings)
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Programmable thermostats</li>
                    <li>• High-efficiency SEER units</li>
                    <li>• Demand-controlled ventilation</li>
                    <li>• Dock door seals and air curtains</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    Equipment (10-20% savings)
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Electric forklifts over propane</li>
                    <li>• Opportunistic charging schedules</li>
                    <li>• VFDs on motors and fans</li>
                    <li>• Power factor correction</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    Renewable (Long-term savings)
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Rooftop solar installation</li>
                    <li>• Battery storage for peak shaving</li>
                    <li>• Renewable energy credits</li>
                    <li>• On-site wind turbines</li>
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
                  <summary className="font-semibold cursor-pointer">What is the average energy consumption for a warehouse?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Typical warehouses consume 15-25 kWh per square foot annually, or about 1.5-2 kWh per square foot monthly. Climate-controlled facilities may reach 30+ kWh/sq ft. High-efficiency warehouses operate at 10-15 kWh/sq ft through LED lighting, efficient HVAC, and smart controls.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How do I calculate warehouse energy costs per pallet?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Divide total monthly energy consumption (kWh) by pallet positions, then multiply by your electricity rate. For example, 200,000 kWh / 5,000 pallets × $0.12/kWh = $4.80/pallet/month. Track this metric to identify efficiency opportunities and benchmark against industry averages.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is a good lighting wattage per square foot?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Modern LED warehouses should target 0.8-1.2 watts per square foot for general lighting. Traditional metal halide systems often use 1.5-2.5 W/sq ft. High-bay LED fixtures provide equivalent illumination at 30-50% lower wattage. Add task lighting where needed rather than over-lighting entire spaces.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How much HVAC capacity do I need per square foot?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Standard warehouses need approximately 1 ton of cooling per 500-700 square feet (0.0014-0.002 tons/sq ft). Climate-controlled facilities may require 1 ton per 300-400 sq ft. Factor in insulation quality, ceiling height, dock doors, and internal heat loads when sizing systems.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is load factor and why does it matter?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Load factor is the ratio of average demand to peak demand. Higher load factors (80%+) indicate steady, predictable usage and lower demand charges. Low load factors (below 70%) suggest opportunities to shift loads, stagger equipment start times, or implement peak shaving strategies to reduce costs.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How can I reduce peak demand charges?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Strategies include staggering equipment start times, implementing demand response programs, using battery storage for peak shaving, shifting heavy loads to off-peak hours, and installing soft starts on large motors. Monitor demand in real-time and set alerts when approaching peak thresholds.
                  </p>
                </details>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-[#0F4C81]/20 bg-[#0F4C81]/5">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Pro Tips for Energy Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Install sub-meters on major systems to identify specific energy consumers and track improvement initiatives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Conduct energy audits annually to identify new savings opportunities and verify previous improvements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Consider demand response programs to earn revenue by reducing load during grid stress events</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Track energy intensity (kWh/pallet or kWh/shipment) alongside total consumption for better benchmarking</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
