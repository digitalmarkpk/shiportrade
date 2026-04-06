'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Ship,
  Star,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  HelpCircle,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347'];

interface CarrierMetrics {
  id: string;
  name: string;
  onTimeDelivery: number;
  transitTimeAccuracy: number;
  damageRate: number;
  claimResolution: number;
  customerService: number;
  pricing: number;
  documentation: number;
  trackingCapability: number;
  totalShipments: number;
  avgCost: number;
  marketShare: number;
}

const CARRIERS: CarrierMetrics[] = [
  { id: '1', name: 'Maersk Line', onTimeDelivery: 85, transitTimeAccuracy: 88, damageRate: 95, claimResolution: 82, customerService: 78, pricing: 70, documentation: 90, trackingCapability: 92, totalShipments: 1250, avgCost: 2850, marketShare: 18 },
  { id: '2', name: 'MSC', onTimeDelivery: 78, transitTimeAccuracy: 82, damageRate: 92, claimResolution: 75, customerService: 72, pricing: 85, documentation: 85, trackingCapability: 88, totalShipments: 980, avgCost: 2650, marketShare: 16 },
  { id: '3', name: 'CMA CGM', onTimeDelivery: 82, transitTimeAccuracy: 85, damageRate: 93, claimResolution: 80, customerService: 80, pricing: 78, documentation: 88, trackingCapability: 90, totalShipments: 750, avgCost: 2720, marketShare: 12 },
  { id: '4', name: 'COSCO', onTimeDelivery: 75, transitTimeAccuracy: 78, damageRate: 90, claimResolution: 70, customerService: 68, pricing: 92, documentation: 82, trackingCapability: 85, totalShipments: 620, avgCost: 2480, marketShare: 10 },
  { id: '5', name: 'Hapag-Lloyd', onTimeDelivery: 88, transitTimeAccuracy: 90, damageRate: 96, claimResolution: 88, customerService: 85, pricing: 65, documentation: 92, trackingCapability: 94, totalShipments: 540, avgCost: 3100, marketShare: 8 },
];

