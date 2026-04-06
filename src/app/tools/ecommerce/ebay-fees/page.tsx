import { Metadata } from "next";
import { EBayFeeCalculator } from "@/components/tools/eBayFeeCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Percent,
  Store,
  Globe,
  HelpCircle,
  Package,
  CreditCard
} from "lucide-react";

export const metadata: Metadata = {
  title: "eBay Fee Calculator | Shiportrade.com",
  description: "Calculate eBay selling fees including final value fees, insertion fees, store subscription discounts, and international selling costs. Essential tool for eBay sellers to maximize profits.",
  keywords: ["eBay fee calculator", "eBay final value fee", "eBay insertion fee", "eBay selling costs", "eBay store subscription", "eBay seller fees"],
};

const faqData = [
  {
    question: "What is a Final Value Fee on eBay?",
    answer: "The Final Value Fee (FVF) is the main selling fee charged by eBay when your item sells. It's calculated as a percentage of the total sale amount (including shipping) with a maximum cap that varies by category. Rates typically range from 8% to 15% depending on the product category.",
  },
  {
    question: "Do I pay insertion fees if my item doesn't sell?",
    answer: "Yes, insertion fees (listing fees) are charged when you create a listing, regardless of whether the item sells. However, store subscribers get a certain number of free listings per month, and you may qualify for free listing promotions.",
  },
  {
    question: "Is an eBay Store subscription worth it?",
    answer: "It depends on your selling volume. A Basic Store ($24.95/month) is worth it if you list 50+ items monthly, as you get 250 free listings and 10% off final value fees. Higher-volume sellers (200+ listings) benefit more from Premium or Anchor stores with greater discounts.",
  },
  {
    question: "How do international selling fees work?",
    answer: "International sales incur additional fees: a cross-border fee (typically 1.5%) on top of regular fees. If you use eBay's Global Shipping Program, there's an additional 5% fee on the item price plus shipping. Consider these costs when pricing for international buyers.",
  },
  {
    question: "What is eBay Managed Payments?",
    answer: "Managed Payments is eBay's integrated payment system that replaced PayPal as the default. It charges 2.6% + $0.30 per transaction, slightly lower than PayPal's 2.9% + $0.30. Funds are deposited directly to your bank account.",
  },
  {
    question: "How can I reduce my eBay selling fees?",
    answer: "Key strategies include: getting a store subscription for volume selling, using Good 'Til Cancelled listings to avoid re-listing fees, choosing optimal categories with lower FVF rates, and using promoted listings strategically. Store subscribers can save 10-20% on final value fees.",
  },
];

const feeStructureData = [
  { type: "Insertion Fee", description: "Charged per listing", typical: "$0.35 - $1.00", tip: "Free with store subscription" },
  { type: "Final Value Fee", description: "Percentage of sale price", typical: "8% - 15%", tip: "Capped by category" },
  { type: "Payment Processing", description: "Per transaction", typical: "2.6% + $0.30", tip: "Via Managed Payments" },
  { type: "International Fee", description: "Cross-border sales", typical: "1.5% additional", tip: "GSP adds 5% more" },
  { type: "Promoted Listings", description: "Ad rate when sold", typical: "1% - 10%", tip: "Only charged on sale" },
];

