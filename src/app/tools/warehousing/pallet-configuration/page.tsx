import { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Package,
  Ruler,
  Weight,
  Grid3X3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PalletConfigurationTool } from "@/components/tools/PalletConfigurationTool";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Pallet Configuration Tool | Shiportrade.com",
  description: "Calculate optimal pallet configuration for your cartons. Find the best stacking pattern, cartons per layer, and layers per pallet with our free pallet configuration tool.",
  keywords: ["pallet configuration", "pallet stacking", "carton arrangement", "pallet utilization", "warehouse optimization", "loading efficiency"],
  openGraph: {
    title: "Pallet Configuration Tool - Optimize Your Loading",
    description: "Calculate optimal pallet configuration with cartons per layer, layers per pallet, and stability checks.",
    type: "website",
  },
};

export default function PalletConfigurationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/warehousing" className="hover:text-foreground">Warehousing</Link>
        <span>/</span>
        <span className="text-foreground">Pallet Configuration</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Layers className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Pallet Configuration Tool</h1>
            <p className="text-muted-foreground">Optimize carton stacking and pallet utilization</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <PalletConfigurationTool />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Pallet Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Pallet Configuration?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Pallet configuration</strong> is the process of arranging cartons on a pallet 
              to maximize space utilization while maintaining stability and safety. Proper 
              configuration reduces shipping costs, minimizes damage, and improves warehouse efficiency.
            </p>
            <p className="text-muted-foreground mt-3">
              Key factors include carton dimensions, weight limits, stacking patterns, and height 
              restrictions for storage or transport. The optimal configuration balances maximum 
              utilization with practical handling requirements.
            </p>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ruler className="h-5 w-5 text-[var(--ocean)]" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Grid3X3 className="h-5 w-5 text-[var(--ocean)]" />
              <div>
                <p className="font-medium">Cartons per Layer</p>
                <p className="text-xs text-muted-foreground">Maximum cartons fitting on pallet deck</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Layers className="h-5 w-5 text-[var(--logistics)]" />
              <div>
                <p className="font-medium">Layers per Pallet</p>
                <p className="text-xs text-muted-foreground">Number of carton tiers based on height</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Weight className="h-5 w-5 text-[var(--ocean)]" />
              <div>
                <p className="font-medium">Total Weight</p>
                <p className="text-xs text-muted-foreground">Combined weight including pallet</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Package className="h-5 w-5 text-[var(--logistics)]" />
              <div>
                <p className="font-medium">Utilization Rate</p>
                <p className="text-xs text-muted-foreground">Percentage of pallet space used</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pallet Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5 text-[var(--ocean)]" />
              Standard Pallet Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-3 h-3 rounded bg-[#0F4C81] mt-1" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Euro Pallet (800×1200mm):</strong> Standard in Europe, 
                  max 1500kg
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-3 h-3 rounded bg-[#2E8B57] mt-1" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">US Standard (48×40 in):</strong> North American 
                  standard, max 2000kg
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-3 h-3 rounded bg-[#F59E0B] mt-1" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Asian Pallet (1100×1100mm):</strong> Japanese 
                  standard, max 1000kg
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Stacking Patterns */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Stacking Patterns Explained</CardTitle>
          <CardDescription>Choose the right pattern for your cargo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Column Stack",
                icon: Grid3X3,
                description: "Direct vertical stacking. Best for heavy cartons with strong corners.",
                pros: "Maximum stability, easy to count",
                cons: "Less interlocking strength"
              },
              {
                name: "Brick Pattern",
                icon: Layers,
                description: "Interlocking like bricks. Each layer offset by half a carton.",
                pros: "Excellent stability, interlocking",
                cons: "Slightly fewer cartons per layer"
              },
              {
                name: "Pinwheel",
                icon: Package,
                description: "Rotated arrangement for square or odd-sized cartons.",
                pros: "Good for mixed sizes, stable",
                cons: "Complex to plan and execute"
              },
              {
                name: "Optimal Mix",
                icon: CheckCircle2,
                description: "AI-recommended pattern based on carton dimensions and constraints.",
                pros: "Maximizes efficiency automatically",
                cons: "May require different patterns per layer"
              },
            ].map((pattern) => {
              const Icon = pattern.icon;
              return (
                <div key={pattern.name} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-[var(--ocean)]" />
                    <p className="font-medium">{pattern.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-[var(--logistics)]">✓ {pattern.pros}</p>
                    <p className="text-destructive">✗ {pattern.cons}</p>
                  </div>
                </div>
              );
            })}
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
                <span>Always check carton stacking strength before increasing layers</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span>Use stretch wrap or strapping for stacks over 1.5m tall</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span>Consider forklift access when planning overhang</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span>Leave 2-3cm gap at top for stretch wrapping clearance</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span>Match pallet type to destination region for easier handling</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span>Test configurations with actual cartons before full implementation</span>
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
                <span>Exceeding pallet weight capacity (can cause collapse)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                <span>Ignoring height limits for racking or containers</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                <span>Allowing excessive overhang without securing cargo</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                <span>Using damaged pallets that compromise stability</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                <span>Stacking cartons beyond their crush strength rating</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                <span>Not accounting for pallet weight in total calculations</span>
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
              <AccordionTrigger>How do I determine the optimal carton orientation?</AccordionTrigger>
              <AccordionContent>
                The tool automatically tests both orientations (length-wise and width-wise) and 
                selects the one that fits more cartons per layer. In some cases, a mixed pattern 
                with different orientations on alternating layers may provide even better results.
                Always prioritize stability over maximizing cartons if safety is a concern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the safe height for pallet stacking?</AccordionTrigger>
              <AccordionContent>
                Safe stacking height depends on several factors: carton strength, weight, 
                stability pattern, and handling equipment. General guidelines: up to 1.8m for 
                standard warehouse racking, up to 2.4m for high-bay systems, and up to 2.59m 
                for high-cube containers. For manual handling, keep under 1.5m for safety. 
                Always use stretch wrap for stacks over 1.5m.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can I mix different carton sizes on one pallet?</AccordionTrigger>
              <AccordionContent>
                While possible, mixing carton sizes on one pallet is generally not recommended 
                because it reduces stability and makes handling more complex. If necessary, place 
                larger, heavier cartons at the bottom and ensure the top surface remains flat. 
                For mixed shipments, consider using separate pallets for each carton type.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How much overhang is acceptable?</AccordionTrigger>
              <AccordionContent>
                Standard practice is to avoid overhang completely. If unavoidable, limit overhang 
                to 5% of carton width on each side maximum. Any overhang requires additional 
                securing with stretch wrap or strapping. Overhanging cartons are more prone to 
                damage and can create handling difficulties. Some carriers may reject pallets 
                with excessive overhang.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What affects pallet stability score?</AccordionTrigger>
              <AccordionContent>
                The stability score considers: aspect ratio of cartons (long thin boxes are less 
                stable), stack height relative to base dimensions, total weight versus pallet 
                capacity, and floor coverage percentage. A score above 75% indicates a stable 
                configuration. Lower scores suggest the need for additional securing measures 
                or configuration changes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How do I account for pallet weight in shipping costs?</AccordionTrigger>
              <AccordionContent>
                A standard wooden pallet weighs approximately 20-25kg, while plastic pallets 
                range from 15-20kg. Always include pallet weight in your total weight calculations 
                for freight costing. This tool adds 25kg for the pallet in total weight. If using 
                heavier pallets or additional packaging materials, adjust accordingly in your 
                freight calculations.
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
            { name: "CBM Calculator", href: "/tools/warehousing/cbm-calculator" },
            { name: "Container Load Calculator", href: "/tools/ocean-freight/container-loading" },
            { name: "FCL Loadability Engine", href: "/tools/ocean-freight/fcl-loadability" },
            { name: "Warehousing Cost Calculator", href: "/tools/warehousing/cost-calculator" },
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
