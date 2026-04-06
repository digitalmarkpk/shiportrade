import { Metadata } from "next";
import Link from "next/link";
import {
  Ship,
  DollarSign,
  Container,
  Globe,
  TrendingUp,
  Clock,
  Fuel,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Scale,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FreightRateCalculatorTool } from "@/components/tools/FreightRateCalculatorTool";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Freight Rate Calculator | Shiportrade.com",
  description: "Calculate ocean freight rates across trade lanes, compare carriers, and understand surcharges for container shipping.",
  keywords: ["freight rate calculator", "ocean freight rates", "container shipping rates", "carrier comparison", "shipping cost calculator"],
  openGraph: {
    title: "Freight Rate Calculator - Ocean Freight Pricing",
    description: "Calculate and compare ocean freight rates across trade lanes and carriers.",
    type: "website",
  },
};

export default function FreightRateCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/ocean-freight" className="hover:text-foreground">Ocean Freight</Link>
        <span>/</span>
        <span className="text-foreground">Freight Rate Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Freight Rate Calculator</h1>
            <p className="text-muted-foreground">Calculate ocean freight rates across trade lanes and carriers</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <FreightRateCalculatorTool />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Freight Rates Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Freight Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Ocean freight rates</strong> are the costs charged by shipping lines for 
              transporting cargo by sea. Rates vary significantly based on trade lane, container 
              type, carrier, and market conditions. The base freight rate is just one component 
              of the total cost—various surcharges can add 30-50% to your shipping expenses.
            </p>
            <p className="text-muted-foreground mt-3">
              Rates are quoted per container (FCL) or per CBM/ton (LCL). Major factors affecting 
              rates include fuel prices, container availability, seasonal demand, and trade 
              imbalances. Understanding rate components helps in budgeting and carrier negotiations.
            </p>
          </CardContent>
        </Card>

        {/* Trade Lanes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-[var(--ocean)]" />
              Major Trade Lanes
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Trade lanes</strong> are established shipping routes connecting major 
              economic regions. The most significant lanes include:
            </p>
            <ul className="text-muted-foreground mt-3 space-y-1">
              <li><strong>Trans-Pacific:</strong> Asia to US West/East Coast</li>
              <li><strong>Asia-Europe:</strong> Far East to North Europe</li>
              <li><strong>Trans-Atlantic:</strong> Europe to North America</li>
              <li><strong>Intra-Asia:</strong> Short-sea regional trade</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Each trade lane has distinct characteristics affecting rates, including transit 
              times, vessel capacity, and seasonal patterns.
            </p>
          </CardContent>
        </Card>

        {/* Why It Matters */}
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
                  <strong>Cost Planning:</strong> Accurately forecast shipping costs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Carrier Selection:</strong> Compare rates across shipping lines
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Route Optimization:</strong> Find the most cost-effective paths
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Budget Management:</strong> Plan for surcharge fluctuations
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Container Types */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Container className="h-5 w-5 text-[var(--ocean)]" />
            Container Types & Rate Impact
          </CardTitle>
          <CardDescription>How container selection affects your freight costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { type: "20GP", name: "20ft General Purpose", capacity: "33.2 CBM", multiplier: "1.0x", desc: "Standard dry container" },
              { type: "40GP", name: "40ft General Purpose", capacity: "67.7 CBM", multiplier: "1.27x", desc: "Standard 40ft container" },
              { type: "40HC", name: "40ft High Cube", capacity: "76.3 CBM", multiplier: "1.35x", desc: "Extra height for voluminous cargo" },
              { type: "Reefer", name: "Refrigerated", capacity: "28-59 CBM", multiplier: "2.2-2.5x", desc: "Temperature controlled" },
              { type: "Special", name: "Open Top/Flat Rack", capacity: "OOG", multiplier: "1.4-1.85x", desc: "Over-dimensional cargo" },
            ].map((item) => (
              <div key={item.type} className="p-4 bg-muted/50 rounded-lg">
                <Badge className="mb-2 bg-[var(--ocean)]/10 text-[var(--ocean)]">{item.type}</Badge>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.capacity}</p>
                <p className="text-xs font-medium text-[var(--logistics)] mt-1">Rate: {item.multiplier}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rate Components Breakdown */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
            Freight Rate Components
          </CardTitle>
          <CardDescription>Understanding what makes up your total shipping cost</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { code: "Base Freight", name: "Ocean Freight", desc: "Core transportation cost per container", pct: "55-65%" },
              { code: "BAF", name: "Bunker Adjustment", desc: "Fuel price compensation", pct: "15-20%" },
              { code: "THC", name: "Terminal Handling", desc: "Port operations at origin/destination", pct: "8-12%" },
              { code: "CAF", name: "Currency Adjustment", desc: "Exchange rate fluctuation", pct: "2-5%" },
              { code: "DOC", name: "Documentation", desc: "BL, customs, paperwork", pct: "2-3%" },
              { code: "ISPS", name: "Security Surcharge", desc: "Port security compliance", pct: "1-2%" },
              { code: "PSS", name: "Peak Season", desc: "High-demand period surcharge", pct: "5-15%" },
              { code: "Other", name: "Miscellaneous", desc: "Seals, VGM, chassis, etc.", pct: "3-5%" },
            ].map((item) => (
              <div key={item.code} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-[var(--ocean)]">{item.code}</p>
                  <Badge variant="outline" className="text-xs">{item.pct}</Badge>
                </div>
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
                Book 4-6 weeks in advance to secure better rates and avoid peak surcharges
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Request all-in rates from carriers for accurate comparison
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider long-term contracts to lock in favorable rates
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use alternative ports to reduce THC and avoid congestion
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Monitor rate trends to time your bookings strategically
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Negotiate BAF caps and surcharge adjustments in contracts
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
                Comparing only base rates without including surcharges
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring transit time differences between carriers
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not budgeting for peak season and GRI surcharges
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking carrier reliability and service quality
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Assuming spot rates are always cheaper than contracts
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting destination charges in total cost calculation
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
              <AccordionTrigger>How are ocean freight rates determined?</AccordionTrigger>
              <AccordionContent>
                Ocean freight rates are determined by supply and demand dynamics in the shipping market. 
                Key factors include vessel capacity on specific trade lanes, container availability, 
                fuel prices, seasonal demand patterns, and carrier competition. Rates can fluctuate 
                significantly based on these market conditions, with spot rates changing weekly and 
                contract rates typically negotiated quarterly or annually.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the difference between spot rates and contract rates?</AccordionTrigger>
              <AccordionContent>
                <strong>Spot rates</strong> are market-driven prices for one-off shipments, reflecting 
                current supply and demand. They can be lower during periods of excess capacity but 
                increase sharply during peak seasons. <strong>Contract rates</strong> are negotiated 
                agreements for a specified period (usually 6-12 months), providing rate stability and 
                guaranteed capacity. Shippers with regular volumes often use a mix of both strategies.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Why do freight rates vary between carriers on the same route?</AccordionTrigger>
              <AccordionContent>
                Rate differences between carriers result from several factors: service reliability 
                (on-time performance premium), vessel speed and transit time, port coverage and 
                connections, container availability, customer service quality, and contract terms. 
                Premium carriers like Maersk and Hapag-Lloyd often charge more but offer better 
                reliability, while budget carriers may have lower rates but longer transit times 
                or less frequent sailings.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>When is the best time to book freight?</AccordionTrigger>
              <AccordionContent>
                The optimal booking time varies by trade lane and season. Generally, booking 3-4 weeks 
                in advance provides good rates and capacity availability. Avoid peak seasons (Q4 for 
                consumer goods, pre-holiday periods) when rates surge. For Asia-Europe, rates are often 
                lower in Q1-Q2. For Trans-Pacific, book before Chinese New Year and Golden Week when 
                factories rush to ship goods. Long-term contracts provide protection against seasonal spikes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What additional costs should I budget beyond the quoted freight rate?</AccordionTrigger>
              <AccordionContent>
                Beyond the quoted freight rate, budget for: destination THC (often not included), 
                demurrage/detention if containers are held beyond free days, customs clearance fees, 
                inland transportation, cargo insurance (0.1-0.5% of cargo value), and potential 
                surcharge adjustments (BAF, CAF changes). Total landed cost can be 50-100% higher 
                than the base freight rate, so plan accordingly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How can I negotiate better freight rates?</AccordionTrigger>
              <AccordionContent>
                Effective negotiation strategies include: committing to volume (higher volumes = better rates), 
                offering flexibility on routing and carriers, signing longer-term contracts, consolidating 
                shipments for better utilization, requesting all-in rates for transparency, comparing multiple 
                carriers before negotiating, and building relationships with carrier sales representatives. 
                Consider working with a freight forwarder who may have better buying power.
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
            { name: "Carrier Performance", href: "/tools/ocean-freight/carrier-performance" },
            { name: "Demurrage Calculator", href: "/tools/ocean-freight/demurrage-calculator" },
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
