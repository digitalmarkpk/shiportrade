import { Metadata } from "next";
import { FreightQuotePage } from "./FreightQuotePage";

export const metadata: Metadata = {
  title: "Get Freight Quotes | Freight Marketplace | Shiportrade",
  description: "Request and compare freight quotes from top carriers and freight forwarders. Ocean freight, air freight, and road transport quotes. Real-time pricing for containers, LCL, and project cargo.",
  keywords: [
    "freight quote",
    "shipping quote",
    "ocean freight rates",
    "air freight quote",
    "container shipping rates",
    "freight marketplace",
    "compare freight rates",
    "FCL quote",
    "LCL quote",
    "freight forwarder quote",
  ],
  openGraph: {
    title: "Get Freight Quotes | Freight Marketplace | Shiportrade",
    description: "Request and compare freight quotes from top carriers and freight forwarders worldwide.",
    type: "website",
    url: "https://shiportrade.com/marketplace/freight/quote",
  },
};

export default function Page() {
  return <FreightQuotePage />;
}
