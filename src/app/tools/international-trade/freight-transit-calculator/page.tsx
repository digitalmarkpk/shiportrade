import { Metadata } from "next";
import { FreightTransitCalculator } from "@/components/tools/FreightTransitCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Info, Ship, Plane, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Freight Transit Time Calculator | Shiportrade.com",
  description: "Calculate estimated shipping transit times between regions for sea, air, and rail freight. Plan your shipments with accurate delivery estimates.",
  keywords: ["transit time calculator", "shipping time", "freight transit", "delivery estimate", "sea freight time", "air freight time"],
};

export default function FreightTransitPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Clock className="h-3 w-3 mr-2" />
          Shipping Calculator
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Freight Transit Time Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Estimate shipping times between major regions for different modes of transport. 
          Plan your supply chain with realistic delivery timelines.
        </p>
      </div>

      {/* Calculator */}
      <FreightTransitCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Ship className="h-8 w-8 text-[var(--ocean)] mb-2" />
            <CardTitle className="text-lg">Ocean Freight</CardTitle>
            <CardDescription>
              Most economical for large shipments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Most cost-effective for bulk cargo</li>
              <li>• Typical transit: 7-40 days depending on route</li>
              <li>• Best for non-urgent, heavy shipments</li>
              <li>• Subject to port congestion and weather</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Plane className="h-8 w-8 text-[var(--logistics)] mb-2" />
            <CardTitle className="text-lg">Air Freight</CardTitle>
            <CardDescription>
              Fastest option for time-sensitive cargo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Fastest transit times (1-5 days typically)</li>
              <li>• Best for high-value, urgent shipments</li>
              <li>• Higher cost per kg</li>
              <li>• Limited cargo capacity</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Truck className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle className="text-lg">Rail Freight</CardTitle>
            <CardDescription>
              Balanced option for intercontinental routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Balance between air and sea transit times</li>
              <li>• Popular for Asia-Europe routes (18-20 days)</li>
              <li>• More environmentally friendly</li>
              <li>• Growing infrastructure globally</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="mt-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Important Notes</p>
              <ul className="space-y-1">
                <li>• Transit times are estimates based on average routes and may vary due to weather, port congestion, customs delays, and other factors.</li>
                <li>• Buffer days should account for documentation, customs clearance, and potential delays.</li>
                <li>• For accurate quotes and transit times, consult with your freight forwarder.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
