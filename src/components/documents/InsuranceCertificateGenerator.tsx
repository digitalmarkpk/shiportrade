'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Printer, Eye, Building, Calendar, DollarSign, Package,
  Shield, Ship, Info, AlertTriangle, Download, Share2, CheckCircle,
  ChevronRight, HelpCircle, Clock, Anchor, Wallet
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';
import { currencies } from '@/lib/constants/currencies';

interface InsuranceData {
  // Certificate Details
  certificateNo: string;
  issueDate: string;
  policyNo: string;

  // Assured Party
  assuredName: string;
  assuredAddress: string;
  assuredCountry: string;
  assuredContact: string;
  assuredPhone: string;
  assuredEmail: string;

  // Insurance Company
  insurerName: string;
  insurerAddress: string;
  insurerContact: string;
  insurerPhone: string;
  insurerEmail: string;

  // Voyage Details
  vesselName: string;
  voyageNo: string;
  blNo: string;
  portOfLoading: string;
  portOfDischarge: string;
  sailingDate: string;
  estimatedArrival: string;
  conveyance: string;

  // Cargo Details
  cargoDescription: string;
  hsCode: string;
  packing: string;
  quantity: string;
  grossWeight: string;
  netWeight: string;
  shippingMarks: string;
  containerNo: string;

  // Coverage Details
  invoiceValue: string;
  insuredAmount: string;
  currency: string;
  insurancePercentage: string;
  incoterms: string;
  coverageType: 'ICC-A' | 'ICC-B' | 'ICC-C';
  additionalCoverage: {
    warRisk: boolean;
    strikes: boolean;
    srcc: boolean;
    warehouseToWarehouse: boolean;
    fpw: boolean;
    theftPilferage: boolean;
    breakage: boolean;
    rainWater: boolean;
  };
  deductible: string;
  premiumRate: string;

  // Claims
  claimsAgent: string;
  claimsContact: string;
  surveyAgent: string;

  // Additional
  specialConditions: string;
  notes: string;
}

const coverageTypes = [
  {
    value: 'ICC-A',
    label: 'ICC (A) - All Risks',
    description: 'Comprehensive coverage for all risks of loss or damage except excluded perils',
    color: '#0F4C81',
    rate: 0.15,
    features: [
      'All risks coverage',
      'Fire, explosion',
      'Stranding, sinking',
      'Collision, contact',
      'General average sacrifice',
      'Jettison, washing overboard',
      'Entry of sea water',
      'Total loss of package',
      'Earthquake, volcanic eruption',
      'Lightning'
    ]
  },
  {
    value: 'ICC-B',
    label: 'ICC (B) - Named Perils',
    description: 'Coverage for specified perils including major casualties',
    color: '#2E8B57',
    rate: 0.10,
    features: [
      'Fire, explosion',
      'Stranding, sinking',
      'Collision, contact',
      'General average sacrifice',
      'Jettison, washing overboard',
      'Entry of sea water',
      'Total loss of package',
      'Earthquake, volcanic eruption',
      'Lightning',
      'Discharge at port of distress'
    ]
  },
  {
    value: 'ICC-C',
    label: 'ICC (C) - Major Casualties',
    description: 'Basic coverage for major casualties only',
    color: '#F59E0B',
    rate: 0.05,
    features: [
      'Fire, explosion',
      'Stranding, sinking',
      'Collision, contact',
      'General average sacrifice',
      'Jettison'
    ]
  }
];

// Incoterms list for insurance
const incotermsList = [
  { code: 'CIF', description: 'Cost, Insurance and Freight', insuranceRequired: true },
  { code: 'CIP', description: 'Carriage and Insurance Paid To', insuranceRequired: true },
  { code: 'CFR', description: 'Cost and Freight', insuranceRequired: false },
  { code: 'FOB', description: 'Free On Board', insuranceRequired: false },
  { code: 'FCA', description: 'Free Carrier', insuranceRequired: false },
  { code: 'EXW', description: 'Ex Works', insuranceRequired: false },
  { code: 'DDP', description: 'Delivered Duty Paid', insuranceRequired: false },
];

