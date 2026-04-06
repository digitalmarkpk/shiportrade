'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ship,
  Container,
  MapPin,
  Calendar,
  Package,
  Scale,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  Info,
  Truck,
  FileText,
  Zap,
  TrendingUp,
  Building2,
  Globe,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { PORTS } from '@/lib/constants/ports';

// Container Types
interface ContainerType {
  code: string;
  name: string;
  description: string;
  internalLength: number;
  internalWidth: number;
  internalHeight: number;
  capacity: number; // CBM
  maxPayload: number; // kg
  baseRateMultiplier: number;
  icon: string;
}

const CONTAINER_TYPES: ContainerType[] = [
  {
    code: '20GP',
    name: '20ft General Purpose',
    description: 'Standard dry container',
    internalLength: 5.898,
    internalWidth: 2.352,
    internalHeight: 2.393,
    capacity: 33.2,
    maxPayload: 28180,
    baseRateMultiplier: 1.0,
    icon: '📦',
  },
  {
    code: '40GP',
    name: '40ft General Purpose',
    description: 'Standard 40ft dry container',
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.393,
    capacity: 67.7,
    maxPayload: 28750,
    baseRateMultiplier: 1.27,
    icon: '📦',
  },
  {
    code: '40HC',
    name: '40ft High Cube',
    description: 'Extra height for voluminous cargo',
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.698,
    capacity: 76.3,
    maxPayload: 28600,
    baseRateMultiplier: 1.35,
    icon: '📦',
  },
  {
    code: '45HC',
    name: '45ft High Cube',
    description: 'Maximum capacity container',
    internalLength: 13.556,
    internalWidth: 2.352,
    internalHeight: 2.698,
    capacity: 86.1,
    maxPayload: 27600,
    baseRateMultiplier: 1.52,
    icon: '📦',
  },
  {
    code: '20RF',
    name: '20ft Refrigerated',
    description: 'Temperature controlled',
    internalLength: 5.456,
    internalWidth: 2.294,
    internalHeight: 2.275,
    capacity: 28.4,
    maxPayload: 27390,
    baseRateMultiplier: 2.2,
    icon: '❄️',
  },
  {
    code: '40RF',
    name: '40ft Refrigerated High Cube',
    description: 'Temperature controlled with extra height',
    internalLength: 11.584,
    internalWidth: 2.294,
    internalHeight: 2.538,
    capacity: 67.5,
    maxPayload: 29520,
    baseRateMultiplier: 2.5,
    icon: '❄️',
  },
  {
    code: '20OT',
    name: '20ft Open Top',
    description: 'For over-height cargo',
    internalLength: 5.898,
    internalWidth: 2.352,
    internalHeight: 2.393,
    capacity: 33.2,
    maxPayload: 28170,
    baseRateMultiplier: 1.45,
    icon: '⬆️',
  },
  {
    code: '40OT',
    name: '40ft Open Top',
    description: 'For over-height cargo',
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.393,
    capacity: 67.7,
    maxPayload: 28420,
    baseRateMultiplier: 1.6,
    icon: '⬆️',
  },
  {
    code: '20FR',
    name: '20ft Flat Rack',
    description: 'For oversized cargo',
    internalLength: 5.946,
    internalWidth: 2.286,
    internalHeight: 2.233,
    capacity: 30.4,
    maxPayload: 31000,
    baseRateMultiplier: 1.75,
    icon: '📦',
  },
  {
    code: '40FR',
    name: '40ft Flat Rack',
    description: 'For oversized cargo',
    internalLength: 11.806,
    internalWidth: 2.228,
    internalHeight: 1.980,
    capacity: 52.1,
    maxPayload: 40000,
    baseRateMultiplier: 1.85,
    icon: '📦',
  },
  {
    code: '20TK',
    name: '20ft Tank Container',
    description: 'For liquid bulk cargo',
    internalLength: 5.898,
    internalWidth: 2.352,
    internalHeight: 2.393,
    capacity: 24.0,
    maxPayload: 31500,
    baseRateMultiplier: 2.8,
    icon: '🛢️',
  },
];

