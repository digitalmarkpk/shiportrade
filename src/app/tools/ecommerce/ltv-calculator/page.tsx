import { Metadata } from "next";
import { LTVCalculator } from "@/components/tools/LTVCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Info,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Target,
  DollarSign,
  BarChart3,
  Users,
  Activity,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "LTV Calculator (Customer Lifetime Value) | Shiportrade.com",
  description:
    "Calculate Customer Lifetime Value (LTV) for your e-commerce business. Analyze LTV:CAC ratio, retention curves, cohort analysis, and optimize customer economics.",
  keywords: [
    "LTV calculator",
    "customer lifetime value",
    "CLV calculator",
    "LTV CAC ratio",
    "customer retention",
    "churn rate",
    "cohort analysis",
    "e-commerce metrics",
    "customer economics",
    "SaaS metrics",
  ],
};

export default function LTVCaculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Customer Lifetime Value (LTV) Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate and analyze your customer lifetime value with simple and advanced formulas.
          Understand LTV:CAC ratios, retention impact, cohort analysis, and optimize your customer
          economics for sustainable growth.
        </p>
      </div>

      {/* Calculator */}
      <LTVCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              What is Customer Lifetime Value?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Customer Lifetime Value (LTV or CLV)</strong> is the total revenue a business
              can expect from a single customer account throughout their entire relationship. It
              helps businesses understand the long-term value of customer relationships rather than
              focusing solely on transactional value.
            </p>
            <p>
              LTV is one of the most important metrics for any business because it helps you
              understand how much you can afford to spend on customer acquisition, identify your
              most valuable customer segments, and make data-driven decisions about marketing,
              product development, and customer service investments.
            </p>
            <div className="bg-muted/50 p-3 rounded-lg mt-4">
              <p className="font-mono text-center text-xs">
                Advanced LTV = (AOV × Purchase Frequency × Profit Margin) ÷ Churn Rate
              </p>
            </div>
            <p>
              Unlike simple revenue calculations, LTV accounts for the time value of money,
              customer retention rates, and profit margins to give a more accurate picture of
              customer value.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-[var(--logistics)]" />
              Why LTV:CAC Ratio Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              The <strong>LTV:CAC ratio</strong> compares customer lifetime value to customer
              acquisition cost, showing the return on your marketing investment. This ratio is
              crucial for determining if your business model is sustainable.
            </p>
            <div className="bg-muted/50 p-3 rounded-lg mt-4">
              <p className="font-mono text-center text-xs">LTV:CAC = Customer LTV ÷ Customer Acquisition Cost</p>
            </div>
            <ul className="space-y-2 mt-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>3:1 or higher</strong> - Healthy ratio, sustainable growth
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span>
                  <strong>4:1 - 5:1</strong> - Excellent performance, room to invest more in growth
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  <strong>1:1 - 3:1</strong> - Marginal, may not be sustainable long-term
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Below 1:1</strong> - Losing money on every customer acquired
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* LTV Components */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
            Key Components of Customer Lifetime Value
          </CardTitle>
          <CardDescription>The metrics that drive your LTV calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                <span className="font-medium">Average Order Value (AOV)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Total revenue divided by number of orders. Higher AOV directly increases LTV.
                Improve through cross-selling, bundling, and upselling.
              </p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-[var(--logistics)]" />
                <span className="font-medium">Purchase Frequency</span>
              </div>
              <p className="text-xs text-muted-foreground">
                How often customers buy per year. More frequent purchases increase total customer
                value. Drive through loyalty programs and email marketing.
              </p>
            </div>
            <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-teal-500" />
                <span className="font-medium">Customer Retention Rate</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Percentage of customers who continue buying. A 5% improvement can increase profits
                by 25-95%. Focus on customer success and support.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Profit Margin</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Percentage of revenue that becomes profit. Higher margins mean more value per
                customer. Optimize pricing and reduce costs.
              </p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Customer Lifespan</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Average duration a customer remains active. Longer relationships mean more total
                revenue and higher LTV.
              </p>
            </div>
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-800">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-rose-500" />
                <span className="font-medium">Churn Rate</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Percentage of customers who stop buying each period. Lower churn dramatically
                improves LTV. Address root causes of customer departure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
            Pro Tips for Increasing Customer Lifetime Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Segment your customers</strong> - Calculate LTV by segment to identify
                  your most valuable customer types and tailor acquisition strategies
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Focus on retention</strong> - Increasing retention by 5% can boost profits
                  by 25-95%. Invest in customer success and support
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Implement loyalty programs</strong> - Reward repeat purchases to increase
                  frequency and strengthen customer relationships
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Personalize experiences</strong> - Use customer data to provide relevant
                  recommendations and communications
                </span>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Cross-sell and upsell</strong> - Increase AOV by recommending related
                  products or premium alternatives at checkout
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Optimize CAC</strong> - Lower acquisition costs improve LTV:CAC ratio.
                  Focus on organic growth and referral programs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Monitor payback period</strong> - Track how long it takes to recover CAC.
                  Shorter payback means faster profitability
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Reduce churn triggers</strong> - Identify and address common reasons
                  customers leave through surveys and exit interviews
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-semibold mb-3">Common LTV Mistakes to Avoid</p>
              <ul className="space-y-2">
                <li>
                  <strong>Ignoring customer segments:</strong> Average LTV across all customers can
                  be misleading. High-value and low-value segments behave differently. Always
                  segment your analysis.
                </li>
                <li>
                  <strong>Not accounting for CAC:</strong> Gross LTV looks impressive, but net LTV
                  (after acquisition costs) shows true customer profitability. Always consider CAC.
                </li>
                <li>
                  <strong>Using only simple LTV:</strong> The basic formula doesn&apos;t account for
                  retention rates or margins. Use the advanced formula for accurate planning.
                </li>
                <li>
                  <strong>Ignoring time value of money:</strong> Future revenue is worth less than
                  current revenue. Use NPV-adjusted LTV for businesses with long customer lifespans.
                </li>
                <li>
                  <strong>Not updating regularly:</strong> Customer behavior changes over time.
                  Recalculate LTV quarterly or when significant business changes occur.
                </li>
                <li>
                  <strong>Confusing revenue with profit:</strong> High revenue customers aren&apos;t
                  always profitable if margins are thin or service costs are high. Focus on profit
                  LTV.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-[var(--ocean)]" />
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What is a good LTV:CAC ratio?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A healthy LTV:CAC ratio is typically 3:1 or higher, meaning each customer generates at
              least 3x their acquisition cost in lifetime value. Ratios of 4:1 to 5:1 indicate
              excellent efficiency. Below 3:1 may indicate unsustainable customer economics. Below
              1:1 means you&apos;re losing money on every customer.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How do I calculate churn rate?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Churn rate = (Customers lost during period ÷ Customers at start of period) × 100.
              Alternatively, churn = 1 - retention rate. If your retention rate is 80%, your churn
              rate is 20%. Lower churn dramatically improves LTV.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What&apos;s the difference between LTV and CLV?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              LTV (Lifetime Value) and CLV (Customer Lifetime Value) are typically used
              interchangeably. Some practitioners use CLV to emphasize the &quot;customer&quot; aspect,
              while LTV is sometimes used for broader lifetime metrics. Both measure the same
              concept: total value from a customer relationship.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How often should I recalculate LTV?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Recalculate LTV quarterly for established businesses with stable customer behavior.
              For startups or businesses undergoing significant changes, recalculate monthly. Always
              recalculate after major product launches, pricing changes, or market shifts.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Should I use simple or advanced LTV formula?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Use the advanced formula for strategic planning. It accounts for retention rates and
              profit margins, giving more accurate predictions. Use simple LTV only for quick
              estimates or when you don&apos;t have retention data. NPV-adjusted LTV is best for
              businesses with long customer relationships (5+ years).
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How does retention rate affect LTV?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Retention has a compounding effect on LTV. In the advanced formula, LTV = margin ÷
              churn rate. A 90% retention (10% churn) gives 10x margin multiplier. A 95% retention
              (5% churn) gives 20x multiplier. Just 5% retention improvement can double LTV in
              subscription businesses.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="mt-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Important Note</p>
              <p>
                This calculator provides estimates based on standard formulas and industry averages.
                Actual customer lifetime value varies significantly based on your specific business
                model, market conditions, competition, and customer behavior. LTV calculations
                assume stable retention rates and consistent margins over time. For the most
                accurate results, use your own historical customer data and segment customers by
                acquisition channel, product line, or demographic. Consider consulting with a
                financial analyst for strategic decisions based on LTV metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