export default function InsuranceCertificateGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showPreview, setShowPreview] = useState(true);

  const [insuranceData, setInsuranceData] = useState<InsuranceData>({
    certificateNo: `INS-${Date.now().toString().slice(-8)}`,
    issueDate: new Date().toISOString().split('T')[0],
    policyNo: 'OP/MAR/2024/001',

    assuredName: '',
    assuredAddress: '',
    assuredCountry: '',
    assuredContact: '',
    assuredPhone: '',
    assuredEmail: '',

    insurerName: '',
    insurerAddress: '',
    insurerContact: '',
    insurerPhone: '',
    insurerEmail: '',

    vesselName: '',
    voyageNo: '',
    blNo: '',
    portOfLoading: '',
    portOfDischarge: '',
    sailingDate: '',
    estimatedArrival: '',
    conveyance: 'By Sea',

    cargoDescription: '',
    hsCode: '',
    packing: '',
    quantity: '',
    grossWeight: '',
    netWeight: '',
    shippingMarks: '',
    containerNo: '',

    invoiceValue: '',
    insuredAmount: '',
    currency: 'USD',
    insurancePercentage: '110',
    incoterms: 'CIF',
    coverageType: 'ICC-A',
    additionalCoverage: {
      warRisk: true,
      strikes: true,
      srcc: false,
      warehouseToWarehouse: true,
      fpw: false,
      theftPilferage: false,
      breakage: false,
      rainWater: false,
    },
    deductible: '0',
    premiumRate: '0.15',

    claimsAgent: '',
    claimsContact: '',
    surveyAgent: '',

    specialConditions: '',
    notes: '',
  });

  const updateField = <K extends keyof InsuranceData>(field: K, value: InsuranceData[K]) => {
    setInsuranceData(prev => ({ ...prev, [field]: value }));
  };

  const updateAdditionalCoverage = (field: keyof InsuranceData['additionalCoverage'], value: boolean) => {
    setInsuranceData(prev => ({
      ...prev,
      additionalCoverage: {
        ...prev.additionalCoverage,
        [field]: value,
      },
    }));
  };

  // Calculate premium
  const calculations = useMemo(() => {
    const invoiceVal = parseFloat(insuranceData.invoiceValue) || 0;
    const insuredVal = parseFloat(insuranceData.insuredAmount) || 0;
    const percentage = parseFloat(insuranceData.insurancePercentage) || 110;
    const rate = parseFloat(insuranceData.premiumRate) || 0.15;

    const calculatedInsuredAmount = invoiceVal > 0 ? invoiceVal * (percentage / 100) : 0;
    const premium = insuredVal > 0 ? insuredVal * (rate / 100) : calculatedInsuredAmount * (rate / 100);

    return {
      calculatedInsuredAmount,
      premium,
      effectiveRate: rate
    };
  }, [insuranceData.invoiceValue, insuranceData.insuredAmount, insuranceData.insurancePercentage, insuranceData.premiumRate]);

  const selectedCurrency = currencies.find(c => c.code === insuranceData.currency);
  const selectedCoverage = coverageTypes.find(c => c.value === insuranceData.coverageType);
  const selectedIncoterm = incotermsList.find(i => i.code === insuranceData.incoterms);

  const handlePrint = () => {
    document.body.classList.add('printing-document');
    const originalTitle = document.title;
    document.title = 'Document';
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-document');
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <TooltipProvider>
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
                Insurance Certificate Generator
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Professional marine cargo insurance certificate with ICC (A/B/C) coverage for international trade
            </p>
          </motion.div>

          {/* Main Layout */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Form */}
            <div className={`lg:col-span-${showPreview ? '3' : '5'} space-y-4`}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details" className="text-xs md:text-sm">
                    <Shield className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Certificate</span> Details
                  </TabsTrigger>
                  <TabsTrigger value="assured" className="text-xs md:text-sm">
                    <Building className="h-4 w-4 mr-1 md:mr-2" />
                    Assured
                  </TabsTrigger>
                  <TabsTrigger value="voyage" className="text-xs md:text-sm">
                    <Ship className="h-4 w-4 mr-1 md:mr-2" />
                    Voyage
                  </TabsTrigger>
                  <TabsTrigger value="coverage" className="text-xs md:text-sm">
                    <DollarSign className="h-4 w-4 mr-1 md:mr-2" />
                    Coverage
                  </TabsTrigger>
                </TabsList>

                {/* Certificate Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-[#0F4C81]" />
                        Certificate Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Certificate No. *</Label>
                          <Input
                            value={insuranceData.certificateNo}
                            onChange={(e) => updateField('certificateNo', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Issue Date *</Label>
                          <Input
                            type="date"
                            value={insuranceData.issueDate}
                            onChange={(e) => updateField('issueDate', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Policy Number *</Label>
                        <Input
                          value={insuranceData.policyNo}
                          onChange={(e) => updateField('policyNo', e.target.value)}
                          placeholder="e.g., OP/MAR/2024/001"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Insurer */}
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-[#2E8B57]" />
                        Insurance Company
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Insurer Name *</Label>
                        <Input
                          value={insuranceData.insurerName}
                          onChange={(e) => updateField('insurerName', e.target.value)}
                          placeholder="Insurance Company Ltd."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Textarea
                          value={insuranceData.insurerAddress}
                          onChange={(e) => updateField('insurerAddress', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact</Label>
                        <Input
                          value={insuranceData.insurerContact}
                          onChange={(e) => updateField('insurerContact', e.target.value)}
                          placeholder="Contact person"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={insuranceData.insurerPhone}
                            onChange={(e) => updateField('insurerPhone', e.target.value)}
                            placeholder="Phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={insuranceData.insurerEmail}
                            onChange={(e) => updateField('insurerEmail', e.target.value)}
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cargo Details */}
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Package className="h-5 w-5 text-[#0F4C81]" />
                        Cargo Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Description of Goods *</Label>
                        <Textarea
                          value={insuranceData.cargoDescription}
                          onChange={(e) => updateField('cargoDescription', e.target.value)}
                          rows={3}
                          placeholder="Detailed description of cargo..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>HS Code</Label>
                          <Input
                            value={insuranceData.hsCode}
                            onChange={(e) => updateField('hsCode', e.target.value)}
                            placeholder="6-10 digit code"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Packing</Label>
                          <Input
                            value={insuranceData.packing}
                            onChange={(e) => updateField('packing', e.target.value)}
                            placeholder="Cartons, Pallets..."
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            value={insuranceData.quantity}
                            onChange={(e) => updateField('quantity', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Container No.</Label>
                          <Input
                            value={insuranceData.containerNo}
                            onChange={(e) => updateField('containerNo', e.target.value)}
                            placeholder="e.g., MSCU1234567"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Gross Weight (kg)</Label>
                          <Input
                            value={insuranceData.grossWeight}
                            onChange={(e) => updateField('grossWeight', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Net Weight (kg)</Label>
                          <Input
                            value={insuranceData.netWeight}
                            onChange={(e) => updateField('netWeight', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Shipping Marks</Label>
                        <Textarea
                          value={insuranceData.shippingMarks}
                          onChange={(e) => updateField('shippingMarks', e.target.value)}
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Assured Party Tab */}
                <TabsContent value="assured" className="space-y-4">
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building className="h-5 w-5 text-[#2E8B57]" />
                        Assured Party
                      </CardTitle>
                      <CardDescription>
                        The party whose interest is insured under this policy
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Assured Name *</Label>
                        <Input
                          value={insuranceData.assuredName}
                          onChange={(e) => updateField('assuredName', e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address *</Label>
                        <Textarea
                          value={insuranceData.assuredAddress}
                          onChange={(e) => updateField('assuredAddress', e.target.value)}
                          rows={2}
                          placeholder="Full address"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Country</Label>
                          <Input
                            value={insuranceData.assuredCountry}
                            onChange={(e) => updateField('assuredCountry', e.target.value)}
                            placeholder="e.g., China"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact Person</Label>
                          <Input
                            value={insuranceData.assuredContact}
                            onChange={(e) => updateField('assuredContact', e.target.value)}
                            placeholder="Contact name"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={insuranceData.assuredPhone}
                            onChange={(e) => updateField('assuredPhone', e.target.value)}
                            placeholder="Phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={insuranceData.assuredEmail}
                            onChange={(e) => updateField('assuredEmail', e.target.value)}
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Claims & Survey */}
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                        Claims & Survey Agent
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Claims Agent</Label>
                          <Input
                            value={insuranceData.claimsAgent}
                            onChange={(e) => updateField('claimsAgent', e.target.value)}
                            placeholder="Claims settling agent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Claims Contact</Label>
                          <Input
                            value={insuranceData.claimsContact}
                            onChange={(e) => updateField('claimsContact', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Survey Agent</Label>
                        <Input
                          value={insuranceData.surveyAgent}
                          onChange={(e) => updateField('surveyAgent', e.target.value)}
                          placeholder="Survey agent at destination"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Voyage Tab */}
                <TabsContent value="voyage" className="space-y-4">
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Ship className="h-5 w-5 text-[#0F4C81]" />
                        Voyage Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Conveyance</Label>
                        <Select value={insuranceData.conveyance} onValueChange={(v) => updateField('conveyance', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="By Sea">By Sea</SelectItem>
                            <SelectItem value="By Air">By Air</SelectItem>
                            <SelectItem value="By Rail">By Rail</SelectItem>
                            <SelectItem value="By Road">By Road</SelectItem>
                            <SelectItem value="Multimodal">Multimodal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Vessel Name</Label>
                          <Input
                            value={insuranceData.vesselName}
                            onChange={(e) => updateField('vesselName', e.target.value)}
                            placeholder="Vessel / Flight No."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Voyage No.</Label>
                          <Input
                            value={insuranceData.voyageNo}
                            onChange={(e) => updateField('voyageNo', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Bill of Lading No.</Label>
                        <Input
                          value={insuranceData.blNo}
                          onChange={(e) => updateField('blNo', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Port of Loading *</Label>
                          <Input
                            value={insuranceData.portOfLoading}
                            onChange={(e) => updateField('portOfLoading', e.target.value)}
                            placeholder="e.g., Shanghai, China"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Port of Discharge *</Label>
                          <Input
                            value={insuranceData.portOfDischarge}
                            onChange={(e) => updateField('portOfDischarge', e.target.value)}
                            placeholder="e.g., Los Angeles, USA"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Sailing Date</Label>
                          <Input
                            type="date"
                            value={insuranceData.sailingDate}
                            onChange={(e) => updateField('sailingDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Est. Arrival</Label>
                          <Input
                            type="date"
                            value={insuranceData.estimatedArrival}
                            onChange={(e) => updateField('estimatedArrival', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transit Info Card */}
                  <Card className="border-l-4 border-l-[#2E8B57] bg-emerald-50/50 dark:bg-emerald-950/20">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Anchor className="h-5 w-5 text-[#2E8B57] mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-medium text-[#2E8B57]">Transit Coverage</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Coverage attaches from the time the goods leave the warehouse or place of storage
                            at the place named in the policy for the commencement of the transit.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Coverage Tab */}
                <TabsContent value="coverage" className="space-y-4">
                  {/* Value & Currency */}
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5 text-[#2E8B57]" />
                        Cargo Value & Premium
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Invoice Value *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                              {selectedCurrency?.symbol}
                            </span>
                            <Input
                              type="number"
                              value={insuranceData.invoiceValue}
                              onChange={(e) => updateField('invoiceValue', e.target.value)}
                              className="pl-8"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select value={insuranceData.currency} onValueChange={(v) => updateField('currency', v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                  {c.code} - {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>
                            <span className="flex items-center gap-1">
                              % of Invoice
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-3 w-3 text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">Standard is 110% to cover profit margin. CIF terms require minimum 110%.</p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
                          </Label>
                          <Input
                            type="number"
                            value={insuranceData.insurancePercentage}
                            onChange={(e) => updateField('insurancePercentage', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Insured Amount *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                              {selectedCurrency?.symbol}
                            </span>
                            <Input
                              type="number"
                              value={insuranceData.insuredAmount || calculations.calculatedInsuredAmount.toFixed(2)}
                              onChange={(e) => updateField('insuredAmount', e.target.value)}
                              className="pl-8"
                            />
                          </div>
                          {insuranceData.invoiceValue && (
                            <p className="text-xs text-slate-500">
                              Calculated: {selectedCurrency?.symbol}{calculations.calculatedInsuredAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Premium Rate (%)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={insuranceData.premiumRate}
                            onChange={(e) => updateField('premiumRate', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Premium Display */}
                      <div className="bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 dark:from-[#0F4C81]/20 dark:to-[#2E8B57]/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Estimated Premium</p>
                            <p className="text-2xl font-bold text-[#0F4C81]">
                              {selectedCurrency?.symbol}{calculations.premium.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Effective Rate</p>
                            <p className="text-lg font-semibold text-[#2E8B57]">
                              {calculations.effectiveRate}% ({calculations.effectiveRate * 10} per mille)
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Coverage Type */}
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-[#0F4C81]" />
                        Coverage Type (ICC Clauses)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {coverageTypes.map((ct) => (
                          <button
                            key={ct.value}
                            onClick={() => {
                              updateField('coverageType', ct.value as InsuranceData['coverageType']);
                              updateField('premiumRate', ct.rate.toString());
                            }}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              insuranceData.coverageType === ct.value
                                ? 'border-[#0F4C81] bg-[#0F4C81]/5'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <Badge
                              style={{ backgroundColor: ct.color }}
                              className="mb-2"
                            >
                              {ct.value}
                            </Badge>
                            <p className="text-sm font-medium">{ct.label.split(' - ')[1]}</p>
                            <p className="text-xs text-slate-500 mt-1">{ct.rate}% rate</p>
                          </button>
                        ))}
                      </div>

                      {/* Selected Coverage Details */}
                      {selectedCoverage && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <h4 className="font-medium mb-2 text-[#0F4C81]">{selectedCoverage.label}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            {selectedCoverage.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {selectedCoverage.features.map((f) => (
                              <Badge key={f} variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1 text-[#2E8B57]" />
                                {f}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Incoterms</Label>
                          <Select value={insuranceData.incoterms} onValueChange={(v) => updateField('incoterms', v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {incotermsList.map((i) => (
                                <SelectItem key={i.code} value={i.code}>
                                  {i.code} - {i.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Deductible</Label>
                          <Input
                            value={insuranceData.deductible}
                            onChange={(e) => updateField('deductible', e.target.value)}
                            placeholder="0 or amount"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Coverage */}
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Additional Coverage Clauses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { key: 'warRisk', label: 'War Risk', desc: 'Institute War Clauses' },
                          { key: 'strikes', label: 'Strikes, Riots', desc: 'Institute Strikes Clauses' },
                          { key: 'srcc', label: 'SRCC', desc: 'Strikes, Riots, Civil Commotion' },
                          { key: 'warehouseToWarehouse', label: 'W/W Clause', desc: 'Warehouse to Warehouse' },
                          { key: 'fpw', label: 'FPW', desc: 'Free of Particular Average' },
                          { key: 'theftPilferage', label: 'Theft & Pilferage', desc: 'TPND Coverage' },
                          { key: 'breakage', label: 'Breakage', desc: 'Breakage Clause' },
                          { key: 'rainWater', label: 'Rain Water', desc: 'Rain Water Damage' },
                        ].map((item) => (
                          <Tooltip key={item.key}>
                            <TooltipTrigger asChild>
                              <div
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  insuranceData.additionalCoverage[item.key as keyof typeof insuranceData.additionalCoverage]
                                    ? 'border-[#2E8B57] bg-[#2E8B57]/10'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                }`}
                                onClick={() => updateAdditionalCoverage(
                                  item.key as keyof typeof insuranceData.additionalCoverage,
                                  !insuranceData.additionalCoverage[item.key as keyof typeof insuranceData.additionalCoverage]
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={insuranceData.additionalCoverage[item.key as keyof typeof insuranceData.additionalCoverage]}
                                    onCheckedChange={(checked) => updateAdditionalCoverage(
                                      item.key as keyof typeof insuranceData.additionalCoverage,
                                      !!checked
                                    )}
                                  />
                                  <span className="text-sm font-medium">{item.label}</span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.desc}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Special Conditions */}
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Special Conditions & Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Special Conditions</Label>
                        <Textarea
                          value={insuranceData.specialConditions}
                          onChange={(e) => updateField('specialConditions', e.target.value)}
                          rows={2}
                          placeholder="Any special conditions or warranties..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          value={insuranceData.notes}
                          onChange={(e) => updateField('notes', e.target.value)}
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 print:hidden">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="lg:hidden"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
                <div className="flex gap-2 ml-auto">
                  <Button onClick={() => setActiveTab('details')} variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button onClick={handlePrint} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Live Preview */}
            {showPreview && (
              <div className="lg:col-span-2 hidden lg:block">
                <div className="sticky top-4">
                  <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] p-3 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">Live Preview</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreview(false)}
                        className="text-white hover:bg-white/20"
                      >
                        Hide
                      </Button>
                    </div>
                    <ScrollArea className="h-[calc(100vh-200px)]">
                      <div ref={printRef} className="document-content-only p-6">
                        {/* Certificate Header */}
                        <div className="text-center border-b-2 border-[#0F4C81] pb-3 mb-4">
                          <h1 className="text-xl font-bold text-[#0F4C81]">MARINE CARGO INSURANCE CERTIFICATE</h1>
                          <p className="text-xs text-slate-500 mt-1">海运货物保险凭证</p>
                        </div>

                        {/* Certificate Info */}
                        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                          <div>
                            <p className="text-slate-400">Certificate No.</p>
                            <p className="font-semibold">{insuranceData.certificateNo}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Policy No.</p>
                            <p className="font-semibold">{insuranceData.policyNo}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Issue Date</p>
                            <p className="font-semibold">{insuranceData.issueDate}</p>
                          </div>
                        </div>

                        {/* Insurer */}
                        <div className="mb-3 p-2 border border-slate-200 dark:border-slate-700 rounded text-xs">
                          <h3 className="font-semibold text-[#2E8B57] mb-1">INSURER</h3>
                          <p className="font-bold">{insuranceData.insurerName || 'Insurance Company'}</p>
                          <p className="text-slate-500">{insuranceData.insurerAddress}</p>
                          {insuranceData.insurerContact && <p className="text-slate-500">Contact: {insuranceData.insurerContact}</p>}
                          {insuranceData.insurerPhone && <p className="text-slate-500">Tel: {insuranceData.insurerPhone}</p>}
                          {insuranceData.insurerEmail && <p className="text-slate-500">Email: {insuranceData.insurerEmail}</p>}
                        </div>

                        {/* Assured */}
                        <div className="mb-3 p-2 border border-slate-200 dark:border-slate-700 rounded text-xs">
                          <h3 className="font-semibold text-[#0F4C81] mb-1">ASSURED</h3>
                          <p className="font-bold">{insuranceData.assuredName || 'Assured Name'}</p>
                          <p className="text-slate-500 whitespace-pre-line">{insuranceData.assuredAddress}</p>
                          <p className="text-slate-500">{insuranceData.assuredCountry}</p>
                          {insuranceData.assuredContact && <p className="text-slate-500">Contact: {insuranceData.assuredContact}</p>}
                          {insuranceData.assuredPhone && <p className="text-slate-500">Tel: {insuranceData.assuredPhone}</p>}
                          {insuranceData.assuredEmail && <p className="text-slate-500">Email: {insuranceData.assuredEmail}</p>}
                        </div>

                        {/* Voyage */}
                        <div className="mb-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded text-xs">
                          <h3 className="font-semibold text-[#0F4C81] mb-1">VOYAGE</h3>
                          <div className="grid grid-cols-2 gap-1">
                            <div><span className="text-slate-400">Vessel:</span> {insuranceData.vesselName || 'TBD'}</div>
                            <div><span className="text-slate-400">Voyage:</span> {insuranceData.voyageNo || 'N/A'}</div>
                            <div><span className="text-slate-400">From:</span> {insuranceData.portOfLoading || 'TBD'}</div>
                            <div><span className="text-slate-400">To:</span> {insuranceData.portOfDischarge || 'TBD'}</div>
                            <div><span className="text-slate-400">B/L:</span> {insuranceData.blNo || 'N/A'}</div>
                            <div><span className="text-slate-400">Sailing:</span> {insuranceData.sailingDate || 'TBD'}</div>
                          </div>
                        </div>

                        {/* Cargo */}
                        <div className="mb-3 p-2 border border-slate-200 dark:border-slate-700 rounded text-xs">
                          <h3 className="font-semibold text-[#0F4C81] mb-1">CARGO</h3>
                          <p className="whitespace-pre-line">{insuranceData.cargoDescription || 'Description of goods'}</p>
                          <div className="grid grid-cols-3 gap-1 mt-1 text-slate-500">
                            {insuranceData.hsCode && <div>HS: {insuranceData.hsCode}</div>}
                            {insuranceData.quantity && <div>Qty: {insuranceData.quantity}</div>}
                            {insuranceData.grossWeight && <div>G.Wt: {insuranceData.grossWeight}kg</div>}
                          </div>
                        </div>

                        {/* Coverage */}
                        <div className="mb-3 p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded text-xs">
                          <h3 className="font-semibold text-[#2E8B57] mb-1">COVERAGE</h3>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Sum Insured:</span>
                            <span className="font-bold text-[#0F4C81]">
                              {selectedCurrency?.symbol}{(parseFloat(insuranceData.insuredAmount) || calculations.calculatedInsuredAmount).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Coverage:</span>
                            <Badge style={{ backgroundColor: selectedCoverage?.color }} className="text-xs">
                              {selectedCoverage?.value}
                            </Badge>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Incoterms:</span>
                            <span>{insuranceData.incoterms} ({selectedIncoterm?.description})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Premium:</span>
                            <span className="font-medium text-[#2E8B57]">
                              {selectedCurrency?.symbol}{calculations.premium.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {insuranceData.additionalCoverage.warRisk && <Badge variant="outline" className="text-xs">War</Badge>}
                            {insuranceData.additionalCoverage.strikes && <Badge variant="outline" className="text-xs">Strikes</Badge>}
                            {insuranceData.additionalCoverage.srcc && <Badge variant="outline" className="text-xs">SRCC</Badge>}
                            {insuranceData.additionalCoverage.warehouseToWarehouse && <Badge variant="outline" className="text-xs">W/W</Badge>}
                          </div>
                        </div>

                        {/* Signatures */}
                        <div className="grid grid-cols-2 gap-4 mt-6 text-xs">
                          <div className="border-t border-slate-300 pt-1">
                            <p className="text-slate-400">Authorized Signatory</p>
                            <p className="text-slate-300 mt-4">Signature & Stamp</p>
                          </div>
                          <div className="border-t border-slate-300 pt-1">
                            <p className="text-slate-400">Date</p>
                            <p className="text-slate-300 mt-4">____________</p>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Print View (Full Size) */}
          <div className="hidden print:block">
            <div ref={printRef} className="document-content-only bg-white p-8">
              {/* Certificate Header */}
              <div className="text-center border-b-2 border-[#0F4C81] pb-4 mb-6">
                <h1 className="text-2xl font-bold text-[#0F4C81]">MARINE CARGO INSURANCE CERTIFICATE</h1>
                <p className="text-lg font-semibold text-slate-600 mt-1">海运货物保险凭证</p>
              </div>

              {/* Certificate Info */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-500">Certificate No.</p>
                  <p className="font-semibold">{insuranceData.certificateNo}</p>
                </div>
                <div>
                  <p className="text-slate-500">Policy No.</p>
                  <p className="font-semibold">{insuranceData.policyNo}</p>
                </div>
                <div>
                  <p className="text-slate-500">Issue Date</p>
                  <p className="font-semibold">{insuranceData.issueDate}</p>
                </div>
              </div>

              {/* Insurer */}
              <div className="mb-6 p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-[#2E8B57] mb-2">INSURER</h3>
                <p className="font-bold">{insuranceData.insurerName || 'Insurance Company'}</p>
                <p className="text-sm">{insuranceData.insurerAddress}</p>
                {insuranceData.insurerContact && <p className="text-sm">Contact: {insuranceData.insurerContact}</p>}
              </div>

              {/* Assured */}
              <div className="mb-6 p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-2">ASSURED</h3>
                <p className="font-bold">{insuranceData.assuredName || 'Assured Name'}</p>
                <p className="text-sm whitespace-pre-line">{insuranceData.assuredAddress}</p>
                <p className="text-sm">{insuranceData.assuredCountry}</p>
              </div>

              {/* Voyage */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-3">VOYAGE DETAILS</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500">Vessel:</span> {insuranceData.vesselName || 'TBD'}</div>
                  <div><span className="text-slate-500">Voyage No.:</span> {insuranceData.voyageNo || 'N/A'}</div>
                  <div><span className="text-slate-500">B/L No.:</span> {insuranceData.blNo || 'N/A'}</div>
                  <div><span className="text-slate-500">Sailing Date:</span> {insuranceData.sailingDate || 'TBD'}</div>
                  <div><span className="text-slate-500">From:</span> {insuranceData.portOfLoading || 'TBD'}</div>
                  <div><span className="text-slate-500">To:</span> {insuranceData.portOfDischarge || 'TBD'}</div>
                </div>
              </div>

              {/* Cargo */}
              <div className="mb-6 p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-2">DESCRIPTION OF GOODS</h3>
                <p className="text-sm whitespace-pre-line">{insuranceData.cargoDescription || 'N/A'}</p>
                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  {insuranceData.hsCode && <div><span className="text-slate-500">HS Code:</span> {insuranceData.hsCode}</div>}
                  {insuranceData.quantity && <div><span className="text-slate-500">Qty:</span> {insuranceData.quantity}</div>}
                  {insuranceData.grossWeight && <div><span className="text-slate-500">G.Wt:</span> {insuranceData.grossWeight}kg</div>}
                </div>
              </div>

              {/* Coverage */}
              <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
                <h3 className="font-semibold text-[#2E8B57] mb-3">INSURANCE COVERAGE</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-slate-500">Sum Insured:</span>
                    <span className="ml-2 font-bold text-lg text-[#0F4C81]">
                      {selectedCurrency?.symbol}{(parseFloat(insuranceData.insuredAmount) || calculations.calculatedInsuredAmount).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Percentage:</span>
                    <span className="ml-2 font-medium">{insuranceData.insurancePercentage}% of Invoice</span>
                  </div>
                </div>
                <div className="text-sm">
                  <p><strong>Coverage:</strong> {selectedCoverage?.label}</p>
                  <p className="text-slate-600">{selectedCoverage?.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {insuranceData.additionalCoverage.warRisk && <Badge variant="outline">War Risk</Badge>}
                  {insuranceData.additionalCoverage.strikes && <Badge variant="outline">Strikes, Riots</Badge>}
                  {insuranceData.additionalCoverage.srcc && <Badge variant="outline">SRCC</Badge>}
                  {insuranceData.additionalCoverage.warehouseToWarehouse && <Badge variant="outline">Warehouse to Warehouse</Badge>}
                </div>
              </div>

              {/* Claims */}
              <div className="mb-6 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500">Claims Agent:</p>
                    <p className="font-medium">{insuranceData.claimsAgent || 'As per policy'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Survey Agent:</p>
                    <p className="font-medium">{insuranceData.surveyAgent || 'As per policy'}</p>
                  </div>
                </div>
              </div>

              {/* Standard Clauses */}
              <div className="mb-6 text-xs text-slate-500">
                <p className="font-semibold mb-1">Standard Clauses:</p>
                <p>This insurance is subject to Institute Cargo Clauses ({insuranceData.coverageType.split('-')[1]}),
                   Institute War Clauses (Cargo), Institute Strikes Clauses (Cargo) where applicable.</p>
                <p className="mt-1">Claims payable at destination in the currency of the insurance.</p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="border-t border-slate-300 pt-2">
                  <p className="text-sm text-slate-500">Authorized Signatory</p>
                  <p className="text-sm text-slate-400 mt-8">Signature & Company Stamp</p>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="text-sm text-slate-400 mt-8">________________</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
