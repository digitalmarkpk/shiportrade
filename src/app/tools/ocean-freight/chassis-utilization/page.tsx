import ChassisUtilizationCalculator from "@/components/tools/ChassisUtilizationCalculator";

export const metadata = {
  title: "Chassis Utilization Calculator | Shiportrade",
  description: "Optimize chassis pool efficiency and track utilization metrics. Calculate turns, revenue, and efficiency scores for container chassis management.",
};

export default function ChassisUtilizationPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <ChassisUtilizationCalculator />
    </div>
  );
}
