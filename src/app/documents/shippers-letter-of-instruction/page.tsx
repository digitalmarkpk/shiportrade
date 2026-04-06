import { Metadata } from "next";
import ShippersLetterOfInstructionGenerator from "@/components/documents/ShippersLetterOfInstructionGenerator";

export const metadata: Metadata = {
  title: "Shipper's Letter of Instruction Generator | Shiportrade",
  description: "Generate professional Shipper's Letter of Instruction (SLI) documents for international shipping and export operations.",
};

export default function ShippersLetterOfInstructionPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Shipper's Letter of Instruction (SLI)
        </h1>
        <p className="text-muted-foreground text-lg">
          Create professional Shipper's Letter of Instruction documents for your export shipments. Provide clear instructions to freight forwarders and carriers.
        </p>
      </div>
      <ShippersLetterOfInstructionGenerator />
    </div>
  );
}
