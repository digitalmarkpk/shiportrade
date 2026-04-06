import { Metadata } from "next";
import { USFreightClassCalculator } from "@/components/tools/USFreightClassCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Truck,
  Scale,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  Calculator,
  Weight,
  Gauge,
  Package,
  DollarSign,
  Ruler,
} from "lucide-react";

export const metadata: Metadata = {
  title: "US Freight Class Calculator | NMFC Classification | Shiportrade.com",
  description: "Calculate NMFC freight class for LTL shipments. Determine density, find freight class 50-400, estimate costs, and optimize packaging for lower shipping rates.",
  keywords: ["freight class calculator", "NMFC", "density calculator", "LTL shipping", "freight classification", "pounds per cubic foot", "Class 50", "Class 100"],
};

export default function USFreightClassCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Truck className="h-3 w-3 mr-2" />
          Road Freight Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          US Freight Class Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Determine NMFC freight class based on density. Calculate pounds per cubic foot,
          estimate shipping costs, and optimize your LTL shipments.
        </p>
      </div>

      {/* Calculator */}
      <USFreightClassCalculator />

      {/* Educational Content */}
      <div className="mt-12 space-y-6">
        {/* What is Freight Class */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Freight Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              The National Motor Freight Classification (NMFC) is a standardized system that
              categorizes commodities for shipping. Developed by the National Motor Freight
              Traffic Association (NMFTA), it provides a uniform method for describing freight
              and establishing shipping rates.
            </p>
            <div className="grid md:grid-cols-4 gap-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Calculator className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">18 Classes</h4>
                <p className="text-sm text-muted-foreground">
                  From Class 50 (most dense) to Class 400 (least dense)
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Weight className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Density-Based</h4>
                <p className="text-sm text-muted-foreground">
                  Primary factor is pounds per cubic foot
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <DollarSign className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Cost Impact</h4>
                <p className="text-sm text-muted-foreground">
                  Lower class = lower per-hundredweight rate
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Package className="h-8 w-8 text-blue-500 mb-2" />
                <h4 className="font-medium mb-1">NMFC Item Numbers</h4>
                <p className="text-sm text-muted-foreground">
                  Each commodity has a specific NMFC code
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Freight Class Reference Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Scale className="h-5 w-5 text-[var(--ocean)]" />
              Freight Class Quick Reference
            </CardTitle>
            <CardDescription>Find your freight class by density</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Class</th>
                    <th className="text-left py-3 px-4">Density Range</th>
                    <th className="text-left py-3 px-4">Cost Factor</th>
                    <th className="text-left py-3 px-4">Typical Items</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 50</td>
                    <td className="py-3 px-4">50+ lbs/cu ft</td>
                    <td className="py-3 px-4">1.00x (Base)</td>
                    <td className="py-3 px-4 text-muted-foreground">Steel bars, engine blocks, lead ingots</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 55</td>
                    <td className="py-3 px-4">35-50 lbs/cu ft</td>
                    <td className="py-3 px-4">1.05x</td>
                    <td className="py-3 px-4 text-muted-foreground">Bricks, cement, lumber, hardware</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 60</td>
                    <td className="py-3 px-4">30-35 lbs/cu ft</td>
                    <td className="py-3 px-4">1.10x</td>
                    <td className="py-3 px-4 text-muted-foreground">Auto parts, beverages, canned goods</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 65</td>
                    <td className="py-3 px-4">22.5-30 lbs/cu ft</td>
                    <td className="py-3 px-4">1.15x</td>
                    <td className="py-3 px-4 text-muted-foreground">Bottled products, books, ceramics</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 70</td>
                    <td className="py-3 px-4">15-22.5 lbs/cu ft</td>
                    <td className="py-3 px-4">1.20x</td>
                    <td className="py-3 px-4 text-muted-foreground">Furniture, appliances, car parts</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 85</td>
                    <td className="py-3 px-4">12-13.5 lbs/cu ft</td>
                    <td className="py-3 px-4">1.40x</td>
                    <td className="py-3 px-4 text-muted-foreground">Crated machinery, small appliances</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 92.5</td>
                    <td className="py-3 px-4">10.5-12 lbs/cu ft</td>
                    <td className="py-3 px-4">1.50x</td>
                    <td className="py-3 px-4 text-muted-foreground">Computers, refrigerators</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 100</td>
                    <td className="py-3 px-4">9-10.5 lbs/cu ft</td>
                    <td className="py-3 px-4">1.60x</td>
                    <td className="py-3 px-4 text-muted-foreground">Canvas, wood cabinets, boat covers</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 125</td>
                    <td className="py-3 px-4">7-8 lbs/cu ft</td>
                    <td className="py-3 px-4">1.90x</td>
                    <td className="py-3 px-4 text-muted-foreground">Small appliances, dresses</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 150</td>
                    <td className="py-3 px-4">6-7 lbs/cu ft</td>
                    <td className="py-3 px-4">2.10x</td>
                    <td className="py-3 px-4 text-muted-foreground">Auto sheet metal, bookcases</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 200</td>
                    <td className="py-3 px-4">3-4 lbs/cu ft</td>
                    <td className="py-3 px-4">2.60x</td>
                    <td className="py-3 px-4 text-muted-foreground">Aircraft parts, mattresses</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Class 300</td>
                    <td className="py-3 px-4">1-2 lbs/cu ft</td>
                    <td className="py-3 px-4">3.30x</td>
                    <td className="py-3 px-4 text-muted-foreground">Wicker furniture, wine tanks</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Class 400</td>
                    <td className="py-3 px-4">&lt;1 lbs/cu ft</td>
                    <td className="py-3 px-4">3.80x</td>
                    <td className="py-3 px-4 text-muted-foreground">Ping pong balls, styrofoam</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Classification Factors */}
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Info className="h-5 w-5" />
              Four Factors of Freight Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              While density is the primary factor, NMFC considers four characteristics when
              determining the appropriate freight class:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-background">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">1. Density</h4>
                  <Badge className="bg-[var(--ocean)]">Primary Factor</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pounds per cubic foot determines the base freight class. Higher density
                  items have lower classes and lower shipping costs.
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">2. Stowability</h4>
                  <Badge variant="outline">20% Weight</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Can other freight be loaded on top or around your shipment? Items that
                  can&apos;t be stacked or loaded with other goods may have higher classes.
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">3. Handling</h4>
                  <Badge variant="outline">15% Weight</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Special handling requirements like fragility, hazardous materials, or
                  unusual shapes can increase freight class.
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-background">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">4. Liability</h4>
                  <Badge variant="outline">15% Weight</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  High-value items, perishables, or fragile goods have higher liability
                  and may be assigned higher freight classes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
              Pro Tips for Lower Freight Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                    <Ruler className="h-5 w-5 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Measure Accurately</h4>
                    <p className="text-sm text-muted-foreground">
                      Always use actual dimensions. Carriers will measure and reclassify
                      if dimensions don&apos;t match.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                    <Package className="h-5 w-5 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Optimize Packaging</h4>
                    <p className="text-sm text-muted-foreground">
                      Use smaller boxes and eliminate void fill to increase density and
                      lower your freight class.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                    <Scale className="h-5 w-5 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Calculate Before Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      Know your density and class before getting quotes to avoid
                      unexpected reclassification fees.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                    <Calculator className="h-5 w-5 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Know Your NMFC Code</h4>
                    <p className="text-sm text-muted-foreground">
                      Find the correct NMFC item number for your commodity to ensure
                      accurate classification.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                    <Weight className="h-5 w-5 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Consolidate Shipments</h4>
                    <p className="text-sm text-muted-foreground">
                      Combine smaller shipments into larger, denser loads to achieve
                      better freight classes.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                    <Truck className="h-5 w-5 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Use Standard Pallets</h4>
                    <p className="text-sm text-muted-foreground">
                      Standard 48×40 pallets are easier to stack and maximize trailer
                      space utilization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Using Wrong NMFC Code</h4>
                <p className="text-sm text-muted-foreground">
                  Incorrect classification can result in reclassification fees, delayed
                  shipments, and billing disputes with carriers.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Estimating Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Carriers use dimensioners to measure every shipment. Guessing leads
                  to unexpected charges and disputes.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Ignoring Density</h4>
                <p className="text-sm text-muted-foreground">
                  Not calculating density beforehand can result in surprise class changes
                  and higher-than-expected costs.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Overlooking Handling Requirements</h4>
                <p className="text-sm text-muted-foreground">
                  Failing to declare special handling needs can lead to damage claims
                  and additional fees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>What is an NMFC number?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  An NMFC (National Motor Freight Classification) number is a unique code assigned
                  to each type of commodity. It&apos;s a 4-6 digit number that carriers use to identify
                  and classify freight. For example, machinery parts might be NMFC 133300, while
                  electronics might be NMFC 116000. Knowing your correct NMFC number ensures accurate
                  classification and prevents reclassification fees.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Why does lower freight class cost less?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Lower freight classes represent denser cargo that takes up less space per pound.
                  Since carriers are limited by trailer space, dense shipments allow them to carry
                  more total weight. A Class 50 shipment of steel bars can have more weight stacked
                  on top, while a Class 400 shipment of styrofoam takes up the same space but can&apos;t
                  have weight stacked on it. This space efficiency is rewarded with lower rates.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>How do I find my NMFC item number?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  You can find your NMFC item number by:
                  <br />
                  1. Searching the NMFC database (subscription required from NMFTA)
                  <br />
                  2. Asking your carrier or freight broker
                  <br />
                  3. Using freight class lookup tools online
                  <br />
                  4. Consulting with a logistics professional
                  <br />
                  <br />
                  For common commodities, we&apos;ve included typical NMFC codes in this calculator.
                  However, for specific items, you should verify the correct code.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>Can freight class change after pickup?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes. Carriers can inspect and reclassify freight at any terminal. If your declared
                  dimensions, weight, or NMFC code don&apos;t match the actual shipment, you&apos;ll receive
                  a reclassification fee plus the corrected rate. This is why accurate measurements
                  and correct NMFC codes are essential. Some carriers use automated dimensioners at
                  every dock to verify shipments.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>What is dimensional weight in LTL shipping?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Dimensional (or dim) weight is a calculation based on volume rather than actual
                  weight. In LTL shipping, carriers use density to determine freight class, but
                  dimensional weight concepts still apply. If your shipment has low density (high
                  volume relative to weight), you&apos;ll be charged at a higher freight class. This
                  ensures carriers are compensated for the space your freight occupies.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q6">
                <AccordionTrigger>How can I lower my freight class?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  To lower your freight class (and reduce shipping costs):
                  <br />
                  • <strong>Increase density</strong> - Use smaller boxes, eliminate void fill, pack more efficiently
                  <br />
                  • <strong>Improve stowability</strong> - Design packaging that can be stacked
                  <br />
                  • <strong>Use standard sizes</strong> - Standard pallets and cartons maximize trailer space
                  <br />
                  • <strong>Consolidate shipments</strong> - Combine multiple light shipments into denser loads
                  <br />
                  • <strong>Minimize special handling</strong> - Reduce fragile/hazardous designations when possible
                  <br />
                  <br />
                  Even small increases in density can move you to a lower class, resulting in
                  significant savings on high-volume shipments.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Tools</CardTitle>
            <CardDescription>Other road freight and shipping calculators you may find useful</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/tools/road-rail/axle-load" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Truck className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Axle Load Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate truck axle weight distribution</p>
              </a>
              <a href="/tools/road-rail/ldm-calculator" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Ruler className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">LDM Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate loading meters for road freight</p>
              </a>
              <a href="/tools/ocean-freight/cbm-calculator" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Package className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">CBM Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate cubic meters for shipping</p>
              </a>
              <a href="/tools/air-freight/volumetric-weight" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Weight className="h-8 w-8 text-blue-500 mb-2" />
                <h4 className="font-medium mb-1">Volumetric Weight</h4>
                <p className="text-xs text-muted-foreground">Calculate air freight chargeable weight</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
