import { Metadata } from "next";
import { AxleLoadCalculator } from "@/components/tools/AxleLoadCalculator";
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
  Globe,
  Ruler,
  Weight,
  Gauge,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Axle Load Distribution Calculator | Shiportrade.com",
  description: "Calculate axle load distribution for truck transport compliance. Check legal weight limits, optimize load placement, and ensure road safety.",
  keywords: ["axle load calculator", "truck weight distribution", "GVW calculator", "bridge formula", "axle weight limits", "road transport compliance"],
};

export default function AxleLoadCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Truck className="h-3 w-3 mr-2" />
          Road Transport Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Axle Load Distribution Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate per-axle load distribution, check legal compliance, and optimize cargo placement
          for safe and legal truck transport operations.
        </p>
      </div>

      {/* Calculator */}
      <AxleLoadCalculator />

      {/* Educational Content */}
      <div className="mt-12 space-y-6">
        {/* What is Axle Load */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Axle Load Distribution?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Axle load distribution refers to how the total weight of a vehicle and its cargo is
              distributed across each axle. Proper weight distribution is critical for:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Gauge className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Vehicle Stability</h4>
                <p className="text-sm text-muted-foreground">
                  Balanced weight distribution ensures proper handling, braking, and prevents rollovers.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Scale className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Legal Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  Each jurisdiction has maximum weight limits per axle that must not be exceeded.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Ruler className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Infrastructure Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Overloaded axles cause excessive road and bridge damage, leading to costly repairs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-[var(--ocean)]" />
              Legal Weight Limits by Region
            </CardTitle>
            <CardDescription>Maximum allowable weights vary by jurisdiction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Region</th>
                    <th className="text-right py-3 px-4">Single Axle</th>
                    <th className="text-right py-3 px-4">Tandem Axle</th>
                    <th className="text-right py-3 px-4">Max GVW</th>
                    <th className="text-left py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">United States</td>
                    <td className="text-right py-3 px-4">20,000 lbs (9,072 kg)</td>
                    <td className="text-right py-3 px-4">34,000 lbs (15,422 kg)</td>
                    <td className="text-right py-3 px-4">80,000 lbs (36,287 kg)</td>
                    <td className="py-3 px-4 text-muted-foreground">Federal limits; Bridge Formula applies</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">European Union</td>
                    <td className="text-right py-3 px-4">11,500 kg</td>
                    <td className="text-right py-3 px-4">19,000 kg</td>
                    <td className="text-right py-3 px-4">40,000 kg</td>
                    <td className="py-3 px-4 text-muted-foreground">Directive 96/53/EC</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">United Kingdom</td>
                    <td className="text-right py-3 px-4">11,500 kg</td>
                    <td className="text-right py-3 px-4">19,000 kg</td>
                    <td className="text-right py-3 px-4">44,000 kg</td>
                    <td className="py-3 px-4 text-muted-foreground">Higher limit for intermodal transport</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Australia</td>
                    <td className="text-right py-3 px-4">9,000 kg</td>
                    <td className="text-right py-3 px-4">16,500 kg</td>
                    <td className="text-right py-3 px-4">62,500 kg</td>
                    <td className="py-3 px-4 text-muted-foreground">B-doubles can operate up to 68.5t</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bridge Formula */}
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Info className="h-5 w-5" />
              Understanding the US Federal Bridge Formula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The Federal Bridge Gross Weight Formula (also known as Bridge Formula B) is used in the
              United States to determine the maximum allowable weight for a group of consecutive axles
              based on their spacing. This protects bridges from concentrated loads.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg font-mono text-center">
              <p className="text-lg">W = 500 × ((L × N) / (N - 1) + 12N + 36)</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="font-medium mb-1">W</p>
                <p className="text-sm text-muted-foreground">
                  Maximum gross weight on any group of consecutive axles (in pounds)
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium mb-1">L</p>
                <p className="text-sm text-muted-foreground">
                  Distance in feet between the extreme axles of any group
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium mb-1">N</p>
                <p className="text-sm text-muted-foreground">
                  Number of axles in the group being considered
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Key Insight:</strong> Longer axle spacing allows for higher weight limits because
              the load is distributed over a greater length, reducing stress on bridge structures.
            </p>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
              Load Distribution Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                  Do&apos;s
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                    Distribute cargo weight evenly across the trailer bed
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                    Position heavy items close to or over the axles
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                    Maintain at least 20% of GVW on the steering axle
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                    Verify weight limits for each jurisdiction traveled
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                    Account for fuel weight changes during the journey
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Don&apos;ts
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    Concentrate all weight in one area of the trailer
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    Exceed individual axle limits even if total GVW is under
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    Ignore uneven weight distribution between left and right
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    Forget to account for trailer tare weight
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    Assume all regions have identical weight limits
                  </li>
                </ul>
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
                <h4 className="font-medium mb-2">Focusing Only on GVW</h4>
                <p className="text-sm text-muted-foreground">
                  Even if total weight is under the limit, individual axles can still be overloaded.
                  Always check per-axle weights, not just gross vehicle weight.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Ignoring the Bridge Formula</h4>
                <p className="text-sm text-muted-foreground">
                  In the US, the Bridge Formula can limit weights below standard limits for vehicles
                  with closely spaced axles. Always verify compliance with this formula.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Not Accounting for Fuel</h4>
                <p className="text-sm text-muted-foreground">
                  A full fuel tank can add 400-600 kg to the steer axle. Weight distribution changes
                  as fuel is consumed during the journey.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Cross-Border Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  Different countries and states have different limits. A legal load in one jurisdiction
                  may be overloaded in another.
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
                <AccordionTrigger>What happens if I exceed axle weight limits?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Exceeding axle weight limits can result in significant fines, vehicle impoundment,
                  and liability for road damage. More importantly, overloaded axles compromise vehicle
                  stability, increase braking distances, and accelerate tire and component wear. In
                  case of accidents, overloaded vehicles may face increased liability and insurance issues.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>How do I calculate load distribution for multiple cargo pieces?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  For multiple cargo pieces, calculate each piece&apos;s contribution to each axle based on
                  its position using the lever arm principle. The calculator above supports multiple
                  loading positions - use the &quot;Number of Loading Positions&quot; slider to configure
                  each piece separately with its weight percentage and position offset.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>Why does the US use the Bridge Formula?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The Bridge Formula protects bridges from excessive stress caused by concentrated loads.
                  When axles are close together, the entire weight concentrates on a small portion of
                  the bridge structure. By requiring longer spacing for higher weights, the formula
                  ensures that weight is distributed over enough length to prevent bridge damage.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>Can I increase payload by adding more axles?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, adding axles can increase legal payload capacity because weight limits are
                  typically per-axle or per-axle-group. However, each additional axle adds tare weight
                  (reducing net payload) and may require special permits. The trade-off depends on
                  your specific cargo and route requirements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>How accurate is this calculator?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  This calculator provides estimates based on theoretical load distribution principles.
                  Actual axle weights depend on many factors including suspension type, tire pressure,
                  road conditions, and precise cargo placement. Always verify actual weights using a
                  certified weighbridge before operating on public roads.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q6">
                <AccordionTrigger>What is the minimum weight on the steering axle?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  For safe steering and braking, at least 20-25% of the gross vehicle weight should
                  be on the front (steering) axle. Insufficient front axle weight reduces steering
                  control, especially in wet conditions. Our calculator flags when front axle weight
                  falls below recommended levels.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Tools</CardTitle>
            <CardDescription>Other road transport calculators you may find useful</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/tools/road-rail/ldm-calculator" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Ruler className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">LDM Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate loading meters for road freight</p>
              </a>
              <a href="/tools/road-rail/modal-shift" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Truck className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Modal Shift Comparator</h4>
                <p className="text-xs text-muted-foreground">Compare road vs rail transport costs</p>
              </a>
              <a href="/tools/road-rail/route-optimizer" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Globe className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Route Optimizer</h4>
                <p className="text-xs text-muted-foreground">Optimize delivery routes</p>
              </a>
              <a href="/tools/ocean-freight/cbm-calculator" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Weight className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">CBM Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate cubic meters for shipping</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
