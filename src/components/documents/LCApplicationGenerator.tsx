'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Printer, Eye, Building, Globe, Calendar, DollarSign, Package,
  Shield, FileCheck, CreditCard, Download, RefreshCw, AlertTriangle,
  CheckCircle, Info, ChevronRight, Copy, Ship, Briefcase, Banknote
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
import { Switch } from '@/components/ui/switch';
import { currencies } from '@/lib/constants/currencies';

// LC Types Configuration
const lcTypes = [
  { value: 'irrevocable', label: 'Irrevocable LC', description: 'Cannot be cancelled without consent' },
  { value: 'confirmed', label: 'Confirmed LC', description: 'Adding bank confirmation for security' },
  { value: 'transferable', label: 'Transferable LC', description: 'Can be transferred to second beneficiary' },
  { value: 'revolving', label: 'Revolving LC', description: 'Auto-reinstates after each drawing' },
  { value: 'standby', label: 'Standby LC', description: 'Payment security guarantee' },
  { value: 'back-to-back', label: 'Back-to-Back LC', description: 'Two LCs linked for intermediaries' },
];

// Payment Terms
const paymentTerms = [
  { value: 'sight', label: 'Sight Payment', description: 'Payment on presentation' },
  { value: 'deferred', label: 'Deferred Payment', description: 'Payment at a future date' },
  { value: 'acceptance', label: 'Acceptance', description: 'Payment upon acceptance of draft' },
  { value: 'negotiation', label: 'Negotiation', description: 'Purchase of documents by bank' },
];

// Documents Required Configuration
const documentTypes = [
  { id: 'commercialInvoice', label: 'Commercial Invoice', copies: 3, required: true },
  { id: 'billOfLading', label: 'Bill of Lading (Full Set)', copies: 3, required: true },
  { id: 'packingList', label: 'Packing List', copies: 3, required: true },
  { id: 'certificateOfOrigin', label: 'Certificate of Origin', copies: 1, required: false },
  { id: 'insurancePolicy', label: 'Insurance Policy/Certificate', copies: 2, required: false },
  { id: 'inspectionCertificate', label: 'Inspection Certificate', copies: 1, required: false },
  { id: 'weightCertificate', label: 'Weight Certificate', copies: 1, required: false },
  { id: 'qualityCertificate', label: 'Quality Certificate', copies: 1, required: false },
  { id: 'phytosanitaryCertificate', label: 'Phytosanitary Certificate', copies: 1, required: false },
  { id: 'fumigationCertificate', label: 'Fumigation Certificate', copies: 1, required: false },
  { id: 'healthCertificate', label: 'Health/Sanitary Certificate', copies: 1, required: false },
  { id: 'dangerousGoodsDeclaration', label: 'Dangerous Goods Declaration', copies: 1, required: false },
];

// Incoterms
const incoterms2020 = [
  'EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP',
  'DAP', 'DPU', 'DDP'
];

interface LCApplicationData {
  // Application Reference
  applicationNumber: string;
  applicationDate: string;

  // LC Type Configuration
  lcType: string;
  isIrrevocable: boolean;
  isConfirmed: boolean;
  isTransferable: boolean;
  isRevolving: boolean;
  revolvingType: 'automatic' | 'cumulative' | 'non-cumulative';
  maxRevolutions: number;

  // Amount and Currency
  amount: string;
  currency: string;
  tolerancePlus: string;
  toleranceMinus: string;
  amountInWords: string;

  // Validity
  expiryDate: string;
  expiryPlace: string;
  issueDate: string;

  // Payment Terms
  paymentTerm: string;
  deferredDays: number;
  deferredFromDate: 'shipment' | 'presentation';

  // Applicant Details
  applicantName: string;
  applicantAddress: string;
  applicantCity: string;
  applicantCountry: string;
  applicantContact: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantTaxId: string;

  // Beneficiary Details
  beneficiaryName: string;
  beneficiaryAddress: string;
  beneficiaryCity: string;
  beneficiaryCountry: string;
  beneficiaryContact: string;
  beneficiaryPhone: string;
  beneficiaryEmail: string;
  beneficiaryBank: string;
  beneficiaryBankAddress: string;
  beneficiaryBankSwift: string;
  beneficiaryAccount: string;

