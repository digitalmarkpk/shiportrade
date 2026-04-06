import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantum AI Search & Insight Engine | Real-time Trade & Shipping Intelligence | Shiportrade.com",
  description: "Unlock unparalleled real-time insights & predictive analytics for global shipping, trade, and logistics with Shiportrade.com's Quantum AI. Experience AI-powered forecasting, port intelligence, freight rate predictions, and supply chain risk analysis.",
  keywords: [
    // Core Keywords
    "AI search engine",
    "quantum AI",
    "shipping intelligence",
    "trade intelligence",
    "logistics AI",
    "supply chain analytics",
    "freight rate predictions",
    "port congestion",
    "container tracking",
    "maritime intelligence",
    
    // Shipping & Freight
    "freight rates",
    "shipping rates",
    "container shipping",
    "ocean freight",
    "air freight",
    "sea freight",
    "container prices",
    "shipping costs",
    "freight forwarder",
    "NVOCC",
    
    // Ports & Terminals
    "port congestion",
    "port delays",
    "terminal operations",
    "container terminal",
    "port performance",
    "vessel tracking",
    "ship tracking",
    
    // Trade & Import/Export
    "import export",
    "global trade",
    "international trade",
    "trade routes",
    "shipping lanes",
    "trade compliance",
    "customs clearance",
    "HS codes",
    
    // Supply Chain
    "supply chain",
    "logistics",
    "warehousing",
    "inventory management",
    "last mile delivery",
    "cold chain",
    "supply chain risk",
    
    // Market Intelligence
    "market predictions",
    "freight forecasting",
    "shipping forecast",
    "trade analytics",
    "market trends",
    "commodity prices",
    
    // Companies & Services
    "shipping companies",
    "container lines",
    "Maersk",
    "MSC",
    "CMA CGM",
    "COSCO",
    "Hapag-Lloyd",
    "freight forwarding companies",
    
    // Routes
    "Asia Europe shipping",
    "Trans Pacific",
    "Suez Canal",
    "Panama Canal",
    "shipping routes",
    
    // Technology
    "AI logistics",
    "machine learning shipping",
    "predictive analytics",
    "real-time tracking",
    "data visualization",
  ],
  authors: [{ name: "Shiportrade.com Team" }],
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
    title: "Quantum AI Search & Insight Engine | Shiportrade.com",
    description: "Unlock unparalleled real-time insights & predictive analytics for global shipping, trade, and logistics with Shiportrade.com's Quantum AI.",
    url: "https://www.shiportrade.com/ai-search",
    siteName: "Shiportrade",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.shiportrade.com/og-ai-search.png",
        width: 1200,
        height: 630,
        alt: "Shiportrade Quantum AI Search Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quantum AI Search & Insight Engine | Shiportrade.com",
    description: "Real-time insights & predictive analytics for global shipping, trade, and logistics.",
    images: ["https://www.shiportrade.com/og-ai-search.png"],
    creator: "@shiportrade",
  },
  alternates: {
    canonical: "https://www.shiportrade.com/ai-search",
    languages: {
      "en-US": "https://www.shiportrade.com/ai-search",
      "en-GB": "https://www.shiportrade.com/ai-search",
      "zh-CN": "https://www.shiportrade.com/zh/ai-search",
    },
  },
  category: "technology",
  classification: "AI Search Engine for Global Trade",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.shiportrade.com/ai-search/#webpage",
      "url": "https://www.shiportrade.com/ai-search",
      "name": "Quantum AI Search & Insight Engine | Shiportrade.com",
      "description": "Unlock unparalleled real-time insights & predictive analytics for global shipping, trade, and logistics with Shiportrade.com's Quantum AI.",
      "isPartOf": {
        "@id": "https://www.shiportrade.com/#website"
      },
      "inLanguage": "en-US",
      "potentialAction": [
        {
          "@type": "ReadAction",
          "target": ["https://www.shiportrade.com/ai-search"]
        },
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.shiportrade.com/ai-search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.shiportrade.com/#website",
      "url": "https://www.shiportrade.com/",
      "name": "Shiportrade.com",
      "description": "Global Supply Chain Intelligence Hub",
      "publisher": {
        "@id": "https://www.shiportrade.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.shiportrade.com/ai-search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://www.shiportrade.com/#organization",
      "name": "Shiportrade.com",
      "url": "https://www.shiportrade.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.shiportrade.com/logo.png",
        "width": 200,
        "height": 60
      },
      "sameAs": [
        "https://twitter.com/shiportrade",
        "https://www.linkedin.com/company/shiportrade",
        "https://www.facebook.com/shiportrade"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English", "Chinese", "Spanish"]
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Quantum AI Search & Insight Engine",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free AI-powered trade and shipping intelligence"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "2500",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.shiportrade.com/ai-search/#faqpage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the Quantum AI Search Engine?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Quantum AI Search Engine is Shiportrade.com's advanced AI-powered intelligence platform that provides real-time insights, predictive analytics, and data visualizations for global shipping, trade, and logistics. It analyzes millions of data points to deliver actionable intelligence on freight rates, port congestion, trade routes, and supply chain risks."
          }
        },
        {
          "@type": "Question",
          "name": "What types of queries can I ask the AI Search?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can ask about freight rates on specific routes, port congestion levels, container availability forecasts, shipping company comparisons, trade route analysis, supply chain risk assessments, commodity price trends, and market predictions. The AI supports natural language queries like 'Current freight rates Shanghai to Rotterdam' or 'Analyze port congestion impact on supply chain'."
          }
        },
        {
          "@type": "Question",
          "name": "How accurate are the AI predictions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our AI predictions are based on comprehensive analysis of real-time data from multiple authoritative sources including Drewry, Alphaliner, Clarksons Research, and Shanghai Shipping Exchange. Each prediction includes a confidence score (typically 80-95%) and is continuously updated as new data becomes available."
          }
        },
        {
          "@type": "Question",
          "name": "Is the AI Search Engine free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Shiportrade.com's Quantum AI Search Engine is completely free to use. You can access unlimited searches, data visualizations, and insights without registration or payment."
          }
        },
        {
          "@type": "Question",
          "name": "What data sources does the AI use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The AI aggregates data from Shanghai Shipping Exchange (SCFI), Drewry Maritime Research, Alphaliner cellular fleet statistics, Clarksons Research, World Bank economic data, AIS vessel tracking systems, port authorities worldwide, and numerous other authoritative sources in real-time."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.shiportrade.com/ai-search/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.shiportrade.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "AI Search",
          "item": "https://www.shiportrade.com/ai-search"
        }
      ]
    },
    {
      "@type": "Dataset",
      "name": "Global Shipping & Trade Intelligence Database",
      "description": "Comprehensive real-time database covering freight rates, port congestion, vessel tracking, trade routes, and supply chain metrics.",
      "url": "https://www.shiportrade.com/ai-search",
      "license": "https://www.shiportrade.com/terms",
      "creator": {
        "@id": "https://www.shiportrade.com/#organization"
      },
      "distribution": {
        "@type": "DataDownload",
        "encodingFormat": "application/json",
        "contentUrl": "https://www.shiportrade.com/api/ai-search"
      },
      "temporalCoverage": "2020-01-01/..",
      "spatialCoverage": {
        "@type": "Place",
        "name": "Global"
      }
    }
  ]
};

export default function AISearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
