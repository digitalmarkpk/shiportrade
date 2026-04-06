'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Ship,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  Info,
  TrendingUp,
  BarChart3,
  FileText,
  Lightbulb,
  HelpCircle,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347'];

interface DetentionPeriod {
  startDate: string;
  endDate: string;
  containerType: 'dry' | 'reefer' | 'tank' | 'special';
  containerSize: '20ft' | '40ft' | '40hc';
  freeDays: number;
  dailyRate: number;
}

export default function DetentionCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [detentionPeriods, setDetentionPeriods] = useState<DetentionPeriod[]>([
    {
      startDate: '',
      endDate: '',
      containerType: 'dry',
      containerSize: '40ft',
      freeDays: 5,
      dailyRate: 75,
    },
  ]);
  const [gracePeriodEnabled, setGracePeriodEnabled] = useState(true);
  const [weekendExclusion, setWeekendExclusion] = useState(false);
  const [holidayExclusion, setHolidayExclusion] = useState(false);

  const containerRates = {
    dry: { '20ft': 50, '40ft': 75, '40hc': 85 },
    reefer: { '20ft': 100, '40ft': 150, '40hc': 175 },
    tank: { '20ft': 125, '40ft': 175, '40hc': 200 },
    special: { '20ft': 100, '40ft': 150, '40hc': 175 },
  };

  const freeDaysDefaults = {
    dry: 5,
    reefer: 3,
    tank: 4,
    special: 4,
  };

  const addDetentionPeriod = () => {
    setDetentionPeriods([
      ...detentionPeriods,
      {
        startDate: '',
        endDate: '',
        containerType: 'dry',
        containerSize: '40ft',
        freeDays: 5,
        dailyRate: 75,
      },
    ]);
  };

  const removeDetentionPeriod = (index: number) => {
    setDetentionPeriods(detentionPeriods.filter((_, i) => i !== index));
  };

  const updateDetentionPeriod = (
    index: number,
    field: keyof DetentionPeriod,
    value: string | number
  ) => {
    const updated = [...detentionPeriods];
    (updated[index] as any)[field] = value;

    // Auto-adjust rates based on container type/size
    if (field === 'containerType' || field === 'containerSize') {
      const type = field === 'containerType' ? value : updated[index].containerType;
      const size = field === 'containerSize' ? value : updated[index].containerSize;
      updated[index].dailyRate = containerRates[type as keyof typeof containerRates][
        size as keyof (typeof containerRates.dry)
      ];
      if (field === 'containerType') {
        updated[index].freeDays = freeDaysDefaults[value as keyof typeof freeDaysDefaults];
      }
    }

    setDetentionPeriods(updated);
  };

  const totalCalculation = useMemo(() => {
    const calculateDetention = (period: DetentionPeriod) => {
      if (!period.startDate || !period.endDate) {
        return { days: 0, chargeableDays: 0, cost: 0 };
      }

      const start = new Date(period.startDate);
      const end = new Date(period.endDate);
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      let chargeableDays = totalDays - period.freeDays;

      // Apply adjustments
      if (gracePeriodEnabled && chargeableDays > 0) {
        chargeableDays = Math.max(0, chargeableDays - 1); // 1 day grace
      }

      if (weekendExclusion) {
        // Rough estimate: subtract ~2/7 of days for weekends
        const weekendDays = Math.floor(chargeableDays * (2 / 7));
        chargeableDays = Math.max(0, chargeableDays - weekendDays);
      }

      if (holidayExclusion) {
        chargeableDays = Math.max(0, chargeableDays - 2); // Assume 2 holidays
      }

      const cost = Math.max(0, chargeableDays) * period.dailyRate;

      return { days: totalDays, chargeableDays: Math.max(0, chargeableDays), cost };
    };

    const results = detentionPeriods.map((period) => ({
      period,
      calculation: calculateDetention(period),
    }));

    const totalCost = results.reduce((sum, r) => sum + r.calculation.cost, 0);
    const totalChargeableDays = results.reduce((sum, r) => sum + r.calculation.chargeableDays, 0);
    const totalDays = results.reduce((sum, r) => sum + r.calculation.days, 0);

    return { results, totalCost, totalChargeableDays, totalDays };
  }, [detentionPeriods, gracePeriodEnabled, weekendExclusion, holidayExclusion]);

  const chartData = useMemo(() => {
    return totalCalculation.results
      .filter((r) => r.calculation.days > 0)
      .map((r, i) => ({
        name: `Container ${i + 1}`,
        'Total Days': r.calculation.days,
        'Free Days': r.period.freeDays,
        'Chargeable Days': r.calculation.chargeableDays,
        Cost: r.calculation.cost,
      }));
  }, [totalCalculation]);

  const costBreakdownData = useMemo(() => {
    const byType: Record<string, number> = {};
    totalCalculation.results.forEach((r) => {
      const type = r.period.containerType;
      byType[type] = (byType[type] || 0) + r.calculation.cost;
    });
    return Object.entries(byType).map(([name, value]) => ({ name, value }));
  }, [totalCalculation]);

  const savingsAnalysis = useMemo(() => {
    const potentialSavings = 0;
    const recommendations: string[] = [];

    if (weekendExclusion) {
      recommendations.push('Weekend exclusion could reduce charges by ~28%');
    }
    if (gracePeriodEnabled) {
      recommendations.push('Grace period saves 1 day of charges');
    }
    if (totalCalculation.totalChargeableDays > 7) {
      recommendations.push('Consider negotiating additional free days for long-term usage');
    }
    if (totalCalculation.totalCost > 1000) {
      recommendations.push('Volume discount may apply - contact carrier for negotiations');
    }

    return recommendations;
  }, [totalCalculation, weekendExclusion, gracePeriodEnabled]);

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
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Detention Calculator
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Calculate container detention charges and optimize free time usage
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
            { id: 'analysis', label: 'Cost Analysis', icon: BarChart3 },
            { id: 'comparison', label: 'Demurrage vs Detention', icon: TrendingUp },
            { id: 'tips', label: 'Pro Tips', icon: Lightbulb },
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
            {/* Settings Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Calculation Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gracePeriodEnabled}
                    onChange={(e) => setGracePeriodEnabled(e.target.checked)}
                    className="w-5 h-5 rounded text-[#0F4C81]"
                  />
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">
                      Grace Period (1 Day)
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      First chargeable day waived
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weekendExclusion}
                    onChange={(e) => setWeekendExclusion(e.target.checked)}
                    className="w-5 h-5 rounded text-[#0F4C81]"
                  />
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">
                      Exclude Weekends
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Saturdays & Sundays not counted
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={holidayExclusion}
                    onChange={(e) => setHolidayExclusion(e.target.checked)}
                    className="w-5 h-5 rounded text-[#0F4C81]"
                  />
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">
                      Exclude Holidays
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Public holidays not counted
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Container Periods */}
            {detentionPeriods.map((period, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <Ship className="w-5 h-5 text-[#0F4C81]" />
                    Container {index + 1}
                  </h3>
                  {detentionPeriods.length > 1 && (
                    <button
                      onClick={() => removeDetentionPeriod(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Start Date (Empty Return Due)
                    </label>
                    <input
                      type="date"
                      value={period.startDate}
                      onChange={(e) => updateDetentionPeriod(index, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-[#0F4C81]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      End Date (Actual Return)
                    </label>
                    <input
                      type="date"
                      value={period.endDate}
                      onChange={(e) => updateDetentionPeriod(index, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-[#0F4C81]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Container Type
                    </label>
                    <select
                      value={period.containerType}
                      onChange={(e) => updateDetentionPeriod(index, 'containerType', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-[#0F4C81]"
                    >
                      <option value="dry">Dry Container</option>
                      <option value="reefer">Reefer Container</option>
                      <option value="tank">Tank Container</option>
                      <option value="special">Special Container</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Container Size
                    </label>
                    <select
                      value={period.containerSize}
                      onChange={(e) => updateDetentionPeriod(index, 'containerSize', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-[#0F4C81]"
                    >
                      <option value="20ft">20ft</option>
                      <option value="40ft">40ft</option>
                      <option value="40hc">40ft High Cube</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Free Days
                    </label>
                    <input
                      type="number"
                      value={period.freeDays}
                      onChange={(e) => updateDetentionPeriod(index, 'freeDays', parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-[#0F4C81]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Daily Rate ($)
                    </label>
                    <input
                      type="number"
                      value={period.dailyRate}
                      onChange={(e) => updateDetentionPeriod(index, 'dailyRate', parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-[#0F4C81]"
                    />
                  </div>
                </div>

                {/* Individual Result */}
                {period.startDate && period.endDate && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Total Days</div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white">
                          {calculateDetention(period).days}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Free Days Used</div>
                        <div className="text-xl font-bold text-green-600">
                          {Math.min(period.freeDays, calculateDetention(period).days)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Chargeable Days</div>
                        <div className="text-xl font-bold text-orange-500">
                          {calculateDetention(period).chargeableDays}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Detention Cost</div>
                        <div className="text-xl font-bold text-red-500">
                          {formatCurrency(calculateDetention(period).cost)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            <button
              onClick={addDetentionPeriod}
              className="w-full py-3 border-2 border-dashed border-[#0F4C81] text-[#0F4C81] rounded-xl hover:bg-[#0F4C81] hover:text-white transition-all font-medium"
            >
              + Add Another Container
            </button>

            {/* Total Summary */}
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Total Detention Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm opacity-80">Containers</div>
                  <div className="text-3xl font-bold">{detentionPeriods.length}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Total Days</div>
                  <div className="text-3xl font-bold">{totalCalculation.totalDays}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Chargeable Days</div>
                  <div className="text-3xl font-bold">{totalCalculation.totalChargeableDays}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Total Cost</div>
                  <div className="text-3xl font-bold">{formatCurrency(totalCalculation.totalCost)}</div>
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
            {/* Cost by Container */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Days & Cost by Container
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" />
                    <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="Chargeable Days" fill="#E97451" />
                    <Bar yAxisId="left" dataKey="Free Days" fill="#2E8B57" />
                    <Bar yAxisId="right" dataKey="Cost" fill="#0F4C81" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost by Container Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Cost by Container Type
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {costBreakdownData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Cost Optimization Tips
                </h3>
                <div className="space-y-3">
                  {savingsAnalysis.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <Lightbulb className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{tip}</span>
                    </div>
                  ))}
                  {savingsAnalysis.length === 0 && (
                    <div className="text-slate-500 dark:text-slate-400 text-center py-4">
                      Enter container dates to see optimization tips
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rate Reference Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Standard Detention Rates Reference
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">
                        Container Type
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                        20ft Rate/Day
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                        40ft Rate/Day
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                        40HC Rate/Day
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">
                        Typical Free Days
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr>
                      <td className="px-4 py-3 text-slate-800 dark:text-white">Dry Container</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$50</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$75</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$85</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">5-7</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-800 dark:text-white">Reefer Container</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$100</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$150</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$175</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">3-5</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-800 dark:text-white">Tank Container</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$125</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$175</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$200</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">4-5</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-800 dark:text-white">Special Container</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$100</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$150</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">$175</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">4-5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                * Rates are approximate and vary by carrier, route, and season. Always confirm with your shipping line.
              </p>
            </div>
          </motion.div>
        )}

        {/* Demurrage vs Detention Tab */}
        {activeTab === 'comparison' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                Understanding Demurrage vs Detention
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                    Demurrage
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Charges applied when a full container stays at the port terminal longer than the allowed free days before being picked up.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Applies to IMPORT full containers
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Clock starts: Container discharged
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Clock ends: Container gate-out
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Charged by: Port terminal
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
                    Detention
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Charges applied when an empty container is not returned to the designated depot within the allowed free days.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Applies to EMPTY containers
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Clock starts: Container gate-out (full)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Clock ends: Empty return to depot
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Charged by: Shipping line
                    </li>
                  </ul>
                </div>
              </div>

              {/* Timeline Visual */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Container Lifecycle Timeline
                </h4>
                <div className="relative">
                  <div className="absolute left-0 right-0 top-6 h-2 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                  <div className="flex justify-between relative">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-2 relative z-10">
                        1
                      </div>
                      <div className="text-sm font-medium text-slate-800 dark:text-white">Arrival</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Discharge</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-2 relative z-10">
                        2
                      </div>
                      <div className="text-sm font-medium text-slate-800 dark:text-white">Free Days</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Demurrage Free</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mb-2 relative z-10">
                        3
                      </div>
                      <div className="text-sm font-medium text-slate-800 dark:text-white">Gate Out</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Pickup Full</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2 relative z-10">
                        4
                      </div>
                      <div className="text-sm font-medium text-slate-800 dark:text-white">Free Days</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Detention Free</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mb-2 relative z-10">
                        5
                      </div>
                      <div className="text-sm font-medium text-slate-800 dark:text-white">Return</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Empty Depot</div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-200 dark:bg-blue-700 rounded"></div>
                      <span className="text-slate-600 dark:text-slate-300">Demurrage Period</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-200 dark:bg-green-700 rounded"></div>
                      <span className="text-slate-600 dark:text-slate-300">Detention Period</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Combined Storage Calculator */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Combined Storage Cost Estimator
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Use both Demurrage and Detention calculators together for a complete picture of potential storage charges.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Average Demurrage</div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">$150-300/day</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Per container at port</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Average Detention</div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">$50-175/day</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Per container off-port</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pro Tips Tab */}
        {activeTab === 'tips' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Pro Tips to Minimize Detention Charges
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Plan Container Returns in Advance
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Before cargo arrival, identify the nearest empty return depot and plan your trucking schedule. Knowing the return location saves hours of searching and helps avoid last-minute delays.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Negotiate Extended Free Time
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      For regular shipments, negotiate additional free days (7-14 days) in your service contract. Carriers often provide better terms for volume commitments.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                      Use Per Diem Insurance
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Some marine insurance policies cover container detention charges. This can be valuable protection against unexpected delays due to customs holds or documentation issues.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Track Free Days Expiry
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Set up automated alerts 3 days before free time expires. This gives you time to expedite returns or request extensions before charges begin accumulating.
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      Document Everything
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Keep photos and receipts of container condition and return timestamps. Disputes over return dates are common, and documentation helps resolve billing discrepancies.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                    <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">
                      Consider Street Turns
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      A "street turn" reuses an import container for an export load, avoiding empty return trips. This saves time, money, and reduces detention risk.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                Common Mistakes to Avoid
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">Confusing Demurrage with Detention</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      These are separate charges with different free time periods. Demurrage applies at the port, detention applies after gate-out. Track both independently.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">Not Checking Return Depot Location</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Return depots may be different from pickup locations. Always verify the designated return depot to avoid extra transportation costs and time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">Ignoring Holiday Schedules</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Free days often don't include weekends and holidays, but this varies by carrier and port. Check specific terms to avoid surprises.
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
                    q: 'What is detention in shipping?',
                    a: 'Detention is a charge applied by shipping lines when an empty container is not returned to the designated depot within the allowed free time period. Unlike demurrage (which applies to containers sitting at the port), detention applies after the container has left the port terminal.',
                  },
                  {
                    q: 'How many free days do I typically get?',
                    a: 'Standard free time ranges from 3-7 days for detention, depending on container type and carrier. Dry containers usually get 5-7 days, reefers 3-5 days, and special equipment 4-5 days. Always check your specific contract terms.',
                  },
                  {
                    q: 'Can I get detention charges waived?',
                    a: 'Waivers are sometimes possible for documented force majeure events, carrier errors, or port/terminal issues. Submit a formal dispute with supporting documentation. Having a strong carrier relationship helps, but success rates vary significantly.',
                  },
                  {
                    q: 'Do weekends count toward free days?',
                    a: 'It depends on the carrier and contract terms. Some carriers include weekends in free time calculations, while others exclude them (known as "working days"). Check your specific agreement or contact your carrier for clarification.',
                  },
                  {
                    q: 'What happens if I dispute detention charges?',
                    a: 'File a written dispute with the carrier within 30 days, including all supporting documentation (delivery receipts, photos, correspondence). The carrier will review and may offer a reduction or waiver. Unresolved disputes can be escalated to the Federal Maritime Commission.',
                  },
                  {
                    q: 'How can I track multiple containers at once?',
                    a: 'Use this calculator to add multiple containers with their respective dates and rates. The tool will calculate total charges across all containers. For ongoing operations, consider integrating with carrier APIs or using a transportation management system (TMS).',
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                  >
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
                      {faq.q}
                    </h4>
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

// Missing import
function Settings({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
