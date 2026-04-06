import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Keywords to image prompt mapping
const KEYWORD_PROMPTS: Record<string, string> = {
  // Countries
  'saudi arabia': 'Saudi Arabia flag waving with modern skyline and oil refinery in background, professional news style',
  'saudi': 'Saudi Arabia flag with Riyadh skyline, professional journalism photo',
  'iran': 'Iran flag with nuclear facility or Tehran skyline, news broadcast style',
  'china': 'China flag with Shanghai skyline or Great Wall, professional news photography',
  'usa': 'United States flag with Capitol building or New York skyline, news style',
  'united states': 'American flag with Washington DC monuments, professional news photo',
  'russia': 'Russia flag with Moscow Kremlin, news broadcast style',
  'india': 'India flag with New Delhi landmarks, professional journalism',
  'japan': 'Japan flag with Tokyo skyline or Mount Fuji, news style',
  'uk': 'United Kingdom flag with London Big Ben and Parliament, news broadcast',
  'britain': 'British flag with London skyline, professional news photo',
  'germany': 'Germany flag with Berlin Brandenburg Gate, news style',
  'france': 'France flag with Eiffel Tower Paris, professional journalism',
  'uae': 'UAE flag with Dubai Burj Khalifa skyline, news broadcast',
  'dubai': 'Dubai skyline with Burj Khalifa, professional news photography',
  'australia': 'Australia flag with Sydney Opera House, news style',
  'brazil': 'Brazil flag with Rio de Janeiro or Brasilia, news broadcast',
  'south korea': 'South Korea flag with Seoul skyline, professional news',
  'korea': 'Korean peninsula map with flags, news broadcast style',
  'taiwan': 'Taiwan flag with Taipei 101 skyline, professional journalism',
  'israel': 'Israel flag with Jerusalem or Tel Aviv skyline, news style',
  'egypt': 'Egypt flag with pyramids or Cairo skyline, news broadcast',
  
  // Military & Defense
  'warship': 'Modern military warship sailing in ocean, naval vessel, professional defense photography',
  'navy': 'Naval fleet with warships in formation, military vessels, news style',
  'aircraft carrier': 'Aircraft carrier with fighter jets on deck, naval power, news broadcast',
  'submarine': 'Military submarine surfacing in ocean, naval defense, professional photo',
  'missile': 'Military missile launch or defense system, professional defense photography',
  'fighter jet': 'Modern fighter jet in flight, military aircraft, news style',
  'military': 'Military forces or equipment, defense operations, professional journalism',
  'frigate': 'Modern naval frigate warship at sea, military vessel, news broadcast',
  'destroyer': 'Naval destroyer ship in ocean, military warship, professional photo',
  
  // Energy & Oil
  'lng': 'LNG liquefied natural gas plant facility with storage tanks, energy industry, professional photo',
  'oil': 'Oil refinery or petroleum facility with storage tanks, energy industry, news style',
  'gas': 'Natural gas facility with pipelines, energy infrastructure, professional photo',
  'pipeline': 'Oil and gas pipeline infrastructure, energy transport, news style',
  'refinery': 'Oil refinery with towers and tanks, petrochemical industry, professional photo',
  'nuclear': 'Nuclear power plant with cooling towers, energy facility, news broadcast',
  'nuclear plant': 'Nuclear power station facility, energy infrastructure, professional journalism',
  'solar': 'Solar panel farm, renewable energy facility, clean energy, news style',
  'wind': 'Wind turbine farm, renewable energy, clean power, professional photo',
  
  // Shipping & Logistics
  'container': 'Shipping containers at port, global trade logistics, professional photo',
  'port': 'Major shipping port with cranes and cargo ships, logistics hub, news style',
  'ship': 'Large cargo vessel or container ship at sea, maritime shipping, professional photo',
  'vessel': 'Commercial vessel or cargo ship, maritime industry, news broadcast',
  'cargo': 'Cargo shipping containers or freight, logistics industry, professional journalism',
  'freight': 'Freight trains or cargo transportation, logistics operations, news style',
  'shipping': 'Maritime shipping vessels and port operations, global trade, professional photo',
  
  // Trade & Finance
  'trade': 'Global trade concept with world map and shipping routes, international commerce, news style',
  'tariff': 'Trade documents and customs, international commerce, professional photo',
  'customs': 'Customs facility at border, international trade checkpoint, news broadcast',
  'currency': 'International currency exchange, forex trading, financial markets, professional photo',
  'stock': 'Stock market trading floor, financial markets, wall street, news style',
  'bank': 'Major bank building headquarters, financial institution, professional journalism',
  
  // Regions & Waterways
  'red sea': 'Red Sea map with shipping vessels, strategic waterway, news broadcast',
  'suez canal': 'Suez Canal with passing ships, Egyptian waterway, professional photo',
  'panama canal': 'Panama Canal locks with ships, strategic waterway, news style',
  'taiwan strait': 'Taiwan Strait map with naval vessels, strategic waters, news broadcast',
  'south china sea': 'South China Sea map with islands, territorial waters, professional photo',
  'hormuz': 'Strait of Hormuz map with oil tankers, strategic chokepoint, news style',
  
  // Technology
  'technology': 'Modern technology digital concept, innovation, professional photo',
  'ai': 'Artificial intelligence concept, neural network visualization, tech, news style',
  'semiconductor': 'Semiconductor chip manufacturing, microprocessor, technology, professional photo',
  'chip': 'Computer chip or semiconductor wafer, technology hardware, news broadcast',
  
  // Climate & Environment
  'climate': 'Climate change impact, environmental concept, professional journalism',
  'carbon': 'Carbon emissions concept, environmental impact, news style',
  'emission': 'Industrial emissions or pollution, environmental issue, professional photo',
  
  // Default/General
  'default': 'Global trade and shipping concept with world map, international commerce, professional news style',
};

