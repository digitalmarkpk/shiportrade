import { Metadata } from "next";
import { FuelCostCalculator } from "@/components/tools/FuelCostCalculator";
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
  Fuel,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  DollarSign,
  Leaf,
  Gauge,
  TrendingUp,
  Route,
  Droplet,
  Battery,
  Flame,
  Calculator,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Fuel Cost per KM Calculator | Shiportrade.com",
  description: "Calculate fuel costs per kilometer for trucks, vans, and rail. Compare diesel, gasoline, electric, and LPG options. Estimate CO2 emissions and optimize your fleet's fuel efficiency.",
  keywords: ["fuel cost calculator", "cost per km", "fuel efficiency", "diesel cost", "electric vehicle cost", "fleet management", "CO2 emissions", "fuel comparison"],
};

export default function FuelCostPerKmPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Fuel className="h-3 w-3 mr-2" />
          Road & Rail Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Fuel Cost per KM Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate total fuel costs, cost per kilometer, and CO2 emissions for your fleet.
          Compare fuel types and optimize your transport operations for maximum efficiency.
        </p>
      </div>

      {/* Calculator */}
      <FuelCostCalculator />

      {/* Educational Content */}
      <div className="mt-12 space-y-6">
        {/* What is Fuel Cost per KM */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Fuel Cost per Kilometer
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Fuel cost per kilometer is a critical metric for fleet managers and logistics operators.
              It represents the direct fuel expense incurred for every kilometer traveled and is essential for:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <DollarSign className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Route Planning</h4>
                <p className="text-sm text-muted-foreground">
                  Compare fuel costs across different routes to select the most economical option.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Gauge className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Vehicle Selection</h4>
                <p className="text-sm text-muted-foreground">
                  Choose the right vehicle for each job based on fuel efficiency and cost profiles.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Budget Forecasting</h4>
                <p className="text-sm text-muted-foreground">
                  Predict fuel expenses for future trips and annual operational budgets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fuel Types Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Fuel className="h-5 w-5 text-[var(--ocean)]" />
              Fuel Types Comparison
            </CardTitle>
            <CardDescription>Understanding the pros and cons of each fuel type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Diesel */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#1E3A5F]/10 rounded-lg">
                    <Droplet className="h-6 w-6" style={{ color: "#1E3A5F" }} />
                  </div>
                  <div>
                    <h4 className="font-medium">Diesel</h4>
                    <p className="text-xs text-muted-foreground">Most common for commercial vehicles</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>20-30% more efficient than gasoline</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Better torque for heavy loads</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Higher CO2 emissions per liter</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Subject to emissions regulations</span>
                  </div>
                </div>
              </div>

              {/* Gasoline */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#E85D04]/10 rounded-lg">
                    <Fuel className="h-6 w-6" style={{ color: "#E85D04" }} />
                  </div>
                  <div>
                    <h4 className="font-medium">Gasoline</h4>
                    <p className="text-xs text-muted-foreground">Common for light vehicles</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Lower purchase price for vehicles</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Quieter operation</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Lower fuel efficiency</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Less torque for heavy loads</span>
                  </div>
                </div>
              </div>

              {/* LPG */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                    <Flame className="h-6 w-6 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <h4 className="font-medium">LPG (Autogas)</h4>
                    <p className="text-xs text-muted-foreground">Lower emissions alternative</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Lower fuel cost per liter</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Lower CO2 emissions</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Limited refueling infrastructure</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Requires conversion or dual-fuel system</span>
                  </div>
                </div>
              </div>

              {/* Electric */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#10B981]/10 rounded-lg">
                    <Battery className="h-6 w-6" style={{ color: "#10B981" }} />
                  </div>
                  <div>
                    <h4 className="font-medium">Electric</h4>
                    <p className="text-xs text-muted-foreground">Zero-emission future</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Lowest operating cost per km</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Zero tailpipe emissions</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Higher upfront vehicle cost</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Range limitations for long haul</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fuel Cost Formula */}
        <Card className="border-[var(--ocean)]/30 bg-[var(--ocean)]/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-[var(--ocean)]">
              <Calculator className="h-5 w-5" />
              Fuel Cost Calculation Formula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The fuel cost per kilometer is calculated using the following formula:
            </p>

            <div className="p-4 bg-muted/50 rounded-lg font-mono text-center">
              <p className="text-lg mb-2">Cost per km = Fuel Price ÷ Fuel Efficiency</p>
              <p className="text-sm text-muted-foreground">where Fuel Efficiency is measured in km/L or km/kWh</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2">Total Fuel Cost</p>
                <div className="font-mono text-sm bg-muted/50 p-2 rounded">
                  Distance × (Fuel Price ÷ Efficiency)
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2">CO2 Emissions</p>
                <div className="font-mono text-sm bg-muted/50 p-2 rounded">
                  Fuel Consumed × CO2 Factor
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-300">Important Note</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    Real-world fuel consumption varies based on driving conditions, load weight, traffic,
                    weather, and vehicle maintenance. Always add a 10-15% buffer for practical planning.
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
              <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
              Pro Tips for Reducing Fuel Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Gauge className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Optimize Driving Habits</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Smooth acceleration and braking can improve fuel efficiency by 15-30%.
                    Use cruise control on highways.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Route className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Route Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Plan routes to avoid traffic congestion, reduce total distance,
                    and combine deliveries efficiently.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Regular Maintenance</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Keep engines tuned, air filters clean, and use the recommended motor oil
                    for optimal efficiency.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-medium">Tire Management</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Properly inflated tires can improve fuel efficiency by 3%.
                    Check pressure weekly and rotate tires regularly.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Reduce Idling</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Turn off engines for stops over 30 seconds. Idling wastes
                    0.5-1 gallon per hour with zero distance covered.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Fuel Card Programs</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use fleet fuel cards for discounts, expense tracking, and identifying
                    vehicles with poor fuel efficiency.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Ignoring Real-World Conditions</h4>
                <p className="text-sm text-muted-foreground">
                  Manufacturer efficiency ratings are achieved under ideal conditions. Real-world
                  driving typically uses 15-20% more fuel. Always factor in traffic, terrain, and weather.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Not Tracking Fuel Consumption</h4>
                <p className="text-sm text-muted-foreground">
                  Without consistent tracking, you can&apos;t identify efficiency problems. Monitor
                  each vehicle&apos;s actual consumption to catch issues early.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Overlooking Total Cost of Ownership</h4>
                <p className="text-sm text-muted-foreground">
                  Fuel is only one component. Consider maintenance, insurance, depreciation, and
                  resale value when evaluating vehicle economics.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Neglecting Driver Training</h4>
                <p className="text-sm text-muted-foreground">
                  Driver behavior is the biggest factor in fuel efficiency. Invest in eco-driving
                  training to see immediate cost reductions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Leaf className="h-5 w-5 text-[var(--logistics)]" />
              Environmental Impact & Sustainability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Understanding and managing your fleet&apos;s carbon footprint is increasingly important
              for regulatory compliance and corporate sustainability goals.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Fuel Type</th>
                    <th className="text-right py-3 px-4">CO2 per Liter/kWh</th>
                    <th className="text-right py-3 px-4">100km Emissions</th>
                    <th className="text-left py-3 px-4">Environmental Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Diesel</td>
                    <td className="text-right py-3 px-4">2.68 kg</td>
                    <td className="text-right py-3 px-4">~27 kg</td>
                    <td className="py-3 px-4 text-muted-foreground">High CO2, also produces NOx and particulates</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Gasoline</td>
                    <td className="text-right py-3 px-4">2.31 kg</td>
                    <td className="text-right py-3 px-4">~23 kg</td>
                    <td className="py-3 px-4 text-muted-foreground">Lower CO2 than diesel but less efficient</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">LPG</td>
                    <td className="text-right py-3 px-4">1.51 kg</td>
                    <td className="text-right py-3 px-4">~15 kg</td>
                    <td className="py-3 px-4 text-muted-foreground">Cleaner burning, lower emissions</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Electric</td>
                    <td className="text-right py-3 px-4">0.15-0.4 kg*</td>
                    <td className="text-right py-3 px-4">~2-4 kg</td>
                    <td className="py-3 px-4 text-muted-foreground">Zero tailpipe, depends on grid mix</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground">
              * Electric vehicle emissions depend on the local electricity grid&apos;s energy mix.
              Renewable grids result in near-zero emissions.
            </p>
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
                <AccordionTrigger>How accurate are the fuel efficiency estimates?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The default efficiency values represent typical real-world performance for each vehicle type.
                  However, actual consumption varies significantly based on load weight, driving conditions,
                  terrain, weather, and vehicle age. We recommend adding a 10-15% buffer for planning purposes
                  and tracking actual consumption to refine your estimates over time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2">
                <AccordionTrigger>Why does my vehicle use more fuel than the calculator shows?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Several factors increase real-world fuel consumption: heavy loads, hilly terrain, city driving
                  with frequent stops, aggressive driving, cold weather, and poor vehicle maintenance. Additionally,
                  idling consumes fuel without adding distance. Use the sensitivity analysis to see how different
                  efficiency values affect your costs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3">
                <AccordionTrigger>How do I convert between MPG and km/L?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  To convert MPG (US) to km/L, multiply by 0.425. To convert km/L to MPG (US), multiply by 2.352.
                  For example, 10 km/L equals approximately 23.5 MPG (US). The calculator handles these conversions
                  automatically when you select different efficiency units.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q4">
                <AccordionTrigger>Should I consider switching to electric vehicles?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Electric vehicles typically have lower operating costs per kilometer and zero tailpipe emissions.
                  However, consider: (1) Higher upfront purchase cost, (2) Charging infrastructure availability,
                  (3) Range limitations for long-haul routes, (4) Resale value uncertainty. Use our comparison
                  feature to calculate potential savings for your specific routes and distances.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q5">
                <AccordionTrigger>How can I track actual fuel consumption?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Best practices include: recording odometer readings and fuel amounts at each fill-up, using
                  fleet management software with fuel card integration, installing telematics devices for
                  real-time monitoring, and calculating actual efficiency (distance ÷ fuel added) weekly.
                  Compare actual vs. expected to identify vehicles needing maintenance or drivers needing training.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q6">
                <AccordionTrigger>What&apos;s included in the CO2 emission calculations?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our calculations use standard emission factors: diesel (2.68 kg CO2/liter), gasoline (2.31 kg CO2/liter),
                  LPG (1.51 kg CO2/liter), and electricity (varies by grid, typically 0.15-0.4 kg CO2/kWh). These represent
                  direct tailpipe emissions. For a complete lifecycle assessment, you&apos;d also need to consider
                  fuel production, refining, and distribution emissions (well-to-wheel).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Tools</CardTitle>
            <CardDescription>Other road and rail transport calculators you may find useful</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/tools/road-rail/axle-load" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Truck className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Axle Load Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate per-axle weight distribution</p>
              </a>
              <a href="/tools/road-rail/freight-class" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Gauge className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Freight Class Calculator</h4>
                <p className="text-xs text-muted-foreground">Determine NMFC freight class</p>
              </a>
              <a href="/tools/road-rail/route-optimizer" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Route className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Route Optimizer</h4>
                <p className="text-xs text-muted-foreground">Optimize delivery routes</p>
              </a>
              <a href="/tools/ocean-freight/carbon-tax" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Leaf className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Carbon Tax Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate carbon tax impact</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
