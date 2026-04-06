'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calculator, Ship, Plane, Truck, TrendingUp, DollarSign, Package, Receipt,
  BarChart3, PieChart, BookOpen, HelpCircle, RefreshCw, Info, AlertTriangle,
  CheckCircle2, FileText, Zap, Download, Share2, Scale
} from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

interface ShippingCostResult {
  freightCost: number;
  fuelSurcharge: number;
  securitySurcharge: number;
  documentationFee: number;
  handlingFee: number;
  insuranceCost: number;
  customsDuty: number;
  terminalCharges: number;
  totalCost: number;
  costPerKg: number;
  costPerCbm: number;
  breakdown: { name: string; value: number; percent: number }[];
}

const COLORS = ['#0F4C81', '#2E8B57', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'];

export default function ShippingCostAnalyzer() {
  const [transportMode, setTransportMode] = useState<'ocean' | 'air' | 'road'>('ocean');
  const [weight, setWeight] = useState('1000');
  const [volume, setVolume] = useState('5');
  const [cargoValue, setCargoValue] = useState('10000');
  const [origin, setOrigin] = useState('Asia');
  const [destination, setDestination] = useState('North America');
  const [incoterm, setIncoterm] = useState('FOB');
  const [insuranceRate, setInsuranceRate] = useState('0.5');
  const [customsRate, setCustomsRate] = useState('5');
  const [result, setResult] = useState<ShippingCostResult | null>(null);

  const calculateCosts = () => {
    const weightNum = parseFloat(weight) || 0;
    const volumeNum = parseFloat(volume) || 0;
    const valueNum = parseFloat(cargoValue) || 0;
    const insuranceRateNum = parseFloat(insuranceRate) || 0;
    const customsRateNum = parseFloat(customsRate) || 0;

    // Base rates by mode
    let freightCost = 0;
    let fuelSurcharge = 0;
    let securitySurcharge = 0;
    let handlingFee = 0;
    let terminalCharges = 0;

    if (transportMode === 'ocean') {
      const cbmRate = 80;
      freightCost = volumeNum * cbmRate;
      fuelSurcharge = freightCost * 0.15;
      securitySurcharge = 75;
      handlingFee = 150;
      terminalCharges = 350;
    } else if (transportMode === 'air') {
      const chargeableWeight = Math.max(weightNum, volumeNum * 167);
      const kgRate = 4;
      freightCost = chargeableWeight * kgRate;
      fuelSurcharge = chargeableWeight * 0.8;
      securitySurcharge = chargeableWeight * 0.15;
      handlingFee = 85;
      terminalCharges = 100;
    } else {
      const kgRate = 0.15;
      freightCost = weightNum * kgRate;
      fuelSurcharge = freightCost * 0.12;
      securitySurcharge = 50;
      handlingFee = 75;
      terminalCharges = 50;
    }

    const documentationFee = 150;
    const insuranceCost = valueNum * (insuranceRateNum / 100);
    const customsDuty = valueNum * (customsRateNum / 100);

    const totalCost = freightCost + fuelSurcharge + securitySurcharge + documentationFee + handlingFee + insuranceCost + customsDuty + terminalCharges;

    const chargeableWeight = transportMode === 'air' ? Math.max(weightNum, volumeNum * 167) : weightNum;
    const costPerKg = chargeableWeight > 0 ? totalCost / chargeableWeight : 0;
    const costPerCbm = volumeNum > 0 ? totalCost / volumeNum : 0;

    const breakdown = [
      { name: 'Freight', value: freightCost, percent: (freightCost / totalCost) * 100 },
      { name: 'Fuel Surcharge', value: fuelSurcharge, percent: (fuelSurcharge / totalCost) * 100 },
      { name: 'Insurance', value: insuranceCost, percent: (insuranceCost / totalCost) * 100 },
      { name: 'Customs Duty', value: customsDuty, percent: (customsDuty / totalCost) * 100 },
      { name: 'Terminal Charges', value: terminalCharges, percent: (terminalCharges / totalCost) * 100 },
      { name: 'Handling', value: handlingFee, percent: (handlingFee / totalCost) * 100 },
      { name: 'Documentation', value: documentationFee, percent: (documentationFee / totalCost) * 100 },
      { name: 'Security', value: securitySurcharge, percent: (securitySurcharge / totalCost) * 100 },
    ];

    setResult({
      freightCost: Math.round(freightCost * 100) / 100,
      fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
      securitySurcharge: Math.round(securitySurcharge * 100) / 100,
      documentationFee,
      handlingFee,
      insuranceCost: Math.round(insuranceCost * 100) / 100,
      customsDuty: Math.round(customsDuty * 100) / 100,
      terminalCharges,
      totalCost: Math.round(totalCost * 100) / 100,
      costPerKg: Math.round(costPerKg * 100) / 100,
      costPerCbm: Math.round(costPerCbm * 100) / 100,
      breakdown,
    });
  };

  const pieChartData = useMemo(() => {
    if (!result) return [];
    return result.breakdown.map((item, index) => ({
      name: item.name,
      value: item.value,
      percent: item.percent,
    }));
  }, [result]);

  const resetForm = () => {
    setWeight('1000');
    setVolume('5');
    setCargoValue('10000');
    setInsuranceRate('0.5');
    setCustomsRate('5');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Badge className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white shadow-lg mb-4">
            <Zap className="h-4 w-4 mr-2 animate-pulse" />
            Cost Analysis Tool
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <Receipt className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Shipping Cost Analyzer
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive shipping cost breakdown analysis including freight, duties, insurance, and all surcharges
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#0F4C81]" />
                  Shipment Details
                </CardTitle>
                <CardDescription>Enter shipment information for cost analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transport Mode */}
                <div className="space-y-2">
                  <Label>Transport Mode</Label>
                  <Select value={transportMode} onValueChange={(v: 'ocean' | 'air' | 'road') => setTransportMode(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ocean">Ocean Freight</SelectItem>
                      <SelectItem value="air">Air Freight</SelectItem>
                      <SelectItem value="road">Road Freight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Route */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Origin</Label>
                    <Select value={origin} onValueChange={setOrigin}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia">Asia</SelectItem>
                        <SelectItem value="Europe">Europe</SelectItem>
                        <SelectItem value="North America">North America</SelectItem>
                        <SelectItem value="South America">South America</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia">Asia</SelectItem>
                        <SelectItem value="Europe">Europe</SelectItem>
                        <SelectItem value="North America">North America</SelectItem>
                        <SelectItem value="South America">South America</SelectItem>
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Volume (CBM)</Label>
                      <Input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Cargo Value (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                      <Input type="number" value={cargoValue} onChange={(e) => setCargoValue(e.target.value)} className="pl-8" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Costs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Insurance Rate (%)</Label>
                      <Input type="number" step="0.1" value={insuranceRate} onChange={(e) => setInsuranceRate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Customs Duty (%)</Label>
                      <Input type="number" step="0.1" value={customsRate} onChange={(e) => setCustomsRate(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Incoterms</Label>
                    <Select value={incoterm} onValueChange={setIncoterm}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                        <SelectItem value="FOB">FOB - Free On Board</SelectItem>
                        <SelectItem value="CIF">CIF - Cost Insurance Freight</SelectItem>
                        <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={calculateCosts} className="flex-1 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90">
                    <Calculator className="h-4 w-4 mr-2" />
                    Analyze Costs
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
                  <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                  Cost Analysis
                </CardTitle>
                <CardDescription>Comprehensive shipping cost breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Total Cost */}
                    <div className="bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl p-6 text-white text-center">
                      <p className="text-sm opacity-90 mb-2">Total Shipping Cost</p>
                      <p className="text-4xl font-bold">${result.totalCost.toLocaleString()}</p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs opacity-75">Cost per kg</p>
                          <p className="text-lg font-semibold">${result.costPerKg}</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-75">Cost per CBM</p>
                          <p className="text-lg font-semibold">${result.costPerCbm}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300">Detailed Breakdown</h4>
                      {result.breakdown.map((item, index) => (
                        <div key={item.name} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">${item.value.toFixed(2)}</Badge>
                            <span className="text-xs text-muted-foreground">{item.percent.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Receipt className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">Enter shipment details to see cost analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
