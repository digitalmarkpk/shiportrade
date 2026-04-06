"use client";

import { ContainerUtilizationTracker } from "@/components/tools/ContainerUtilizationTracker";
import {
  Container,
  Gauge,
  Clock,
  Route,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Ship,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function ContainerUtilizationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--ocean)] via-[var(--ocean)]/90 to-[var(--logistics)]/80 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-white/20 text-white">Ocean Freight</Badge>
              <Badge className="bg-white/20 text-white">Fleet Management</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Container Utilization Tracker
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              Monitor fleet performance, optimize utilization rates, reduce idle time, and minimize repositioning costs with real-time analytics and actionable insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Container className="h-5 w-5" />
                <span>Fleet Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                <span>Utilization Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Idle Time Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                <span>Repositioning Costs</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Demand Forecast</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                <span>Optimization Tips</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <ContainerUtilizationTracker />
        </div>
      </section>

      {/* Educational Content */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Understanding Container Utilization
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* What is Container Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                    What is Utilization Rate?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Container utilization rate measures the percentage of your fleet actively generating revenue. 
                    It&apos;s calculated as:
                  </p>
                  <div className="p-3 bg-muted rounded-lg text-sm font-mono mb-4">
                    (Containers In Use / Total Fleet) × 100
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A healthy utilization rate typically ranges from 70-85%, balancing revenue generation with 
                    fleet availability for new bookings.
                  </p>
                </CardContent>
              </Card>

              {/* Idle Time Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    Impact of Idle Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Idle containers cost money through storage fees and lost opportunity. Key costs include:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                      <span>Port storage fees ($30-80/day)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                      <span>Depreciation and maintenance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                      <span>Lost rental revenue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                      <span>Capital opportunity cost</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Repositioning Costs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Route className="h-5 w-5 text-red-500" />
                    Repositioning Costs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Moving empty containers to where they&apos;re needed is a major expense:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Average $650-2,150 per move</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Trade imbalance drives costs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Can reach 20-30% of fleet costs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Seasonal patterns affect planning</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics Table */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-[var(--ocean)]" />
                  Key Performance Indicators
                </CardTitle>
                <CardDescription>
                  Industry benchmarks for container fleet management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Metric</th>
                        <th className="text-center py-3 px-4">Poor</th>
                        <th className="text-center py-3 px-4">Average</th>
                        <th className="text-center py-3 px-4">Good</th>
                        <th className="text-center py-3 px-4">Excellent</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Utilization Rate</td>
                        <td className="text-center py-3 px-4 text-red-500">&lt;60%</td>
                        <td className="text-center py-3 px-4 text-yellow-500">60-70%</td>
                        <td className="text-center py-3 px-4 text-[var(--logistics)]">70-80%</td>
                        <td className="text-center py-3 px-4 text-[var(--ocean)]">&gt;80%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Average Idle Days</td>
                        <td className="text-center py-3 px-4 text-red-500">&gt;21 days</td>
                        <td className="text-center py-3 px-4 text-yellow-500">14-21 days</td>
                        <td className="text-center py-3 px-4 text-[var(--logistics)]">7-14 days</td>
                        <td className="text-center py-3 px-4 text-[var(--ocean)]">&lt;7 days</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Repositioning Cost/TEU</td>
                        <td className="text-center py-3 px-4 text-red-500">&gt;$500</td>
                        <td className="text-center py-3 px-4 text-yellow-500">$300-500</td>
                        <td className="text-center py-3 px-4 text-[var(--logistics)]">$150-300</td>
                        <td className="text-center py-3 px-4 text-[var(--ocean)]">&lt;$150</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Fleet Availability</td>
                        <td className="text-center py-3 px-4 text-red-500">&lt;25%</td>
                        <td className="text-center py-3 px-4 text-yellow-500">25-35%</td>
                        <td className="text-center py-3 px-4 text-[var(--logistics)]">35-45%</td>
                        <td className="text-center py-3 px-4 text-[var(--ocean)]">&gt;45%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--logistics)]" />
                Pro Tips for Container Fleet Optimization
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "Implement Street Turns",
                    description: "Enable direct container interchange between importers and exporters to reduce empty trips and improve availability.",
                    icon: "🔄",
                  },
                  {
                    title: "Optimize Depot Locations",
                    description: "Position empty container depots strategically near high-demand areas to minimize repositioning distances.",
                    icon: "📍",
                  },
                  {
                    title: "Negotiate Backhaul Rates",
                    description: "Work with carriers to secure competitive rates for returning empty containers on imbalanced routes.",
                    icon: "💰",
                  },
                  {
                    title: "Use Forecasting Tools",
                    description: "Leverage demand forecasting to anticipate seasonal peaks and position containers proactively.",
                    icon: "📊",
                  },
                  {
                    title: "Monitor Dwell Time",
                    description: "Track container dwell time at each location to identify bottlenecks and implement improvement programs.",
                    icon: "⏱️",
                  },
                  {
                    title: "Consider Leasing Options",
                    description: "Use short-term leasing during peak seasons instead of permanent fleet expansion to maintain flexibility.",
                    icon: "📋",
                  },
                ].map((tip, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-2xl mb-2">{tip.icon}</div>
                      <h4 className="font-medium mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Common Mistakes */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Over-provisioning Fleet</p>
                      <p className="text-sm text-muted-foreground">
                        Maintaining excess containers leads to higher capital costs, storage fees, and maintenance 
                        expenses. Right-size your fleet based on actual demand patterns.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Ignoring Seasonal Patterns</p>
                      <p className="text-sm text-muted-foreground">
                        Failing to account for seasonal demand fluctuations can lead to shortages during peaks and 
                        excess capacity during troughs. Plan ahead with historical data.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Neglecting Trade Imbalances</p>
                      <p className="text-sm text-muted-foreground">
                        Ignoring persistent trade imbalances results in containers accumulating in wrong locations. 
                        Develop strategies to address structural imbalances.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Delayed Container Returns</p>
                      <p className="text-sm text-muted-foreground">
                        Not enforcing timely container returns leads to detention charges and reduced fleet availability. 
                        Implement tracking and incentive programs.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1">
                  <AccordionTrigger>What is a good container utilization rate?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      A healthy container utilization rate typically falls between 70-85%. Rates below 60% indicate 
                      underutilization and excess costs, while rates above 85% may signal capacity constraints and 
                      risk of missed bookings. The optimal rate depends on your specific trade routes, seasonality, 
                      and customer service requirements.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>How can I reduce container idle time?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Key strategies include implementing street turn programs, optimizing depot locations, 
                      improving container tracking visibility, negotiating faster free time with customers, 
                      and using predictive analytics to anticipate demand. Focus on high-idle locations first 
                      and consider incentive programs for faster container returns.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>What drives repositioning costs?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Repositioning costs are driven by trade imbalances (more exports than imports in a region), 
                      seasonal demand variations, carrier schedule changes, and customer distribution patterns. 
                      The average cost per move ranges from $650 (intra-regional) to $2,150 (inter-continental), 
                      including handling, transport, and administrative expenses.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4">
                  <AccordionTrigger>How accurate are demand forecasts?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Demand forecast accuracy varies based on data quality, market volatility, and forecasting 
                      methodology. Our system typically achieves 80-90% confidence for 3-month forecasts. 
                      Accuracy decreases for longer time horizons and during periods of high market disruption. 
                      We recommend combining forecasts with expert judgment for critical decisions.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q5">
                  <AccordionTrigger>What container types should I prioritize?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Prioritization depends on your trade patterns. Standard 40&apos; HC containers typically 
                      offer the best ROI due to high demand and versatility. Reefer containers command premium 
                      rates but require higher maintenance. Special equipment (open top, flat rack) should be 
                      maintained at minimum viable levels due to lower utilization and higher costs.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q6">
                  <AccordionTrigger>How often should I review fleet performance?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      We recommend daily monitoring of key metrics (utilization, available fleet), weekly review 
                      of operational KPIs (idle time by location, booking acceptance), monthly analysis of trends 
                      and repositioning costs, and quarterly strategic reviews of fleet composition and 
                      long-term planning. Use automated alerts for threshold breaches.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Related Tools */}
            <div>
              <h3 className="text-xl font-bold mb-6">Related Tools</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Container Tracking",
                    description: "Real-time tracking for your containers",
                    href: "/tools/ocean-freight/container-tracking",
                    icon: Ship,
                  },
                  {
                    title: "Container Leasing ROI",
                    description: "Calculate leasing vs buying decisions",
                    href: "/tools/ocean-freight/container-leasing",
                    icon: Container,
                  },
                  {
                    title: "Carrier Performance",
                    description: "Compare carrier reliability metrics",
                    href: "/tools/ocean-freight/carrier-performance",
                    icon: Gauge,
                  },
                  {
                    title: "Container Availability",
                    description: "Check container availability index",
                    href: "/tools/ocean-freight/container-availability",
                    icon: TrendingUp,
                  },
                ].map((tool, index) => (
                  <Link key={index} href={tool.href}>
                    <Card className="h-full hover:border-[var(--ocean)]/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <tool.icon className="h-8 w-8 text-[var(--ocean)] mb-3" />
                        <h4 className="font-medium mb-1">{tool.title}</h4>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                        <div className="flex items-center text-[var(--ocean)] text-sm mt-2">
                          <span>Open Tool</span>
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
