'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  BarChart3,
  Lightbulb,
  HelpCircle,
  Percent,
  Calendar,
  Building,
  Info,
  ArrowRight,
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
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347'];

interface FinanceOption {
  id: string;
  name: string;
  type: 'lc' | 'factoring' | 'forfaiting' | 'supply_chain' | 'credit';
  principal: number;
  interestRate: number;
  fees: number;
  term: number; // days
  advanceRate: number;
}

export default function TradeFinanceAPRCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [financeOptions, setFinanceOptions] = useState<FinanceOption[]>([
    { id: '1', name: 'Letter of Credit', type: 'lc', principal: 100000, interestRate: 5.5, fees: 1500, term: 90, advanceRate: 100 },
    { id: '2', name: 'Invoice Factoring', type: 'factoring', principal: 75000, interestRate: 2.5, fees: 2250, term: 45, advanceRate: 85 },
  ]);

  const calculations = useMemo(() => {
    return financeOptions.map((option) => {
      const actualAdvance = option.principal * (option.advanceRate / 100);
      const interestCost = (option.principal * option.interestRate * option.term) / (100 * 365);
      const totalCost = interestCost + option.fees;
      const effectiveRate = (totalCost / actualAdvance) * (365 / option.term) * 100;
      const totalRepayment = actualAdvance + totalCost;
      
      return {
        ...option,
        actualAdvance,
        interestCost,
        totalCost,
        effectiveRate,
        totalRepayment,
        dailyCost: totalCost / option.term,
      };
    });
  }, [financeOptions]);

  const comparisonData = useMemo(() => {
    return calculations.map((calc) => ({
      name: calc.name.substring(0, 15),
      Principal: calc.principal,
      Interest: calc.interestCost,
      Fees: calc.fees,
      APR: calc.effectiveRate,
    }));
  }, [calculations]);

  const addOption = () => {
    setFinanceOptions([
      ...financeOptions,
      {
        id: Date.now().toString(),
        name: 'New Option',
        type: 'credit',
        principal: 50000,
        interestRate: 6.0,
        fees: 500,
        term: 60,
        advanceRate: 100,
      },
    ]);
  };

  const updateOption = (id: string, field: keyof FinanceOption, value: any) => {
    setFinanceOptions(
      financeOptions.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    );
  };

  const removeOption = (id: string) => {
    if (financeOptions.length > 1) {
      setFinanceOptions(financeOptions.filter((opt) => opt.id !== id));
    }
  };

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
              <Percent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Trade Finance APR Calculator
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Compare true costs and effective APR across trade finance options
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
            { id: 'comparison', label: 'Comparison', icon: BarChart3 },
            { id: 'guide', label: 'Finance Guide', icon: Info },
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
            {financeOptions.map((option, index) => {
              const calc = calculations.find((c) => c.id === option.id)!;
              return (
                <div
                  key={option.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <Building className="w-5 h-5 text-[#0F4C81]" />
                      Finance Option {index + 1}
                    </h3>
                    {financeOptions.length > 1 && (
                      <button
                        onClick={() => removeOption(option.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Option Name
                      </label>
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Finance Type
                      </label>
                      <select
                        value={option.type}
                        onChange={(e) => updateOption(option.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      >
                        <option value="lc">Letter of Credit</option>
                        <option value="factoring">Invoice Factoring</option>
                        <option value="forfaiting">Forfaiting</option>
                        <option value="supply_chain">Supply Chain Finance</option>
                        <option value="credit">Trade Credit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Principal Amount ($)
                      </label>
                      <input
                        type="number"
                        value={option.principal}
                        onChange={(e) => updateOption(option.id, 'principal', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Interest Rate (% annual)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={option.interestRate}
                        onChange={(e) => updateOption(option.id, 'interestRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Fees ($)
                      </label>
                      <input
                        type="number"
                        value={option.fees}
                        onChange={(e) => updateOption(option.id, 'fees', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Term (days)
                      </label>
                      <input
                        type="number"
                        value={option.term}
                        onChange={(e) => updateOption(option.id, 'term', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Advance Rate (%)
                      </label>
                      <input
                        type="number"
                        value={option.advanceRate}
                        onChange={(e) => updateOption(option.id, 'advanceRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Results */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Actual Advance</div>
                        <div className="text-xl font-bold text-[#0F4C81] dark:text-white">
                          {formatCurrency(calc.actualAdvance)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Interest Cost</div>
                        <div className="text-xl font-bold text-orange-500">
                          {formatCurrency(calc.interestCost)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Total Cost</div>
                        <div className="text-xl font-bold text-red-500">
                          {formatCurrency(calc.totalCost)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Effective APR</div>
                        <div className="text-xl font-bold text-green-600">
                          {formatPercent(calc.effectiveRate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Total Repayment</div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white">
                          {formatCurrency(calc.totalRepayment)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Daily Cost</div>
                        <div className="text-xl font-bold text-purple-500">
                          {formatCurrency(calc.dailyCost)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={addOption}
              className="w-full py-3 border-2 border-dashed border-[#0F4C81] text-[#0F4C81] rounded-xl hover:bg-[#0F4C81] hover:text-white transition-all font-medium"
            >
              + Add Finance Option
            </button>
          </motion.div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* APR Comparison */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                APR Comparison
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="Principal" fill="#0F4C81" name="Principal ($)" />
                    <Bar yAxisId="left" dataKey="Interest" fill="#E97451" name="Interest ($)" />
                    <Bar yAxisId="left" dataKey="Fees" fill="#FFB347" name="Fees ($)" />
                    <Line yAxisId="right" type="monotone" dataKey="APR" stroke="#2E8B57" strokeWidth={3} name="APR %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Total Cost Breakdown
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculations.map((c) => ({ name: c.name, value: c.totalCost }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name.substring(0, 10)} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {calculations.map((_, index) => (
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
                  Best Option Summary
                </h3>
                {(() => {
                  const best = calculations.reduce((a, b) => (a.effectiveRate < b.effectiveRate ? a : b));
                  return (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-sm text-slate-600 dark:text-slate-300">Lowest APR</div>
                        <div className="text-xl font-bold text-green-700 dark:text-green-300">{best.name}</div>
                        <div className="text-2xl font-bold text-green-600">{formatPercent(best.effectiveRate)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Advance</div>
                          <div className="font-bold text-slate-800 dark:text-white">{formatCurrency(best.actualAdvance)}</div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Total Cost</div>
                          <div className="font-bold text-slate-800 dark:text-white">{formatCurrency(best.totalCost)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}

        {/* Guide Tab */}
        {activeTab === 'guide' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                Trade Finance Options Explained
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Letter of Credit (LC)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Bank guarantee of payment to seller upon meeting documentary requirements.
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <li>• Typical costs: 0.5-2% of value + fees</li>
                    <li>• Best for: New trading relationships</li>
                    <li>• Terms: 30-180 days</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                    Invoice Factoring
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Selling receivables at a discount to improve cash flow.
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <li>• Typical costs: 1-5% of invoice value</li>
                    <li>• Best for: Working capital needs</li>
                    <li>• Advance: 70-90% of invoice</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                    Forfaiting
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Purchase of medium-term receivables without recourse.
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <li>• Typical costs: Fixed discount rate</li>
                    <li>• Best for: Capital goods exports</li>
                    <li>• Terms: 180 days to 7 years</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                    Supply Chain Finance
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Buyer-backed financing for suppliers at favorable rates.
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <li>• Typical costs: Based on buyer credit</li>
                    <li>• Best for: Established supply chains</li>
                    <li>• Rates: Often lower than standalone</li>
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
                Pro Tips for Trade Finance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Compare True APR
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Always calculate effective APR including all fees. A lower nominal rate with high fees may cost more than a higher rate with minimal fees.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Negotiate Fees
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Bank fees are often negotiable. Ask for fee waivers on LC amendments, presentations, and other charges.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                      Match Finance to Cash Cycle
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Align finance terms with your cash conversion cycle. Over-financing increases costs unnecessarily.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Consider Currency
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Finance in the invoice currency to avoid FX costs, or use FX-hedged products when necessary.
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
                    q: 'What is APR vs nominal rate?',
                    a: 'Nominal rate is the stated annual interest rate. APR (Annual Percentage Rate) includes all fees and charges, giving you the true annual cost. APR is always higher than or equal to the nominal rate.',
                  },
                  {
                    q: 'How is effective APR calculated?',
                    a: 'Effective APR = (Total Cost ÷ Actual Advance) × (365 ÷ Term) × 100. This annualizes the cost and accounts for advance rates less than 100%.',
                  },
                  {
                    q: 'Why do advance rates matter?',
                    a: 'A lower advance rate means you receive less cash upfront but may still pay fees on the full invoice amount. This increases your effective cost. An 85% advance with 2% fee costs more than 100% advance with same fee.',
                  },
                  {
                    q: 'When should I use factoring vs LC?',
                    a: 'Use factoring when you need quick working capital and have reliable customers. Use LC for new trading relationships, high-value transactions, or when buyer/seller require payment security.',
                  },
                  {
                    q: 'Can I combine multiple finance products?',
                    a: 'Yes, many companies use LC for purchases and factoring for receivables. Consider your entire cash flow cycle to optimize costs. Avoid overlapping coverage that increases total costs.',
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
