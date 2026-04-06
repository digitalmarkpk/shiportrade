"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Globe, Shield, AlertTriangle, Calculator, Info } from 'lucide-react';

interface CurrencyExposure {
  currency: string;
  amount: number;
  rate: number;
  baseValue: number;
  volatility: number;
  hedged: number;
}

interface RiskMetrics {
  totalExposure: number;
  hedgedAmount: number;
  unhedgedRisk: number;
  maxPotentialLoss: number;
  var95: number;
  effectiveHedgeRatio: number;
  diversificationScore: number;
}

const defaultExposures: CurrencyExposure[] = [
  { currency: 'EUR', amount: 500000, rate: 1.08, baseValue: 540000, volatility: 8.5, hedged: 300000 },
  { currency: 'GBP', amount: 300000, rate: 1.27, baseValue: 381000, volatility: 10.2, hedged: 150000 },
  { currency: 'JPY', amount: 50000000, rate: 0.0067, baseValue: 335000, volatility: 7.8, hedged: 25000000 },
  { currency: 'CNY', amount: 2000000, rate: 0.14, baseValue: 280000, volatility: 4.5, hedged: 1000000 },
  { currency: 'MXN', amount: 8000000, rate: 0.058, baseValue: 464000, volatility: 12.5, hedged: 4000000 },
];

const historicalData = [
  { month: 'Jan', eur: 1.08, gbp: 1.27, jpy: 145, cny: 7.15, mxn: 17.2 },
  { month: 'Feb', eur: 1.07, gbp: 1.26, jpy: 148, cny: 7.18, mxn: 17.5 },
  { month: 'Mar', eur: 1.09, gbp: 1.28, jpy: 150, cny: 7.12, mxn: 17.0 },
  { month: 'Apr', eur: 1.08, gbp: 1.26, jpy: 152, cny: 7.20, mxn: 17.8 },
  { month: 'May', eur: 1.10, gbp: 1.27, jpy: 148, cny: 7.15, mxn: 17.3 },
  { month: 'Jun', eur: 1.08, gbp: 1.27, jpy: 150, cny: 7.18, mxn: 17.5 },
];

const COLORS = ['#0F4C81', '#2E8B57', '#FFA500', '#FF6B6B', '#8884d8'];

