import { Metadata } from "next";
import Link from "next/link";
import {
  Truck,
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
  Package,
  Layers,
  Scale,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadPlanningOptimizer } from "@/components/tools/LoadPlanningOptimizer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Load Planning Optimizer | Shiportrade.com",
  description: "Optimize truck and container loading with 3D visualization, weight distribution analysis, and cargo compatibility checks for efficient logistics planning.",
  keywords: ["load planning", "container loading", "truck loading", "cargo optimization", "weight distribution", "load sequence"],
  openGraph: {
    title: "Load Planning Optimizer - Smart Cargo Loading",
    description: "Maximize your transport efficiency with advanced load planning and 3D visualization.",
    type: "website",
  },
};

export default function LoadPlanningPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/warehousing" className="hover:text-foreground">Warehousing</Link>
        <span>/</span>
        <span className="text-foreground">Load Planning Optimizer</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Truck className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Load Planning Optimizer</h1>
            <p className="text-muted-foreground">Intelligent cargo loading optimization with 3D visualization</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
            <Zap className="h-3 w-3 mr-1" /> AI Powered
          </Badge>
        </div>
      </div>

      {/* Tool Component */}
      <LoadPlanningOptimizer />

      <Separator className="my-12" />

      {/* Vehicle Types Reference */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[var(--ocean)]" />
            Vehicle & Container Types Reference
          </CardTitle>
          <CardDescription>Standard specifications for transport planning</CardDescription>
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
                  { type: "Small Truck (3.5t)", length: "4.2m", width: "2.0m", height: "2.2m", capacity: "18.5 m³", payload: "3,500 kg" },
                  { type: "Medium Truck (7.5t)", length: "6.0m", width: "2.4m", height: "2.5m", capacity: "36.0 m³", payload: "7,500 kg" },
                  { type: "Large Truck (18t)", length: "8.5m", width: "2.5m", height: "2.7m", capacity: "57.4 m³", payload: "18,000 kg" },
                  { type: "Semi-Trailer (40t)", length: "13.6m", width: "2.48m", height: "2.7m", capacity: "91.0 m³", payload: "28,000 kg" },
                  { type: "20' GP Container", length: "5.90m", width: "2.35m", height: "2.39m", capacity: "33.2 m³", payload: "21,700 kg" },
                  { type: "40' GP Container", length: "12.03m", width: "2.35m", height: "2.39m", capacity: "67.7 m³", payload: "25,800 kg" },
                  { type: "40' HC Container", length: "12.03m", width: "2.35m", height: "2.70m", capacity: "76.3 m³", payload: "26,330 kg" },
                  { type: "45' HC Container", length: "13.56m", width: "2.35m", height: "2.70m", capacity: "86.0 m³", payload: "25,500 kg" },
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
              What is Load Planning?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Load Planning</strong> is the strategic process of arranging cargo within a transport vehicle 
              to maximize space utilization, ensure weight distribution balance, and optimize loading/unloading 
              efficiency. It considers physical constraints, cargo compatibility, and operational requirements.
            </p>
            <p className="text-muted-foreground mt-3">
              Effective load planning reduces transportation costs, prevents damage during transit, 
              ensures regulatory compliance, and improves supply chain efficiency. It&apos;s essential 
              for both LTL (Less Than Truckload) and FTL (Full Truckload) operations.
            </p>
          </CardContent>
        </Card>

        {/* Key Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ruler className="h-5 w-5 text-[var(--ocean)]" />
              Key Optimization Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Volume Utilization:</strong> Maximize space efficiency
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Weight Distribution:</strong> Balance front/rear and left/right
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Cargo Compatibility:</strong> Safe placement of different goods
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Load Sequence:</strong> Efficient loading order
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Stackability:</strong> Safe stacking of items
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Cargo Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-[var(--ocean)]" />
              Cargo Type Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Fragile Goods</p>
                <p className="text-muted-foreground">
                  Place on top, avoid stacking, secure with padding
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--logistics)]">Heavy Items</p>
                <p className="text-muted-foreground">
                  Load first at bottom, distribute weight evenly
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-red-500">Hazardous Materials</p>
                <p className="text-muted-foreground">
                  Segregate from other cargo, follow regulations
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
              Pro Tips for Load Planning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Load heavy items at the bottom and distribute evenly across the floor
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Place high-priority items last for easy access at destination
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Keep hazardous materials away from food and fragile items
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use load bars and straps to prevent shifting during transit
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider unloading sequence when planning load order
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Leave space for dunnage and securing materials
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Load Planning Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring weight distribution leads to unsafe handling and axle overload
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Placing fragile items at the bottom or under heavy cargo
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Mixing incompatible cargo (chemicals with food products)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overloading beyond legal weight limits
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for dimensional weight in cost calculations
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting to secure cargo properly for the journey
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
              <AccordionTrigger>How is weight distribution calculated?</AccordionTrigger>
              <AccordionContent>
                Weight distribution is calculated by analyzing the position of each cargo item relative to 
                the vehicle&apos;s center points. We calculate front/rear balance by dividing the cargo space 
                lengthwise and summing weights on each side. Similarly, left/right balance is calculated 
                by dividing the width. Ideal distribution is within 10-15% of 50/50 for both axes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the optimal loading sequence?</AccordionTrigger>
              <AccordionContent>
                The optimal loading sequence follows these principles: 1) Load heavy items first at the bottom, 
                2) Place low-priority items first (they&apos;ll be at the back), 3) Load high-priority items last 
                for easy access, 4) Position fragile items on top and secure them, 5) Ensure hazardous materials 
                are properly segregated. This sequence maximizes safety and efficiency at both loading and unloading.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How does cargo compatibility checking work?</AccordionTrigger>
              <AccordionContent>
                Our compatibility checker analyzes cargo types to identify potential conflicts: hazardous materials 
                that must be segregated, fragile items that need protection, temperature-sensitive goods, and items 
                with stacking restrictions. The system flags warnings for items that shouldn&apos;t be placed together 
                and errors for dangerous combinations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What is the difference between volume and weight utilization?</AccordionTrigger>
              <AccordionContent>
                Volume utilization measures how much of the available space (m³) is filled, while weight utilization 
                measures how much of the maximum payload (kg) is used. A load can be volume-limited (full of space 
                but under weight limit) or weight-limited (at weight limit but with empty space). Understanding both 
                helps optimize transport costs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>Why is 3D visualization important for load planning?</AccordionTrigger>
              <AccordionContent>
                3D visualization helps planners understand spatial relationships between cargo items, identify 
                potential conflicts, and verify that items fit within the vehicle dimensions. It allows you to 
                see potential issues like items blocking access, unstable stacking, or unused space that could 
                accommodate more cargo. This visual approach reduces errors and improves planning accuracy.
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
            { name: "Pallet Configuration", href: "/tools/warehousing/pallet-configuration", icon: Layers },
            { name: "CBM Calculator", href: "/tools/ocean-freight/cbm-calculator", icon: Box },
            { name: "Container Loading", href: "/tools/ocean-freight/container-loading", icon: Package },
            { name: "Axle Load Calculator", href: "/tools/road-rail/axle-load", icon: Scale },
          ].map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-all hover:border-[var(--ocean)]/50 cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <tool.icon className="h-4 w-4 text-muted-foreground group-hover:text-[var(--ocean)] transition-colors" />
                    <span className="font-medium group-hover:text-[var(--ocean)] transition-colors">
                      {tool.name}
                    </span>
                  </div>
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
