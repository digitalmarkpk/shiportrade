'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plane, Building2, MapPin, FileText, Calendar, Package,
  Weight, Ruler, Printer, Download, Eye, Plus, Trash2,
  CheckCircle, AlertTriangle, DollarSign, Clock, User, Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { currencies } from '@/lib/constants/currencies';

interface AWBItem {
  id: string;
  description: string;
  quantity: number;
  weight: number;
  weightUnit: 'KG' | 'LB';
  volume: number;
  volumeUnit: 'CBM' | 'CFT';
  dimsLength: number;
  dimsWidth: number;
  dimsHeight: number;
  specialHandling: string[];
}

interface AirWaybillData {
  // AWB Details
  awbNumber: string;
  awbDate: string;
  awbOrigin: string;
  awbDestination: string;
  
  // Carrier
  carrierCode: string;
  carrierName: string;
  flightNumber: string;
  flightDate: string;
  
  // Shipper
  shipperName: string;
  shipperAddress: string;
  shipperCountry: string;
  shipperAccount: string;
  shipperPhone: string;
  shipperEmail: string;
  
  // Consignee
  consigneeName: string;
  consigneeAddress: string;
  consigneeCountry: string;
  consigneeAccount: string;
  consigneePhone: string;
  consigneeEmail: string;
  
  // Notify Party
  notifyName: string;
  notifyAddress: string;
  notifyCountry: string;
  
  // Airport Details
  airportOfDeparture: string;
  airportOfDestination: string;
  airportOfOrigin: string;
  toByFirstCarrier: string;
  toBySecondCarrier: string;
  toBy: string;
  
  // Routing & Charges
  currency: string;
  chargeableWeight: number;
  rateClass: string;
  commodityItemNumber: string;
  rateCharge: number;
  totalCharge: number;
  
  // Charges
  prepaidWeightCharge: number;
  collectWeightCharge: number;
  prepaidValuationCharge: number;
  collectValuationCharge: number;
  prepaidTax: number;
  collectTax: number;
  prepaidOtherCharges: number;
  collectOtherCharges: number;
  prepaidTotal: number;
  collectTotal: number;
  
  // Items
  items: AWBItem[];
  totalPieces: number;
  totalGrossWeight: number;
  totalVolume: number;
  
  // Additional
  declaredValueForCarriage: string;
  declaredValueForCustoms: string;
  amountOfInsurance: string;
  handlingInformation: string;
  specialInstructions: string;
  
  // Execution
  executedAt: string;
  executedOn: string;
  signatureShipper: boolean;
  signatureCarrier: boolean;
}

const carriers = [
  { code: 'FX', name: 'FedEx Express' },
  { code: '5X', name: 'UPS Airlines' },
  { code: 'DHL', name: 'DHL Express' },
  { code: 'CX', name: 'Cathay Pacific Cargo' },
  { code: 'EK', name: 'Emirates SkyCargo' },
  { code: 'LH', name: 'Lufthansa Cargo' },
  { code: 'SQ', name: 'Singapore Airlines Cargo' },
  { code: 'KE', name: 'Korean Air Cargo' },
  { code: 'AF', name: 'Air France Cargo' },
  { code: 'QR', name: 'Qatar Airways Cargo' },
  { code: 'CV', name: 'Cargolux' },
  { code: 'NH', name: 'ANA Cargo' },
];

const rateClasses = [
  { code: 'M', description: 'Minimum Rate' },
  { code: 'N', description: 'Normal Rate (under 45kg)' },
  { code: 'Q45', description: 'Quantity Rate 45kg+' },
  { code: 'Q100', description: 'Quantity Rate 100kg+' },
  { code: 'Q300', description: 'Quantity Rate 300kg+' },
  { code: 'Q500', description: 'Quantity Rate 500kg+' },
  { code: 'C', description: 'Specific Commodity Rate' },
  { code: 'R', description: 'Class Rate Reduction' },
  { code: 'S', description: 'Class Rate Surcharge' },
];

