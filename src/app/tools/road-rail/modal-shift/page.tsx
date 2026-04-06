import { Metadata } from "next";
import ModalShiftComparator from "@/components/tools/ModalShiftComparator";

export const metadata: Metadata = {
  title: "Modal Shift Comparator | Shiportrade",
  description: "Compare transport modes (ocean, air, rail, road) and find the optimal shipping solution based on cost, time, and environmental impact.",
};

export default function ModalShiftPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Modal Shift Comparator
        </h1>
        <p className="text-muted-foreground text-lg">
          Compare ocean, air, rail, and road transport modes. Find the optimal shipping solution based on cost, transit time, and sustainability goals.
        </p>
      </div>
      <ModalShiftComparator />
    </div>
  );
}
