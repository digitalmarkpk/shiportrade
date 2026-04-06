'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Package,
  BarChart3,
  Info,
  Lightbulb,
  HelpCircle,
  Scale,
  Truck,
  AlertTriangle,
  DollarSign,
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
} from 'recharts';

const FREIGHT_CLASSES = [
  { class: '50', densityRange: [50, Infinity], description: 'Clean freight, very high density', examples: 'Batteries, bricks, cement' },
  { class: '55', densityRange: [35, 50], description: 'High density, durable goods', examples: 'Bricks, cement, hardwood flooring' },
  { class: '60', densityRange: [30, 35], description: 'High density items', examples: 'Auto parts, tile, machinery' },
  { class: '65', densityRange: [22.5, 30], description: 'Moderate-high density', examples: 'Bottled beverages, books' },
  { class: '70', densityRange: [15, 22.5], description: 'Moderate density', examples: 'Canned goods, metal parts' },
  { class: '77.5', densityRange: [13.5, 15], description: 'Medium density', examples: 'Appliances, furniture' },
  { class: '85', densityRange: [12, 13.5], description: 'Medium-low density', examples: 'Crated machinery, cabinets' },
  { class: '92.5', densityRange: [10.5, 12], description: 'Low-medium density', examples: 'Computers, monitors' },
  { class: '100', densityRange: [9, 10.5], description: 'Low density', examples: 'Boat covers, canvas' },
  { class: '110', densityRange: [8, 9], description: 'Low density items', examples: 'Cabinets, framed artwork' },
  { class: '125', densityRange: [7, 8], description: 'Very low density', examples: 'Small household appliances' },
  { class: '150', densityRange: [6, 7], description: 'Very low density', examples: 'Auto sheet metal, bookcases' },
  { class: '175', densityRange: [4, 6], description: 'Extremely low density', examples: 'Clothing, stuffed furniture' },
  { class: '200', densityRange: [3, 4], description: 'Extremely low density', examples: 'Airplane parts, aluminum' },
  { class: '250', densityRange: [2, 3], description: 'Ultra low density', examples: 'Bamboo furniture, mattresses' },
  { class: '300', densityRange: [1, 2], description: 'Ultra low density', examples: 'Light fixtures, ping pong tables' },
  { class: '400', densityRange: [0, 1], description: 'Lowest density', examples: 'Ping pong balls, expansion foam' },
];

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347'];

interface ShipmentItem {
  id: string;
  description: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  palletized: boolean;
}

