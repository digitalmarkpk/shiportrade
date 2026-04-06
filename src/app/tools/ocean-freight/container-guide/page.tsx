import { Metadata } from "next";
import { ContainerSizeGuide } from "@/components/tools/ContainerSizeGuide";

export const metadata: Metadata = {
  title: "Container Size Guide | Shiportrade.com",
  description: "Complete guide to shipping container types, dimensions, and specifications. Compare standard, high cube, reefer, and special containers.",
  keywords: ["container dimensions", "shipping container sizes", "container types", "TEU", "CBM", "container specifications"],
};

export default function ContainerGuidePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <ContainerSizeGuide />
    </div>
  );
}
