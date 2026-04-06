import { Metadata } from "next";
import { ReturnRateProfitImpact } from "@/components/tools/ReturnRateProfitImpact";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  Target,
  BarChart3,
  HelpCircle,
  Lightbulb,
  Package,
  Percent
} from "lucide-react";

export const metadata: Metadata = {
  title: "Return Rate Profit Impact Calculator | Shiportrade.com",
  description: "Calculate how product returns impact your profitability. Analyze return costs, margin erosion, break-even return rates, and optimize your e-commerce return strategy.",
  keywords: ["return rate calculator", "e-commerce returns", "profit impact", "return costs", "margin erosion", "break-even analysis", "refund vs exchange", "return management"],
};

const faqData = [
  {
    question: "How do returns affect profit margins?",
    answer: "Returns impact profit margins through multiple channels: lost revenue from refunds, product costs that can't be recovered, processing and shipping costs, restocking expenses, and reduced resale value of returned items. Even exchanges carry costs. Our calculator shows that a 15% return rate can erode gross margins by 5-10 percentage points depending on your cost structure.",
  },
  {
    question: "What is a good return rate for e-commerce?",
    answer: "Return rates vary significantly by industry. Electronics average around 15%, apparel 25%, and health & beauty just 5%. A 'good' return rate is one that allows you to maintain healthy margins - generally 10-15% below your break-even rate. Monitor your industry benchmarks and aim to stay well under the high-risk threshold.",
  },
  {
    question: "Should I encourage exchanges over refunds?",
    answer: "Yes, exchanges are generally more profitable than refunds. An exchange preserves the sale value and often results in a satisfied customer who keeps the product. Additionally, exchanges can turn a potential loss into a relationship-building opportunity. Many successful e-commerce businesses offer incentives for exchanges, such as bonus credit or free shipping.",
  },
  {
    question: "How do I calculate the true cost of a return?",
    answer: "The true cost of a return includes: (1) Refund amount, (2) Product cost if unsellable, (3) Return shipping, (4) Processing and inspection labor, (5) Restocking costs, (6) Lost opportunity cost, minus (7) Resale value if the item can be resold. Our calculator accounts for all these factors to give you the complete picture.",
  },
  {
    question: "What is break-even return rate?",
    answer: "Break-even return rate is the percentage of sales that can be returned before your business starts losing money. It's calculated based on your gross margin and the average cost per return. If your break-even rate is 35% and your actual return rate is 15%, you have a 20% safety margin. Monitoring this gap is crucial for financial health.",
  },
  {
    question: "How can I reduce return processing costs?",
    answer: "Key strategies include: automated return authorization systems, clear return policies that prevent unnecessary returns, consolidated return shipments, in-house refurbishment programs, strategic partnerships with liquidators for unsellable items, and investing in faster inspection processes. Every dollar saved in processing directly improves your margins.",
  },
];

const returnReasonTips = [
  {
    reason: "Defective/Damaged",
    percentage: "15%",
    tip: "Implement pre-shipment quality checks and improve packaging standards",
    impact: "High cost - items often unsellable",
  },
  {
    reason: "Changed Mind",
    percentage: "35%",
    tip: "Set clear expectations and offer store credit incentives for exchanges",
    impact: "Low cost - items usually resellable",
  },
  {
    reason: "Not as Described",
    percentage: "20%",
    tip: "Improve product photos, descriptions, and add customer reviews",
    impact: "Medium cost - may need discounting",
  },
  {
    reason: "Size/Fit Issues",
    percentage: "8%",
    tip: "Add detailed sizing charts, model measurements, and fit tools",
    impact: "Low cost - items usually resellable",
  },
];