  // Issuing Bank
  issuingBankName: string;
  issuingBankAddress: string;
  issuingBankSwift: string;
  issuingBankReference: string;

  // Advising/Confirming Bank
  advisingBankName: string;
  advisingBankAddress: string;
  advisingBankSwift: string;
  confirmingBankName: string;
  confirmingBankAddress: string;
  confirmingBankSwift: string;

  // Shipment Details
  portOfLoading: string;
  portOfDischarge: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  latestShipmentDate: string;
  shipmentTerms: string;
  partialShipment: 'allowed' | 'prohibited';
  transshipment: 'allowed' | 'prohibited';

  // Goods Description
  goodsDescription: string;
  hsCode: string;
  incoterms: string;
  incotermsPlace: string;
  quantity: string;
  unitPrice: string;

  // Documents Required
  documents: Record<string, { required: boolean; copies: number }>;
  customDocuments: string;

  // Additional Terms
  presentationPeriod: number;
  bankCharges: 'applicant' | 'beneficiary' | 'shared';
  specialConditions: string;
  additionalInstructions: string;

  // Confirmation Instructions
  confirmationInstructions: 'confirm' | 'may add' | 'without';
  adviseThrough: string;
}

const defaultDocuments: Record<string, { required: boolean; copies: number }> = {};
documentTypes.forEach(doc => {
  defaultDocuments[doc.id] = { required: doc.required, copies: doc.copies };
});

const initialData: LCApplicationData = {
  applicationNumber: `LC-APP-${Date.now().toString().slice(-8)}`,
  applicationDate: new Date().toISOString().split('T')[0],

  lcType: 'irrevocable',
  isIrrevocable: true,
  isConfirmed: false,
  isTransferable: false,
  isRevolving: false,
  revolvingType: 'automatic',
  maxRevolutions: 3,

  amount: '',
  currency: 'USD',
  tolerancePlus: '5',
  toleranceMinus: '5',
  amountInWords: '',

  expiryDate: '',
  expiryPlace: '',
  issueDate: new Date().toISOString().split('T')[0],

  paymentTerm: 'sight',
  deferredDays: 0,
  deferredFromDate: 'shipment',

  applicantName: '',
  applicantAddress: '',
  applicantCity: '',
  applicantCountry: '',
  applicantContact: '',
  applicantPhone: '',
  applicantEmail: '',
  applicantTaxId: '',

  beneficiaryName: '',
  beneficiaryAddress: '',
  beneficiaryCity: '',
  beneficiaryCountry: '',
  beneficiaryContact: '',
  beneficiaryPhone: '',
  beneficiaryEmail: '',
  beneficiaryBank: '',
  beneficiaryBankAddress: '',
  beneficiaryBankSwift: '',
  beneficiaryAccount: '',

  issuingBankName: '',
  issuingBankAddress: '',
  issuingBankSwift: '',
  issuingBankReference: '',

  advisingBankName: '',
  advisingBankAddress: '',
  advisingBankSwift: '',
  confirmingBankName: '',
  confirmingBankAddress: '',
  confirmingBankSwift: '',

  portOfLoading: '',
  portOfDischarge: '',
  placeOfReceipt: '',
  placeOfDelivery: '',
  latestShipmentDate: '',
  shipmentTerms: '',
  partialShipment: 'allowed',
  transshipment: 'allowed',

  goodsDescription: '',
  hsCode: '',
  incoterms: 'FOB',
  incotermsPlace: '',
  quantity: '',
  unitPrice: '',

  documents: { ...defaultDocuments },
  customDocuments: '',

  presentationPeriod: 21,
  bankCharges: 'applicant',
  specialConditions: '',
  additionalInstructions: '',

  confirmationInstructions: 'may add',
  adviseThrough: '',
};

