'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Package,
  DollarSign,
  BarChart3,
  TrendingDown,
  Shield,
  Lightbulb,
  HelpCircle,
  PieChart as PieChartIcon,
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
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347', '#DC143C'];

export default function InventoryShrinkageCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [inventoryData, setInventoryData] = useState({
    bookInventory: 2500000,
    physicalCount: 2425000,
    salesPeriod: 12000000,
    periodMonths: 12,
    avgInventory: 2000000,
  });
  const [shrinkageBreakdown, setShrinkageBreakdown] = useState({
    theft: 15000,
    damage: 25000,
    administrative: 18000,
    vendorFraud: 8000,
    expired: 9500,
  });

  const calculations = useMemo(() => {
    const totalShrinkage = inventoryData.bookInventory - inventoryData.physicalCount;
    const shrinkageRate = (totalShrinkage / inventoryData.bookInventory) * 100;
    const shrinkageAsPercentOfSales = (totalShrinkage / inventoryData.salesPeriod) * 100;
    const annualizedShrinkage = totalShrinkage;
    const inventoryTurnover = inventoryData.salesPeriod / inventoryData.avgInventory;
    const shrinkagePerTurn = totalShrinkage / inventoryTurnover;

    const breakdownTotal = Object.values(shrinkageBreakdown).reduce((a, b) => a + b, 0);
    const breakdownByCategory = Object.entries(shrinkageBreakdown).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      value,
      percentage: (value / breakdownTotal) * 100,
    }));

    const industryBenchmarks = {
      retail: 1.38,
      grocery: 2.5,
      warehouse: 0.5,
      manufacturing: 0.3,
    };

    const comparisonToBenchmark = shrinkageRate - industryBenchmarks.warehouse;

    const preventionROI = {
      securityInvestment: 50000,
      expectedReduction: 40,
      annualSavings: totalShrinkage * 0.4,
      paybackMonths: 50000 / (totalShrinkage * 0.4 / 12),
    };

    return {
      totalShrinkage,
      shrinkageRate,
      shrinkageAsPercentOfSales,
      annualizedShrinkage,
      inventoryTurnover,
      shrinkagePerTurn,
      breakdownByCategory,
      industryBenchmarks,
      comparisonToBenchmark,
      preventionROI,
    };
  }, [inventoryData, shrinkageBreakdown]);

  const trendData = useMemo(() => {
    return [
      { quarter: 'Q1', actual: 2.1, target: 0.5 },
      { quarter: 'Q2', actual: 1.8, target: 0.5 },
      { quarter: 'Q3', actual: 1.5, target: 0.5 },
      { quarter: 'Q4', actual: calculations.shrinkageRate, target: 0.5 },
    ];
  }, [calculations]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
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
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Inventory Shrinkage Calculator
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Analyze, track, and reduce inventory shrinkage losses
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          {[
            { id: 'calculator', label: 'Calculator', icon: Package },
            { id: 'analysis', label: 'Breakdown Analysis', icon: PieChartIcon },
            { id: 'prevention', label: 'Prevention ROI', icon: Shield },
            { id: 'tips', label: 'Prevention Tips', icon: Lightbulb },
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

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Input Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Inventory Data
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Book Inventory Value ($)
                  </label>
                  <input
                    type="number"
                    value={inventoryData.bookInventory}
                    onChange={(e) =>
                      setInventoryData({ ...inventoryData, bookInventory: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Physical Count Value ($)
                  </label>
                  <input
                    type="number"
                    value={inventoryData.physicalCount}
                    onChange={(e) =>
                      setInventoryData({ ...inventoryData, physicalCount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Period Sales ($)
                  </label>
                  <input
                    type="number"
                    value={inventoryData.salesPeriod}
                    onChange={(e) =>
                      setInventoryData({ ...inventoryData, salesPeriod: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Average Inventory ($)
                  </label>
                  <input
                    type="number"
                    value={inventoryData.avgInventory}
                    onChange={(e) =>
                      setInventoryData({ ...inventoryData, avgInventory: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Period (months)
                  </label>
                  <input
                    type="number"
                    value={inventoryData.periodMonths}
                    onChange={(e) =>
                      setInventoryData({ ...inventoryData, periodMonths: parseInt(e.target.value) || 12 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Shrinkage</span>
                </div>
                <div className="text-2xl font-bold text-red-500">
                  {formatCurrency(calculations.totalShrinkage)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Shrinkage Rate</span>
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  {formatPercent(calculations.shrinkageRate)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">% of Sales</span>
                </div>
                <div className="text-2xl font-bold text-purple-500">
                  {formatPercent(calculations.shrinkageAsPercentOfSales)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Inventory Turns</span>
                </div>
                <div className="text-2xl font-bold text-blue-500">
                  {calculations.inventoryTurnover.toFixed(1)}x
                </div>
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className={`p-6 rounded-xl ${
              calculations.comparisonToBenchmark > 0
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            }`}>
              <div className="flex items-center gap-4">
                {calculations.comparisonToBenchmark > 0 ? (
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                ) : (
                  <Shield className="w-8 h-8 text-green-500" />
                )}
                <div>
                  <div className={`font-semibold ${
                    calculations.comparisonToBenchmark > 0 ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'
                  }`}>
                    {calculations.comparisonToBenchmark > 0
                      ? `${formatPercent(Math.abs(calculations.comparisonToBenchmark))} above industry benchmark`
                      : `${formatPercent(Math.abs(calculations.comparisonToBenchmark))} below industry benchmark`}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Industry benchmark for warehouse: {formatPercent(calculations.industryBenchmarks.warehouse)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Breakdown Input */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Shrinkage Breakdown by Category
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(shrinkageBreakdown).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500">$</span>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) =>
                          setShrinkageBreakdown({ ...shrinkageBreakdown, [key]: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Shrinkage by Category
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculations.breakdownByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {calculations.breakdownByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Category Breakdown
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calculations.breakdownByCategory} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => `$${v / 1000}K`} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="value" fill="#0F4C81" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Shrinkage Rate Trend vs Target
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis domain={[0, 3]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#E97451" strokeWidth={2} name="Actual %" />
                    <Line type="monotone" dataKey="target" stroke="#2E8B57" strokeWidth={2} strokeDasharray="5 5" name="Target %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Prevention Tab */}
        {activeTab === 'prevention' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Prevention Investment ROI</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm opacity-80">Investment Required</div>
                  <div className="text-2xl font-bold">{formatCurrency(calculations.preventionROI.securityInvestment)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Expected Reduction</div>
                  <div className="text-2xl font-bold">{calculations.preventionROI.expectedReduction}%</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Annual Savings</div>
                  <div className="text-2xl font-bold">{formatCurrency(calculations.preventionROI.annualSavings)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Payback Period</div>
                  <div className="text-2xl font-bold">{calculations.preventionROI.paybackMonths.toFixed(1)} months</div>
                </div>
              </div>
            </div>

            {/* Prevention Strategies */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Prevention Strategies by Category
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3">Theft Prevention</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li>• CCTV surveillance systems</li>
                    <li>• Access control measures</li>
                    <li>• Random inventory audits</li>
                    <li>• Employee background checks</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-3">Damage Reduction</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li>• Proper storage conditions</li>
                    <li>• Handling training programs</li>
                    <li>• Equipment maintenance</li>
                    <li>• Quality packaging materials</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Administrative Controls</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li>• Barcode/RFID systems</li>
                    <li>• Automated data entry</li>
                    <li>• Regular reconciliation</li>
                    <li>• Process documentation</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">Vendor Fraud Prevention</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li>• Receiving inspections</li>
                    <li>• Weight verification</li>
                    <li>• Supplier audits</li>
                    <li>• Blind receiving processes</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Shrinkage Prevention Best Practices
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Regular Cycle Counts
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Implement daily or weekly cycle counts for high-value items. This catches discrepancies early and identifies problem areas quickly.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Technology Investment
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Barcode scanning and RFID reduce human error. Warehouse management systems provide real-time visibility and automated alerts.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                      Employee Training
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Train staff on proper handling, documentation, and reporting procedures. Create a culture of accountability and ownership.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Root Cause Analysis
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      When shrinkage is detected, investigate root causes. Use findings to implement targeted prevention measures rather than broad solutions.
                    </p>
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
                    q: 'What is considered an acceptable shrinkage rate?',
                    a: 'Industry benchmarks vary: retail averages 1.38%, grocery 2.5%, warehouse/distribution 0.5%, and manufacturing 0.3%. Best-in-class operations achieve rates below these averages through technology and process improvements.',
                  },
                  {
                    q: 'How often should I conduct physical inventory counts?',
                    a: 'Full physical counts are typically done annually for financial reporting. However, cycle counting (partial counts on a rotating schedule) should be done weekly or monthly for ongoing accuracy and early problem detection.',
                  },
                  {
                    q: 'What is the main cause of inventory shrinkage?',
                    a: 'In most warehouses, administrative errors (miscounts, data entry mistakes) are the leading cause, followed by damage and theft. The specific breakdown varies by industry and operation type.',
                  },
                  {
                    q: 'How do I calculate the ROI of shrinkage prevention?',
                    a: 'Compare the cost of prevention measures (equipment, software, training) against the expected reduction in shrinkage losses. Most prevention investments show positive ROI within 6-18 months when properly implemented.',
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