export default function ReturnRateProfitImpactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Return Rate Profit Impact Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Understand the true cost of product returns and their impact on your profitability. 
          Analyze return costs, margin erosion, and find your break-even return rate to make 
          informed decisions about your return policy.
        </p>
      </div>

      {/* Calculator */}
      <ReturnRateProfitImpact />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Return Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Direct Costs:</strong> Every return incurs processing costs including 
              shipping, inspection, restocking, and potential disposal. These costs directly 
              reduce your profit margin on every sale.
            </p>
            <p>
              <strong>Lost Revenue:</strong> Refunds eliminate the sale entirely, while even 
              exchanges carry processing costs. The difference between refund and exchange 
              rates significantly impacts your bottom line.
            </p>
            <p>
              <strong>Resale Value:</strong> Not all returned items can be resold at full price. 
              Defective items may be unsellable, while others may need discounting. This erosion 
              of resale value compounds the financial impact.
            </p>
            <p>
              <strong>Margin Erosion:</strong> The combination of all return-related costs 
              reduces your effective margin, potentially turning profitable products into 
              break-even or loss-making ones.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-[var(--logistics)]" />
              Key Metrics to Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Return Rate:</strong> Track by product category and reason to 
                  identify problem areas quickly.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Refund vs Exchange Ratio:</strong> Higher exchange rates preserve 
                  more revenue than refunds.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Cost per Return:</strong> Calculate all processing costs to 
                  understand the true impact.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Resale Value Recovery:</strong> Track what percentage of original 
                  price you recover on returned items.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Break-Even Gap:</strong> Monitor the difference between your 
                  actual and break-even return rates.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Return Reason Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-[var(--ocean)]" />
            Return Reason Analysis & Prevention Tips
          </CardTitle>
          <CardDescription>
            Common return reasons and strategies to address each one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Return Reason</th>
                  <th className="text-right py-3 px-4">Typical %</th>
                  <th className="text-left py-3 px-4">Prevention Tip</th>
                  <th className="text-left py-3 px-4">Cost Impact</th>
                </tr>
              </thead>
              <tbody>
                {returnReasonTips.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.reason}</td>
                    <td className="text-right py-3 px-4">{item.percentage}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.tip}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{item.impact}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Pro Tips for Managing Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Calculate True Cost</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Include all hidden costs: customer service time, warehouse space, 
                disposal fees, and opportunity cost of tied-up inventory.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Promote Exchanges</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Make exchanges easier than refunds. Offer incentives like bonus 
                credit, free return shipping, or instant exchange processing.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Improve Packaging</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Better packaging reduces damage-related returns. The cost of 
                upgraded packaging is often less than the cost of returns.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Segment by Product</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Track return rates by SKU to identify problem products. 
                Some items may need to be discontinued due to high return costs.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Set Return Limits</span>
              </div>
              <p className="text-sm text-muted-foreground">
                For repeat offenders, consider return limits or restocking fees. 
                Some marketplaces allow this for high-return customers.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Monitor Break-Even</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Know your break-even return rate for each product category. 
                Use this to make informed decisions about pricing and policies.
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
                <strong>Ignoring return costs in pricing:</strong> Many sellers price 
                products based on COGS and desired margin without accounting for return 
                costs, leading to lower-than-expected profitability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Not tracking by reason:</strong> Without understanding WHY customers 
                return products, you can&apos;t address root causes. Track return reasons to 
                identify improvement opportunities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Underestimating processing costs:</strong> The true cost of a return 
                extends beyond shipping. Include labor, storage, inspection, and opportunity 
                costs for accurate calculations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Overlooking resale value:</strong> Not all returns are total losses. 
                Track resale recovery rates and invest in refurbishment programs to maximize 
                value recovery.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Making returns too easy OR too hard:</strong> An extremely generous 
                return policy increases costs, while a restrictive one hurts conversions and 
                customer loyalty. Find the right balance.
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

      {/* Related Tools */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Related Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <a href="/tools/ecommerce/fba-calculator" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-[var(--ocean)]" />
                <span className="font-medium">FBA Revenue Calculator</span>
              </div>
              <p className="text-sm text-muted-foreground">Calculate Amazon FBA revenue and fees</p>
            </a>
            <a href="/tools/ecommerce/fba-storage" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-[var(--ocean)]" />
                <span className="font-medium">FBA Storage Estimator</span>
              </div>
              <p className="text-sm text-muted-foreground">Estimate Amazon storage fees</p>
            </a>
            <a href="/tools/ecommerce/roas-calculator" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-[var(--ocean)]" />
                <span className="font-medium">ROAS Calculator</span>
              </div>
              <p className="text-sm text-muted-foreground">Calculate Return on Ad Spend</p>
            </a>
            <a href="/tools/international-trade/profit-margin-calculator" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[var(--ocean)]" />
                <span className="font-medium">Profit Margin Calculator</span>
              </div>
              <p className="text-sm text-muted-foreground">Calculate profit margins and markup</p>
            </a>
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
                This calculator provides estimates based on the inputs provided and industry averages. 
                Actual return costs may vary based on your specific business model, product categories, 
                return policies, and operational efficiency. Return rates and their impact should be 
                monitored continuously and adjusted based on real data from your business operations.
                The resale value percentages shown are typical estimates and may vary significantly 
                based on product condition and market demand.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
