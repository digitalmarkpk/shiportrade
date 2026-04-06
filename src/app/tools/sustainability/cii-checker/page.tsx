import { Metadata } from "next";
import Link from "next/link";
import {
  Gauge,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Ship,
  Target,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CIIChecker } from "@/components/tools/CIIChecker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "CII Checker - Carbon Intensity Indicator | Shiportrade.com",
  description: "Check ship Carbon Intensity Indicator (CII) rating according to IMO regulations. Calculate CII values and compliance status for vessels.",
  keywords: ["CII checker", "carbon intensity indicator", "IMO CII", "ship carbon rating", "vessel CII calculator"],
  openGraph: {
    title: "CII Checker - IMO Carbon Intensity Rating",
    description: "Calculate and check vessel CII ratings for IMO compliance.",
    type: "website",
  },
};

export default function CIICheckerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/sustainability" className="hover:text-foreground">Sustainability</Link>
        <span>/</span>
        <span className="text-foreground">CII Checker</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--logistics)]/10 flex items-center justify-center">
            <Gauge className="h-6 w-6 text-[var(--logistics)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">CII Checker</h1>
            <p className="text-muted-foreground">IMO Carbon Intensity Indicator rating calculator</p>
          </div>
        </div>
        <Badge className="gradient-logistics text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <CIIChecker />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is CII */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--logistics)]" />
              What is CII?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Carbon Intensity Indicator (CII)</strong> is a measure of a ship's carbon 
              efficiency, expressed in grams of CO2 emitted per cargo-carrying capacity and 
              nautical mile. It's mandatory under IMO's MARPOL Annex VI for ships of 5,000 GT 
              and above engaged in international voyages.
            </p>
            <p className="text-muted-foreground mt-3">
              Ships receive an annual rating from A (best) to E (worst) based on their CII 
              performance relative to reference lines. The required CII level becomes more 
              stringent each year, with a 20% reduction target by 2030 compared to 2019.
            </p>
          </CardContent>
        </Card>

        {/* Rating Scale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gauge className="h-5 w-5 text-[var(--logistics)]" />
              Rating Scale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { rating: "A", color: "#22C55E", label: "Superior", threshold: "≤86%" },
              { rating: "B", color: "#84CC16", label: "Good", threshold: "≤94%" },
              { rating: "C", color: "#EAB308", label: "Moderate", threshold: "≤106%" },
              { rating: "D", color: "#F97316", label: "Lower", threshold: "≤118%" },
              { rating: "E", color: "#EF4444", label: "Inferior", threshold: ">118%" },
            ].map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: item.color }}
                >
                  {item.rating}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.threshold} of reference</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[var(--logistics)]" />
              Compliance Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>A-C Rating:</strong> Compliant, no action required
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>D Rating:</strong> 3-year limit, then corrective plan needed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>E Rating:</strong> Immediate corrective action plan required
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Documentation:</strong> SEEMP Part III required for all ships
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* IMO Timeline */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>IMO CII Reduction Targets</CardTitle>
          <CardDescription>Annual reduction requirements for reference lines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { year: "2019-2022", reduction: "1-3%", status: "completed" },
              { year: "2023", reduction: "5%", status: "completed" },
              { year: "2024", reduction: "7%", status: "current" },
              { year: "2025", reduction: "9%", status: "upcoming" },
              { year: "2026-2029", reduction: "11-17%", status: "upcoming" },
              { year: "2030", reduction: "20%", status: "target" },
            ].map((item) => (
              <div 
                key={item.year} 
                className={`p-4 rounded-lg text-center ${
                  item.status === "completed" ? "bg-muted/50" :
                  item.status === "current" ? "bg-[var(--ocean)]/10 border-2 border-[var(--ocean)]" :
                  item.status === "target" ? "bg-[var(--logistics)]/10 border border-[var(--logistics)]" :
                  "bg-muted/30"
                }`}
              >
                <p className="text-sm font-medium">{item.year}</p>
                <p className={`text-lg font-bold ${
                  item.status === "current" ? "text-[var(--ocean)]" :
                  item.status === "target" ? "text-[var(--logistics)]" : ""
                }`}>
                  {item.reduction}
                </p>
                {item.status === "current" && (
                  <Badge className="bg-[var(--ocean)] mt-1">Current</Badge>
                )}
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
                Start monitoring CII early - reference lines tighten every year
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Slow steaming is the fastest way to improve CII rating
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider charter party clauses that share CII improvement benefits
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use voyage optimization software to reduce fuel consumption
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Plan hull cleaning schedule around CII critical periods
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
                Not preparing SEEMP Part III in time
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring CII until rating drops to D or E
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Focusing only on fuel efficiency, ignoring operational factors
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not considering CII in charter negotiations
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Underestimating impact of waiting times and port congestion
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
              <AccordionTrigger>Which ships need to comply with CII regulations?</AccordionTrigger>
              <AccordionContent>
                CII requirements apply to ships of 5,000 gross tonnage (GT) and above that 
                engage in international voyages. This includes bulk carriers, gas carriers, 
                tankers, container ships, general cargo ships, refrigerated cargo carriers, 
                combination carriers, LNG carriers, ro-ro passenger ships, and ro-ro cargo ships.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What happens if my ship gets a D or E rating?</AccordionTrigger>
              <AccordionContent>
                Ships rated D for three consecutive years must develop a corrective action plan 
                as part of their SEEMP. Ships rated E for a single year must immediately develop 
                a corrective action plan. The plan must be approved by the ship's flag 
                administration or recognized organization and include specific measures to 
                achieve at least a C rating in subsequent years.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How is CII calculated?</AccordionTrigger>
              <AccordionContent>
                CII = CO2 Emissions / (Capacity × Distance). CO2 emissions are calculated from 
                fuel consumption using conversion factors. Capacity is typically deadweight 
                tonnage (DWT) or gross tonnage (GT). Distance is the actual nautical miles 
                traveled. The formula yields grams of CO2 per cargo-carrying capacity-nautical mile.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Can charterers affect a ship's CII rating?</AccordionTrigger>
              <AccordionContent>
                Yes, charterers significantly impact CII through voyage instructions, cargo 
                requirements, and schedule demands. Charter parties increasingly include CII 
                clauses requiring charterers to consider vessel efficiency in routing and 
                scheduling decisions. Owners may seek compensation for CII degradation caused 
                by charterer orders, such as high-speed requirements or inefficient routing.
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
            { name: "Carbon Footprint Calculator", href: "/tools/sustainability/carbon-footprint" },
            { name: "Carbon Tax Impact Model", href: "/tools/sustainability/carbon-tax" },
            { name: "Marine Insurance Premium", href: "/tools/insurance/marine-premium" },
            { name: "Transit Time Estimator", href: "/tools/ocean-freight/transit-time" },
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