// Trade lanes with base rates
const TRADE_LANES = [
  { id: 'asia-namer', name: 'Asia - North America', baseRate: 2800, transitDays: 18 },
  { id: 'asia-europe', name: 'Asia - Europe', baseRate: 2200, transitDays: 32 },
  { id: 'asia-med', name: 'Asia - Mediterranean', baseRate: 2400, transitDays: 28 },
  { id: 'europe-namer', name: 'Europe - North America', baseRate: 2600, transitDays: 14 },
  { id: 'intra-asia', name: 'Intra-Asia', baseRate: 800, transitDays: 7 },
  { id: 'asia-mideast', name: 'Asia - Middle East', baseRate: 1200, transitDays: 12 },
  { id: 'asia-africa', name: 'Asia - Africa', baseRate: 1800, transitDays: 22 },
  { id: 'asia-samer', name: 'Asia - South America', baseRate: 3200, transitDays: 35 },
  { id: 'namer-europe', name: 'North America - Europe', baseRate: 2400, transitDays: 14 },
  { id: 'namer-asia', name: 'North America - Asia', baseRate: 1800, transitDays: 20 },
];

// Carriers
const CARRIERS = [
  { code: 'MAEU', name: 'Maersk Line', reliability: 92, avgTransit: 'On time' },
  { code: 'MSCU', name: 'MSC', reliability: 88, avgTransit: '+1 day' },
  { code: 'HLCU', name: 'Hapag-Lloyd', reliability: 91, avgTransit: 'On time' },
  { code: 'CMAU', name: 'CMA CGM', reliability: 87, avgTransit: '+0.5 day' },
  { code: 'COSU', name: 'COSCO Shipping', reliability: 85, avgTransit: '+1 day' },
  { code: 'EGLV', name: 'Evergreen Line', reliability: 86, avgTransit: '+0.5 day' },
  { code: 'OOLU', name: 'OOCL', reliability: 89, avgTransit: 'On time' },
  { code: 'YMLU', name: 'Yang Ming', reliability: 84, avgTransit: '+1.5 days' },
  { code: 'ZIMU', name: 'ZIM', reliability: 83, avgTransit: '+1 day' },
  { code: 'ONE', name: 'ONE (Ocean Network Express)', reliability: 90, avgTransit: 'On time' },
];

// Commodity types
const COMMODITY_TYPES = [
  { code: 'GEN', name: 'General Cargo', hazardClass: null },
  { code: 'FCL', name: 'Full Container Load', hazardClass: null },
  { code: 'DG', name: 'Dangerous Goods', hazardClass: 'IMO Class 1-9' },
  { code: 'REF', name: 'Refrigerated Goods', hazardClass: null },
  { code: 'AKH', name: 'Animal Hides', hazardClass: null },
  { code: 'CHE', name: 'Chemicals', hazardClass: 'IMO Class 3-8' },
  { code: 'FOD', name: 'Food Products', hazardClass: null },
  { code: 'MCH', name: 'Machinery', hazardClass: null },
  { code: 'TEX', name: 'Textiles', hazardClass: null },
  { code: 'ELC', name: 'Electronics', hazardClass: null },
];

interface BookingForm {
  containerType: string;
  containerCount: number;
  originPort: string;
  destinationPort: string;
  loadingDate: string;
  commodity: string;
  weight: number;
  volume: number;
  cargoDescription: string;
  carrier: string;
  isDangerous: boolean;
  temperatureRequired: boolean;
  temperatureMin: number;
  temperatureMax: number;
  shipperReference: string;
}

interface RateQuote {
  baseFreight: number;
  baf: number;
  caf: number;
  thcOrigin: number;
  thcDestination: number;
  documentation: number;
  securitySurcharge: number;
  equipmentSurcharge: number;
  peakSeasonSurcharge: number;
  totalFreight: number;
  transitDays: number;
  carrier: typeof CARRIERS[0];
  tradeLane: typeof TRADE_LANES[0];
}