export default function CarrierScorecard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>(['1', '2', '3']);
  const [weightings, setWeightings] = useState({
    onTimeDelivery: 25,
    pricing: 20,
    damageRate: 20,
    customerService: 15,
    trackingCapability: 10,
    documentation: 10,
  });

  const carrierAnalysis = useMemo(() => {
    return CARRIERS.map((carrier) => {
      const weightedScore =
        carrier.onTimeDelivery * (weightings.onTimeDelivery / 100) +
        carrier.pricing * (weightings.pricing / 100) +
        carrier.damageRate * (weightings.damageRate / 100) +
        carrier.customerService * (weightings.customerService / 100) +
        carrier.trackingCapability * (weightings.trackingCapability / 100) +
        carrier.documentation * (weightings.documentation / 100);

      const stars = Math.round(weightedScore / 20);

      return {
        ...carrier,
        weightedScore: Math.round(weightedScore * 10) / 10,
        stars,
        rank: 0,
      };
    }).sort((a, b) => b.weightedScore - a.weightedScore)
      .map((carrier, index) => ({ ...carrier, rank: index + 1 }));
  }, [weightings]);

  const comparisonData = useMemo(() => {
    return carrierAnalysis
      .filter((c) => selectedCarriers.includes(c.id))
      .map((carrier) => ({
        name: carrier.name.split(' ')[0],
        'On-Time': carrier.onTimeDelivery,
        Pricing: carrier.pricing,
        'Damage Free': carrier.damageRate,
        Service: carrier.customerService,
        Tracking: carrier.trackingCapability,
      }));
  }, [carrierAnalysis, selectedCarriers]);

  const radarData = useMemo(() => {
    const selected = carrierAnalysis.filter((c) => selectedCarriers.includes(c.id));
    return [
      { metric: 'On-Time Delivery', ...Object.fromEntries(selected.map((c) => [c.name.split(' ')[0], c.onTimeDelivery])) },
      { metric: 'Pricing', ...Object.fromEntries(selected.map((c) => [c.name.split(' ')[0], c.pricing])) },
      { metric: 'Damage Free', ...Object.fromEntries(selected.map((c) => [c.name.split(' ')[0], c.damageRate])) },
      { metric: 'Service', ...Object.fromEntries(selected.map((c) => [c.name.split(' ')[0], c.customerService])) },
      { metric: 'Tracking', ...Object.fromEntries(selected.map((c) => [c.name.split(' ')[0], c.trackingCapability])) },
      { metric: 'Documentation', ...Object.fromEntries(selected.map((c) => [c.name.split(' ')[0], c.documentation])) },
    ];
  }, [carrierAnalysis, selectedCarriers]);

  const trendData = useMemo(() => {
    return [
      { month: 'Jan', Maersk: 82, MSC: 75, 'CMA': 80, 'Hapag': 86 },
      { month: 'Feb', Maersk: 84, MSC: 77, 'CMA': 81, 'Hapag': 87 },
      { month: 'Mar', Maersk: 83, MSC: 76, 'CMA': 82, 'Hapag': 88 },
      { month: 'Apr', Maersk: 85, MSC: 78, 'CMA': 83, 'Hapag': 89 },
      { month: 'May', Maersk: 84, MSC: 77, 'CMA': 82, 'Hapag': 88 },
      { month: 'Jun', Maersk: 85, MSC: 78, 'CMA': 82, 'Hapag': 88 },
    ];
  }, []);

  const toggleCarrier = (id: string) => {
    if (selectedCarriers.includes(id)) {
      if (selectedCarriers.length > 1) {
        setSelectedCarriers(selectedCarriers.filter((c) => c !== id));
      }
    } else {
      setSelectedCarriers([...selectedCarriers, id]);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

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
              <Ship className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Carrier Scorecard
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Compare and evaluate carrier performance across key metrics
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'comparison', label: 'Comparison', icon: TrendingUp },
            { id: 'rankings', label: 'Rankings', icon: Star },
            { id: 'settings', label: 'Weightings', icon: DollarSign },
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
            {/* Carrier Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Select Carriers to Compare
              </h3>
              <div className="flex flex-wrap gap-2">
                {CARRIERS.map((carrier) => (
                  <button
                    key={carrier.id}
                    onClick={() => toggleCarrier(carrier.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCarriers.includes(carrier.id)
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {carrier.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {carrierAnalysis.slice(0, 3).map((carrier, index) => (
                <div
                  key={carrier.id}
                  className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border ${
                    index === 0 ? 'border-yellow-400 dark:border-yellow-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-2xl font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : 'text-orange-400'}`}>
                      #{carrier.rank}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < carrier.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-white">{carrier.name}</h4>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Overall Score</span>
                      <span className="font-medium text-[#0F4C81] dark:text-white">{carrier.weightedScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Avg Cost</span>
                      <span className="font-medium text-slate-800 dark:text-white">{formatCurrency(carrier.avgCost)}/FEU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">On-Time Rate</span>
                      <span className="font-medium text-green-600">{carrier.onTimeDelivery}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Trend */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                On-Time Performance Trend (6 Months)
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Maersk" stroke="#0F4C81" strokeWidth={2} />
                    <Line type="monotone" dataKey="MSC" stroke="#2E8B57" strokeWidth={2} />
                    <Line type="monotone" dataKey="CMA" stroke="#E97451" strokeWidth={2} />
                    <Line type="monotone" dataKey="Hapag" stroke="#7B68EE" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Bar Comparison */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Performance Metrics Comparison
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="On-Time" fill="#0F4C81" />
                    <Bar dataKey="Pricing" fill="#2E8B57" />
                    <Bar dataKey="Damage Free" fill="#E97451" />
                    <Bar dataKey="Service" fill="#7B68EE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Performance Radar
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    {carrierAnalysis
                      .filter((c) => selectedCarriers.includes(c.id))
                      .map((carrier, index) => (
                        <Radar
                          key={carrier.id}
                          name={carrier.name.split(' ')[0]}
                          dataKey={carrier.name.split(' ')[0]}
                          stroke={COLORS[index % COLORS.length]}
                          fill={COLORS[index % COLORS.length]}
                          fillOpacity={0.2}
                        />
                      ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Carrier Performance Rankings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Carrier</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Score</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Rating</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">On-Time</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Damage Free</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Avg Cost</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Shipments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {carrierAnalysis.map((carrier) => (
                      <tr key={carrier.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-4">
                          <span className={`text-xl font-bold ${
                            carrier.rank === 1 ? 'text-yellow-500' : carrier.rank === 2 ? 'text-slate-400' : carrier.rank === 3 ? 'text-orange-400' : 'text-slate-500'
                          }`}>
                            #{carrier.rank}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-800 dark:text-white">{carrier.name}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-lg font-bold text-[#0F4C81] dark:text-white">{carrier.weightedScore}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < carrier.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            carrier.onTimeDelivery >= 85 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            carrier.onTimeDelivery >= 75 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}>
                            {carrier.onTimeDelivery}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`font-medium ${carrier.damageRate >= 95 ? 'text-green-600' : carrier.damageRate >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {carrier.damageRate}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                          {formatCurrency(carrier.avgCost)}
                        </td>
                        <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                          {carrier.totalShipments.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Custom Weightings for Score Calculation
              </h3>

              <div className="space-y-6">
                {Object.entries(weightings).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-700 dark:text-slate-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium text-[#0F4C81] dark:text-white">{value}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={value}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        const total = Object.values(weightings).reduce((a, b) => a + b, 0) - value + newValue;
                        if (total <= 100) {
                          setWeightings({ ...weightings, [key]: newValue });
                        }
                      }}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Total Weighting</span>
                  <span className={`text-lg font-bold ${
                    Object.values(weightings).reduce((a, b) => a + b, 0) === 100 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Object.values(weightings).reduce((a, b) => a + b, 0)}%
                  </span>
                </div>
                {Object.values(weightings).reduce((a, b) => a + b, 0) !== 100 && (
                  <p className="text-sm text-red-500 mt-2">Total must equal 100%</p>
                )}
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
                    q: 'How is the carrier score calculated?',
                    a: 'The carrier score is a weighted average of multiple performance metrics. Default weightings prioritize on-time delivery (25%), pricing (20%), and damage-free rate (20%). You can customize these weightings based on your priorities.',
                  },
                  {
                    q: 'What is a good on-time delivery rate?',
                    a: 'Industry average for ocean carriers is approximately 75-80%. Top performers consistently achieve 85%+. On-time delivery is measured as arrival within the published transit time window.',
                  },
                  {
                    q: 'How often is the data updated?',
                    a: 'Carrier performance data should be updated monthly based on actual shipment results. Real-time tracking provides ongoing visibility, but overall scores are typically recalculated quarterly.',
                  },
                  {
                    q: 'Should I always choose the highest-scoring carrier?',
                    a: 'Not necessarily. Consider your specific needs: cost-sensitive shipments may prioritize pricing scores, while time-critical cargo needs high on-time delivery. Use the comparison tools to match carriers to your requirements.',
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
