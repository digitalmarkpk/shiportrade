import { Metadata } from "next";
import Link from "next/link";
import {
  Plane,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Fuel,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FuelSurchargeCalculator } from "@/components/tools/FuelSurchargeCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Air Freight Fuel Surcharge Calculator | Shiportrade.com",
  description: "Calculate fuel surcharges for air freight shipments. Compare FSC rates across airlines and track aviation fuel trends.",
  keywords: ["fuel surcharge calculator", "air freight FSC", "aviation fuel surcharge", "air cargo fuel cost"],
  openGraph: {
    title: "Air Freight Fuel Surcharge Calculator",
    description: "Calculate and compare fuel surcharges across airlines for your air freight shipments.",
    type: "website",
  },
};

export default function FuelSurchargePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/air-freight" className="hover:text-foreground">Air Freight</Link>
        <span>/</span>
        <span className="text-foreground">Fuel Surcharge Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Fuel className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Air Freight Fuel Surcharge Calculator</h1>
            <p className="text-muted-foreground">Calculate FSC for air cargo shipments</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <FuelSurchargeCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* FSC Explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Fuel className="h-5 w-5 text-[var(--ocean)]" />
              What is FSC?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Fuel Surcharge (FSC)</strong> is an additional fee applied by airlines and 
              express carriers to offset fluctuations in aviation fuel costs. It's typically 
              expressed as a per-kilogram charge and varies based on current jet fuel prices.
            </p>
            <p className="text-muted-foreground mt-3">
              Unlike ocean freight BAF, air freight FSC is usually updated weekly by integrators 
              (DHL, FedEx, UPS) and monthly by commercial airlines. The surcharge helps carriers 
              manage the significant impact of fuel price volatility on their operating costs.
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
              How FSC Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Index-Based:</strong> Most carriers use jet fuel price indices
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Per-Kg Rate:</strong> FSC is charged per kilogram of chargeable weight
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Pass-Through:</strong> Typically 50-70% of fuel cost increase passed to shippers
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Transparency:</strong> Carriers publish FSC tables on their websites
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Why It Matters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plane className="h-5 w-5 text-[var(--ocean)]" />
              Why It Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Cost Impact</p>
                <p className="text-sm text-muted-foreground">
                  FSC can add 15-30% to base freight costs
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--logistics)]">Volatility</p>
                <p className="text-sm text-muted-foreground">
                  Fuel prices can swing 20-40% in a year
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-amber-500">Budget Planning</p>
                <p className="text-sm text-muted-foreground">
                  Essential for accurate freight cost forecasting
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carrier FSC Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Major Carrier FSC Overview</CardTitle>
          <CardDescription>Typical fuel surcharge mechanisms by carrier type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Carrier Type</th>
                  <th className="text-left py-3 px-4">Update Frequency</th>
                  <th className="text-left py-3 px-4">Index Used</th>
                  <th className="text-left py-3 px-4">Typical Range</th>
                  <th className="text-left py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Express Integrators", freq: "Weekly", index: "Jet Kerosene", range: "$0.80-$1.20/kg", notes: "DHL, FedEx, UPS, TNT" },
                  { type: "Major Airlines", freq: "Monthly", index: "IATA Index", range: "$1.00-$1.50/kg", notes: "Emirates, Lufthansa, Cathay" },
                  { type: "Freight Forwarders", freq: "Varies", index: "Carrier-based", range: "$0.50-$1.00/kg", notes: "May bundle into all-in rates" },
                  { type: "Charter Operators", freq: "Per Flight", index: "Negotiated", range: "Variable", notes: "Often included in charter price" },
                ].map((row) => (
                  <tr key={row.type} className="border-b">
                    <td className="py-3 px-4 font-medium">{row.type}</td>
                    <td className="py-3 px-4">{row.freq}</td>
                    <td className="py-3 px-4">{row.index}</td>
                    <td className="py-3 px-4 text-[var(--ocean)] font-medium">{row.range}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.notes}</td>
                  </tr>
                ))}
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
                Check carrier websites for current FSC tables before quoting
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Request all-in rates that include FSC for easier comparison
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Monitor jet fuel prices to anticipate FSC changes
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Negotiate FSC caps for long-term contracts
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider consolidation to reduce per-kg impact
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
                Quoting only base freight without FSC
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using outdated FSC rates in quotes
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not budgeting for FSC volatility
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Assuming FSC is negotiable (usually not)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting security surcharges (SC) in addition to FSC
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
              <AccordionTrigger>How often do airlines update FSC?</AccordionTrigger>
              <AccordionContent>
                Express carriers like DHL, FedEx, and UPS typically update their fuel surcharges 
                weekly, usually effective on Mondays. Commercial airlines usually update monthly, 
                based on the average jet fuel price from the previous month. Some carriers may make 
                interim adjustments during periods of extreme fuel price volatility.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Is FSC negotiable with airlines?</AccordionTrigger>
              <AccordionContent>
                Generally, FSC is not negotiable as it's directly linked to fuel price indices. 
                However, high-volume shippers may negotiate all-in rates that bundle FSC into 
                the base rate, providing cost predictability. Some contracts also include FSC 
                caps or collar arrangements that limit extreme variations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Why do integrators have different FSC than airlines?</AccordionTrigger>
              <AccordionContent>
                Integrators (DHL, FedEx, UPS) operate their own aircraft fleets with different 
                fuel efficiency and network structures than commercial airlines. They also use 
                different fuel indices and pass-through mechanisms. Additionally, integrators' 
                express services have different operational costs than standard air cargo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What other surcharges apply to air freight?</AccordionTrigger>
              <AccordionContent>
                In addition to FSC, air freight typically includes: Security Surcharge (SC), 
                Handling Fees, Documentation Fees, Pickup/Delivery Charges, and various 
                accessorial charges for special services. Some carriers also apply peak season 
                surcharges or emergency fuel surcharges during extreme market conditions.
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
            { name: "Volumetric Weight", href: "/tools/air-freight/volumetric-weight" },
            { name: "Chargeable Weight", href: "/tools/air-freight/chargeable-weight" },
            { name: "ULD Loadability", href: "/tools/air-freight/uld-loadability" },
            { name: "Carbon Footprint", href: "/tools/sustainability/carbon-footprint" },
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
