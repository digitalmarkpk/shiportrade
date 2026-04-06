'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  DollarSign,
  Bitcoin,
  Landmark,
  Calendar,
  Ship,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sparkles,
  Globe,
  Clock,
  Activity,
  Info,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Zap,
  Wheat,
  Coins,
  Flame,
  Battery,
  Leaf,
  Search,
  Filter,
  LayoutGrid,
  List,
  BarChart2,
  Zap as Lightning,
  Newspaper,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';

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
  metadata?: {
    exchange?: string;
    currency?: string;
    unit?: string;
  };
}

// Trade categories configuration with more details
const tradeCategories = [
  {
    name: 'Commodities',
    description: 'Oil, Gold, Silver, Copper, and other raw materials',
    href: '/trade/commodities',
    icon: BarChart3,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    stats: '200+ items',
    subcategories: ['Energy', 'Metals', 'Agriculture', 'Industrial', 'Livestock'],
  },
  {
    name: 'Indexes',
    description: 'S&P 500, Dow Jones, NASDAQ, and global indices',
    href: '/trade/indexes',
    icon: TrendingUp,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    stats: '100+ indices',
    subcategories: ['Americas', 'Europe', 'Asia Pacific', 'Africa', 'Middle East'],
  },
  {
    name: 'Shares/Stocks',
    description: 'Top US and international company stocks',
    href: '/trade/shares',
    icon: PieChart,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    stats: '150+ stocks',
    subcategories: ['Technology', 'Healthcare', 'Financial', 'Energy', 'Consumer'],
  },
  {
    name: 'Currencies',
    description: 'Forex rates and currency pairs',
    href: '/trade/currencies',
    icon: DollarSign,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    stats: '50+ pairs',
    subcategories: ['Major Pairs', 'Cross Pairs', 'Emerging Markets'],
  },
  {
    name: 'Crypto',
    description: 'Bitcoin, Ethereum, and other cryptocurrencies',
    href: '/trade/crypto',
    icon: Bitcoin,
    color: 'from-cyan-500 to-sky-600',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    stats: '30+ coins',
    subcategories: ['Layer 1', 'Layer 2', 'DeFi', 'Stablecoins'],
  },
  {
    name: 'Bonds',
    description: 'Government and corporate bond yields',
    href: '/trade/bonds',
    icon: Landmark,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    textColor: 'text-rose-600 dark:text-rose-400',
    stats: '40+ bonds',
    subcategories: ['US Treasury', 'Europe', 'Asia', 'Emerging Markets'],
  },
  {
    name: 'Earnings',
    description: 'Company earnings calendar and reports',
    href: '/trade/earnings',
    icon: Calendar,
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    textColor: 'text-orange-600 dark:text-orange-400',
    stats: 'Weekly updates',
    subcategories: ['This Week', 'Next Week', 'Top Companies'],
  },
  {
    name: 'Freight Index Tracker',
    description: 'BDI, FBX, SCFI, and shipping indices',
    href: '/trade/freight-index',
    icon: Ship,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    textColor: 'text-sky-600 dark:text-sky-400',
    stats: '25+ indices',
    subcategories: ['Dry Bulk', 'Container', 'Tanker', 'Gas'],
  },
];

// Market news data (simulated)
const marketNews = [
  {
    id: '1',
    title: 'Oil prices surge amid Middle East tensions',
    summary: 'Crude oil futures climbed 2.5% as geopolitical concerns continue to impact supply expectations.',
    category: 'Energy',
    time: '2 hours ago',
    impact: 'positive' as const,
  },
  {
    id: '2',
    title: 'Federal Reserve signals potential rate cuts',
    summary: 'Minutes from the latest FOMC meeting suggest the central bank may consider rate reductions.',
    category: 'Bonds',
    time: '4 hours ago',
    impact: 'neutral' as const,
  },
  {
    id: '3',
    title: 'Gold reaches new all-time high',
    summary: 'Safe-haven demand pushes gold prices above $2,400 for the first time in history.',
    category: 'Metals',
    time: '5 hours ago',
    impact: 'positive' as const,
  },
  {
    id: '4',
    title: 'Bitcoin ETF sees record inflows',
    summary: 'Institutional investors continue to pour capital into spot Bitcoin ETFs.',
    category: 'Crypto',
    time: '6 hours ago',
    impact: 'positive' as const,
  },
  {
    id: '5',
    title: 'China manufacturing PMI misses estimates',
    summary: 'Economic data from China shows slower-than-expected manufacturing growth.',
    category: 'Economy',
    time: '8 hours ago',
    impact: 'negative' as const,
  },
];

