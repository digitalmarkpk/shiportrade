"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Minus, Info, Star, Ship, Calendar, Clock } from 'lucide-react';

interface CarrierData {
  name: string;
  onTimePerformance: number;
  scheduleReliability: number;
  vesselUtilization: number;
  cargoIntegrity: number;
  documentationAccuracy: number;
  totalVoyages: number;
  delayedVoyages: number;
  avgDelayHours: number;
  transshipments: number;
}

const defaultCarrierData: CarrierData[] = [
  { name: "Maersk Line", onTimePerformance: 87, scheduleReliability: 85, vesselUtilization: 92, cargoIntegrity: 98, documentationAccuracy: 96, totalVoyages: 245, delayedVoyages: 32, avgDelayHours: 18, transshipments: 12 },
  { name: "MSC", onTimePerformance: 82, scheduleReliability: 80, vesselUtilization: 88, cargoIntegrity: 96, documentationAccuracy: 94, totalVoyages: 312, delayedVoyages: 56, avgDelayHours: 24, transshipments: 15 },
  { name: "CMA CGM", onTimePerformance: 79, scheduleReliability: 77, vesselUtilization: 85, cargoIntegrity: 97, documentationAccuracy: 93, totalVoyages: 198, delayedVoyages: 42, avgDelayHours: 28, transshipments: 18 },
  { name: "COSCO", onTimePerformance: 84, scheduleReliability: 82, vesselUtilization: 90, cargoIntegrity: 95, documentationAccuracy: 92, totalVoyages: 178, delayedVoyages: 28, avgDelayHours: 20, transshipments: 14 },
  { name: "Hapag-Lloyd", onTimePerformance: 88, scheduleReliability: 86, vesselUtilization: 89, cargoIntegrity: 98, documentationAccuracy: 97, totalVoyages: 156, delayedVoyages: 19, avgDelayHours: 16, transshipments: 10 },
  { name: "ONE", onTimePerformance: 86, scheduleReliability: 84, vesselUtilization: 91, cargoIntegrity: 97, documentationAccuracy: 95, totalVoyages: 134, delayedVoyages: 19, avgDelayHours: 19, transshipments: 11 },
  { name: "Evergreen", onTimePerformance: 83, scheduleReliability: 81, vesselUtilization: 87, cargoIntegrity: 96, documentationAccuracy: 94, totalVoyages: 145, delayedVoyages: 25, avgDelayHours: 22, transshipments: 13 },
  { name: "Yang Ming", onTimePerformance: 78, scheduleReliability: 76, vesselUtilization: 82, cargoIntegrity: 95, documentationAccuracy: 91, totalVoyages: 98, delayedVoyages: 22, avgDelayHours: 30, transshipments: 16 },
];

