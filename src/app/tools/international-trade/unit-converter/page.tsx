import { Metadata } from "next";
import UnitConverter from "@/components/tools/UnitConverter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, Info, Ruler, Scale, Box } from "lucide-react";

export const metadata: Metadata = {
  title: "Unit Converter | Shiportrade.com",
  description: "Convert length, weight, and volume units instantly. Meters to feet, kilograms to pounds, cubic meters to cubic feet, and more.",
  keywords: ["unit converter", "length converter", "weight converter", "volume converter", "metric to imperial"],
};

export default function UnitConverterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <ArrowRightLeft className="h-3 w-3 mr-2" />
          Conversion Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Unit Converter
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Convert between metric and imperial units for length, weight, and volume. 
          Essential tool for international trade and logistics calculations.
        </p>
      </div>

      {/* Converter */}
      <UnitConverter />

      {/* Educational Content */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Common Use Cases</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Ruler className="h-8 w-8 text-[var(--ocean)] mb-2" />
              <CardTitle className="text-lg">Length Conversions</CardTitle>
              <CardDescription>
                For shipping dimensions and distances
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• Container dimensions (meters ↔ feet)</li>
                <li>• Cargo size calculations</li>
                <li>• Route distances</li>
                <li>• Pallet dimensions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Scale className="h-8 w-8 text-[var(--logistics)] mb-2" />
              <CardTitle className="text-lg">Weight Conversions</CardTitle>
              <CardDescription>
                For cargo weight calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• Gross/net weight declarations</li>
                <li>• Container payload limits</li>
                <li>• Airfreight chargeable weight</li>
                <li>• Customs duty calculations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Box className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle className="text-lg">Volume Conversions</CardTitle>
              <CardDescription>
                For CBM and capacity calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• CBM (cubic meters) calculations</li>
                <li>• Tank container capacity</li>
                <li>• Liquid cargo measurements</li>
                <li>• Storage space planning</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Card */}
      <Card className="mt-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Conversion Accuracy</p>
              <p>
                Our unit converter uses precise conversion factors based on international standards. 
                Results are displayed with appropriate precision for practical use. For official 
                documentation, always verify with the relevant standards organizations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