export default function eBayFeePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          eBay Fee Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate your total eBay selling costs including final value fees, insertion fees, 
          payment processing, and international selling fees. Optimize your pricing strategy 
          and maximize your profits.
        </p>
      </div>

      {/* Calculator */}
      <EBayFeeCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding eBay Selling Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Final Value Fee (FVF):</strong> The primary selling fee charged when your 
              item sells. It&apos;s calculated as a percentage of the total sale amount (item price + 
              shipping) with category-specific caps.
            </p>
            <p>
              <strong>Insertion Fee:</strong> A listing fee charged when you create a listing. 
              Fixed-price listings cost $0.35, while auctions start at $1.00. Store subscribers 
              get free listings included.
            </p>
            <p>
              <strong>Payment Processing:</strong> eBay&apos;s Managed Payments charges 2.6% + $0.30 
              per transaction. This replaced PayPal for most sellers and offers slightly lower rates.
            </p>
            <p>
              <strong>International Fees:</strong> Additional charges apply for cross-border sales. 
              Expect 1.5% extra plus potential Global Shipping Program fees (5%) if applicable.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
              Fee Optimization Strategies
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Choose store subscriptions based on monthly listing volume</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Use Good &apos;Til Cancelled to avoid repeated insertion fees</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Factor international fees into shipping costs or item price</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Use promoted listings strategically at 2-3% for best ROI</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Consider category selection for items that fit multiple categories</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Fee Structure Reference */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
            eBay Fee Structure Overview
          </CardTitle>
          <CardDescription>
            Quick reference for all eBay selling fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Fee Type</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Typical Rate</th>
                  <th className="text-left py-3 px-4">Tip</th>
                </tr>
              </thead>
              <tbody>
                {feeStructureData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{row.type}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.description}</td>
                    <td className="py-3 px-4 text-[var(--ocean)] font-medium">{row.typical}</td>
                    <td className="py-3 px-4 text-[var(--logistics)] text-xs">{row.tip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Store Subscription Comparison */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Store className="h-5 w-5 text-[var(--logistics)]" />
            Store Subscription Benefits
          </CardTitle>
          <CardDescription>
            Compare eBay store subscription levels and their fee discounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="font-medium mb-2">No Subscription</div>
              <div className="text-sm text-muted-foreground">0% discount</div>
              <div className="text-xs text-muted-foreground mt-1">0 free listings</div>
            </div>
            <div className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center border border-[var(--logistics)]/20">
              <div className="font-medium mb-2">Basic Store</div>
              <div className="text-sm text-[var(--logistics)]">10% FVF discount</div>
              <div className="text-xs text-muted-foreground mt-1">250 free listings</div>
            </div>
            <div className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center border border-[var(--ocean)]/20">
              <div className="font-medium mb-2">Premium Store</div>
              <div className="text-sm text-[var(--ocean)]">15% FVF discount</div>
              <div className="text-xs text-muted-foreground mt-1">1,000 free listings</div>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg text-center border border-purple-500/20">
              <div className="font-medium mb-2">Anchor Store</div>
              <div className="text-sm text-purple-600">20% FVF discount</div>
              <div className="text-xs text-muted-foreground mt-1">10,000 free listings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Percent className="h-5 w-5 text-[var(--ocean)]" />
            Pro Tips for eBay Sellers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Price Strategically</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Factor all fees into your pricing. For a $100 item, expect total fees 
                of $15-20 depending on category and payment method.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Free Shipping Strategy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                eBay charges FVF on shipping too. Consider free shipping with a higher 
                item price to simplify buyer experience and potentially reduce disputes.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Managed Payments</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Managed Payments (2.6%) is cheaper than PayPal (2.9%). The 0.3% 
                difference adds up on high-value sales.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">International Markets</span>
              </div>
              <p className="text-sm text-muted-foreground">
                International fees are significant but global markets can increase 
                sales volume. Price accordingly to maintain margins.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Promoted Listings ROI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Test promoted listings at 2-3% first. Higher rates don&apos;t always 
                mean proportionally more sales. Monitor your return on ad spend.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Annual Store Savings</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Pay annually for store subscriptions to save 15-20% compared to 
                monthly payments. Premium Store annual: $839.95 vs $899.40 monthly.
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
                <strong>Not calculating total fees:</strong> Many sellers only consider the FVF 
                and forget payment processing, resulting in lower-than-expected profits.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Ignoring store subscription benefits:</strong> High-volume sellers without 
                stores pay significantly more in insertion fees and miss FVF discounts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Overusing promoted listings:</strong> Setting high ad rates (10%+) without 
                testing can erode margins without proportionally increasing sales.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Forgetting international fees:</strong> Cross-border fees add 1.5%+ to costs. 
                Factor these into international shipping prices or item prices.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Not optimizing category selection:</strong> Some items fit multiple categories 
                with different FVF rates. Choose wisely while maintaining visibility.
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
              <p className="font-semibold mb-2">Important Disclaimer</p>
              <p>
                This calculator provides estimates based on eBay&apos;s published fee structure 
                as of 2024. Actual fees may vary based on seller performance level, promotional 
                offers, category-specific rates, and eBay&apos;s fee schedule updates. Always verify 
                current rates in eBay Seller Hub for the most accurate information. This tool 
                does not account for all possible fees such as optional listing upgrades, 
                return shipping costs, or eBay advertising programs beyond promoted listings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
