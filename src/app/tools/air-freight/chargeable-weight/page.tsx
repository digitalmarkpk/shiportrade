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
  Scale,
  Box,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChargeableWeightLogic } from "@/components/tools/ChargeableWeightLogic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Chargeable Weight Calculator - Air Freight | Shiportrade.com",
  description: "Calculate chargeable weight for air freight with carrier divisor comparison, mode analysis, and cost optimization. Free tool supporting IATA, DHL, FedEx, UPS, and more.",
  keywords: ["chargeable weight calculator", "air freight calculator", "volumetric weight", "dimensional weight", "carrier divisor", "freight optimization"],
};

export default function ChargeableWeightPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/air-freight" className="hover:text-foreground">Air Freight</Link>
        <span>/</span>
        <span className="text-foreground">Chargeable Weight Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Scale className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Chargeable Weight Logic Tool</h1>
            <p className="text-muted-foreground">Calculate, compare, and optimize your freight costs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline">Multi-Carrier</Badge>
          <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">Mode Comparison</Badge>
        </div>
      </div>

      {/* Calculator */}
      <ChargeableWeightLogic />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Chargeable Weight?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              <strong>Chargeable weight</strong> is the weight used to calculate shipping costs. 
              It is always the <strong>greater</strong> of actual weight or volumetric weight.
            </p>
            <p className="text-muted-foreground mt-3">
              This ensures carriers are compensated fairly for the space cargo occupies, 
              whether it&apos;s heavy machinery or lightweight pillows.
            </p>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg font-mono text-sm">
              <div className="text-[var(--ocean)]">Chargeable Weight =</div>
              <div className="ml-4">Max(Actual Weight, Volumetric Weight)</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Box className="h-5 w-5 text-[var(--ocean)]" />
              Volumetric Weight Formula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
              <div>
                <span className="text-[var(--ocean)]">Volumetric Weight (kg)</span>
              </div>
              <div className="text-muted-foreground">
                = (L × W × H) ÷ Divisor
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                Dimensions in centimeters
              </div>
              <div className="mt-2 text-sm">
                Example: 100cm × 80cm × 60cm ÷ 6000
              </div>
              <div>
                = 480,000 ÷ 6000 = <span className="text-[var(--logistics)]">80 kg</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              The divisor varies by carrier. IATA standard is 6000, DHL uses 5000.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="h-5 w-5 text-[var(--ocean)]" />
              Carrier Divisors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 bg-[var(--ocean)]/5 rounded border border-[var(--ocean)]/30">
                <span className="font-medium">IATA Standard</span>
                <Badge className="bg-[var(--ocean)]">6000</Badge>
              </div>
              <div className="flex justify-between p-2 bg-amber-500/10 rounded border border-amber-500/30">
                <span className="font-medium">DHL Express</span>
                <Badge className="bg-amber-500">5000</Badge>
              </div>
              <div className="flex justify-between p-2 bg-muted/30 rounded">
                <span>FedEx International</span>
                <span className="font-medium">6000</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/30 rounded">
                <span>UPS International</span>
                <span className="font-medium">6000</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/30 rounded">
                <span>TNT Express</span>
                <span className="font-medium">6000</span>
              </div>
              <div className="flex justify-between p-2 bg-[var(--logistics)]/5 rounded border border-[var(--logistics)]/30">
                <span className="font-medium">Sea Freight</span>
                <Badge className="bg-[var(--logistics)]">1 CBM = 1000 kg</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Density Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-[var(--ocean)]" />
            Cargo Density Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Cargo density (kg per cubic meter) determines whether you pay for actual weight or volumetric weight.
            Understanding your cargo density helps you choose the right shipping mode.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Density (kg/m³)</th>
                  <th className="text-left py-3 px-4">Classification</th>
                  <th className="text-left py-3 px-4">Chargeable Weight</th>
                  <th className="text-left py-3 px-4">Best Mode</th>
                  <th className="text-left py-3 px-4">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono">0 - 50</td>
                  <td className="py-3 px-4"><Badge className="bg-red-500 text-white">Very Light</Badge></td>
                  <td className="py-3 px-4">Always Volumetric</td>
                  <td className="py-3 px-4">Sea Freight</td>
                  <td className="py-3 px-4 text-muted-foreground">Pillows, foam, empty containers</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono">50 - 150</td>
                  <td className="py-3 px-4"><Badge className="bg-amber-500 text-white">Light</Badge></td>
                  <td className="py-3 px-4">Usually Volumetric</td>
                  <td className="py-3 px-4">Compare modes</td>
                  <td className="py-3 px-4 text-muted-foreground">Clothing, furniture, toys</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono">150 - 300</td>
                  <td className="py-3 px-4"><Badge className="bg-emerald-500 text-white">Medium</Badge></td>
                  <td className="py-3 px-4">May be Actual</td>
                  <td className="py-3 px-4">Good for Air</td>
                  <td className="py-3 px-4 text-muted-foreground">Electronics, shoes, packaged food</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono">300 - 500</td>
                  <td className="py-3 px-4"><Badge className="bg-[var(--ocean)] text-white">Dense</Badge></td>
                  <td className="py-3 px-4">Always Actual</td>
                  <td className="py-3 px-4">Excellent for Air</td>
                  <td className="py-3 px-4 text-muted-foreground">Machinery, metal parts, books</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono">500+</td>
                  <td className="py-3 px-4"><Badge className="bg-[var(--logistics)] text-white">Very Dense</Badge></td>
                  <td className="py-3 px-4">Always Actual</td>
                  <td className="py-3 px-4">Best for Air</td>
                  <td className="py-3 px-4 text-muted-foreground">Steel, lead batteries, liquids</td>
                </tr>
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
                <span><strong>Calculate before quoting:</strong> Always determine chargeable weight before requesting carrier quotes to avoid surprises</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span><strong>Compare carriers:</strong> DHL&apos;s 5000 divisor results in 20% higher volumetric weight than IATA standard</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span><strong>Optimize packaging:</strong> Use smaller boxes, vacuum sealing, or compress products to reduce volumetric weight</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span><strong>Consider consolidation:</strong> Combine multiple shipments for better space utilization</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span><strong>Mode selection:</strong> For density below 167 kg/m³, sea freight is often more economical</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span><strong>Dimension accuracy:</strong> Always include packaging in your measurements</span>
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
                <span><strong>Ignoring volumetric weight:</strong> Assuming actual weight is always the chargeable weight</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                <span><strong>Wrong divisor:</strong> Using IATA 6000 when carrier uses 5000 (DHL)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                <span><strong>Missing packaging:</strong> Not including outer carton dimensions in calculations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                <span><strong>Unit confusion:</strong> Mixing inches and centimeters without proper conversion</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                <span><strong>Ignoring density:</strong> Not considering cargo density for mode selection</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                <span><strong>Hidden costs:</strong> Forgetting fuel surcharges, security fees, and handling charges</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Cost Impact Example */}
      <Card className="mt-8 border-[var(--ocean)]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
            Real-World Cost Impact Example
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Scenario: Shipping 100cm × 80cm × 60cm package</h4>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actual Weight:</span>
                  <span className="font-medium">25 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume:</span>
                  <span className="font-medium">0.48 m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Density:</span>
                  <span className="font-medium">52 kg/m³ (Light)</span>
                </div>
                <Separator />
                <div className="flex justify-between text-[var(--ocean)]">
                  <span className="font-medium">Volumetric Weight (IATA):</span>
                  <span className="font-bold">80 kg</span>
                </div>
                <div className="flex justify-between text-amber-500">
                  <span className="font-medium">Volumetric Weight (DHL):</span>
                  <span className="font-bold">96 kg</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Cost Comparison (at $3.50/kg)</h4>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actual Weight Billing:</span>
                  <span className="font-medium">$87.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IATA Chargeable Weight:</span>
                  <span className="font-medium">$280.00</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span className="font-medium">DHL Chargeable Weight:</span>
                  <span className="font-bold">$336.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-[var(--logistics)]">
                  <span className="font-medium">Potential Savings:</span>
                  <span className="font-bold">$192.50 - $248.50</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  * Savings possible through packaging optimization or carrier selection
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Why do carriers use chargeable weight instead of actual weight?</AccordionTrigger>
              <AccordionContent>
                Aircraft and vehicles have limited cargo space. A large box of pillows takes up the same space as a 
                small box of machinery, but weighs far less. Chargeable weight ensures carriers are compensated for 
                the space cargo occupies, not just its weight. Without this system, shipping pillows by air would be 
                unprofitable for carriers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Which divisor should I use for my calculations?</AccordionTrigger>
              <AccordionContent>
                Use the divisor specified by your carrier. IATA standard (6000) is used by most airlines, FedEx, 
                UPS, and TNT. DHL Express uses 5000, which results in 20% higher volumetric weight. For sea freight, 
                the standard is 1 CBM = 1000 kg. Always confirm with your specific carrier before finalizing calculations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How can I reduce my chargeable weight?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Use smaller boxes or optimize packaging design</li>
                  <li>Compress products where possible (vacuum sealing)</li>
                  <li>Remove unnecessary packaging materials</li>
                  <li>Consider alternative shipping modes (sea for light cargo)</li>
                  <li>Consolidate multiple shipments</li>
                  <li>Compare carriers - some use higher divisors</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>When should I choose air freight vs sea freight?</AccordionTrigger>
              <AccordionContent>
                <strong>Choose air freight when:</strong>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Cargo density is above 167 kg/m³</li>
                  <li>Transit time is critical</li>
                  <li>High-value goods requiring security</li>
                  <li>Perishable items</li>
                </ul>
                <strong className="block mt-3">Choose sea freight when:</strong>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Cargo density is below 167 kg/m³</li>
                  <li>Large volume shipments</li>
                  <li>Non-urgent delivery</li>
                  <li>Cost is the primary concern</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What is the break-even density for air freight?</AccordionTrigger>
              <AccordionContent>
                The break-even density is approximately <strong>167 kg/m³</strong> for IATA divisor (6000). 
                Above this density, you&apos;ll pay for actual weight; below it, you&apos;ll pay for volumetric weight. 
                For DHL (5000 divisor), the break-even is 200 kg/m³. Cargo at exactly break-even density has 
                equal actual and volumetric weight.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>Are fuel surcharges calculated on chargeable weight?</AccordionTrigger>
              <AccordionContent>
                Yes, fuel surcharges (FSC) and security surcharges (SSC) are typically calculated based on 
                chargeable weight, not actual weight. This means if you&apos;re paying for 80 kg volumetric weight 
                but your cargo only weighs 25 kg, you&apos;ll pay fuel surcharge on 80 kg. This makes understanding 
                chargeable weight even more important for accurate cost estimation.
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
            { name: "Volumetric Weight Calculator", href: "/tools/air-freight/volumetric-weight", description: "Basic volumetric weight calculation" },
            { name: "IATA Zone Rates", href: "/tools/air-freight/iata-zone-rates", description: "Air freight rate by zones" },
            { name: "ULD Loadability", href: "/tools/air-freight/uld-loadability", description: "Container load planning" },
            { name: "Fuel Surcharge Calculator", href: "/tools/air-freight/fuel-surcharge", description: "Air freight fuel costs" },
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
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
