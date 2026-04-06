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
  Calculator, TrendingUp, TrendingDown, DollarSign, Percent, BarChart3,
  PieChart, Scale, Target, AlertTriangle, Info, CheckCircle2, RefreshCw, Zap, ArrowUpRight
} from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts';
import { currencies, formatCurrency } from '@/lib/constants/currencies';

interface MarginResult {
  revenue: number;
  totalCost: number;
  grossProfit: number;
  grossMargin: number;
  grossMarginPercent: number;
  netProfit: number;
  netMargin: number;
  netMarginPercent: number;
  markup: number;
  markupPercent: number;
  roi: number;
  breakEvenPrice: number;
}

interface CostBreakdown {
  item: string;
  amount: number;
  percentOfCost: number;
}

const COLORS = ['#0F4C81', '#2E8B57', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];

// Industry Benchmarks
const industryBenchmarks = [
  { industry: 'Retail', avgGrossMargin: '25-35%', avgNetMargin: '2-5%', avgMarkup: '30-50%' },
  { industry: 'Manufacturing', avgGrossMargin: '20-35%', avgNetMargin: '5-10%', avgMarkup: '25-40%' },
  { industry: 'E-commerce', avgGrossMargin: '30-45%', avgNetMargin: '5-15%', avgMarkup: '40-80%' },
  { industry: 'Wholesale', avgGrossMargin: '10-20%', avgNetMargin: '2-5%', avgMarkup: '15-25%' },
];

