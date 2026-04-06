import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketplaceSubcategoryPage } from "./MarketplaceSubcategoryPage";
import { marketplaceCategories, allMarketplaceListings } from "@/lib/data/marketplace-listings";
import { categorySEOContent } from "../page";

// Subcategory SEO content templates
const subcategorySEOContent: Record<string, Record<string, { title: string; description: string }>> = {
  containers: {
    buy: {
      title: "Buy Shipping Containers | New & Used Containers for Sale",
      description: "Browse thousands of shipping containers for sale worldwide. 20ft, 40ft, HC, reefer containers from verified sellers. Competitive prices, CSC certified.",
    },
    sell: {
      title: "Sell Your Shipping Containers | List Containers for Sale",
      description: "List your shipping containers for sale on our global marketplace. Connect with thousands of verified buyers. Fast, secure transactions.",
    },
    lease: {
      title: "Container Leasing | Short & Long Term Container Rental",
      description: "Lease shipping containers for your logistics needs. Flexible terms from 1 day to 5 years. Global availability, competitive rates.",
    },
    reefer: {
      title: "Reefer Containers for Sale & Lease | Temperature Controlled",
      description: "Buy or lease refrigerated containers. Carrier, Thermo King units available. Temperature range -30°C to +25°C. Worldwide delivery.",
    },
    special: {
      title: "Special Containers | Open Top, Flat Rack, Tank Containers",
      description: "Find specialized containers: open top, flat rack, tank, and custom containers. For project cargo, oversized items, and liquid transport.",
    },
  },
  freight: {
    quote: {
      title: "Get Freight Quotes | Compare Shipping Rates Instantly",
      description: "Compare freight rates from 500+ carriers. Instant FCL, LCL, air freight quotes. Best rates guaranteed for your shipping needs.",
    },
    post: {
      title: "Post Shipment RFQ | Request Freight Quotes",
      description: "Post your shipment requirements and receive competitive quotes from verified freight forwarders. Free to use, fast responses.",
    },
    forwarders: {
      title: "Find Freight Forwarders | Verified Logistics Partners",
      description: "Connect with 2,000+ verified freight forwarders worldwide. Compare services, rates, and reviews. Find your ideal logistics partner.",
    },
    book: {
      title: "Book Shipment | Instant Booking Platform",
      description: "Book your shipment instantly with our streamlined platform. Real-time rates, secure payment, and tracking included.",
    },
  },
  transport: {
    trucks: {
      title: "Find Trucks | Available Trucks for Your Cargo",
      description: "Find available trucks for your shipments. 10,000+ verified carriers. Real-time tracking, competitive rates, instant booking.",
    },
    "post-load": {
      title: "Post Load | Find Carriers for Your Freight",
      description: "Post your load and find qualified carriers instantly. Free to post, connect with verified trucking companies.",
    },
    available: {
      title: "Available Trucks | Truck Availability Board",
      description: "Browse available trucks by location and equipment type. Connect with carriers for your immediate shipping needs.",
    },
  },
  warehousing: {
    find: {
      title: "Find Warehouse | Storage Space Worldwide",
      description: "Find warehouse space in 156 countries. General storage, temperature-controlled, bonded warehouses. Compare rates and availability.",
    },
    list: {
      title: "List Your Warehouse | Reach Global Clients",
      description: "List your warehouse facility on our global marketplace. Connect with thousands of businesses seeking storage solutions.",
    },
    "cold-storage": {
      title: "Cold Storage | Temperature Controlled Warehousing",
      description: "Find cold storage facilities worldwide. Frozen, chilled, and cryogenic storage. HACCP certified, real-time monitoring.",
    },
    fulfillment: {
      title: "Fulfillment Centers | E-commerce Order Fulfillment",
      description: "Find fulfillment centers for your e-commerce business. Pick, pack, ship services. Integration with major marketplaces.",
    },
  },
  vessels: {
    charter: {
      title: "Charter Vessel | Ship Charter Marketplace",
      description: "Charter vessels for your cargo needs. Time charter, voyage charter options. 5,000+ vessels available worldwide.",
    },
    list: {
      title: "List Your Vessel | Connect with Charterers",
      description: "List your vessel for charter on our maritime marketplace. Connect with cargo owners and charterers globally.",
    },
    cargo: {
      title: "Cargo for Vessel | Find Cargo for Your Ship",
      description: "Find cargo for your vessel. Browse available cargoes by route and type. Maximize your vessel utilization.",
    },
  },
  services: {
    customs: {
      title: "Customs Clearance Services | Licensed Customs Brokers",
      description: "Find licensed customs brokers for your imports/exports. Tariff classification, duty calculation, compliance services.",
    },
    forwarders: {
      title: "Freight Forwarding Services | Global Logistics Partners",
      description: "Connect with verified freight forwarders worldwide. Multimodal shipping, documentation, and logistics solutions.",
    },
    inspection: {
      title: "Cargo Inspection Services | Quality Control & Survey",
      description: "Find inspection services for your shipments. Pre-shipment inspection, quality control, survey reports.",
    },
    insurance: {
      title: "Cargo Insurance | Marine & Transit Insurance",
      description: "Find cargo insurance providers for your shipments. All-risk coverage, competitive premiums, instant certificates.",
    },
  },
  equipment: {
    port: {
      title: "Port Equipment | Cranes, Reach Stackers, Handlers",
      description: "Buy, sell, or lease port equipment. STS cranes, RTGs, reach stackers, container handlers. Verified dealers worldwide.",
    },
    cranes: {
      title: "Cranes for Sale & Lease | Port & Marine Cranes",
      description: "Find cranes for your operations. Ship-to-shore, mobile, and harbor cranes. New and used equipment available.",
    },
    handling: {
      title: "Material Handling Equipment | Forklifts, Stackers",
      description: "Find material handling equipment. Forklifts, pallet stackers, AGVs. Buy, lease, or rent from verified dealers.",
    },
  },
  parts: {
    engine: {
      title: "Marine Engine Parts | Main & Auxiliary Engine Spares",
      description: "Find marine engine spare parts. MAN, Wärtsilä, Caterpillar parts. Genuine and aftermarket options available.",
    },
    equipment: {
      title: "Ship Equipment | Deck Machinery & Navigation",
      description: "Find ship equipment and spares. Deck machinery, navigation systems, safety equipment. Global delivery.",
    },
    navigation: {
      title: "Navigation Systems | Marine Electronics & Radar",
      description: "Find navigation equipment for vessels. Radar, GPS, ECDIS, GMDSS. New and refurbished options.",
    },
  },
  b2b: {
    buyers: {
      title: "Find Buyers | Connect with International Buyers",
      description: "Find international buyers for your products. Verified importers across 156 countries. Grow your export business.",
    },
    suppliers: {
      title: "Find Suppliers | Source Products Globally",
      description: "Find verified suppliers worldwide. Commodities, raw materials, finished goods. Quality-assured sourcing.",
    },
    commodities: {
      title: "Commodity Trading | Buy & Sell Commodities",
      description: "Trade commodities on our global marketplace. Agricultural, metals, energy commodities. Real-time pricing.",
    },
    rfqs: {
      title: "RFQ Marketplace | Request for Quotations",
      description: "Browse RFQs from buyers worldwide. Respond to sourcing requests. Connect with potential customers.",
    },
  },
};

