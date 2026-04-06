'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Anchor,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Clock,
  Ship,
  MapPin,
  Lightbulb,
  HelpCircle,
  Calendar,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347'];

interface PortData {
  name: string;
  region: string;
  avgWaitTime: number;
  currentWaitTime: number;
  vesselCount: number;
  berthUtilization: number;
  congestionIndex: number;
  trend: 'improving' | 'stable' | 'worsening';
}

const PORTS: PortData[] = [
  { name: 'Los Angeles', region: 'North America', avgWaitTime: 5, currentWaitTime: 8, vesselCount: 28, berthUtilization: 92, congestionIndex: 85, trend: 'worsening' },
  { name: 'Long Beach', region: 'North America', avgWaitTime: 5, currentWaitTime: 7, vesselCount: 24, berthUtilization: 88, congestionIndex: 78, trend: 'stable' },
  { name: 'Rotterdam', region: 'Europe', avgWaitTime: 2, currentWaitTime: 3, vesselCount: 18, berthUtilization: 75, congestionIndex: 45, trend: 'stable' },
  { name: 'Shanghai', region: 'Asia', avgWaitTime: 3, currentWaitTime: 5, vesselCount: 35, berthUtilization: 85, congestionIndex: 68, trend: 'improving' },
  { name: 'Singapore', region: 'Asia', avgWaitTime: 1, currentWaitTime: 2, vesselCount: 22, berthUtilization: 70, congestionIndex: 35, trend: 'stable' },
  { name: 'NY/NJ', region: 'North America', avgWaitTime: 4, currentWaitTime: 6, vesselCount: 15, berthUtilization: 82, congestionIndex: 62, trend: 'worsening' },
  { name: 'Hamburg', region: 'Europe', avgWaitTime: 2, currentWaitTime: 4, vesselCount: 14, berthUtilization: 78, congestionIndex: 55, trend: 'worsening' },
  { name: 'Busan', region: 'Asia', avgWaitTime: 2, currentWaitTime: 2, vesselCount: 20, berthUtilization: 72, congestionIndex: 30, trend: 'improving' },
];

const HISTORICAL_DATA = [
  { week: 'W1', la: 9, rotterdam: 2, shanghai: 6, singapore: 1 },
  { week: 'W2', la: 10, rotterdam: 2, shanghai: 5, singapore: 1 },
  { week: 'W3', la: 8, rotterdam: 3, shanghai: 5, singapore: 2 },
  { week: 'W4', la: 8, rotterdam: 3, shanghai: 5, singapore: 2 },
  { week: 'W5', la: 7, rotterdam: 3, shanghai: 4, singapore: 2 },
  { week: 'W6', la: 8, rotterdam: 3, shanghai: 5, singapore: 2 },
];

