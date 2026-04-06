import { Metadata } from "next";
import { TankContainerDensityTool } from "@/components/tools/TankContainerDensityTool";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Container,
  Droplets,
  Thermometer,
  Scale,
  Shield,
  Beaker,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Tank Container Density Calculator | Shiportrade.com",
  description: "Calculate tank container loading based on product density, temperature adjustment, ullage requirements, and hazardous material compatibility for ISO tank shipments.",
  keywords: "tank container, ISO tank, density calculator, specific gravity, ullage calculation, hazmat, IMDG, bulk liquid transport",
};

export default function TankContainerDensityPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/tools" className="hover:text-[var(--ocean)]">Tools</Link>
          <ArrowRight className="h-3 w-3" />
          <Link href="/tools/ocean-freight" className="hover:text-[var(--ocean)]">Ocean Freight</Link>
          <ArrowRight className="h-3 w-3" />
          <span className="text-foreground">Tank Container Density</span>
        </div>
        <h1 className="text-3xl font-bold text-gradient-ocean">Tank Container Density Calculator</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Calculate optimal tank container loading based on product density (SG), temperature corrections, 
          ullage requirements, and hazardous material classification for safe ISO tank shipments.
        </p>
      </div>

      {/* Main Calculator */}
      <TankContainerDensityTool />

      {/* Educational Content */}
      <div className="mt-12 space-y-8">
        {/* Quick Reference Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-[var(--ocean)]/20">
            <CardContent className="p-4">
              <Container className="h-8 w-8 text-[var(--ocean)] mb-2" />
              <h3 className="font-semibold">Tank Types</h3>
              <p className="text-sm text-muted-foreground mt-1">
                20ft & 30ft ISO tanks with various pressure ratings
              </p>
            </CardContent>
          </Card>
          <Card className="border-[var(--logistics)]/20">
            <CardContent className="p-4">
              <Droplets className="h-8 w-8 text-[var(--logistics)] mb-2" />
              <h3 className="font-semibold">Density Range</h3>
              <p className="text-sm text-muted-foreground mt-1">
                SG 0.7 to 2.0 for various liquids and chemicals
              </p>
            </CardContent>
          </Card>
          <Card className="border-[var(--ocean)]/20">
            <CardContent className="p-4">
              <Thermometer className="h-8 w-8 text-[var(--ocean)] mb-2" />
              <h3 className="font-semibold">Temperature</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Density adjustment for temperature variations
              </p>
            </CardContent>
          </Card>
          <Card className="border-[var(--logistics)]/20">
            <CardContent className="p-4">
              <Shield className="h-8 w-8 text-[var(--logistics)] mb-2" />
              <h3 className="font-semibold">IMDG Hazmat</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Hazard classification and compatibility check
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Understanding Tank Containers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Container className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Tank Containers
            </CardTitle>
            <CardDescription>
              Key concepts for safe and efficient bulk liquid transport
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tank Container Types */}
            <div>
              <h3 className="font-semibold mb-3">Tank Container Types & Specifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Type</th>
                      <th className="text-right py-2 px-2">Capacity</th>
                      <th className="text-right py-2 px-2">Max Payload</th>
                      <th className="text-right py-2 px-2">Pressure</th>
                      <th className="text-left py-2 px-2">Typical Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-2 font-medium">20&apos; ISO Tank</td>
                      <td className="text-right py-2 px-2">24,000 L</td>
                      <td className="text-right py-2 px-2">26,000 kg</td>
                      <td className="text-right py-2 px-2">3-4 bar</td>
                      <td className="py-2 px-2 text-muted-foreground">Chemicals, food products</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2 font-medium">20&apos; High Pressure</td>
                      <td className="text-right py-2 px-2">21,000 L</td>
                      <td className="text-right py-2 px-2">28,000 kg</td>
                      <td className="text-right py-2 px-2">10-24 bar</td>
                      <td className="py-2 px-2 text-muted-foreground">LPG, ammonia, gases</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2 font-medium">30&apos; ISO Tank</td>
                      <td className="text-right py-2 px-2">35,000 L</td>
                      <td className="text-right py-2 px-2">30,000 kg</td>
                      <td className="text-right py-2 px-2">3-4 bar</td>
                      <td className="py-2 px-2 text-muted-foreground">Bulk liquids, oils</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2 font-medium">20&apos; Heating Tank</td>
                      <td className="text-right py-2 px-2">23,000 L</td>
                      <td className="text-right py-2 px-2">25,500 kg</td>
                      <td className="text-right py-2 px-2">3-4 bar</td>
                      <td className="py-2 px-2 text-muted-foreground">Viscous products, bitumen</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-medium">20&apos; Gas Tank</td>
                      <td className="text-right py-2 px-2">24,000 L</td>
                      <td className="text-right py-2 px-2">24,000 kg</td>
                      <td className="text-right py-2 px-2">17-24 bar</td>
                      <td className="py-2 px-2 text-muted-foreground">LNG, ethylene, propylene</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Key Terms */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Beaker className="h-4 w-4 text-[var(--ocean)]" />
                  Specific Gravity (SG)
                </h4>
                <p className="text-sm text-muted-foreground">
                  The ratio of a substance&apos;s density to water at a reference temperature. 
                  SG determines whether a product is weight-limited or volume-limited in a tank.
                </p>
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <code>SG = Density of Product / Density of Water</code>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Scale className="h-4 w-4 text-[var(--logistics)]" />
                  Ullage
                </h4>
                <p className="text-sm text-muted-foreground">
                  The unfilled space in a tank container, typically 2-5% of capacity. 
                  Essential for thermal expansion and safety during transport.
                </p>
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <code>Ullage % = (Empty Space / Total Capacity) × 100</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Pro Tips for Tank Container Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: CheckCircle2,
                  title: "Check Max SG Rating",
                  description: "Every tank has a maximum SG rating. Exceeding this risks structural failure.",
                },
                {
                  icon: CheckCircle2,
                  title: "Temperature Correction",
                  description: "Density changes with temperature. Apply corrections for accurate weight calculations.",
                },
                {
                  icon: CheckCircle2,
                  title: "Calculate Ullage Properly",
                  description: "For heated products, allow additional ullage for thermal expansion during transit.",
                },
                {
                  icon: CheckCircle2,
                  title: "Know Your Limitation",
                  description: "High SG products are weight-limited, low SG products are volume-limited.",
                },
                {
                  icon: CheckCircle2,
                  title: "Verify Hazmat Compatibility",
                  description: "Check IMDG classification and ensure tank is certified for your product class.",
                },
                {
                  icon: CheckCircle2,
                  title: "Pre-Load Inspection",
                  description: "Verify tank cleanliness, previous cargo, and proper certification before loading.",
                },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{tip.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "Ignoring temperature effects on density - can lead to significant weight errors",
                "Overfilling beyond 98% - insufficient ullage for thermal expansion",
                "Loading products with SG exceeding tank rating - structural damage risk",
                "Mixing incompatible hazardous materials - dangerous reactions possible",
                "Not accounting for heated product expansion during transit",
                "Using incorrect reference temperature for SG measurement",
              ].map((mistake, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>What is the maximum filling ratio for tank containers?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    The maximum filling ratio typically ranges from 95-98% depending on the product type. 
                    For standard liquids, 96-97% is common. For products with high thermal expansion 
                    (like LPG), lower ratios of 90-95% are recommended. The IMDG Code provides specific 
                    filling ratio requirements for hazardous materials.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>How does temperature affect density calculation?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Most liquids expand when heated and contract when cooled, changing their density. 
                    The thermal expansion coefficient varies by product (e.g., gasoline: 0.001/°C, 
                    fuel oil: 0.00065/°C). The calculator applies the formula: 
                    SG<sub>adjusted</sub> = SG<sub>base</sub> × (1 - α × ΔT), where α is the 
                    thermal expansion coefficient.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>What does &quot;weight-limited&quot; vs &quot;volume-limited&quot; mean?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    <strong>Weight-limited:</strong> When SG × Capacity exceeds max payload, you can&apos;t 
                    fill the tank completely because you&apos;d exceed the weight limit. Common for heavy 
                    products like acids (SG &gt; 1.5).<br /><br />
                    <strong>Volume-limited:</strong> When SG × Capacity is less than max payload, you 
                    run out of space before hitting the weight limit. Common for light products like 
                    gasoline (SG &lt; 0.8).
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>What is ullage and why is it important?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Ullage is the unfilled space at the top of a tank container. It&apos;s critical for:
                    <br /><br />
                    • <strong>Thermal expansion:</strong> Liquids expand when heated; ullage provides space<br />
                    • <strong>Safety:</strong> Prevents over-pressurization<br />
                    • <strong>Sloshing control:</strong> Reduces liquid surge during transit<br />
                    • <strong>Vapor space:</strong> Required for certain hazardous products
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>What are the IMDG hazard classes for tank containers?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Key IMDG classes for tank transport include:
                    <br /><br />
                    • <strong>Class 3:</strong> Flammable liquids (gasoline, diesel, chemicals)<br />
                    • <strong>Class 6:</strong> Toxic substances<br />
                    • <strong>Class 8:</strong> Corrosive substances (acids, caustics)<br />
                    • <strong>Class 5:</strong> Oxidizers<br />
                    • <strong>Class 2:</strong> Gases (LPG, LNG, ammonia)<br />
                    • <strong>Class 9:</strong> Miscellaneous dangerous goods
                    <br /><br />
                    Each class has specific tank requirements, segregation rules, and documentation needs.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q6">
                <AccordionTrigger>How do I select the right tank for my product?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Consider these factors when selecting a tank:
                    <br /><br />
                    • <strong>Product SG:</strong> Ensure tank max SG rating is sufficient<br />
                    • <strong>Temperature:</strong> Heated tanks for viscous products, insulated for temperature-sensitive<br />
                    • <strong>Pressure:</strong> Standard (3-4 bar) or high-pressure (10-24 bar) for gases<br />
                    • <strong>Hazard class:</strong> Tank must be certified for your product&apos;s IMDG class<br />
                    • <strong>Material:</strong> Stainless steel for most chemicals, special linings for corrosives<br />
                    • <strong>Capacity:</strong> Match volume to your shipment quantity
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
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { name: "CBM Calculator", href: "/tools/ocean-freight/cbm-calculator", desc: "Volume calculations for containers" },
                { name: "VGM Calculator", href: "/tools/ocean-freight/vgm-calculator", desc: "Verified gross mass calculation" },
                { name: "Reefer Settings", href: "/tools/ocean-freight/reefer-settings", desc: "Temperature-controlled container settings" },
                { name: "FCL Loadability", href: "/tools/ocean-freight/fcl-loadability", desc: "Container load optimization" },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="p-4 rounded-lg border hover:border-[var(--ocean)] transition-colors"
                >
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
