import { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Package,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EOQCalculator } from "@/components/tools/EOQCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "EOQ Calculator | Shiportrade.com",
  description: "Calculate Economic Order Quantity to minimize inventory costs. Free EOQ calculator with sensitivity analysis and reorder point calculation.",
  keywords: ["EOQ calculator", "economic order quantity", "inventory management", "reorder point", "stock optimization"],
  openGraph: {
    title: "EOQ Calculator - Inventory Optimization",
    description: "Minimize inventory costs with our EOQ calculator. Includes sensitivity analysis and reorder point.",
    type: "website",
  },
};

export default function EOQCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/warehousing" className="hover:text-foreground">Warehousing</Link>
        <span>/</span>
        <span className="text-foreground">EOQ Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">EOQ Calculator</h1>
            <p className="text-muted-foreground">Economic Order Quantity for inventory optimization</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <EOQCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is EOQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is EOQ?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Economic Order Quantity (EOQ)</strong> is the optimal order quantity that 
              minimizes total inventory costs, which include ordering costs and holding costs. 
              It's a fundamental formula in inventory management, first developed by Ford W. 
              Harris in 1913.
            </p>
            <p className="text-muted-foreground mt-3">
              The EOQ model assumes constant demand, fixed ordering costs, and constant lead time. 
              While these assumptions rarely hold perfectly in practice, EOQ provides a useful 
              starting point for inventory planning.
            </p>
          </CardContent>
        </Card>

        {/* Formula */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5 text-[var(--ocean)]" />
              EOQ Formula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
              <div>
                <span className="text-[var(--ocean)]">EOQ</span> = √(2DS/H)
              </div>
              <div className="pt-2 border-t border-border text-xs space-y-1">
                <div><span className="text-[var(--logistics)]">D</span> = Annual demand</div>
                <div><span className="text-[var(--logistics)]">S</span> = Order cost per order</div>
                <div><span className="text-[var(--logistics)]">H</span> = Holding cost per unit/year</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 inline mr-1" />
              H = Unit Cost × Holding Rate (%). The square root function creates the 
              characteristic U-shaped total cost curve.
            </p>
          </CardContent>
        </Card>

        {/* When to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-[var(--ocean)]" />
              When to Use EOQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Stable Demand:</strong> Products with consistent, predictable demand
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Known Costs:</strong> When ordering and holding costs are quantifiable
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Independent Items:</strong> Items not tied to production schedules
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Standard Products:</strong> Non-perishable, non-seasonal items
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Cost Components */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Understanding Inventory Costs</CardTitle>
          <CardDescription>The components that make up total inventory cost</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                title: "Ordering Cost", 
                icon: ShoppingCart,
                examples: "Purchase order processing, receiving, inspection",
                behavior: "Decreases with larger order quantities"
              },
              { 
                title: "Holding Cost", 
                icon: Package,
                examples: "Storage, insurance, obsolescence, capital cost",
                behavior: "Increases with larger order quantities"
              },
              { 
                title: "Total Cost", 
                icon: TrendingDown,
                examples: "Sum of ordering and holding costs",
                behavior: "Minimized at EOQ"
              },
              { 
                title: "Stockout Cost", 
                icon: AlertTriangle,
                examples: "Lost sales, production delays, customer dissatisfaction",
                behavior: "Managed through safety stock"
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-[var(--ocean)]" />
                    <p className="font-medium">{item.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.examples}</p>
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
                EOQ is a guideline, not a rule - adjust for practical constraints
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                The total cost curve is flat near EOQ - small variations are acceptable
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review and update EOQ calculations when costs or demand change significantly
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider supplier minimums and quantity discounts in practice
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use safety stock to handle demand variability
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
                Underestimating holding costs (include opportunity cost of capital)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring demand variability and seasonality
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not updating calculations when costs change
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Applying EOQ to perishable or trendy products
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring supplier constraints (minimum order quantities)
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
              <AccordionTrigger>What if demand varies throughout the year?</AccordionTrigger>
              <AccordionContent>
                EOQ assumes constant demand. For variable demand, consider: 1) Calculate EOQ for 
                each season separately, 2) Use periodic review systems with variable order quantities, 
                or 3) Apply advanced models like Silver-Meal algorithm. Safety stock should be 
                increased to account for demand variability.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How do quantity discounts affect EOQ?</AccordionTrigger>
              <AccordionContent>
                Quantity discounts create a trade-off between lower unit costs and higher holding 
                costs. Calculate total cost (including purchase cost) at EOQ and each discount 
                breakpoint. Choose the quantity with lowest total cost. Sometimes ordering more 
                than EOQ is optimal when discounts are significant.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Should I use EOQ for all products?</AccordionTrigger>
              <AccordionContent>
                EOQ is best for A and B category items in ABC analysis - items with moderate to 
                high value and volume. For C items (low value), simple rules like "order 3 months 
                supply" may be more practical. For critical or highly variable items, consider 
                specialized models or safety stock-focused approaches.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What holding rate should I use?</AccordionTrigger>
              <AccordionContent>
                Typical holding rates range from 15-35% of unit cost. Components include: 
                capital cost (opportunity cost, typically 8-15%), storage cost (warehouse space, 
                handling), insurance, taxes, and obsolescence risk. Higher-risk or fashion 
                products should use higher rates. Our default of 20% is a common starting point.
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
            { name: "Reorder Point Calculator", href: "/tools/warehousing/reorder-point-calculator" },
            { name: "Inventory Turnover Calculator", href: "/tools/warehousing/inventory-turnover-calculator" },
            { name: "Warehousing Cost Calculator", href: "/tools/warehousing/cost-calculator" },
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
