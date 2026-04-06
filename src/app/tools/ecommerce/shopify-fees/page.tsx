import { Metadata } from "next";
import { ShopifyFeeCalculator } from "@/components/tools/ShopifyFeeCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Info,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  CreditCard,
  HelpCircle,
  Crown,
  Star,
  Building,
  Zap,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Shopify Fee Calculator | Shiportrade.com",
  description: "Calculate Shopify costs including subscription fees, transaction fees, payment processing, and total cost of selling. Compare plans and optimize your e-commerce expenses.",
  keywords: ["Shopify calculator", "Shopify fees", "Shopify pricing", "e-commerce costs", "Shopify plan comparison", "transaction fees", "online store costs"],
};

const faqData = [
  {
    question: "What are Shopify's main costs?",
    answer: "Shopify's main costs include: subscription fees ($29-299/month), transaction fees (0.5-2% depending on plan), payment processing fees (2.5-2.9% + 30¢ with Shopify Payments), and optional add-ons like apps ($0-300+/month), custom domains (~$14/year), POS ($0-89/location/month), and premium themes ($150-350 one-time).",
  },
  {
    question: "Should I use Shopify Payments or a third-party provider?",
    answer: "Shopify Payments is generally recommended because it eliminates the additional Shopify transaction fee (0.5-2%). With third-party providers like PayPal or Stripe, you'll pay both the provider's processing fee AND Shopify's transaction fee. However, if Shopify Payments isn't available in your country, third-party providers are your only option.",
  },
  {
    question: "When should I upgrade my Shopify plan?",
    answer: "Consider upgrading when: your monthly sales exceed $5,000 (Basic to Shopify), you need professional reports or international selling features, you need more staff accounts, or your transaction fee savings offset the higher subscription cost. The Shopify plan becomes cost-effective at around $5,000/month in sales, and Advanced at around $115,000/month.",
  },
  {
    question: "How can I reduce my Shopify costs?",
    answer: "Key cost reduction strategies include: paying annually (10% discount), using Shopify Payments to avoid transaction fees, optimizing your app subscriptions regularly, starting with a free theme, choosing the right plan for your sales volume, and minimizing unnecessary POS locations.",
  },
  {
    question: "What hidden costs should I watch out for?",
    answer: "Hidden costs often include: abandoned app subscriptions you forgot to cancel, currency conversion fees for international sales, chargeback fees ($15 per incident), theme updates or customizations, and additional costs for high-resolution product images or storage. Always audit your monthly statements.",
  },
  {
    question: "Is Shopify cheaper than other platforms?",
    answer: "Shopify's pricing is competitive for most businesses. WooCommerce has lower base costs but requires hosting ($10-100/month) and more technical maintenance. BigCommerce offers similar pricing with different feature sets. Shopify's advantage is its all-in-one simplicity and extensive app ecosystem, though total costs can be higher once you add necessary apps.",
  },
];

