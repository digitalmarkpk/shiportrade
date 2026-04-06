import CarrierReliabilityIndex from "@/components/tools/CarrierReliabilityIndex";

export const metadata = {
  title: "Carrier Reliability Index | Shiportrade",
  description: "Track and compare carrier performance metrics across major shipping lines. Analyze on-time performance, schedule reliability, and composite reliability scores.",
};

export default function CarrierReliabilityPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <CarrierReliabilityIndex />
    </div>
  );
}
