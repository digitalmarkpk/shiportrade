import { Metadata } from "next";
import ContainerValidator from "@/components/tools/ContainerValidator";

export const metadata: Metadata = {
  title: "Container Check Digit Validator | Shiportrade",
  description: "Validate container numbers using the ISO 6346 algorithm. Check owner codes, serial numbers, and verify check digits for shipping containers.",
};

export default function ContainerValidatorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Container Check Digit Validator
        </h1>
        <p className="text-muted-foreground text-lg">
          Validate container numbers using the ISO 6346 algorithm. Verify check digits, identify owners, and ensure accurate container identification.
        </p>
      </div>
      <ContainerValidator />
    </div>
  );
}
