import { Metadata } from "next";
import { VGMCalculator } from "@/components/tools/VGMCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, AlertTriangle, FileCheck, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "VGM Calculator - Verified Gross Mass | Shiportrade.com",
  description: "Calculate Verified Gross Mass (VGM) for containers in compliance with SOLAS regulations. Generate VGM declarations for shipping.",
  keywords: ["VGM calculator", "verified gross mass", "SOLAS", "container weight", "weighbridge", "shipper declaration"],
};

export default function VGMCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Scale className="h-3 w-3 mr-2" />
          Ocean Freight Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          VGM Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate Verified Gross Mass (VGM) for your containers in compliance with SOLAS regulations.
          Generate declarations for vessel loading.
        </p>
      </div>

      {/* Calculator */}
      <VGMCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="h-5 w-5 text-[var(--logistics)]" />
              Why VGM Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Incorrect container weights have contributed to maritime accidents, including 
              container stack collapses and vessel stability issues. VGM requirements protect 
              crew, vessels, and cargo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[var(--ocean)]" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• VGM Declaration signed by shipper</li>
              <li>• Weighbridge ticket (Method 1)</li>
              <li>• Weight certificates (Method 2)</li>
              <li>• Calibration certificates for scales</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Penalties
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Containers without valid VGM will not be loaded. Late submission may result 
              in rollover fees, storage charges, and demurrage. Fines for non-compliance 
              can reach thousands of dollars.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Note */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Compliance Reminder</p>
              <p>
                This calculator provides VGM calculations for reference. Ensure all weighing equipment 
                is properly calibrated and certified. The shipper remains legally responsible for the 
                accuracy of the VGM declaration under SOLAS regulations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