// Extract keywords from title
function extractKeywords(title: string): string[] {
  const lowerTitle = title.toLowerCase();
  const foundKeywords: string[] = [];
  
  for (const keyword of Object.keys(KEYWORD_PROMPTS)) {
    if (lowerTitle.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }
  
  return foundKeywords;
}

// Generate image prompt from title
function generateImagePrompt(title: string, category: string): string {
  const keywords = extractKeywords(title);
  
  if (keywords.length > 0) {
    // Use the first matching keyword
    const prompt = KEYWORD_PROMPTS[keywords[0]];
    return `${prompt}, news article headline about: "${title.substring(0, 80)}", professional journalism, breaking news style`;
  }
  
  // Fallback based on category
  const categoryPrompts: Record<string, string> = {
    'Ocean Freight': 'Large container ship at sea, maritime shipping, global trade, professional news photo',
    'Air Freight': 'Commercial cargo airplane in flight, air logistics, professional photo',
    'Trade Finance': 'Financial trading floor, international commerce, professional news style',
    'Customs': 'Customs and border facility, international trade, professional journalism',
    'Technology': 'Modern technology concept, digital innovation, professional news photo',
    'Sustainability': 'Green energy and sustainability concept, environmental, professional photo',
    'Logistics': 'Logistics warehouse with packages, supply chain, professional news style',
    'E-Commerce': 'Online shopping and e-commerce concept, digital retail, professional photo',
    'Geopolitical': 'World map with flags, international relations, diplomatic news style',
  };
  
  return categoryPrompts[category] || KEYWORD_PROMPTS['default'];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const category = searchParams.get('category') || 'Geopolitical';
  
  if (!title) {
    return NextResponse.json(
      { error: 'Title parameter required' },
      { status: 400 }
    );
  }
  
  try {
    const zai = await ZAI.create();
    
    const prompt = generateImagePrompt(title, category);
    
    const response = await zai.images.generations.create({
      prompt: `${prompt}. High quality, professional news photography, 4k, sharp details.`,
      size: '1024x1024',
    });
    
    const imageBase64 = response.data[0]?.base64;
    
    if (!imageBase64) {
      throw new Error('No image generated');
    }
    
    // Return the base64 image data URL
    return NextResponse.json({
      success: true,
      imageUrl: `data:image/png;base64,${imageBase64}`,
      prompt,
      keywords: extractKeywords(title),
    });
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return fallback image URL based on category
    const fallbackImages: Record<string, string> = {
      'Ocean Freight': 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop&q=80',
      'Air Freight': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
      'Trade Finance': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&q=80',
      'Customs': 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop&q=80',
      'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80',
      'Sustainability': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop&q=80',
      'Logistics': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&q=80',
      'E-Commerce': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&q=80',
      'Geopolitical': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop&q=80',
    };
    
    return NextResponse.json({
      success: false,
      imageUrl: fallbackImages[category] || fallbackImages['Geopolitical'],
      error: 'Failed to generate AI image, using fallback',
    });
  }
}
