import { Metadata } from "next";
import TransportModeSelector from "@/components/tools/TransportModeSelector";

export const metadata: Metadata = {
  title: "Transport Mode Selector | Shiportrade",
  description: "Compare sea, air, rail, and road transport modes. Find the optimal shipping solution based on cost, transit time, reliability, and environmental impact.",
  keywords: ["transport mode", "freight comparison", "logistics", "shipping", "modal selection", "sea freight", "air freight", "rail freight", "road freight"],
};

export default function TransportModeSelectorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Transport Mode Selector
        </h1>
        <p className="text-muted-foreground text-lg">
          Intelligent multi-modal transport comparison and recommendation engine. Analyze sea, air, rail, and road options based on your specific cargo characteristics and priorities.
        </p>
      </div>
      <TransportModeSelector />
    </div>
  );
}
