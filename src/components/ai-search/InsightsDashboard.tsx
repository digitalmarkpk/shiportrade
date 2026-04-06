'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, Activity,
  Ship, Globe, DollarSign, Package, Calendar, Clock, RefreshCw,
  ArrowUpRight, ArrowDownRight, Layers, Filter, Download, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dashboard metrics
const metrics = {
  overview: {
    totalShipments: { value: 2847293, change: 12.5, trend: 'up' },
    activeVessels: { value: 52847, change: 3.2, trend: 'up' },
    avgTransitTime: { value: 28.5, unit: 'days', change: -2.1, trend: 'down' },
    freightIndex: { value: 2847, change: 8.7, trend: 'up' },
  },
  regionalPerformance: [
    { region: 'Asia-Pacific', volume: '12.5M TEU', growth: 15.2, efficiency: 87, trend: 'up' },
    { region: 'Europe', volume: '8.2M TEU', growth: 5.8, efficiency: 82, trend: 'up' },
    { region: 'North America', volume: '9.1M TEU', growth: 8.4, efficiency: 79, trend: 'up' },
    { region: 'Middle East', volume: '3.8M TEU', growth: -2.1, efficiency: 85, trend: 'down' },
    { region: 'South America', volume: '2.4M TEU', growth: 12.1, efficiency: 72, trend: 'up' },
  ],
  topRoutes: [
    { route: 'Shanghai → Los Angeles', volume: '2.5M TEU', rate: '$4,200', trend: 'up', change: 8.5 },
    { route: 'Shanghai → Rotterdam', volume: '1.8M TEU', rate: '$2,850', trend: 'down', change: -3.2 },
    { route: 'Singapore → Los Angeles', volume: '1.2M TEU', rate: '$3,950', trend: 'up', change: 12.1 },
    { route: 'Rotterdam → New York', volume: '0.9M TEU', rate: '$3,200', trend: 'up', change: 5.4 },
    { route: 'Dubai → Hamburg', volume: '0.7M TEU', rate: '$2,100', trend: 'up', change: 7.8 },
  ],
  commodityBreakdown: [
    { commodity: 'Electronics', percentage: 28, value: '$285B', color: 'bg-blue-500' },
    { commodity: 'Automotive', percentage: 22, value: '$224B', color: 'bg-green-500' },
    { commodity: 'Consumer Goods', percentage: 18, value: '$183B', color: 'bg-amber-500' },
    { commodity: 'Machinery', percentage: 15, value: '$153B', color: 'bg-purple-500' },
    { commodity: 'Chemicals', percentage: 10, value: '$102B', color: 'bg-red-500' },
    { commodity: 'Other', percentage: 7, value: '$71B', color: 'bg-slate-500' },
  ],
  recentActivity: [
    { time: '2 min ago', event: 'Vessel "Ever Given" departed Shanghai', type: 'departure' },
    { time: '5 min ago', event: 'LA Port congestion dropped to 62%', type: 'positive' },
    { time: '12 min ago', event: 'New tariff announced for EU imports', type: 'alert' },
    { time: '18 min ago', event: 'Container availability index updated', type: 'info' },
    { time: '25 min ago', event: 'Red Sea route advisory issued', type: 'warning' },
  ],
};

export default function InsightsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    // Animate numbers on load
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current++;
      setAnimatedCount(current / steps);
      if (current >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const formatNumber = (num: number) => {
    return Math.floor(num * animatedCount).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Intelligence Dashboard</h2>
          <p className="text-slate-500">Real-time global supply chain metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(metrics.overview).map(([key, metric], idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
                      {metric.unit && <span className="text-sm font-normal ml-1">{metric.unit}</span>}
                    </p>
                  </div>
                  <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'} className={metric.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}>
                    {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Regional Performance */}
        <Card className="border-0 shadow-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#0F4C81]" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.regionalPerformance.map((region, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${region.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        <Globe className={`h-4 w-4 ${region.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{region.region}</h4>
                        <p className="text-sm text-slate-500">{region.volume}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={region.trend === 'up' ? 'default' : 'destructive'} className={region.trend === 'up' ? 'bg-green-500' : ''}>
                        {region.growth > 0 ? '+' : ''}{region.growth}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-20">Efficiency:</span>
                    <Progress value={region.efficiency} className="flex-1 h-2" />
                    <span className="text-xs font-medium">{region.efficiency}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Commodity Breakdown */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              Commodity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.commodityBreakdown.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.commodity}</span>
                      <span className="text-sm text-slate-500">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-1.5 mt-1" />
                  </div>
                  <span className="text-xs text-slate-500">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Routes */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-[#2E8B57]" />
              Top Trade Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topRoutes.map((route, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-400">#{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{route.route}</p>
                      <p className="text-xs text-slate-500">{route.volume}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#0F4C81]">{route.rate}</p>
                    <p className={`text-xs ${route.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {route.trend === 'up' ? '↑' : '↓'} {Math.abs(route.change)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.recentActivity.map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-2"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'alert' ? 'bg-red-100 dark:bg-red-900/30' :
                    activity.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                    activity.type === 'positive' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <Activity className={`h-4 w-4 ${
                      activity.type === 'alert' ? 'text-red-600' :
                      activity.type === 'warning' ? 'text-amber-600' :
                      activity.type === 'positive' ? 'text-green-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.event}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
