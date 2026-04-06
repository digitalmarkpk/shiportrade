import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Trade & Logistics Tools | Shiportrade.com",
    template: "%s | Shiportrade Tools"
  },
  description: "82+ free professional calculators and tools for international trade, ocean freight, air cargo, customs compliance, warehousing, and e-commerce. Accurate, reliable, and trusted by 50,000+ logistics professionals worldwide.",
  keywords: [
    "trade calculator",
    "freight calculator",
    "CBM calculator",
    "landed cost calculator",
    "container tracking",
    "HS code search",
    "currency converter",
    "incoterms guide",
    "ocean freight tools",
    "air freight calculator",
    "customs duty calculator",
    "logistics tools",
    "supply chain tools",
    "free trade tools",
    "shipping calculator"
  ],
  authors: [{ name: "Shiportrade.com" }],
  creator: "Shiportrade.com",
  publisher: "Shiportrade.com",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shiportrade.com/tools",
    siteName: "Shiportrade.com",
    title: "Trade & Logistics Tools Hub | Shiportrade.com",
    description: "82+ free professional calculators for every aspect of global trade and supply chain management. Accurate, reliable, and trusted by thousands.",
    images: [
      {
        url: "/og-tools.png",
        width: 1200,
        height: 630,
        alt: "Shiportrade Tools Hub - 82+ Trade Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trade & Logistics Tools Hub | Shiportrade.com",
    description: "82+ free professional calculators for every aspect of global trade and supply chain management.",
    images: ["/og-tools.png"],
    creator: "@shiportrade",
  },
  alternates: {
    canonical: "https://shiportrade.com/tools",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Shiportrade Tools Hub",
            "description": "82+ free professional calculators for international trade, ocean freight, air cargo, customs compliance, and logistics.",
            "url": "https://shiportrade.com/tools",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
            },
            "author": {
              "@type": "Organization",
              "name": "Shiportrade.com",
              "url": "https://shiportrade.com",
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1250",
              "bestRating": "5",
              "worstRating": "1",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
