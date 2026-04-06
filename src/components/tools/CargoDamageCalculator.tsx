'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  AlertTriangle,
  FileWarning,
  DollarSign,
  Package,
  Ship,
  Info,
  RefreshCw,
  Shield,
  Percent,
  TrendingDown,
  Scale,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface DamageCalculationResult {
  // Damage Assessment
  damagePercentage: number;
  depreciatedValue: number;
  salvageableValue: number;
  
  // Claim Calculation
  claimableAmount: number;
  deductibleAmount: number;
  netClaimAmount: number;
  
  // Coverage Analysis
  coverageGap: number;
  underinsurancePenalty: number;
  effectiveCoverage: number;
  
  // Recommendations
  isClaimViable: boolean;
  recommendation: string;
  nextSteps: string[];
}

// Damage types with severity levels
const damageTypes = [
  { value: 'total-loss', label: 'Total Loss', severity: 100, description: 'Complete destruction or irrecoverable loss of cargo' },
  { value: 'severe-water', label: 'Severe Water Damage', severity: 80, description: 'Extensive water intrusion causing significant damage' },
  { value: 'moderate-water', label: 'Moderate Water Damage', severity: 50, description: 'Partial water damage affecting some goods' },
  { value: 'breakage', label: 'Breakage/Crushing', severity: 60, description: 'Physical damage from impact or improper handling' },
  { value: 'contamination', label: 'Contamination', severity: 70, description: 'Goods contaminated by foreign substances' },
  { value: 'temperature', label: 'Temperature Deviation', severity: 55, description: 'Damage from improper temperature control' },
  { value: 'theft-partial', label: 'Partial Theft/Pilferage', severity: 40, description: 'Portion of cargo stolen during transit' },
  { value: 'shortage', label: 'Shortage', severity: 30, description: 'Quantity discrepancy at delivery' },
  { value: 'rust-corrosion', label: 'Rust/Corrosion', severity: 45, description: 'Oxidation damage to metal goods' },
  { value: 'mold-mildew', label: 'Mold/Mildew', severity: 50, description: 'Fungal growth from moisture exposure' },
];

// Insurance coverage types
const coverageTypes = [
  { value: 'icc-a', label: 'ICC (A) - All Risks', coveragePercent: 100, deductibleRate: 0.5 },
  { value: 'icc-b', label: 'ICC (B) - Intermediate', coveragePercent: 85, deductibleRate: 1.0 },
  { value: 'icc-c', label: 'ICC (C) - Basic', coveragePercent: 70, deductibleRate: 1.5 },
  { value: 'named-perils', label: 'Named Perils Only', coveragePercent: 60, deductibleRate: 2.0 },
];

// Currency options
const currencies = [
  { value: 'USD', symbol: '$', label: 'USD' },
  { value: 'EUR', symbol: '€', label: 'EUR' },
  { value: 'GBP', symbol: '£', label: 'GBP' },
  { value: 'CNY', symbol: '¥', label: 'CNY' },
  { value: 'JPY', symbol: '¥', label: 'JPY' },
];