export default function TradeMarginAnalyzer() {
  const [currency, setCurrency] = useState('USD');
  const [sellingPrice, setSellingPrice] = useState('100');
  const [productCost, setProductCost] = useState('50');
  const [freightCost, setFreightCost] = useState('8');
  const [customsDuty, setCustomsDuty] = useState('5');
  const [insuranceCost, setInsuranceCost] = useState('2');
  const [otherCosts, setOtherCosts] = useState('3');
  const [marketingCost, setMarketingCost] = useState('5');
  const [overheadCost, setOverheadCost] = useState('3');
  const [targetMargin, setTargetMargin] = useState('30');
  const [result, setResult] = useState<MarginResult | null>(null);

  const parseNum = (val: string) => parseFloat(val) || 0;

  const costBreakdown = useMemo((): CostBreakdown[] => {
    const product = parseNum(productCost);
    const freight = parseNum(freightCost);
    const duty = parseNum(customsDuty);
    const insurance = parseNum(insuranceCost);
    const other = parseNum(otherCosts);
    const marketing = parseNum(marketingCost);
    const overhead = parseNum(overheadCost);
    
    const total = product + freight + duty + insurance + other + marketing + overhead;
    
    return [
      { item: 'Product Cost', amount: product, percentOfCost: total > 0 ? (product / total) * 100 : 0 },
      { item: 'Freight', amount: freight, percentOfCost: total > 0 ? (freight / total) * 100 : 0 },
      { item: 'Customs Duty', amount: duty, percentOfCost: total > 0 ? (duty / total) * 100 : 0 },
      { item: 'Insurance', amount: insurance, percentOfCost: total > 0 ? (insurance / total) * 100 : 0 },
      { item: 'Other Costs', amount: other, percentOfCost: total > 0 ? (other / total) * 100 : 0 },
      { item: 'Marketing', amount: marketing, percentOfCost: total > 0 ? (marketing / total) * 100 : 0 },
      { item: 'Overhead', amount: overhead, percentOfCost: total > 0 ? (overhead / total) * 100 : 0 },
    ].filter(c => c.amount > 0);
  }, [productCost, freightCost, customsDuty, insuranceCost, otherCosts, marketingCost, overheadCost]);

  const analyzeMargins = () => {
    const price = parseNum(sellingPrice);
    const product = parseNum(productCost);
    const freight = parseNum(freightCost);
    const duty = parseNum(customsDuty);
    const insurance = parseNum(insuranceCost);
    const other = parseNum(otherCosts);
    const marketing = parseNum(marketingCost);
    const overhead = parseNum(overheadCost);
    const target = parseNum(targetMargin);

    const landedCost = product + freight + duty + insurance + other;
    const totalCost = landedCost + marketing + overhead;
    const revenue = price;
    const grossProfit = price - landedCost;
    const grossMarginPercent = price > 0 ? (grossProfit / price) * 100 : 0;
    const netProfit = revenue - totalCost;
    const netMarginPercent = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const markupPercent = landedCost > 0 ? ((price - landedCost) / landedCost) * 100 : 0;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const breakEvenPrice = landedCost / (1 - target / 100);

    setResult({
      revenue,
      totalCost,
      grossProfit,
      grossMargin: grossProfit,
      grossMarginPercent,
      netProfit,
      netMargin: netProfit,
      netMarginPercent,
      markup: grossProfit,
      markupPercent,
      roi,
      breakEvenPrice,
    });
  };

  const pieChartData = useMemo(() => {
    return costBreakdown.map((item, index) => ({
      name: item.item,
      value: item.amount,
    }));
  }, [costBreakdown]);

  const getMarginColor = (margin: number) => {
    if (margin >= 30) return 'text-green-500';
    if (margin >= 15) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMarginBadge = (margin: number) => {
    if (margin >= 30) return <Badge className="bg-[#2E8B57]">Healthy</Badge>;
    if (margin >= 15) return <Badge className="bg-yellow-500">Moderate</Badge>;
    return <Badge className="bg-red-500">Low</Badge>;
  };

  const resetForm = () => {
    setSellingPrice('100');
    setProductCost('50');
    setFreightCost('8');
    setCustomsDuty('5');
    setInsuranceCost('2');
    setOtherCosts('3');
    setMarketingCost('5');
    setOverheadCost('3');
    setTargetMargin('30');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Badge className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white shadow-lg mb-4">
            <Zap className="h-4 w-4 mr-2 animate-pulse" />
            Trade Profitability Tool
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <Percent className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Trade Margin Analyzer
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Analyze profit margins on trade deals with comprehensive cost breakdown and industry benchmarks
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#0F4C81]" />
                  Pricing & Costs
                </CardTitle>
                <CardDescription>Enter your pricing and cost information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Label className="shrink-0">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {currencies.slice(0, 20).map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Selling Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Cost</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="number" value={productCost} onChange={(e) => setProductCost(e.target.value)} className="pl-10" />
                  </div>
                </div>

                <Separator />

                <h4 className="font-semibold text-slate-700 dark:text-slate-300">Landed Costs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Freight Cost</Label>
                    <Input type="number" value={freightCost} onChange={(e) => setFreightCost(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Customs Duty</Label>
                    <Input type="number" value={customsDuty} onChange={(e) => setCustomsDuty(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Insurance</Label>
                    <Input type="number" value={insuranceCost} onChange={(e) => setInsuranceCost(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Other Costs</Label>
                    <Input type="number" value={otherCosts} onChange={(e) => setOtherCosts(e.target.value)} />
                  </div>
                </div>

                <Separator />

                <h4 className="font-semibold text-slate-700 dark:text-slate-300">Operating Costs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Marketing</Label>
                    <Input type="number" value={marketingCost} onChange={(e) => setMarketingCost(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Overhead</Label>
                    <Input type="number" value={overheadCost} onChange={(e) => setOverheadCost(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Target Margin (%)</Label>
                  <Input type="number" value={targetMargin} onChange={(e) => setTargetMargin(e.target.value)} />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={analyzeMargins} className="flex-1 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90">
                    <Calculator className="h-4 w-4 mr-2" />
                    Analyze Margins
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                  Margin Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl p-6 text-white">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-xs opacity-75">Gross Margin</p>
                          <p className="text-3xl font-bold">{result.grossMarginPercent.toFixed(1)}%</p>
                          {getMarginBadge(result.grossMarginPercent)}
                        </div>
                        <div className="text-center">
                          <p className="text-xs opacity-75">Net Margin</p>
                          <p className="text-3xl font-bold">{result.netMarginPercent.toFixed(1)}%</p>
                          {getMarginBadge(result.netMarginPercent)}
                        </div>
                      </div>
                    </div>

                    {/* Profitability */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">Gross Profit</p>
                        <p className="text-xl font-bold text-[#0F4C81]">{formatCurrency(result.grossProfit, currency)}</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">Net Profit</p>
                        <p className={`text-xl font-bold ${result.netProfit >= 0 ? 'text-[#2E8B57]' : 'text-red-500'}`}>{formatCurrency(result.netProfit, currency)}</p>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Markup</p>
                        <p className="font-bold">{result.markupPercent.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className={`font-bold ${result.roi >= 0 ? 'text-[#2E8B57]' : 'text-red-500'}`}>{result.roi.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Break-Even Price</p>
                        <p className="font-bold">{formatCurrency(result.breakEvenPrice, currency)}</p>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300">Cost Breakdown</h4>
                      {costBreakdown.map((item, index) => (
                        <div key={item.item} className="flex justify-between items-center py-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{item.item}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatCurrency(item.amount, currency)}</span>
                            <span className="text-xs text-muted-foreground">({item.percentOfCost.toFixed(1)}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Percent className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">Enter pricing and costs to analyze margins</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Industry Benchmarks */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#0F4C81]" />
                  Industry Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {industryBenchmarks.map((bench) => (
                    <div key={bench.industry} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="font-medium">{bench.industry}</span>
                      <div className="text-right text-sm">
                        <span className="text-muted-foreground">Gross: {bench.avgGrossMargin}</span>
                        <span className="mx-2">|</span>
                        <span className="text-muted-foreground">Net: {bench.avgNetMargin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