interface AvailabilityResult {
  originAvailability: number;
  destinationAvailability: number;
  equipmentStatus: 'Available' | 'Limited' | 'Shortage' | 'Critical';
  estimatedPickupDate: string;
  cutoffDate: string;
  recommendation: string;
}

export default function ContainerBookingTool() {
  const [activeTab, setActiveTab] = useState('booking');
  const [form, setForm] = useState<BookingForm>({
    containerType: '40HC',
    containerCount: 1,
    originPort: '',
    destinationPort: '',
    loadingDate: '',
    commodity: 'GEN',
    weight: 0,
    volume: 0,
    cargoDescription: '',
    carrier: '',
    isDangerous: false,
    temperatureRequired: false,
    temperatureMin: 0,
    temperatureMax: 0,
    shipperReference: '',
  });

  const [rateQuote, setRateQuote] = useState<RateQuote | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isCalculatingRate, setIsCalculatingRate] = useState(false);

  // Get selected container info
  const selectedContainer = useMemo(() => {
    return CONTAINER_TYPES.find((c) => c.code === form.containerType) || CONTAINER_TYPES[0];
  }, [form.containerType]);

  // Get selected ports
  const selectedOriginPort = useMemo(() => {
    return PORTS.find((p) => p.unLoCode === form.originPort);
  }, [form.originPort]);

  const selectedDestPort = useMemo(() => {
    return PORTS.find((p) => p.unLoCode === form.destinationPort);
  }, [form.destinationPort]);

  // Determine trade lane based on ports
  const determineTradeLane = useMemo(() => {
    if (!selectedOriginPort || !selectedDestPort) return null;

    const originRegion = selectedOriginPort.region;
    const destRegion = selectedDestPort.region;

    if (originRegion === 'Asia' && destRegion === 'North America') {
      return TRADE_LANES.find((t) => t.id === 'asia-namer');
    }
    if (originRegion === 'Asia' && destRegion === 'Europe') {
      return TRADE_LANES.find((t) => t.id === 'asia-europe');
    }
    if (originRegion === 'Europe' && destRegion === 'North America') {
      return TRADE_LANES.find((t) => t.id === 'europe-namer');
    }
    if (originRegion === 'Asia' && destRegion === 'Asia') {
      return TRADE_LANES.find((t) => t.id === 'intra-asia');
    }
    if (originRegion === 'Asia' && destRegion === 'Middle East') {
      return TRADE_LANES.find((t) => t.id === 'asia-mideast');
    }
    // Default fallback
    return TRADE_LANES[0];
  }, [selectedOriginPort, selectedDestPort]);

  // Calculate rate quote
  const calculateRateQuote = () => {
    if (!form.originPort || !form.destinationPort) {
      return;
    }

    setIsCalculatingRate(true);

    setTimeout(() => {
      const tradeLane = determineTradeLane || TRADE_LANES[0];
      const container = selectedContainer;

      // Base freight
      const baseFreight = tradeLane.baseRate * container.baseRateMultiplier * form.containerCount;

      // Surcharges
      const baf = baseFreight * 0.15; // Bunker Adjustment Factor
      const caf = baseFreight * 0.03; // Currency Adjustment Factor
      const thcOrigin = 250 * form.containerCount; // Terminal Handling Charge - Origin
      const thcDestination = 350 * form.containerCount; // Terminal Handling Charge - Destination
      const documentation = 150; // Documentation fee
      const securitySurcharge = 75 * form.containerCount;

      // Equipment surcharge for special containers
      let equipmentSurcharge = 0;
      if (container.code.includes('RF')) {
        equipmentSurcharge = 450 * form.containerCount;
      } else if (container.code.includes('OT') || container.code.includes('FR')) {
        equipmentSurcharge = 300 * form.containerCount;
      } else if (container.code.includes('TK')) {
        equipmentSurcharge = 500 * form.containerCount;
      }

      // Peak season surcharge (simulated)
      const currentMonth = new Date().getMonth();
      const peakSeasonSurcharge =
        (currentMonth >= 8 && currentMonth <= 11) ? baseFreight * 0.12 : 0;

      const totalFreight =
        baseFreight +
        baf +
        caf +
        thcOrigin +
        thcDestination +
        documentation +
        securitySurcharge +
        equipmentSurcharge +
        peakSeasonSurcharge;

      // Get carrier
      const selectedCarrier = CARRIERS.find((c) => c.code === form.carrier) || CARRIERS[0];

      setRateQuote({
        baseFreight: Math.round(baseFreight),
        baf: Math.round(baf),
        caf: Math.round(caf),
        thcOrigin: Math.round(thcOrigin),
        thcDestination: Math.round(thcDestination),
        documentation,
        securitySurcharge: Math.round(securitySurcharge),
        equipmentSurcharge: Math.round(equipmentSurcharge),
        peakSeasonSurcharge: Math.round(peakSeasonSurcharge),
        totalFreight: Math.round(totalFreight),
        transitDays: tradeLane.transitDays,
        carrier: selectedCarrier,
        tradeLane,
      });

      setIsCalculatingRate(false);
    }, 800);
  };

  // Check availability
  const checkAvailability = () => {
    if (!form.originPort || !form.destinationPort || !form.loadingDate) {
      return;
    }

    setIsCheckingAvailability(true);

    setTimeout(() => {
      // Simulated availability check
      const originAvailability = Math.floor(Math.random() * 40) + 60; // 60-100
      const destinationAvailability = Math.floor(Math.random() * 40) + 60;

      let equipmentStatus: AvailabilityResult['equipmentStatus'] = 'Available';
      if (originAvailability < 75 && originAvailability >= 50) {
        equipmentStatus = 'Limited';
      } else if (originAvailability < 50 && originAvailability >= 25) {
        equipmentStatus = 'Shortage';
      } else if (originAvailability < 25) {
        equipmentStatus = 'Critical';
      }

      const loadingDate = new Date(form.loadingDate);
      const pickupDate = new Date(loadingDate);
      pickupDate.setDate(pickupDate.getDate() - 5);

      const cutoffDate = new Date(loadingDate);
      cutoffDate.setDate(cutoffDate.getDate() - 2);

      let recommendation = '';
      if (equipmentStatus === 'Available') {
        recommendation = 'Equipment readily available. Proceed with booking confirmation.';
      } else if (equipmentStatus === 'Limited') {
        recommendation = 'Equipment availability is limited. Consider booking early or exploring alternative pickup locations.';
      } else if (equipmentStatus === 'Shortage') {
        recommendation = 'Equipment shortage detected. Consider alternative ports or delaying shipment by 1-2 weeks.';
      } else {
        recommendation = 'Critical shortage. Immediate action required. Contact carrier for equipment allocation or reroute via alternative ports.';
      }

      setAvailability({
        originAvailability,
        destinationAvailability,
        equipmentStatus,
        estimatedPickupDate: pickupDate.toISOString().split('T')[0],
        cutoffDate: cutoffDate.toISOString().split('T')[0],
        recommendation,
      });

      setIsCheckingAvailability(false);
    }, 1000);
  };

  // Reset form
  const resetForm = () => {
    setForm({
      containerType: '40HC',
      containerCount: 1,
      originPort: '',
      destinationPort: '',
      loadingDate: '',
      commodity: 'GEN',
      weight: 0,
      volume: 0,
      cargoDescription: '',
      carrier: '',
      isDangerous: false,
      temperatureRequired: false,
      temperatureMin: 0,
      temperatureMax: 0,
      shipperReference: '',
    });
    setRateQuote(null);
    setAvailability(null);
  };

  // Filter ports by region
  const asiaPorts = PORTS.filter((p) => p.region === 'Asia').slice(0, 20);
  const europePorts = PORTS.filter((p) => p.region === 'Europe').slice(0, 15);
  const namerPorts = PORTS.filter((p) => p.region === 'North America').slice(0, 10);
  const otherPorts = PORTS.filter(
    (p) => !['Asia', 'Europe', 'North America'].includes(p.region)
  ).slice(0, 10);

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
              <Container className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Container Booking Tool
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Book container shipments with real-time availability checks, rate quotes, and carrier
            selection across major global trade lanes
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="quote">Rate Quote</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          {/* Booking Tab */}
          <TabsContent value="booking" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Container & Route Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ship className="h-5 w-5 text-[#0F4C81]" />
                      Container & Route
                    </CardTitle>
                    <CardDescription>Select container type and routing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Container Type Selection */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Container Type</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {CONTAINER_TYPES.slice(0, 8).map((container) => (
                          <button
                            key={container.code}
                            type="button"
                            onClick={() => setForm({ ...form, containerType: container.code })}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                              form.containerType === container.code
                                ? 'border-[#0F4C81] bg-[#0F4C81]/5 dark:bg-[#0F4C81]/10'
                                : 'border-slate-200 dark:border-slate-700 hover:border-[#0F4C81]/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{container.icon}</span>
                              <span className="font-bold text-sm">{container.code}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {container.capacity} CBM
                            </p>
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#0F4C81]"
                        onClick={() => {
                          const specialTypes = CONTAINER_TYPES.slice(8);
                          // Toggle special equipment view
                        }}
                      >
                        View Special Equipment →
                      </Button>
                    </div>

                    <Separator />

                    {/* Container Details */}
                    {selectedContainer && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">{selectedContainer.name}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Capacity</p>
                            <p className="font-semibold">{selectedContainer.capacity} CBM</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Max Payload</p>
                            <p className="font-semibold">
                              {(selectedContainer.maxPayload / 1000).toFixed(1)} Tons
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Dimensions</p>
                            <p className="font-semibold">
                              {selectedContainer.internalLength.toFixed(1)}m ×{' '}
                              {selectedContainer.internalWidth.toFixed(1)}m
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Rate Multiplier</p>
                            <p className="font-semibold text-[#2E8B57]">
                              {selectedContainer.baseRateMultiplier}x
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Container Count */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="containerCount">Number of Containers</Label>
                        <Input
                          id="containerCount"
                          type="number"
                          min="1"
                          max="100"
                          value={form.containerCount}
                          onChange={(e) =>
                            setForm({ ...form, containerCount: parseInt(e.target.value) || 1 })
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Origin & Destination */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#2E8B57]" />
                          Origin Port
                        </Label>
                        <Select
                          value={form.originPort}
                          onValueChange={(value) => setForm({ ...form, originPort: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select origin port" />
                          </SelectTrigger>
                          <SelectContent className="max-h-96">
                            <div className="p-2">
                              <p className="text-xs font-semibold text-[#0F4C81] mb-2">Asia</p>
                              {asiaPorts.map((port) => (
                                <SelectItem key={port.unLoCode} value={port.unLoCode}>
                                  {port.name} ({port.unLoCode})
                                </SelectItem>
                              ))}
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-semibold text-[#0F4C81] mb-2">Europe</p>
                              {europePorts.map((port) => (
                                <SelectItem key={port.unLoCode} value={port.unLoCode}>
                                  {port.name} ({port.unLoCode})
                                </SelectItem>
                              ))}
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-semibold text-[#0F4C81] mb-2">
                                North America
                              </p>
                              {namerPorts.map((port) => (
                                <SelectItem key={port.unLoCode} value={port.unLoCode}>
                                  {port.name} ({port.unLoCode})
                                </SelectItem>
                              ))}
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-semibold text-[#0F4C81] mb-2">Other</p>
                              {otherPorts.map((port) => (
                                <SelectItem key={port.unLoCode} value={port.unLoCode}>
                                  {port.name} ({port.unLoCode})
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        </Select>
                        {selectedOriginPort && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {selectedOriginPort.country} • {selectedOriginPort.throughput}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#0F4C81]" />
                          Destination Port
                        </Label>
                        <Select
                          value={form.destinationPort}
                          onValueChange={(value) => setForm({ ...form, destinationPort: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination port" />
                          </SelectTrigger>
                          <SelectContent className="max-h-96">
                            <div className="p-2">
                              <p className="text-xs font-semibold text-[#0F4C81] mb-2">Asia</p>
                              {asiaPorts.map((port) => (
                                <SelectItem key={port.unLoCode} value={port.unLoCode}>
                                  {port.name} ({port.unLoCode})
                                </SelectItem>
                              ))}
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-semibold text-[#0F4C81] mb-2">Europe</p>
                              {europePorts.map((port) => (
                                <SelectItem key={port.unLoCode} value={port.unLoCode}>
                                  {port.name} ({port.unLoCode})
                                </SelectItem>
                              ))}
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-semibold text-[#0F4C81] mb-2">
                                North America
                              </p>
                              {namerPorts.map((port) => (
                                <SelectItem key={port.unLoCode} value={port.unLoCode}>
                                  {port.name} ({port.unLoCode})
                                </SelectItem>
                              ))}
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-semibold text-[#0F4C81] mb-2">Other</p>
                              {otherPorts.map((port) => (
                                <SelectItem key={port.unLoCode} value={port.unLoCode}>
                                  {port.name} ({port.unLoCode})
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        </Select>
                        {selectedDestPort && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {selectedDestPort.country} • {selectedDestPort.throughput}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Route Preview */}
                    {selectedOriginPort && selectedDestPort && determineTradeLane && (
                      <div className="bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="font-semibold">{selectedOriginPort.name}</p>
                              <p className="text-xs text-slate-500">{selectedOriginPort.country}</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-[#0F4C81]" />
                            <div className="text-center">
                              <p className="font-semibold">{selectedDestPort.name}</p>
                              <p className="text-xs text-slate-500">{selectedDestPort.country}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Trade Lane</p>
                            <p className="font-semibold text-[#0F4C81]">{determineTradeLane.name}</p>
                            <p className="text-xs text-slate-500">
                              Est. Transit: {determineTradeLane.transitDays} days
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Booking Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Carrier Selection */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#2E8B57]" />
                      Carrier
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select
                      value={form.carrier}
                      onValueChange={(value) => setForm({ ...form, carrier: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        {CARRIERS.map((carrier) => (
                          <SelectItem key={carrier.code} value={carrier.code}>
                            <div className="flex items-center justify-between w-full">
                              <span>{carrier.name}</span>
                              <Badge
                                variant="outline"
                                className="ml-2 text-[#2E8B57] border-[#2E8B57]"
                              >
                                {carrier.reliability}%
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.carrier && (
                      <div className="text-xs text-slate-500">
                        Reliability:{' '}
                        {CARRIERS.find((c) => c.code === form.carrier)?.reliability}% • Avg
                        Transit:{' '}
                        {CARRIERS.find((c) => c.code === form.carrier)?.avgTransit}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Loading Date */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[#0F4C81]" />
                      Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loadingDate">Loading Date</Label>
                      <Input
                        id="loadingDate"
                        type="date"
                        value={form.loadingDate}
                        onChange={(e) => setForm({ ...form, loadingDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Cargo Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-[#2E8B57]" />
                      Cargo Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Commodity Type</Label>
                      <Select
                        value={form.commodity}
                        onValueChange={(value) => setForm({ ...form, commodity: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMODITY_TYPES.map((commodity) => (
                            <SelectItem key={commodity.code} value={commodity.code}>
                              {commodity.name}
                              {commodity.hazardClass && (
                                <Badge variant="destructive" className="ml-2">
                                  DG
                                </Badge>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={form.weight || ''}
                          onChange={(e) =>
                            setForm({ ...form, weight: parseFloat(e.target.value) || 0 })
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="volume">Volume (CBM)</Label>
                        <Input
                          id="volume"
                          type="number"
                          value={form.volume || ''}
                          onChange={(e) =>
                            setForm({ ...form, volume: parseFloat(e.target.value) || 0 })
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipperReference">Shipper Reference</Label>
                      <Input
                        id="shipperReference"
                        value={form.shipperReference}
                        onChange={(e) => setForm({ ...form, shipperReference: e.target.value })}
                        placeholder="PO# or Booking Reference"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      calculateRateQuote();
                      checkAvailability();
                      setActiveTab('quote');
                    }}
                    className="flex-1 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90"
                    disabled={!form.originPort || !form.destinationPort}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Get Quote
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Rate Quote Tab */}
          <TabsContent value="quote" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                      Rate Quote
                    </CardTitle>
                    <CardDescription>Estimated freight charges breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isCalculatingRate ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <RefreshCw className="h-8 w-8 text-[#0F4C81] animate-spin mb-4" />
                        <p className="text-slate-500">Calculating rates...</p>
                      </div>
                    ) : rateQuote ? (
                      <div className="space-y-6">
                        {/* Total */}
                        <div className="bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl p-6 text-white text-center">
                          <p className="text-sm opacity-90 mb-2">Estimated Total Freight</p>
                          <p className="text-4xl font-bold">
                            ${rateQuote.totalFreight.toLocaleString()}
                          </p>
                          <p className="text-sm opacity-75 mt-2">USD</p>
                        </div>

                        {/* Transit Info */}
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-[#0F4C81]" />
                            <span className="font-medium">Transit Time</span>
                          </div>
                          <Badge className="bg-[#0F4C81]/10 text-[#0F4C81]">
                            {rateQuote.transitDays} days
                          </Badge>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                            Cost Breakdown
                          </h4>
                          <div className="space-y-2">
                            {[
                              { label: 'Base Freight', value: rateQuote.baseFreight },
                              { label: 'BAF (Bunker Adjustment)', value: rateQuote.baf },
                              { label: 'CAF (Currency Adjustment)', value: rateQuote.caf },
                              { label: 'THC - Origin', value: rateQuote.thcOrigin },
                              { label: 'THC - Destination', value: rateQuote.thcDestination },
                              { label: 'Documentation Fee', value: rateQuote.documentation },
                              { label: 'Security Surcharge', value: rateQuote.securitySurcharge },
                              ...(rateQuote.equipmentSurcharge > 0
                                ? [
                                    {
                                      label: 'Equipment Surcharge',
                                      value: rateQuote.equipmentSurcharge,
                                    },
                                  ]
                                : []),
                              ...(rateQuote.peakSeasonSurcharge > 0
                                ? [
                                    {
                                      label: 'Peak Season Surcharge',
                                      value: rateQuote.peakSeasonSurcharge,
                                    },
                                  ]
                                : []),
                            ].map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800"
                              >
                                <span className="text-slate-600 dark:text-slate-400">
                                  {item.label}
                                </span>
                                <Badge variant="secondary">
                                  ${item.value.toLocaleString()}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Carrier Info */}
                        <div className="bg-[#0F4C81]/5 dark:bg-[#0F4C81]/10 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-slate-500">Carrier</p>
                              <p className="font-semibold">{rateQuote.carrier.name}</p>
                            </div>
                            <Badge className="bg-[#2E8B57]/10 text-[#2E8B57]">
                              {rateQuote.carrier.reliability}% Reliability
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <DollarSign className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">
                          Complete booking details to get a rate quote
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setActiveTab('booking')}
                        >
                          Go to Booking
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Booking Summary */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#2E8B57]" />
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Container Type</span>
                        <span className="font-semibold">{selectedContainer?.code}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Quantity</span>
                        <span className="font-semibold">{form.containerCount}x</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Origin</span>
                        <span className="font-semibold">{selectedOriginPort?.name || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Destination</span>
                        <span className="font-semibold">{selectedDestPort?.name || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Loading Date</span>
                        <span className="font-semibold">{form.loadingDate || '-'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rate Per Container */}
                {rateQuote && (
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                        Rate Per Container
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center">
                          <p className="text-xs text-slate-500">Per 20GP Equivalent</p>
                          <p className="font-bold text-[#0F4C81] text-xl">
                            $
                            {Math.round(
                              rateQuote.totalFreight / form.containerCount / selectedContainer.baseRateMultiplier
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 text-center">
                          <p className="text-xs text-slate-500">Per {selectedContainer.code}</p>
                          <p className="font-bold text-[#2E8B57] text-xl">
                            ${Math.round(rateQuote.totalFreight / form.containerCount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#0F4C81]" />
                    Container Availability Check
                  </CardTitle>
                  <CardDescription>
                    Real-time equipment availability at origin and destination ports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isCheckingAvailability ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 text-[#0F4C81] animate-spin mb-4" />
                      <p className="text-slate-500">Checking availability...</p>
                    </div>
                  ) : availability ? (
                    <div className="space-y-6">
                      {/* Status Indicator */}
                      <div
                        className={`rounded-lg p-6 text-center ${
                          availability.equipmentStatus === 'Available'
                            ? 'bg-green-50 dark:bg-green-950/30'
                            : availability.equipmentStatus === 'Limited'
                              ? 'bg-yellow-50 dark:bg-yellow-950/30'
                              : availability.equipmentStatus === 'Shortage'
                                ? 'bg-orange-50 dark:bg-orange-950/30'
                                : 'bg-red-50 dark:bg-red-950/30'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {availability.equipmentStatus === 'Available' ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <AlertTriangle
                              className={`h-6 w-6 ${
                                availability.equipmentStatus === 'Limited'
                                  ? 'text-yellow-500'
                                  : availability.equipmentStatus === 'Shortage'
                                    ? 'text-orange-500'
                                    : 'text-red-500'
                              }`}
                            />
                          )}
                          <span
                            className={`text-2xl font-bold ${
                              availability.equipmentStatus === 'Available'
                                ? 'text-green-600'
                                : availability.equipmentStatus === 'Limited'
                                  ? 'text-yellow-600'
                                  : availability.equipmentStatus === 'Shortage'
                                    ? 'text-orange-600'
                                    : 'text-red-600'
                            }`}
                          >
                            {availability.equipmentStatus}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Equipment status at {selectedOriginPort?.name}
                        </p>
                      </div>

                      {/* Availability Scores */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Origin Availability</span>
                            <span className="font-bold text-[#0F4C81]">
                              {availability.originAvailability}%
                            </span>
                          </div>
                          <Progress
                            value={availability.originAvailability}
                            className="h-3"
                          />
                          <p className="text-xs text-slate-500">
                            {selectedOriginPort?.name} ({selectedOriginPort?.unLoCode})
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Destination Availability</span>
                            <span className="font-bold text-[#2E8B57]">
                              {availability.destinationAvailability}%
                            </span>
                          </div>
                          <Progress
                            value={availability.destinationAvailability}
                            className="h-3"
                          />
                          <p className="text-xs text-slate-500">
                            {selectedDestPort?.name} ({selectedDestPort?.unLoCode})
                          </p>
                        </div>
                      </div>

                      {/* Key Dates */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Truck className="h-4 w-4 text-[#0F4C81]" />
                            <span className="font-medium">Estimated Pickup</span>
                          </div>
                          <p className="text-lg font-semibold">
                            {availability.estimatedPickupDate}
                          </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-[#2E8B57]" />
                            <span className="font-medium">Documentation Cutoff</span>
                          </div>
                          <p className="text-lg font-semibold">{availability.cutoffDate}</p>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                              Recommendation
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                              {availability.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Globe className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">
                        Complete booking details to check availability
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setActiveTab('booking')}
                      >
                        Go to Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Availability Legend */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  status: 'Available',
                  color: 'green',
                  desc: 'Equipment readily available',
                },
                {
                  status: 'Limited',
                  color: 'yellow',
                  desc: 'Some constraints may apply',
                },
                {
                  status: 'Shortage',
                  color: 'orange',
                  desc: 'Equipment scarcity expected',
                },
                {
                  status: 'Critical',
                  color: 'red',
                  desc: 'Severe shortage - alternatives needed',
                },
              ].map((item) => (
                <Card key={item.status} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.color === 'green'
                          ? 'bg-green-500'
                          : item.color === 'yellow'
                            ? 'bg-yellow-500'
                            : item.color === 'orange'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                      }`}
                    />
                    <span className="font-semibold">{item.status}</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
