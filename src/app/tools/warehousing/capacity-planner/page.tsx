import WarehouseCapacityPlanner from "@/components/tools/WarehouseCapacityPlanner";

export const metadata = {
  title: "Warehouse Capacity Planner | Shiportrade.com",
  description: "Comprehensive warehouse capacity analysis, planning, and optimization tool. Track inventory levels, storage capacity, SKU velocity, peak season planning, and expansion recommendations.",
  keywords: "warehouse capacity, inventory planning, SKU velocity, peak season planning, space utilization, slot optimization, throughput analysis, logistics planning",
};

export default function CapacityPlannerPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <WarehouseCapacityPlanner />
      </div>
    </main>
  );
}
