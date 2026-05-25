import { Metadata } from "next";
import ModulesPageClient from "./page-client";
import { META_MODULES_DESCRIPTION, PLATFORM_STATS } from "@/lib/constants/platform-stats";

export const metadata: Metadata = {
  title: "Global Trade & Logistics Modules | Complete Learning Center | Shiportrade.com",
  description: META_MODULES_DESCRIPTION,
  keywords: [
    // Module-specific keywords
    "logistics modules",
    "supply chain courses",
    "trade learning center",
    "shipping education",
    "freight training",
    "international trade courses",
    "ocean freight module",
    "air freight training",
    "customs compliance course",
    "warehousing management",
    
    // High-ranking keywords
    "import export training",
    "supply chain certification",
    "logistics management",
    "freight forwarding course",
    "trade compliance training",
    "HS code training",
    "incoterms guide",
    "container shipping course",
    "port management",
    "trade finance education",
    
    // Combined keywords
    "shipping calculators",
    "trade document templates",
    "logistics tools",
    "freight rate calculators",
    "CBM calculator",
    "landed cost calculator",
    "commercial invoice template",
    "bill of lading template",
    
    // Educational keywords
    "logistics university",
    "trade academy",
    "supply chain education",
    "maritime training",
    "e-commerce logistics course",
  ],
  authors: [{ name: "Shiportrade.com Education Team" }],
  openGraph: {
    title: "Global Trade & Logistics Modules | Shiportrade Academy",
    description: META_MODULES_DESCRIPTION,
    url: "https://www.shiportrade.com/modules",
    siteName: "Shiportrade",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Trade & Logistics Modules | Shiportrade Academy",
    description: `Master ${PLATFORM_STATS.modules} specialized logistics modules with expert resources.`,
  },
};

export default function ModulesPage() {
  return <ModulesPageClient />;
}
