import { Metadata } from "next";
import CreditRiskScorer from "@/components/tools/CreditRiskScorer";

export const metadata: Metadata = {
  title: "Credit Risk Scorer | Shiportrade",
  description: "Assess credit risk of trade partners with comprehensive scoring. Evaluate financial strength, payment history, and country risk for informed credit decisions.",
};

export default function CreditRiskPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Credit Risk Scorer
        </h1>
        <p className="text-muted-foreground text-lg">
          Assess credit risk of trade partners with comprehensive scoring. Evaluate financial strength, payment history, and country risk for informed credit decisions.
        </p>
      </div>
      <CreditRiskScorer />
    </div>
  );
}
