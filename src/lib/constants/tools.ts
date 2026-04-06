// Shiportrade.com - Complete Tool Categories
// 27 Modules with 150+ Tools, 120+ Documents, 70+ Glossary Terms

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  tools: Tool[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
  featured?: boolean;
  premium?: boolean;
  isNew?: boolean;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  documents: Document[];
}

export interface Document {
  id: string;
  name: string;
  description: string;
  slug: string;
  category: string;
  featured?: boolean;
}

// =====================================================
// TOOL CATEGORIES (27 Modules)
// =====================================================

export const toolCategories: ToolCategory[] = [
  // =====================================================
  // MODULE 1: INTERNATIONAL TRADE & E-COMMERCE
  // =====================================================
  {
    id: "international-trade",
    name: "International Trade & E-Commerce",
    description: "Comprehensive tools for global trade operations, financial calculations, and risk management",
    icon: "Globe",
    slug: "international-trade",
    tools: [
      { id: "landed-cost-calculator", name: "Landed Cost Calculator", description: "Calculate total cost of imported goods including duties, taxes, and shipping", slug: "landed-cost-calculator", icon: "Calculator", featured: true },
      { id: "profit-margin-calculator", name: "Profit Margin Calculator", description: "Calculate profit margins for international trade transactions", slug: "profit-margin-calculator", icon: "TrendingUp" },
      { id: "incoterms-guide", name: "Incoterms 2020 Guide", description: "Interactive guide to all 11 Incoterms with responsibilities and cost splits", slug: "incoterms-guide", icon: "MapPin", featured: true },
      { id: "currency-converter", name: "Currency Converter", description: "Real-time currency conversion with 180+ currencies", slug: "currency-converter", icon: "RefreshCw", featured: true },
      { id: "transfer-pricing-model", name: "Transfer Pricing Risk Model", description: "Assess transfer pricing compliance risks", slug: "transfer-pricing-model", icon: "AlertTriangle" },
      { id: "commodity-hedging", name: "Commodity Hedging Calculator", description: "Calculate hedging strategies for commodities", slug: "commodity-hedging", icon: "Shield" },
      { id: "tariff-comparison", name: "Trade Tariff Comparison", description: "Compare tariffs across different countries", slug: "tariff-comparison", icon: "GitCompare" },
      { id: "anti-dumping-checker", name: "Anti-Dumping Duty Checker", description: "Check anti-dumping duties by product and origin", slug: "anti-dumping-checker", icon: "Search" },
      { id: "fta-eligibility", name: "FTA Eligibility Checker", description: "Check eligibility for Free Trade Agreement benefits", slug: "fta-eligibility", icon: "FileCheck" },
      { id: "supplier-risk", name: "Supplier Risk Assessment", description: "Comprehensive supplier risk scoring tool", slug: "supplier-risk", icon: "UserCheck" },
      { id: "freight-procurement", name: "Freight Procurement Tool", description: "Optimize freight procurement and carrier negotiations", slug: "freight-procurement", icon: "ShoppingCart" },
      { id: "logistics-roi", name: "Logistics ROI Calculator", description: "Calculate return on investment for logistics operations", slug: "logistics-roi", icon: "TrendingUp" },
      { id: "lc-confirmation-pricing", name: "LC Confirmation Risk Pricing", description: "Calculate confirmation costs for Letters of Credit", slug: "lc-confirmation-pricing", icon: "DollarSign" },
      { id: "factoring-cost", name: "Factoring Cost Calculator", description: "Calculate costs and savings from invoice factoring", slug: "factoring-cost", icon: "Percent" },
      { id: "fx-hedging", name: "FX Hedging Calculator", description: "Plan foreign exchange hedging strategies", slug: "fx-hedging", icon: "ArrowUpDown" },
      { id: "credit-risk-scorer", name: "Credit Risk Scorer", description: "Assess credit risk of trade partners", slug: "credit-risk-scorer", icon: "UserCheck" },
      { id: "freight-transit-calculator", name: "Freight Transit Calculator", description: "Estimate transit times for sea, air, and rail freight", slug: "freight-transit-calculator", icon: "Clock" },
      { id: "freight-contract", name: "Freight Contract Analyzer", description: "Analyze and compare freight contracts", slug: "freight-contract", icon: "FileText" },
      { id: "lc-discrepancy-analyzer", name: "LC Discrepancy Analyzer", description: "Identify potential discrepancies in Letters of Credit", slug: "lc-discrepancy-analyzer", icon: "FileSearch" },
      { id: "supply-chain-visibility", name: "Supply Chain Visibility Dashboard", description: "Monitor and track supply chain operations", slug: "supply-chain-visibility", icon: "Activity" },
      { id: "unit-converter", name: "Unit Converter", description: "Convert between different units of measurement", slug: "unit-converter", icon: "Repeat" },
    ],
  },
  
  // =====================================================
  // MODULE 2: OCEAN FREIGHT & CONTAINER LOGISTICS
  // =====================================================
  {
    id: "ocean-freight",
    name: "Ocean Freight & Container Logistics",
    description: "Essential calculators for sea freight, container loading, and maritime logistics",
    icon: "Ship",
    slug: "ocean-freight",
    tools: [
      { id: "cbm-calculator", name: "CBM Calculator", description: "Calculate cubic meters for cargo volume", slug: "cbm-calculator", icon: "Box", featured: true },
      { id: "fcl-loadability", name: "FCL Loadability Engine", description: "Optimize container loading configurations", slug: "fcl-loadability", icon: "Container", featured: true },
      { id: "container-validator", name: "Container Check Digit Validator", description: "Validate container numbers using ISO algorithm", slug: "container-validator", icon: "CheckCircle" },
      { id: "vgm-calculator", name: "VGM Calculator", description: "Calculate Verified Gross Mass for containers", slug: "vgm-calculator", icon: "Scale" },
      { id: "tank-density", name: "Tank Container Density Tool", description: "Calculate density for liquid bulk in tanks", slug: "tank-density", icon: "Droplet" },
      { id: "reefer-settings", name: "Reefer Setting Calculator", description: "Optimize reefer container settings", slug: "reefer-settings", icon: "Thermometer" },
      { id: "oog-calculator", name: "OOG Overhang Calculator", description: "Calculate over-dimensional cargo requirements", slug: "oog-calculator", icon: "Move" },
      { id: "freight-rate-benchmark", name: "Freight Rate Benchmark", description: "Compare freight rates across routes", slug: "freight-rate-benchmark", icon: "LineChart" },
      { id: "baf-estimator", name: "BAF/CAF Estimator", description: "Estimate bunker and currency adjustment factors", slug: "baf-estimator", icon: "Fuel" },
      { id: "demurrage-calculator", name: "Demurrage & Detention Calculator", description: "Calculate port storage charges", slug: "demurrage-calculator", icon: "Clock", featured: true },
      { id: "transit-time", name: "Transit Time Estimator", description: "Estimate ocean freight transit times", slug: "transit-time", icon: "Calendar" },
      { id: "container-tracking", name: "Container Tracking", description: "Track shipping containers in real-time", slug: "container-tracking", icon: "Container", featured: true },
      { id: "container-leasing", name: "Container Leasing ROI", description: "Calculate ROI for container leasing decisions", slug: "container-leasing", icon: "RefreshCcw" },
      { id: "port-code-finder", name: "Port Code Finder", description: "Search UN/LOCODE port codes worldwide", slug: "port-code-finder", icon: "MapPin" },
      { id: "container-guide", name: "Container Size Guide", description: "Complete reference for ISO container specifications", slug: "container-guide", icon: "Book" },
      { id: "cargo-consolidation", name: "Cargo Consolidation Optimizer", description: "Optimize LCL consolidation opportunities", slug: "cargo-consolidation", icon: "Layers" },
      { id: "carrier-selection", name: "Carrier Selection Tool", description: "Compare and select ocean carriers", slug: "carrier-selection", icon: "Ship" },
      { id: "port-congestion", name: "Port Congestion Monitor", description: "Monitor port congestion levels worldwide", slug: "port-congestion", icon: "Activity" },
      { id: "rate-forecast", name: "Freight Rate Forecast", description: "Predict freight rate trends", slug: "rate-forecast", icon: "TrendingUp" },
      { id: "freight-index", name: "Freight Index Tracker", description: "Track global freight indices", slug: "freight-index", icon: "LineChart" },
      { id: "port-performance", name: "Port Performance Index", description: "Compare port efficiency metrics", slug: "port-performance", icon: "Gauge" },
      { id: "terminal-selector", name: "Port Terminal Selector", description: "Find optimal terminals for your cargo", slug: "terminal-selector", icon: "MapPin" },
      { id: "carrier-performance", name: "Carrier Performance Tracker", description: "Track carrier reliability", slug: "carrier-performance", icon: "Activity" },
      { id: "container-availability", name: "Container Availability Index", description: "Check container availability at ports", slug: "container-availability", icon: "Package" },
      { id: "container-utilization", name: "Container Utilization Tracker", description: "Monitor container utilization rates", slug: "container-utilization", icon: "PieChart" },
      { id: "shipment-tracking", name: "Shipment Tracking Dashboard", description: "Comprehensive shipment tracking", slug: "shipment-tracking", icon: "Map" },
      { id: "container-loading", name: "Container Loading Calculator", description: "Plan container loading arrangements", slug: "container-loading", icon: "Box" },
    ],
  },
  
  // =====================================================
  // MODULE 3: AIR FREIGHT
  // =====================================================
  {
    id: "air-freight",
    name: "Air Freight",
    description: "Specialized calculators for air cargo operations and pricing",
    icon: "Plane",
    slug: "air-freight",
    tools: [
      { id: "volumetric-weight", name: "Volumetric Weight Calculator", description: "Calculate volumetric weight for air freight", slug: "volumetric-weight", icon: "Box", featured: true },
      { id: "chargeable-weight", name: "Chargeable Weight Logic", description: "Determine chargeable weight for shipments", slug: "chargeable-weight", icon: "Scale" },
      { id: "uld-loadability", name: "ULD Loadability Tool", description: "Optimize Unit Load Device loading", slug: "uld-loadability", icon: "Package" },
      { id: "fuel-surcharge", name: "Fuel Surcharge Calculator", description: "Calculate current fuel surcharges", slug: "fuel-surcharge", icon: "Fuel" },
      { id: "iata-zone-rates", name: "IATA Zone Rate Tool", description: "Calculate rates based on IATA zones", slug: "iata-zone-rates", icon: "Globe" },
    ],
  },
  
  // =====================================================
  // MODULE 4: ROAD & RAIL
  // =====================================================
  {
    id: "road-rail",
    name: "Road, Rail & Multimodal",
    description: "Tools for surface transportation and multimodal logistics",
    icon: "Truck",
    slug: "road-rail",
    tools: [
      { id: "ldm-calculator", name: "Loading Meter (LDM) Calculator", description: "Calculate loading meters for truck transport", slug: "ldm-calculator", icon: "Ruler" },
      { id: "axle-load", name: "Axle Load Distribution", description: "Calculate axle load distribution for trucks", slug: "axle-load", icon: "Weight" },
      { id: "fuel-cost-km", name: "Fuel Cost per KM", description: "Calculate fuel costs per kilometer", slug: "fuel-cost-km", icon: "Fuel" },
      { id: "freight-class", name: "US Freight Class Calculator", description: "Determine NMFC freight class", slug: "freight-class", icon: "Tag" },
      { id: "truck-pallet", name: "Truck Pallet Capacity", description: "Calculate pallet capacity for trucks", slug: "truck-pallet", icon: "Grid3x3" },
      { id: "route-optimizer", name: "Route Optimization Tool", description: "Find optimal routes for delivery", slug: "route-optimizer", icon: "Route" },
      { id: "rail-gauge", name: "Rail Gauge Compatibility", description: "Check rail gauge compatibility across regions", slug: "rail-gauge", icon: "Train" },
      { id: "modal-shift", name: "Modal Shift Comparator", description: "Compare costs across transport modes", slug: "modal-shift", icon: "GitCompare" },
      { id: "intermodal-simulation", name: "Intermodal Cost Simulation", description: "Simulate costs for intermodal transport", slug: "intermodal-simulation", icon: "Layers" },
      { id: "drayage", name: "Drayage Calculator", description: "Calculate drayage costs", slug: "drayage", icon: "Truck" },
      { id: "last-mile", name: "Last Mile Calculator", description: "Calculate last mile delivery costs", slug: "last-mile", icon: "MapPin" },
      { id: "transport-mode-selector", name: "Transport Mode Selector", description: "Compare and select optimal transport modes", slug: "transport-mode-selector", icon: "GitCompare" },
      { id: "multimodal-planner", name: "Multimodal Route Planner", description: "Plan complex multimodal routes", slug: "multimodal-planner", icon: "Map" },
      { id: "transport-analytics", name: "Transport Analytics Dashboard", description: "Comprehensive transport analytics", slug: "transport-analytics", icon: "BarChart" },
    ],
  },
  
  // =====================================================
  // MODULE 5: CUSTOMS & COMPLIANCE
  // =====================================================
  {
    id: "customs-compliance",
    name: "Customs & Compliance",
    description: "Navigate customs procedures and ensure trade compliance",
    icon: "ShieldCheck",
    slug: "customs-compliance",
    tools: [
      { id: "hs-code-search", name: "HS Code Search Tool", description: "Search and classify Harmonized System codes", slug: "hs-code-search", icon: "Search", featured: true },
      { id: "duty-tariff-calculator", name: "Duty & Tariff Calculator", description: "Estimate import duties, tariffs, and taxes", slug: "duty-tariff-calculator", icon: "Receipt", featured: true },
      { id: "customs-valuation", name: "Customs Valuation Tool", description: "Determine customs value per WTO rules", slug: "customs-valuation", icon: "DollarSign" },
      { id: "sanctions-risk", name: "Sanctions Risk Scorer", description: "Assess sanctions exposure for trade partners", slug: "sanctions-risk", icon: "AlertCircle" },
      { id: "restricted-goods", name: "Restricted Goods Checker", description: "Check for restricted or prohibited goods", slug: "restricted-goods", icon: "Ban" },
      { id: "audit-risk", name: "Post Clearance Audit Risk Model", description: "Assess risk of customs audit", slug: "audit-risk", icon: "ClipboardAlert" },
      { id: "trade-compliance", name: "Trade Compliance Checker", description: "Comprehensive trade compliance verification", slug: "trade-compliance", icon: "ShieldCheck" },
      { id: "fta-eligibility-checker", name: "FTA Eligibility Checker", description: "Check Free Trade Agreement eligibility", slug: "fta-eligibility", icon: "FileCheck" },
    ],
  },
  
  // =====================================================
  // MODULE 6: WAREHOUSING
  // =====================================================
  {
    id: "warehousing",
    name: "Warehousing & Inventory Science",
    description: "Optimize warehouse operations and inventory management",
    icon: "Warehouse",
    slug: "warehousing",
    tools: [
      { id: "cost-calculator", name: "Warehousing Cost Calculator", description: "Estimate storage and fulfillment costs", slug: "cost-calculator", icon: "Warehouse", featured: true },
      { id: "eoq-calculator", name: "EOQ Calculator", description: "Calculate Economic Order Quantity", slug: "eoq-calculator", icon: "ShoppingCart" },
      { id: "safety-stock", name: "Safety Stock Calculator", description: "Determine optimal safety stock levels", slug: "safety-stock", icon: "Shield" },
      { id: "reorder-point", name: "Reorder Point Calculator", description: "Calculate optimal reorder points", slug: "reorder-point-calculator", icon: "Bell", featured: true },
      { id: "service-level", name: "Service Level Optimizer", description: "Optimize service level vs. inventory cost", slug: "service-level", icon: "Gauge" },
      { id: "stockout-probability", name: "Stockout Probability Model", description: "Calculate probability of stockouts", slug: "stockout-probability", icon: "TrendingDown" },
      { id: "slotting-optimization", name: "Slotting Optimization", description: "Optimize warehouse slotting", slug: "slotting-optimization", icon: "LayoutGrid" },
      { id: "demand-forecast", name: "Demand Forecast Model", description: "Forecast demand using statistical models", slug: "demand-forecast", icon: "LineChart" },
      { id: "pallet-configuration", name: "Pallet Configuration", description: "Optimize pallet loading configurations", slug: "pallet-configuration", icon: "Box" },
      { id: "pick-and-pack", name: "Pick & Pack Calculator", description: "Calculate pick and pack costs and efficiency", slug: "pick-and-pack", icon: "Package" },
      { id: "cross-docking", name: "Cross Docking Calculator", description: "Calculate cross docking savings", slug: "cross-docking", icon: "ArrowRight" },
      { id: "load-planning", name: "Load Planning Optimizer", description: "Optimize warehouse load planning", slug: "load-planning", icon: "Layers" },
      { id: "inventory-aging", name: "Inventory Aging Analysis", description: "Analyze inventory aging and identify dead stock", slug: "inventory-aging", icon: "Clock" },
      { id: "capacity-planner", name: "Warehouse Capacity Planner", description: "Plan warehouse capacity requirements", slug: "capacity-planner", icon: "Warehouse" },
      { id: "location-optimizer", name: "Warehouse Location Optimizer", description: "Optimize warehouse location selection", slug: "location-optimizer", icon: "MapPin" },
      { id: "network-designer", name: "Distribution Network Designer", description: "Design optimal distribution network", slug: "network-designer", icon: "GitCompare" },
      { id: "inventory-dashboard", name: "Inventory Management Dashboard", description: "Comprehensive inventory analytics dashboard", slug: "inventory-dashboard", icon: "LayoutDashboard" },
      { id: "kpi-dashboard", name: "Warehouse KPI Dashboard", description: "Track key warehouse performance metrics", slug: "kpi-dashboard", icon: "Activity" },
    ],
  },
  
  // =====================================================
  // MODULE 7: E-COMMERCE
  // =====================================================
  {
    id: "ecommerce",
    name: "E-Commerce & Digital Trade",
    description: "Tools for online sellers and digital marketplace operations",
    icon: "ShoppingBag",
    slug: "ecommerce",
    tools: [
      { id: "fba-calculator", name: "Amazon FBA Revenue Calculator", description: "Calculate FBA revenue and profit margins", slug: "fba-calculator", icon: "DollarSign", featured: true },
      { id: "fba-storage", name: "FBA Storage Fee Estimator", description: "Estimate Amazon FBA storage fees", slug: "fba-storage", icon: "Warehouse" },
      { id: "return-impact", name: "Return Rate Profit Impact", description: "Analyze impact of returns on profitability", slug: "return-impact", icon: "RotateCcw" },
      { id: "roas-calculator", name: "ROAS Calculator", description: "Calculate Return on Ad Spend", slug: "roas-calculator", icon: "Target" },
      { id: "cac-calculator", name: "CAC Calculator", description: "Calculate Customer Acquisition Cost", slug: "cac-calculator", icon: "UserPlus" },
      { id: "ltv-calculator", name: "LTV Calculator", description: "Calculate Customer Lifetime Value", slug: "ltv-calculator", icon: "Users" },
      { id: "contribution-margin", name: "Contribution Margin per SKU", description: "Calculate contribution margin by product", slug: "contribution-margin", icon: "Percent" },
      { id: "shopify-fees", name: "Shopify Fee Calculator", description: "Calculate Shopify platform fees", slug: "shopify-fees", icon: "CreditCard" },
      { id: "ebay-fees", name: "eBay Fee Calculator", description: "Calculate eBay selling fees", slug: "ebay-fees", icon: "DollarSign" },
      { id: "3pl-comparison", name: "3PL Cost Comparator", description: "Compare third-party logistics costs", slug: "3pl-comparison", icon: "GitCompare" },
      { id: "cod-risk", name: "COD Risk Estimator", description: "Assess Cash on Delivery risks", slug: "cod-risk", icon: "AlertTriangle" },
      { id: "order-fulfillment", name: "Order Fulfillment Calculator", description: "Calculate order fulfillment costs", slug: "order-fulfillment", icon: "Package" },
      { id: "reverse-logistics", name: "Reverse Logistics Calculator", description: "Calculate reverse logistics costs", slug: "reverse-logistics", icon: "RotateCcw" },
    ],
  },
  
  // =====================================================
  // MODULE 8: INSURANCE
  // =====================================================
  {
    id: "insurance",
    name: "Insurance & Actuarial Risk",
    description: "Calculate insurance premiums and assess cargo risks",
    icon: "Shield",
    slug: "insurance",
    tools: [
      { id: "marine-premium", name: "Marine Insurance Premium", description: "Calculate marine insurance premiums", slug: "marine-premium", icon: "Shield" },
      { id: "expected-loss", name: "Expected Loss Calculator", description: "Calculate expected loss values", slug: "expected-loss", icon: "TrendingDown" },
      { id: "var-calculator", name: "Value at Risk (VaR)", description: "Calculate Value at Risk metrics", slug: "var-calculator", icon: "BarChart" },
      { id: "monte-carlo", name: "Monte Carlo Freight Volatility", description: "Simulate freight rate volatility", slug: "monte-carlo", icon: "Dice5" },
      { id: "stress-testing", name: "Stress Testing Engine", description: "Run stress tests on supply chain", slug: "stress-testing", icon: "Zap" },
      { id: "tcor", name: "Total Cost of Risk (TCOR)", description: "Calculate total cost of risk", slug: "tcor", icon: "DollarSign" },
      { id: "general-average", name: "General Average Estimator", description: "Estimate general average contributions", slug: "general-average", icon: "PieChart" },
      { id: "liability-limit", name: "Liability Limit Calculator", description: "Calculate carrier liability limits", slug: "liability-limit", icon: "Scale" },
      { id: "cargo-quoter", name: "Cargo Insurance Quoter", description: "Get cargo insurance quotes", slug: "cargo-quoter", icon: "Shield" },
      { id: "freight-claims", name: "Freight Claims Calculator", description: "Calculate freight claims and compensation", slug: "freight-claims", icon: "FileWarning" },
    ],
  },
  
  // =====================================================
  // MODULE 9: SUSTAINABILITY
  // =====================================================
  {
    id: "sustainability",
    name: "Sustainability & ESG",
    description: "Measure and manage environmental impact in logistics",
    icon: "Leaf",
    slug: "sustainability",
    tools: [
      { id: "carbon-footprint", name: "Carbon Footprint Calculator", description: "Calculate CO2 emissions for shipments", slug: "carbon-footprint", icon: "Leaf", featured: true },
      { id: "cii-checker", name: "CII Checker", description: "Check Carbon Intensity Indicator ratings", slug: "cii-checker", icon: "Gauge" },
      { id: "esg-rating", name: "ESG Risk Rating Tool", description: "Assess ESG risk in supply chain", slug: "esg-rating", icon: "ShieldCheck" },
      { id: "carbon-tax", name: "Carbon Tax Impact Model", description: "Calculate carbon tax implications", slug: "carbon-tax", icon: "Receipt" },
      { id: "cold-chain", name: "Cold Chain Monitor", description: "Monitor cold chain compliance", slug: "cold-chain", icon: "Thermometer" },
    ],
  },
  
  // =====================================================
  // MODULE 10: PROJECT CARGO
  // =====================================================
  {
    id: "project-cargo",
    name: "Project Cargo & Engineering",
    description: "Specialized tools for heavy lift and project logistics",
    icon: "Wrench",
    slug: "project-cargo",
    tools: [
      { id: "lashing-force", name: "Lashing Force Calculator", description: "Calculate required lashing forces", slug: "lashing-force", icon: "Link" },
      { id: "cog-finder", name: "Center of Gravity Finder", description: "Determine center of gravity for cargo", slug: "cog-finder", icon: "Target" },
      { id: "ground-pressure", name: "Ground Pressure Calculator", description: "Calculate ground pressure distribution", slug: "ground-pressure", icon: "Layers" },
      { id: "wind-load", name: "Wind Load Calculator", description: "Calculate wind loads on cargo", slug: "wind-load", icon: "Wind" },
    ],
  },
  
  // =====================================================
  // MODULE 11: BLOCKCHAIN & DIGITAL SUPPLY CHAIN
  // =====================================================
  {
    id: "blockchain-digital-supply-chain",
    name: "Blockchain & Digital Supply Chain",
    description: "Cutting-edge tools for blockchain-enabled supply chain transparency",
    icon: "Link",
    slug: "blockchain-digital-supply-chain",
    tools: [
      { id: "traceability-ledger-simulator", name: "Traceability Ledger Simulator", description: "Simulate a product's journey on blockchain", slug: "traceability-ledger-simulator", icon: "Blocks", featured: true, isNew: true },
      { id: "smart-contract-creator", name: "Smart Contract Creator", description: "Generate supply chain smart contract templates", slug: "smart-contract-creator", icon: "FileCode", isNew: true },
    ],
  },
  
  // =====================================================
  // MODULE 12: FINANCIAL & PAYMENT
  // =====================================================
  {
    id: "financial-payment",
    name: "Financial & Payment Tools",
    description: "Financial calculators for trade and payment management",
    icon: "DollarSign",
    slug: "financial-payment",
    tools: [
      { id: "payment-terms-calculator", name: "Payment Terms Calculator", description: "Calculate payment terms impact", slug: "payment-terms-calculator", icon: "Calendar" },
      { id: "break-even-analyzer", name: "Break-Even Analyzer", description: "Determine break-even point for operations", slug: "break-even-analyzer", icon: "Target" },
      { id: "roi-calculator", name: "ROI Calculator", description: "Calculate return on investment", slug: "roi-calculator", icon: "TrendingUp" },
      { id: "currency-exchange-calculator", name: "Currency Exchange Calculator", description: "Convert currencies with live rates", slug: "currency-exchange-calculator", icon: "RefreshCw" },
    ],
  },
  
  // =====================================================
  // MODULE 13: LOGISTICS PLANNING
  // =====================================================
  {
    id: "logistics-planning",
    name: "Logistics Planning",
    description: "Strategic planning tools for logistics operations",
    icon: "Map",
    slug: "logistics-planning",
    tools: [
      { id: "freight-rate-calculator", name: "Freight Rate Calculator", description: "Calculate freight rates across modes", slug: "freight-rate-calculator", icon: "DollarSign" },
      { id: "lead-time-calculator", name: "Lead Time Calculator", description: "Calculate supply chain lead times", slug: "lead-time-calculator", icon: "Clock" },
      { id: "route-planning", name: "Route Planning Tool", description: "Plan and optimize delivery routes", slug: "route-planning", icon: "Route" },
      { id: "logistics-benchmarking", name: "Logistics Benchmarking Tool", description: "Benchmark logistics performance", slug: "logistics-benchmarking", icon: "BarChart" },
    ],
  },
  
  // =====================================================
  // MODULE 14: INVENTORY MANAGEMENT
  // =====================================================
  {
    id: "inventory-management",
    name: "Inventory Management",
    description: "Tools for inventory control and optimization",
    icon: "Package",
    slug: "inventory-management",
    tools: [
      { id: "inventory-optimization", name: "Inventory Optimization Tool", description: "Optimize inventory levels", slug: "inventory-optimization", icon: "Package" },
      { id: "inventory-turnover-calculator", name: "Inventory Turnover Calculator", description: "Calculate inventory turnover rates", slug: "inventory-turnover-calculator", icon: "RefreshCw" },
      { id: "reorder-point-calculator", name: "Reorder Point Calculator", description: "Calculate optimal reorder points", slug: "reorder-point-calculator", icon: "Bell" },
      { id: "container-load-calculator", name: "Container Load Calculator", description: "Calculate container load planning", slug: "container-load-calculator", icon: "Box" },
    ],
  },
  
  // =====================================================
  // MODULE 15: TRADE FINANCE
  // =====================================================
  {
    id: "trade-finance",
    name: "Trade Finance",
    description: "Financial instruments and trade finance tools",
    icon: "Landmark",
    slug: "trade-finance",
    tools: [
      { id: "lc-application", name: "LC Application Generator", description: "Generate Letter of Credit applications", slug: "lc-application", icon: "FileText" },
      { id: "letter-of-credit", name: "Letter of Credit Generator", description: "Generate letter of credit documents", slug: "letter-of-credit", icon: "FileSignature" },
      { id: "bank-guarantee", name: "Bank Guarantee Calculator", description: "Calculate bank guarantee costs", slug: "bank-guarantee", icon: "Building" },
      { id: "forfaiting-calculator", name: "Forfaiting Calculator", description: "Calculate forfaiting costs and yields", slug: "forfaiting-calculator", icon: "Percent" },
    ],
  },
  
  // =====================================================
  // MODULE 16: SUPPLY CHAIN ANALYTICS
  // =====================================================
  {
    id: "supply-chain-analytics",
    name: "Supply Chain Analytics",
    description: "Advanced analytics and reporting tools",
    icon: "BarChart",
    slug: "supply-chain-analytics",
    tools: [
      { id: "supply-chain-dashboard", name: "Supply Chain Dashboard", description: "Comprehensive supply chain analytics", slug: "supply-chain-dashboard", icon: "LayoutDashboard" },
      { id: "kpI-tracker", name: "KPI Tracker", description: "Track key performance indicators", slug: "kpi-tracker", icon: "Activity" },
      { id: "trend-analysis", name: "Trend Analysis Tool", description: "Analyze supply chain trends", slug: "trend-analysis", icon: "TrendingUp" },
      { id: "benchmark-report", name: "Benchmark Report Generator", description: "Generate benchmark comparison reports", slug: "benchmark-report", icon: "FileBarChart" },
    ],
  },
  
  // =====================================================
  // MODULE 17: QUALITY CONTROL
  // =====================================================
  {
    id: "quality-control",
    name: "Quality Control",
    description: "Quality assurance and inspection tools",
    icon: "CheckSquare",
    slug: "quality-control",
    tools: [
      { id: "inspection-checklist", name: "Inspection Checklist Generator", description: "Generate inspection checklists", slug: "inspection-checklist", icon: "ClipboardCheck" },
      { id: "quality-metrics", name: "Quality Metrics Calculator", description: "Calculate quality metrics and scores", slug: "quality-metrics", icon: "Star" },
      { id: "defect-tracker", name: "Defect Rate Tracker", description: "Track and analyze defect rates", slug: "defect-tracker", icon: "AlertCircle" },
    ],
  },
  
  // =====================================================
  // MODULE 18: PACKAGING & LABELING
  // =====================================================
  {
    id: "packaging-labeling",
    name: "Packaging & Labeling",
    description: "Packaging optimization and labeling tools",
    icon: "Package",
    slug: "packaging-labeling",
    tools: [
      { id: "packaging-optimizer", name: "Packaging Optimizer", description: "Optimize packaging configurations", slug: "packaging-optimizer", icon: "Package" },
      { id: "label-generator", name: "Shipping Label Generator", description: "Generate shipping labels", slug: "label-generator", icon: "Tag" },
      { id: "barcode-generator", name: "Barcode Generator", description: "Generate barcodes for products", slug: "barcode-generator", icon: "Barcode" },
    ],
  },
  
  // =====================================================
  // MODULE 19: LAST MILE DELIVERY
  // =====================================================
  {
    id: "last-mile-delivery",
    name: "Last Mile Delivery",
    description: "Last mile delivery optimization tools",
    icon: "Truck",
    slug: "last-mile-delivery",
    tools: [
      { id: "delivery-scheduler", name: "Delivery Scheduler", description: "Schedule and optimize deliveries", slug: "delivery-scheduler", icon: "Calendar" },
      { id: "zone-planner", name: "Delivery Zone Planner", description: "Plan delivery zones and territories", slug: "zone-planner", icon: "Map" },
      { id: "courier-comparison", name: "Courier Comparison Tool", description: "Compare courier services and rates", slug: "courier-comparison", icon: "GitCompare" },
    ],
  },
  
  // =====================================================
  // MODULE 20: DANGEROUS GOODS
  // =====================================================
  {
    id: "dangerous-goods",
    name: "Dangerous Goods",
    description: "Tools for handling dangerous goods and hazmat",
    icon: "AlertTriangle",
    slug: "dangerous-goods",
    tools: [
      { id: "un-number-search", name: "UN Number Search", description: "Search UN numbers for dangerous goods", slug: "un-number-search", icon: "Search" },
      { id: "hazmat-classifier", name: "Hazmat Classifier", description: "Classify hazardous materials", slug: "hazmat-classifier", icon: "AlertTriangle" },
      { id: "dg-documentation", name: "DG Documentation Generator", description: "Generate dangerous goods documentation", slug: "dg-documentation", icon: "FileWarning" },
    ],
  },
  
  // =====================================================
  // MODULE 21: COLD CHAIN
  // =====================================================
  {
    id: "cold-chain",
    name: "Cold Chain Management",
    description: "Temperature-controlled logistics tools",
    icon: "Thermometer",
    slug: "cold-chain",
    tools: [
      { id: "temp-monitor", name: "Temperature Monitor", description: "Monitor temperature-sensitive shipments", slug: "temp-monitor", icon: "Thermometer" },
      { id: "cold-chain-validator", name: "Cold Chain Validator", description: "Validate cold chain compliance", slug: "cold-chain-validator", icon: "CheckCircle" },
      { id: "pharma-shipping", name: "Pharma Shipping Guide", description: "Guide for pharmaceutical shipments", slug: "pharma-shipping", icon: "Pill" },
    ],
  },
  
  // =====================================================
  // MODULE 22: CUSTOMS BROKERAGE
  // =====================================================
  {
    id: "customs-brokerage",
    name: "Customs Brokerage",
    description: "Customs clearance and brokerage tools",
    icon: "Shield",
    slug: "customs-brokerage",
    tools: [
      { id: "customs-entry", name: "Customs Entry Generator", description: "Generate customs entry documents", slug: "customs-entry", icon: "FileText" },
      { id: "duty-deferral", name: "Duty Deferral Calculator", description: "Calculate duty deferral options", slug: "duty-deferral", icon: "DollarSign" },
      { id: "bond-calculator", name: "Customs Bond Calculator", description: "Calculate customs bond requirements", slug: "bond-calculator", icon: "Calculator" },
    ],
  },
  
  // =====================================================
  // MODULE 23: FREIGHT FORWARDING
  // =====================================================
  {
    id: "freight-forwarding",
    name: "Freight Forwarding",
    description: "Freight forwarding operations tools",
    icon: "Ship",
    slug: "freight-forwarding",
    tools: [
      { id: "booking-manager", name: "Booking Manager", description: "Manage freight bookings", slug: "booking-manager", icon: "Calendar" },
      { id: "consolidation-planner", name: "Consolidation Planner", description: "Plan shipment consolidations", slug: "consolidation-planner", icon: "Layers" },
      { id: "forwarder-directory", name: "Forwarder Directory", description: "Find freight forwarders worldwide", slug: "forwarder-directory", icon: "Building" },
    ],
  },
  
  // =====================================================
  // MODULE 24: TRADE COMPLIANCE
  // =====================================================
  {
    id: "trade-compliance-advanced",
    name: "Trade Compliance Advanced",
    description: "Advanced trade compliance tools",
    icon: "ShieldCheck",
    slug: "trade-compliance-advanced",
    tools: [
      { id: "export-control", name: "Export Control Checker", description: "Check export control requirements", slug: "export-control", icon: "Lock" },
      { id: "dual-use-checker", name: "Dual-Use Goods Checker", description: "Identify dual-use goods", slug: "dual-use-checker", icon: "Search" },
      { id: "compliance-audit", name: "Compliance Audit Tool", description: "Conduct compliance audits", slug: "compliance-audit", icon: "ClipboardList" },
    ],
  },
  
  // =====================================================
  // MODULE 25: VESSEL OPERATIONS
  // =====================================================
  {
    id: "vessel-operations",
    name: "Vessel Operations",
    description: "Maritime vessel operations tools",
    icon: "Ship",
    slug: "vessel-operations",
    tools: [
      { id: "vessel-schedule", name: "Vessel Schedule Tracker", description: "Track vessel schedules", slug: "vessel-schedule", icon: "Calendar" },
      { id: "berth-planner", name: "Berth Planner", description: "Plan vessel berthing", slug: "berth-planner", icon: "Anchor" },
      { id: "vessel-performance", name: "Vessel Performance Monitor", description: "Monitor vessel performance metrics", slug: "vessel-performance", icon: "Activity" },
    ],
  },
  
  // =====================================================
  // MODULE 26: PORT OPERATIONS
  // =====================================================
  {
    id: "port-operations",
    name: "Port Operations",
    description: "Port and terminal operations tools",
    icon: "Anchor",
    slug: "port-operations",
    tools: [
      { id: "terminal-operations", name: "Terminal Operations Tracker", description: "Track terminal operations", slug: "terminal-operations", icon: "Activity" },
      { id: "berth-availability", name: "Berth Availability Checker", description: "Check berth availability", slug: "berth-availability", icon: "Anchor" },
      { id: "port-charges", name: "Port Charges Calculator", description: "Calculate port charges", slug: "port-charges", icon: "DollarSign" },
    ],
  },
  
  // =====================================================
  // MODULE 27: DOCUMENTS (Trade Document Generators)
  // =====================================================
  {
    id: "documents",
    name: "Trade Document Generators",
    description: "Professional document templates for international trade",
    icon: "FileText",
    slug: "documents",
    tools: [
      { id: "commercial-invoice", name: "Commercial Invoice", description: "Generate professional commercial invoices", slug: "commercial-invoice", icon: "FileText", featured: true },
      { id: "pro-forma-invoice", name: "Pro Forma Invoice", description: "Create pro forma invoices for quotations", slug: "pro-forma-invoice", icon: "Receipt" },
      { id: "packing-list", name: "Packing List", description: "Generate detailed packing lists", slug: "packing-list", icon: "Package" },
      { id: "certificate-of-origin", name: "Certificate of Origin", description: "Create certificates of origin for trade", slug: "certificate-of-origin", icon: "Award" },
      { id: "shipping-instructions", name: "Shipping Instructions", description: "Generate shipping instructions for carriers", slug: "shipping-instructions", icon: "Send" },
      { id: "bill-of-lading", name: "Bill of Lading", description: "Create ocean bill of lading documents", slug: "bill-of-lading", icon: "FileText", featured: true },
      { id: "lc-application", name: "LC Application Draft", description: "Generate LC application documents", slug: "lc-application", icon: "FileCheck" },
      { id: "insurance-certificate", name: "Insurance Certificate", description: "Create marine insurance certificates", slug: "insurance-certificate", icon: "Shield" },
      { id: "shippers-letter-of-instruction", name: "Shipper's Letter of Instruction", description: "Generate SLI documents", slug: "shippers-letter-of-instruction", icon: "FileText" },
      { id: "export-declaration", name: "Export Declaration", description: "Generate export customs declarations", slug: "export-declaration", icon: "FileCheck" },
      { id: "inspection-certificate", name: "Inspection Certificate", description: "Create inspection certificates", slug: "inspection-certificate", icon: "CheckCircle" },
      { id: "dangerous-goods-declaration", name: "Dangerous Goods Declaration", description: "Create IMO dangerous goods declarations", slug: "dangerous-goods-declaration", icon: "AlertTriangle" },
      { id: "letter-of-credit", name: "Letter of Credit Generator", description: "Generate letter of credit documents", slug: "letter-of-credit", icon: "FileSignature" },
    ],
  },
];

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const featuredTools = toolCategories.flatMap(cat => 
  cat.tools.filter(tool => tool.featured)
).slice(0, 15);

