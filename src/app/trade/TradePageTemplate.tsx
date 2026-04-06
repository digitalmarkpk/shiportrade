'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  Filter,
  Search,
  Info,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Landmark,
  DollarSign,
  Ship,
  Calendar,
  Table,
  Grid3X3,
  ScatterChart,
  LineChart,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Download,
  LayoutGrid,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Flame,
  Zap,
  Leaf,
  Wheat,
  Battery,
  Coins,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ScatterChart as RechartsScatterChart,
  Scatter,
  ZAxis,
  Cell,
  Treemap,
} from 'recharts';

// Types
export interface MarketItem {
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

export interface CategoryConfig {
  name: string;
  description: string;
  apiCategory: string;
  iconName: string;
  color: string;
  bgColor?: string;
  textColor?: string;
  filters?: { label: string; value: string }[];
}

// Category groupings for different market types
const categoryGroups: Record<string, { name: string; icon: React.ElementType; color: string; filter: string }[]> = {
  commodities: [
    { name: 'Energy', icon: Zap, color: 'from-yellow-500 to-orange-500', filter: 'energy' },
    { name: 'Metals', icon: Coins, color: 'from-gray-400 to-gray-600', filter: 'metals' },
    { name: 'Agriculture', icon: Wheat, color: 'from-green-500 to-emerald-500', filter: 'agriculture' },
    { name: 'Industrial', icon: BarChart3, color: 'from-blue-500 to-indigo-500', filter: 'industrial' },
    { name: 'Livestock', icon: Leaf, color: 'from-rose-500 to-pink-500', filter: 'livestock' },
    { name: 'Index', icon: TrendingUp, color: 'from-purple-500 to-violet-500', filter: 'index' },
    { name: 'Electricity', icon: Battery, color: 'from-cyan-500 to-teal-500', filter: 'electricity' },
  ],
  indexes: [
    { name: 'Americas', icon: TrendingUp, color: 'from-blue-500 to-indigo-500', filter: 'americas' },
    { name: 'Europe', icon: Landmark, color: 'from-green-500 to-emerald-500', filter: 'europe' },
    { name: 'Asia Pacific', icon: TrendingUp, color: 'from-red-500 to-orange-500', filter: 'asia' },
    { name: 'Oceania', icon: TrendingUp, color: 'from-cyan-500 to-blue-500', filter: 'oceania' },
    { name: 'Africa', icon: TrendingUp, color: 'from-yellow-500 to-amber-500', filter: 'africa' },
    { name: 'Middle East', icon: TrendingUp, color: 'from-emerald-500 to-teal-500', filter: 'middleEast' },
  ],
  shares: [
    { name: 'Technology', icon: Zap, color: 'from-blue-500 to-indigo-500', filter: 'technology' },
    { name: 'Healthcare', icon: Leaf, color: 'from-green-500 to-emerald-500', filter: 'healthcare' },
    { name: 'Financial', icon: DollarSign, color: 'from-yellow-500 to-orange-500', filter: 'financial' },
    { name: 'Energy', icon: Flame, color: 'from-red-500 to-orange-500', filter: 'energy' },
    { name: 'Consumer', icon: BarChart3, color: 'from-purple-500 to-pink-500', filter: 'consumer' },
    { name: 'Industrial', icon: BarChart3, color: 'from-gray-500 to-slate-500', filter: 'industrial' },
  ],
  currencies: [
    { name: 'Major Pairs', icon: DollarSign, color: 'from-green-500 to-emerald-500', filter: 'major' },
    { name: 'Cross Pairs', icon: TrendingUp, color: 'from-blue-500 to-indigo-500', filter: 'cross' },
    { name: 'Emerging Markets', icon: Landmark, color: 'from-orange-500 to-amber-500', filter: 'emerging' },
  ],
  freight: [
    { name: 'Dry Bulk', icon: Ship, color: 'from-blue-500 to-cyan-500', filter: 'Dry Bulk' },
    { name: 'Container', icon: BarChart3, color: 'from-green-500 to-emerald-500', filter: 'Container' },
    { name: 'Tanker', icon: Flame, color: 'from-red-500 to-orange-500', filter: 'Tanker' },
    { name: 'Gas', icon: Zap, color: 'from-yellow-500 to-amber-500', filter: 'Gas' },
    { name: 'Earnings', icon: DollarSign, color: 'from-purple-500 to-violet-500', filter: 'Earnings' },
  ],
};

// Icon map for client component
const iconMap: Record<string, React.ElementType> = {
  BarChart3,
  TrendingUp,
  DollarSign,
  Landmark,
  Ship,
  Calendar,
  Zap,
  Wheat,
  Coins,
  Leaf,
  Flame,
  Battery,
};

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

// Custom Treemap Content
interface TreemapProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  changePercent?: number;
}

