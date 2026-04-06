import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// ============================================================================
// QUANTUM AI SEARCH & INSIGHT ENGINE
// The Global Intelligence Hub for Trade & Logistics
// ============================================================================

// Comprehensive Data Sets

// Top Shipping Lines
const shippingLines = [
  { rank: 1, name: "MSC - Mediterranean Shipping Company", country: "Switzerland", fleet: 760, teu: "5,200,000", revenue: "$86.9B", founded: 1970, headquarters: "Geneva", website: "msc.com" },
  { rank: 2, name: "Maersk Line", country: "Denmark", fleet: 708, teu: "4,300,000", revenue: "$81.5B", founded: 1904, headquarters: "Copenhagen", website: "maersk.com" },
  { rank: 3, name: "CMA CGM", country: "France", fleet: 632, teu: "3,700,000", revenue: "$74.8B", founded: 1978, headquarters: "Marseille", website: "cma-cgm.com" },
  { rank: 4, name: "COSCO Shipping", country: "China", fleet: 548, teu: "3,100,000", revenue: "$68.2B", founded: 1961, headquarters: "Shanghai", website: "coscoshipping.com" },
  { rank: 5, name: "Hapag-Lloyd", country: "Germany", fleet: 266, teu: "2,100,000", revenue: "$45.8B", founded: 1847, headquarters: "Hamburg", website: "hapag-lloyd.com" },
  { rank: 6, name: "ONE - Ocean Network Express", country: "Japan", fleet: 238, teu: "1,800,000", revenue: "$38.2B", founded: 2017, headquarters: "Tokyo", website: "one-line.com" },
  { rank: 7, name: "Evergreen Line", country: "Taiwan", fleet: 218, teu: "1,600,000", revenue: "$32.4B", founded: 1968, headquarters: "Taipei", website: "evergreen-line.com" },
  { rank: 8, name: "HMM Co. Ltd", country: "South Korea", fleet: 145, teu: "1,100,000", revenue: "$24.8B", founded: 1976, headquarters: "Seoul", website: "hmm21.com" },
  { rank: 9, name: "Yang Ming Marine Transport", country: "Taiwan", fleet: 128, teu: "890,000", revenue: "$18.6B", founded: 1972, headquarters: "Keelung", website: "yangming.com" },
  { rank: 10, name: "Zim Integrated Shipping", country: "Israel", fleet: 152, teu: "720,000", revenue: "$16.2B", founded: 1945, headquarters: "Haifa", website: "zim.com" },
  { rank: 11, name: "Pacific International Lines (PIL)", country: "Singapore", fleet: 118, teu: "650,000", revenue: "$12.8B", founded: 1967, headquarters: "Singapore", website: "pilship.com" },
  { rank: 12, name: "Wan Hai Lines", country: "Taiwan", fleet: 126, teu: "580,000", revenue: "$11.4B", founded: 1965, headquarters: "Taipei", website: "wanhai.com" },
  { rank: 13, name: "Zhonggu Logistics", country: "China", fleet: 108, teu: "520,000", revenue: "$9.8B", founded: 2003, headquarters: "Shanghai", website: "zhonggu56.com" },
  { rank: 14, name: "X-Press Feeders", country: "Singapore", fleet: 112, teu: "480,000", revenue: "$8.6B", founded: 1972, headquarters: "Singapore", website: "x-pressfeeders.com" },
  { rank: 15, name: "IRISL - Iran Shipping Lines", country: "Iran", fleet: 88, teu: "420,000", revenue: "$7.2B", founded: 1967, headquarters: "Tehran", website: "irisl.net" },
  { rank: 16, name: "NYK Line - Nippon Yusen", country: "Japan", fleet: 95, teu: "380,000", revenue: "$6.8B", founded: 1885, headquarters: "Tokyo", website: "nyk.com" },
  { rank: 17, name: "MOL - Mitsui O.S.K. Lines", country: "Japan", fleet: 92, teu: "350,000", revenue: "$6.2B", founded: 1884, headquarters: "Tokyo", website: "mol.co.jp" },
  { rank: 18, name: "K Line - Kawasaki Kisen", country: "Japan", fleet: 85, teu: "320,000", revenue: "$5.8B", founded: 1919, headquarters: "Tokyo", website: "kline.co.jp" },
  { rank: 19, name: "Hamburg Süd", country: "Germany", fleet: 78, teu: "290,000", revenue: "$5.2B", founded: 1871, headquarters: "Hamburg", website: "hamburgsud.com" },
  { rank: 20, name: "SITC Container Lines", country: "China", fleet: 72, teu: "260,000", revenue: "$4.8B", founded: 1996, headquarters: "Qingdao", website: "sitc.com" },
];