export const newTools = toolCategories.flatMap(cat => 
  cat.tools.filter(tool => tool.isNew)
);

export function getToolBySlug(categorySlug: string, toolSlug: string): Tool | undefined {
  const category = toolCategories.find(cat => cat.slug === categorySlug);
  return category?.tools.find(tool => tool.slug === toolSlug);
}

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return toolCategories.find(cat => cat.slug === slug);
}

export const totalToolsCount = toolCategories.reduce((sum, cat) => sum + cat.tools.length, 0);
export const totalCategoriesCount = toolCategories.length - 1; // Exclude documents category

// =====================================================
// MODULE METADATA - SINGLE SOURCE OF TRUTH
// =====================================================

// Map modules to their related document categories
export const moduleDocumentMap: Record<string, string[]> = {
  "international-trade": ["trade-documents", "finance-documents", "customs-documents"],
  "ocean-freight": ["shipping-documents", "insurance-documents"],
  "air-freight": ["shipping-documents"],
  "road-rail": ["shipping-documents"],
  "customs-compliance": ["customs-documents", "inspection-documents"],
  "warehousing": ["inspection-documents", "logistics-documents"],
  "ecommerce": ["trade-documents", "logistics-documents"],
  "insurance": ["insurance-documents"],
  "sustainability": ["inspection-documents"],
  "project-cargo": ["shipping-documents", "inspection-documents"],
  "blockchain-digital-supply-chain": ["trade-documents"],
  "financial-payment": ["finance-documents"],
  "logistics-planning": ["shipping-documents", "logistics-documents"],
  "inventory-management": ["logistics-documents"],
  "trade-finance": ["finance-documents", "trade-documents"],
  "supply-chain-analytics": ["trade-documents"],
  "quality-control": ["inspection-documents"],
  "packaging-labeling": ["logistics-documents"],
  "last-mile-delivery": ["logistics-documents", "shipping-documents"],
  "dangerous-goods": ["dangerous-goods-documents"],
  "cold-chain": ["inspection-documents", "logistics-documents"],
  "customs-brokerage": ["customs-documents"],
  "freight-forwarding": ["shipping-documents", "customs-documents"],
  "trade-compliance-advanced": ["customs-documents"],
  "vessel-operations": ["shipping-documents"],
  "port-operations": ["shipping-documents", "logistics-documents"],
  "documents": ["trade-documents", "shipping-documents", "customs-documents", "finance-documents", "insurance-documents", "inspection-documents", "dangerous-goods-documents", "phytosanitary-documents", "food-documents", "other-documents", "logistics-documents"],
};

