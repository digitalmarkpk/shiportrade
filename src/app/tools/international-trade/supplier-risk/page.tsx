import { Metadata } from "next";
import SupplierRiskAssessment from "@/components/tools/SupplierRiskAssessment";

export const metadata: Metadata = {
  title: "Supplier Risk Assessment | Shiportrade",
  description: "Comprehensive supplier risk assessment tool for international trade. Evaluate country risk, financial stability, quality metrics, and delivery performance with detailed scoring.",
};

export default function SupplierRiskPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Supplier Risk Assessment
        </h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive supplier risk evaluation for international trade. Analyze country risk, financial stability, quality metrics, and delivery performance to make informed sourcing decisions.
        </p>
      </div>
      <SupplierRiskAssessment />
    </div>
  );
}
