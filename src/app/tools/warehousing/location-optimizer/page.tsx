import { Metadata } from "next";
import WarehouseLocationOptimizer from "@/components/tools/WarehouseLocationOptimizer";

export const metadata: Metadata = {
  title: "Warehouse Location Optimizer | Shiportrade",
  description: "Optimize warehouse network locations using center of gravity analysis, K-means clustering, and coverage analysis for strategic distribution planning.",
};

export default function WarehouseLocationOptimizerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Warehouse Location Optimizer
        </h1>
        <p className="text-muted-foreground text-lg">
          Strategic warehouse network optimization using center of gravity analysis, demand-weighted clustering, and coverage analysis. Find optimal warehouse locations to minimize costs and maximize service levels.
        </p>
      </div>
      <WarehouseLocationOptimizer />
    </div>
  );
}
