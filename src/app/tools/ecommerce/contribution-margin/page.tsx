import { Metadata } from "next";
import { ContributionMarginCalculator } from "@/components/tools/ContributionMarginCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Package,
  HelpCircle,
  Target,
  Percent,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contribution Margin per SKU Calculator | Shiportrade.com",
  description: "Calculate contribution margin by SKU for e-commerce profitability analysis. Analyze variable costs, break-even points, and optimize your product mix for maximum profitability.",
  keywords: ["contribution margin", "SKU profitability", "product margin calculator", "break-even analysis", "e-commerce profitability", "variable costs", "product mix optimization"],
};

const faqData = [
  {
    question: "What is contribution margin and why is it important?",
    answer: "Contribution margin is the revenue remaining after deducting all variable costs (COGS, shipping, fees). It shows how much each sale contributes to covering fixed costs and generating profit. Unlike gross margin, which only considers COGS, contribution margin provides a more accurate picture of true product profitability.",
  },
  {
    question: "What's the difference between contribution margin and gross margin?",
    answer: "Gross margin only subtracts COGS from revenue, while contribution margin subtracts ALL variable costs including shipping, platform fees, payment processing fees, and other variable expenses. Contribution margin gives a clearer picture of actual profitability per sale and is essential for pricing and product mix decisions.",
  },
  {
    question: "What is a good contribution margin ratio?",
    answer: "It varies by industry, but generally: 30%+ is considered strong, 15-30% is moderate, and below 15% may indicate pricing or cost issues. E-commerce businesses typically aim for 20-40% contribution margin. Luxury or branded products can achieve 50%+ while commodity products often run at lower margins.",
  },
  {
    question: "How do I use break-even analysis with contribution margin?",
    answer: "Break-even units = Fixed Costs ÷ Unit Contribution Margin. For example, if your fixed costs are $10,000 and each unit contributes $25 after variable costs, you need to sell 400 units to break even. This helps set sales targets and evaluate product viability.",
  },
  {
    question: "Should I discontinue products with low or negative contribution margins?",
    answer: "Not necessarily. Consider: 1) Strategic value (loss leaders, customer acquisition), 2) Opportunity to improve costs or pricing, 3) Volume potential, 4) Whether it drives sales of other products. However, consistently negative margins without strategic justification usually warrant discontinuation.",
  },
  {
    question: "How often should I analyze contribution margins?",
    answer: "Review contribution margins monthly for active SKUs, especially when costs change (shipping rates, supplier pricing, platform fees). Set up automated tracking if possible, and flag SKUs that drop below your target margin threshold for immediate review.",
  },
];

const industryBenchmarks = [
  { industry: "Electronics", margin: "15-25%", note: "Competitive pricing, lower margins" },
  { industry: "Fashion/Apparel", margin: "40-60%", note: "Brand-driven, higher margins" },
  { industry: "Health & Beauty", margin: "35-50%", note: "Strong brand loyalty" },
  { industry: "Home & Garden", margin: "30-45%", note: "Seasonal variations common" },
  { industry: "Food & Beverage", margin: "25-35%", note: "Lower due to spoilage risk" },
  { industry: "General E-Commerce", margin: "20-40%", note: "Varies by category" },
];

export default function ContributionMarginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Contribution Margin per SKU Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Analyze contribution margins across your product portfolio. Calculate variable costs, 
          break-even points, and optimize your product mix for maximum profitability.
        </p>
      </div>

      {/* Calculator */}
      <ContributionMarginCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Contribution Margin Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Contribution Margin:</strong> Revenue minus all variable costs. This shows 
              how much each product sale contributes to covering fixed costs and generating profit.
            </p>
            <p>
              <strong>Contribution Margin Ratio:</strong> The percentage of each revenue dollar 
              that becomes contribution margin. Higher ratios indicate more profitable products.
            </p>
            <p>
              <strong>Variable Costs:</strong> Costs that change with sales volume: COGS, shipping, 
              platform fees, payment processing, returns handling, etc.
            </p>
            <p>
              <strong>Break-Even Units:</strong> The number of units needed to sell to cover 
              allocated fixed costs. Beyond this point, each sale generates profit.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
              Key Benefits of SKU Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Identify your most and least profitable products</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Make data-driven pricing decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Optimize product mix for maximum profitability</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Set realistic sales targets based on break-even</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Identify cost reduction opportunities per SKU</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Industry Benchmarks */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
            Industry Contribution Margin Benchmarks
          </CardTitle>
          <CardDescription>
            Typical contribution margin ratios by industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium">Industry</th>
                  <th className="text-right py-3 px-4 font-medium">Typical Margin Ratio</th>
                  <th className="text-left py-3 px-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {industryBenchmarks.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{row.industry}</td>
                    <td className="text-right py-3 px-4 text-[var(--logistics)] font-semibold">{row.margin}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.note}</td>
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
            <Target className="h-5 w-5 text-[var(--ocean)]" />
            Pro Tips for SKU Profitability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Focus on Unit Contribution</span>
              </div>
              <p className="text-sm text-muted-foreground">
                While total contribution matters, focus on unit contribution margin to understand 
                true profitability per sale. This helps prioritize products effectively.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Bundle Strategically</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Bundle low-margin products with high-margin items to improve overall profitability 
                while increasing average order value.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Monitor Cost Changes</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Variable costs change frequently. Review shipping rates, platform fees, and COGS 
                monthly to ensure accurate margin calculations.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Consider Velocity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A moderate margin on a fast-selling product may generate more total contribution 
                than a high margin on a slow mover. Factor in sales velocity.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Watch for Margin Creep</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Set alerts for products approaching negative margin. Cost increases can silently 
                erode profitability without regular monitoring.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Use Break-Even for Pricing</span>
              </div>
              <p className="text-sm text-muted-foreground">
                When considering price changes, recalculate break-even units. A small price 
                increase might significantly reduce break-even requirements.
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
                <strong>Confusing gross margin with contribution margin:</strong> Gross margin 
                only considers COGS. Contribution margin includes all variable costs for true profitability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Ignoring fixed cost allocation:</strong> While contribution margin ignores 
                fixed costs, ensure total contribution covers all fixed costs for business viability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Neglecting volume impact:</strong> A high margin on a slow seller may 
                generate less total contribution than a moderate margin on a fast mover.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Using outdated cost data:</strong> Shipping rates, platform fees, and 
                COGS change frequently. Update cost structures at least monthly for accurate analysis.
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
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[var(--logistics)]" />
            Related Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/tools/ecommerce/fba-calculator" className="block">
              <Card className="h-full hover:border-[var(--ocean)] transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">FBA Revenue Calculator</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calculate Amazon FBA revenue and profit margins
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/ecommerce/roas-calculator" className="block">
              <Card className="h-full hover:border-[var(--ocean)] transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">ROAS Calculator</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calculate Return on Ad Spend for campaigns
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/international-trade/profit-margin-calculator" className="block">
              <Card className="h-full hover:border-[var(--ocean)] transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Profit Margin Calculator</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive profit margin analysis
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/break-even-analyzer" className="block">
              <Card className="h-full hover:border-[var(--ocean)] transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Break-Even Analyzer</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Detailed break-even point analysis
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
