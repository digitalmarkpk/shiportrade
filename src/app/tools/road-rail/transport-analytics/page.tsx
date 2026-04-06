import { Metadata } from "next";
import { TransportAnalyticsDashboard } from "@/components/tools/TransportAnalyticsDashboard";
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
  BarChart3,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Gauge,
  TrendingUp,
  Route,
  Users,
  Fuel,
  PieChart,
  Target,
  Zap,
  Activity,
  Clock,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Transport Analytics Dashboard | Shiportrade.com",
  description: "Comprehensive transport analytics dashboard for fleet performance, cost analysis, utilization metrics, route efficiency, driver performance, and fuel consumption tracking.",
  keywords: ["transport analytics", "fleet management", "cost analysis", "route optimization", "driver performance", "fuel efficiency", "logistics dashboard"],
};

export default function TransportAnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <BarChart3 className="h-3 w-3 mr-2" />
          Road & Rail Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Transport Analytics Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Comprehensive analytics for your transport operations. Monitor fleet performance,
          analyze costs, track utilization, optimize routes, and improve driver efficiency.
        </p>
      </div>

      {/* Dashboard */}
      <TransportAnalyticsDashboard />

      {/* Educational Content */}
      <div className="mt-12 space-y-6">
        {/* What is Transport Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Transport Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Transport analytics provides actionable insights into your fleet operations,
              helping you make data-driven decisions to improve efficiency, reduce costs,
              and enhance service quality. Key areas include:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Truck className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Fleet Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor vehicle utilization, maintenance schedules, and overall fleet health.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <DollarSign className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Cost Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze operational costs per kilometer and identify savings opportunities.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Route className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Route Efficiency</h4>
                <p className="text-sm text-muted-foreground">
                  Optimize routes to reduce fuel consumption and improve delivery times.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Explained */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5 text-[var(--ocean)]" />
              Key Performance Metrics
            </CardTitle>
            <CardDescription>Understanding the metrics that drive your transport operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fleet Metrics */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[var(--ocean)]" />
                  Fleet Metrics
                </h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Fleet Utilization</span>
                      <Badge variant="outline">Target: 90%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Percentage of vehicles actively generating revenue vs total fleet.
                      Higher utilization means better ROI on fleet assets.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">On-Time Delivery</span>
                      <Badge variant="outline">Target: 95%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Percentage of deliveries completed within the promised time window.
                      Critical for customer satisfaction and contract compliance.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Deadhead Percentage</span>
                      <Badge variant="outline">Target: &lt;10%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Empty miles as a percentage of total miles. Lower deadhead means
                      better efficiency and lower costs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost Metrics */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                  Cost Metrics
                </h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Cost per Kilometer</span>
                      <Badge variant="outline">Industry: $0.85-1.20</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total operating cost divided by distance traveled. Includes fuel,
                      labor, maintenance, insurance, and depreciation.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Fuel Cost Ratio</span>
                      <Badge variant="outline">Benchmark: 35-45%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Fuel costs as a percentage of total operating costs. A key metric
                      for identifying efficiency improvements.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Maintenance Cost/km</span>
                      <Badge variant="outline">Benchmark: $0.08-0.15</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Preventive and corrective maintenance costs per kilometer.
                      Lower costs indicate better vehicle reliability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="border-[var(--ocean)]/30 bg-[var(--ocean)]/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-[var(--ocean)]">
              <PieChart className="h-5 w-5" />
              Transport Cost Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Understanding your cost breakdown is essential for identifying optimization opportunities.
              Typical transport operations have the following cost distribution:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Cost Category</th>
                    <th className="text-center py-3 px-4">Typical %</th>
                    <th className="text-left py-3 px-4">Key Drivers</th>
                    <th className="text-left py-3 px-4">Optimization Strategies</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Fuel</td>
                    <td className="text-center py-3 px-4">35-45%</td>
                    <td className="py-3 px-4 text-muted-foreground">Fuel prices, vehicle efficiency, routes</td>
                    <td className="py-3 px-4 text-muted-foreground">Route optimization, driver training, fuel cards</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Labor</td>
                    <td className="text-center py-3 px-4">25-35%</td>
                    <td className="py-3 px-4 text-muted-foreground">Wages, benefits, overtime</td>
                    <td className="py-3 px-4 text-muted-foreground">Efficient scheduling, productivity incentives</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Maintenance</td>
                    <td className="text-center py-3 px-4">8-15%</td>
                    <td className="py-3 px-4 text-muted-foreground">Vehicle age, maintenance practices</td>
                    <td className="py-3 px-4 text-muted-foreground">Preventive maintenance, fleet renewal</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Depreciation</td>
                    <td className="text-center py-3 px-4">6-12%</td>
                    <td className="py-3 px-4 text-muted-foreground">Vehicle cost, usage, market value</td>
                    <td className="py-3 px-4 text-muted-foreground">Optimal fleet age, resale timing</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Insurance</td>
                    <td className="text-center py-3 px-4">3-6%</td>
                    <td className="py-3 px-4 text-muted-foreground">Coverage type, claims history</td>
                    <td className="py-3 px-4 text-muted-foreground">Safety programs, risk management</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Tolls & Other</td>
                    <td className="text-center py-3 px-4">3-8%</td>
                    <td className="py-3 px-4 text-muted-foreground">Routes, permits, admin costs</td>
                    <td className="py-3 px-4 text-muted-foreground">Route planning, technology adoption</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Fuel Efficiency Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Fuel className="h-5 w-5 text-[var(--ocean)]" />
              Fuel Efficiency Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Gauge className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Driver Training</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Eco-driving techniques can improve fuel efficiency by 5-15%. Focus on smooth acceleration,
                    maintaining steady speeds, and reducing idling.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Route className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Route Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use GPS and traffic data to avoid congestion. Plan routes to minimize total distance
                    and avoid urban areas during peak hours.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Vehicle Maintenance</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Properly inflated tires alone can improve fuel economy by 3%. Regular engine tuning
                    and clean air filters also contribute to efficiency.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-medium">Reduce Idling</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Idling consumes 0.5-1 gallon per hour. Implement anti-idling policies and use
                    auxiliary power units for climate control during stops.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-medium">Load Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximize load capacity on each trip. Better load planning reduces the number
                    of trips needed and improves fuel efficiency per ton-km.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-medium">Speed Management</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fuel efficiency decreases significantly above 80 km/h. Each 8 km/h over this
                    threshold increases fuel consumption by approximately 10%.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-[var(--ocean)]" />
              Driver Performance Management
            </CardTitle>
            <CardDescription>Key metrics for evaluating and improving driver performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Driver behavior is the single largest controllable factor in transport costs.
              Effective driver performance management can reduce fuel costs by 5-30% and
              significantly improve safety outcomes.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Performance Indicators</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                    <span>Safety Score (speeding, harsh braking, cornering)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                    <span>Fuel Efficiency (km/L compared to vehicle baseline)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                    <span>On-Time Delivery Rate</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                    <span>Customer Satisfaction Ratings</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                    <span>Compliance (HOS, documentation, procedures)</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Improvement Strategies</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-[var(--ocean)]" />
                    <span>Regular performance feedback and coaching</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-[var(--ocean)]" />
                    <span>Incentive programs for top performers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-[var(--ocean)]" />
                    <span>Telematics for real-time behavior monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-[var(--ocean)]" />
                    <span>Targeted training for underperforming areas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-[var(--ocean)]" />
                    <span>Recognition programs and leaderboards</span>
                  </div>
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
              Common Analytics Pitfalls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Focusing on Averages Only</h4>
                <p className="text-sm text-muted-foreground">
                  Averages can hide significant variation. A 90% on-time rate might mean consistent
                  90% performance, or 50% perfect and 50% very late. Analyze distributions.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Ignoring External Factors</h4>
                <p className="text-sm text-muted-foreground">
                  Seasonal demand, weather, road conditions, and fuel prices all impact metrics.
                  Compare against realistic baselines, not arbitrary targets.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Data Overload</h4>
                <p className="text-sm text-muted-foreground">
                  Too many metrics can paralyze decision-making. Focus on 3-5 KPIs that directly
                  impact business objectives and review others monthly.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Not Acting on Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Analytics are only valuable if they drive action. Establish clear processes
                  for reviewing data and implementing improvements.
                </p>
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
                <AccordionTrigger>How often should I review transport analytics?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Daily review of critical metrics like on-time delivery and active vehicles is recommended.
                  Weekly reviews should cover utilization rates and cost per km. Monthly deep-dives
                  into driver performance and route optimization provide strategic insights.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2">
                <AccordionTrigger>What is a good fleet utilization rate?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Industry benchmarks suggest 85-95% utilization is optimal. Below 85% indicates
                  excess capacity or inefficient scheduling. Above 95% may strain maintenance
                  schedules and driver availability, leading to service disruptions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3">
                <AccordionTrigger>How can I reduce deadhead miles?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Strategies include: improving load planning to find backhaul opportunities,
                  using freight matching platforms, expanding service territory to increase
                  load density, and collaborating with other carriers for relay shipments.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q4">
                <AccordionTrigger>What technology helps with transport analytics?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Key technologies include telematics/GPS tracking, transportation management
                  systems (TMS), electronic logging devices (ELD), fuel management systems,
                  and business intelligence tools. Integration between systems is crucial
                  for comprehensive analytics.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q5">
                <AccordionTrigger>How do I calculate true cost per kilometer?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  True cost per km includes all operating costs: fuel, driver wages and benefits,
                  vehicle maintenance and repairs, insurance, tolls, permits, depreciation,
                  and administrative overhead. Divide total monthly costs by total kilometers
                  driven. Track trends over time to identify improvement opportunities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q6">
                <AccordionTrigger>What KPIs should I prioritize?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Focus on KPIs aligned with business goals. For cost reduction: cost per km,
                  fuel efficiency, deadhead percentage. For service quality: on-time delivery,
                  customer satisfaction. For safety: accident rate, safety score. For efficiency:
                  fleet utilization, load factor. Start with 3-5 key metrics.
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
              <a href="/tools/road-rail/fuel-cost-km" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Fuel className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Fuel Cost per KM</h4>
                <p className="text-xs text-muted-foreground">Calculate fuel costs and efficiency</p>
              </a>
              <a href="/tools/road-rail/route-optimizer" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Route className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Route Optimizer</h4>
                <p className="text-xs text-muted-foreground">Optimize delivery routes</p>
              </a>
              <a href="/tools/road-rail/axle-load" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Truck className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Axle Load Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate weight distribution</p>
              </a>
              <a href="/tools/ocean-freight/carbon-footprint" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <TrendingUp className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Carbon Footprint</h4>
                <p className="text-xs text-muted-foreground">Calculate transport emissions</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
