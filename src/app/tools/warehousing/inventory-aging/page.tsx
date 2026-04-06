import { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Package,
  TrendingDown,
  BarChart3,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InventoryAgingAnalysis } from "@/components/tools/InventoryAgingAnalysis";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Inventory Aging Analysis | Shiportrade.com",
  description: "Analyze inventory aging, identify slow-moving items, assess write-off risks, and get liquidation recommendations. Free inventory aging analysis tool.",
  keywords: ["inventory aging", "aging analysis", "slow moving inventory", "write-off risk", "liquidation", "ABC classification", "inventory management"],
  openGraph: {
    title: "Inventory Aging Analysis - Warehouse Management",
    description: "Comprehensive inventory aging analysis with risk assessment and liquidation recommendations.",
    type: "website",
  },
};

export default function InventoryAgingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/warehousing" className="hover:text-foreground">Warehousing</Link>
        <span>/</span>
        <span className="text-foreground">Inventory Aging Analysis</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Inventory Aging Analysis</h1>
            <p className="text-muted-foreground">Identify risks, optimize stock, and maximize recovery</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Tool */}
      <InventoryAgingAnalysis />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Inventory Aging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Inventory Aging?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Inventory aging analysis</strong> is a method of categorizing inventory 
              based on how long items have been in stock. It helps businesses identify slow-moving 
              or obsolete inventory, assess risk exposure, and make informed decisions about 
              markdowns, promotions, or write-offs.
            </p>
            <p className="text-muted-foreground mt-3">
              Typical aging buckets include 0-30 days (fresh), 31-60 days (moderate), 
              61-90 days (concern), and 90+ days (critical). Each bucket represents 
              increasing risk and potential value loss.
            </p>
          </CardContent>
        </Card>

        {/* ABC Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
              ABC Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#0F4C81] text-white">Class A</Badge>
                <span className="text-sm">High value (typically 80% of value, 20% of items)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#2E8B57] text-white">Class B</Badge>
                <span className="text-sm">Moderate value (typically 15% of value, 30% of items)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#F59E0B] text-white">Class C</Badge>
                <span className="text-sm">Lower value (typically 5% of value, 50% of items)</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 inline mr-1" />
              ABC analysis applies the Pareto principle to inventory management, 
              enabling differentiated control strategies based on value contribution.
            </p>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-[var(--ocean)]" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Days in Inventory:</strong> Time since receipt
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Value at Risk:</strong> Inventory value in older buckets
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Write-off Risk:</strong> Potential loss from obsolete stock
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Slow-Moving Rate:</strong> Items with no recent sales
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Aging Buckets Explained */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Understanding Aging Buckets</CardTitle>
          <CardDescription>Risk levels and recommended actions by aging period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                bucket: "0-30 Days", 
                color: "#2E8B57",
                icon: CheckCircle2,
                risk: "Low",
                description: "Fresh inventory with normal turnover",
                action: "Continue regular operations"
              },
              { 
                bucket: "31-60 Days", 
                color: "#0F4C81",
                icon: Info,
                risk: "Moderate",
                description: "Monitor closely for sales velocity",
                action: "Consider promotional pricing"
              },
              { 
                bucket: "61-90 Days", 
                color: "#F59E0B",
                icon: AlertTriangle,
                risk: "High",
                description: "Requires immediate attention",
                action: "Implement markdown or bundle strategy"
              },
              { 
                bucket: "90+ Days", 
                color: "#EF4444",
                icon: Zap,
                risk: "Critical",
                description: "High write-off risk",
                action: "Liquidate or write off immediately"
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.bucket} 
                  className="p-4 rounded-lg border-2"
                  style={{ borderColor: item.color }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                    <p className="font-bold" style={{ color: item.color }}>
                      {item.bucket}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    style={{ borderColor: item.color, color: item.color }}
                    className="mb-2"
                  >
                    {item.risk} Risk
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-xs font-medium">{item.action}</p>
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
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Run aging analysis weekly to catch issues early
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Differentiate strategies by ABC classification
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Set automatic alerts when items enter 60+ day buckets
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Document reasons for slow movement to inform buying
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider seasonal patterns before marking for liquidation
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Pitfalls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring aging until it becomes a crisis
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Applying one-size-fits-all markdowns regardless of ABC class
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not considering seasonal demand patterns
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Delaying write-offs to avoid hitting financial targets
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Failing to root cause slow movement issues
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
              <AccordionTrigger>How often should I run aging analysis?</AccordionTrigger>
              <AccordionContent>
                Best practice is to run inventory aging reports at least weekly. For high-volume 
                or fast-moving inventory, daily analysis may be warranted. The key is to catch 
                aging issues before they become critical. Many businesses integrate aging alerts 
                into their warehouse management systems for real-time monitoring.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the typical write-off threshold?</AccordionTrigger>
              <AccordionContent>
                Most businesses use 90+ days as the critical threshold for write-off consideration, 
                but this varies by industry. Perishable goods may have much shorter thresholds 
                (days or weeks), while durable goods might use 180+ days. Consider product 
                lifecycle, seasonality, and carrying costs when setting your thresholds.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I determine liquidation discounts?</AccordionTrigger>
              <AccordionContent>
                Liquidation discounts should balance recovery value with time to clear. Start 
                with moderate discounts (15-20%) for items in the 60-90 day range, increasing 
                to 30-50% for 90+ day inventory. Consider channels like flash sales, bundle 
                deals, or B2B liquidators. The goal is maximizing recovery while freeing up 
                warehouse space and capital.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Should Class A items be treated differently?</AccordionTrigger>
              <AccordionContent>
                Absolutely. Class A items typically represent 80% of your inventory value, 
                so they deserve more attention. For aging Class A items, consider tactics like 
                proactive sales team notification, special customer outreach, or strategic 
                markdowns. Class C items can be managed with more aggressive liquidation since 
                they represent lower total value.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How does slow-moving differ from dead stock?</AccordionTrigger>
              <AccordionContent>
                Slow-moving inventory has minimal or infrequent sales but still has potential 
                to sell. Dead stock has zero sales over an extended period (often 6-12+ months) 
                and little chance of selling. Slow-moving items benefit from promotions, while 
                dead stock typically requires write-off or donation. Both tie up capital and 
                warehouse space, but the recovery strategies differ.
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
            { name: "Stockout Probability", href: "/tools/warehousing/stockout-probability" },
            { name: "Inventory Turnover", href: "/tools/inventory-turnover-calculator" },
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
