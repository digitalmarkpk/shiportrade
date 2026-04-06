import { Metadata } from "next";
import { MarketplacePage } from "./MarketplacePage";

export const metadata: Metadata = {
  title: "Global Supply Chain Marketplace | Shiportrade",
  description: "The ultimate B2B marketplace for global supply chain professionals. Buy, sell, and lease containers, find freight quotes, warehousing solutions, transport services, and connect with verified logistics partners worldwide.",
  keywords: [
    "container marketplace",
    "freight marketplace",
    "shipping containers for sale",
    "freight quotes",
    "warehousing marketplace",
    "logistics marketplace",
    "B2B trade",
    "supply chain marketplace",
    "container trading",
    "freight forwarders",
  ],
  openGraph: {
    title: "Global Supply Chain Marketplace | Shiportrade",
    description: "Buy, sell, and lease containers, find freight quotes, warehousing solutions, and connect with verified logistics partners worldwide.",
    type: "website",
    url: "https://shiportrade.com/marketplace",
    images: [
      {
        url: "/og-marketplace.png",
        width: 1200,
        height: 630,
        alt: "Shiportrade Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Supply Chain Marketplace | Shiportrade",
    description: "Buy, sell, and lease containers, find freight quotes, warehousing solutions, and connect with verified logistics partners worldwide.",
  },
};

export default function Page() {
  return <MarketplacePage />;
}
