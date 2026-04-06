import { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Package,
  TrendingUp,
  Layers,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InventoryManagementDashboard } from "@/components/tools/InventoryManagementDashboard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Inventory Management Dashboard | Shiportrade.com",
  description: "Comprehensive inventory management dashboard with stock levels, reorder alerts, ABC analysis, turnover metrics, and stock value tracking.",
  keywords: ["inventory dashboard", "stock management", "ABC analysis", "reorder alerts", "inventory turnover", "stock value"],
  openGraph: {
    title: "Inventory Management Dashboard",
    description: "Monitor stock levels, analyze turnover, and optimize your inventory with our comprehensive dashboard.",
    type: "website",
  },
};

export default function InventoryDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/warehousing" className="hover:text-foreground">Warehousing</Link>
        <span>/</span>
        <span className="text-foreground">Inventory Dashboard</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <LayoutDashboard className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Inventory Management Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive inventory analytics and monitoring</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline">Real-time Analytics</Badge>
        </div>
      </div>

      {/* Dashboard */}
      <InventoryManagementDashboard />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Inventory Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Dashboard Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              The <strong>Inventory Management Dashboard</strong> provides a comprehensive view of your
              inventory health, combining real-time metrics with historical trends to help you make
              data-driven decisions.
            </p>
            <p className="text-muted-foreground mt-3">
              Key metrics include stock levels, turnover rates, ABC classification, reorder alerts,
              and stock value tracking. Use this dashboard to identify issues before they become
              problems and optimize your inventory investment.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-[var(--ocean)]" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Stock Levels:</strong> Real-time visibility across all inventory items
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Reorder Alerts:</strong> Proactive notifications for low and out-of-stock items
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>ABC Analysis:</strong> Prioritize items by value and importance
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Turnover Metrics:</strong> Track how efficiently inventory moves
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
              Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[var(--logistics)] font-bold">1.</span>
                <span className="text-sm text-muted-foreground">
                  Reduce stockouts and lost sales through proactive alerts
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--logistics)] font-bold">2.</span>
                <span className="text-sm text-muted-foreground">
                  Optimize working capital by identifying overstocked items
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--logistics)] font-bold">3.</span>
                <span className="text-sm text-muted-foreground">
                  Focus efforts on high-value Class A items
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--logistics)] font-bold">4.</span>
                <span className="text-sm text-muted-foreground">
                  Improve turnover and reduce carrying costs
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Explained */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Understanding Key Metrics</CardTitle>
          <CardDescription>What each metric means and how to use it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Stock Value",
                icon: Package,
                description: "Total value of inventory on hand (units × unit cost)",
                insight: "Track investment in inventory over time"
              },
              {
                title: "Turnover Rate",
                icon: RefreshCw,
                description: "How many times inventory is sold and replaced per year",
                insight: "Higher turnover = more efficient inventory"
              },
              {
                title: "Days of Stock",
                icon: TrendingUp,
                description: "How many days of demand current stock can support",
                insight: "Lower days = tighter inventory management"
              },
              {
                title: "ABC Classification",
                icon: Layers,
                description: "Items ranked by value (A=high, B=medium, C=low)",
                insight: "Focus efforts on high-value Class A items"
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
                  <p className="text-xs italic text-[var(--logistics)]">{item.insight}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ABC Analysis Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[var(--ocean)]" />
            ABC Classification Guide
          </CardTitle>
          <CardDescription>Prioritize inventory management based on item value</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--ocean)]/10 rounded-lg border border-[var(--ocean)]/20">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[var(--ocean)]">Class A</Badge>
                <span className="font-medium">High Value</span>
              </div>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 10-20% of items, 70-80% of value</li>
                <li>• Tight control and frequent review</li>
                <li>• Accurate demand forecasting</li>
                <li>• Low safety stock, high service level</li>
                <li>• Regular supplier communication</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--logistics)]/10 rounded-lg border border-[var(--logistics)]/20">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[var(--logistics)]">Class B</Badge>
                <span className="font-medium">Medium Value</span>
              </div>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 20-30% of items, 15-25% of value</li>
                <li>• Moderate control measures</li>
                <li>• Regular periodic reviews</li>
                <li>• Standard safety stock levels</li>
                <li>• Balanced ordering approach</li>
              </ul>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-amber-500">Class C</Badge>
                <span className="font-medium">Low Value</span>
              </div>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 50-70% of items, 5-10% of value</li>
                <li>• Simple, low-cost controls</li>
                <li>• Less frequent review cycles</li>
                <li>• Larger safety stock acceptable</li>
                <li>• Consider vendor-managed inventory</li>
              </ul>
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
                Review dashboard daily to catch emerging issues early
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Set up automated alerts for critical Class A items
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use trends tab to identify seasonal patterns and plan ahead
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Combine ABC analysis with XYZ demand variability for better classification
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Target higher turnover for Class A, accept lower for Class C
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review and adjust reorder points based on lead time changes
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
                Ignoring low stock alerts until items are out of stock
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Treating all items equally instead of prioritizing by ABC class
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not updating reorder points when demand patterns change
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Focusing only on stockout risk while ignoring overstock costs
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not considering lead time variability in safety stock calculations
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
              <AccordionTrigger>What is a good inventory turnover rate?</AccordionTrigger>
              <AccordionContent>
                A good turnover rate varies by industry. Generally: Retail 8-12x/year, Wholesale 4-8x/year,
                Manufacturing 5-7x/year. Higher turnover indicates efficient inventory management, but very
                high turnover may indicate insufficient safety stock. Compare your turnover to industry
                benchmarks and your own historical performance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How often should I review my ABC classification?</AccordionTrigger>
              <AccordionContent>
                Review ABC classifications quarterly or when significant changes occur in product mix,
                pricing, or demand patterns. Items can shift between classes as their value contribution
                changes. Set up automated reviews to flag items whose value percentage has changed
                significantly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What&apos;s the difference between reorder point and safety stock?</AccordionTrigger>
              <AccordionContent>
                Safety stock is extra inventory held to buffer against demand and supply variability.
                Reorder point is the inventory level that triggers a new order. Formula: Reorder Point =
                (Average Daily Demand × Lead Time) + Safety Stock. Safety stock protects against
                uncertainty; reorder point ensures timely replenishment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How do I handle seasonal demand in my inventory planning?</AccordionTrigger>
              <AccordionContent>
                For seasonal items: 1) Analyze historical demand patterns to identify seasonality,
                2) Adjust safety stock levels seasonally (higher before peak, lower after), 3) Use
                the trends tab to visualize seasonal patterns, 4) Plan orders well in advance to
                account for longer lead times during peak seasons, and 5) Consider separate ABC
                classifications for peak vs. off-peak periods.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What should I do with overstocked items?</AccordionTrigger>
              <AccordionContent>
                For overstocked items: 1) Identify root cause (over-ordering, demand drop, cancelled orders),
                2) Consider promotional pricing or bundling to accelerate sales, 3) Negotiate returns with
                suppliers, 4) Transfer to other locations if multi-warehouse, 5) Adjust future order
                quantities and reorder points, and 6) For slow-moving items, consider discontinuation or
                made-to-order approach.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How do I calculate days of stock accurately?</AccordionTrigger>
              <AccordionContent>
                Days of Stock = Current Inventory ÷ Average Daily Demand. Use moving average demand
                (e.g., 30-day) rather than annual average for more accuracy. Consider trend: if demand
                is increasing, use more recent data; if seasonal, use same period last year as reference.
                For items with lumpy demand, consider using median instead of average.
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
            { name: "EOQ Calculator", href: "/tools/warehousing/eoq-calculator" },
            { name: "Safety Stock Calculator", href: "/tools/warehousing/safety-stock" },
            { name: "Reorder Point Calculator", href: "/tools/warehousing/reorder-point-calculator" },
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
