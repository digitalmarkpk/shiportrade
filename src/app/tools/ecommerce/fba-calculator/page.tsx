import { Metadata } from "next";
import { FBACalculator } from "@/components/tools/FBACalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Info, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "FBA Calculator | Shiportrade.com",
  description: "Calculate Amazon FBA fees, profit margins, and ROI for your products. Essential tool for Amazon sellers and e-commerce businesses.",
  keywords: ["FBA calculator", "Amazon FBA fees", "FBA profit calculator", "Amazon seller tools", "e-commerce calculator"],
};

export default function FBACalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Amazon FBA Profit Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate your true profitability on Amazon FBA. Account for referral fees, 
          fulfillment fees, storage costs, and more to make informed pricing decisions.
        </p>
      </div>

      {/* Calculator */}
      <FBACalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding FBA Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Referral Fee:</strong> Amazon charges a percentage of each sale (typically 8-17% 
              depending on category). This is deducted automatically from your payout.
            </p>
            <p>
              <strong>FBA Fulfillment Fee:</strong> Covers picking, packing, and shipping. Based on 
              product size tier and weight. Rates vary for small standard, standard, and oversize items.
            </p>
            <p>
              <strong>Storage Fee:</strong> Monthly fee based on volume (cubic feet). Higher rates 
              apply during Q4 (October-December) holiday season.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
              Profitability Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Aim for at least 30% profit margin to account for unexpected costs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Target ROI of 50%+ for sustainable business growth</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Factor in PPC advertising costs (typically 10-20% of revenue)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Consider long-term storage fees for slow-moving inventory</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Monitor inventory performance to avoid additional fees</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Warning Card */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Important Note</p>
              <p>
                This calculator provides estimates based on standard Amazon fee structures. 
                Actual fees may vary based on specific product categories, special programs, 
                and Amazon&apos;s current fee schedule. Always verify with Seller Central for 
                the most accurate fee information. Additional costs like returns processing, 
                removal fees, and advertising are not included in this calculation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