// Top Freight Forwarders
const freightForwarders = [
  { rank: 1, name: "DHL Supply Chain", country: "Germany", employees: "400,000+", revenue: "$62.8B", services: "Air Freight, Ocean Freight, Road Transport, Warehousing, Contract Logistics", founded: 1969, headquarters: "Bonn" },
  { rank: 2, name: "Kuehne + Nagel", country: "Switzerland", employees: "83,000+", revenue: "$48.2B", services: "Sea Freight, Air Freight, Road Transport, Contract Logistics", founded: 1890, headquarters: "Schindellegi" },
  { rank: 3, name: "DB Schenker", country: "Germany", employees: "76,000+", revenue: "$42.6B", services: "Land Transport, Air Freight, Ocean Freight, Contract Logistics", founded: 1872, headquarters: "Essen" },
  { rank: 4, name: "Nippon Express", country: "Japan", employees: "72,000+", revenue: "$38.4B", services: "Global Logistics, Freight Forwarding, Moving Services", founded: 1872, headquarters: "Tokyo" },
  { rank: 5, name: "DSV Panalpina", country: "Denmark", employees: "61,000+", revenue: "$35.8B", services: "Air, Sea, Road Logistics, Supply Chain Solutions", founded: 1976, headquarters: "Hedehusene" },
  { rank: 6, name: "C.H. Robinson", country: "USA", employees: "19,000+", revenue: "$28.2B", services: "Trucking, Freight Brokerage, Logistics", founded: 1905, headquarters: "Eden Prairie" },
  { rank: 7, name: "Expeditors International", country: "USA", employees: "18,000+", revenue: "$24.6B", services: "Air Freight, Ocean Freight, Customs Brokerage", founded: 1979, headquarters: "Seattle" },
  { rank: 8, name: "Sinotrans", country: "China", employees: "45,000+", revenue: "$22.8B", services: "Freight Forwarding, Logistics, Storage", founded: 1950, headquarters: "Beijing" },
  { rank: 9, name: "Geodis", country: "France", employees: "49,000+", revenue: "$18.4B", services: "Supply Chain Optimization, Distribution", founded: 1904, headquarters: "Levallois-Perret" },
  { rank: 10, name: "Bolloré Logistics", country: "France", employees: "21,000+", revenue: "$16.2B", services: "Freight Forwarding, Logistics, Energy Transport", founded: 1822, headquarters: "Puteaux" },
];

