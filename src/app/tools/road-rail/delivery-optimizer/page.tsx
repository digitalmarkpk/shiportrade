import { Metadata } from "next";
import DeliveryRouteOptimizer from "@/components/tools/DeliveryRouteOptimizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  DollarSign,
  Route,
  CheckCircle,
  AlertTriangle,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Delivery Route Optimizer | Shiportrade",
  description: "Optimize multi-stop delivery routes with time windows, vehicle capacity constraints, distance matrix calculation, and cost optimization for logistics operations.",
};

const features = [
  {
    icon: MapPin,
    title: "Multiple Stops",
    description: "Add and manage multiple delivery stops with detailed information including demand, service time, and priority levels.",
    color: "#0F4C81",
  },
  {
    icon: Route,
    title: "Distance Matrix",
    description: "Automatically calculate distances and travel times between all stops using geospatial coordinates.",
    color: "#2E8B57",
  },
  {
    icon: Clock,
    title: "Time Windows",
    description: "Set delivery time windows for each stop. The optimizer ensures on-time arrivals or flags violations.",
    color: "#F59E0B",
  },
  {
    icon: Truck,
    title: "Vehicle Capacity",
    description: "Configure vehicle types with capacity, volume, fuel efficiency, and cost parameters.",
    color: "#8B5CF6",
  },
  {
    icon: Route,
    title: "Route Sequencing",
    description: "Intelligent stop ordering using nearest-neighbor heuristic with time window constraints.",
    color: "#EF4444",
  },
  {
    icon: DollarSign,
    title: "Cost Optimization",
    description: "Calculate total costs including fuel, labor, and fixed costs. Optimize for distance, time, or cost.",
    color: "#3B82F6",
  },
];

const vehicleTypes = [
  { name: "Small Van", capacity: "800 kg", volume: "6 m³", bestFor: "Last-mile urban deliveries" },
  { name: "Large Van", capacity: "1,500 kg", volume: "12 m³", bestFor: "Regional distribution" },
  { name: "Small Truck (3.5T)", capacity: "2,500 kg", volume: "18 m³", bestFor: "Small business deliveries" },
  { name: "Medium Truck (7.5T)", capacity: "5,000 kg", volume: "35 m³", bestFor: "Wholesale distribution" },
  { name: "Large Truck (18T)", capacity: "12,000 kg", volume: "60 m³", bestFor: "Industrial deliveries" },
  { name: "Tractor Trailer (40T)", capacity: "28,000 kg", volume: "90 m³", bestFor: "Long-haul freight" },
];

const proTips = [
  {
    title: "Prioritize High-Value Customers",
    description: "Set high priority for time-sensitive or VIP customers. The optimizer will sequence these stops first.",
  },
  {
    title: "Consider Traffic Patterns",
    description: "Adjust average speed based on time of day. Morning deliveries in urban areas may need lower speeds due to rush hour.",
  },
  {
    title: "Use Realistic Service Times",
    description: "Include unloading time, paperwork, and potential delays. Underestimating service times leads to missed time windows.",
  },
  {
    title: "Plan for Buffer Time",
    description: "Don't schedule 100% of available hours. Leave 10-15% buffer for unexpected delays and driver breaks.",
  },
  {
    title: "Validate Capacity Before Routing",
    description: "Ensure total demand doesn't exceed vehicle capacity. An overloaded route will need to be split.",
  },
  {
    title: "Review Time Window Violations",
    description: "Early arrivals (waiting) are often acceptable, but late arrivals should be avoided for customer satisfaction.",
  },
];

const commonMistakes = [
  {
    mistake: "Ignoring Priority Levels",
    consequence: "Important customers may receive late deliveries, impacting satisfaction.",
    solution: "Always set priority levels for stops based on customer importance and delivery urgency.",
  },
  {
    mistake: "Overloading Vehicles",
    consequence: "Routes become infeasible, requiring emergency splitting and extra costs.",
    solution: "Check total demand against vehicle capacity before finalizing routes.",
  },
  {
    mistake: "Unrealistic Time Windows",
    consequence: "Too many violations, driver stress, and customer complaints.",
    solution: "Use realistic time windows based on customer availability and traffic patterns.",
  },
  {
    mistake: "Not Considering Service Time",
    consequence: "Actual route time exceeds estimates, causing cascading delays.",
    solution: "Include realistic service times for loading, unloading, and documentation.",
  },
];

