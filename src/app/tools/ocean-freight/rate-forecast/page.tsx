import FreightRateForecast from "@/components/tools/FreightRateForecast";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Freight Rate Forecast | Shiportrade.com",
  description: "AI-powered ocean freight rate forecasting with seasonal patterns, market drivers analysis, 3-6 month forecasts with confidence intervals, and rate alerts for major trade lanes.",
  keywords: ["freight rate forecast", "ocean freight rates", "container shipping rates", "rate prediction", "shipping forecast", "trade lane rates", "seasonal patterns"],
};

export default function FreightRateForecastPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <FreightRateForecast />
    </main>
  );
}
