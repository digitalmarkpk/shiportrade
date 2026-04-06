import { Metadata } from "next";
import Link from "next/link";
import {
  Plane,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VolumetricWeightCalculator } from "@/components/tools/VolumetricWeightCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Volumetric Weight Calculator - Air Freight | Shiportrade.com",
  description: "Calculate volumetric weight and chargeable weight for air freight shipments. Free tool supporting DHL, FedEx, UPS, and IATA standards.",
  keywords: ["volumetric weight calculator", "air freight calculator", "chargeable weight", "dimensional weight"],
};

export default function VolumetricWeightPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/air-freight" className="hover:text-foreground">Air Freight</Link>
        <span>/</span>
        <span className="text-foreground">Volumetric Weight Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Plane className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Volumetric Weight Calculator</h1>
            <p className="text-muted-foreground">Calculate chargeable weight for air freight</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <VolumetricWeightCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Volumetric Weight?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Volumetric weight</strong> (also called dimensional weight) is a calculated weight 
              based on a package's dimensions rather than its actual weight. Airlines use this method 
              because large, lightweight packages take up significant cargo space but don't generate 
              revenue proportional to their volume.
            </p>
            <p className="text-muted-foreground mt-3">
              The chargeable weight is always the greater of actual weight or volumetric weight, 
              ensuring carriers are compensated for the space used.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plane className="h-5 w-5 text-[var(--ocean)]" />
              Calculation Formula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
              <div>
                <span className="text-[var(--ocean)]">Volumetric Weight (kg)</span> = (L × W × H) ÷ Divisor
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                Dimensions in centimeters
              </div>
              <div className="mt-2">
                Example: 50cm × 40cm × 30cm ÷ 6000
              </div>
              <div>
                = 60,000 ÷ 6000 = <span className="text-[var(--logistics)]">10 kg</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              IATA standard divisor is 6000. Some carriers use 5000 (DHL Express), resulting in higher volumetric weight.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
              Carrier Divisors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 bg-muted/30 rounded">
                <span>IATA Standard</span>
                <span className="font-medium">6000</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/30 rounded">
                <span>DHL Express</span>
                <span className="font-medium">5000</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/30 rounded">
                <span>FedEx International</span>
                <span className="font-medium">6000</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/30 rounded">
                <span>UPS International</span>
                <span className="font-medium">6000</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/30 rounded">
                <span>TNT Express</span>
                <span className="font-medium">6000</span>
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
                Compare divisors across carriers for best rates on lightweight cargo
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Optimize packaging to reduce volumetric weight
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Dense cargo (high weight, low volume) is often cheaper by air
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider sea freight for large, lightweight shipments
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use standard box sizes to optimize space utilization
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
                Not checking which divisor your carrier uses
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting to include packaging in dimensions
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using inches without converting to centimeters
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring dimensional weight for rate comparison
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking density considerations for mode selection
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Why do airlines use volumetric weight?</AccordionTrigger>
              <AccordionContent>
                Aircraft have limited cargo space. A large box of feathers takes up the same space as a 
                small box of lead, but generates far less revenue if charged by actual weight. Volumetric 
                weight ensures carriers are compensated for the space cargo occupies, not just its weight.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Which divisor should I use?</AccordionTrigger>
              <AccordionContent>
                Use the divisor specified by your carrier. IATA standard is 6000, but DHL Express uses 5000 
                which results in higher volumetric weight. Always confirm with your specific carrier before 
                calculating shipping costs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How can I reduce volumetric weight?</AccordionTrigger>
              <AccordionContent>
                Optimize your packaging by using smaller boxes, compressing products where possible, 
                eliminating excess packaging materials, and choosing efficient pallet configurations. 
                Sometimes paying for better packaging can save significantly on shipping costs.
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
            { name: "ULD Loadability", href: "/tools/air-freight/uld-loadability" },
            { name: "IATA Zone Rates", href: "/tools/air-freight/iata-zone-rates" },
            { name: "Freight Mode Comparison", href: "/tools/road-rail/modal-shift" },
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
