import { Metadata } from "next";
import { PortCongestionMonitor } from "@/components/tools/PortCongestionMonitor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor, Clock, Globe, AlertTriangle, Ship, BarChart3, TrendingUp, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Port Congestion Monitor | Shiportrade.com",
  description: "Real-time port congestion monitoring for 50+ major global ports. Track congestion levels, vessel wait times, berth occupancy, and get predictions.",
  keywords: ["port congestion", "container port", "vessel waiting time", "berth occupancy", "port delays", "shipping congestion"],
};

export default function PortCongestionPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Anchor className="h-3 w-3 mr-2" />
          Ocean Freight Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Port Congestion Monitor
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Real-time monitoring of port congestion levels across 50+ major global ports. 
          Track vessel wait times, berth occupancy, yard utilization, and make informed routing decisions.
        </p>
      </div>

      {/* Monitor Component */}
      <PortCongestionMonitor />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
              Congestion Metrics Explained
            </CardTitle>
            <CardDescription>
              Understanding the key indicators of port congestion
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Average Wait Time</span>
                  <p className="mt-0.5">
                    The average time vessels spend waiting at anchor before being assigned a berth. 
                    Longer wait times indicate higher congestion levels.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Anchor className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Berth Occupancy Rate</span>
                  <p className="mt-0.5">
                    Percentage of berths currently occupied. Rates above 85% typically indicate 
                    congestion, while above 95% signals severe capacity constraints.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Ship className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Yard Utilization</span>
                  <p className="mt-0.5">
                    Percentage of terminal yard space being used. High yard utilization can 
                    slow container handling and increase vessel turnaround times.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Crane Productivity</span>
                  <p className="mt-0.5">
                    Container moves per hour (MPH). Lower productivity can contribute to 
                    congestion by increasing vessel time at berth.
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
              Covered Regions
            </CardTitle>
            <CardDescription>
              Major ports monitored across all key shipping regions
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-foreground">Asia</span>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#0F4C81]" />
                    Shanghai, Shenzhen, Singapore
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#0F4C81]" />
                    Busan, Hong Kong, Kaohsiung
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#0F4C81]" />
                    Port Klang, Laem Chabang
                  </li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-foreground">Europe</span>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#2E8B57]" />
                    Rotterdam, Antwerp, Hamburg
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#2E8B57]" />
                    Felixstowe, Le Havre
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#2E8B57]" />
                    Algeciras, Barcelona, Piraeus
                  </li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-foreground">North America</span>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#0F4C81]" />
                    Los Angeles, Long Beach
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#0F4C81]" />
                    New York/New Jersey
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#0F4C81]" />
                    Savannah, Oakland, Seattle
                  </li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-foreground">Other Regions</span>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#2E8B57]" />
                    Jebel Ali, Jeddah, Hamad Port
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#2E8B57]" />
                    Santos, Durban, Lagos
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-[#2E8B57]" />
                    Sydney, Melbourne, Vancouver
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Congestion Levels Guide */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Congestion Level Guide
          </CardTitle>
          <CardDescription>
            Understanding our congestion scoring system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <Badge className="bg-green-500 text-white mb-2">Low (0-34)</Badge>
              <p className="text-sm text-muted-foreground">
                Normal operations. Minimal delays expected. Optimal conditions for vessel scheduling.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Badge className="bg-yellow-500 text-white mb-2">Medium (35-54)</Badge>
              <p className="text-sm text-muted-foreground">
                Moderate congestion. Some delays possible. Consider buffer time in schedules.
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <Badge className="bg-red-500 text-white mb-2">High (55-69)</Badge>
              <p className="text-sm text-muted-foreground">
                Significant congestion. Extended delays likely. Consider alternative ports if possible.
              </p>
            </div>
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700">
              <Badge className="bg-red-900 text-white mb-2">Critical (70+)</Badge>
              <p className="text-sm text-muted-foreground">
                Severe congestion. Major delays expected. Alternative routing strongly recommended.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Planning Tips</p>
              <ul className="space-y-1">
                <li>• Check congestion levels before finalizing routing decisions</li>
                <li>• Use the 7-day forecast to anticipate changes in port conditions</li>
                <li>• Consider alternative ports when congestion levels are high or critical</li>
                <li>• Factor in congestion delays when calculating total transit time and costs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
