import { Metadata } from "next";
import DangerousGoodsDeclarationGenerator from "@/components/documents/DangerousGoodsDeclarationGenerator";

export const metadata: Metadata = {
  title: "Dangerous Goods Declaration Generator | Shiportrade",
  description: "Generate professional Dangerous Goods Declarations (DGD) compliant with IMDG Code requirements for hazardous cargo shipments.",
};

export default function DangerousGoodsDeclarationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Dangerous Goods Declaration (DGD)
        </h1>
        <p className="text-muted-foreground text-lg">
          Create professional Dangerous Goods Declarations compliant with IMDG Code requirements. Generate accurate documentation for hazardous cargo shipments.
        </p>
      </div>
      <DangerousGoodsDeclarationGenerator />
    </div>
  );
}
