'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, Eye, Building, Globe, Calendar, DollarSign, Package, Info, AlertTriangle, Shield, FileCheck, CreditCard } from 'lucide-react';
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
import { currencies } from '@/lib/constants/currencies';

interface LCData {
  // LC Details
  lcNumber: string;
  applicationDate: string;
  lcType: string;
  formType: 'irrevocable' | 'revocable';
  confirmation: 'confirmed' | 'unconfirmed' | 'without';
  availability: 'sight' | 'deferred' | 'acceptance' | 'negotiation';
  deferredDays: number;
  amount: string;
  currency: string;
  tolerance: string;
  expiryDate: string;
  expiryPlace: string;
  
  // Applicant
  applicantName: string;
  applicantAddress: string;
  applicantCountry: string;
  applicantContact: string;
  applicantPhone: string;
  applicantEmail: string;
  
  // Beneficiary
  beneficiaryName: string;
  beneficiaryAddress: string;
  beneficiaryCountry: string;
  beneficiaryContact: string;
  beneficiaryPhone: string;
  beneficiaryEmail: string;
  beneficiaryBank: string;
  beneficiaryAccount: string;
  
  // Issuing Bank
  issuingBankName: string;
  issuingBankAddress: string;
  issuingBankSwift: string;
  
  // Advising Bank
  advisingBankName: string;
  advisingBankAddress: string;
  advisingBankSwift: string;
  
  // Shipment Details
  portOfLoading: string;
  portOfDischarge: string;
  latestShipmentDate: string;
  partialShipment: 'allowed' | 'prohibited';
  transshipment: 'allowed' | 'prohibited';
  
  // Goods
  goodsDescription: string;
  hsCode: string;
  incoterms: string;
  
  // Documents Required
  commercialInvoice: boolean;
  packingList: boolean;
  billOfLading: boolean;
  insurancePolicy: boolean;
  certificateOfOrigin: boolean;
  inspectionCertificate: boolean;
  otherDocuments: string;
  
  // Additional
  specialConditions: string;
  bankCharges: 'applicant' | 'beneficiary' | 'shared';
  presentationPeriod: string;
}

const lcTypes = [
  { value: 'commercial', label: 'Commercial Letter of Credit' },
  { value: 'standby', label: 'Standby Letter of Credit' },
  { value: 'revolving', label: 'Revolving Letter of Credit' },
  { value: 'transferable', label: 'Transferable Letter of Credit' },
  { value: 'back-to-back', label: 'Back-to-Back Letter of Credit' },
];

