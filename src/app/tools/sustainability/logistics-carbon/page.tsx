import { Metadata } from "next";
import Link from "next/link";
import {
  Leaf,
  Ship,
  Plane,
  Truck,
  Train,
  ArrowRight,
  TreePine,
  Globe,
  CheckCircle2,
  Info,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LogisticsCarbonCalculator from "@/components/tools/LogisticsCarbonCalculator";

export const metadata: Metadata = {
  title: "Logistics Carbon Calculator | Shiportrade.com",
  description: "Calculate CO2 emissions for your logistics operations across ocean, air, road, and rail transport. Compare modes, estimate carbon offset costs, and improve sustainability.",
  keywords: ["logistics carbon calculator", "CO2 emissions", "carbon footprint", "transport emissions", "sustainable logistics", "green shipping", "carbon offset"],
  openGraph: {
    title: "Logistics Carbon Calculator - Sustainability Tool",
    description: "Measure and reduce the environmental impact of your supply chain with our comprehensive carbon calculator.",
    type: "website",
  },
};

export default function LogisticsCarbonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/sustainability" className="hover:text-foreground">Sustainability</Link>
        <span>/</span>
        <span className="text-foreground">Logistics Carbon Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--logistics)]/10 flex items-center justify-center">
            <Leaf className="h-6 w-6 text-[var(--logistics)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Logistics Carbon Calculator</h1>
            <p className="text-muted-foreground">Calculate emissions, compare modes, and plan carbon offsets</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="gradient-logistics text-white">Free Tool</Badge>
          <Badge variant="outline" className="border-[var(--ocean)] text-[var(--ocean)]">GLEC Framework</Badge>
        </div>
      </div>

      {/* Calculator */}
      <LogisticsCarbonCalculator />

      <Separator className="my-12" />

      {/* Feature Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-full bg-[var(--ocean)]/10 mx-auto mb-3 flex items-center justify-center">
              <Ship className="h-6 w-6 text-[var(--ocean)]" />
            </div>
            <h3 className="font-semibold mb-1">Ocean Freight</h3>
            <p className="text-sm text-muted-foreground">0.016 kg CO₂/t-km</p>
            <Badge variant="outline" className="mt-2 text-green-600 border-green-600">Most Efficient</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mx-auto mb-3 flex items-center justify-center">
              <Plane className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Air Freight</h3>
            <p className="text-sm text-muted-foreground">0.502 kg CO₂/t-km</p>
            <Badge variant="outline" className="mt-2 text-red-600 border-red-600">Highest Emissions</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-full bg-[var(--logistics)]/10 mx-auto mb-3 flex items-center justify-center">
              <Truck className="h-6 w-6 text-[var(--logistics)]" />
            </div>
            <h3 className="font-semibold mb-1">Road Transport</h3>
            <p className="text-sm text-muted-foreground">0.062 kg CO₂/t-km</p>
            <Badge variant="outline" className="mt-2">Flexible</Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-3 flex items-center justify-center">
              <Train className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-1">Rail Transport</h3>
            <p className="text-sm text-muted-foreground">0.023 kg CO₂/t-km</p>
            <Badge variant="outline" className="mt-2 text-[var(--logistics)] border-[var(--logistics)]">Eco-Friendly</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Educational Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Carbon Footprint */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-[var(--ocean)]" />
              Why Calculate Carbon?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Carbon emissions</strong> from logistics contribute significantly to climate change. 
              Understanding your emissions helps you:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                <span>Meet regulatory requirements (EU ETS, IMO CII)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                <span>Identify cost-saving opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                <span>Meet customer sustainability demands</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                <span>Improve ESG reporting and ratings</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ship className="h-5 w-5 text-[var(--logistics)]" />
              Mode Selection Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="font-medium text-green-700 dark:text-green-400">Ocean vs Air</p>
              <p className="text-muted-foreground">Ocean produces ~30x less CO₂ than air freight per tonne-km</p>
            </div>
            <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
              <p className="font-medium text-[var(--logistics)]">Rail vs Road</p>
              <p className="text-muted-foreground">Rail produces ~70% less CO₂ than trucking</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">Multimodal Solutions</p>
              <p className="text-muted-foreground">Combine modes to balance speed and sustainability</p>
            </div>
          </CardContent>
        </Card>

        {/* Carbon Offsetting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TreePine className="h-5 w-5 text-green-600" />
              Carbon Offsetting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              For emissions that cannot be reduced, carbon offsetting provides a way to 
              neutralize your environmental impact:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Leaf className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <span><strong>Reforestation:</strong> Plant trees to absorb CO₂</span>
              </li>
              <li className="flex items-start gap-2">
                <Leaf className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <span><strong>Renewable Energy:</strong> Support wind, solar, hydro projects</span>
              </li>
              <li className="flex items-start gap-2">
                <Leaf className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <span><strong>Community Projects:</strong> Sustainable development initiatives</span>
              </li>
            </ul>
            <p className="text-xs">
              Prices range from $15-45 per tonne CO₂ depending on project type and certification.
            </p>
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
                Ocean freight is the most carbon-efficient for long distances
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Increase load factor to reduce per-unit emissions
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider multimodal transport (e.g., rail + truck)
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Partner with carriers offering carbon reporting
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use Gold Standard or VCS certified offset projects
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
                Choosing air freight when time isn&apos;t critical
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Shipping half-empty containers
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring return journey emissions
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using outdated emission factors
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Relying only on offsetting instead of reduction
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
              <AccordionTrigger>How are transport emissions calculated?</AccordionTrigger>
              <AccordionContent>
                Emissions are calculated using the formula: <strong>Weight (tonnes) × Distance (km) × Emission Factor (kg CO₂e/tonne-km)</strong>. 
                Our emission factors are based on the GLEC Framework and represent well-to-wheel emissions, 
                including fuel production and combustion.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Why do different transport modes have different emission factors?</AccordionTrigger>
              <AccordionContent>
                Emission factors vary based on vehicle/vessel efficiency, fuel type, and capacity utilization. 
                Ocean vessels carry massive amounts of cargo, spreading emissions across many containers. 
                Aircraft burn more fuel per tonne due to weight constraints and higher energy requirements for flight.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What is load factor and why does it matter?</AccordionTrigger>
              <AccordionContent>
                Load factor represents how full a container or vehicle is. A higher load factor means 
                emissions are distributed across more cargo, reducing the per-unit impact. 
                Shipping a half-empty container doubles the effective emissions per kg of your cargo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Should I include return journey emissions?</AccordionTrigger>
              <AccordionContent>
                If you&apos;re responsible for the return journey (e.g., leased containers returning empty), 
                including it gives a more complete picture. Many logistics contracts include return leg costs. 
                For one-way shipments where you don&apos;t control the return, you may exclude it.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What carbon offset projects should I choose?</AccordionTrigger>
              <AccordionContent>
                Look for projects certified by Gold Standard, Verra VCS, or American Carbon Registry. 
                Reforestation and renewable energy projects are popular. For aviation, choose CORSIA-eligible 
                offsets. Avoid projects with additionality concerns or those in regions with weak oversight.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Regulatory Context */}
      <Card className="mt-8 bg-[var(--logistics)]/5 border-[var(--logistics)]/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-[var(--logistics)] mb-2">Regulatory Context</p>
              <p className="text-muted-foreground">
                The IMO has set targets to reduce shipping emissions by 50% by 2050. The EU ETS now includes 
                maritime emissions, and the Carbon Border Adjustment Mechanism (CBAM) will affect imports 
                starting 2026. Start measuring your logistics emissions now to prepare for increasing 
                compliance requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Tools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Carbon Footprint Calculator", href: "/tools/sustainability/carbon-footprint" },
            { name: "Carbon Tax Impact Model", href: "/tools/sustainability/carbon-tax" },
            { name: "CII Checker", href: "/tools/sustainability/cii-checker" },
            { name: "Modal Shift Comparator", href: "/tools/road-rail/modal-shift" },
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
