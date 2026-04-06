import { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Weight,
  Shield,
  Zap,
  Box,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CenterOfGravityFinder } from "@/components/tools/CenterOfGravityFinder";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Center of Gravity Finder | Shiportrade.com",
  description: "Calculate the center of gravity for project cargo and heavy lift shipments. Determine optimal lifting points, stability analysis, and tipping angles.",
  keywords: ["center of gravity calculator", "CoG finder", "project cargo", "heavy lift", "lifting points", "stability analysis", "tipping angle"],
  openGraph: {
    title: "Center of Gravity Finder - Project Cargo",
    description: "Calculate center of gravity, stability, and optimal lifting points for project cargo shipments.",
    type: "website",
  },
};

export default function CenterOfGravityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/project-cargo" className="hover:text-foreground">Project Cargo</Link>
        <span>/</span>
        <span className="text-foreground">Center of Gravity Finder</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Target className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Center of Gravity Finder</h1>
            <p className="text-muted-foreground">Calculate CoG, stability, and optimal lifting points</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <CenterOfGravityFinder />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is CoG */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Center of Gravity?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              The <strong>Center of Gravity (CoG)</strong> is the imaginary point at which the total
              weight of a body is assumed to be concentrated. For practical purposes, it is the
              point at which the object would balance perfectly if placed on a single support.
            </p>
            <p className="text-muted-foreground mt-3">
              In project cargo and heavy lift operations, knowing the exact CoG location is
              critical for safe lifting, transport, and cargo securing operations. An incorrectly
              calculated CoG can lead to cargo damage, equipment failure, or serious accidents.
            </p>
          </CardContent>
        </Card>

        {/* Why it Matters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-[var(--ocean)]" />
              Why CoG Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Crane Operations</p>
                <p className="text-sm text-muted-foreground">
                  Hook must be positioned directly above CoG for stable lifting
                </p>
              </div>
              <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
                <p className="font-medium text-[var(--logistics)]">Transport Stability</p>
                <p className="text-sm text-muted-foreground">
                  Lower CoG means better stability on trucks, ships, and rail
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <p className="font-medium text-amber-600">Tipping Prevention</p>
                <p className="text-sm text-muted-foreground">
                  CoG position determines tipping angles during handling
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formula */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Box className="h-5 w-5 text-[var(--ocean)]" />
              Calculation Formula
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm space-y-2">
              <p className="text-[var(--ocean)]"># For multiple cargo pieces:</p>
              <p>X = Σ(mᵢ × xᵢ) / Σmᵢ</p>
              <p>Y = Σ(mᵢ × yᵢ) / Σmᵢ</p>
              <p>Z = Σ(mᵢ × zᵢ) / Σmᵢ</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Where mᵢ is the mass of each piece and xᵢ, yᵢ, zᵢ are the center coordinates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tipping Angle Explanation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-[var(--ocean)]" />
            Understanding Tipping Angles
          </CardTitle>
          <CardDescription>How tipping angles are calculated and what they mean</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The <strong>tipping angle</strong> is the maximum angle at which cargo can be tilted
                before it becomes unstable and tips over. It is determined by the relationship between
                the CoG height and the base dimensions.
              </p>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium mb-2">Formula:</p>
                <p className="font-mono">θ = arctan(base/2 ÷ CoG_height)</p>
              </div>
              <p className="text-sm text-muted-foreground">
                A higher CoG results in a smaller tipping angle, meaning the cargo is less stable
                and requires more careful handling.
              </p>
            </div>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded bg-[var(--logistics)]" />
                  <span className="font-medium">Excellent (≥30°)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Very stable - safe for standard handling operations
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded bg-amber-500" />
                  <span className="font-medium">Marginal (20-30°)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requires caution - additional securing may be needed
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded bg-destructive" />
                  <span className="font-medium">Critical (&lt;20°)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  High risk - special precautions required
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Guidelines */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--ocean)]" />
            Lifting Safety Guidelines
          </CardTitle>
          <CardDescription>Best practices for safe lifting operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="w-10 h-10 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center mb-3">
                <span className="font-bold text-[var(--ocean)]">1</span>
              </div>
              <p className="font-medium mb-1">Verify CoG Position</p>
              <p className="text-sm text-muted-foreground">
                Confirm calculated CoG matches actual cargo characteristics
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="w-10 h-10 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center mb-3">
                <span className="font-bold text-[var(--ocean)]">2</span>
              </div>
              <p className="font-medium mb-1">Position Hook Correctly</p>
              <p className="text-sm text-muted-foreground">
                Crane hook must be directly above the CoG for stable lift
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="w-10 h-10 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center mb-3">
                <span className="font-bold text-[var(--ocean)]">3</span>
              </div>
              <p className="font-medium mb-1">Test Lift First</p>
              <p className="text-sm text-muted-foreground">
                Perform short test lift to verify balance before full operation
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="w-10 h-10 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center mb-3">
                <span className="font-bold text-[var(--ocean)]">4</span>
              </div>
              <p className="font-medium mb-1">Use Adequate Rigging</p>
              <p className="text-sm text-muted-foreground">
                Select slings and equipment with proper SWL ratings
              </p>
            </div>
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
                Measure dimensions and weights as accurately as possible
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider non-uniform weight distribution in complex cargo
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Add a safety margin to calculated CoG height for unknowns
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Document CoG position on cargo for future reference
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use tilt test to verify theoretical calculations when possible
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider dynamic forces during lifting and transport
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
                Assuming geometric center equals CoG
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring the effect of accessories and attachments
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for liquids or shifting contents
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using manufacturer specs without verification
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Neglecting CoG height in stability assessment
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking asymmetric loading in multi-piece cargo
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
              <AccordionTrigger>How do I find the CoG of an irregularly shaped object?</AccordionTrigger>
              <AccordionContent>
                For irregularly shaped objects, the CoG can be found through:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Balance method:</strong> Balance the object on a knife-edge in multiple directions</li>
                  <li><strong>Suspension method:</strong> Suspend the object from different points; CoG lies on the vertical line through each suspension point</li>
                  <li><strong>Calculation:</strong> Divide the object into regular shapes, calculate each CoG, then find the weighted average</li>
                </ul>
                For complex project cargo, combining calculation with physical verification is recommended.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What happens if the crane hook is not above the CoG?</AccordionTrigger>
              <AccordionContent>
                When the crane hook is not positioned directly above the CoG, the cargo will:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Rotate</strong> during lifting until CoG is below the hook</li>
                  <li><strong>Swing</strong> unexpectedly, posing danger to personnel and equipment</li>
                  <li><strong>Create shock loads</strong> when it settles, potentially exceeding rigging capacity</li>
                </ul>
                This is why a test lift is always recommended before the full lift.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How does CoG height affect transport stability?</AccordionTrigger>
              <AccordionContent>
                CoG height directly impacts transport stability:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Higher CoG</strong> = smaller tipping angle = less stable during acceleration, braking, and cornering</li>
                  <li><strong>Lower CoG</strong> = larger tipping angle = more stable during transport</li>
                  <li>Vessel motions (rolling, pitching) create additional dynamic forces proportional to CoG height</li>
                  <li>For maritime transport, CoG height affects lashing requirements and positioning on board</li>
                </ul>
                Where possible, orient cargo to minimize CoG height for transport.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What is the difference between CoG and center of mass?</AccordionTrigger>
              <AccordionContent>
                In a uniform gravitational field (like Earth&apos;s surface), the <strong>center of gravity</strong> and
                <strong> center of mass</strong> are at the same location. However:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Center of Mass:</strong> The weighted average position of all mass in an object</li>
                  <li><strong>Center of Gravity:</strong> The point where gravity&apos;s total force acts</li>
                </ul>
                For project cargo calculations on Earth, the terms are used interchangeably. The difference only
                matters in non-uniform gravitational fields (extremely large objects or in space).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How do I handle cargo with shifting contents?</AccordionTrigger>
              <AccordionContent>
                For cargo containing liquids or materials that can shift:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Calculate CoG in the <strong>worst-case position</strong> (highest CoG scenario)</li>
                  <li>Consider using baffles, partitions, or securing methods to prevent shifting</li>
                  <li>Account for <strong>free surface effect</strong> in tanks which reduces stability</li>
                  <li>Document assumptions about contents position in the cargo plan</li>
                </ul>
                Always apply conservative safety factors when contents may shift during transport.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>What safety factors should I use for CoG calculations?</AccordionTrigger>
              <AccordionContent>
                Recommended safety factors for CoG calculations:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Standard cargo:</strong> Add 5-10% to calculated CoG height</li>
                  <li><strong>Complex/unknown distribution:</strong> Add 15-20% to CoG height</li>
                  <li><strong>Critical lifts:</strong> Use 2.0 safety factor for rigging calculations</li>
                  <li><strong>Dynamic conditions:</strong> Account for acceleration forces (typically 0.5-1.0g)</li>
                </ul>
                Always err on the conservative side, especially when actual weight distribution is uncertain.
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
            { name: "Lashing Force Calculator", href: "/tools/project-cargo/lashing-force", icon: "🔗" },
            { name: "OOG Overhang Calculator", href: "/tools/ocean-freight/oog-calculator", icon: "📦" },
            { name: "FCL Loadability Engine", href: "/tools/ocean-freight/fcl-loadability", icon: "🚢" },
            { name: "Axle Load Calculator", href: "/tools/road-rail/axle-load", icon: "🚛" },
          ].map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-all hover:border-[var(--ocean)]/50 cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tool.icon}</span>
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
