import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketplaceCategoryPage } from "./MarketplaceCategoryPage";
import { marketplaceCategories } from "@/lib/data/marketplace-listings";

// SEO content for each category
export const categorySEOContent: Record<string, {
  title: string;
  description: string;
  h1: string;
  longDescription: string;
  benefits: string[];
  features: string[];
  faqs: { question: string; answer: string }[];
  keywords: string[];
}> = {
  containers: {
    title: "Shipping Containers for Sale, Lease & Trade | Global Container Marketplace",
    description: "Buy, sell, or lease shipping containers worldwide. Browse 10,000+ listings of dry containers, reefers, tank containers, and special containers. Verified sellers, competitive prices, and secure transactions.",
    h1: "Global Container Trading Marketplace",
    longDescription: `The global shipping container market represents one of the most critical components of international trade, with over 35 million TEUs (Twenty-foot Equivalent Units) in circulation worldwide. Our comprehensive container marketplace connects buyers, sellers, and lessees across 156 countries, facilitating thousands of container transactions monthly.

Whether you're a freight forwarder looking for cost-effective container solutions, a trading company seeking to expand your fleet, or a business requiring storage containers, our platform offers unparalleled access to verified container listings. From standard 20ft and 40ft dry containers to specialized reefers, open tops, flat racks, and tank containers, you'll find every type of container to meet your logistics needs.

The container trading industry has evolved significantly over the past decade, with prices fluctuating based on global supply chains, trade routes, and economic conditions. Our real-time market data helps you make informed decisions, whether you're purchasing containers for long-term use or leasing for short-term projects. With features like CSC verification, condition reports, and location-based search, finding the right container has never been easier.`,
    benefits: [
      "Access to 10,000+ verified container listings worldwide",
      "Competitive pricing with transparent market rates",
      "CSC-certified containers with documented condition reports",
      "Secure escrow payment protection for all transactions",
      "Global network of 500+ verified container traders",
      "Real-time market pricing and trend analysis",
      "Flexible lease terms from 1 day to 5 years",
      "24/7 customer support in multiple languages"
    ],
    features: [
      "Advanced search by size, condition, location, and price",
      "Container inspection reports with photos",
      "Instant quote comparison from multiple sellers",
      "Integrated logistics for container delivery",
      "Trade finance and payment protection",
      "API access for enterprise clients"
    ],
    faqs: [
      {
        question: "What is the average price of a used 40ft container?",
        answer: "The average price of a used 40ft container ranges from $1,500 to $3,500 USD depending on condition, location, and market conditions. Wind and water-tight containers typically cost $1,800-$2,500, while cargo-worthy containers with valid CSC plates range from $2,200-$3,200."
      },
      {
        question: "What documents are required for container purchase?",
        answer: "When purchasing a shipping container, you'll need: CSC (Convention for Safe Containers) plate verification, bill of sale, certificate of ownership, and customs documentation if purchasing across borders. Our platform ensures all sellers provide proper documentation."
      },
      {
        question: "Can I inspect containers before purchasing?",
        answer: "Yes, all containers listed on our platform include detailed inspection reports with photographs. For high-value transactions, we can arrange third-party surveys or physical inspections at an additional cost."
      },
      {
        question: "What is the difference between cargo-worthy and wind/water tight?",
        answer: "Cargo-worthy containers meet international shipping standards and have valid CSC plates for ocean transport. Wind and water-tight containers are suitable for storage but may not meet CSC requirements for international shipping."
      }
    ],
    keywords: ["shipping containers for sale", "container trading", "buy containers", "lease containers", "40ft container price", "reefer container", "container marketplace", "CSC container", "dry container", "open top container"]
  },
  freight: {
    title: "Freight Quotes & Shipping Services | Global Freight Marketplace",
    description: "Compare freight rates from 500+ carriers. Get instant FCL, LCL, air freight, and breakbulk quotes. Post shipments, find freight forwarders, and book shipments worldwide.",
    h1: "Global Freight & Shipping Marketplace",
    longDescription: `The global freight forwarding market, valued at over $900 billion, is the backbone of international trade. Our freight marketplace revolutionizes how shippers connect with carriers, offering instant access to competitive rates across ocean, air, rail, and road transport modes.

Whether you're shipping a single container or managing complex multimodal supply chains, our platform provides the tools and connections you need. From FCL (Full Container Load) and LCL (Less than Container Load) to project cargo and breakbulk shipments, we connect you with verified freight forwarders and carriers across major trade lanes worldwide.

Our real-time rate comparison engine aggregates offers from over 500 carriers and 2,000 freight forwarders, enabling you to find the best combination of price, transit time, and service quality. With features like real-time tracking, documentation automation, and trade finance integration, managing your shipments has never been more efficient.`,
    benefits: [
      "Compare rates from 500+ carriers instantly",
      "Access to 2,000+ verified freight forwarders",
      "Real-time shipment tracking and visibility",
      "Automated documentation generation",
      "Trade finance and payment protection",
      "24/7 support with dedicated account managers",
      "Volume discounts and negotiated rates",
      "Carbon footprint tracking and offset options"
    ],
    features: [
      "Instant rate quotes for FCL, LCL, and air freight",
      "RFQ management for complex shipments",
      "Carrier performance ratings and reviews",
      "Document management and compliance checks",
      "Integrated customs clearance services",
      "API integration for TMS/ERP systems"
    ],
    faqs: [
      {
        question: "How do I get the best freight rates?",
        answer: "To secure the best rates: book 2-4 weeks in advance for ocean freight, compare multiple carriers, consider alternative ports, and leverage volume for negotiated rates. Our platform automatically compares rates from 500+ carriers to find you the best options."
      },
      {
        question: "What is the difference between FCL and LCL?",
        answer: "FCL (Full Container Load) means you book an entire container for your goods, ideal for shipments over 15 CBM. LCL (Less than Container Load) consolidates your goods with other shippers, cost-effective for smaller shipments under 15 CBM."
      },
      {
        question: "How long does ocean freight take?",
        answer: "Ocean freight transit times vary by route: Trans-Pacific (Asia to US West Coast) takes 14-20 days, Asia to Europe takes 25-35 days, Trans-Atlantic takes 14-21 days. Our platform shows transit times for each carrier option."
      },
      {
        question: "What documents are needed for international shipping?",
        answer: "Standard documents include: Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin, and customs declarations. Specific commodities may require additional documents like phytosanitary certificates or dangerous goods declarations."
      }
    ],
    keywords: ["freight quotes", "shipping rates", "FCL shipping", "LCL shipping", "freight forwarders", "ocean freight", "air freight", "container shipping rates", "freight marketplace"]
  },
  transport: {
    title: "Transport & Trucking Services | Find Trucks & Post Loads",
    description: "Find trucks, post loads, and manage road transport logistics. Connect with verified trucking companies across Europe, Asia, Americas, and Middle East. Real-time tracking and competitive rates.",
    h1: "Transport & Trucking Marketplace",
    longDescription: `The global road freight market, valued at over $3 trillion annually, is essential for connecting ports, warehouses, and final destinations in the supply chain. Our transport marketplace bridges the gap between shippers and trucking companies, offering a seamless platform for finding trucks, posting loads, and managing road transport operations.

Whether you need container drayage from port to warehouse, full truckload (FTL) services across continents, or less-than-truckload (LTL) consolidations, our platform connects you with verified carriers across Europe, Asia, the Americas, and the Middle East. With real-time GPS tracking, electronic proof of delivery, and integrated fleet management tools, you can optimize your road transport operations efficiently.

Our network includes over 10,000 verified trucking companies operating more than 150,000 vehicles, from standard dry vans and reefers to flatbeds, tankers, and specialized heavy-haul equipment. The platform's intelligent matching algorithm connects your loads with the most suitable carriers based on equipment type, route coverage, and performance ratings.`,
    benefits: [
      "Access to 10,000+ verified trucking companies",
      "Real-time GPS tracking and ETA updates",
      "Competitive rates through carrier competition",
      "Electronic proof of delivery and documentation",
      "Coverage across 156 countries",
      "Specialized equipment for all cargo types",
      "Flexible payment terms and factoring options",
      "24/7 dispatch support and load management"
    ],
    features: [
      "Load posting with instant carrier matching",
      "Truck availability search by location and type",
      "Route optimization and planning tools",
      "Carrier compliance and insurance verification",
      "Integrated fuel surcharge calculations",
      "Cross-border documentation support"
    ],
    faqs: [
      {
        question: "What is the difference between FTL and LTL?",
        answer: "FTL (Full Truckload) dedicates an entire truck to your shipment, ideal for loads over 10,000 kg or when you need exclusive use. LTL (Less than Truckload) consolidates multiple shippers' goods, cost-effective for smaller shipments under 10,000 kg."
      },
      {
        question: "How do I verify a trucking company?",
        answer: "Our platform verifies all carriers by checking: operating authority, insurance coverage, safety ratings, and financial stability. Each carrier profile displays their verification status, safety score, and customer reviews."
      },
      {
        question: "What types of trucks are available?",
        answer: "Our network includes: dry vans, reefers (temperature-controlled), flatbeds, step decks, tankers, lowboys, curtain sides, container chassis, and specialized heavy-haul equipment for oversized cargo."
      },
      {
        question: "How is freight cost calculated for road transport?",
        answer: "Road freight costs are calculated based on: distance, weight/volume, equipment type, fuel surcharge, tolls, and any special requirements (temperature control, hazardous materials). Our platform provides transparent, all-inclusive quotes."
      }
    ],
    keywords: ["trucking services", "find trucks", "post loads", "road freight", "FTL shipping", "LTL shipping", "container transport", "drayage services", "freight carriers"]
  },
  warehousing: {
    title: "Warehousing & Storage Services | Find Warehouses Worldwide",
    description: "Find warehouses, cold storage, and fulfillment centers worldwide. 5,000+ facilities with temperature control, hazmat certification, and bonded storage. Compare rates and services.",
    h1: "Warehousing & Storage Marketplace",
    longDescription: `The global warehousing market, valued at over $400 billion, plays a critical role in modern supply chains, enabling businesses to store, manage, and distribute goods efficiently. Our warehousing marketplace provides access to over 5,000 facilities worldwide, from general storage warehouses to specialized cold storage, hazmat facilities, and bonded warehouses.

Whether you're a manufacturer seeking regional distribution centers, an e-commerce company requiring fulfillment services, or a pharmaceutical company needing GDP-compliant cold storage, our platform connects you with verified warehouse operators across 156 countries. With features like real-time inventory visibility, WMS integration, and flexible lease terms, finding and managing warehouse space has never been easier.

The platform supports various storage requirements including ambient, temperature-controlled, frozen, and cryogenic storage. Additional services such as cross-docking, pick and pack, labeling, quality control, and returns management are available at most facilities. Our verification process ensures that all listed warehouses meet international standards for safety, security, and operational excellence.`,
    benefits: [
      "Access to 5,000+ verified warehouse facilities",
      "Flexible terms from spot storage to multi-year leases",
      "Temperature-controlled and cold storage options",
      "Bonded and FTZ warehouse availability",
      "Integrated WMS and inventory visibility",
      "Value-added services: pick/pack, labeling, kitting",
      "Global coverage in 156 countries",
      "24/7 security and climate monitoring"
    ],
    features: [
      "Search by location, size, and specifications",
      "Real-time availability and pricing",
      "Virtual tours and facility inspections",
      "Integration with major WMS platforms",
      "Temperature monitoring and alerts",
      "Contract management and billing"
    ],
    faqs: [
      {
        question: "What is the difference between bonded and non-bonded warehouse?",
        answer: "Bonded warehouses allow importers to store goods without paying duties until goods are released for domestic consumption. Non-bonded warehouses require duties to be paid upon import. Bonded storage is ideal for goods in transit or awaiting re-export."
      },
      {
        question: "What temperature ranges are available for cold storage?",
        answer: "Cold storage facilities typically offer: Ambient (15-25°C), Chilled (2-8°C), Refrigerated (-2 to 2°C), Frozen (-18 to -25°C), and Ultra-low (-40 to -80°C). Most facilities can accommodate multiple temperature zones."
      },
      {
        question: "What is cross-docking and when should I use it?",
        answer: "Cross-docking is a logistics practice where incoming goods are directly transferred to outbound trucks without storage. It's ideal for: time-sensitive shipments, reducing inventory costs, and consolidating LTL shipments into FTL loads."
      },
      {
        question: "What certifications should I look for in a warehouse?",
        answer: "Important certifications include: ISO 9001 (Quality Management), ISO 22000/HACCP (Food Safety), GDP (Good Distribution Practice for pharmaceuticals), TAPA (Security), AEO (Authorized Economic Operator), and BRC (British Retail Consortium)."
      }
    ],
    keywords: ["warehouse for rent", "cold storage", "fulfillment center", "bonded warehouse", "storage facility", "warehouse space", "temperature controlled storage", "distribution center", "logistics warehouse"]
  },
  vessels: {
    title: "Vessel Chartering & Maritime Services | Ship Charter Marketplace",
    description: "Charter vessels, list vessels for charter, and find cargo. Connect with shipowners and charterers worldwide. Time charter, voyage charter, and bareboat options available.",
    h1: "Vessel & Chartering Marketplace",
    longDescription: `The global ship chartering market facilitates the movement of over 11 billion tons of cargo annually, connecting cargo owners with vessel operators across the world's oceans. Our vessel chartering marketplace provides a transparent platform for charterers and shipowners to connect, negotiate, and execute charter parties efficiently.

Whether you're a commodity trader requiring a Panamax bulker for grain shipments, a project cargo manager needing a heavy-lift vessel, or a tanker operator seeking spot market opportunities, our platform offers access to thousands of vessels across all major categories. From dry bulk carriers and tankers to container ships, multipurpose vessels, and specialized offshore support vessels, you'll find the right vessel for your requirements.

Our platform supports various charter types including time charter, voyage charter, bareboat charter, and contracts of affreightment. With features like real-time vessel tracking, AIS integration, and automated charter party generation, managing your maritime operations becomes streamlined and efficient. Verified vessel operators and transparent performance data help you make informed chartering decisions.`,
    benefits: [
      "Access to 5,000+ vessels for charter",
      "Verified shipowners and operators",
      "All vessel types: bulkers, tankers, containers, MPVs",
      "Time charter, voyage charter, and bareboat options",
      "Real-time AIS tracking and vessel positions",
      "Automated charter party documentation",
      "Market analysis and freight rate trends",
      "24/7 support from maritime experts"
    ],
    features: [
      "Vessel search by type, size, and position",
      "Cargo matching for shipowners",
      "Performance data and vessel history",
      "Charter party templates and negotiation tools",
      "Market intelligence and freight indices",
      "Integration with major shipbrokers"
    ],
    faqs: [
      {
        question: "What is the difference between time charter and voyage charter?",
        answer: "Time charter involves hiring a vessel for a specific period, where the charterer pays a daily rate and controls commercial operations while the owner manages crew and vessel. Voyage charter is a one-time voyage where the owner is paid per ton of cargo or lump sum for the specific journey."
      },
      {
        question: "What size vessel do I need for my cargo?",
        answer: "Vessel size depends on cargo volume and port restrictions: Handysize (15,000-35,000 DWT) for smaller ports, Supramax (50,000-60,000 DWT) for medium volumes, Panamax (65,000-80,000 DWT) for Panama Canal transit, Capesize (100,000+ DWT) for large bulk commodities."
      },
      {
        question: "What documents are needed for vessel chartering?",
        answer: "Key documents include: Charter Party agreement, Bill of Lading, Certificate of Registry, Class Certificate, Safety Management Certificate, International Tonnage Certificate, and cargo manifests. Our platform provides standardized templates and document management."
      },
      {
        question: "How are charter rates determined?",
        answer: "Charter rates are influenced by: vessel supply and demand, cargo type and volume, voyage distance, port conditions, bunker prices, and seasonal factors. Our market intelligence provides real-time rate benchmarks across vessel types and routes."
      }
    ],
    keywords: ["vessel charter", "ship charter", "time charter", "voyage charter", "bulk carrier", "tanker charter", "shipbrokers", "maritime marketplace", "cargo ship"]
  },
  services: {
    title: "Logistics Services Marketplace | Customs, Forwarding, Inspection",
    description: "Find customs brokers, freight forwarders, inspection services, and insurance providers. Verified logistics service providers worldwide with reviews and ratings.",
    h1: "Logistics Services Marketplace",
    longDescription: `The global logistics services market encompasses a vast ecosystem of specialized service providers that keep international trade moving smoothly. Our logistics services marketplace connects businesses with verified customs brokers, freight forwarders, inspection companies, insurance providers, and other essential logistics partners across 156 countries.

Whether you need customs clearance for complex tariff classifications, freight forwarding for multimodal shipments, quality inspection before shipment, or cargo insurance for high-value goods, our platform provides access to qualified service providers with verified credentials and performance reviews. From small businesses shipping their first international order to multinational corporations managing global supply chains, our marketplace serves all logistics service needs.

The platform features comprehensive profiles for each service provider, including certifications, service coverage, industry specializations, and customer reviews. With integrated quote comparison, service booking, and performance tracking, finding and managing logistics partners has never been more efficient. Our verification process ensures that all listed providers meet professional standards and regulatory requirements.`,
    benefits: [
      "Access to verified logistics service providers",
      "Compare quotes from multiple providers",
      "Read reviews and performance ratings",
      "Integrated service booking and management",
      "Coverage in 156 countries",
      "Compliance verification and certifications",
      "Dedicated account management",
      "Dispute resolution support"
    ],
    features: [
      "Service provider search by category and location",
      "Instant quote requests and comparison",
      "Certification and compliance verification",
      "Service reviews and ratings",
      "Integrated booking and invoicing",
      "Performance tracking and reporting"
    ],
    faqs: [
      {
        question: "How do I choose a freight forwarder?",
        answer: "Consider: experience in your trade lanes, industry specializations, certifications (FIATA, FMC, IATA), financial stability, insurance coverage, and customer reviews. Our platform provides all this information in detailed provider profiles."
      },
      {
        question: "What services do customs brokers provide?",
        answer: "Customs brokers handle: tariff classification, duty calculation, customs documentation, regulatory compliance, duty drawback claims, and representation before customs authorities. They ensure your goods clear customs efficiently and compliantly."
      },
      {
        question: "Why is cargo inspection important?",
        answer: "Cargo inspection verifies quantity, quality, and condition of goods before shipment. It protects buyers from receiving non-conforming goods and provides evidence for insurance claims. Inspection certificates are often required for letters of credit."
      },
      {
        question: "What types of cargo insurance are available?",
        answer: "Main types include: Institute Cargo Clauses (A) for all-risk coverage, (B) for moderate coverage, and (C) for basic perils. Specialized coverage is available for project cargo, temperature-sensitive goods, and high-value commodities."
      }
    ],
    keywords: ["freight forwarders", "customs brokers", "cargo inspection", "cargo insurance", "logistics services", "customs clearance", "shipping services", "trade services"]
  },
  equipment: {
    title: "Port Equipment & Material Handling Machinery | Buy, Sell, Lease",
    description: "Buy, sell, or lease port equipment, cranes, forklifts, and material handling machinery. Verified equipment dealers worldwide with inspection reports and financing options.",
    h1: "Equipment & Machinery Marketplace",
    longDescription: `The global port equipment and material handling machinery market is essential for efficient cargo operations at ports, terminals, warehouses, and industrial facilities. Our equipment marketplace provides a comprehensive platform for buying, selling, and leasing port equipment, cranes, forklifts, and other material handling machinery across the global logistics industry.

Whether you're a port operator seeking new ship-to-shore cranes, a terminal upgrading its yard equipment, or a warehouse expanding its forklift fleet, our platform connects you with verified equipment dealers, manufacturers, and financial institutions. From reach stackers and container handlers to gantry cranes and automated guided vehicles (AGVs), you'll find equipment for every material handling requirement.

The platform features detailed equipment specifications, inspection reports, maintenance history, and performance data for each listing. With integrated financing options, insurance, and logistics services, acquiring material handling equipment has never been more streamlined. Our verification process ensures that all equipment meets safety and operational standards.`,
    benefits: [
      "Access to 10,000+ equipment listings",
      "Verified dealers and manufacturers",
      "Equipment inspection reports",
      "Financing and leasing options",
      "Global shipping and installation",
      "Maintenance and service contracts",
      "Trade-in and buyback programs",
      "Technical support and training"
    ],
    features: [
      "Search by equipment type, brand, and specifications",
      "Compare prices and conditions",
      "Request inspection and valuation",
      "Financing calculator and applications",
      "Equipment history and maintenance records",
      "Spare parts availability check"
    ],
    faqs: [
      {
        question: "What types of port equipment are available?",
        answer: "Available equipment includes: Ship-to-Shore (STS) cranes, Rubber Tyred Gantry (RTG) cranes, Rail Mounted Gantry (RMG) cranes, reach stackers, empty container handlers, forklifts, terminal tractors, and automated guided vehicles (AGVs)."
      },
      {
        question: "Should I buy new or used equipment?",
        answer: "New equipment offers full warranty, latest technology, and longer lifespan but higher cost. Used equipment provides immediate availability, lower cost, and proven performance. Consider your budget, operational requirements, and maintenance capabilities."
      },
      {
        question: "What financing options are available?",
        answer: "Options include: bank loans, equipment leasing, operating leases, finance leases, and manufacturer financing. Our platform connects you with multiple financing providers to find competitive rates and flexible terms."
      },
      {
        question: "How do I verify equipment condition?",
        answer: "Our platform provides detailed inspection reports from certified technicians, including operational testing, structural assessment, and maintenance history. Third-party surveys can be arranged for high-value equipment."
      }
    ],
    keywords: ["port equipment", "cranes for sale", "material handling equipment", "forklifts", "reach stackers", "container handlers", "terminal equipment", "port machinery"]
  },
  parts: {
    title: "Marine Spare Parts & Ship Equipment | Global Parts Marketplace",
    description: "Find marine spare parts, engine components, navigation systems, and ship equipment. Verified suppliers worldwide with genuine and aftermarket parts for all vessel types.",
    h1: "Marine Spare Parts Marketplace",
    longDescription: `The marine spare parts industry is crucial for maintaining vessel operations, with shipowners spending billions annually on replacement parts, engine components, and equipment. Our marine spare parts marketplace provides a comprehensive platform for sourcing genuine and aftermarket parts for all vessel types, from container ships and bulkers to tankers and offshore vessels.

Whether you're a ship superintendent sourcing main engine parts, a technical manager upgrading navigation systems, or a procurement officer seeking competitive quotes, our platform connects you with verified suppliers worldwide. From major engine manufacturers (MAN, Wärtsilä, Caterpillar) to specialized equipment providers, you'll find parts for every system on board.

The platform features detailed part specifications, compatibility information, pricing comparison, and delivery tracking. With integrated procurement management, quotation tools, and supplier performance tracking, managing your vessel's spare parts needs becomes efficient and cost-effective. Our verification process ensures that all suppliers meet quality standards and provide proper documentation.`,
    benefits: [
      "Access to 500,000+ part numbers",
      "Verified suppliers worldwide",
      "Genuine and aftermarket options",
      "Competitive pricing comparison",
      "Global delivery to any port",
      "Procurement management tools",
      "Technical support and documentation",
      "Inventory management integration"
    ],
    features: [
      "Search by part number, description, or equipment",
      "Compatibility and cross-reference tools",
      "Quote comparison from multiple suppliers",
      "Order tracking and delivery management",
      "Technical specifications and manuals",
      "Inventory alerts and reorder management"
    ],
    faqs: [
      {
        question: "What types of marine parts are available?",
        answer: "Categories include: main engine parts, auxiliary engine parts, navigation equipment, deck machinery, electrical systems, pumps and valves, hydraulic systems, safety equipment, and accommodation supplies. Both genuine and aftermarket parts are available."
      },
      {
        question: "What is the difference between genuine and aftermarket parts?",
        answer: "Genuine parts are manufactured by or for the original equipment manufacturer (OEM) with full warranty. Aftermarket parts are produced by third parties, often at lower cost, but may vary in quality. Our platform rates aftermarket suppliers by quality tier."
      },
      {
        question: "How quickly can parts be delivered?",
        answer: "Delivery times vary by location and availability: stocked items ship within 24-48 hours, ex-stock items within 3-7 days, and manufactured-to-order items within 4-12 weeks. Emergency air freight options are available for critical parts."
      },
      {
        question: "Do you provide documentation for customs clearance?",
        answer: "Yes, all shipments include commercial invoices, packing lists, certificates of origin, and any required declarations. We handle customs documentation for port deliveries worldwide and provide HS code information for each part."
      }
    ],
    keywords: ["marine spare parts", "ship parts", "engine parts", "navigation equipment", "marine equipment", "ship supplies", "vessel parts", "marine components"]
  },
  b2b: {
    title: "B2B Trade Marketplace | Find Buyers, Suppliers & Trade Opportunities",
    description: "Connect with buyers and suppliers worldwide. Post RFQs, find commodities, and discover trade opportunities. Verified trading partners across 156 countries.",
    h1: "B2B Trade Marketplace",
    longDescription: `The global B2B trade market facilitates trillions of dollars in transactions annually, connecting manufacturers, traders, and distributors across international borders. Our B2B trade marketplace provides a comprehensive platform for finding buyers, suppliers, and trade opportunities across all commodity categories and industry sectors.

Whether you're a commodity trader seeking new suppliers, a manufacturer looking for international buyers, or a procurement manager sourcing raw materials, our platform connects you with verified trading partners across 156 countries. From agricultural commodities and industrial metals to consumer goods and specialized equipment, you'll find opportunities across the global trade ecosystem.

The platform features comprehensive company profiles, trade references, product catalogs, and real-time RFQ management. With integrated trade finance, insurance, and logistics services, managing your international trade transactions becomes streamlined and secure. Our verification process ensures that all trading partners meet professional standards and have legitimate business credentials.`,
    benefits: [
      "Access to 50,000+ verified trading partners",
      "Post and respond to RFQs",
      "Commodity pricing and market data",
      "Trade finance and insurance options",
      "Verified company profiles and references",
      "Secure messaging and document sharing",
      "Market intelligence and trade data",
      "24/7 support in multiple languages"
    ],
    features: [
      "Supplier and buyer search",
      "RFQ posting and management",
      "Product catalog creation",
      "Trade show and event listings",
      "Market reports and pricing data",
      "Escrow and payment protection"
    ],
    faqs: [
      {
        question: "How do I verify a trading partner?",
        answer: "Our verification process includes: company registration verification, trade reference checks, financial stability assessment, and background screening. Verified partners display a verification badge with their credential details."
      },
      {
        question: "What trade finance options are available?",
        answer: "Options include: letters of credit, documentary collections, trade credit insurance, supply chain finance, working capital loans, and factoring. We partner with major banks and trade finance providers to offer competitive solutions."
      },
      {
        question: "How do I post an effective RFQ?",
        answer: "Include: detailed product specifications, quantity requirements, delivery location, target price, payment terms, and quality standards. The more specific your RFQ, the more accurate and competitive the quotes you'll receive."
      },
      {
        question: "What protection is available for trade transactions?",
        answer: "We offer: escrow services for payment protection, trade credit insurance against non-payment, product inspection before shipment, and dispute resolution services. These protections reduce risk in international trade transactions."
      }
    ],
    keywords: ["B2B trade", "find suppliers", "find buyers", "commodities trading", "international trade", "trade opportunities", "RFQ", "sourcing marketplace"]
  }
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return marketplaceCategories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seoContent = categorySEOContent[slug];
  
  if (!seoContent) {
    return {
      title: "Marketplace Category | Shiportrade",
    };
  }

  return {
    title: seoContent.title,
    description: seoContent.description,
    keywords: seoContent.keywords,
    openGraph: {
      title: seoContent.title,
      description: seoContent.description,
      type: "website",
      url: `https://shiportrade.com/marketplace/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: seoContent.title,
      description: seoContent.description,
    },
    alternates: {
      canonical: `https://shiportrade.com/marketplace/${slug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const category = marketplaceCategories.find((c) => c.slug === slug);
  
  if (!category) {
    notFound();
  }

  const seoContent = categorySEOContent[slug];

  return <MarketplaceCategoryPage category={category} seoContent={seoContent} />;
}
