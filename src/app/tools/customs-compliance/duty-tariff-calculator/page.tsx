import { Metadata } from "next";
import { DutyTariffCalculator } from "@/components/tools/DutyTariffCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent, AlertTriangle, FileCheck, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Duty & Tariff Calculator | Shiportrade.com",
  description: "Estimate import duties, tariffs, and taxes for international shipments. Calculate landed cost across 50+ countries.",
  keywords: ["duty calculator", "tariff calculator", "import duty", "customs duty", "landed cost", "import tax"],
};

export default function DutyTariffCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Percent className="h-3 w-3 mr-2" />
          Customs Calculator
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Duty & Tariff Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Estimate import duties, tariffs, and taxes for your international shipments. 
          Get accurate landed cost calculations across major importing countries.
        </p>
      </div>

      {/* Calculator */}
      <DutyTariffCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[var(--logistics)]" />
              Documents Required for Customs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              When importing goods, ensure you have the following documents ready:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FileCheck className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Commercial Invoice with declared value</span>
              </li>
              <li className="flex items-start gap-2">
                <FileCheck className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Packing List with weights and dimensions</span>
              </li>
              <li className="flex items-start gap-2">
                <FileCheck className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Bill of Lading or Air Waybill</span>
              </li>
              <li className="flex items-start gap-2">
                <FileCheck className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Certificate of Origin (for FTA benefits)</span>
              </li>
              <li className="flex items-start gap-2">
                <FileCheck className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Import License (if required)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-[var(--ocean)]" />
              Country-Specific Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Each country has unique customs regulations and requirements:
            </p>
            <ul className="space-y-2">
              <li><strong>USA:</strong> Uses HTS codes, no federal VAT but state sales taxes may apply</li>
              <li><strong>EU:</strong> Uses CN codes, applies VAT on CIF + duty value</li>
              <li><strong>UK:</strong> Post-Brexit rules apply, check UK Global Tariff</li>
              <li><strong>Australia:</strong> GST applies on CIF value + duty, low value threshold</li>
              <li><strong>China:</strong> VAT and consumption tax may apply to certain goods</li>
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
              <p className="font-semibold mb-2">Pro Tips for Reducing Duty Costs</p>
              <ul className="space-y-1">
                <li>• Check if your product qualifies for FTA preferential rates</li>
                <li>• Ensure correct HS code classification to avoid overpayment</li>
                <li>• Consider tariff engineering (modifying products to qualify for lower rates)</li>
                <li>• Use First Sale for Higher Value when importing through intermediaries</li>
                <li>• Keep detailed records for potential duty drawback claims</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
