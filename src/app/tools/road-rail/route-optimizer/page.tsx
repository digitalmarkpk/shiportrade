import { Metadata } from "next";
import RouteOptimizationTool from "@/components/tools/RouteOptimizationTool";

export const metadata: Metadata = {
  title: "Route Optimization Tool | Shiportrade",
  description: "Optimize road and rail transport routes with cost analysis, fuel efficiency calculations, and alternative route comparisons.",
};

export default function RouteOptimizationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Route Optimization Tool
        </h1>
        <p className="text-muted-foreground text-lg">
          Optimize your road and rail transport routes with intelligent planning. Compare costs, transit times, and environmental impact.
        </p>
      </div>
      <RouteOptimizationTool />
    </div>
  );
}
