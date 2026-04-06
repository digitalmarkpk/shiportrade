import { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Ship,
  Plane,
  Truck,
  Train,
  Route,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShipmentCostCalculator } from "@/components/tools/ShipmentCostCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Shipment Cost Calculator | Shiportrade.com",
  description: "Calculate and compare shipment costs across air, sea, road, and rail transport modes. Get detailed surcharge breakdowns and total landed costs.",
  keywords: ["shipment cost calculator", "freight cost estimator", "shipping cost comparison", "transport mode comparison", "landed cost"],
  openGraph: {
    title: "Shipment Cost Calculator - Compare Transport Modes",
    description: "Calculate and compare shipping costs across multiple transport modes with detailed surcharge breakdowns.",
    type: "website",
  },
};

export default function ShipmentCostCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Shipment Cost Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Calculator className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Shipment Cost Calculator</h1>
            <p className="text-muted-foreground">Compare costs across all transport modes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline">Multi-Mode Comparison</Badge>
        </div>
      </div>

      {/* Calculator */}
      <ShipmentCostCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Purpose */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Shipment Cost?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Shipment cost</strong> encompasses all expenses involved in moving goods from origin to destination. 
              This includes base freight charges, fuel surcharges, terminal handling fees, documentation costs, 
              insurance, and various accessorial charges.
            </p>
            <p className="text-muted-foreground mt-3">
              Understanding the complete cost structure helps businesses make informed decisions about transport 
              mode selection, routing optimization, and overall supply chain efficiency. Different modes have 
              vastly different cost profiles and transit time characteristics.
            </p>
          </CardContent>
        </Card>

        {/* Transport Modes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Route className="h-5 w-5 text-[var(--ocean)]" />
              Transport Modes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Plane className="h-5 w-5 text-[var(--ocean)]" />
              <div>
                <div className="font-medium text-sm">Air Freight</div>
                <div className="text-xs text-muted-foreground">Fastest, highest cost/kg</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Ship className="h-5 w-5 text-[var(--logistics)]" />
              <div>
                <div className="font-medium text-sm">Sea Freight</div>
                <div className="text-xs text-muted-foreground">Most economical for large volumes</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Truck className="h-5 w-5 text-amber-500" />
              <div>
                <div className="font-medium text-sm">Road Transport</div>
                <div className="text-xs text-muted-foreground">Flexible door-to-door delivery</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Train className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-medium text-sm">Rail Freight</div>
                <div className="text-xs text-muted-foreground">Balanced cost-speed for continents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
              When to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Mode Selection:</strong> Compare costs across different transport options
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Budgeting:</strong> Estimate total logistics costs before shipping
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Route Planning:</strong> Evaluate different origin-destination combinations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Quote Verification:</strong> Validate carrier quotes against estimates
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
                Consider volumetric weight for air freight - you&apos;re charged by space, not just weight
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                LCL becomes cost-effective for shipments under 15 CBM; FCL for larger volumes
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Factor in transit time costs - slower shipping may mean higher inventory holding costs
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Watch for peak season surcharges (Q4 for sea, holiday periods for air)
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Multimodal solutions can offer the best balance of cost and speed
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Always get at least 3 quotes from different carriers for comparison
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
                Focusing only on base freight rate and ignoring surcharges
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not considering total landed cost including duties and taxes
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking demurrage and detention risks with tight schedules
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring cargo insurance - it&apos;s not always included in freight rates
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting origin/destination handling charges beyond port fees
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Surcharges Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Common Surcharges Reference</CardTitle>
          <CardDescription>Understanding the various surcharges that affect shipment costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Surcharge</th>
                  <th className="text-left py-3 px-2">Description</th>
                  <th className="text-left py-3 px-2">Applies To</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">BAF</td>
                  <td className="py-3 px-2">Bunker Adjustment Factor - fuel price fluctuation</td>
                  <td className="py-3 px-2"><Badge variant="outline">Sea</Badge></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">CAF</td>
                  <td className="py-3 px-2">Currency Adjustment Factor - exchange rate changes</td>
                  <td className="py-3 px-2"><Badge variant="outline">Sea</Badge></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">FSC</td>
                  <td className="py-3 px-2">Fuel Surcharge - variable fuel cost component</td>
                  <td className="py-3 px-2"><Badge variant="outline">Air/Road/Rail</Badge></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">THC</td>
                  <td className="py-3 px-2">Terminal Handling Charge - port/terminal processing</td>
                  <td className="py-3 px-2"><Badge variant="outline">Sea</Badge></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">SSC</td>
                  <td className="py-3 px-2">Security Surcharge - security screening costs</td>
                  <td className="py-3 px-2"><Badge variant="outline">Air</Badge></td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-medium">PSS</td>
                  <td className="py-3 px-2">Peak Season Surcharge - high demand periods</td>
                  <td className="py-3 px-2"><Badge variant="outline">All Modes</Badge></td>
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
              <AccordionTrigger>How is chargeable weight calculated?</AccordionTrigger>
              <AccordionContent>
                Chargeable weight is the higher of actual weight or volumetric weight. For air freight, 
                volumetric weight is calculated as (L × W × H in cm) ÷ 6000. For sea freight, the divisor 
                is 1000. This ensures that light but bulky cargo pays appropriately for the space it occupies.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>When should I choose FCL vs LCL?</AccordionTrigger>
              <AccordionContent>
                Generally, FCL (Full Container Load) becomes cost-effective when you have 15+ CBM of cargo. 
                LCL (Less than Container Load) is better for smaller shipments. FCL also offers faster 
                transit times (no consolidation needed) and reduced damage risk since your cargo isn&apos;t 
                mixed with others.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What factors affect transit time estimates?</AccordionTrigger>
              <AccordionContent>
                Transit times vary based on: route distance, carrier schedule frequency, port/airport 
                congestion, customs clearance time, transshipment requirements, and seasonal factors. 
                Always add buffer time for potential delays, especially during peak seasons.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How do Incoterms affect my costs?</AccordionTrigger>
              <AccordionContent>
                Incoterms define which party pays for which part of the shipping journey. For example, 
                under FOB, the buyer pays ocean freight and insurance; under CIF, the seller covers 
                these. DDP means the seller handles everything including import duties. Always clarify 
                Incoterms before comparing quotes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>Why do fuel surcharges change so frequently?</AccordionTrigger>
              <AccordionContent>
                Fuel surcharges are indexed to global fuel prices (bunker fuel for ships, jet fuel for 
                aircraft, diesel for trucks). Carriers adjust these monthly or quarterly to reflect 
                market conditions. Some contracts lock in surcharges, while others pass through changes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>Should I include insurance in my shipment cost?</AccordionTrigger>
              <AccordionContent>
                Yes, marine/cargo insurance is highly recommended. The cost is typically 0.3-0.5% of 
                cargo value. Without insurance, you rely on carrier liability limits which are often 
                minimal (e.g., $500 per package for sea freight under Hague-Visby Rules). The small 
                insurance premium provides significant protection.
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
            { name: "CBM Calculator", href: "/tools/ocean-freight/cbm-calculator" },
            { name: "Transit Time Estimator", href: "/tools/ocean-freight/transit-time" },
            { name: "Volumetric Weight Calculator", href: "/tools/air-freight/volumetric-weight" },
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
