import { Metadata } from "next";
import { PortPerformanceIndex } from "@/components/tools/PortPerformanceIndex";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Anchor,
  Clock,
  Globe,
  Ship,
  BarChart3,
  TrendingUp,
  MapPin,
  Container,
  Zap,
  Target,
  Activity,
  Gauge,
  Info,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Port Performance Index | Shiportrade.com",
  description: "Compare port efficiency, throughput, vessel turnaround, and berth productivity metrics across 50+ major global container ports.",
  keywords: ["port performance", "container port efficiency", "port ranking", "vessel turnaround", "berth productivity", "port throughput"],
};

export default function PortPerformancePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Anchor className="h-3 w-3 mr-2" />
          Ocean Freight Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Port Performance Index
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Comprehensive performance analysis and benchmarking of major global container ports.
          Compare throughput, efficiency, vessel turnaround times, and berth productivity metrics.
        </p>
      </div>

      {/* Main Component */}
      <PortPerformanceIndex />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
              Key Performance Metrics Explained
            </CardTitle>
            <CardDescription>
              Understanding the metrics that define port efficiency
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Container className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Throughput (TEU)</span>
                  <p className="mt-0.5">
                    The total number of Twenty-foot Equivalent Units (TEU) handled annually.
                    This is the primary indicator of a port&apos;s capacity and volume of business.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Vessel Turnaround Time</span>
                  <p className="mt-0.5">
                    The average time (in hours) a vessel spends at port from arrival to departure.
                    Lower turnaround times indicate more efficient port operations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Berth Productivity</span>
                  <p className="mt-0.5">
                    Container moves per hour at berth. Higher productivity means faster vessel
                    servicing and reduced port congestion.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Efficiency Score</span>
                  <p className="mt-0.5">
                    A composite score (0-100) combining multiple operational metrics including
                    berth utilization, yard efficiency, and equipment performance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gauge className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Yard Utilization</span>
                  <p className="mt-0.5">
                    Percentage of terminal yard capacity being used. Optimal utilization
                    is typically 70-80% to maintain efficient container flow.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#0F4C81]" />
              Performance Status Levels
            </CardTitle>
            <CardDescription>
              How we classify port performance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-emerald-500 text-white">Excellent (90+)</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  World-class efficiency with exceptional turnaround times and productivity.
                  Top-tier global ports setting industry benchmarks.
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-[#0F4C81] text-white">Good (80-89)</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Strong operational performance with room for improvement.
                  Well-managed facilities with competitive metrics.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-yellow-500 text-white">Average (70-79)</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Standard performance meeting basic operational requirements.
                  Opportunity for efficiency improvements.
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-orange-500 text-white">Below Average (60-69)</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Performance below industry standards requiring attention.
                  Infrastructure or operational improvements needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Ports by Region */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#0F4C81]" />
            Top Performing Ports by Region
          </CardTitle>
          <CardDescription>
            Regional leaders in port efficiency and throughput
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#0F4C81]/5 dark:bg-[#0F4C81]/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Ship className="h-5 w-5 text-[#0F4C81]" />
                <span className="font-semibold">Asia</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Shanghai</span>
                  <span className="text-muted-foreground">47.3M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>Singapore</span>
                  <span className="text-muted-foreground">37.8M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>Ningbo-Zhoushan</span>
                  <span className="text-muted-foreground">35.8M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>Shenzhen</span>
                  <span className="text-muted-foreground">30.0M TEU</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#2E8B57]/5 dark:bg-[#2E8B57]/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Ship className="h-5 w-5 text-[#2E8B57]" />
                <span className="font-semibold">Europe</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Rotterdam</span>
                  <span className="text-muted-foreground">14.4M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>Antwerp</span>
                  <span className="text-muted-foreground">12.0M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>Hamburg</span>
                  <span className="text-muted-foreground">8.5M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>Barcelona</span>
                  <span className="text-muted-foreground">3.6M TEU</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#0F4C81]/5 dark:bg-[#0F4C81]/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Ship className="h-5 w-5 text-[#0F4C81]" />
                <span className="font-semibold">North America</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Los Angeles</span>
                  <span className="text-muted-foreground">9.3M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>Long Beach</span>
                  <span className="text-muted-foreground">8.5M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>New York/NJ</span>
                  <span className="text-muted-foreground">7.9M TEU</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#2E8B57]/5 dark:bg-[#2E8B57]/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Ship className="h-5 w-5 text-[#2E8B57]" />
                <span className="font-semibold">Middle East &amp; Others</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Jebel Ali</span>
                  <span className="text-muted-foreground">13.9M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>Port Klang</span>
                  <span className="text-muted-foreground">13.8M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>Laem Chabang</span>
                  <span className="text-muted-foreground">8.5M TEU</span>
                </li>
                <li className="flex justify-between">
                  <span>JNPT</span>
                  <span className="text-muted-foreground">6.4M TEU</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Factors */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-[#2E8B57]" />
            Factors Affecting Port Efficiency
          </CardTitle>
          <CardDescription>
            Key elements that influence port performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#0F4C81]" />
                Infrastructure
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Berth depth and length</li>
                <li>• Number of cranes</li>
                <li>• Yard capacity</li>
                <li>• Gate facilities</li>
                <li>• Intermodal connections</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#2E8B57]" />
                Operations
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Crane productivity</li>
                <li>• Yard equipment efficiency</li>
                <li>• Labor productivity</li>
                <li>• IT systems integration</li>
                <li>• Process automation</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#0F4C81]" />
                External Factors
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Trade volume fluctuations</li>
                <li>• Weather conditions</li>
                <li>• Labor availability</li>
                <li>• Regulatory compliance</li>
                <li>• Supply chain disruptions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-[#0F4C81]" />
            Pro Tips for Using Port Performance Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-[#0F4C81]">1</span>
              </div>
              <div>
                <h4 className="font-medium">Consider Multiple Metrics</h4>
                <p className="text-sm text-muted-foreground">
                  Don&apos;t rely solely on throughput. High volume doesn&apos;t always mean high efficiency.
                  Look at turnaround times and productivity scores together.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-[#2E8B57]">2</span>
              </div>
              <div>
                <h4 className="font-medium">Watch YoY Trends</h4>
                <p className="text-sm text-muted-foreground">
                  Year-over-year changes reveal performance trajectories. Ports improving
                  efficiency may offer better future service than those with declining metrics.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-[#0F4C81]">3</span>
              </div>
              <div>
                <h4 className="font-medium">Match Port to Cargo Type</h4>
                <p className="text-sm text-muted-foreground">
                  Some ports excel at specific cargo types. Consider your cargo requirements
                  when evaluating port choices for routing decisions.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-[#2E8B57]">4</span>
              </div>
              <div>
                <h4 className="font-medium">Factor in Congestion</h4>
                <p className="text-sm text-muted-foreground">
                  High yard utilization can indicate congestion risk. Ports at 85%+ utilization
                  may experience delays during peak periods.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Note */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Data &amp; Methodology</p>
              <p>
                Port performance data is sourced from industry reports, port authorities, and shipping analytics.
                Metrics are updated regularly but may not reflect real-time conditions. Always verify current
                port status before making critical routing decisions. Efficiency scores are calculated using
                weighted averages of multiple performance indicators.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Tools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <Anchor className="h-8 w-8 text-[#0F4C81] mb-2" />
              <h3 className="font-semibold">Port Congestion Monitor</h3>
              <p className="text-sm text-muted-foreground">Real-time congestion levels at major ports</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <MapPin className="h-8 w-8 text-[#2E8B57] mb-2" />
              <h3 className="font-semibold">Port Code Finder</h3>
              <p className="text-sm text-muted-foreground">Search UN/LOCODE port codes</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <Ship className="h-8 w-8 text-[#0F4C81] mb-2" />
              <h3 className="font-semibold">Carrier Performance</h3>
              <p className="text-sm text-muted-foreground">Ocean carrier reliability metrics</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <Clock className="h-8 w-8 text-[#2E8B57] mb-2" />
              <h3 className="font-semibold">Transit Time Estimator</h3>
              <p className="text-sm text-muted-foreground">Calculate shipping transit times</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
