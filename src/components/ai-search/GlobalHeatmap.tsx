'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Globe, Ship, Plane, Truck, Warehouse, AlertTriangle, Activity,
  Map, Navigation, Layers, ZoomIn, ZoomOut, Maximize2, RefreshCw,
  Info, ChevronRight, TrendingUp, TrendingDown, Clock, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for global map visualization
const mapData = {
  vessels: [
    { id: 1, name: 'Ever Given', type: 'container', position: { lat: 25.5, lng: 55.3 }, status: 'transit', destination: 'Rotterdam', eta: '2024-02-28', speed: 18 },
    { id: 2, name: 'Cosco Shipping', type: 'container', position: { lat: 1.2, lng: 103.8 }, status: 'transit', destination: 'Los Angeles', eta: '2024-03-05', speed: 22 },
    { id: 3, name: 'Maersk Line', type: 'container', position: { lat: 35.1, lng: -120.5 }, status: 'waiting', destination: 'Los Angeles', eta: '2024-02-25', speed: 0 },
    { id: 4, name: 'MSC Oscar', type: 'container', position: { lat: 51.9, lng: 4.5 }, status: 'port', destination: 'Rotterdam', eta: 'Arrived', speed: 0 },
    { id: 5, name: 'CMA CGM Marco', type: 'container', position: { lat: 22.3, lng: 114.2 }, status: 'transit', destination: 'Shanghai', eta: '2024-02-26', speed: 15 },
    { id: 6, name: 'Hapag Lloyd', type: 'container', position: { lat: 36.8, lng: -122.2 }, status: 'transit', destination: 'Oakland', eta: '2024-02-24', speed: 12 },
  ],
  ports: [
    { name: 'Shanghai', country: 'China', congestion: 45, vessels: 28, lat: 31.2, lng: 121.5, status: 'moderate' },
    { name: 'Los Angeles', country: 'USA', congestion: 62, vessels: 18, lat: 33.7, lng: -118.3, status: 'high' },
    { name: 'Rotterdam', country: 'Netherlands', congestion: 38, vessels: 12, lat: 51.9, lng: 4.5, status: 'low' },
    { name: 'Singapore', country: 'Singapore', congestion: 52, vessels: 22, lat: 1.3, lng: 103.8, status: 'moderate' },
    { name: 'Dubai', country: 'UAE', congestion: 35, vessels: 8, lat: 25.3, lng: 55.3, status: 'low' },
    { name: 'Hamburg', country: 'Germany', congestion: 41, vessels: 15, lat: 53.5, lng: 10.0, status: 'moderate' },
  ],
  routes: [
    { from: 'Shanghai', to: 'Los Angeles', volume: '2.5M TEU', trend: 'up', change: 8.5 },
    { from: 'Shanghai', to: 'Rotterdam', volume: '1.8M TEU', trend: 'down', change: -3.2 },
    { from: 'Singapore', to: 'Los Angeles', volume: '1.2M TEU', trend: 'up', change: 12.1 },
    { from: 'Rotterdam', to: 'New York', volume: '0.9M TEU', trend: 'up', change: 5.4 },
  ],
  riskZones: [
    { name: 'Red Sea', type: 'disruption', severity: 'high', impact: 'Route diversions', lat: 15, lng: 42 },
    { name: 'Panama Canal', type: 'congestion', severity: 'medium', impact: 'Transit delays', lat: 9, lng: -80 },
    { name: 'Strait of Hormuz', type: 'tension', severity: 'medium', impact: 'Insurance costs', lat: 26, lng: 57 },
  ],
};

const tradeFlows = [
  { from: 'China', to: 'USA', value: 536, unit: 'B USD', commodity: 'Electronics, Machinery' },
  { from: 'China', to: 'EU', value: 495, unit: 'B USD', commodity: 'Machinery, Textiles' },
  { from: 'EU', to: 'USA', value: 418, unit: 'B USD', commodity: 'Machinery, Vehicles' },
  { from: 'USA', to: 'China', value: 151, unit: 'B USD', commodity: 'Agriculture, Aircraft' },
  { from: 'Japan', to: 'USA', value: 148, unit: 'B USD', commodity: 'Vehicles, Electronics' },
];

