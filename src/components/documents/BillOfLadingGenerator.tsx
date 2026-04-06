'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Printer, Eye, Building, Calendar, Ship, MapPin,
  Container, Package, Download, Plus, Trash2, Info, AlertTriangle,
  CheckCircle, Anchor, Truck, Building2, Users, Settings
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { currencies } from '@/lib/constants/currencies';

interface CargoItem {
  id: string;
  marksNumbers: string;
  numberOfPackages: string;
  packageType: string;
  description: string;
  grossWeight: string;
  netWeight: string;
  measurement: string;
}

interface ContainerInfo {
  id: string;
  containerNumber: string;
  containerType: string;
  sealNumber: string;
  grossWeight: string;
  measurement: string;
}

interface BillOfLadingData {
  // Document Info
  blNumber: string;
  blDate: string;
  blType: 'original' | 'copy' | 'seaway' | 'telex';
  bookingNumber: string;

  // Shipper
  shipperName: string;
  shipperAddress: string;
  shipperPhone: string;
  shipperEmail: string;
  shipperRef: string;

  // Consignee
  consigneeName: string;
  consigneeAddress: string;
  consigneePhone: string;
  consigneeEmail: string;
  consigneeRef: string;

  // Notify Party
  notifyName: string;
  notifyAddress: string;
  notifyPhone: string;
  notifyEmail: string;
  notifyParty2Name: string;
  notifyParty2Address: string;

  // Carrier
  carrierName: string;
  carrierAddress: string;
  carrierLogo: string;
  carrierCode: string;

  // Vessel & Voyage
  vesselName: string;
  vesselIMO: string;
  voyageNumber: string;
  vesselFlag: string;

  // Ports
  portOfLoading: string;
  portOfLoadingCode: string;
  portOfDischarge: string;
  portOfDischargeCode: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  preCarriageBy: string;

  // Containers
  containers: ContainerInfo[];

  // Cargo
  cargoItems: CargoItem[];

  // Freight Terms
  freightTerms: 'prepaid' | 'collect' | 'prepaid_collect';
  freightPayableAt: string;
  freightAmount: string;
  freightCurrency: string;

  // Additional
  numberOfOriginals: string;
  specialInstructions: string;
  declaredValue: string;
  declaredValueCurrency: string;
  placeOfIssue: string;
  dateOfIssue: string;
}

const defaultContainer = (): ContainerInfo => ({
  id: crypto.randomUUID(),
  containerNumber: '',
  containerType: '40HC',
  sealNumber: '',
  grossWeight: '',
  measurement: '',
});

const defaultCargoItem = (): CargoItem => ({
  id: crypto.randomUUID(),
  marksNumbers: '',
  numberOfPackages: '',
  packageType: 'CTN',
  description: '',
  grossWeight: '',
  netWeight: '',
  measurement: '',
});

const containerTypes = [
  { value: '20GP', label: "20' General Purpose (Dry)" },
  { value: '40GP', label: "40' General Purpose (Dry)" },
  { value: '40HC', label: "40' High Cube" },
  { value: '45HC', label: "45' High Cube" },
  { value: '20RF', label: "20' Refrigerated" },
  { value: '40RF', label: "40' Refrigerated (Reefer)" },
  { value: '20OT', label: "20' Open Top" },
  { value: '40OT', label: "40' Open Top" },
  { value: '20FR', label: "20' Flat Rack" },
  { value: '40FR', label: "40' Flat Rack" },
  { value: '20TK', label: "20' Tank" },
  { value: '40TK', label: "40' Tank" },
];

const packageTypes = [
  { value: 'CTN', label: 'Cartons' },
  { value: 'PLT', label: 'Pallets' },
  { value: 'CRT', label: 'Crates' },
  { value: 'BXS', label: 'Boxes' },
  { value: 'BGS', label: 'Bags' },
  { value: 'BLS', label: 'Bales' },
  { value: 'DRM', label: 'Drums' },
  { value: 'PKS', label: 'Packs' },
  { value: 'PCS', label: 'Pieces' },
  { value: 'RLS', label: 'Rolls' },
];

const blTypes = [
  { 
    value: 'original', 
    label: 'Original B/L', 
    description: 'Negotiable document of title, required for cargo release',
    color: '#0F4C81'
  },
  { 
    value: 'copy', 
    label: 'Copy B/L', 
    description: 'Non-negotiable copy for reference only',
    color: '#6B7280'
  },
  { 
    value: 'seaway', 
    label: 'Seaway Bill', 
    description: 'Non-negotiable, faster release without original',
    color: '#2E8B57'
  },
  { 
    value: 'telex', 
    label: 'Telex Release', 
    description: 'Electronic release at destination port',
    color: '#F59E0B'
  },
];

