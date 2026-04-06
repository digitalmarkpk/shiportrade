import { NextResponse } from 'next/server';

// All available news sources (52 sources)
const NEWS_SOURCES = [
  // Maritime & Shipping - Core
  { id: 'ship-bunker', name: 'Ship & Bunker', region: 'global', category: 'Trade Finance' },
  { id: 'hellenic-shipping-news', name: 'Hellenic Shipping News', region: 'global', category: 'Ocean Freight' },
  { id: 'splash-247', name: 'Splash 247', region: 'global', category: 'Ocean Freight' },
  { id: 'seatrade-maritime', name: 'Seatrade Maritime', region: 'global', category: 'Ocean Freight' },
  { id: 'shipping-watch', name: 'Shipping Watch', region: 'europe', category: 'Ocean Freight' },
  { id: 'sea-news', name: 'Sea News', region: 'global', category: 'Ocean Freight' },
  { id: 'marine-insight', name: 'Marine Insight', region: 'global', category: 'Ocean Freight' },
  { id: 'lloyds-list', name: "Lloyd's List", region: 'global', category: 'Ocean Freight' },
  { id: 'maritime-executive', name: 'Maritime Executive', region: 'global', category: 'Ocean Freight' },
  { id: 'marine-log', name: 'Marine Log', region: 'global', category: 'Ocean Freight' },
  { id: 'gcaptain', name: 'gCaptain', region: 'global', category: 'Ocean Freight' },
  { id: 'port-technology', name: 'Port Technology', region: 'global', category: 'Technology' },
  { id: 'maritime-magazine', name: 'Maritime Magazine', region: 'global', category: 'Ocean Freight' },
  { id: 'marine-link', name: 'Marine Link', region: 'global', category: 'Ocean Freight' },
  { id: 'ferry-shipping-news', name: 'Ferry Shipping News', region: 'europe', category: 'Ocean Freight' },
  { id: 'tradewinds', name: 'Tradewinds', region: 'global', category: 'Ocean Freight' },
  
  // Trade Finance & Commodities
  { id: 'oil-price', name: 'Oil Price', region: 'global', category: 'Trade Finance' },
  { id: 'reuters-commodities', name: 'Reuters Commodities', region: 'global', category: 'Trade Finance' },
  { id: 'sp-global', name: 'SP Global', region: 'global', category: 'Trade Finance' },
  
  // Logistics & Freight
  { id: 'freightwaves', name: 'FreightWaves', region: 'global', category: 'Logistics' },
  { id: 'container-news', name: 'Container News', region: 'global', category: 'Ocean Freight' },
  { id: 'the-loadstar', name: 'The Loadstar', region: 'global', category: 'Logistics' },
  
  // Regional - Asia Pacific & Middle East
  { id: 'logistics-middle-east', name: 'Logistics Middle East', region: 'middle-east', category: 'Logistics' },
  { id: 'hong-kong-maritime-hub', name: 'Hong Kong Maritime Hub', region: 'asia-pacific', category: 'Ocean Freight' },
  { id: 'seatrade-maritime-asia', name: 'Seatrade Maritime Asia', region: 'asia-pacific', category: 'Ocean Freight' },
  { id: 'log-update-africa', name: 'Log Update Africa', region: 'africa', category: 'Logistics' },
  { id: 'shipping-telegraph', name: 'Shipping Telegraph', region: 'europe', category: 'Ocean Freight' },
  
  // Europe
  { id: 'afloat', name: 'Afloat', region: 'europe', category: 'Ocean Freight' },
  { id: 'cyprus-shipping-news', name: 'Cyprus Shipping News', region: 'europe', category: 'Ocean Freight' },
  { id: 'hansa-online', name: 'Hansa Online', region: 'europe', category: 'Ocean Freight' },
  { id: 'corriere-marittimo', name: 'Corriere Marittimo', region: 'europe', category: 'Ocean Freight' },
  { id: 'nieuwsblad-transport', name: 'Nieuwsblad Transport', region: 'europe', category: 'Logistics' },
  { id: 'flows', name: 'Flows', region: 'europe', category: 'Logistics' },
  
  // Americas
  { id: 'american-journal-transportation', name: 'American Journal of Transportation', region: 'americas', category: 'Logistics' },
  { id: 'waterways-journal', name: 'Waterways Journal', region: 'americas', category: 'Logistics' },
  { id: 'professional-mariner', name: 'Professional Mariner', region: 'americas', category: 'Ocean Freight' },
  
  // Technology & Sustainability
  { id: 'clean-shipping-international', name: 'Clean Shipping International', region: 'global', category: 'Sustainability' },
  { id: 'datamar-news', name: 'Datamar News', region: 'global', category: 'Technology' },
  
  // Port & Terminal
  { id: 'port-news', name: 'Port News', region: 'global', category: 'Ocean Freight' },
  
  // Trade & Business
  { id: 'global-trade', name: 'Global Trade', region: 'global', category: 'Trade Finance' },
  { id: 'trans-info', name: 'Trans.Info', region: 'global', category: 'Logistics' },
  { id: 'liberty-press', name: 'Liberty Press', region: 'global', category: 'Trade Finance' },
  
  // India
  { id: 'indian-transport-logistic-news', name: 'Indian Transport & Logistic News', region: 'asia-pacific', category: 'Logistics' },
  { id: 'shipping-freight-resource', name: 'Shipping & Freight Resource', region: 'asia-pacific', category: 'Logistics' },
  
  // Maritime Professional
  { id: 'maritime-professional', name: 'Maritime Professional', region: 'global', category: 'Ocean Freight' },
  { id: 'capital-link-shipping', name: 'Capital Link Shipping', region: 'global', category: 'Trade Finance' },
  { id: 'riviera-mm', name: 'Riviera MM', region: 'global', category: 'Ocean Freight' },
  { id: 'the-maritime-standard', name: 'The Maritime Standard', region: 'middle-east', category: 'Ocean Freight' },
  { id: 'shipping-herald', name: 'Shipping Herald', region: 'global', category: 'Ocean Freight' },
  { id: 'global-maritime-hub', name: 'Global Maritime Hub', region: 'global', category: 'Ocean Freight' },
  
  // Geopolitical Sources
  { id: 'reuters-world', name: 'Reuters World', region: 'global', category: 'Geopolitical' },
  { id: 'bbc-world-business', name: 'BBC World Business', region: 'global', category: 'Trade Finance' },
  { id: 'al-jazeera-economy', name: 'Al Jazeera Economy', region: 'global', category: 'Geopolitical' },
  { id: 'financial-times', name: 'Financial Times', region: 'global', category: 'Trade Finance' },
  { id: 'dw-economy', name: 'DW Economy', region: 'global', category: 'Trade Finance' },
];

export async function GET() {
  // Group sources by category
  const sourcesByCategory: Record<string, typeof NEWS_SOURCES> = {};
  
  NEWS_SOURCES.forEach(source => {
    if (!sourcesByCategory[source.category]) {
      sourcesByCategory[source.category] = [];
    }
    sourcesByCategory[source.category].push(source);
  });
  
  return NextResponse.json({
    success: true,
    data: {
      sources: NEWS_SOURCES,
      sourcesByCategory,
      total: NEWS_SOURCES.length,
    }
  });
}
