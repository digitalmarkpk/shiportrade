import { Metadata } from "next";
import { TruckPalletCapacity } from "@/components/tools/TruckPalletCapacity";
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
  Package,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  Ruler,
  Weight,
  Layers,
  LayoutGrid,
  Gauge,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Truck Pallet Capacity Calculator | Shiportrade.com",
  description: "Calculate maximum pallet capacity for trucks and trailers. Optimize pallet arrangement, check weight vs volume limits, and visualize loading plans.",
  keywords: ["truck pallet calculator", "pallet capacity", "trailer loading", "pallet arrangement", "truck loading optimization", "LTL shipping"],
};

export default function TruckPalletCapacityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Truck className="h-3 w-3 mr-2" />
          Road Transport Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Truck Pallet Capacity Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate optimal pallet arrangement, check weight vs volume limitations, and visualize
          truck floor plans for maximum loading efficiency.
        </p>
      </div>

      {/* Calculator */}
      <TruckPalletCapacity />

      {/* Educational Content */}
      <div className="mt-12 space-y-6">
        {/* What is Pallet Loading Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Pallet Loading Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Pallet loading optimization is the process of maximizing the number of pallets that can be
              loaded onto a truck or trailer while respecting both volume and weight constraints. Effective
              optimization reduces transportation costs and improves supply chain efficiency.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <LayoutGrid className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Space Efficiency</h4>
                <p className="text-sm text-muted-foreground">
                  Maximize floor space utilization by selecting optimal pallet orientations and arrangements.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Weight className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Weight Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure loads stay within legal weight limits for safe and compliant transport operations.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Gauge className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Cost Reduction</h4>
                <p className="text-sm text-muted-foreground">
                  Reduce per-pallet shipping costs by maximizing each truck&apos;s capacity utilization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pallet Types Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-[var(--logistics)]" />
              Standard Pallet Types & Capacities
            </CardTitle>
            <CardDescription>Common pallet sizes and how they fit in standard trailers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Pallet Type</th>
                    <th className="text-right py-3 px-4">Dimensions</th>
                    <th className="text-right py-3 px-4">Floor Area</th>
                    <th className="text-right py-3 px-4">13.6m Trailer Capacity</th>
                    <th className="text-left py-3 px-4">Primary Region</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Euro Pallet (EUR)</td>
                    <td className="text-right py-3 px-4">1200 × 800 mm</td>
                    <td className="text-right py-3 px-4">0.96 m²</td>
                    <td className="text-right py-3 px-4 font-semibold text-[var(--logistics)]">33-34 pallets</td>
                    <td className="py-3 px-4 text-muted-foreground">Europe</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Industrial Pallet</td>
                    <td className="text-right py-3 px-4">1200 × 1000 mm</td>
                    <td className="text-right py-3 px-4">1.20 m²</td>
                    <td className="text-right py-3 px-4 font-semibold text-[var(--logistics)]">26 pallets</td>
                    <td className="py-3 px-4 text-muted-foreground">Europe</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">US GMA Pallet</td>
                    <td className="text-right py-3 px-4">48 × 40 in (1219 × 1016 mm)</td>
                    <td className="text-right py-3 px-4">1.24 m²</td>
                    <td className="text-right py-3 px-4 font-semibold text-[var(--logistics)]">24-26 pallets</td>
                    <td className="py-3 px-4 text-muted-foreground">North America</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Asian Pallet</td>
                    <td className="text-right py-3 px-4">1100 × 1100 mm</td>
                    <td className="text-right py-3 px-4">1.21 m²</td>
                    <td className="text-right py-3 px-4 font-semibold text-[var(--logistics)]">24 pallets</td>
                    <td className="py-3 px-4 text-muted-foreground">Japan, Korea</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Half Euro</td>
                    <td className="text-right py-3 px-4">800 × 600 mm</td>
                    <td className="text-right py-3 px-4">0.48 m²</td>
                    <td className="text-right py-3 px-4 font-semibold text-[var(--logistics)]">66+ pallets</td>
                    <td className="py-3 px-4 text-muted-foreground">Europe</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Weight vs Volume Limitation */}
        <Card className="border-[var(--ocean)]/30 bg-[var(--ocean)]/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-[var(--ocean)]">
              <Info className="h-5 w-5" />
              Weight-Limited vs Volume-Limited Loads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Every truck load is constrained by either volume (floor space) or weight. Understanding which
              limit applies to your shipment is crucial for optimization:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-[var(--ocean)]">
                  <Ruler className="h-5 w-5" />
                  Volume-Limited Loads
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Light, bulky cargo (foam, insulation, empty containers)</li>
                  <li>• Floor space fills before reaching weight limit</li>
                  <li>• Optimize by stacking or using smaller pallets</li>
                  <li>• Typical utilization: High floor space, low weight %</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-[var(--logistics)]">
                  <Weight className="h-5 w-5" />
                  Weight-Limited Loads
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Dense, heavy cargo (metal, liquids, machinery)</li>
                  <li>• Weight limit reached before filling floor space</li>
                  <li>• Optimize by using larger pallets or consolidating</li>
                  <li>• Typical utilization: Low floor space, high weight %</li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Optimization Strategy:</p>
              <p className="text-sm text-muted-foreground">
                Ideally, aim for loads that approach both limits simultaneously (high floor space AND high weight
                utilization). This maximizes transport efficiency and minimizes cost per unit shipped.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stacking Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Layers className="h-5 w-5 text-[var(--logistics)]" />
              Pallet Stacking Guidelines
            </CardTitle>
            <CardDescription>When and how to safely stack pallets for transport</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                  Suitable for Stacking
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[var(--logistics)]" />
                    Uniform, stackable cartons or boxes
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[var(--logistics)]" />
                    Shrink-wrapped or stretch-wrapped loads
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[var(--logistics)]" />
                    Non-fragile, crush-resistant goods
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[var(--logistics)]" />
                    Stable, low center-of-gravity items
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[var(--logistics)]" />
                    Building materials, paper products
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Avoid Stacking
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                    Fragile or breakable items
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                    Liquids in non-rigid containers
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                    Irregularly shaped cargo
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                    Top-heavy or unstable loads
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                    Electronics, precision equipment
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>Pro Tip:</strong> Always ensure stacked pallets are properly secured with strapping,
                stretch wrap, or load bars to prevent shifting during transport. Consider road conditions
                and braking forces when determining stack stability.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
              Pro Tips for Pallet Loading Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Match Pallets to Cargo</h4>
                <p className="text-sm text-muted-foreground">
                  Use the smallest pallet that safely holds your cargo. Smaller pallets = more capacity.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Consider Rotated Orientation</h4>
                <p className="text-sm text-muted-foreground">
                  Sometimes placing pallets sideways allows more to fit. Test both orientations.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Account for Packaging</h4>
                <p className="text-sm text-muted-foreground">
                  Remember that overhang, shrink wrap, and strapping add to effective pallet size.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Plan for Multi-Stop Routes</h4>
                <p className="text-sm text-muted-foreground">
                  Load in reverse delivery order. Last-off cargo goes in first (near the door).
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Weight Distribution Matters</h4>
                <p className="text-sm text-muted-foreground">
                  Balance heavy pallets over axles and maintain even left/right distribution.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Leave Access Space</h4>
                <p className="text-sm text-muted-foreground">
                  For multi-stop deliveries, maintain forklift access to rear pallets.
                </p>
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
                <h4 className="font-medium mb-2">Ignoring Weight Limits</h4>
                <p className="text-sm text-muted-foreground">
                  Focusing only on fitting more pallets without checking weight can lead to overloaded trucks,
                  fines, and safety issues. Always verify both constraints.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Overestimating Stacking Capability</h4>
                <p className="text-sm text-muted-foreground">
                  Not all cargo can be safely stacked. Improper stacking leads to damaged goods, claims,
                  and potential accidents during transport.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Neglecting Lashing Requirements</h4>
                <p className="text-sm text-muted-foreground">
                  Unsecured loads shift during braking and cornering. Always use appropriate restraints,
                  especially for partial loads.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Forgetting Height Clearance</h4>
                <p className="text-sm text-muted-foreground">
                  Stacked loads must clear trailer height and any door restrictions. Measure total load
                  height including pallets and packaging.
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
                <AccordionTrigger>How many Euro pallets fit in a standard 13.6m trailer?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A standard 13.6m European semi-trailer can typically fit 33-34 Euro pallets (1200×800mm) 
                  on a single layer. This assumes optimal placement with pallets arranged lengthwise along 
                  the trailer. With double stacking (if cargo permits), this can increase to 66-68 pallets.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>What&apos;s the difference between LDM and pallet count?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  LDM (Loading Meter) measures linear floor space along the trailer length. One LDM equals 
                  one meter of trailer length at standard 2.4m width. Pallet count is the actual number of 
                  pallets. For example, one Euro pallet occupies 0.4 LDM, while an industrial pallet occupies 
                  0.5 LDM. LDM is useful for pricing mixed cargo types, while pallet count is better for 
                  planning standard pallet shipments.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>Can I mix different pallet sizes in one truck?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, mixing pallet sizes is common practice and can improve space utilization. For example, 
                  combining Euro and industrial pallets allows you to fill gaps that single-size loading 
                  leaves empty. However, this requires careful load planning to ensure stability and proper 
                  weight distribution. Consider using load planning software for complex mixed loads.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>What weight per pallet is typical for truck transport?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Typical pallet weights vary by industry: retail goods (200-500 kg), industrial products 
                  (500-1000 kg), and bulk materials (up to 1500 kg per pallet). A standard Euro pallet is 
                  rated for 1500 kg dynamic load, but practical limits are lower for safe handling. For a 
                  25-tonne trailer payload, you could theoretically load 25 pallets at 1000 kg each, or 
                  50 pallets at 500 kg each (though floor space would limit this).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>How does stacking affect weight distribution?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Stacking concentrates more weight in smaller floor areas, which can lead to localized 
                  overloading. Each stacked position carries 2-3 times the single-pallet weight. Ensure 
                  your trailer floor can handle the concentrated point loads, and verify that the forklift 
                  or pallet jack can safely handle the heavier stacked units during loading/unloading.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q6">
                <AccordionTrigger>Should I optimize for weight or volume?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The optimal strategy depends on your cargo characteristics. For light, bulky goods, focus 
                  on volume optimization (stacking, pallet selection, orientation). For heavy, dense cargo, 
                  focus on weight distribution and ensuring you don&apos;t exceed limits. The most cost-effective 
                  approach is to match both constraints—aiming for high utilization in both floor space 
                  and payload capacity simultaneously.
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
              <a href="/tools/road-rail/axle-load" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Weight className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Axle Load Calculator</h4>
                <p className="text-xs text-muted-foreground">Check axle weight distribution</p>
              </a>
              <a href="/tools/road-rail/freight-class" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Package className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Freight Class Calculator</h4>
                <p className="text-xs text-muted-foreground">Determine US NMFC freight class</p>
              </a>
              <a href="/tools/ocean-freight/cbm-calculator" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <LayoutGrid className="h-8 w-8 text-[var(--ocean)] mb-2" />
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
