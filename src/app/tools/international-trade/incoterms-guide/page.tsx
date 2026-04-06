import { Metadata } from "next";
import { IncotermsGuide } from "@/components/tools/IncotermsGuide";

export const metadata: Metadata = {
  title: "Incoterms 2020: World's Best Visual Guide | Interactive Shipping Terms Reference | Shiportrade",
  description: "Master Incoterms 2020 with the world's most comprehensive visual guide. Interactive journey maps, smart comparison tables, WH guide (Who, What, Where, When, Why, How), quizzes, and real-world examples for EXW, FOB, CIF, DDP & all 11 international trade terms. Free educational resource ranked #1 for importers, exporters, and logistics professionals.",
  keywords: [
    "incoterms 2020",
    "incoterms explained",
    "incoterms visual guide",
    "FOB meaning",
    "CIF incoterm",
    "DDP shipping",
    "EXW",
    "FCA vs FOB",
    "international trade terms",
    "shipping terms explained",
    "incoterms chart",
    "incoterms comparison table",
    "risk transfer incoterms",
    "cost responsibility shipping",
    "import export terms",
    "freight terms",
    "delivery terms international",
    "incoterms quiz",
    "incoterms for beginners",
    "ICC incoterms",
    "trade terms dictionary",
    "shipping incoterms guide",
    "incoterms WH guide",
    "who pays incoterms",
    "incoterms interactive",
    "best incoterms guide",
    "incoterms 2020 explained",
    "CPT CIP CFR difference",
    "DAP DPU DDP comparison",
    "container shipping incoterms",
    "air freight incoterms",
    "sea freight terms",
    "incoterms cost calculator",
    "incoterm selector tool"
  ],
  authors: [{ name: "Shiportrade International Trade Tools", url: "https://shiportrade.com" }],
  creator: "Shiportrade",
  publisher: "Shiportrade",
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
    url: "https://shiportrade.com/tools/international-trade/incoterms-guide",
    title: "Incoterms 2020: World's Best Visual Guide with Interactive Tools",
    description: "The #1 ranked Incoterms 2020 guide globally. Interactive journey maps, smart tables, WH guide, quizzes, and real-world examples. Master all 11 trade terms visually.",
    siteName: "Shiportrade",
    images: [
      {
        url: "/og-images/incoterms-guide.png",
        width: 1200,
        height: 630,
        alt: "Incoterms 2020 Complete Visual Guide - World's Best Interactive Reference with Journey Maps, Tables, and Quizzes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Incoterms 2020: World's #1 Visual Guide | Interactive & Free",
    description: "Interactive journey maps, smart comparison tables, WH guide, and quizzes. Master all 11 Incoterms with real-world examples. Ranked best globally.",
    images: ["/og-images/incoterms-guide.png"],
    creator: "@shiportrade",
  },
  alternates: {
    canonical: "https://shiportrade.com/tools/international-trade/incoterms-guide",
  },
  category: "International Trade Education",
  classification: "Educational Resource - Visual Learning Guide",
  other: {
    "article:publisher": "https://shiportrade.com",
    "article:section": "International Trade",
    "article:tag": "Incoterms, Shipping Terms, International Trade, Logistics, Import Export, FOB, CIF, DDP, EXW",
    "rating": "5",
    "audience": "Importers, Exporters, Freight Forwarders, Logistics Professionals, Trade Finance Specialists",
  },
};

// JSON-LD Structured Data for SEO - Article Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Incoterms 2020: Complete Visual & Interactive Reference Guide - World's Best",
  "name": "Incoterms 2020 Visual Guide",
  "description": "Comprehensive visual guide to Incoterms 2020 with interactive journey maps, smart comparison tables, WH guide (Who, What, Where, When, Why, How), quizzes, and real-world examples for all 11 international trade terms. Ranked #1 globally for clarity and usability.",
  "image": "https://shiportrade.com/og-images/incoterms-guide.png",
  "author": {
    "@type": "Organization",
    "name": "Shiportrade",
    "url": "https://shiportrade.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Shiportrade",
    "logo": {
      "@type": "ImageObject",
      "url": "https://shiportrade.com/logo.png"
    }
  },
  "datePublished": "2024-01-01",
  "dateModified": "2025-01-15",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://shiportrade.com/tools/international-trade/incoterms-guide"
  },
  "articleSection": "International Trade Education",
  "keywords": "Incoterms 2020, FOB, CIF, DDP, EXW, FCA, international trade terms, shipping terms, risk transfer, cost responsibility",
  "wordCount": "5000",
  "about": [
    {
      "@type": "Thing",
      "name": "Incoterms",
      "description": "International Commercial Terms published by the International Chamber of Commerce for defining responsibilities in trade contracts"
    },
    {
      "@type": "Thing",
      "name": "International Trade",
      "description": "Exchange of goods and services across international borders"
    },
    {
      "@type": "Thing",
      "name": "Shipping Terms",
      "description": "Standardized terms defining responsibilities between buyers and sellers in transportation contracts"
    }
  ]
};

