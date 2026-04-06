'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Table,
  Grid3X3,
  LineChart,
  Zap,
  Coins,
  Wheat,
  Leaf,
  Battery,
  ChevronUp,
  ChevronDown,
  Clock,
  Info,
  ChevronLeft,
  Eye,
  EyeOff,
  Download,
  LayoutGrid,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Flame,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table as DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
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
  subCategory?: string;
  mainCategory?: string;
  description?: string;
  historicalData?: { date: string; value: number }[];
  dayHigh?: number;
  dayLow?: number;
  week52High?: number;
  week52Low?: number;
  previousClose?: number;
  open?: number;
  volume?: number;
  metadata?: {
    exchange?: string;
    currency?: string;
    unit?: string;
  };
}

// Commodity category definitions
const commodityCategories = [
  {
    name: 'Energy',
    description: 'Crude oil, natural gas, gasoline, heating oil, coal, and other energy products',
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
    filter: 'energy',
    examples: ['WTI Crude', 'Brent', 'Natural Gas', 'Gasoline'],
  },
  {
    name: 'Precious & Industrial Metals',
    description: 'Gold, silver, copper, platinum, palladium, and other metals',
    icon: Coins,
    color: 'from-gray-400 to-gray-600',
    filter: 'metals',
    examples: ['Gold', 'Silver', 'Copper', 'Platinum'],
  },
  {
    name: 'Agriculture',
    description: 'Grains, soft commodities, and agricultural products',
    icon: Wheat,
    color: 'from-green-500 to-emerald-600',
    filter: 'agriculture',
    examples: ['Corn', 'Wheat', 'Soybeans', 'Coffee'],
  },
  {
    name: 'Industrial Materials',
    description: 'Steel, lumber, cement, and other industrial commodities',
    icon: BarChart3,
    color: 'from-blue-500 to-indigo-600',
    filter: 'industrial',
    examples: ['Steel HRC', 'Lumber', 'Cement', 'Bitumen'],
  },
  {
    name: 'Livestock & Dairy',
    description: 'Cattle, hogs, milk, and other livestock products',
    icon: Leaf,
    color: 'from-rose-500 to-pink-600',
    filter: 'livestock',
    examples: ['Live Cattle', 'Lean Hogs', 'Milk', 'Eggs'],
  },
  {
    name: 'Commodity Indices',
    description: 'CRB Index, S&P GSCI, and other commodity benchmarks',
    icon: TrendingUp,
    color: 'from-purple-500 to-violet-600',
    filter: 'index',
    examples: ['CRB Index', 'S&P GSCI', 'DBC ETF'],
  },
  {
    name: 'Electricity',
    description: 'Electricity prices by region and country',
    icon: Battery,
    color: 'from-cyan-500 to-teal-600',
    filter: 'electricity',
    examples: ['UK Power', 'German Power', 'PJM', 'ERCOT'],
  },
];

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