export default function PortCongestionPredictor() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPort, setSelectedPort] = useState('Los Angeles');

  const predictions = useMemo(() => {
    return PORTS.map((port) => {
      const trendFactor = port.trend === 'worsening' ? 1.2 : port.trend === 'improving' ? 0.8 : 1;
      const predictedWait = Math.round(port.currentWaitTime * trendFactor);
      const congestionLevel = predictedWait <= port.avgWaitTime * 1.2 ? 'Low' : predictedWait <= port.avgWaitTime * 1.8 ? 'Medium' : 'High';
      
      const recommendation = congestionLevel === 'High'
        ? 'Consider alternative ports or delay shipment'
        : congestionLevel === 'Medium'
        ? 'Monitor closely, have contingency plans ready'
        : 'Normal operations expected';

      return {
        ...port,
        predictedWait,
        congestionLevel,
        recommendation,
        deviationFromAvg: ((port.currentWaitTime - port.avgWaitTime) / port.avgWaitTime) * 100,
      };
    });
  }, []);

  const chartData = useMemo(() => {
    return predictions
      .sort((a, b) => b.congestionIndex - a.congestionIndex)
      .map((p) => ({
        name: p.name.split(' ')[0],
        'Current Wait': p.currentWaitTime,
        'Avg Wait': p.avgWaitTime,
        'Congestion Index': p.congestionIndex,
      }));
  }, [predictions]);

  const selectedPortData = useMemo(() => {
    return predictions.find((p) => p.name === selectedPort);
  }, [predictions, selectedPort]);

  const regionSummary = useMemo(() => {
    const regions = predictions.reduce((acc, port) => {
      if (!acc[port.region]) {
        acc[port.region] = { ports: 0, totalWait: 0, totalCongestion: 0 };
      }
      acc[port.region].ports++;
      acc[port.region].totalWait += port.currentWaitTime;
      acc[port.region].totalCongestion += port.congestionIndex;
      return acc;
    }, {} as Record<string, { ports: number; totalWait: number; totalCongestion: number }>);

    return Object.entries(regions).map(([name, data]) => ({
      name,
      avgWait: (data.totalWait / data.ports).toFixed(1),
      avgCongestion: Math.round(data.totalCongestion / data.ports),
      ports: data.ports,
    }));
  }, [predictions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-[#0F4C81] rounded-xl shadow-lg">
              <Anchor className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Port Congestion Predictor
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Monitor global port congestion and predict delays for supply chain planning
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          {[
            { id: 'overview', label: 'Global Overview', icon: MapPin },
            { id: 'predictions', label: 'Predictions', icon: TrendingUp },
            { id: 'trends', label: 'Historical Trends', icon: BarChart3 },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0F4C81] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Region Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {regionSummary.map((region) => (
                <div
                  key={region.name}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
                >
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-4">{region.name}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Avg Wait</div>
                      <div className="text-xl font-bold text-[#0F4C81] dark:text-white">{region.avgWait} days</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Congestion</div>
                      <div className={`text-xl font-bold ${
                        region.avgCongestion < 40 ? 'text-green-500' :
                        region.avgCongestion < 70 ? 'text-yellow-500' : 'text-red-500'
                      }`}>{region.avgCongestion}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Ports</div>
                      <div className="text-xl font-bold text-slate-800 dark:text-white">{region.ports}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Port Status Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Port Congestion Index Ranking
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Congestion Index" fill="#0F4C81" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Port Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {predictions.slice(0, 4).map((port) => (
                <div
                  key={port.name}
                  className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border ${
                    port.congestionLevel === 'High' ? 'border-red-400' :
                    port.congestionLevel === 'Medium' ? 'border-yellow-400' : 'border-green-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800 dark:text-white">{port.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      port.trend === 'improving' ? 'bg-green-100 text-green-700' :
                      port.trend === 'worsening' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {port.trend}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Current Wait</span>
                      <span className="font-medium text-slate-800 dark:text-white">{port.currentWaitTime} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Vessels Waiting</span>
                      <span className="font-medium text-slate-800 dark:text-white">{port.vesselCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Berth Util.</span>
                      <span className={`font-medium ${port.berthUtilization > 85 ? 'text-red-500' : 'text-green-500'}`}>
                        {port.berthUtilization}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Port Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Select Port for Detailed Prediction
              </h3>
              <div className="flex flex-wrap gap-2">
                {PORTS.map((port) => (
                  <button
                    key={port.name}
                    onClick={() => setSelectedPort(port.name)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedPort === port.name
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {port.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedPortData && (
              <>
                {/* Prediction Summary */}
                <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">{selectedPortData.name} Prediction</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm opacity-80">Current Wait</div>
                      <div className="text-2xl font-bold">{selectedPortData.currentWaitTime} days</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Predicted Wait</div>
                      <div className="text-2xl font-bold">{selectedPortData.predictedWait} days</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Congestion Level</div>
                      <div className={`text-2xl font-bold ${
                        selectedPortData.congestionLevel === 'High' ? 'text-red-300' :
                        selectedPortData.congestionLevel === 'Medium' ? 'text-yellow-300' : 'text-green-300'
                      }`}>
                        {selectedPortData.congestionLevel}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Vessels Waiting</div>
                      <div className="text-2xl font-bold">{selectedPortData.vesselCount}</div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`p-6 rounded-xl ${
                  selectedPortData.congestionLevel === 'High' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                  selectedPortData.congestionLevel === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                  'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                }`}>
                  <div className="flex items-center gap-4">
                    {selectedPortData.congestionLevel === 'High' ? (
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    ) : selectedPortData.congestionLevel === 'Medium' ? (
                      <Clock className="w-8 h-8 text-yellow-500" />
                    ) : (
                      <Ship className="w-8 h-8 text-green-500" />
                    )}
                    <div>
                      <div className={`font-semibold ${
                        selectedPortData.congestionLevel === 'High' ? 'text-red-700 dark:text-red-300' :
                        selectedPortData.congestionLevel === 'Medium' ? 'text-yellow-700 dark:text-yellow-300' :
                        'text-green-700 dark:text-green-300'
                      }`}>
                        Recommendation
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">{selectedPortData.recommendation}</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* All Predictions Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  All Port Predictions
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Port</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Current</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Predicted</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Trend</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {predictions.map((port) => (
                      <tr key={port.name} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{port.name}</td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{port.currentWaitTime} days</td>
                        <td className="px-4 py-3 text-center font-medium text-[#0F4C81] dark:text-white">{port.predictedWait} days</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            port.trend === 'improving' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            port.trend === 'worsening' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                            'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}>
                            {port.trend}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            port.congestionLevel === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                            port.congestionLevel === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                            'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          }`}>
                            {port.congestionLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Historical Wait Times (6 Weeks)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HISTORICAL_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="la" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.3} name="Los Angeles" />
                    <Area type="monotone" dataKey="rotterdam" stroke="#2E8B57" fill="#2E8B57" fillOpacity={0.3} name="Rotterdam" />
                    <Area type="monotone" dataKey="shanghai" stroke="#E97451" fill="#E97451" fillOpacity={0.3} name="Shanghai" />
                    <Area type="monotone" dataKey="singapore" stroke="#7B68EE" fill="#7B68EE" fillOpacity={0.3} name="Singapore" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Active Congestion Alerts
              </h3>

              <div className="space-y-4">
                {predictions
                  .filter((p) => p.congestionLevel === 'High' || p.trend === 'worsening')
                  .map((port) => (
                    <div
                      key={port.name}
                      className={`p-4 rounded-lg border-l-4 ${
                        port.congestionLevel === 'High'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {port.congestionLevel === 'High' ? (
                          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                        ) : (
                          <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-white">{port.name}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                Current wait: {port.currentWaitTime} days ({port.deviationFromAvg > 0 ? '+' : ''}{port.deviationFromAvg.toFixed(0)}% vs average)
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              port.congestionLevel === 'High'
                                ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                                : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                            }`}>
                              {port.congestionLevel === 'High' ? 'HIGH' : 'MONITOR'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                            {port.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#0F4C81]" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                {[
                  {
                    q: 'What is port congestion?',
                    a: 'Port congestion occurs when ships must wait at anchorage before berthing because terminals are operating at or near capacity. Causes include labor shortages, equipment issues, volume surges, and inefficient operations.',
                  },
                  {
                    q: 'How is the congestion index calculated?',
                    a: 'The congestion index combines multiple factors: vessel wait time deviation from average, berth utilization percentage, number of vessels at anchorage, and recent trend direction. Higher values indicate worse congestion.',
                  },
                  {
                    q: 'When is the best time to schedule shipments?',
                    a: 'Mid-week arrivals often have lower congestion. Avoid end-of-month and holiday periods. Consider alternative ports during peak seasons. Monitor our predictions for real-time guidance.',
                  },
                  {
                    q: 'How can I reduce the impact of port congestion?',
                    a: 'Consider: 1) Alternative ports of entry, 2) Adjusting shipping schedules, 3) Increasing inventory buffers, 4) Using faster inland transportation, 5) Diversifying shipping routes.',
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                  >
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{faq.q}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
