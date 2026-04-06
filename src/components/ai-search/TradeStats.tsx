'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import {
  Ship, Container, Globe, DollarSign, TrendingUp, TrendingDown,
  Anchor, MapPin, Clock, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

// Global Shipping Statistics
const shippingLinesData = [
  { name: 'MSC', teu: 4.9, fleet: 708, share: 18.5 },
  { name: 'Maersk', teu: 4.3, fleet: 682, share: 16.2 },
  { name: 'CMA CGM', teu: 3.5, fleet: 598, share: 13.1 },
  { name: 'COSCO', teu: 3.1, fleet: 512, share: 11.8 },
  { name: 'Hapag-Lloyd', teu: 2.2, fleet: 258, share: 8.2 },
  { name: 'ONE', teu: 1.8, fleet: 218, share: 6.8 },
  { name: 'Evergreen', teu: 1.6, fleet: 202, share: 5.9 },
  { name: 'HMM', teu: 1.1, fleet: 78, share: 4.2 },
];

const freightRateData = [
  { month: 'Jan', asiaEurope: 1200, asiaUS: 2500, intraAsia: 350 },
  { month: 'Feb', asiaEurope: 1350, asiaUS: 2800, intraAsia: 380 },
  { month: 'Mar', asiaEurope: 1500, asiaUS: 3200, intraAsia: 420 },
  { month: 'Apr', asiaEurope: 1650, asiaUS: 3500, intraAsia: 450 },
  { month: 'May', asiaEurope: 1450, asiaUS: 3100, intraAsia: 400 },
  { month: 'Jun', asiaEurope: 1380, asiaUS: 2900, intraAsia: 380 },
  { month: 'Jul', asiaEurope: 1420, asiaUS: 2950, intraAsia: 390 },
  { month: 'Aug', asiaEurope: 1550, asiaUS: 3200, intraAsia: 410 },
  { month: 'Sep', asiaEurope: 1680, asiaUS: 3400, intraAsia: 440 },
  { month: 'Oct', asiaEurope: 1750, asiaUS: 3600, intraAsia: 460 },
  { month: 'Nov', asiaEurope: 1820, asiaUs: 3800, intraAsia: 480 },
  { month: 'Dec', asiaEurope: 1900, asiaUS: 4000, intraAsia: 500 },
];

const portData = [
  { port: 'Shanghai', country: 'China', teu: 47.3, growth: 3.2 },
  { port: 'Singapore', country: 'Singapore', teu: 37.2, growth: 5.8 },
  { port: 'Ningbo', country: 'China', teu: 33.4, growth: 4.1 },
  { port: 'Shenzhen', country: 'China', teu: 28.5, growth: 2.9 },
  { port: 'Guangzhou', country: 'China', teu: 24.2, growth: 3.5 },
  { port: 'Busan', country: 'South Korea', teu: 22.5, growth: 2.1 },
  { port: 'Qingdao', country: 'China', teu: 21.8, growth: 5.2 },
  { port: 'Hong Kong', country: 'Hong Kong', teu: 18.5, growth: -1.2 },
  { port: 'Tianjin', country: 'China', teu: 17.5, growth: 4.8 },
  { port: 'Rotterdam', country: 'Netherlands', teu: 15.3, growth: 1.8 },
];

