'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Printer, Download, Eye, Building, Globe, Calendar, DollarSign, Package, Info, AlertTriangle } from 'lucide-react';
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
import PrintableDocument from './PrintableDocument';

interface InvoiceItem {
  id: string;
  description: string;
  hsCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  netWeight: number;
  grossWeight: number;
  origin: string;
}

interface CommercialInvoiceData {
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  purchaseOrderNo: string;
  paymentTerms: string;
  incoterms: string;
  currency: string;
  
  // Seller Info
  sellerName: string;
  sellerAddress: string;
  sellerCountry: string;
  sellerTaxId: string;
  sellerContact: string;
  
  // Buyer Info
  buyerName: string;
  buyerAddress: string;
  buyerCountry: string;
  buyerTaxId: string;
  buyerContact: string;
  
  // Consignee (if different)
  consigneeName: string;
  consigneeAddress: string;
  
  // Shipping Details
  vesselName: string;
  voyageNo: string;
  portOfLoading: string;
  portOfDischarge: string;
  finalDestination: string;
  countryOfOrigin: string;
  billOfLadingNo: string;
  
  // Items
  items: InvoiceItem[];
  
  // Totals
  totalQuantity: number;
  totalValue: number;
  totalNetWeight: number;
  totalGrossWeight: number;
  
  // Additional
  marksAndNumbers: string;
  additionalInfo: string;
  declaration: boolean;
  certificationRequired: boolean;
}

// Incoterms list for international trade

const incotermsList = [
  { code: 'EXW', description: 'Ex Works' },
  { code: 'FCA', description: 'Free Carrier' },
  { code: 'FAS', description: 'Free Alongside Ship' },
  { code: 'FOB', description: 'Free On Board' },
  { code: 'CFR', description: 'Cost and Freight' },
  { code: 'CIF', description: 'Cost, Insurance and Freight' },
  { code: 'CPT', description: 'Carriage Paid To' },
  { code: 'CIP', description: 'Carriage and Insurance Paid To' },
  { code: 'DAP', description: 'Delivered at Place' },
  { code: 'DPU', description: 'Delivered at Place Unloaded' },
  { code: 'DDP', description: 'Delivered Duty Paid' },
];

const paymentTermsList = [
  { code: 'T/T', description: 'Telegraphic Transfer' },
  { code: 'L/C', description: 'Letter of Credit' },
  { code: 'D/P', description: 'Documents against Payment' },
  { code: 'D/A', description: 'Documents against Acceptance' },
  { code: 'O/A', description: 'Open Account' },
  { code: 'CAD', description: 'Cash Against Documents' },
];