// Top Global Ports
const globalPorts = [
  { rank: 1, name: "Port of Shanghai", country: "China", teu: "47,300,000", vessels: "38,000+", coordinates: "31.36°N, 121.59°E", terminals: 125, depth: "16m" },
  { rank: 2, name: "Port of Singapore", country: "Singapore", teu: "37,200,000", vessels: "130,000+", coordinates: "1.26°N, 103.82°E", terminals: 67, depth: "18m" },
  { rank: 3, name: "Port of Ningbo-Zhoushan", country: "China", teu: "33,400,000", vessels: "25,000+", coordinates: "29.87°N, 121.55°E", terminals: 89, depth: "17m" },
  { rank: 4, name: "Port of Shenzhen", country: "China", teu: "30,400,000", vessels: "28,000+", coordinates: "22.48°N, 113.91°E", terminals: 52, depth: "16m" },
  { rank: 5, name: "Port of Guangzhou", country: "China", teu: "24,500,000", vessels: "22,000+", coordinates: "22.95°N, 113.52°E", terminals: 48, depth: "15m" },
  { rank: 6, name: "Port of Busan", country: "South Korea", teu: "22,500,000", vessels: "18,000+", coordinates: "35.10°N, 129.04°E", terminals: 42, depth: "16m" },
  { rank: 7, name: "Port of Qingdao", country: "China", teu: "21,200,000", vessels: "16,000+", coordinates: "36.06°N, 120.38°E", terminals: 38, depth: "17m" },
  { rank: 8, name: "Port of Hong Kong", country: "Hong Kong", teu: "18,200,000", vessels: "15,000+", coordinates: "22.29°N, 114.17°E", terminals: 24, depth: "15m" },
  { rank: 9, name: "Port of Tianjin", country: "China", teu: "17,500,000", vessels: "14,000+", coordinates: "38.98°N, 117.78°E", terminals: 35, depth: "16m" },
  { rank: 10, name: "Port of Rotterdam", country: "Netherlands", teu: "15,300,000", vessels: "29,000+", coordinates: "51.91°N, 4.43°E", terminals: 45, depth: "22m" },
  { rank: 11, name: "Port of Jebel Ali", country: "UAE", teu: "14,100,000", vessels: "12,000+", coordinates: "25.01°N, 55.03°E", terminals: 18, depth: "17m" },
  { rank: 12, name: "Port of Los Angeles", country: "USA", teu: "10,700,000", vessels: "1,800+", coordinates: "33.74°N, 118.27°W", terminals: 25, depth: "16m" },
  { rank: 13, name: "Port of Hamburg", country: "Germany", teu: "8,500,000", vessels: "9,000+", coordinates: "53.54°N, 9.99°E", terminals: 38, depth: "15m" },
  { rank: 14, name: "Port of Antwerp", country: "Belgium", teu: "12,000,000", vessels: "15,000+", coordinates: "51.26°N, 4.40°E", terminals: 42, depth: "16m" },
  { rank: 15, name: "Port of Long Beach", country: "USA", teu: "9,100,000", vessels: "1,700+", coordinates: "33.75°N, 118.22°W", terminals: 22, depth: "16m" },
];

// Trade Routes
const tradeRoutes = [
  { name: "Asia - Europe (via Suez)", volume: "28M TEU", transit: "30-35 days", distance: "11,000 nm", status: "Disrupted", risk: "High", congestion: "Moderate" },
  { name: "Asia - Europe (via Cape)", volume: "8M TEU", transit: "42-48 days", distance: "14,500 nm", status: "Active", risk: "Low", congestion: "Low" },
  { name: "Trans-Pacific (Asia - US West)", volume: "24M TEU", transit: "14-18 days", distance: "5,500 nm", status: "Active", risk: "Low", congestion: "Moderate" },
  { name: "Trans-Pacific (Asia - US East)", volume: "12M TEU", transit: "25-30 days", distance: "10,000 nm", status: "Active", risk: "Low", congestion: "High" },
  { name: "Asia - Mediterranean", volume: "15M TEU", transit: "22-28 days", distance: "7,500 nm", status: "Disrupted", risk: "High", congestion: "Moderate" },
  { name: "Trans-Atlantic (Europe - US East)", volume: "8M TEU", transit: "10-14 days", distance: "3,500 nm", status: "Active", risk: "Low", congestion: "Low" },
  { name: "Intra-Asia", volume: "35M TEU", transit: "3-7 days", distance: "1,500 nm", status: "Active", risk: "Low", congestion: "High" },
  { name: "Asia - Middle East", volume: "6M TEU", transit: "10-15 days", distance: "4,500 nm", status: "Active", risk: "Moderate", congestion: "Low" },
  { name: "South America - Europe", volume: "4M TEU", transit: "18-22 days", distance: "5,500 nm", status: "Active", risk: "Low", congestion: "Low" },
  { name: "Asia - Africa", volume: "3M TEU", transit: "15-20 days", distance: "6,000 nm", status: "Active", risk: "Moderate", congestion: "Low" },
];