// Module Metadata Interface
export interface ModuleMetadata {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tools: number;
  documents: number;
  color: string;
  description: string;
}

// Module colors for consistent styling (used before documentCategories)
function getModuleColor(moduleId: string): string {
  const colors: Record<string, string> = {
    "international-trade": "bg-gradient-to-br from-blue-500 to-indigo-600",
    "ocean-freight": "bg-gradient-to-br from-cyan-500 to-blue-600",
    "air-freight": "bg-gradient-to-br from-sky-400 to-blue-500",
    "road-rail": "bg-gradient-to-br from-orange-500 to-amber-500",
    "customs-compliance": "bg-gradient-to-br from-red-500 to-rose-600",
    "warehousing": "bg-gradient-to-br from-violet-500 to-purple-600",
    "ecommerce": "bg-gradient-to-br from-pink-500 to-rose-500",
    "insurance": "bg-gradient-to-br from-teal-500 to-cyan-600",
    "sustainability": "bg-gradient-to-br from-green-500 to-emerald-600",
    "project-cargo": "bg-gradient-to-br from-slate-500 to-gray-600",
    "blockchain-digital-supply-chain": "bg-gradient-to-br from-purple-500 to-indigo-600",
    "financial-payment": "bg-gradient-to-br from-emerald-500 to-green-600",
    "trade-finance": "bg-gradient-to-br from-emerald-500 to-green-600",
    "logistics-planning": "bg-gradient-to-br from-blue-400 to-indigo-500",
    "inventory-management": "bg-gradient-to-br from-violet-400 to-purple-500",
    "supply-chain-analytics": "bg-gradient-to-br from-cyan-500 to-blue-600",
    "quality-control": "bg-gradient-to-br from-green-500 to-emerald-500",
    "packaging-labeling": "bg-gradient-to-br from-amber-500 to-orange-500",
    "last-mile-delivery": "bg-gradient-to-br from-pink-400 to-rose-500",
    "dangerous-goods": "bg-gradient-to-br from-red-600 to-orange-600",
    "cold-chain": "bg-gradient-to-br from-sky-400 to-cyan-500",
    "customs-brokerage": "bg-gradient-to-br from-indigo-500 to-violet-600",
    "freight-forwarding": "bg-gradient-to-br from-blue-500 to-cyan-500",
    "trade-compliance-advanced": "bg-gradient-to-br from-purple-600 to-indigo-600",
    "vessel-operations": "bg-gradient-to-br from-blue-600 to-slate-600",
    "port-operations": "bg-gradient-to-br from-teal-500 to-cyan-500",
    "documents": "bg-gradient-to-br from-orange-500 to-amber-600",
  };
  return colors[moduleId] || "bg-gradient-to-br from-blue-500 to-indigo-600";
}

