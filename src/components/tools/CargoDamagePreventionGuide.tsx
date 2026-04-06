'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Package,
  Truck,
  Thermometer,
  Droplets,
  Zap,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  XCircle,
  FileText,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347', '#DC143C'];

interface DamageRisk {
  category: string;
  icon: React.ReactNode;
  riskLevel: 'low' | 'medium' | 'high';
  factors: { factor: string; score: number; maxScore: number }[];
  recommendations: string[];
}

export default function CargoDamagePreventionGuide() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [cargoType, setCargoType] = useState('general');
  const [transportMode, setTransportMode] = useState('ocean');

  const [packagingQuality, setPackagingQuality] = useState(80);
  const [handlingCare, setHandlingCare] = useState(70);
  const [environmentalControl, setEnvironmentalControl] = useState(75);
  const [securingMethod, setSecuringMethod] = useState(65);
  const [routeConditions, setRouteConditions] = useState(60);

  const riskAssessment = useMemo(() => {
    const overallScore = (packagingQuality + handlingCare + environmentalControl + securingMethod + routeConditions) / 5;
    
    let riskLevel: 'low' | 'medium' | 'high';
    let riskScore: number;
    
    if (overallScore >= 75) {
      riskLevel = 'low';
      riskScore = 100 - overallScore;
    } else if (overallScore >= 50) {
      riskLevel = 'medium';
      riskScore = 100 - overallScore;
    } else {
      riskLevel = 'high';
      riskScore = 100 - overallScore;
    }

    const radarData = [
      { metric: 'Packaging', value: packagingQuality, fullMark: 100 },
      { metric: 'Handling', value: handlingCare, fullMark: 100 },
      { metric: 'Environment', value: environmentalControl, fullMark: 100 },
      { metric: 'Securing', value: securingMethod, fullMark: 100 },
      { metric: 'Route', value: routeConditions, fullMark: 100 },
    ];

    const recommendations: { priority: 'high' | 'medium' | 'low'; action: string; impact: string }[] = [];

    if (packagingQuality < 70) {
      recommendations.push({
        priority: 'high',
        action: 'Upgrade packaging materials to industry-standard specifications',
        impact: 'Reduce damage claims by 30-50%',
      });
    }

    if (handlingCare < 70) {
      recommendations.push({
        priority: 'high',
        action: 'Implement handling protocols and provide training for logistics staff',
        impact: 'Decrease mishandling incidents by 40%',
      });
    }

    if (environmentalControl < 70) {
      recommendations.push({
        priority: 'medium',
        action: 'Use climate-controlled containers or add desiccants/insulation',
        impact: 'Prevent moisture and temperature damage',
      });
    }

    if (securingMethod < 70) {
      recommendations.push({
        priority: 'high',
        action: 'Review lashing and blocking methods; use dunnage and airbags',
        impact: 'Eliminate shift damage during transit',
      });
    }

    if (routeConditions < 70) {
      recommendations.push({
        priority: 'medium',
        action: 'Consider alternative routes or transport modes for rough conditions',
        impact: 'Reduce transit-related stress on cargo',
      });
    }

    return { overallScore, riskLevel, riskScore, radarData, recommendations };
  }, [packagingQuality, handlingCare, environmentalControl, securingMethod, routeConditions]);

  const damageTypes = useMemo(() => {
    return [
      {
        type: 'Impact Damage',
        icon: <Zap className="w-5 h-5" />,
        percentage: 35,
        color: '#E97451',
        causes: ['Dropping', 'Collision', 'Forklift impact', 'Stacking collapse'],
        prevention: ['Proper labeling', 'Protective packaging', 'Correct stacking height', 'Equipment training'],
      },
      {
        type: 'Moisture Damage',
        icon: <Droplets className="w-5 h-5" />,
        percentage: 25,
        color: '#0F4C81',
        causes: ['Condensation', 'Water ingress', 'High humidity', 'Temperature changes'],
        prevention: ['Desiccants', 'Vapor barriers', 'Climate control', 'Proper ventilation'],
      },
      {
        type: 'Crushing/Compression',
        icon: <Package className="w-5 h-5" />,
        percentage: 20,
        color: '#7B68EE',
        causes: ['Over-stacking', 'Weak packaging', 'Improper storage', 'Weight imbalance'],
        prevention: ['Stacking limits', 'Strong packaging', 'Proper racking', 'Weight distribution'],
      },
      {
        type: 'Temperature',
        icon: <Thermometer className="w-5 h-5" />,
        percentage: 12,
        color: '#FFB347',
        causes: ['Extreme heat', 'Freezing', 'Rapid changes', 'Sun exposure'],
        prevention: ['Insulation', 'Reefer containers', 'Thermal blankets', 'Route planning'],
      },
      {
        type: 'Shifting/Toppling',
        icon: <Truck className="w-5 h-5" />,
        percentage: 8,
        color: '#2E8B57',
        causes: ['Inadequate securing', 'Sharp turns', 'Rough roads', 'Braking'],
        prevention: ['Lashing', 'Dunnage', 'Blocking', 'Airbags'],
      },
    ];
  }, []);

  const chartData = useMemo(() => {
    return damageTypes.map((d) => ({
      name: d.type,
      percentage: d.percentage,
    }));
  }, [damageTypes]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Cargo Damage Prevention Guide
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Assess risks and implement strategies to protect your cargo during transit
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          {[
            { id: 'assessment', label: 'Risk Assessment', icon: AlertTriangle },
            { id: 'damage-types', label: 'Damage Types', icon: Package },
            { id: 'checklist', label: 'Pre-Shipment Checklist', icon: CheckCircle },
            { id: 'guidelines', label: 'Best Practices', icon: FileText },
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

        {/* Assessment Tab */}
        {activeTab === 'assessment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Shipment Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Cargo Type
                  </label>
                  <select
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="general">General Cargo</option>
                    <option value="fragile">Fragile Goods</option>
                    <option value="hazardous">Hazardous Materials</option>
                    <option value="perishable">Perishable Goods</option>
                    <option value="oversized">Oversized/Heavy</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Transport Mode
                  </label>
                  <select
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="ocean">Ocean Freight</option>
                    <option value="air">Air Freight</option>
                    <option value="road">Road Transport</option>
                    <option value="rail">Rail Transport</option>
                    <option value="multimodal">Multimodal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Risk Factor Assessment
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700 dark:text-slate-300">Packaging Quality</span>
                    <span className="font-medium text-slate-800 dark:text-white">{packagingQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={packagingQuality}
                    onChange={(e) => setPackagingQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>Poor</span>
                    <span>Standard</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700 dark:text-slate-300">Handling Care</span>
                    <span className="font-medium text-slate-800 dark:text-white">{handlingCare}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={handlingCare}
                    onChange={(e) => setHandlingCare(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700 dark:text-slate-300">Environmental Control</span>
                    <span className="font-medium text-slate-800 dark:text-white">{environmentalControl}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={environmentalControl}
                    onChange={(e) => setEnvironmentalControl(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700 dark:text-slate-300">Securing Method</span>
                    <span className="font-medium text-slate-800 dark:text-white">{securingMethod}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={securingMethod}
                    onChange={(e) => setSecuringMethod(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700 dark:text-slate-300">Route Conditions</span>
                    <span className="font-medium text-slate-800 dark:text-white">{routeConditions}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={routeConditions}
                    onChange={(e) => setRouteConditions(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Risk Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Risk Profile
                </h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-slate-200 dark:text-slate-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke={riskAssessment.riskLevel === 'low' ? '#2E8B57' : riskAssessment.riskLevel === 'medium' ? '#FFB347' : '#E97451'}
                        strokeWidth="10"
                        strokeDasharray={`${riskAssessment.overallScore * 3.52} 352`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-800 dark:text-white">
                        {riskAssessment.overallScore.toFixed(0)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Score</span>
                    </div>
                  </div>
                  <div>
                    <div className={`text-xl font-semibold ${getRiskColor(riskAssessment.riskLevel)}`}>
                      {riskAssessment.riskLevel.charAt(0).toUpperCase() + riskAssessment.riskLevel.slice(1)} Risk
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      {riskAssessment.riskLevel === 'low'
                        ? 'Your shipment has good protection measures in place.'
                        : riskAssessment.riskLevel === 'medium'
                        ? 'Some areas need improvement to reduce damage risk.'
                        : 'Significant improvements needed to protect cargo.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Protection Radar
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riskAssessment.radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="#0F4C81"
                        fill="#0F4C81"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {riskAssessment.recommendations.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Improvement Recommendations
                </h3>
                <div className="space-y-4">
                  {riskAssessment.recommendations.map((rec, index) => (
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
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-slate-800 dark:text-white">{rec.action}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{rec.impact}</div>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${
                            rec.priority === 'high'
                              ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                              : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                          }`}
                        >
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Damage Types Tab */}
        {activeTab === 'damage-types' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Common Cargo Damage Types
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        dataKey="percentage"
                      >
                        {damageTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 40]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#0F4C81" name="Percentage" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Damage Type Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {damageTypes.map((damage, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${damage.color}20`, color: damage.color }}
                    >
                      {damage.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">{damage.type}</h4>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {damage.percentage}% of claims
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Common Causes
                      </div>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        {damage.causes.map((cause, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <XCircle className="w-3 h-3 text-red-400" />
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Prevention Measures
                      </div>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        {damage.prevention.map((p, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Pre-Shipment Checklist
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#0F4C81] dark:text-white">Packaging</h4>
                  {[
                    'Use appropriate packaging materials for cargo type',
                    'Verify weight limits on containers/pallets',
                    'Apply proper cushioning for fragile items',
                    'Seal all packages securely',
                    'Apply handling labels (Fragile, This Way Up, etc.)',
                    'Document packaging condition with photos',
                  ].map((item, index) => (
                    <label key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded text-[#0F4C81]" />
                      <span className="text-slate-600 dark:text-slate-300">{item}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-[#0F4C81] dark:text-white">Documentation</h4>
                  {[
                    'Complete packing list with item descriptions',
                    'Attach shipping labels clearly',
                    'Include commercial invoice (if applicable)',
                    'Verify HS codes for customs',
                    'Prepare certificate of origin if needed',
                    'Document special handling requirements',
                  ].map((item, index) => (
                    <label key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded text-[#0F4C81]" />
                      <span className="text-slate-600 dark:text-slate-300">{item}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-[#0F4C81] dark:text-white">Container Loading</h4>
                  {[
                    'Inspect container condition before loading',
                    'Distribute weight evenly',
                    'Use appropriate dunnage and blocking',
                    'Secure cargo with lashing/strapping',
                    'Leave proper clearance for air circulation',
                    'Seal container and record seal number',
                  ].map((item, index) => (
                    <label key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded text-[#0F4C81]" />
                      <span className="text-slate-600 dark:text-slate-300">{item}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-[#0F4C81] dark:text-white">Special Cargo</h4>
                  {[
                    'Set reefer temperature and humidity',
                    'Activate GPS tracking devices',
                    'Verify DG documentation completeness',
                    'Install tilt/shock indicators',
                    'Record moisture readings',
                    'Confirm insurance coverage',
                  ].map((item, index) => (
                    <label key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded text-[#0F4C81]" />
                      <span className="text-slate-600 dark:text-slate-300">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Guidelines Tab */}
        {activeTab === 'guidelines' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                Cargo Protection Best Practices
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#0F4C81]" />
                      Packaging Guidelines
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Use corrugated boxes rated for the weight being shipped
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Apply stretch wrap to secure pallets (minimum 4-5 rotations)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Use corner protectors to prevent crushing
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Double-box high-value or fragile items
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-[#0F4C81]" />
                      Moisture Protection
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Install desiccant bags (calculate required amount)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Use kraft paper or moisture barrier liners
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Consider VCI paper for metal products
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Install humidity indicators for monitoring
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#0F4C81]" />
                      Securing & Load Distribution
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Follow 60/40 weight distribution rule for containers
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Use blocking and bracing for heavy items
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Apply lashing at 45-degree angles for maximum hold
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Fill void spaces with airbags or dunnage
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#0F4C81]" />
                      Monitoring & Documentation
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Install shock and tilt indicators
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Photograph cargo before sealing container
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Use GPS tracking for high-value shipments
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Maintain chain of custody documentation
                      </li>
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
                    q: 'What is the most common cause of cargo damage?',
                    a: 'Impact damage (35%) is the most common, caused by dropping, forklift collisions, and improper stacking. Proper labeling, packaging reinforcement, and staff training can significantly reduce these incidents.',
                  },
                  {
                    q: 'How can I prevent container rain damage?',
                    a: 'Container rain occurs due to temperature fluctuations causing condensation. Use desiccants, moisture barrier liners, and ensure proper ventilation. Calculate desiccant needs based on container size and transit duration.',
                  },
                  {
                    q: 'What is the correct way to secure cargo in a container?',
                    a: 'Use a combination of blocking (prevents movement), bracing (supports weight), and lashing (secures with straps/ropes). Apply lashings at 45-degree angles for maximum effectiveness. Fill voids with airbags or dunnage.',
                  },
                  {
                    q: 'How do I calculate desiccant requirements?',
                    a: 'Consider container size, cargo type, transit duration, and expected climate conditions. A general rule is 1-2 kg of desiccant per 20ft container for moderate climates, increasing for tropical routes or moisture-sensitive cargo.',
                  },
                  {
                    q: 'What indicators should I use for sensitive cargo?',
                    a: 'Use shock indicators to detect impacts, tilt indicators for orientation-sensitive items, temperature loggers for perishables, and humidity indicators for moisture-sensitive goods. Choose threshold levels appropriate for your cargo.',
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
