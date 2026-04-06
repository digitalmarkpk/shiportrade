import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Package,
  TrendingUp,
  Shield,
  BarChart3,
  Percent,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StockoutProbabilityModel } from "@/components/tools/StockoutProbabilityModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Stockout Probability Model | Shiportrade.com",
  description: "Calculate stockout probability using normal distribution. Analyze inventory risk, fill rate, service level correlation, and what-if scenarios.",
  keywords: ["stockout probability", "inventory risk", "fill rate", "service level", "safety stock", "demand variability", "lead time variability"],
  openGraph: {
    title: "Stockout Probability Model - Inventory Risk Analysis",
    description: "Calculate and visualize stockout probability. Analyze demand distribution, inventory depletion, and service level correlation.",
    type: "website",
  },
};

export default function StockoutProbabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/warehousing" className="hover:text-foreground">Warehousing</Link>
        <span>/</span>
        <span className="text-foreground">Stockout Probability Model</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Stockout Probability Model</h1>
            <p className="text-muted-foreground">Analyze inventory risk and stockout probability</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <StockoutProbabilityModel />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Stockout Probability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Stockout Probability?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Stockout probability</strong> is the likelihood that customer demand will exceed
              available inventory during a specific period (typically lead time). It quantifies the
              risk of being unable to fulfill orders.
            </p>
            <p className="text-muted-foreground mt-3">
              A 10% stockout probability means there&apos;s a 1 in 10 chance that demand will exceed
              your inventory during lead time, resulting in unfulfilled orders.
            </p>
          </CardContent>
        </Card>

        {/* Normal Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
              Normal Distribution Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The model assumes demand follows a normal (Gaussian) distribution, characterized by:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Mean (μ):</strong> Average demand during lead time</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Std Dev (σ):</strong> Demand variability around the mean</span>
              </li>
            </ul>
            <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs">
              P(stockout) = 1 - Φ(z)<br />
              where z = (I - μ) / σ
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Percent className="h-5 w-5 text-[var(--ocean)]" />
              Key Metrics Explained
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Service Level:</strong> % of cycles without stockout
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Fill Rate:</strong> % of demand fulfilled from stock
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Z-Score:</strong> Standard deviations from mean
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Risk Components */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Stockout Risk Components</CardTitle>
          <CardDescription>Understanding the factors that influence stockout probability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Demand Variability",
                icon: TrendingUp,
                description: "Fluctuation in daily demand",
                impact: "Higher variability = higher stockout risk",
                mitigation: "Improve demand forecasting"
              },
              {
                title: "Lead Time Variability",
                icon: Clock,
                description: "Supplier delivery uncertainty",
                impact: "Unreliable suppliers increase risk",
                mitigation: "Work with reliable suppliers"
              },
              {
                title: "Inventory Level",
                icon: Package,
                description: "Current stock on hand",
                impact: "Lower inventory = higher stockout risk",
                mitigation: "Maintain adequate safety stock"
              },
              {
                title: "Safety Stock",
                icon: Shield,
                description: "Buffer against variability",
                impact: "More safety stock = lower risk",
                mitigation: "Calculate optimal safety stock"
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-[var(--ocean)]" />
                    <p className="font-medium">{item.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-xs text-muted-foreground mb-2">{item.impact}</p>
                  <p className="text-xs italic text-[var(--logistics)]">{item.mitigation}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Levels Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Risk Level Classification Guide</CardTitle>
          <CardDescription>Interpreting stockout probability results and recommended actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Risk Level</th>
                  <th className="text-center py-3 px-4">Probability Range</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium"><Badge className="bg-[var(--logistics)]">Low</Badge></td>
                  <td className="text-center py-3 px-4">&lt; 5%</td>
                  <td className="py-3 px-4 text-muted-foreground">Minimal risk; inventory adequate for most scenarios</td>
                  <td className="py-3 px-4">Maintain current inventory policy</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium"><Badge className="bg-amber-500">Medium</Badge></td>
                  <td className="text-center py-3 px-4">5% - 15%</td>
                  <td className="py-3 px-4 text-muted-foreground">Moderate risk; stockout possible in high demand</td>
                  <td className="py-3 px-4">Consider increasing safety stock</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium"><Badge className="bg-orange-500">High</Badge></td>
                  <td className="text-center py-3 px-4">15% - 30%</td>
                  <td className="py-3 px-4 text-muted-foreground">Significant risk; stockout likely during lead time</td>
                  <td className="py-3 px-4">Urgently review inventory policy</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium"><Badge className="bg-destructive">Critical</Badge></td>
                  <td className="text-center py-3 px-4">&gt; 30%</td>
                  <td className="py-3 px-4 text-muted-foreground">Severe risk; stockout highly probable</td>
                  <td className="py-3 px-4">Expedite replenishment immediately</td>
                </tr>
              </tbody>
            </table>
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
                Use historical data to accurately estimate demand mean and standard deviation
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Account for seasonality - adjust parameters during peak demand periods
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Monitor both service level and fill rate as complementary KPIs
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use what-if analysis to stress-test inventory policies
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Differentiate service levels by product importance (ABC analysis)
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review and update parameters regularly (at least quarterly)
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
                Underestimating demand variability (using point forecasts only)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring lead time variability from suppliers
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Setting the same service level for all products
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not updating parameters when conditions change
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Confusing service level with fill rate
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using outdated historical data for parameter estimation
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Why is my stockout probability different from 100% - service level?</AccordionTrigger>
              <AccordionContent>
                Service level is typically defined for a replenishment cycle, while stockout probability
                can be calculated for any inventory position. If your current inventory is below the
                reorder point (demand during lead time + safety stock), your stockout probability will
                be higher than 100% - service level. The calculator shows your actual risk based on
                current inventory position.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>When should I use normal distribution vs. other distributions?</AccordionTrigger>
              <AccordionContent>
                Normal distribution works well for stable demand with moderate variability (CV &lt; 0.5).
                For highly variable demand (CV &gt; 0.5), intermittent demand, or skewed distributions,
                consider Poisson, Gamma, or negative binomial distributions. The normal approximation
                may underestimate stockout risk in these cases.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I estimate demand standard deviation?</AccordionTrigger>
              <AccordionContent>
                Calculate from historical demand data: σ = √(Σ(d - d̄)² / (n-1)). Use at least 30
                data points for reliable estimates. Adjust for seasonality by using same-period
                comparisons or seasonal decomposition. For new products, use analogous products or
                industry benchmarks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Why is fill rate higher than service level?</AccordionTrigger>
              <AccordionContent>
                Fill rate measures the percentage of demand units fulfilled, while service level
                measures the percentage of order cycles without any stockout. Even when a stockout
                occurs, most demand in that cycle is typically fulfilled before inventory runs out.
                For example, a 95% service level often corresponds to a 99%+ fill rate.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How often should I recalculate stockout probability?</AccordionTrigger>
              <AccordionContent>
                Monitor continuously in real-time systems. Recalculate parameters monthly or quarterly
                depending on demand volatility. Trigger immediate review when: major demand pattern
                changes, supplier performance changes significantly, or new product introductions.
                At minimum, review before major seasons or promotions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>What&apos;s the relationship between safety stock and stockout probability?</AccordionTrigger>
              <AccordionContent>
                Safety stock directly determines service level and thus stockout probability. More
                safety stock = higher service level = lower stockout probability. The relationship
                is non-linear: each additional unit of safety stock reduces stockout probability
                less than the previous unit (diminishing returns). Very high service levels (99%+)
                require exponentially more safety stock.
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
            { name: "Safety Stock Calculator", href: "/tools/warehousing/safety-stock" },
            { name: "Service Level Optimizer", href: "/tools/warehousing/service-level" },
            { name: "EOQ Calculator", href: "/tools/warehousing/eoq-calculator" },
            { name: "Demand Forecast Model", href: "/tools/warehousing/demand-forecast" },
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
