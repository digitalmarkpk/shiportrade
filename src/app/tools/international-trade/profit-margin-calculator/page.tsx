import { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Target,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProfitMarginCalculator } from "@/components/tools/ProfitMarginCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Profit Margin Calculator | Shiportrade.com",
  description: "Calculate profit margins, markup, break-even point, and ROI for international trade transactions. Free tool with sensitivity analysis.",
  keywords: ["profit margin calculator", "margin calculator", "markup calculator", "ROI calculator", "break even analysis"],
  openGraph: {
    title: "Profit Margin Calculator - Free Tool",
    description: "Calculate profitability for your trade business with margin, markup, and break-even analysis.",
    type: "website",
  },
};

export default function ProfitMarginCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Profit Margin Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--logistics)]/10 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-[var(--logistics)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Profit Margin Calculator</h1>
            <p className="text-muted-foreground">Analyze profitability for international trade</p>
          </div>
        </div>
        <Badge className="gradient-logistics text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <ProfitMarginCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Purpose */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Profit Margin?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Profit margin</strong> is the percentage of revenue that remains as profit after all expenses 
              have been deducted. It's a key indicator of a company's financial health and pricing strategy. 
              In international trade, understanding your profit margin is crucial for competitive pricing 
              while ensuring profitability.
            </p>
            <p className="text-muted-foreground mt-3">
              There are several types of profit margins, including gross margin (revenue minus cost of goods sold), 
              operating margin (after operating expenses), and net margin (after all expenses including taxes). 
              Each provides different insights into your business performance.
            </p>
          </CardContent>
        </Card>

        {/* Formula */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
              Key Formulas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
              <div>
                <span className="text-[var(--logistics)]">Gross Margin</span> = (Revenue - COGS) / Revenue × 100
              </div>
              <div>
                <span className="text-[var(--ocean)]">Net Margin</span> = Net Profit / Revenue × 100
              </div>
              <div>
                <span className="text-amber-500">Markup</span> = (Price - Cost) / Cost × 100
              </div>
              <div className="pt-2 border-t border-border">
                <span className="text-purple-500">ROI</span> = Net Profit / Total Cost × 100
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Margin is calculated on selling price, while markup is calculated on cost.
              A 50% markup equals a 33.3% margin.
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
                  <strong>Pricing Strategy:</strong> Set competitive yet profitable prices
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Cost Analysis:</strong> Identify areas to reduce costs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Supplier Negotiation:</strong> Determine target purchase prices
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Business Planning:</strong> Forecast profitability at scale
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

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
                Always include all hidden costs: payment fees, returns, warranty reserves
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Factor in currency fluctuation when importing - add 2-3% buffer
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Target margins of 20-30% for sustainable growth in most industries
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Higher volume can justify lower margins if fixed costs are covered
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Regularly review margins - costs and competition change over time
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
                Confusing markup with margin - they are different calculations
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting to include landed costs (freight, duties, insurance)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for payment processing and transaction fees
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring overhead costs when calculating true profitability
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Setting prices based on competitors without knowing your costs
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Margin Benchmarks */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Industry Margin Benchmarks</CardTitle>
          <CardDescription>Typical net profit margins by industry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { industry: "Wholesale Trade", margin: "2-5%", note: "High volume, low margin" },
              { industry: "E-commerce", margin: "5-10%", note: "Varies by category" },
              { industry: "Manufacturing", margin: "8-12%", note: "Depends on complexity" },
              { industry: "Logistics & Freight", margin: "3-8%", note: "Competitive market" },
              { industry: "Consumer Electronics", margin: "5-15%", note: "Brand dependent" },
              { industry: "Apparel & Fashion", margin: "10-20%", note: "Higher for luxury" },
              { industry: "Food & Beverage", margin: "5-10%", note: "Low margins typical" },
              { industry: "Industrial Equipment", margin: "10-20%", note: "B2B typically higher" },
            ].map((item) => (
              <div key={item.industry} className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">{item.industry}</p>
                <p className="text-lg font-bold text-[var(--ocean)]">{item.margin}</p>
                <p className="text-xs text-muted-foreground">{item.note}</p>
              </div>
            ))}
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
              <AccordionTrigger>What is the difference between margin and markup?</AccordionTrigger>
              <AccordionContent>
                Margin is calculated as a percentage of the selling price, while markup is calculated 
                as a percentage of the cost. For example, if you buy a product for $100 and sell it 
                for $150, the markup is 50% ($50/$100) but the margin is 33.3% ($50/$150). 
                This distinction is crucial for pricing strategy and financial analysis.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is a good profit margin for international trade?</AccordionTrigger>
              <AccordionContent>
                A "good" profit margin varies by industry, but generally: wholesale businesses aim for 
                10-20% gross margin, distributors target 15-25%, and retailers need 25-50% due to higher 
                overhead. For import/export specifically, a net margin of 8-15% is typically considered 
                healthy, though specialized or niche products may command higher margins.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I calculate break-even point?</AccordionTrigger>
              <AccordionContent>
                Break-even point is where total revenue equals total costs, resulting in zero profit. 
                The formula is: Fixed Costs ÷ (Selling Price - Variable Cost per Unit). This tells you 
                how many units you need to sell to cover all costs. Our calculator automatically computes 
                this based on your inputs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Why is my net margin lower than gross margin?</AccordionTrigger>
              <AccordionContent>
                Net margin is always lower than gross margin because it accounts for all expenses, 
                not just the cost of goods sold. Operating expenses like marketing, salaries, rent, 
                payment processing fees, and overhead reduce your gross profit to arrive at net profit. 
                This is why tracking both margins is important for understanding your true profitability.
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
            { name: "Landed Cost Calculator", href: "/tools/international-trade/landed-cost-calculator" },
            { name: "Break-Even Analyzer", href: "/tools/international-trade/break-even-analyzer" },
            { name: "ROI Calculator", href: "/tools/international-trade/roi-calculator" },
            { name: "Currency Converter", href: "/tools/international-trade/currency-converter" },
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
