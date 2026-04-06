'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Box,
  Tag,
  Lightbulb,
  HelpCircle,
  Filter,
  ArrowUpDown,
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
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart,
  Line,
  Area,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347', '#20B2AA', '#DC143C'];

interface SKU {
  id: string;
  name: string;
  category: string;
  annualRevenue: number;
  annualVolume: number;
  avgInventory: number;
  turnoverRate: number;
  margin: number;
  storageCost: number;
  handlingCost: number;
  daysInStock: number;
  stockouts: number;
}

export default function SKURationalizationTool() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [skus, setSkus] = useState<SKU[]>([
    {
      id: 'SKU001',
      name: 'Widget Pro A',
      category: 'Electronics',
      annualRevenue: 450000,
      annualVolume: 12000,
      avgInventory: 200,
      turnoverRate: 60,
      margin: 32,
      storageCost: 4500,
      handlingCost: 3200,
      daysInStock: 6,
      stockouts: 2,
    },
    {
      id: 'SKU002',
      name: 'Component B Plus',
      category: 'Electronics',
      annualRevenue: 280000,
      annualVolume: 8500,
      avgInventory: 350,
      turnoverRate: 24,
      margin: 28,
      storageCost: 6200,
      handlingCost: 2800,
      daysInStock: 15,
      stockouts: 5,
    },
    {
      id: 'SKU003',
      name: 'Fastener Kit C',
      category: 'Hardware',
      annualRevenue: 85000,
      annualVolume: 15000,
      avgInventory: 800,
      turnoverRate: 19,
      margin: 45,
      storageCost: 2800,
      handlingCost: 1500,
      daysInStock: 19,
      stockouts: 1,
    },
    {
      id: 'SKU004',
      name: 'Connector Type D',
      category: 'Electronics',
      annualRevenue: 125000,
      annualVolume: 5500,
      avgInventory: 600,
      turnoverRate: 9,
      margin: 22,
      storageCost: 5200,
      handlingCost: 2100,
      daysInStock: 40,
      stockouts: 0,
    },
    {
      id: 'SKU005',
      name: 'Housing Unit E',
      category: 'Hardware',
      annualRevenue: 320000,
      annualVolume: 4200,
      avgInventory: 150,
      turnoverRate: 28,
      margin: 38,
      storageCost: 3800,
      handlingCost: 4200,
      daysInStock: 13,
      stockouts: 3,
    },
    {
      id: 'SKU006',
      name: 'Legacy Part F',
      category: 'Hardware',
      annualRevenue: 22000,
      annualVolume: 850,
      avgInventory: 450,
      turnoverRate: 2,
      margin: 15,
      storageCost: 4200,
      handlingCost: 1800,
      daysInStock: 180,
      stockouts: 0,
    },
    {
      id: 'SKU007',
      name: 'Premium Kit G',
      category: 'Premium',
      annualRevenue: 580000,
      annualVolume: 3200,
      avgInventory: 80,
      turnoverRate: 40,
      margin: 52,
      storageCost: 2800,
      handlingCost: 5500,
      daysInStock: 9,
      stockouts: 8,
    },
    {
      id: 'SKU008',
      name: 'Standard Unit H',
      category: 'Standard',
      annualRevenue: 180000,
      annualVolume: 9500,
      avgInventory: 500,
      turnoverRate: 19,
      margin: 25,
      storageCost: 3800,
      handlingCost: 2200,
      daysInStock: 19,
      stockouts: 4,
    },
    {
      id: 'SKU009',
      name: 'Obsolete Item I',
      category: 'Legacy',
      annualRevenue: 8500,
      annualVolume: 120,
      avgInventory: 380,
      turnoverRate: 0.3,
      margin: 8,
      storageCost: 5500,
      handlingCost: 1200,
      daysInStock: 350,
      stockouts: 0,
    },
    {
      id: 'SKU010',
      name: 'Growth Item J',
      category: 'New',
      annualRevenue: 95000,
      annualVolume: 2800,
      avgInventory: 120,
      turnoverRate: 23,
      margin: 42,
      storageCost: 2100,
      handlingCost: 1800,
      daysInStock: 16,
      stockouts: 6,
    },
  ]);
  const [marginThreshold, setMarginThreshold] = useState(20);
  const [turnoverThreshold, setTurnoverThreshold] = useState(12);
  const [revenueThreshold, setRevenueThreshold] = useState(50000);

  const analysisData = useMemo(() => {
    const totalRevenue = skus.reduce((sum, s) => sum + s.annualRevenue, 0);
    const totalVolume = skus.reduce((sum, s) => sum + s.annualVolume, 0);
    const totalStorageCost = skus.reduce((sum, s) => sum + s.storageCost, 0);
    const totalHandlingCost = skus.reduce((sum, s) => sum + s.handlingCost, 0);

    // ABC Analysis
    const sortedByRevenue = [...skus].sort((a, b) => b.annualRevenue - a.annualRevenue);
    const abcAnalysis = sortedByRevenue.reduce<{ items: Array<typeof skus[0] & { abcClass: string; cumulativePercent: number }>; cumulative: number }>(
      (acc, sku) => {
        const cumulative = acc.cumulative + sku.annualRevenue;
        const cumulativePercent = (cumulative / totalRevenue) * 100;
        let abcClass = 'C';
        if (cumulativePercent <= 80) abcClass = 'A';
        else if (cumulativePercent <= 95) abcClass = 'B';
        return {
          items: [...acc.items, { ...sku, abcClass, cumulativePercent }],
          cumulative,
        };
      },
      { items: [], cumulative: 0 }
    ).items;

    // XYZ Analysis (variability)
    const xyzAnalysis = skus.map((sku) => {
      let xyzClass = 'Z';
      if (sku.turnoverRate >= 24) xyzClass = 'X'; // High turnover, predictable
      else if (sku.turnoverRate >= 12) xyzClass = 'Y'; // Medium turnover
      return { ...sku, xyzClass };
    });

    // Combined ABC-XYZ Matrix
    const combinedAnalysis = abcAnalysis.map((sku) => {
      const xyz = xyzAnalysis.find((x) => x.id === sku.id);
      return {
        ...sku,
        xyzClass: xyz?.xyzClass || 'Z',
        matrixClass: `${sku.abcClass}${xyz?.xyzClass || 'Z'}`,
      };
    });

    // SKU Recommendations
    const recommendations = combinedAnalysis.map((sku) => {
      const issues: string[] = [];
      let action: 'keep' | 'review' | 'discontinue' = 'keep';
      let priority: 'high' | 'medium' | 'low' = 'low';

      if (sku.margin < marginThreshold) {
        issues.push(`Low margin (${sku.margin}%)`);
      }
      if (sku.turnoverRate < turnoverThreshold) {
        issues.push(`Low turnover (${sku.turnoverRate}x/year)`);
      }
      if (sku.annualRevenue < revenueThreshold) {
        issues.push(`Low revenue ($${sku.annualRevenue.toLocaleString()})`);
      }
      if (sku.daysInStock > 90) {
        issues.push(`Excessive inventory age (${sku.daysInStock} days)`);
      }
      if (sku.stockouts > 5 && sku.abcClass === 'A') {
        issues.push(`High stockouts for A-class item (${sku.stockouts})`);
      }

      // Determine action
      if (sku.abcClass === 'A' && issues.length > 0) {
        action = 'review';
        priority = 'high';
      } else if (sku.abcClass === 'C' && (sku.margin < 15 || sku.turnoverRate < 6)) {
        action = 'discontinue';
        priority = 'medium';
      } else if (issues.length >= 2) {
        action = 'review';
        priority = 'medium';
      }

      const profitContribution = sku.annualRevenue * (sku.margin / 100);
      const carryingCost = sku.storageCost + sku.handlingCost;
      const netContribution = profitContribution - carryingCost;

      return {
        ...sku,
        issues,
        action,
        priority,
        profitContribution,
        carryingCost,
        netContribution,
      };
    });

    return {
      totalRevenue,
      totalVolume,
      totalStorageCost,
      totalHandlingCost,
      abcAnalysis,
      xyzAnalysis,
      combinedAnalysis,
      recommendations,
    };
  }, [skus, marginThreshold, turnoverThreshold, revenueThreshold]);

  const abcDistribution = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0 };
    analysisData.abcAnalysis.forEach((sku) => {
      counts[sku.abcClass as keyof typeof counts]++;
    });
    return [
      { name: 'A Class', value: counts.A, color: '#2E8B57', description: 'Top 80% revenue' },
      { name: 'B Class', value: counts.B, color: '#FFB347', description: 'Next 15% revenue' },
      { name: 'C Class', value: counts.C, color: '#E97451', description: 'Bottom 5% revenue' },
    ];
  }, [analysisData]);

  const matrixData = useMemo(() => {
    return [
      { class: 'AX', count: 0, description: 'High value, predictable' },
      { class: 'AY', count: 0, description: 'High value, variable' },
      { class: 'AZ', count: 0, description: 'High value, sporadic' },
      { class: 'BX', count: 0, description: 'Medium value, predictable' },
      { class: 'BY', count: 0, description: 'Medium value, variable' },
      { class: 'BZ', count: 0, description: 'Medium value, sporadic' },
      { class: 'CX', count: 0, description: 'Low value, predictable' },
      { class: 'CY', count: 0, description: 'Low value, variable' },
      { class: 'CZ', count: 0, description: 'Low value, sporadic' },
    ].map((item) => {
      const count = analysisData.combinedAnalysis.filter((s) => s.matrixClass === item.class).length;
      return { ...item, count };
    });
  }, [analysisData]);

  const scatterData = useMemo(() => {
    return analysisData.recommendations.map((sku) => ({
      name: sku.name,
      x: sku.turnoverRate,
      y: sku.margin,
      z: sku.annualRevenue / 10000,
      abc: sku.abcClass,
    }));
  }, [analysisData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'keep':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'review':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'discontinue':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300';
    }
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
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                SKU Rationalization Tool
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Analyze, classify, and optimize your product portfolio for maximum profitability
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          {[
            { id: 'analysis', label: 'Portfolio Analysis', icon: BarChart3 },
            { id: 'abc', label: 'ABC-XYZ Matrix', icon: Tag },
            { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
            { id: 'settings', label: 'Thresholds', icon: Filter },
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

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(analysisData.totalRevenue)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Box className="w-4 h-4 text-[#0F4C81]" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Volume</span>
                </div>
                <div className="text-2xl font-bold text-[#0F4C81] dark:text-white">
                  {analysisData.totalVolume.toLocaleString()}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total SKUs</span>
                </div>
                <div className="text-2xl font-bold text-purple-500">{skus.length}</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">A-Class Items</span>
                </div>
                <div className="text-2xl font-bold text-green-500">
                  {analysisData.abcAnalysis.filter((s) => s.abcClass === 'A').length}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">For Review</span>
                </div>
                <div className="text-2xl font-bold text-red-500">
                  {analysisData.recommendations.filter((r) => r.action === 'review').length}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">To Discontinue</span>
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  {analysisData.recommendations.filter((r) => r.action === 'discontinue').length}
                </div>
              </div>
            </div>

            {/* Revenue Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  ABC Classification Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={abcDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {abcDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Margin vs Turnover Analysis
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Turnover"
                        unit="x"
                        label={{ value: 'Turnover Rate', position: 'bottom', offset: 0 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Margin"
                        unit="%"
                        label={{ value: 'Margin %', angle: -90, position: 'insideLeft' }}
                      />
                      <ZAxis type="number" dataKey="z" range={[50, 400]} name="Revenue" />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                        }}
                      />
                      <Scatter
                        name="SKUs"
                        data={scatterData}
                        fill="#0F4C81"
                      >
                        {scatterData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.abc === 'A'
                                ? '#2E8B57'
                                : entry.abc === 'B'
                                ? '#FFB347'
                                : '#E97451'
                            }
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Revenue by SKU (Sorted by ABC Class)
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={analysisData.abcAnalysis.slice(0, 10).map((s) => ({
                      name: s.name.substring(0, 15),
                      revenue: s.annualRevenue / 1000,
                      margin: s.margin,
                      class: s.abcClass,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#0F4C81" name="Revenue ($K)" />
                    <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#2E8B57" name="Margin %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* ABC-XYZ Matrix Tab */}
        {activeTab === 'abc' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Matrix Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                ABC-XYZ Classification Matrix
              </h3>
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-600">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3"></th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                        X (Predictable)
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                        Y (Variable)
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                        Z (Sporadic)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-200 dark:border-slate-600">
                      <td className="px-4 py-3 font-medium text-green-600 bg-green-50 dark:bg-green-900/20">
                        A (High Value)
                      </td>
                      <td className="px-4 py-3 text-center bg-green-100 dark:bg-green-900/30">
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                          {matrixData.find((m) => m.class === 'AX')?.count}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">AX</div>
                      </td>
                      <td className="px-4 py-3 text-center bg-yellow-100 dark:bg-yellow-900/30">
                        <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                          {matrixData.find((m) => m.class === 'AY')?.count}
                        </div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">AY</div>
                      </td>
                      <td className="px-4 py-3 text-center bg-orange-100 dark:bg-orange-900/30">
                        <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                          {matrixData.find((m) => m.class === 'AZ')?.count}
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-400">AZ</div>
                      </td>
                    </tr>
                    <tr className="border-t border-slate-200 dark:border-slate-600">
                      <td className="px-4 py-3 font-medium text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20">
                        B (Medium Value)
                      </td>
                      <td className="px-4 py-3 text-center bg-blue-100 dark:bg-blue-900/30">
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          {matrixData.find((m) => m.class === 'BX')?.count}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">BX</div>
                      </td>
                      <td className="px-4 py-3 text-center bg-slate-100 dark:bg-slate-700">
                        <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {matrixData.find((m) => m.class === 'BY')?.count}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">BY</div>
                      </td>
                      <td className="px-4 py-3 text-center bg-purple-100 dark:bg-purple-900/30">
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                          {matrixData.find((m) => m.class === 'BZ')?.count}
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">BZ</div>
                      </td>
                    </tr>
                    <tr className="border-t border-slate-200 dark:border-slate-600">
                      <td className="px-4 py-3 font-medium text-red-600 bg-red-50 dark:bg-red-900/20">
                        C (Low Value)
                      </td>
                      <td className="px-4 py-3 text-center bg-teal-100 dark:bg-teal-900/30">
                        <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                          {matrixData.find((m) => m.class === 'CX')?.count}
                        </div>
                        <div className="text-xs text-teal-600 dark:text-teal-400">CX</div>
                      </td>
                      <td className="px-4 py-3 text-center bg-pink-100 dark:bg-pink-900/30">
                        <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                          {matrixData.find((m) => m.class === 'CY')?.count}
                        </div>
                        <div className="text-xs text-pink-600 dark:text-pink-400">CY</div>
                      </td>
                      <td className="px-4 py-3 text-center bg-red-100 dark:bg-red-900/30">
                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                          {matrixData.find((m) => m.class === 'CZ')?.count}
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-400">CZ</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategy by Class */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-green-600 mb-3">A-Class Strategy</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Tight inventory control</li>
                  <li>• Regular demand forecasting</li>
                  <li>• Safety stock optimization</li>
                  <li>• Priority in warehouse slotting</li>
                  <li>• Monitor stockouts closely</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-yellow-600 mb-3">B-Class Strategy</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Moderate control measures</li>
                  <li>• Periodic review system</li>
                  <li>• Standard safety stock levels</li>
                  <li>• Regular reorder points</li>
                  <li>• Quarterly performance review</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-red-600 mb-3">C-Class Strategy</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Simple control systems</li>
                  <li>• Larger order quantities</li>
                  <li>• Evaluate for discontinuation</li>
                  <li>• Consider supplier consolidation</li>
                  <li>• Minimize storage costs</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  SKU Action Recommendations
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        ABC Class
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Revenue
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Margin
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Turnover
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Net Contribution
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                        Issues
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {analysisData.recommendations.map((sku) => (
                      <tr key={sku.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-slate-800 dark:text-white">
                              {sku.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{sku.id}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sku.abcClass === 'A'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : sku.abcClass === 'B'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            }`}
                          >
                            {sku.abcClass}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-slate-800 dark:text-white">
                          {formatCurrency(sku.annualRevenue)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`font-medium ${
                              sku.margin >= 30
                                ? 'text-green-600'
                                : sku.margin >= 20
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {sku.margin}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                          {sku.turnoverRate}x
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`font-medium ${
                              sku.netContribution >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {formatCurrency(sku.netContribution)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                              sku.action
                            )}`}
                          >
                            {sku.action.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {sku.issues.length > 0 ? (
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {sku.issues.join(', ')}
                            </div>
                          ) : (
                            <span className="text-green-500 text-xs">No issues</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Potential Savings */}
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Portfolio Optimization Potential</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm opacity-80">Storage Cost Savings</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      analysisData.recommendations
                        .filter((r) => r.action === 'discontinue')
                        .reduce((sum, r) => sum + r.storageCost, 0)
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Handling Cost Savings</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      analysisData.recommendations
                        .filter((r) => r.action === 'discontinue')
                        .reduce((sum, r) => sum + r.handlingCost, 0)
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">SKUs to Discontinue</div>
                  <div className="text-2xl font-bold">
                    {analysisData.recommendations.filter((r) => r.action === 'discontinue').length}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">SKUs to Review</div>
                  <div className="text-2xl font-bold">
                    {analysisData.recommendations.filter((r) => r.action === 'review').length}
                  </div>
                </div>
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
                Analysis Thresholds
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Margin Threshold (%)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={marginThreshold}
                    onChange={(e) => setMarginThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span>5%</span>
                    <span className="font-medium text-[#0F4C81] dark:text-white">
                      {marginThreshold}%
                    </span>
                    <span>50%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Turnover Threshold (x/year)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={turnoverThreshold}
                    onChange={(e) => setTurnoverThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span>1x</span>
                    <span className="font-medium text-[#0F4C81] dark:text-white">
                      {turnoverThreshold}x
                    </span>
                    <span>24x</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Revenue Threshold ($)
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="200000"
                    step="10000"
                    value={revenueThreshold}
                    onChange={(e) => setRevenueThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span>$10K</span>
                    <span className="font-medium text-[#0F4C81] dark:text-white">
                      {formatCurrency(revenueThreshold)}
                    </span>
                    <span>$200K</span>
                  </div>
                </div>
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
                    q: 'What is SKU rationalization?',
                    a: 'SKU rationalization is the process of analyzing your product portfolio to determine which items to keep, modify, or discontinue. The goal is to maximize profitability by focusing resources on high-value products while reducing costs associated with underperforming SKUs.',
                  },
                  {
                    q: 'What is ABC analysis?',
                    a: 'ABC analysis categorizes inventory into three classes based on their contribution to total value. A-items represent the top 80% of revenue, B-items represent the next 15%, and C-items account for the remaining 5%. This helps prioritize inventory management efforts.',
                  },
                  {
                    q: 'What is XYZ analysis?',
                    a: 'XYZ analysis classifies items based on consumption variability. X-items have steady, predictable demand. Y-items have variable demand that follows patterns. Z-items have highly unpredictable, sporadic demand. Combined with ABC, it creates a 9-cell matrix for refined inventory strategies.',
                  },
                  {
                    q: 'How often should I perform SKU rationalization?',
                    a: 'Quarterly reviews are recommended for fast-moving industries, while annual reviews may suffice for stable product lines. Major market changes, new product launches, or significant demand shifts should trigger immediate analysis.',
                  },
                  {
                    q: 'What factors should I consider before discontinuing a SKU?',
                    a: 'Consider customer impact (are there loyal buyers?), strategic importance (completeness of product line), supplier relationships, replacement costs, and potential revenue loss. Sometimes low-margin items are essential for customer retention or cross-selling.',
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
