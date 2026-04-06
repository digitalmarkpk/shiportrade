'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Users,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Calendar,
  CheckCircle,
  XCircle,
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
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347'];

interface SupplierOrder {
  id: string;
  supplier: string;
  product: string;
  orderDate: string;
  promisedDate: string;
  actualDelivery: string;
  quantity: number;
  value: number;
  origin: string;
}

export default function SupplierLeadTimeAnalyzer() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [orders, setOrders] = useState<SupplierOrder[]>([
    { id: 'ORD001', supplier: 'Alpha Manufacturing', product: 'Widgets A', orderDate: '2024-01-05', promisedDate: '2024-01-25', actualDelivery: '2024-01-28', quantity: 1000, value: 15000, origin: 'China' },
    { id: 'ORD002', supplier: 'Alpha Manufacturing', product: 'Widgets B', orderDate: '2024-01-10', promisedDate: '2024-02-01', actualDelivery: '2024-02-03', quantity: 2000, value: 28000, origin: 'China' },
    { id: 'ORD003', supplier: 'Beta Industries', product: 'Components X', orderDate: '2024-01-15', promisedDate: '2024-02-10', actualDelivery: '2024-02-08', quantity: 500, value: 12000, origin: 'Vietnam' },
    { id: 'ORD004', supplier: 'Gamma Corp', product: 'Parts Y', orderDate: '2024-01-20', promisedDate: '2024-02-05', actualDelivery: '2024-02-12', quantity: 750, value: 8500, origin: 'India' },
    { id: 'ORD005', supplier: 'Beta Industries', product: 'Components Z', orderDate: '2024-02-01', promisedDate: '2024-02-20', actualDelivery: '2024-02-19', quantity: 300, value: 6000, origin: 'Vietnam' },
    { id: 'ORD006', supplier: 'Delta Suppliers', product: 'Materials M', orderDate: '2024-02-05', promisedDate: '2024-03-01', actualDelivery: '2024-03-05', quantity: 1500, value: 22000, origin: 'Taiwan' },
    { id: 'ORD007', supplier: 'Alpha Manufacturing', product: 'Widgets C', orderDate: '2024-02-10', promisedDate: '2024-03-05', actualDelivery: '2024-03-04', quantity: 800, value: 11000, origin: 'China' },
    { id: 'ORD008', supplier: 'Gamma Corp', product: 'Parts W', orderDate: '2024-02-15', promisedDate: '2024-03-10', actualDelivery: '2024-03-18', quantity: 600, value: 9500, origin: 'India' },
  ]);

  const analysis = useMemo(() => {
    const supplierStats: Record<string, {
      orders: number;
      totalLeadTime: number;
      totalPromised: number;
      onTime: number;
      early: number;
      late: number;
      totalValue: number;
    }> = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const promisedDate = new Date(order.promisedDate);
      const actualDate = new Date(order.actualDelivery);

      const promisedLeadTime = Math.ceil((promisedDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      const actualLeadTime = Math.ceil((actualDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      const variance = actualLeadTime - promisedLeadTime;

      if (!supplierStats[order.supplier]) {
        supplierStats[order.supplier] = { orders: 0, totalLeadTime: 0, totalPromised: 0, onTime: 0, early: 0, late: 0, totalValue: 0 };
      }

      supplierStats[order.supplier].orders++;
      supplierStats[order.supplier].totalLeadTime += actualLeadTime;
      supplierStats[order.supplier].totalPromised += promisedLeadTime;
      supplierStats[order.supplier].totalValue += order.value;

      if (variance <= 0 && variance >= -2) {
        supplierStats[order.supplier].onTime++;
      } else if (variance < -2) {
        supplierStats[order.supplier].early++;
      } else {
        supplierStats[order.supplier].late++;
      }
    });

    const supplierAnalysis = Object.entries(supplierStats).map(([name, stats]) => {
      const avgLeadTime = stats.totalLeadTime / stats.orders;
      const avgPromised = stats.totalPromised / stats.orders;
      const onTimeRate = ((stats.onTime + stats.early) / stats.orders) * 100;
      const reliabilityScore = Math.max(0, 100 - (stats.late / stats.orders) * 50);

      return {
        name,
        orders: stats.orders,
        avgLeadTime: Math.round(avgLeadTime),
        avgPromised: Math.round(avgPromised),
        onTimeRate: onTimeRate.toFixed(1),
        reliabilityScore: Math.round(reliabilityScore),
        totalValue: stats.totalValue,
        early: stats.early,
        onTime: stats.onTime,
        late: stats.late,
      };
    });

    const overallStats = {
      totalOrders: orders.length,
      avgLeadTime: Math.round(orders.reduce((sum, o) => {
        const lead = Math.ceil((new Date(o.actualDelivery).getTime() - new Date(o.orderDate).getTime()) / (1000 * 60 * 60 * 24));
        return sum + lead;
      }, 0) / orders.length),
      onTimeRate: ((orders.filter((o) => {
        const variance = Math.ceil((new Date(o.actualDelivery).getTime() - new Date(o.promisedDate).getTime()) / (1000 * 60 * 60 * 24));
        return variance <= 0;
      }).length) / orders.length) * 100,
      totalValue: orders.reduce((sum, o) => sum + o.value, 0),
    };

    return { supplierAnalysis, overallStats };
  }, [orders]);

  const chartData = useMemo(() => {
    return analysis.supplierAnalysis.map((s) => ({
      name: s.name.substring(0, 10),
      'Avg Lead Time': s.avgLeadTime,
      'Promised': s.avgPromised,
    }));
  }, [analysis]);

  const reliabilityData = useMemo(() => {
    return analysis.supplierAnalysis.map((s) => ({
      name: s.name,
      value: s.reliabilityScore,
    }));
  }, [analysis]);

  const scatterData = useMemo(() => {
    return orders.map((o) => {
      const promised = Math.ceil((new Date(o.promisedDate).getTime() - new Date(o.orderDate).getTime()) / (1000 * 60 * 60 * 24));
      const actual = Math.ceil((new Date(o.actualDelivery).getTime() - new Date(o.orderDate).getTime()) / (1000 * 60 * 60 * 24));
      return {
        name: o.supplier.substring(0, 5),
        x: promised,
        y: actual,
        z: o.value / 1000,
      };
    });
  }, [orders]);

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
                Supplier Lead Time Analyzer
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Track and analyze supplier delivery performance and lead times
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          {[
            { id: 'analysis', label: 'Analysis', icon: BarChart3 },
            { id: 'suppliers', label: 'Supplier Rankings', icon: Users },
            { id: 'timeline', label: 'Order Timeline', icon: Calendar },
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

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-[#0F4C81]" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Orders</span>
                </div>
                <div className="text-2xl font-bold text-[#0F4C81] dark:text-white">
                  {analysis.overallStats.totalOrders}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Avg Lead Time</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {analysis.overallStats.avgLeadTime} days
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">On-Time Rate</span>
                </div>
                <div className="text-2xl font-bold text-purple-500">
                  {analysis.overallStats.onTimeRate.toFixed(0)}%
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Value</span>
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  {formatCurrency(analysis.overallStats.totalValue)}
                </div>
              </div>
            </div>

            {/* Lead Time Comparison Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Lead Time vs Promised by Supplier
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Promised" fill="#7B68EE" name="Promised Days" />
                    <Bar dataKey="Avg Lead Time" fill="#0F4C81" name="Actual Days" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Scatter Plot */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Promised vs Actual Lead Time (bubble size = order value)
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x" name="Promised" unit=" days" label={{ value: 'Promised Days', position: 'bottom', offset: 0 }} />
                    <YAxis type="number" dataKey="y" name="Actual" unit=" days" label={{ value: 'Actual Days', angle: -90, position: 'insideLeft' }} />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} name="Value" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Orders" data={scatterData} fill="#0F4C81">
                      {scatterData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Points above the diagonal line indicate late deliveries
              </p>
            </div>
          </motion.div>
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Supplier Performance Rankings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Supplier</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Orders</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Avg Lead Time</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">On-Time Rate</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Reliability</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Total Value</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {analysis.supplierAnalysis
                      .sort((a, b) => b.reliabilityScore - a.reliabilityScore)
                      .map((supplier, index) => (
                        <tr key={supplier.name} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800 dark:text-white">#{index + 1}</span>
                              <span className="text-slate-600 dark:text-slate-300">{supplier.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{supplier.orders}</td>
                          <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{supplier.avgLeadTime} days</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-medium ${parseFloat(supplier.onTimeRate) >= 80 ? 'text-green-500' : parseFloat(supplier.onTimeRate) >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                              {supplier.onTimeRate}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${supplier.reliabilityScore >= 80 ? 'bg-green-500' : supplier.reliabilityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${supplier.reliabilityScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{supplier.reliabilityScore}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{formatCurrency(supplier.totalValue)}</td>
                          <td className="px-4 py-3 text-center">
                            {supplier.reliabilityScore >= 80 ? (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">Preferred</span>
                            ) : supplier.reliabilityScore >= 60 ? (
                              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">Standard</span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">Review</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Order Timeline Details
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Order ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Supplier</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Order Date</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Promised</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Actual</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Variance</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {orders.map((order) => {
                      const variance = Math.ceil((new Date(order.actualDelivery).getTime() - new Date(order.promisedDate).getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{order.id}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{order.supplier}</td>
                          <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{order.orderDate}</td>
                          <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{order.promisedDate}</td>
                          <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{order.actualDelivery}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-medium ${variance <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {variance <= 0 ? variance : `+${variance}`} days
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {variance <= 0 ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                Lead Time Optimization Tips
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Buffer Planning
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Add 10-20% buffer to supplier lead times for planning. This accounts for variability and unexpected delays while maintaining realistic schedules.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Supplier Segmentation
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Segment suppliers by performance. Place more orders with reliable suppliers and use shorter lead times for critical items.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                      Performance Reviews
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Conduct quarterly supplier reviews using lead time data. Discuss improvement plans with underperforming suppliers.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Safety Stock Adjustment
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Adjust safety stock levels based on supplier reliability scores. Higher reliability means lower safety stock requirements.
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
                    q: 'How is lead time calculated?',
                    a: 'Lead time is calculated from the order date to the actual delivery date. We compare this to the promised lead time to determine variance and on-time performance.',
                  },
                  {
                    q: 'What is a good on-time delivery rate?',
                    a: 'Industry benchmarks suggest 90%+ is excellent, 80-90% is acceptable, and below 80% needs improvement. Critical suppliers should aim for 95%+ on-time performance.',
                  },
                  {
                    q: 'How is reliability score calculated?',
                    a: 'The reliability score starts at 100 and is reduced based on late deliveries. Each late delivery reduces the score proportionally to the total order count for that supplier.',
                  },
                  {
                    q: 'Should I exclude early deliveries from on-time rate?',
                    a: 'Early deliveries can be problematic if they create storage issues. Some companies count them as on-time, while others track them separately for inventory planning purposes.',
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
