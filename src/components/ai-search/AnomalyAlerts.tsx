'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, AlertCircle, Info, X, ChevronDown, ChevronUp,
  Bell, Clock, TrendingUp, TrendingDown, Ship, Globe, DollarSign,
  Activity, Zap, CheckCircle, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Anomaly data
const anomalies = [
  {
    id: 1,
    type: 'critical',
    category: 'freight',
    title: 'Unusual Freight Rate Spike',
    description: 'Asia-Europe freight rates increased 23% in 48 hours - highest spike since 2021',
    detectedAt: '5 minutes ago',
    impact: 'High impact on shipping budgets',
    causes: ['Red Sea route diversions', 'Vessel capacity shortage', 'Peak season demand surge'],
    recommendation: 'Consider booking capacity immediately or exploring alternative routes via Cape of Good Hope.',
    acknowledged: false,
  },
  {
    id: 2,
    type: 'warning',
    category: 'port',
    title: 'Port Congestion Anomaly',
    description: 'Los Angeles port dwell time exceeded 8 days - 40% above normal threshold',
    detectedAt: '15 minutes ago',
    impact: 'Supply chain delays expected',
    causes: ['Labor shortage', 'Increased import volume', 'Equipment imbalance'],
    recommendation: 'Consider diverting to alternative ports like Oakland or Long Beach.',
    acknowledged: false,
  },
  {
    id: 3,
    type: 'info',
    category: 'trade',
    title: 'Trade Volume Pattern Change',
    description: 'China-to-EU electronics exports showed unexpected 18% drop vs. forecast',
    detectedAt: '1 hour ago',
    impact: 'Market share shifts possible',
    causes: ['Chinese New Year impact', 'EU inventory corrections', 'Alternative sourcing'],
    recommendation: 'Monitor competitor activity and adjust inventory planning accordingly.',
    acknowledged: true,
  },
  {
    id: 4,
    type: 'warning',
    category: 'vessel',
    title: 'Vessel Schedule Deviation',
    description: '12 vessels on Trans-Pacific route showing 5+ day delays from ETA',
    detectedAt: '2 hours ago',
    impact: 'Customer delivery delays',
    causes: ['Adverse weather conditions', 'Port congestion at origin', 'Speed optimization'],
    recommendation: 'Update customer ETAs and consider expedited options for time-sensitive cargo.',
    acknowledged: false,
  },
];

export default function AnomalyAlerts() {
  const [alerts, setAlerts] = useState(anomalies);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const acknowledgeAlert = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <Card className={`border-0 shadow-xl ${unacknowledgedCount > 0 ? 'border-l-4 border-l-red-500' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${unacknowledgedCount > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                <Bell className={`h-5 w-5 ${unacknowledgedCount > 0 ? 'text-red-600' : 'text-green-600'}`} />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Anomaly Detection Center
                  {unacknowledgedCount > 0 && (
                    <Badge variant="destructive" className="animate-pulse">
                      {unacknowledgedCount} New
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  AI-detected unusual patterns in global supply chain data
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : 'Show All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            <div className="space-y-3">
              {alerts.slice(0, showAll ? undefined : 2).map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded-lg border ${
                    alert.type === 'critical' ? 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-800' :
                    alert.type === 'warning' ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800' :
                    'border-blue-300 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800'
                  } ${alert.acknowledged ? 'opacity-60' : ''}`}
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          alert.type === 'critical' ? 'bg-red-200 dark:bg-red-800' :
                          alert.type === 'warning' ? 'bg-amber-200 dark:bg-amber-800' :
                          'bg-blue-200 dark:bg-blue-800'
                        }`}>
                          {alert.type === 'critical' ? (
                            <AlertTriangle className="h-5 w-5 text-red-700 dark:text-red-200" />
                          ) : alert.type === 'warning' ? (
                            <AlertCircle className="h-5 w-5 text-amber-700 dark:text-amber-200" />
                          ) : (
                            <Info className="h-5 w-5 text-blue-700 dark:text-blue-200" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{alert.title}</h4>
                            {alert.acknowledged && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Acknowledged
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {alert.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {alert.detectedAt}
                            </span>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {alert.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissAlert(alert.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {expandedId === alert.id ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === alert.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Potential Causes:</h5>
                            <div className="flex flex-wrap gap-2">
                              {alert.causes.map((cause, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {cause}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-2">Impact Assessment:</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{alert.impact}</p>
                          </div>
                          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <h5 className="text-sm font-medium mb-1 flex items-center gap-2">
                              <Zap className="h-4 w-4 text-amber-500" />
                              AI Recommendation:
                            </h5>
                            <p className="text-sm">{alert.recommendation}</p>
                          </div>
                          <div className="flex gap-2">
                            {!alert.acknowledged && (
                              <Button
                                size="sm"
                                onClick={() => acknowledgeAlert(alert.id)}
                                className="bg-[#0F4C81] hover:bg-[#0F4C81]/90"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Acknowledge
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {alerts.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No anomalies detected</p>
              <p className="text-sm text-slate-500">All systems operating normally</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