const freightTermsOptions = [
  { value: 'prepaid', label: 'Freight Prepaid' },
  { value: 'collect', label: 'Freight Collect' },
  { value: 'prepaid_collect', label: 'Part Prepaid / Part Collect' },
];

// Currency options derived from shared constants
const currencyOptions = currencies.slice(0, 15).map(c => ({ code: c.code, symbol: c.symbol }));

export default function BillOfLadingGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('parties');
  const [showPreview, setShowPreview] = useState(true);

  const [blData, setBlData] = useState<BillOfLadingData>({
    blNumber: `BL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    blDate: new Date().toISOString().split('T')[0],
    blType: 'original',
    bookingNumber: '',

    shipperName: '',
    shipperAddress: '',
    shipperPhone: '',
    shipperEmail: '',
    shipperRef: '',

    consigneeName: '',
    consigneeAddress: '',
    consigneePhone: '',
    consigneeEmail: '',
    consigneeRef: '',

    notifyName: '',
    notifyAddress: '',
    notifyPhone: '',
    notifyEmail: '',
    notifyParty2Name: '',
    notifyParty2Address: '',

    carrierName: '',
    carrierAddress: '',
    carrierLogo: '',
    carrierCode: '',

    vesselName: '',
    vesselIMO: '',
    voyageNumber: '',
    vesselFlag: '',

    portOfLoading: '',
    portOfLoadingCode: '',
    portOfDischarge: '',
    portOfDischargeCode: '',
    placeOfReceipt: '',
    placeOfDelivery: '',
    preCarriageBy: '',

    containers: [defaultContainer()],
    cargoItems: [defaultCargoItem()],

    freightTerms: 'prepaid',
    freightPayableAt: '',
    freightAmount: '',
    freightCurrency: 'USD',

    numberOfOriginals: '3',
    specialInstructions: '',
    declaredValue: '',
    declaredValueCurrency: 'USD',
    placeOfIssue: '',
    dateOfIssue: '',
  });

  const updateField = <K extends keyof BillOfLadingData>(field: K, value: BillOfLadingData[K]) => {
    setBlData(prev => ({ ...prev, [field]: value }));
  };

  const updateContainer = (id: string, field: keyof ContainerInfo, value: string) => {
    setBlData(prev => ({
      ...prev,
      containers: prev.containers.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };

  const addContainer = () => {
    setBlData(prev => ({
      ...prev,
      containers: [...prev.containers, defaultContainer()],
    }));
  };

  const removeContainer = (id: string) => {
    setBlData(prev => ({
      ...prev,
      containers: prev.containers.filter(c => c.id !== id),
    }));
  };

  const updateCargoItem = (id: string, field: keyof CargoItem, value: string) => {
    setBlData(prev => ({
      ...prev,
      cargoItems: prev.cargoItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addCargoItem = () => {
    setBlData(prev => ({
      ...prev,
      cargoItems: [...prev.cargoItems, defaultCargoItem()],
    }));
  };

  const removeCargoItem = (id: string) => {
    setBlData(prev => ({
      ...prev,
      cargoItems: prev.cargoItems.filter(item => item.id !== id),
    }));
  };

  // Calculate totals
  const totals = useMemo(() => {
    const containerTotals = blData.containers.reduce((acc, c) => ({
      weight: acc.weight + (parseFloat(c.grossWeight) || 0),
      measurement: acc.measurement + (parseFloat(c.measurement) || 0),
    }), { weight: 0, measurement: 0 });

    const cargoTotals = blData.cargoItems.reduce((acc, item) => ({
      packages: acc.packages + (parseInt(item.numberOfPackages) || 0),
      grossWeight: acc.grossWeight + (parseFloat(item.grossWeight) || 0),
      netWeight: acc.netWeight + (parseFloat(item.netWeight) || 0),
      measurement: acc.measurement + (parseFloat(item.measurement) || 0),
    }), { packages: 0, grossWeight: 0, netWeight: 0, measurement: 0 });

    return { ...containerTotals, ...cargoTotals };
  }, [blData.containers, blData.cargoItems]);

  const selectedBlType = blTypes.find(t => t.value === blData.blType);
  const selectedCurrency = currencyOptions.find(c => c.code === blData.freightCurrency);

  const handlePrint = () => {
    // Create a dedicated print container for clean output
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    printContainer.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      background: white;
      z-index: 99999;
      padding: 10mm;
    `;
    
    // Clone the document content
    if (printRef.current) {
      const clone = printRef.current.cloneNode(true) as HTMLElement;
      
      // Remove buttons and non-print elements from clone
      clone.querySelectorAll('button').forEach(btn => btn.remove());
      clone.querySelectorAll('.no-print').forEach(el => el.remove());
      clone.querySelectorAll('[role="tablist"]').forEach(el => el.remove());
      clone.querySelectorAll('[role="tab"]').forEach(el => el.remove());
      
      // Style the clone for print
      clone.style.cssText = `
        background: white;
        width: 100%;
        box-shadow: none;
        border: none;
        border-radius: 0;
        font-size: 10pt;
      `;
      
      // Remove any max-height restrictions
      clone.querySelectorAll('[style*="max-height"]').forEach(el => {
        (el as HTMLElement).style.maxHeight = 'none';
      });
      clone.querySelectorAll('[class*="ScrollArea"]').forEach(el => {
        (el as HTMLElement).style.maxHeight = 'none';
        (el as HTMLElement).style.overflow = 'visible';
      });
      
      printContainer.appendChild(clone);
    }
    
    // Hide all page content
    const allElements = document.body.children;
    for (let i = 0; i < allElements.length; i++) {
      (allElements[i] as HTMLElement).style.display = 'none';
    }
    
    // Add print container to body
    document.body.appendChild(printContainer);
    
    // Set document title
    const originalTitle = document.title;
    document.title = `Bill_of_Lading_${blData.blNumber || 'Document'}`;
    
    // Print
    window.print();
    
    // Restore after print
    setTimeout(() => {
      printContainer.remove();
      for (let i = 0; i < allElements.length; i++) {
        (allElements[i] as HTMLElement).style.display = '';
      }
      document.title = originalTitle;
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <Anchor className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Ocean Bill of Lading Generator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Professional Bill of Lading for ocean freight shipments with live preview
          </p>
        </motion.div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className={`lg:col-span-${showPreview ? '3' : '5'} space-y-4`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 h-auto">
                <TabsTrigger value="parties" className="text-xs md:text-sm py-2">
                  <Users className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Parties</span>
                </TabsTrigger>
                <TabsTrigger value="vessel" className="text-xs md:text-sm py-2">
                  <Ship className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Vessel</span>
                </TabsTrigger>
                <TabsTrigger value="container" className="text-xs md:text-sm py-2">
                  <Container className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Container</span>
                </TabsTrigger>
                <TabsTrigger value="cargo" className="text-xs md:text-sm py-2">
                  <Package className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Cargo</span>
                </TabsTrigger>
                <TabsTrigger value="terms" className="text-xs md:text-sm py-2">
                  <Settings className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Terms</span>
                </TabsTrigger>
              </TabsList>

              {/* Parties Tab */}
              <TabsContent value="parties" className="space-y-4">
                {/* Document Info */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-[#0F4C81]" />
                      Document Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>B/L Number *</Label>
                        <Input
                          value={blData.blNumber}
                          onChange={(e) => updateField('blNumber', e.target.value.toUpperCase())}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Issue Date *</Label>
                        <Input
                          type="date"
                          value={blData.blDate}
                          onChange={(e) => updateField('blDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Booking Number</Label>
                        <Input
                          value={blData.bookingNumber}
                          onChange={(e) => updateField('bookingNumber', e.target.value.toUpperCase())}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Originals</Label>
                        <Select value={blData.numberOfOriginals} onValueChange={(v) => updateField('numberOfOriginals', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Original</SelectItem>
                            <SelectItem value="2">2 Originals</SelectItem>
                            <SelectItem value="3">3 Originals</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* B/L Type Selection */}
                    <div className="space-y-3">
                      <Label>B/L Type *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {blTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => updateField('blType', type.value as BillOfLadingData['blType'])}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              blData.blType === type.value
                                ? 'border-[#0F4C81] bg-[#0F4C81]/5 dark:bg-[#0F4C81]/10'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <Badge style={{ backgroundColor: type.color }} className="mb-1">
                              {type.label}
                            </Badge>
                            <p className="text-xs text-slate-500">{type.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipper */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="h-5 w-5 text-[#0F4C81]" />
                      Shipper (Exporter)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input
                        value={blData.shipperName}
                        onChange={(e) => updateField('shipperName', e.target.value)}
                        placeholder="Shipper company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address *</Label>
                      <Textarea
                        value={blData.shipperAddress}
                        onChange={(e) => updateField('shipperAddress', e.target.value)}
                        rows={2}
                        placeholder="Full address including country"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={blData.shipperPhone}
                          onChange={(e) => updateField('shipperPhone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={blData.shipperEmail}
                          onChange={(e) => updateField('shipperEmail', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reference</Label>
                        <Input
                          value={blData.shipperRef}
                          onChange={(e) => updateField('shipperRef', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Consignee */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5 text-[#2E8B57]" />
                      Consignee (Receiver)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input
                        value={blData.consigneeName}
                        onChange={(e) => updateField('consigneeName', e.target.value)}
                        placeholder="Consignee company name or TO ORDER"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={blData.consigneeAddress}
                        onChange={(e) => updateField('consigneeAddress', e.target.value)}
                        rows={2}
                        placeholder="Full address"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={blData.consigneePhone}
                          onChange={(e) => updateField('consigneePhone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={blData.consigneeEmail}
                          onChange={(e) => updateField('consigneeEmail', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reference</Label>
                        <Input
                          value={blData.consigneeRef}
                          onChange={(e) => updateField('consigneeRef', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notify Parties */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-[#0F4C81]" />
                      Notify Party
                    </CardTitle>
                    <CardDescription>
                      Party to be notified upon arrival of the cargo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Notify Party Name</Label>
                      <Input
                        value={blData.notifyName}
                        onChange={(e) => updateField('notifyName', e.target.value)}
                        placeholder="Notify party company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={blData.notifyAddress}
                        onChange={(e) => updateField('notifyAddress', e.target.value)}
                        rows={2}
                        placeholder="Notify party address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={blData.notifyPhone}
                          onChange={(e) => updateField('notifyPhone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={blData.notifyEmail}
                          onChange={(e) => updateField('notifyEmail', e.target.value)}
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Label>Notify Party 2 (Optional)</Label>
                      <Input
                        value={blData.notifyParty2Name}
                        onChange={(e) => updateField('notifyParty2Name', e.target.value)}
                        placeholder="Second notify party name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={blData.notifyParty2Address}
                        onChange={(e) => updateField('notifyParty2Address', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vessel Tab */}
              <TabsContent value="vessel" className="space-y-4">
                {/* Carrier Info */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Truck className="h-5 w-5 text-[#2E8B57]" />
                      Carrier Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Carrier Name *</Label>
                        <Input
                          value={blData.carrierName}
                          onChange={(e) => updateField('carrierName', e.target.value)}
                          placeholder="e.g., Mediterranean Shipping Company"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Carrier Code</Label>
                        <Input
                          value={blData.carrierCode}
                          onChange={(e) => updateField('carrierCode', e.target.value.toUpperCase())}
                          placeholder="e.g., MSC"
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Carrier Address</Label>
                      <Textarea
                        value={blData.carrierAddress}
                        onChange={(e) => updateField('carrierAddress', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Vessel & Voyage */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Ship className="h-5 w-5 text-[#0F4C81]" />
                      Vessel & Voyage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Vessel Name *</Label>
                        <Input
                          value={blData.vesselName}
                          onChange={(e) => updateField('vesselName', e.target.value)}
                          placeholder="e.g., MSC GÜLSÜN"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Voyage Number *</Label>
                        <Input
                          value={blData.voyageNumber}
                          onChange={(e) => updateField('voyageNumber', e.target.value.toUpperCase())}
                          placeholder="e.g., V.245E"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>IMO Number</Label>
                        <Input
                          value={blData.vesselIMO}
                          onChange={(e) => updateField('vesselIMO', e.target.value)}
                          placeholder="IMO number"
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Flag</Label>
                        <Input
                          value={blData.vesselFlag}
                          onChange={(e) => updateField('vesselFlag', e.target.value)}
                          placeholder="e.g., Panama"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ports */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-[#2E8B57]" />
                      Ports & Places
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Port of Loading *</Label>
                        <Input
                          value={blData.portOfLoading}
                          onChange={(e) => updateField('portOfLoading', e.target.value)}
                          placeholder="e.g., Shanghai, China"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>POL Code</Label>
                        <Input
                          value={blData.portOfLoadingCode}
                          onChange={(e) => updateField('portOfLoadingCode', e.target.value.toUpperCase())}
                          placeholder="e.g., CNSHA"
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Port of Discharge *</Label>
                        <Input
                          value={blData.portOfDischarge}
                          onChange={(e) => updateField('portOfDischarge', e.target.value)}
                          placeholder="e.g., Los Angeles, USA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>POD Code</Label>
                        <Input
                          value={blData.portOfDischargeCode}
                          onChange={(e) => updateField('portOfDischargeCode', e.target.value.toUpperCase())}
                          placeholder="e.g., USLAX"
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Place of Receipt</Label>
                        <Input
                          value={blData.placeOfReceipt}
                          onChange={(e) => updateField('placeOfReceipt', e.target.value)}
                          placeholder="Pre-carriage place"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Place of Delivery</Label>
                        <Input
                          value={blData.placeOfDelivery}
                          onChange={(e) => updateField('placeOfDelivery', e.target.value)}
                          placeholder="On-carriage place"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Pre-Carriage By</Label>
                      <Input
                        value={blData.preCarriageBy}
                        onChange={(e) => updateField('preCarriageBy', e.target.value)}
                        placeholder="e.g., Truck, Rail, Barge"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Container Tab */}
              <TabsContent value="container" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Container className="h-5 w-5 text-[#0F4C81]" />
                      Container Details
                    </CardTitle>
                    <CardDescription>
                      Add container information including seal numbers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AnimatePresence>
                      {blData.containers.map((container, index) => (
                        <motion.div
                          key={container.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 border rounded-lg space-y-3 bg-slate-50 dark:bg-slate-800/50"
                        >
                          <div className="flex justify-between items-center">
                            <Badge variant="secondary">Container {index + 1}</Badge>
                            {blData.containers.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeContainer(container.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Container Number</Label>
                              <Input
                                value={container.containerNumber}
                                onChange={(e) => updateContainer(container.id, 'containerNumber', e.target.value.toUpperCase())}
                                placeholder="MSCU1234567"
                                className="font-mono"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Type</Label>
                              <Select
                                value={container.containerType}
                                onValueChange={(v) => updateContainer(container.id, 'containerType', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {containerTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Seal Number</Label>
                              <Input
                                value={container.sealNumber}
                                onChange={(e) => updateContainer(container.id, 'sealNumber', e.target.value.toUpperCase())}
                                placeholder="Seal #"
                                className="font-mono"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Gross Weight (kg)</Label>
                              <Input
                                type="number"
                                value={container.grossWeight}
                                onChange={(e) => updateContainer(container.id, 'grossWeight', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Measurement (CBM)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={container.measurement}
                                onChange={(e) => updateContainer(container.id, 'measurement', e.target.value)}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <Button variant="outline" onClick={addContainer} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Container
                    </Button>

                    {/* Container Totals */}
                    <div className="p-4 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 dark:from-[#0F4C81]/20 dark:to-[#2E8B57]/20 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-slate-500">Total Containers: </span>
                          <span className="font-medium">{blData.containers.length}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Total Weight: </span>
                          <span className="font-medium">{totals.weight.toLocaleString()} kg</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Total CBM: </span>
                          <span className="font-medium">{totals.measurement.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Cargo Tab */}
              <TabsContent value="cargo" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-[#2E8B57]" />
                      Cargo Description
                    </CardTitle>
                    <CardDescription>
                      Detailed description of goods being shipped
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AnimatePresence>
                      {blData.cargoItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 border rounded-lg space-y-3 bg-slate-50 dark:bg-slate-800/50"
                        >
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">Item {index + 1}</Badge>
                            {blData.cargoItems.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCargoItem(item.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Marks & Numbers</Label>
                              <Input
                                value={item.marksNumbers}
                                onChange={(e) => updateCargoItem(item.id, 'marksNumbers', e.target.value)}
                                placeholder="Shipping marks"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">No. of Packages</Label>
                              <Input
                                type="number"
                                value={item.numberOfPackages}
                                onChange={(e) => updateCargoItem(item.id, 'numberOfPackages', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Package Type</Label>
                              <Select
                                value={item.packageType}
                                onValueChange={(v) => updateCargoItem(item.id, 'packageType', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {packageTypes.map((pt) => (
                                    <SelectItem key={pt.value} value={pt.value}>
                                      {pt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 md:col-span-1">
                              <Label className="text-xs">Gross Weight (kg)</Label>
                              <Input
                                type="number"
                                value={item.grossWeight}
                                onChange={(e) => updateCargoItem(item.id, 'grossWeight', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Net Weight (kg)</Label>
                              <Input
                                type="number"
                                value={item.netWeight}
                                onChange={(e) => updateCargoItem(item.id, 'netWeight', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Measurement (CBM)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.measurement}
                                onChange={(e) => updateCargoItem(item.id, 'measurement', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-xs">Description of Goods</Label>
                              <Input
                                value={item.description}
                                onChange={(e) => updateCargoItem(item.id, 'description', e.target.value)}
                                placeholder="Cargo description"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <Button variant="outline" onClick={addCargoItem} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cargo Line
                    </Button>

                    {/* Cargo Totals */}
                    <div className="p-4 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 dark:from-[#0F4C81]/20 dark:to-[#2E8B57]/20 rounded-lg">
                      <div className="grid grid-cols-4 gap-4 text-center text-sm">
                        <div>
                          <p className="text-slate-500">Total Packages</p>
                          <p className="font-bold text-lg text-[#0F4C81]">{totals.packages}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Gross Weight</p>
                          <p className="font-bold text-lg text-[#2E8B57]">{totals.grossWeight.toLocaleString()} kg</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Net Weight</p>
                          <p className="font-bold text-lg text-[#0F4C81]">{totals.netWeight.toLocaleString()} kg</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Total CBM</p>
                          <p className="font-bold text-lg text-[#2E8B57]">{totals.measurement.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Terms Tab */}
              <TabsContent value="terms" className="space-y-4">
                {/* Freight Terms */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-[#0F4C81]" />
                      Freight Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label>Freight Payment Terms *</Label>
                      <RadioGroup
                        value={blData.freightTerms}
                        onValueChange={(v) => updateField('freightTerms', v as BillOfLadingData['freightTerms'])}
                        className="grid grid-cols-3 gap-4"
                      >
                        {freightTermsOptions.map((term) => (
                          <div
                            key={term.value}
                            className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                              blData.freightTerms === term.value
                                ? 'border-[#0F4C81] bg-[#0F4C81]/5'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => updateField('freightTerms', term.value as BillOfLadingData['freightTerms'])}
                          >
                            <RadioGroupItem value={term.value} id={term.value} />
                            <Label htmlFor={term.value} className="cursor-pointer text-sm font-medium">
                              {term.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Freight Payable At</Label>
                        <Input
                          value={blData.freightPayableAt}
                          onChange={(e) => updateField('freightPayableAt', e.target.value)}
                          placeholder="e.g., Destination Port"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={blData.freightCurrency} onValueChange={(v) => updateField('freightCurrency', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Freight Amount (Optional)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          {selectedCurrency?.symbol}
                        </span>
                        <Input
                          type="number"
                          value={blData.freightAmount}
                          onChange={(e) => updateField('freightAmount', e.target.value)}
                          className="pl-8"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Info */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Info className="h-5 w-5 text-[#2E8B57]" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Declared Value</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            {currencies.find(c => c.code === blData.declaredValueCurrency)?.symbol}
                          </span>
                          <Input
                            type="number"
                            value={blData.declaredValue}
                            onChange={(e) => updateField('declaredValue', e.target.value)}
                            className="pl-8"
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={blData.declaredValueCurrency} onValueChange={(v) => updateField('declaredValueCurrency', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Place of Issue</Label>
                        <Input
                          value={blData.placeOfIssue}
                          onChange={(e) => updateField('placeOfIssue', e.target.value)}
                          placeholder="e.g., Shanghai"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Issue</Label>
                        <Input
                          type="date"
                          value={blData.dateOfIssue || blData.blDate}
                          onChange={(e) => updateField('dateOfIssue', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Special Instructions</Label>
                      <Textarea
                        value={blData.specialInstructions}
                        onChange={(e) => updateField('specialInstructions', e.target.value)}
                        rows={4}
                        placeholder="Any special handling or delivery instructions"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Warning Card */}
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        <p className="font-semibold mb-2">Important Notes</p>
                        <ul className="space-y-1">
                          <li>• Always verify B/L details match the booking confirmation</li>
                          <li>• Check container and seal numbers against the physical container</li>
                          <li>• Ensure weight declarations match the VGM submission</li>
                          <li>• Original B/Ls must be surrendered at destination for cargo release</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Preview */}
          {showPreview && (
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between sticky top-4 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 rounded-lg">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Live Preview
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="bg-[#0F4C81] text-white hover:bg-[#0F4C81]/90">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>

              {/* Document Preview */}
              <Card className="bg-white dark:bg-card overflow-hidden shadow-xl document-content-only" ref={printRef}>
                <ScrollArea className="max-h-[calc(100vh-200px)] print:max-h-none">
                  <div className="p-6 text-xs" id="bl-preview">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 border-b-2 border-[#0F4C81] pb-4">
                      <div>
                        <h1 className="text-xl font-bold text-[#0F4C81]">BILL OF LADING</h1>
                        <div className="text-[10px] text-slate-500 mt-1">For Ocean Shipment</div>
                      </div>
                      <div className="text-right">
                        <Badge style={{ backgroundColor: selectedBlType?.color }}>
                          {selectedBlType?.label}
                        </Badge>
                        <div className="font-mono font-bold mt-2 text-sm">{blData.blNumber}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Date: {blData.blDate}
                          {blData.bookingNumber && <><br />Booking: {blData.bookingNumber}</>}
                        </div>
                      </div>
                    </div>

                    {/* Carrier Info */}
                    {blData.carrierName && (
                      <div className="mb-4 p-2 bg-[#0F4C81]/5 rounded text-[10px]">
                        <span className="text-slate-500">Carrier: </span>
                        <span className="font-medium">{blData.carrierName}</span>
                        {blData.carrierCode && <span className="ml-2 font-mono">({blData.carrierCode})</span>}
                      </div>
                    )}

                    {/* Parties Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border-l-2 border-[#0F4C81]">
                        <div className="text-[10px] font-semibold text-[#0F4C81] mb-1">SHIPPER</div>
                        <div className="font-medium text-[11px]">{blData.shipperName || 'Shipper Name'}</div>
                        <div className="text-[10px] text-slate-500 whitespace-pre-line mt-1">{blData.shipperAddress}</div>
                        {blData.shipperPhone && <div className="text-[9px] text-slate-400 mt-1">Tel: {blData.shipperPhone}</div>}
                        {blData.shipperEmail && <div className="text-[9px] text-slate-400"> Email: {blData.shipperEmail}</div>}
                        {blData.shipperRef && <div className="text-[9px] text-slate-400"> Ref: {blData.shipperRef}</div>}
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border-l-2 border-[#2E8B57]">
                        <div className="text-[10px] font-semibold text-[#2E8B57] mb-1">CONSIGNEE</div>
                        <div className="font-medium text-[11px]">{blData.consigneeName || 'Consignee Name'}</div>
                        <div className="text-[10px] text-slate-500 whitespace-pre-line mt-1">{blData.consigneeAddress}</div>
                        {blData.consigneePhone && <div className="text-[9px] text-slate-400 mt-1"> Tel: {blData.consigneePhone}</div>}
                        {blData.consigneeEmail && <div className="text-[9px] text-slate-400"> Email: {blData.consigneeEmail}</div>}
                        {blData.consigneeRef && <div className="text-[9px] text-slate-400"> Ref: {blData.consigneeRef}</div>}
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border-l-2 border-slate-400">
                        <div className="text-[10px] font-semibold text-slate-600 mb-1">NOTIFY PARTY</div>
                        <div className="font-medium text-[11px]">{blData.notifyName || 'Notify Party'}</div>
                        <div className="text-[10px] text-slate-500 whitespace-pre-line mt-1">{blData.notifyAddress}</div>
                        {blData.notifyPhone && <div className="text-[9px] text-slate-400 mt-1"> Tel: {blData.notifyPhone}</div>}
                        {blData.notifyEmail && <div className="text-[9px] text-slate-400"> Email: {blData.notifyEmail}</div>}
                      </div>
                    </div>

                    {/* Vessel & Ports */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-[#0F4C81]/5 rounded">
                        <div className="text-[10px] font-semibold text-[#0F4C81] mb-2">VESSEL & VOYAGE</div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div>
                            <span className="text-slate-500">Vessel: </span>
                            <span className="font-medium">{blData.vesselName || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Voyage: </span>
                            <span className="font-medium">{blData.voyageNumber || '—'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-[#2E8B57]/5 rounded">
                        <div className="text-[10px] font-semibold text-[#2E8B57] mb-2">PORTS</div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div>
                            <span className="text-slate-500">POL: </span>
                            <span className="font-medium">{blData.portOfLoading || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">POD: </span>
                            <span className="font-medium">{blData.portOfDischarge || '—'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Places */}
                    {(blData.placeOfReceipt || blData.placeOfDelivery) && (
                      <div className="grid grid-cols-2 gap-2 mb-4 text-[10px]">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                          <span className="text-slate-500">Place of Receipt: </span>
                          <span className="font-medium">{blData.placeOfReceipt || '—'}</span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                          <span className="text-slate-500">Place of Delivery: </span>
                          <span className="font-medium">{blData.placeOfDelivery || '—'}</span>
                        </div>
                      </div>
                    )}

                    {/* Container Info */}
                    <div className="mb-4">
                      <div className="text-[10px] font-semibold text-[#0F4C81] mb-2">CONTAINER(S)</div>
                      <div className="space-y-1">
                        {blData.containers.map((c, idx) => (
                          <div key={c.id} className="p-2 bg-[#0F4C81]/5 rounded text-[10px] flex justify-between">
                            <div>
                              <span className="font-mono font-medium">{c.containerNumber || `Container ${idx + 1}`}</span>
                              <span className="ml-2 text-slate-500">{c.containerType}</span>
                            </div>
                            <div>
                              {c.sealNumber && <span className="font-mono">Seal: {c.sealNumber}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cargo Table */}
                    <div className="mb-4">
                      <div className="text-[10px] font-semibold text-[#2E8B57] mb-2">CARGO DESCRIPTION</div>
                      <table className="w-full text-[10px]">
                        <thead>
                          <tr className="border-b border-t bg-slate-50 dark:bg-slate-800/50">
                            <th className="text-left py-2 px-2 font-semibold">Marks & Numbers</th>
                            <th className="text-center py-2 px-2 font-semibold w-14">Pkgs</th>
                            <th className="text-left py-2 px-2 font-semibold">Description</th>
                            <th className="text-right py-2 px-2 font-semibold w-16">Gross (kg)</th>
                            <th className="text-right py-2 px-2 font-semibold w-14">CBM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blData.cargoItems.map((item, idx) => (
                            <tr key={item.id} className="border-b">
                              <td className="py-2 px-2">{item.marksNumbers || '—'}</td>
                              <td className="text-center py-2 px-2">{item.numberOfPackages || '—'} {item.packageType}</td>
                              <td className="py-2 px-2">{item.description || `Cargo ${idx + 1}`}</td>
                              <td className="text-right py-2 px-2">{item.grossWeight || '—'}</td>
                              <td className="text-right py-2 px-2">{item.measurement || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 font-medium bg-slate-50 dark:bg-slate-800/50">
                            <td className="py-2 px-2">TOTAL</td>
                            <td className="text-center py-2 px-2">{totals.packages}</td>
                            <td></td>
                            <td className="text-right py-2 px-2">{totals.grossWeight.toLocaleString()}</td>
                            <td className="text-right py-2 px-2">{totals.measurement.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Freight & Terms */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-[#0F4C81]/5 rounded">
                        <div className="text-[10px] font-semibold mb-1">FREIGHT TERMS</div>
                        <div className="font-medium text-[#0F4C81]">
                          {blData.freightTerms === 'prepaid' ? 'FREIGHT PREPAID' : 
                           blData.freightTerms === 'collect' ? 'FREIGHT COLLECT' : 'PART PREPAID / PART COLLECT'}
                        </div>
                        {blData.freightPayableAt && (
                          <div className="text-[9px] text-slate-500 mt-1">Payable at: {blData.freightPayableAt}</div>
                        )}
                      </div>
                      <div className="p-3 bg-[#2E8B57]/5 rounded">
                        <div className="text-[10px] font-semibold mb-1">NUMBER OF ORIGINALS</div>
                        <div className="font-medium text-[#2E8B57]">{blData.numberOfOriginals}</div>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {blData.specialInstructions && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded mb-4 text-[10px]">
                        <div className="font-semibold mb-1">SPECIAL INSTRUCTIONS</div>
                        <div className="text-slate-600">{blData.specialInstructions}</div>
                      </div>
                    )}

                    {/* Signature Area */}
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t">
                      <div>
                        <div className="text-[10px] text-slate-500 mb-8">Place and Date of Issue</div>
                        <div className="border-t border-black pt-1 text-center text-[10px]">
                          {blData.placeOfIssue || blData.portOfLoading}, {blData.dateOfIssue || blData.blDate}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 mb-8">Signed for the Carrier</div>
                        <div className="border-t border-black pt-1 text-center text-[10px]">
                          {blData.carrierName || 'Carrier Name'}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t text-center text-[10px] text-slate-500">
                      <p>This Bill of Lading is subject to the terms and conditions on the reverse side.</p>
                    </div>
                  </div>
                </ScrollArea>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
