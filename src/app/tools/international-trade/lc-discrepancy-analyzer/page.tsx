import { Metadata } from "next";
import LCDiscrepancyAnalyzer from "@/components/tools/LCDiscrepancyAnalyzer";

export const metadata: Metadata = {
  title: "LC Discrepancy Analyzer | Shiportrade",
  description: "Identify potential discrepancies in Letter of Credit documents. Check UCP 600 compliance and reduce payment risks in international trade.",
};

export default function LCDiscrepancyAnalyzerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          LC Discrepancy Analyzer
        </h1>
        <p className="text-muted-foreground text-lg">
          Identify potential discrepancies in Letter of Credit documents before presentation. Ensure UCP 600 compliance and reduce payment delays.
        </p>
      </div>
      <LCDiscrepancyAnalyzer />
    </div>
  );
}
