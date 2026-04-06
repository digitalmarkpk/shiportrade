'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  BarChart3,
  TrendingUp,
  Clock,
  Fuel,
  DollarSign,
  AlertTriangle,
  Info,
  Lightbulb,
  HelpCircle,
  Calendar,
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347', '#20B2AA'];

interface Vehicle {
  id: string;
  type: 'tractor' | 'trailer' | 'van' | 'flatbed' | 'reefer';
  name: string;
  status: 'active' | 'idle' | 'maintenance' | 'out_of_service';
  totalHours: number;
  productiveHours: number;
  milesDriven: number;
  fuelConsumed: number;
  revenue: number;
  downtimeHours: number;
}

export default function FleetUtilizationTracker() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 'V001',
      type: 'tractor',
      name: 'Truck Alpha',
      status: 'active',
      totalHours: 200,
      productiveHours: 160,
      milesDriven: 8500,
      fuelConsumed: 2800,
      revenue: 12500,
      downtimeHours: 8,
    },
    {
      id: 'V002',
      type: 'trailer',
      name: 'Trailer Beta',
      status: 'active',
      totalHours: 180,
      productiveHours: 144,
      milesDriven: 7200,
      fuelConsumed: 2400,
      revenue: 10800,
      downtimeHours: 12,
    },
    {
      id: 'V003',
      type: 'van',
      name: 'Van Gamma',
      status: 'maintenance',
      totalHours: 160,
      productiveHours: 112,
      milesDriven: 5600,
      fuelConsumed: 1900,
      revenue: 8200,
      downtimeHours: 24,
    },
    {
      id: 'V004',
      type: 'flatbed',
      name: 'Flatbed Delta',
      status: 'active',
      totalHours: 192,
      productiveHours: 158,
      milesDriven: 7800,
      fuelConsumed: 2600,
      revenue: 14200,
      downtimeHours: 6,
    },
    {
      id: 'V005',
      type: 'reefer',
      name: 'Reefer Epsilon',
      status: 'idle',
      totalHours: 168,
      productiveHours: 126,
      milesDriven: 6200,
      fuelConsumed: 2300,
      revenue: 9800,
      downtimeHours: 18,
    },
  ]);
  const [targetUtilization, setTargetUtilization] = useState(85);

  const utilizationMetrics = useMemo(() => {
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.status === 'active').length;
    const idleVehicles = vehicles.filter((v) => v.status === 'idle').length;
    const maintenanceVehicles = vehicles.filter((v) => v.status === 'maintenance').length;
    const outOfService = vehicles.filter((v) => v.status === 'out_of_service').length;

    const avgUtilization =
      vehicles.reduce((sum, v) => sum + (v.productiveHours / v.totalHours) * 100, 0) / totalVehicles;

    const totalMiles = vehicles.reduce((sum, v) => sum + v.milesDriven, 0);
    const totalFuel = vehicles.reduce((sum, v) => sum + v.fuelConsumed, 0);
    const totalRevenue = vehicles.reduce((sum, v) => sum + v.revenue, 0);
    const avgMPG = totalMiles / totalFuel;
    const revenuePerMile = totalRevenue / totalMiles;

    const totalDowntime = vehicles.reduce((sum, v) => sum + v.downtimeHours, 0);

    return {
      totalVehicles,
      activeVehicles,
      idleVehicles,
      maintenanceVehicles,
      outOfService,
      avgUtilization,
      totalMiles,
      totalFuel,
      totalRevenue,
      avgMPG,
      revenuePerMile,
      totalDowntime,
    };
  }, [vehicles]);

  const utilizationByType = useMemo(() => {
    const typeGroups: Record<string, { total: number; productive: number }> = {};
    vehicles.forEach((v) => {
      if (!typeGroups[v.type]) {
        typeGroups[v.type] = { total: 0, productive: 0 };
      }
      typeGroups[v.type].total += v.totalHours;
      typeGroups[v.type].productive += v.productiveHours;
    });

    return Object.entries(typeGroups).map(([type, data]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      utilization: (data.productive / data.total) * 100,
      hours: data.total,
    }));
  }, [vehicles]);

  const statusDistribution = useMemo(() => {
    return [
      { name: 'Active', value: utilizationMetrics.activeVehicles, color: '#2E8B57' },
      { name: 'Idle', value: utilizationMetrics.idleVehicles, color: '#FFB347' },
      { name: 'Maintenance', value: utilizationMetrics.maintenanceVehicles, color: '#E97451' },
      { name: 'Out of Service', value: utilizationMetrics.outOfService, color: '#DC143C' },
    ].filter((d) => d.value > 0);
  }, [utilizationMetrics]);

  const performanceTrend = useMemo(() => {
    // Simulated weekly trend data
    return [
      { week: 'Week 1', utilization: 72, revenue: 42000, downtime: 45 },
      { week: 'Week 2', utilization: 78, revenue: 48500, downtime: 38 },
      { week: 'Week 3', utilization: 75, revenue: 45000, downtime: 42 },
      { week: 'Week 4', utilization: 82, revenue: 52000, downtime: 32 },
      { week: 'Week 5', utilization: utilizationMetrics.avgUtilization, revenue: utilizationMetrics.totalRevenue, downtime: utilizationMetrics.totalDowntime },
    ];
  }, [utilizationMetrics]);

  const radarData = useMemo(() => {
    return [
      { metric: 'Utilization', value: utilizationMetrics.avgUtilization, fullMark: 100 },
      { metric: 'Efficiency', value: utilizationMetrics.avgMPG * 4, fullMark: 100 },
      { metric: 'Reliability', value: 100 - (utilizationMetrics.totalDowntime / 10), fullMark: 100 },
      { metric: 'Revenue', value: (utilizationMetrics.revenuePerMile / 2), fullMark: 100 },
      { metric: 'Availability', value: (utilizationMetrics.activeVehicles / utilizationMetrics.totalVehicles) * 100, fullMark: 100 },
    ];
  }, [utilizationMetrics]);

  const recommendations = useMemo(() => {
    const recs: { priority: 'high' | 'medium' | 'low'; text: string }[] = [];

    if (utilizationMetrics.avgUtilization < targetUtilization) {
      recs.push({
        priority: 'high',
        text: `Current utilization (${utilizationMetrics.avgUtilization.toFixed(1)}%) is below target (${targetUtilization}%). Consider route optimization or reducing idle time.`,
      });
    }

    if (utilizationMetrics.idleVehicles > 0) {
      recs.push({
        priority: 'medium',
        text: `${utilizationMetrics.idleVehicles} vehicle(s) currently idle. Explore backhaul opportunities or intermodal options.`,
      });
    }

    if (utilizationMetrics.avgMPG < 6) {
      recs.push({
        priority: 'medium',
        text: 'Fuel efficiency below industry average. Consider driver training or vehicle upgrades.',
      });
    }

    if (utilizationMetrics.maintenanceVehicles > utilizationMetrics.totalVehicles * 0.15) {
      recs.push({
        priority: 'high',
        text: 'High maintenance rate may indicate aging fleet. Evaluate preventive maintenance schedule.',
      });
    }

    return recs;
  }, [utilizationMetrics, targetUtilization]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const updateVehicleStatus = (id: string, status: Vehicle['status']) => {
    setVehicles(vehicles.map((v) => (v.id === id ? { ...v, status } : v)));
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
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Fleet Utilization Tracker
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Monitor and optimize fleet performance, efficiency, and revenue generation
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'vehicles', label: 'Vehicles', icon: Truck },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-[#0F4C81]" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Utilization</span>
                </div>
                <div className="text-2xl font-bold text-[#0F4C81] dark:text-white">
                  {utilizationMetrics.avgUtilization.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Target: {targetUtilization}%
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Active</span>
                </div>
                <div className="text-2xl font-bold text-green-500">
                  {utilizationMetrics.activeVehicles}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  of {utilizationMetrics.totalVehicles} total
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Avg MPG</span>
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  {utilizationMetrics.avgMPG.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Industry avg: 6.5
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Revenue/Mile</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(utilizationMetrics.revenuePerMile)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Total: {formatCurrency(utilizationMetrics.totalRevenue)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Downtime</span>
                </div>
                <div className="text-2xl font-bold text-red-500">
                  {utilizationMetrics.totalDowntime}h
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  This period
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Miles</span>
                </div>
                <div className="text-2xl font-bold text-purple-500">
                  {utilizationMetrics.totalMiles.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  This period
                </div>
              </div>
            </div>

            {/* Utilization Gauge */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Fleet Utilization Score
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Target:</span>
                  <input
                    type="number"
                    value={targetUtilization}
                    onChange={(e) => setTargetUtilization(parseInt(e.target.value) || 85)}
                    className="w-16 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-center"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">%</span>
                </div>
              </div>
              <div className="relative h-8 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                    utilizationMetrics.avgUtilization >= targetUtilization
                      ? 'bg-green-500'
                      : utilizationMetrics.avgUtilization >= targetUtilization - 10
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, utilizationMetrics.avgUtilization)}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-slate-800 dark:bg-white"
                  style={{ left: `${targetUtilization}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-slate-500 dark:text-slate-400">0%</span>
                <span
                  className={`font-medium ${
                    utilizationMetrics.avgUtilization >= targetUtilization
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  Current: {utilizationMetrics.avgUtilization.toFixed(1)}%
                </span>
                <span className="text-slate-500 dark:text-slate-400">100%</span>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Utilization by Vehicle Type
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={utilizationByType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="utilization" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Fleet Status Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Performance Trend */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Weekly Performance Trend
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
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
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="utilization"
                      stroke="#0F4C81"
                      fill="#0F4C81"
                      fillOpacity={0.3}
                      name="Utilization %"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2E8B57"
                      fill="#2E8B57"
                      fillOpacity={0.3}
                      name="Revenue $"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Vehicle Fleet Details
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                        Vehicle
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                        Type
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Utilization
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Miles
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        MPG
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Revenue
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Downtime
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-slate-800 dark:text-white">
                              {vehicle.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {vehicle.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={vehicle.status}
                            onChange={(e) =>
                              updateVehicleStatus(vehicle.id, e.target.value as Vehicle['status'])
                            }
                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${
                              vehicle.status === 'active'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : vehicle.status === 'idle'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                : vehicle.status === 'maintenance'
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="idle">Idle</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="out_of_service">Out of Service</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  (vehicle.productiveHours / vehicle.totalHours) * 100 >=
                                  targetUtilization
                                    ? 'bg-green-500'
                                    : 'bg-orange-500'
                                }`}
                                style={{
                                  width: `${(vehicle.productiveHours / vehicle.totalHours) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {((vehicle.productiveHours / vehicle.totalHours) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                          {vehicle.milesDriven.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                          {(vehicle.milesDriven / vehicle.fuelConsumed).toFixed(1)}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-green-600">
                          {formatCurrency(vehicle.revenue)}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                          {vehicle.downtimeHours}h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vehicle Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-2">Top Performer</h4>
                <div className="text-xl font-bold text-green-500">
                  {vehicles.reduce((top, v) =>
                    v.productiveHours / v.totalHours > top.productiveHours / top.totalHours ? v : top
                  ).name}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {(
                    (vehicles.reduce((top, v) =>
                      v.productiveHours / v.totalHours > top.productiveHours / top.totalHours
                        ? v
                        : top
                    ).productiveHours /
                      vehicles.reduce((top, v) =>
                        v.productiveHours / v.totalHours > top.productiveHours / top.totalHours
                          ? v
                          : top
                      ).totalHours) * 100
                  ).toFixed(1)}
                  % utilization
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Highest Revenue Generator
                </h4>
                <div className="text-xl font-bold text-[#0F4C81] dark:text-white">
                  {vehicles.reduce((top, v) => (v.revenue > top.revenue ? v : top)).name}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {formatCurrency(vehicles.reduce((top, v) => (v.revenue > top.revenue ? v : top)).revenue)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-2">Most Efficient</h4>
                <div className="text-xl font-bold text-purple-500">
                  {vehicles.reduce((top, v) =>
                    v.milesDriven / v.fuelConsumed > top.milesDriven / top.fuelConsumed ? v : top
                  ).name}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {(
                    vehicles.reduce((top, v) =>
                      v.milesDriven / v.fuelConsumed > top.milesDriven / top.fuelConsumed ? v : top
                    ).milesDriven /
                    vehicles.reduce((top, v) =>
                      v.milesDriven / v.fuelConsumed > top.milesDriven / top.fuelConsumed ? v : top
                    ).fuelConsumed
                  ).toFixed(1)}{' '}
                  MPG
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Radar Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Fleet Performance Radar
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#0F4C81"
                      fill="#0F4C81"
                      fillOpacity={0.5}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Efficiency Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Cost per Mile Analysis
                </h3>
                <div className="space-y-4">
                  {vehicles.map((v) => {
                    const costPerMile = (v.fuelConsumed * 4) / v.milesDriven;
                    return (
                      <div key={v.id} className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">{v.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                costPerMile < 0.6 ? 'bg-green-500' : costPerMile < 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, costPerMile * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-white w-16 text-right">
                            ${costPerMile.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Revenue per Hour Analysis
                </h3>
                <div className="space-y-4">
                  {vehicles.map((v) => {
                    const revenuePerHour = v.revenue / v.productiveHours;
                    return (
                      <div key={v.id} className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">{v.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2E8B57] rounded-full"
                              style={{ width: `${Math.min(100, revenuePerHour / 2)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-white w-16 text-right">
                            ${revenuePerHour.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Optimization Recommendations
              </h3>

              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      rec.priority === 'high'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${
                          rec.priority === 'high'
                            ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                            : rec.priority === 'medium'
                            ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                            : 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                        }`}
                      >
                        {rec.priority.toUpperCase()}
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">{rec.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Fleet Management Best Practices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-medium text-slate-800 dark:text-white mb-2">
                    Preventive Maintenance
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Schedule regular maintenance to reduce unplanned downtime by up to 25%. Track PM compliance for each vehicle.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-medium text-slate-800 dark:text-white mb-2">
                    Route Optimization
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Use GPS and telematics to optimize routes, reduce deadhead miles, and improve fuel efficiency.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-medium text-slate-800 dark:text-white mb-2">
                    Driver Performance
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Monitor driver behavior metrics including idle time, harsh braking, and speeding to improve safety and efficiency.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-medium text-slate-800 dark:text-white mb-2">
                    Right-Sizing Fleet
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Regularly analyze utilization data to identify underutilized assets and optimize fleet composition.
                  </p>
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
                    q: 'What is a good fleet utilization rate?',
                    a: 'Industry benchmarks suggest 80-90% utilization is optimal. Below 75% indicates excess capacity, while above 90% may lead to maintenance issues and driver fatigue. The ideal rate depends on your specific operations and seasonal demand patterns.',
                  },
                  {
                    q: 'How is utilization calculated?',
                    a: 'Utilization is typically calculated as productive hours divided by total available hours. Productive hours include loaded miles and revenue-generating activities. Total hours include all scheduled working hours minus planned downtime.',
                  },
                  {
                    q: 'What affects fuel efficiency in fleet operations?',
                    a: 'Key factors include driver behavior (speeding, idling), vehicle maintenance, route planning, load optimization, and equipment age. A 10% improvement in MPG can reduce fuel costs by thousands annually per vehicle.',
                  },
                  {
                    q: 'How can I reduce fleet downtime?',
                    a: 'Implement preventive maintenance schedules, maintain adequate spare parts inventory, use predictive analytics for breakdown forecasting, and establish relationships with reliable service providers for quick repairs.',
                  },
                  {
                    q: 'What metrics should I track for fleet optimization?',
                    a: 'Key metrics include utilization rate, cost per mile, revenue per mile, fuel efficiency (MPG), maintenance cost per mile, driver performance scores, on-time delivery rate, and safety incidents per million miles.',
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
