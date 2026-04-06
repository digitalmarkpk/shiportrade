import { Metadata } from "next";
import { ReeferSettingsCalculator } from "@/components/tools/ReeferSettingsCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Snowflake, AlertTriangle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Reefer Container Settings Calculator | Shiportrade.com",
  description: "Get recommended temperature, ventilation, and humidity settings for reefer containers based on commodity type. Expert guidance for perishable cargo.",
  keywords: ["reefer container", "refrigerated container", "temperature settings", "perishable cargo", "cold chain"],
};

export default function ReeferSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3 bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
          <Thermometer className="h-3 w-3 mr-2" />
          Ocean Freight Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Reefer Container Settings
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Get recommended temperature, ventilation, and humidity settings for your 
          refrigerated cargo. Ensure optimal conditions for perishable shipments.
        </p>
      </div>

      {/* Calculator */}
      <ReeferSettingsCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-blue-400" />
              Temperature Ranges
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Frozen Cargo</span>
                <span className="font-medium">-18°C to -25°C</span>
              </li>
              <li className="flex justify-between">
                <span>Chilled Cargo</span>
                <span className="font-medium">-1°C to 15°C</span>
              </li>
              <li className="flex justify-between">
                <span>Bananas</span>
                <span className="font-medium">13.3°C</span>
              </li>
              <li className="flex justify-between">
                <span>Pharmaceuticals</span>
                <span className="font-medium">2°C to 8°C</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--logistics)]" />
              Key Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Pre-cool before loading</li>
              <li>• Monitor throughout transit</li>
              <li>• Avoid temperature spikes</li>
              <li>• Check cargo temperature at loading</li>
              <li>• Document for chain of custody</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Common Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Loading warm product</li>
              <li>• Incorrect set temperature</li>
              <li>• No pre-cooling</li>
              <li>• Poor airflow (blocked floor)</li>
              <li>• Ignoring humidity</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Cold Chain Note */}
      <Card className="mt-6 bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Thermometer className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-sm text-cyan-700 dark:text-cyan-300">
              <p className="font-semibold mb-2">Cold Chain Integrity</p>
              <p>
                Maintaining temperature throughout the supply chain is critical for perishable cargo. 
                A single temperature excursion can compromise product quality, lead to cargo claims, 
                and result in rejected shipments. Always verify temperature requirements with your 
                cargo insurer and destination authorities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
