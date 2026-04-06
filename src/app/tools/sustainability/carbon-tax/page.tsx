import { Metadata } from "next";
import Link from "next/link";
import {
  Leaf,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Globe,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CarbonTaxCalculator } from "@/components/tools/CarbonTaxCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Carbon Tax Impact Model | Shiportrade.com",
  description: "Calculate the impact of carbon pricing on your logistics operations. Compare transport modes and plan for carbon tax compliance.",
  keywords: ["carbon tax calculator", "carbon pricing", "emissions calculator", "logistics sustainability", "CO2 emissions"],
  openGraph: {
    title: "Carbon Tax Impact Model - Sustainability Tool",
    description: "Plan for carbon pricing impact on your supply chain with our comprehensive calculator.",
    type: "website",
  },
};

export default function CarbonTaxPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/sustainability" className="hover:text-foreground">Sustainability</Link>
        <span>/</span>
        <span className="text-foreground">Carbon Tax Impact Model</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--logistics)]/10 flex items-center justify-center">
            <Leaf className="h-6 w-6 text-[var(--logistics)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Carbon Tax Impact Model</h1>
            <p className="text-muted-foreground">Calculate carbon pricing impact on logistics</p>
          </div>
        </div>
        <Badge className="gradient-logistics text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <CarbonTaxCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Carbon Tax */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--logistics)]" />
              What is Carbon Tax?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Carbon tax</strong> is a fee imposed on the emission of greenhouse gases, 
              primarily carbon dioxide (CO2). It's designed to incentivize businesses to reduce 
              their carbon footprint by making emissions costly. In logistics, carbon taxes 
              directly impact freight costs.
            </p>
            <p className="text-muted-foreground mt-3">
              Different regions implement carbon pricing through either a carbon tax (fixed price 
              per tonne) or cap-and-trade systems (ETS - Emissions Trading System) where carbon 
              credits are traded on the market. Both mechanisms are expanding globally.
            </p>
          </CardContent>
        </Card>

        {/* Transport Emissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
              Transport Emissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <p className="font-medium text-red-600">Air Freight</p>
                <p className="text-muted-foreground">0.602 kg CO2e/tonne-km (highest)</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <p className="font-medium text-yellow-600">Road Transport</p>
                <p className="text-muted-foreground">0.105 kg CO2e/tonne-km</p>
              </div>
              <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
                <p className="font-medium text-[var(--logistics)]">Rail Transport</p>
                <p className="text-muted-foreground">0.028 kg CO2e/tonne-km</p>
              </div>
              <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Ocean Freight</p>
                <p className="text-muted-foreground">0.015 kg CO2e/tonne-km (lowest)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why It Matters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-[var(--logistics)]" />
              Why It Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Compliance:</strong> Avoid penalties in regulated markets
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Cost Planning:</strong> Budget for rising carbon prices
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Mode Selection:</strong> Choose lower-carbon alternatives
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Reporting:</strong> Meet ESG disclosure requirements
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Global Carbon Pricing */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Global Carbon Pricing Landscape</CardTitle>
          <CardDescription>Current and upcoming carbon pricing mechanisms affecting logistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { region: "EU ETS", status: "Active", rate: "€85/tCO2", impact: "Aviation & Shipping", trend: "+15% YoY" },
              { region: "IMO DCS", status: "Active", rate: "Data Collection", impact: "All Ships 5,000+ GT", trend: "Carbon pricing 2025+" },
              { region: "EU CBAM", status: "2026", rate: "Phased In", impact: "Imported Goods", trend: "Major impact" },
              { region: "IMO Net Zero", status: "2050 Target", rate: "Regulation", impact: "All Shipping", trend: "50% reduction by 2030" },
            ].map((item) => (
              <div key={item.region} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-[var(--ocean)]">{item.region}</p>
                  <Badge variant={item.status === "Active" ? "default" : "secondary"}>{item.status}</Badge>
                </div>
                <p className="text-sm">{item.rate}</p>
                <p className="text-xs text-muted-foreground">{item.impact}</p>
                <p className="text-xs text-[var(--logistics)] mt-1">{item.trend}</p>
              </div>
            ))}
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
                Start tracking emissions now - regulations are expanding rapidly
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider multimodal solutions - rail can reduce emissions by 70% vs road
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Partner with carriers offering carbon reporting and offsetting
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Build carbon costs into long-term contracts and pricing models
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Explore green corridors with preferential rates for low-carbon transport
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
                Ignoring upcoming regulations - carbon pricing is expanding globally
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not including carbon costs in freight budgets
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using outdated emission factors in calculations
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Focusing only on direct emissions (Scope 1 & 2) - Scope 3 matters
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Relying solely on offsetting instead of actual reduction
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
              <AccordionTrigger>How will IMO carbon regulations affect shipping costs?</AccordionTrigger>
              <AccordionContent>
                The International Maritime Organization (IMO) has set targets to reduce shipping 
                emissions by 50% by 2050. Proposed measures include a carbon levy of $100/tonne CO2, 
                fuel efficiency requirements, and eventually a phase-out of fossil fuels. For a 
                typical 40' container shipment, this could add $100-300 in carbon costs by 2030.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the EU CBAM and how does it affect imports?</AccordionTrigger>
              <AccordionContent>
                The EU Carbon Border Adjustment Mechanism (CBAM) is a carbon tariff on imports of 
                carbon-intensive goods (cement, iron, steel, aluminum, fertilizers, electricity, 
                hydrogen). Starting in 2026, importers must purchase CBAM certificates reflecting 
                the embedded carbon. This levels the playing field with EU producers who already 
                pay for emissions under EU ETS.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Should I use carbon offsets for my logistics emissions?</AccordionTrigger>
              <AccordionContent>
                Carbon offsets can be part of a strategy but shouldn't be the only approach. 
                First, prioritize actual emission reductions through mode optimization, route 
                efficiency, and carrier selection. Then, use high-quality offsets (Gold Standard, 
                Verra VCS) for unavoidable emissions. Note that many jurisdictions are becoming 
                stricter about offset quality and eligibility.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How can I prepare for rising carbon costs?</AccordionTrigger>
              <AccordionContent>
                Start by measuring your current logistics emissions baseline. Then: 1) Build carbon 
                costs into freight budgets and contracts, 2) Explore lower-carbon transport modes 
                and routes, 3) Partner with carriers investing in sustainable fuels and vessels, 
                4) Consider long-term contracts with carbon price caps, 5) Report emissions 
                transparently to meet growing disclosure requirements.
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
            { name: "Carbon Footprint Calculator", href: "/tools/sustainability/carbon-footprint" },
            { name: "CII Checker", href: "/tools/sustainability/cii-checker" },
            { name: "Modal Shift Comparator", href: "/tools/road-rail/modal-shift" },
            { name: "BAF/CAF Estimator", href: "/tools/ocean-freight/baf-estimator" },
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
