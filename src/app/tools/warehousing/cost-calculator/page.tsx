import { Metadata } from "next";
import { WarehousingCostCalculator } from "@/components/tools/WarehousingCostCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse, Building2, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Warehousing Cost Calculator | Shiportrade.com",
  description: "Calculate warehousing and storage costs worldwide. Compare rates across 50+ locations for pallet storage, fulfillment, and distribution.",
  keywords: ["warehousing cost", "storage cost calculator", "warehouse rates", "fulfillment cost", "3PL pricing"],
};

export default function WarehousingCostCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Warehouse className="h-3 w-3 mr-2" />
          Warehousing Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Warehousing Cost Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Estimate storage and fulfillment costs across major logistics hubs worldwide. 
          Compare pallet storage rates, handling fees, and pick & pack costs.
        </p>
      </div>

      {/* Calculator */}
      <WarehousingCostCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[var(--logistics)]" />
              Types of Warehousing
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Understanding different warehouse types helps you choose the right solution:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Public Warehouse:</strong> Shared facilities, pay-as-you-go, ideal for variable volumes</span>
              </li>
              <li className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Private Warehouse:</strong> Dedicated space, better control, higher fixed costs</span>
              </li>
              <li className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Bonded Warehouse:</strong> Duty-deferred storage for imported goods</span>
              </li>
              <li className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Fulfillment Center:</strong> Optimized for e-commerce order processing</span>
              </li>
              <li className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Cold Storage:</strong> Temperature-controlled for perishables</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--ocean)]" />
              Factors Affecting Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Several factors influence warehouse pricing in different regions:
            </p>
            <ul className="space-y-2">
              <li><strong>Location:</strong> Proximity to ports, airports, and major markets increases rates</li>
              <li><strong>Seasonality:</strong> Peak seasons (Q4) often have premium rates</li>
              <li><strong>Volume:</strong> Higher volumes typically qualify for discounts</li>
              <li><strong>Contract Length:</strong> Longer commitments often mean better rates</li>
              <li><strong>Special Requirements:</strong> Climate control, hazmat, high-security add costs</li>
              <li><strong>Labor Market:</strong> Local labor costs directly impact handling fees</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="mt-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div className="text-sm text-green-700 dark:text-green-300">
              <p className="font-semibold mb-2">Choosing the Right 3PL Partner</p>
              <ul className="space-y-1">
                <li>• Verify their technology integration capabilities (API, EDI, WMS)</li>
                <li>• Check their track record with similar products and volumes</li>
                <li>• Understand their SLAs for accuracy, speed, and dispute resolution</li>
                <li>• Review their network coverage for your target markets</li>
                <li>• Clarify all hidden fees (minimums, accessorial charges, returns)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
