import { Metadata } from "next";
import { LDMCalculator } from "@/components/tools/LDMCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, Truck, Package, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "LDM Calculator - Loading Meters | Shiportrade.com",
  description: "Calculate Loading Meters (LDM) for road transport. Optimize truck space utilization and estimate freight costs.",
  keywords: ["LDM calculator", "loading meter", "lademeter", "truck space", "pallet positions", "road freight"],
};

export default function LDMCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Truck className="h-3 w-3 mr-2" />
          Road Transport Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          LDM Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate Loading Meters (LDM) for your road transport shipments. 
          Optimize truck space utilization and estimate freight costs.
        </p>
      </div>

      {/* Calculator */}
      <LDMCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Ruler className="h-5 w-5 text-[var(--logistics)]" />
              Standard LDM Values
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Euro Pallet</span>
                <span className="font-medium">0.4 LDM</span>
              </li>
              <li className="flex justify-between">
                <span>Industrial Pallet</span>
                <span className="font-medium">0.5 LDM</span>
              </li>
              <li className="flex justify-between">
                <span>US Pallet</span>
                <span className="font-medium">0.51 LDM</span>
              </li>
              <li className="flex justify-between">
                <span>Half Euro</span>
                <span className="font-medium">0.2 LDM</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-[var(--ocean)]" />
              Truck Capacities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Solo 7.5t</span>
                <span className="font-medium">5.0 LDM</span>
              </li>
              <li className="flex justify-between">
                <span>Solo 18t</span>
                <span className="font-medium">7.5 LDM</span>
              </li>
              <li className="flex justify-between">
                <span>Articulated 40t</span>
                <span className="font-medium">13.6 LDM</span>
              </li>
              <li className="flex justify-between">
                <span>Mega Trailer</span>
                <span className="font-medium">13.6 LDM</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-500" />
              Pallets per Truck
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Euro Pallets (13.6m)</span>
                <span className="font-medium">34 pallets</span>
              </li>
              <li className="flex justify-between">
                <span>Industrial (13.6m)</span>
                <span className="font-medium">27 pallets</span>
              </li>
              <li className="flex justify-between">
                <span>Euro (double stacked)</span>
                <span className="font-medium">68 pallets</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">European Road Transport Standard</p>
              <p>
                LDM (Lademeter) is the standard unit for pricing road freight in Europe. 
                It represents 1 meter of trailer length with standard 2.4m width. 
                Understanding LDM helps you optimize loading and compare freight quotes accurately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
