import { Metadata } from "next";
import Link from "next/link";
import {
  Ship,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Gauge,
  Star,
  Target,
  DollarSign,
  Shield,
  Globe,
  Zap,
  Waves,
  Navigation,
  Anchor,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShippingLineSelector } from "@/components/tools/ShippingLineSelector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Shipping Line Selector | Shiportrade.com",
  description: "Compare major shipping lines and find the best carrier for your ocean freight. Analyze service routes, transit times, pricing, vessel schedules, and service quality across 10 major carriers.",
  keywords: ["shipping line selector", "carrier comparison", "ocean freight carriers", "container shipping rates", "Maersk", "MSC", "CMA CGM", "COSCO", "Hapag-Lloyd", "transit times", "vessel schedules"],
  openGraph: {
    title: "Shipping Line Selector - Compare Ocean Carriers",
    description: "Find the best shipping line for your ocean freight with comprehensive carrier comparison, route analysis, and pricing data.",
    type: "website",
  },
};

export default function ShippingLineSelectorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/ocean-freight" className="hover:text-foreground">Ocean Freight</Link>
        <span>/</span>
        <span className="text-foreground">Shipping Line Selector</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center">
            <Ship className="h-6 w-6 text-[#0F4C81]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Shipping Line Selector</h1>
            <p className="text-muted-foreground">Compare carriers, routes, and pricing for your shipment</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-[#0F4C81] text-white">10 Major Carriers</Badge>
          <Badge variant="outline" className="border-[#2E8B57] text-[#2E8B57]">6 Trade Routes</Badge>
          <Badge variant="outline">Real-time Pricing</Badge>
          <Badge variant="outline">Service Quality Scores</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-[#0F4C81]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                <Ship className="h-5 w-5 text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shipping Lines</p>
                <p className="text-xl font-bold text-[#0F4C81]">10</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#2E8B57]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                <Navigation className="h-5 w-5 text-[#2E8B57]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service Routes</p>
                <p className="text-xl font-bold text-[#2E8B57]">6 Major</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#0F4C81]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                <Anchor className="h-5 w-5 text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Fleet</p>
                <p className="text-xl font-bold text-[#0F4C81]">3,500+</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#2E8B57]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                <Waves className="h-5 w-5 text-[#2E8B57]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">TEU Capacity</p>
                <p className="text-xl font-bold text-[#2E8B57]">22M+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Line Selector Tool */}
      <ShippingLineSelector />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-[#0F4C81]" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              Our shipping line selector helps you find the best carrier by analyzing:
            </p>
            <ol className="text-muted-foreground mt-3 space-y-2 list-decimal list-inside">
              <li>Select your trade route and cargo requirements</li>
              <li>Compare available carriers on the route</li>
              <li>Analyze pricing across seasonal periods</li>
              <li>Review service quality and reliability scores</li>
              <li>Select the carrier that best fits your needs</li>
            </ol>
          </CardContent>
        </Card>

        {/* Key Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[#2E8B57]" />
              Key Selection Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                <div>
                  <p className="font-medium">Pricing</p>
                  <p className="text-xs text-muted-foreground">Competitive rates across seasons</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                <Clock className="h-5 w-5 text-[#2E8B57]" />
                <div>
                  <p className="font-medium">Transit Time</p>
                  <p className="text-xs text-muted-foreground">Speed of delivery to destination</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                <Shield className="h-5 w-5 text-[#0F4C81]" />
                <div>
                  <p className="font-medium">Reliability</p>
                  <p className="text-xs text-muted-foreground">Schedule adherence & on-time performance</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                <div>
                  <p className="font-medium">Service Quality</p>
                  <p className="text-xs text-muted-foreground">Customer satisfaction & digital tools</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carrier Alliances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-[#0F4C81]" />
              Carrier Alliances
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              Major shipping alliances shape global ocean freight:
            </p>
            <div className="mt-3 space-y-2">
              <div className="p-2 bg-[#0F4C81]/10 rounded">
                <p className="font-medium text-[#0F4C81]">Gemini Cooperation</p>
                <p className="text-xs text-muted-foreground">Maersk & Hapag-Lloyd</p>
              </div>
              <div className="p-2 bg-[#2E8B57]/10 rounded">
                <p className="font-medium text-[#2E8B57]">Ocean Alliance</p>
                <p className="text-xs text-muted-foreground">CMA CGM, COSCO, Evergreen, ONE</p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="font-medium">Independent Carriers</p>
                <p className="text-xs text-muted-foreground">MSC, HMM, ZIM, Yang Ming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Routes Covered */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Service Routes Covered</CardTitle>
          <CardDescription>Major ocean freight trade lanes analyzed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Asia - Europe (North)", route: "Shanghai → Rotterdam", carriers: 9, id: "AE1" },
              { name: "Asia - Europe (Med)", route: "Shanghai → Genoa", carriers: 8, id: "AE2" },
              { name: "Asia - US West Coast", route: "Shanghai → Los Angeles", carriers: 10, id: "AW1" },
              { name: "Asia - US East Coast", route: "Shanghai → New York", carriers: 10, id: "AE3" },
              { name: "Trans-Atlantic", route: "Rotterdam → New York", carriers: 6, id: "TA1" },
              { name: "Intra-Asia", route: "Shanghai → Singapore", carriers: 8, id: "IA1" },
            ].map((lane) => (
              <div key={lane.id} className="p-4 bg-muted/50 rounded-lg hover:bg-[#0F4C81]/5 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-5 w-5 text-[#0F4C81]" />
                  <p className="font-bold text-[#0F4C81]">{lane.name}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{lane.route}</p>
                <Badge variant="outline" className="text-xs">{lane.carriers} carriers</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Shipping Lines */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        {[
          { name: "Maersk Line", code: "MSK", teu: "4.15M", alliance: "Gemini", color: "#0F4C81" },
          { name: "MSC", code: "MSC", teu: "4.80M", alliance: "Independent", color: "#2E8B57" },
          { name: "CMA CGM", code: "CMDU", teu: "3.40M", alliance: "Ocean", color: "#0F4C81" },
          { name: "COSCO Shipping", code: "COS", teu: "2.90M", alliance: "Ocean", color: "#2E8B57" },
          { name: "Hapag-Lloyd", code: "HLCU", teu: "2.10M", alliance: "Gemini", color: "#0F4C81" },
        ].map((carrier) => (
          <Card key={carrier.code} className="hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-4 text-center">
              <div 
                className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: carrier.color }}
              >
                {carrier.code}
              </div>
              <p className="font-semibold text-sm">{carrier.name}</p>
              <p className="text-xs text-muted-foreground">{carrier.teu} TEU</p>
              <Badge variant="outline" className="mt-2 text-xs">{carrier.alliance}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips & Mistakes */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-[#2E8B57]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[#2E8B57]">
              <Lightbulb className="h-5 w-5" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Compare transit times vs. pricing for time-sensitive cargo
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Check alliance membership for network benefits
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Book early during peak season (Aug-Oct) for better rates
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Review carrier reliability scores for critical shipments
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Consider environmental scores for sustainability goals
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Use digital capabilities for streamlined booking & tracking
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
                Choosing carriers based only on lowest price
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring schedule reliability for urgent shipments
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not checking route-specific performance
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking peak season capacity limits
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
              <AccordionTrigger>How do I choose the right shipping line?</AccordionTrigger>
              <AccordionContent>
                Consider multiple factors: pricing competitiveness, transit time requirements, 
                schedule reliability, service quality, and route coverage. Our tool helps you 
                compare these factors across carriers to find the best fit for your specific 
                shipment needs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What are the major shipping alliances?</AccordionTrigger>
              <AccordionContent>
                Currently, major alliances include: <strong>Gemini Cooperation</strong> (Maersk & Hapag-Lloyd), 
                <strong>Ocean Alliance</strong> (CMA CGM, COSCO, Evergreen, ONE). MSC operates independently 
                as the largest carrier. Alliance membership affects service coverage and shared vessel operations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How accurate are the transit times shown?</AccordionTrigger>
              <AccordionContent>
                Transit times are average estimates based on scheduled services. Actual transit times 
                may vary due to weather, port congestion, customs delays, and operational factors. 
                Schedule reliability scores indicate how often carriers meet their published schedules.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What additional costs should I expect beyond the base rate?</AccordionTrigger>
              <AccordionContent>
                Beyond ocean freight, expect: BAF (Bunker Adjustment Factor), CAF (Currency Adjustment Factor), 
                terminal handling charges at origin/destination, documentation fees, customs clearance, 
                inland transportation, and potential surcharges for congestion, security, or special cargo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How often is carrier data updated?</AccordionTrigger>
              <AccordionContent>
                Performance metrics are updated monthly based on the latest data from carrier filings, 
                port authorities, and industry databases. Pricing data reflects current market rates 
                and seasonal variations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>What is the environmental score based on?</AccordionTrigger>
              <AccordionContent>
                Environmental scores consider: fleet age and fuel efficiency, use of LNG or alternative 
                fuels, carbon intensity per TEU, participation in green initiatives, and compliance with 
                IMO regulations including CII (Carbon Intensity Indicator) ratings.
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
              <Card className="h-full hover:shadow-md transition-all hover:border-[#0F4C81]/50 cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium group-hover:text-[#0F4C81] transition-colors">
                    {tool.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#0F4C81] transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
