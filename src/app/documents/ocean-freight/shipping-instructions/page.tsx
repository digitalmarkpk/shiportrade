import { Metadata } from "next";
import { ShippingInstructionsGenerator } from "@/components/documents/ShippingInstructionsGenerator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Info, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Instructions Generator | Shiportrade.com",
  description: "Create Shipping Instructions (SI) for ocean freight bookings. Include shipper, consignee, container details, and special handling requirements.",
  keywords: ["shipping instructions", "SI form", "ocean freight booking", "export documentation", "container booking"],
};

export default function ShippingInstructionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <FileText className="h-3 w-3 mr-2" />
          Ocean Freight Document
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Shipping Instructions Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Create professional Shipping Instructions (SI) for your ocean freight bookings.
          Provide complete details to ensure accurate Bill of Lading issuance.
        </p>
      </div>

      {/* Generator */}
      <ShippingInstructionsGenerator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              What are Shipping Instructions?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Shipping Instructions (SI) are the shipper&apos;s formal instructions to the carrier 
              or freight forwarder about how the cargo should be handled and documented. 
              The information provided in the SI is used to prepare the Bill of Lading.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Required for all export shipments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Must be submitted before SI cutoff</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Forms the basis for B/L preparation</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--logistics)]" />
              SI Submission Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li><strong>Standard:</strong> 48-72 hours before vessel arrival</li>
              <li><strong>US Exports:</strong> At least 24 hours before loading</li>
              <li><strong>DG Cargo:</strong> Additional 24-48 hours for review</li>
              <li><strong>Reefers:</strong> Temperature settings must be specified</li>
            </ul>
            <p className="mt-3 text-amber-600 dark:text-amber-400 text-xs">
              Late SI submission may result in amendments, rollover, or additional charges.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-semibold mb-2">Important Notes</p>
              <ul className="space-y-1">
                <li>• Ensure all information is accurate - errors may result in B/L amendments</li>
                <li>• Container numbers must match the physical containers delivered to terminal</li>
                <li>• Weights must match VGM declaration</li>
                <li>• HS codes should match commercial invoice and packing list</li>
                <li>• For DG cargo, separate IMO declaration form is required</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
