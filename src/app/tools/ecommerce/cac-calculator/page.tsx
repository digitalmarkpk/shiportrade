import { Metadata } from "next";
import { CACCalculator } from "@/components/tools/CACCalculator";
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
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CAC Calculator | Shiportrade.com",
  description:
    "Calculate Customer Acquisition Cost (CAC) for your business. Analyze marketing spend by channel, sales costs, CAC payback period, and LTV:CAC ratio for better unit economics.",
  keywords: [
    "CAC calculator",
    "customer acquisition cost",
    "LTV CAC ratio",
    "marketing ROI",
    "CAC payback period",
    "customer acquisition metrics",
    "unit economics",
    "SaaS metrics",
    "e-commerce CAC",
  ],
};

export default function CACCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          CAC Calculator for Business Growth
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate your Customer Acquisition Cost across marketing channels, analyze your LTV:CAC
          ratio, and optimize your customer acquisition strategy for sustainable growth.
        </p>
      </div>

      {/* Calculator */}
      <CACCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Customer Acquisition Cost
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Customer Acquisition Cost (CAC)</strong> measures how much it costs your
              business to acquire a new customer. It includes all marketing and sales expenses
              divided by the number of new customers acquired.
            </p>
            <div className="bg-muted/50 p-3 rounded-lg mt-4">
              <p className="font-mono text-center">
                CAC = (Marketing Spend + Sales Costs) ÷ New Customers
              </p>
            </div>
            <p>
              CAC is fundamental to understanding your unit economics. If your CAC is higher than
              what customers contribute in profit over their lifetime, your business model may not
              be sustainable at scale.
            </p>
            <p>
              For e-commerce businesses, typical CAC ranges from $10-$200+ depending on product
              price point and market. SaaS companies often see CAC of $100-$5,000+ given higher
              customer lifetime values.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-[var(--logistics)]" />
              The LTV:CAC Ratio Explained
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              The <strong>LTV:CAC ratio</strong> compares the lifetime value of a customer to the
              cost of acquiring them. This is the gold standard metric for evaluating business
              health.
            </p>
            <div className="bg-muted/50 p-3 rounded-lg mt-4">
              <p className="font-mono text-center">LTV:CAC = Customer Lifetime Value ÷ CAC</p>
            </div>
            <p>
              A 3:1 ratio is generally considered healthy—you earn $3 in customer value for every $1
              spent acquiring them. Below 1:1 means you&apos;re losing money on each customer.
            </p>
            <p>
              Top-performing companies often achieve 5:1 or higher ratios. This provides healthy
              margins to cover operating costs and still generate profit, while allowing room for
              growth investment.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CAC by Industry */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
            Average CAC by Business Model
          </CardTitle>
          <CardDescription>Industry benchmarks for customer acquisition cost</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#0F4C81]" />
                <span className="font-medium">E-commerce</span>
              </div>
              <p className="text-2xl font-bold text-[#0F4C81]">$45</p>
              <p className="text-xs text-muted-foreground mt-1">Average CAC</p>
              <p className="text-xs text-muted-foreground mt-1">Target LTV:CAC: 4:1</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#2E8B57]" />
                <span className="font-medium">SaaS B2B</span>
              </div>
              <p className="text-2xl font-bold text-[#2E8B57]">$205</p>
              <p className="text-xs text-muted-foreground mt-1">Average CAC</p>
              <p className="text-xs text-muted-foreground mt-1">Target LTV:CAC: 3:1</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="font-medium">Enterprise SaaS</span>
              </div>
              <p className="text-2xl font-bold text-[#F59E0B]">$1,850</p>
              <p className="text-xs text-muted-foreground mt-1">Average CAC</p>
              <p className="text-xs text-muted-foreground mt-1">Target LTV:CAC: 4:1</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                <span className="font-medium">Mobile App</span>
              </div>
              <p className="text-2xl font-bold text-[#8B5CF6]">$1.50</p>
              <p className="text-xs text-muted-foreground mt-1">Average CAC</p>
              <p className="text-xs text-muted-foreground mt-1">Target LTV:CAC: 2:1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payback Period Guide */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-[var(--logistics)]" />
            CAC Payback Period Guide
          </CardTitle>
          <CardDescription>How long should it take to recover acquisition costs?</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            The <strong>CAC Payback Period</strong> measures how many months it takes for a
            customer&apos;s gross profit to cover their acquisition cost. Shorter payback periods
            mean faster capital efficiency.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-2xl font-bold text-emerald-600">Under 6mo</p>
              <p className="font-medium text-emerald-700 dark:text-emerald-300 mt-1">Excellent</p>
              <p className="text-xs text-muted-foreground mt-2">
                Fast capital efficiency. Can scale aggressively without cash constraints.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-2xl font-bold text-blue-600">6-12mo</p>
              <p className="font-medium text-blue-700 dark:text-blue-300 mt-1">Good</p>
              <p className="text-xs text-muted-foreground mt-2">
                Healthy for most business models. Reasonable return on acquisition investment.
              </p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-2xl font-bold text-amber-600">12-18mo</p>
              <p className="font-medium text-amber-700 dark:text-amber-300 mt-1">Acceptable</p>
              <p className="text-xs text-muted-foreground mt-2">
                Higher capital requirements. May need external funding to scale.
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-2xl font-bold text-red-600">18mo+</p>
              <p className="font-medium text-red-700 dark:text-red-300 mt-1">High Risk</p>
              <p className="text-xs text-muted-foreground mt-2">
                Cash flow pressure. Difficult to scale without significant funding.
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
            Pro Tips for Optimizing CAC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Track CAC by channel:</strong> Different channels have vastly different
                  CACs. Shift budget to your most efficient channels.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Segment your customers:</strong> CAC varies by customer type. Focus on
                  high-value segments with better LTV:CAC ratios.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Include all costs:</strong> Don&apos;t forget salaries, tools, and
                  overhead in your true CAC calculation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Monitor blended vs paid CAC:</strong> Track both to understand the
                  impact of organic and word-of-mouth.
                </span>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Improve conversion rates:</strong> Better landing pages and funnels
                  reduce CAC by making every visitor more valuable.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Leverage referrals:</strong> Referred customers often have the lowest
                  CAC and highest LTV. Invest in referral programs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Consider cohort analysis:</strong> CAC often improves over time as you
                  optimize. Track trends, not just averages.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Balance growth vs efficiency:</strong> Sometimes higher CAC is
                  acceptable when gaining market share or entering new markets.
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
              <p className="font-semibold mb-3">Common CAC Mistakes to Avoid</p>
              <ul className="space-y-2">
                <li>
                  <strong>Ignoring time period:</strong> CAC should be calculated over a consistent
                  time period (usually monthly or quarterly) with matching marketing spend and
                  customer acquisitions.
                </li>
                <li>
                  <strong>Not accounting for all channels:</strong> Word-of-mouth, organic search,
                  and direct traffic have &quot;hidden&quot; costs. Include content creation, SEO
                  tools, and brand investments.
                </li>
                <li>
                  <strong>Confusing CPA with CAC:</strong> CPA (Cost Per Acquisition) is for a
                  specific campaign. CAC is the blended cost across all acquisition efforts.
                </li>
                <li>
                  <strong>Overlooking customer quality:</strong> A low CAC doesn&apos;t matter if
                  those customers have low LTV or high churn. Quality matters as much as quantity.
                </li>
                <li>
                  <strong>Not benchmarking properly:</strong> CAC varies dramatically by industry,
                  product price, and business model. Compare against relevant peers.
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
              <CardTitle className="text-base">What is a good CAC for my business?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A &quot;good&quot; CAC depends on your business model and customer LTV. For e-commerce,
              CAC is typically $10-$100. For SaaS, it&apos;s often $100-$1,000+. The key is your
              LTV:CAC ratio—aim for 3:1 or higher. A $500 CAC is excellent if LTV is $2,500, but
              problematic if LTV is only $300.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How is CAC different from CPA?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              CPA (Cost Per Acquisition) measures the cost of acquiring a customer from a specific
              campaign or channel. CAC is the blended average across all acquisition efforts. CPA
              helps optimize individual campaigns; CAC measures overall acquisition efficiency.
              Your overall CAC is the weighted average of all your CPAs.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Should I include salaries in CAC?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Yes! CAC should include all costs associated with acquiring customers: marketing team
              salaries, sales team salaries and commissions, tools and software, agency fees, and
              overhead allocation. The only way to understand true acquisition efficiency is to
              account for all costs.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How do I calculate LTV for the LTV:CAC ratio?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Customer LTV (Lifetime Value) = Average Revenue per Customer × Gross Margin × Average
              Customer Lifespan. For subscription businesses: LTV = ARPU × Gross Margin ÷ Churn
              Rate. For e-commerce: LTV = Average Order Value × Purchase Frequency × Gross Margin ×
              Average Customer Years.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Can CAC be too low?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Yes! An extremely low CAC might indicate you&apos;re underinvesting in growth. If your
              LTV:CAC ratio is 10:1 or higher, you could likely accelerate growth by spending more
              on acquisition. The optimal CAC balances efficiency with growth—most healthy
              businesses target 3:1 to 5:1 LTV:CAC.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How often should I calculate CAC?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Calculate CAC monthly at minimum, but also track rolling averages (3-month, 12-month)
              to smooth out fluctuations. Weekly monitoring can help identify campaign issues
              quickly. Cohort-based CAC analysis gives deeper insights into how efficiency
              changes over time.
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
                Your actual CAC may vary based on business model, market conditions, competition,
                and other factors. CAC should be calculated using your actual financial data and
                reviewed regularly. The LTV:CAC benchmarks mentioned are general guidelines—optimal
                ratios vary by industry, growth stage, and business model.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
