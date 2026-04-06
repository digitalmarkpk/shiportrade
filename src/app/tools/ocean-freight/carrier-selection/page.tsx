import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Ship,
  Clock,
  Gauge,
  Star,
  Target,
  DollarSign,
  Shield,
  Globe,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CarrierSelectionTool } from "@/components/tools/CarrierSelectionTool";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Carrier Selection Tool | Shiportrade.com",
  description: "Find the best ocean carrier for your shipment based on pricing, reliability, transit times, and service coverage. Compare 10 major shipping lines and get AI-powered recommendations.",
  keywords: ["carrier selection", "ocean carrier comparison", "shipping line selection", "container shipping rates", "carrier reliability", "transit time comparison", "freight rate analysis"],
  openGraph: {
    title: "Carrier Selection Tool - Smart Ocean Carrier Comparison",
    description: "Compare ocean carriers and find the best fit for your shipment with our AI-powered recommendation engine.",
    type: "website",
  },
};

export default function CarrierSelectionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/ocean-freight" className="hover:text-foreground">Ocean Freight</Link>
        <span>/</span>
        <span className="text-foreground">Carrier Selection Tool</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Target className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Carrier Selection Tool</h1>
            <p className="text-muted-foreground">Find the best carrier for your shipment</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="gradient-ocean text-white">AI-Powered</Badge>
          <Badge variant="outline">10 Major Carriers</Badge>
          <Badge variant="outline">Smart Recommendations</Badge>
          <Badge variant="outline">Real-time Pricing</Badge>
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
                <p className="text-xl font-bold text-[var(--ocean)]">10</p>
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
                <p className="text-xl font-bold text-[var(--logistics)]">6 Major</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--ocean)]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pricing Data</p>
                <p className="text-xl font-bold text-[var(--ocean)]">Seasonal</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--logistics)]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-[var(--logistics)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Scoring</p>
                <p className="text-xl font-bold text-[var(--logistics)]">Multi-factor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carrier Selection Tool */}
      <CarrierSelectionTool />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-[var(--ocean)]" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              Our carrier selection tool analyzes multiple factors to recommend 
              the best carrier for your specific shipment:
            </p>
            <ol className="text-muted-foreground mt-3 space-y-2 list-decimal list-inside">
              <li>Enter your shipment details (trade lane, containers, season)</li>
              <li>Adjust priority weights based on your needs</li>
              <li>Review the AI-powered recommendation</li>
              <li>Compare alternative carriers</li>
              <li>Download your customized quote</li>
            </ol>
          </CardContent>
        </Card>

        {/* Key Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[var(--logistics)]" />
              Key Selection Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                <div>
                  <p className="font-medium">Cost Efficiency</p>
                  <p className="text-xs text-muted-foreground">Competitive rates across seasons</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                <Shield className="h-5 w-5 text-[var(--logistics)]" />
                <div>
                  <p className="font-medium">Reliability Score</p>
                  <p className="text-xs text-muted-foreground">Schedule & on-time performance</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                <Clock className="h-5 w-5 text-[var(--warning)]" />
                <div>
                  <p className="font-medium">Transit Time</p>
                  <p className="text-xs text-muted-foreground">Speed of delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                <Globe className="h-5 w-5 text-[var(--secondary)]" />
                <div>
                  <p className="font-medium">Service Coverage</p>
                  <p className="text-xs text-muted-foreground">Network breadth & depth</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scoring System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gauge className="h-5 w-5 text-[var(--ocean)]" />
              Scoring System
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              Each carrier receives a weighted score based on your priorities:
            </p>
            <ul className="text-muted-foreground mt-3 space-y-2">
              <li className="flex justify-between">
                <span>Cost Score</span>
                <span className="font-medium">0-100 pts</span>
              </li>
              <li className="flex justify-between">
                <span>Reliability Score</span>
                <span className="font-medium">0-100 pts</span>
              </li>
              <li className="flex justify-between">
                <span>Transit Score</span>
                <span className="font-medium">0-100 pts</span>
              </li>
              <li className="flex justify-between">
                <span>Coverage Score</span>
                <span className="font-medium">0-100 pts</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-[var(--ocean)]/10 rounded-lg">
              <p className="text-sm font-medium text-[var(--ocean)]">
                Total = Weighted average based on your priorities
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade Lanes Covered */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Trade Lanes Covered</CardTitle>
          <CardDescription>Major ocean freight routes analyzed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Asia - Europe", ports: "Shanghai → Rotterdam", carriers: 10 },
              { name: "Asia - US West Coast", ports: "Shanghai → Los Angeles", carriers: 9 },
              { name: "Asia - US East Coast", ports: "Shanghai → New York", carriers: 8 },
              { name: "Trans-Atlantic", ports: "Rotterdam → New York", carriers: 6 },
              { name: "Intra-Asia", ports: "Shanghai → Singapore", carriers: 8 },
              { name: "Asia - Mediterranean", ports: "Shanghai → Genoa", carriers: 7 },
            ].map((lane) => (
              <div key={lane.name} className="p-4 bg-muted/50 rounded-lg hover:bg-[var(--ocean)]/5 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-[var(--ocean)]" />
                  <p className="font-bold text-[var(--ocean)]">{lane.name}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{lane.ports}</p>
                <Badge variant="outline" className="text-xs">{lane.carriers} carriers</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alliance Overview */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="border-[var(--ocean)]/20">
          <CardHeader>
            <CardTitle className="text-lg">2M Alliance</CardTitle>
            <CardDescription>Maersk & MSC</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                Largest combined capacity
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                Extensive global coverage
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                Multiple weekly sailings
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-[var(--logistics)]/20">
          <CardHeader>
            <CardTitle className="text-lg">Ocean Alliance</CardTitle>
            <CardDescription>CMA CGM, COSCO, Evergreen, OOCL</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                Strong Asia-Europe presence
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                Competitive trans-Pacific rates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                Growing market share
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-[var(--warning)]/20">
          <CardHeader>
            <CardTitle className="text-lg">THE Alliance</CardTitle>
            <CardDescription>Hapag-Lloyd, ONE, Yang Ming</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                High reliability scores
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                Strong trans-Atlantic service
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                Quality-focused operations
              </li>
            </ul>
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
                Prioritize reliability for time-sensitive cargo
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Book 3-4 weeks in advance during peak season
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider alliance membership for network benefits
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Check seasonal rate variations for cost savings
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use multiple carriers to reduce supply chain risk
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]" style={{ color: "#2E8B57" }}>•</span>
                Review carrier performance quarterly for contracts
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
                Selecting carriers based only on lowest price
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring schedule reliability for urgent cargo
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not checking trade lane-specific performance
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking peak season capacity constraints
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Single carrier dependency for all shipments
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not considering total landed cost
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
              <AccordionTrigger>How is the carrier recommendation calculated?</AccordionTrigger>
              <AccordionContent>
                The recommendation uses a weighted scoring system based on your priorities. 
                Each carrier is scored on cost efficiency, reliability, transit time, and 
                service coverage. Your priority weights determine how these factors are 
                combined into a total score, with the highest-scoring carrier being recommended.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What are peak and off-peak seasons?</AccordionTrigger>
              <AccordionContent>
                <strong>Peak season</strong> (August-October): Highest demand period before 
                holidays, with rates typically 40-60% higher than base rates. 
                <strong>Off-peak season</strong> (February-April): Lower demand period with 
                rates 15-25% below base rates. Base rates apply during normal shipping periods.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Why do transit times vary between carriers?</AccordionTrigger>
              <AccordionContent>
                Transit times depend on several factors: direct vs. indirect routing, 
                number of port calls, vessel speed, and schedule optimization. Some carriers 
                offer premium express services with fewer stops, while others optimize for 
                cost with more port calls. Alliance carriers may share vessels, resulting 
                in similar transit times.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What additional costs should I expect beyond the base rate?</AccordionTrigger>
              <AccordionContent>
                Beyond the ocean freight rate, expect: BAF (Bunker Adjustment Factor), 
                CAF (Currency Adjustment Factor), origin/destination terminal handling charges, 
                documentation fees, customs clearance fees, inland transportation, and 
                potentially congestion surcharges. These can add 30-50% to the base ocean freight.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How often is carrier performance data updated?</AccordionTrigger>
              <AccordionContent>
                Carrier performance metrics are updated monthly based on the latest 
                available data from carrier filings, port authorities, and industry 
                databases. Schedule reliability and on-time performance reflect the 
                most recent 3-month rolling average.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>Should I always choose the recommended carrier?</AccordionTrigger>
              <AccordionContent>
                The recommendation is a starting point based on your stated priorities. 
                Consider other factors like: existing relationships, contract rates, 
                special cargo requirements, customer service quality, and track record 
                with your specific trade lanes. The tool helps narrow options, but final 
                decisions should incorporate all relevant business factors.
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
            { name: "Carrier Performance Tracker", href: "/tools/ocean-freight/carrier-performance" },
            { name: "Freight Rate Benchmark", href: "/tools/ocean-freight/freight-rate-benchmark" },
            { name: "Transit Time Estimator", href: "/tools/ocean-freight/transit-time" },
            { name: "BAF/CAF Estimator", href: "/tools/ocean-freight/baf-estimator" },
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
