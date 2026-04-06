import DriverScheduleOptimizer from "@/components/tools/DriverScheduleOptimizer";

export const metadata = {
  title: "Driver Schedule Optimizer | Shiportrade",
  description: "Optimize driver schedules while maintaining HOS compliance. Track driver availability, hours, and optimize fleet utilization.",
};

export default function DriverSchedulePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <DriverScheduleOptimizer />
    </div>
  );
}