// Top movers data
interface TopMover {
  symbol: string;
  name: string;
  price: string;
  change: number;
  category: string;
}

// Color utilities
const getChangeColor = (change: number) => {
  if (change > 0) return 'text-green-600 dark:text-green-400';
  if (change < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
};

const getChangeBgColor = (change: number) => {
  if (change > 0) return 'bg-green-100 dark:bg-green-900/30';
  if (change < 0) return 'bg-red-100 dark:bg-red-900/30';
  return 'bg-gray-100 dark:bg-gray-800';
};

export default function TradeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [commoditiesData, setCommoditiesData] = useState<MarketItem[]>([]);
  const [indexesData, setIndexesData] = useState<MarketItem[]>([]);
  const [cryptoData, setCryptoData] = useState<MarketItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllNews, setShowAllNews] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [commoditiesRes, indexesRes, cryptoRes] = await Promise.all([
        fetch('/api/trade?category=commodities&limit=8'),
        fetch('/api/trade?category=indexes&limit=8'),
        fetch('/api/trade?category=crypto&limit=8'),
      ]);

      const [commodities, indexes, crypto] = await Promise.all([
        commoditiesRes.json(),
        indexesRes.json(),
        cryptoRes.json(),
      ]);

      if (commodities.success) setCommoditiesData(commodities.data);
      if (indexes.success) setIndexesData(indexes.data);
      if (crypto.success) setCryptoData(crypto.data);

      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchMarketData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMarketData, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchMarketData, autoRefresh]);

  // Calculate market statistics
  const marketStats = useMemo(() => {
    const allData = [...commoditiesData, ...indexesData, ...cryptoData];
    const gainers = allData.filter(item => item.changePercent > 0).length;
    const losers = allData.filter(item => item.changePercent < 0).length;
    const avgChange = allData.length > 0
      ? allData.reduce((sum, item) => sum + item.changePercent, 0) / allData.length
      : 0;

    return { gainers, losers, avgChange, total: allData.length };
  }, [commoditiesData, indexesData, cryptoData]);

  // Get top movers
  const topGainers = useMemo(() => {
    const allData = [...commoditiesData, ...indexesData, ...cryptoData];
    return [...allData]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);
  }, [commoditiesData, indexesData, cryptoData]);

  const topLosers = useMemo(() => {
    const allData = [...commoditiesData, ...indexesData, ...cryptoData];
    return [...allData]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);
  }, [commoditiesData, indexesData, cryptoData]);

  // Market distribution pie chart data
  const marketDistribution = useMemo(() => [
    { name: 'Gainers', value: marketStats.gainers, color: '#22c55e' },
    { name: 'Losers', value: marketStats.losers, color: '#ef4444' },
    { name: 'Unchanged', value: marketStats.total - marketStats.gainers - marketStats.losers, color: '#6b7280' },
  ], [marketStats]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Professional Market Ticker */}
      <div className="bg-gray-900 dark:bg-gray-950 border-b border-gray-800 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...commoditiesData, ...indexesData, ...cryptoData, ...commoditiesData, ...indexesData, ...cryptoData].slice(0, 40).map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-3 px-4 py-2.5 border-r border-gray-800 flex-shrink-0 hover:bg-gray-800/50 transition-colors"
            >
              <span className="text-gray-400 text-xs font-medium">{item.symbol}</span>
              <span className="text-white font-semibold text-sm">
                {item.price < 0.01 ? item.price.toFixed(6) : item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={commoditiesData.slice(0, 1)[0]?.historicalData?.slice(-30) || []}>
              <defs>
                <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} fill="url(#heroGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="outline" className="px-4 py-1 border-sky-500/30 text-sky-600 dark:text-sky-400">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Real-time Market Data
                </Badge>
                <Badge variant="outline" className="px-4 py-1 border-green-500/30 text-green-600 dark:text-green-400">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Updates
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Global Trade{' '}
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Access real-time market data across commodities, stocks, currencies, crypto, bonds, and freight indices. 
                Make informed trading decisions with comprehensive analytics.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-sky-500/25">
                  <Link href="/trade/commodities">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Explore Markets
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2">
                  <Link href="#categories">
                    View All Categories
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto"
          >
            {[
              { label: 'Commodities', value: '200+', icon: BarChart3, change: '+2.4%', up: true },
              { label: 'Stock Indices', value: '100+', icon: TrendingUp, change: '+0.8%', up: true },
              { label: 'Currency Pairs', value: '50+', icon: DollarSign, change: '-0.2%', up: false },
              { label: 'Crypto Assets', value: '30+', icon: Bitcoin, change: '+5.2%', up: true },
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-xl transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="h-5 w-5 text-sky-500" />
                    <span className={`text-xs font-medium ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Market Summary Dashboard */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Overview Card */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Market Overview</CardTitle>
                  <CardDescription>Real-time market performance summary</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAutoRefresh(!autoRefresh)}
                          className={autoRefresh ? 'text-green-500' : 'text-gray-400'}
                        >
                          {autoRefresh ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Auto-refresh {autoRefresh ? 'on' : 'off'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="ghost" size="sm" onClick={fetchMarketData} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{marketStats.gainers}</div>
                  <div className="text-sm text-green-700 dark:text-green-300 flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Gainers
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{marketStats.losers}</div>
                  <div className="text-sm text-red-700 dark:text-red-300 flex items-center justify-center gap-1">
                    <TrendingDown className="h-3 w-3" /> Losers
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30">
                  <div className={`text-3xl font-bold ${marketStats.avgChange >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                    {marketStats.avgChange >= 0 ? '+' : ''}{marketStats.avgChange.toFixed(2)}%
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Avg Change</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{marketStats.total}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
                </div>
              </div>

              {/* Market Distribution Pie Chart */}
              <div className="flex items-center justify-center gap-8">
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={marketDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={55}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {marketDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2">
                  {marketDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Movers Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Top Movers</CardTitle>
              <CardDescription>Biggest gains and losses</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="gainers" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="gainers" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Gainers
                  </TabsTrigger>
                  <TabsTrigger value="losers" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700 dark:data-[state=active]:bg-red-900/30 dark:data-[state=active]:text-red-400">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Losers
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="gainers" className="mt-0">
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-2">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3 p-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-20 mb-1" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                          </div>
                        ))
                      ) : (
                        topGainers.map((item, index) => (
                          <Link key={item.id} href={`/trade/${item.category}`}>
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white">{item.symbol}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.name}</div>
                              </div>
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                                +{item.changePercent.toFixed(2)}%
                              </Badge>
                            </motion.div>
                          </Link>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="losers" className="mt-0">
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-2">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3 p-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-20 mb-1" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                          </div>
                        ))
                      ) : (
                        topLosers.map((item, index) => (
                          <Link key={item.id} href={`/trade/${item.category}`}>
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white">{item.symbol}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.name}</div>
                              </div>
                              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0">
                                {item.changePercent.toFixed(2)}%
                              </Badge>
                            </motion.div>
                          </Link>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Market Categories</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore comprehensive market data across multiple asset classes. Click on any category to dive deeper into detailed quotes and analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tradeCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${category.bgColor}`}>
                        <category.icon className={`h-6 w-6 ${category.textColor}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{category.stats}</Badge>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-4">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 4).map((sub, i) => (
                        <Badge key={i} variant="outline" className="text-xs text-gray-500 dark:text-gray-400">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Market Data Preview Tabs */}
      <section className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900/50 -mx-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Data</h2>
              <p className="text-gray-600 dark:text-gray-400">Real-time prices across different markets</p>
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            )}
          </div>

          <Tabs defaultValue="commodities" className="w-full">
            <TabsList className="mb-6 flex-wrap h-auto gap-2 bg-transparent p-0">
              <TabsTrigger value="commodities" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30">
                <BarChart3 className="h-4 w-4 mr-2" />
                Commodities
              </TabsTrigger>
              <TabsTrigger value="indexes" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30">
                <TrendingUp className="h-4 w-4 mr-2" />
                Indexes
              </TabsTrigger>
              <TabsTrigger value="crypto" className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 dark:data-[state=active]:bg-cyan-900/30">
                <Bitcoin className="h-4 w-4 mr-2" />
                Crypto
              </TabsTrigger>
            </TabsList>

            <TabsContent value="commodities" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="border-0 shadow">
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-24 mb-4" />
                        <Skeleton className="h-16 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  commoditiesData.map((item) => (
                    <Link key={item.id} href={`/trade/commodities`}>
                      <Card className="border-0 shadow hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.symbol}</span>
                            <Badge className={`${getChangeBgColor(item.changePercent)} ${getChangeColor(item.changePercent)} border-0`}>
                              {item.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                              {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                            </Badge>
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {item.price < 0.01 ? item.price.toFixed(6) : item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            {item.metadata?.unit && <span className="text-xs text-gray-500 ml-1">{item.metadata.unit}</span>}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">{item.name}</div>
                          
                          {item.historicalData && item.historicalData.length > 0 && (
                            <div className="h-16 mt-2">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={item.historicalData.slice(-14)}>
                                  <defs>
                                    <linearGradient id={`color-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={item.changePercent >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor={item.changePercent >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={item.changePercent >= 0 ? '#22c55e' : '#ef4444'}
                                    strokeWidth={2}
                                    fill={`url(#color-${item.id})`}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link href="/trade/commodities">
                    View All Commodities
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="indexes" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="border-0 shadow">
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-24 mb-4" />
                        <Skeleton className="h-16 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  indexesData.map((item) => (
                    <Link key={item.id} href={`/trade/indexes`}>
                      <Card className="border-0 shadow hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.symbol}</span>
                            <Badge className={`${getChangeBgColor(item.changePercent)} ${getChangeColor(item.changePercent)} border-0`}>
                              {item.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                              {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                            </Badge>
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">{item.name}</div>
                          
                          {item.historicalData && item.historicalData.length > 0 && (
                            <div className="h-16 mt-2">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={item.historicalData.slice(-14)}>
                                  <defs>
                                    <linearGradient id={`color-idx-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={item.changePercent >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor={item.changePercent >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={item.changePercent >= 0 ? '#22c55e' : '#ef4444'}
                                    strokeWidth={2}
                                    fill={`url(#color-idx-${item.id})`}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link href="/trade/indexes">
                    View All Indexes
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="crypto" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="border-0 shadow">
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-24 mb-4" />
                        <Skeleton className="h-16 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  cryptoData.map((item) => (
                    <Link key={item.id} href={`/trade/crypto`}>
                      <Card className="border-0 shadow hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.symbol}</span>
                            <Badge className={`${getChangeBgColor(item.changePercent)} ${getChangeColor(item.changePercent)} border-0`}>
                              {item.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                              {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                            </Badge>
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            ${item.price < 0.01 ? item.price.toFixed(6) : item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">{item.name}</div>
                          
                          {item.historicalData && item.historicalData.length > 0 && (
                            <div className="h-16 mt-2">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={item.historicalData.slice(-14)}>
                                  <defs>
                                    <linearGradient id={`color-crypto-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={item.changePercent >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor={item.changePercent >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={item.changePercent >= 0 ? '#22c55e' : '#ef4444'}
                                    strokeWidth={2}
                                    fill={`url(#color-crypto-${item.id})`}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link href="/trade/crypto">
                    View All Crypto
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Market News Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market News</h2>
              <p className="text-gray-600 dark:text-gray-400">Latest updates affecting global markets</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowAllNews(!showAllNews)}>
              {showAllNews ? 'Show Less' : 'View All'}
              <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${showAllNews ? 'rotate-90' : ''}`} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAllNews ? marketNews : marketNews.slice(0, 3)).map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{news.category}</Badge>
                      <Badge 
                        variant="outline" 
                        className={
                          news.impact === 'positive' 
                            ? 'text-green-600 border-green-200 dark:text-green-400 dark:border-green-800' 
                            : news.impact === 'negative'
                            ? 'text-red-600 border-red-200 dark:text-red-400 dark:border-red-800'
                            : 'text-gray-600 border-gray-200 dark:text-gray-400'
                        }
                      >
                        {news.impact === 'positive' ? '↑ Bullish' : news.impact === 'negative' ? '↓ Bearish' : '→ Neutral'}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{news.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{news.summary}</p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      {news.time}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Why Trade with Shiportrade?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive market intelligence platform for professional traders and investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Activity,
                title: 'Real-time Data',
                description: 'Live market data updated every minute with auto-refresh capabilities.',
                color: 'text-sky-500',
                bgColor: 'bg-sky-100 dark:bg-sky-900/30',
              },
              {
                icon: Globe,
                title: 'Global Coverage',
                description: 'Track markets across Americas, Europe, Asia-Pacific, and emerging economies.',
                color: 'text-emerald-500',
                bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
              },
              {
                icon: BarChart2,
                title: 'Advanced Charts',
                description: 'Interactive charts with sparklines, treemaps, and scatter plot visualizations.',
                color: 'text-purple-500',
                bgColor: 'bg-purple-100 dark:bg-purple-900/30',
              },
              {
                icon: Info,
                title: 'Educational Content',
                description: 'Learn about different markets with our comprehensive guides and resources.',
                color: 'text-amber-500',
                bgColor: 'bg-amber-100 dark:bg-amber-900/30',
              },
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="border-0 shadow-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <CardContent className="p-8 md:p-12 text-center relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-sky-100 mb-6 max-w-xl mx-auto">
              Dive into comprehensive market data across all asset classes. Track real-time prices, 
              analyze trends, and make informed decisions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-sky-600 hover:bg-gray-100 shadow-lg">
                <Link href="/trade/commodities">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Start with Commodities
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/trade/freight-index">
                  <Ship className="h-4 w-4 mr-2" />
                  Explore Freight Indices
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
