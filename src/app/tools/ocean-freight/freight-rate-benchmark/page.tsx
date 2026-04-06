import { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  DollarSign,
  Globe,
  Clock,
  Ship,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FreightRateBenchmark } from "@/components/tools/FreightRateBenchmark";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Freight Rate Benchmark | Shiportrade.com",
  description: "Compare ocean freight rates across carriers, analyze spot vs contract rates, track historical trends, and benchmark pricing across major trade lanes.",
  keywords: ["freight rate benchmark", "ocean freight rates", "carrier rate comparison", "spot rates", "contract rates", "shipping rates", "container shipping costs"],
  openGraph: {
    title: "Freight Rate Benchmark - Ocean Freight Analytics",
    description: "Compare carrier rates, analyze spot vs contract pricing, and track historical rate trends across major trade lanes.",
    type: "website",
  },
};

export default function FreightRateBenchmarkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/ocean-freight" className="hover:text-foreground">Ocean Freight</Link>
        <span>/</span>
        <span className="text-foreground">Freight Rate Benchmark</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Freight Rate Benchmark</h1>
            <p className="text-muted-foreground">Compare carrier rates and analyze market trends</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline">Real-time Data</Badge>
          <Badge variant="outline">10+ Trade Lanes</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-[var(--ocean)]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                <Ship className="h-5 w-5 text-[var(--ocean)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carriers</p>
                <p className="text-xl font-bold text-[var(--ocean)]">10+</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--logistics)]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                <Globe className="h-5 w-5 text-[var(--logistics)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trade Lanes</p>
                <p className="text-xl font-bold text-[var(--logistics)]">10</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--ocean)]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                <Clock className="h-5 w-5 text-[var(--ocean)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Historical Data</p>
                <p className="text-xl font-bold text-[var(--ocean)]">12 months</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--logistics)]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rate Types</p>
                <p className="text-xl font-bold text-[var(--logistics)]">Spot & Contract</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benchmark Tool */}
      <FreightRateBenchmark />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Spot Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
              Spot Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Spot rates</strong> are market-driven prices for shipping containers on a 
              shipment-by-shipment basis. They fluctuate daily based on supply and demand, 
              seasonal factors, and market conditions.
            </p>
            <p className="text-muted-foreground mt-3">
              <strong>Best for:</strong> Shippers with irregular volumes, those testing new 
              trade lanes, or when rates are trending downward. Spot rates offer flexibility 
              but expose you to market volatility.
            </p>
            <div className="mt-4 p-3 bg-[var(--ocean)]/10 rounded-lg">
              <p className="text-sm font-medium text-[var(--ocean)]">
                Tip: Monitor spot rates for 2-3 weeks before booking to identify optimal timing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contract Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
              Contract Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Contract rates</strong> are fixed prices agreed upon for a specified 
              period (typically 3-12 months). They provide cost certainty and guaranteed 
              space allocation during peak seasons.
            </p>
            <p className="text-muted-foreground mt-3">
              <strong>Best for:</strong> Regular shippers with predictable volumes who want 
              budget certainty and protection from spot market spikes during peak seasons.
            </p>
            <div className="mt-4 p-3 bg-[var(--logistics)]/10 rounded-lg">
              <p className="text-sm font-medium text-[var(--logistics)]">
                Tip: Negotiate contract rates 2-3 months before peak season for better terms.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* When to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
              Rate Benchmarking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Compare Carriers:</strong> Evaluate all-in rates across major shipping lines
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Negotiate Better:</strong> Use market data to strengthen your position
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Time Bookings:</strong> Identify optimal booking windows
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Plan Budgets:</strong> Forecast shipping costs with historical trends
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Optimize Routes:</strong> Compare rates across alternative trade lanes
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Major Trade Lanes Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Major Trade Lanes Covered</CardTitle>
          <CardDescription>Key shipping routes with comprehensive rate data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { lane: "Asia - Europe", desc: "Busiest container route", volume: "15M TEU/yr" },
              { lane: "Asia - USWC", desc: "Trans-Pacific West", volume: "12M TEU/yr" },
              { lane: "Asia - USEC", desc: "Trans-Pacific East", volume: "8M TEU/yr" },
              { lane: "Europe - US", desc: "Trans-Atlantic", volume: "5M TEU/yr" },
              { lane: "Intra-Asia", desc: "Regional trade", volume: "20M TEU/yr" },
            ].map((item) => (
              <div key={item.lane} className="p-4 bg-muted/50 rounded-lg hover:bg-[var(--ocean)]/5 transition-colors">
                <p className="font-bold text-[var(--ocean)]">{item.lane}</p>
                <p className="text-sm font-medium">{item.desc}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.volume}</p>
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
                Book 2-3 weeks ahead for better spot rates
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Compare all-in rates, not just base freight
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider hybrid contracts for volume flexibility
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Lock in contract rates before peak season (Aug-Oct)
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Track rates weekly to identify booking opportunities
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Negotiate BAF caps for contract stability
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
                Only comparing base rates without surcharges
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Signing contracts during peak rate periods
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring transit time differences between routes
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not reviewing contract performance quarterly
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking smaller carriers with better rates
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Booking last-minute during peak season
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
              <AccordionTrigger>How often are benchmark rates updated?</AccordionTrigger>
              <AccordionContent>
                Our benchmark rates are updated daily based on actual market transactions and 
                carrier rate filings. Historical trend data is refreshed weekly to provide 
                accurate long-term analysis. During periods of high volatility, updates may 
                be more frequent.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the difference between spot and contract rates?</AccordionTrigger>
              <AccordionContent>
                Spot rates are market-driven prices for individual shipments, fluctuating daily 
                based on supply and demand. Contract rates are fixed prices agreed upon for a 
                specified period (typically 3-12 months), providing cost certainty and guaranteed 
                space allocation. The right choice depends on your shipping volume, frequency, 
                and risk tolerance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I know if I should choose spot or contract rates?</AccordionTrigger>
              <AccordionContent>
                Consider contract rates if you: ship regularly (10+ containers/month), want 
                budget predictability, need guaranteed space during peak seasons, or operate 
                on thin margins. Choose spot rates if you: have irregular shipping patterns, 
                are testing new markets, or when rates are trending downward. Many shippers 
                use a hybrid approach, contracting 60-70% of volume and using spot for flexibility.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Which trade lanes have the highest rate volatility?</AccordionTrigger>
              <AccordionContent>
                Trans-Pacific routes (Asia-US) typically show the highest volatility, with rates 
                potentially varying 50-100% between peak and off-peak seasons. Asia-Europe routes 
                also experience significant fluctuation. Intra-Asia routes tend to be more stable 
                due to shorter transit times and higher competition.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How can I use this data for contract negotiations?</AccordionTrigger>
              <AccordionContent>
                Use benchmark data to: 1) Compare carrier rates against market averages, 2) 
                Identify seasonal patterns to time negotiations, 3) Demonstrate market knowledge 
                when discussing rates, 4) Negotiate BAF/CAF transparency, and 5) Request rate 
                adjustment mechanisms tied to market indices. Always compare all-in rates, not 
                just base freight.
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
            { name: "BAF/CAF Estimator", href: "/tools/ocean-freight/baf-estimator" },
            { name: "Transit Time Estimator", href: "/tools/ocean-freight/transit-time" },
            { name: "Demurrage Calculator", href: "/tools/ocean-freight/demurrage-calculator" },
            { name: "Container Tracking", href: "/tools/ocean-freight/container-tracking" },
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
