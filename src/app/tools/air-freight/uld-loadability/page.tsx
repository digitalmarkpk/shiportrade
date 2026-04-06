import { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Plane,
  Box,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ULDLoadabilityTool } from "@/components/tools/ULDLoadabilityTool";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "ULD Loadability Tool | Shiportrade.com",
  description: "Optimize Unit Load Device loading for air freight. Calculate volumetric and weight utilization for ULD containers and pallets.",
  keywords: ["ULD calculator", "air freight container", "LD3 loadability", "air pallet loading", "unit load device"],
  openGraph: {
    title: "ULD Loadability Tool - Air Freight Optimization",
    description: "Calculate optimal loading for air freight ULDs including LD3, LD6, and pallets.",
    type: "website",
  },
};

export default function ULDLoadabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/air-freight" className="hover:text-foreground">Air Freight</Link>
        <span>/</span>
        <span className="text-foreground">ULD Loadability Tool</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Package className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">ULD Loadability Tool</h1>
            <p className="text-muted-foreground">Optimize air freight container loading</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <ULDLoadabilityTool />

      <Separator className="my-12" />

      {/* ULD Reference Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5 text-[var(--ocean)]" />
            ULD Type Reference
          </CardTitle>
          <CardDescription>Common Unit Load Device specifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Code</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-center py-3 px-4">Dimensions (L×W×H)</th>
                  <th className="text-center py-3 px-4">Volume</th>
                  <th className="text-center py-3 px-4">Max Weight</th>
                  <th className="text-center py-3 px-4">Deck</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { code: "AKE (LD3)", type: "Container", dims: "1.53×2.0×1.62m", vol: "4.3 m³", wt: "1,588 kg", deck: "Lower" },
                  { code: "ALF (LD6)", type: "Container", dims: "3.18×2.24×1.62m", vol: "8.9 m³", wt: "3,175 kg", deck: "Lower" },
                  { code: "AAP (LD9)", type: "Container", dims: "3.18×2.24×1.62m", vol: "10.7 m³", wt: "4,627 kg", deck: "Lower" },
                  { code: "AMA (LD11)", type: "Container", dims: "3.18×2.24×2.44m", vol: "17.5 m³", wt: "6,804 kg", deck: "Main" },
                  { code: "PMC (P6P)", type: "Pallet", dims: "3.18×2.24m", vol: "17.5 m³", wt: "6,804 kg", deck: "Main" },
                  { code: "PAG (P7P)", type: "Pallet", dims: "3.18×2.24m", vol: "10.7 m³", wt: "4,627 kg", deck: "Lower" },
                ].map((row) => (
                  <tr key={row.code} className="border-b">
                    <td className="py-3 px-4 font-bold text-[var(--ocean)]">{row.code}</td>
                    <td className="py-3 px-4">{row.type}</td>
                    <td className="text-center py-3 px-4">{row.dims}</td>
                    <td className="text-center py-3 px-4">{row.vol}</td>
                    <td className="text-center py-3 px-4">{row.wt}</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant={row.deck === "Main" ? "default" : "secondary"}>{row.deck}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is ULD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is a ULD?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Unit Load Device (ULD)</strong> is a pallet or container used to load 
              luggage, freight, and mail on aircraft. ULDs allow large quantities of cargo to 
              be bundled into single units, improving loading efficiency and protecting goods 
              during transport.
            </p>
            <p className="text-muted-foreground mt-3">
              ULDs come in various sizes to fit different aircraft types and deck positions. 
              Lower deck containers (LD) are designed to fit in the cargo holds of wide-body 
              aircraft, while main deck pallets are used on freighters.
            </p>
          </CardContent>
        </Card>

        {/* Container vs Pallet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Box className="h-5 w-5 text-[var(--ocean)]" />
              Container vs Pallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-medium text-[var(--ocean)]">Containers</p>
              <p className="text-sm text-muted-foreground">
                Enclosed structure with rigid walls. Better protection, no netting required. 
                Higher tare weight but better for loose cargo and sensitive goods.
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-medium text-[var(--logistics)]">Pallets</p>
              <p className="text-sm text-muted-foreground">
                Flat platform requiring nets for restraint. Lower tare weight, more flexible 
                for oversized items. Common on main deck of freighters.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Considerations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plane className="h-5 w-5 text-[var(--ocean)]" />
              Key Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Aircraft Compatibility:</strong> Ensure ULD fits destination aircraft
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Contour Fit:</strong> Use correct contour for deck position
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Weight Distribution:</strong> Balance load within ULD
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>CG Position:</strong> Mark center of gravity for handling
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
                Use LD3s for smaller shipments - better availability on passenger flights
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Build to full height for volume efficiency on main deck pallets
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider ULD positioning fees when booking
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Check airline-specific ULD policies and restrictions
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Pre-book ULDs during peak seasons to ensure availability
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
                Exceeding ULD weight limits - leads to rejection
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using wrong ULD type for aircraft configuration
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Poor weight distribution causing handling issues
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for ULD tare weight in calculations
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting to verify ULD availability at origin
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
              <AccordionTrigger>What is the difference between LD3 and LD6?</AccordionTrigger>
              <AccordionContent>
                LD3 (AKE) is a half-width lower deck container with 4.3 m³ capacity, while LD6 (ALF) 
                is a full-width container with 8.9 m³ capacity. LD3 fits on one side of the aircraft 
                cargo hold, while LD6 spans the full width. LD3s are more common and offer better 
                flexibility for smaller shipments.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can ULDs be used on any aircraft?</AccordionTrigger>
              <AccordionContent>
                No, ULDs must be compatible with the specific aircraft type and deck position. 
                Lower deck containers (LD codes) are designed for the curved cargo holds of 
                wide-body aircraft. Main deck pallets can only be loaded on freighter aircraft. 
                Always verify ULD compatibility with your carrier.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How is volumetric weight calculated for ULD shipments?</AccordionTrigger>
              <AccordionContent>
                For ULD shipments, carriers typically use a volumetric conversion factor of 
                167 kg per cubic meter (6 m³ per metric ton). Some carriers apply dimensional 
                pricing based on the specific ULD type. The chargeable weight is the higher 
                of actual weight or volumetric weight.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What is ULD positioning and why does it matter?</AccordionTrigger>
              <AccordionContent>
                ULD positioning refers to the placement of loaded ULDs on the aircraft. Proper 
                positioning ensures the aircraft's center of gravity remains within limits and 
                optimizes fuel efficiency. Positioning fees may apply when carriers need to 
                reposition empty ULDs to meet shipper requirements.
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
            { name: "Volumetric Weight Calculator", href: "/tools/air-freight/volumetric-weight" },
            { name: "Fuel Surcharge Calculator", href: "/tools/air-freight/fuel-surcharge" },
            { name: "Chargeable Weight Logic", href: "/tools/air-freight/chargeable-weight" },
            { name: "FCL Loadability Engine", href: "/tools/ocean-freight/fcl-loadability" },
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
