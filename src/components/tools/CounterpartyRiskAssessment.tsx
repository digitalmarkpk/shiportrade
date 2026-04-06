'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BarChart3,
  AlertTriangle,
  Shield,
  DollarSign,
  FileText,
  Lightbulb,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Building,
  Globe,
  Calendar,
  CheckCircle,
  XCircle,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347', '#20B2AA'];

interface Counterparty {
  id: string;
  name: string;
  type: 'buyer' | 'supplier' | 'bank' | 'carrier' | 'forwarder';
  country: string;
  industry: string;
  yearsInBusiness: number;
  annualRevenue: number;
  creditRating: string;
  paymentHistory: number;
  financialStrength: number;
  operationalRisk: number;
  complianceScore: number;
  marketPosition: number;
  relationshipYears: number;
  outstandingExposure: number;
  paymentTerms: number;
}

export default function CounterpartyRiskAssessment() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [counterparty, setCounterparty] = useState<Counterparty>({
    id: 'CP001',
    name: 'Global Trading Corp',
    type: 'buyer',
    country: 'United States',
    industry: 'Manufacturing',
    yearsInBusiness: 15,
    annualRevenue: 50000000,
    creditRating: 'BBB+',
    paymentHistory: 85,
    financialStrength: 72,
    operationalRisk: 35,
    complianceScore: 88,
    marketPosition: 75,
    relationshipYears: 5,
    outstandingExposure: 2500000,
    paymentTerms: 45,
  });

  const riskAssessment = useMemo(() => {
    // Weight factors for risk calculation
    const weights = {
      paymentHistory: 0.25,
      financialStrength: 0.20,
      operationalRisk: 0.15,
      complianceScore: 0.15,
      marketPosition: 0.10,
      relationshipYears: 0.08,
      yearsInBusiness: 0.07,
    };

    // Normalize relationship years (max benefit at 5+ years)
    const normalizedRelationship = Math.min(100, counterparty.relationshipYears * 20);

    // Normalize years in business (max benefit at 20+ years)
    const normalizedYearsBusiness = Math.min(100, counterparty.yearsInBusiness * 5);

    // Calculate weighted score (higher is better)
    const weightedScore =
      counterparty.paymentHistory * weights.paymentHistory +
      counterparty.financialStrength * weights.financialStrength +
      (100 - counterparty.operationalRisk) * weights.operationalRisk +
      counterparty.complianceScore * weights.complianceScore +
      counterparty.marketPosition * weights.marketPosition +
      normalizedRelationship * weights.relationshipYears +
      normalizedYearsBusiness * weights.yearsInBusiness;

    // Determine risk category
    let riskCategory: 'low' | 'medium' | 'high' | 'critical';
    let riskScore: number;

    if (weightedScore >= 75) {
      riskCategory = 'low';
      riskScore = weightedScore;
    } else if (weightedScore >= 55) {
      riskCategory = 'medium';
      riskScore = weightedScore;
    } else if (weightedScore >= 35) {
      riskCategory = 'high';
      riskScore = weightedScore;
    } else {
      riskCategory = 'critical';
      riskScore = weightedScore;
    }

    // Calculate credit limit recommendation
    const baseLimit = counterparty.annualRevenue * 0.1;
    const riskAdjustedLimit = baseLimit * (riskScore / 100);

    // Calculate exposure risk
    const exposureRatio = (counterparty.outstandingExposure / riskAdjustedLimit) * 100;

    // Generate warnings and recommendations
    const warnings: { severity: 'high' | 'medium' | 'low'; message: string }[] = [];

    if (counterparty.paymentHistory < 70) {
      warnings.push({ severity: 'high', message: 'Payment history below acceptable threshold' });
    }
    if (counterparty.financialStrength < 50) {
      warnings.push({ severity: 'high', message: 'Weak financial strength indicators' });
    }
    if (counterparty.operationalRisk > 60) {
      warnings.push({ severity: 'medium', message: 'Elevated operational risk factors' });
    }
    if (counterparty.complianceScore < 60) {
      warnings.push({ severity: 'high', message: 'Compliance concerns identified' });
    }
    if (exposureRatio > 80) {
      warnings.push({ severity: 'medium', message: 'Exposure approaching recommended limit' });
    }
    if (counterparty.relationshipYears < 2) {
      warnings.push({ severity: 'low', message: 'Limited relationship history' });
    }

    return {
      weightedScore,
      riskCategory,
      riskScore,
      recommendedCreditLimit: Math.round(riskAdjustedLimit),
      exposureRatio,
      warnings,
      normalizedRelationship,
      normalizedYearsBusiness,
    };
  }, [counterparty]);

  const radarData = useMemo(() => {
    return [
      { metric: 'Payment History', value: counterparty.paymentHistory, fullMark: 100 },
      { metric: 'Financial Strength', value: counterparty.financialStrength, fullMark: 100 },
      { metric: 'Operational', value: 100 - counterparty.operationalRisk, fullMark: 100 },
      { metric: 'Compliance', value: counterparty.complianceScore, fullMark: 100 },
      { metric: 'Market Position', value: counterparty.marketPosition, fullMark: 100 },
    ];
  }, [counterparty]);

  const scoreDistribution = useMemo(() => {
    return [
      { name: 'Payment', score: counterparty.paymentHistory, weight: 25 },
      { name: 'Financial', score: counterparty.financialStrength, weight: 20 },
      { name: 'Operational', score: 100 - counterparty.operationalRisk, weight: 15 },
      { name: 'Compliance', score: counterparty.complianceScore, weight: 15 },
      { name: 'Market', score: counterparty.marketPosition, weight: 10 },
    ];
  }, [counterparty]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-orange-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getRiskBgColor = (category: string) => {
    switch (category) {
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'critical':
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
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Counterparty Risk Assessment
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Evaluate and manage credit risk for trade partners
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          {[
            { id: 'assessment', label: 'Risk Assessment', icon: Shield },
            { id: 'details', label: 'Counterparty Details', icon: Building },
            { id: 'analysis', label: 'Score Analysis', icon: BarChart3 },
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

        {/* Assessment Tab */}
        {activeTab === 'assessment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Risk Score Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    {counterparty.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm text-slate-600 dark:text-slate-300">
                      {counterparty.type.charAt(0).toUpperCase() + counterparty.type.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm text-slate-600 dark:text-slate-300">
                      {counterparty.country}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm text-slate-600 dark:text-slate-300">
                      {counterparty.industry}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Risk Score</div>
                    <div
                      className={`text-4xl font-bold ${getRiskColor(riskAssessment.riskCategory)}`}
                    >
                      {riskAssessment.riskScore.toFixed(0)}
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-semibold ${getRiskBgColor(
                      riskAssessment.riskCategory
                    )}`}
                  >
                    {riskAssessment.riskCategory.toUpperCase()} RISK
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Recommended Limit</span>
                </div>
                <div className="text-xl font-bold text-slate-800 dark:text-white">
                  {formatCurrency(riskAssessment.recommendedCreditLimit)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Current Exposure</span>
                </div>
                <div className="text-xl font-bold text-slate-800 dark:text-white">
                  {formatCurrency(counterparty.outstandingExposure)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Payment Terms</span>
                </div>
                <div className="text-xl font-bold text-slate-800 dark:text-white">
                  Net {counterparty.paymentTerms}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Exposure Ratio</span>
                </div>
                <div className="text-xl font-bold text-slate-800 dark:text-white">
                  {riskAssessment.exposureRatio.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Warnings */}
            {riskAssessment.warnings.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Risk Indicators
                </h4>
                <div className="space-y-2">
                  {riskAssessment.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg flex items-center gap-3 ${
                        warning.severity === 'high'
                          ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                          : warning.severity === 'medium'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                      }`}
                    >
                      {warning.severity === 'high' ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : warning.severity === 'medium' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-blue-500" />
                      )}
                      <span className="text-slate-700 dark:text-slate-300">{warning.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Radar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Risk Profile
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
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

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Score Components
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Counterparty Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={counterparty.name}
                      onChange={(e) => setCounterparty({ ...counterparty, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Type
                      </label>
                      <select
                        value={counterparty.type}
                        onChange={(e) =>
                          setCounterparty({ ...counterparty, type: e.target.value as any })
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      >
                        <option value="buyer">Buyer</option>
                        <option value="supplier">Supplier</option>
                        <option value="bank">Bank</option>
                        <option value="carrier">Carrier</option>
                        <option value="forwarder">Freight Forwarder</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={counterparty.country}
                        onChange={(e) =>
                          setCounterparty({ ...counterparty, country: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={counterparty.industry}
                      onChange={(e) =>
                        setCounterparty({ ...counterparty, industry: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Years in Business
                      </label>
                      <input
                        type="number"
                        value={counterparty.yearsInBusiness}
                        onChange={(e) =>
                          setCounterparty({
                            ...counterparty,
                            yearsInBusiness: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Relationship Years
                      </label>
                      <input
                        type="number"
                        value={counterparty.relationshipYears}
                        onChange={(e) =>
                          setCounterparty({
                            ...counterparty,
                            relationshipYears: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Annual Revenue
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500">$</span>
                      <input
                        type="number"
                        value={counterparty.annualRevenue}
                        onChange={(e) =>
                          setCounterparty({
                            ...counterparty,
                            annualRevenue: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Credit Rating
                    </label>
                    <select
                      value={counterparty.creditRating}
                      onChange={(e) =>
                        setCounterparty({ ...counterparty, creditRating: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    >
                      <option value="AAA">AAA (Highest)</option>
                      <option value="AA+">AA+</option>
                      <option value="AA">AA</option>
                      <option value="AA-">AA-</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="A-">A-</option>
                      <option value="BBB+">BBB+</option>
                      <option value="BBB">BBB</option>
                      <option value="BBB-">BBB-</option>
                      <option value="BB+">BB+</option>
                      <option value="BB">BB</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="NR">Not Rated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Outstanding Exposure
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500">$</span>
                      <input
                        type="number"
                        value={counterparty.outstandingExposure}
                        onChange={(e) =>
                          setCounterparty({
                            ...counterparty,
                            outstandingExposure: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Payment Terms (Days)
                    </label>
                    <input
                      type="number"
                      value={counterparty.paymentTerms}
                      onChange={(e) =>
                        setCounterparty({
                          ...counterparty,
                          paymentTerms: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Risk Factor Scores (0-100)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Payment History: {counterparty.paymentHistory}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={counterparty.paymentHistory}
                    onChange={(e) =>
                      setCounterparty({
                        ...counterparty,
                        paymentHistory: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Financial Strength: {counterparty.financialStrength}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={counterparty.financialStrength}
                    onChange={(e) =>
                      setCounterparty({
                        ...counterparty,
                        financialStrength: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Operational Risk: {counterparty.operationalRisk}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={counterparty.operationalRisk}
                    onChange={(e) =>
                      setCounterparty({
                        ...counterparty,
                        operationalRisk: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Lower is better
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Compliance Score: {counterparty.complianceScore}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={counterparty.complianceScore}
                    onChange={(e) =>
                      setCounterparty({
                        ...counterparty,
                        complianceScore: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Market Position: {counterparty.marketPosition}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={counterparty.marketPosition}
                    onChange={(e) =>
                      setCounterparty({
                        ...counterparty,
                        marketPosition: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
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
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Score Weight Distribution
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 30]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="score" fill="#0F4C81" name="Score" />
                    <Bar yAxisId="right" dataKey="weight" fill="#2E8B57" name="Weight %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Benchmarking */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Industry Benchmark Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                        Metric
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Company Score
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Industry Avg
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Top Quartile
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Payment History</td>
                      <td className="px-4 py-3 text-center font-medium text-slate-800 dark:text-white">
                        {counterparty.paymentHistory}%
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">75%</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">90%</td>
                      <td className="px-4 py-3 text-center">
                        {counterparty.paymentHistory >= 90 ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : counterparty.paymentHistory >= 75 ? (
                          <span className="text-yellow-500">●</span>
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Financial Strength</td>
                      <td className="px-4 py-3 text-center font-medium text-slate-800 dark:text-white">
                        {counterparty.financialStrength}%
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">65%</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">80%</td>
                      <td className="px-4 py-3 text-center">
                        {counterparty.financialStrength >= 80 ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : counterparty.financialStrength >= 65 ? (
                          <span className="text-yellow-500">●</span>
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Compliance Score</td>
                      <td className="px-4 py-3 text-center font-medium text-slate-800 dark:text-white">
                        {counterparty.complianceScore}%
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">70%</td>
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">85%</td>
                      <td className="px-4 py-3 text-center">
                        {counterparty.complianceScore >= 85 ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : counterparty.complianceScore >= 70 ? (
                          <span className="text-yellow-500">●</span>
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                Risk Management Recommendations
              </h3>

              <div className="space-y-6">
                {riskAssessment.riskCategory === 'low' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Low Risk Profile - Standard Terms Recommended
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      This counterparty demonstrates strong financial and operational indicators.
                      Standard credit terms and normal monitoring procedures are appropriate.
                    </p>
                  </div>
                )}

                {riskAssessment.riskCategory === 'medium' && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                      Medium Risk - Enhanced Monitoring Required
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Consider quarterly reviews, reduced credit limits, or additional documentation
                      requirements. Monitor for any changes in payment patterns.
                    </p>
                  </div>
                )}

                {(riskAssessment.riskCategory === 'high' || riskAssessment.riskCategory === 'critical') && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      {riskAssessment.riskCategory === 'critical' ? 'Critical' : 'High'} Risk - Restrictive Measures Recommended
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Require letters of credit, advance payments, or credit insurance. Consider
                      limiting exposure and conducting monthly reviews.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 dark:text-white">Credit Recommendations</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Recommended credit limit: {formatCurrency(riskAssessment.recommendedCreditLimit)}
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Payment terms: Net {counterparty.paymentTerms} days
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Current exposure utilization: {riskAssessment.exposureRatio.toFixed(0)}%
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 dark:text-white">Mitigation Strategies</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {riskAssessment.riskCategory !== 'low' && (
                        <>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                            Consider credit insurance for exposures over $500K
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                            Request financial statements quarterly
                          </li>
                        </>
                      )}
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        Monitor trade references and market news
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
                    q: 'What is counterparty risk?',
                    a: 'Counterparty risk is the probability that the other party in a transaction may not meet its obligations. In trade, this includes payment default, delivery failure, or contractual breaches. Managing this risk is essential for supply chain stability.',
                  },
                  {
                    q: 'How is the risk score calculated?',
                    a: 'The risk score is a weighted combination of multiple factors: payment history (25%), financial strength (20%), operational risk (15%), compliance score (15%), market position (10%), relationship length (8%), and years in business (7%).',
                  },
                  {
                    q: 'What credit limit should I set?',
                    a: 'The recommended credit limit is calculated based on annual revenue (typically 10% as a baseline), adjusted by the risk score. Lower risk counterparties can support higher limits, while higher risk parties should have stricter limits.',
                  },
                  {
                    q: 'How often should I review counterparty risk?',
                    a: 'Low-risk counterparties should be reviewed annually. Medium-risk parties warrant quarterly reviews. High or critical risk counterparties require monthly monitoring and may need additional due diligence.',
                  },
                  {
                    q: 'What is credit insurance?',
                    a: 'Credit insurance protects against non-payment by buyers. It covers commercial risks (insolvency, protracted default) and political risks (war, currency inconvertibility). Premiums typically range from 0.1-0.5% of covered sales.',
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