export default function LetterOfCreditGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('form');
  const [lcData, setLcData] = useState<LCData>({
    lcNumber: `LC-${Date.now().toString().slice(-8)}`,
    applicationDate: new Date().toISOString().split('T')[0],
    lcType: 'commercial',
    formType: 'irrevocable',
    confirmation: 'unconfirmed',
    availability: 'sight',
    deferredDays: 0,
    amount: '',
    currency: 'USD',
    tolerance: '0',
    expiryDate: '',
    expiryPlace: '',
    
    applicantName: '',
    applicantAddress: '',
    applicantCountry: '',
    applicantContact: '',
    applicantPhone: '',
    applicantEmail: '',
    
    beneficiaryName: '',
    beneficiaryAddress: '',
    beneficiaryCountry: '',
    beneficiaryContact: '',
    beneficiaryPhone: '',
    beneficiaryEmail: '',
    beneficiaryBank: '',
    beneficiaryAccount: '',
    
    issuingBankName: '',
    issuingBankAddress: '',
    issuingBankSwift: '',
    
    advisingBankName: '',
    advisingBankAddress: '',
    advisingBankSwift: '',
    
    portOfLoading: '',
    portOfDischarge: '',
    latestShipmentDate: '',
    partialShipment: 'allowed',
    transshipment: 'allowed',
    
    goodsDescription: '',
    hsCode: '',
    incoterms: 'FOB',
    
    commercialInvoice: true,
    packingList: true,
    billOfLading: true,
    insurancePolicy: false,
    certificateOfOrigin: true,
    inspectionCertificate: false,
    otherDocuments: '',
    
    specialConditions: '',
    bankCharges: 'applicant',
    presentationPeriod: '21',
  });

  const updateField = (field: keyof LCData, value: any) => {
    setLcData(prev => ({ ...prev, [field]: value }));
  };

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <FileCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Letter of Credit Application Generator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Professional LC application document compliant with UCP600 international standards
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="form">
              <FileText className="h-4 w-4 mr-2" />
              Fill Form
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview Document
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* LC Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-[#0F4C81]" />
                      LC Type Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Application No.</Label>
                        <Input
                          value={lcData.lcNumber}
                          onChange={(e) => updateField('lcNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Application Date</Label>
                        <Input
                          type="date"
                          value={lcData.applicationDate}
                          onChange={(e) => updateField('applicationDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>LC Type</Label>
                      <Select value={lcData.lcType} onValueChange={(v) => updateField('lcType', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {lcTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Form Type</Label>
                        <Select value={lcData.formType} onValueChange={(v: 'irrevocable' | 'revocable') => updateField('formType', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="irrevocable">Irrevocable</SelectItem>
                            <SelectItem value="revocable">Revocable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Confirmation</Label>
                        <Select value={lcData.confirmation} onValueChange={(v: 'confirmed' | 'unconfirmed' | 'without') => updateField('confirmation', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
                            <SelectItem value="without">Without Confirmation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Availability</Label>
                        <Select value={lcData.availability} onValueChange={(v: 'sight' | 'deferred' | 'acceptance' | 'negotiation') => updateField('availability', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sight">Sight Payment</SelectItem>
                            <SelectItem value="deferred">Deferred Payment</SelectItem>
                            <SelectItem value="acceptance">Acceptance</SelectItem>
                            <SelectItem value="negotiation">Negotiation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {lcData.availability === 'deferred' && (
                        <div className="space-y-2">
                          <Label>Deferred Days</Label>
                          <Input
                            type="number"
                            value={lcData.deferredDays}
                            onChange={(e) => updateField('deferredDays', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          value={lcData.amount}
                          onChange={(e) => updateField('amount', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={lcData.currency} onValueChange={(v) => updateField('currency', v)}>
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
                      <div className="space-y-2">
                        <Label>Tolerance (%)</Label>
                        <Input
                          type="number"
                          value={lcData.tolerance}
                          onChange={(e) => updateField('tolerance', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input
                          type="date"
                          value={lcData.expiryDate}
                          onChange={(e) => updateField('expiryDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Place</Label>
                        <Input
                          value={lcData.expiryPlace}
                          onChange={(e) => updateField('expiryPlace', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Applicant Info */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5 text-[#2E8B57]" />
                      Applicant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Applicant Name *</Label>
                      <Input
                        value={lcData.applicantName}
                        onChange={(e) => updateField('applicantName', e.target.value)}
                        placeholder="Full company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address *</Label>
                      <Textarea
                        value={lcData.applicantAddress}
                        onChange={(e) => updateField('applicantAddress', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Country/Region</Label>
                        <Input
                          value={lcData.applicantCountry}
                          onChange={(e) => updateField('applicantCountry', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input
                          value={lcData.applicantContact}
                          onChange={(e) => updateField('applicantContact', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={lcData.applicantPhone}
                          onChange={(e) => updateField('applicantPhone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={lcData.applicantEmail}
                          onChange={(e) => updateField('applicantEmail', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Beneficiary Info */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="h-5 w-5 text-[#0F4C81]" />
                      Beneficiary Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Beneficiary Name *</Label>
                      <Input
                        value={lcData.beneficiaryName}
                        onChange={(e) => updateField('beneficiaryName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address *</Label>
                      <Textarea
                        value={lcData.beneficiaryAddress}
                        onChange={(e) => updateField('beneficiaryAddress', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Country/Region</Label>
                        <Input
                          value={lcData.beneficiaryCountry}
                          onChange={(e) => updateField('beneficiaryCountry', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input
                          value={lcData.beneficiaryContact}
                          onChange={(e) => updateField('beneficiaryContact', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={lcData.beneficiaryPhone}
                          onChange={(e) => updateField('beneficiaryPhone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={lcData.beneficiaryEmail}
                          onChange={(e) => updateField('beneficiaryEmail', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input
                          value={lcData.beneficiaryBank}
                          onChange={(e) => updateField('beneficiaryBank', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bank Account</Label>
                        <Input
                          value={lcData.beneficiaryAccount}
                          onChange={(e) => updateField('beneficiaryAccount', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Bank Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CreditCard className="h-5 w-5 text-[#2E8B57]" />
                      Bank Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Issuing Bank Name</Label>
                      <Input
                        value={lcData.issuingBankName}
                        onChange={(e) => updateField('issuingBankName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Issuing Bank Address</Label>
                      <Input
                        value={lcData.issuingBankAddress}
                        onChange={(e) => updateField('issuingBankAddress', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SWIFT Code</Label>
                      <Input
                        value={lcData.issuingBankSwift}
                        onChange={(e) => updateField('issuingBankSwift', e.target.value)}
                        placeholder="8 or 11 character code"
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Advising Bank Name</Label>
                      <Input
                        value={lcData.advisingBankName}
                        onChange={(e) => updateField('advisingBankName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Advising Bank Address</Label>
                      <Input
                        value={lcData.advisingBankAddress}
                        onChange={(e) => updateField('advisingBankAddress', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SWIFT Code</Label>
                      <Input
                        value={lcData.advisingBankSwift}
                        onChange={(e) => updateField('advisingBankSwift', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipment Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-[#0F4C81]" />
                      Shipment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Port of Loading</Label>
                        <Input
                          value={lcData.portOfLoading}
                          onChange={(e) => updateField('portOfLoading', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Port of Discharge</Label>
                        <Input
                          value={lcData.portOfDischarge}
                          onChange={(e) => updateField('portOfDischarge', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Latest Shipment Date</Label>
                        <Input
                          type="date"
                          value={lcData.latestShipmentDate}
                          onChange={(e) => updateField('latestShipmentDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Partial Shipment</Label>
                        <Select value={lcData.partialShipment} onValueChange={(v: 'allowed' | 'prohibited') => updateField('partialShipment', v)}>
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
                        <Select value={lcData.transshipment} onValueChange={(v: 'allowed' | 'prohibited') => updateField('transshipment', v)}>
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
                    <div className="space-y-2">
                      <Label>Description of Goods</Label>
                      <Textarea
                        value={lcData.goodsDescription}
                        onChange={(e) => updateField('goodsDescription', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>HS Code</Label>
                        <Input
                          value={lcData.hsCode}
                          onChange={(e) => updateField('hsCode', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Incoterms</Label>
                        <Select value={lcData.incoterms} onValueChange={(v) => updateField('incoterms', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FOB">FOB</SelectItem>
                            <SelectItem value="CIF">CIF</SelectItem>
                            <SelectItem value="CFR">CFR</SelectItem>
                            <SelectItem value="FCA">FCA</SelectItem>
                            <SelectItem value="CIP">CIP</SelectItem>
                            <SelectItem value="DDP">DDP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents Required */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Documents Required</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="commercialInvoice"
                          checked={lcData.commercialInvoice}
                          onCheckedChange={(checked) => updateField('commercialInvoice', checked)}
                        />
                        <Label htmlFor="commercialInvoice">Commercial Invoice</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="packingList"
                          checked={lcData.packingList}
                          onCheckedChange={(checked) => updateField('packingList', checked)}
                        />
                        <Label htmlFor="packingList">Packing List</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="billOfLading"
                          checked={lcData.billOfLading}
                          onCheckedChange={(checked) => updateField('billOfLading', checked)}
                        />
                        <Label htmlFor="billOfLading">Bill of Lading</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="insurancePolicy"
                          checked={lcData.insurancePolicy}
                          onCheckedChange={(checked) => updateField('insurancePolicy', checked)}
                        />
                        <Label htmlFor="insurancePolicy">Insurance Policy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="certificateOfOrigin"
                          checked={lcData.certificateOfOrigin}
                          onCheckedChange={(checked) => updateField('certificateOfOrigin', checked)}
                        />
                        <Label htmlFor="certificateOfOrigin">Certificate of Origin</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inspectionCertificate"
                          checked={lcData.inspectionCertificate}
                          onCheckedChange={(checked) => updateField('inspectionCertificate', checked)}
                        />
                        <Label htmlFor="inspectionCertificate">Inspection Certificate</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Other Documents</Label>
                      <Textarea
                        value={lcData.otherDocuments}
                        onChange={(e) => updateField('otherDocuments', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Presentation Period (Days)</Label>
                        <Input
                          type="number"
                          value={lcData.presentationPeriod}
                          onChange={(e) => updateField('presentationPeriod', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bank Charges To</Label>
                        <Select value={lcData.bankCharges} onValueChange={(v: 'applicant' | 'beneficiary' | 'shared') => updateField('bankCharges', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="applicant">Applicant</SelectItem>
                            <SelectItem value="beneficiary">Beneficiary</SelectItem>
                            <SelectItem value="shared">Shared</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Special Conditions</Label>
                      <Textarea
                        value={lcData.specialConditions}
                        onChange={(e) => updateField('specialConditions', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="flex justify-end gap-3 mb-4 print:hidden">
              <Button onClick={() => setActiveTab('form')} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Edit Form
              </Button>
              <Button onClick={handlePrint} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                <Printer className="h-4 w-4 mr-2" />
                Print Application
              </Button>
            </div>

            {/* LC Application Preview */}
            <div ref={printRef} className="document-content-only bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8 print:shadow-none print:p-0">
              {/* Header */}
              <div className="text-center border-b-2 border-[#0F4C81] pb-4 mb-6">
                <h1 className="text-2xl font-bold text-[#0F4C81]">IRREVOCABLE DOCUMENTARY CREDIT APPLICATION</h1>
                <p className="text-lg font-semibold text-slate-600 dark:text-slate-400 mt-1">Letter of Credit Application Form</p>
              </div>

              {/* Reference Info */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-sm text-slate-500">Application No.:</p>
                  <p className="font-semibold">{lcData.lcNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Date:</p>
                  <p className="font-semibold">{lcData.applicationDate}</p>
                </div>
              </div>

              {/* Type of Credit */}
              <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-3">Type of Credit</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Type:</span>
                    <span className="ml-2 font-medium">{lcData.lcType === 'commercial' ? 'Commercial' : lcData.lcType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Form:</span>
                    <span className="ml-2 font-medium">{lcData.formType === 'irrevocable' ? 'Irrevocable' : 'Revocable'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Confirmation:</span>
                    <span className="ml-2 font-medium">{lcData.confirmation === 'confirmed' ? 'Confirmed' : 'Unconfirmed'}</span>
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-[#2E8B57] mb-2">APPLICANT</h3>
                  <p className="font-bold">{lcData.applicantName || 'Company Name'}</p>
                  <p className="text-sm whitespace-pre-line">{lcData.applicantAddress}</p>
                  <p className="text-sm">{lcData.applicantCountry}</p>
                  {lcData.applicantContact && <p className="text-sm">Contact: {lcData.applicantContact}</p>}
                  {lcData.applicantPhone && <p className="text-sm">Tel: {lcData.applicantPhone}</p>}
                  {lcData.applicantEmail && <p className="text-sm">Email: {lcData.applicantEmail}</p>}
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-[#0F4C81] mb-2">BENEFICIARY</h3>
                  <p className="font-bold">{lcData.beneficiaryName || 'Company Name'}</p>
                  <p className="text-sm whitespace-pre-line">{lcData.beneficiaryAddress}</p>
                  <p className="text-sm">{lcData.beneficiaryCountry}</p>
                  {lcData.beneficiaryContact && <p className="text-sm">Contact: {lcData.beneficiaryContact}</p>}
                  {lcData.beneficiaryPhone && <p className="text-sm">Tel: {lcData.beneficiaryPhone}</p>}
                  {lcData.beneficiaryEmail && <p className="text-sm">Email: {lcData.beneficiaryEmail}</p>}
                  {lcData.beneficiaryBank && <p className="text-sm">Bank: {lcData.beneficiaryBank}</p>}
                </div>
              </div>

              {/* Amount */}
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Amount</p>
                    <p className="font-bold text-lg text-[#0F4C81]">
                      {lcData.currency} {parseFloat(lcData.amount || '0').toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Tolerance</p>
                    <p className="font-medium">{lcData.tolerance}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Availability</p>
                    <p className="font-medium">{lcData.availability === 'sight' ? 'Sight Payment' : lcData.availability}</p>
                  </div>
                </div>
              </div>

              {/* Banks */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-[#2E8B57]">Issuing Bank</p>
                  <p>{lcData.issuingBankName || 'TBD'}</p>
                  <p>{lcData.issuingBankAddress}</p>
                  <p>SWIFT: {lcData.issuingBankSwift}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-[#0F4C81]">Advising Bank</p>
                  <p>{lcData.advisingBankName || 'TBD'}</p>
                  <p>{lcData.advisingBankAddress}</p>
                  <p>SWIFT: {lcData.advisingBankSwift}</p>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-3">Shipment Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">From:</span>
                    <span className="ml-2">{lcData.portOfLoading || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">To:</span>
                    <span className="ml-2">{lcData.portOfDischarge || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Latest Shipment:</span>
                    <span className="ml-2">{lcData.latestShipmentDate || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Incoterms:</span>
                    <span className="ml-2">{lcData.incoterms}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Partial Shipment:</span>
                    <span className="ml-2">{lcData.partialShipment === 'allowed' ? 'Allowed' : 'Prohibited'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Transshipment:</span>
                    <span className="ml-2">{lcData.transshipment === 'allowed' ? 'Allowed' : 'Prohibited'}</span>
                  </div>
                </div>
              </div>

              {/* Documents Required */}
              <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-3">Documents Required</h3>
                <div className="text-sm space-y-1">
                  {lcData.commercialInvoice && <p>☐ Signed Commercial Invoice in [   ] copies</p>}
                  {lcData.packingList && <p>☐ Packing List in [   ] copies</p>}
                  {lcData.billOfLading && <p>☐ Full set of Clean On Board Ocean Bill of Lading</p>}
                  {lcData.insurancePolicy && <p>☐ Insurance Policy/Certificate for 110% of invoice value</p>}
                  {lcData.certificateOfOrigin && <p>☐ Certificate of Origin</p>}
                  {lcData.inspectionCertificate && <p>☐ Inspection Certificate</p>}
                  {lcData.otherDocuments && <p className="whitespace-pre-line">{lcData.otherDocuments}</p>}
                </div>
                <div className="mt-4 text-sm">
                  <p className="text-slate-500">Presentation Period: {lcData.presentationPeriod} days after shipment</p>
                </div>
              </div>

              {/* Goods Description */}
              <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-3">Description of Goods</h3>
                <p className="text-sm whitespace-pre-line">{lcData.goodsDescription || 'N/A'}</p>
                {lcData.hsCode && <p className="text-sm mt-2">HS Code: {lcData.hsCode}</p>}
              </div>

              {/* Special Conditions */}
              {lcData.specialConditions && (
                <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h3 className="font-semibold text-[#0F4C81] mb-3">Special Conditions</h3>
                  <p className="text-sm whitespace-pre-line">{lcData.specialConditions}</p>
                </div>
              )}

              {/* Validity */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Expiry Date:</span>
                    <span className="ml-2 font-medium">{lcData.expiryDate || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Expiry Place:</span>
                    <span className="ml-2 font-medium">{lcData.expiryPlace || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Bank Charges:</span>
                    <span className="ml-2 font-medium">
                      {lcData.bankCharges === 'applicant' ? 'For Applicant' : 
                       lcData.bankCharges === 'beneficiary' ? 'For Beneficiary' : 'Shared'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="border-t border-slate-300 dark:border-slate-600 pt-2">
                  <p className="text-sm text-slate-500">Applicant's Signature</p>
                  <p className="text-sm text-slate-400 mt-8">Authorized Signatory & Company Stamp</p>
                </div>
                <div className="border-t border-slate-300 dark:border-slate-600 pt-2">
                  <p className="text-sm text-slate-500">Bank Use Only</p>
                  <p className="text-sm text-slate-400 mt-8">Reference: ________________</p>
                </div>
              </div>

              {/* UCP600 Notice */}
              <div className="mt-8 text-center text-xs text-slate-500">
                <p>Subject to UCP 600 (Uniform Customs and Practice for Documentary Credits)</p>
                <p className="mt-1">This credit is subject to UCP600 (Uniform Customs and Practice for Documentary Credits)</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