export default function FreightClassDensityCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [items, setItems] = useState<ShipmentItem[]>([
    { id: '1', description: 'Product A', length: 48, width: 40, height: 36, weight: 500, quantity: 1, palletized: true },
  ]);
  const [ratePerCWT, setRatePerCWT] = useState(25.00);
  const [showNMFC, setShowNMFC] = useState(false);

  const calculateItemDensity = (item: ShipmentItem) => {
    const volumeCubicFt = (item.length * item.width * item.height) / 1728;
    const totalWeight = item.weight * item.quantity;
    const density = totalWeight / volumeCubicFt;
    return { volumeCubicFt, totalWeight, density };
  };

  const determineFreightClass = (density: number): string => {
    for (const fc of FREIGHT_CLASSES) {
      if (density >= fc.densityRange[0] && density < fc.densityRange[1]) {
        return fc.class;
      }
      if (density >= fc.densityRange[0] && fc.densityRange[1] === Infinity) {
        return fc.class;
      }
    }
    return '400';
  };

  const calculations = useMemo(() => {
    const itemResults = items.map((item) => {
      const { volumeCubicFt, totalWeight, density } = calculateItemDensity(item);
      const freightClass = determineFreightClass(density);
      const cwt = totalWeight / 100;
      const estimatedCost = cwt * ratePerCWT * (1 + (parseFloat(freightClass) - 50) / 100);

      return {
        ...item,
        volumeCubicFt,
        totalWeight,
        density,
        freightClass,
        cwt,
        estimatedCost,
      };
    });

    const totalVolume = itemResults.reduce((sum, item) => sum + item.volumeCubicFt, 0);
    const totalWeight = itemResults.reduce((sum, item) => sum + item.totalWeight, 0);
    const overallDensity = totalWeight / totalVolume;
    const totalCWT = totalWeight / 100;
    const totalCost = itemResults.reduce((sum, item) => sum + item.estimatedCost, 0);

    return { itemResults, totalVolume, totalWeight, overallDensity, totalCWT, totalCost };
  }, [items, ratePerCWT]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: `Product ${String.fromCharCode(65 + items.length)}`,
        length: 48,
        width: 40,
        height: 36,
        weight: 500,
        quantity: 1,
        palletized: true,
      },
    ]);
  };

  const updateItem = (id: string, field: keyof ShipmentItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const chartData = useMemo(() => {
    return calculations.itemResults.map((item) => ({
      name: item.description,
      Density: item.density.toFixed(2),
      Weight: item.totalWeight,
      Volume: item.volumeCubicFt.toFixed(1),
      Class: parseFloat(item.freightClass),
    }));
  }, [calculations]);

  const classDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    calculations.itemResults.forEach((item) => {
      counts[item.freightClass] = (counts[item.freightClass] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: `Class ${name}`, value }));
  }, [calculations]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Freight Class Density Calculator
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Determine NMFC freight class based on shipment density for accurate LTL pricing
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
            { id: 'results', label: 'Results', icon: BarChart3 },
            { id: 'classes', label: 'Freight Classes', icon: Package },
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
            {/* Rate Input */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Rate Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Base Rate per CWT ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ratePerCWT}
                    onChange={(e) => setRatePerCWT(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNMFC}
                    onChange={(e) => setShowNMFC(e.target.checked)}
                    className="w-5 h-5 rounded text-[#0F4C81]"
                  />
                  <span className="text-slate-700 dark:text-slate-300">Show NMFC Item Numbers</span>
                </label>
              </div>
            </div>

            {/* Items */}
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#0F4C81]" />
                    Item {index + 1}: {item.description}
                  </h3>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Length (inches)
                    </label>
                    <input
                      type="number"
                      value={item.length}
                      onChange={(e) => updateItem(item.id, 'length', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Width (inches)
                    </label>
                    <input
                      type="number"
                      value={item.width}
                      onChange={(e) => updateItem(item.id, 'width', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Height (inches)
                    </label>
                    <input
                      type="number"
                      value={item.height}
                      onChange={(e) => updateItem(item.id, 'height', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={item.weight}
                      onChange={(e) => updateItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.palletized}
                        onChange={(e) => updateItem(item.id, 'palletized', e.target.checked)}
                        className="w-4 h-4 rounded text-[#0F4C81]"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Palletized</span>
                    </label>
                  </div>
                </div>

                {/* Item Result Preview */}
                {(() => {
                  const { density } = calculateItemDensity(item);
                  const freightClass = determineFreightClass(density);
                  return (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Density</div>
                          <div className="text-xl font-bold text-[#0F4C81] dark:text-white">
                            {density.toFixed(2)} lb/ft³
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Freight Class</div>
                          <div className="text-xl font-bold text-green-600">{freightClass}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Volume</div>
                          <div className="text-xl font-bold text-slate-800 dark:text-white">
                            {((item.length * item.width * item.height) / 1728).toFixed(2)} ft³
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Total Weight</div>
                          <div className="text-xl font-bold text-slate-800 dark:text-white">
                            {(item.weight * item.quantity).toLocaleString()} lbs
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}

            <button
              onClick={addItem}
              className="w-full py-3 border-2 border-dashed border-[#0F4C81] text-[#0F4C81] rounded-xl hover:bg-[#0F4C81] hover:text-white transition-all font-medium"
            >
              + Add Another Item
            </button>

            {/* Total Summary */}
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Shipment Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div>
                  <div className="text-sm opacity-80">Total Volume</div>
                  <div className="text-2xl font-bold">{calculations.totalVolume.toFixed(2)} ft³</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Total Weight</div>
                  <div className="text-2xl font-bold">{calculations.totalWeight.toLocaleString()} lbs</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Overall Density</div>
                  <div className="text-2xl font-bold">{calculations.overallDensity.toFixed(2)} lb/ft³</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Total CWT</div>
                  <div className="text-2xl font-bold">{calculations.totalCWT.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Est. Cost</div>
                  <div className="text-2xl font-bold">{formatCurrency(calculations.totalCost)}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Results Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Detailed Results
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Description</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Volume (ft³)</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Weight (lbs)</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Density</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Freight Class</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">CWT</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {calculations.itemResults.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{item.description}</td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{item.volumeCubicFt.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{item.totalWeight.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center font-medium text-[#0F4C81] dark:text-white">{item.density.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-medium">
                            {item.freightClass}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{item.cwt.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center font-medium text-green-600">{formatCurrency(item.estimatedCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Density by Item
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Density" fill="#0F4C81" name="Density (lb/ft³)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Freight Class Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={classDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {classDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Freight Classes Tab */}
        {activeTab === 'classes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                NMFC Freight Class Reference Table
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Freight classes are determined by density (pounds per cubic foot) and affect shipping costs.
                Lower class numbers mean lower shipping rates.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">Class</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">Density Range (lb/ft³)</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">Description</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">Examples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {FREIGHT_CLASSES.map((fc) => (
                      <tr key={fc.class} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded font-medium ${
                            parseInt(fc.class) <= 70
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              : parseInt(fc.class) <= 125
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {fc.class}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                          {fc.densityRange[1] === Infinity
                            ? `${fc.densityRange[0]}+`
                            : `${fc.densityRange[0]} - ${fc.densityRange[1]}`}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{fc.description}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{fc.examples}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                Pro Tips for Freight Classification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Maximize Density
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Pack shipments as densely as possible. Consolidating items into fewer, denser packages can lower your freight class and save significantly on shipping costs.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Accurate Measurements
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Always measure to the outermost points including overhangs, pallets, and packaging. Carriers will re-measure and reclassify if dimensions are incorrect.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                      Use Standard Pallets
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Standard 48x40 pallets are easiest to handle and stack. Non-standard sizes may incur additional fees or require special handling.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Density Formula
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                      <strong>Density = Weight ÷ Volume</strong>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Volume (ft³) = L × W × H (inches) ÷ 1728
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      Avoid Reclassification
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Incorrect classification can result in additional charges, delayed delivery, and carrier disputes. When in doubt, classify at the higher (more expensive) class.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                    <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">
                      NMFC Codes
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Some items have specific NMFC item numbers regardless of density. Check the NMFC book for items like electronics, machinery, and hazardous materials.
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
                    q: 'What is freight class and why does it matter?',
                    a: 'Freight class is a standardized classification system developed by the National Motor Freight Traffic Association (NMFTA). It determines shipping rates based on density, stowability, handling, and liability. Lower class numbers (50-70) have lower rates, while higher classes (250-400) have higher rates.',
                  },
                  {
                    q: 'How is freight density calculated?',
                    a: 'Density is calculated by dividing the total weight in pounds by the total volume in cubic feet. Volume = Length × Width × Height (in inches) ÷ 1728. The result is expressed in pounds per cubic foot (PCF).',
                  },
                  {
                    q: 'What happens if I classify my shipment incorrectly?',
                    a: 'Carriers will inspect and reclassify shipments. If the class is higher than declared, you will be charged the difference plus potential fees. This can delay delivery and result in billing disputes.',
                  },
                  {
                    q: 'Are there items that have fixed freight classes?',
                    a: 'Yes, some items have predetermined NMFC codes regardless of density. Examples include electronics (related to value), hazardous materials, and certain commodities with specific handling requirements.',
                  },
                  {
                    q: 'Does packaging affect freight class?',
                    a: 'Yes, packaging directly affects dimensions and weight. Using larger boxes than necessary increases volume and lowers density, potentially raising your freight class. Efficient packaging can reduce shipping costs.',
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