export default function CargoDamageCalculator() {
  // Form state
  const [cargoValue, setCargoValue] = useState('100000');
  const [currency, setCurrency] = useState('USD');
  const [damageType, setDamageType] = useState('moderate-water');
  const [customDamagePercent, setCustomDamagePercent] = useState('');
  const [insuredValue, setInsuredValue] = useState('110000');
  const [coverageType, setCoverageType] = useState('icc-a');
  const [deductible, setDeductible] = useState('500');
  const [salvageValue, setSalvageValue] = useState('5000');
  const [claimExpenses, setClaimExpenses] = useState('250');
  
  // UI state
  const [activeTab, setActiveTab] = useState('calculator');
  const [showResults, setShowResults] = useState(false);

  // Get currency symbol
  const currencySymbol = currencies.find(c => c.value === currency)?.symbol || '$';

  // Calculate damage assessment
  const calculation = useMemo<DamageCalculationResult>(() => {
    const cargo = parseFloat(cargoValue) || 0;
    const insured = parseFloat(insuredValue) || 0;
    const deductibleVal = parseFloat(deductible) || 0;
    const salvage = parseFloat(salvageValue) || 0;
    const expenses = parseFloat(claimExpenses) || 0;
    const customDamage = parseFloat(customDamagePercent) || null;
    
    // Get damage severity
    const damageInfo = damageTypes.find(d => d.value === damageType);
    const damagePercentage = customDamage !== null ? customDamage : (damageInfo?.severity || 50);
    
    // Get coverage info
    const coverageInfo = coverageTypes.find(c => c.value === coverageType);
    const coveragePercent = coverageInfo?.coveragePercent || 100;
    
    // Calculate depreciated value
    const depreciatedValue = cargo * (damagePercentage / 100);
    
    // Calculate salvageable value
    const salvageableValue = damagePercentage >= 100 ? 0 : salvage;
    
    // Calculate underinsurance penalty (average clause)
    let underinsurancePenalty = 0;
    if (insured < cargo) {
      underinsurancePenalty = (1 - insured / cargo) * depreciatedValue;
    }
    
    // Calculate effective coverage
    const effectiveCoverage = Math.min(insured, cargo) * (coveragePercent / 100);
    
    // Calculate claimable amount
    let claimableAmount = depreciatedValue * (coveragePercent / 100) - underinsurancePenalty;
    claimableAmount = Math.max(0, Math.min(claimableAmount, effectiveCoverage));
    
    // Apply deductible
    const deductibleAmount = Math.min(deductibleVal, claimableAmount);
    const netClaimAmount = claimableAmount - deductibleAmount;
    
    // Calculate coverage gap
    const coverageGap = Math.max(0, depreciatedValue - netClaimAmount - salvageableValue);
    
    // Determine if claim is viable
    const isClaimViable = netClaimAmount > expenses + 100;
    
    // Generate recommendations
    let recommendation = '';
    const nextSteps: string[] = [];
    
    if (damagePercentage >= 100) {
      recommendation = 'Total loss scenario. File claim immediately with all supporting documentation.';
      nextSteps.push('Notify insurer within 24 hours');
      nextSteps.push('Submit proof of value (commercial invoice, packing list)');
      nextSteps.push('Obtain survey report if required');
      nextSteps.push('Complete claim form with full loss details');
    } else if (damagePercentage >= 70) {
      recommendation = 'Severe damage. High-value claim recommended.';
      nextSteps.push('Document all damage with photos and videos');
      nextSteps.push('Arrange joint survey with insurer');
      nextSteps.push('Preserve damaged goods for inspection');
      nextSteps.push('File claim within policy time limits');
    } else if (damagePercentage >= 40) {
      recommendation = 'Moderate damage. Claim is economically viable.';
      nextSteps.push('Assess and document damage extent');
      nextSteps.push('Obtain repair/replacement quotes');
      nextSteps.push('Submit claim with supporting evidence');
    } else {
      recommendation = 'Minor damage. Evaluate if claim is economically justified.';
      nextSteps.push('Document damage for records');
      nextSteps.push('Consider absorbing minor losses');
      nextSteps.push('Review policy deductible vs claim amount');
    }
    
    if (underinsurancePenalty > 0) {
      nextSteps.push(`Note: Underinsurance penalty of ${currencySymbol}${underinsurancePenalty.toFixed(2)} applied`);
    }
    
    if (!isClaimViable) {
      nextSteps.push('Claim may not be economically viable due to expenses');
    }
    
    return {
      damagePercentage,
      depreciatedValue,
      salvageableValue,
      claimableAmount,
      deductibleAmount,
      netClaimAmount,
      coverageGap,
      underinsurancePenalty,
      effectiveCoverage,
      isClaimViable,
      recommendation,
      nextSteps,
    };
  }, [cargoValue, insuredValue, damageType, customDamagePercent, coverageType, deductible, salvageValue, claimExpenses, currencySymbol]);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setCargoValue('100000');
    setInsuredValue('110000');
    setDamageType('moderate-water');
    setCustomDamagePercent('');
    setCoverageType('icc-a');
    setDeductible('500');
    setSalvageValue('5000');
    setClaimExpenses('250');
    setShowResults(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Cargo Damage Calculator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Calculate insurance claims, assess damage value, and estimate recovery for damaged cargo shipments
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="coverage">Coverage Guide</TabsTrigger>
            <TabsTrigger value="claims">Claims Process</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileWarning className="h-5 w-5 text-[#0F4C81]" />
                      Damage Assessment
                    </CardTitle>
                    <CardDescription>Enter cargo and damage details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Cargo Value Section */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#0F4C81]" />
                        Cargo Value
                      </h4>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3 space-y-2">
                          <Label>Total Cargo Value</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{currencySymbol}</span>
                            <Input
                              type="number"
                              value={cargoValue}
                              onChange={(e) => setCargoValue(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Damage Type Section */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Package className="h-4 w-4 text-[#2E8B57]" />
                        Damage Details
                      </h4>
                      
                      <div className="space-y-2">
                        <Label>Type of Damage</Label>
                        <Select value={damageType} onValueChange={setDamageType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {damageTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label} ({type.severity}% typical)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Custom Damage Percentage (Optional)</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={customDamagePercent}
                            onChange={(e) => setCustomDamagePercent(e.target.value)}
                            placeholder={`Override: ${damageTypes.find(d => d.value === damageType)?.severity || 50}%`}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                        </div>
                        <p className="text-xs text-slate-500">Leave empty to use typical severity for selected damage type</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Salvage Value</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{currencySymbol}</span>
                            <Input
                              type="number"
                              value={salvageValue}
                              onChange={(e) => setSalvageValue(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Claim Expenses</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{currencySymbol}</span>
                            <Input
                              type="number"
                              value={claimExpenses}
                              onChange={(e) => setClaimExpenses(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Insurance Coverage Section */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#0F4C81]" />
                        Insurance Coverage
                      </h4>
                      
                      <div className="space-y-2">
                        <Label>Coverage Type</Label>
                        <Select value={coverageType} onValueChange={setCoverageType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {coverageTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Insured Value</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{currencySymbol}</span>
                            <Input
                              type="number"
                              value={insuredValue}
                              onChange={(e) => setInsuredValue(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Deductible</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{currencySymbol}</span>
                            <Input
                              type="number"
                              value={deductible}
                              onChange={(e) => setDeductible(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleCalculate}
                        className="flex-1 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Damage
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleReset}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-[#2E8B57]" />
                      Claim Analysis
                    </CardTitle>
                    <CardDescription>Damage assessment and claim calculation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {showResults ? (
                      <div className="space-y-6">
                        {/* Damage Severity Indicator */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Damage Severity</span>
                            <span className="text-lg font-bold text-[#0F4C81]">{calculation.damagePercentage.toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={calculation.damagePercentage} 
                            className="h-3"
                          />
                          <div className="flex justify-between mt-1 text-xs text-slate-500">
                            <span>Minor</span>
                            <span>Moderate</span>
                            <span>Severe</span>
                            <span>Total Loss</span>
                          </div>
                        </div>

                        {/* Claim Summary */}
                        <div className="bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl p-6 text-white">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-sm opacity-90 mb-1">Depreciated Value</p>
                              <p className="text-2xl font-bold">{formatCurrency(calculation.depreciatedValue)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm opacity-90 mb-1">Net Claim Amount</p>
                              <p className="text-2xl font-bold">{formatCurrency(calculation.netClaimAmount)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Scale className="h-4 w-4 text-[#0F4C81]" />
                            Calculation Breakdown
                          </h4>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-600 dark:text-slate-400">Claimable Amount</span>
                              <span className="font-medium">{formatCurrency(calculation.claimableAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-600 dark:text-slate-400">Less: Deductible</span>
                              <span className="font-medium text-red-500">-{formatCurrency(calculation.deductibleAmount)}</span>
                            </div>
                            {calculation.underinsurancePenalty > 0 && (
                              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-600 dark:text-slate-400">Underinsurance Penalty</span>
                                <span className="font-medium text-amber-500">-{formatCurrency(calculation.underinsurancePenalty)}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-600 dark:text-slate-400">Salvageable Value</span>
                              <span className="font-medium text-[#2E8B57]">+{formatCurrency(calculation.salvageableValue)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Coverage Analysis */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                            <p className="text-xs text-slate-500 mb-1">Effective Coverage</p>
                            <p className="text-lg font-bold text-[#0F4C81]">{formatCurrency(calculation.effectiveCoverage)}</p>
                          </div>
                          <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                            <p className="text-xs text-slate-500 mb-1">Coverage Gap</p>
                            <p className="text-lg font-bold text-red-600">{formatCurrency(calculation.coverageGap)}</p>
                          </div>
                        </div>

                        {/* Claim Viability */}
                        <div className={`rounded-lg p-4 ${calculation.isClaimViable ? 'bg-green-50 dark:bg-green-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {calculation.isClaimViable ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-amber-600" />
                            )}
                            <p className={`font-semibold ${calculation.isClaimViable ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                              {calculation.isClaimViable ? 'Claim Economically Viable' : 'Claim May Not Be Viable'}
                            </p>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{calculation.recommendation}</p>
                        </div>

                        {/* Next Steps */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300">Recommended Next Steps</h4>
                          <div className="space-y-2">
                            {calculation.nextSteps.map((step, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs font-medium text-[#0F4C81]">{index + 1}</span>
                                </div>
                                <span className="text-slate-600 dark:text-slate-400">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertTriangle className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">
                          Enter damage details and click Calculate
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="coverage">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#0F4C81]" />
                  Insurance Coverage Types
                </CardTitle>
                <CardDescription>Understanding different cargo insurance coverage options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {coverageTypes.map((type) => (
                    <div key={type.value} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">{type.label}</h4>
                        <Badge className="bg-[#0F4C81]/10 text-[#0F4C81]">
                          {type.coveragePercent}% Coverage
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {type.value === 'icc-a' && 'Most comprehensive coverage protecting against all risks of loss or damage except specifically excluded perils.'}
                        {type.value === 'icc-b' && 'Intermediate coverage for named perils including fire, explosion, sinking, stranding, and natural disasters.'}
                        {type.value === 'icc-c' && 'Basic coverage for major casualties including fire, explosion, vessel sinking, stranding, and collision.'}
                        {type.value === 'named-perils' && 'Limited coverage only for specifically named perils in the policy.'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Typical Deductible: {type.deductibleRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-[#0F4C81] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#0F4C81] mb-1">Coverage Tip</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Always insure cargo for CIF value + 10% to ensure full recovery in case of total loss.
                        Underinsurance can result in the average clause being applied, reducing your claim proportionally.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#2E8B57]" />
                    Claim Filing Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { step: 1, title: 'Immediate (0-24 hours)', desc: 'Notify insurer and document damage with photos/videos' },
                      { step: 2, title: 'Within 3 days', desc: 'Submit written notice of claim to carrier and insurer' },
                      { step: 3, title: 'Within 7 days', desc: 'Arrange survey if required by policy' },
                      { step: 4, title: 'Within 30 days', desc: 'Submit complete claim documentation' },
                      { step: 5, title: 'Within 1 year', desc: 'Legal action deadline for carrier claims' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-white">{item.step}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-300">{item.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileWarning className="h-5 w-5 text-[#0F4C81]" />
                    Required Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Commercial Invoice (original)',
                      'Packing List',
                      'Bill of Lading / Air Waybill',
                      'Insurance Certificate/Policy',
                      'Survey Report (if applicable)',
                      'Photos of Damage',
                      'Delivery Receipt with Remarks',
                      'Claim Form (completed)',
                      'Proof of Value',
                      'Repair/Replacement Quotes',
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 py-1">
                        <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{doc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                    Common Claim Mistakes to Avoid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { mistake: 'Delayed Notification', consequence: 'Claim may be denied if not reported within policy time limits' },
                      { mistake: 'Insufficient Documentation', consequence: 'Incomplete evidence can lead to reduced settlement' },
                      { mistake: 'Disposing Damaged Goods', consequence: 'Never dispose of damaged cargo without insurer approval' },
                      { mistake: 'Admitting Liability', consequence: 'Never admit fault to carrier or third parties' },
                      { mistake: 'Underinsurance', consequence: 'Average clause reduces payout proportionally' },
                      { mistake: 'Missing Time Limits', consequence: 'Claims can become time-barred after statutory period' },
                    ].map((item, index) => (
                      <div key={index} className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3">
                        <p className="font-medium text-red-700 dark:text-red-400">{item.mistake}</p>
                        <p className="text-sm text-red-600 dark:text-red-300">{item.consequence}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
