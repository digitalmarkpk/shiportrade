import { Metadata } from "next";
import WarehouseSlottingTool from "@/components/tools/WarehouseSlottingTool";

export const metadata: Metadata = {
  title: "Warehouse Slotting Optimization | Shiportrade",
  description: "Optimize warehouse slotting and layout with ABC analysis, velocity-based placement, and zone utilization tools.",
};

export default function WarehouseSlottingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Warehouse Slotting Optimization
        </h1>
        <p className="text-muted-foreground text-lg">
          Optimize your warehouse layout with intelligent slotting strategies. Improve picking efficiency, reduce travel time, and maximize space utilization.
        </p>
      </div>
      <WarehouseSlottingTool />
    </div>
  );
}
