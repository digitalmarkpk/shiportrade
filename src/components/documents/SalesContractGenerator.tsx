'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, Eye, Building, Globe, Calendar, DollarSign, Package, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { currencies } from '@/lib/constants/currencies';

interface SalesContractData {
  contractNumber: string;
  contractDate: string;
  currency: string;
  paymentTerms: string;
  incoterms: string;
  
  sellerName: string;
  sellerAddress: string;
  sellerCountry: string;
  sellerContact: string;
  
  buyerName: string;
  buyerAddress: string;
  buyerCountry: string;
  buyerContact: string;
  
  goodsDescription: string;
  quantity: string;
  unitPrice: string;
  totalAmount: string;
  
  portOfLoading: string;
  portOfDischarge: string;
  shipmentDate: string;
  
  qualityStandard: string;
  inspection: string;
  packaging: string;
  
  arbitration: string;
  forceMajeure: boolean;
  additionalTerms: string;
}

export default function SalesContractGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('form');
  const [contractData, setContractData] = useState<SalesContractData>({
    contractNumber: `SC-${Date.now().toString().slice(-8)}`,
    contractDate: new Date().toISOString().split('T')[0],
    currency: 'USD',
    paymentTerms: 'T/T',
    incoterms: 'FOB',
    
    sellerName: '',
    sellerAddress: '',
    sellerCountry: '',
    sellerContact: '',
    
    buyerName: '',
    buyerAddress: '',
    buyerCountry: '',
    buyerContact: '',
    
    goodsDescription: '',
    quantity: '',
    unitPrice: '',
    totalAmount: '',
    
    portOfLoading: '',
    portOfDischarge: '',
    shipmentDate: '',
    
    qualityStandard: '',
    inspection: '',
    packaging: '',
    
    arbitration: 'ICC Paris',
    forceMajeure: true,
    additionalTerms: '',
  });

  const updateField = (field: keyof SalesContractData, value: any) => {
    setContractData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedCurrency = currencies.find(c => c.code === contractData.currency);

  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 no-print">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
                Sales Contract Generator
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Professional international sales contract for global trade transactions
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="form"><FileText className="h-4 w-4 mr-2" />Fill Form</TabsTrigger>
              <TabsTrigger value="preview"><Eye className="h-4 w-4 mr-2" />Preview Contract</TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Contract Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-[#0F4C81]" />
                      Contract Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Contract Number *</Label>
                        <Input value={contractData.contractNumber} onChange={(e) => updateField('contractNumber', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Contract Date *</Label>
                        <Input type="date" value={contractData.contractDate} onChange={(e) => updateField('contractDate', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={contractData.currency} onValueChange={(v) => updateField('currency', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {currencies.map((c) => (<SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Terms</Label>
                        <Select value={contractData.paymentTerms} onValueChange={(v) => updateField('paymentTerms', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="T/T">T/T (Telegraphic Transfer)</SelectItem>
                            <SelectItem value="L/C">L/C (Letter of Credit)</SelectItem>
                            <SelectItem value="D/P">D/P (Documents against Payment)</SelectItem>
                            <SelectItem value="D/A">D/A (Documents against Acceptance)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Incoterms</Label>
                      <Select value={contractData.incoterms} onValueChange={(v) => updateField('incoterms', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                          <SelectItem value="FOB">FOB - Free On Board</SelectItem>
                          <SelectItem value="CIF">CIF - Cost, Insurance and Freight</SelectItem>
                          <SelectItem value="CFR">CFR - Cost and Freight</SelectItem>
                          <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Label>Company Name *</Label>
                      <Input value={contractData.sellerName} onChange={(e) => updateField('sellerName', e.target.value)} placeholder="Seller company name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Address *</Label>
                      <Textarea value={contractData.sellerAddress} onChange={(e) => updateField('sellerAddress', e.target.value)} rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input value={contractData.sellerCountry} onChange={(e) => updateField('sellerCountry', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact</Label>
                        <Input value={contractData.sellerContact} onChange={(e) => updateField('sellerContact', e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Buyer Info */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-[#0F4C81]" />
                      Buyer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input value={contractData.buyerName} onChange={(e) => updateField('buyerName', e.target.value)} placeholder="Buyer company name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Address *</Label>
                      <Textarea value={contractData.buyerAddress} onChange={(e) => updateField('buyerAddress', e.target.value)} rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input value={contractData.buyerCountry} onChange={(e) => updateField('buyerCountry', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact</Label>
                        <Input value={contractData.buyerContact} onChange={(e) => updateField('buyerContact', e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Goods & Shipment */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-[#2E8B57]" />
                      Goods & Shipment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Description of Goods *</Label>
                      <Textarea value={contractData.goodsDescription} onChange={(e) => updateField('goodsDescription', e.target.value)} rows={3} placeholder="Detailed description of goods" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input value={contractData.quantity} onChange={(e) => updateField('quantity', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Price ({selectedCurrency?.symbol})</Label>
                        <Input value={contractData.unitPrice} onChange={(e) => updateField('unitPrice', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Amount</Label>
                        <Input value={contractData.totalAmount} onChange={(e) => updateField('totalAmount', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Port of Loading</Label>
                        <Input value={contractData.portOfLoading} onChange={(e) => updateField('portOfLoading', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Port of Discharge</Label>
                        <Input value={contractData.portOfDischarge} onChange={(e) => updateField('portOfDischarge', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Shipment Date</Label>
                      <Input type="date" value={contractData.shipmentDate} onChange={(e) => updateField('shipmentDate', e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Terms */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                    Additional Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Quality Standard</Label>
                      <Input value={contractData.qualityStandard} onChange={(e) => updateField('qualityStandard', e.target.value)} placeholder="ISO, ASTM, etc." />
                    </div>
                    <div className="space-y-2">
                      <Label>Inspection</Label>
                      <Input value={contractData.inspection} onChange={(e) => updateField('inspection', e.target.value)} placeholder="SGS, BV, etc." />
                    </div>
                    <div className="space-y-2">
                      <Label>Packaging</Label>
                      <Input value={contractData.packaging} onChange={(e) => updateField('packaging', e.target.value)} placeholder="Standard export packing" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Arbitration</Label>
                    <Select value={contractData.arbitration} onValueChange={(v) => updateField('arbitration', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ICC Paris">ICC Paris</SelectItem>
                        <SelectItem value="LCIA London">LCIA London</SelectItem>
                        <SelectItem value="SIAC Singapore">SIAC Singapore</SelectItem>
                        <SelectItem value="CIETAC China">CIETAC China</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Terms & Conditions</Label>
                    <Textarea value={contractData.additionalTerms} onChange={(e) => updateField('additionalTerms', e.target.value)} rows={3} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <div className="flex justify-end gap-3 mb-4 print:hidden">
                <Button onClick={() => setActiveTab('form')} variant="outline"><FileText className="h-4 w-4 mr-2" />Edit Form</Button>
                <Button onClick={handlePrint} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90"><Printer className="h-4 w-4 mr-2" />Print Contract</Button>
              </div>

              <div ref={printRef} className="print-area bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8 print:shadow-none print:p-0">
                <div className="text-center border-b-2 border-[#0F4C81] pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-[#0F4C81]">INTERNATIONAL SALES CONTRACT</h1>
                  <p className="text-sm text-slate-500 mt-2">Contract No: {contractData.contractNumber} | Date: {contractData.contractDate}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-[#2E8B57] mb-2">SELLER</h3>
                    <p className="font-bold">{contractData.sellerName || 'Company Name'}</p>
                    <p className="text-sm whitespace-pre-line">{contractData.sellerAddress}</p>
                    <p className="text-sm">{contractData.sellerCountry}</p>
                    {contractData.sellerContact && <p className="text-sm">Contact: {contractData.sellerContact}</p>}
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-[#0F4C81] mb-2">BUYER</h3>
                    <p className="font-bold">{contractData.buyerName || 'Company Name'}</p>
                    <p className="text-sm whitespace-pre-line">{contractData.buyerAddress}</p>
                    <p className="text-sm">{contractData.buyerCountry}</p>
                    {contractData.buyerContact && <p className="text-sm">Contact: {contractData.buyerContact}</p>}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <h3 className="font-semibold mb-2">ARTICLE 1 - SUBJECT OF CONTRACT</h3>
                    <p className="text-sm">{contractData.goodsDescription || 'Goods description to be specified'}</p>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h3 className="font-semibold mb-2">ARTICLE 2 - QUANTITY AND PRICE</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><span className="text-slate-500">Quantity:</span> <span className="font-medium">{contractData.quantity || 'TBD'}</span></div>
                      <div><span className="text-slate-500">Unit Price:</span> <span className="font-medium">{selectedCurrency?.symbol}{contractData.unitPrice || 'TBD'}</span></div>
                      <div><span className="text-slate-500">Total:</span> <span className="font-medium">{selectedCurrency?.symbol}{contractData.totalAmount || 'TBD'}</span></div>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h3 className="font-semibold mb-2">ARTICLE 3 - DELIVERY TERMS</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500">Incoterms:</span> <span className="font-medium">{contractData.incoterms} (Incoterms 2020)</span></div>
                      <div><span className="text-slate-500">Shipment Date:</span> <span className="font-medium">{contractData.shipmentDate || 'TBD'}</span></div>
                      <div><span className="text-slate-500">Port of Loading:</span> <span className="font-medium">{contractData.portOfLoading || 'TBD'}</span></div>
                      <div><span className="text-slate-500">Port of Discharge:</span> <span className="font-medium">{contractData.portOfDischarge || 'TBD'}</span></div>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h3 className="font-semibold mb-2">ARTICLE 4 - PAYMENT TERMS</h3>
                    <p className="text-sm">Payment shall be made by <span className="font-medium">{contractData.paymentTerms}</span> in <span className="font-medium">{contractData.currency}</span>.</p>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h3 className="font-semibold mb-2">ARTICLE 5 - QUALITY & INSPECTION</h3>
                    <div className="text-sm space-y-1">
                      {contractData.qualityStandard && <p>Quality Standard: {contractData.qualityStandard}</p>}
                      {contractData.inspection && <p>Inspection: {contractData.inspection}</p>}
                      {contractData.packaging && <p>Packaging: {contractData.packaging}</p>}
                    </div>
                  </div>

                  {contractData.forceMajeure && (
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <h3 className="font-semibold mb-2">ARTICLE 6 - FORCE MAJEURE</h3>
                      <p className="text-sm">Neither party shall be liable for any failure or delay in performance due to circumstances beyond their reasonable control, including but not limited to acts of God, war, strike, or natural disasters.</p>
                    </div>
                  )}

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h3 className="font-semibold mb-2">ARTICLE 7 - ARBITRATION</h3>
                    <p className="text-sm">Any dispute arising from this contract shall be settled by arbitration under the rules of <span className="font-medium">{contractData.arbitration}</span>.</p>
                  </div>

                  {contractData.additionalTerms && (
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <h3 className="font-semibold mb-2">ADDITIONAL TERMS</h3>
                      <p className="text-sm whitespace-pre-line">{contractData.additionalTerms}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-8 mt-12">
                  <div className="border-t border-slate-300 dark:border-slate-600 pt-2">
                    <p className="text-sm text-slate-500">For and on behalf of the Seller</p>
                    <p className="text-sm text-slate-400 mt-8">Signature & Company Stamp</p>
                  </div>
                  <div className="border-t border-slate-300 dark:border-slate-600 pt-2">
                    <p className="text-sm text-slate-500">For and on behalf of the Buyer</p>
                    <p className="text-sm text-slate-400 mt-8">Signature & Company Stamp</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