export default function LCApplicationGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('applicant');
  const [previewMode, setPreviewMode] = useState(false);
  const [data, setData] = useState<LCApplicationData>(initialData);

  const updateField = <K extends keyof LCApplicationData>(field: K, value: LCApplicationData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateDocument = (docId: string, field: 'required' | 'copies', value: boolean | number) => {
    setData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docId]: {
          ...prev.documents[docId],
          [field]: value
        }
      }
    }));
  };

  // Calculate validation status
  const validationStatus = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.applicantName) errors.push('Applicant name is required');
    if (!data.beneficiaryName) errors.push('Beneficiary name is required');
    if (!data.amount) errors.push('Amount is required');
    if (!data.expiryDate) errors.push('Expiry date is required');
    if (!data.portOfLoading) warnings.push('Port of loading not specified');
    if (!data.portOfDischarge) warnings.push('Port of discharge not specified');
    if (!data.latestShipmentDate) warnings.push('Latest shipment date not specified');
    if (data.isConfirmed && !data.confirmingBankName) warnings.push('Confirmed LC but no confirming bank specified');

    return { errors, warnings, isValid: errors.length === 0 };
  }, [data]);

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

  const handleExportPDF = () => {
    document.body.classList.add('printing-document');
    const originalTitle = document.title;
    document.title = 'Document';
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-document');
      document.title = originalTitle;
    }, 1000);
  };

  const resetForm = () => {
    setData({
      ...initialData,
      applicationNumber: `LC-APP-${Date.now().toString().slice(-8)}`,
      applicationDate: new Date().toISOString().split('T')[0],
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Format currency amount to words
  const formatAmountInWords = (amount: string, currency: string) => {
    if (!amount) return '';
    const num = parseFloat(amount);
    if (isNaN(num)) return '';
    return `${currency} ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const tabs = [
    { id: 'applicant', label: 'Applicant', icon: Building },
    { id: 'beneficiary', label: 'Beneficiary', icon: Globe },
    { id: 'lc-details', label: 'LC Details', icon: Shield },
    { id: 'shipment', label: 'Shipment', icon: Ship },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'banks', label: 'Banks', icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
                <FileCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
                  Letter of Credit Application Generator
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Create UCP 600 compliant LC applications for international trade
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-[#0F4C81] border-[#0F4C81]">
                {data.applicationNumber}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="text-slate-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Validation Alerts */}
        <AnimatePresence>
          {!validationStatus.isValid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              {validationStatus.errors.length > 0 && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 mb-2">
                  <CardContent className="p-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-400">Required fields missing:</p>
                      <p className="text-sm text-red-600 dark:text-red-300">{validationStatus.errors.join(', ')}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {validationStatus.warnings.length > 0 && (
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">
                  <CardContent className="p-3 flex items-center gap-2">
                    <Info className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-amber-700 dark:text-amber-400">Warnings:</p>
                      <p className="text-sm text-amber-600 dark:text-amber-300">{validationStatus.warnings.join(', ')}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Form */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <ScrollArea className="w-full">
                <TabsList className="grid grid-cols-6 w-max min-w-full mb-4">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 px-4">
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden md:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>

              {/* Applicant Tab */}
              <TabsContent value="applicant" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#0F4C81]">
                      <Building className="h-5 w-5" />
                      Applicant Details
                    </CardTitle>
                    <CardDescription>The party requesting the LC issuance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label className="required">Company Name</Label>
                        <Input
                          value={data.applicantName}
                          onChange={(e) => updateField('applicantName', e.target.value)}
                          placeholder="Full legal company name"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Address</Label>
                        <Textarea
                          value={data.applicantAddress}
                          onChange={(e) => updateField('applicantAddress', e.target.value)}
                          placeholder="Street address, building, floor"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={data.applicantCity}
                          onChange={(e) => updateField('applicantCity', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          value={data.applicantCountry}
                          onChange={(e) => updateField('applicantCountry', e.target.value)}
                          placeholder="Country"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input
                          value={data.applicantContact}
                          onChange={(e) => updateField('applicantContact', e.target.value)}
                          placeholder="Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={data.applicantPhone}
                          onChange={(e) => updateField('applicantPhone', e.target.value)}
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={data.applicantEmail}
                          onChange={(e) => updateField('applicantEmail', e.target.value)}
                          placeholder="email@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tax ID / VAT Number</Label>
                        <Input
                          value={data.applicantTaxId}
                          onChange={(e) => updateField('applicantTaxId', e.target.value)}
                          placeholder="Tax identification number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Beneficiary Tab */}
              <TabsContent value="beneficiary" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#2E8B57]">
                      <Globe className="h-5 w-5" />
                      Beneficiary Details
                    </CardTitle>
                    <CardDescription>The party in whose favor the LC is issued</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label className="required">Company Name</Label>
                        <Input
                          value={data.beneficiaryName}
                          onChange={(e) => updateField('beneficiaryName', e.target.value)}
                          placeholder="Full legal company name"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Address</Label>
                        <Textarea
                          value={data.beneficiaryAddress}
                          onChange={(e) => updateField('beneficiaryAddress', e.target.value)}
                          placeholder="Street address, building, floor"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={data.beneficiaryCity}
                          onChange={(e) => updateField('beneficiaryCity', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          value={data.beneficiaryCountry}
                          onChange={(e) => updateField('beneficiaryCountry', e.target.value)}
                          placeholder="Country"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input
                          value={data.beneficiaryContact}
                          onChange={(e) => updateField('beneficiaryContact', e.target.value)}
                          placeholder="Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={data.beneficiaryPhone}
                          onChange={(e) => updateField('beneficiaryPhone', e.target.value)}
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={data.beneficiaryEmail}
                          onChange={(e) => updateField('beneficiaryEmail', e.target.value)}
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300">Beneficiary Bank Information</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label>Bank Name</Label>
                          <Input
                            value={data.beneficiaryBank}
                            onChange={(e) => updateField('beneficiaryBank', e.target.value)}
                            placeholder="Bank name"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Bank Address</Label>
                          <Input
                            value={data.beneficiaryBankAddress}
                            onChange={(e) => updateField('beneficiaryBankAddress', e.target.value)}
                            placeholder="Bank address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SWIFT Code</Label>
                          <Input
                            value={data.beneficiaryBankSwift}
                            onChange={(e) => updateField('beneficiaryBankSwift', e.target.value)}
                            placeholder="BIC/SWIFT code (8 or 11 characters)"
                            maxLength={11}
                            className="uppercase"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Account Number</Label>
                          <Input
                            value={data.beneficiaryAccount}
                            onChange={(e) => updateField('beneficiaryAccount', e.target.value)}
                            placeholder="Bank account number"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* LC Details Tab */}
              <TabsContent value="lc-details" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#0F4C81]">
                      <Shield className="h-5 w-5" />
                      LC Type & Amount
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* LC Type Selection */}
                    <div className="space-y-3">
                      <Label>Letter of Credit Type</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {lcTypes.map((type) => (
                          <div
                            key={type.value}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              data.lcType === type.value
                                ? 'border-[#0F4C81] bg-[#0F4C81]/5 dark:bg-[#0F4C81]/10'
                                : 'border-slate-200 dark:border-slate-700 hover:border-[#2E8B57]'
                            }`}
                            onClick={() => updateField('lcType', type.value)}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                data.lcType === type.value
                                  ? 'border-[#0F4C81] bg-[#0F4C81]'
                                  : 'border-slate-300'
                              }`}>
                                {data.lcType === type.value && (
                                  <CheckCircle className="w-3 h-3 text-white m-0.5" />
                                )}
                              </div>
                              <span className="font-medium">{type.label}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 ml-6">{type.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* LC Options */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="font-medium">Irrevocable</Label>
                          <p className="text-xs text-slate-500">Cannot cancel without consent</p>
                        </div>
                        <Switch
                          checked={data.isIrrevocable}
                          onCheckedChange={(checked) => updateField('isIrrevocable', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="font-medium">Confirmed</Label>
                          <p className="text-xs text-slate-500">Bank adds confirmation</p>
                        </div>
                        <Switch
                          checked={data.isConfirmed}
                          onCheckedChange={(checked) => updateField('isConfirmed', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="font-medium">Transferable</Label>
                          <p className="text-xs text-slate-500">Can transfer to others</p>
                        </div>
                        <Switch
                          checked={data.isTransferable}
                          onCheckedChange={(checked) => updateField('isTransferable', checked)}
                        />
                      </div>
                    </div>

                    {/* Revolving Options */}
                    {data.lcType === 'revolving' && (
                      <div className="p-4 border border-[#0F4C81]/30 rounded-lg bg-[#0F4C81]/5">
                        <h4 className="font-medium mb-3">Revolving LC Options</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Revolution Type</Label>
                            <Select
                              value={data.revolvingType}
                              onValueChange={(v: 'automatic' | 'cumulative' | 'non-cumulative') =>
                                updateField('revolvingType', v)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="automatic">Automatic</SelectItem>
                                <SelectItem value="cumulative">Cumulative</SelectItem>
                                <SelectItem value="non-cumulative">Non-Cumulative</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Max Revolutions</Label>
                            <Input
                              type="number"
                              value={data.maxRevolutions}
                              onChange={(e) => updateField('maxRevolutions', parseInt(e.target.value) || 0)}
                              min={1}
                              max={12}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Amount Section */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                        Amount & Currency
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="required">Amount</Label>
                          <Input
                            type="number"
                            value={data.amount}
                            onChange={(e) => updateField('amount', e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select value={data.currency} onValueChange={(v) => updateField('currency', v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.slice(0, 20).map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                  {c.code} - {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Amount in Words</Label>
                          <Input
                            value={data.amountInWords}
                            onChange={(e) => updateField('amountInWords', e.target.value)}
                            placeholder="SAY US DOLLARS..."
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tolerance Plus (%)</Label>
                          <Input
                            type="number"
                            value={data.tolerancePlus}
                            onChange={(e) => updateField('tolerancePlus', e.target.value)}
                            placeholder="5"
                            min={0}
                            max={100}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tolerance Minus (%)</Label>
                          <Input
                            type="number"
                            value={data.toleranceMinus}
                            onChange={(e) => updateField('toleranceMinus', e.target.value)}
                            placeholder="5"
                            min={0}
                            max={100}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Terms */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300">Payment Terms</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Payment Type</Label>
                          <Select value={data.paymentTerm} onValueChange={(v) => updateField('paymentTerm', v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentTerms.map((term) => (
                                <SelectItem key={term.value} value={term.value}>
                                  {term.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {data.paymentTerm === 'deferred' && (
                          <>
                            <div className="space-y-2">
                              <Label>Deferred Days</Label>
                              <Input
                                type="number"
                                value={data.deferredDays}
                                onChange={(e) => updateField('deferredDays', parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Count From</Label>
                              <Select
                                value={data.deferredFromDate}
                                onValueChange={(v: 'shipment' | 'presentation') =>
                                  updateField('deferredFromDate', v)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="shipment">Shipment Date</SelectItem>
                                  <SelectItem value="presentation">Presentation Date</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Validity */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#0F4C81]" />
                        Validity
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Issue Date</Label>
                          <Input
                            type="date"
                            value={data.issueDate}
                            onChange={(e) => updateField('issueDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="required">Expiry Date</Label>
                          <Input
                            type="date"
                            value={data.expiryDate}
                            onChange={(e) => updateField('expiryDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Expiry Place</Label>
                          <Input
                            value={data.expiryPlace}
                            onChange={(e) => updateField('expiryPlace', e.target.value)}
                            placeholder="City, Country"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Shipment Tab */}
              <TabsContent value="shipment" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#2E8B57]">
                      <Ship className="h-5 w-5" />
                      Shipment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Ports */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Place of Receipt</Label>
                        <Input
                          value={data.placeOfReceipt}
                          onChange={(e) => updateField('placeOfReceipt', e.target.value)}
                          placeholder="Pre-carriage location"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Port of Loading</Label>
                        <Input
                          value={data.portOfLoading}
                          onChange={(e) => updateField('portOfLoading', e.target.value)}
                          placeholder="e.g., Shanghai, China"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Port of Discharge</Label>
                        <Input
                          value={data.portOfDischarge}
                          onChange={(e) => updateField('portOfDischarge', e.target.value)}
                          placeholder="e.g., Los Angeles, USA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Place of Delivery</Label>
                        <Input
                          value={data.placeOfDelivery}
                          onChange={(e) => updateField('placeOfDelivery', e.target.value)}
                          placeholder="On-carriage destination"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Latest Shipment Date</Label>
                        <Input
                          type="date"
                          value={data.latestShipmentDate}
                          onChange={(e) => updateField('latestShipmentDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Partial Shipment</Label>
                        <Select
                          value={data.partialShipment}
                          onValueChange={(v: 'allowed' | 'prohibited') => updateField('partialShipment', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="allowed">Allowed</SelectItem>
                            <SelectItem value="prohibited">Prohibited</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Transshipment</Label>
                        <Select
                          value={data.transshipment}
                          onValueChange={(v: 'allowed' | 'prohibited') => updateField('transshipment', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="allowed">Allowed</SelectItem>
                            <SelectItem value="prohibited">Prohibited</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    {/* Goods Description */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300">Goods Description</h4>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={data.goodsDescription}
                          onChange={(e) => updateField('goodsDescription', e.target.value)}
                          placeholder="Detailed description of goods..."
                          rows={4}
                        />
                      </div>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>HS Code</Label>
                          <Input
                            value={data.hsCode}
                            onChange={(e) => updateField('hsCode', e.target.value)}
                            placeholder="6-10 digit code"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Incoterms 2020</Label>
                          <Select value={data.incoterms} onValueChange={(v) => updateField('incoterms', v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {incoterms2020.map((term) => (
                                <SelectItem key={term} value={term}>
                                  {term}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Named Place</Label>
                          <Input
                            value={data.incotermsPlace}
                            onChange={(e) => updateField('incotermsPlace', e.target.value)}
                            placeholder="Port/City"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            value={data.quantity}
                            onChange={(e) => updateField('quantity', e.target.value)}
                            placeholder="e.g., 1000 MT"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#0F4C81]">
                      <FileText className="h-5 w-5" />
                      Documents Required
                    </CardTitle>
                    <CardDescription>
                      Select documents required for presentation under this LC
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      {documentTypes.map((doc) => (
                        <div
                          key={doc.id}
                          className={`p-3 border rounded-lg transition-all ${
                            data.documents[doc.id]?.required
                              ? 'border-[#2E8B57] bg-[#2E8B57]/5 dark:bg-[#2E8B57]/10'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={doc.id}
                                checked={data.documents[doc.id]?.required || false}
                                onCheckedChange={(checked) =>
                                  updateDocument(doc.id, 'required', checked === true)
                                }
                              />
                              <Label htmlFor={doc.id} className="cursor-pointer">
                                {doc.label}
                              </Label>
                            </div>
                            {data.documents[doc.id]?.required && (
                              <div className="flex items-center gap-2">
                                <Label className="text-xs text-slate-500">Copies:</Label>
                                <Input
                                  type="number"
                                  value={data.documents[doc.id]?.copies || 1}
                                  onChange={(e) =>
                                    updateDocument(doc.id, 'copies', parseInt(e.target.value) || 1)
                                  }
                                  className="w-16 h-8 text-center"
                                  min={1}
                                  max={10}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Other Documents</Label>
                      <Textarea
                        value={data.customDocuments}
                        onChange={(e) => updateField('customDocuments', e.target.value)}
                        placeholder="Specify any additional documents required..."
                        rows={3}
                      />
                    </div>

                    <Separator />

                    {/* Presentation & Charges */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Presentation Period (days after shipment)</Label>
                        <Input
                          type="number"
                          value={data.presentationPeriod}
                          onChange={(e) => updateField('presentationPeriod', parseInt(e.target.value) || 21)}
                          min={1}
                          max={30}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bank Charges</Label>
                        <Select
                          value={data.bankCharges}
                          onValueChange={(v: 'applicant' | 'beneficiary' | 'shared') =>
                            updateField('bankCharges', v)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="applicant">Applicant bears all charges</SelectItem>
                            <SelectItem value="beneficiary">Beneficiary bears all charges</SelectItem>
                            <SelectItem value="shared">Shared between parties</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Special Conditions</Label>
                      <Textarea
                        value={data.specialConditions}
                        onChange={(e) => updateField('specialConditions', e.target.value)}
                        placeholder="Enter any special conditions..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Banks Tab */}
              <TabsContent value="banks" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Issuing Bank */}
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-[#0F4C81]">
                        <Banknote className="h-5 w-5" />
                        Issuing Bank
                      </CardTitle>
                      <CardDescription>Bank that issues the LC</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input
                          value={data.issuingBankName}
                          onChange={(e) => updateField('issuingBankName', e.target.value)}
                          placeholder="Bank name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          value={data.issuingBankAddress}
                          onChange={(e) => updateField('issuingBankAddress', e.target.value)}
                          placeholder="Bank address"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>SWIFT Code</Label>
                          <Input
                            value={data.issuingBankSwift}
                            onChange={(e) => updateField('issuingBankSwift', e.target.value)}
                            placeholder="BIC/SWIFT"
                            maxLength={11}
                            className="uppercase"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Reference</Label>
                          <Input
                            value={data.issuingBankReference}
                            onChange={(e) => updateField('issuingBankReference', e.target.value)}
                            placeholder="Ref number"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Advising Bank */}
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-[#2E8B57]">
                        <Globe className="h-5 w-5" />
                        Advising Bank
                      </CardTitle>
                      <CardDescription>Bank that advises the LC to beneficiary</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input
                          value={data.advisingBankName}
                          onChange={(e) => updateField('advisingBankName', e.target.value)}
                          placeholder="Bank name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          value={data.advisingBankAddress}
                          onChange={(e) => updateField('advisingBankAddress', e.target.value)}
                          placeholder="Bank address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SWIFT Code</Label>
                        <Input
                          value={data.advisingBankSwift}
                          onChange={(e) => updateField('advisingBankSwift', e.target.value)}
                          placeholder="BIC/SWIFT"
                          maxLength={11}
                          className="uppercase"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Confirming Bank */}
                {data.isConfirmed && (
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-[#2E8B57]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-[#2E8B57]">
                        <Shield className="h-5 w-5" />
                        Confirming Bank
                      </CardTitle>
                      <CardDescription>Bank that adds confirmation to the LC</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Bank Name</Label>
                          <Input
                            value={data.confirmingBankName}
                            onChange={(e) => updateField('confirmingBankName', e.target.value)}
                            placeholder="Bank name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SWIFT Code</Label>
                          <Input
                            value={data.confirmingBankSwift}
                            onChange={(e) => updateField('confirmingBankSwift', e.target.value)}
                            placeholder="BIC/SWIFT"
                            maxLength={11}
                            className="uppercase"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          value={data.confirmingBankAddress}
                          onChange={(e) => updateField('confirmingBankAddress', e.target.value)}
                          placeholder="Bank address"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Confirmation Instructions */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Confirmation Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Confirmation Request</Label>
                      <Select
                        value={data.confirmationInstructions}
                        onValueChange={(v: 'confirm' | 'may add' | 'without') =>
                          updateField('confirmationInstructions', v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirm">Confirm</SelectItem>
                          <SelectItem value="may add">May Add</SelectItem>
                          <SelectItem value="without">Without</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Advise Through</Label>
                      <Input
                        value={data.adviseThrough}
                        onChange={(e) => updateField('adviseThrough', e.target.value)}
                        placeholder="Bank to advise through"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Instructions to Bank</Label>
                      <Textarea
                        value={data.additionalInstructions}
                        onChange={(e) => updateField('additionalInstructions', e.target.value)}
                        placeholder="Any additional instructions..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Action Buttons */}
              <div className="flex gap-2 print:hidden">
                <Button
                  onClick={() => setPreviewMode(!previewMode)}
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button onClick={handlePrint} className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>

              {/* Live Preview */}
              <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white py-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div ref={printRef} className="document-content-only p-4 text-xs">
                      {/* Preview Header */}
                      <div className="text-center border-b-2 border-[#0F4C81] pb-3 mb-4">
                        <h2 className="text-lg font-bold text-[#0F4C81]">IRREVOCABLE DOCUMENTARY CREDIT APPLICATION</h2>
                        <p className="text-slate-500 text-xs">UCP 600 Compliant</p>
                      </div>

                      {/* Reference */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div>
                          <span className="text-slate-500">Application No:</span>
                          <span className="ml-1 font-medium">{data.applicationNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Date:</span>
                          <span className="ml-1 font-medium">{data.applicationDate}</span>
                        </div>
                      </div>

                      {/* LC Type */}
                      <div className="mb-3 p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <div className="flex flex-wrap gap-1">
                          {data.isIrrevocable && (
                            <Badge variant="secondary" className="text-xs bg-[#0F4C81] text-white">Irrevocable</Badge>
                          )}
                          {data.isConfirmed && (
                            <Badge variant="secondary" className="text-xs bg-[#2E8B57] text-white">Confirmed</Badge>
                          )}
                          {data.isTransferable && (
                            <Badge variant="secondary" className="text-xs bg-amber-500 text-white">Transferable</Badge>
                          )}
                          {data.isRevolving && (
                            <Badge variant="secondary" className="text-xs bg-purple-500 text-white">Revolving</Badge>
                          )}
                        </div>
                      </div>

                      {/* Parties */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="border p-2 rounded">
                          <p className="font-semibold text-[#2E8B57] text-xs">APPLICANT</p>
                          <p className="font-medium text-xs">{data.applicantName || 'TBD'}</p>
                          <p className="text-xs text-slate-500 truncate">{data.applicantAddress}</p>
                          {data.applicantPhone && <p className="text-xs text-slate-500">Tel: {data.applicantPhone}</p>}
                          {data.applicantEmail && <p className="text-xs text-slate-500">Email: {data.applicantEmail}</p>}
                        </div>
                        <div className="border p-2 rounded">
                          <p className="font-semibold text-[#0F4C81] text-xs">BENEFICIARY</p>
                          <p className="font-medium text-xs">{data.beneficiaryName || 'TBD'}</p>
                          <p className="text-xs text-slate-500 truncate">{data.beneficiaryAddress}</p>
                          {data.beneficiaryPhone && <p className="text-xs text-slate-500">Tel: {data.beneficiaryPhone}</p>}
                          {data.beneficiaryEmail && <p className="text-xs text-slate-500">Email: {data.beneficiaryEmail}</p>}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="mb-3 p-2 bg-[#0F4C81]/5 dark:bg-[#0F4C81]/10 rounded">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500">Amount:</span>
                            <p className="font-bold text-[#0F4C81]">
                              {formatAmountInWords(data.amount, data.currency)}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500">Tolerance:</span>
                            <p className="font-medium">+{data.tolerancePlus}%/-{data.toleranceMinus}%</p>
                          </div>
                        </div>
                      </div>

                      {/* Validity */}
                      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">Expiry:</span>
                          <span className="ml-1 font-medium">{data.expiryDate || 'TBD'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">At:</span>
                          <span className="ml-1 font-medium">{data.expiryPlace || 'TBD'}</span>
                        </div>
                      </div>

                      {/* Shipment */}
                      <div className="mb-3 p-2 border rounded text-xs">
                        <p className="font-semibold text-[#2E8B57]">SHIPMENT</p>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          <div><span className="text-slate-500">From:</span> {data.portOfLoading || 'TBD'}</div>
                          <div><span className="text-slate-500">To:</span> {data.portOfDischarge || 'TBD'}</div>
                          <div><span className="text-slate-500">Latest:</span> {data.latestShipmentDate || 'TBD'}</div>
                          <div><span className="text-slate-500">Terms:</span> {data.incoterms} {data.incotermsPlace}</div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="mb-3 text-xs">
                        <p className="font-semibold text-[#0F4C81]">DOCUMENTS REQUIRED</p>
                        <ul className="mt-1 space-y-0.5">
                          {Object.entries(data.documents)
                            .filter(([, config]) => config.required)
                            .map(([docId, config]) => {
                              const doc = documentTypes.find(d => d.id === docId);
                              return (
                                <li key={docId} className="flex items-center gap-1">
                                  <ChevronRight className="h-3 w-3 text-[#2E8B57]" />
                                  {doc?.label} ({config.copies} copies)
                                </li>
                              );
                            })}
                        </ul>
                      </div>

                      {/* Payment Terms */}
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-500">Payment:</span>
                            <span className="ml-1 font-medium capitalize">{data.paymentTerm}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Presentation:</span>
                            <span className="ml-1 font-medium">{data.presentationPeriod} days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Status Card */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Application Status</span>
                    <Badge
                      className={
                        validationStatus.isValid
                          ? 'bg-[#2E8B57] text-white'
                          : 'bg-amber-500 text-white'
                      }
                    >
                      {validationStatus.isValid ? 'Complete' : 'Incomplete'}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                      <p className="font-bold text-[#0F4C81]">{data.amount ? data.currency : '-'}</p>
                      <p className="text-slate-500">Amount</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                      <p className="font-bold text-[#2E8B57]">
                        {Object.values(data.documents).filter(d => d.required).length}
                      </p>
                      <p className="text-slate-500">Documents</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                      <p className="font-bold text-[#0F4C81]">{data.expiryDate || '-'}</p>
                      <p className="text-slate-500">Expiry</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-content, #print-content * {
            visibility: visible;
          }
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
