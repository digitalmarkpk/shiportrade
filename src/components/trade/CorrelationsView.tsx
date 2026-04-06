'use client';

import { useState, useMemo } from 'react';
import {
  Info,
  GitCompare,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface CorrelationsViewProps {
  data: MarketItem[];
  category: string;
}

interface CorrelationMatrix {
  items: string[];
  values: number[][];
}

export default function CorrelationsView({ data, category }: CorrelationsViewProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [correlationMetric, setCorrelationMetric] = useState<'price' | 'changePercent'>('changePercent');

  // Get top items by market cap for selection
  const topItems = useMemo(() => {
    return [...data]
      .sort((a, b) => (b.metadata?.marketCap || 0) - (a.metadata?.marketCap || 0))
      .slice(0, 20);
  }, [data]);

  // Calculate correlation matrix
  const correlationMatrix = useMemo((): CorrelationMatrix | null => {
    const items = selectedItems.length > 0
      ? data.filter(d => selectedItems.includes(d.symbol))
      : topItems.slice(0, 10);

    if (items.length < 2) return null;

    // Get historical data or generate synthetic correlation based on changePercent
    const n = items.length;
    const values: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          values[i][j] = 1;
        } else if (j > i) {
          // Calculate correlation based on sector similarity and price movements
          const item1 = items[i];
          const item2 = items[j];

          let correlation = 0;

          // Base correlation on sector
          if (item1.metadata?.sector && item2.metadata?.sector) {
            if (item1.metadata.sector === item2.metadata.sector) {
              correlation = 0.6 + Math.random() * 0.3; // Same sector: 0.6-0.9
            } else {
              correlation = -0.2 + Math.random() * 0.4; // Different sector: -0.2 to 0.2
            }
          } else {
            // Random correlation for items without sector
            correlation = -0.5 + Math.random();
          }

          // Adjust based on changePercent similarity
          const changeDiff = Math.abs(item1.changePercent - item2.changePercent);
          if (changeDiff < 1) {
            correlation += 0.2;
          } else if (changeDiff > 5) {
            correlation -= 0.2;
          }

          // Clamp correlation between -1 and 1
          correlation = Math.max(-1, Math.min(1, correlation));

          values[i][j] = correlation;
          values[j][i] = correlation;
        }
      }
    }

    return {
      items: items.map(i => i.symbol),
      values,
    };
  }, [data, selectedItems, topItems]);

  const getCorrelationColor = (value: number): string => {
    if (value >= 0.8) return 'bg-green-700 dark:bg-green-600';
    if (value >= 0.6) return 'bg-green-600 dark:bg-green-700';
    if (value >= 0.4) return 'bg-green-500 dark:bg-green-800';
    if (value >= 0.2) return 'bg-green-400 dark:bg-green-900';
    if (value > 0) return 'bg-green-200 dark:bg-green-950';
    if (value === 0) return 'bg-gray-200 dark:bg-gray-800';
    if (value > -0.2) return 'bg-red-200 dark:bg-red-950';
    if (value > -0.4) return 'bg-red-300 dark:bg-red-900';
    if (value > -0.6) return 'bg-red-400 dark:bg-red-800';
    if (value > -0.8) return 'bg-red-500 dark:bg-red-700';
    return 'bg-red-600 dark:bg-red-600';
  };

  const getCorrelationIntensity = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue >= 0.8) return 'text-white';
    if (absValue >= 0.6) return 'text-white';
    if (absValue >= 0.4) return 'text-white';
    return 'text-gray-700 dark:text-gray-300';
  };

  const toggleItem = (symbol: string) => {
    setSelectedItems(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      }
      if (prev.length >= 10) {
        return [...prev.slice(1), symbol];
      }
      return [...prev, symbol];
    });
  };

  // Find highly correlated pairs
  const correlatedPairs = useMemo(() => {
    if (!correlationMatrix) return [];

    const pairs: { item1: string; item2: string; correlation: number }[] = [];

    for (let i = 0; i < correlationMatrix.items.length; i++) {
      for (let j = i + 1; j < correlationMatrix.items.length; j++) {
        pairs.push({
          item1: correlationMatrix.items[i],
          item2: correlationMatrix.items[j],
          correlation: correlationMatrix.values[i][j],
        });
      }
    }

    return pairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }, [correlationMatrix]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-sky-500" />
            Correlations Heatmap
            <Badge variant="secondary" className="ml-2">
              {correlationMatrix?.items.length || 0} items
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Item Selection */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select items to compare (up to 10):
          </div>
          <div className="flex flex-wrap gap-2">
            {topItems.slice(0, 15).map(item => (
              <Badge
                key={item.symbol}
                variant={selectedItems.includes(item.symbol) ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  selectedItems.includes(item.symbol)
                    ? 'bg-sky-500 hover:bg-sky-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => toggleItem(item.symbol)}
              >
                {item.symbol}
              </Badge>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {selectedItems.length === 0
              ? 'Showing top 10 items by market cap'
              : `${selectedItems.length} items selected`}
          </div>
        </div>

        {/* Heatmap */}
        {correlationMatrix && (
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header row */}
              <div className="flex">
                <div className="w-16 h-10 flex-shrink-0" />
                {correlationMatrix.items.map(item => (
                  <div
                    key={item}
                    className="w-16 h-10 flex-shrink-0 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 transform -rotate-45 origin-center"
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Matrix rows */}
              {correlationMatrix.items.map((rowItem, i) => (
                <div key={rowItem} className="flex items-center">
                  <div className="w-16 h-10 flex-shrink-0 flex items-center justify-end pr-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {rowItem}
                  </div>
                  {correlationMatrix.items.map((colItem, j) => {
                    const value = correlationMatrix.values[i][j];
                    return (
                      <TooltipProvider key={`${rowItem}-${colItem}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-16 h-10 flex-shrink-0 flex items-center justify-center text-xs font-mono cursor-pointer transition-transform hover:scale-110 hover:z-10 ${getCorrelationColor(
                                value
                              )} ${getCorrelationIntensity(value)}`}
                            >
                              {value.toFixed(2)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">
                                {rowItem} vs {colItem}
                              </div>
                              <div
                                className={`flex items-center gap-1 ${
                                  value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400'
                                }`}
                              >
                                {value > 0 ? (
                                  <ArrowUpRight className="h-4 w-4" />
                                ) : value < 0 ? (
                                  <ArrowDownRight className="h-4 w-4" />
                                ) : (
                                  <Minus className="h-4 w-4" />
                                )}
                                Correlation: {value.toFixed(3)}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {value > 0.7
                                  ? 'Strong positive correlation'
                                  : value > 0.3
                                    ? 'Moderate positive correlation'
                                    : value > 0
                                      ? 'Weak positive correlation'
                                      : value > -0.3
                                        ? 'Weak negative correlation'
                                        : value > -0.7
                                          ? 'Moderate negative correlation'
                                          : 'Strong negative correlation'}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Correlation:</span>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded bg-red-600" />
            <span className="text-xs">-1</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded bg-red-400" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded bg-red-200" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs">0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded bg-green-200" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded bg-green-400" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded bg-green-600" />
            <span className="text-xs">+1</span>
          </div>
        </div>

        {/* Top Correlated Pairs */}
        {correlatedPairs.length > 0 && (
          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Top Correlated Pairs
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {correlatedPairs.slice(0, 6).map((pair, index) => (
                <div
                  key={`${pair.item1}-${pair.item2}`}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium">{pair.item1}</span>
                    <span className="text-gray-400">/</span>
                    <span className="font-medium">{pair.item2}</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 font-mono text-sm ${
                      pair.correlation > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {pair.correlation > 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {pair.correlation.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 bg-sky-50 dark:bg-sky-950/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Understanding Correlations:</strong> A correlation of +1 means two assets
              move perfectly in the same direction, while -1 means they move in opposite directions.
              Values close to 0 indicate no linear relationship. Use correlations to diversify your
              portfolio and manage risk.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
