import { Metadata } from "next";
import ProformaInvoiceGenerator from "@/components/documents/ProformaInvoiceGenerator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Info, CheckCircle2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Proforma Invoice Generator | Shiportrade.com",
  description: "Create professional proforma invoices for international trade. Include product details, HS codes, and payment terms.",
  keywords: ["proforma invoice", "proforma invoice template", "preliminary invoice", "trade document", "export document"],
};

export default function ProformaInvoicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <FileText className="h-3 w-3 mr-2" />
          Trade Document
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Proforma Invoice Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Create professional proforma invoices for your international trade transactions. 
          Include product details with HS codes, shipping information, and payment terms.
        </p>
      </div>

      {/* Generator */}
      <ProformaInvoiceGenerator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              What is a Proforma Invoice?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              A proforma invoice is a preliminary bill of sale sent to buyers in advance of a shipment 
              or delivery of goods. It describes the purchased items and other important information, 
              such as the shipping weight and transport charges.
            </p>
            <p>
              Unlike a commercial invoice, a proforma invoice is not a demand for payment. It&apos;s used 
              for customs purposes, to obtain import licenses, or to arrange financing.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
              When to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Before finalizing a sale to confirm details with the buyer</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>For obtaining import licenses or foreign exchange approvals</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>To open a Letter of Credit (LC) with the bank</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>For customs clearance in certain countries</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>To provide a quote to potential buyers</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-semibold mb-2">Important Tips</p>
              <ul className="space-y-1">
                <li>• Always include a validity period - proforma invoices are typically valid for 30-90 days</li>
                <li>• Include HS codes for all products to facilitate customs clearance</li>
                <li>• Clearly state that this is a proforma invoice and not a final invoice</li>
                <li>• Ensure Incoterms are clearly specified to avoid disputes</li>
                <li>• Once the sale is confirmed, issue a commercial invoice with the same details</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
