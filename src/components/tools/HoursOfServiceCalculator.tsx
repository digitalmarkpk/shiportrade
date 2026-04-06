'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Truck,
  AlertTriangle,
  Calendar,
  Calculator,
  MapPin,
  Coffee,
  Moon,
  Sun,
  Lightbulb,
  HelpCircle,
  FileText,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347'];

interface DutyPeriod {
  id: string;
  type: 'driving' | 'on_duty' | 'sleeper' | 'off_duty';
  startTime: string;
  duration: number; // minutes
  location?: string;
}

export default function HoursOfServiceCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [dutyPeriods, setDutyPeriods] = useState<DutyPeriod[]>([
    { id: '1', type: 'on_duty', startTime: '06:00', duration: 30, location: 'Terminal A' },
    { id: '2', type: 'driving', startTime: '06:30', duration: 240, location: 'Highway 101' },
    { id: '3', type: 'on_duty', startTime: '10:30', duration: 30, location: 'Rest Stop B' },
    { id: '4', type: 'driving', startTime: '11:00', duration: 180, location: 'I-5 North' },
    { id: '5', type: 'sleeper', startTime: '14:00', duration: 600, location: 'Truck Stop C' },
    { id: '6', type: 'driving', startTime: '00:00', duration: 300, location: 'I-5 North' },
  ]);
  const [country, setCountry] = useState<'US' | 'CA' | 'EU'>('US');
  const [cycle, setCycle] = useState<'70/8' | '60/7'>('70/8');

  const hosLimits = useMemo(() => {
    if (country === 'US') {
      return {
        dailyDriving: 660, // 11 hours in minutes
        dailyOnDuty: 840, // 14 hours in minutes
        weeklyOnDuty: cycle === '70/8' ? 4200 : 3600, // 70/8 or 60/7 hours
        requiredBreak: 30, // 30 min break after 8 hours driving
        sleeperMin: 480, // 8 hours minimum for sleeper berth
        offDutyMin: 600, // 10 hours off duty before restart
        restart: 34 * 60, // 34 hour restart
      };
    } else if (country === 'CA') {
      return {
        dailyDriving: 780, // 13 hours
        dailyOnDuty: 840, // 14 hours
        weeklyOnDuty: 3600, // 60 hours/7 days
        requiredBreak: 30,
        sleeperMin: 480,
        offDutyMin: 600, // 10 hours
        restart: 36 * 60,
      };
    } else {
      return {
        dailyDriving: 540, // 9 hours (EU)
        dailyOnDuty: 600, // 10 hours
        weeklyOnDuty: 3360, // 56 hours
        requiredBreak: 45,
        sleeperMin: 540, // 9 hours
        offDutyMin: 660, // 11 hours
        restart: 45 * 60,
      };
    }
  }, [country, cycle]);

  const calculations = useMemo(() => {
    const totalDriving = dutyPeriods
      .filter((p) => p.type === 'driving')
      .reduce((sum, p) => sum + p.duration, 0);

    const totalOnDuty = dutyPeriods
      .filter((p) => p.type === 'on_duty')
      .reduce((sum, p) => sum + p.duration, 0);

    const totalSleeper = dutyPeriods
      .filter((p) => p.type === 'sleeper')
      .reduce((sum, p) => sum + p.duration, 0);

    const totalOffDuty = dutyPeriods
      .filter((p) => p.type === 'off_duty')
      .reduce((sum, p) => sum + p.duration, 0);

    const drivingRemaining = Math.max(0, hosLimits.dailyDriving - totalDriving);
    const onDutyRemaining = Math.max(0, hosLimits.dailyOnDuty - totalOnDuty - totalDriving);

    const violations: { type: string; message: string; severity: 'error' | 'warning' }[] = [];

    // Check for violations
    if (totalDriving > hosLimits.dailyDriving) {
      violations.push({
        type: 'Driving Limit Exceeded',
        message: `Driving time exceeds ${hosLimits.dailyDriving / 60} hour limit by ${((totalDriving - hosLimits.dailyDriving) / 60).toFixed(1)} hours`,
        severity: 'error',
      });
    }

    if (totalDriving + totalOnDuty > hosLimits.dailyOnDuty) {
      violations.push({
        type: 'On-Duty Limit Exceeded',
        message: `On-duty time exceeds ${hosLimits.dailyOnDuty / 60} hour limit`,
        severity: 'error',
      });
    }

    if (totalSleeper > 0 && totalSleeper < hosLimits.sleeperMin && totalOffDuty < hosLimits.offDutyMin - totalSleeper) {
      violations.push({
        type: 'Rest Period Insufficient',
        message: `Sleeper berth period is less than ${hosLimits.sleeperMin / 60} hours minimum`,
        severity: 'warning',
      });
    }

    if (drivingRemaining <= 60 && drivingRemaining > 0) {
      violations.push({
        type: 'Low Driving Time',
        message: `Only ${drivingRemaining} minutes of driving time remaining`,
        severity: 'warning',
      });
    }

    return {
      totalDriving,
      totalOnDuty,
      totalSleeper,
      totalOffDuty,
      drivingRemaining,
      onDutyRemaining,
      violations,
      utilizationRate: (totalDriving / hosLimits.dailyDriving) * 100,
    };
  }, [dutyPeriods, hosLimits]);

  const dutyBreakdown = useMemo(() => {
    return [
      { name: 'Driving', value: calculations.totalDriving, color: '#0F4C81' },
      { name: 'On Duty', value: calculations.totalOnDuty, color: '#2E8B57' },
      { name: 'Sleeper', value: calculations.totalSleeper, color: '#7B68EE' },
      { name: 'Off Duty', value: calculations.totalOffDuty, color: '#FFB347' },
    ];
  }, [calculations]);

  const timelineData = useMemo(() => {
    return dutyPeriods.map((period, index) => ({
      name: period.type.replace('_', ' ').toUpperCase(),
      start: period.startTime,
      duration: period.duration / 60,
      type: period.type,
    }));
  }, [dutyPeriods]);

  const addPeriod = () => {
    const lastPeriod = dutyPeriods[dutyPeriods.length - 1];
    const lastEnd = lastPeriod
      ? new Date(`2000-01-01T${lastPeriod.startTime}`).getTime() + lastPeriod.duration * 60000
      : Date.now();

    const newStart = new Date(lastEnd).toTimeString().slice(0, 5);

    setDutyPeriods([
      ...dutyPeriods,
      {
        id: Date.now().toString(),
        type: 'driving',
        startTime: newStart,
        duration: 60,
        location: '',
      },
    ]);
  };

  const updatePeriod = (id: string, field: keyof DutyPeriod, value: any) => {
    setDutyPeriods(dutyPeriods.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removePeriod = (id: string) => {
    setDutyPeriods(dutyPeriods.filter((p) => p.id !== id));
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
                Hours of Service Calculator
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Track and comply with trucking regulations for driver hours
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
            { id: 'timeline', label: 'Timeline', icon: Calendar },
            { id: 'regulations', label: 'Regulations', icon: FileText },
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
            {/* Region Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Regulation Settings
              </h3>
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Jurisdiction
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as any)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="US">United States (FMCSA)</option>
                    <option value="CA">Canada (CCMTA)</option>
                    <option value="EU">European Union (EU)</option>
                  </select>
                </div>
                {country === 'US' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Duty Cycle
                    </label>
                    <select
                      value={cycle}
                      onChange={(e) => setCycle(e.target.value as any)}
                      className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    >
                      <option value="70/8">70 hours / 8 days</option>
                      <option value="60/7">60 hours / 7 days</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-[#0F4C81]" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Driving Time</span>
                </div>
                <div className="text-2xl font-bold text-[#0F4C81] dark:text-white">
                  {formatTime(calculations.totalDriving)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Limit: {formatTime(hosLimits.dailyDriving)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">On-Duty Time</span>
                </div>
                <div className="text-2xl font-bold text-green-500">
                  {formatTime(calculations.totalOnDuty + calculations.totalDriving)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Limit: {formatTime(hosLimits.dailyOnDuty)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Rest Period</span>
                </div>
                <div className="text-2xl font-bold text-purple-500">
                  {formatTime(calculations.totalSleeper + calculations.totalOffDuty)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Required: {formatTime(hosLimits.offDutyMin)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Driving Left</span>
                </div>
                <div className={`text-2xl font-bold ${calculations.drivingRemaining < 60 ? 'text-red-500' : 'text-orange-500'}`}>
                  {formatTime(calculations.drivingRemaining)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {calculations.utilizationRate.toFixed(0)}% utilized
                </div>
              </div>
            </div>

            {/* Violations Alert */}
            {calculations.violations.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Compliance Alerts
                </h4>
                <div className="space-y-2">
                  {calculations.violations.map((v, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${
                        v.severity === 'error'
                          ? 'bg-red-100 dark:bg-red-900/40'
                          : 'bg-yellow-100 dark:bg-yellow-900/40'
                      }`}
                    >
                      <div className="font-medium text-slate-800 dark:text-white">{v.type}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{v.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duty Periods */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Duty Periods</h3>
                <button
                  onClick={addPeriod}
                  className="px-4 py-2 bg-[#0F4C81] text-white rounded-lg hover:bg-[#0F4C81]/90"
                >
                  + Add Period
                </button>
              </div>

              <div className="space-y-4">
                {dutyPeriods.map((period, index) => (
                  <div
                    key={period.id}
                    className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Type
                        </label>
                        <select
                          value={period.type}
                          onChange={(e) => updatePeriod(period.id, 'type', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm"
                        >
                          <option value="driving">🚛 Driving</option>
                          <option value="on_duty">📋 On Duty</option>
                          <option value="sleeper">😴 Sleeper Berth</option>
                          <option value="off_duty">🏠 Off Duty</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={period.startTime}
                          onChange={(e) => updatePeriod(period.id, 'startTime', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Duration (min)
                        </label>
                        <input
                          type="number"
                          value={period.duration}
                          onChange={(e) =>
                            updatePeriod(period.id, 'duration', parseInt(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={period.location || ''}
                          onChange={(e) => updatePeriod(period.id, 'location', e.target.value)}
                          placeholder="Location..."
                          className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removePeriod(period.id)}
                          className="px-3 py-1 text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
            {/* Visual Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                24-Hour Duty Timeline
              </h3>
              <div className="relative h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                {/* Hour markers */}
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-600"
                    style={{ left: `${(i / 24) * 100}%` }}
                  >
                    <span className="absolute top-1 text-xs text-slate-500 dark:text-slate-400">
                      {i}
                    </span>
                  </div>
                ))}

                {/* Duty periods */}
                {dutyPeriods.map((period, index) => {
                  const startHour = parseInt(period.startTime.split(':')[0]) + parseInt(period.startTime.split(':')[1]) / 60;
                  const durationHours = period.duration / 60;
                  const color =
                    period.type === 'driving'
                      ? '#0F4C81'
                      : period.type === 'on_duty'
                      ? '#2E8B57'
                      : period.type === 'sleeper'
                      ? '#7B68EE'
                      : '#FFB347';

                  return (
                    <div
                      key={period.id}
                      className="absolute top-6 bottom-0"
                      style={{
                        left: `${(startHour / 24) * 100}%`,
                        width: `${(durationHours / 24) * 100}%`,
                        backgroundColor: color,
                      }}
                      title={`${period.type}: ${formatTime(period.duration)}`}
                    />
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4">
                {[
                  { label: 'Driving', color: '#0F4C81' },
                  { label: 'On Duty', color: '#2E8B57' },
                  { label: 'Sleeper', color: '#7B68EE' },
                  { label: 'Off Duty', color: '#FFB347' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Time Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dutyBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {dutyBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatTime(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Compliance Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Driving Limit</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-white">
                        {formatTime(calculations.totalDriving)} / {formatTime(hosLimits.dailyDriving)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          calculations.totalDriving > hosLimits.dailyDriving ? 'bg-red-500' : 'bg-[#0F4C81]'
                        }`}
                        style={{ width: `${Math.min(100, (calculations.totalDriving / hosLimits.dailyDriving) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600 dark:text-slate-300">On-Duty Limit</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-white">
                        {formatTime(calculations.totalDriving + calculations.totalOnDuty)} / {formatTime(hosLimits.dailyOnDuty)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          calculations.totalDriving + calculations.totalOnDuty > hosLimits.dailyOnDuty ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, ((calculations.totalDriving + calculations.totalOnDuty) / hosLimits.dailyOnDuty) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Rest Period</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-white">
                        {formatTime(calculations.totalSleeper + calculations.totalOffDuty)} / {formatTime(hosLimits.offDutyMin)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          calculations.totalSleeper + calculations.totalOffDuty >= hosLimits.offDutyMin ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(100, ((calculations.totalSleeper + calculations.totalOffDuty) / hosLimits.offDutyMin) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Regulations Tab */}
        {activeTab === 'regulations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                {country === 'US' ? 'FMCSA Hours of Service Rules' : country === 'CA' ? 'Canadian HOS Rules' : 'EU Drivers\' Hours Rules'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800 dark:text-blue-300">Driving Limit</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {country === 'US' && 'Maximum 11 hours driving after 10 consecutive hours off duty'}
                      {country === 'CA' && 'Maximum 13 hours driving after 8 consecutive hours off duty'}
                      {country === 'EU' && 'Maximum 9 hours driving (can be extended to 10 hours twice per week)'}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800 dark:text-green-300">On-Duty Limit</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {country === 'US' && 'Maximum 14 hours on-duty after coming on duty following 10 hours off duty'}
                      {country === 'CA' && 'Maximum 14 hours on-duty in a day'}
                      {country === 'EU' && 'Maximum 10 hours driving time per day (can be extended)'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Coffee className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800 dark:text-purple-300">Rest Breaks</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {country === 'US' && '30-minute break required after 8 hours of driving time (can be on-duty or off-duty)'}
                      {country === 'CA' && '30-minute break required after 4 hours of driving'}
                      {country === 'EU' && '45-minute break required after 4.5 hours of driving (can be split)'}
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-orange-800 dark:text-orange-300">Off-Duty Period</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {country === 'US' && 'Minimum 10 consecutive hours off duty before driving again'}
                      {country === 'CA' && 'Minimum 10 hours off duty (8 consecutive + 2 additional)'}
                      {country === 'EU' && 'Minimum 11 hours daily rest (can be reduced to 9 hours three times per week)'}
                    </p>
                  </div>
                </div>
              </div>

              {country === 'US' && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Weekly Limits (US)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    May not drive after {cycle === '70/8' ? '70 hours on duty in 8 consecutive days' : '60 hours on duty in 7 consecutive days'}.
                    34-hour restart provision available to reset the 7/8 day clock.
                  </p>
                </div>
              )}
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
                Pro Tips for HOS Compliance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Plan Ahead
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Review your route and schedule before starting. Know where you&apos;ll take breaks and where you&apos;ll shut down for your 10-hour rest.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Use ELD Features
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Modern ELDs provide real-time alerts. Enable notifications for approaching limits and set custom warnings at 30 and 60 minutes remaining.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                      Split Sleeper Option
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      The sleeper berth provision allows splitting the 10-hour off-duty period into 8+2 hours, extending your 14-hour window strategically.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Track Adverse Conditions
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Document adverse driving conditions that may qualify for the 2-hour exception. Keep records of weather alerts and traffic delays.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                      Short-Haul Exception
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      If you operate within 150 air miles and return within 12 hours, you may qualify for the short-haul exception to ELD requirements.
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      Avoid Violations
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      HOS violations can result in fines, out-of-service orders, and CSA scores. Plan routes with buffer time to handle unexpected delays.
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
                    q: 'What is the 14-hour rule?',
                    a: 'The 14-hour rule states that a driver cannot drive after being on duty for 14 consecutive hours after coming on duty following 10 consecutive hours off duty. This window cannot be extended by taking breaks.',
                  },
                  {
                    q: 'Can I extend my driving time?',
                    a: 'US regulations allow a 2-hour extension for adverse driving conditions (weather, traffic) if the driver could not have anticipated the delay. This must be noted in the ELD annotation.',
                  },
                  {
                    q: 'What is the 34-hour restart?',
                    a: 'The 34-hour restart allows drivers to reset their 60/70-hour weekly limit by taking 34 consecutive hours off duty. This can be done once per 168-hour period.',
                  },
                  {
                    q: 'How does split sleeper berth work?',
                    a: 'The sleeper berth provision allows drivers to split their 10-hour off-duty period into two periods: at least 8 hours in the sleeper berth and at least 2 hours either off duty or in the sleeper. These periods don\'t need to be consecutive.',
                  },
                  {
                    q: 'What happens if I violate HOS rules?',
                    a: 'Violations can result in: being placed out-of-service at inspection, civil penalties up to $16,000 per violation for carriers, points on CSA safety scores, and potential job consequences. Repeated violations can lead to carrier intervention.',
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
