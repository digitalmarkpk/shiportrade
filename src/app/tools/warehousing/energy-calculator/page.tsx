import WarehouseEnergyCalculator from "@/components/tools/WarehouseEnergyCalculator";

export const metadata = {
  title: "Warehouse Energy Calculator | Shiportrade",
  description: "Analyze and optimize warehouse energy consumption, costs, and carbon footprint. Calculate kWh per square foot and identify savings opportunities.",
};

export default function WarehouseEnergyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <WarehouseEnergyCalculator />
    </div>
  );
}
