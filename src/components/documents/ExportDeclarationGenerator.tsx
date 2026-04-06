'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, Eye, Building, Globe, Calendar, DollarSign, Package, Truck, Info, CheckCircle } from 'lucide-react';
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

interface ExportDeclarationData {
  // Declaration Details
  declarationNo: string;
  declarationDate: string;
  customsOffice: string;
  declarationType: 'export' | 're-export' | 'temporary-export';
  
  // Exporter Info
  exporterName: string;
  exporterAddress: string;
  exporterCountry: string;
  exporterTaxId: string;
  exporterContact: string;
  
  // Consignee Info
  consigneeName: string;
  consigneeAddress: string;
  consigneeCountry: string;
  
  // Transport Details
  transportMode: string;
  vesselFlightNo: string;
  portOfLoading: string;
  portOfDischarge: string;
  finalDestination: string;
  containerNo: string;
  
  // Goods Details
  goodsDescription: string;
  hsCode: string;
  quantity: number;
  quantityUnit: string;
  grossWeight: number;
  netWeight: number;
  customsValue: number;
  currency: string;
  originCountry: string;
  
  // Additional
  incoterms: string;
  paymentTerms: string;
  billOfLadingNo: string;
  invoiceNo: string;
  remarks: string;
}

const transportModes = [
  { value: 'sea', label: 'Sea Freight' },
  { value: 'air', label: 'Air Freight' },
  { value: 'road', label: 'Road Transport' },
  { value: 'rail', label: 'Rail Transport' },
  { value: 'postal', label: 'Postal/Express' },
];

const quantityUnits = [
  { value: 'PCE', label: 'Pieces (PCE)' },
  { value: 'KGS', label: 'Kilograms (KGS)' },
  { value: 'MTR', label: 'Meters (MTR)' },
  { value: 'SET', label: 'Sets (SET)' },
  { value: 'CTN', label: 'Cartons (CTN)' },
  { value: 'PKT', label: 'Packages (PKT)' },
];