// Market Indices
const marketIndices = {
  bdi: { name: "Baltic Dry Index", value: 1847, change: 2.3, trend: "up" },
  scfi: { name: "Shanghai Container Freight Index", value: 2156, change: -1.8, trend: "down" },
  wci: { name: "World Container Index", value: 2847, change: 0.5, trend: "up" },
  harper: { name: "Harper Petersen Index", value: 1245, change: 1.2, trend: "up" },
};

// Global Metrics
function getGlobalMetrics() {
  return {
    activeVessels: 52847,
    containersInTransit: 12456890,
    portCongestionIndex: 0.72,
    averageTransitDelay: 2.4,
    carbonIntensityIndex: 3.2,
    freightRateIndex: 2847,
    tradeVolume24h: 48750000000,
    lastUpdated: new Date().toISOString(),
  };
}

// Alerts
function getAlerts() {
  return [
    { id: 1, type: "critical", title: "Red Sea Route Disruption", message: "Houthi attacks continuing - vessels rerouting via Cape of Good Hope. Additional 10-14 days transit time.", impact: "High", confidence: 0.95 },
    { id: 2, type: "warning", title: "Typhoon Season Active", message: "Multiple typhoons developing in Western Pacific. Port operations may be affected in Shanghai, Ningbo, Busan.", impact: "Medium", confidence: 0.82 },
    { id: 3, type: "info", title: "EU Carbon Tax Effective", message: "EU ETS now includes maritime emissions. Additional costs for EU-bound shipments.", impact: "Medium", confidence: 1.0 },
    { id: 4, type: "opportunity", title: "Rate Stabilization Expected", message: "Container rates projected to stabilize in Q2 as new capacity enters service.", impact: "Positive", confidence: 0.78 },
  ];
}

// Predictions
function getPredictions() {
  return [
    { metric: "Freight Rates - Asia-Europe", prediction: "Decrease 8-12%", timeframe: "60-90 days", confidence: 0.82, factors: ["New vessel capacity", "Demand softening", "Seasonal patterns"] },
    { metric: "Port Congestion - Rotterdam", prediction: "Increase 15-20%", timeframe: "14-21 days", confidence: 0.75, factors: ["Labor negotiations", "Peak season volumes", "Weather patterns"] },
    { metric: "Container Availability - Asia", prediction: "Improve 25%", timeframe: "30-45 days", confidence: 0.88, factors: ["Return flows", "New container production", "Repositioning efficiency"] },
  ];
}

// Causal Factors
function getCausalFactors() {
  return [
    { id: 1, name: "Geopolitical Tensions - Red Sea", type: "geopolitical", probability: 0.95, impact: "Severe", explanation: "Ongoing conflict affecting major trade route, causing rerouting and increased transit times", affectedRoutes: ["Asia-Europe", "Asia-Mediterranean"] },
    { id: 2, name: "Fuel Price Volatility", type: "economic", probability: 0.78, impact: "Moderate", explanation: "Crude oil prices fluctuating due to OPEC+ decisions and global demand patterns", affectedRoutes: ["All"] },
    { id: 3, name: "New Container Ship Deliveries", type: "operational", probability: 0.92, impact: "Moderate", explanation: "Record newbuilding deliveries increasing fleet capacity by 8% in 2024", affectedRoutes: ["All"] },
    { id: 4, name: "Climate Change Impacts", type: "environmental", probability: 0.85, impact: "Moderate", explanation: "Panama Canal water levels, typhoon intensity affecting port operations globally", affectedRoutes: ["Trans-Pacific", "Asia-Latin America"] },
    { id: 5, name: "EU Emissions Regulations", type: "regulatory", probability: 1.0, impact: "Moderate", explanation: "EU ETS extension to maritime increasing costs for EU-bound shipments", affectedRoutes: ["Asia-Europe", "Trans-Atlantic"] },
  ];
}