// Pre-computed document counts for each module (hardcoded to avoid circular dependency)
const moduleDocumentCounts: Record<string, number> = {
  "international-trade": 29, // trade-documents(8) + finance-documents(11) + customs-documents(10)
  "ocean-freight": 18, // shipping-documents(12) + insurance-documents(6)
  "air-freight": 12, // shipping-documents
  "road-rail": 12, // shipping-documents
  "customs-compliance": 17, // customs-documents(10) + inspection-documents(7)
  "warehousing": 18, // inspection-documents(7) + logistics-documents(11)
  "ecommerce": 19, // trade-documents(8) + logistics-documents(11)
  "insurance": 6, // insurance-documents
  "sustainability": 7, // inspection-documents
  "project-cargo": 19, // shipping-documents(12) + inspection-documents(7)
  "blockchain-digital-supply-chain": 8, // trade-documents
  "financial-payment": 11, // finance-documents
  "logistics-planning": 23, // shipping-documents(12) + logistics-documents(11)
  "inventory-management": 11, // logistics-documents
  "trade-finance": 19, // finance-documents(11) + trade-documents(8)
  "supply-chain-analytics": 8, // trade-documents
  "quality-control": 7, // inspection-documents
  "packaging-labeling": 11, // logistics-documents
  "last-mile-delivery": 23, // logistics-documents(11) + shipping-documents(12)
  "dangerous-goods": 6, // dangerous-goods-documents
  "cold-chain": 18, // inspection-documents(7) + logistics-documents(11)
  "customs-brokerage": 10, // customs-documents
  "freight-forwarding": 22, // shipping-documents(12) + customs-documents(10)
  "trade-compliance-advanced": 10, // customs-documents
  "vessel-operations": 12, // shipping-documents
  "port-operations": 23, // shipping-documents(12) + logistics-documents(11)
  "documents": 120, // all documents
};