export default function CurrencyRiskAnalyzer() {
  const [exposures, setExposures] = useState<CurrencyExposure[]>(defaultExposures);
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [transactionAmount, setTransactionAmount] = useState<number>(100000);
  const [sourceCurrency, setSourceCurrency] = useState<string>('EUR');
  const [targetCurrency, setTargetCurrency] = useState<string>('USD');
  const [hedgePercentage, setHedgePercentage] = useState<number>(50);
  const [hedgeCost, setHedgeCost] = useState<number>(0.5);
  const [timeHorizon, setTimeHorizon] = useState<number>(90);

  const riskMetrics: RiskMetrics = useMemo(() => {
    const totalExposure = exposures.reduce((sum, e) => sum + e.baseValue, 0);
    const hedgedAmount = exposures.reduce((sum, e) => {
      const hedgeRate = exposures.find(x => x.currency === e.currency)?.rate || 1;
      return sum + (e.hedged * hedgeRate);
    }, 0);
    const unhedgedAmount = totalExposure - hedgedAmount;
    
    const unhedgedRisk = exposures.reduce((sum, e) => {
      const unhedged = e.amount - e.hedged;
      const risk = (unhedged * e.rate * e.volatility / 100);
      return sum + risk;
    }, 0);
    
    const maxPotentialLoss = exposures.reduce((sum, e) => {
      const unhedged = e.amount - e.hedged;
      return sum + (unhedged * e.rate * e.volatility / 100 * 2);
    }, 0);
    
    const var95 = maxPotentialLoss * 0.65;
    const effectiveHedgeRatio = totalExposure > 0 ? (hedgedAmount / totalExposure) * 100 : 0;
    
    const weights = exposures.map(e => e.baseValue / totalExposure);
    const diversificationScore = 100 - (Math.max(...weights) * 100);

    return {
      totalExposure,
      hedgedAmount: Math.round(hedgedAmount),
      unhedgedRisk: Math.round(unhedgedRisk),
      maxPotentialLoss: Math.round(maxPotentialLoss),
      var95: Math.round(var95),
      effectiveHedgeRatio: Math.round(effectiveHedgeRatio * 10) / 10,
      diversificationScore: Math.round(diversificationScore * 10) / 10
    };
  }, [exposures]);

  const hedgeAnalysis = useMemo(() => {
    const unhedgedAmount = transactionAmount * (1 - hedgePercentage / 100);
    const hedgedAmount = transactionAmount * (hedgePercentage / 100);
    const hedgePremium = hedgedAmount * (hedgeCost / 100);
    const potentialGain = unhedgedAmount * 0.05;
    const potentialLoss = unhedgedAmount * 0.05;
    const netHedgedCost = hedgePremium;
    const netUnhedgedRisk = potentialLoss;

    return {
      unhedgedAmount,
      hedgedAmount,
      hedgePremium: Math.round(hedgePremium),
      potentialGain: Math.round(potentialGain),
      potentialLoss: Math.round(potentialLoss),
      netHedgedCost,
      netUnhedgedRisk,
      recommendation: hedgePercentage >= 70 ? 'Conservative' : hedgePercentage >= 40 ? 'Balanced' : 'Aggressive'
    };
  }, [transactionAmount, hedgePercentage, hedgeCost]);

  const exposureByCurrency = useMemo(() => {
    return exposures.map(e => ({
      name: e.currency,
      exposure: e.baseValue,
      hedged: e.hedged * e.rate,
      unhedged: (e.amount - e.hedged) * e.rate,
      risk: Math.round((e.amount - e.hedged) * e.rate * e.volatility / 100)
    }));
  }, [exposures]);

  const recommendations = useMemo(() => {
    const recs: { type: 'success' | 'warning' | 'error' | 'info'; message: string; action: string }[] = [];

    if (riskMetrics.effectiveHedgeRatio < 30) {
      recs.push({ type: 'error', message: 'Low hedge coverage', action: 'Consider increasing hedge ratio to at least 50% to reduce exposure' });
    } else if (riskMetrics.effectiveHedgeRatio > 80) {
      recs.push({ type: 'info', message: 'Very high hedge coverage', action: 'Review hedge costs vs. risk reduction benefits' });
    }

    const highVolExposures = exposures.filter(e => e.volatility > 10 && (e.amount - e.hedged) * e.rate > 50000);
    if (highVolExposures.length > 0) {
      recs.push({ type: 'warning', message: `High volatility exposure in ${highVolExposures.map(e => e.currency).join(', ')}`, action: 'Consider increasing hedge coverage for volatile currencies' });
    }

    if (riskMetrics.diversificationScore < 50) {
      recs.push({ type: 'warning', message: 'Concentrated currency exposure', action: 'Diversify currency holdings or use natural hedging through matching revenues and costs' });
    }

    if (riskMetrics.var95 > riskMetrics.totalExposure * 0.1) {
      recs.push({ type: 'warning', message: 'High Value-at-Risk relative to exposure', action: 'Review risk tolerance and consider additional hedging instruments' });
    }

    return recs;
  }, [riskMetrics, exposures]);

  const getRecommendationStyle = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default: return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-[#0F4C81]" />
            Currency Risk Analyzer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Analyze foreign exchange exposure, calculate hedging strategies, and manage currency risk in international trade
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exposure">Exposure</TabsTrigger>
          <TabsTrigger value="hedging">Hedging</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Exposure</p>
                    <p className="text-xl font-bold">${(riskMetrics.totalExposure / 1000000).toFixed(2)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hedge Ratio</p>
                    <p className="text-xl font-bold">{riskMetrics.effectiveHedgeRatio}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">VaR (95%)</p>
                    <p className="text-xl font-bold">${riskMetrics.var95.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Max Loss Risk</p>
                    <p className="text-xl font-bold">${riskMetrics.maxPotentialLoss.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exposure Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exposure by Currency</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={exposureByCurrency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="hedged" stackId="a" fill="#2E8B57" name="Hedged" />
                    <Bar dataKey="unhedged" stackId="a" fill="#0F4C81" name="Unhedged" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={exposureByCurrency}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="risk"
                      label={({ name, risk }) => `${name}: $${risk}`}
                    >
                      {exposureByCurrency.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Currency Exposure Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Currency Exposure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Currency</th>
                      <th className="text-right p-3">Amount</th>
                      <th className="text-right p-3">Rate</th>
                      <th className="text-right p-3">USD Value</th>
                      <th className="text-right p-3">Volatility</th>
                      <th className="text-right p-3">Hedged</th>
                      <th className="text-right p-3">Risk ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exposures.map((exp) => {
                      const risk = Math.round((exp.amount - exp.hedged) * exp.rate * exp.volatility / 100);
                      return (
                        <tr key={exp.currency} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{exp.currency}</td>
                          <td className="p-3 text-right">{exp.amount.toLocaleString()}</td>
                          <td className="p-3 text-right">{exp.rate}</td>
                          <td className="p-3 text-right">${exp.baseValue.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <span className={exp.volatility > 10 ? 'text-red-600' : exp.volatility > 7 ? 'text-yellow-600' : 'text-green-600'}>
                              {exp.volatility}%
                            </span>
                          </td>
                          <td className="p-3 text-right text-green-600">{exp.hedged.toLocaleString()}</td>
                          <td className="p-3 text-right text-red-600">${risk.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exposure" className="space-y-4">
          {/* Historical Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Historical Exchange Rate Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" domain={[1.0, 1.15]} />
                  <YAxis yAxisId="right" orientation="right" domain={[140, 155]} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="eur" stroke="#0F4C81" name="EUR/USD" strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="gbp" stroke="#2E8B57" name="GBP/USD" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="jpy" stroke="#FFA500" name="JPY/USD (÷100)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Volatility Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Currency Volatility Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={exposures}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="currency" />
                  <YAxis domain={[0, 15]} />
                  <Tooltip />
                  <Bar dataKey="volatility" fill="#0F4C81" name="Volatility %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hedging" className="space-y-4">
          {/* Hedging Calculator */}
          <Card>
            <CardHeader>
              <CardTitle>Hedging Strategy Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Transaction Amount</Label>
                    <Input
                      type="number"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Source Currency</Label>
                    <Select value={sourceCurrency} onValueChange={setSourceCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                        <SelectItem value="MXN">MXN - Mexican Peso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Currency</Label>
                    <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hedge Percentage (%)</Label>
                    <Input
                      type="number"
                      value={hedgePercentage}
                      onChange={(e) => setHedgePercentage(Number(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hedge Cost (%)</Label>
                    <Input
                      type="number"
                      value={hedgeCost}
                      onChange={(e) => setHedgeCost(Number(e.target.value))}
                      min={0}
                      max={5}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time Horizon (days)</Label>
                    <Input
                      type="number"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(Number(e.target.value))}
                      min={1}
                      max={365}
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-3">Hedge Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Unhedged Amount:</span>
                      <span className="font-medium">${hedgeAnalysis.unhedgedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hedged Amount:</span>
                      <span className="font-medium">${hedgeAnalysis.hedgedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hedge Premium:</span>
                      <span className="font-medium text-red-600">${hedgeAnalysis.hedgePremium.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potential Gain:</span>
                      <span className="font-medium text-green-600">+${hedgeAnalysis.potentialGain.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potential Loss:</span>
                      <span className="font-medium text-red-600">-${hedgeAnalysis.potentialLoss.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span>Strategy:</span>
                      <span className="font-bold">{hedgeAnalysis.recommendation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hedging Instruments */}
          <Card>
            <CardHeader>
              <CardTitle>Hedging Instruments Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Instrument</th>
                      <th className="text-center p-3">Cost</th>
                      <th className="text-center p-3">Flexibility</th>
                      <th className="text-center p-3">Best For</th>
                      <th className="text-center p-3">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Forward Contract</td>
                      <td className="p-3 text-center">Low</td>
                      <td className="p-3 text-center text-red-600">Low</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">Certain payment dates</td>
                      <td className="p-3 text-center text-green-600">Low</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Currency Option</td>
                      <td className="p-3 text-center text-red-600">High</td>
                      <td className="p-3 text-center text-green-600">High</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">Uncertain timing</td>
                      <td className="p-3 text-center text-green-600">Low</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Currency Swap</td>
                      <td className="p-3 text-center">Medium</td>
                      <td className="p-3 text-center text-yellow-600">Medium</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">Long-term exposure</td>
                      <td className="p-3 text-center text-green-600">Low</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Natural Hedge</td>
                      <td className="p-3 text-center text-green-600">None</td>
                      <td className="p-3 text-center text-green-600">High</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">Matching revenues/costs</td>
                      <td className="p-3 text-center text-yellow-600">Medium</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">No Hedge</td>
                      <td className="p-3 text-center text-green-600">None</td>
                      <td className="p-3 text-center text-green-600">Full</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">Low exposure/risk tolerance</td>
                      <td className="p-3 text-center text-red-600">High</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                Risk Management Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-4 border rounded-lg ${getRecommendationStyle(rec.type)}`}>
                  <p className="font-medium">{rec.message}</p>
                  <p className="text-sm text-muted-foreground mt-1">{rec.action}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Risk Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Scenario Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={[
                  { scenario: 'Base Case', value: 0 },
                  { scenario: '5% Appreciation', value: riskMetrics.unhedgedRisk * -1 },
                  { scenario: '5% Depreciation', value: riskMetrics.unhedgedRisk },
                  { scenario: '10% Move', value: riskMetrics.maxPotentialLoss },
                  { scenario: 'Stress Test', value: riskMetrics.maxPotentialLoss * 1.5 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Bar dataKey="value" fill="#0F4C81" name="P&L Impact" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0F4C81]">{riskMetrics.diversificationScore}%</p>
                  <p className="text-sm text-muted-foreground">Diversification Score</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#2E8B57]">${riskMetrics.hedgedAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Protected Value</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">${riskMetrics.unhedgedRisk.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Unhedged Risk</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is currency risk in international trade?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Currency risk (or FX risk) is the potential for financial loss due to exchange rate fluctuations between the time a transaction is agreed and when payment is made. For importers, a weakening domestic currency increases costs. For exporters, a strengthening domestic currency reduces revenue in foreign markets.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is the optimal hedge ratio?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    There is no single optimal hedge ratio—it depends on your risk tolerance, cost sensitivity, and business model. Conservative companies hedge 70-90% of exposure. Moderate hedgers target 40-60%. Aggressive strategies may hedge only 20-30% or rely on natural hedges. Consider volatility, time horizon, and hedge costs when determining your ratio.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is Value at Risk (VaR) for currency?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    VaR estimates the maximum expected loss over a specific time period at a given confidence level (typically 95% or 99%). A 95% VaR of $50,000 means there is only a 5% chance of losing more than $50,000 due to currency movements. It helps quantify and communicate risk to stakeholders.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is natural hedging?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Natural hedging involves matching foreign currency revenues with costs in the same currency, eliminating the need for financial instruments. For example, a US company with EUR revenues could source materials from EUR-zone suppliers or borrow in EUR. This approach has no direct cost but requires operational flexibility.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How do forward contracts work?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    A forward contract locks in an exchange rate today for a future transaction. Both parties are obligated to exchange currencies at the agreed rate on the settlement date. Forwards are customizable, have no upfront premium, but are binding—even if market rates move in your favor.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">When should I use options vs forwards?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Use forwards when payment timing is certain and you want to eliminate all risk. Use options when timing is uncertain or you want to participate in favorable rate movements. Options require an upfront premium but provide flexibility—forwards have no premium but create opportunity cost if rates move favorably.
                  </p>
                </details>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-[#0F4C81]/20 bg-[#0F4C81]/5">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Pro Tips for Currency Risk Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Review currency exposures monthly and adjust hedges as business conditions change</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Develop a formal hedging policy with clear triggers, limits, and approval processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Consider natural hedging first—it has no cost and aligns operations with financial risk management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Track hedge effectiveness and adjust strategies based on actual vs. expected outcomes</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
