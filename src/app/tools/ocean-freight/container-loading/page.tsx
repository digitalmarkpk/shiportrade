import { Metadata } from "next";
import { ContainerLoadingCalculator } from "@/components/tools/ContainerLoadingCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Container Loading Calculator | Shiportrade.com",
  description: "Calculate how much cargo fits in a shipping container. Optimize container utilization for volume and weight.",
  keywords: ["container loading calculator", "container utilization", "CBM calculator", "cargo planning", "container capacity"],
};

export default function ContainerLoadingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Layers className="h-3 w-3 mr-2" />
          Loading Planning
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Container Loading Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Plan your cargo loading efficiently. Calculate volume utilization, weight distribution, 
          and optimize your container shipments.
        </p>
      </div>

      {/* Calculator */}
      <ContainerLoadingCalculator />

      {/* Tips */}
      <Card className="mt-8 bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Loading Tips</p>
              <ul className="space-y-1">
                <li>• Use a 10-15% buffer for irregular shapes and packing materials</li>
                <li>• Heavy items should be loaded first at the bottom</li>
                <li>• Distribute weight evenly across the container floor</li>
                <li>• Secure cargo with lashing to prevent shifting during transit</li>
                <li>• Consider stowage factors for different cargo types</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
