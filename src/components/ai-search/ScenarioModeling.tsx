'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Ship, Globe, DollarSign, Clock, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Info, ChevronRight, RefreshCw, Play,
  BarChart3, Route, Calculator, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Predefined scenarios
const predefinedScenarios = [
  {
    id: 'suez-closure',
    title: 'Suez Canal Closure',
    description: 'Simulate impact of Suez Canal blockage on global trade',
    icon: Globe,
    severity: 'high',
  },
  {
    id: 'fuel-spike',
    title: 'Fuel Price Spike',
    description: '50% increase in bunker fuel prices',
    icon: DollarSign,
    severity: 'medium',
  },
  {
    id: 'port-strike',
    title: 'Major Port Strike',
    description: 'US West Coast port labor disruption',
    icon: AlertTriangle,
    severity: 'high',
  },
  {
    id: 'tariff-change',
    title: 'Tariff Policy Change',
    description: 'New trade tariffs between major economies',
    icon: Calculator,
    severity: 'medium',
  },
];

// Simulation results
const simulationResults = {
  'suez-closure': {
    routesAffected: 12,
    avgDelayDays: 14,
    costIncrease: 35,
    vesselsImpacted: 156,
    recommendations: [
      'Reroute vessels via Cape of Good Hope',
      'Increase inventory buffers by 3-4 weeks',
      'Consider air freight for time-sensitive cargo',
      'Negotiate extended transit time clauses',
    ],
    impacts: [
      { route: 'Asia-Europe', delay: 14, cost: '+40%' },
      { route: 'Asia-US East', delay: 8, cost: '+25%' },
      { route: 'Middle East-Europe', delay: 12, cost: '+35%' },
    ],
  },
  'fuel-spike': {
    routesAffected: 45,
    avgDelayDays: 2,
    costIncrease: 15,
    vesselsImpacted: 2500,
    recommendations: [
      'Optimize vessel speeds for fuel efficiency',
      'Negotiate fuel surcharge clauses with carriers',
      'Consider slow-steaming programs',
      'Hedge fuel costs through derivatives',
    ],
    impacts: [
      { route: 'Trans-Pacific', delay: 2, cost: '+18%' },
      { route: 'Asia-Europe', delay: 2, cost: '+15%' },
      { route: 'Intra-Asia', delay: 1, cost: '+12%' },
    ],
  },
  'port-strike': {
    routesAffected: 8,
    avgDelayDays: 21,
    costIncrease: 45,
    vesselsImpacted: 85,
    recommendations: [
      'Divert to East Coast or Canadian ports',
      'Activate contingency routing plans',
      'Increase safety stock levels',
      'Communicate proactively with customers',
    ],
    impacts: [
      { route: 'Asia-US West', delay: 21, cost: '+50%' },
      { route: 'Asia-US East', delay: 7, cost: '+20%' },
      { route: 'Intra-Americas', delay: 14, cost: '+30%' },
    ],
  },
  'tariff-change': {
    routesAffected: 15,
    avgDelayDays: 3,
    costIncrease: 25,
    vesselsImpacted: 450,
    recommendations: [
      'Review customs classification',
      'Explore alternative sourcing',
      'Absorb or pass on cost increases',
      'Consider free trade zone utilization',
    ],
    impacts: [
      { route: 'China-US', delay: 3, cost: '+25%' },
      { route: 'China-EU', delay: 2, cost: '+15%' },
      { route: 'US-China', delay: 2, cost: '+20%' },
    ],
  },
};

export default function ScenarioModeling() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [customParams, setCustomParams] = useState({
    duration: 30,
    magnitude: 50,
    region: 'global',
  });

  const runSimulation = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setIsSimulating(true);
    setSimulationProgress(0);
    setResults(null);

    // Simulate progress
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          setResults(simulationResults[scenarioId as keyof typeof simulationResults]);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-purple-500" />
              Scenario Modeling Engine
            </CardTitle>
            <CardDescription>
              Simulate hypothetical supply chain disruptions and analyze potential impacts
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-purple-600 border-purple-300">
            AI-Powered Simulation
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scenario Selection */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase text-slate-500 tracking-wide">
              Predefined Scenarios
            </h4>
            <div className="grid gap-3">
              {predefinedScenarios.map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedScenario === scenario.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                    }`}
                    onClick={() => runSimulation(scenario.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          scenario.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            scenario.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                          }`} />
                        </div>
                        <div>
                          <h5 className="font-medium">{scenario.title}</h5>
                          <p className="text-xs text-slate-500">{scenario.description}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Custom Scenario */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-medium text-sm uppercase text-slate-500 tracking-wide mb-4">
                Custom Scenario Parameters
              </h4>
              <div className="space-y-4">
                <div>
                  <Label>Duration (days)</Label>
                  <Slider
                    value={[customParams.duration]}
                    onValueChange={(v) => setCustomParams({ ...customParams, duration: v[0] })}
                    max={180}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">{customParams.duration} days</p>
                </div>
                <div>
                  <Label>Impact Magnitude</Label>
                  <Slider
                    value={[customParams.magnitude]}
                    onValueChange={(v) => setCustomParams({ ...customParams, magnitude: v[0] })}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">{customParams.magnitude}% impact</p>
                </div>
                <div>
                  <Label>Region</Label>
                  <Select value={customParams.region} onValueChange={(v) => setCustomParams({ ...customParams, region: v })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="asia">Asia Pacific</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="americas">Americas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
                  <Zap className="h-4 w-4 mr-2" />
                  Run Custom Simulation
                </Button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div>
            {isSimulating && (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4"
                >
                  <Zap className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="font-semibold mb-2">Running Simulation...</h4>
                <p className="text-sm text-slate-500 mb-4">Analyzing {selectedScenario?.replace('-', ' ')}</p>
                <Progress value={simulationProgress} className="w-64" />
                <p className="text-xs text-slate-400 mt-2">{simulationProgress}% complete</p>
              </div>
            )}

            {!isSimulating && !results && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                  <Layers className="h-8 w-8 text-slate-400" />
                </div>
                <h4 className="font-semibold mb-2">Select a Scenario</h4>
                <p className="text-sm text-slate-500">
                  Choose a predefined scenario or create a custom one to see potential impacts
                </p>
              </div>
            )}

            {!isSimulating && results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Route className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-slate-500">Routes Affected</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{results.routesAffected}</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-xs text-slate-500">Avg. Delay</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">{results.avgDelayDays} days</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-purple-500" />
                      <span className="text-xs text-slate-500">Cost Increase</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">+{results.costIncrease}%</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Ship className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-slate-500">Vessels Impacted</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{results.vesselsImpacted}</p>
                  </div>
                </div>

                {/* Route Impacts */}
                <div>
                  <h5 className="font-medium text-sm mb-3">Route-Level Impacts</h5>
                  <div className="space-y-2">
                    {results.impacts.map((impact: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Route className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium">{impact.route}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            +{impact.delay}d
                          </Badge>
                          <Badge variant="destructive" className="text-xs">
                            {impact.cost}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    AI Recommendations
                  </h5>
                  <div className="space-y-2">
                    {results.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 p-2">
                        <ChevronRight className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Re-run
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Export Report
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
