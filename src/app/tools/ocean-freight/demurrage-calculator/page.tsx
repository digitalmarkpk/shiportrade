import { Metadata } from "next";
import { DemurrageCalculator } from "@/components/tools/DemurrageCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertTriangle, FileWarning, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Demurrage & Detention Calculator | Shiportrade.com",
  description: "Calculate demurrage and detention charges at major ports worldwide. Estimate port storage fees and avoid unexpected costs.",
  keywords: ["demurrage calculator", "detention calculator", "port storage charges", "container fees", "free time"],
};

export default function DemurrageCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Clock className="h-3 w-3 mr-2" />
          Ocean Freight Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Demurrage & Detention Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate potential port storage charges and container detention fees. 
          Estimate costs at major ports and plan to avoid unexpected D&D expenses.
        </p>
      </div>

      {/* Calculator */}
      <DemurrageCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[var(--logistics)]" />
              Typical Free Time
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>US Ports</span>
                <span className="font-medium">5-7 days</span>
              </li>
              <li className="flex justify-between">
                <span>European Ports</span>
                <span className="font-medium">4-5 days</span>
              </li>
              <li className="flex justify-between">
                <span>Asian Ports</span>
                <span className="font-medium">5-10 days</span>
              </li>
              <li className="flex justify-between">
                <span>Reefers</span>
                <span className="font-medium">2-4 days</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-[var(--ocean)]" />
              Common Causes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Customs documentation delays</li>
              <li>• Missing or incorrect paperwork</li>
              <li>• Terminal congestion</li>
              <li>• Trucking capacity shortage</li>
              <li>• Import license issues</li>
              <li>• Payment disputes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Pre-file customs before arrival</li>
              <li>• Book trucking appointments early</li>
              <li>• Negotiate free time in contracts</li>
              <li>• Use chassis pools for faster pickup</li>
              <li>• Monitor vessel schedules closely</li>
              <li>• Consider night gate operations</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Industry Stats */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-semibold mb-2">Industry Impact</p>
              <p>
                According to Container xChange, average D&D charges in 2023 reached over $2,500 per container 
                at major US ports. Delays of just a few days can result in thousands of dollars in unexpected fees. 
                Planning ahead and understanding your free time is crucial for cost control.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
