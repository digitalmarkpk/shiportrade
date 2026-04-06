import { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Target,
  BarChart3,
  Calculator,
  DollarSign,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogisticsROICalculator } from "@/components/tools/LogisticsROICalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Logistics ROI Calculator | Shiportrade.com",
  description: "Calculate return on investment for logistics technology, equipment, and process improvements. Features NPV, IRR, payback period, and sensitivity analysis.",
  keywords: ["logistics ROI calculator", "NPV calculator", "IRR calculator", "payback period", "investment analysis", "sensitivity analysis"],
  openGraph: {
    title: "Logistics ROI Calculator - Free Investment Analysis Tool",
    description: "Evaluate logistics investments with NPV, IRR, payback period, and sensitivity analysis.",
    type: "website",
  },
};

export default function LogisticsROICalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Logistics ROI Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Logistics ROI Calculator</h1>
            <p className="text-muted-foreground">Evaluate logistics investments with comprehensive financial analysis</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline">NPV & IRR</Badge>
          <Badge variant="outline">Sensitivity Analysis</Badge>
        </div>
      </div>

      {/* Calculator */}
      <LogisticsROICalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Purpose */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Logistics ROI?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Return on Investment (ROI)</strong> measures the profitability of an investment relative to its cost.
              In logistics, ROI analysis helps evaluate technology implementations, equipment purchases, process improvements,
              and infrastructure investments.
            </p>
            <p className="text-muted-foreground mt-3">
              A comprehensive ROI analysis goes beyond simple payback calculations to include time value of money (NPV, IRR),
              risk assessment, and sensitivity to changing assumptions. This ensures investment decisions are based on
              realistic projections and proper financial metrics.
            </p>
          </CardContent>
        </Card>

        {/* Formula */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-[var(--ocean)]" />
              Key Formulas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
              <div>
                <span className="text-[var(--logistics)]">Simple ROI</span> = (Annual Benefit / Investment) × 100
              </div>
              <div>
                <span className="text-[var(--ocean)]">NPV</span> = Σ [Cash Flow / (1+r)^t] - Initial Investment
              </div>
              <div>
                <span className="text-amber-500">Payback</span> = Investment / Annual Benefit
              </div>
              <div className="pt-2 border-t border-border">
                <span className="text-purple-500">IRR</span> = Rate where NPV = 0
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> NPV and IRR account for the time value of money, making them superior
              metrics for comparing investments with different time horizons.
            </p>
          </CardContent>
        </Card>

        {/* When to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[var(--ocean)]" />
              When to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Technology Investment:</strong> TMS, WMS, tracking systems
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Equipment Purchase:</strong> Forklifts, conveyors, AGVs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Process Improvement:</strong> Automation, optimization
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Infrastructure:</strong> Warehouse expansion, network redesign
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Explained */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
            Understanding Financial Metrics
          </CardTitle>
          <CardDescription>Key metrics for investment decision-making</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                <h3 className="font-semibold">NPV (Net Present Value)</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The sum of discounted future cash flows minus initial investment. A positive NPV indicates
                the investment creates value. NPV is the most reliable metric for investment decisions.
              </p>
            </div>

            <div className="p-4 bg-[var(--logistics)]/5 rounded-lg border border-[var(--logistics)]/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                <h3 className="font-semibold">IRR (Internal Rate of Return)</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The discount rate at which NPV equals zero. Compare IRR to your cost of capital (WACC).
                If IRR exceeds WACC, the investment is viable.
              </p>
            </div>

            <div className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold">Payback Period</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Time to recover the initial investment. Shorter payback reduces risk. Discounted payback
                accounts for time value of money and is more accurate.
              </p>
            </div>

            <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Profitability Index</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Ratio of present value of benefits to initial investment. A PI greater than 1 indicates
                value creation. Useful for ranking projects with limited capital.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips & Mistakes */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-[var(--logistics)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[var(--logistics)]">
              <Lightbulb className="h-5 w-5" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use NPV and IRR together - NPV for value, IRR for ranking
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Include all costs: training, integration, maintenance, opportunity costs
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Run sensitivity analysis with ±20-30% variations in savings estimates
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider risk-adjusted discount rates for uncertain projects
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Document assumptions and revisit projections after implementation
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Factor in tax benefits like depreciation for equipment investments
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overestimating savings - use conservative estimates
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring ongoing costs like maintenance, support, upgrades
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using simple ROI without considering time value of money
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for implementation risks and delays
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting hidden costs: integration, change management, downtime
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using unrealistic discount rates - match your actual cost of capital
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Logistics Savings Categories */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Logistics Savings Categories</CardTitle>
          <CardDescription>Common areas where logistics investments generate returns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { category: "Labor Savings", examples: "Automation, process efficiency, reduced headcount", range: "15-40%" },
              { category: "Freight Savings", examples: "Route optimization, rate negotiation, consolidation", range: "5-20%" },
              { category: "Inventory Savings", examples: "Reduced safety stock, better turnover, lower carrying costs", range: "10-25%" },
              { category: "Warehouse Savings", examples: "Space optimization, picking efficiency, reduced errors", range: "10-30%" },
              { category: "Admin Savings", examples: "Automated documentation, faster processing, less manual work", range: "20-50%" },
              { category: "Error Reduction", examples: "Fewer returns, rework, customer complaints", range: "50-80%" },
              { category: "Insurance Savings", examples: "Lower premiums from better tracking, safety improvements", range: "5-15%" },
              { category: "Compliance Savings", examples: "Avoided penalties, faster customs clearance", range: "Variable" },
            ].map((item) => (
              <div key={item.category} className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">{item.category}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.examples}</p>
                <p className="text-sm font-semibold text-[var(--ocean)] mt-2">
                  Typical: {item.range}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Decision Criteria */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Investment Decision Criteria</CardTitle>
          <CardDescription>When to approve a logistics investment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Metric</th>
                  <th className="text-left py-3 px-4">Approve</th>
                  <th className="text-left py-3 px-4">Review</th>
                  <th className="text-left py-3 px-4">Reject</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">NPV</td>
                  <td className="py-3 px-4 text-[var(--logistics)]">Positive & significant</td>
                  <td className="py-3 px-4 text-yellow-500">Marginally positive</td>
                  <td className="py-3 px-4 text-red-500">Negative</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">IRR vs WACC</td>
                  <td className="py-3 px-4 text-[var(--logistics)]">IRR &gt; WACC + 5%</td>
                  <td className="py-3 px-4 text-yellow-500">WACC &lt; IRR &lt; WACC + 5%</td>
                  <td className="py-3 px-4 text-red-500">IRR &lt; WACC</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Payback Period</td>
                  <td className="py-3 px-4 text-[var(--logistics)]">&lt; 2 years</td>
                  <td className="py-3 px-4 text-yellow-500">2-3 years</td>
                  <td className="py-3 px-4 text-red-500">&gt; 3 years</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Profitability Index</td>
                  <td className="py-3 px-4 text-[var(--logistics)]">&gt; 1.5</td>
                  <td className="py-3 px-4 text-yellow-500">1.0 - 1.5</td>
                  <td className="py-3 px-4 text-red-500">&lt; 1.0</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Sensitivity (NPV@-20%)</td>
                  <td className="py-3 px-4 text-[var(--logistics)]">Still positive</td>
                  <td className="py-3 px-4 text-yellow-500">Marginally negative</td>
                  <td className="py-3 px-4 text-red-500">Significantly negative</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What discount rate should I use for logistics investments?</AccordionTrigger>
              <AccordionContent>
                Use your company's Weighted Average Cost of Capital (WACC) as a baseline. For most companies,
                this falls between 8-12%. For riskier projects or uncertain savings, add 2-3% to create a
                risk-adjusted rate. Government and public sector organizations may use lower rates (3-7%).
                The key is consistency - use the same rate across similar projects for fair comparison.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How do I estimate savings from a logistics technology investment?</AccordionTrigger>
              <AccordionContent>
                Start with baseline metrics: labor hours, error rates, inventory levels, freight costs.
                Industry benchmarks can help: TMS implementations typically save 5-15% on freight costs,
                WMS systems improve productivity 15-30%, and automation can reduce labor costs 20-40%.
                Use conservative estimates and document assumptions. Pilot programs or vendor case studies
                can provide more accurate projections.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What's the difference between simple ROI and NPV?</AccordionTrigger>
              <AccordionContent>
                Simple ROI = Annual Benefit / Investment, ignoring time value of money. NPV discounts
                future cash flows to present value, recognizing that a dollar today is worth more than
                a dollar tomorrow. Simple ROI is easier to calculate but can be misleading for long-term
                investments. NPV is more accurate and recommended for investments spanning multiple years.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>When is IRR not reliable?</AccordionTrigger>
              <AccordionContent>
                IRR can be misleading in several scenarios: (1) Non-conventional cash flows (multiple
                sign changes), where there may be multiple IRRs; (2) Mutually exclusive projects of
                different sizes - IRR favors smaller projects; (3) Reinvestment assumption - IRR assumes
                reinvestment at the IRR rate, which may be unrealistic. In these cases, use NPV as the
                primary decision metric.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How do I account for risk in the analysis?</AccordionTrigger>
              <AccordionContent>
                Three approaches: (1) Sensitivity analysis - test how results change with different
                assumptions; (2) Risk-adjusted discount rate - increase the rate for riskier projects;
                (3) Scenario analysis - evaluate pessimistic, base, and optimistic cases. For high-stakes
                investments, consider Monte Carlo simulation to model probability distributions of outcomes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>Should I include intangible benefits in ROI?</AccordionTrigger>
              <AccordionContent>
                Intangible benefits (customer satisfaction, employee morale, competitive advantage) should
                be documented but not directly included in NPV calculations unless they can be quantified.
                Instead, present them separately as supporting factors. Some intangibles can be estimated:
                improved customer satisfaction → reduced churn → revenue preservation; better data → faster
                decisions → opportunity capture. Use conservative assumptions for any quantification.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Related Tools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Profit Margin Calculator", href: "/tools/international-trade/profit-margin-calculator" },
            { name: "Break-Even Analyzer", href: "/tools/break-even-analyzer" },
            { name: "EOQ Calculator", href: "/tools/warehousing/eoq-calculator" },
            { name: "Service Level Optimizer", href: "/tools/warehousing/service-level" },
          ].map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-all hover:border-[var(--ocean)]/50 cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium group-hover:text-[var(--ocean)] transition-colors">
                    {tool.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--ocean)] transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
