import RackSpaceCalculator from "@/components/tools/RackSpaceCalculator";

export const metadata = {
  title: "Rack Space Calculator | Shiportrade",
  description: "Calculate optimal rack layout, pallet positions, and space utilization for warehouse operations. Compare rack types and maximize storage density.",
};

export default function RackSpacePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <RackSpaceCalculator />
    </div>
  );
}