export default function GlobalHeatmap() {
  const [selectedLayer, setSelectedLayer] = useState('vessels');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [isAnimating, setIsAnimating] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [zoom, setZoom] = useState(1);

  // Simulate real-time updates
  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      // Update vessel positions slightly
    }, 5000);
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-[#0F4C81]" />
                Global Trade Heatmap
              </CardTitle>
              <CardDescription>
                Real-time visualization of vessels, ports, and trade flows
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="asia">Asia Pacific</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="americas">Americas</SelectItem>
                  <SelectItem value="middle-east">Middle East</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(zoom + 0.25, 2))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(zoom - 0.25, 0.5))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAnimating(!isAnimating)}>
                <RefreshCw className={`h-4 w-4 ${isAnimating ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="relative h-[500px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
              {/* World Map Background */}
              <div className="absolute inset-0 opacity-30">
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                  {/* Simplified world map paths */}
                  <path d="M150,120 Q200,100 250,120 Q300,140 280,180 Q260,220 220,200 Q180,180 150,120" fill="#1e3a5f" />
                  <path d="M420,80 Q480,60 540,80 Q600,100 620,160 Q640,220 580,260 Q520,300 480,280 Q440,260 420,200 Q400,140 420,80" fill="#1e3a5f" />
                  <path d="M640,100 Q700,80 760,100 Q820,120 860,180 Q900,240 860,300 Q820,360 760,340 Q700,320 660,260 Q620,200 640,100" fill="#1e3a5f" />
                  <path d="M750,320 Q800,300 850,320 Q900,340 880,400 Q860,460 810,450 Q760,440 750,380 Q740,320 750,320" fill="#1e3a5f" />
                  <path d="M500,340 Q560,320 620,340 Q680,360 700,420 Q720,480 660,500 Q600,520 560,490 Q520,460 500,400 Q480,340 500,340" fill="#1e3a5f" />
                </svg>
              </div>

              {/* Animated Grid */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-px bg-blue-400"
                    style={{
                      top: `${(i + 1) * 5}%`,
                      left: 0,
                      right: 0,
                    }}
                  />
                ))}
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-px bg-blue-400"
                    style={{
                      left: `${(i + 1) * 2.5}%`,
                      top: 0,
                      bottom: 0,
                    }}
                  />
                ))}
              </div>

              {/* Vessels */}
              {selectedLayer === 'vessels' && mapData.vessels.map((vessel, idx) => (
                <motion.div
                  key={vessel.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${((vessel.position.lng + 180) / 360) * 100}%`,
                    top: `${((90 - vessel.position.lat) / 180) * 100}%`,
                    transform: `scale(${zoom})`,
                  }}
                  onMouseEnter={() => setHoveredItem(vessel)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.div
                    animate={vessel.status === 'transit' ? { x: [0, 10, 0] } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`p-2 rounded-full ${
                      vessel.status === 'transit' ? 'bg-green-500' :
                      vessel.status === 'waiting' ? 'bg-amber-500' :
                      'bg-blue-500'
                    } shadow-lg`}
                  >
                    <Ship className="h-4 w-4 text-white" />
                  </motion.div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 p-2 rounded-lg shadow-xl min-w-[150px] z-10">
                    <p className="font-semibold text-xs">{vessel.name}</p>
                    <p className="text-xs text-slate-500">→ {vessel.destination}</p>
                    <p className="text-xs text-slate-500">ETA: {vessel.eta}</p>
                    <p className="text-xs text-green-500">Speed: {vessel.speed} kn</p>
                  </div>
                </motion.div>
              ))}

              {/* Ports */}
              {selectedLayer === 'ports' && mapData.ports.map((port, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${((port.lng + 180) / 360) * 100}%`,
                    top: `${((90 - port.lat) / 180) * 100}%`,
                    transform: `scale(${zoom})`,
                  }}
                  onMouseEnter={() => setHoveredItem(port)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`p-2 rounded-full ${
                    port.status === 'high' ? 'bg-red-500' :
                    port.status === 'moderate' ? 'bg-amber-500' :
                    'bg-green-500'
                  } shadow-lg`}>
                    <Warehouse className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 p-2 rounded-lg shadow-xl min-w-[150px] z-10">
                    <p className="font-semibold text-xs">{port.name}</p>
                    <p className="text-xs text-slate-500">{port.country}</p>
                    <p className="text-xs">Vessels: {port.vessels}</p>
                    <p className="text-xs">Congestion: {port.congestion}%</p>
                  </div>
                </motion.div>
              ))}

              {/* Risk Zones */}
              {selectedLayer === 'risks' && mapData.riskZones.map((zone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: idx * 0.1, duration: 2, repeat: Infinity }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${((zone.lng + 180) / 360) * 100}%`,
                    top: `${((90 - zone.lat) / 180) * 100}%`,
                    transform: `scale(${zoom})`,
                  }}
                >
                  <div className={`p-3 rounded-full ${
                    zone.severity === 'high' ? 'bg-red-500/50 border-2 border-red-500' :
                    'bg-amber-500/50 border-2 border-amber-500'
                  } shadow-lg`}>
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 p-2 rounded-lg shadow-xl min-w-[150px] z-10">
                    <p className="font-semibold text-xs">{zone.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{zone.type}</p>
                    <p className="text-xs text-red-500">{zone.impact}</p>
                  </div>
                </motion.div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-white mb-2">Legend</p>
                {selectedLayer === 'vessels' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-xs text-white">In Transit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs text-white">Waiting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-xs text-white">At Port</span>
                    </div>
                  </>
                )}
                {selectedLayer === 'ports' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-xs text-white">High Congestion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs text-white">Moderate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-xs text-white">Low</span>
                    </div>
                  </>
                )}
                {selectedLayer === 'risks' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-xs text-white">High Severity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs text-white">Medium Severity</span>
                    </div>
                  </>
                )}
              </div>

              {/* Stats Overlay */}
              <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-400">{mapData.vessels.filter(v => v.status === 'transit').length}</p>
                    <p className="text-xs text-slate-300">In Transit</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-400">{mapData.vessels.filter(v => v.status === 'waiting').length}</p>
                    <p className="text-xs text-slate-300">Waiting</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{mapData.ports.length}</p>
                    <p className="text-xs text-slate-300">Ports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Layer Selector */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                {[
                  { id: 'vessels', label: 'Vessels', icon: Ship },
                  { id: 'ports', label: 'Ports', icon: Warehouse },
                  { id: 'risks', label: 'Risk Zones', icon: AlertTriangle },
                  { id: 'routes', label: 'Trade Routes', icon: Navigation },
                ].map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <Button
                      key={layer.id}
                      variant={selectedLayer === layer.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLayer(layer.id)}
                      className={selectedLayer === layer.id ? 'bg-[#0F4C81]' : ''}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {layer.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Trade Flows */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#2E8B57]" />
                Top Trade Flows
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tradeFlows.slice(0, 4).map((flow, idx) => (
                <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{flow.from} → {flow.to}</span>
                    <span className="text-xs font-bold text-[#0F4C81]">${flow.value}B</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{flow.commodity}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Port Congestion Summary */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-amber-500" />
                Port Congestion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mapData.ports.slice(0, 5).map((port, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{port.name}</span>
                  <Badge variant={port.congestion > 50 ? 'destructive' : port.congestion > 30 ? 'default' : 'secondary'}>
                    {port.congestion}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Risk Alerts */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Active Risk Zones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mapData.riskZones.map((zone, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className={`h-4 w-4 ${zone.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                  <div>
                    <p className="text-xs font-medium">{zone.name}</p>
                    <p className="text-xs text-slate-500">{zone.impact}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