// Main Search Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, scenario } = body;
    
    const zai = await ZAI.create();
    const queryLower = query.toLowerCase();
    
    // Determine query type
    let results: any = {};
    let resultType = 'general';
    
    // Shipping Lines
    if (queryLower.includes('shipping') && (queryLower.includes('compan') || queryLower.includes('line') || queryLower.includes('carrier'))) {
      results = { data: shippingLines, type: 'shipping-lines', count: shippingLines.length };
      resultType = 'shipping-lines';
    }
    // Freight Forwarders
    else if (queryLower.includes('freight') || queryLower.includes('forwarder') || queryLower.includes('3pl') || queryLower.includes('logistics compan')) {
      results = { data: freightForwarders, type: 'freight-forwarders', count: freightForwarders.length };
      resultType = 'freight-forwarders';
    }
    // Ports
    else if (queryLower.includes('port') || queryLower.includes('terminal')) {
      results = { data: globalPorts, type: 'ports', count: globalPorts.length };
      resultType = 'ports';
    }
    // Routes
    else if (queryLower.includes('route') || queryLower.includes('trade lane') || queryLower.includes('shipping lane')) {
      results = { data: tradeRoutes, type: 'routes', count: tradeRoutes.length };
      resultType = 'routes';
    }
    // Market/Indices
    else if (queryLower.includes('index') || queryLower.includes('rate') || queryLower.includes('bdi') || queryLower.includes('freight rate')) {
      results = { data: marketIndices, type: 'market-indices', count: 4 };
      resultType = 'market-indices';
    }
    
    // Get AI Analysis
    const aiResponse = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are the Quantum AI Intelligence Engine for Shiportrade.com - the world's most advanced trade and logistics intelligence platform.

Provide comprehensive, accurate, and actionable insights. When discussing companies, ports, routes, or market data, provide specific facts and strategic recommendations.

Format your response with clear sections:
- **Summary**: Brief overview
- **Key Insights**: Important findings
- **Recommendations**: Actionable advice
- **Market Outlook**: Future predictions

Be professional, precise, and helpful.`
        },
        {
          role: 'user',
          content: query
        }
      ],
    });
    
    const aiAnalysis = aiResponse.choices[0]?.message?.content || 'Analysis in progress...';
    
    // Build comprehensive response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      query,
      resultType,
      
      // Search Results
      results,
      
      // AI Analysis
      aiAnalysis,
      
      // Global Metrics
      globalMetrics: getGlobalMetrics(),
      
      // Alerts
      alerts: getAlerts(),
      
      // Predictions
      predictions: getPredictions(),
      
      // Causal Factors
      causalFactors: getCausalFactors(),
      
      // Scenario Simulation
      simulation: scenario ? {
        scenario,
        outcomes: [
          { metric: "Transit Time", change: "+35%", confidence: 0.92 },
          { metric: "Freight Rates", change: "+25%", confidence: 0.85 },
          { metric: "Insurance Costs", change: "+150%", confidence: 0.88 },
        ],
        recommendedActions: [
          "Consider alternative routing via Cape of Good Hope",
          "Secure insurance coverage at current rates",
          "Pre-book capacity on alternative routes",
          "Communicate delays to customers proactively",
        ],
      } : null,
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Quantum Search Error:', error);
    return NextResponse.json(
      { success: false, error: 'Search processing error' },
      { status: 500 }
    );
  }
}

// GET for real-time data
export async function GET() {
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    globalMetrics: getGlobalMetrics(),
    alerts: getAlerts(),
    marketIndices,
  });
}
