import TrailerPoolingCalculator from "@/components/tools/TrailerPoolingCalculator";

export const metadata = {
  title: "Trailer Pooling Calculator | Shiportrade",
  description: "Optimize trailer fleet mix between owned and leased assets. Calculate utilization, costs, and profitability for trailer pooling operations.",
};

export default function TrailerPoolingPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <TrailerPoolingCalculator />
    </div>
  );
}
