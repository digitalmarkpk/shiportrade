"use client";

import { CargoConsolidationOptimizer } from "@/components/tools/CargoConsolidationOptimizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Container,
  Package,
  TrendingDown,
  Clock,
  Warehouse,
  Ship,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  Layers,
  Route,
  BarChart3,
  Calculator,
} from "lucide-react";
import Link from "next/link";

export default function CargoConsolidationOptimizerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/tools" className="hover:text-[#0F4C81] transition-colors">
            Tools
          </Link>
          <ArrowRight className="h-4 w-4" />
          <Link href="/tools/ocean-freight" className="hover:text-[#0F4C81] transition-colors">
            Ocean Freight
          </Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-foreground">Cargo Consolidation</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
          Cargo Consolidation Optimizer
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Optimize your shipping costs by consolidating multiple LCL shipments into FCL containers.
          Analyze consolidation opportunities, calculate savings, and optimize container utilization for
          maximum cost efficiency.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-[#0F4C81]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-[#0F4C81]" />
              <span className="text-sm font-medium">Average Savings</span>
            </div>
            <p className="text-2xl font-bold text-[#0F4C81]">15-40%</p>
            <p className="text-xs text-muted-foreground">on consolidated shipments</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#2E8B57]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Container className="h-4 w-4 text-[#2E8B57]" />
              <span className="text-sm font-medium">Break-Even Volume</span>
            </div>
            <p className="text-2xl font-bold text-[#2E8B57]">~15 CBM</p>
            <p className="text-xs text-muted-foreground">for 20&apos; container conversion</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Transit Buffer</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">2-5 days</p>
            <p className="text-xs text-muted-foreground">additional for consolidation</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Target Utilization</span>
            </div>
            <p className="text-2xl font-bold text-purple-500">80-90%</p>
            <p className="text-xs text-muted-foreground">optimal container fill</p>
          </CardContent>
        </Card>
      </div>

      {/* Tool Component */}
      <CargoConsolidationOptimizer />

      {/* Educational Content */}
      <div className="mt-12 space-y-8">
        {/* What is Cargo Consolidation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Container className="h-5 w-5 text-[#0F4C81]" />
              What is Cargo Consolidation?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              Cargo consolidation is a logistics strategy that combines multiple smaller shipments (LCL - Less
              than Container Load) into a single full container load (FCL). This approach offers significant
              cost savings and operational benefits for shippers with multiple smaller shipments heading to
              the same destination.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6 not-prose">
              <div className="p-4 bg-[#0F4C81]/5 rounded-lg border border-[#0F4C81]/20">
                <h4 className="font-semibold text-[#0F4C81] mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  LCL Shipment
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                    Pay per CBM (cubic meter)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                    Flexible for small volumes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                    No minimum volume requirement
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Higher per-unit cost
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Multiple handling points
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Longer transit at CFS
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-[#2E8B57]/5 rounded-lg border border-[#2E8B57]/20">
                <h4 className="font-semibold text-[#2E8B57] mb-3 flex items-center gap-2">
                  <Container className="h-5 w-5" />
                  FCL Consolidation
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                    Fixed container price
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                    Lower per-unit cost at scale
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                    Single handling point
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                    Reduced cargo damage risk
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                    Faster transit (no CFS stop)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                    Simplified documentation
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-[#2E8B57]" />
              Key Benefits of Consolidation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:border-[#0F4C81]/30 transition-colors">
                <DollarSign className="h-8 w-8 text-[#0F4C81] mb-3" />
                <h4 className="font-semibold mb-2">Cost Savings</h4>
                <p className="text-sm text-muted-foreground">
                  Save 15-40% on freight costs by converting LCL to FCL when volume justifies it. The
                  break-even point is typically around 15-18 CBM for a 20&apos; container depending on LCL
                  rates.
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:border-[#2E8B57]/30 transition-colors">
                <Layers className="h-8 w-8 text-[#2E8B57] mb-3" />
                <h4 className="font-semibold mb-2">Reduced Handling</h4>
                <p className="text-sm text-muted-foreground">
                  Fewer touch points mean less risk of cargo damage. LCL shipments are handled multiple
                  times during deconsolidation and consolidation processes at Container Freight Stations
                  (CFS).
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:border-purple-500/30 transition-colors">
                <Route className="h-8 w-8 text-purple-500 mb-3" />
                <h4 className="font-semibold mb-2">Simplified Logistics</h4>
                <p className="text-sm text-muted-foreground">
                  Single container tracking, one bill of lading, consolidated customs documentation, and
                  simplified supply chain management. Reduces administrative overhead significantly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When to Consolidate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
              When Should You Consolidate?
            </CardTitle>
            <CardDescription>Key decision factors for cargo consolidation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Decision Factor</th>
                    <th className="text-left py-3 px-4 font-medium">Consolidate ✓</th>
                    <th className="text-left py-3 px-4 font-medium">Ship Separately ✗</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Total Volume</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-[#2E8B57]/10 text-[#2E8B57]">15+ CBM</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">&lt;10 CBM</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Destination</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-[#2E8B57]/10 text-[#2E8B57]">Same Port</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">Different Ports</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Ready Dates</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-[#2E8B57]/10 text-[#2E8B57]">Within 5-7 Days</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">2+ Weeks Apart</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Cargo Type</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-[#2E8B57]/10 text-[#2E8B57]">Compatible</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">Hazardous/Reefer</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Urgency Level</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-[#2E8B57]/10 text-[#2E8B57]">Flexible Timing</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">Time-Critical</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-[#0F4C81]" />
              Pro Tips for Effective Consolidation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Plan Ahead",
                  description:
                    "Work with suppliers to align cargo ready dates within a 3-5 day window to maximize consolidation opportunities and minimize warehouse costs.",
                  icon: Clock,
                },
                {
                  title: "Monitor Break-Even Points",
                  description:
                    "Track LCL rates vs FCL costs. When LCL cost exceeds FCL rate, consolidation becomes immediately beneficial. Know your thresholds.",
                  icon: Calculator,
                },
                {
                  title: "Use Bonded Warehouses",
                  description:
                    "Store consolidated cargo at origin bonded warehouses to align shipment timings without customs clearance delays or duty payments.",
                  icon: Warehouse,
                },
                {
                  title: "Negotiate Volume Discounts",
                  description:
                    "Freight forwarders often offer better rates for regular consolidation volumes. Build long-term partnerships for preferential pricing.",
                  icon: DollarSign,
                },
                {
                  title: "Consider Destination Costs",
                  description:
                    "Factor in destination handling, demurrage, and inland transport costs when evaluating consolidation savings. Total landed cost matters.",
                  icon: Route,
                },
                {
                  title: "Track Container Utilization",
                  description:
                    "Aim for 80-90% container utilization. Below 70% may not justify the coordination effort and warehouse storage costs.",
                  icon: BarChart3,
                },
              ].map((tip, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <tip.icon className="h-4 w-4 text-[#2E8B57]" />
                    {tip.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  mistake: "Ignoring Transit Time Impact",
                  solution:
                    "Consolidation adds 2-5 days for warehouse handling and container loading. Factor this into your delivery schedule and communicate with customers.",
                },
                {
                  mistake: "Overlooking Warehouse Costs",
                  solution:
                    "Calculate storage costs for waiting cargo. If early shipments wait too long, savings may be eroded by warehouse fees. Monitor daily storage rates.",
                },
                {
                  mistake: "Mixing Incompatible Cargo",
                  solution:
                    "Never consolidate hazardous materials with general cargo, or reefer goods with dry cargo. This can cause delays, rejections, and additional costs.",
                },
                {
                  mistake: "Poor Documentation",
                  solution:
                    "Ensure all shipments have complete, accurate documentation. One incomplete document can delay the entire consolidated container at customs.",
                },
              ].map((item, index) => (
                <div key={index} className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-600">{item.mistake}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Container Specifications Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-[#0F4C81]" />
              Container Specifications Reference
            </CardTitle>
            <CardDescription>Standard container dimensions for consolidation planning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Container</th>
                    <th className="text-right py-3 px-4 font-medium">Capacity (CBM)</th>
                    <th className="text-right py-3 px-4 font-medium">Max Payload (kg)</th>
                    <th className="text-right py-3 px-4 font-medium">Internal Dimensions</th>
                    <th className="text-right py-3 px-4 font-medium">Typical FCL Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">20&apos; GP</td>
                    <td className="text-right py-3 px-4">33.2</td>
                    <td className="text-right py-3 px-4">21,700</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">5.9m × 2.35m × 2.39m</td>
                    <td className="text-right py-3 px-4">$2,500 - $3,500</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">40&apos; GP</td>
                    <td className="text-right py-3 px-4">67.7</td>
                    <td className="text-right py-3 px-4">25,800</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">12.0m × 2.35m × 2.39m</td>
                    <td className="text-right py-3 px-4">$3,800 - $5,200</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">40&apos; HC</td>
                    <td className="text-right py-3 px-4">76.3</td>
                    <td className="text-right py-3 px-4">26,330</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">12.0m × 2.35m × 2.70m</td>
                    <td className="text-right py-3 px-4">$4,200 - $5,800</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">45&apos; HC</td>
                    <td className="text-right py-3 px-4">86.0</td>
                    <td className="text-right py-3 px-4">25,500</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">13.6m × 2.35m × 2.70m</td>
                    <td className="text-right py-3 px-4">$5,000 - $6,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Rates are indicative and vary by trade lane, season, and carrier. Always obtain current quotes
              for accurate pricing.
            </p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-[#0F4C81]" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>What is the break-even volume for LCL to FCL conversion?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    The break-even point typically falls between 15-18 CBM for a 20&apos; container,
                    depending on LCL rates and FCL costs. For example, if LCL rate is $85/CBM and a 20&apos;
                    FCL costs $2,800, the break-even is around 33 CBM. However, considering reduced handling
                    and documentation benefits, consolidation may be worthwhile even at lower volumes.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>How does warehouse storage affect consolidation savings?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    When consolidating, early shipments may need to wait for later ones. Warehouse costs
                    typically range from $0.40-$1.10 per CBM per day depending on location. If shipments have
                    a 7-day spread and you&apos;re consolidating 30 CBM at $0.50/CBM/day, that&apos;s $105
                    in storage costs to factor into your savings calculation.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>Can I consolidate shipments from different suppliers?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Yes, this is a common practice called &quot;buyer&apos;s consolidation.&quot; Multiple
                    suppliers ship to a consolidator&apos;s warehouse near the port, where cargo is combined
                    into FCL. This is particularly effective for importers working with multiple suppliers in
                    the same region (e.g., various manufacturers in Guangdong Province).
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>What documentation is needed for consolidated shipments?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Consolidated shipments require: Master Bill of Lading (for the container), House Bills
                    of Lading (for each shipment), consolidated packing list, commercial invoices for all
                    shipments, and potentially a consolidated customs declaration. Work with your freight
                    forwarder to ensure proper documentation.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>How do I handle cargo insurance for consolidated shipments?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Each shipment within a consolidated container should have its own cargo insurance
                    covering its value. Alternatively, you can obtain a single policy covering the entire
                    consolidated shipment. Ensure the insurance covers the warehouse storage period and
                    clearly documents the cargo value and description.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q6">
                <AccordionTrigger>What happens if one shipment in the consolidation is delayed?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    A delayed shipment can affect the entire consolidation. Options include: waiting for the
                    delayed cargo (increasing warehouse costs), shipping partial FCL (reducing utilization
                    benefits), or moving that shipment to LCL. Always have contingency plans and communicate
                    with all suppliers about critical cutoff dates.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Related Tools</CardTitle>
            <CardDescription>Explore other tools that complement cargo consolidation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "CBM Calculator", href: "/tools/ocean-freight/cbm-calculator", icon: Package },
                { name: "FCL Loadability", href: "/tools/ocean-freight/fcl-loadability", icon: Container },
                { name: "Container Loading", href: "/tools/ocean-freight/container-loading", icon: Layers },
                {
                  name: "Freight Rate Benchmark",
                  href: "/tools/ocean-freight/freight-rate-benchmark",
                  icon: DollarSign,
                },
              ].map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="p-4 border rounded-lg hover:border-[#0F4C81]/30 hover:bg-[#0F4C81]/5 transition-colors group"
                >
                  <tool.icon className="h-6 w-6 text-[#0F4C81] mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">{tool.name}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
