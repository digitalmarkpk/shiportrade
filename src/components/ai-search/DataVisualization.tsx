'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity,
  LineChart as LineChartIcon, DollarSign, Globe, Ship, Container,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Colors for charts
const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#6366F1'];

interface DataVisualizationProps {
  data: any;
  query: string;
  companies?: any[];
}

// Generate charts based on companies data and query context
function generateQueryBasedData(query: string, companies?: any[]) {
  const lowerQuery = query.toLowerCase();
  
  // Use actual company data if available
  const marketShareData = companies?.slice(0, 10).map((c: any, i: number) => ({
    name: c.name?.substring(0, 12) || `Company ${i + 1}`,
    fullName: c.name,
    value: c.marketShare || Math.max(35 - i * 3.2, 2),
    revenue: c.revenue || 'N/A',
    fill: COLORS[i % COLORS.length],
  })) || [];

  // Revenue/growth trend based on query
  const trendData = [
    { period: '2020', value: 100, growth: -5 },
    { period: '2021', value: 115, growth: 15 },
    { period: '2022', value: 135, growth: 17 },
    { period: '2023', value: 142, growth: 5 },
    { period: '2024', value: 158, growth: 11 },
  ];

  // Regional data based on query type
  let regionData: any[] = [];
  
  if (lowerQuery.includes('meat') || lowerQuery.includes('beef') || lowerQuery.includes('poultry')) {
    regionData = [
      { region: 'Brazil', export: 28.5, growth: 12.3 },
      { region: 'USA', export: 18.2, growth: 8.5 },
      { region: 'Australia', export: 14.8, growth: 15.2 },
      { region: 'India', export: 12.1, growth: 22.5 },
      { region: 'Argentina', export: 9.5, growth: 6.8 },
      { region: 'EU', export: 8.2, growth: 3.2 },
    ];
  } else if (lowerQuery.includes('shipping') || lowerQuery.includes('container')) {
    regionData = [
      { region: 'Asia-Pacific', export: 45.2, growth: 8.5 },
      { region: 'Europe', export: 28.1, growth: 3.2 },
      { region: 'North America', export: 22.5, growth: 5.1 },
      { region: 'Middle East', export: 12.3, growth: 12.3 },
      { region: 'South America', export: 8.5, growth: 6.8 },
    ];
  } else {
    regionData = [
      { region: 'Asia-Pacific', export: 38.5, growth: 9.2 },
      { region: 'Europe', export: 25.1, growth: 4.5 },
      { region: 'North America', export: 21.8, growth: 6.1 },
      { region: 'Middle East', export: 15.2, growth: 14.3 },
      { region: 'South America', export: 10.5, growth: 7.8 },
      { region: 'Africa', export: 6.2, growth: 11.5 },
    ];
  }

  return { marketShareData, trendData, regionData };
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            {entry.name === 'growth' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DataVisualization({ data, query, companies }: DataVisualizationProps) {
  const [activeChart, setActiveChart] = useState('market');
  const chartData = useMemo(() => generateQueryBasedData(query, companies), [query, companies]);

  const hasCompanyData = chartData.marketShareData.length > 0;

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2">
        {hasCompanyData && (
          <Button
            variant={activeChart === 'market' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveChart('market')}
            className={activeChart === 'market' ? 'bg-[#0F4C81]' : ''}
          >
            <PieChartIcon className="h-4 w-4 mr-1" />
            Market Share
          </Button>
        )}
        <Button
          variant={activeChart === 'trend' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveChart('trend')}
          className={activeChart === 'trend' ? 'bg-[#0F4C81]' : ''}
        >
          <LineChartIcon className="h-4 w-4 mr-1" />
          Growth Trends
        </Button>
        <Button
          variant={activeChart === 'region' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveChart('region')}
          className={activeChart === 'region' ? 'bg-[#0F4C81]' : ''}
        >
          <Globe className="h-4 w-4 mr-1" />
          By Region
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Share */}
        {activeChart === 'market' && hasCompanyData && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-[#0F4C81]" />
                    Market Distribution
                  </CardTitle>
                  <CardDescription>Market share breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={chartData.marketShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {chartData.marketShareData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                    Top Players
                  </CardTitle>
                  <CardDescription>Market position comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData.marketShareData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Market Share %" radius={[0, 4, 4, 0]}>
                        {chartData.marketShareData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* Growth Trends */}
        {activeChart === 'trend' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                  Industry Growth Trend
                </CardTitle>
                <CardDescription>Market performance over recent years</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.trendData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0F4C81"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      name="Index Value"
                    />
                    <Line
                      type="monotone"
                      dataKey="growth"
                      stroke="#2E8B57"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Growth %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Regional Distribution */}
        {activeChart === 'region' && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#0F4C81]" />
                    Regional Distribution
                  </CardTitle>
                  <CardDescription>Export value by region (Billion USD)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.regionData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="export" fill="#0F4C81" name="Export Value" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="growth" fill="#2E8B57" name="Growth %" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Market Size', value: '$285B', change: '+8.2%', positive: true },
          { label: 'YoY Growth', value: '11.5%', change: '+2.3%', positive: true },
          { label: 'Top 10 Share', value: '68%', change: '-1.2%', positive: false },
          { label: 'New Entrants', value: '23', change: '+5', positive: true },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">{stat.label}</span>
                  <span className={`flex items-center text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
