import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCommodities,
  getAllIndexes,
  getAllStocks,
  getAllCurrencies,
  getAllCrypto,
  getAllBonds,
  getAllFreight,
  getCommoditiesByCategory,
  getIndexesByRegion,
  getStocksBySector,
  getCurrenciesByType,
  commoditiesData,
  indexesData,
  stocksData,
  currenciesData,
  cryptoData,
  bondsData,
  freightData,
} from '@/lib/constants/trade-data';

// Types
interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  category: string;
  description?: string;
  historicalData?: { date: string; value: number }[];
  dayHigh?: number;
  dayLow?: number;
  week52High?: number;
  week52Low?: number;
  previousClose?: number;
  open?: number;
  volume?: number;
  marketCap?: string;
  metadata?: {
    exchange?: string;
    currency?: string;
    unit?: string;
    country?: string;
    sector?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface MarketResponse {
  success: boolean;
  data: MarketItem[];
  category: string;
  lastUpdated: string;
  cached: boolean;
  source: string;
  total: number;
  stats?: {
    gainers: number;
    losers: number;
    avgChange: number;
  };
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache: Map<string, { data: MarketItem[]; timestamp: number }> = new Map();

// Data generators map
const dataGenerators: Record<string, () => MarketItem[]> = {
  commodities: getAllCommodities,
  indexes: getAllIndexes,
  shares: getAllStocks,
  currencies: getAllCurrencies,
  crypto: getAllCrypto,
  bonds: getAllBonds,
  freight: getAllFreight,
};

// Category-specific data getters
const categoryDataGetters: Record<string, Record<string, () => MarketItem[]>> = {
  commodities: {
    energy: () => getCommoditiesByCategory('energy'),
    metals: () => getCommoditiesByCategory('metals'),
    agriculture: () => getCommoditiesByCategory('agriculture'),
    industrial: () => getCommoditiesByCategory('industrial'),
    livestock: () => getCommoditiesByCategory('livestock'),
    index: () => getCommoditiesByCategory('index'),
    electricity: () => getCommoditiesByCategory('electricity'),
  },
  indexes: {
    americas: () => getIndexesByRegion('americas'),
    europe: () => getIndexesByRegion('europe'),
    asia: () => getIndexesByRegion('asia'),
    oceania: () => getIndexesByRegion('oceania'),
    africa: () => getIndexesByRegion('africa'),
    middleEast: () => getIndexesByRegion('middleEast'),
  },
  shares: {
    technology: () => getStocksBySector('technology'),
    healthcare: () => getStocksBySector('healthcare'),
    financial: () => getStocksBySector('financial'),
    energy: () => getStocksBySector('energy'),
    consumer: () => getStocksBySector('consumer'),
    industrial: () => getStocksBySector('industrial'),
  },
  currencies: {
    major: () => getCurrenciesByType('major'),
    cross: () => getCurrenciesByType('cross'),
    emerging: () => getCurrenciesByType('emerging'),
  },
};

// Function to calculate stats
function calculateStats(data: MarketItem[]) {
  const gainers = data.filter(item => item.changePercent > 0).length;
  const losers = data.filter(item => item.changePercent < 0).length;
  const avgChange = data.length > 0
    ? data.reduce((sum, item) => sum + item.changePercent, 0) / data.length
    : 0;
  return { gainers, losers, avgChange };
}

// Simulate real-time price changes
function simulatePriceUpdates(data: MarketItem[]): MarketItem[] {
  return data.map(item => {
    // Small random price movement simulation
    const priceChange = (Math.random() - 0.5) * 0.002 * item.price;
    const newPrice = item.price + priceChange;
    const newChange = item.change + priceChange;
    const newChangePercent = (newChange / (item.previousClose || item.price)) * 100;
    
    return {
      ...item,
      price: Math.round(newPrice * 10000) / 10000,
      change: Math.round(newChange * 10000) / 10000,
      changePercent: Math.round(newChangePercent * 100) / 100,
      lastUpdated: new Date().toISOString(),
    };
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'commodities';
  const filter = searchParams.get('filter') || '';
  const limit = parseInt(searchParams.get('limit') || '200');
  const useCache = searchParams.get('cache') !== 'false';
  const search = searchParams.get('search') || '';
  const realtime = searchParams.get('realtime') === 'true';
  const includeStats = searchParams.get('stats') === 'true';

  try {
    // Check cache first
    const cacheKey = `${category}-${filter}-${search}`;
    const cached = cache.get(cacheKey);
    
    if (useCache && cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      let data = cached.data;
      
      // Apply real-time simulation if requested
      if (realtime) {
        data = simulatePriceUpdates(data);
      }
      
      const resultData = data.slice(0, limit);
      const stats = includeStats ? calculateStats(resultData) : undefined;
      
      return NextResponse.json({
        success: true,
        data: resultData,
        category,
        lastUpdated: new Date(cached.timestamp).toISOString(),
        cached: true,
        source: 'cache',
        total: cached.data.length,
        stats,
      } as MarketResponse);
    }

    // Generate data based on category
    const generator = dataGenerators[category];
    if (!generator) {
      return NextResponse.json(
        { success: false, error: `Invalid category: ${category}`, data: [] },
        { status: 400 }
      );
    }

    let data = generator();

    // Apply category-specific filter if available
    if (filter && filter !== 'all') {
      const filterLower = filter.toLowerCase();
      const categoryGetter = categoryDataGetters[category]?.[filterLower];
      
      if (categoryGetter) {
        data = categoryGetter();
      } else {
        // Fallback to general filtering
        data = data.filter(item => {
          const matchesName = item.name.toLowerCase().includes(filterLower);
          const matchesSymbol = item.symbol.toLowerCase().includes(filterLower);
          const matchesSector = item.sector?.toLowerCase().includes(filterLower);
          const matchesCountry = item.country?.toLowerCase().includes(filterLower);
          const matchesCategory = item.category?.toLowerCase().includes(filterLower);
          const matchesExchange = item.exchange?.toLowerCase().includes(filterLower);
          const matchesBaseCurrency = item.baseCurrency?.toLowerCase().includes(filterLower);
          const matchesQuoteCurrency = item.quoteCurrency?.toLowerCase().includes(filterLower);
          const matchesMaturity = item.maturity?.toLowerCase().includes(filterLower);
          
          return matchesName || matchesSymbol || matchesSector || matchesCountry || 
                 matchesCategory || matchesExchange || matchesBaseCurrency || 
                 matchesQuoteCurrency || matchesMaturity;
        });
      }
    }

    // Apply search if provided
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.symbol.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    }

    // Store full data for total count
    const total = data.length;

    // Apply limit
    data = data.slice(0, limit);

    // Update cache
    cache.set(cacheKey, { data, timestamp: Date.now() });

    const stats = includeStats ? calculateStats(data) : undefined;

    return NextResponse.json({
      success: true,
      data,
      category,
      lastUpdated: new Date().toISOString(),
      cached: false,
      source: 'generated',
      total,
      stats,
    } as MarketResponse);
  } catch (error) {
    console.error('Error fetching trade data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trade data', data: [] },
      { status: 500 }
    );
  }
}

// Get category counts endpoint
export async function HEAD(request: NextRequest) {
  const counts = {
    commodities: getAllCommodities().length,
    indexes: getAllIndexes().length,
    shares: getAllStocks().length,
    currencies: getAllCurrencies().length,
    crypto: getAllCrypto().length,
    bonds: getAllBonds().length,
    freight: getAllFreight().length,
  };

  return NextResponse.json({ counts });
}
