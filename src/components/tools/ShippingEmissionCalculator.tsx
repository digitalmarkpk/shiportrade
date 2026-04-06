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
  Calculator, Ship, Plane, Truck, Train, Leaf, TrendingDown, AlertTriangle,
  Info, RefreshCw, Zap, BarChart3, Globe, TreePine, Droplet, Wind
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';

interface EmissionResult {
  co2e: number;
  co2: number;
  ch4: number;
  n2o: number;
  distance: number;
  emissionPerKg: number;
  treeEquivalent: number;
  carEquivalent: number;
  comparison: { mode: string; emission: number; savings: number }[];
}

// Emission factors (g CO2e per ton-km)
const EMISSION_FACTORS = {
  ocean: {
    'Container Ship': 12.5,
    'Bulk Carrier': 10.2,
    'Tanker': 14.8,
    average: 12.5,
  },
  air: {
    'Passenger Aircraft': 602,
    'Freighter Aircraft': 450,
    average: 500,
  },
  rail: {
    'Electric Train': 28,
    'Diesel Train': 45,
    average: 35,
  },
  road: {
    'Light Truck': 180,
    'Heavy Truck': 90,
    average: 100,
  },
};

// Distance estimates (km) for major routes
const ROUTE_DISTANCES: Record<string, Record<string, number>> = {
  'Asia-North America': { ocean: 11000, air: 10000, rail: 13000 },
  'Asia-Europe': { ocean: 19000, air: 8500, rail: 11000 },
  'Europe-North America': { ocean: 6500, air: 5500, rail: 8000 },
  'Intra-Asia': { ocean: 3500, air: 3000, rail: 4000 },
  'Intra-Europe': { ocean: 2000, air: 1500, rail: 1500 },
};

const COLORS = ['#0F4C81', '#2E8B57', '#F59E0B', '#EF4444'];

