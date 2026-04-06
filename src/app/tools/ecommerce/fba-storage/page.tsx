import { Metadata } from "next";
import { FBAStorageFeeEstimator } from "@/components/tools/FBAStorageFeeEstimator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  Warehouse,
  Clock,
  DollarSign,
  Package,
  HelpCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "FBA Storage Fee Estimator | Shiportrade.com",
  description: "Estimate Amazon FBA storage fees including monthly costs, peak season rates, and long-term storage fees. Essential tool for Amazon sellers to optimize inventory costs.",
  keywords: ["FBA storage fees", "Amazon storage calculator", "FBA fee estimator", "Amazon seller tools", "long-term storage fees", "FBA inventory costs"],
};

const faqData = [
  {
    question: "How are FBA storage fees calculated?",
    answer: "FBA storage fees are calculated based on the volume (cubic feet) your inventory occupies in Amazon fulfillment centers. The rate varies by size tier (Standard, Oversize, Extra Oversize) and season (higher rates during Q4). Fees are charged monthly on the 15th-18th based on the previous month's average inventory.",
  },
  {
    question: "What is the long-term storage fee?",
    answer: "Long-term storage fees apply to items stored for more than 365 days. Amazon charges a minimum of $0.15 per unit or $6.90 per cubic foot (whichever is greater) on the 15th of each month. This is in addition to regular monthly storage fees.",
  },
  {
    question: "Why are storage fees higher in Q4?",
    answer: "During Q4 (October-December), Amazon increases storage fees to encourage sellers to manage inventory efficiently during the peak holiday season. Rates typically increase 2-3x compared to non-peak months. This helps Amazon manage warehouse capacity during their busiest period.",
  },
  {
    question: "How can I reduce my FBA storage costs?",
    answer: "Key strategies include: optimizing packaging to reduce volume, maintaining high inventory turnover, creating removal orders for slow-moving inventory before it hits 365 days, reducing stock levels before Q4, and using FBA inventory reports to monitor aged inventory.",
  },
  {
    question: "What happens if my product changes size tiers?",
    answer: "Amazon automatically categorizes products into size tiers based on their dimensions and weight when they arrive at fulfillment centers. If your product's size tier changes (e.g., due to repackaging), the storage fee rate changes accordingly. You can request a remeasurement if you believe the tier is incorrect.",
  },
  {
    question: "Are storage fees the same across all Amazon marketplaces?",
    answer: "No, storage fees vary by marketplace. US, EU, UK, and JP marketplaces each have their own fee structures and currencies. This tool allows you to estimate storage costs for each marketplace to help with multi-marketplace selling decisions.",
  },
];

export default function FBAStorageFeePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          FBA Storage Fee Estimator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Estimate your Amazon FBA storage costs including monthly fees, peak season rates, 
          and long-term storage penalties. Plan your inventory strategy and avoid surprise fees.
        </p>
      </div>

      {/* Calculator */}
      <FBAStorageFeeEstimator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding FBA Storage Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Monthly Storage Fees:</strong> Charged based on the daily average volume 
              (cubic feet) your inventory occupies in Amazon fulfillment centers. Rates vary by 
              product size tier and season.
            </p>
            <p>
              <strong>Peak Season (Q4):</strong> From October through December, storage fees 
              increase significantly (typically 2-3x) to manage warehouse capacity during the 
              holiday rush.
            </p>
            <p>
              <strong>Long-Term Storage:</strong> Inventory aged 365+ days incurs additional 
              fees charged on the 15th of each month. The fee is the greater of $0.15 per unit 
              or $6.90 per cubic foot.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
              Inventory Management Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Monitor inventory age reports weekly to identify at-risk items</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Set alerts at 270 days to trigger action before long-term fees</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Consider removal orders or liquidation for slow-moving inventory</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Optimize restock quantities to avoid excess inventory buildup</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Use FBA inventory placement service strategically to reduce fees</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-[var(--ocean)]" />
            Pro Tips for FBA Sellers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Volume Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Every inch matters! Reducing package dimensions by just 1 inch in each 
                direction can significantly reduce cubic footage and storage costs.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Age Threshold Strategy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create removal orders for items approaching 365 days. It&apos;s often cheaper 
                to dispose and restock than to pay long-term storage fees.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Q4 Inventory Planning</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Ship Q4 inventory early (September) to avoid peak season storage fees. 
                Consider reducing stock levels in October to minimize costs.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Sales Velocity Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Track sales velocity by SKU. High-velocity items can justify higher 
                inventory levels, while slow movers need tighter control.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Fee Alerts</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Amazon sends notifications at 7, 30, 60, and 90 days before long-term 
                fees. Set up email filters to never miss these important alerts.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Healthy Inventory Rate</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Aim to keep your IPI (Inventory Performance Index) above 500 to avoid 
                storage quantity limits and additional fees.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Common Mistakes to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Ignoring inventory age:</strong> Many sellers only check storage fees 
                after receiving a surprising bill. Regular monitoring prevents this.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Over-ordering for Q4:</strong> While Q4 has high sales potential, 
                excessive inventory leads to massive storage fees if sales don&apos;t materialize.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Not optimizing packaging:</strong> Selling the same product with 
                different packaging can move you to a lower size tier.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Forgetting about removal fees:</strong> Sometimes it&apos;s more 
                cost-effective to pay removal fees than to continue storing unsellable inventory.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">{faq.question}</h4>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Important Note</p>
              <p>
                This calculator provides estimates based on Amazon&apos;s published FBA storage fee 
                structure as of 2024. Actual fees may vary based on specific product categories, 
                special programs, warehouse locations, and Amazon&apos;s fee schedule updates. 
                Always verify current rates in Seller Central for the most accurate information.
                Additional costs like removal fees, disposal fees, and inventory storage overage 
                fees are not included in this calculation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
