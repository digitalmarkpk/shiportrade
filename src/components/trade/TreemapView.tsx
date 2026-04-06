'use client';

import { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Maximize2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MarketItem } from '@/app/trade/TradePageTemplate';

interface TreemapViewProps {
  data: MarketItem[];
  category: string;
}

interface TreemapNode {
  id: string;
  name: string;
  symbol: string;
  value: number;
  changePercent: number;
  price: number;
  marketCap?: number;
  sector?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Simple treemap layout algorithm (squarified approximation)
function calculateTreemapLayout(
  items: { value: number }[],
  width: number,
  height: number
): { x: number; y: number; width: number; height: number }[] {
  const result: { x: number; y: number; width: number; height: number }[] = [];
  let currentX = 0;
  let currentY = 0;
  let remainingWidth = width;
  let remainingHeight = height;

  const total = items.reduce((sum, item) => sum + item.value, 0);

  // Simple row-based layout
  const aspectRatio = width / height;
  let row: { value: number; index: number }[] = [];
  let rowValue = 0;

  items.forEach((item, index) => {
    row.push({ value: item.value, index });
    rowValue += item.value;

    // Check if we should break the row
    const rowWidth = remainingWidth;
    const rowHeight = (rowValue / total) * remainingHeight;
    const currentAspectRatio = Math.max(
      ...row.map(r => Math.max(rowWidth / ((r.value / rowValue) * rowHeight), ((r.value / rowValue) * rowHeight) / rowWidth))
    );

    if (row.length > 1 && currentAspectRatio > aspectRatio * 2) {
      // Finalize current row and start new one
      row.pop();
      rowValue -= item.value;

      // Layout the row
      let xOffset = currentX;
      const rowHeightFinal = (rowValue / total) * remainingHeight;
      row.forEach(r => {
        const itemWidth = (r.value / rowValue) * remainingWidth;
        result[r.index] = {
          x: xOffset,
          y: currentY,
          width: itemWidth,
          height: rowHeightFinal,
        };
        xOffset += itemWidth;
      });

      currentY += rowHeightFinal;
      remainingHeight -= rowHeightFinal;
      row = [{ value: item.value, index }];
      rowValue = item.value;
    }
  });

  // Layout remaining row
  let xOffset = currentX;
  const finalRowHeight = remainingHeight;
  row.forEach(r => {
    const itemWidth = (r.value / rowValue) * remainingWidth;
    result[r.index] = {
      x: xOffset,
      y: currentY,
      width: itemWidth,
      height: finalRowHeight,
    };
    xOffset += itemWidth;
  });

  return result;
}

export default function TreemapView({ data, category }: TreemapViewProps) {
  const [hoveredItem, setHoveredItem] = useState<MarketItem | null>(null);
  const [selectedSector, setSelectedSector] = useState<string>('all');

  // Get unique sectors
  const sectors = useMemo(() => {
    const sectorSet = new Set<string>();
    data.forEach(item => {
      if (item.metadata?.sector) {
        sectorSet.add(item.metadata.sector);
      }
    });
    return Array.from(sectorSet).sort();
  }, [data]);

  // Filter and prepare data for treemap
  const treemapData = useMemo(() => {
    let filtered = data;
    if (selectedSector !== 'all') {
      filtered = data.filter(item => item.metadata?.sector === selectedSector);
    }

    // Sort by market cap or use price as fallback
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a.metadata?.marketCap || a.price * 1000000;
      const bValue = b.metadata?.marketCap || b.price * 1000000;
      return bValue - aValue;
    });

    // Take top items
    const topItems = sorted.slice(0, 30);

    // Calculate values for sizing
    const totalValue = topItems.reduce(
      (sum, item) => sum + (item.metadata?.marketCap || item.price * 1000000),
      0
    );

    // Calculate treemap layout
    const containerWidth = 100; // Percentage-based
    const containerHeight = 100;

    const layouts = calculateTreemapLayout(
      topItems.map(item => ({
        value: (item.metadata?.marketCap || item.price * 1000000) / totalValue,
      })),
      containerWidth,
      containerHeight
    );

    return topItems.map((item, index) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      value: item.metadata?.marketCap || item.price * 1000000,
      changePercent: item.changePercent,
      price: item.price,
      marketCap: item.metadata?.marketCap,
      sector: item.metadata?.sector,
      x: layouts[index]?.x || 0,
      y: layouts[index]?.y || 0,
      width: layouts[index]?.width || 0,
      height: layouts[index]?.height || 0,
    }));
  }, [data, selectedSector]);

  const formatMarketCap = (marketCap?: number): string => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const getColor = (changePercent: number): string => {
    if (changePercent >= 5) return 'bg-green-600 dark:bg-green-500';
    if (changePercent >= 2) return 'bg-green-500 dark:bg-green-600';
    if (changePercent >= 0) return 'bg-green-400 dark:bg-green-700';
    if (changePercent >= -2) return 'bg-red-400 dark:bg-red-700';
    if (changePercent >= -5) return 'bg-red-500 dark:bg-red-600';
    return 'bg-red-600 dark:bg-red-500';
  };

  const getBorderColor = (changePercent: number): string => {
    if (changePercent >= 0) return 'border-green-300 dark:border-green-600';
    return 'border-red-300 dark:border-red-600';
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Maximize2 className="h-5 w-5 text-sky-500" />
            Treemap View
            <Badge variant="secondary" className="ml-2">
              Size by Market Cap
            </Badge>
          </CardTitle>
          {sectors.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedSector === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSector('all')}
              >
                All
              </Button>
              {sectors.slice(0, 6).map(sector => (
                <Button
                  key={sector}
                  variant={selectedSector === sector ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSector(sector)}
                >
                  {sector.length > 10 ? `${sector.substring(0, 10)}...` : sector}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Treemap Container */}
        <div className="relative w-full h-[500px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          {treemapData.map(item => {
            const isPositive = item.changePercent >= 0;
            const showText = item.width > 8 && item.height > 8;

            return (
              <TooltipProvider key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`absolute border ${getColor(item.changePercent)} ${getBorderColor(item.changePercent)} 
                        transition-all duration-200 hover:z-10 hover:scale-[1.02] cursor-pointer
                        flex flex-col justify-center items-center p-1`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: `${item.width}%`,
                        height: `${item.height}%`,
                      }}
                      onMouseEnter={() => setHoveredItem(data.find(d => d.id === item.id) || null)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {showText && (
                        <>
                          <span className="font-bold text-white text-xs md:text-sm text-center truncate w-full px-1">
                            {item.symbol}
                          </span>
                          {item.width > 10 && item.height > 10 && (
                            <span className="text-white/90 text-xs text-center">
                              {isPositive ? '+' : ''}{item.changePercent.toFixed(1)}%
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-1">
                      <div className="font-bold">{item.symbol}</div>
                      <div className="text-sm text-gray-400">{item.name}</div>
                      <div className="flex justify-between gap-4">
                        <span>Price:</span>
                        <span className="font-mono">${item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Change:</span>
                        <span className={`font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      {item.marketCap && (
                        <div className="flex justify-between gap-4">
                          <span>Market Cap:</span>
                          <span className="font-mono">{formatMarketCap(item.marketCap)}</span>
                        </div>
                      )}
                      {item.sector && (
                        <Badge variant="outline" className="mt-1">
                          {item.sector}
                        </Badge>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">Performance:</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-600" />
            <span>+5%+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span>+2% to +5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-400" />
            <span>0% to +2%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-400" />
            <span>0% to -2%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span>-2% to -5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-600" />
            <span>-5%+</span>
          </div>
        </div>

        {/* Quick Stats */}
        {treemapData.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-500">
                {treemapData.filter(i => i.changePercent > 0).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Gainers
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-500">
                {treemapData.filter(i => i.changePercent < 0).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <TrendingDown className="h-4 w-4" />
                Losers
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-sky-500">
                {treemapData.length > 0
                  ? (
                      treemapData.reduce((sum, i) => sum + i.changePercent, 0) /
                      treemapData.length
                    ).toFixed(2)
                  : '0.00'}
                %
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg Change
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-500">
                {formatMarketCap(treemapData.reduce((sum, i) => sum + (i.marketCap || 0), 0))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Market Cap
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
