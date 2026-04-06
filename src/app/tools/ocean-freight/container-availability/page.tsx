import { Metadata } from "next";
import { ContainerAvailabilityIndex } from "@/components/tools/ContainerAvailabilityIndex";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Container,
  Clock,
  Globe,
  AlertTriangle,
  Package,
  BarChart3,
  TrendingUp,
  MapPin,
  Ship,
  Warehouse,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Container Availability Index | Shiportrade.com",
  description:
    "Real-time container availability monitoring across 50+ major global ports. Check availability scores, dwell times, and forecasts for all container types.",
  keywords: [
    "container availability",
    "empty containers",
    "container shortage",
    "dwell time",
    "container forecast",
    "shipping containers",
  ],
};

export default function ContainerAvailabilityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Container className="h-3 w-3 mr-2" />
          Ocean Freight Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Container Availability Index</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Real-time monitoring of container availability across 50+ major global ports. Track
          availability scores, dwell times, and make informed booking decisions for all container
          types.
        </p>
      </div>

      {/* Monitor Component */}
      <ContainerAvailabilityIndex />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
              Availability Metrics Explained
            </CardTitle>
            <CardDescription>Understanding the key indicators of container availability</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Availability Score (0-100)</span>
                  <p className="mt-0.5">
                    A composite index measuring container availability at a port. Higher scores
                    indicate better availability. Scores below 25 signal critical shortages.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Dwell Time</span>
                  <p className="mt-0.5">
                    The average number of days containers remain at the port before being moved.
                    Longer dwell times can indicate congestion or supply chain bottlenecks.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Warehouse className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Empty Units Available</span>
                  <p className="mt-0.5">
                    The number of empty containers currently at the port ready for export bookings.
                    Critical for shippers looking to book outbound cargo.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Price Premium</span>
                  <p className="mt-0.5">
                    The percentage premium above base rates due to container scarcity. High
                    premiums indicate tight supply and increased shipping costs.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Container className="h-5 w-5 text-[#2E8B57]" />
              Supported Container Types
            </CardTitle>
            <CardDescription>Container types covered by the availability index</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-foreground">Standard Containers</span>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-[#0F4C81]" />
                    20&apos; Standard (20GP)
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-[#0F4C81]" />
                    40&apos; Standard (40GP)
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-[#0F4C81]" />
                    40&apos; High Cube (40HC)
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-[#0F4C81]" />
                    45&apos; High Cube (45HC)
                  </li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-foreground">Special Equipment</span>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-[#2E8B57]" />
                    20&apos;/40&apos; Reefer (RF)
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-[#2E8B57]" />
                    20&apos;/40&apos; Open Top (OT)
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-[#2E8B57]" />
                    20&apos;/40&apos; Flat Rack (FR)
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-[#2E8B57]" />
                    20&apos; Tank Container (TK)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Levels Guide */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Availability Level Guide
          </CardTitle>
          <CardDescription>Understanding our availability scoring system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <Badge className="bg-green-500 text-white mb-2">High (70-100)</Badge>
              <p className="text-sm text-muted-foreground">
                Containers readily available. Low wait times and competitive pricing. Ideal booking
                conditions.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Badge className="bg-yellow-500 text-white mb-2">Medium (45-69)</Badge>
              <p className="text-sm text-muted-foreground">
                Moderate availability. Some delays possible. Book in advance and allow buffer time.
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
              <Badge className="bg-orange-500 text-white mb-2">Low (25-44)</Badge>
              <p className="text-sm text-muted-foreground">
                Limited availability. Significant delays expected. Consider alternative ports or
                earlier booking.
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <Badge className="bg-red-700 text-white mb-2">Critical (0-24)</Badge>
              <p className="text-sm text-muted-foreground">
                Severe shortage. Immediate action required. Alternative routing strongly
                recommended.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Covered Regions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#0F4C81]" />
            Covered Regions
          </CardTitle>
          <CardDescription>Major ports monitored across all key shipping regions</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <span className="font-medium text-foreground">Asia</span>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#0F4C81]" />
                  Shanghai, Shenzhen
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#0F4C81]" />
                  Singapore, Busan
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#0F4C81]" />
                  Port Klang, Jakarta
                </li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-foreground">Europe</span>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#2E8B57]" />
                  Rotterdam, Antwerp
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#2E8B57]" />
                  Hamburg, Felixstowe
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#2E8B57]" />
                  Algeciras, Piraeus
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
                  New York, Savannah
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#0F4C81]" />
                  Vancouver, Montreal
                </li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-foreground">Middle East</span>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#2E8B57]" />
                  Jebel Ali, Jeddah
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#2E8B57]" />
                  Hamad Port
                </li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-foreground">South America</span>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#0F4C81]" />
                  Santos, Manzanillo
                </li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-foreground">Africa & Oceania</span>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#2E8B57]" />
                  Durban, Suez
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#2E8B57]" />
                  Sydney, Melbourne
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Ship className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Planning Tips</p>
              <ul className="space-y-1">
                <li>• Check availability before finalizing shipping schedules</li>
                <li>• Use the 7-day forecast to anticipate supply changes</li>
                <li>• Consider alternative ports when availability is low or critical</li>
                <li>• Factor in price premiums when calculating total shipping costs</li>
                <li>• Book early during peak seasons when availability tends to decline</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
