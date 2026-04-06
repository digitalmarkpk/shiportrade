import { Metadata } from "next";
import { CarbonFootprintCalculator } from "@/components/tools/CarbonFootprintCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TreePine, Ship, Plane, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Carbon Footprint Calculator | Shiportrade.com",
  description: "Calculate CO2 emissions for your shipments across ocean, air, road, and rail transport. Compare modes and plan sustainable logistics.",
  keywords: ["carbon footprint", "CO2 calculator", "emissions calculator", "sustainable logistics", "green shipping"],
};

export default function CarbonFootprintPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <Leaf className="h-3 w-3 mr-2" />
          Sustainability Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Carbon Footprint Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Measure the environmental impact of your shipments. Calculate CO₂ emissions 
          across all transport modes and discover ways to reduce your carbon footprint.
        </p>
      </div>

      {/* Calculator */}
      <CarbonFootprintCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Ship className="h-5 w-5 text-[var(--ocean)]" />
              Ocean Freight
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Most carbon-efficient mode for long distances. A container ship emits 
              roughly 15g CO₂ per tonne-km, compared to 500g+ for air freight.
            </p>
            <div className="text-xs bg-muted/50 p-2 rounded">
              <span className="text-green-600 font-medium">~95% less</span> emissions than air freight
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plane className="h-5 w-5 text-purple-500" />
              Air Freight
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Highest emissions per tonne-km, but fastest transit times. Consider for 
              time-critical, high-value, or perishable goods only.
            </p>
            <div className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">
              <span className="text-red-600 font-medium">Highest</span> carbon footprint per kg
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TreePine className="h-5 w-5 text-green-600" />
              Carbon Offsetting
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              For unavoidable emissions, purchase verified carbon credits. Support 
              reforestation, renewable energy, and community projects worldwide.
            </p>
            <Link
              href="#"
              className="text-xs text-[var(--logistics)] hover:underline flex items-center gap-1"
            >
              Learn about offset programs
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Info */}
      <Card className="mt-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div className="text-sm text-green-700 dark:text-green-300">
              <p className="font-semibold mb-2">Regulatory Requirements</p>
              <p>
                The EU&apos;s Carbon Border Adjustment Mechanism (CBAM) and IMO&apos;s Carbon Intensity Indicator (CII) 
                are making carbon tracking mandatory for many businesses. Start measuring now to stay compliant 
                and identify reduction opportunities before regulations tighten.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
