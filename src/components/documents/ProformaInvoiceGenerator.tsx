"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Building2,
  Calendar,
  Plus,
  Trash2,
  Download,
  Printer,
  Share2,
  Eye,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { currencies, formatCurrency } from "@/lib/constants/currencies";
import { incoterms } from "@/lib/constants/units";

interface LineItem {
  id: string;
  description: string;
  hsCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface ProformaData {
  proformaNumber: string;
  proformaDate: string;
  validUntil: string;
  // Seller info
  sellerName: string;
  sellerAddress: string;
  sellerPhone: string;
  sellerEmail: string;
  // Buyer info
  buyerName: string;
  buyerAddress: string;
  buyerCountry: string;
  // Line items
  lineItems: LineItem[];
  currency: string;
  paymentTerms: string;
  incoterm: string;
  portOfLoading: string;
  portOfDischarge: string;
  countryOfOrigin: string;
  leadTime: string;
  notes: string;
}

const defaultLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: "",
  hsCode: "",
  quantity: 1,
  unit: "PCS",
  unitPrice: 0,
  total: 0,
});

const units = ["PCS", "SET", "KG", "MT", "LBS", "M", "FT", "M2", "M3", "CTN", "ROL", "BOX"];

export default function ProFormaInvoiceGenerator() {
  const [proformaData, setProformaData] = useState<ProformaData>({
    proformaNumber: `PI-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    proformaDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sellerName: "",
    sellerAddress: "",
    sellerPhone: "",
    sellerEmail: "",
    buyerName: "",
    buyerAddress: "",
    buyerCountry: "",
    lineItems: [defaultLineItem()],
    currency: "USD",
    paymentTerms: "TT in Advance",
    incoterm: "FOB",
    portOfLoading: "",
    portOfDischarge: "",
    countryOfOrigin: "",
    leadTime: "30 days after receipt of payment",
    notes: "This proforma invoice is for reference only and does not constitute a contractual offer. Prices and availability are subject to change.",
  });

  const updateField = <K extends keyof ProformaData>(field: K, value: ProformaData[K]) => {
    setProformaData((prev) => ({ ...prev, [field]: value }));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setProformaData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = Number(updated.quantity) * Number(updated.unitPrice);
          }
          return updated;
        }
        return item;
      }),
    }));
  };

  const addLineItem = () => {
    setProformaData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, defaultLineItem()],
    }));
  };

  const removeLineItem = (id: string) => {
    setProformaData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }));
  };

  const subtotal = useMemo(() => {
    return proformaData.lineItems.reduce((sum, item) => sum + item.total, 0);
  }, [proformaData.lineItems]);

  const isValid = useMemo(() => {
    const validUntilDate = new Date(proformaData.validUntil);
    return validUntilDate > new Date(proformaData.proformaDate);
  }, [proformaData.validUntil, proformaData.proformaDate]);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <div className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="parties">Parties</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Proforma Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="proformaNumber">Proforma Number</Label>
                    <Input
                      id="proformaNumber"
                      value={proformaData.proformaNumber}
                      onChange={(e) => updateField("proformaNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proformaDate">Issue Date</Label>
                    <Input
                      id="proformaDate"
                      type="date"
                      value={proformaData.proformaDate}
                      onChange={(e) => updateField("proformaDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={proformaData.validUntil}
                      onChange={(e) => updateField("validUntil", e.target.value)}
                      className={!isValid ? "border-red-500" : ""}
                    />
                    {!isValid && (
                      <p className="text-xs text-red-500">Must be after issue date</p>
                    )}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={proformaData.currency} onValueChange={(v) => updateField("currency", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.slice(0, 15).map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.symbol} {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Terms</Label>
                    <Select value={proformaData.paymentTerms} onValueChange={(v) => updateField("paymentTerms", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TT in Advance">TT in Advance</SelectItem>
                        <SelectItem value="30% Deposit, 70% Before Shipping">30% Deposit, 70% Before Shipping</SelectItem>
                        <SelectItem value="LC at Sight">LC at Sight</SelectItem>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Shipping & Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Incoterm</Label>
                    <Select value={proformaData.incoterm} onValueChange={(v) => updateField("incoterm", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {incoterms.map((term) => (
                          <SelectItem key={term.code} value={term.code}>
                            {term.code} - {term.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadTime">Lead Time</Label>
                    <Input
                      id="leadTime"
                      value={proformaData.leadTime}
                      onChange={(e) => updateField("leadTime", e.target.value)}
                      placeholder="e.g., 30 days after payment"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="portOfLoading">Port of Loading</Label>
                    <Input
                      id="portOfLoading"
                      value={proformaData.portOfLoading}
                      onChange={(e) => updateField("portOfLoading", e.target.value)}
                      placeholder="Origin port"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portOfDischarge">Port of Discharge</Label>
                    <Input
                      id="portOfDischarge"
                      value={proformaData.portOfDischarge}
                      onChange={(e) => updateField("portOfDischarge", e.target.value)}
                      placeholder="Destination port"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                  <Input
                    id="countryOfOrigin"
                    value={proformaData.countryOfOrigin}
                    onChange={(e) => updateField("countryOfOrigin", e.target.value)}
                    placeholder="e.g., China"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parties" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Seller (Exporter)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sellerName">Company Name</Label>
                  <Input
                    id="sellerName"
                    value={proformaData.sellerName}
                    onChange={(e) => updateField("sellerName", e.target.value)}
                    placeholder="Your company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellerAddress">Address</Label>
                  <Textarea
                    id="sellerAddress"
                    value={proformaData.sellerAddress}
                    onChange={(e) => updateField("sellerAddress", e.target.value)}
                    rows={2}
                    placeholder="Full address"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerPhone">Phone</Label>
                    <Input
                      id="sellerPhone"
                      value={proformaData.sellerPhone}
                      onChange={(e) => updateField("sellerPhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerEmail">Email</Label>
                    <Input
                      id="sellerEmail"
                      type="email"
                      value={proformaData.sellerEmail}
                      onChange={(e) => updateField("sellerEmail", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Buyer (Importer)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buyerName">Company Name</Label>
                  <Input
                    id="buyerName"
                    value={proformaData.buyerName}
                    onChange={(e) => updateField("buyerName", e.target.value)}
                    placeholder="Buyer company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerAddress">Address</Label>
                  <Textarea
                    id="buyerAddress"
                    value={proformaData.buyerAddress}
                    onChange={(e) => updateField("buyerAddress", e.target.value)}
                    rows={2}
                    placeholder="Buyer address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerCountry">Country</Label>
                  <Input
                    id="buyerCountry"
                    value={proformaData.buyerCountry}
                    onChange={(e) => updateField("buyerCountry", e.target.value)}
                    placeholder="Buyer country"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
                <CardDescription>
                  Add products with HS codes for customs classification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {proformaData.lineItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Item {index + 1}</span>
                      {proformaData.lineItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2 col-span-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                          placeholder="Product description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>HS Code</Label>
                        <Input
                          value={item.hsCode}
                          onChange={(e) => updateLineItem(item.id, "hsCode", e.target.value)}
                          placeholder="e.g., 9403.70"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select value={item.unit} onValueChange={(v) => updateLineItem(item.id, "unit", v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map((u) => (
                              <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, "quantity", Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, "unitPrice", Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Total</Label>
                        <Input
                          value={formatCurrency(item.total, proformaData.currency)}
                          readOnly
                          className="bg-muted font-medium"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button variant="outline" onClick={addLineItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="other" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes & Disclaimers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={proformaData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Live Preview
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button size="sm" className="gradient-logistics text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Document Preview */}
        <Card className="bg-white dark:bg-card overflow-hidden">
          <div className="p-8" id="proforma-preview">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[var(--logistics)]">PROFORMA INVOICE</h1>
                <div className="text-sm text-muted-foreground mt-1">
                  {proformaData.proformaNumber}
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={isValid ? "default" : "destructive"}
                  className="mb-2"
                >
                  {isValid ? "VALID" : "EXPIRED"}
                </Badge>
                <div className="text-sm">
                  <span className="text-muted-foreground">Issue: </span>
                  {proformaData.proformaDate}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Valid Until: </span>
                  {proformaData.validUntil}
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1 font-semibold">FROM</div>
                <div className="font-semibold">{proformaData.sellerName || "Seller Name"}</div>
                <div className="text-sm text-muted-foreground whitespace-pre-line">{proformaData.sellerAddress || "Seller Address"}</div>
                {proformaData.sellerEmail && (
                  <div className="text-sm text-muted-foreground mt-1">{proformaData.sellerEmail}</div>
                )}
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1 font-semibold">TO</div>
                <div className="font-semibold">{proformaData.buyerName || "Buyer Name"}</div>
                <div className="text-sm text-muted-foreground whitespace-pre-line">{proformaData.buyerAddress || "Buyer Address"}</div>
                {proformaData.buyerCountry && (
                  <div className="text-sm text-muted-foreground mt-1">{proformaData.buyerCountry}</div>
                )}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="p-3 bg-muted/20 rounded">
                <span className="text-muted-foreground">Incoterm: </span>
                <span className="font-medium">{proformaData.incoterm}</span>
              </div>
              <div className="p-3 bg-muted/20 rounded">
                <span className="text-muted-foreground">Lead Time: </span>
                <span className="font-medium">{proformaData.leadTime}</span>
              </div>
              <div className="p-3 bg-muted/20 rounded">
                <span className="text-muted-foreground">From: </span>
                <span className="font-medium">{proformaData.portOfLoading || "—"}</span>
              </div>
              <div className="p-3 bg-muted/20 rounded">
                <span className="text-muted-foreground">To: </span>
                <span className="font-medium">{proformaData.portOfDischarge || "—"}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-6">
              <thead>
                <tr className="border-b-2 border-border bg-muted/20">
                  <th className="text-left py-2 px-2 text-xs font-semibold">Description</th>
                  <th className="text-center py-2 px-2 text-xs font-semibold w-20">HS Code</th>
                  <th className="text-center py-2 px-2 text-xs font-semibold w-14">Qty</th>
                  <th className="text-center py-2 px-2 text-xs font-semibold w-14">Unit</th>
                  <th className="text-right py-2 px-2 text-xs font-semibold w-20">Unit Price</th>
                  <th className="text-right py-2 px-2 text-xs font-semibold w-24">Amount</th>
                </tr>
              </thead>
              <tbody>
                {proformaData.lineItems.map((item, index) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="py-2 px-2 text-sm">{item.description || `Product ${index + 1}`}</td>
                    <td className="py-2 px-2 text-sm text-center">{item.hsCode || "—"}</td>
                    <td className="py-2 px-2 text-sm text-center">{item.quantity}</td>
                    <td className="py-2 px-2 text-sm text-center">{item.unit}</td>
                    <td className="py-2 px-2 text-sm text-right">
                      {formatCurrency(item.unitPrice, proformaData.currency)}
                    </td>
                    <td className="py-2 px-2 text-sm text-right font-medium">
                      {formatCurrency(item.total, proformaData.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td colSpan={5} className="py-3 px-2 text-right font-semibold text-sm">TOTAL:</td>
                  <td className="py-3 px-2 text-right font-bold text-[var(--logistics)]">
                    {formatCurrency(subtotal, proformaData.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Payment & Notes */}
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="font-semibold mb-2">Payment Terms</div>
                <div className="text-muted-foreground">{proformaData.paymentTerms}</div>
                <div className="font-semibold mt-3 mb-1">Country of Origin</div>
                <div className="text-muted-foreground">{proformaData.countryOfOrigin || "—"}</div>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Notes
                </div>
                <div className="text-muted-foreground text-xs whitespace-pre-line">{proformaData.notes}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
              <p>This is a preliminary invoice and does not constitute a binding contract.</p>
              <p className="mt-1">Generated by www.shiportrade.com</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
