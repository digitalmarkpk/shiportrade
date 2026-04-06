'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Ship, Plane, Truck, Train, DollarSign, TrendingUp, AlertTriangle,
  Info, RefreshCw, Globe, Package, Scale, ArrowRight, Download, Share2,
  BarChart3, PieChart, BookOpen, HelpCircle, Sparkles, ChevronDown, ChevronUp,
  CheckCircle2, Clock, Fuel, Shield, FileText, Box, Zap, Route
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FreightRateResult {
  baseRate: number;
  fuelSurcharge: number;
  securitySurcharge: number;
  documentationFee: number;
  handlingFee: number;
  totalRate: number;
  costPerKg: number;
  costPerCbm: number;
  costPerContainer: number;
  transitDays: number;
  comparison: {
    mode: string;
    totalCost: number;
    transitDays: number;
    costEfficiency: string;
  }[];
  recommendations: string[];
}

// Rate benchmarks (per kg or per CBM)
const rateBenchmarks = {
  ocean: {
    'Asia-North America': { perCBM: 80, perContainer20: 2500, perContainer40: 3200, transit: 18 },
    'Asia-Europe': { perCBM: 70, perContainer20: 2200, perContainer40: 2800, transit: 32 },
    'Europe-North America': { perCBM: 90, perContainer20: 2800, perContainer40: 3600, transit: 14 },
    'Intra-Asia': { perCBM: 40, perContainer20: 1200, perContainer40: 1600, transit: 7 },
    'South America-Asia': { perCBM: 100, perContainer20: 3200, perContainer40: 4200, transit: 35 },
  },
  air: {
    'Asia-North America': { perKg: 4.5, transit: 3 },
    'Asia-Europe': { perKg: 3.8, transit: 2 },
    'Europe-North America': { perKg: 3.2, transit: 1 },
    'Intra-Asia': { perKg: 2.0, transit: 1 },
    'Global Average': { perKg: 4.0, transit: 2 },
  },
  rail: {
    'China-Europe': { perCBM: 120, transit: 16 },
    'Trans-Siberian': { perCBM: 100, transit: 20 },
  },
  road: {
    'Intra-Region': { perKg: 0.15, transit: 3 },
    'Cross-Border': { perKg: 0.20, transit: 5 },
  },
};

const routes = {
  ocean: Object.keys(rateBenchmarks.ocean),
  air: Object.keys(rateBenchmarks.air),
  rail: Object.keys(rateBenchmarks.rail),
  road: Object.keys(rateBenchmarks.road),
};