// Complete module metadata with accurate counts - SINGLE SOURCE OF TRUTH
export const modulesMetadata: ModuleMetadata[] = toolCategories.map(cat => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  icon: cat.icon,
  tools: cat.tools.length,
  documents: moduleDocumentCounts[cat.slug] || 0,
  color: getModuleColor(cat.id),
  description: cat.description,
}));

// Helper function to get module metadata by slug
export function getModuleMetadataBySlug(slug: string): ModuleMetadata | undefined {
  return modulesMetadata.find(m => m.slug === slug);
}

// Related Content Suggestions
export function getRelatedTools(currentToolId: string, categorySlug: string, limit: number = 5): Tool[] {
  const category = toolCategories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  
  return category.tools
    .filter(tool => tool.id !== currentToolId)
    .slice(0, limit);
}

export function getCrossCategoryRelatedTools(currentCategorySlug: string, limit: number = 3): Tool[] {
  const relatedTools: Tool[] = [];
  
  for (const category of toolCategories) {
    if (category.slug !== currentCategorySlug && category.slug !== 'documents' && category.slug !== 'standalone-tools') {
      const featured = category.tools.find(t => t.featured);
      if (featured) {
        relatedTools.push(featured);
      }
    }
    if (relatedTools.length >= limit) break;
  }
  
  return relatedTools;
}