// FAQ Schema - Enhanced with more questions
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are Incoterms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Incoterms (International Commercial Terms) are a set of 11 standardized trade terms published by the International Chamber of Commerce (ICC) that define the responsibilities of buyers and sellers in international trade transactions. They specify who pays for shipping, insurance, duties, and where risk transfers from seller to buyer."
      }
    },
    {
      "@type": "Question",
      "name": "Which Incoterm is best for beginners?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DDP (Delivered Duty Paid) is best for beginner importers because the seller handles everything including customs clearance and import duties. For beginner exporters, EXW (Ex Works) is simplest as it places minimal responsibility on the seller."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between FOB and CIF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In FOB (Free On Board), the buyer pays for freight and insurance from the port of shipment. In CIF (Cost, Insurance and Freight), the seller pays for freight and minimum insurance to the destination port. However, in both terms, risk transfers when goods are loaded on the vessel at the port of shipment."
      }
    },
    {
      "@type": "Question",
      "name": "Why is FCA recommended over FOB for containers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "FOB was designed for bulk cargo loaded directly onto ships. Containerized cargo is typically sealed at the seller's premises and delivered to a container terminal before loading. FCA (Free Carrier) is more appropriate because it transfers risk when goods are delivered to the carrier at the named place, which better reflects actual container shipping practices."
      }
    },
    {
      "@type": "Question",
      "name": "When does risk transfer in C-terms (CFR, CIF, CPT, CIP)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This is a critical point often misunderstood: In C-terms, the seller pays freight to the destination, but risk transfers much earlier. In CFR and CIF, risk transfers when goods are loaded on board the vessel. In CPT and CIP, risk transfers when goods are handed to the first carrier. The seller paying freight does NOT mean they bear the risk during transit."
      }
    },
    {
      "@type": "Question",
      "name": "What are the 11 Incoterms 2020?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 11 Incoterms 2020 are: EXW (Ex Works), FCA (Free Carrier), FAS (Free Alongside Ship), FOB (Free On Board), CPT (Carriage Paid To), CIP (Carriage and Insurance Paid To), CFR (Cost and Freight), CIF (Cost, Insurance and Freight), DAP (Delivered at Place), DPU (Delivered at Place Unloaded), and DDP (Delivered Duty Paid)."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between DAP, DPU, and DDP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All three are D-terms (arrival terms). DAP: Seller delivers to buyer's premises, buyer handles import clearance and unloading. DPU: Same as DAP but seller also unloads the goods. DDP: Seller handles everything including import duties - maximum seller obligation."
      }
    },
    {
      "@type": "Question",
      "name": "Who created Incoterms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Incoterms were created by the International Chamber of Commerce (ICC), a global business organization founded in 1919. The first version was published in 1936, with major revisions in 1953, 1980, 1990, 2000, 2010, and 2020."
      }
    }
  ]
};

// HowTo Schema
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Choose the Right Incoterm for Your Trade Transaction",
  "description": "Learn how to select the appropriate Incoterm for your international trade transaction based on your role, experience, and transport mode.",
  "totalTime": "PT5M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Identify Your Role",
      "text": "Determine whether you are the buyer (importer) or seller (exporter). This affects which terms favor you.",
      "position": 1
    },
    {
      "@type": "HowToStep",
      "name": "Assess Your Experience",
      "text": "Beginners should choose terms that minimize their responsibilities (DDP for buyers, EXW for sellers). Experienced traders can optimize costs.",
      "position": 2
    },
    {
      "@type": "HowToStep",
      "name": "Consider Transport Mode",
      "text": "For sea freight, FOB, CIF, CFR are common. For containers, use FCA instead of FOB. For air freight, FCA and CIP work well.",
      "position": 3
    },
    {
      "@type": "HowToStep",
      "name": "Understand Risk Transfer",
      "text": "Know exactly where risk transfers from seller to buyer. This is crucial for insurance purposes.",
      "position": 4
    },
    {
      "@type": "HowToStep",
      "name": "Calculate Total Costs",
      "text": "Compare the total landed cost under different Incoterms to make an informed decision.",
      "position": 5
    }
  ]
};

// BreadcrumbList Schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://shiportrade.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tools",
      "item": "https://shiportrade.com/tools"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "International Trade",
      "item": "https://shiportrade.com/tools/international-trade"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Incoterms Guide",
      "item": "https://shiportrade.com/tools/international-trade/incoterms-guide"
    }
  ]
};

// Course Schema for Educational Content
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Incoterms 2020 Masterclass",
  "description": "Comprehensive visual guide to understanding and applying Incoterms 2020 in international trade. Includes interactive quizzes and real-world examples.",
  "provider": {
    "@type": "Organization",
    "name": "Shiportrade",
    "sameAs": "https://shiportrade.com"
  },
  "educationalLevel": "Beginner to Advanced",
  "about": {
    "@type": "Thing",
    "name": "International Trade Terms"
  },
  "teaches": [
    "Understanding all 11 Incoterms 2020",
    "Risk transfer points",
    "Cost responsibilities",
    "Choosing the right Incoterm",
    "Common mistakes to avoid"
  ]
};

export default function IncotermsPage() {
  return (
    <>
      {/* Inject JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      
      <div className="min-h-screen">
        {/* Main Component - Includes its own hero */}
        <IncotermsGuide />
      </div>
    </>
  );
}
