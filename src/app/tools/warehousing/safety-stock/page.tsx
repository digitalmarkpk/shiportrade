import { Metadata } from "next";
import { SafetyStockCalculator } from "@/components/tools/SafetyStockCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, TrendingUp, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Stock Calculator | Shiportrade.com",
  description: "Calculate optimal safety stock levels based on demand variability and service level targets. Prevent stockouts while minimizing holding costs.",
  keywords: ["safety stock calculator", "buffer stock", "reorder point", "service level", "inventory buffer"],
};

export default function SafetyStockCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Shield className="h-3 w-3 mr-2" />
          Inventory Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Safety Stock Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate the optimal safety stock level to prevent stockouts while 
          minimizing inventory holding costs. Based on statistical demand variability.
        </p>
      </div>

      {/* Calculator */}
      <SafetyStockCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-[var(--logistics)]" />
              Why Safety Stock?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Protects against demand variability</li>
              <li>• Covers lead time uncertainty</li>
              <li>• Prevents stockouts</li>
              <li>• Improves customer service</li>
              <li>• Reduces expediting costs</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
              Service Level Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li><strong>90%:</strong> Non-critical items</li>
              <li><strong>95%:</strong> Standard products</li>
              <li><strong>97.5%:</strong> Important items</li>
              <li><strong>99%:</strong> Critical/strategic items</li>
              <li><strong>99.9%:</strong> Life-safety products</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Trade-offs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Higher service = more safety stock</li>
              <li>• More stock = higher holding costs</li>
              <li>• Balance cost vs stockout risk</li>
              <li>• Consider item criticality</li>
              <li>• Review periodically</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-semibold mb-2">Important Notes</p>
              <ul className="space-y-1">
                <li>• Safety stock should be reviewed when demand patterns change significantly</li>
                <li>• Use historical data to estimate standard deviation accurately</li>
                <li>• Consider supplier reliability when setting lead time variability</li>
                <li>• Safety stock + Reorder Point = Your total buffer against uncertainty</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
