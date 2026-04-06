import { Metadata } from "next";
import VaRCalculator from "@/components/tools/VaRCalculator";

export const metadata: Metadata = {
  title: "Value at Risk (VaR) Calculator | Shiportrade",
  description: "Calculate Value at Risk for your trade portfolio using parametric, historical, and Monte Carlo methods. Assess market risk and potential losses.",
};

export default function VaRCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Value at Risk (VaR) Calculator
        </h1>
        <p className="text-muted-foreground text-lg">
          Calculate potential portfolio losses using parametric, historical, and Monte Carlo methods. Understand your risk exposure and plan accordingly.
        </p>
      </div>
      <VaRCalculator />
    </div>
  );
}
