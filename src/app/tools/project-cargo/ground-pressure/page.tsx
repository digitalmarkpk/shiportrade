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
  Weight,
  Gauge,
  Shield,
  Square,
  Construction,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GroundPressureCalculator } from "@/components/tools/GroundPressureCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Ground Pressure Calculator | Shiportrade.com",
  description: "Calculate ground pressure for heavy lift operations. Compare against ground bearing capacity, determine outrigger pad sizing, and assess ground failure risk.",
  keywords: ["ground pressure calculator", "outrigger pad sizing", "bearing capacity", "heavy lift", "crane ground pressure", "project cargo"],
  openGraph: {
    title: "Ground Pressure Calculator - Heavy Lift Operations",
    description: "Calculate ground pressure, pad sizing, and assess ground failure risk for heavy lift operations.",
    type: "website",
  },
};

export default function GroundPressurePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/project-cargo" className="hover:text-foreground">Project Cargo</Link>
        <span>/</span>
        <span className="text-foreground">Ground Pressure Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Layers className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Ground Pressure Calculator</h1>
            <p className="text-muted-foreground">Calculate ground bearing pressure for heavy lift operations</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <GroundPressureCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Ground Pressure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Ground Pressure?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Ground pressure</strong> is the force exerted by a load distributed over the contact
              area with the ground. In heavy lift operations, excessive ground pressure can cause
              ground failure, leading to equipment instability, cargo damage, and serious safety hazards.
            </p>
            <p className="text-muted-foreground mt-3">
              Managing ground pressure is critical for crane operations, heavy transport, and
              project cargo handling. The goal is to ensure that the applied pressure remains
              below the ground&apos;s bearing capacity with an appropriate safety margin.
            </p>
          </CardContent>
        </Card>

        {/* Key Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gauge className="h-5 w-5 text-[var(--ocean)]" />
              Key Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Total Load</p>
                <p className="text-sm text-muted-foreground">Cargo weight + rigging + equipment</p>
              </div>
              <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
                <p className="font-medium text-[var(--logistics)]">Contact Area</p>
                <p className="text-sm text-muted-foreground">Pad size and load spread factor</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <p className="font-medium text-amber-600">Ground Capacity</p>
                <p className="text-sm text-muted-foreground">Bearing capacity of soil/substrate</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <p className="font-medium text-purple-600">Load Distribution</p>
                <p className="text-sm text-muted-foreground">How weight spreads across supports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-[var(--ocean)]" />
              Safety Standards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>1.5x:</strong> Minimum safety factor per ASME/OSHA
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>2.0x:</strong> Industry recommended standard
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>2.5-3.0x:</strong> For critical or high-risk operations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Always verify actual ground conditions before lifting
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Ground Types Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ground Bearing Capacity Reference</CardTitle>
          <CardDescription>Typical values for different ground conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Ground Type</th>
                  <th className="text-center py-3 px-4">Capacity (psi)</th>
                  <th className="text-center py-3 px-4">Capacity (kg/cm²)</th>
                  <th className="text-center py-3 px-4">Risk Level</th>
                  <th className="text-left py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Soft Clay/Silt", psi: "3-8", kgCm2: "0.2-0.6", risk: "High", color: "#EF4444", notes: "Requires extensive preparation" },
                  { type: "Firm Clay", psi: "10-20", kgCm2: "0.7-1.4", risk: "Medium", color: "#F97316", notes: "May need ground improvement" },
                  { type: "Loose Sand", psi: "8-15", kgCm2: "0.6-1.0", risk: "Medium-High", color: "#F59E0B", notes: "Can settle under load" },
                  { type: "Dense Sand/Gravel", psi: "25-40", kgCm2: "1.8-2.8", risk: "Low", color: "#22C55E", notes: "Good for most operations" },
                  { type: "Compacted Fill", psi: "20-30", kgCm2: "1.4-2.1", risk: "Low-Medium", color: "#2E8B57", notes: "Must be properly engineered" },
                  { type: "Concrete/Paved", psi: "40-100", kgCm2: "2.8-7.0", risk: "Very Low", color: "#0F4C81", notes: "Verify slab thickness" },
                  { type: "Bedrock", psi: "80-200", kgCm2: "5.6-14.0", risk: "Very Low", color: "#6366F1", notes: "Excellent for all operations" },
                  { type: "Crushed Stone Base", psi: "30-45", kgCm2: "2.1-3.2", risk: "Low", color: "#8B5CF6", notes: "Good drainage & distribution" },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.type}</td>
                    <td className="text-center py-3 px-4">{item.psi}</td>
                    <td className="text-center py-3 px-4">{item.kgCm2}</td>
                    <td className="text-center py-3 px-4">
                      <Badge
                        variant="outline"
                        style={{ borderColor: item.color, color: item.color }}
                      >
                        {item.risk}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * Values are typical ranges. Actual bearing capacity should be determined by geotechnical investigation.
          </p>
        </CardContent>
      </Card>

      {/* Outrigger Pad Types */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Square className="h-5 w-5 text-[var(--ocean)]" />
            Outrigger Pad Types
          </CardTitle>
          <CardDescription>Common pad types and their load distribution characteristics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: "Steel Plate", thickness: "25mm", spread: "1.0x", desc: "Standard, minimal spread" },
              { name: "Timber Mat", thickness: "150mm", spread: "1.5x", desc: "Good load distribution" },
              { name: "Composite Pad", thickness: "75mm", spread: "1.8x", desc: "HDPE, excellent spread" },
              { name: "Steel Box Pad", thickness: "300mm", spread: "2.0x", desc: "Maximum distribution" },
              { name: "Aluminum Spreader", thickness: "100mm", spread: "1.6x", desc: "Lightweight option" },
            ].map((pad) => (
              <div key={pad.name} className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">{pad.name}</p>
                <p className="text-xs text-muted-foreground">{pad.thickness}</p>
                <p className="text-lg font-bold text-[var(--ocean)] mt-2">{pad.spread}</p>
                <p className="text-xs text-muted-foreground">Load spread factor</p>
                <p className="text-xs text-muted-foreground mt-2">{pad.desc}</p>
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
                Always conduct a site survey before heavy lift operations
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use composite or timber pads for better load distribution on weak ground
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Account for uneven loading - worst case outrigger carries more load
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Check for underground utilities before positioning outriggers
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Monitor ground conditions during operation, especially after rain
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider seasonal variations in ground strength (frost, drought)
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
                Assuming all concrete has equal bearing capacity
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring load distribution variations between outriggers
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using minimum safety factor for critical lifts
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for ground preparation needs
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking underground services or voids
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Neglecting to monitor settlement during operation
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Ground Preparation Methods */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-[var(--ocean)]" />
            Ground Preparation Methods
          </CardTitle>
          <CardDescription>Techniques for improving ground bearing capacity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Surface Treatment</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Steel plates over timber mats</li>
                <li>• Crane mats or composite pads</li>
                <li>• Temporary roadways (trackway)</li>
                <li>• Compacted granular fill</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Ground Improvement</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Soil compaction/densification</li>
                <li>• Geotextile reinforcement</li>
                <li>• Stone columns or piers</li>
                <li>• Grouting or soil mixing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Structural Solutions</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Temporary pile foundations</li>
                <li>• Concrete pad construction</li>
                <li>• Structural steel grillage</li>
                <li>• Load-spreading frames</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What is the minimum safety factor for ground pressure?</AccordionTrigger>
              <AccordionContent>
                <strong>1.5x</strong> is the minimum safety factor per ASME B30.5 and OSHA standards.
                However, <strong>2.0x</strong> is the industry-recommended standard for most operations.
                Higher factors (2.5-3.0x) should be used for critical lifts, uncertain ground conditions,
                or operations near sensitive structures.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How do I determine ground bearing capacity?</AccordionTrigger>
              <AccordionContent>
                Ground bearing capacity should be determined by a geotechnical engineer through
                site investigation. Methods include:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Standard Penetration Test (SPT)</li>
                  <li>Cone Penetration Test (CPT)</li>
                  <li>Plate load testing</li>
                  <li>Soil boring and laboratory analysis</li>
                </ul>
                For preliminary estimates, use reference values from soil classification,
                but always verify with actual testing before heavy lift operations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What is load spread factor and why does it matter?</AccordionTrigger>
              <AccordionContent>
                The <strong>load spread factor</strong> indicates how effectively an outrigger pad
                distributes the load into the ground. A higher factor means the load is spread over
                a larger effective area, reducing ground pressure. For example:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Steel plates have minimal spread (1.0x)</li>
                  <li>Timber mats provide moderate spread (1.5x)</li>
                  <li>Composite pads offer excellent spread (1.8x)</li>
                  <li>Steel box pads with timber fill provide maximum spread (2.0x)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How do I size outrigger pads correctly?</AccordionTrigger>
              <AccordionContent>
                To size outrigger pads correctly:
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Determine the maximum load per outrigger (consider worst-case loading)</li>
                  <li>Identify ground bearing capacity at the work site</li>
                  <li>Select target safety factor (minimum 1.5x, preferably 2.0x)</li>
                  <li>Calculate required area: Area = Load ÷ (Capacity ÷ Safety Factor)</li>
                  <li>Account for pad type load spread factor</li>
                </ol>
                Always round up to the next available pad size and verify calculations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What are signs of ground failure?</AccordionTrigger>
              <AccordionContent>
                Signs of potential ground failure include:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Visible settlement or sinking of outrigger pads</li>
                  <li>Ground cracking around the loaded area</li>
                  <li>Heaving or bulging of surrounding ground</li>
                  <li>Crane level indicator showing tilt</li>
                  <li>Unusual sounds (creaking, popping)</li>
                </ul>
                If any signs are observed, stop operations immediately and reassess ground conditions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How does weather affect ground bearing capacity?</AccordionTrigger>
              <AccordionContent>
                Weather significantly impacts ground bearing capacity:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Rain:</strong> Saturated soil has reduced capacity (can drop 30-50%)</li>
                  <li><strong>Frost:</strong> Frozen ground appears stronger but can fail suddenly during thaw</li>
                  <li><strong>Drought:</strong> Clay soils may crack and lose cohesion</li>
                  <li><strong>Freeze-thaw cycles:</strong> Can create weak zones and voids</li>
                </ul>
                Always reassess ground conditions after significant weather events.
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
            { name: "Lashing Force Calculator", href: "/tools/project-cargo/lashing-force" },
            { name: "Center of Gravity Finder", href: "/tools/project-cargo/cog-finder" },
            { name: "Wind Load Calculator", href: "/tools/project-cargo/wind-load" },
            { name: "Axle Load Distribution", href: "/tools/road-rail/axle-load" },
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
