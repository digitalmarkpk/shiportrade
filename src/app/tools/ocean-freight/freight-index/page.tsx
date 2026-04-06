import FreightIndexTracker from "@/components/tools/FreightIndexTracker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Freight Index Tracker | Shiportrade.com",
  description: "Track major freight indices (BDI, SCFI, FBX, WCI) with real-time values, YoY/MoM changes, 12-month trends, index correlations, and market insights.",
  keywords: ["freight index", "BDI", "SCFI", "FBX", "WCI", "shipping rates", "container rates", "dry bulk", "market trends"],
};

export default function FreightIndexPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <FreightIndexTracker />
    </main>
  );
}
