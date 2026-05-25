/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.shiportrade.com',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: ['/404', '/500'],
    
    additionalPaths: async (config) => {
      const result = [];
      
      // =====================================================
      // WORKING TOOLS ONLY (Filtered based on Audit)
      // =====================================================
      
      const workingModules = [
        { slug: "international-trade", tools: ["landed-cost-calculator", "profit-margin-calculator", "incoterms-guide", "currency-converter", "transfer-pricing-model", "commodity-hedging", "tariff-comparison", "anti-dumping-checker", "supplier-risk", "freight-procurement", "logistics-roi", "lc-confirmation-pricing", "factoring-cost", "fx-hedging", "credit-risk-scorer", "freight-transit-calculator", "freight-contract", "lc-discrepancy-analyzer", "supply-chain-visibility", "unit-converter"] },
        { slug: "ocean-freight", tools: ["cbm-calculator", "fcl-loadability", "container-validator", "vgm-calculator", "tank-density", "reefer-settings", "oog-calculator", "freight-rate-benchmark", "baf-estimator", "demurrage-calculator", "transit-time", "container-tracking", "container-leasing", "port-code-finder", "container-guide", "cargo-consolidation", "carrier-selection", "port-congestion", "rate-forecast", "freight-index", "port-performance", "terminal-selector", "carrier-performance", "container-availability", "container-utilization", "shipment-tracking", "container-loading"] },
        { slug: "air-freight", tools: ["volumetric-weight", "chargeable-weight", "uld-loadability", "fuel-surcharge", "iata-zone-rates"] },
        { slug: "road-rail", tools: ["ldm-calculator", "axle-load", "fuel-cost-km", "freight-class", "truck-pallet", "route-optimizer", "rail-gauge", "modal-shift", "intermodal-simulation", "drayage", "last-mile", "transport-mode-selector", "multimodal-planner", "transport-analytics"] },
        { slug: "customs-compliance", tools: ["hs-code-search", "duty-tariff-calculator", "customs-valuation", "sanctions-risk", "restricted-goods", "audit-risk", "trade-compliance", "fta-eligibility"] },
        { slug: "warehousing", tools: ["cost-calculator", "eoq-calculator", "safety-stock", "reorder-point-calculator", "service-level", "stockout-probability", "slotting-optimization", "demand-forecast", "pallet-configuration", "pick-and-pack", "cross-docking", "load-planning", "inventory-aging", "capacity-planner", "location-optimizer", "network-designer", "inventory-dashboard", "kpi-dashboard"] },
        { slug: "ecommerce", tools: ["fba-calculator", "fba-storage", "return-impact", "roas-calculator", "cac-calculator", "ltv-calculator", "contribution-margin", "shopify-fees", "ebay-fees", "3pl-comparison", "cod-risk", "order-fulfillment", "reverse-logistics"] },
        { slug: "insurance", tools: ["marine-premium", "expected-loss", "var-calculator", "monte-carlo", "stress-testing", "tcor", "general-average", "liability-limit", "cargo-quoter", "freight-claims"] },
        { slug: "sustainability", tools: ["carbon-footprint", "cii-checker", "esg-rating", "carbon-tax", "cold-chain"] },
        { slug: "project-cargo", tools: ["lashing-force", "cog-finder", "ground-pressure", "wind-load"] },
        { slug: "blockchain-digital-supply-chain", tools: ["traceability-ledger-simulator", "smart-contract-creator"] },
        { slug: "financial-payment", tools: ["payment-terms-calculator", "break-even-analyzer", "roi-calculator", "currency-exchange-calculator"] },
        { slug: "logistics-planning", tools: ["freight-rate-calculator", "lead-time-calculator", "route-planning", "logistics-benchmarking"] },
        { slug: "inventory-management", tools: ["inventory-optimization", "inventory-turnover-calculator", "reorder-point-calculator", "container-load-calculator"] },
      ];
  
      const workingDocs = [
        { slug: "trade-documents", docs: ["commercial-invoice", "pro-forma-invoice", "packing-list", "purchase-order", "sales-contract", "quotation", "indent", "purchase-agreement"] },
        { slug: "shipping-documents", docs: ["bill-of-lading", "air-waybill", "sea-waybill", "multimodal-transport", "truck-waybill", "rail-waybill", "delivery-order", "shipping-instructions", "shippers-letter-of-instruction", "booking-confirmation", "booking-request", "cargo-manifest"] },
        { slug: "customs-documents", docs: ["certificate-of-origin", "export-declaration", "import-declaration", "customs-invoice", "customs-bond", "duty-exemption", "re-export-certificate", "transit-document", "ata-carnet", "t1-document"] },
        { slug: "finance-documents", docs: ["letter-of-credit", "lc-application", "bank-guarantee", "standby-lc", "documentary-collection", "bill-of-exchange", "promissory-note", "bank-draft", "wire-transfer-slip", "credit-note", "debit-note"] },
        { slug: "insurance-documents", docs: ["insurance-certificate", "insurance-policy", "insurance-declaration", "claim-form", "survey-report", "loss-adjuster-report"] },
        { slug: "inspection-documents", docs: ["inspection-certificate", "pre-shipment-inspection", "quality-certificate", "quantity-certificate", "weight-certificate", "analysis-certificate", "testing-report"] },
        { slug: "dangerous-goods-documents", docs: ["dangerous-goods-declaration", "msds", "un-certificate", "hazard-classification", "emergency-response", "multimodal-dg-declaration"] },
        { slug: "phytosanitary-documents", docs: ["phytosanitary-certificate", "fumigation-certificate", "heat-treatment-certificate", "plant-quarantine", "seed-certificate"] },
        { slug: "food-documents", docs: ["health-certificate", "halal-certificate", "kosher-certificate", "organic-certificate", "haccp-certificate", "fda-registration", "veterinary-certificate", "catch-certificate"] },
        { slug: "other-documents", docs: ["power-of-attorney", "authorization-letter", "no-objection-certificate", "undertaking", "affidavit", "indemnity-bond", "consular-invoice", "legalization", "apostille", "certificate-of-conformity", "ce-marking", "iso-certificate", "free-sale-certificate", "gmp-certificate", "fcc-declaration", "rohs-certificate", "reach-certificate", "test-report", "product-data-sheet", "safety-data-sheet", "material-certificate", "mill-certificate", "origin-declaration", "preference-certificate"] },
        { slug: "logistics-documents", docs: ["proof-of-delivery", "pallet-receipt", "temperature-record", "loading-plan", "stuffing-report", "devanning-report", "tally-sheet", "damage-report", "short-landing-report", "over-landing-report", "storage-receipt"] },
        { slug: "legal-documents", docs: ["distribution-agreement", "agency-agreement", "non-disclosure-agreement", "license-agreement", "franchise-agreement", "joint-venture-agreement", "supply-agreement", "manufacturing-agreement", "export-license", "import-license", "end-user-certificate", "import-permit"] }
      ];
  
      // Tools Loop
      workingModules.forEach(mod => {
        result.push({ loc: `/tools/${mod.slug}`, changefreq: 'weekly', priority: 0.8 });
        mod.tools.forEach(toolSlug => {
          result.push({ loc: `/tools/${mod.slug}/${toolSlug}`, changefreq: 'weekly', priority: 0.7 });
        });
      });
  
      // Documents Loop
      workingDocs.forEach(cat => {
        cat.docs.forEach(docSlug => {
          result.push({ loc: `/documents/${cat.slug}/${docSlug}`, changefreq: 'monthly', priority: 0.6 });
        });
      });
  
      return result;
    },
  };