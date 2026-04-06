'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Container,
  TrendingDown,
  BarChart3,
  DollarSign,
  Calendar,
  Lightbulb,
  HelpCircle,
  Settings,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE'];

interface ContainerInfo {
  type: '20std' | '40std' | '40hc' | '20reefer' | '40reefer' | '20tank' | '40tank';
  age: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  originalValue: number;
  manufacturer: string;
  usage: 'shipping' | 'storage' | 'both';
  maintenanceScore: number;
}

const CONTAINER_PRICES = {
  '20std': { new: 2500, avg: 1800 },
  '40std': { new: 3500, avg: 2500 },
  '40hc': { new: 4500, avg: 3200 },
  '20reefer': { new: 12000, avg: 8000 },
  '40reefer': { new: 18000, avg: 12000 },
  '20tank': { new: 15000, avg: 10000 },
  '40tank': { new: 22000, avg: 15000 },
};

const DEPRECIATION_RATES = {
  shipping: 0.08, // 8% per year
  storage: 0.04, // 4% per year
  both: 0.06,
};

const CONDITION_MULTIPLIERS = {
  excellent: 1.0,
  good: 0.85,
  fair: 0.65,
  poor: 0.40,
};

export default function ContainerResidualValueCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [container, setContainer] = useState<ContainerInfo>({
    type: '40std',
    age: 5,
    condition: 'good',
    originalValue: 3500,
    manufacturer: 'CIMC',
    usage: 'shipping',
    maintenanceScore: 75,
  });
  const [planningYears, setPlanningYears] = useState(10);

  const calculation = useMemo(() => {
    const baseValue = CONTAINER_PRICES[container.type].avg;
    const depreciationRate = DEPRECIATION_RATES[container.usage];
    const conditionMultiplier = CONDITION_MULTIPLIERS[container.condition];
    
    // Adjust depreciation for maintenance
    const adjustedRate = depreciationRate * (1 - (container.maintenanceScore - 50) / 200);
    
    // Calculate current value
    const depreciatedValue = baseValue * Math.pow(1 - adjustedRate, container.age);
    const currentValue = Math.max(depreciatedValue * conditionMultiplier, baseValue * 0.1); // Floor at 10% of avg
    
    // Calculate remaining useful life
    const remainingLife = Math.max(0, Math.ceil(Math.log(0.1) / Math.log(1 - adjustedRate)) - container.age);
    
    // Future value projections
    const projections = [];
    for (let i = 0; i <= planningYears; i++) {
      const futureAge = container.age + i;
      const futureValue = Math.max(
        baseValue * Math.pow(1 - adjustedRate, futureAge) * conditionMultiplier,
        baseValue * 0.1
      );
      projections.push({
        year: i,
        age: futureAge,
        value: Math.round(futureValue),
        depreciation: Math.round(baseValue - futureValue),
      });
    }
    
    // Calculate total cost of ownership
    const annualMaintenance = baseValue * 0.02 * (container.maintenanceScore / 100);
    const totalDepreciation = baseValue - currentValue;
    
    return {
      baseValue,
      currentValue: Math.round(currentValue),
      depreciationRate: adjustedRate * 100,
      remainingLife,
      projections,
      annualMaintenance: Math.round(annualMaintenance),
      totalDepreciation: Math.round(totalDepreciation),
      scrapValue: Math.round(baseValue * 0.1),
      resalePotential: currentValue > baseValue * 0.3 ? 'Good' : currentValue > baseValue * 0.15 ? 'Fair' : 'Poor',
    };
  }, [container, planningYears]);

  const chartData = useMemo(() => {
    return calculation.projections.map((p) => ({
      year: `Year ${p.year}`,
      Value: p.value,
      Age: p.age,
    }));
  }, [calculation]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
              <Container className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Container Residual Value Calculator
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Estimate the remaining value and depreciation of shipping containers
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          {[
            { id: 'calculator', label: 'Calculator', icon: Calculator },
            { id: 'projection', label: 'Value Projection', icon: TrendingDown },
            { id: 'market', label: 'Market Prices', icon: BarChart3 },
            { id: 'tips', label: 'Maintenance Tips', icon: Lightbulb },
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
                Container Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Container Type
                  </label>
                  <select
                    value={container.type}
                    onChange={(e) => setContainer({ ...container, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="20std">20ft Standard</option>
                    <option value="40std">40ft Standard</option>
                    <option value="40hc">40ft High Cube</option>
                    <option value="20reefer">20ft Refrigerated</option>
                    <option value="40reefer">40ft Refrigerated</option>
                    <option value="20tank">20ft Tank</option>
                    <option value="40tank">40ft Tank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={container.age}
                    onChange={(e) => setContainer({ ...container, age: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="30"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Condition
                  </label>
                  <select
                    value={container.condition}
                    onChange={(e) => setContainer({ ...container, condition: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="excellent">Excellent (CSC valid, no repairs)</option>
                    <option value="good">Good (Minor wear, CSC valid)</option>
                    <option value="fair">Fair (Some repairs needed)</option>
                    <option value="poor">Poor (Major repairs required)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Primary Usage
                  </label>
                  <select
                    value={container.usage}
                    onChange={(e) => setContainer({ ...container, usage: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="shipping">Active Shipping</option>
                    <option value="storage">Stationary Storage</option>
                    <option value="both">Mixed Usage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Original Value ($)
                  </label>
                  <input
                    type="number"
                    value={container.originalValue}
                    onChange={(e) => setContainer({ ...container, originalValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Maintenance Score: {container.maintenanceScore}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={container.maintenanceScore}
                    onChange={(e) => setContainer({ ...container, maintenanceScore: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Current Value</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(calculation.currentValue)}</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Depreciation</span>
                </div>
                <div className="text-2xl font-bold text-red-500">{formatCurrency(calculation.totalDepreciation)}</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Depreciation Rate</span>
                </div>
                <div className="text-2xl font-bold text-blue-500">{calculation.depreciationRate.toFixed(1)}%/yr</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Remaining Life</span>
                </div>
                <div className="text-2xl font-bold text-purple-500">{calculation.remainingLife} years</div>
              </div>
            </div>

            {/* Value Summary */}
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Valuation Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm opacity-80">Market Average</div>
                  <div className="text-2xl font-bold">{formatCurrency(calculation.baseValue)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Scrap Value</div>
                  <div className="text-2xl font-bold">{formatCurrency(calculation.scrapValue)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Est. Annual Maintenance</div>
                  <div className="text-2xl font-bold">{formatCurrency(calculation.annualMaintenance)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Resale Potential</div>
                  <div className="text-2xl font-bold">{calculation.resalePotential}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Projection Tab */}
        {activeTab === 'projection' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Value Projection Over Time
                </h3>
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-300 mr-2">Years to Project:</label>
                  <input
                    type="number"
                    value={planningYears}
                    onChange={(e) => setPlanningYears(parseInt(e.target.value) || 10)}
                    min="1"
                    max="25"
                    className="w-16 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Value"
                      stroke="#0F4C81"
                      fill="#0F4C81"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Projection Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Year-by-Year Breakdown
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">Year</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">Age</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">Estimated Value</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">Cumulative Depreciation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {calculation.projections.slice(0, 11).map((p) => (
                      <tr key={p.year} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-slate-800 dark:text-white">Year {p.year}</td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{p.age}</td>
                        <td className="px-4 py-3 text-center font-medium text-green-600">{formatCurrency(p.value)}</td>
                        <td className="px-4 py-3 text-center text-red-500">{formatCurrency(p.depreciation)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Market Prices Tab */}
        {activeTab === 'market' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Container Market Price Reference
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">Container Type</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">New Price</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">Used Avg (5yr)</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">Depreciation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {Object.entries(CONTAINER_PRICES).map(([type, prices]) => (
                      <tr key={type} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">
                          {type === '20std' && '20ft Standard'}
                          {type === '40std' && '40ft Standard'}
                          {type === '40hc' && '40ft High Cube'}
                          {type === '20reefer' && '20ft Refrigerated'}
                          {type === '40reefer' && '40ft Refrigerated'}
                          {type === '20tank' && '20ft Tank'}
                          {type === '40tank' && '40ft Tank'}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{formatCurrency(prices.new)}</td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{formatCurrency(prices.avg)}</td>
                        <td className="px-4 py-3 text-center text-red-500">
                          {(((prices.new - prices.avg) / prices.new) * 100).toFixed(0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                * Prices are approximate and vary by region, condition, and market conditions.
              </p>
            </div>

            {/* Price Comparison Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Price Comparison by Type
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(CONTAINER_PRICES).map(([type, prices]) => ({
                      name: type.replace('std', ' Std').replace('hc', ' HC').replace('reefer', ' Reef').replace('tank', ' Tank'),
                      New: prices.new,
                      Used: prices.avg,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="New" fill="#0F4C81" />
                    <Bar dataKey="Used" fill="#2E8B57" />
                  </BarChart>
                </ResponsiveContainer>
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
                Container Maintenance Tips
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Regular Inspections
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                      <li>• Inspect for corrosion monthly</li>
                      <li>• Check door seals and gaskets</li>
                      <li>• Verify CSC plate validity</li>
                      <li>• Document all findings</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Corrosion Prevention
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                      <li>• Touch up paint on scratches</li>
                      <li>• Apply rust inhibitor to floor</li>
                      <li>• Keep container elevated from ground</li>
                      <li>• Ensure proper ventilation</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                      Floor Maintenance
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                      <li>• Check for soft spots monthly</li>
                      <li>• Replace damaged boards promptly</li>
                      <li>• Clean spills immediately</li>
                      <li>• Avoid overloading beyond capacity</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Maximizing Resale Value
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                      <li>• Maintain CSC certification</li>
                      <li>• Keep complete maintenance records</li>
                      <li>• Repair dents before they rust</li>
                      <li>• Store in covered area when possible</li>
                    </ul>
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
                    q: 'What factors affect container value most?',
                    a: 'Age, condition, and CSC certification are primary factors. Type matters significantly (reefers and tanks cost more). Usage history and maintenance records also impact value.',
                  },
                  {
                    q: 'What is a CSC plate?',
                    a: 'CSC (Convention for Safe Containers) plate certifies that a container meets international safety standards. Valid CSC is essential for shipping and significantly affects resale value.',
                  },
                  {
                    q: 'How long do shipping containers last?',
                    a: 'With proper maintenance, shipping containers can last 20-25 years in active service. Storage-only containers can last even longer. CSC certification typically needs renewal every 30 months.',
                  },
                  {
                    q: 'When should I consider selling a container?',
                    a: 'Consider selling when maintenance costs exceed 10% of remaining value, when CSC renewal requires major repairs, or when market prices are favorable. Most owners sell around 12-15 years.',
                  },
                  {
                    q: 'How accurate are depreciation calculations?',
                    a: 'These calculations provide estimates based on typical depreciation rates. Actual value depends on market conditions, regional demand, and specific container condition. Get professional appraisal for accurate valuation.',
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