const congestionData = [
  { port: 'Shanghai', vessels: 150, waitTime: 4.2, congestion: 78 },
  { port: 'Singapore', vessels: 120, waitTime: 2.8, congestion: 65 },
  { port: 'Rotterdam', vessels: 95, waitTime: 1.5, congestion: 42 },
  { port: 'Los Angeles', vessels: 85, waitTime: 3.1, congestion: 58 },
  { port: 'Hamburg', vessels: 70, waitTime: 1.2, congestion: 35 },
  { port: 'Dubai', vessels: 65, waitTime: 2.0, congestion: 48 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TradeStats() {
  const [activeView, setActiveView] = useState('carriers');

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeView === 'carriers' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('carriers')}
          className={activeView === 'carriers' ? 'bg-[#0F4C81]' : ''}
        >
          <Ship className="h-4 w-4 mr-1" />
          Top Carriers
        </Button>
        <Button
          variant={activeView === 'freight' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('freight')}
          className={activeView === 'freight' ? 'bg-[#0F4C81]' : ''}
        >
          <DollarSign className="h-4 w-4 mr-1" />
          Freight Rates
        </Button>
        <Button
          variant={activeView === 'ports' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('ports')}
          className={activeView === 'ports' ? 'bg-[#0F4C81]' : ''}
        >
          <Anchor className="h-4 w-4 mr-1" />
          Top Ports
        </Button>
        <Button
          variant={activeView === 'congestion' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('congestion')}
          className={activeView === 'congestion' ? 'bg-[#0F4C81]' : ''}
        >
          <Activity className="h-4 w-4 mr-1" />
          Congestion
        </Button>
      </div>

      {/* Charts */}
      {activeView === 'carriers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Container className="h-5 w-5 text-[#0F4C81]" />
                  Container Shipping Market Share
                </CardTitle>
                <CardDescription>TEU capacity by carrier (Million TEU)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={shippingLinesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="teu" name="TEU (M)" radius={[0, 4, 4, 0]}>
                      {shippingLinesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
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
                  <Globe className="h-5 w-5 text-[#2E8B57]" />
                  Global Fleet Distribution
                </CardTitle>
                <CardDescription>Market share percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={shippingLinesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="share"
                      label={({ name, share }) => `${name} ${share}%`}
                      labelLine={false}
                    >
                      {shippingLinesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {activeView === 'freight' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-amber-500" />
                Global Freight Rate Trends
              </CardTitle>
              <CardDescription>Container shipping rates by route ($/FEU) - 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={freightRateData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="asiaEurope" stroke="#0F4C81" strokeWidth={3} dot={{ r: 4 }} name="Asia-Europe" />
                  <Line type="monotone" dataKey="asiaUS" stroke="#2E8B57" strokeWidth={3} dot={{ r: 4 }} name="Asia-US" />
                  <Line type="monotone" dataKey="intraAsia" stroke="#E97451" strokeWidth={3} dot={{ r: 4 }} name="Intra-Asia" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeView === 'ports' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Anchor className="h-5 w-5 text-[#0F4C81]" />
                World's Busiest Container Ports
              </CardTitle>
              <CardDescription>Annual throughput (Million TEU)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={portData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="port" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="teu" fill="#0F4C81" name="TEU (M)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="growth" fill="#2E8B57" name="Growth %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeView === 'congestion' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  Port Congestion Index
                </CardTitle>
                <CardDescription>Current congestion levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={congestionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="port" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="congestion" name="Congestion %" fill="#E97451" radius={[4, 4, 0, 0]} />
                  </BarChart>
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
                  <Clock className="h-5 w-5 text-[#0F4C81]" />
                  Vessel Wait Times
                </CardTitle>
                <CardDescription>Days waiting at anchorage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={congestionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" />
                    <YAxis dataKey="port" type="category" width={80} tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="waitTime" name="Wait (Days)" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Global Fleet', value: '6,234', sub: 'vessels', icon: Ship, color: 'text-blue-500' },
          { label: 'Total Capacity', value: '25.8M', sub: 'TEU', icon: Container, color: 'text-green-500' },
          { label: 'Avg Freight', value: '$2,450', sub: 'per FEU', icon: DollarSign, color: 'text-amber-500' },
          { label: 'Trade Growth', value: '+4.2%', sub: 'YoY', icon: TrendingUp, color: 'text-purple-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label} ({stat.sub})</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Top Carriers Quick List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Ship className="h-4 w-4 text-[#0F4C81]" />
            Quick Reference: Top Container Carriers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {shippingLinesData.slice(0, 8).map((carrier, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${idx < 3 ? 'bg-amber-500' : 'bg-slate-400'}`}>
                    #{idx + 1}
                  </span>
                  <span className="font-medium text-sm truncate">{carrier.name}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {carrier.teu}M TEU • {carrier.share}% share
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
