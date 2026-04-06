import { Metadata } from "next";
import { MarineInsuranceCalculator } from "@/components/tools/MarineInsuranceCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Info, FileWarning, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Marine Insurance Premium Calculator | Shiportrade.com",
  description: "Calculate marine cargo insurance premiums for international shipments. Compare ICC coverage options and get instant estimates.",
  keywords: ["marine insurance", "cargo insurance", "insurance premium", "ICC clauses", "cargo coverage"],
};

export default function MarineInsurancePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Shield className="h-3 w-3 mr-2" />
          Insurance Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Marine Insurance Premium Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Estimate cargo insurance premiums for your international shipments. 
          Compare coverage options and understand what affects your rates.
        </p>
      </div>

      {/* Calculator */}
      <MarineInsuranceCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Why Get Marine Insurance?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Carrier liability is often limited to $500 per package under international 
              conventions (Hague-Visby Rules). Marine insurance provides comprehensive 
              protection for the full value of your goods.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Full replacement value coverage</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Coverage for general average contributions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Protection against salvage charges</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Often required by banks for LC</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-[var(--logistics)]" />
              Common Exclusions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Even comprehensive ICC (A) policies have exclusions:
            </p>
            <ul className="space-y-2">
              <li>• Willful misconduct of the insured</li>
              <li>• Ordinary leakage or wear and tear</li>
              <li>• Inherent vice of the goods</li>
              <li>• Delay (even if caused by insured peril)</li>
              <li>• Insolvency of the carrier</li>
              <li>• Nuclear events</li>
              <li>• Unseaworthiness (if known to insured)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
