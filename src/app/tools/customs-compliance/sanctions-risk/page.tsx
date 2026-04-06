import { Metadata } from "next";
import SanctionsRiskScorer from "@/components/tools/SanctionsRiskScorer";

export const metadata: Metadata = {
  title: "Sanctions Risk Scorer | Shiportrade",
  description: "Screen transactions and counterparties against global sanctions lists. Assess country risk, entity risk, and product risk for trade compliance.",
};

export default function SanctionsRiskPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Sanctions Risk Scorer
        </h1>
        <p className="text-muted-foreground text-lg">
          Screen transactions and counterparties against global sanctions lists. Identify red flags and ensure compliance with international trade regulations.
        </p>
      </div>
      <SanctionsRiskScorer />
    </div>
  );
}
