import { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Plane,
  Calculator,
  MapPin,
  Scale,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IATAZoneRateTool } from "@/components/tools/IATAZoneRateTool";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "IATA Zone Rate Calculator | Shiportrade.com",
  description: "Calculate air freight rates based on IATA Traffic Conference Areas. Understand zone-to-zone pricing, weight breaks, and commodity-specific rates.",
  keywords: ["IATA zone rates", "air freight calculator", "IATA traffic conference", "zone rate tool", "air cargo pricing"],
  openGraph: {
    title: "IATA Zone Rate Calculator",
    description: "Calculate and compare air freight rates based on IATA Traffic Conference Areas.",
    type: "website",
  },
};

export default function IATAZoneRatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/air-freight" className="hover:text-foreground">Air Freight</Link>
        <span>/</span>
        <span className="text-foreground">IATA Zone Rate Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Globe className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">IATA Zone Rate Calculator</h1>
            <p className="text-muted-foreground">Calculate air freight rates based on IATA Traffic Conference Areas</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline">Air Freight</Badge>
        </div>
      </div>

      {/* Calculator */}
      <IATAZoneRateTool />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* IATA Zones Explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-[var(--ocean)]" />
              IATA Traffic Conference Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              IATA divides the world into <strong>three Traffic Conference Areas</strong> for 
              the purpose of establishing air cargo rates:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Badge style={{ backgroundColor: "#0F4C81", color: "white" }} className="shrink-0">TC1</Badge>
                <span>Western Hemisphere (North, Central, South America & Caribbean)</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge style={{ backgroundColor: "#2E8B57", color: "white" }} className="shrink-0">TC2</Badge>
                <span>Europe, Middle East & Africa</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge style={{ backgroundColor: "#F59E0B", color: "white" }} className="shrink-0">TC3</Badge>
                <span>Asia, Oceania & Pacific Islands</span>
              </li>
            </ul>
            <p className="text-muted-foreground mt-3">
              These areas were established to standardize pricing across the global air 
              freight industry, making it easier to calculate rates between any two points.
            </p>
          </CardContent>
        </Card>

        {/* How Rates Work */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-[var(--ocean)]" />
              How Rates Are Structured
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Zone-to-Zone:</strong> Base rates determined by origin/destination areas
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Weight Breaks:</strong> Rates decrease at 45, 100, 300, 500, 1000kg
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Minimum Charge:</strong> Floor rate regardless of weight
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Surcharges:</strong> Fuel (FSC) and Security (SSC) added per kg
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Rate Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
              Rate Class Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">M</span>
                  <Badge variant="outline">Minimum</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimum charge per shipment</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">N</span>
                  <Badge variant="outline">Normal</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">General cargo rate per kg</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Q</span>
                  <Badge variant="outline">Quantity</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Reduced rates for weight breaks</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">C</span>
                  <Badge variant="outline">Commodity</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Specific commodity rates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone Reference Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>IATA Traffic Conference Areas Reference</CardTitle>
          <CardDescription>Countries grouped by IATA Traffic Conference Area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Area</th>
                  <th className="text-left py-3 px-4">Region</th>
                  <th className="text-left py-3 px-4">Key Countries</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4" rowSpan={4}>
                    <Badge style={{ backgroundColor: "#0F4C81", color: "white" }}>TC1</Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">North America</td>
                  <td className="py-3 px-4 text-muted-foreground">USA, Canada, Mexico</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Central America</td>
                  <td className="py-3 px-4 text-muted-foreground">Guatemala, Costa Rica, Panama, Honduras</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Caribbean</td>
                  <td className="py-3 px-4 text-muted-foreground">Cuba, Jamaica, Dominican Republic, Puerto Rico</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">South America</td>
                  <td className="py-3 px-4 text-muted-foreground">Brazil, Argentina, Chile, Colombia, Peru</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4" rowSpan={3}>
                    <Badge style={{ backgroundColor: "#2E8B57", color: "white" }}>TC2</Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">Europe</td>
                  <td className="py-3 px-4 text-muted-foreground">UK, Germany, France, Italy, Spain, Netherlands</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Middle East</td>
                  <td className="py-3 px-4 text-muted-foreground">UAE, Saudi Arabia, Israel, Qatar, Kuwait</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Africa</td>
                  <td className="py-3 px-4 text-muted-foreground">South Africa, Egypt, Nigeria, Kenya, Morocco</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4" rowSpan={4}>
                    <Badge style={{ backgroundColor: "#F59E0B", color: "white" }}>TC3</Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">East Asia</td>
                  <td className="py-3 px-4 text-muted-foreground">China, Japan, South Korea, Taiwan, Hong Kong</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Southeast Asia</td>
                  <td className="py-3 px-4 text-muted-foreground">Singapore, Thailand, Malaysia, Indonesia, Vietnam</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">South Asia</td>
                  <td className="py-3 px-4 text-muted-foreground">India, Pakistan, Bangladesh, Sri Lanka</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Oceania</td>
                  <td className="py-3 px-4 text-muted-foreground">Australia, New Zealand, Papua New Guinea, Fiji</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Weight Break Explanation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-[var(--ocean)]" />
            Weight Break Optimization
          </CardTitle>
          <CardDescription>Understanding how weight breaks affect your air freight costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">What Are Weight Breaks?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Airlines offer progressively lower rates as shipment weight increases. This volume 
                discount structure is designed to incentivize larger shipments and help carriers 
                optimize aircraft capacity utilization.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Normal (N)</span>
                  <span className="text-sm font-medium">&lt; 45 kg</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Q45</span>
                  <span className="text-sm font-medium">45+ kg</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Q100</span>
                  <span className="text-sm font-medium">100+ kg</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Q300</span>
                  <span className="text-sm font-medium">300+ kg</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Q500</span>
                  <span className="text-sm font-medium">500+ kg</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[var(--logistics)]/10 rounded border border-[var(--logistics)]/20">
                  <span className="text-sm font-medium">Q1000</span>
                  <span className="text-sm font-bold">1000+ kg (Best Rate)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Optimization Strategy</h4>
              <div className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium text-sm">Near a Threshold?</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    If your shipment is close to the next weight break, calculate whether 
                    adding weight to reach it reduces total cost.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium text-sm">Consolidation Pays</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Multiple small shipments can often be consolidated to achieve a better 
                    weight break rate.
                  </p>
                </div>
                <div className="p-4 bg-[var(--logistics)]/10 rounded-lg border border-[var(--logistics)]/20">
                  <h5 className="font-medium text-sm text-[var(--logistics)]">Example</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    A 90kg shipment at $4.50/kg = $405. At 100kg with $3.80/kg = $380. 
                    You save $25 by adding 10kg!
                  </p>
                </div>
              </div>
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
                Always compare your shipment weight against all applicable weight breaks
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider volumetric weight - you&apos;re charged on whichever is greater
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Factor in all surcharges (FSC, SSC) when comparing rates
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Ask forwarders about spot rates for large shipments
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Book early during peak seasons for better rate availability
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Understand commodity-specific requirements before booking
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
                Quoting only base freight without surcharges
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using actual weight instead of chargeable weight
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring minimum charge requirements
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not checking commodity-specific restrictions
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Assuming all carriers have identical rates
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting about peak season rate increases
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
              <AccordionTrigger>Why are IATA zones important for air freight pricing?</AccordionTrigger>
              <AccordionContent>
                IATA Traffic Conference Areas provide a standardized way to determine base rates 
                between any two points globally. Instead of having unique rates for every city pair, 
                carriers use zone-to-zone pricing which simplifies rate calculations and ensures 
                consistency across the industry. The zones are based on geographical proximity and 
                typical flight distances.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How does the minimum charge work?</AccordionTrigger>
              <AccordionContent>
                Every route has a minimum charge (M) that applies regardless of weight. If your 
                calculated freight charge based on weight and rate is less than the minimum, the 
                minimum charge applies instead. For example, if a 5kg shipment at $4.50/kg equals 
                $22.50, but the minimum is $75, you&apos;ll pay $75. This ensures carriers recover 
                fixed handling costs for small shipments.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What&apos;s the difference between Normal and Quantity rates?</AccordionTrigger>
              <AccordionContent>
                Normal (N) rate applies to shipments under 45kg and is the highest per-kilogram rate. 
                Quantity (Q) rates offer progressively lower per-kg prices at specific weight thresholds 
                (45kg, 100kg, 300kg, 500kg, 1000kg). The system automatically selects the best 
                applicable rate based on your shipment weight, rewarding larger volumes with better pricing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Why do commodity types affect rates?</AccordionTrigger>
              <AccordionContent>
                Special commodities require additional handling, documentation, or pose higher risk. 
                Perishables need temperature control, valuable cargo requires enhanced security, 
                dangerous goods need specialized handling and certification, and live animals have 
                welfare requirements. These additional services and risks are reflected in commodity 
                adjustment factors or specific commodity rates (C class).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>Are these rates the same across all airlines?</AccordionTrigger>
              <AccordionContent>
                No, while IATA zones provide the framework, individual airlines set their own rates. 
                The rates shown in this tool are representative industry averages. Actual rates vary 
                by carrier, season, capacity availability, and negotiated contract terms. Always 
                request quotes from multiple carriers and consider working with a freight forwarder 
                who has access to consolidated rates.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How often do fuel surcharges change?</AccordionTrigger>
              <AccordionContent>
                Fuel surcharges (FSC) are typically updated weekly by express carriers (DHL, FedEx, UPS) 
                and monthly by commercial airlines. They&apos;re linked to jet fuel price indices and 
                can fluctuate significantly. Security surcharges (SSC) are more stable and usually 
                adjusted annually. Always verify current surcharge rates before finalizing quotes.
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
            { name: "Volumetric Weight", href: "/tools/air-freight/volumetric-weight", desc: "Calculate chargeable weight" },
            { name: "ULD Loadability", href: "/tools/air-freight/uld-loadability", desc: "Optimize ULD loading" },
            { name: "Fuel Surcharge", href: "/tools/air-freight/fuel-surcharge", desc: "Current FSC rates" },
            { name: "Carbon Footprint", href: "/tools/sustainability/carbon-footprint", desc: "Calculate emissions" },
          ].map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-all hover:border-[var(--ocean)]/50 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium group-hover:text-[var(--ocean)] transition-colors">
                      {tool.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--ocean)] transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
