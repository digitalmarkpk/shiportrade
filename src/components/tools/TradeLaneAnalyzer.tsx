"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Globe, Ship, Plane, Truck, DollarSign, Clock, Zap } from 'lucide-react';

interface TradeLane {
  name: string;
  origin: string;
  destination: string;
  mode: 'sea' | 'air' | 'rail' | 'road';
  volume: number;
  value: number;
  transitTime: number;
  cost: number;
  reliability: number;
  growth: number;
  marketShare: number;
}

interface LaneMetrics {
  totalVolume: number;
  totalValue: number;
  avgTransitTime: number;
  avgCost: number;
  avgReliability: number;
  topLane: string;
  fastestLane: string;
  cheapestLane: string;
}

const defaultLanes: TradeLane[] = [
  { name: 'Asia-Europe (Westbound)', origin: 'Shanghai', destination: 'Rotterdam', mode: 'sea', volume: 125000, value: 8500000000, transitTime: 32, cost: 2800, reliability: 85, growth: 4.2, marketShare: 28 },
  { name: 'Trans-Pacific (Eastbound)', origin: 'Shanghai', destination: 'Los Angeles', mode: 'sea', volume: 98000, value: 6200000000, transitTime: 14, cost: 3500, reliability: 82, growth: 3.8, marketShare: 22 },
  { name: 'Asia-Europe (Air)', origin: 'Hong Kong', destination: 'Frankfurt', mode: 'air', volume: 8500, value: 4200000000, transitTime: 2, cost: 45000, reliability: 92, growth: 5.5, marketShare: 8 },
  { name: 'China-Europe Rail', origin: 'Chengdu', destination: 'Warsaw', mode: 'rail', volume: 15000, value: 1800000000, transitTime: 16, cost: 8500, reliability: 88, growth: 12.5, marketShare: 6 },
  { name: 'NAFTA (Truck)', origin: 'Mexico City', destination: 'Chicago', mode: 'road', volume: 45000, value: 2800000000, transitTime: 3, cost: 1800, reliability: 90, growth: 2.1, marketShare: 12 },
  { name: 'Trans-Atlantic (Westbound)', origin: 'Rotterdam', destination: 'New York', mode: 'sea', volume: 35000, value: 2100000000, transitTime: 12, cost: 2200, reliability: 88, growth: 1.8, marketShare: 10 },
  { name: 'Intra-Asia', origin: 'Shanghai', destination: 'Singapore', mode: 'sea', volume: 68000, value: 3200000000, transitTime: 6, cost: 450, reliability: 91, growth: 6.2, marketShare: 14 },
];

const COLORS = ['#0F4C81', '#2E8B57', '#FFA500', '#FF6B6B', '#8884d8', '#22c55e', '#ec4899'];