const CustomTreemapContent = ({ x = 0, y = 0, width = 0, height = 0, name = '', value = 0, changePercent = 0 }: TreemapProps) => {
  if (width < 50 || height < 30) return null;
  
  const isPositive = changePercent >= 0;
  const bgColor = isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
  const borderColor = isPositive ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)';
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={bgColor}
        stroke={borderColor}
        strokeWidth={1}
        rx={4}
      />
      <text
        x={x + width / 2}
        y={y + height / 2 - 8}
        textAnchor="middle"
        fill="currentColor"
        fontSize={Math.min(width / 8, 12)}
        className="font-medium"
      >
        {name.length > 10 ? `${name.slice(0, 10)}...` : name}
      </text>
      <text
        x={x + width / 2}
        y={y + height / 2 + 8}
        textAnchor="middle"
        fill={isPositive ? '#22c55e' : '#ef4444'}
        fontSize={Math.min(width / 10, 10)}
        className="font-semibold"
      >
        {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
      </text>
    </g>
  );
};

// Shared props type
interface TradePageProps {
  config: CategoryConfig;
}

// View mode type
type ViewMode = 'quotes' | 'treemap' | 'scatter' | 'chart';

// Category Table Component
function CategoryTable({
  title,
  icon: Icon,
  color,
  data,
  isExpanded = true,
  onToggle,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  data: MarketItem[];
  isExpanded?: boolean;
  onToggle?: () => void;
}) {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
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
  }, [data, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  // Calculate stats
  const gainers = data.filter(item => item.changePercent > 0).length;
  const losers = data.filter(item => item.changePercent < 0).length;

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div
        className={`p-4 bg-gradient-to-r ${color} cursor-pointer`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{title}</h3>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <span>{data.length} items</span>
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
            <ScrollArea className="h-[400px]">
              <DataTable>
                <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                  <TableRow>
                    <TableHead className="w-[40px]">#</TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        Name {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('symbol')}>
                      <div className="flex items-center gap-1">
                        Symbol {getSortIcon('symbol')}
                      </div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('price')}>
                      <div className="flex items-center justify-end gap-1">
                        Price {getSortIcon('price')}
                      </div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('changePercent')}>
                      <div className="flex items-center justify-end gap-1">
                        % Chg {getSortIcon('changePercent')}
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
                          {item.metadata?.exchange && (
                            <div className="text-xs text-gray-500">{item.metadata.exchange}</div>
                          )}
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
                          <span>
                            {item.dayLow.toFixed(2)} - {item.dayHigh.toFixed(2)}
                          </span>
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
export function MarketCard({ item, showChart = true }: { item: MarketItem; showChart?: boolean }) {
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
            variant={isPositive ? 'default' : 'destructive'} 
            className={`${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''} flex items-center`}
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

        {showChart && item.historicalData && item.historicalData.length > 0 && (
          <div className="h-20 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={item.historicalData.slice(-14)}>
                <defs>
                  <linearGradient id={`color-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#22c55e' : '#ef4444'}
                  strokeWidth={2}
                  fill={`url(#color-${item.id})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quotes Table Component (All Data)
function QuotesTable({ 
  data, 
  sortField, 
  sortDirection, 
  onSort 
}: { 
  data: MarketItem[]; 
  sortField: string; 
  sortDirection: 'asc' | 'desc'; 
  onSort: (field: string) => void;
}) {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
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
  }, [data, sortField, sortDirection]);

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 overflow-hidden">
      <ScrollArea className="h-[600px]">
        <DataTable>
          <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
            <TableRow>
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead className="min-w-[180px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => onSort('name')}>
                <div className="flex items-center gap-2">
                  Name {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => onSort('symbol')}>
                <div className="flex items-center gap-2">
                  Symbol {renderSortIcon('symbol')}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => onSort('price')}>
                <div className="flex items-center justify-end gap-2">
                  Price {renderSortIcon('price')}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => onSort('change')}>
                <div className="flex items-center justify-end gap-2">
                  Change {renderSortIcon('change')}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => onSort('changePercent')}>
                <div className="flex items-center justify-end gap-2">
                  % Change {renderSortIcon('changePercent')}
                </div>
              </TableHead>
              <TableHead className="text-right">Day Range</TableHead>
              <TableHead className="text-center">Chart</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{item.description || item.metadata?.exchange || ''}</div>
                  </div>
                </TableCell>
                <TableCell className="font-mono font-medium">{item.symbol}</TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {item.price < 0.01 ? item.price.toFixed(6) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className={`text-right font-mono ${getChangeColor(item.change)}`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={`${getChangeBgColor(item.changePercent)} ${getChangeColor(item.changePercent)} border-0`}>
                    {item.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-gray-500">
                  {item.dayLow && item.dayHigh ? (
                    <span>
                      {item.dayLow.toFixed(2)} - {item.dayHigh.toFixed(2)}
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell className="p-2">
                  <div className="w-24 h-10">
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
    </div>
  );
}

// Treemap View Component
function TreemapView({ data }: { data: MarketItem[] }) {
  const treemapData = useMemo(() => {
    return data.map(item => ({
      name: item.symbol,
      size: Math.abs(item.price) * 100 + 1000,
      value: item.price,
      changePercent: item.changePercent,
    }));
  }, [data]);

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 p-4">
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={<CustomTreemapContent />}
          >
            {treemapData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.changePercent >= 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'} />
            ))}
          </Treemap>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50"></div>
          <span className="text-gray-600 dark:text-gray-400">Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500/50"></div>
          <span className="text-gray-600 dark:text-gray-400">Negative</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Size = Price Magnitude</span>
        </div>
      </div>
    </div>
  );
}

// Scatter Plot View Component
function ScatterPlotView({ data }: { data: MarketItem[] }) {
  const scatterData = useMemo(() => {
    return data.map(item => ({
      name: item.symbol,
      x: item.changePercent,
      y: Math.log10(Math.abs(item.price) + 1),
      size: Math.abs(item.changePercent) * 5 + 20,
      price: item.price,
      changePercent: item.changePercent,
    }));
  }, [data]);

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 p-4">
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="% Change" 
              tick={{ fontSize: 12 }}
              label={{ value: '% Change', position: 'bottom', offset: 40 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Log Price" 
              tick={{ fontSize: 12 }}
              label={{ value: 'Log(Price)', angle: -90, position: 'left', offset: 40 }}
            />
            <ZAxis type="number" dataKey="size" range={[20, 200]} name="Size" />
            <RechartsTooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: any, name: string) => {
                if (name === '% Change') return [`${value.toFixed(2)}%`, name];
                if (name === 'Log Price') return [value.toFixed(2), name];
                return [value, name];
              }}
            />
            <Scatter name="Market Data" data={scatterData} fill="#8884d8">
              {scatterData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.changePercent >= 0 ? '#22c55e' : '#ef4444'}
                />
              ))}
            </Scatter>
          </RechartsScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Positive Change</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Negative Change</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Bubble Size = |% Change|</span>
        </div>
      </div>
    </div>
  );
}

