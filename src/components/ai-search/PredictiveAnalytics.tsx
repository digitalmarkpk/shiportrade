'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, Zap, AlertTriangle, Target,
  BarChart3, LineChart, PieChart, Calendar, RefreshCw, ChevronRight,
  ArrowUpRight, ArrowDownRight, Info, Clock, DollarSign, Ship, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock prediction data
const predictions = {
  freightRates: [
    { route: 'Asia-Europe', current: 2850, predicted: 3120, change: 9.5, confidence: 85, trend: 'up' },
    { route: 'Trans-Pacific', current: 4200, predicted: 3890, change: -7.4, confidence: 78, trend: 'down' },
    { route: 'Asia-Middle East', current: 1650, predicted: 1780, change: 7.9, confidence: 82, trend: 'up' },
    { route: 'Europe-US East', current: 3200, predicted: 3450, change: 7.8, confidence: 75, trend: 'up' },
    { route: 'Intra-Asia', current: 890, predicted: 920, change: 3.4, confidence: 88, trend: 'up' },
  ],
  portCongestion: [
    { port: 'Shanghai', current: 45, predicted: 38, change: -15.6, vessels: 28 },
    { port: 'Los Angeles', current: 62, predicted: 55, change: -11.3, vessels: 18 },
    { port: 'Rotterdam', current: 38, predicted: 42, change: 10.5, vessels: 12 },
    { port: 'Singapore', current: 52, predicted: 48, change: -7.7, vessels: 22 },
    { port: 'Dubai', current: 35, predicted: 40, change: 14.3, vessels: 8 },
  ],
  demandForecast: [
    { commodity: 'Electronics', demand: 'High', growth: 12.5, region: 'Asia-Pacific' },
    { commodity: 'Automotive', demand: 'Medium', growth: 5.2, region: 'Europe' },
    { commodity: 'Consumer Goods', demand: 'High', growth: 8.7, region: 'North America' },
    { commodity: 'Raw Materials', demand: 'Medium', growth: 3.1, region: 'Global' },
    { commodity: 'Machinery', demand: 'Low', growth: -2.4, region: 'Europe' },
  ],
  riskFactors: [
    { factor: 'Red Sea Disruption', severity: 'High', impact: 'Route diversions adding 10-14 days', probability: 75 },
    { factor: 'Port Strikes (US)', severity: 'Medium', impact: 'Potential delays at West Coast ports', probability: 45 },
    { factor: 'Fuel Price Volatility', severity: 'Medium', impact: 'Bunker costs may rise 15%', probability: 60 },
    { factor: 'Currency Fluctuation', severity: 'Low', impact: 'USD strength affecting rates', probability: 55 },
  ],
};

