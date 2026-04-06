import { Metadata } from "next";
import Link from "next/link";
import {
  Fuel,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BAFCAFEstimator } from "@/components/tools/BAFCAFEstimator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "BAF/CAF Estimator | Shiportrade.com",
  description: "Estimate bunker adjustment factor (BAF) and currency adjustment factor (CAF) surcharges for ocean freight shipments.",
  keywords: ["BAF calculator", "CAF calculator", "bunker adjustment factor", "fuel surcharge", "ocean freight surcharges"],
  openGraph: {
    title: "BAF/CAF Estimator - Freight Surcharges",
    description: "Calculate bunker and currency adjustment factors for your ocean freight shipments.",
    type: "website",
  },
};

export default function BAFEstimatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/ocean-freight" className="hover:text-foreground">Ocean Freight</Link>
        <span>/</span>
        <span className="text-foreground">BAF/CAF Estimator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Fuel className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">BAF/CAF Estimator</h1>
            <p className="text-muted-foreground">Calculate bunker and currency adjustment surcharges</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <BAFCAFEstimator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* BAF Explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Fuel className="h-5 w-5 text-[var(--ocean)]" />
              What is BAF?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Bunker Adjustment Factor (BAF)</strong> is a surcharge added to ocean freight 
              rates to compensate carriers for fluctuations in fuel prices. Also known as BSC 
              (Bunker Surcharge) or FAF (Fuel Adjustment Factor), it helps carriers manage the 
              volatility of marine fuel costs.
            </p>
            <p className="text-muted-foreground mt-3">
              BAF rates vary by trade lane, carrier, and container type. They are typically 
              adjusted monthly or quarterly based on fuel price indices like IFO 380 (Intermediate 
              Fuel Oil) or MGO (Marine Gas Oil) for vessels operating in emission control areas.
            </p>
          </CardContent>
        </Card>

        {/* CAF Explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
              What is CAF?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Currency Adjustment Factor (CAF)</strong> is a surcharge that compensates 
              carriers for fluctuations in currency exchange rates. Since most freight rates are 
              quoted in USD but carriers have costs in various currencies, CAF helps manage this 
              currency risk.
            </p>
            <p className="text-muted-foreground mt-3">
              CAF is particularly relevant for trade lanes involving currencies with high volatility. 
              A positive CAF indicates the local currency has weakened against USD, while a negative 
              CAF suggests the opposite. The surcharge is typically expressed as a percentage of 
              the base freight rate.
            </p>
          </CardContent>
        </Card>

        {/* When to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
              Why It Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Budget Planning:</strong> Forecast total shipping costs accurately
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Contract Negotiation:</strong> Compare all-in rates across carriers
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Cost Analysis:</strong> Understand what drives your freight costs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Route Selection:</strong> Compare surcharges across trade lanes
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Surcharges Breakdown */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Common Ocean Freight Surcharges</CardTitle>
          <CardDescription>Understanding all components of your freight rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { code: "BAF", name: "Bunker Adjustment Factor", desc: "Fuel price compensation" },
              { code: "CAF", name: "Currency Adjustment Factor", desc: "Exchange rate fluctuation" },
              { code: "THC", name: "Terminal Handling Charge", desc: "Port terminal operations" },
              { code: "DOC", name: "Documentation Fee", desc: "Paperwork processing" },
              { code: "ISPS", name: "ISPS Security Surcharge", desc: "Security compliance" },
              { code: " seal", name: "Seal Fee", desc: "Container sealing" },
              { code: "VGM", name: "VGM Fee", desc: "Weight verification" },
              { code: "EIS", name: "Equipment Imbalance Surcharge", desc: "Container repositioning" },
            ].map((item) => (
              <div key={item.code} className="p-3 bg-muted/50 rounded-lg">
                <p className="font-bold text-[var(--ocean)]">{item.code}</p>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
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
                Monitor fuel price trends to anticipate BAF changes
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Request all-in rates for easier carrier comparison
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Negotiate BAF caps for long-term contracts
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider fuel hedging for high-volume shippers
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review surcharges quarterly to catch billing errors
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
                Comparing base rates without considering surcharges
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring seasonal surcharge variations (peak season)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not budgeting for surcharge fluctuations
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Assuming surcharges are fixed - they change frequently
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking low-sulfur fuel surcharges for ECAs
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
              <AccordionTrigger>How often do BAF rates change?</AccordionTrigger>
              <AccordionContent>
                BAF rates typically change monthly, though some carriers adjust quarterly. The frequency 
                and magnitude of changes depend on fuel price volatility. During periods of stable oil 
                prices, changes may be minimal. However, during high volatility (like geopolitical events), 
                carriers may implement interim adjustments.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Why do BAF rates vary by trade lane?</AccordionTrigger>
              <AccordionContent>
                BAF varies by trade lane due to differences in transit time, fuel consumption, and 
                vessel efficiency. Longer routes like Asia-Europe consume more fuel per container than 
                shorter routes like Intra-Asia. Additionally, routes passing through Emission Control 
                Areas (ECAs) require more expensive low-sulfur fuel, resulting in higher BAF.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can I negotiate BAF with carriers?</AccordionTrigger>
              <AccordionContent>
                While base BAF rates are typically non-negotiable (they follow industry fuel indices), 
                high-volume shippers can negotiate BAF caps, fixed BAF rates for contract periods, 
                or fuel surcharge adjustment mechanisms. Long-term contracts may include clauses that 
                limit BAF increases or provide rebates when fuel prices drop.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What is the IMO 2020 impact on BAF?</AccordionTrigger>
              <AccordionContent>
                IMO 2020 regulations require vessels to use fuel with sulfur content below 0.5%, 
                significantly increasing fuel costs. This led to higher BAF rates and the introduction 
                of Low Sulfur Surcharge (LSS) on many trade lanes. Vessels with scrubbers can use 
                cheaper high-sulfur fuel, potentially offering lower BAF rates on some services.
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
            { name: "Freight Rate Benchmark", href: "/tools/ocean-freight/freight-rate-benchmark" },
            { name: "Demurrage Calculator", href: "/tools/ocean-freight/demurrage-calculator" },
            { name: "Transit Time Estimator", href: "/tools/ocean-freight/transit-time" },
            { name: "Carbon Footprint Calculator", href: "/tools/sustainability/carbon-footprint" },
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
