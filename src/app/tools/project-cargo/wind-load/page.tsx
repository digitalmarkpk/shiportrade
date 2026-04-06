import { Metadata } from "next";
import Link from "next/link";
import {
  Wind,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Gauge,
  Ship,
  Zap,
  Calculator,
  Compass,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WindLoadCalculator } from "@/components/tools/WindLoadCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Wind Load Calculator | Shiportrade.com",
  description: "Calculate wind forces on project cargo using Bernoulli's equation. Includes Beaufort scale reference, apparent wind calculation, and lashing force adjustment.",
  keywords: ["wind load calculator", "project cargo wind force", "Bernoulli equation", "Beaufort scale", "apparent wind", "cargo securing"],
  openGraph: {
    title: "Wind Load Calculator - Project Cargo",
    description: "Calculate wind forces on project cargo for safe maritime transport.",
    type: "website",
  },
};

export default function WindLoadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/project-cargo" className="hover:text-foreground">Project Cargo</Link>
        <span>/</span>
        <span className="text-foreground">Wind Load Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Wind className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Wind Load Calculator</h1>
            <p className="text-muted-foreground">Calculate wind forces on project cargo</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <WindLoadCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Wind Load */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Wind Load?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Wind load</strong> is the force exerted by moving air on structures or objects. 
              For maritime cargo, wind load is a critical factor in securing cargo on deck, 
              particularly for project cargo and out-of-gauge shipments.
            </p>
            <p className="text-muted-foreground mt-3">
              The force depends on wind speed, air density, the exposed surface area, 
              and the shape of the cargo. Using Bernoulli&apos;s equation, we can calculate 
              the wind pressure and resulting force on cargo.
            </p>
          </CardContent>
        </Card>

        {/* Bernoulli's Equation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-[var(--ocean)]" />
              Bernoulli&apos;s Equation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg font-mono text-center">
              <p className="text-lg">P = ½ × ρ × v²</p>
              <p className="text-sm mt-2">F = P × A × Cd</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">P</span>
                <span>Wind pressure (Pa)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ρ</span>
                <span>Air density (kg/m³)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">v</span>
                <span>Wind speed (m/s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">A</span>
                <span>Surface area (m²)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cd</span>
                <span>Drag coefficient</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-[var(--ocean)]" />
              Key Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
              <p className="font-medium text-[var(--ocean)]">Wind Speed</p>
              <p className="text-sm text-muted-foreground">Force ∝ speed² (doubling speed = 4× force)</p>
            </div>
            <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
              <p className="font-medium text-[var(--logistics)]">Surface Area</p>
              <p className="text-sm text-muted-foreground">Larger area = more wind force</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <p className="font-medium text-amber-600">Shape Factor</p>
              <p className="text-sm text-muted-foreground">Cd ranges from 0.35 to 1.28</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <p className="font-medium text-purple-600">Apparent Wind</p>
              <p className="text-sm text-muted-foreground">Ship speed affects actual wind</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shape Factors Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Shape Factor (Drag Coefficient) Reference</CardTitle>
          <CardDescription>Drag coefficients for common cargo shapes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Flat Plate/Square", cd: "1.28", note: "Highest drag", example: "Large flat panels" },
              { name: "Cube/Box", cd: "1.05", note: "Standard cargo", example: "Containers, crates" },
              { name: "Vertical Cylinder", cd: "0.82", note: "Moderate", example: "Tanks, silos" },
              { name: "Horizontal Cylinder", cd: "0.60", note: "Lower drag", example: "Pipes, logs" },
              { name: "Sphere", cd: "0.47", note: "Low drag", example: "Pressure vessels" },
              { name: "Angled Surface (45°)", cd: "0.75", note: "Reduced drag", example: "Angled structures" },
              { name: "Streamlined", cd: "0.35", note: "Lowest drag", example: "Aerodynamic shapes" },
              { name: "Complex Structure", cd: "1.20", note: "Variable", example: "Machinery, equipment" },
            ].map((item) => (
              <div key={item.name} className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-lg font-bold text-[var(--ocean)]">Cd = {item.cd}</p>
                <p className="text-xs text-muted-foreground">{item.note}</p>
                <p className="text-xs text-muted-foreground mt-1 italic">{item.example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Apparent Wind Explanation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[var(--ocean)]" />
            Understanding Apparent Wind
          </CardTitle>
          <CardDescription>How ship movement affects the wind experienced by cargo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                <strong>Apparent wind</strong> is the wind experienced by a moving vessel, 
                combining the true wind with the effect of the ship&apos;s own motion through the air.
              </p>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium mb-2">Key Principles:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Headwind: Apparent wind speed increases</li>
                  <li>• Following wind: Apparent wind speed decreases</li>
                  <li>• Beam wind: Direction shifts toward the bow</li>
                  <li>• Faster ships = greater apparent wind effect</li>
                </ul>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-3">Example Calculation</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">True wind:</span>
                  <span>30 knots from bow</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ship speed:</span>
                  <span>15 knots</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-muted-foreground">Apparent wind:</span>
                  <span className="font-bold text-[var(--ocean)]">45 knots</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wind force increase:</span>
                  <span className="font-bold text-[var(--logistics)]">+125%</span>
                </div>
              </div>
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
                Account for worst-case weather along the route
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider apparent wind from ship speed
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use rubber mats to maximize friction benefit
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Apply minimum 1.5x safety factor for lashings
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Calculate for both true and apparent wind
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Include gust factors in calculations (typically 1.2-1.5x)
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
                Ignoring the squared relationship of wind speed
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for ship speed effect on apparent wind
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using incorrect shape factor for cargo geometry
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Assuming constant wind direction throughout voyage
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Neglecting gust effects and weather variations
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Beaufort Scale Quick Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-[var(--ocean)]" />
            Beaufort Scale Quick Reference
          </CardTitle>
          <CardDescription>Wind force classification for maritime operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Force</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-center py-3 px-4">Speed (knots)</th>
                  <th className="text-left py-3 px-4">Cargo Operations</th>
                  <th className="text-left py-3 px-4">Securing Level</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { force: "0-3", desc: "Calm to Gentle Breeze", speed: "0-10", ops: "Normal operations", level: "Standard", color: "#2E8B57" },
                  { force: "4-5", desc: "Moderate to Fresh Breeze", speed: "11-21", ops: "Normal with caution", level: "Enhanced", color: "#84CC16" },
                  { force: "6-7", desc: "Strong Breeze to Near Gale", speed: "22-33", ops: "Restricted operations", level: "Maximum", color: "#F59E0B" },
                  { force: "8-9", desc: "Gale to Strong Gale", speed: "34-47", ops: "Suspended", level: "Shelter required", color: "#EF4444" },
                  { force: "10-12", desc: "Storm to Hurricane", speed: "48+", ops: "Dangerous", level: "Delay departure", color: "#991B1B" },
                ].map((item) => (
                  <tr key={item.force} className="border-b">
                    <td className="py-3 px-4">
                      <Badge style={{ backgroundColor: item.color }} className="text-white">
                        {item.force}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{item.desc}</td>
                    <td className="text-center py-3 px-4">{item.speed}</td>
                    <td className="py-3 px-4">{item.ops}</td>
                    <td className="py-3 px-4">{item.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <AccordionTrigger>Why does wind force increase with the square of speed?</AccordionTrigger>
              <AccordionContent>
                This relationship comes from the physics of kinetic energy. The kinetic energy 
                of moving air is proportional to mass (which increases linearly with speed) 
                times velocity squared. Since wind pressure is related to this kinetic energy, 
                doubling wind speed results in four times the force on cargo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the difference between true wind and apparent wind?</AccordionTrigger>
              <AccordionContent>
                <strong>True wind</strong> is the actual wind experienced by a stationary observer. 
                <strong>Apparent wind</strong> is what you experience on a moving vessel - it&apos;s the 
                vector sum of true wind and the wind created by your own motion. For a ship moving 
                at 15 knots into a 20-knot headwind, the apparent wind would be 35 knots.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I choose the right shape factor?</AccordionTrigger>
              <AccordionContent>
                Select the shape that most closely matches the windward profile of your cargo. 
                For complex shapes, it&apos;s conservative to use a higher coefficient. If cargo has 
                multiple components with different shapes, calculate each separately and sum the forces.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Should I include gust factors in my calculations?</AccordionTrigger>
              <AccordionContent>
                Yes, it&apos;s good practice to include a gust factor, typically 1.2-1.5 times the 
                mean wind speed. Wind gusts can significantly increase peak forces on cargo. 
                The CSS Code recommends considering dynamic effects of wind on cargo securing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What safety factor should I use for wind loads?</AccordionTrigger>
              <AccordionContent>
                Minimum safety factor of 1.5 is recommended per CSS Code guidelines. For heavy 
                weather routes or critical cargo, consider 2.0 or higher. The safety factor 
                accounts for uncertainties in wind speed prediction, shape factor estimation, 
                and equipment condition.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How does deck position affect wind exposure?</AccordionTrigger>
              <AccordionContent>
                On-deck cargo experiences full wind exposure and should use 100% of calculated 
                wind force. Below-deck cargo in cargo holds experiences minimal wind effects. 
                Semi-sheltered positions (behind bulwarks or other cargo) may experience 
                reduced wind loads due to shielding effects.
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
            { name: "OOG Overhang Calculator", href: "/tools/ocean-freight/oog-calculator" },
            { name: "FCL Loadability Engine", href: "/tools/ocean-freight/fcl-loadability" },
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