export default function PredictiveAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [selectedMarket, setSelectedMarket] = useState('freight');
  const [isLoading, setIsLoading] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    // Animate values on mount
    const timer = setTimeout(() => {
      const values: Record<string, number> = {};
      predictions.freightRates.forEach((p, i) => {
        values[`freight-${i}`] = p.predicted;
      });
      setAnimatedValues(values);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const refreshPredictions = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-6 w-6" />
                Predictive Analytics Engine
              </CardTitle>
              <CardDescription className="text-white/80 mt-1">
                AI-powered forecasts for freight rates, port congestion, and market trends
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                  <SelectItem value="180days">180 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={refreshPredictions} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="freight" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="freight">Freight Rates</TabsTrigger>
          <TabsTrigger value="ports">Port Congestion</TabsTrigger>
          <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
          <TabsTrigger value="risks">Risk Factors</TabsTrigger>
        </TabsList>

        {/* Freight Rates Tab */}
        <TabsContent value="freight" className="space-y-4">
          <div className="grid gap-4">
            {predictions.freightRates.map((route, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${route.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                          <Ship className={`h-6 w-6 ${route.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{route.route}</h4>
                          <p className="text-sm text-slate-500">
                            Current: ${route.current.toLocaleString()}/FEU
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">${route.predicted.toLocaleString()}</span>
                          <Badge variant={route.trend === 'up' ? 'default' : 'secondary'} className={route.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}>
                            {route.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                            {route.change > 0 ? '+' : ''}{route.change}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">Confidence:</span>
                          <Progress value={route.confidence} className="w-20 h-2" />
                          <span className="text-xs font-medium">{route.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Port Congestion Tab */}
        <TabsContent value="ports" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {predictions.portCongestion.map((port, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <Globe className="h-4 w-4 text-[#0F4C81]" />
                          {port.port}
                        </h4>
                        <p className="text-sm text-slate-500">{port.vessels} vessels in queue</p>
                      </div>
                      <Badge variant={port.change < 0 ? 'default' : 'destructive'}>
                        {port.change < 0 ? 'Improving' : 'Worsening'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Current Dwell</p>
                        <p className="text-xl font-bold">{port.current}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Predicted</p>
                        <p className="text-xl font-bold">{port.predicted}h</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Congestion Level</span>
                        <span>{port.current}%</span>
                      </div>
                      <Progress value={port.current} className={`h-2 ${port.current > 50 ? 'bg-red-100' : 'bg-green-100'}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Demand Forecast Tab */}
        <TabsContent value="demand" className="space-y-4">
          <div className="grid gap-4">
            {predictions.demandForecast.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          item.demand === 'High' ? 'bg-green-100 dark:bg-green-900/30' :
                          item.demand === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30' :
                          'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          <Activity className={`h-5 w-5 ${
                            item.demand === 'High' ? 'text-green-600' :
                            item.demand === 'Medium' ? 'text-amber-600' :
                            'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.commodity}</h4>
                          <p className="text-sm text-slate-500">{item.region}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={
                          item.demand === 'High' ? 'default' :
                          item.demand === 'Medium' ? 'secondary' : 'destructive'
                        }>
                          {item.demand} Demand
                        </Badge>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.growth > 0 ? '+' : ''}{item.growth}%
                          </span>
                          <p className="text-xs text-slate-500">Projected Growth</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Risk Factors Tab */}
        <TabsContent value="risks" className="space-y-4">
          <div className="grid gap-4">
            {predictions.riskFactors.map((risk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`border-0 shadow-lg ${
                  risk.severity === 'High' ? 'border-l-4 border-l-red-500' :
                  risk.severity === 'Medium' ? 'border-l-4 border-l-amber-500' :
                  'border-l-4 border-l-green-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          risk.severity === 'High' ? 'bg-red-100 dark:bg-red-900/30' :
                          risk.severity === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30' :
                          'bg-green-100 dark:bg-green-900/30'
                        }`}>
                          <AlertTriangle className={`h-5 w-5 ${
                            risk.severity === 'High' ? 'text-red-600' :
                            risk.severity === 'Medium' ? 'text-amber-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{risk.factor}</h4>
                          <p className="text-sm text-slate-500 mt-1">{risk.impact}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          risk.severity === 'High' ? 'destructive' :
                          risk.severity === 'Medium' ? 'default' : 'secondary'
                        }>
                          {risk.severity} Severity
                        </Badge>
                        <div className="mt-2">
                          <span className="text-lg font-bold">{risk.probability}%</span>
                          <p className="text-xs text-slate-500">Probability</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Recommendations */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Route Optimization',
                description: 'Consider alternative routing via Cape of Good Hope for Asia-Europe shipments to avoid Red Sea disruptions.',
                priority: 'High',
              },
              {
                title: 'Capacity Booking',
                description: 'Book Trans-Pacific capacity now as rates are predicted to decrease in next 30 days.',
                priority: 'Medium',
              },
              {
                title: 'Inventory Planning',
                description: 'Increase safety stock for electronics components due to high demand forecast in APAC region.',
                priority: 'High',
              },
            ].map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-sm">{rec.title}</h5>
                  <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{rec.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
