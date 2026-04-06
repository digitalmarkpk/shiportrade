'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Calculator,
  Building,
  AlertTriangle,
  DollarSign,
  FileText,
  Lightbulb,
  HelpCircle,
  CheckCircle,
  TrendingUp,
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

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347'];

interface WarehouseDetails {
  locationType: 'urban' | 'suburban' | 'rural';
  constructionType: 'steel' | 'concrete' | 'wood' | 'mixed';
  yearBuilt: number;
  squareFootage: number;
  sprinklerSystem: boolean;
  alarmSystem: boolean;
  fireStationDistance: number;
  floodZone: boolean;
  earthquakeZone: boolean;
  inventoryValue: number;
  buildingValue: number;
  equipmentValue: number;
  liabilityCoverage: number;
  businessInterruption: number;
  deductible: number;
  claimsHistory: number;
  securityFeatures: string[];
}

export default function WarehouseInsuranceCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [warehouse, setWarehouse] = useState<WarehouseDetails>({
    locationType: 'suburban',
    constructionType: 'steel',
    yearBuilt: 2005,
    squareFootage: 50000,
    sprinklerSystem: true,
    alarmSystem: true,
    fireStationDistance: 3,
    floodZone: false,
    earthquakeZone: false,
    inventoryValue: 2000000,
    buildingValue: 5000000,
    equipmentValue: 500000,
    liabilityCoverage: 1000000,
    businessInterruption: 500000,
    deductible: 10000,
    claimsHistory: 0,
    securityFeatures: ['cctv', 'access_control'],
  });

  const insuranceCalculation = useMemo(() => {
    // Base rates per $1000 of coverage
    const basePropertyRate = 0.5; // $0.50 per $1000
    const baseLiabilityRate = 0.3;
    const baseBITate = 0.8;

    // Calculate total property value
    const totalPropertyValue = warehouse.buildingValue + warehouse.inventoryValue + warehouse.equipmentValue;

    // Risk multipliers
    let riskMultiplier = 1.0;

    // Location type
    if (warehouse.locationType === 'urban') riskMultiplier *= 1.15;
    else if (warehouse.locationType === 'rural') riskMultiplier *= 0.9;

    // Construction type
    if (warehouse.constructionType === 'steel') riskMultiplier *= 0.85;
    else if (warehouse.constructionType === 'concrete') riskMultiplier *= 0.9;
    else if (warehouse.constructionType === 'wood') riskMultiplier *= 1.25;

    // Building age
    const buildingAge = 2024 - warehouse.yearBuilt;
    if (buildingAge > 30) riskMultiplier *= 1.2;
    else if (buildingAge > 20) riskMultiplier *= 1.1;
    else if (buildingAge < 10) riskMultiplier *= 0.95;

    // Safety features discounts
    if (warehouse.sprinklerSystem) riskMultiplier *= 0.85;
    if (warehouse.alarmSystem) riskMultiplier *= 0.9;

    // Fire station proximity
    if (warehouse.fireStationDistance <= 1) riskMultiplier *= 0.95;
    else if (warehouse.fireStationDistance > 5) riskMultiplier *= 1.1;

    // Hazard zones
    if (warehouse.floodZone) riskMultiplier *= 1.35;
    if (warehouse.earthquakeZone) riskMultiplier *= 1.25;

    // Claims history
    if (warehouse.claimsHistory > 3) riskMultiplier *= 1.3;
    else if (warehouse.claimsHistory > 1) riskMultiplier *= 1.1;
    else if (warehouse.claimsHistory === 0) riskMultiplier *= 0.95;

    // Security features
    const securityDiscount = Math.min(0.15, warehouse.securityFeatures.length * 0.05);
    riskMultiplier *= 1 - securityDiscount;

    // Calculate premiums
    const propertyPremium = (totalPropertyValue / 1000) * basePropertyRate * riskMultiplier;
    const liabilityPremium = (warehouse.liabilityCoverage / 1000) * baseLiabilityRate;
    const biPremium = (warehouse.businessInterruption / 1000) * baseBITate;
    const floodPremium = warehouse.floodZone ? totalPropertyValue * 0.002 : 0;
    const earthquakePremium = warehouse.earthquakeZone ? totalPropertyValue * 0.0015 : 0;

    const totalPremium = propertyPremium + liabilityPremium + biPremium + floodPremium + earthquakePremium;

    // Calculate risk score (0-100, lower is better)
    const riskScore = Math.min(100, Math.max(0, riskMultiplier * 50));

    return {
      totalPropertyValue,
      riskMultiplier,
      propertyPremium,
      liabilityPremium,
      biPremium,
      floodPremium,
      earthquakePremium,
      totalPremium,
      riskScore,
    };
  }, [warehouse]);

  const coverageBreakdown = useMemo(() => {
    return [
      {
        name: 'Property',
        value: warehouse.buildingValue + warehouse.inventoryValue + warehouse.equipmentValue,
        premium: insuranceCalculation.propertyPremium,
      },
      { name: 'Liability', value: warehouse.liabilityCoverage, premium: insuranceCalculation.liabilityPremium },
      { name: 'Business Interruption', value: warehouse.businessInterruption, premium: insuranceCalculation.biPremium },
    ];
  }, [warehouse, insuranceCalculation]);

  const riskRadarData = useMemo(() => {
    return [
      { metric: 'Fire Risk', value: warehouse.sprinklerSystem ? 20 : 60, fullMark: 100 },
      { metric: 'Theft Risk', value: warehouse.alarmSystem ? 25 : 70, fullMark: 100 },
      { metric: 'Flood Risk', value: warehouse.floodZone ? 80 : 20, fullMark: 100 },
      { metric: 'Earthquake', value: warehouse.earthquakeZone ? 75 : 15, fullMark: 100 },
      { metric: 'Location', value: warehouse.locationType === 'urban' ? 50 : 30, fullMark: 100 },
    ];
  }, [warehouse]);

  const recommendations = useMemo(() => {
    const recs: { priority: 'high' | 'medium' | 'low'; text: string; savings: number }[] = [];

    if (!warehouse.sprinklerSystem) {
      recs.push({
        priority: 'high',
        text: 'Install automatic sprinkler system - can reduce fire risk and premiums by up to 15%',
        savings: insuranceCalculation.propertyPremium * 0.15,
      });
    }

    if (!warehouse.alarmSystem) {
      recs.push({
        priority: 'high',
        text: 'Install monitored alarm system - potential 10% premium reduction',
        savings: insuranceCalculation.totalPremium * 0.1,
      });
    }

    if (warehouse.fireStationDistance > 5) {
      recs.push({
        priority: 'medium',
        text: 'Consider additional fire suppression equipment due to distance from fire station',
        savings: insuranceCalculation.propertyPremium * 0.05,
      });
    }

    if (warehouse.claimsHistory > 2) {
      recs.push({
        priority: 'high',
        text: 'Implement risk management program to reduce future claims',
        savings: insuranceCalculation.totalPremium * 0.15,
      });
    }

    if (!warehouse.securityFeatures.includes('cctv')) {
      recs.push({
        priority: 'medium',
        text: 'Install CCTV surveillance for additional theft protection',
        savings: insuranceCalculation.propertyPremium * 0.05,
      });
    }

    if (warehouse.floodZone && warehouse.inventoryValue > 1000000) {
      recs.push({
        priority: 'high',
        text: 'Consider flood barriers or elevated storage for high-value inventory',
        savings: insuranceCalculation.floodPremium * 0.1,
      });
    }

    return recs;
  }, [warehouse, insuranceCalculation]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleSecurityFeature = (feature: string) => {
    if (warehouse.securityFeatures.includes(feature)) {
      setWarehouse({
        ...warehouse,
        securityFeatures: warehouse.securityFeatures.filter((f) => f !== feature),
      });
    } else {
      setWarehouse({
        ...warehouse,
        securityFeatures: [...warehouse.securityFeatures, feature],
      });
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
                Warehouse Insurance Calculator
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Estimate insurance premiums and optimize coverage for your warehouse
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
            { id: 'analysis', label: 'Risk Analysis', icon: TrendingUp },
            { id: 'coverage', label: 'Coverage Details', icon: FileText },
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

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                  Warehouse Details
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Location Type
                      </label>
                      <select
                        value={warehouse.locationType}
                        onChange={(e) =>
                          setWarehouse({ ...warehouse, locationType: e.target.value as any })
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      >
                        <option value="urban">Urban</option>
                        <option value="suburban">Suburban</option>
                        <option value="rural">Rural</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Construction Type
                      </label>
                      <select
                        value={warehouse.constructionType}
                        onChange={(e) =>
                          setWarehouse({ ...warehouse, constructionType: e.target.value as any })
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      >
                        <option value="steel">Steel Frame</option>
                        <option value="concrete">Concrete</option>
                        <option value="wood">Wood Frame</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Year Built
                      </label>
                      <input
                        type="number"
                        value={warehouse.yearBuilt}
                        onChange={(e) =>
                          setWarehouse({ ...warehouse, yearBuilt: parseInt(e.target.value) || 2000 })
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Square Footage
                      </label>
                      <input
                        type="number"
                        value={warehouse.squareFootage}
                        onChange={(e) =>
                          setWarehouse({
                            ...warehouse,
                            squareFootage: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Distance to Fire Station (miles)
                    </label>
                    <input
                      type="number"
                      value={warehouse.fireStationDistance}
                      onChange={(e) =>
                        setWarehouse({
                          ...warehouse,
                          fireStationDistance: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={warehouse.sprinklerSystem}
                        onChange={(e) =>
                          setWarehouse({ ...warehouse, sprinklerSystem: e.target.checked })
                        }
                        className="w-5 h-5 rounded text-[#0F4C81]"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Sprinkler System</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={warehouse.alarmSystem}
                        onChange={(e) =>
                          setWarehouse({ ...warehouse, alarmSystem: e.target.checked })
                        }
                        className="w-5 h-5 rounded text-[#0F4C81]"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Alarm System</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={warehouse.floodZone}
                        onChange={(e) =>
                          setWarehouse({ ...warehouse, floodZone: e.target.checked })
                        }
                        className="w-5 h-5 rounded text-orange-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Flood Zone</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={warehouse.earthquakeZone}
                        onChange={(e) =>
                          setWarehouse({ ...warehouse, earthquakeZone: e.target.checked })
                        }
                        className="w-5 h-5 rounded text-orange-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Earthquake Zone</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Security Features
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'cctv', label: 'CCTV' },
                        { id: 'access_control', label: 'Access Control' },
                        { id: 'security_guard', label: 'Security Guard' },
                        { id: 'fencing', label: 'Perimeter Fencing' },
                      ].map((feature) => (
                        <button
                          key={feature.id}
                          onClick={() => toggleSecurityFeature(feature.id)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            warehouse.securityFeatures.includes(feature.id)
                              ? 'bg-[#0F4C81] text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {feature.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage Values */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                  Coverage Values
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Building Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500">$</span>
                      <input
                        type="number"
                        value={warehouse.buildingValue}
                        onChange={(e) =>
                          setWarehouse({
                            ...warehouse,
                            buildingValue: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Inventory Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500">$</span>
                      <input
                        type="number"
                        value={warehouse.inventoryValue}
                        onChange={(e) =>
                          setWarehouse({
                            ...warehouse,
                            inventoryValue: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Equipment Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500">$</span>
                      <input
                        type="number"
                        value={warehouse.equipmentValue}
                        onChange={(e) =>
                          setWarehouse({
                            ...warehouse,
                            equipmentValue: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Liability Coverage
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500">$</span>
                        <input
                          type="number"
                          value={warehouse.liabilityCoverage}
                          onChange={(e) =>
                            setWarehouse({
                              ...warehouse,
                              liabilityCoverage: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Business Interruption
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500">$</span>
                        <input
                          type="number"
                          value={warehouse.businessInterruption}
                          onChange={(e) =>
                            setWarehouse({
                              ...warehouse,
                              businessInterruption: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Deductible
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500">$</span>
                        <input
                          type="number"
                          value={warehouse.deductible}
                          onChange={(e) =>
                            setWarehouse({ ...warehouse, deductible: parseInt(e.target.value) || 0 })
                          }
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Claims (Last 5 Years)
                      </label>
                      <input
                        type="number"
                        value={warehouse.claimsHistory}
                        onChange={(e) =>
                          setWarehouse({
                            ...warehouse,
                            claimsHistory: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Summary */}
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Estimated Annual Premium</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div>
                  <div className="text-sm opacity-80">Property</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(insuranceCalculation.propertyPremium)}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Liability</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(insuranceCalculation.liabilityPremium)}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Business Interruption</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(insuranceCalculation.biPremium)}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">CAT Coverage</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(insuranceCalculation.floodPremium + insuranceCalculation.earthquakePremium)}
                  </div>
                </div>
                <div className="border-l border-white/20 pl-6">
                  <div className="text-sm opacity-80">Total Premium</div>
                  <div className="text-3xl font-bold">{formatCurrency(insuranceCalculation.totalPremium)}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Risk Analysis Tab */}
        {activeTab === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Risk Score */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Overall Risk Assessment
              </h3>
              <div className="flex items-center gap-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke={
                        insuranceCalculation.riskScore < 40
                          ? '#2E8B57'
                          : insuranceCalculation.riskScore < 60
                          ? '#FFB347'
                          : '#E97451'
                      }
                      strokeWidth="12"
                      strokeDasharray={`${insuranceCalculation.riskScore * 4.4} 440`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">
                      {insuranceCalculation.riskScore.toFixed(0)}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Risk Score</span>
                  </div>
                </div>
                <div>
                  <div
                    className={`text-xl font-semibold ${
                      insuranceCalculation.riskScore < 40
                        ? 'text-green-500'
                        : insuranceCalculation.riskScore < 60
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}
                  >
                    {insuranceCalculation.riskScore < 40
                      ? 'Low Risk Profile'
                      : insuranceCalculation.riskScore < 60
                      ? 'Moderate Risk Profile'
                      : 'High Risk Profile'}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-md">
                    Based on your building characteristics, location factors, and safety features,
                    your warehouse presents a{' '}
                    {insuranceCalculation.riskScore < 40
                      ? 'favorable'
                      : insuranceCalculation.riskScore < 60
                      ? 'average'
                      : 'elevated'}{' '}
                    risk profile to insurers.
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Radar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Risk Factor Analysis
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riskRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Risk Level"
                        dataKey="value"
                        stroke="#0F4C81"
                        fill="#0F4C81"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Lower values indicate better risk management
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Premium Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={coverageBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        dataKey="premium"
                      >
                        {coverageBreakdown.map((_, index) => (
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
            </div>
          </motion.div>
        )}

        {/* Coverage Details Tab */}
        {activeTab === 'coverage' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Coverage Summary
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coverageBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="value" name="Coverage Amount" fill="#0F4C81" />
                    <Bar dataKey="premium" name="Annual Premium" fill="#2E8B57" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Coverage Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-4">
                  Property Coverage Includes
                </h4>
                <ul className="space-y-2">
                  {[
                    'Building and structures',
                    'Inventory and stock',
                    'Equipment and machinery',
                    'Furniture and fixtures',
                    'Improvements and betterments',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-4">
                  Liability Coverage Includes
                </h4>
                <ul className="space-y-2">
                  {[
                    'Bodily injury',
                    'Property damage',
                    'Personal injury',
                    'Products liability',
                    'Completed operations',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
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
                Premium Reduction Opportunities
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
                    <div className="flex justify-between items-start">
                      <div>
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
                        <p className="text-slate-700 dark:text-slate-300 mt-2">{rec.text}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Potential Savings</div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(rec.savings)}/year
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {recommendations.length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>Your warehouse has excellent risk management features in place.</p>
                  </div>
                )}
              </div>

              {recommendations.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-slate-600 dark:text-slate-300">Total Potential Annual Savings</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(recommendations.reduce((sum, r) => sum + r.savings, 0))}
                  </div>
                </div>
              )}
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
                    q: 'What factors affect warehouse insurance premiums most?',
                    a: 'The primary factors include location (urban vs rural, flood/earthquake zones), construction type, fire protection systems, claims history, and the value of inventory and equipment. Sprinkler systems and monitored alarms can reduce premiums by 10-25%.',
                  },
                  {
                    q: 'Do I need separate flood or earthquake coverage?',
                    a: 'Standard property policies typically exclude flood and earthquake damage. If your warehouse is in a designated flood or earthquake zone, separate coverage is strongly recommended. The cost varies significantly based on zone designation.',
                  },
                  {
                    q: 'What is business interruption insurance?',
                    a: 'Business interruption coverage compensates for lost income and ongoing expenses when your warehouse operations are disrupted by a covered event. It typically covers profits you would have earned, operating expenses, and sometimes temporary relocation costs.',
                  },
                  {
                    q: 'How often should I review my warehouse insurance?',
                    a: 'Review your coverage annually and after significant changes such as major equipment purchases, inventory increases, building renovations, or changes in operations. Underinsurance can result in significant out-of-pocket costs during a claim.',
                  },
                  {
                    q: 'What is coinsurance and how does it affect my coverage?',
                    a: 'Coinsurance is a clause requiring you to insure your property to a certain percentage (typically 80-100%) of its replacement value. If you underinsure, claims payments may be reduced proportionally, even for partial losses.',
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
