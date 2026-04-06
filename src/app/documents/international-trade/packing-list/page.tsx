import { Metadata } from "next";
import { PackingListGenerator } from "@/components/documents/PackingListGenerator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Info, AlertTriangle, CheckCircle2, Weight } from "lucide-react";

export const metadata: Metadata = {
  title: "Packing List Generator | Shiportrade.com",
  description: "Create professional packing lists for international shipments. Include detailed carton contents, weights, and dimensions.",
  keywords: ["packing list", "packing list template", "shipping document", "export packing list", "carton details"],
};

export default function PackingListPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Package className="h-3 w-3 mr-2" />
          Trade Document
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Packing List Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Create detailed packing lists for your international shipments. 
          Include carton contents, weights, dimensions, and totals for customs and logistics.
        </p>
      </div>

      {/* Generator */}
      <PackingListGenerator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              What is a Packing List?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              A packing list is a shipping document that accompanies delivery packages, 
              typically inside an attached pouch or inside the package itself. It includes 
              details about the shipment contents, including:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Detailed description of each item/package</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Quantity, weight (net and gross), and dimensions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Carton numbers and shipping marks</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Total number of packages and total weight</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Weight className="h-5 w-5 text-[var(--logistics)]" />
              Why is it Important?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <ul className="space-y-2">
              <li><strong>Customs Clearance:</strong> Required by customs to verify cargo contents</li>
              <li><strong>Inventory Management:</strong> Helps receiver check shipment completeness</li>
              <li><strong>Insurance Claims:</strong> Documents contents for potential claims</li>
              <li><strong>Logistics Planning:</strong> Helps plan warehousing and distribution</li>
              <li><strong>Bank Requirements:</strong> Often required for Letter of Credit</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Best Practices</p>
              <ul className="space-y-1">
                <li>• Ensure weights match those declared on the commercial invoice</li>
                <li>• Use consistent carton numbering with shipping marks</li>
                <li>• Include both net weight (goods only) and gross weight (including packaging)</li>
                <li>• Dimensions should be in centimeters for international shipments</li>
                <li>• Cross-check totals with the bill of lading</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