// =====================================================
// GLOSSARY TERMS (70+)
// =====================================================

export const glossaryTerms: Record<string, { term: string; definition: string }> = {
  // A
  "afs": { term: "AFS", definition: "Additional Freight Surcharge - Extra charges applied by carriers" },
  "ams": { term: "AMS", definition: "Automated Manifest System - US customs electronic manifest system" },
  "aq": { term: "AQ", definition: "Any Quantity - Rate applicable to any shipment size" },
  
  // B
  "baf": { term: "BAF", definition: "Bunker Adjustment Factor - Fuel surcharge applied to ocean freight" },
  "bl": { term: "Bill of Lading", definition: "Legal document between shipper and carrier detailing cargo" },
  "b/l": { term: "B/L", definition: "Abbreviation for Bill of Lading" },
  
  // C
  "caf": { term: "CAF", definition: "Currency Adjustment Factor - Surcharge to compensate for currency fluctuations" },
  "cbm": { term: "CBM", definition: "Cubic Meter - Standard unit of volume measurement in shipping" },
  "cfr": { term: "CFR", definition: "Cost and Freight - Incoterm where seller pays freight to destination port" },
  "cif": { term: "CIF", definition: "Cost, Insurance, and Freight - Incoterm including insurance" },
  "cii": { term: "CII", definition: "Carbon Intensity Indicator - IMO's ship efficiency rating system" },
  "cip": { term: "CIP", definition: "Carriage and Insurance Paid To - Incoterm" },
  "cpt": { term: "CPT", definition: "Carriage Paid To - Incoterm" },
  "cy": { term: "CY", definition: "Container Yard - Facility where containers are stored" },
  "cfs": { term: "CFS", definition: "Container Freight Station - Facility for LCL consolidation" },
  
  // D
  "daf": { term: "DAF", definition: "Delivered at Frontier - Incoterm (replaced by DAP)" },
  "dap": { term: "DAP", definition: "Delivered at Place - Incoterm" },
  "dat": { term: "DAT", definition: "Delivered at Terminal - Incoterm (now DPU)" },
  "ddp": { term: "DDP", definition: "Delivered Duty Paid - Incoterm with maximum seller responsibility" },
  "ddu": { term: "DDU", definition: "Delivered Duty Unpaid - Incoterm (replaced by DAP)" },
  "demurrage": { term: "Demurrage", definition: "Charges applied when cargo remains at port beyond free time" },
  "detention": { term: "Detention", definition: "Charges for holding a container beyond free time outside port" },
  "dpp": { term: "DPP", definition: "Devanning, Palletizing, and Packaging services" },
  "dpu": { term: "DPU", definition: "Delivered at Place Unloaded - Incoterm" },
  
  // E
  "eoq": { term: "EOQ", definition: "Economic Order Quantity - Optimal order size to minimize costs" },
  "eta": { term: "ETA", definition: "Estimated Time of Arrival" },
  "etd": { term: "ETD", definition: "Estimated Time of Departure" },
  "exw": { term: "EXW", definition: "Ex Works - Incoterm with minimum seller responsibility" },
  
  // F
  "fca": { term: "FCA", definition: "Free Carrier - Incoterm" },
  "fcl": { term: "FCL", definition: "Full Container Load - Shipment occupying entire container" },
  "fes": { term: "FES", definition: "Far East Service - Shipping route designation" },
  "fio": { term: "FIO", definition: "Free In and Out - Charter term excluding loading/unloading costs" },
  "fob": { term: "FOB", definition: "Free on Board - Incoterm" },
  "fta": { term: "FTA", definition: "Free Trade Agreement" },
  "ftl": { term: "FTL", definition: "Full Truckload shipping" },
  
  // G
  "gri": { term: "GRI", definition: "General Rate Increase - Carrier rate adjustment" },
  "gst": { term: "GST", definition: "Goods and Services Tax" },
  
  // H
  "hs-code": { term: "HS Code", definition: "Harmonized System Code for product classification" },
  "hts": { term: "HTS", definition: "Harmonized Tariff Schedule" },
  
  // I
  "iac": { term: "IAC", definition: "Intra-Asia Charge" },
  "iata": { term: "IATA", definition: "International Air Transport Association" },
  "imo": { term: "IMO", definition: "International Maritime Organization" },
  "incoterms": { term: "Incoterms", definition: "International Commercial Terms defining buyer/seller responsibilities" },
  "isf": { term: "ISF", definition: "Importer Security Filing - US customs requirement (10+2)" },
  
  // L
  "laf": { term: "LAF", definition: "Low Alkaline Fuel - Environmental fuel type" },
  "lcl": { term: "LCL", definition: "Less than Container Load - Shared container space" },
  "lc": { term: "Letter of Credit", definition: "Bank guarantee for payment in international trade" },
  "ldm": { term: "LDM", definition: "Loading Meter - Truck transport measurement" },
  "ltl": { term: "LTL", definition: "Less Than Truckload shipping" },
  
  // M
  "mgw": { term: "MGW", definition: "Maximum Gross Weight" },
  
  // N
  "nmfc": { term: "NMFC", definition: "National Motor Freight Classification" },
  
  // P
  "pac": { term: "PAC", definition: "Port Additional Charge" },
  "payload": { term: "Payload", definition: "Maximum cargo weight capacity" },
  "po": { term: "PO", definition: "Purchase Order" },
  
  // R
  "reefer": { term: "Reefer", definition: "Refrigerated container" },
  "roi": { term: "ROI", definition: "Return on Investment" },
  
  // S
  "safety-stock": { term: "Safety Stock", definition: "Extra inventory to prevent stockouts" },
  "sku": { term: "SKU", definition: "Stock Keeping Unit - Product identifier" },
  "ss": { term: "SS", definition: "Suez Surcharge" },
  "ssc": { term: "SSC", definition: "Security Surcharge" },
  
  // T
  "tare-weight": { term: "Tare Weight", definition: "Empty container weight" },
  "teu": { term: "TEU", definition: "Twenty-foot Equivalent Unit - Container capacity unit" },
  "thc": { term: "THC", definition: "Terminal Handling Charge" },
  "t/s": { term: "T/S", definition: "Transshipment - Transfer between vessels" },
  
  // U
  "unlocode": { term: "UN/LOCODE", definition: "United Nations Code for Trade and Transport Locations" },
  "uld": { term: "ULD", definition: "Unit Load Device - Air cargo container/pallet" },
  
  // V
  "vat": { term: "VAT", definition: "Value Added Tax" },
  "vgm": { term: "VGM", definition: "Verified Gross Mass - Total weight of packed container" },
  
  // W
  "wms": { term: "WMS", definition: "Warehouse Management System" },
  "waf": { term: "WAF", definition: "West Africa Freight" },
  
  // X
  "x-ray": { term: "X-Ray Inspection", definition: "Security scanning of cargo" },
  
  // Numbers
  "20ft": { term: "20' Container", definition: "Standard twenty-foot shipping container" },
  "40ft": { term: "40' Container", definition: "Standard forty-foot shipping container" },
  "40hc": { term: "40' HC", definition: "Forty-foot High Cube container" },
};

// =====================================================
// DOCUMENT TEMPLATES (120+)
// =====================================================

