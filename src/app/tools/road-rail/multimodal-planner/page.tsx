import { Metadata } from "next";
import MultimodalRoutePlanner from "@/components/tools/MultimodalRoutePlanner";

export const metadata: Metadata = {
  title: "Multimodal Route Planner | Shiportrade",
  description: "Plan and optimize multimodal shipping routes combining road, rail, ocean, and air transport. Compare costs, transit times, and emissions across different mode combinations.",
};

export default function MultimodalPlannerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Multimodal Route Planner
        </h1>
        <p className="text-muted-foreground text-lg">
          Plan and optimize complex shipping routes by combining multiple transport modes. Build custom mode combinations, compare costs and transit times, and find the most sustainable route for your cargo.
        </p>
      </div>
      <MultimodalRoutePlanner />
    </div>
  );
}
