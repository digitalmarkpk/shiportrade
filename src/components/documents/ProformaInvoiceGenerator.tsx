'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Building2, 
  User, 
  Calendar, 
  CreditCard, 
  Globe,
  Calculator,
  Download,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function ProFormaInvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState({
    // Section 1: Parties
    sellerName: '',
    sellerAddress: '',
    sellerContact: '',
    buyerName: '',
    buyerAddress: '',
    buyerContact: '',
    
    // Section 2: Invoice Details
    invoiceNumber: `PI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    paymentTerms: 'Net 30',
    incoterms: 'FOB',
    currency: 'USD',
    
    // Section 3: Items
    items: [
      { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
    ] as LineItem[],
    
    // Section 4: Totals
    taxRate: 0,
    subtotal: 0,
    taxAmount: 0,
    grandTotal: 0,
    notes: ''
  });

  // Calculate totals whenever items or tax rate changes
  useEffect(() => {
    const subtotal = invoiceData.items.reduce((acc, item) => acc + item.total, 0);
    const taxAmount = (subtotal * invoiceData.taxRate) / 100;
    const grandTotal = subtotal + taxAmount;
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      grandTotal
    }));
  }, [invoiceData.items, invoiceData.taxRate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    if (invoiceData.items.length === 1) return;
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 no-print">
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print Preview
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Seller Details */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Seller Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sellerName">Company Name</Label>
              <Input 
                id="sellerName" 
                name="sellerName" 
                placeholder="Your Company Ltd." 
                value={invoiceData.sellerName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellerAddress">Address</Label>
              <Textarea 
                id="sellerAddress" 
                name="sellerAddress" 
                placeholder="123 Business Ave, Trade City" 
                value={invoiceData.sellerAddress}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellerContact">Contact Details</Label>
              <Input 
                id="sellerContact" 
                name="sellerContact" 
                placeholder="Email, Phone, etc." 
                value={invoiceData.sellerContact}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Buyer Details */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Buyer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buyerName">Customer Name</Label>
              <Input 
                id="buyerName" 
                name="buyerName" 
                placeholder="Client Company Ltd." 
                value={invoiceData.buyerName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerAddress">Address</Label>
              <Textarea 
                id="buyerAddress" 
                name="buyerAddress" 
                placeholder="456 Market St, Global Port" 
                value={invoiceData.buyerAddress}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerContact">Contact Details</Label>
              <Input 
                id="buyerContact" 
                name="buyerContact" 
                placeholder="Email, Phone, etc." 
                value={invoiceData.buyerContact}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Invoice Details */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Invoice Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">PI Number</Label>
              <Input 
                id="invoiceNumber" 
                name="invoiceNumber" 
                value={invoiceData.invoiceNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Issue Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date"
                value={invoiceData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select 
                value={invoiceData.paymentTerms} 
                onValueChange={(v) => handleSelectChange('paymentTerms', v)}
              >
                <SelectTrigger id="paymentTerms">
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                  <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                  <SelectItem value="T/T in Advance">T/T in Advance</SelectItem>
                  <SelectItem value="L/C at Sight">L/C at Sight</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incoterms">Incoterms 2020</Label>
              <Select 
                value={invoiceData.incoterms} 
                onValueChange={(v) => handleSelectChange('incoterms', v)}
              >
                <SelectTrigger id="incoterms">
                  <SelectValue placeholder="Select Incoterm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                  <SelectItem value="FOB">FOB - Free on Board</SelectItem>
                  <SelectItem value="CIF">CIF - Cost, Insurance & Freight</SelectItem>
                  <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
                  <SelectItem value="CIP">CIP - Carriage & Insurance Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Items Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Line Items
            </CardTitle>
            <CardDescription>Add the goods or services being quoted</CardDescription>
          </div>
          <Button onClick={addItem} size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[40%] pl-6">Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price ({invoiceData.currency})</TableHead>
                <TableHead className="text-right">Total ({invoiceData.currency})</TableHead>
                <TableHead className="w-[80px] pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-6">
                    <Input 
                      className="border-none focus-visible:ring-1 shadow-none" 
                      placeholder="Item name or description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      className="text-right border-none focus-visible:ring-1 shadow-none" 
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      className="text-right border-none focus-visible:ring-1 shadow-none" 
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="pr-6">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 4: Totals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea 
            id="notes" 
            name="notes" 
            placeholder="Special instructions, bank details, or terms..." 
            className="h-32"
            value={invoiceData.notes}
            onChange={handleInputChange}
          />
        </div>
        
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="font-semibold">{invoiceData.currency} {invoiceData.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">Tax Rate (%)</span>
                <Input 
                  type="number" 
                  className="w-20 h-8 text-right bg-background" 
                  value={invoiceData.taxRate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                />
              </div>
              <span className="font-semibold">{invoiceData.currency} {invoiceData.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Grand Total</span>
              <span className="text-2xl font-black text-primary">
                {invoiceData.currency} {invoiceData.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
