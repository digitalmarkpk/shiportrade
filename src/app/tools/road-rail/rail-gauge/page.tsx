import { Metadata } from "next";
import { RailGaugeCompatibility } from "@/components/tools/RailGaugeCompatibility";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Train,
  TrainTrack,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  Globe,
  Gauge,
  Wrench,
  Clock,
  DollarSign,
  Route,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Rail Gauge Compatibility Checker | Shiportrade.com",
  description: "Check rail gauge compatibility between countries, calculate transshipment costs and time, find bogie exchange locations for international rail freight.",
  keywords: ["rail gauge checker", "rail gauge compatibility", "bogie exchange", "transshipment cost", "rail freight", "gauge change", "international rail"],
};

export default function RailGaugeCompatibilityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Train className="h-3 w-3 mr-2" />
          Road & Rail Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Rail Gauge Compatibility Checker
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Check rail gauge compatibility between origin and destination countries, calculate transshipment
          costs and time delays, and find the best bogie exchange locations for your international rail freight.
        </p>
      </div>

      {/* Calculator */}
      <RailGaugeCompatibility />

      {/* Educational Content */}
      <div className="mt-12 space-y-6">
        {/* What is Rail Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Rail Gauges in International Freight
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Rail gauge is one of the most critical technical considerations in international rail freight.
              A gauge difference of just 85mm (between Standard and Russian gauge) can add days to transit
              time and thousands of dollars to shipping costs.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Gauge className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Technical Definition</h4>
                <p className="text-sm text-muted-foreground">
                  The distance between the inner sides of the two parallel rails that make up a railway track.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Globe className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Global Impact</h4>
                <p className="text-sm text-muted-foreground">
                  Over 55% of world railways use Standard gauge, but major freight corridors use different gauges.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <DollarSign className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Cost Implications</h4>
                <p className="text-sm text-muted-foreground">
                  Gauge changes can add $200-500 per container and 6-12 hours of transit time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Major Gauges Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrainTrack className="h-5 w-5 text-[var(--ocean)]" />
              Major Rail Gauges Reference
            </CardTitle>
            <CardDescription>Key gauge types used in international rail freight</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Gauge Type</th>
                    <th className="text-center py-3 px-4">Width</th>
                    <th className="text-left py-3 px-4">Primary Regions</th>
                    <th className="text-center py-3 px-4">Global Share</th>
                    <th className="text-left py-3 px-4">Key Freight Routes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#0F4C81" }} />
                        Standard Gauge
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 font-mono">1,435mm</td>
                    <td className="py-3 px-4">North America, Europe, China, Australia</td>
                    <td className="text-center py-3 px-4">~55%</td>
                    <td className="py-3 px-4 text-muted-foreground">Trans-Siberian (Chinese section), Europe-China</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#DC2626" }} />
                        Russian Gauge
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 font-mono">1,520mm</td>
                    <td className="py-3 px-4">Russia, CIS countries, Finland, Mongolia</td>
                    <td className="text-center py-3 px-4">~12%</td>
                    <td className="py-3 px-4 text-muted-foreground">Trans-Siberian Railway, Northern Corridor</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#2E8B57" }} />
                        Indian Broad Gauge
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 font-mono">1,676mm</td>
                    <td className="py-3 px-4">India, Pakistan, Bangladesh, Argentina</td>
                    <td className="text-center py-3 px-4">~7%</td>
                    <td className="py-3 px-4 text-muted-foreground">Indian Railways network, South Asia freight</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#8B5CF6" }} />
                        Meter Gauge
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 font-mono">1,000mm</td>
                    <td className="py-3 px-4">Southeast Asia, Africa, South America</td>
                    <td className="text-center py-3 px-4">~10%</td>
                    <td className="py-3 px-4 text-muted-foreground">Vietnam-China corridor, African networks</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#EC4899" }} />
                        Cape Gauge
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 font-mono">1,067mm</td>
                    <td className="py-3 px-4">Japan (most lines), South Africa, Australia, NZ</td>
                    <td className="text-center py-3 px-4">~8%</td>
                    <td className="py-3 px-4 text-muted-foreground">Japanese freight, African mineral lines</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F59E0B" }} />
                        Irish Broad Gauge
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 font-mono">1,600mm</td>
                    <td className="py-3 px-4">Ireland, Brazil (parts)</td>
                    <td className="text-center py-3 px-4">~3%</td>
                    <td className="py-3 px-4 text-muted-foreground">Irish Rail, Brazilian regional lines</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Transshipment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[var(--logistics)]" />
              Transshipment Methods Explained
            </CardTitle>
            <CardDescription>How freight moves between different gauge networks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <Wrench className="h-8 w-8 text-[var(--ocean)] mb-3" />
                <h4 className="font-medium mb-2">Bogie Exchange</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Wheelsets (bogies) are swapped at gauge change points. The freight wagon remains
                  on jacks while new wheelsets are attached.
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">6-12 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium">$200-400/container</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Best for:</span>
                    <span className="font-medium">Regular wagons</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <Route className="h-8 w-8 text-[var(--logistics)] mb-3" />
                <h4 className="font-medium mb-2">Container Transshipment</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Containers are lifted by crane from one train to another. Required when
                  wagons cannot undergo bogie exchange.
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">8-16 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium">$300-600/container</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Best for:</span>
                    <span className="font-medium">Specialized cargo</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/30">
                <Train className="h-8 w-8 text-amber-500 mb-3" />
                <h4 className="font-medium mb-2">Variable Gauge Axles</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatic gauge adjustment while moving through a special installation.
                  Fastest method but limited availability.
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">10-30 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium">$350-500/container</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Best for:</span>
                    <span className="font-medium">Passenger/special</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Major Corridors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-[var(--ocean)]" />
              Major International Rail Corridors with Gauge Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "China-Europe Railway (New Silk Road)",
                  gauges: ["Standard (China)", "Russian (Kazakhstan/Russia)", "Standard (Europe)"],
                  gaugeChanges: 2,
                  locations: ["Dostyk/Altynkol (KZ)", "Brest/Malaszewicze (BY/PL)"],
                  transitTime: "14-18 days",
                  annualTEU: "~600,000 TEU (2023)",
                },
                {
                  name: "Trans-Siberian Railway",
                  gauges: ["Russian (Russia)", "Standard (China)", "Russian (Mongolia)"],
                  gaugeChanges: 2,
                  locations: ["Zabaykalsk/Manzhouli", "Naushki/Sukhbaatar"],
                  transitTime: "15-20 days",
                  annualTEU: "~200,000 TEU",
                },
                {
                  name: "Iran-Turkmenistan-Kazakhstan",
                  gauges: ["Standard (Iran)", "Russian (Turkmenistan/Kazakhstan)"],
                  gaugeChanges: 1,
                  locations: ["Sarakhs"],
                  transitTime: "7-10 days",
                  annualTEU: "~50,000 TEU",
                },
                {
                  name: "Vietnam-China Corridor",
                  gauges: ["Meter (Vietnam)", "Standard (China)"],
                  gaugeChanges: 1,
                  locations: ["Dong Dang"],
                  transitTime: "3-5 days",
                  annualTEU: "~30,000 TEU",
                },
              ].map((corridor, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{corridor.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {corridor.gaugeChanges} gauge change{corridor.gaugeChanges > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Gauges</p>
                      <div className="flex flex-wrap gap-1">
                        {corridor.gauges.map((g, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{g}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Change Locations</p>
                      <p className="font-medium">{corridor.locations.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Transit Time</p>
                      <p className="font-medium">{corridor.transitTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Annual Volume</p>
                      <p className="font-medium">{corridor.annualTEU}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
              Pro Tips for Rail Freight Planning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                  Best Practices
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                    Book gauge change slots in advance during peak seasons
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                    Factor in 1-2 buffer days at gauge change points
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                    Negotiate volume discounts for regular shipments
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                    Consider alternative routing through compatible gauge networks
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                    Ensure proper documentation for customs at gauge borders
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Common Mistakes
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    Underestimating time required for gauge changes
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    Not accounting for peak season delays
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    Assuming all railcars can undergo bogie exchange
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    Forgetting customs clearance time at gauge borders
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    Not planning for cargo compatibility with exchange facilities
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
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>What happens during a bogie exchange?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  During a bogie exchange, the railcar is lifted using jacks, the existing wheelsets (bogies)
                  are rolled out, and new wheelsets matching the destination gauge are rolled in and attached.
                  The process typically takes 6-12 hours for an entire train and requires specialized facilities
                  with exchange pits and equipment. The cargo itself remains on the wagon throughout the process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Can all types of cargo undergo bogie exchange?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Most standard freight wagons and containers can undergo bogie exchange. However, some specialized
                  equipment like certain tank cars, oversized cargo on flatcars, or wagons with non-standard
                  dimensions may require container transshipment instead. Always verify compatibility with your
                  rail operator before shipping.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>How accurate are the cost estimates?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The cost estimates provided are based on average market rates and should be used as a planning
                  guide. Actual costs vary based on the specific route, volume, time of year, and negotiating
                  power. For precise quotes, contact rail operators or freight forwarders specializing in the
                  relevant corridor.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>Why is Russia&apos;s gauge different from Europe?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Russia adopted the 5-foot (1,520mm) gauge in the 1840s under the guidance of American engineer
                  George Washington Whistler, who considered it superior for the harsh Russian climate and heavy
                  loads. The difference from European Standard gauge (1,435mm) later proved strategically
                  valuable during both World Wars, as invading forces could not easily use Russian railways.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>Can trains run on multiple gauges?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, through Variable Gauge Axles (VGA) technology, also known as gauge-changing systems.
                  Trains equipped with VGA can adjust their wheel spacing while moving slowly through a special
                  installation. This is primarily used for passenger services (like the Spanish AVE and some
                  European cross-border services) but is increasingly being considered for freight applications.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q6">
                <AccordionTrigger>How do I find the best route for my rail freight?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Use this tool to check gauge compatibility along your planned route. Consider factors beyond
                  gauge alone: transit time, cost per TEU, reliability, customs requirements, and seasonal
                  variations. For complex multi-country shipments, consult with specialized rail freight
                  forwarders who can optimize routing and handle documentation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Tools</CardTitle>
            <CardDescription>Other road and rail calculators you may find useful</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/tools/road-rail/axle-load" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Train className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Axle Load Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate truck axle weight distribution</p>
              </a>
              <a href="/tools/road-rail/modal-shift" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Route className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Modal Shift Comparator</h4>
                <p className="text-xs text-muted-foreground">Compare road vs rail transport costs</p>
              </a>
              <a href="/tools/road-rail/intermodal-simulation" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <TrainTrack className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Intermodal Simulation</h4>
                <p className="text-xs text-muted-foreground">Simulate intermodal transport scenarios</p>
              </a>
              <a href="/tools/ocean-freight/transit-time" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Clock className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Transit Time Calculator</h4>
                <p className="text-xs text-muted-foreground">Estimate shipping transit times</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
