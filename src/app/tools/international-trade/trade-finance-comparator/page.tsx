import { Metadata } from "next";
import TradeFinanceComparator from "@/components/tools/TradeFinanceComparator";

export const metadata: Metadata = {
  title: "Trade Finance Comparator | Shiportrade",
  description: "Compare trade finance options including Letter of Credit, Factoring, and Supply Chain Finance. Analyze costs, terms, and get personalized recommendations for your international trade transactions.",
};

export default function TradeFinanceComparatorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Trade Finance Comparator
        </h1>
        <p className="text-muted-foreground text-lg">
          Compare Letter of Credit, Factoring, and Supply Chain Finance options to find the best financing solution for your international trade transactions.
        </p>
      </div>
      <TradeFinanceComparator />
    </div>
  );
}
