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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FCLLoadabilityEngine } from "@/components/tools/FCLLoadabilityEngine";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FCL Loadability Engine | Shiportrade.com",
  description: "Optimize container loading configurations. Calculate volumetric capacity, weight utilization, and pallet placement for FCL shipments.",
  keywords: ["FCL calculator", "container loading", "container utilization", "loadability optimizer", "container capacity"],
  openGraph: {
    title: "FCL Loadability Engine - Container Optimization",
    description: "Maximize your container utilization with our advanced loadability calculator.",
    type: "website",
  },
};

export default function FCLLoadabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/ocean-freight" className="hover:text-foreground">Ocean Freight</Link>
        <span>/</span>
        <span className="text-foreground">FCL Loadability Engine</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Container className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">FCL Loadability Engine</h1>
            <p className="text-muted-foreground">Optimize your container loading configuration</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <FCLLoadabilityEngine />

      <Separator className="my-12" />

      {/* Container Types Reference */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5 text-[var(--ocean)]" />
            Container Types Reference
          </CardTitle>
          <CardDescription>Standard container specifications for FCL planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-center py-3 px-4">Length</th>
                  <th className="text-center py-3 px-4">Width</th>
                  <th className="text-center py-3 px-4">Height</th>
                  <th className="text-center py-3 px-4">Capacity</th>
                  <th className="text-center py-3 px-4">Max Payload</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "20' GP", length: "5.90m", width: "2.35m", height: "2.39m", capacity: "33.2 CBM", payload: "21,700 kg" },
                  { type: "40' GP", length: "12.03m", width: "2.35m", height: "2.39m", capacity: "67.7 CBM", payload: "25,800 kg" },
                  { type: "40' HC", length: "12.03m", width: "2.35m", height: "2.70m", capacity: "76.3 CBM", payload: "26,330 kg" },
                  { type: "45' HC", length: "13.56m", width: "2.35m", height: "2.70m", capacity: "86.0 CBM", payload: "25,500 kg" },
                  { type: "20' RF", length: "5.46m", width: "2.29m", height: "2.26m", capacity: "28.3 CBM", payload: "21,150 kg" },
                  { type: "40' RF", length: "11.58m", width: "2.29m", height: "2.27m", capacity: "60.1 CBM", payload: "24,810 kg" },
                  { type: "20' OT", length: "5.90m", width: "2.35m", height: "2.35m", capacity: "32.7 CBM", payload: "21,740 kg" },
                  { type: "40' OT", length: "12.03m", width: "2.34m", height: "2.35m", capacity: "66.2 CBM", payload: "26,140 kg" },
                  { type: "20' FR", length: "5.63m", width: "2.21m", height: "2.13m", capacity: "26.5 CBM", payload: "22,110 kg" },
                  { type: "40' FR", length: "11.75m", width: "2.12m", height: "1.97m", capacity: "49.0 CBM", payload: "39,400 kg" },
                ].map((row) => (
                  <tr key={row.type} className="border-b">
                    <td className="py-3 px-4 font-medium">{row.type}</td>
                    <td className="text-center py-3 px-4">{row.length}</td>
                    <td className="text-center py-3 px-4">{row.width}</td>
                    <td className="text-center py-3 px-4">{row.height}</td>
                    <td className="text-center py-3 px-4 text-[var(--ocean)] font-medium">{row.capacity}</td>
                    <td className="text-center py-3 px-4">{row.payload}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Purpose */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is FCL Loadability?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>FCL Loadability</strong> refers to the calculation and optimization of how much cargo can fit 
              into a Full Container Load (FCL) shipment. This involves analyzing both volumetric capacity 
              (how much space cargo occupies) and weight capacity (how heavy the cargo can be).
            </p>
            <p className="text-muted-foreground mt-3">
              Optimizing loadability is crucial for cost efficiency. Under-utilized containers waste money 
              on unused space, while overloading can result in rejected shipments, penalties, or safety hazards. 
              A well-planned load maximizes both space and weight utilization.
            </p>
          </CardContent>
        </Card>

        {/* Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ruler className="h-5 w-5 text-[var(--ocean)]" />
              Key Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Cargo Dimensions:</strong> Length, width, height of each item
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Stackability:</strong> Whether items can be stacked
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Pallet Configuration:</strong> How goods are palletized
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Weight Distribution:</strong> Even weight spread across floor
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Container Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Weight className="h-5 w-5 text-[var(--ocean)]" />
              Container Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Weight-Limited Cargo</p>
                <p className="text-muted-foreground">
                  Heavy, dense cargo (steel, tiles, machinery) - focus on payload capacity
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--logistics)]">Volume-Limited Cargo</p>
                <p className="text-muted-foreground">
                  Light, bulky cargo (cotton, foam, furniture) - focus on CBM capacity
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-amber-500">Balanced Cargo</p>
                <p className="text-muted-foreground">
                  When both volume and weight matter equally - optimize both
                </p>
              </div>
            </div>
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
                High-cube containers give 15% more volume for minimal extra cost
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Euro pallets (120×80cm) fit more efficiently in containers than US pallets
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider "floor load" vs "pallet load" for maximizing weight capacity
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Leave 10cm clearance for dunnage and securing cargo
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use flat racks for oversized cargo that exceeds door dimensions
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
                Ignoring weight limits - leads to overweight penalties or rejected shipments
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting to account for pallet dimensions in calculations
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not considering cargo that needs temperature control
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking door dimensions for large items
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Assuming theoretical CBM equals usable space
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
              <AccordionTrigger>What is the difference between GP and HC containers?</AccordionTrigger>
              <AccordionContent>
                GP (General Purpose) and HC (High Cube) containers differ in height. A standard 40' GP is 2.39m tall 
                internally, while a 40' HC is 2.70m tall - giving about 15% more volume. HC containers cost slightly 
                more but are often worth it for volumetric cargo. The extra height also makes loading easier for 
                certain cargo types.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How many Euro pallets fit in a 40' container?</AccordionTrigger>
              <AccordionContent>
                A standard 40' container can fit approximately 25 Euro pallets (120×80cm) in a single tier. 
                With proper stacking and if cargo allows, you can fit up to 50 pallets in two tiers. 
                However, actual capacity depends on pallet height, weight, and whether goods can be stacked.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What is "broken stowage" and why does it matter?</AccordionTrigger>
              <AccordionContent>
                Broken stowage refers to the unusable space in a container due to irregular cargo shapes, 
                gaps between items, or the need for securing materials. It typically accounts for 5-15% 
                of container capacity. Professional loaders minimize broken stowage through careful planning 
                and mixing different cargo types to fill gaps.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>When should I use a flat rack instead of a standard container?</AccordionTrigger>
              <AccordionContent>
                Flat racks are ideal for cargo that exceeds standard container dimensions: oversized machinery, 
                heavy equipment, vehicles, or items that cannot be loaded through container doors. They have 
                no side walls or roof, allowing loading from above or the sides with cranes. Flat racks are 
                also used for cargo that requires special securing arrangements.
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
            { name: "Container Validator", href: "/tools/ocean-freight/container-validator" },
            { name: "VGM Calculator", href: "/tools/ocean-freight/vgm-calculator" },
            { name: "Demurrage Calculator", href: "/tools/ocean-freight/demurrage-calculator" },
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
