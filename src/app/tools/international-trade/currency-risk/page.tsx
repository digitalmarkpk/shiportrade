import CurrencyRiskAnalyzer from "@/components/tools/CurrencyRiskAnalyzer";

export const metadata = {
  title: "Currency Risk Analyzer | Shiportrade",
  description: "Analyze foreign exchange exposure, calculate hedging strategies, and manage currency risk in international trade operations.",
};

export default function CurrencyRiskPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <CurrencyRiskAnalyzer />
    </div>
  );
}