export default function CommercialInvoiceGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('form');
  const [invoiceData, setInvoiceData] = useState<CommercialInvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-8)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    purchaseOrderNo: '',
    paymentTerms: 'T/T',
    incoterms: 'FOB',
    currency: 'USD',
    
    sellerName: '',
    sellerAddress: '',
    sellerCountry: '',
    sellerTaxId: '',
    sellerContact: '',
    
    buyerName: '',
    buyerAddress: '',
    buyerCountry: '',
    buyerTaxId: '',
    buyerContact: '',
    
    consigneeName: '',
    consigneeAddress: '',
    
    vesselName: '',
    voyageNo: '',
    portOfLoading: '',
    portOfDischarge: '',
    finalDestination: '',
    countryOfOrigin: '',
    billOfLadingNo: '',
    
    items: [
      {
        id: '1',
        description: '',
        hsCode: '',
        quantity: 1,
        unit: 'PCS',
        unitPrice: 0,
        totalValue: 0,
        netWeight: 0,
        grossWeight: 0,
        origin: '',
      },
    ],
    
    totalQuantity: 0,
    totalValue: 0,
    totalNetWeight: 0,
    totalGrossWeight: 0,
    
    marksAndNumbers: '',
    additionalInfo: '',
    declaration: true,
    certificationRequired: false,
  });

  const updateField = (field: keyof CommercialInvoiceData, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      hsCode: '',
      quantity: 1,
      unit: 'PCS',
      unitPrice: 0,
      totalValue: 0,
      netWeight: 0,
      grossWeight: 0,
      origin: invoiceData.countryOfOrigin,
    };
    updateField('items', [...invoiceData.items, newItem]);
  };

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      updateField('items', invoiceData.items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalValue = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      }
      return item;
    });
    updateField('items', updatedItems);
  };

  const calculateTotals = () => {
    const totals = invoiceData.items.reduce(
      (acc, item) => ({
        totalQuantity: acc.totalQuantity + Number(item.quantity),
        totalValue: acc.totalValue + Number(item.totalValue),
        totalNetWeight: acc.totalNetWeight + Number(item.netWeight),
        totalGrossWeight: acc.totalGrossWeight + Number(item.grossWeight),
      }),
      { totalQuantity: 0, totalValue: 0, totalNetWeight: 0, totalGrossWeight: 0 }
    );
    updateField('totalQuantity', totals.totalQuantity);
    updateField('totalValue', totals.totalValue);
    updateField('totalNetWeight', totals.totalNetWeight);
    updateField('totalGrossWeight', totals.totalGrossWeight);
  };

  const handlePrint = () => {
    calculateTotals();
    
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
      
      // Style the clone for print
      clone.style.cssText = `
        background: white;
        width: 100%;
        box-shadow: none;
        border: none;
        border-radius: 0;
      `;
      
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
    document.title = `Commercial_Invoice_${invoiceData.invoiceNumber || 'Document'}`;
    
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

  const selectedCurrency = currencies.find(c => c.code === invoiceData.currency);
  const selectedIncoterm = incotermsList.find(i => i.code === invoiceData.incoterms);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 no-print"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Commercial Invoice Generator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Professional international trade commercial invoice with multiple Incoterms support, real-time preview and print
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto no-print">
            <TabsTrigger value="form">
              <FileText className="h-4 w-4 mr-2" />
              Fill Form
            </TabsTrigger>
            <TabsTrigger value="preview" onClick={calculateTotals}>
              <Eye className="h-4 w-4 mr-2" />
              Preview Invoice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6 no-print">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Invoice Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-[#0F4C81]" />
                      Invoice Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                        <Input
                          id="invoiceNumber"
                          value={invoiceData.invoiceNumber}
                          onChange={(e) => updateField('invoiceNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="invoiceDate">Invoice Date *</Label>
                        <Input
                          id="invoiceDate"
                          type="date"
                          value={invoiceData.invoiceDate}
                          onChange={(e) => updateField('invoiceDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="purchaseOrderNo">P.O. Number</Label>
                        <Input
                          id="purchaseOrderNo"
                          value={invoiceData.purchaseOrderNo}
                          onChange={(e) => updateField('purchaseOrderNo', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={invoiceData.currency} onValueChange={(v) => updateField('currency', v)}>
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentTerms">Payment Terms</Label>
                        <Select value={invoiceData.paymentTerms} onValueChange={(v) => updateField('paymentTerms', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentTermsList.map((p) => (
                              <SelectItem key={p.code} value={p.code}>
                                {p.code} - {p.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="incoterms">Incoterms</Label>
                        <Select value={invoiceData.incoterms} onValueChange={(v) => updateField('incoterms', v)}>
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
                    </div>
                  </CardContent>
                </Card>

                {/* Seller Info */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5 text-[#2E8B57]" />
                      Seller Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sellerName">Company Name *</Label>
                      <Input
                        id="sellerName"
                        value={invoiceData.sellerName}
                        onChange={(e) => updateField('sellerName', e.target.value)}
                        placeholder="SHIPTERADE CO., LTD."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellerAddress">Address *</Label>
                      <Textarea
                        id="sellerAddress"
                        value={invoiceData.sellerAddress}
                        onChange={(e) => updateField('sellerAddress', e.target.value)}
                        placeholder="Full address"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sellerCountry">Country/Region</Label>
                        <Input
                          id="sellerCountry"
                          value={invoiceData.sellerCountry}
                          onChange={(e) => updateField('sellerCountry', e.target.value)}
                          placeholder="China"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sellerTaxId">Tax ID / VAT No.</Label>
                        <Input
                          id="sellerTaxId"
                          value={invoiceData.sellerTaxId}
                          onChange={(e) => updateField('sellerTaxId', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellerContact">Contact Person / Phone</Label>
                      <Input
                        id="sellerContact"
                        value={invoiceData.sellerContact}
                        onChange={(e) => updateField('sellerContact', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Buyer Info */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="h-5 w-5 text-[#0F4C81]" />
                      Buyer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyerName">Company Name *</Label>
                      <Input
                        id="buyerName"
                        value={invoiceData.buyerName}
                        onChange={(e) => updateField('buyerName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyerAddress">Address *</Label>
                      <Textarea
                        id="buyerAddress"
                        value={invoiceData.buyerAddress}
                        onChange={(e) => updateField('buyerAddress', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="buyerCountry">Country/Region</Label>
                        <Input
                          id="buyerCountry"
                          value={invoiceData.buyerCountry}
                          onChange={(e) => updateField('buyerCountry', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="buyerTaxId">Tax ID / VAT No.</Label>
                        <Input
                          id="buyerTaxId"
                          value={invoiceData.buyerTaxId}
                          onChange={(e) => updateField('buyerTaxId', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyerContact">Contact Person / Phone</Label>
                      <Input
                        id="buyerContact"
                        value={invoiceData.buyerContact}
                        onChange={(e) => updateField('buyerContact', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Shipping Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-[#2E8B57]" />
                      Shipping Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vesselName">Vessel / Flight No.</Label>
                        <Input
                          id="vesselName"
                          value={invoiceData.vesselName}
                          onChange={(e) => updateField('vesselName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="voyageNo">Voyage No.</Label>
                        <Input
                          id="voyageNo"
                          value={invoiceData.voyageNo}
                          onChange={(e) => updateField('voyageNo', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="portOfLoading">Port of Loading</Label>
                        <Input
                          id="portOfLoading"
                          value={invoiceData.portOfLoading}
                          onChange={(e) => updateField('portOfLoading', e.target.value)}
                          placeholder="Shanghai, China"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portOfDischarge">Port of Discharge</Label>
                        <Input
                          id="portOfDischarge"
                          value={invoiceData.portOfDischarge}
                          onChange={(e) => updateField('portOfDischarge', e.target.value)}
                          placeholder="Los Angeles, USA"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="finalDestination">Final Destination</Label>
                        <Input
                          id="finalDestination"
                          value={invoiceData.finalDestination}
                          onChange={(e) => updateField('finalDestination', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                        <Input
                          id="countryOfOrigin"
                          value={invoiceData.countryOfOrigin}
                          onChange={(e) => updateField('countryOfOrigin', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billOfLadingNo">Bill of Lading No.</Label>
                      <Input
                        id="billOfLadingNo"
                        value={invoiceData.billOfLadingNo}
                        onChange={(e) => updateField('billOfLadingNo', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Items */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                      Product Details
                    </CardTitle>
                    <div className="flex justify-end">
                      <Button size="sm" onClick={addItem} variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {invoiceData.items.map((item, index) => (
                      <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">Item {index + 1}</Badge>
                          {invoiceData.items.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 space-y-2">
                            <Label>Description of Goods</Label>
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Detailed product description"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>HS Code</Label>
                            <Input
                              value={item.hsCode}
                              onChange={(e) => updateItem(item.id, 'hsCode', e.target.value)}
                              placeholder="6-10 digit code"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Origin</Label>
                            <Input
                              value={item.origin}
                              onChange={(e) => updateItem(item.id, 'origin', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Unit</Label>
                            <Select value={item.unit} onValueChange={(v) => updateItem(item.id, 'unit', v)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PCS">PCS (Pieces)</SelectItem>
                                <SelectItem value="SETS">SETS (Sets)</SelectItem>
                                <SelectItem value="KG">KG (Kilograms)</SelectItem>
                                <SelectItem value="MT">MT (Metric Tons)</SelectItem>
                                <SelectItem value="CBM">CBM (Cubic Meters)</SelectItem>
                                <SelectItem value="CTN">CTN (Cartons)</SelectItem>
                                <SelectItem value="ROLL">ROLL (Rolls)</SelectItem>
                                <SelectItem value="M">M (Meters)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Unit Price ({selectedCurrency?.symbol})</Label>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Total Value ({selectedCurrency?.symbol})</Label>
                            <Input
                              type="number"
                              value={item.totalValue}
                              onChange={(e) => updateItem(item.id, 'totalValue', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Net Weight (KG)</Label>
                            <Input
                              type="number"
                              value={item.netWeight}
                              onChange={(e) => updateItem(item.id, 'netWeight', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Gross Weight (KG)</Label>
                            <Input
                              type="number"
                              value={item.grossWeight}
                              onChange={(e) => updateItem(item.id, 'grossWeight', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Additional Options */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Marks & Numbers</Label>
                      <Textarea
                        value={invoiceData.marksAndNumbers}
                        onChange={(e) => updateField('marksAndNumbers', e.target.value)}
                        placeholder="Shipping marks and numbers"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Notes</Label>
                      <Textarea
                        value={invoiceData.additionalInfo}
                        onChange={(e) => updateField('additionalInfo', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="declaration"
                          checked={invoiceData.declaration}
                          onCheckedChange={(checked) => updateField('declaration', checked)}
                        />
                        <Label htmlFor="declaration" className="text-sm">Include Origin Declaration</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="certification"
                          checked={invoiceData.certificationRequired}
                          onCheckedChange={(checked) => updateField('certificationRequired', checked)}
                        />
                        <Label htmlFor="certification" className="text-sm">Certification Required</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <PrintableDocument documentTitle={`Commercial-Invoice-${invoiceData.invoiceNumber}`}>
              {/* Invoice Preview */}
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8">
                {/* Header */}
                <div className="text-center border-b-2 border-[#0F4C81] pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-[#0F4C81]">COMMERCIAL INVOICE</h1>
                </div>

                {/* Invoice Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-slate-500">Invoice No.</p>
                    <p className="font-semibold">{invoiceData.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-semibold">{invoiceData.invoiceDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">P.O. No.</p>
                    <p className="font-semibold">{invoiceData.purchaseOrderNo || 'N/A'}</p>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-[#2E8B57] mb-2">SELLER</h3>
                    <p className="font-bold">{invoiceData.sellerName || 'Company Name'}</p>
                    <p className="text-sm whitespace-pre-line">{invoiceData.sellerAddress}</p>
                    <p className="text-sm">{invoiceData.sellerCountry}</p>
                    {invoiceData.sellerTaxId && <p className="text-sm">Tax ID: {invoiceData.sellerTaxId}</p>}
                    {invoiceData.sellerContact && <p className="text-sm">Contact: {invoiceData.sellerContact}</p>}
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-[#0F4C81] mb-2">BUYER</h3>
                    <p className="font-bold">{invoiceData.buyerName || 'Company Name'}</p>
                    <p className="text-sm whitespace-pre-line">{invoiceData.buyerAddress}</p>
                    <p className="text-sm">{invoiceData.buyerCountry}</p>
                    {invoiceData.buyerTaxId && <p className="text-sm">Tax ID: {invoiceData.buyerTaxId}</p>}
                    {invoiceData.buyerContact && <p className="text-sm">Contact: {invoiceData.buyerContact}</p>}
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="w-32 text-slate-500">Vessel/Flight:</span>
                      <span className="font-medium">{invoiceData.vesselName || 'TBD'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500">Voyage No.:</span>
                      <span className="font-medium">{invoiceData.voyageNo || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500">B/L No.:</span>
                      <span className="font-medium">{invoiceData.billOfLadingNo || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="w-32 text-slate-500">From:</span>
                      <span className="font-medium">{invoiceData.portOfLoading || 'TBD'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500">To:</span>
                      <span className="font-medium">{invoiceData.portOfDischarge || 'TBD'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500">Destination:</span>
                      <span className="font-medium">{invoiceData.finalDestination || 'TBD'}</span>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex gap-8 mb-6 text-sm">
                  <div className="flex">
                    <span className="text-slate-500 mr-2">Terms of Payment:</span>
                    <span className="font-medium">{invoiceData.paymentTerms}</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 mr-2">Incoterms:</span>
                    <span className="font-medium">{invoiceData.incoterms} ({selectedIncoterm?.description})</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 mr-2">Country of Origin:</span>
                    <span className="font-medium">{invoiceData.countryOfOrigin || 'TBD'}</span>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse border border-slate-300 dark:border-slate-600 mb-6">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="border border-slate-300 dark:border-slate-600 p-2 text-left text-sm">No.</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-2 text-left text-sm">Description</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">HS Code</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">Qty</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">Unit</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-2 text-right text-sm">Unit Price</th>
                      <th className="border border-slate-300 dark:border-slate-600 p-2 text-right text-sm">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">{index + 1}</td>
                        <td className="border border-slate-300 dark:border-slate-600 p-2 text-sm">
                          {item.description || 'Item Description'}
                          <div className="text-xs text-slate-500">Origin: {item.origin || 'N/A'}</div>
                        </td>
                        <td className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">{item.hsCode || '-'}</td>
                        <td className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">{item.quantity}</td>
                        <td className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm">{item.unit}</td>
                        <td className="border border-slate-300 dark:border-slate-600 p-2 text-right text-sm">{selectedCurrency?.symbol}{item.unitPrice.toFixed(2)}</td>
                        <td className="border border-slate-300 dark:border-slate-600 p-2 text-right text-sm font-medium">{selectedCurrency?.symbol}{item.totalValue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td colSpan={3} className="border border-slate-300 dark:border-slate-600 p-2 text-sm font-medium">Total:</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-2 text-center text-sm font-medium">{invoiceData.totalQuantity}</td>
                      <td className="border border-slate-300 dark:border-slate-600 p-2"></td>
                      <td className="border border-slate-300 dark:border-slate-600 p-2"></td>
                      <td className="border border-slate-300 dark:border-slate-600 p-2 text-right text-sm font-bold text-[#0F4C81]">
                        {selectedCurrency?.symbol}{invoiceData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Weights */}
                <div className="flex gap-8 mb-6 text-sm">
                  <div className="flex">
                    <span className="text-slate-500 mr-2">Total Net Weight:</span>
                    <span className="font-medium">{invoiceData.totalNetWeight} KGS</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 mr-2">Total Gross Weight:</span>
                    <span className="font-medium">{invoiceData.totalGrossWeight} KGS</span>
                  </div>
                </div>

                {/* Marks & Numbers */}
                {invoiceData.marksAndNumbers && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-1">Marks & Numbers:</h4>
                    <p className="text-sm whitespace-pre-line border border-slate-200 dark:border-slate-700 rounded p-2">{invoiceData.marksAndNumbers}</p>
                  </div>
                )}

                {/* Declaration */}
                {invoiceData.declaration && (
                  <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-sm">
                      <strong>Declaration:</strong> We hereby certify that the goods described above are of 
                      {invoiceData.countryOfOrigin ? ` ${invoiceData.countryOfOrigin}` : ' the stated'} origin 
                      and that the information contained in this invoice is true and correct.
                    </p>
                  </div>
                )}

                {/* Additional Info */}
                {invoiceData.additionalInfo && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-1">Additional Information:</h4>
                    <p className="text-sm whitespace-pre-line">{invoiceData.additionalInfo}</p>
                  </div>
                )}

                {/* Signature Area */}
                <div className="grid grid-cols-2 gap-8 mt-12 pt-6 border-t">
                  <div>
                    <p className="text-sm font-semibold mb-12">Authorized Signature:</p>
                    <div className="border-b border-slate-300"></div>
                    <p className="text-xs text-slate-500 mt-2">Name & Title</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-12">Company Stamp:</p>
                    <div className="border border-slate-300 h-20 flex items-center justify-center text-slate-400 text-xs">
                      [Company Stamp / Seal]
                    </div>
                  </div>
                </div>
              </div>
            </PrintableDocument>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
