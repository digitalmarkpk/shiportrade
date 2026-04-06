import { Metadata } from "next";
import { ROASCalculator } from "@/components/tools/ROASCalculator";
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
} from "lucide-react";

export const metadata: Metadata = {
  title: "ROAS Calculator | Shiportrade.com",
  description:
    "Calculate Return on Ad Spend (ROAS) for your e-commerce business. Compare advertising channels, analyze break-even ROAS, and optimize your marketing budget.",
  keywords: [
    "ROAS calculator",
    "return on ad spend",
    "advertising ROI",
    "e-commerce marketing",
    "break-even ROAS",
    "Amazon FBA ROAS",
    "Google Ads ROAS",
    "Facebook Ads ROAS",
  ],
};

export default function ROASCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          ROAS Calculator for E-Commerce
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate your Return on Ad Spend across multiple channels. Understand your break-even
          ROAS, compare advertising performance, and optimize your marketing budget for maximum
          profitability.
        </p>
      </div>

      {/* Calculator */}
      <ROASCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding ROAS in E-Commerce
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>ROAS (Return on Ad Spend)</strong> is the most critical metric for measuring
              advertising effectiveness in e-commerce. It tells you how much revenue you generate
              for every dollar spent on ads.
            </p>
            <p>
              Unlike simple ROI calculations, ROAS focuses specifically on advertising efficiency,
              helping you identify which channels and campaigns are driving the most value for your
              business.
            </p>
            <div className="bg-muted/50 p-3 rounded-lg mt-4">
              <p className="font-mono text-center">
                ROAS = Revenue from Ads ÷ Total Ad Spend
              </p>
            </div>
            <p>
              A ROAS of 4:1 (or 4x) means you generate $4 in revenue for every $1 spent on
              advertising. However, whether this is profitable depends entirely on your profit
              margins.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-[var(--logistics)]" />
              Break-Even ROAS Explained
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Break-even ROAS</strong> is the minimum ROAS you need to cover your costs and
              start making a profit. This is the most important number to know before scaling your
              advertising.
            </p>
            <div className="bg-muted/50 p-3 rounded-lg mt-4">
              <p className="font-mono text-center">
                Break-Even ROAS = 1 ÷ Profit Margin
              </p>
            </div>
            <p>
              For example, if you sell a product for $100 with a 25% profit margin (net profit of
              $25), your break-even ROAS is 4x (1 ÷ 0.25). Any ROAS below 4x means you&apos;re
              losing money on every sale from ads.
            </p>
            <p>
              Higher margins mean lower break-even ROAS, making it easier to achieve profitable
              advertising. This is why improving margins is often more effective than optimizing ads
              alone.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Benchmarks */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
            ROAS Benchmarks by Advertising Channel
          </CardTitle>
          <CardDescription>
            Industry average ROAS across major e-commerce advertising platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#4285F4]" />
                <span className="font-medium">Google Ads</span>
              </div>
              <p className="text-2xl font-bold text-[#4285F4]">4.0x</p>
              <p className="text-xs text-muted-foreground mt-1">Average ROAS</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#1877F2]" />
                <span className="font-medium">Facebook/Instagram</span>
              </div>
              <p className="text-2xl font-bold text-[#1877F2]">3.5x</p>
              <p className="text-xs text-muted-foreground mt-1">Average ROAS</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#FF9900]" />
                <span className="font-medium">Amazon Ads</span>
              </div>
              <p className="text-2xl font-bold text-[#FF9900]">5.0x</p>
              <p className="text-xs text-muted-foreground mt-1">Average ROAS</p>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-900/30 rounded-lg border border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-black" />
                <span className="font-medium">TikTok Ads</span>
              </div>
              <p className="text-2xl font-bold">2.5x</p>
              <p className="text-xs text-muted-foreground mt-1">Average ROAS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
            Pro Tips for Maximizing ROAS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Know your break-even ROAS</strong> - Calculate this first; it&apos;s your
                  minimum profitability threshold
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Improve profit margins</strong> - Higher margins mean lower break-even
                  ROAS, making profitability easier
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Track attribution properly</strong> - Use proper tracking to ensure you
                  credit ads for the revenue they generate
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Consider customer lifetime value</strong> - First purchase ROAS may be low,
                  but repeat purchases can increase overall return
                </span>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Segment by channel</strong> - Different channels perform differently;
                  allocate budget accordingly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Use ROAS targets in bidding</strong> - Set target ROAS bidding strategies
                  in Google and Facebook for automated optimization
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Don&apos;t scale unprofitable campaigns</strong> - Only increase budget
                  on campaigns above break-even ROAS
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>
                  <strong>Account for all costs</strong> - Include creative costs, agency fees, and
                  tools in your true ad spend
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
              <p className="font-semibold mb-3">Common ROAS Mistakes to Avoid</p>
              <ul className="space-y-2">
                <li>
                  <strong>Ignoring profit margins:</strong> A 4x ROAS might look good, but if your
                  margin is 20%, you&apos;re barely breaking even (break-even is 5x).
                </li>
                <li>
                  <strong>Not accounting for all ad costs:</strong> Include management fees, creative
                  costs, and tool subscriptions in your true ad spend calculation.
                </li>
                <li>
                  <strong>Comparing across channels blindly:</strong> Different channels have
                  different ROAS benchmarks. Amazon typically has higher ROAS than social media.
                </li>
                <li>
                  <strong>Focusing only on ROAS:</strong> High ROAS with low volume isn&apos;t
                  sustainable. Balance ROAS with total revenue and profit goals.
                </li>
                <li>
                  <strong>Short attribution windows:</strong> E-commerce purchases often have longer
                  consideration periods. Ensure your attribution window captures true ad impact.
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
              <CardTitle className="text-base">What is a good ROAS for e-commerce?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A &quot;good&quot; ROAS depends on your profit margins. Generally, a 4:1 ratio (4x) is
              considered strong for e-commerce. However, the only ROAS that matters is whether
              you&apos;re above your break-even ROAS. With 25% margins, you need at least 4x ROAS to
              be profitable.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How is ROAS different from ROI?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              ROAS measures revenue relative to ad spend only, while ROI measures profit relative to
              total investment. ROAS = Revenue ÷ Ad Spend. ROI = (Revenue - All Costs) ÷ All Costs.
              ROAS is better for campaign optimization; ROI is better for overall business
              profitability.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Should I pause campaigns below break-even ROAS?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Not necessarily. Consider customer lifetime value (CLV) - initial purchases may have
              low ROAS, but repeat purchases can make customers profitable long-term. Also consider
              brand awareness and market share goals. However, for direct response campaigns, being
              above break-even is essential.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Which advertising channel has the best ROAS?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Amazon Ads typically have the highest ROAS (5x average) due to high purchase intent.
              Google Search Ads follow (4x) with similar intent. Social media platforms (Facebook,
              TikTok) often have lower ROAS (2-3.5x) but can drive volume and discovery. The best
              channel depends on your product, target audience, and campaign objectives.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How can I improve my ROAS quickly?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Quick wins: 1) Pause low-performing keywords/targets, 2) Improve ad relevance and
              quality scores, 3) Add negative keywords to reduce wasted spend, 4) Increase bids on
              high-converting segments, 5) Optimize landing pages for conversions. Long-term: focus
              on improving profit margins to lower your break-even ROAS.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What ROAS should I target for scaling ads?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Target a ROAS 20-30% above your break-even point when scaling. This provides a safety
              buffer for performance fluctuations. For example, if your break-even is 4x, target
              5-5.5x when scaling. This ensures profitability even if performance dips during
              scaling.
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
                Actual advertising performance varies significantly based on product type, market
                conditions, competition, ad quality, and many other factors. Always track your
                actual performance in advertising platforms and adjust your strategy accordingly.
                The break-even ROAS calculation assumes stable profit margins and doesn&apos;t
                account for fixed costs, returns, or customer lifetime value.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
