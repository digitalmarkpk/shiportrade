import { Metadata } from "next";
import Link from "next/link";
import {
  Container,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Box,
  Ruler,
  Weight,
  Move,
  Ship,
  FileText,
  Shield,
  Package,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OOGCalculator } from "@/components/tools/OOGCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "OOG Overhang Calculator | Shiportrade.com",
  description: "Calculate over-dimensional cargo requirements. Estimate OOG surcharges, slot utilization, and lashing requirements for container vessels.",
  keywords: ["OOG calculator", "out of gauge", "overhang calculator", "flat rack", "project cargo", "container overhang"],
  openGraph: {
    title: "OOG Overhang Calculator - Project Cargo Planning",
    description: "Plan your out-of-gauge cargo shipments with our comprehensive OOG calculator.",
    type: "website",
  },
};

export default function OOGCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/ocean-freight" className="hover:text-foreground">Ocean Freight</Link>
        <span>/</span>
        <span className="text-foreground">OOG Overhang Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Move className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">OOG Overhang Calculator</h1>
            <p className="text-muted-foreground">Plan over-dimensional cargo shipments with confidence</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">Project Cargo</Badge>
        </div>
      </div>

      {/* Calculator */}
      <OOGCalculator />

      <Separator className="my-12" />

      {/* Container Types for OOG Reference */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Container className="h-5 w-5 text-[var(--ocean)]" />
            OOG-Suitable Container Types
          </CardTitle>
          <CardDescription>Container types designed for out-of-gauge cargo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Box className="h-5 w-5 text-[var(--ocean)]" />
                <span className="font-bold">Flat Rack (FR)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Platform containers with no side walls or roof, ideal for heavy machinery, vehicles, 
                and oversized cargo that cannot be loaded through standard container doors.
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Best for:</strong> Heavy machinery, vehicles, steel structures</p>
                <p><strong>Overhang capacity:</strong> Up to 0.76m width, 3m+ height</p>
                <p><strong>Max payload:</strong> Up to 39,400 kg (40' FR)</p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-5 w-5 text-[var(--ocean)]" />
                <span className="font-bold">Open Top (OT)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Standard containers with removable top (tarpaulin cover), suitable for cargo 
                that exceeds standard height or requires top-loading with cranes.
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Best for:</strong> Tall cargo, top-loading goods, glass panels</p>
                <p><strong>Overhang capacity:</strong> Up to 0.5m width, unlimited height</p>
                <p><strong>Max payload:</strong> Up to 26,140 kg (40' OT)</p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Container className="h-5 w-5 text-[var(--ocean)]" />
                <span className="font-bold">Platform (PL)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Flat bed containers without end walls, designed for extremely heavy and oversized 
                project cargo requiring maximum flexibility in loading and securing.
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Best for:</strong> Project cargo, heavy equipment, transformers</p>
                <p><strong>Overhang capacity:</strong> Up to 1m width, 4m+ height</p>
                <p><strong>Max payload:</strong> Up to 40,000 kg (40' PL)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is OOG */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is OOG Cargo?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Out of Gauge (OOG)</strong> cargo refers to freight that exceeds the standard 
              external dimensions of a shipping container. This cargo cannot be loaded into a 
              standard dry container due to its size.
            </p>
            <p className="text-muted-foreground mt-3">
              OOG cargo requires special equipment such as flat racks, open-top containers, or 
              platform containers. It also incurs additional charges from carriers due to the 
              extra handling requirements and lost slot capacity.
            </p>
            <div className="mt-4 p-3 bg-[var(--ocean)]/10 rounded-lg">
              <p className="text-sm font-medium text-[var(--ocean)]">Standard Container Dimensions:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• 20' GP: 6.058 × 2.438 × 2.591 m (exterior)</li>
                <li>• 40' GP: 12.192 × 2.438 × 2.591 m (exterior)</li>
                <li>• 40' HC: 12.192 × 2.438 × 2.896 m (exterior)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* When to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ruler className="h-5 w-5 text-[var(--ocean)]" />
              Flat Rack vs Open Top
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
              <p className="font-medium text-[var(--ocean)]">Use Flat Rack When:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Cargo exceeds width limits significantly</li>
                <li>• Heavy machinery needs side-loading</li>
                <li>• Cargo weight exceeds 28,000 kg</li>
                <li>• Multiple overhang dimensions apply</li>
              </ul>
            </div>
            <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
              <p className="font-medium text-[var(--logistics)]">Use Open Top When:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Only height exceeds container limits</li>
                <li>• Top-loading is required</li>
                <li>• Cargo is within standard width</li>
                <li>• Weather protection is needed</li>
              </ul>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <p className="font-medium text-amber-600">Use Platform When:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Maximum overhang flexibility needed</li>
                <li>• Extremely heavy project cargo</li>
                <li>• Complex lashing requirements</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-[var(--ocean)]" />
              Documentation Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Stowage Plan:</strong> Detailed cargo placement diagram
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Lashing Certificate:</strong> From certified marine surveyor
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Cargo Manifest:</strong> With exact OOG dimensions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Booking Confirmation:</strong> With OOG acceptance
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Insurance Endorsement:</strong> For OOG cargo coverage
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Insurance Considerations */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-[var(--ocean)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[var(--ocean)]">
              <Shield className="h-5 w-5" />
              Insurance Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--ocean)]">•</span>
                Standard marine insurance may not cover OOG cargo without endorsement
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--ocean)]">•</span>
                OOG cargo typically has higher risk premiums (10-30% more)
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--ocean)]">•</span>
                Weather damage is more likely for on-deck stowage
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--ocean)]">•</span>
                Verify lashing warranty coverage from surveyor
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--ocean)]">•</span>
                Consider Institute Cargo Clauses (A) for maximum protection
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Underestimating overhang dimensions - always include securing points
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not booking adjacent slots for width overhang cargo
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Assuming standard rates apply - OOG charges can double costs
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting port limitations - some terminals can't handle large OOG
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring weight distribution - critical for flat rack cargo
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tips */}
      <Card className="mt-8 border-[var(--logistics)]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-[var(--logistics)]">
            <Lightbulb className="h-5 w-5" />
            Pro Tips for OOG Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">1.</span>
                Always provide cargo drawings with center of gravity marked
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">2.</span>
                Book OOG cargo at least 3-4 weeks in advance
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">3.</span>
                Request specific vessel stowage position (on deck preferred)
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">4.</span>
                Include lifting points/lugs in cargo design
              </li>
            </ul>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">5.</span>
                Get lashing plan approved by carrier before shipment
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">6.</span>
                Consider breakbulk as alternative for extreme OOG
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">7.</span>
                Document cargo condition with photos before loading
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">8.</span>
                Verify discharge port has equipment for OOG handling
              </li>
            </ul>
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
              <AccordionTrigger>How is OOG surcharge calculated?</AccordionTrigger>
              <AccordionContent>
                OOG surcharges are typically calculated based on the overhang volume (CBM) multiplied 
                by a carrier-specific rate. Different carriers may charge by the actual overhang volume 
                or use a flat rate per TEU. The surcharge also depends on which dimension exceeds limits - 
                width overhang typically costs more than height overhang due to lost slot capacity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can OOG cargo be stowed below deck?</AccordionTrigger>
              <AccordionContent>
                Only OOG cargo with minor height overhang (typically under 0.5m) can be stowed below deck, 
                and only if there's sufficient cell guide clearance. Width overhang cargo must almost always 
                be stowed on deck. Below-deck OOG also requires special stowage arrangements and may not be 
                available on all vessel types.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What is the maximum weight for flat rack containers?</AccordionTrigger>
              <AccordionContent>
                20' flat racks typically have a payload capacity of 22,000-31,000 kg, while 40' flat racks 
                can handle up to 39,000-40,000 kg. However, the actual limit depends on the specific container, 
                the cargo distribution, and the vessel's deck strength. Always verify with the carrier for 
                your specific cargo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Do I need a surveyor for OOG cargo?</AccordionTrigger>
              <AccordionContent>
                Yes, for most OOG shipments, a certified marine cargo surveyor is required. The surveyor 
                will verify cargo dimensions, approve the lashing plan, and issue a lashing certificate. 
                This is often mandatory for insurance coverage and carrier acceptance. Surveyor costs 
                typically range from $300-$800 depending on location and complexity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What happens if my cargo overhang exceeds the maximum limits?</AccordionTrigger>
              <AccordionContent>
                If overhang exceeds standard flat rack/platform limits, the cargo may need to be shipped 
                as breakbulk cargo on a multipurpose vessel or heavy-lift ship. This significantly increases 
                costs and transit time. Alternatively, cargo can sometimes be disassembled or re-engineered 
                to fit within container limits. Consult with a project cargo specialist for extreme OOG.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How far in advance should I book OOG cargo?</AccordionTrigger>
              <AccordionContent>
                OOG cargo should be booked at least 3-4 weeks in advance, but 6-8 weeks is recommended for 
                complex project cargo. This allows time for carrier acceptance, equipment availability 
                confirmation, stowage planning, and surveyor arrangements. Peak season may require even 
                longer lead times due to limited OOG equipment availability.
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
            { name: "CBM Calculator", href: "/tools/ocean-freight/cbm-calculator" },
            { name: "FCL Loadability", href: "/tools/ocean-freight/fcl-loadability" },
            { name: "Lashing Force Calculator", href: "/tools/project-cargo/lashing-force" },
            { name: "VGM Calculator", href: "/tools/ocean-freight/vgm-calculator" },
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