export default function ShopifyFeesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Shopify Fee Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate the true cost of selling on Shopify including subscription fees, transaction costs,
          payment processing, and additional expenses. Compare plans and optimize your e-commerce budget.
        </p>
      </div>

      {/* Calculator */}
      <ShopifyFeeCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Shopify Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Subscription Fees:</strong> Monthly fees ranging from $29 (Basic) to $299 (Advanced).
              Pay annually to save 10%. Each tier unlocks more features and lower transaction fees.
            </p>
            <p>
              <strong>Transaction Fees:</strong> Shopify charges 0.5-2% per transaction depending on your
              plan. This fee is waived if you use Shopify Payments as your payment processor.
            </p>
            <p>
              <strong>Payment Processing:</strong> Credit card processing fees typically range from
              2.5% to 2.9% + 30¢ per transaction. Rates vary by plan and payment provider.
            </p>
            <p>
              <strong>Additional Costs:</strong> Apps, themes, domains, and POS hardware can add
              significantly to your monthly expenses. Budget for these when planning your store.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
              Plan Selection Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Building className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">Basic ($29/mo):</strong> New stores, low volume
                  (&lt;$5K/mo), simple product catalogs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">Shopify ($79/mo):</strong> Growing businesses
                  ($5K-$100K/mo), international sales, need professional reports
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Crown className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">Advanced ($299/mo):</strong> High-volume stores
                  ($100K+/mo), complex shipping, need advanced analytics
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Plan Comparison Quick Reference */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
            Shopify Plans at a Glance
          </CardTitle>
          <CardDescription>
            Quick comparison of key features and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Building className="h-4 w-4 text-[var(--ocean)]" />
                      Basic
                    </div>
                  </th>
                  <th className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-[var(--logistics)]" />
                      Shopify
                    </div>
                  </th>
                  <th className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Crown className="h-4 w-4 text-purple-500" />
                      Advanced
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Monthly Price</td>
                  <td className="text-center py-3 px-4">$29</td>
                  <td className="text-center py-3 px-4 bg-[var(--logistics)]/5">$79</td>
                  <td className="text-center py-3 px-4">$299</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Transaction Fee</td>
                  <td className="text-center py-3 px-4">2.0%</td>
                  <td className="text-center py-3 px-4 bg-[var(--logistics)]/5">1.0%</td>
                  <td className="text-center py-3 px-4">0.5%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Credit Card Rate</td>
                  <td className="text-center py-3 px-4">2.9% + 30¢</td>
                  <td className="text-center py-3 px-4 bg-[var(--logistics)]/5">2.7% + 30¢</td>
                  <td className="text-center py-3 px-4">2.5% + 30¢</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Staff Accounts</td>
                  <td className="text-center py-3 px-4">2</td>
                  <td className="text-center py-3 px-4 bg-[var(--logistics)]/5">5</td>
                  <td className="text-center py-3 px-4">15</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Reports</td>
                  <td className="text-center py-3 px-4">Basic</td>
                  <td className="text-center py-3 px-4 bg-[var(--logistics)]/5">Professional</td>
                  <td className="text-center py-3 px-4">Advanced</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Best For</td>
                  <td className="text-center py-3 px-4 text-xs">New businesses</td>
                  <td className="text-center py-3 px-4 text-xs bg-[var(--logistics)]/5">Growing stores</td>
                  <td className="text-center py-3 px-4 text-xs">High-volume</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-[var(--ocean)]" />
            Pro Tips for Shopify Cost Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Use Shopify Payments</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Avoid the 0.5-2% transaction fee by using Shopify Payments. This alone can save
                hundreds per month on higher-volume stores.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Pay Annually</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Get 10% off your subscription by paying annually. On Advanced, that&apos;s $350+ in
                yearly savings.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Right-Size Your Plan</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Review your plan quarterly. If sales grow past $5K/mo, upgrading to Shopify often
                saves more in transaction fees than the extra subscription cost.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Audit Apps Regularly</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Many stores pay for unused apps. Review your app subscriptions monthly and cancel
                anything not actively contributing to revenue.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Start with Free Theme</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Shopify&apos;s free themes are professionally designed. Only invest in premium themes
                when you need specific features or branding.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Calculate Total Cost</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Always factor in ALL costs when comparing platforms: apps, themes, domains, and
                payment processing, not just the base subscription.
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
                <strong>Overpaying for apps:</strong> Many merchants install apps for one-time tasks
                and forget to cancel. Schedule monthly app audits.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Wrong plan selection:</strong> Staying on Basic when you&apos;re doing $10K+/month
                costs more in transaction fees than upgrading to Shopify.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Using third-party payment providers:</strong> Unless necessary, avoid PayPal/Stripe
                as primary processors—you&apos;ll pay extra Shopify transaction fees.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Ignoring annual billing:</strong> Monthly billing costs 10% more over a year.
                If you&apos;re committed to Shopify, always choose annual.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Not calculating effective rate:</strong> Your total cost as a percentage of sales
                (effective rate) is the key metric. It often decreases with higher plans at scale.
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
                This calculator provides estimates based on Shopify&apos;s published pricing as of 2024.
                Actual costs may vary based on your specific setup, country, currency, and any
                promotional pricing. Shopify&apos;s fees and features are subject to change. Always
                verify current pricing on Shopify&apos;s official website before making business decisions.
                This tool is for planning purposes only and should not be considered financial advice.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Tools */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Related E-Commerce Tools</CardTitle>
          <CardDescription>
            More calculators to help optimize your online business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/tools/ecommerce/fba-calculator"
              className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-[var(--ocean)]" />
              <div className="font-medium text-sm">FBA Calculator</div>
            </a>
            <a
              href="/tools/ecommerce/fba-storage"
              className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-[var(--logistics)]" />
              <div className="font-medium text-sm">FBA Storage Fees</div>
            </a>
            <a
              href="/tools/ecommerce/ltv-calculator"
              className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-[var(--ocean)]" />
              <div className="font-medium text-sm">LTV Calculator</div>
            </a>
            <a
              href="/tools/ecommerce/cac-calculator"
              className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-[var(--logistics)]" />
              <div className="font-medium text-sm">CAC Calculator</div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
