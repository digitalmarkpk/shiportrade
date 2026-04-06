import { Metadata } from "next";
import { DrayageCalculator } from "@/components/tools/DrayageCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Truck,
  Ship,
  Container,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  MapPin,
  DollarSign,
  Clock,
  Route,
  Fuel,
  Building2,
  Timer,
  RotateCcw,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Drayage Calculator | Shiportrade.com",
  description: "Calculate drayage costs from port terminals to inland destinations. Estimate chassis fees, fuel surcharges, terminal dwell time, and total drayage costs for container transport.",
  keywords: ["drayage calculator", "container drayage", "port drayage", "chassis fees", "drayage rates", "terminal fees", "container transport"],
};

export default function DrayageCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Truck className="h-3 w-3 mr-2" />
          Road & Rail Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Drayage Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate drayage costs from port terminals to your destination. Estimate chassis fees, 
          fuel surcharges, terminal dwell time charges, and total turn costs for container transport operations.
        </p>
      </div>

      {/* Calculator */}
      <DrayageCalculator />

      {/* Educational Content */}
      <div className="mt-12 space-y-6">
        {/* What is Drayage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5" style={{ color: "#0F4C81" }} />
              Understanding Drayage in Container Logistics
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Drayage is a critical link in the intermodal supply chain, connecting ocean freight 
              terminals to warehouses, distribution centers, and rail yards. Despite typically being 
              short-distance moves (often under 200 miles), drayage costs can significantly impact 
              total landed costs and supply chain efficiency.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <Truck className="h-8 w-8 mb-2" style={{ color: "#0F4C81" }} />
                <h4 className="font-medium mb-1">Short-Haul Transport</h4>
                <p className="text-sm text-muted-foreground">
                  Typically covers distances from port to nearby distribution centers, usually under 200 miles.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <Container className="h-8 w-8 mb-2" style={{ color: "#2E8B57" }} />
                <h4 className="font-medium mb-1">Container Focused</h4>
                <p className="text-sm text-muted-foreground">
                  Specialized in moving shipping containers between ports, rails, and warehouses.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <DollarSign className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Cost Impact</h4>
                <p className="text-sm text-muted-foreground">
                  Drayage typically represents 5-15% of total inland transportation costs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Components */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="h-5 w-5" style={{ color: "#2E8B57" }} />
              Drayage Cost Components
            </CardTitle>
            <CardDescription>Understanding the factors that influence drayage pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 dark:bg-slate-900/50">
                    <th className="text-left py-3 px-4">Component</th>
                    <th className="text-center py-3 px-4">Typical Range</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">Variables</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#0F4C81" }} />
                        Base Drayage Rate
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">$3.00 - $5.00/mile</td>
                    <td className="py-3 px-4">Per-mile rate for container transport</td>
                    <td className="py-3 px-4 text-muted-foreground">Region, port congestion, driver availability</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#2E8B57" }} />
                        Chassis Fee
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">$45 - $95/day</td>
                    <td className="py-3 px-4">Daily rental for container chassis</td>
                    <td className="py-3 px-4 text-muted-foreground">Container type, chassis pool, market demand</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F59E0B" }} />
                        Fuel Surcharge
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">15% - 35% of base</td>
                    <td className="py-3 px-4">Variable charge based on fuel prices</td>
                    <td className="py-3 px-4 text-muted-foreground">Diesel prices, carrier policy, weekly adjustments</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#8B5CF6" }} />
                        Terminal Fees
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">$50 - $150/container</td>
                    <td className="py-3 px-4">Terminal handling and gate fees</td>
                    <td className="py-3 px-4 text-muted-foreground">Terminal, time of day, appointment system</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#EC4899" }} />
                        Dwell Time Charges
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">$50 - $150/day</td>
                    <td className="py-3 px-4">Storage fees after free time expires</td>
                    <td className="py-3 px-4 text-muted-foreground">Free days, demurrage policy, container type</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#EF4444" }} />
                        Wait Time
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">$40 - $60/hour</td>
                    <td className="py-3 px-4">Driver detention for extended waits</td>
                    <td className="py-3 px-4 text-muted-foreground">Terminal congestion, appointment delays</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Turn Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <RotateCcw className="h-5 w-5" style={{ color: "#0F4C81" }} />
              Types of Drayage Turns
            </CardTitle>
            <CardDescription>Understanding different drayage move configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(15, 76, 129, 0.1)" }}>
                    <Ship className="h-5 w-5" style={{ color: "#0F4C81" }} />
                  </div>
                  <h4 className="font-medium">Import Turn</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Pick up loaded container from port terminal and deliver to consignee&apos;s facility. 
                  Return with empty container to designated location.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Port</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Warehouse</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Return Empty</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(46, 139, 87, 0.1)" }}>
                    <Container className="h-5 w-5" style={{ color: "#2E8B57" }} />
                  </div>
                  <h4 className="font-medium">Export Turn</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Pick up empty container from depot, transport to shipper for loading, 
                  then deliver loaded container to port terminal.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Empty Depot</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Load</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Port</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Route className="h-5 w-5 text-amber-500" />
                  </div>
                  <h4 className="font-medium">Street Turn</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Reuse an import container for an export load before returning to the port. 
                  Eliminates empty return trip, saving time and costs.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Port Import</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Unload + Reload</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Port Export</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}>
                    <Building2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <h4 className="font-medium">Intermodal Turn</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Move containers between port terminals and rail yards for further 
                  inland distribution via rail network.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Port</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Rail Yard</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Inland</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Port Congestion Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5" style={{ color: "#0F4C81" }} />
              Port Congestion & Wait Times
            </CardTitle>
            <CardDescription>How terminal conditions impact drayage costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Terminal congestion significantly impacts drayage costs through increased wait times, 
                missed appointments, and detention charges. Understanding these factors helps in planning 
                and budgeting for drayage operations.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <Fuel className="h-6 w-6 text-amber-500 mb-2" />
                  <h4 className="font-medium mb-1">Peak Season Surcharges</h4>
                  <p className="text-xs text-muted-foreground">
                    During peak shipping seasons (Aug-Oct), congestion surcharges of 10-25% may apply.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Timer className="h-6 w-6 text-red-500 mb-2" />
                  <h4 className="font-medium mb-1">Average Wait Times</h4>
                  <p className="text-xs text-muted-foreground">
                    Major ports average 2-6 hours wait time, with spikes during labor shortages or equipment issues.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Building2 className="h-6 w-6 mb-2" style={{ color: "#2E8B57" }} />
                  <h4 className="font-medium mb-1">Appointment Systems</h4>
                  <p className="text-xs text-muted-foreground">
                    Terminal appointments can reduce wait times by 40-60%, but require advance booking.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" style={{ color: "#2E8B57" }} />
              Pro Tips for Reducing Drayage Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" style={{ color: "#2E8B57" }} />
                  Cost Optimization Strategies
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                    Utilize street turns to eliminate empty return trips
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                    Book terminal appointments during off-peak hours
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                    Pre-file customs documents to minimize dwell time
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                    Negotiate volume discounts with drayage providers
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                    Consider dedicated chassis pool arrangements
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Common Cost Pitfalls
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                    Missing free time deadlines for container returns
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                    Booking during peak hours without appointments
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                    Ignoring terminal congestion warnings
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                    Not accounting for fuel surcharge fluctuations
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                    Overlooking chassis availability constraints
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Info className="h-5 w-5" style={{ color: "#0F4C81" }} />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>What is the difference between drayage and trucking?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Drayage specifically refers to short-distance transport of shipping containers, typically 
                  from ports or rail terminals to nearby facilities (usually under 200 miles). Trucking 
                  is a broader term that includes long-haul freight transport. Drayage requires specialized 
                  equipment like chassis and drivers with specific certifications for port access.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>How are drayage rates calculated?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Drayage rates are typically calculated based on a combination of factors: base rate per mile, 
                  chassis rental fees, fuel surcharges, terminal fees, and any applicable wait time or detention 
                  charges. Rates vary by port, region, and market conditions. Our calculator provides estimates 
                  based on industry averages for each component.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>What is a chassis and why do I need one?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A chassis is a wheeled frame specifically designed to carry shipping containers during 
                  road transport. Containers cannot be moved by truck without a chassis. There are different 
                  types: standard (for 20&apos; and 40&apos; containers), extended (for 45&apos; containers), 
                  and reefer chassis (with generator sets for refrigerated containers). Chassis fees are a 
                  significant component of drayage costs.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>How can I avoid demurrage and detention charges?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  To avoid these charges: (1) Track your container free time carefully, (2) Schedule terminal 
                  appointments in advance, (3) Pre-file customs documents, (4) Ensure driver availability 
                  before free time expires, (5) Consider using a chassis pool to speed up pickup. Our calculator 
                  includes dwell time estimates to help you plan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>What is a street turn and how does it save money?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A street turn (also called &quot;double play&quot;) is when an import container is reused for 
                  an export shipment before being returned to the port. This eliminates the empty return trip 
                  and associated costs, potentially saving $200-400 per container. It requires coordination 
                  between importers and exporters, often facilitated by the drayage provider.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q6">
                <AccordionTrigger>Why do fuel surcharges vary so much?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Fuel surcharges are directly tied to diesel fuel prices and are typically adjusted weekly 
                  or monthly by carriers. They&apos;re calculated as a percentage of the base rate to help 
                  carriers manage fuel price volatility. Our calculator allows you to adjust the fuel surcharge 
                  percentage based on current market conditions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Tools</CardTitle>
            <CardDescription>Other road, rail, and port calculators you may find useful</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/tools/ocean-freight/demurrage-calculator" className="p-4 border rounded-lg hover:border-[#0F4C81] transition-colors">
                <Clock className="h-8 w-8 mb-2" style={{ color: "#0F4C81" }} />
                <h4 className="font-medium mb-1">Demurrage Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate port demurrage and detention charges</p>
              </a>
              <a href="/tools/road-rail/last-mile" className="p-4 border rounded-lg hover:border-[#2E8B57] transition-colors">
                <Truck className="h-8 w-8 mb-2" style={{ color: "#2E8B57" }} />
                <h4 className="font-medium mb-1">Last Mile Calculator</h4>
                <p className="text-xs text-muted-foreground">Estimate last-mile delivery costs</p>
              </a>
              <a href="/tools/road-rail/fuel-cost-km" className="p-4 border rounded-lg hover:border-amber-500 transition-colors">
                <Fuel className="h-8 w-8 mb-2 text-amber-500" />
                <h4 className="font-medium mb-1">Fuel Cost Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate fuel costs per kilometer</p>
              </a>
              <a href="/tools/ocean-freight/port-congestion" className="p-4 border rounded-lg hover:border-[#0F4C81] transition-colors">
                <Building2 className="h-8 w-8 mb-2" style={{ color: "#0F4C81" }} />
                <h4 className="font-medium mb-1">Port Congestion Monitor</h4>
                <p className="text-xs text-muted-foreground">Track port congestion worldwide</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