const COLORS = ['#0F4C81', '#2E8B57', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function FreightRateEstimator() {
  const [transportMode, setTransportMode] = useState<'ocean' | 'air' | 'rail' | 'road'>('ocean');
  const [route, setRoute] = useState('Asia-North America');
  const [cargoType, setCargoType] = useState<'fcl' | 'lcl' | 'bulk'>('fcl');
  const [containerType, setContainerType] = useState<'20GP' | '40GP' | '40HC'>('40HC');
  const [weight, setWeight] = useState('10000');
  const [volume, setVolume] = useState('50');
  const [customsValue, setCustomsValue] = useState('50000');
  const [result, setResult] = useState<FreightRateResult | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  // Calculate rate
  const calculateRate = () => {
    const weightNum = parseFloat(weight) || 0;
    const volumeNum = parseFloat(volume) || 0;
    const customsValueNum = parseFloat(customsValue) || 0;
    
    const benchmark = rateBenchmarks[transportMode]?.[route as keyof typeof rateBenchmarks[typeof transportMode]] 
      || { perCBM: 100, perKg: 4, transit: 14 };
    
    let baseRate = 0;
    let fuelSurcharge = 0;
    let securitySurcharge = 0;
    let documentationFee = 150;
    let handlingFee = 0;
    let costPerKg = 0;
    let costPerCbm = 0;
    let costPerContainer = 0;
    let transitDays = 0;
    
    if (transportMode === 'ocean') {
      if (cargoType === 'fcl') {
        baseRate = containerType === '20GP' 
          ? (benchmark as any).perContainer20 || 2500
          : (benchmark as any).perContainer40 || 3200;
        costPerContainer = baseRate;
      } else {
        baseRate = volumeNum * ((benchmark as any).perCBM || 80);
        costPerCbm = (benchmark as any).perCBM || 80;
      }
      fuelSurcharge = baseRate * 0.15;
      handlingFee = cargoType === 'fcl' ? 350 : 150;
      securitySurcharge = 75;
      transitDays = (benchmark as any).transit || 18;
    } else if (transportMode === 'air') {
      const chargeableWeight = Math.max(weightNum, volumeNum * 167);
      baseRate = chargeableWeight * ((benchmark as any).perKg || 4);
      costPerKg = (benchmark as any).perKg || 4;
      fuelSurcharge = chargeableWeight * 0.8;
      securitySurcharge = chargeableWeight * 0.15;
      handlingFee = 85;
      transitDays = (benchmark as any).transit || 3;
    } else if (transportMode === 'rail') {
      baseRate = volumeNum * ((benchmark as any).perCBM || 120);
      costPerCbm = (benchmark as any).perCBM || 120;
      fuelSurcharge = baseRate * 0.08;
      handlingFee = 200;
      securitySurcharge = 50;
      transitDays = (benchmark as any).transit || 16;
    } else {
      baseRate = weightNum * ((benchmark as any).perKg || 0.15);
      costPerKg = (benchmark as any).perKg || 0.15;
      fuelSurcharge = baseRate * 0.12;
      handlingFee = 100;
      transitDays = (benchmark as any).transit || 3;
    }
    
    const totalRate = baseRate + fuelSurcharge + securitySurcharge + documentationFee + handlingFee;
    
    // Generate comparison
    const comparison: FreightRateResult['comparison'] = [];
    
    if (transportMode !== 'ocean' && routes.ocean.includes(route)) {
      const oceanBench = rateBenchmarks.ocean[route as keyof typeof rateBenchmarks.ocean];
      if (oceanBench && cargoType === 'fcl') {
        const oceanCost = (oceanBench as any).perContainer40 || 3200;
        comparison.push({
          mode: 'Ocean (FCL)',
          totalCost: oceanCost * 1.25,
          transitDays: (oceanBench as any).transit || 18,
          costEfficiency: 'Most economical for large volumes',
        });
      }
    }
    
    if (transportMode !== 'air' && weightNum < 5000) {
      const airBench = rateBenchmarks.air['Asia-North America'];
      const chargeableWt = Math.max(weightNum, volumeNum * 167);
      const airCost = chargeableWt * ((airBench as any).perKg || 4) * 1.3;
      comparison.push({
        mode: 'Air Freight',
        totalCost: airCost,
        transitDays: (airBench as any).transit || 3,
        costEfficiency: 'Fastest option for urgent cargo',
      });
    }
    
    // Recommendations
    const recommendations: string[] = [];
    if (transportMode === 'air' && weightNum > 5000) {
      recommendations.push('For cargo over 5,000kg, consider ocean freight for cost savings');
    }
    if (transportMode === 'ocean' && volumeNum < 15 && cargoType === 'lcl') {
      recommendations.push('Small LCL shipment - consider air freight for time-sensitive cargo');
    }
    if (customsValueNum > 10000) {
      recommendations.push('High-value cargo - ensure adequate insurance coverage');
    }
    if (transportMode === 'ocean' && route.includes('Europe') && volumeNum > 30) {
      recommendations.push('Consider China-Europe rail as alternative to ocean freight');
    }
    
    setResult({
      baseRate: Math.round(baseRate * 100) / 100,
      fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
      securitySurcharge: Math.round(securitySurcharge * 100) / 100,
      documentationFee,
      handlingFee,
      totalRate: Math.round(totalRate * 100) / 100,
      costPerKg: Math.round(costPerKg * 100) / 100,
      costPerCbm: Math.round(costPerCbm * 100) / 100,
      costPerContainer: Math.round(costPerContainer * 100) / 100,
      transitDays,
      comparison,
      recommendations,
    });
  };

  // Memoized chart data
  const costBreakdownData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Base Rate', value: result.baseRate, color: '#0F4C81' },
      { name: 'Fuel Surcharge', value: result.fuelSurcharge, color: '#2E8B57' },
      { name: 'Security', value: result.securitySurcharge, color: '#F59E0B' },
      { name: 'Documentation', value: result.documentationFee, color: '#8B5CF6' },
      { name: 'Handling', value: result.handlingFee, color: '#06B6D4' },
    ];
  }, [result]);

  const resetForm = () => {
    setWeight('10000');
    setVolume('50');
    setCustomsValue('50000');
    setCargoType('fcl');
    setContainerType('40HC');
    setResult(null);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'ocean': return <Ship className="h-5 w-5" />;
      case 'air': return <Plane className="h-5 w-5" />;
      case 'rail': return <Train className="h-5 w-5" />;
      case 'road': return <Truck className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const handleModeChange = (mode: 'ocean' | 'air' | 'rail' | 'road') => {
    setTransportMode(mode);
    const routeOptions = routes[mode];
    if (routeOptions.length > 0) {
      setRoute(routeOptions[0]);
    }
    if (mode === 'air' || mode === 'road') {
      setCargoType('lcl');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Badge 
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white shadow-lg"
            >
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              Freight Rate Estimator
            </Badge>
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <Route className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Freight Rate Estimator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Estimate freight rates by route and transport mode with comprehensive cost breakdown and comparison
          </p>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-[#0F4C81]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Ship className="h-4 w-4 text-[#0F4C81]" />
                    <span className="text-xs text-muted-foreground">Ocean Freight</span>
                  </div>
                  <p className="text-lg font-bold text-[#0F4C81]">$40-100/CBM</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-[#2E8B57]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="h-4 w-4 text-[#2E8B57]" />
                    <span className="text-xs text-muted-foreground">Air Freight</span>
                  </div>
                  <p className="text-lg font-bold text-[#2E8B57]">$2.0-5.0/kg</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-amber-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Train className="h-4 w-4 text-amber-500" />
                    <span className="text-xs text-muted-foreground">Rail Freight</span>
                  </div>
                  <p className="text-lg font-bold text-amber-600">$100-150/CBM</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Road Freight</span>
                  </div>
                  <p className="text-lg font-bold text-purple-600">$0.15-0.25/kg</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Calculator Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#0F4C81]" />
                  Freight Parameters
                </CardTitle>
                <CardDescription>Select transport mode and enter cargo details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transport Mode Selection */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#2E8B57]" />
                    Transport Mode
                  </h4>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {(['ocean', 'air', 'rail', 'road'] as const).map((mode) => (
                      <Button
                        key={mode}
                        variant={transportMode === mode ? 'default' : 'outline'}
                        className={`flex flex-col h-auto py-3 ${transportMode === mode ? 'bg-gradient-to-r from-[#0F4C81] to-[#2E8B57]' : ''}`}
                        onClick={() => handleModeChange(mode)}
                      >
                        {getModeIcon(mode)}
                        <span className="text-xs mt-1 capitalize">{mode}</span>
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Route / Trade Lane</Label>
                    <Select value={route} onValueChange={setRoute}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {routes[transportMode].map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Cargo Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#0F4C81]" />
                    Cargo Information
                  </h4>
                  
                  {transportMode === 'ocean' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Shipment Type</Label>
                        <Select value={cargoType} onValueChange={(v: 'fcl' | 'lcl' | 'bulk') => setCargoType(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fcl">FCL (Full Container)</SelectItem>
                            <SelectItem value="lcl">LCL (Less Container)</SelectItem>
                            <SelectItem value="bulk">Bulk Cargo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {cargoType === 'fcl' && (
                        <div className="space-y-2">
                          <Label>Container Type</Label>
                          <Select value={containerType} onValueChange={(v: '20GP' | '40GP' | '40HC') => setContainerType(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="20GP">20GP (20ft Standard)</SelectItem>
                              <SelectItem value="40GP">40GP (40ft Standard)</SelectItem>
                              <SelectItem value="40HC">40HC (40ft High Cube)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="volume">Volume (CBM)</Label>
                      <Input id="volume" type="number" value={volume} onChange={(e) => setVolume(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customsValue">Declared Customs Value (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                      <Input id="customsValue" type="number" value={customsValue} onChange={(e) => setCustomsValue(e.target.value)} className="pl-8" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={calculateRate} className="flex-1 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90">
                    <Calculator className="h-4 w-4 mr-2" />
                    Estimate Rate
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                  Rate Estimate
                </CardTitle>
                <CardDescription>Detailed cost breakdown and comparisons</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                      {/* Total Cost */}
                      <div className="bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl p-6 text-white text-center">
                        <p className="text-sm opacity-90 mb-2">Estimated Total Freight</p>
                        <p className="text-4xl font-bold">${result.totalRate.toLocaleString()}</p>
                        <p className="text-sm opacity-75 mt-2">Transit: {result.transitDays} days</p>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">Cost Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400">Base Rate</span>
                            <Badge variant="secondary">${result.baseRate.toLocaleString()}</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400">Fuel Surcharge</span>
                            <Badge variant="secondary">${result.fuelSurcharge.toLocaleString()}</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400">Security Surcharge</span>
                            <Badge variant="secondary">${result.securitySurcharge.toLocaleString()}</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400">Documentation Fee</span>
                            <Badge variant="secondary">${result.documentationFee}</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-slate-600 dark:text-slate-400">Handling Fee</span>
                            <Badge variant="secondary">${result.handlingFee}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Unit Rates */}
                      {(result.costPerKg > 0 || result.costPerCbm > 0) && (
                        <div className="grid grid-cols-2 gap-4">
                          {result.costPerKg > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
                              <p className="text-xs text-slate-500">Rate per kg</p>
                              <p className="font-semibold text-[#0F4C81]">${result.costPerKg}</p>
                            </div>
                          )}
                          {result.costPerCbm > 0 && (
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 text-center">
                              <p className="text-xs text-slate-500">Rate per CBM</p>
                              <p className="font-semibold text-[#2E8B57]">${result.costPerCbm}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mode Comparison */}
                      {result.comparison.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300">Transport Mode Comparison</h4>
                          <div className="space-y-2">
                            {result.comparison.map((comp, index) => (
                              <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">{comp.mode}</span>
                                  <Badge>${comp.totalCost.toLocaleString()}</Badge>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                  <span>Transit: {comp.transitDays} days</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{comp.costEfficiency}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {result.recommendations.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4 text-amber-600" />
                            <span className="font-medium text-amber-700 dark:text-amber-400">Recommendations</span>
                          </div>
                          <ul className="space-y-2">
                            {result.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-amber-600 dark:text-amber-300 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
                      <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">Enter your shipment details and click &quot;Estimate Rate&quot; to see the freight rate breakdown</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
