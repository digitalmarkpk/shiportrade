import { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Package,
  TrendingUp,
  Shield,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ServiceLevelOptimizer } from "@/components/tools/ServiceLevelOptimizer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Service Level Optimizer | Shiportrade.com",
  description: "Optimize inventory service levels by balancing holding costs against stockout costs. Calculate optimal service level, safety stock, and fill rate.",
  keywords: ["service level optimizer", "inventory optimization", "safety stock", "fill rate", "stockout cost", "reorder point"],
  openGraph: {
    title: "Service Level Optimizer - Inventory Optimization",
    description: "Balance service levels with inventory costs. Calculate optimal service level, safety stock requirements, and cost trade-offs.",
    type: "website",
  },
};

export default function ServiceLevelOptimizerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/warehousing" className="hover:text-foreground">Warehousing</Link>
        <span>/</span>
        <span className="text-foreground">Service Level Optimizer</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Target className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Service Level Optimizer</h1>
            <p className="text-muted-foreground">Balance service levels with inventory costs</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <ServiceLevelOptimizer />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Service Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Service Level?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Service Level</strong> (Cycle Service Level or CSL) is the probability of not 
              experiencing a stockout during a replenishment cycle. It represents the percentage of 
              order cycles where all customer demand can be fulfilled from available inventory.
            </p>
            <p className="text-muted-foreground mt-3">
              A 95% service level means that out of 100 replenishment cycles, you will have enough 
              stock to meet all demand in 95 of them. The remaining 5 cycles may experience stockouts.
            </p>
          </CardContent>
        </Card>

        {/* Optimal Formula */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[var(--ocean)]" />
              Optimal Service Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
              <div>
                <span className="text-[var(--ocean)]">SL*</span> = b / (b + h × C)
              </div>
              <div className="pt-2 border-t border-border text-xs space-y-1">
                <div><span className="text-[var(--logistics)]">b</span> = Stockout cost per unit</div>
                <div><span className="text-[var(--logistics)]">h</span> = Holding cost rate</div>
                <div><span className="text-[var(--logistics)]">C</span> = Unit cost</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 inline mr-1" />
              The critical fractile formula finds the service level that minimizes total relevant cost.
            </p>
          </CardContent>
        </Card>

        {/* Fill Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
              Service Level vs Fill Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Service Level:</strong> Probability of no stockout in a cycle (frequency-based)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Fill Rate:</strong> % of demand satisfied from stock (volume-based)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Fill rate is typically higher than service level
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Cost Components */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Cost Components in Service Level Optimization</CardTitle>
          <CardDescription>Understanding the trade-offs that determine optimal service level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                title: "Holding Cost", 
                icon: Package,
                description: "Cost of holding safety stock inventory",
                factors: "Capital cost, storage, insurance, obsolescence",
                behavior: "Increases with higher service level"
              },
              { 
                title: "Stockout Cost", 
                icon: AlertTriangle,
                description: "Cost incurred when demand cannot be met",
                factors: "Lost sales, expediting, customer dissatisfaction",
                behavior: "Decreases with higher service level"
              },
              { 
                title: "Total Relevant Cost", 
                icon: DollarSign,
                description: "Sum of holding and stockout costs",
                factors: "Minimized at optimal service level",
                behavior: "U-shaped curve with minimum at optimal"
              },
              { 
                title: "Safety Stock", 
                icon: Shield,
                description: "Buffer inventory for demand/lead time variability",
                factors: "Determined by target service level and variability",
                behavior: "Increases exponentially near 100% SL"
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
                  <p className="text-xs text-muted-foreground mb-2">{item.factors}</p>
                  <p className="text-xs italic text-[var(--logistics)]">{item.behavior}</p>
                </div>
              );
            })}
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
                Use ABC analysis: higher SL for A items, lower for C items
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Quantify stockout costs accurately - include lost sales, expediting, and reputation
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review service levels quarterly or when significant cost changes occur
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider seasonality - adjust SL for peak demand periods
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Monitor both service level and fill rate as KPIs
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Account for lead time variability from suppliers
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
                Setting uniform service levels for all products
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Underestimating stockout costs (especially intangible costs)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring demand and lead time variability
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not updating calculations when costs change
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Targeting 99%+ service level without cost justification
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Confusing service level with fill rate
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Service Level Guidelines */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Industry Service Level Guidelines</CardTitle>
          <CardDescription>Typical service level targets by industry and product type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-center py-3 px-4">Typical SL</th>
                  <th className="text-left py-3 px-4">Rationale</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Critical Items (A-class)</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">95-99%</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">High value, significant revenue impact from stockouts</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Standard Items (B-class)</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">90-95%</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">Moderate value, balanced cost trade-off</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Low-value Items (C-class)</td>
                  <td className="text-center py-3 px-4"><Badge variant="secondary">85-90%</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">Low value, high SL not cost-effective</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Spare Parts</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">95-99%</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">Equipment downtime costs drive high SL</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Perishable Goods</td>
                  <td className="text-center py-3 px-4"><Badge variant="secondary">85-92%</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">Lower SL to minimize waste/obsolescence</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">E-commerce Retail</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">92-97%</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">Customer experience competitive factor</td>
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
              <AccordionTrigger>Why is my optimal service level lower than expected?</AccordionTrigger>
              <AccordionContent>
                The optimal service level depends on the ratio of stockout cost to holding cost. 
                If your holding costs are high (expensive inventory, high capital cost) or stockout 
                costs are low (customers accept delays, easy to substitute), the optimal level may 
                be lower than typical benchmarks. The formula finds the mathematically optimal point 
                for YOUR specific cost structure.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Should I always use the optimal service level?</AccordionTrigger>
              <AccordionContent>
                The optimal service level is a guideline, not a mandate. Consider: 1) Customer 
                expectations and competitive requirements, 2) Strategic importance of the product, 
                3) Historical stockout impacts, 4) Supplier reliability. Some businesses intentionally 
                maintain higher service levels for strategic reasons despite higher costs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I estimate stockout cost per unit?</AccordionTrigger>
              <AccordionContent>
                Stockout costs include: 1) Lost margin on immediate sale, 2) Future lost sales 
                (customer lifetime value impact), 3) Expedited shipping costs to fulfill later, 
                4) Administrative costs of handling backorders, 5) Reputation damage (harder to 
                quantify). For B2B, consider penalty clauses and contract loss. For B2C, consider 
                customer acquisition costs and lifetime value.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What's the difference between continuous and periodic review?</AccordionTrigger>
              <AccordionContent>
                <strong>Continuous review (Q-system):</strong> Inventory monitored continuously, order 
                placed when reaching reorder point. Lower safety stock required. <strong>Periodic review 
                (P-system):</strong> Inventory checked at fixed intervals. Requires higher safety stock 
                to cover demand during review period + lead time. Choose based on practical constraints 
                like inventory system capabilities and ordering policies.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>Why does fill rate differ from service level?</AccordionTrigger>
              <AccordionContent>
                Service level measures the probability of no stockout (frequency), while fill rate 
                measures the percentage of demand satisfied (volume). A 95% service level might 
                yield a 99% fill rate because when stockouts occur, they typically affect only a 
                small portion of the demand during that cycle. Fill rate is often more meaningful 
                for customer satisfaction metrics.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How often should I recalculate service levels?</AccordionTrigger>
              <AccordionContent>
                Recalculate when: 1) Costs change significantly (unit cost, holding rate, stockout 
                cost), 2) Demand patterns shift (new products, seasonal changes, market trends), 
                3) Supplier lead times change, 4) Business strategy changes. At minimum, review 
                quarterly. For fast-moving consumer goods, monthly reviews may be appropriate.
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
            { name: "EOQ Calculator", href: "/tools/warehousing/eoq-calculator" },
            { name: "Reorder Point Calculator", href: "/tools/warehousing/reorder-point-calculator" },
            { name: "Inventory Turnover Calculator", href: "/tools/warehousing/inventory-turnover-calculator" },
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
