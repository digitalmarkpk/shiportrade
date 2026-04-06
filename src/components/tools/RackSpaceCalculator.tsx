"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AlertCircle, TrendingUp, Calculator, Info, Building, BoxSelect, Layers, ArrowUpRight, Warehouse } from 'lucide-react';

interface RackZone {
  name: string;
  type: 'selective' | 'drive-in' | 'push-back' | 'pallet-flow' | 'cantilever';
  rows: number;
  bays: number;
  levels: number;
  palletPositions: number;
  utilized: number;
  palletSize: string;
  loadCapacity: number;
}

interface RackMetrics {
  totalPositions: number;
  utilizedPositions: number;
  availablePositions: number;
  utilizationRate: number;
  totalSqFt: number;
  positionsPerSqFt: number;
  avgCapacityPerPosition: number;
  totalCapacity: number;
}

const defaultZones: RackZone[] = [
  { name: 'Zone A - Selective', type: 'selective', rows: 10, bays: 20, levels: 5, palletPositions: 1000, utilized: 850, palletSize: '48x40', loadCapacity: 2500 },
  { name: 'Zone B - Drive-In', type: 'drive-in', rows: 6, bays: 15, levels: 4, palletPositions: 360, utilized: 320, palletSize: '48x40', loadCapacity: 3000 },
  { name: 'Zone C - Push-Back', type: 'push-back', rows: 8, bays: 12, levels: 5, palletPositions: 480, utilized: 450, palletSize: '48x40', loadCapacity: 2800 },
  { name: 'Zone D - Pallet Flow', type: 'pallet-flow', rows: 4, bays: 20, levels: 6, palletPositions: 480, utilized: 400, palletSize: '48x40', loadCapacity: 2200 },
  { name: 'Zone E - Cantilever', type: 'cantilever', rows: 5, bays: 10, levels: 4, palletPositions: 200, utilized: 150, palletSize: 'Variable', loadCapacity: 4000 },
];

const COLORS = ['#0F4C81', '#2E8B57', '#FFA500', '#8884d8', '#FF6B6B'];