interface Props {
  params: Promise<{ slug: string; subcategory: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, subcategory } = await params;
  const seoContent = subcategorySEOContent[slug]?.[subcategory];
  const categorySeo = categorySEOContent[slug];
  
  if (!seoContent) {
    return {
      title: `${subcategory} | Shiportrade Marketplace`,
      description: `Browse ${subcategory} listings on Shiportrade marketplace.`,
    };
  }

  return {
    title: seoContent.title,
    description: seoContent.description,
    keywords: categorySeo?.keywords || [],
    openGraph: {
      title: seoContent.title,
      description: seoContent.description,
      type: "website",
      url: `https://shiportrade.com/marketplace/${slug}/${subcategory}`,
    },
    twitter: {
      card: "summary_large_image",
      title: seoContent.title,
      description: seoContent.description,
    },
    alternates: {
      canonical: `https://shiportrade.com/marketplace/${slug}/${subcategory}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug, subcategory } = await params;
  const category = marketplaceCategories.find((c) => c.slug === slug);
  
  if (!category) {
    notFound();
  }

  const subcategoryData = category.subcategories.find((s) => s.slug === subcategory);
  
  if (!subcategoryData) {
    notFound();
  }

  const seoContent = subcategorySEOContent[slug]?.[subcategory] || {
    title: `${subcategoryData.name} | Shiportrade Marketplace`,
    description: `Browse ${subcategoryData.name} listings on Shiportrade marketplace.`,
  };

  return (
    <MarketplaceSubcategoryPage 
      category={category} 
      subcategory={subcategoryData} 
      seoContent={seoContent}
    />
  );
}
