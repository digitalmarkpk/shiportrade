import { Metadata } from "next";
import { CertificateOfOriginGenerator } from "@/components/documents/CertificateOfOriginGenerator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Info, AlertTriangle, CheckCircle2, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Certificate of Origin Generator | Shiportrade.com",
  description: "Create Certificates of Origin for international trade. Non-preferential and FTA preferential certificates with HS codes and origin criteria.",
  keywords: ["certificate of origin", "CO", "origin certificate", "FTA certificate", "Form A", "preferential origin"],
};

export default function CertificateOfOriginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Globe className="h-3 w-3 mr-2" />
          Customs Document
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Certificate of Origin Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Create Certificates of Origin for your international shipments. 
          Support for non-preferential and FTA preferential certificates.
        </p>
      </div>

      {/* Generator */}
      <CertificateOfOriginGenerator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              What is a Certificate of Origin?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              A Certificate of Origin (CO) is an international trade document attesting that 
              goods in a shipment are wholly obtained, produced, or manufactured in a 
              particular country. It serves as a declaration by the exporter.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Non-Preferential:</strong> Standard CO for trade statistics and origin verification</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Preferential:</strong> FTA certificates for duty reductions or exemptions</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--logistics)]" />
              Common Certificate Types
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li><strong>Non-Preferential CO:</strong> General trade, no tariff benefits</li>
              <li><strong>Form A (GSP):</strong> Generalized System of Preferences benefits</li>
              <li><strong>Form D:</strong> ASEAN Free Trade Area preferential tariff</li>
              <li><strong>Form E:</strong> ASEAN-China Free Trade Area</li>
              <li><strong>USMCA Certificate:</strong> US-Mexico-Canada Agreement</li>
              <li><strong>CETA Certificate:</strong> Canada-EU Trade Agreement</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Requirements */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-semibold mb-2">Important Requirements</p>
              <ul className="space-y-1">
                <li>• Certificates must be issued by authorized bodies (Chamber of Commerce, Customs)</li>
                <li>• For preferential CO, goods must meet Rules of Origin requirements</li>
                <li>• HS codes must match across all shipping documents</li>
                <li>• Certificate validity is typically 12 months from date of issue</li>
                <li>• Some countries require legalization by their embassy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
