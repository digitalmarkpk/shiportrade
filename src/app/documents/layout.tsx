import { Metadata } from "next";
import { META_DOCUMENTS_DESCRIPTION, PLATFORM_STATS } from "@/lib/constants/platform-stats";

export const metadata: Metadata = {
  title: {
    default: "Trade Document Generators | Shiportrade.com",
    template: "%s | Shiportrade Documents"
  },
  description: META_DOCUMENTS_DESCRIPTION,
  keywords: [
    "commercial invoice generator",
    "bill of lading template",
    "packing list generator",
    "certificate of origin",
    "proforma invoice",
    "trade document templates",
    "export documents",
    "import documents",
    "shipping documents",
    "customs documents",
    "free invoice generator",
    "trade document generator",
    "logistics documents",
    "freight documents"
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
    url: "https://shiportrade.com/documents",
    siteName: "Shiportrade.com",
    title: "Trade Document Generators | Shiportrade.com",
    description: META_DOCUMENTS_DESCRIPTION,
    images: [
      {
        url: "/og-documents.png",
        width: 1200,
        height: 630,
        alt: `Shiportrade Documents - ${PLATFORM_STATS.documents} Trade Document Generators`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trade Document Generators | Shiportrade.com",
    description: META_DOCUMENTS_DESCRIPTION,
    images: ["/og-documents.png"],
    creator: "@shiportrade",
  },
  alternates: {
    canonical: "https://shiportrade.com/documents",
  },
};

export default function DocumentsLayout({
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
            "name": "Shiportrade Document Generators",
            "description": META_DOCUMENTS_DESCRIPTION,
            "url": "https://shiportrade.com/documents",
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
              "ratingCount": "980",
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
