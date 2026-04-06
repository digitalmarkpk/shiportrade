'use client';

import { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Info,
  BarChart2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MarketItem } from '@/app/trade/TradePageTemplate';

interface QuotesViewProps {
  data: MarketItem[];
  category: string;
}

type SortField = 'name' | 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap';
type SortDirection = 'asc' | 'desc';

export default function QuotesView({ data, category }: QuotesViewProps) {
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSector, setFilterSector] = useState<string>('all');

  // Get unique sectors for filter
  const sectors = useMemo(() => {
    const sectorSet = new Set<string>();
    data.forEach(item => {
      if (item.metadata?.sector) {
        sectorSet.add(item.metadata.sector);
      }
    });
    return Array.from(sectorSet).sort();
  }, [data]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.symbol.toLowerCase().includes(query)
      );
    }

    // Apply sector filter
    if (filterSector !== 'all') {
      filtered = filtered.filter(
        item => item.metadata?.sector === filterSector
      );
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'change':
          aValue = a.change;
          bValue = b.change;
          break;
        case 'changePercent':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case 'volume':
          aValue = a.metadata?.volume || 0;
          bValue = b.metadata?.volume || 0;
          break;
        case 'marketCap':
          aValue = a.metadata?.marketCap || 0;
          bValue = b.metadata?.marketCap || 0;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [data, searchQuery, filterSector, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatPrice = (price: number): string => {
    if (price < 0.001) return price.toFixed(8);
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatMarketCap = (marketCap?: number): string => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume?: number): string => {
    if (!volume) return 'N/A';
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toLocaleString();
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => handleSort(field)}
    >
      {label}
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
      )}
    </Button>
  );

  // Table columns based on category
  const showMarketCap = ['shares', 'crypto'].includes(category);
  const showVolume = ['shares', 'crypto', 'commodities'].includes(category);
  const showUnit = category === 'commodities' || category === 'bonds';

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-sky-500" />
            Quotes View
            <Badge variant="secondary" className="ml-2">
              {filteredData.length} items
            </Badge>
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search name or symbol..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-48"
            />
            {sectors.length > 0 && (
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>
                  <SortButton field="name" label="Symbol" />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">
                  <SortButton field="price" label="Price" />
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="change" label="Change" />
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="changePercent" label="Change %" />
                </TableHead>
                {showVolume && (
                  <TableHead className="text-right">Volume</TableHead>
                )}
                {showMarketCap && (
                  <TableHead className="text-right">
                    <SortButton field="marketCap" label="Market Cap" />
                  </TableHead>
                )}
                {showUnit && (
                  <TableHead>Unit</TableHead>
                )}
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => {
                const isPositive = item.changePercent >= 0;
                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  >
                    <TableCell className="font-medium text-gray-500">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {item.symbol}
                        </span>
                        {item.metadata?.sector && (
                          <Badge variant="outline" className="text-xs">
                            {item.metadata.sector.substring(0, 8)}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-gray-600 dark:text-gray-400 cursor-help">
                              {item.name.length > 25
                                ? `${item.name.substring(0, 25)}...`
                                : item.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{item.name}</p>
                            {item.description && (
                              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                {item.description}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {category === 'bonds' ? (
                        <span>{item.price.toFixed(3)}%</span>
                      ) : (
                        <span>
                          {item.metadata?.currency === 'USD' || !item.metadata?.currency
                            ? '$'
                            : ''}
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span
                        className={
                          isPositive
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }
                      >
                        {isPositive ? '+' : ''}
                        {item.change.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={isPositive ? 'default' : 'destructive'}
                        className={`${isPositive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : ''
                          } flex items-center justify-end ml-auto`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    {showVolume && (
                      <TableCell className="text-right font-mono text-gray-600 dark:text-gray-400">
                        {formatVolume(item.metadata?.volume)}
                      </TableCell>
                    )}
                    {showMarketCap && (
                      <TableCell className="text-right font-mono text-gray-600 dark:text-gray-400">
                        {formatMarketCap(item.metadata?.marketCap)}
                      </TableCell>
                    )}
                    {showUnit && (
                      <TableCell className="text-gray-500 text-sm">
                        {item.metadata?.unit || 'N/A'}
                      </TableCell>
                    )}
                    <TableCell className="text-center">
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
