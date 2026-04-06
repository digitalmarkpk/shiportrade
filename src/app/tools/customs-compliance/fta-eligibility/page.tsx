import { Metadata } from "next";
import FTAEligibilityChecker from "@/components/tools/FTAEligibilityChecker";

export const metadata: Metadata = {
  title: "FTA Eligibility Checker | Shiportrade",
  description: "Check eligibility for Free Trade Agreement benefits, verify rules of origin, and calculate potential duty savings.",
};

export default function FTAEligibilityPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          FTA Eligibility Checker
        </h1>
        <p className="text-muted-foreground text-lg">
          Check your eligibility for Free Trade Agreement benefits. Verify rules of origin compliance and calculate potential duty savings.
        </p>
      </div>
      <FTAEligibilityChecker />
    </div>
  );
}