export default function ExportDeclarationGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('form');
  const [declarationData, setDeclarationData] = useState<ExportDeclarationData>({
    declarationNo: `EXP-${Date.now().toString().slice(-8)}`,
    declarationDate: new Date().toISOString().split('T')[0],
    customsOffice: '',
    declarationType: 'export',
    
    exporterName: '',
    exporterAddress: '',
    exporterCountry: '',
    exporterTaxId: '',
    exporterContact: '',
    
    consigneeName: '',
    consigneeAddress: '',
    consigneeCountry: '',
    
    transportMode: 'sea',
    vesselFlightNo: '',
    portOfLoading: '',
    portOfDischarge: '',
    finalDestination: '',
    containerNo: '',
    
    goodsDescription: '',
    hsCode: '',
    quantity: 0,
    quantityUnit: 'PCE',
    grossWeight: 0,
    netWeight: 0,
    customsValue: 0,
    currency: 'USD',
    originCountry: '',
    
    incoterms: 'FOB',
    paymentTerms: 'T/T',
    billOfLadingNo: '',
    invoiceNo: '',
    remarks: '',
  });

  const updateField = (field: keyof ExportDeclarationData, value: any) => {
    setDeclarationData(prev => ({ ...prev, [field]: value }));
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

  const selectedCurrency = currencies.find(c => c.code === declarationData.currency);

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
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Export Declaration Generator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Generate export customs declaration documents for international shipments
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
              Preview Declaration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Declaration Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-[#0F4C81]" />
                      Declaration Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Declaration No.</Label>
                        <Input
                          value={declarationData.declarationNo}
                          onChange={(e) => updateField('declarationNo', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={declarationData.declarationDate}
                          onChange={(e) => updateField('declarationDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Declaration Type</Label>
                        <Select value={declarationData.declarationType} onValueChange={(v: any) => updateField('declarationType', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="export">Export</SelectItem>
                            <SelectItem value="re-export">Re-export</SelectItem>
                            <SelectItem value="temporary-export">Temporary Export</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Customs Office</Label>
                        <Input
                          value={declarationData.customsOffice}
                          onChange={(e) => updateField('customsOffice', e.target.value)}
                          placeholder="Port of export"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Exporter Info */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5 text-[#2E8B57]" />
                      Exporter Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Exporter Name *</Label>
                      <Input
                        value={declarationData.exporterName}
                        onChange={(e) => updateField('exporterName', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address *</Label>
                      <Textarea
                        value={declarationData.exporterAddress}
                        onChange={(e) => updateField('exporterAddress', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          value={declarationData.exporterCountry}
                          onChange={(e) => updateField('exporterCountry', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tax ID / EORI</Label>
                        <Input
                          value={declarationData.exporterTaxId}
                          onChange={(e) => updateField('exporterTaxId', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Person</Label>
                      <Input
                        value={declarationData.exporterContact}
                        onChange={(e) => updateField('exporterContact', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Consignee Info */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="h-5 w-5 text-[#0F4C81]" />
                      Consignee Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Consignee Name *</Label>
                      <Input
                        value={declarationData.consigneeName}
                        onChange={(e) => updateField('consigneeName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={declarationData.consigneeAddress}
                        onChange={(e) => updateField('consigneeAddress', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        value={declarationData.consigneeCountry}
                        onChange={(e) => updateField('consigneeCountry', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Transport Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Truck className="h-5 w-5 text-[#2E8B57]" />
                      Transport Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Transport Mode</Label>
                      <Select value={declarationData.transportMode} onValueChange={(v) => updateField('transportMode', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {transportModes.map((mode) => (
                            <SelectItem key={mode.value} value={mode.value}>
                              {mode.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Vessel / Flight No.</Label>
                        <Input
                          value={declarationData.vesselFlightNo}
                          onChange={(e) => updateField('vesselFlightNo', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Container No.</Label>
                        <Input
                          value={declarationData.containerNo}
                          onChange={(e) => updateField('containerNo', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Port of Loading</Label>
                        <Input
                          value={declarationData.portOfLoading}
                          onChange={(e) => updateField('portOfLoading', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Port of Discharge</Label>
                        <Input
                          value={declarationData.portOfDischarge}
                          onChange={(e) => updateField('portOfDischarge', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Final Destination</Label>
                      <Input
                        value={declarationData.finalDestination}
                        onChange={(e) => updateField('finalDestination', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Goods Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-[#0F4C81]" />
                      Goods Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Goods Description *</Label>
                      <Textarea
                        value={declarationData.goodsDescription}
                        onChange={(e) => updateField('goodsDescription', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>HS Code</Label>
                        <Input
                          value={declarationData.hsCode}
                          onChange={(e) => updateField('hsCode', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country of Origin</Label>
                        <Input
                          value={declarationData.originCountry}
                          onChange={(e) => updateField('originCountry', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={declarationData.quantity}
                          onChange={(e) => updateField('quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select value={declarationData.quantityUnit} onValueChange={(v) => updateField('quantityUnit', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {quantityUnits.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Gross Weight (kg)</Label>
                        <Input
                          type="number"
                          value={declarationData.grossWeight}
                          onChange={(e) => updateField('grossWeight', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Net Weight (kg)</Label>
                        <Input
                          type="number"
                          value={declarationData.netWeight}
                          onChange={(e) => updateField('netWeight', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Customs Value</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{selectedCurrency?.symbol}</span>
                          <Input
                            type="number"
                            value={declarationData.customsValue}
                            onChange={(e) => updateField('customsValue', parseFloat(e.target.value) || 0)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={declarationData.currency} onValueChange={(v) => updateField('currency', v)}>
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
                  </CardContent>
                </Card>

                {/* Additional Info */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Incoterms</Label>
                        <Select value={declarationData.incoterms} onValueChange={(v) => updateField('incoterms', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EXW">EXW</SelectItem>
                            <SelectItem value="FOB">FOB</SelectItem>
                            <SelectItem value="CIF">CIF</SelectItem>
                            <SelectItem value="CFR">CFR</SelectItem>
                            <SelectItem value="DDP">DDP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Terms</Label>
                        <Input
                          value={declarationData.paymentTerms}
                          onChange={(e) => updateField('paymentTerms', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Invoice No.</Label>
                        <Input
                          value={declarationData.invoiceNo}
                          onChange={(e) => updateField('invoiceNo', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>B/L No.</Label>
                        <Input
                          value={declarationData.billOfLadingNo}
                          onChange={(e) => updateField('billOfLadingNo', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Remarks</Label>
                      <Textarea
                        value={declarationData.remarks}
                        onChange={(e) => updateField('remarks', e.target.value)}
                        rows={2}
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
                Print Declaration
              </Button>
            </div>

            {/* Declaration Preview */}
            <div ref={printRef} className="document-content-only bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8 print:shadow-none print:p-0">
              {/* Header */}
              <div className="text-center border-b-2 border-[#0F4C81] pb-4 mb-6">
                <h1 className="text-2xl font-bold text-[#0F4C81]">EXPORT CUSTOMS DECLARATION</h1>
                <p className="text-lg font-semibold text-slate-600 dark:text-slate-400 mt-1">出口报关单</p>
              </div>

              {/* Declaration Info */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-500">Declaration No.</p>
                  <p className="font-semibold">{declarationData.declarationNo}</p>
                </div>
                <div>
                  <p className="text-slate-500">Declaration Date</p>
                  <p className="font-semibold">{declarationData.declarationDate}</p>
                </div>
                <div>
                  <p className="text-slate-500">Declaration Type</p>
                  <p className="font-semibold uppercase">{declarationData.declarationType}</p>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-[#2E8B57] mb-2">EXPORTER</h3>
                  <p className="font-bold">{declarationData.exporterName || 'Company Name'}</p>
                  <p className="text-sm whitespace-pre-line">{declarationData.exporterAddress}</p>
                  <p className="text-sm">{declarationData.exporterCountry}</p>
                  {declarationData.exporterTaxId && <p className="text-sm">Tax ID: {declarationData.exporterTaxId}</p>}
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-[#0F4C81] mb-2">CONSIGNEE</h3>
                  <p className="font-bold">{declarationData.consigneeName || 'Company Name'}</p>
                  <p className="text-sm whitespace-pre-line">{declarationData.consigneeAddress}</p>
                  <p className="text-sm">{declarationData.consigneeCountry}</p>
                </div>
              </div>

              {/* Transport */}
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-3">TRANSPORT DETAILS</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Transport Mode:</span>
                    <span className="ml-2 font-medium">
                      {transportModes.find(m => m.value === declarationData.transportMode)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Vessel/Flight:</span>
                    <span className="ml-2 font-medium">{declarationData.vesselFlightNo || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Port of Loading:</span>
                    <span className="ml-2 font-medium">{declarationData.portOfLoading || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Port of Discharge:</span>
                    <span className="ml-2 font-medium">{declarationData.portOfDischarge || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Final Destination:</span>
                    <span className="ml-2 font-medium">{declarationData.finalDestination || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Container No.:</span>
                    <span className="ml-2 font-medium">{declarationData.containerNo || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Goods Table */}
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-600 mb-6">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-300 dark:border-slate-600 p-2 text-left text-sm">Description</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">HS Code</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">Qty</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">G.W. (kg)</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">N.W. (kg)</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-2 text-right text-sm">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 p-2 text-sm">
                      {declarationData.goodsDescription || 'Goods Description'}
                      <div className="text-xs text-slate-500">Origin: {declarationData.originCountry || 'N/A'}</div>
                    </td>
                    <td className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">{declarationData.hsCode || '-'}</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">
                      {declarationData.quantity} {declarationData.quantityUnit}
                    </td>
                    <td className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">{declarationData.grossWeight}</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">{declarationData.netWeight}</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-2 text-right text-sm font-medium">
                      {selectedCurrency?.symbol}{declarationData.customsValue.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Trade Terms */}
              <div className="mb-6 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-500">Incoterms:</span>
                    <span className="ml-2 font-medium">{declarationData.incoterms}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Payment Terms:</span>
                    <span className="ml-2 font-medium">{declarationData.paymentTerms}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Invoice No.:</span>
                    <span className="ml-2 font-medium">{declarationData.invoiceNo || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {declarationData.remarks && (
                <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h4 className="font-semibold text-[#0F4C81] mb-2">Remarks</h4>
                  <p className="text-sm whitespace-pre-line">{declarationData.remarks}</p>
                </div>
              )}

              {/* Declaration */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-sm">
                  I hereby declare that the information provided in this export declaration is true and correct
                  to the best of my knowledge. I understand that any false statement may result in penalties
                  under applicable customs laws.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="border-t border-slate-300 dark:border-slate-600 pt-2">
                  <p className="text-sm text-slate-500">Exporter/Authorized Agent Signature</p>
                  <p className="text-sm text-slate-400 mt-8">Signature & Company Stamp</p>
                </div>
                <div className="border-t border-slate-300 dark:border-slate-600 pt-2">
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="text-sm text-slate-400 mt-8">________________</p>
                </div>
              </div>

              {/* Customs Use */}
              <div className="mt-8 p-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                <p className="text-sm text-slate-500 text-center">FOR CUSTOMS USE ONLY</p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Registration No.</p>
                    <p className="text-sm mt-6">_______________</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Customs Officer</p>
                    <p className="text-sm mt-6">_______________</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Date & Stamp</p>
                    <p className="text-sm mt-6">_______________</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
