import { Metadata } from "next";
import NewsClient from "./NewsClient";

// SEO Metadata for Google News
export const metadata: Metadata = {
  title: "Trade News & Industry Insights | Shiportrade - Global Supply Chain Intelligence",
  description: "Real-time trade news from 40+ trusted sources. Maritime, logistics, trade finance, geopolitical developments, and supply chain updates. Breaking news alerts and industry analysis.",
  keywords: [
    "trade news", "shipping news", "maritime news", "logistics updates", 
    "supply chain news", "freight news", "trade finance", "geopolitical trade impact",
    "ocean freight", "air cargo news", "customs updates", "port news",
    "container shipping", "global trade intelligence", "breaking trade news"
  ],
  authors: [{ name: "Shiportrade News Team" }],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Trade News & Industry Insights | Shiportrade",
    description: "Real-time trade news from 40+ trusted sources. Maritime, logistics, trade finance, and supply chain updates.",
    url: "https://shiportrade.com/news",
    siteName: "Shiportrade",
    type: "website",
    images: [
      {
        url: "https://shiportrade.com/og-news.png",
        width: 1200,
        height: 630,
        alt: "Shiportrade Trade News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trade News & Industry Insights | Shiportrade",
    description: "Real-time trade news from 40+ trusted sources. Maritime, logistics, trade finance, and supply chain updates.",
    images: ["https://shiportrade.com/og-news.png"],
  },
  alternates: {
    canonical: "https://shiportrade.com/news",
  },
  other: {
    "google-site-verification": "your-verification-code",
    "news_keywords": "trade, shipping, logistics, maritime, supply chain, freight",
  },
};

// JSON-LD Structured Data for Google News
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "name": "Shiportrade News",
  "url": "https://shiportrade.com/news",
  "logo": "https://shiportrade.com/logo.svg",
  "description": "Global trade news and supply chain intelligence from 40+ trusted sources",
  "sameAs": [
    "https://twitter.com/shiportrade",
    "https://linkedin.com/company/shiportrade",
  ],
  "publishingPrinciples": "https://shiportrade.com/editorial-policy",
};

export default function NewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsClient />
    </>
  );
}
