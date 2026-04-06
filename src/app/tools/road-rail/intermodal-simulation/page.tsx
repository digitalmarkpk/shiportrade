import { Metadata } from "next";
import IntermodalCostSimulation from "@/components/tools/IntermodalCostSimulation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Train,
  Ship,
  Anchor,
  Layers,
  MapPin,
  Clock,
  DollarSign,
  Leaf,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowRight,
  Calculator,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Intermodal Cost Simulation | Shiportrade",
  description: "Build and optimize multi-modal transport routes. Simulate costs, transit times, and CO2 emissions for truck, rail, barge, and short-sea combinations.",
};

export default function IntermodalSimulationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 flex items-center justify-center">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C81]">
              Intermodal Cost Simulation
            </h1>
            <p className="text-muted-foreground">
              Build and optimize multi-modal transport routes with cost, time, and emissions analysis
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-[#0F4C81]/10 text-[#0F4C81]">
            <Truck className="h-3 w-3 mr-1" /> Truck
          </Badge>
          <Badge variant="secondary" className="bg-[#2E8B57]/10 text-[#2E8B57]">
            <Train className="h-3 w-3 mr-1" /> Rail
          </Badge>
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
            <Ship className="h-3 w-3 mr-1" /> Barge
          </Badge>
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-600">
            <Anchor className="h-3 w-3 mr-1" /> Short-Sea
          </Badge>
        </div>
      </div>

      {/* Main Component */}
      <IntermodalCostSimulation />

      {/* Educational Content */}
      <div className="mt-12 space-y-8">
        {/* Understanding Intermodal Transport */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0F4C81] flex items-center gap-2">
              <Info className="h-5 w-5" />
              Understanding Intermodal Transport
            </CardTitle>
            <CardDescription>
              Learn how combining transport modes can optimize your supply chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                Intermodal transport is the movement of freight using multiple modes of transportation
                (truck, rail, barge, or short-sea shipping) without handling the freight itself when
                changing modes. The cargo remains in the same container throughout its journey, providing
                a seamless and efficient transportation solution.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 not-prose">
                {[
                  {
                    mode: "Truck",
                    icon: Truck,
                    color: "#0F4C81",
                    description: "First/last mile delivery, flexible scheduling, door-to-door service",
                    optimal: "0-500 km",
                  },
                  {
                    mode: "Rail",
                    icon: Train,
                    color: "#2E8B57",
                    description: "Long-distance haulage, high capacity, scheduled services",
                    optimal: "300+ km",
                  },
                  {
                    mode: "Barge",
                    icon: Ship,
                    color: "#F59E0B",
                    description: "Inland waterways, lowest cost, highest capacity",
                    optimal: "200+ km with waterway access",
                  },
                  {
                    mode: "Short-Sea",
                    icon: Anchor,
                    color: "#8B5CF6",
                    description: "Coastal shipping, feeder services, port-to-port",
                    optimal: "500+ km coastal routes",
                  },
                ].map((item) => (
                  <div
                    key={item.mode}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <item.icon className="h-4 w-4" style={{ color: item.color }} />
                      </div>
                      <span className="font-semibold">{item.mode}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <Badge variant="outline" className="text-xs">
                      Optimal: {item.optimal}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0F4C81] flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Understanding Intermodal Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-[#0F4C81]/5 border border-[#0F4C81]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-5 w-5 text-[#0F4C81]" />
                  <h4 className="font-semibold">Transport Costs</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Distance-based charges for each transport segment, calculated per kilometer or per container.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Truck</span>
                    <span className="font-medium">$1.20/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rail</span>
                    <span className="font-medium">$0.35/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Barge</span>
                    <span className="font-medium">$0.15/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Short-Sea</span>
                    <span className="font-medium">$0.20/km</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#2E8B57]/5 border border-[#2E8B57]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="h-5 w-5 text-[#2E8B57]" />
                  <h4 className="font-semibold">Handling Costs</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Fixed charges for container transfers between modes at terminals and ports.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Truck transfer</span>
                    <span className="font-medium">$150/container</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rail transfer</span>
                    <span className="font-medium">$350/container</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Barge transfer</span>
                    <span className="font-medium">$500/container</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Port handling</span>
                    <span className="font-medium">$600/container</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold">Time Costs</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Waiting and dwell time charges at terminals, including storage and demurrage.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Terminal waiting</span>
                    <span className="font-medium">$20-45/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Free storage</span>
                    <span className="font-medium">3-5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Demurrage</span>
                    <span className="font-medium">$50-150/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Detention</span>
                    <span className="font-medium">$75-200/day</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CO2 Comparison */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0F4C81] flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Environmental Impact Comparison
            </CardTitle>
            <CardDescription>
              CO2 emissions vary significantly across transport modes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { mode: "Truck", co2: 62, color: "#EF4444", comparison: "Baseline" },
                { mode: "Rail", co2: 18, color: "#2E8B57", comparison: "71% lower than truck" },
                { mode: "Short-Sea", co2: 12, color: "#8B5CF6", comparison: "81% lower than truck" },
                { mode: "Barge", co2: 8, color: "#F59E0B", comparison: "87% lower than truck" },
              ].map((item) => (
                <div key={item.mode} className="flex items-center gap-4">
                  <div className="w-24 font-medium">{item.mode}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg flex items-center justify-end pr-3"
                        style={{
                          width: `${(item.co2 / 62) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      >
                        <span className="text-white text-sm font-medium">{item.co2} g CO2/tkm</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-40 text-sm text-muted-foreground">{item.comparison}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Note:</strong> Values are approximate and based on average loads. Actual emissions
              depend on vehicle type, load factor, route characteristics, and fuel type.
            </p>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0F4C81] flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Pro Tips for Intermodal Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Calculate the break-even distance",
                  description:
                    "Use the formula: Break-even km = Handling costs ÷ (Truck rate - Intermodal rate). Routes shorter than break-even are cheaper by truck; longer routes favor intermodal.",
                  icon: Calculator,
                },
                {
                  title: "Optimize terminal selection",
                  description:
                    "Choose terminals with efficient operations and good connectivity. A 24-hour delay at a terminal can eliminate intermodal cost advantages.",
                  icon: MapPin,
                },
                {
                  title: "Consider total landed cost",
                  description:
                    "Factor in inventory carrying costs, insurance, and potential delays. Faster modes reduce working capital requirements for high-value goods.",
                  icon: TrendingUp,
                },
                {
                  title: "Leverage consolidation",
                  description:
                    "Combine shipments to achieve FCL rates. LCL intermodal rates are less competitive due to additional handling at each mode change.",
                  icon: Layers,
                },
                {
                  title: "Plan for reverse logistics",
                  description:
                    "Empty container repositioning costs can add 20-30% to total transport costs. Plan round trips or find backhaul opportunities.",
                  icon: ArrowRight,
                },
                {
                  title: "Monitor reliability metrics",
                  description:
                    "Track on-time performance for each segment. Rail and barge schedules can be disrupted by weather, infrastructure issues, or congestion.",
                  icon: Clock,
                },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0F4C81] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                      <tip.icon className="h-5 w-5 text-[#0F4C81]" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0F4C81] flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  mistake: "Ignoring total transit time",
                  consequence:
                    "Focusing only on transport cost while ignoring longer transit times can lead to stockouts and lost sales.",
                },
                {
                  mistake: "Underestimating handling costs",
                  consequence:
                    "Each mode change adds handling costs. Adding too many segments can make intermodal more expensive than direct truck.",
                },
                {
                  mistake: "Not considering cargo value",
                  consequence:
                    "High-value goods may justify faster modes due to lower inventory carrying costs and insurance premiums.",
                },
                {
                  mistake: "Overlooking seasonal variations",
                  consequence:
                    "Peak seasons affect capacity and rates. Book intermodal services early during high-demand periods.",
                },
                {
                  mistake: "Neglecting terminal hours",
                  consequence:
                    "Check terminal operating hours. Arriving after hours can result in significant waiting time and demurrage charges.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-300">{item.mistake}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.consequence}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0F4C81]">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  question: "When does intermodal become more cost-effective than direct truck?",
                  answer:
                    "Intermodal typically becomes cost-effective above 300-500 km where the lower per-km rates of rail or barge offset the handling costs. The exact break-even depends on route-specific factors, cargo characteristics, and current market rates.",
                },
                {
                  question: "How much can I save by using intermodal transport?",
                  answer:
                    "Savings of 20-40% are achievable for suitable routes. A 1000km journey might cost $1,200 by truck vs $750-$850 via rail intermodal. However, savings must be weighed against longer transit times.",
                },
                {
                  question: "What is the typical transit time difference?",
                  answer:
                    "Intermodal adds 1-3 days compared to direct truck for distances under 1000km. For longer distances, the difference decreases as truck drivers must comply with hours-of-service regulations, while rail operates 24/7.",
                },
                {
                  question: "What types of cargo are best suited for intermodal?",
                  answer:
                    "Intermodal works well for non-perishable goods, consumer products, building materials, and any cargo that can be containerized. Time-sensitive or high-value goods may benefit from faster modes.",
                },
                {
                  question: "How reliable is intermodal service?",
                  answer:
                    "Modern intermodal services achieve 85-92% on-time reliability. Rail and barge operate on published schedules, which can actually be more reliable than truck during peak seasons or highway congestion.",
                },
                {
                  question: "What infrastructure is required for intermodal?",
                  answer:
                    "Intermodal requires access to rail terminals with container handling equipment, inland ports for barge operations, or coastal ports for short-sea. The origin and destination must have road access for the first/last mile.",
                },
              ].map((faq, index) => (
                <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-semibold mb-2">{faq.question}</h4>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0F4C81]">Related Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Modal Shift Comparator",
                  description: "Compare costs across transport modes",
                  href: "/tools/road-rail/modal-shift",
                  icon: TrendingUp,
                },
                {
                  name: "Route Optimizer",
                  description: "Find optimal delivery routes",
                  href: "/tools/road-rail/route-optimizer",
                  icon: MapPin,
                },
                {
                  name: "Carbon Footprint Calculator",
                  description: "Calculate CO2 emissions for shipments",
                  href: "/tools/sustainability/carbon-footprint",
                  icon: Leaf,
                },
                {
                  name: "LDM Calculator",
                  description: "Calculate loading meters for trucks",
                  href: "/tools/road-rail/ldm-calculator",
                  icon: Truck,
                },
              ].map((tool) => (
                <a
                  key={tool.name}
                  href={tool.href}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <tool.icon className="h-5 w-5 text-[#0F4C81]" />
                    <span className="font-semibold">{tool.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