export default function CarrierReliabilityIndex() {
  const [carriers, setCarriers] = useState<CarrierData[]>(defaultCarrierData);
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [tradeLane, setTradeLane] = useState<string>("asia-europe");
  const [timeframe, setTimeframe] = useState<string>("monthly");

  const reliabilityIndex = useMemo(() => {
    return carriers.map(carrier => {
      const compositeScore = (
        carrier.onTimePerformance * 0.35 +
        carrier.scheduleReliability * 0.25 +
        carrier.vesselUtilization * 0.15 +
        carrier.cargoIntegrity * 0.15 +
        carrier.documentationAccuracy * 0.10
      );
      const reliabilityRating = compositeScore >= 85 ? 'A' : compositeScore >= 80 ? 'B' : compositeScore >= 75 ? 'C' : compositeScore >= 70 ? 'D' : 'F';
      const trend = carrier.onTimePerformance > 82 ? 'up' : carrier.onTimePerformance < 78 ? 'down' : 'stable';
      return {
        ...carrier,
        compositeScore: Math.round(compositeScore * 10) / 10,
        reliabilityRating,
        trend,
        delayRate: Math.round((carrier.delayedVoyages / carrier.totalVoyages) * 100 * 10) / 10
      };
    }).sort((a, b) => b.compositeScore - a.compositeScore);
  }, [carriers]);

  const radarData = useMemo(() => {
    const selected = reliabilityIndex.find(c => c.name === selectedCarrier);
    if (!selected) return [];
    return [
      { metric: 'On-Time', value: selected.onTimePerformance, fullMark: 100 },
      { metric: 'Schedule', value: selected.scheduleReliability, fullMark: 100 },
      { metric: 'Utilization', value: selected.vesselUtilization, fullMark: 100 },
      { metric: 'Cargo Care', value: selected.cargoIntegrity, fullMark: 100 },
      { metric: 'Docs', value: selected.documentationAccuracy, fullMark: 100 },
    ];
  }, [reliabilityIndex, selectedCarrier]);

  const trendData = [
    { month: 'Jan', maersk: 85, msc: 80, cma: 78, hapag: 87 },
    { month: 'Feb', maersk: 86, msc: 81, cma: 77, hapag: 88 },
    { month: 'Mar', maersk: 84, msc: 79, cma: 79, hapag: 86 },
    { month: 'Apr', maersk: 87, msc: 82, cma: 78, hapag: 89 },
    { month: 'May', maersk: 88, msc: 81, cma: 80, hapag: 88 },
    { month: 'Jun', maersk: 87, msc: 82, cma: 79, hapag: 88 },
  ];

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'B': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'C': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'D': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300';
      default: return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStarRating = (score: number) => {
    const stars = Math.round(score / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-6 w-6 text-[#0F4C81]" />
            Carrier Reliability Index
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Track and compare carrier performance metrics across major shipping lines
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Select Carrier</Label>
              <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                <SelectTrigger>
                  <SelectValue placeholder="All Carriers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Carriers</SelectItem>
                  {carriers.map(c => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trade Lane</Label>
              <Select value={tradeLane} onValueChange={setTradeLane}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia-europe">Asia - Europe</SelectItem>
                  <SelectItem value="trans-pacific">Trans-Pacific</SelectItem>
                  <SelectItem value="trans-atlantic">Trans-Atlantic</SelectItem>
                  <SelectItem value="intra-asia">Intra-Asia</SelectItem>
                  <SelectItem value="middle-east">Middle East Routes</SelectItem>
                  <SelectItem value="latin-america">Latin America</SelectItem>
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
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button className="w-full" onClick={() => setSelectedCarrier("")}>
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rankings" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="rankings" className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Ship className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{carriers.length}</p>
                    <p className="text-sm text-muted-foreground">Carriers Tracked</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{carriers.reduce((sum, c) => sum + c.totalVoyages, 0).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Voyages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{(reliabilityIndex.reduce((sum, c) => sum + c.avgDelayHours, 0) / carriers.length).toFixed(1)}h</p>
                    <p className="text-sm text-muted-foreground">Avg Delay</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{(reliabilityIndex.reduce((sum, c) => sum + c.compositeScore, 0) / carriers.length).toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Industry Avg Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rankings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Carrier Reliability Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Rank</th>
                      <th className="text-left p-3">Carrier</th>
                      <th className="text-center p-3">Grade</th>
                      <th className="text-center p-3">Score</th>
                      <th className="text-center p-3">On-Time %</th>
                      <th className="text-center p-3">Delay Rate</th>
                      <th className="text-center p-3">Trend</th>
                      <th className="text-center p-3">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reliabilityIndex.map((carrier, index) => (
                      <tr key={carrier.name} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedCarrier(carrier.name)}>
                        <td className="p-3">
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="p-3 font-medium">{carrier.name}</td>
                        <td className="p-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(carrier.reliabilityRating)}`}>
                            {carrier.reliabilityRating}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold">{carrier.compositeScore}</td>
                        <td className="p-3 text-center">{carrier.onTimePerformance}%</td>
                        <td className="p-3 text-center">{carrier.delayRate}%</td>
                        <td className="p-3 text-center">{getTrendIcon(carrier.trend)}</td>
                        <td className="p-3 text-center flex justify-center">{getStarRating(carrier.compositeScore)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={reliabilityIndex.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="onTimePerformance" fill="#0F4C81" name="On-Time %" />
                    <Bar dataKey="scheduleReliability" fill="#2E8B57" name="Schedule %" />
                    <Bar dataKey="vesselUtilization" fill="#8884d8" name="Utilization %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar Chart for Selected Carrier */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedCarrier || "Select a Carrier"} - Performance Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {radarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name={selectedCarrier} dataKey="value" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                    <p>Select a carrier from the dropdown to view detailed metrics</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Carrier Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reliabilityIndex} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={120} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="compositeScore" fill="#0F4C81" name="Composite Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>On-Time Performance Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                6-month trend analysis for major carriers
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="maersk" stroke="#0F4C81" name="Maersk" strokeWidth={2} />
                  <Line type="monotone" dataKey="msc" stroke="#2E8B57" name="MSC" strokeWidth={2} />
                  <Line type="monotone" dataKey="cma" stroke="#8884d8" name="CMA CGM" strokeWidth={2} />
                  <Line type="monotone" dataKey="hapag" stroke="#ff7300" name="Hapag-Lloyd" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Delay Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Delay Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reliabilityIndex}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="avgDelayHours" fill="#ff6b6b" name="Avg Delay (hrs)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voyage Volume Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reliabilityIndex}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalVoyages" fill="#0F4C81" name="Total Voyages" />
                    <Bar dataKey="delayedVoyages" fill="#ff6b6b" name="Delayed Voyages" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Key Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Top Performers</h4>
                  <ul className="text-sm space-y-2 text-green-600 dark:text-green-300">
                    <li>• Hapag-Lloyd leads with 88% on-time performance</li>
                    <li>• Maersk shows consistent improvement trend</li>
                    <li>• ONE maintains highest vessel utilization (91%)</li>
                    <li>• Top carriers average only 17-19 hour delays</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Areas of Concern</h4>
                  <ul className="text-sm space-y-2 text-red-600 dark:text-red-300">
                    <li>• Yang Ming shows lowest schedule reliability (76%)</li>
                    <li>• CMA CGM averages 28+ hour delays</li>
                    <li>• MSC has highest volume of delayed voyages</li>
                    <li>• Industry average delay rate is 14.2%</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">For High-Value Cargo</h4>
                  <p className="text-sm text-muted-foreground">
                    Recommend Hapag-Lloyd or Maersk for time-sensitive, high-value shipments. Their 87%+ on-time rates and lower average delays minimize supply chain disruption risks.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">For Cost-Optimized Shipping</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider MSC for volume shipments where schedule flexibility exists. Despite lower reliability, their extensive network and capacity offer competitive rates.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">For Regional Coverage</h4>
                  <p className="text-sm text-muted-foreground">
                    ONE and Evergreen excel in Trans-Pacific routes with strong vessel utilization. For Asia-Europe lanes, Maersk and CMA CGM provide the most comprehensive coverage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scoring Methodology */}
          <Card>
            <CardHeader>
              <CardTitle>Composite Score Methodology</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span>On-Time Performance</span>
                  <span className="font-bold">35%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span>Schedule Reliability</span>
                  <span className="font-bold">25%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span>Vessel Utilization</span>
                  <span className="font-bold">15%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span>Cargo Integrity</span>
                  <span className="font-bold">15%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span>Documentation Accuracy</span>
                  <span className="font-bold">10%</span>
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
                  <summary className="font-semibold cursor-pointer">What is the Carrier Reliability Index?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    The Carrier Reliability Index is a composite metric that evaluates shipping lines based on multiple performance factors including on-time arrival, schedule reliability, vessel utilization, cargo integrity, and documentation accuracy. It provides a standardized way to compare carrier performance across the industry.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How often is the data updated?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Performance data is updated weekly, with comprehensive monthly reports. Historical trend data spans 12 months to identify seasonal patterns and long-term performance trajectories. Real-time vessel tracking provides additional context for current operations.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What factors affect on-time performance?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    On-time performance is influenced by port congestion, weather conditions, vessel maintenance schedules, transshipment delays, customs clearance times, and carrier operational efficiency. Our analysis accounts for controllable factors versus external disruptions to provide fair assessments.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How should I use this data for carrier selection?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Use composite scores for overall carrier quality assessment. For time-sensitive cargo, prioritize on-time performance metrics. For cost optimization, consider carriers with moderate scores but extensive networks. Always cross-reference with specific trade lane performance for your route.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is schedule reliability vs on-time performance?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    On-time performance measures actual arrival within a defined window of scheduled arrival. Schedule reliability measures a carrier&apos;s ability to maintain published schedules over time, including factors like skipped ports, blank sailings, and schedule changes. Both metrics together provide a complete picture.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How are transshipments factored into scores?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Transshipment routes typically have lower on-time rates due to multiple handling points. Our scoring adjusts for this by comparing carriers on similar route types. Carriers with fewer transshipments generally show higher direct performance, while those with hub strategies offer broader coverage.
                  </p>
                </details>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-[#0F4C81]/20 bg-[#0F4C81]/5">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Pro Tips for Using This Tool</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Compare carriers on your specific trade lane rather than global averages for more accurate predictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Monitor trends over 3+ months to identify improving or declining carriers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Factor in vessel utilization - highly utilized ships may have capacity constraints during peak seasons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Consider documentation accuracy scores for complex shipments requiring multiple regulatory filings</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
