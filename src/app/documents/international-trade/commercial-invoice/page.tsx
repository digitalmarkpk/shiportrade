import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CommercialInvoiceGenerator from "@/components/documents/CommercialInvoiceGenerator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Commercial Invoice Generator | Shiportrade.com",
  description: "Generate professional commercial invoices for international trade. Free online tool with PDF export, multiple currencies, and Incoterms support.",
  keywords: ["commercial invoice generator", "invoice template", "trade document", "export invoice", "import invoice"],
};

export default function CommercialInvoicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/documents" className="hover:text-foreground">Documents</Link>
        <span>/</span>
        <Link href="/documents/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Commercial Invoice</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--logistics)]/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-[var(--logistics)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Commercial Invoice Generator</h1>
            <p className="text-muted-foreground">Create professional commercial invoices for international trade</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-logistics text-white">Free Tool</Badge>
          <Badge variant="outline">PDF Export</Badge>
        </div>
      </div>

      {/* Generator */}
      <CommercialInvoiceGenerator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--logistics)]" />
              What is a Commercial Invoice?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              A <strong>commercial invoice</strong> is a legal document between a supplier and a customer 
              that describes the sold goods and the amount due. In international trade, it's required 
              for customs clearance and serves as the primary document for calculating duties and taxes.
            </p>
            <p className="text-muted-foreground mt-3">
              Unlike a proforma invoice (which is preliminary), a commercial invoice is the final bill 
              that demands payment and is used by customs authorities to assess import duties, VAT, 
              and other taxes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-[var(--logistics)]" />
              Required Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Seller and buyer complete details</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Invoice number and date</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Complete product descriptions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>HS codes (recommended)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Quantities and unit prices</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Currency and total value</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Incoterms and payment terms</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Country of origin</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-[var(--logistics)]" />
              When to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Customs Clearance:</strong> Required for all imports
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Payment Collection:</strong> Demands payment from buyer
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>LC Negotiation:</strong> Required for Letters of Credit
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Insurance Claims:</strong> Proof of value for claims
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tips & Mistakes */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-[var(--logistics)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[var(--logistics)]">
              <Lightbulb className="h-5 w-5" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Include HS codes for faster customs clearance
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Match currency with your Letter of Credit requirements
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Ensure Incoterm matches your sales contract
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Include country of origin for each product line
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Sign and stamp the invoice for authenticity
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Mismatched totals or calculation errors
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Missing or incorrect Incoterms
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Vague product descriptions
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Currency not clearly stated
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Inconsistent data with other documents (packing list, B/L)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Difference between Proforma and Commercial Invoice?</AccordionTrigger>
              <AccordionContent>
                A proforma invoice is a preliminary document sent before shipment to confirm order details 
                and can be used for opening Letters of Credit. A commercial invoice is the final, legal 
                document issued after shipment that demands payment and is used for customs clearance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Is a commercial invoice legally binding?</AccordionTrigger>
              <AccordionContent>
                Yes, a commercial invoice is a legal document that serves as evidence of the transaction 
                between buyer and seller. It's used by customs authorities, banks, and courts as proof 
                of the trade transaction and is essential for dispute resolution.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Do I need to include HS codes?</AccordionTrigger>
              <AccordionContent>
                While not always mandatory on the invoice itself, including HS (Harmonized System) codes 
                is highly recommended. They help customs authorities quickly identify and classify goods, 
                speeding up clearance and reducing the risk of delays or misclassification.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Should values match the Letter of Credit?</AccordionTrigger>
              <AccordionContent>
                Absolutely. If payment is via Letter of Credit, the commercial invoice must exactly match 
                the LC terms. Any discrepancies—even minor ones—can result in payment refusal by the bank. 
                Always cross-check all details against the LC before issuing.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Related Tools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Documents</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Proforma Invoice", href: "/documents/international-trade/proforma-invoice" },
            { name: "Packing List", href: "/documents/international-trade/packing-list" },
            { name: "Certificate of Origin", href: "/documents/customs/certificate-of-origin" },
            { name: "Bill of Lading", href: "/documents/ocean-freight/bill-of-lading" },
          ].map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-all hover:border-[var(--logistics)]/50 cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium group-hover:text-[var(--logistics)] transition-colors">
                    {tool.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--logistics)] transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
