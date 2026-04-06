import TradeLaneAnalyzer from "@/components/tools/TradeLaneAnalyzer";

export const metadata = {
  title: "Trade Lane Analyzer | Shiportrade",
  description: "Analyze global trade lane performance, compare transport modes, and optimize supply chain routing decisions.",
};

export default function TradeLanePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <TradeLaneAnalyzer />
    </div>
  );
}
