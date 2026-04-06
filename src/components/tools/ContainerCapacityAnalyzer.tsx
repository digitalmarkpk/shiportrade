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
  Calculator, Container, Package, TrendingUp, AlertTriangle, Info,
  CheckCircle2, Box, Scale, BarChart3, RefreshCw, Zap, Layers
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface CapacityResult {
  totalCapacity: number;
  usedCapacity: number;
  utilizationPercent: number;
  remainingCapacity: number;
  efficiency: number;
  recommendation: string;
  containerBreakdown: {
    type: string;
    capacity: number;
    used: number;
    utilization: number;
  }[];
}

const CONTAINER_SPECS = {
  '20GP': { cbm: 33.2, maxWeight: 21900, name: "20' Standard" },
  '40GP': { cbm: 67.7, maxWeight: 26630, name: "40' Standard" },
  '40HC': { cbm: 76.3, maxWeight: 26580, name: "40' High Cube" },
  '45HC': { cbm: 86.1, maxWeight: 25500, name: "45' High Cube" },
};

const COLORS = ['#0F4C81', '#2E8B57', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function ContainerCapacityAnalyzer() {
  const [containerType, setContainerType] = useState<'20GP' | '40GP' | '40HC' | '45HC'>('40HC');
  const [cargoCbm, setCargoCbm] = useState('45');
  const [cargoWeight, setCargoWeight] = useState('15000');
  const [numContainers, setNumContainers] = useState('1');
  const [stackable, setStackable] = useState(true);
  const [result, setResult] = useState<CapacityResult | null>(null);

  const analyzeCapacity = () => {
    const cbmNum = parseFloat(cargoCbm) || 0;
    const weightNum = parseFloat(cargoWeight) || 0;
    const containersNum = parseInt(numContainers) || 1;

    const spec = CONTAINER_SPECS[containerType];
    const totalCapacity = spec.cbm * containersNum;
    const maxTotalWeight = spec.maxWeight * containersNum;

    // Calculate used capacity considering stackability
    const efficiencyFactor = stackable ? 0.90 : 0.75;
    const effectiveCapacity = totalCapacity * efficiencyFactor;
    const usedCapacity = Math.min(cbmNum, effectiveCapacity);
    const utilizationPercent = (usedCapacity / effectiveCapacity) * 100;
    const remainingCapacity = effectiveCapacity - usedCapacity;

    // Weight utilization
    const weightUtilization = (weightNum / maxTotalWeight) * 100;

    // Overall efficiency
    const efficiency = Math.min(utilizationPercent, weightUtilization);

    // Generate recommendation
    let recommendation = '';
    if (utilizationPercent > 95) {
      recommendation = 'Excellent utilization! Container is nearly full.';
    } else if (utilizationPercent > 80) {
      recommendation = 'Good utilization. Consider if additional cargo can be added.';
    } else if (utilizationPercent > 60) {
      recommendation = 'Moderate utilization. Review if LCL consolidation is possible.';
    } else {
      recommendation = 'Low utilization. Consider smaller container or consolidation.';
    }

    // Container breakdown
    const containerBreakdown = [];
    for (let i = 0; i < containersNum; i++) {
      const containerUsed = Math.min(spec.cbm * efficiencyFactor, Math.max(0, cbmNum - (i * spec.cbm * efficiencyFactor)));
      containerBreakdown.push({
        type: `${containerType} #${i + 1}`,
        capacity: spec.cbm,
        used: containerUsed,
        utilization: (containerUsed / (spec.cbm * efficiencyFactor)) * 100,
      });
    }

    setResult({
      totalCapacity,
      usedCapacity: Math.round(usedCapacity * 100) / 100,
      utilizationPercent: Math.round(utilizationPercent * 100) / 100,
      remainingCapacity: Math.round(remainingCapacity * 100) / 100,
      efficiency: Math.round(efficiency * 100) / 100,
      recommendation,
      containerBreakdown,
    });
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.containerBreakdown.map((c, i) => ({
      name: c.type,
      used: c.used,
      remaining: c.capacity - c.used,
    }));
  }, [result]);

  const resetForm = () => {
    setCargoCbm('45');
    setCargoWeight('15000');
    setNumContainers('1');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Badge className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white shadow-lg mb-4">
            <Zap className="h-4 w-4 mr-2 animate-pulse" />
            Container Analysis Tool
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <Container className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Container Capacity Analyzer
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Analyze optimal container usage and maximize shipping efficiency
          </p>
        </motion.div>

        {/* Container Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          {Object.entries(CONTAINER_SPECS).map(([key, spec], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm cursor-pointer transition-all ${containerType === key ? 'border-2 border-[#0F4C81]' : ''}`}
                onClick={() => setContainerType(key as any)}>
                <CardContent className="p-4">
                  <p className="font-semibold text-sm">{spec.name}</p>
                  <p className="text-xs text-muted-foreground">{spec.cbm} CBM</p>
                  <p className="text-xs text-muted-foreground">{(spec.maxWeight / 1000).toFixed(0)}t max</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#0F4C81]" />
                  Cargo Details
                </CardTitle>
                <CardDescription>Enter cargo information for capacity analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cargo Volume (CBM)</Label>
                    <Input type="number" value={cargoCbm} onChange={(e) => setCargoCbm(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo Weight (kg)</Label>
                    <Input type="number" value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Number of Containers</Label>
                  <Select value={numContainers} onValueChange={setNumContainers}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n} Container{n > 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="stackable" checked={stackable} onChange={(e) => setStackable(e.target.checked)} className="rounded" />
                  <Label htmlFor="stackable" className="cursor-pointer">Cargo is stackable (improves efficiency)</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={analyzeCapacity} className="flex-1 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90">
                    <Calculator className="h-4 w-4 mr-2" />
                    Analyze Capacity
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
                  Capacity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Utilization Gauge */}
                    <div className="bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl p-6 text-white text-center">
                      <p className="text-sm opacity-90 mb-2">Container Utilization</p>
                      <p className="text-5xl font-bold">{result.utilizationPercent}%</p>
                      <p className="text-sm opacity-75 mt-2">{result.usedCapacity} / {result.totalCapacity} CBM used</p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Box className="h-4 w-4 text-[#0F4C81]" />
                          <span className="text-sm text-muted-foreground">Used Capacity</span>
                        </div>
                        <p className="text-xl font-bold text-[#0F4C81]">{result.usedCapacity} CBM</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Layers className="h-4 w-4 text-[#2E8B57]" />
                          <span className="text-sm text-muted-foreground">Remaining</span>
                        </div>
                        <p className="text-xl font-bold text-[#2E8B57]">{result.remainingCapacity} CBM</p>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={80} />
                          <Tooltip />
                          <Bar dataKey="used" stackId="a" fill="#0F4C81" name="Used" />
                          <Bar dataKey="remaining" stackId="a" fill="#E5E7EB" name="Available" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Recommendation */}
                    <div className={`p-4 rounded-lg ${result.utilizationPercent > 80 ? 'bg-green-50 dark:bg-green-950/30' : result.utilizationPercent > 60 ? 'bg-yellow-50 dark:bg-yellow-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4" />
                        <span className="font-medium">Recommendation</span>
                      </div>
                      <p className="text-sm">{result.recommendation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Container className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">Enter cargo details to analyze container capacity</p>
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
