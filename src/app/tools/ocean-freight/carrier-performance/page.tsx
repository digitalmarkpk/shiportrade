import { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Ship,
  Clock,
  Gauge,
  Star,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CarrierPerformanceTracker } from "@/components/tools/CarrierPerformanceTracker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Carrier Performance Tracker | Shiportrade.com",
  description: "Track and compare ocean carrier performance metrics including schedule reliability, on-time performance, booking acceptance, documentation accuracy, claim ratio, and overall performance scores.",
  keywords: ["carrier performance", "shipping line reliability", "ocean carrier tracking", "container shipping performance", "carrier comparison", "schedule reliability", "on-time performance"],
  openGraph: {
    title: "Carrier Performance Tracker - Ocean Freight Analytics",
    description: "Track carrier performance, compare shipping lines, and make data-driven decisions for your ocean freight shipments.",
    type: "website",
  },
};

export default function CarrierPerformancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/ocean-freight" className="hover:text-foreground">Ocean Freight</Link>
        <span>/</span>
        <span className="text-foreground">Carrier Performance Tracker</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Gauge className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Carrier Performance Tracker</h1>
            <p className="text-muted-foreground">Compare performance metrics across major ocean carriers</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline">10 Major Carriers</Badge>
          <Badge variant="outline">Real-time Metrics</Badge>
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
                <Clock className="h-5 w-5 text-[var(--logistics)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Metrics</p>
                <p className="text-xl font-bold text-[var(--logistics)]">6 Key</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--ocean)]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
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
                <Star className="h-5 w-5 text-[var(--logistics)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className="text-xl font-bold text-[var(--logistics)]">100 pts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tracker Tool */}
      <CarrierPerformanceTracker />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Schedule Reliability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-[var(--ocean)]" />
              Schedule Reliability
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Schedule reliability</strong> measures the percentage of voyages arriving 
              within 24 hours of the scheduled arrival time. It&apos;s a critical indicator of 
              carrier performance and directly impacts supply chain planning.
            </p>
            <p className="text-muted-foreground mt-3">
              <strong>Industry benchmark:</strong> The global average schedule reliability 
              hovers around 70-75%, with top performers consistently achieving 80%+.
            </p>
            <div className="mt-4 p-3 bg-[var(--ocean)]/10 rounded-lg">
              <p className="text-sm font-medium text-[var(--ocean)]">
                Tip: For time-sensitive cargo, prioritize carriers with 80%+ schedule reliability.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* On-Time Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ship className="h-5 w-5 text-[var(--logistics)]" />
              On-Time Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>On-time performance</strong> tracks vessel punctuality for both 
              departures and arrivals. This metric reflects operational efficiency and 
              port turnaround capabilities.
            </p>
            <p className="text-muted-foreground mt-3">
              <strong>Key factors:</strong> Port congestion, weather conditions, vessel 
              maintenance, and crew availability all impact on-time performance.
            </p>
            <div className="mt-4 p-3 bg-[var(--logistics)]/10 rounded-lg">
              <p className="text-sm font-medium text-[var(--logistics)]">
                Tip: Check both departure and arrival punctuality for complete visibility.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Acceptance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-[var(--ocean)]" />
              Booking Acceptance
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Booking acceptance rate</strong> measures the percentage of booking 
              requests accepted without rollover or rejection. Higher rates indicate 
              better capacity availability.
            </p>
            <p className="text-muted-foreground mt-3">
              <strong>Why it matters:</strong> Low acceptance rates may lead to cargo 
              delays, rollovers, and the need for alternative routing.
            </p>
            <div className="mt-4 p-3 bg-[var(--ocean)]/10 rounded-lg">
              <p className="text-sm font-medium text-[var(--ocean)]">
                Tip: Book 2-3 weeks in advance to improve acceptance rates during peak seasons.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Info */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-[var(--ocean)]" />
              Documentation Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Documentation accuracy measures the correctness of shipping documents 
              including bills of lading, manifests, and customs paperwork. Errors can 
              lead to customs delays, additional costs, and compliance issues.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Reduces customs clearance delays</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Minimizes demurrage and detention risks</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Ensures compliance with regulations</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
              Claim Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Claim ratio indicates the percentage of shipments with filed claims for 
              damage, loss, or delays. Lower ratios suggest better cargo handling and 
              service quality.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Industry average: 1.5% - 2.0%</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Top performers: below 1.0%</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span>Higher ratios may indicate handling issues</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Carriers Covered */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Major Ocean Carriers Covered</CardTitle>
          <CardDescription>Top 10 container shipping lines by TEU capacity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: "Maersk Line", code: "MSK", teu: "4.15M TEU", region: "Global" },
              { name: "MSC", code: "MSC", teu: "4.80M TEU", region: "Global" },
              { name: "CMA CGM", code: "CMDU", teu: "3.40M TEU", region: "Global" },
              { name: "COSCO Shipping", code: "COS", teu: "2.90M TEU", region: "Global" },
              { name: "Hapag-Lloyd", code: "HLCU", teu: "2.10M TEU", region: "Global" },
              { name: "Evergreen", code: "EGSU", teu: "1.65M TEU", region: "Asia-Pacific" },
              { name: "ONE", code: "ONEY", teu: "1.60M TEU", region: "Global" },
              { name: "Yang Ming", code: "YMLU", teu: "720K TEU", region: "Asia-Pacific" },
              { name: "HMM", code: "HMM", teu: "820K TEU", region: "Asia-Pacific" },
              { name: "ZIM", code: "ZIM", teu: "580K TEU", region: "Global" },
            ].map((carrier) => (
              <div key={carrier.code} className="p-4 bg-muted/50 rounded-lg hover:bg-[var(--ocean)]/5 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded bg-[var(--ocean)] flex items-center justify-center text-white font-bold text-xs">
                    {carrier.code}
                  </div>
                  <p className="font-bold text-[var(--ocean)] text-sm">{carrier.name}</p>
                </div>
                <p className="text-sm font-medium">{carrier.teu}</p>
                <p className="text-xs text-muted-foreground">{carrier.region}</p>
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
                Compare multiple carriers before booking time-sensitive cargo
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider overall score over individual metrics
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Check historical trends for seasonal patterns
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Balance cost vs. reliability based on cargo urgency
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review claim ratios for high-value shipments
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Monitor performance trends quarterly for contract negotiations
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
                Choosing carriers based on price alone
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring schedule reliability for time-critical cargo
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not checking trade lane-specific performance
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking documentation accuracy for compliance
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Failing to review carrier performance regularly
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not diversifying carrier portfolio
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
              <AccordionTrigger>How is the overall performance score calculated?</AccordionTrigger>
              <AccordionContent>
                The overall performance score is a weighted composite of multiple metrics: 
                Schedule Reliability (25%), On-Time Performance (20%), Booking Acceptance (15%), 
                Documentation Accuracy (20%), and Claim Ratio (20% inverted). The weights reflect 
                the relative importance of each metric to overall service quality.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How often is carrier performance data updated?</AccordionTrigger>
              <AccordionContent>
                Performance metrics are updated monthly based on the latest available data from 
                carrier filings, port authorities, and industry databases. Historical trends show 
                12 months of rolling data to help identify seasonal patterns and long-term 
                performance trajectories.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Which carrier is best for time-sensitive shipments?</AccordionTrigger>
              <AccordionContent>
                For time-sensitive shipments, prioritize carriers with high schedule reliability 
                (80%+) and on-time performance (85%+). Currently, Hapag-Lloyd, ONE, and Maersk 
                consistently rank among the top performers for schedule reliability. Always check 
                performance specific to your trade lane.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How should I use carrier comparison for negotiations?</AccordionTrigger>
              <AccordionContent>
                Use performance data to: 1) Benchmark your current carriers against market leaders, 
                2) Identify performance gaps to discuss in negotiations, 3) Request service level 
                agreements (SLAs) tied to key metrics, 4) Negotiate performance-based rate adjustments, 
                and 5) Justify carrier diversification decisions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What is a good claim ratio?</AccordionTrigger>
              <AccordionContent>
                A claim ratio below 1.5% is considered good, while top performers maintain ratios 
                below 1.0%. Higher claim ratios may indicate issues with cargo handling, vessel 
                condition, or operational processes. For high-value or fragile cargo, prioritize 
                carriers with the lowest claim ratios.
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
            { name: "Container Tracking", href: "/tools/ocean-freight/container-tracking" },
            { name: "Transit Time Estimator", href: "/tools/ocean-freight/transit-time" },
            { name: "Port Congestion Monitor", href: "/tools/ocean-freight/port-congestion" },
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
