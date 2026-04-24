import { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Ship,
  Globe,
  Route,
  Calendar,
  TrendingUp,
  Info,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TransitTimeEstimator } from "@/components/tools/TransitTimeEstimator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Transit Time Estimator | Shiportrade.com",
  description: "Estimate ocean freight transit times between ports worldwide. Calculate arrival dates, consider port delays, and compare carrier reliability.",
  keywords: ["transit time calculator", "ocean freight", "shipping time", "ETA calculator", "port delays", "carrier reliability"],
  openGraph: {
    title: "Transit Time Estimator - Ocean Freight Planning",
    description: "Plan your ocean freight shipments with accurate transit time estimates and arrival date predictions.",
    type: "website",
  },
};

export default function TransitTimePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/ocean-freight" className="hover:text-foreground">Ocean Freight</Link>
        <span>/</span>
        <span className="text-foreground">Transit Time Estimator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Transit Time Estimator</h1>
            <p className="text-muted-foreground">Calculate ocean freight transit times and estimate arrival dates</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">100+ Ports</Badge>
          <Badge variant="outline" className="border-[var(--ocean)] text-[var(--ocean)]">8 Carriers</Badge>
        </div>
      </div>

      {/* Calculator */}
      <TransitTimeEstimator />

      <Separator className="my-12" />

      {/* Educational Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Understanding Transit Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Transit Time?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Transit time</strong> in ocean freight refers to the total duration from when cargo
              is loaded onto a vessel at the port of origin until it arrives at the port of destination.
            </p>
            <p className="text-muted-foreground mt-3">
              This includes sailing time, port handling, and any transshipment stops along the route.
              Understanding transit time is crucial for:
            </p>
            <ul className="text-sm text-muted-foreground mt-3 space-y-1">
              <li>• Inventory planning and supply chain optimization</li>
              <li>• Setting realistic delivery expectations</li>
              <li>• Calculating working capital requirements</li>
              <li>• Coordinating logistics and distribution</li>
            </ul>
          </CardContent>
        </Card>

        {/* Components */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-[var(--ocean)]" />
              Transit Time Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">1. Port Handling</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Loading at origin and unloading at destination (1-3 days each port)
                </p>
              </div>
              <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
                <p className="font-medium text-[var(--logistics)]">2. Ocean Voyage</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Actual sailing time between ports (varies by distance and vessel speed)
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <p className="font-medium text-amber-600">3. Transshipment</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Transfer at hub ports if direct service unavailable (+5-10 days)
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <p className="font-medium text-purple-600">4. Canal Transit</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Suez/Panama canal waiting and passage time (1-3 days)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Route className="h-5 w-5 text-[var(--ocean)]" />
              Major Trade Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {[
                { route: "Asia → Europe (Suez)", days: "28-35 days" },
                { route: "Asia → US West Coast", days: "14-18 days" },
                { route: "Asia → US East Coast", days: "25-32 days" },
                { route: "Europe → US East Coast", days: "10-14 days" },
                { route: "Asia → Middle East", days: "10-14 days" },
                { route: "Europe → South America", days: "18-22 days" },
                { route: "Asia → Oceania", days: "12-15 days" },
                { route: "US → South America", days: "15-20 days" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-dashed last:border-0">
                  <span className="text-muted-foreground">{item.route}</span>
                  <Badge variant="secondary" className="text-xs">{item.days}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canal Routes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-[var(--ocean)]" />
            Major Canal Routes & Their Impact
          </CardTitle>
          <CardDescription>Understanding how Suez and Panama canals affect transit times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--ocean)]/10 flex items-center justify-center">
                  <span className="text-[var(--ocean)] font-bold">S</span>
                </div>
                <span className="font-bold">Suez Canal</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Connects Mediterranean to Red Sea, providing the shortest route between Europe and Asia.
                Saves ~7,000 km compared to sailing around Africa.
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Location:</strong> Egypt</p>
                <p><strong>Length:</strong> 193 km</p>
                <p><strong>Transit time:</strong> 12-16 hours</p>
                <p><strong>Waiting time:</strong> 0-48 hours</p>
              </div>
            </div>

            <div className="p-4 bg-[var(--logistics)]/5 rounded-lg border border-[var(--logistics)]/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--logistics)]/10 flex items-center justify-center">
                  <span className="text-[var(--logistics)] font-bold">P</span>
                </div>
                <span className="font-bold">Panama Canal</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Connects Pacific and Atlantic Oceans, essential for Asia-US East Coast trade.
                Saves ~13,000 km compared to sailing around Cape Horn.
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Location:</strong> Panama</p>
                <p><strong>Length:</strong> 82 km</p>
                <p><strong>Transit time:</strong> 8-10 hours</p>
                <p><strong>Waiting time:</strong> 0-24 hours</p>
              </div>
            </div>

            <div className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <span className="text-amber-600 font-bold">C</span>
                </div>
                <span className="font-bold">Cape of Good Hope</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Alternative route around southern Africa when Suez is unavailable.
                Adds ~7-10 days to Asia-Europe transit time.
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Location:</strong> South Africa</p>
                <p><strong>Used when:</strong> Suez disruptions</p>
                <p><strong>Added transit:</strong> 7-10 days</p>
                <p><strong>Larger vessels:</strong> Can accommodate any size</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Port Congestion Info */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-[var(--ocean)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[var(--ocean)]">
              <TrendingUp className="h-5 w-5" />
              Port Congestion Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Port congestion can significantly impact transit times. High-volume ports often experience
              delays due to vessel queues, terminal capacity, and labor availability.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">High Congestion Ports</span>
                <Badge variant="destructive">3-5 days delay</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medium Congestion Ports</span>
                <Badge className="bg-yellow-500 text-white">1-3 days delay</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Low Congestion Ports</span>
                <Badge className="gradient-logistics text-white">0-1 day delay</Badge>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Consider less congested alternative ports if transit time is critical.
                For example, use Oakland instead of Los Angeles during peak season.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--logistics)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[var(--logistics)]">
              <Ship className="h-5 w-5" />
              Carrier Reliability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Carrier on-time performance varies significantly. Premium carriers often provide more
              reliable service with fewer schedule disruptions.
            </p>
            <div className="space-y-3">
              {[
                { name: "Top-tier carriers", reliability: "90-95%", example: "Maersk, Hapag-Lloyd" },
                { name: "Mid-tier carriers", reliability: "85-90%", example: "CMA CGM, ONE, MSC" },
                { name: "Budget carriers", reliability: "80-85%", example: "Regional carriers" },
              ].map((tier, idx) => (
                <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{tier.name}</span>
                    <Badge variant="secondary">{tier.reliability}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{tier.example}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tips */}
      <Card className="mt-8 border-[var(--logistics)]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-[var(--logistics)]">
            <Lightbulb className="h-5 w-5" />
            Pro Tips for Transit Time Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">1.</span>
                Always add 3-5 buffer days for customs clearance and unexpected delays
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">2.</span>
                Consider seasonal variations - peak season (Q4) often has longer transit times
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">3.</span>
                Use direct services for time-sensitive cargo, transshipment for cost savings
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">4.</span>
                Check carrier schedule reliability before booking for critical shipments
              </li>
            </ul>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">5.</span>
                Monitor canal transit situations - Suez disruptions can add 7-10 days
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">6.</span>
                Book early during peak season to secure preferred carrier and route
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">7.</span>
                Consider alternative ports if main ports have high congestion
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">8.</span>
                Track vessel actual speed - slow steaming can add 2-3 days
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card className="mt-8 border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Common Mistakes to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Assuming transit time is the same in both directions (headwinds affect return voyages)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for weekends and holidays at destination ports
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring port congestion data during peak shipping seasons
              </li>
            </ul>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Relying solely on carrier published transit times without buffer
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not considering transshipment delays for secondary ports
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting to account for customs clearance time at destination
              </li>
            </ul>
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
              <AccordionTrigger>How accurate are transit time estimates?</AccordionTrigger>
              <AccordionContent>
                Transit time estimates are typically accurate within ±2-3 days for direct services and
                ±5-7 days for transshipment routes. Factors like weather, port congestion, and canal
                transit times can cause variations. We recommend adding buffer days for critical shipments.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the difference between direct and transshipment service?</AccordionTrigger>
              <AccordionContent>
                Direct service means the vessel sails directly from origin to destination without stopping
                at intermediate ports to unload cargo. Transshipment involves transferring cargo to another
                vessel at a hub port. Direct service is faster but may have higher costs, while transshipment
                offers more routing options and potentially lower costs but adds 5-10 days to transit time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How does port congestion affect transit time?</AccordionTrigger>
              <AccordionContent>
                Port congestion can add 1-7 days to transit time depending on severity. When ports are
                congested, vessels must wait at anchor for a berth to become available. Major ports like
                Los Angeles, Long Beach, and Rotterdam can experience significant delays during peak seasons.
                Our calculator includes average port congestion delays by region.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Why would a carrier route via Cape of Good Hope instead of Suez?</AccordionTrigger>
              <AccordionContent>
                Carriers may route via Cape of Good Hope when: (1) Suez Canal is disrupted or blocked,
                (2) Suez transit fees are too high for the specific voyage economics, (3) The vessel is
                too large for Suez (though this is rare for container ships), or (4) Security concerns
                in the Red Sea region. This adds 7-10 days to Asia-Europe transit time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What is slow steaming and how does it affect transit time?</AccordionTrigger>
              <AccordionContent>
                Slow steaming is a practice where vessels reduce speed to save fuel and reduce costs.
                Normal container ship speed is 22-25 knots, while slow steaming operates at 18-20 knots.
                This can add 2-5 days to transit time depending on route length. Carriers may use slow
                steaming during periods of low demand or high fuel prices.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How should I plan for seasonal variations in transit time?</AccordionTrigger>
              <AccordionContent>
                Peak shipping season (August-December) typically sees longer transit times due to:
                (1) Higher port congestion at major gateways, (2) More vessels operating near capacity,
                (3) Potential weather delays in certain regions. Plan for 3-5 extra days during peak season
                and book 4-6 weeks in advance to secure preferred routing.
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
            { name: "Port Code Finder", href: "/directories/ports" },
            { name: "Demurrage Calculator", href: "/tools/ocean-freight/demurrage-calculator" },
            { name: "Container Tracking", href: "/tools/ocean-freight/container-tracking" },
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
