import { Metadata } from "next";
import GeneralAverageEstimator from "@/components/tools/GeneralAverageEstimator";

export const metadata: Metadata = {
  title: "General Average Estimator | Shiportrade",
  description: "Calculate general average contributions, understand York-Antwerp Rules, and estimate your liability in maritime general average events.",
};

export default function GeneralAveragePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          General Average Estimator
        </h1>
        <p className="text-muted-foreground text-lg">
          Calculate general average contributions for maritime incidents. Understand York-Antwerp Rules and estimate financial liability when cargo is sacrificed to save a voyage.
        </p>
      </div>
      <GeneralAverageEstimator />
    </div>
  );
}