export default function RackSpaceCalculator() {
  const [zones, setZones] = useState<RackZone[]>(defaultZones);
  const [warehouseLength, setWarehouseLength] = useState<number>(300);
  const [warehouseWidth, setWarehouseWidth] = useState<number>(200);
  const [aisleWidth, setAisleWidth] = useState<number>(12);
  const [rackHeight, setRackHeight] = useState<number>(28);
  const [palletWidth, setPalletWidth] = useState<number>(48);
  const [palletDepth, setPalletDepth] = useState<number>(40);
  const [palletHeight, setPalletHeight] = useState<number>(54);
  const [rackType, setRackType] = useState<string>('selective');
  const [numLevels, setNumLevels] = useState<number>(5);

  const metrics: RackMetrics = useMemo(() => {
    const totalPositions = zones.reduce((sum, z) => sum + z.palletPositions, 0);
    const utilizedPositions = zones.reduce((sum, z) => sum + z.utilized, 0);
    const availablePositions = totalPositions - utilizedPositions;
    const utilizationRate = totalPositions > 0 ? (utilizedPositions / totalPositions) * 100 : 0;
    const totalSqFt = warehouseLength * warehouseWidth;
    const positionsPerSqFt = totalSqFt > 0 ? totalPositions / totalSqFt : 0;
    const avgCapacityPerPosition = zones.reduce((sum, z) => sum + z.loadCapacity, 0) / zones.length;
    const totalCapacity = zones.reduce((sum, z) => sum + (z.palletPositions * z.loadCapacity), 0);

    return {
      totalPositions,
      utilizedPositions,
      availablePositions,
      utilizationRate: Math.round(utilizationRate * 10) / 10,
      totalSqFt,
      positionsPerSqFt: Math.round(positionsPerSqFt * 100) / 100,
      avgCapacityPerPosition: Math.round(avgCapacityPerPosition),
      totalCapacity
    };
  }, [zones, warehouseLength, warehouseWidth]);

  const layoutCalculation = useMemo(() => {
    const rackDepth = palletDepth / 12;
    const frameDepth = rackType === 'drive-in' ? rackDepth * 4 : rackType === 'push-back' ? rackDepth * 5 : rackDepth;
    const uprightWidth = 4;
    const beamLength = palletWidth / 12 + 6;
    const aisleCount = Math.floor(warehouseWidth / (aisleWidth + beamLength * 2));
    const rowsPerAisle = 2;
    const positionsPerBay = numLevels * (rackType === 'drive-in' ? 4 : rackType === 'push-back' ? 5 : 1);
    const baysPerRow = Math.floor((warehouseLength - (aisleCount * aisleWidth)) / aisleCount / uprightWidth);
    const estimatedPositions = aisleCount * rowsPerAisle * baysPerRow * positionsPerBay;
    const spaceUtilization = ((estimatedPositions * (palletWidth * palletDepth) / 144) / metrics.totalSqFt) * 100;

    return {
      rackDepth: Math.round(rackDepth * 10) / 10,
      frameDepth: Math.round(frameDepth * 10) / 10,
      beamLength: Math.round(beamLength * 10) / 10,
      aisleCount,
      baysPerRow,
      estimatedPositions: Math.round(estimatedPositions),
      spaceUtilization: Math.round(spaceUtilization * 10) / 10
    };
  }, [warehouseLength, warehouseWidth, aisleWidth, palletWidth, palletDepth, rackType, numLevels, metrics.totalSqFt]);

  const utilizationByZone = useMemo(() => {
    return zones.map(zone => ({
      name: zone.name.split(' - ')[0],
      positions: zone.palletPositions,
      utilized: zone.utilized,
      available: zone.palletPositions - zone.utilized,
      utilization: Math.round((zone.utilized / zone.palletPositions) * 100 * 10) / 10,
      type: zone.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  }, [zones]);

  const capacityByType = useMemo(() => {
    const typeData: { [key: string]: { positions: number; capacity: number } } = {};
    zones.forEach(zone => {
      if (!typeData[zone.type]) {
        typeData[zone.type] = { positions: 0, capacity: 0 };
      }
      typeData[zone.type].positions += zone.palletPositions;
      typeData[zone.type].capacity += zone.palletPositions * zone.loadCapacity;
    });
    return Object.entries(typeData).map(([type, data], index) => ({
      name: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      positions: data.positions,
      capacity: Math.round(data.capacity / 1000),
      fill: COLORS[index % COLORS.length]
    }));
  }, [zones]);

  const trendData = [
    { month: 'Jan', utilization: 82, positions: 2400, capacity: 85 },
    { month: 'Feb', utilization: 85, positions: 2500, capacity: 87 },
    { month: 'Mar', utilization: 88, positions: 2580, capacity: 89 },
    { month: 'Apr', utilization: 84, positions: 2450, capacity: 86 },
    { month: 'May', utilization: 86, positions: 2520, capacity: 88 },
    { month: 'Jun', utilization: 90, positions: 2640, capacity: 91 },
  ];

  const recommendations = useMemo(() => {
    const recs: { type: 'success' | 'warning' | 'error' | 'info'; message: string; detail: string }[] = [];

    if (metrics.utilizationRate >= 90) {
      recs.push({ type: 'warning', message: 'High utilization detected', detail: 'Consider expanding capacity or optimizing slot utilization to prevent bottlenecks' });
    } else if (metrics.utilizationRate >= 75) {
      recs.push({ type: 'success', message: 'Optimal utilization range', detail: 'Current utilization provides good balance of efficiency and flexibility' });
    } else {
      recs.push({ type: 'info', message: 'Low utilization detected', detail: 'Review inventory allocation or consider consolidating zones to improve density' });
    }

    if (layoutCalculation.spaceUtilization < 30) {
      recs.push({ type: 'warning', message: 'Low floor space utilization', detail: 'Consider narrower aisles or high-density racking systems to maximize space' });
    }

    if (metrics.positionsPerSqFt < 0.03) {
      recs.push({ type: 'info', message: 'Opportunity for vertical optimization', detail: 'Higher rack levels or mezzanines could increase positions per square foot' });
    }

    return recs;
  }, [metrics, layoutCalculation]);

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
            <Layers className="h-6 w-6 text-[#0F4C81]" />
            Rack Space Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Calculate optimal rack layout, positions, and space utilization for warehouse operations
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="layout">Layout Planner</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Warehouse Dimensions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="warehouseLength">Length (ft)</Label>
                    <Input
                      id="warehouseLength"
                      type="number"
                      value={warehouseLength}
                      onChange={(e) => setWarehouseLength(Number(e.target.value))}
                      min={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouseWidth">Width (ft)</Label>
                    <Input
                      id="warehouseWidth"
                      type="number"
                      value={warehouseWidth}
                      onChange={(e) => setWarehouseWidth(Number(e.target.value))}
                      min={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aisleWidth">Aisle Width (ft)</Label>
                    <Input
                      id="aisleWidth"
                      type="number"
                      value={aisleWidth}
                      onChange={(e) => setAisleWidth(Number(e.target.value))}
                      min={8}
                      max={20}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rackHeight">Max Rack Height (ft)</Label>
                    <Input
                      id="rackHeight"
                      type="number"
                      value={rackHeight}
                      onChange={(e) => setRackHeight(Number(e.target.value))}
                      min={12}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pallet & Rack Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="palletWidth">Pallet Width (in)</Label>
                    <Input
                      id="palletWidth"
                      type="number"
                      value={palletWidth}
                      onChange={(e) => setPalletWidth(Number(e.target.value))}
                      min={36}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="palletDepth">Pallet Depth (in)</Label>
                    <Input
                      id="palletDepth"
                      type="number"
                      value={palletDepth}
                      onChange={(e) => setPalletDepth(Number(e.target.value))}
                      min={36}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="palletHeight">Pallet Height (in)</Label>
                    <Input
                      id="palletHeight"
                      type="number"
                      value={palletHeight}
                      onChange={(e) => setPalletHeight(Number(e.target.value))}
                      min={36}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rack Type</Label>
                    <Select value={rackType} onValueChange={setRackType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="selective">Selective</SelectItem>
                        <SelectItem value="drive-in">Drive-In</SelectItem>
                        <SelectItem value="push-back">Push-Back</SelectItem>
                        <SelectItem value="pallet-flow">Pallet Flow</SelectItem>
                        <SelectItem value="cantilever">Cantilever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numLevels">Number of Levels</Label>
                    <Input
                      id="numLevels"
                      type="number"
                      value={numLevels}
                      onChange={(e) => setNumLevels(Number(e.target.value))}
                      min={2}
                      max={8}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Warehouse className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Space</p>
                    <p className="text-xl font-bold">{metrics.totalSqFt.toLocaleString()} sq ft</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <BoxSelect className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pallet Positions</p>
                    <p className="text-xl font-bold">{metrics.totalPositions.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Utilization</p>
                    <p className="text-xl font-bold">{metrics.utilizationRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Positions/Sq Ft</p>
                    <p className="text-xl font-bold">{metrics.positionsPerSqFt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Capacity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Capacity by Rack Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={capacityByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="positions" fill="#0F4C81" name="Pallet Positions" />
                  <Bar yAxisId="right" dataKey="capacity" fill="#2E8B57" name="Capacity (k lbs)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          {/* Layout Calculations */}
          <Card>
            <CardHeader>
              <CardTitle>Layout Optimization Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Rack Depth</p>
                  <p className="text-2xl font-bold">{layoutCalculation.rackDepth} ft</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Aisles Needed</p>
                  <p className="text-2xl font-bold">{layoutCalculation.aisleCount}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Bays per Row</p>
                  <p className="text-2xl font-bold">{layoutCalculation.baysPerRow}</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Est. Positions</p>
                  <p className="text-2xl font-bold">{layoutCalculation.estimatedPositions.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Layout Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Frame Depth:</span>
                    <span className="ml-2 font-medium">{layoutCalculation.frameDepth} ft</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Beam Length:</span>
                    <span className="ml-2 font-medium">{layoutCalculation.beamLength} ft</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Space Utilization:</span>
                    <span className="ml-2 font-medium">{layoutCalculation.spaceUtilization}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rack Type Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Rack Type Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Rack Type</th>
                      <th className="text-center p-3">Selectivity</th>
                      <th className="text-center p-3">Density</th>
                      <th className="text-center p-3">FIFO/LIFO</th>
                      <th className="text-center p-3">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Selective</td>
                      <td className="p-3 text-center text-green-600">100%</td>
                      <td className="p-3 text-center text-yellow-600">Low</td>
                      <td className="p-3 text-center">Both</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">High SKU variety</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Drive-In</td>
                      <td className="p-3 text-center text-yellow-600">Limited</td>
                      <td className="p-3 text-center text-green-600">High</td>
                      <td className="p-3 text-center">LIFO</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">Bulk storage</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Push-Back</td>
                      <td className="p-3 text-center text-yellow-600">Good</td>
                      <td className="p-3 text-center text-green-600">High</td>
                      <td className="p-3 text-center">LIFO</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">Medium SKUs</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Pallet Flow</td>
                      <td className="p-3 text-center text-yellow-600">Good</td>
                      <td className="p-3 text-center text-green-600">High</td>
                      <td className="p-3 text-center">FIFO</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">Perishables</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Cantilever</td>
                      <td className="p-3 text-center text-green-600">100%</td>
                      <td className="p-3 text-center text-yellow-600">Medium</td>
                      <td className="p-3 text-center">Both</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">Long items</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-4">
          {/* Utilization Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Zone Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={utilizationByZone}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="utilization" fill="#0F4C81" name="Utilization %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Position Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={utilizationByZone}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="positions"
                      label={({ name, positions }) => `${name}: ${positions}`}
                    >
                      {utilizationByZone.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Zone Details */}
          <Card>
            <CardHeader>
              <CardTitle>Zone Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Zone</th>
                      <th className="text-center p-3">Type</th>
                      <th className="text-center p-3">Positions</th>
                      <th className="text-center p-3">Utilized</th>
                      <th className="text-center p-3">Available</th>
                      <th className="text-center p-3">Utilization</th>
                      <th className="text-center p-3">Capacity/Pos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((zone) => {
                      const utilization = Math.round((zone.utilized / zone.palletPositions) * 100 * 10) / 10;
                      return (
                        <tr key={zone.name} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{zone.name}</td>
                          <td className="p-3 text-center capitalize">{zone.type.replace('-', ' ')}</td>
                          <td className="p-3 text-center">{zone.palletPositions}</td>
                          <td className="p-3 text-center">{zone.utilized}</td>
                          <td className="p-3 text-center text-green-600">{zone.palletPositions - zone.utilized}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-1 rounded text-sm ${
                              utilization >= 90 ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                              utilization >= 75 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                              {utilization}%
                            </span>
                          </td>
                          <td className="p-3 text-center">{zone.loadCapacity.toLocaleString()} lbs</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
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
                  <p className="text-sm text-muted-foreground mt-1">{rec.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Utilization Trend (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="utilization" stroke="#0F4C81" strokeWidth={2} name="Utilization %" />
                  <Line type="monotone" dataKey="capacity" stroke="#2E8B57" strokeWidth={2} name="Capacity %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0F4C81]">{(metrics.totalCapacity / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-muted-foreground">Total Capacity (lbs)</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#2E8B57]">{metrics.availablePositions.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Available Positions</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{metrics.avgCapacityPerPosition.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Avg Capacity/Position (lbs)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is the optimal warehouse rack utilization rate?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    The optimal rack utilization rate is 80-85%. Below 75% indicates wasted space and inefficient operations. Above 90% creates operational bottlenecks, limits flexibility for seasonal peaks, and increases handling time. The target range balances efficiency with operational agility.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How do I calculate pallet positions per square foot?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Divide total pallet positions by total warehouse square footage. A well-optimized warehouse achieves 0.04-0.06 positions per square foot. Higher density racking systems (drive-in, push-back) can achieve 0.08+. Factor in aisle space, staging areas, and required clearances for accurate calculations.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">Which rack type is best for my operation?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Choose selective for high SKU variety and 100% accessibility. Drive-in works for bulk storage with few SKUs. Push-back balances density with reasonable selectivity. Pallet flow is ideal for FIFO requirements. Cantilever handles long or irregular items. Most warehouses use a combination.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How does aisle width affect rack capacity?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Narrower aisles (8-10 ft) increase storage density but require specialized forklifts. Standard aisles (12-14 ft) accommodate most equipment. Wide aisles (14+ ft) allow faster travel but reduce storage capacity. VNA (Very Narrow Aisle) systems can achieve 50% more positions than standard configurations.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is the minimum aisle width for different forklifts?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Standard counterbalance forklifts need 12-14 ft aisles. Reach trucks operate in 9-11 ft aisles. Turret trucks work in 6-8 ft aisles. VNA systems can function in 5-6 ft aisles. Always verify with your specific equipment manufacturer&apos;s recommendations.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How do I maximize vertical space utilization?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Assess building height and install racks to within 18-24 inches of fire suppression systems. Use appropriate beam heights for your products. Consider mezzanines for slow-moving items. High-bay warehouses (40+ ft clear height) can achieve 7+ levels of selective racking.
                  </p>
                </details>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-[#0F4C81]/20 bg-[#0F4C81]/5">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Pro Tips for Rack Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Place fast-moving SKUs in the most accessible locations (lower levels, near shipping)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Review slotting quarterly to maintain optimal pick paths and utilization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Consider seasonal inventory when planning permanent rack configurations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Document weight limits clearly and train staff on proper load distribution</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