export default function TradeLaneAnalyzer() {
  const [lanes, setLanes] = useState<TradeLane[]>(defaultLanes);
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [originRegion, setOriginRegion] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('monthly');

  const metrics: LaneMetrics = useMemo(() => {
    const filteredLanes = selectedMode === 'all' ? lanes : lanes.filter(l => l.mode === selectedMode);
    const totalVolume = filteredLanes.reduce((sum, l) => sum + l.volume, 0);
    const totalValue = filteredLanes.reduce((sum, l) => sum + l.value, 0);
    const avgTransitTime = filteredLanes.reduce((sum, l) => sum + l.transitTime, 0) / filteredLanes.length;
    const avgCost = filteredLanes.reduce((sum, l) => sum + l.cost, 0) / filteredLanes.length;
    const avgReliability = filteredLanes.reduce((sum, l) => sum + l.reliability, 0) / filteredLanes.length;
    const topLane = filteredLanes.reduce((max, l) => l.value > max.value ? l : max, filteredLanes[0]);
    const fastestLane = filteredLanes.reduce((min, l) => l.transitTime < min.transitTime ? l : min, filteredLanes[0]);
    const cheapestLane = filteredLanes.reduce((min, l) => l.cost < min.cost ? l : min, filteredLanes[0]);

    return {
      totalVolume,
      totalValue,
      avgTransitTime: Math.round(avgTransitTime * 10) / 10,
      avgCost: Math.round(avgCost),
      avgReliability: Math.round(avgReliability * 10) / 10,
      topLane: topLane?.name || 'N/A',
      fastestLane: fastestLane?.name || 'N/A',
      cheapestLane: cheapestLane?.name || 'N/A'
    };
  }, [lanes, selectedMode]);

  const volumeByMode = useMemo(() => {
    const modeData: { [key: string]: { volume: number; value: number; count: number } } = {};
    lanes.forEach(lane => {
      if (!modeData[lane.mode]) {
        modeData[lane.mode] = { volume: 0, value: 0, count: 0 };
      }
      modeData[lane.mode].volume += lane.volume;
      modeData[lane.mode].value += lane.value;
      modeData[lane.mode].count += 1;
    });
    return Object.entries(modeData).map(([mode, data]) => ({
      mode: mode.charAt(0).toUpperCase() + mode.slice(1),
      volume: data.volume,
      value: Math.round(data.value / 1000000000),
      lanes: data.count
    }));
  }, [lanes]);

  const performanceData = useMemo(() => {
    return lanes.map(lane => ({
      name: lane.name.split('(')[0].trim(),
      transitTime: lane.transitTime,
      cost: lane.cost / 100,
      reliability: lane.reliability,
      growth: lane.growth
    }));
  }, [lanes]);

  const trendData = [
    { quarter: 'Q1 2024', sea: 420000, air: 28000, rail: 12000, road: 180000 },
    { quarter: 'Q2 2024', sea: 445000, air: 31000, rail: 15000, road: 195000 },
    { quarter: 'Q3 2024', sea: 460000, air: 29500, rail: 18000, road: 205000 },
    { quarter: 'Q4 2024', sea: 485000, air: 32000, rail: 22000, road: 210000 },
  ];

  const radarMetrics = useMemo(() => {
    const selected = lanes.find(l => l.name.includes('Asia-Europe'));
    if (!selected) return [];
    return [
      { metric: 'Volume', value: (selected.volume / 150000) * 100, fullMark: 100 },
      { metric: 'Value', value: (selected.value / 10000000000) * 100, fullMark: 100 },
      { metric: 'Speed', value: 100 - (selected.transitTime / 40) * 100, fullMark: 100 },
      { metric: 'Cost', value: 100 - (selected.cost / 50000) * 100, fullMark: 100 },
      { metric: 'Reliability', value: selected.reliability, fullMark: 100 },
      { metric: 'Growth', value: selected.growth * 5, fullMark: 100 },
    ];
  }, [lanes]);

  const recommendations = useMemo(() => {
    const recs: { type: 'success' | 'warning' | 'error' | 'info'; message: string; detail: string }[] = [];

    const railLanes = lanes.filter(l => l.mode === 'rail');
    if (railLanes.some(l => l.growth > 10)) {
      recs.push({ type: 'success', message: 'Rail freight showing strong growth', detail: 'Consider expanding rail capacity on high-growth corridors as alternative to air and sea' });
    }

    const unreliableLanes = lanes.filter(l => l.reliability < 85);
    if (unreliableLanes.length > 0) {
      recs.push({ type: 'warning', message: 'Reliability concerns on some lanes', detail: `${unreliableLanes.map(l => l.name).join(', ')} show below-target reliability. Review carrier performance.` });
    }

    const expensiveLanes = lanes.filter(l => l.cost > metrics.avgCost * 1.5);
    if (expensiveLanes.length > 0) {
      recs.push({ type: 'info', message: 'Cost optimization opportunities', detail: 'Some lanes have significantly higher costs. Consider modal shift or carrier renegotiation.' });
    }

    const congestedLanes = lanes.filter(l => l.transitTime > 30 && l.mode === 'sea');
    if (congestedLanes.length > 0) {
      recs.push({ type: 'warning', message: 'Long transit times detected', detail: 'Evaluate intermodal alternatives for time-sensitive cargo on long-haul sea routes.' });
    }

    return recs;
  }, [lanes, metrics]);

  const getRecommendationStyle = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default: return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'sea': return <Ship className="h-4 w-4" />;
      case 'air': return <Plane className="h-4 w-4" />;
      case 'rail': return <Truck className="h-4 w-4" />;
      case 'road': return <Truck className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-[#0F4C81]" />
            Trade Lane Analyzer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Analyze global trade lane performance, compare modal options, and optimize supply chain routes
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Transport Mode</Label>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="sea">Ocean Freight</SelectItem>
                  <SelectItem value="air">Air Freight</SelectItem>
                  <SelectItem value="rail">Rail Freight</SelectItem>
                  <SelectItem value="road">Road Freight</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Origin Region</Label>
              <Select value={originRegion} onValueChange={setOriginRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="asia">Asia Pacific</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="americas">Americas</SelectItem>
                  <SelectItem value="mena">Middle East & Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
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
                  <Ship className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Volume</p>
                    <p className="text-xl font-bold">{(metrics.totalVolume / 1000).toFixed(0)}K TEU</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-xl font-bold">${(metrics.totalValue / 1000000000).toFixed(1)}B</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Transit</p>
                    <p className="text-xl font-bold">{metrics.avgTransitTime} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Reliability</p>
                    <p className="text-xl font-bold">{metrics.avgReliability}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Volume by Mode and Lane Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Volume by Transport Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={volumeByMode}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="volume"
                      label={({ mode, volume }) => `${mode}: ${(volume / 1000).toFixed(0)}K`}
                    >
                      {volumeByMode.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lane Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Asia-Europe Lane" dataKey="value" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Lane Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Trade Lane Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Lane</th>
                      <th className="text-center p-3">Mode</th>
                      <th className="text-right p-3">Volume</th>
                      <th className="text-right p-3">Value</th>
                      <th className="text-right p-3">Transit</th>
                      <th className="text-right p-3">Cost/TEU</th>
                      <th className="text-right p-3">Reliability</th>
                      <th className="text-right p-3">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lanes.map((lane) => (
                      <tr key={lane.name} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{lane.name}</p>
                            <p className="text-xs text-muted-foreground">{lane.origin} → {lane.destination}</p>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="flex items-center justify-center gap-1">
                            {getModeIcon(lane.mode)}
                            <span className="capitalize text-sm">{lane.mode}</span>
                          </span>
                        </td>
                        <td className="p-3 text-right">{(lane.volume / 1000).toFixed(1)}K</td>
                        <td className="p-3 text-right">${(lane.value / 1000000000).toFixed(1)}B</td>
                        <td className="p-3 text-right">{lane.transitTime}d</td>
                        <td className="p-3 text-right">${lane.cost.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-1 rounded text-sm ${
                            lane.reliability >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            lane.reliability >= 85 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {lane.reliability}%
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={lane.growth > 5 ? 'text-green-600' : lane.growth > 2 ? 'text-blue-600' : 'text-gray-600'}>
                            +{lane.growth}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {/* Mode Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Transport Mode Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={volumeByMode}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mode" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="volume" fill="#0F4C81" name="Volume (TEU)" />
                  <Bar yAxisId="right" dataKey="value" fill="#2E8B57" name="Value ($B)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Lane Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={performanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reliability" fill="#0F4C81" name="Reliability %" />
                  <Bar dataKey="growth" fill="#2E8B57" name="Growth %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost vs Transit Time */}
          <Card>
            <CardHeader>
              <CardTitle>Cost vs Transit Time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="transitTime" fill="#FFA500" name="Transit Days" />
                  <Bar yAxisId="right" dataKey="cost" fill="#0F4C81" name="Cost ($00s)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Quarterly Volume Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Volume by Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="sea" stackId="1" stroke="#0F4C81" fill="#0F4C81" name="Sea" />
                  <Area type="monotone" dataKey="air" stackId="1" stroke="#2E8B57" fill="#2E8B57" name="Air" />
                  <Area type="monotone" dataKey="rail" stackId="1" stroke="#FFA500" fill="#FFA500" name="Rail" />
                  <Area type="monotone" dataKey="road" stackId="1" stroke="#8884d8" fill="#8884d8" name="Road" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Growth Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Fastest Growing Lane</p>
                  <p className="text-lg font-bold mt-2">China-Europe Rail</p>
                  <p className="text-green-600 font-medium">+12.5% YoY</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Highest Value Lane</p>
                  <p className="text-lg font-bold mt-2">Asia-Europe (West)</p>
                  <p className="text-blue-600 font-medium">$8.5B value</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Most Reliable Lane</p>
                  <p className="text-lg font-bold mt-2">Asia-Europe (Air)</p>
                  <p className="text-purple-600 font-medium">92% reliability</p>
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
                Lane Optimization Recommendations
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

          {/* Modal Shift Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Modal Shift Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Air to Rail
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Potential savings: 60-70% on eligible cargo</li>
                    <li>• Transit impact: +10-14 days</li>
                    <li>• Best for: Non-perishables, high-value goods</li>
                    <li>• CO2 reduction: ~80%</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    Sea to Rail
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Transit improvement: 14-16 days faster</li>
                    <li>• Cost impact: +2-3x sea rates</li>
                    <li>• Best for: Time-sensitive cargo on Asia-Europe</li>
                    <li>• Reliability: 88% vs 85% sea</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    Road to Rail
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Cost savings: 20-30% on long haul</li>
                    <li>• CO2 reduction: 70-80%</li>
                    <li>• Best for: Continental shipments over 500km</li>
                    <li>• Consider: Intermodal terminals access</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    Multi-modal Integration
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Combine sea + rail for optimal cost/transit</li>
                    <li>• Use air for urgent, sea for bulk</li>
                    <li>• Implement dynamic routing based on conditions</li>
                    <li>• Build carrier relationships across modes</li>
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
                  <summary className="font-semibold cursor-pointer">What are the major global trade lanes?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    The major trade lanes include Asia-Europe (via Suez), Trans-Pacific (Asia to North America), Trans-Atlantic, Intra-Asia, and emerging routes like China-Europe Rail. Each serves different cargo types and has distinct transit times, costs, and reliability characteristics that influence routing decisions.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How do I choose between air, sea, and rail?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Consider urgency, value-density, and budget. Air is fastest (1-3 days) but most expensive—ideal for high-value, time-sensitive cargo. Sea is cheapest but slowest (14-40 days)—best for bulk and low-value goods. Rail offers a middle ground (14-18 days Asia-Europe) with growing reliability and sustainability benefits.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What factors affect lane reliability?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Key factors include port congestion, weather patterns, carrier schedule adherence, canal/transit bottlenecks (Suez, Panama), labor disruptions, vessel capacity utilization, and transshipment complexity. Monitoring these factors helps anticipate delays and make proactive routing adjustments.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How is lane performance measured?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Key metrics include transit time reliability (arrival within window), schedule adherence, cargo integrity, cost per TEU/kg, value-to-volume ratio, on-time delivery rate, and year-over-year growth. Composite indices weight these factors based on business priorities to rank lanes holistically.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is modal shift and when should I consider it?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Modal shift means changing transport mode for a route. Consider it when: costs exceed budget on current mode, transit requirements change, new infrastructure becomes available (like rail services), or sustainability goals require lower emissions. Evaluate total landed cost, not just freight rates.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How do geopolitical events affect trade lanes?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Trade wars, sanctions, conflicts, and policy changes can disrupt lanes suddenly. Recent examples include Suez Canal blockages, Red Sea tensions, and tariff changes. Maintain alternative routing options, diversify carrier relationships, and monitor geopolitical developments to ensure supply chain resilience.
                  </p>
                </details>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-[#0F4C81]/20 bg-[#0F4C81]/5">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Pro Tips for Trade Lane Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Diversify lanes and modes to reduce concentration risk and maintain alternatives during disruptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Monitor leading indicators like port congestion, carrier capacity, and geopolitical tensions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Consider total landed cost (including inventory carrying costs) when comparing modes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Build relationships with multiple carriers on each lane to ensure capacity during peak seasons</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