export default function ShippingEmissionCalculator() {
  const [transportMode, setTransportMode] = useState<'ocean' | 'air' | 'rail' | 'road'>('ocean');
  const [weight, setWeight] = useState('1000');
  const [route, setRoute] = useState('Asia-North America');
  const [fuelType, setFuelType] = useState('average');
  const [distance, setDistance] = useState('');
  const [result, setResult] = useState<EmissionResult | null>(null);

  const calculateEmissions = () => {
    const weightNum = parseFloat(weight) || 0;
    const distanceNum = parseFloat(distance) || ROUTE_DISTANCES[route]?.[transportMode] || 5000;
    
    // Get emission factor
    const emissionFactor = EMISSION_FACTORS[transportMode][fuelType as keyof typeof EMISSION_FACTORS[typeof transportMode]] 
      || EMISSION_FACTORS[transportMode].average;
    
    // Calculate emissions (g CO2e = tons * km * g/ton-km)
    const emissionGrams = (weightNum / 1000) * distanceNum * emissionFactor;
    const co2e = emissionGrams / 1000; // Convert to kg
    
    // CO2 is typically 98% of CO2e for shipping
    const co2 = co2e * 0.98;
    const ch4 = co2e * 0.015;
    const n2o = co2e * 0.005;
    
    // Per kg emission
    const emissionPerKg = co2e / weightNum;
    
    // Tree equivalent (one tree absorbs ~21 kg CO2/year)
    const treeEquivalent = co2e / 21;
    
    // Car equivalent (average car emits ~4.6 tons CO2/year)
    const carEquivalent = co2e / 4600;
    
    // Generate comparison with other modes
    const comparison: { mode: string; emission: number; savings: number }[] = [];
    
    const modes: ('ocean' | 'air' | 'rail' | 'road')[] = ['ocean', 'air', 'rail', 'road'];
    modes.forEach((mode) => {
      if (mode !== transportMode) {
        const modeDistance = ROUTE_DISTANCES[route]?.[mode] || distanceNum;
        const modeEmission = (weightNum / 1000) * modeDistance * EMISSION_FACTORS[mode].average / 1000;
        comparison.push({
          mode: mode.charAt(0).toUpperCase() + mode.slice(1),
          emission: Math.round(modeEmission * 100) / 100,
          savings: Math.round((co2e - modeEmission) * 100) / 100,
        });
      }
    });
    
    setResult({
      co2e: Math.round(co2e * 100) / 100,
      co2: Math.round(co2 * 100) / 100,
      ch4: Math.round(ch4 * 1000) / 1000,
      n2o: Math.round(n2o * 1000) / 1000,
      distance: distanceNum,
      emissionPerKg: Math.round(emissionPerKg * 1000) / 1000,
      treeEquivalent: Math.round(treeEquivalent * 10) / 10,
      carEquivalent: Math.round(carEquivalent * 1000) / 1000,
      comparison,
    });
  };

  const comparisonChartData = useMemo(() => {
    if (!result) return [];
    const data = [{ mode: transportMode.charAt(0).toUpperCase() + transportMode.slice(1), emission: result.co2e }];
    result.comparison.forEach((c) => {
      data.push({ mode: c.mode, emission: c.emission });
    });
    return data;
  }, [result, transportMode]);

  const pieChartData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'CO2', value: result.co2, color: '#0F4C81' },
      { name: 'CH4', value: result.ch4, color: '#2E8B57' },
      { name: 'N2O', value: result.n2o, color: '#F59E0B' },
    ];
  }, [result]);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'ocean': return <Ship className="h-5 w-5" />;
      case 'air': return <Plane className="h-5 w-5" />;
      case 'rail': return <Train className="h-5 w-5" />;
      case 'road': return <Truck className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  const resetForm = () => {
    setWeight('1000');
    setDistance('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Badge className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg mb-4">
            <Leaf className="h-4 w-4 mr-2" />
            Sustainability Tool
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Shipping Emission Calculator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Calculate carbon emissions by transport mode and find the most sustainable shipping options
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-[#0F4C81]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Ship className="h-4 w-4 text-[#0F4C81]" />
                  <span className="text-xs text-muted-foreground">Ocean</span>
                </div>
                <p className="text-lg font-bold text-[#0F4C81]">12.5 g/tkm</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-[#2E8B57]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Train className="h-4 w-4 text-[#2E8B57]" />
                  <span className="text-xs text-muted-foreground">Rail</span>
                </div>
                <p className="text-lg font-bold text-[#2E8B57]">35 g/tkm</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Road</span>
                </div>
                <p className="text-lg font-bold text-amber-600">100 g/tkm</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Plane className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-muted-foreground">Air</span>
                </div>
                <p className="text-lg font-bold text-red-600">500 g/tkm</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-emerald-600" />
                  Shipment Details
                </CardTitle>
                <CardDescription>Enter shipment information for emission calculation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transport Mode */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-emerald-600" />
                    Transport Mode
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {(['ocean', 'air', 'rail', 'road'] as const).map((mode) => (
                      <Button
                        key={mode}
                        variant={transportMode === mode ? 'default' : 'outline'}
                        className={`flex flex-col h-auto py-3 ${transportMode === mode ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : ''}`}
                        onClick={() => setTransportMode(mode)}
                      >
                        {getModeIcon(mode)}
                        <span className="text-xs mt-1 capitalize">{mode}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Route</Label>
                  <Select value={route} onValueChange={setRoute}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(ROUTE_DISTANCES).map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Cargo Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">Cargo Information</h4>
                  
                  <div className="space-y-2">
                    <Label>Cargo Weight (kg)</Label>
                    <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Distance (km) - Optional</Label>
                    <Input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Leave empty for route estimate" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fuel/Vehicle Type</Label>
                  <Select value={fuelType} onValueChange={setFuelType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {transportMode === 'ocean' && (
                        <>
                          <SelectItem value="Container Ship">Container Ship</SelectItem>
                          <SelectItem value="Bulk Carrier">Bulk Carrier</SelectItem>
                          <SelectItem value="Tanker">Tanker</SelectItem>
                        </>
                      )}
                      {transportMode === 'air' && (
                        <>
                          <SelectItem value="Passenger Aircraft">Passenger Aircraft</SelectItem>
                          <SelectItem value="Freighter Aircraft">Freighter Aircraft</SelectItem>
                        </>
                      )}
                      {transportMode === 'rail' && (
                        <>
                          <SelectItem value="Electric Train">Electric Train</SelectItem>
                          <SelectItem value="Diesel Train">Diesel Train</SelectItem>
                        </>
                      )}
                      {transportMode === 'road' && (
                        <>
                          <SelectItem value="Light Truck">Light Truck</SelectItem>
                          <SelectItem value="Heavy Truck">Heavy Truck</SelectItem>
                        </>
                      )}
                      <SelectItem value="average">Industry Average</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={calculateEmissions} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90">
                    <Leaf className="h-4 w-4 mr-2" />
                    Calculate Emissions
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
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  Emission Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Total Emission */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-6 text-white text-center">
                      <p className="text-sm opacity-90 mb-2">Total CO2 Equivalent</p>
                      <p className="text-4xl font-bold">{result.co2e.toLocaleString()} kg</p>
                      <p className="text-sm opacity-75 mt-2">Distance: {result.distance.toLocaleString()} km</p>
                    </div>

                    {/* Impact Equivalents */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TreePine className="h-5 w-5 text-emerald-600" />
                          <span className="text-sm text-muted-foreground">Tree Offset</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{result.treeEquivalent}</p>
                        <p className="text-xs text-muted-foreground">trees/year needed</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-muted-foreground">Car Equivalent</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{result.carEquivalent}</p>
                        <p className="text-xs text-muted-foreground">cars/year</p>
                      </div>
                    </div>

                    {/* Emission Breakdown */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">CO2</p>
                        <p className="font-bold">{result.co2.toFixed(2)} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CH4</p>
                        <p className="font-bold">{result.ch4.toFixed(3)} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">N2O</p>
                        <p className="font-bold">{result.n2o.toFixed(3)} kg</p>
                      </div>
                    </div>

                    {/* Comparison Chart */}
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mode" />
                          <YAxis />
                          <Tooltip formatter={(value: number) => `${value.toFixed(2)} kg CO2e`} />
                          <Bar dataKey="emission" fill="#10B981" name="CO2e (kg)">
                            {comparisonChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Mode Comparison */}
                    {result.comparison.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">Alternative Modes</h4>
                        {result.comparison.map((comp) => (
                          <div key={comp.mode} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              {getModeIcon(comp.mode.toLowerCase())}
                              <span>{comp.mode}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{comp.emission} kg CO2e</p>
                              <p className={`text-xs ${comp.savings < 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {comp.savings < 0 ? `${Math.abs(comp.savings).toFixed(2)} kg less` : `${comp.savings.toFixed(2)} kg more`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">Sustainability Tip</span>
                      </div>
                      <p className="text-sm text-emerald-600 dark:text-emerald-300">
                        {transportMode === 'ocean' 
                          ? 'Ocean freight has the lowest carbon footprint. Consider consolidating shipments for even better efficiency.'
                          : transportMode === 'air'
                          ? 'Air freight has the highest emissions. Consider ocean or rail alternatives when time permits.'
                          : transportMode === 'rail'
                          ? 'Rail is one of the most sustainable options for land transport. Great choice for Europe-Asia routes!'
                          : 'Road freight efficiency improves with full truckloads. Consider consolidation or intermodal options.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Leaf className="h-16 w-16 text-emerald-300 dark:text-emerald-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">Enter shipment details to calculate emissions</p>
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
