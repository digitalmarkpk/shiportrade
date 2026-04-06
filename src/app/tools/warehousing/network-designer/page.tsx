import { Metadata } from "next";
import DistributionNetworkDesigner from "@/components/tools/DistributionNetworkDesigner";

export const metadata: Metadata = {
  title: "Distribution Network Designer | Shiportrade",
  description: "Design and optimize your distribution network with center location planning, demand analysis, cost modeling, and AI-powered optimization suggestions for strategic logistics planning.",
};

export default function DistributionNetworkDesignerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Distribution Network Designer
        </h1>
        <p className="text-muted-foreground text-lg">
          Design and optimize your distribution network with comprehensive cost modeling, demand analysis, 
          service coverage optimization, and AI-powered recommendations for strategic logistics planning.
        </p>
      </div>
      <DistributionNetworkDesigner />
    </div>
  );
}