export const documentCategories: DocumentCategory[] = [
  {
    id: "trade-documents",
    name: "Trade Documents",
    description: "Commercial and financial trade documents",
    slug: "trade-documents",
    documents: [
      { id: "commercial-invoice", name: "Commercial Invoice", description: "Official invoice for international trade", slug: "commercial-invoice", category: "trade", featured: true },
      { id: "pro-forma-invoice", name: "Pro Forma Invoice", description: "Preliminary invoice for quotation", slug: "pro-forma-invoice", category: "trade" },
      { id: "packing-list", name: "Packing List", description: "Detailed cargo packing list", slug: "packing-list", category: "trade", featured: true },
      { id: "purchase-order", name: "Purchase Order", description: "Buyer's purchase order document", slug: "purchase-order", category: "trade" },
      { id: "sales-contract", name: "Sales Contract", description: "International sales agreement", slug: "sales-contract", category: "trade" },
      { id: "quotation", name: "Quotation", description: "Price quotation document", slug: "quotation", category: "trade" },
      { id: "indent", name: "Indent", description: "Purchase indent document", slug: "indent", category: "trade" },
      { id: "purchase-agreement", name: "Purchase Agreement", description: "Formal purchase agreement", slug: "purchase-agreement", category: "trade" },
    ],
  },
  {
    id: "shipping-documents",
    name: "Shipping Documents",
    description: "Transport and logistics documents",
    slug: "shipping-documents",
    documents: [
      { id: "bill-of-lading", name: "Bill of Lading", description: "Ocean transport document", slug: "bill-of-lading", category: "shipping", featured: true },
      { id: "air-waybill", name: "Air Waybill", description: "Air transport document", slug: "air-waybill", category: "shipping" },
      { id: "sea-waybill", name: "Sea Waybill", description: "Non-negotiable sea transport document", slug: "sea-waybill", category: "shipping" },
      { id: "multimodal-transport", name: "Multimodal Transport Document", description: "Combined transport document", slug: "multimodal-transport", category: "shipping" },
      { id: "truck-waybill", name: "Truck Waybill", description: "Road transport document", slug: "truck-waybill", category: "shipping" },
      { id: "rail-waybill", name: "Rail Waybill", description: "Rail transport document", slug: "rail-waybill", category: "shipping" },
      { id: "delivery-order", name: "Delivery Order", description: "Order to release cargo", slug: "delivery-order", category: "shipping" },
      { id: "shipping-instructions", name: "Shipping Instructions", description: "Carrier instructions", slug: "shipping-instructions", category: "shipping" },
      { id: "sli", name: "Shipper's Letter of Instruction", description: "Shipper instructions to forwarder", slug: "shippers-letter-of-instruction", category: "shipping" },
      { id: "booking-confirmation", name: "Booking Confirmation", description: "Carrier booking confirmation", slug: "booking-confirmation", category: "shipping" },
      { id: "booking-request", name: "Booking Request", description: "Space booking request", slug: "booking-request", category: "shipping" },
      { id: "cargo-manifest", name: "Cargo Manifest", description: "Complete cargo listing", slug: "cargo-manifest", category: "shipping" },
    ],
  },
  {
    id: "customs-documents",
    name: "Customs Documents",
    description: "Customs clearance and compliance documents",
    slug: "customs-documents",
    documents: [
      { id: "certificate-of-origin", name: "Certificate of Origin", description: "Product origin certification", slug: "certificate-of-origin", category: "customs", featured: true },
      { id: "export-declaration", name: "Export Declaration", description: "Export customs filing", slug: "export-declaration", category: "customs" },
      { id: "import-declaration", name: "Import Declaration", description: "Import customs filing", slug: "import-declaration", category: "customs" },
      { id: "customs-invoice", name: "Customs Invoice", description: "Invoice for customs purposes", slug: "customs-invoice", category: "customs" },
      { id: "customs-bond", name: "Customs Bond", description: "Customs guarantee document", slug: "customs-bond", category: "customs" },
      { id: "duty-exemption", name: "Duty Exemption Certificate", description: "Duty-free import certificate", slug: "duty-exemption", category: "customs" },
      { id: "re-export-certificate", name: "Re-export Certificate", description: "Re-export documentation", slug: "re-export-certificate", category: "customs" },
      { id: "transit-document", name: "Transit Document", description: "Transit cargo documentation", slug: "transit-document", category: "customs" },
      { id: "ata-carnet", name: "ATA Carnet", description: "Temporary import passport", slug: "ata-carnet", category: "customs" },
      { id: "t1-document", name: "T1 Transit Document", description: "EU transit document", slug: "t1-document", category: "customs" },
    ],
  },
  {
    id: "finance-documents",
    name: "Finance Documents",
    description: "Financial and payment documents",
    slug: "finance-documents",
    documents: [
      { id: "letter-of-credit", name: "Letter of Credit", description: "Bank payment guarantee", slug: "letter-of-credit", category: "finance", featured: true },
      { id: "lc-application", name: "LC Application", description: "Letter of Credit application", slug: "lc-application", category: "finance" },
      { id: "bank-guarantee", name: "Bank Guarantee", description: "Bank guarantee document", slug: "bank-guarantee", category: "finance" },
      { id: "standby-lc", name: "Standby Letter of Credit", description: "Backup payment guarantee", slug: "standby-lc", category: "finance" },
      { id: "documentary-collection", name: "Documentary Collection", description: "D/P or D/A payment terms", slug: "documentary-collection", category: "finance" },
      { id: "bill-of-exchange", name: "Bill of Exchange", description: "Payment draft document", slug: "bill-of-exchange", category: "finance" },
      { id: "promissory-note", name: "Promissory Note", description: "Payment promise document", slug: "promissory-note", category: "finance" },
      { id: "bank-draft", name: "Bank Draft", description: "Bank payment instrument", slug: "bank-draft", category: "finance" },
      { id: "wire-transfer-slip", name: "Wire Transfer Slip", description: "Bank transfer confirmation", slug: "wire-transfer-slip", category: "finance" },
      { id: "credit-note", name: "Credit Note", description: "Credit adjustment document", slug: "credit-note", category: "finance" },
      { id: "debit-note", name: "Debit Note", description: "Debit adjustment document", slug: "debit-note", category: "finance" },
    ],
  },
  {
    id: "insurance-documents",
    name: "Insurance Documents",
    description: "Cargo and marine insurance documents",
    slug: "insurance-documents",
    documents: [
      { id: "insurance-certificate", name: "Insurance Certificate", description: "Marine insurance certificate", slug: "insurance-certificate", category: "insurance" },
      { id: "insurance-policy", name: "Insurance Policy", description: "Full insurance policy document", slug: "insurance-policy", category: "insurance" },
      { id: "insurance-declaration", name: "Insurance Declaration", description: "Open policy declaration", slug: "insurance-declaration", category: "insurance" },
      { id: "claim-form", name: "Insurance Claim Form", description: "Cargo claim documentation", slug: "claim-form", category: "insurance" },
      { id: "survey-report", name: "Survey Report", description: "Damage survey document", slug: "survey-report", category: "insurance" },
      { id: "loss-adjuster-report", name: "Loss Adjuster Report", description: "Professional loss assessment", slug: "loss-adjuster-report", category: "insurance" },
    ],
  },
  {
    id: "inspection-documents",
    name: "Inspection Documents",
    description: "Quality and compliance inspection documents",
    slug: "inspection-documents",
    documents: [
      { id: "inspection-certificate", name: "Inspection Certificate", description: "Quality inspection document", slug: "inspection-certificate", category: "inspection" },
      { id: "pre-shipment-inspection", name: "Pre-Shipment Inspection", description: "PSI certificate", slug: "pre-shipment-inspection", category: "inspection" },
      { id: "quality-certificate", name: "Quality Certificate", description: "Product quality certification", slug: "quality-certificate", category: "inspection" },
      { id: "quantity-certificate", name: "Quantity Certificate", description: "Cargo quantity verification", slug: "quantity-certificate", category: "inspection" },
      { id: "weight-certificate", name: "Weight Certificate", description: "Official weight verification", slug: "weight-certificate", category: "inspection" },
      { id: "analysis-certificate", name: "Analysis Certificate", description: "Laboratory analysis results", slug: "analysis-certificate", category: "inspection" },
      { id: "testing-report", name: "Testing Report", description: "Product testing results", slug: "testing-report", category: "inspection" },
    ],
  },
  {
    id: "dangerous-goods-documents",
    name: "Dangerous Goods Documents",
    description: "Hazmat and dangerous goods documentation",
    slug: "dangerous-goods-documents",
    documents: [
      { id: "dangerous-goods-declaration", name: "Dangerous Goods Declaration", description: "IMO DG declaration", slug: "dangerous-goods-declaration", category: "dg", featured: true },
      { id: "msds", name: "Material Safety Data Sheet", description: "Chemical safety information", slug: "msds", category: "dg" },
      { id: "un-certificate", name: "UN Packaging Certificate", description: "Packaging certification", slug: "un-certificate", category: "dg" },
      { id: "hazard-classification", name: "Hazard Classification Report", description: "DG classification document", slug: "hazard-classification", category: "dg" },
      { id: "emergency-response", name: "Emergency Response Guide", description: "Emergency procedures", slug: "emergency-response", category: "dg" },
      { id: "multimodal-dg-declaration", name: "Multimodal DG Declaration", description: "Combined transport DG doc", slug: "multimodal-dg-declaration", category: "dg" },
    ],
  },
  {
    id: "phytosanitary-documents",
    name: "Phytosanitary Documents",
    description: "Plant health and agricultural documents",
    slug: "phytosanitary-documents",
    documents: [
      { id: "phytosanitary-certificate", name: "Phytosanitary Certificate", description: "Plant health certificate", slug: "phytosanitary-certificate", category: "phyto" },
      { id: "fumigation-certificate", name: "Fumigation Certificate", description: "Pest treatment certificate", slug: "fumigation-certificate", category: "phyto" },
      { id: "heat-treatment-certificate", name: "Heat Treatment Certificate", description: "Wood treatment certificate", slug: "heat-treatment-certificate", category: "phyto" },
      { id: "plant-quarantine", name: "Plant Quarantine Certificate", description: "Quarantine compliance", slug: "plant-quarantine", category: "phyto" },
      { id: "seed-certificate", name: "Seed Certificate", description: "Seed quality certification", slug: "seed-certificate", category: "phyto" },
    ],
  },
  {
    id: "food-documents",
    name: "Food & Agricultural Documents",
    description: "Food safety and agricultural documents",
    slug: "food-documents",
    documents: [
      { id: "health-certificate", name: "Health Certificate", description: "Food safety certificate", slug: "health-certificate", category: "food" },
      { id: "halal-certificate", name: "Halal Certificate", description: "Halal compliance certificate", slug: "halal-certificate", category: "food" },
      { id: "kosher-certificate", name: "Kosher Certificate", description: "Kosher compliance certificate", slug: "kosher-certificate", category: "food" },
      { id: "organic-certificate", name: "Organic Certificate", description: "Organic product certification", slug: "organic-certificate", category: "food" },
      { id: "haccp-certificate", name: "HACCP Certificate", description: "Food safety management", slug: "haccp-certificate", category: "food" },
      { id: "fda-registration", name: "FDA Registration", description: "US FDA registration", slug: "fda-registration", category: "food" },
      { id: "veterinary-certificate", name: "Veterinary Certificate", description: "Animal product certificate", slug: "veterinary-certificate", category: "food" },
      { id: "catch-certificate", name: "Catch Certificate", description: "Fisheries catch document", slug: "catch-certificate", category: "food" },
    ],
  },
  {
    id: "other-documents",
    name: "Other Documents",
    description: "Additional trade-related documents",
    slug: "other-documents",
    documents: [
      { id: "power-of-attorney", name: "Power of Attorney", description: "Authorization document", slug: "power-of-attorney", category: "other" },
      { id: "authorization-letter", name: "Authorization Letter", description: "Simple authorization", slug: "authorization-letter", category: "other" },
      { id: "no-objection-certificate", name: "No Objection Certificate", description: "NOC document", slug: "no-objection-certificate", category: "other" },
      { id: "undertaking", name: "Undertaking", description: "Legal undertaking document", slug: "undertaking", category: "other" },
      { id: "affidavit", name: "Affidavit", description: "Sworn statement document", slug: "affidavit", category: "other" },
      { id: "indemnity-bond", name: "Indemnity Bond", description: "Liability guarantee", slug: "indemnity-bond", category: "other" },
      { id: "consular-invoice", name: "Consular Invoice", description: "Embassy-legalized invoice", slug: "consular-invoice", category: "other" },
      { id: "legalization", name: "Document Legalization", description: "Embassy authentication", slug: "legalization", category: "other" },
      { id: "apostille", name: "Apostille", description: "Hague apostille", slug: "apostille", category: "other" },
      { id: "certificate-of-conformity", name: "Certificate of Conformity", description: "Standards compliance", slug: "certificate-of-conformity", category: "other" },
      { id: "ce-marking", name: "CE Marking Declaration", description: "EU conformity declaration", slug: "ce-marking", category: "other" },
      { id: "iso-certificate", name: "ISO Certificate", description: "Quality management certification", slug: "iso-certificate", category: "other" },
      { id: "free-sale-certificate", name: "Free Sale Certificate", description: "Product free sale certification", slug: "free-sale-certificate", category: "other" },
      { id: "gmp-certificate", name: "GMP Certificate", description: "Good manufacturing practice certification", slug: "gmp-certificate", category: "other" },
      { id: "fcc-declaration", name: "FCC Declaration", description: "FCC compliance declaration", slug: "fcc-declaration", category: "other" },
      { id: "rohs-certificate", name: "RoHS Certificate", description: "Restriction of hazardous substances", slug: "rohs-certificate", category: "other" },
      { id: "reach-certificate", name: "REACH Certificate", description: "EU chemical regulation compliance", slug: "reach-certificate", category: "other" },
      { id: "test-report", name: "Test Report", description: "Independent test results", slug: "test-report", category: "other" },
      { id: "product-data-sheet", name: "Product Data Sheet", description: "Technical product information", slug: "product-data-sheet", category: "other" },
      { id: "safety-data-sheet", name: "Safety Data Sheet", description: "Product safety information", slug: "safety-data-sheet", category: "other" },
      { id: "material-certificate", name: "Material Certificate", description: "Material composition certification", slug: "material-certificate", category: "other" },
      { id: "mill-certificate", name: "Mill Certificate", description: "Steel/metal product certification", slug: "mill-certificate", category: "other" },
      { id: "origin-declaration", name: "Origin Declaration", description: "Self-declaration of origin", slug: "origin-declaration", category: "other" },
      { id: "preference-certificate", name: "Preference Certificate", description: "FTA preference certificate", slug: "preference-certificate", category: "other" },
    ],
  },
  {
    id: "logistics-documents",
    name: "Logistics Documents",
    description: "Transport and logistics documentation",
    slug: "logistics-documents",
    documents: [
      { id: "proof-of-delivery", name: "Proof of Delivery", description: "Delivery confirmation document", slug: "proof-of-delivery", category: "logistics" },
      { id: "pallet-receipt", name: "Pallet Receipt", description: "Pallet exchange receipt", slug: "pallet-receipt", category: "logistics" },
      { id: "temperature-record", name: "Temperature Record", description: "Cold chain temperature log", slug: "temperature-record", category: "logistics" },
      { id: "loading-plan", name: "Loading Plan", description: "Container loading plan", slug: "loading-plan", category: "logistics" },
      { id: "stuffing-report", name: "Stuffing Report", description: "Container stuffing report", slug: "stuffing-report", category: "logistics" },
      { id: "devanning-report", name: "Devanning Report", description: "Unstuffing report", slug: "devanning-report", category: "logistics" },
      { id: "tally-sheet", name: "Tally Sheet", description: "Cargo counting record", slug: "tally-sheet", category: "logistics" },
      { id: "damage-report", name: "Damage Report", description: "Cargo damage documentation", slug: "damage-report", category: "logistics" },
      { id: "short-landing-report", name: "Short Landing Report", description: "Missing cargo report", slug: "short-landing-report", category: "logistics" },
      { id: "over-landing-report", name: "Over Landing Report", description: "Excess cargo report", slug: "over-landing-report", category: "logistics" },
      { id: "storage-receipt", name: "Storage Receipt", description: "Warehouse storage receipt", slug: "storage-receipt", category: "logistics" },
    ],
  },
  {
    id: "legal-documents",
    name: "Legal Documents",
    description: "Legal and regulatory documents",
    slug: "legal-documents",
    documents: [
      { id: "distribution-agreement", name: "Distribution Agreement", description: "Distribution rights contract", slug: "distribution-agreement", category: "legal" },
      { id: "agency-agreement", name: "Agency Agreement", description: "Agent appointment contract", slug: "agency-agreement", category: "legal" },
      { id: "non-disclosure-agreement", name: "Non-Disclosure Agreement", description: "Confidentiality agreement", slug: "non-disclosure-agreement", category: "legal" },
      { id: "license-agreement", name: "License Agreement", description: "IP licensing contract", slug: "license-agreement", category: "legal" },
      { id: "franchise-agreement", name: "Franchise Agreement", description: "Franchise contract", slug: "franchise-agreement", category: "legal" },
      { id: "joint-venture-agreement", name: "Joint Venture Agreement", description: "JV contract", slug: "joint-venture-agreement", category: "legal" },
      { id: "supply-agreement", name: "Supply Agreement", description: "Supply contract", slug: "supply-agreement", category: "legal" },
      { id: "manufacturing-agreement", name: "Manufacturing Agreement", description: "OEM manufacturing contract", slug: "manufacturing-agreement", category: "legal" },
      { id: "export-license", name: "Export License", description: "Export authorization document", slug: "export-license", category: "legal" },
      { id: "import-license", name: "Import License", description: "Import authorization document", slug: "import-license", category: "legal" },
      { id: "end-user-certificate", name: "End User Certificate", description: "End user declaration", slug: "end-user-certificate", category: "legal" },
      { id: "import-permit", name: "Import Permit", description: "Import permission document", slug: "import-permit", category: "legal" },
    ],
  },
];

export const totalDocumentsCount = documentCategories.reduce((sum, cat) => sum + cat.documents.length, 0);
export const totalDocumentCategoriesCount = documentCategories.length;