export default function DeliveryOptimizerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-[#0F4C81]">Road & Rail</Badge>
          <Badge variant="outline" className="border-[#2E8B57] text-[#2E8B57]">Route Optimization</Badge>
        </div>
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Delivery Route Optimizer
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Optimize multi-stop delivery routes with intelligent sequencing, time window constraints, vehicle capacity management, and comprehensive cost analysis.
        </p>
      </div>

      {/* Tool Component */}
      <DeliveryRouteOptimizer />

      {/* Features Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6">How It Works</h2>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#0F4C81] text-white flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Add Stops</h3>
                <p className="text-sm text-muted-foreground">
                  Enter delivery locations with demand, time windows, and priority levels
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#2E8B57] text-white flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Configure Vehicle</h3>
                <p className="text-sm text-muted-foreground">
                  Select vehicle type and set operational parameters like fuel price and average speed
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Run Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Algorithm calculates optimal route sequence using nearest-neighbor heuristic
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold mb-2">Analyze Results</h3>
                <p className="text-sm text-muted-foreground">
                  Review optimized route, costs, time window compliance, and recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Types Reference */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6">Vehicle Types Reference</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Vehicle Type</th>
                    <th className="text-left p-3 font-medium">Max Capacity</th>
                    <th className="text-left p-3 font-medium">Volume</th>
                    <th className="text-left p-3 font-medium">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleTypes.map((vehicle, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="p-3 font-medium">{vehicle.name}</td>
                      <td className="p-3">{vehicle.capacity}</td>
                      <td className="p-3">{vehicle.volume}</td>
                      <td className="p-3 text-muted-foreground">{vehicle.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tips */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6">
          <Zap className="inline-block mr-2 h-6 w-6 text-amber-500" />
          Pro Tips for Route Optimization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proTips.map((tip, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6">
          <AlertTriangle className="inline-block mr-2 h-6 w-6 text-amber-500" />
          Common Mistakes to Avoid
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {commonMistakes.map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-500 font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-600 dark:text-red-400">{item.mistake}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Consequence:</strong> {item.consequence}
                      </p>
                      <p className="text-sm text-[#2E8B57] mt-1">
                        <strong>Solution:</strong> {item.solution}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="q1" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              What optimization algorithm does this tool use?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              This tool uses a nearest-neighbor heuristic with time window constraints. The algorithm prioritizes stops by combining distance, time window tightness, and priority levels. While not guaranteed to find the optimal solution, it provides good results quickly for practical route planning.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              How are distances and travel times calculated?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Distances are calculated using the Haversine formula based on geographic coordinates, then adjusted to simulate real road distances. Travel times are derived from distances using the configured average speed. For production use, consider integrating with mapping APIs like Google Maps or Mapbox for accurate road distances.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              What happens when a time window is violated?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              The optimizer flags two types of violations: early arrivals (vehicle arrives before the time window opens) and late arrivals (vehicle arrives after the time window closes). Early arrivals result in waiting time, while late arrivals are highlighted as issues that may need route adjustments.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              Can I handle multiple vehicles or multi-day routes?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              The current version optimizes a single vehicle route. For multi-vehicle fleet routing (Vehicle Routing Problem), the route would need to be split by capacity or geographic zones. Multi-day routes can be planned by treating each day as a separate route with overnight rest periods.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              How is the total cost calculated?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Total cost includes three components: Fuel Cost (total distance ÷ fuel efficiency × fuel price), Labor Cost (total time × hourly driver wage), and Fixed Cost (per-route operational overhead). The optimizer can be set to minimize any of these or the total.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q6" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              What is capacity utilization and why does it matter?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Capacity utilization shows the percentage of vehicle capacity used by the total demand. A utilization above 100% means the route is infeasible and must be split. Optimal utilization is typically 70-90%, allowing room for last-minute additions while ensuring efficiency.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Related Tools */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6">Related Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/tools/road-rail/route-optimizer">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-4">
                <Route className="h-8 w-8 text-[#0F4C81] mb-3" />
                <h3 className="font-medium mb-1">Route Optimizer</h3>
                <p className="text-sm text-muted-foreground">Basic point-to-point route optimization</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/tools/road-rail/last-mile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-4">
                <Truck className="h-8 w-8 text-[#2E8B57] mb-3" />
                <h3 className="font-medium mb-1">Last Mile Calculator</h3>
                <p className="text-sm text-muted-foreground">Calculate last-mile delivery costs</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/tools/road-rail/axle-load">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-4">
                <Package className="h-8 w-8 text-amber-500 mb-3" />
                <h3 className="font-medium mb-1">Axle Load Calculator</h3>
                <p className="text-sm text-muted-foreground">Ensure legal weight distribution</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/tools/road-rail/multimodal-planner">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-4">
                <MapPin className="h-8 w-8 text-purple-500 mb-3" />
                <h3 className="font-medium mb-1">Multimodal Planner</h3>
                <p className="text-sm text-muted-foreground">Plan multi-modal transport routes</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12">
        <Card className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to Optimize Your Delivery Routes?</h3>
                <p className="text-white/80">
                  Use our free tool above or contact us for enterprise fleet optimization solutions.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <a href="#top">
                    Try Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
