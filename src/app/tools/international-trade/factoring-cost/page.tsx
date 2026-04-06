import { Metadata } from "next";
import FactoringCostCalculator from "@/components/tools/FactoringCostCalculator";

export const metadata: Metadata = {
  title: "Factoring Cost Calculator | Shiportrade",
  description: "Calculate invoice factoring costs, compare factoring types, and analyze the true cost of accounts receivable financing.",
};

export default function FactoringCostPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Factoring Cost Calculator
        </h1>
        <p className="text-muted-foreground text-lg">
          Analyze the true cost of invoice factoring and compare different factoring arrangements to make informed financing decisions.
        </p>
      </div>
      <FactoringCostCalculator />
    </div>
  );
}