// Chart View Component (Overview)
function ChartOverviewView({ data }: { data: MarketItem[] }) {
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  
  // Aggregate market stats
  const stats = useMemo(() => {
    const gainers = data.filter(item => item.changePercent > 0).length;
    const losers = data.filter(item => item.changePercent < 0).length;
    const unchanged = data.filter(item => item.changePercent === 0).length;
    const avgChange = data.reduce((sum, item) => sum + item.changePercent, 0) / data.length;
    const topGainer = data.reduce((max, item) => item.changePercent > max.changePercent ? item : max, data[0]);
    const topLoser = data.reduce((min, item) => item.changePercent < min.changePercent ? item : min, data[0]);
    
    return { gainers, losers, unchanged, avgChange, topGainer, topLoser };
  }, [data]);

  // Top 5 gainers and losers
  const topGainers = useMemo(() => {
    return [...data].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  }, [data]);

  const topLosers = useMemo(() => {
    return [...data].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Market Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow">
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Gainers</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.gainers}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow">
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Losers</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.losers}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow">
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg Change</div>
            <div className={`text-2xl font-bold ${stats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow">
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Items</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Movers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topGainers.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => setSelectedItem(item)}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-4">{index + 1}</span>
                    <div>
                      <div className="font-medium">{item.symbol}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">{item.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      +{item.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLosers.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => setSelectedItem(item)}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-4">{index + 1}</span>
                    <div>
                      <div className="font-medium">{item.symbol}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">{item.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      {item.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Item Detail */}
      {selectedItem && selectedItem.historicalData && (
        <Card className="border-0 shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedItem.name}</CardTitle>
                <CardDescription>{selectedItem.symbol} - Historical Performance</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedItem.historicalData}>
                  <defs>
                    <linearGradient id={`detail-gradient`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedItem.changePercent >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={selectedItem.changePercent >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={selectedItem.changePercent >= 0 ? '#22c55e' : '#ef4444'}
                    strokeWidth={2}
                    fill="url(#detail-gradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Loading Skeleton Grid
export function MarketSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-0 shadow-lg">
          <CardContent className="p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Main Trade Page Template Component
export default function TradePageTemplate({ config }: TradePageProps) {
  const [data, setData] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('quotes');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filterParam = selectedFilter !== 'all' ? `&filter=${selectedFilter}` : '';
      const response = await fetch(`/api/trade?category=${config.apiCategory}${filterParam}&limit=500`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setLastUpdated(result.lastUpdated);
        // Expand first category by default
        const groups = categoryGroups[config.apiCategory];
        if (groups && groups.length > 0) {
          setExpandedCategories([groups[0].filter]);
        }
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config.apiCategory, selectedFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data by search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // Get category groups for current market type
  const currentCategoryGroups = categoryGroups[config.apiCategory] || [];

  // Group data by category
  const groupedData = useMemo(() => {
    const grouped: Record<string, MarketItem[]> = {};
    
    currentCategoryGroups.forEach(cat => {
      grouped[cat.filter] = filteredData.filter(item => {
        // For freight, category is in metadata
        if (config.apiCategory === 'freight') {
          return item.category?.toLowerCase().includes(cat.filter.toLowerCase()) ||
                 item.metadata?.category?.toLowerCase().includes(cat.filter.toLowerCase());
        }
        // For others, check various fields
        return item.name.toLowerCase().includes(cat.filter.toLowerCase()) ||
               item.category?.toLowerCase().includes(cat.filter.toLowerCase()) ||
               item.metadata?.sector?.toLowerCase().includes(cat.filter.toLowerCase()) ||
               item.metadata?.country?.toLowerCase().includes(cat.filter.toLowerCase()) ||
               item.metadata?.baseCurrency?.toLowerCase().includes(cat.filter.toLowerCase());
      });
    });

    // Add uncategorized items
    const categorizedIds = Object.values(grouped).flat().map(i => i.id);
    const uncategorized = filteredData.filter(item => !categorizedIds.includes(item.id));
    if (uncategorized.length > 0) {
      grouped['other'] = uncategorized;
    }

    return grouped;
  }, [filteredData, currentCategoryGroups, config.apiCategory]);

  // Toggle category expansion
  const toggleCategory = (filter: string) => {
    setExpandedCategories(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Handle sort
  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const Icon = iconMap[config.iconName] || BarChart3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <section className={`relative overflow-hidden ${config.bgColor || 'bg-muted/30'}`}>
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
              <span className={`${config.textColor || 'text-foreground'} font-medium`}>{config.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${config.color} shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {config.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {config.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={fetchData} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800"
                />
              </div>
              
              {config.filters && config.filters.length > 0 && (
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-800">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {config.filters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* View Mode Tabs */}
      <section className="container mx-auto px-4 py-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                <span className="hidden sm:inline">Quotes</span>
              </TabsTrigger>
              <TabsTrigger value="treemap" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Treemap</span>
              </TabsTrigger>
              <TabsTrigger value="scatter" className="flex items-center gap-2">
                <ScatterChart className="h-4 w-4" />
                <span className="hidden sm:inline">Scatter</span>
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
            </TabsList>

            {/* Status */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
              <span>{filteredData.length} items</span>
              {lastUpdated && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 mb-6">
              <CardContent className="p-4 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchData} className="mt-2">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <TabsContent value="quotes" className="mt-0">
            {isLoading ? (
              <div className="space-y-6">
                {currentCategoryGroups.map((group, i) => (
                  <div key={i}>
                    <Skeleton className="h-16 w-full mb-2" />
                    <Skeleton className="h-[400px] w-full" />
                  </div>
                ))}
              </div>
            ) : filteredData.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No results found for your search.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Category Tables */}
                {currentCategoryGroups.map((group) => {
                  const categoryData = groupedData[group.filter] || [];
                  if (categoryData.length === 0) return null;
                  
                  return (
                    <CategoryTable
                      key={group.filter}
                      title={group.name}
                      icon={group.icon}
                      color={group.color}
                      data={categoryData}
                      isExpanded={expandedCategories.includes(group.filter)}
                      onToggle={() => toggleCategory(group.filter)}
                    />
                  );
                })}
                
                {/* Uncategorized items */}
                {groupedData['other'] && groupedData['other'].length > 0 && (
                  <CategoryTable
                    title="Other"
                    icon={BarChart3}
                    color="from-gray-500 to-gray-600"
                    data={groupedData['other']}
                    isExpanded={expandedCategories.includes('other')}
                    onToggle={() => toggleCategory('other')}
                  />
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="treemap" className="mt-0">
            {isLoading ? (
              <Skeleton className="h-[600px] w-full" />
            ) : (
              <TreemapView data={filteredData} />
            )}
          </TabsContent>

          <TabsContent value="scatter" className="mt-0">
            {isLoading ? (
              <Skeleton className="h-[600px] w-full" />
            ) : (
              <ScatterPlotView data={filteredData} />
            )}
          </TabsContent>

          <TabsContent value="chart" className="mt-0">
            {isLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-80" />
                  <Skeleton className="h-80" />
                </div>
              </div>
            ) : (
              <ChartOverviewView data={filteredData} />
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Educational Section */}
      <section className="container mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-sky-500" />
              About {config.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <GetEducationalContent category={config.apiCategory} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Related Categories */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore Other Markets</h2>
        <div className="flex flex-wrap gap-2">
          {['commodities', 'indexes', 'shares', 'currencies', 'crypto', 'bonds', 'earnings', 'freight'].map((cat) => (
            cat !== config.apiCategory && (
              <Button key={cat} asChild variant="outline" size="sm">
                <Link href={`/trade/${cat === 'freight' ? 'freight-index' : cat}`}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Link>
              </Button>
            )
          ))}
        </div>
      </section>
    </div>
  );
}

// Educational content component
function GetEducationalContent({ category }: { category: string }) {
  const content: Record<string, React.ReactNode> = {
    commodities: (
      <>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Commodities are raw materials or primary agricultural products that can be bought and sold, 
          such as gold, oil, copper, coffee, and wheat. They are typically traded on commodities exchanges 
          and are an important part of the global economy. Our comprehensive commodities section covers 
          energy products (crude oil, natural gas, gasoline), precious and industrial metals (gold, silver, 
          copper, aluminum), agricultural products (corn, wheat, soybeans, coffee), livestock, and soft commodities.
        </p>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Factors Affecting Commodity Prices:</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Supply and demand dynamics - OPEC decisions, crop yields, mining output</li>
          <li>Weather conditions - droughts, floods, hurricanes affecting agricultural output</li>
          <li>Geopolitical events and conflicts - sanctions, trade wars, political instability</li>
          <li>Currency fluctuations - most commodities priced in USD</li>
          <li>Economic indicators - GDP growth, manufacturing data, consumer demand</li>
        </ul>
      </>
    ),
    indexes: (
      <>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Stock market indexes track the performance of a group of stocks representing a particular market 
          or sector. They serve as benchmarks for portfolio performance and provide insights into overall 
          market sentiment. Major indexes include the S&P 500, Dow Jones Industrial Average, NASDAQ Composite, 
          and international indexes like FTSE 100, DAX, Nikkei 225, and Hang Seng.
        </p>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Understanding Index Composition:</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Price-weighted indexes - Dow Jones, Nikkei 225</li>
          <li>Market-cap weighted indexes - S&P 500, NASDAQ Composite</li>
          <li>Equal-weighted indexes - S&P 500 Equal Weight</li>
          <li>Sector-specific indexes - SOX (Semiconductors), XLE (Energy)</li>
        </ul>
      </>
    ),
    shares: (
      <>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Shares represent ownership in a company. When you buy shares, you become a partial owner 
          and may benefit from the company&apos;s success through capital appreciation and dividends. 
          Our shares section covers major companies across technology, healthcare, financial services, 
          energy, consumer goods, and industrial sectors.
        </p>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Metrics for Stock Analysis:</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Market Capitalization - Total value of outstanding shares</li>
          <li>P/E Ratio - Price relative to earnings per share</li>
          <li>Dividend Yield - Annual dividend as percentage of share price</li>
          <li>Volume - Number of shares traded in a period</li>
          <li>52-Week Range - Highest and lowest prices over past year</li>
        </ul>
      </>
    ),
    currencies: (
      <>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The foreign exchange (Forex) market is the largest financial market in the world, with over 
          $7 trillion traded daily. Currency pairs are quoted in terms of one currency versus another. 
          Major pairs include EUR/USD, GBP/USD, USD/JPY, and USD/CHF. Cross pairs exclude the US dollar, 
          while emerging market pairs involve currencies from developing economies.
        </p>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Factors Influencing Currency Rates:</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Interest rates and central bank policies</li>
          <li>Economic indicators - GDP, inflation, employment data</li>
          <li>Political stability and geopolitical events</li>
          <li>Trade balances and current account deficits</li>
          <li>Market sentiment and risk appetite</li>
        </ul>
      </>
    ),
    crypto: (
      <>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Cryptocurrencies are digital or virtual currencies that use cryptography for security. 
          Bitcoin, created in 2009, was the first decentralized cryptocurrency. Today, thousands of 
          cryptocurrencies exist, including Ethereum, Solana, and many others serving various purposes 
          from smart contracts to decentralized finance (DeFi).
        </p>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Understanding Cryptocurrency Markets:</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Market Cap - Total value of all coins in circulation</li>
          <li>Trading Volume - Amount traded over 24 hours</li>
          <li>Circulating Supply vs Total Supply</li>
          <li>Blockchain technology and consensus mechanisms</li>
          <li>DeFi and NFT ecosystems</li>
        </ul>
      </>
    ),
    bonds: (
      <>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Government bonds are debt securities issued by national governments to support public spending. 
          When you buy a bond, you&apos;re lending money to the government for a fixed period. In return, 
          you receive periodic interest payments and the return of principal at maturity. Key benchmarks 
          include US Treasuries, German Bunds, UK Gilts, and Japanese Government Bonds (JGBs).
        </p>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Understanding Bond Yields:</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Yield Curve - Relationship between yields and maturities</li>
          <li>Inverted Yield Curve - Potential recession indicator</li>
          <li>Credit Ratings - Assessment of default risk</li>
          <li>Duration - Sensitivity to interest rate changes</li>
          <li>Real vs Nominal Yields - Adjusted for inflation</li>
        </ul>
      </>
    ),
    freight: (
      <>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Freight indices track shipping rates for various types of vessels and cargo routes. These 
          indices are crucial indicators of global trade activity and economic health. The Baltic Dry 
          Index (BDI) is the most famous, tracking rates for dry bulk carriers. Container indices track 
          rates for containerized goods on major trade lanes.
        </p>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Freight Indices:</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Baltic Dry Index (BDI) - Dry bulk shipping rates</li>
          <li>FBX Global Container Index - Container shipping rates</li>
          <li>World Container Index (WCI) - Drewry container index</li>
          <li>Shanghai Containerized Freight Index (SCFI)</li>
          <li>Tanker rates for crude oil and refined products</li>
        </ul>
      </>
    ),
  };

  return content[category] || content.commodities;
}