// Category Table Component
function CategoryTable({
  title,
  description,
  icon: Icon,
  color,
  data,
  isExpanded = true,
  onToggle,
  searchQuery,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  data: MarketItem[];
  isExpanded?: boolean;
  onToggle?: () => void;
  searchQuery?: string;
}) {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aVal: any = a[sortField as keyof MarketItem];
      let bVal: any = b[sortField as keyof MarketItem];
      
      if (sortField === 'name' || sortField === 'symbol') {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      } else {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }, [filteredData, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const gainers = filteredData.filter(item => item.changePercent > 0).length;
  const losers = filteredData.filter(item => item.changePercent < 0).length;

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div
        className={`p-4 bg-gradient-to-r ${color} cursor-pointer`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">{title}</h3>
              <p className="text-white/80 text-sm hidden md:block">{description}</p>
              <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
                <span>{filteredData.length} items</span>
                <span className="flex items-center gap-1 text-green-200">
                  <ArrowUpRight className="h-3 w-3" />
                  {gainers}
                </span>
                <span className="flex items-center gap-1 text-red-200">
                  <ArrowDownRight className="h-3 w-3" />
                  {losers}
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 bg-white/20 rounded-lg">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-white" />
            ) : (
              <ChevronDown className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScrollArea className="h-[450px]">
              <DataTable>
                <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                  <TableRow>
                    <TableHead className="w-[40px]">#</TableHead>
                    <TableHead className="min-w-[180px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        Name <SortIcon field="name" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('symbol')}>
                      <div className="flex items-center gap-1">
                        Symbol <SortIcon field="symbol" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('price')}>
                      <div className="flex items-center justify-end gap-1">
                        Price <SortIcon field="price" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('changePercent')}>
                      <div className="flex items-center justify-end gap-1">
                        % Chg <SortIcon field="changePercent" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Day Range</TableHead>
                    <TableHead className="text-center w-[100px]">Chart</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                      <TableCell className="text-gray-500 font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.metadata?.exchange || item.description?.split(' ').slice(0, 3).join(' ')}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-medium text-gray-700 dark:text-gray-300">{item.symbol}</TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {item.price < 0.01 ? item.price.toFixed(6) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {item.metadata?.unit && <span className="text-xs text-gray-500 ml-1">{item.metadata.unit}</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={`${getChangeBgColor(item.changePercent)} ${getChangeColor(item.changePercent)} border-0`}>
                          {item.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                          {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {item.dayLow && item.dayHigh ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-red-400">{item.dayLow.toFixed(2)}</span>
                            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-red-400 via-gray-400 to-green-400"
                                style={{ width: `${((item.price - item.dayLow) / (item.dayHigh - item.dayLow)) * 100}%` }}
                              />
                            </div>
                            <span className="text-green-400">{item.dayHigh.toFixed(2)}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="p-1">
                        <div className="w-[80px] h-8">
                          {item.historicalData && item.historicalData.length > 0 && (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={item.historicalData.slice(-14)}>
                                <Area
                                  type="monotone"
                                  dataKey="value"
                                  stroke={item.changePercent >= 0 ? '#22c55e' : '#ef4444'}
                                  strokeWidth={1.5}
                                  fill={item.changePercent >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </DataTable>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// Market Card Component (Grid View)
function MarketCard({ item }: { item: MarketItem }) {
  const isPositive = item.changePercent >= 0;

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white">{item.symbol}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{item.description || `${item.name} market data`}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.name}</p>
          </div>
          <Badge 
            className={`${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'} flex items-center border-0`}
          >
            {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
          </Badge>
        </div>

        <div className="flex items-end gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {item.price < 0.01 ? item.price.toFixed(6) : item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          {item.metadata?.unit && (
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.metadata.unit}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm mb-3">
          <span className={`flex items-center ${getChangeColor(item.changePercent)}`}>
            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {isPositive ? '+' : ''}{item.change.toFixed(2)}
          </span>
          {item.metadata?.exchange && (
            <Badge variant="outline" className="text-xs">
              {item.metadata.exchange}
            </Badge>
          )}
        </div>

        {item.historicalData && item.historicalData.length > 0 && (
          <div className="h-16 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={item.historicalData.slice(-14)}>
                <defs>
                  <linearGradient id={`color-card-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#22c55e' : '#ef4444'}
                  strokeWidth={2}
                  fill={`url(#color-card-${item.id})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CommoditiesClient() {
  const [data, setData] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['energy', 'metals']);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filterParam = selectedCategory !== 'all' ? `&filter=${selectedCategory}` : '';
      const response = await fetch(`/api/trade?category=commodities${filterParam}&limit=500`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setLastUpdated(result.lastUpdated);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchData, autoRefresh]);

  // Group data by category - now uses subCategory from API
  const groupedData = useMemo(() => {
    const grouped: Record<string, MarketItem[]> = {};
    
    commodityCategories.forEach(cat => {
      grouped[cat.filter] = data.filter(item => {
        // Use subCategory field directly from API response
        const itemSubCategory = item.subCategory?.toLowerCase() || item.category?.toLowerCase() || '';
        const filterLower = cat.filter.toLowerCase();
        
        // Direct match on subCategory
        if (itemSubCategory === filterLower) return true;
        
        // Fallback to name matching for backward compatibility
        const itemName = item.name.toLowerCase();
        
        return (cat.filter === 'metals' && (itemName.includes('gold') || itemName.includes('silver') || itemName.includes('copper') || itemName.includes('platinum') || itemName.includes('palladium') || itemName.includes('aluminum') || itemName.includes('nickel') || itemName.includes('zinc') || itemName.includes('lead') || itemName.includes('tin') || itemName.includes('iron') || itemName.includes('lithium') || itemName.includes('cobalt') || itemName.includes('manganese') || itemName.includes('molybdenum') || itemName.includes('titanium') || itemName.includes('chromium') || itemName.includes('magnesium') || itemName.includes('antimony'))) ||
               (cat.filter === 'energy' && (itemName.includes('oil') || itemName.includes('gas') || itemName.includes('crude') || itemName.includes('gasoline') || itemName.includes('heating') || itemName.includes('coal') || itemName.includes('uranium') || itemName.includes('propane') || itemName.includes('ethanol') || itemName.includes('methanol'))) ||
               (cat.filter === 'agriculture' && (itemName.includes('corn') || itemName.includes('wheat') || itemName.includes('soybean') || itemName.includes('coffee') || itemName.includes('sugar') || itemName.includes('cotton') || itemName.includes('cocoa') || itemName.includes('oats') || itemName.includes('rice') || itemName.includes('orange') || itemName.includes('canola') || itemName.includes('palm') || itemName.includes('rubber') || itemName.includes('tea') || itemName.includes('barley') || itemName.includes('sorghum') || itemName.includes('rapeseed') || itemName.includes('sunflower'))) ||
               (cat.filter === 'industrial' && (itemName.includes('steel') || itemName.includes('lumber') || itemName.includes('cement') || itemName.includes('bitumen') || itemName.includes('pulp') || itemName.includes('copper cathode') || itemName.includes('aluminum billet') || itemName.includes('zinc shg') || itemName.includes('nickel cathode') || itemName.includes('tin ingot') || itemName.includes('lead ingot') || itemName.includes('silicon') || itemName.includes('ferro'))) ||
               (cat.filter === 'livestock' && (itemName.includes('cattle') || itemName.includes('hog') || itemName.includes('pork') || itemName.includes('salmon') || itemName.includes('milk') || itemName.includes('butter') || itemName.includes('cheese') || itemName.includes('whey') || itemName.includes('egg'))) ||
               (cat.filter === 'index' && (itemName.includes('crb') || itemName.includes('gsci') || itemName.includes('bloomberg commodity') || itemName.includes('rogers') || itemName.includes('dbc') || itemName.includes('djp') || itemName.includes('solar') || itemName.includes('clean energy') || itemName.includes('uranium index') || itemName.includes('lithium index') || itemName.includes('copper miner') || itemName.includes('gold miner'))) ||
               (cat.filter === 'electricity' && (itemName.includes('electricity') || itemName.includes('power') || itemName.includes('elec') || itemName.includes('uk ') || itemName.includes('germany') || itemName.includes('france') || itemName.includes('italy') || itemName.includes('spain') || itemName.includes('netherlands') || itemName.includes('belgium') || itemName.includes('nordic') || itemName.includes('pjm') || itemName.includes('caiso') || itemName.includes('ercot') || itemName.includes('japan') || itemName.includes('australia')));
      });
    });

    return grouped;
  }, [data]);

  // Calculate market stats
  const marketStats = useMemo(() => {
    const gainers = data.filter(item => item.changePercent > 0).length;
    const losers = data.filter(item => item.changePercent < 0).length;
    const avgChange = data.length > 0
      ? data.reduce((sum, item) => sum + item.changePercent, 0) / data.length
      : 0;

    return { gainers, losers, avgChange, total: data.length };
  }, [data]);

  // Toggle category expansion
  const toggleCategory = (filter: string) => {
    setExpandedCategories(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <Link href="/trade" className="hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Trade
              </Link>
              <span>/</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">Commodities</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Commodities Market
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Real-time prices for energy, metals, agriculture, and industrial commodities
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary" className="text-sm">
                      {marketStats.total} items
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <ArrowUpRight className="h-4 w-4" />
                      {marketStats.gainers} gainers
                    </div>
                    <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <ArrowDownRight className="h-4 w-4" />
                      {marketStats.losers} losers
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={autoRefresh ? 'text-green-600 dark:text-green-400' : ''}
                      >
                        {autoRefresh ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Auto-refresh {autoRefresh ? 'on' : 'off'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-0 shadow bg-white/80 dark:bg-gray-800/80">
                <CardContent className="p-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Energy</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{groupedData['energy']?.length || 0}</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow bg-white/80 dark:bg-gray-800/80">
                <CardContent className="p-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Metals</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{groupedData['metals']?.length || 0}</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow bg-white/80 dark:bg-gray-800/80">
                <CardContent className="p-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Agriculture</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{groupedData['agriculture']?.length || 0}</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow bg-white/80 dark:bg-gray-800/80">
                <CardContent className="p-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Others</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{(groupedData['industrial']?.length || 0) + (groupedData['livestock']?.length || 0) + (groupedData['electricity']?.length || 0)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search commodities by name or symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-800">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {commodityCategories.map((cat) => (
                    <SelectItem key={cat.filter} value={cat.filter}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('cards')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            Last updated: {new Date(lastUpdated).toLocaleString()}
            {autoRefresh && (
              <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
            <CardContent className="p-4 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchData} className="mt-2">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content */}
      <section className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-6">
            {commodityCategories.slice(0, 3).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-16 w-full mb-2" />
                <Skeleton className="h-[450px] w-full" />
              </div>
            ))}
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data
              .filter(item => !searchQuery || 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <MarketCard key={item.id} item={item} />
              ))}
          </div>
        ) : (
          <div className="space-y-6">
            {commodityCategories.map((category) => {
              const categoryData = groupedData[category.filter] || [];
              if (selectedCategory !== 'all' && selectedCategory !== category.filter) return null;
              if (categoryData.length === 0) return null;
              
              return (
                <CategoryTable
                  key={category.filter}
                  title={category.name}
                  description={category.description}
                  icon={category.icon}
                  color={category.color}
                  data={categoryData}
                  isExpanded={expandedCategories.includes(category.filter)}
                  onToggle={() => toggleCategory(category.filter)}
                  searchQuery=""
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Educational Section */}
      <section className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900/50 -mx-0">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Info className="h-6 w-6 text-amber-500" />
                Understanding Commodity Markets
              </CardTitle>
              <CardDescription>
                Learn about different commodity categories and what drives their prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commodityCategories.map((cat) => (
                  <div key={cat.filter} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${cat.color}`}>
                        <cat.icon className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{cat.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {cat.examples.map((ex, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{ex}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 prose dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Factors Affecting Commodity Prices</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Supply & Demand</h5>
                    <ul className="list-disc list-inside space-y-1">
                      <li>OPEC production decisions</li>
                      <li>Crop yields and weather conditions</li>
                      <li>Mining output and discoveries</li>
                      <li>Inventory levels</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Macro Factors</h5>
                    <ul className="list-disc list-inside space-y-1">
                      <li>USD strength (most priced in dollars)</li>
                      <li>Interest rates and inflation</li>
                      <li>Geopolitical events</li>
                      <li>Economic growth indicators</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Categories */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore Other Markets</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Indexes', href: '/trade/indexes' },
            { name: 'Stocks', href: '/trade/shares' },
            { name: 'Currencies', href: '/trade/currencies' },
            { name: 'Crypto', href: '/trade/crypto' },
            { name: 'Bonds', href: '/trade/bonds' },
            { name: 'Freight Index', href: '/trade/freight-index' },
          ].map((cat) => (
            <Button key={cat.name} asChild variant="outline" size="sm">
              <Link href={cat.href}>
                {cat.name}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