const specialHandlingCodes = [
  { code: 'PER', description: 'Perishable' },
  { code: 'HEA', description: 'Heavy (>150kg/piece)' },
  { code: 'BIG', description: 'Oversize' },
  { code: 'AOG', description: 'Aircraft on Ground' },
  { code: 'VAL', description: 'Valuable Cargo' },
  { code: 'VUN', description: 'Vulnerable Cargo' },
  { code: 'FRZ', description: 'Frozen' },
  { code: 'COOL', description: 'Cool' },
  { code: 'CAO', description: 'Cargo Aircraft Only' },
  { code: 'DGR', description: 'Dangerous Goods' },
  { code: 'LIV', description: 'Live Animals' },
  { code: 'PEM', description: 'Passive Enhanced' },
];

export default function AirWaybillGenerator() {
  const [activeTab, setActiveTab] = useState('parties');
  const [awbData, setAwbData] = useState<AirWaybillData>({
    awbNumber: `${carriers[0].code}-${Math.floor(Math.random() * 90000000) + 10000000}`,
    awbDate: new Date().toISOString().split('T')[0],
    awbOrigin: '',
    awbDestination: '',
    
    carrierCode: 'FX',
    carrierName: 'FedEx Express',
    flightNumber: '',
    flightDate: '',
    
    shipperName: '',
    shipperAddress: '',
    shipperCountry: '',
    shipperAccount: '',
    shipperPhone: '',
    shipperEmail: '',
    
    consigneeName: '',
    consigneeAddress: '',
    consigneeCountry: '',
    consigneeAccount: '',
    consigneePhone: '',
    consigneeEmail: '',
    
    notifyName: '',
    notifyAddress: '',
    notifyCountry: '',
    
    airportOfDeparture: '',
    airportOfDestination: '',
    airportOfOrigin: '',
    toByFirstCarrier: '',
    toBySecondCarrier: '',
    toBy: '',
    
    currency: 'USD',
    chargeableWeight: 0,
    rateClass: 'N',
    commodityItemNumber: '',
    rateCharge: 0,
    totalCharge: 0,
    
    prepaidWeightCharge: 0,
    collectWeightCharge: 0,
    prepaidValuationCharge: 0,
    collectValuationCharge: 0,
    prepaidTax: 0,
    collectTax: 0,
    prepaidOtherCharges: 0,
    collectOtherCharges: 0,
    prepaidTotal: 0,
    collectTotal: 0,
    
    items: [{
      id: '1',
      description: '',
      quantity: 1,
      weight: 0,
      weightUnit: 'KG',
      volume: 0,
      volumeUnit: 'CBM',
      dimsLength: 0,
      dimsWidth: 0,
      dimsHeight: 0,
      specialHandling: [],
    }],
    totalPieces: 1,
    totalGrossWeight: 0,
    totalVolume: 0,
    
    declaredValueForCarriage: 'NVD',
    declaredValueForCustoms: 'NVD',
    amountOfInsurance: 'XXX',
    handlingInformation: '',
    specialInstructions: '',
    
    executedAt: '',
    executedOn: new Date().toISOString().split('T')[0],
    signatureShipper: false,
    signatureCarrier: false,
  });

  const updateField = <K extends keyof AirWaybillData>(field: K, value: AirWaybillData[K]) => {
    setAwbData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem: AWBItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      weight: 0,
      weightUnit: 'KG',
      volume: 0,
      volumeUnit: 'CBM',
      dimsLength: 0,
      dimsWidth: 0,
      dimsHeight: 0,
      specialHandling: [],
    };
    updateField('items', [...awbData.items, newItem]);
  };

  const removeItem = (id: string) => {
    if (awbData.items.length > 1) {
      updateField('items', awbData.items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof AWBItem, value: any) => {
    const updatedItems = awbData.items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateField('items', updatedItems);
  };

  const totals = useMemo(() => {
    const totalPieces = awbData.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalGrossWeight = awbData.items.reduce((sum, item) => sum + item.weight, 0);
    const totalVolume = awbData.items.reduce((sum, item) => sum + item.volume, 0);
    return { totalPieces, totalGrossWeight, totalVolume };
  }, [awbData.items]);

  const selectedCurrency = currencies.find(c => c.code === awbData.currency);

  const handlePrint = () => {
    document.body.classList.add('printing-document');
    const originalTitle = document.title;
    document.title = `Air_Waybill_${awbData.awbNumber.replace('-', '_')}`;
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-document');
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-cyan-600 rounded-xl shadow-lg">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0F4C81] to-cyan-600 bg-clip-text text-transparent">
              Air Waybill Generator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Generate IATA-standard Air Waybill documents for international air cargo shipments
          </p>
        </motion.div>

        {/* Main Layout */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="parties" className="text-xs md:text-sm py-2">
              <User className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Parties</span>
            </TabsTrigger>
            <TabsTrigger value="routing" className="text-xs md:text-sm py-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Routing</span>
            </TabsTrigger>
            <TabsTrigger value="cargo" className="text-xs md:text-sm py-2">
              <Package className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Cargo</span>
            </TabsTrigger>
            <TabsTrigger value="charges" className="text-xs md:text-sm py-2">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Charges</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs md:text-sm py-2">
              <Eye className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
          </TabsList>

          {/* Parties Tab */}
          <TabsContent value="parties" className="space-y-4">
            {/* AWB Info */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-[#0F4C81]" />
                  Air Waybill Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>AWB Number *</Label>
                    <Input
                      value={awbData.awbNumber}
                      onChange={(e) => updateField('awbNumber', e.target.value.toUpperCase())}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issue Date *</Label>
                    <Input
                      type="date"
                      value={awbData.awbDate}
                      onChange={(e) => updateField('awbDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Carrier *</Label>
                    <Select 
                      value={awbData.carrierCode} 
                      onValueChange={(v) => {
                        const carrier = carriers.find(c => c.code === v);
                        updateField('carrierCode', v);
                        if (carrier) updateField('carrierName', carrier.name);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {carriers.map((carrier) => (
                          <SelectItem key={carrier.code} value={carrier.code}>
                            {carrier.code} - {carrier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={awbData.currency} onValueChange={(v) => updateField('currency', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.slice(0, 15).map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code} - {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipper */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-cyan-600" />
                  Shipper (Consignor)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input
                    value={awbData.shipperName}
                    onChange={(e) => updateField('shipperName', e.target.value)}
                    placeholder="Shipper company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Textarea
                    value={awbData.shipperAddress}
                    onChange={(e) => updateField('shipperAddress', e.target.value)}
                    rows={2}
                    placeholder="Full address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={awbData.shipperCountry}
                      onChange={(e) => updateField('shipperCountry', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account No.</Label>
                    <Input
                      value={awbData.shipperAccount}
                      onChange={(e) => updateField('shipperAccount', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={awbData.shipperPhone}
                      onChange={(e) => updateField('shipperPhone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={awbData.shipperEmail}
                      onChange={(e) => updateField('shipperEmail', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consignee */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-[#0F4C81]" />
                  Consignee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input
                    value={awbData.consigneeName}
                    onChange={(e) => updateField('consigneeName', e.target.value)}
                    placeholder="Consignee company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Textarea
                    value={awbData.consigneeAddress}
                    onChange={(e) => updateField('consigneeAddress', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={awbData.consigneeCountry}
                      onChange={(e) => updateField('consigneeCountry', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account No.</Label>
                    <Input
                      value={awbData.consigneeAccount}
                      onChange={(e) => updateField('consigneeAccount', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={awbData.consigneePhone}
                      onChange={(e) => updateField('consigneePhone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={awbData.consigneeEmail}
                      onChange={(e) => updateField('consigneeEmail', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notify Party */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Notify Party (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={awbData.notifyName}
                      onChange={(e) => updateField('notifyName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={awbData.notifyCountry}
                      onChange={(e) => updateField('notifyCountry', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={awbData.notifyAddress}
                    onChange={(e) => updateField('notifyAddress', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Routing Tab */}
          <TabsContent value="routing" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-cyan-600" />
                  Airport Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Airport of Departure *</Label>
                    <Input
                      value={awbData.airportOfDeparture}
                      onChange={(e) => updateField('airportOfDeparture', e.target.value)}
                      placeholder="e.g., JFK - New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Airport of Destination *</Label>
                    <Input
                      value={awbData.airportOfDestination}
                      onChange={(e) => updateField('airportOfDestination', e.target.value)}
                      placeholder="e.g., LHR - London"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Flight Number</Label>
                    <Input
                      value={awbData.flightNumber}
                      onChange={(e) => updateField('flightNumber', e.target.value.toUpperCase())}
                      placeholder="e.g., FX1234"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Flight Date</Label>
                    <Input
                      type="date"
                      value={awbData.flightDate}
                      onChange={(e) => updateField('flightDate', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Routing Information</CardTitle>
                <CardDescription>Interline routing for multi-segment shipments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>To (By First Carrier)</Label>
                    <Input
                      value={awbData.toByFirstCarrier}
                      onChange={(e) => updateField('toByFirstCarrier', e.target.value)}
                      placeholder="Airport code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>By First Carrier</Label>
                    <Input
                      value={awbData.carrierCode}
                      disabled
                      className="bg-slate-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>To (By Second Carrier)</Label>
                    <Input
                      value={awbData.toBySecondCarrier}
                      onChange={(e) => updateField('toBySecondCarrier', e.target.value)}
                      placeholder="Airport code (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>By Second Carrier</Label>
                    <Input
                      value={awbData.toBy}
                      onChange={(e) => updateField('toBy', e.target.value)}
                      placeholder="Carrier code"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cargo Tab */}
          <TabsContent value="cargo" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-[#0F4C81]" />
                    Cargo Details
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {awbData.items.map((item, index) => (
                  <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">Item {index + 1}</Badge>
                      {awbData.items.length > 1 && (
                        <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2 md:col-span-4 space-y-2">
                        <Label>Description of Goods</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Cargo description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gross Weight</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={item.weight}
                            onChange={(e) => updateItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                          />
                          <Select value={item.weightUnit} onValueChange={(v) => updateItem(item.id, 'weightUnit', v)}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="KG">KG</SelectItem>
                              <SelectItem value="LB">LB</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Length</Label>
                        <Input
                          type="number"
                          value={item.dimsLength}
                          onChange={(e) => updateItem(item.id, 'dimsLength', parseFloat(e.target.value) || 0)}
                          placeholder="cm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Width</Label>
                        <Input
                          type="number"
                          value={item.dimsWidth}
                          onChange={(e) => updateItem(item.id, 'dimsWidth', parseFloat(e.target.value) || 0)}
                          placeholder="cm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height</Label>
                        <Input
                          type="number"
                          value={item.dimsHeight}
                          onChange={(e) => updateItem(item.id, 'dimsHeight', parseFloat(e.target.value) || 0)}
                          placeholder="cm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Volume (CBM)</Label>
                        <Input
                          type="number"
                          value={item.volume}
                          onChange={(e) => updateItem(item.id, 'volume', parseFloat(e.target.value) || 0)}
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Totals */}
                <div className="p-4 bg-gradient-to-r from-[#0F4C81]/10 to-cyan-600/10 dark:from-[#0F4C81]/20 dark:to-cyan-600/20 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-slate-500 text-sm">Total Pieces</p>
                      <p className="text-2xl font-bold text-[#0F4C81]">{totals.totalPieces}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Total Gross Weight (KG)</p>
                      <p className="text-2xl font-bold text-cyan-600">{totals.totalGrossWeight.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Total Volume (CBM)</p>
                      <p className="text-2xl font-bold text-[#2E8B57]">{totals.totalVolume.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Declared Values & Insurance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Declared Value for Carriage</Label>
                    <Input
                      value={awbData.declaredValueForCarriage}
                      onChange={(e) => updateField('declaredValueForCarriage', e.target.value)}
                      placeholder="NVD = No Value Declared"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Declared Value for Customs</Label>
                    <Input
                      value={awbData.declaredValueForCustoms}
                      onChange={(e) => updateField('declaredValueForCustoms', e.target.value)}
                      placeholder="NVD = No Value Declared"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount of Insurance</Label>
                    <Input
                      value={awbData.amountOfInsurance}
                      onChange={(e) => updateField('amountOfInsurance', e.target.value)}
                      placeholder="XXX = No Insurance"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Handling Information</Label>
                  <Textarea
                    value={awbData.handlingInformation}
                    onChange={(e) => updateField('handlingInformation', e.target.value)}
                    rows={2}
                    placeholder="Special handling codes: PER, HEA, BIG, FRZ, etc."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charges Tab */}
          <TabsContent value="charges" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-[#2E8B57]" />
                  Rate Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Chargeable Weight</Label>
                    <Input
                      type="number"
                      value={awbData.chargeableWeight}
                      onChange={(e) => updateField('chargeableWeight', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate Class</Label>
                    <Select value={awbData.rateClass} onValueChange={(v) => updateField('rateClass', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rateClasses.map((rc) => (
                          <SelectItem key={rc.code} value={rc.code}>
                            {rc.code} - {rc.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rate/Charge ({selectedCurrency?.symbol})</Label>
                    <Input
                      type="number"
                      value={awbData.rateCharge}
                      onChange={(e) => updateField('rateCharge', parseFloat(e.target.value) || 0)}
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total ({selectedCurrency?.symbol})</Label>
                    <Input
                      type="number"
                      value={awbData.totalCharge}
                      onChange={(e) => updateField('totalCharge', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Prepaid vs Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#0F4C81] font-medium">Charge</Label>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-cyan-600 font-medium">Prepaid</Label>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#2E8B57] font-medium">Collect</Label>
                  </div>
                  
                  <div className="py-2 text-sm font-medium">Weight Charge</div>
                  <Input
                    type="number"
                    value={awbData.prepaidWeightCharge}
                    onChange={(e) => updateField('prepaidWeightCharge', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    value={awbData.collectWeightCharge}
                    onChange={(e) => updateField('collectWeightCharge', parseFloat(e.target.value) || 0)}
                  />
                  
                  <div className="py-2 text-sm font-medium">Valuation Charge</div>
                  <Input
                    type="number"
                    value={awbData.prepaidValuationCharge}
                    onChange={(e) => updateField('prepaidValuationCharge', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    value={awbData.collectValuationCharge}
                    onChange={(e) => updateField('collectValuationCharge', parseFloat(e.target.value) || 0)}
                  />
                  
                  <div className="py-2 text-sm font-medium">Tax</div>
                  <Input
                    type="number"
                    value={awbData.prepaidTax}
                    onChange={(e) => updateField('prepaidTax', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    value={awbData.collectTax}
                    onChange={(e) => updateField('collectTax', parseFloat(e.target.value) || 0)}
                  />
                  
                  <div className="py-2 text-sm font-medium">Other Charges</div>
                  <Input
                    type="number"
                    value={awbData.prepaidOtherCharges}
                    onChange={(e) => updateField('prepaidOtherCharges', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    value={awbData.collectOtherCharges}
                    onChange={(e) => updateField('collectOtherCharges', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-3 gap-4 font-bold">
                  <div className="py-2">TOTAL</div>
                  <div className="py-2 text-[#0F4C81]">
                    {selectedCurrency?.symbol}{(awbData.prepaidWeightCharge + awbData.prepaidValuationCharge + awbData.prepaidTax + awbData.prepaidOtherCharges).toFixed(2)}
                  </div>
                  <div className="py-2 text-[#2E8B57]">
                    {selectedCurrency?.symbol}{(awbData.collectWeightCharge + awbData.collectValuationCharge + awbData.collectTax + awbData.collectOtherCharges).toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <div className="flex justify-end gap-2 no-print">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button className="bg-gradient-to-r from-[#0F4C81] to-cyan-600">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>

            <Card className="document-content-only bg-white dark:bg-slate-900 shadow-xl" id="awb-document">
              <CardContent className="p-8">
                {/* AWB Header */}
                <div className="border-2 border-slate-300 p-4 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-[#0F4C81]">AIR WAYBILL</h1>
                      <p className="text-sm text-slate-500">IATA Standard Air Waybill</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xl font-bold">{awbData.awbNumber}</p>
                      <p className="text-sm text-slate-500">AWB No.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Carrier</p>
                      <p className="font-semibold">{awbData.carrierName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Issue Date</p>
                      <p className="font-semibold">{awbData.awbDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Currency</p>
                      <p className="font-semibold">{awbData.currency}</p>
                    </div>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="border border-slate-200 p-4">
                    <h3 className="font-semibold text-[#0F4C81] mb-2">SHIPPER (Consignor)</h3>
                    <p className="font-bold">{awbData.shipperName || 'Shipper Name'}</p>
                    <p className="text-sm whitespace-pre-line">{awbData.shipperAddress}</p>
                    <p className="text-sm">{awbData.shipperCountry}</p>
                    {awbData.shipperPhone && <p className="text-sm">Tel: {awbData.shipperPhone}</p>}
                    {awbData.shipperEmail && <p className="text-sm">Email: {awbData.shipperEmail}</p>}
                  </div>
                  <div className="border border-slate-200 p-4">
                    <h3 className="font-semibold text-cyan-600 mb-2">CONSIGNEE</h3>
                    <p className="font-bold">{awbData.consigneeName || 'Consignee Name'}</p>
                    <p className="text-sm whitespace-pre-line">{awbData.consigneeAddress}</p>
                    <p className="text-sm">{awbData.consigneeCountry}</p>
                    {awbData.consigneePhone && <p className="text-sm">Tel: {awbData.consigneePhone}</p>}
                    {awbData.consigneeEmail && <p className="text-sm">Email: {awbData.consigneeEmail}</p>}
                  </div>
                </div>

                {/* Routing */}
                <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-32 text-slate-500">Airport of Departure:</span>
                      <span className="font-medium">{awbData.airportOfDeparture || 'TBD'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500">Airport of Destination:</span>
                      <span className="font-medium">{awbData.airportOfDestination || 'TBD'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-32 text-slate-500">Flight:</span>
                      <span className="font-medium">{awbData.flightNumber || 'TBD'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500">Flight Date:</span>
                      <span className="font-medium">{awbData.flightDate || 'TBD'}</span>
                    </div>
                  </div>
                </div>

                {/* Cargo Table */}
                <table className="w-full border-collapse border border-slate-300 mb-6 text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-2 text-left">No.</th>
                      <th className="border border-slate-300 p-2 text-left">Description</th>
                      <th className="border border-slate-300 p-2 text-center">Pieces</th>
                      <th className="border border-slate-300 p-2 text-center">Gross Weight</th>
                      <th className="border border-slate-300 p-2 text-center">kg/lb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awbData.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-slate-300 p-2 text-center">{index + 1}</td>
                        <td className="border border-slate-300 p-2">{item.description || '-'}</td>
                        <td className="border border-slate-300 p-2 text-center">{item.quantity}</td>
                        <td className="border border-slate-300 p-2 text-center">{item.weight}</td>
                        <td className="border border-slate-300 p-2 text-center">{item.weightUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={2} className="border border-slate-300 p-2">TOTAL</td>
                      <td className="border border-slate-300 p-2 text-center">{totals.totalPieces}</td>
                      <td className="border border-slate-300 p-2 text-center">{totals.totalGrossWeight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center">KG</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Charges */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="border border-slate-200 p-4">
                    <p className="text-slate-500">Chargeable Weight</p>
                    <p className="font-bold text-lg">{awbData.chargeableWeight} KG</p>
                  </div>
                  <div className="border border-slate-200 p-4">
                    <p className="text-slate-500">Rate Class</p>
                    <p className="font-bold text-lg">{awbData.rateClass}</p>
                  </div>
                  <div className="border border-slate-200 p-4">
                    <p className="text-slate-500">Total Charge</p>
                    <p className="font-bold text-lg">{selectedCurrency?.symbol}{awbData.totalCharge.toFixed(2)}</p>
                  </div>
                </div>

                {/* Execution */}
                <div className="border-t-2 border-slate-300 pt-4 mt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500">Executed on: {awbData.executedOn}</p>
                      <p className="text-sm text-slate-500">Executed at: {awbData.executedAt || awbData.airportOfDeparture}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-slate-500">Signature of Shipper or Agent</p>
                      <div className="h-12 border-b border-slate-300 mt-4"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
