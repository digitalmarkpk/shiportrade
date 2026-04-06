import WarehouseLaborPlanner from "@/components/tools/WarehouseLaborPlanner";

export const metadata = {
  title: "Warehouse Labor Planner | Shiportrade.com",
  description: "Comprehensive warehouse labor planning tool featuring workload input, shift planning, worker requirements analysis, labor cost calculation, productivity metrics, and overtime planning for logistics optimization.",
  keywords: "warehouse labor planning, shift scheduling, workforce management, labor cost calculator, overtime planning, productivity metrics, worker requirements, warehouse staffing, logistics labor optimization",
};

export default function LaborPlannerPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <WarehouseLaborPlanner />
      </div>
    </main>
  );
}
