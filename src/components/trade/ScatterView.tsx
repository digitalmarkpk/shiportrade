'use client';

import { useState, useMemo } from 'react';
import {
  Info,
  ScatterChart as ScatterIcon,
  TrendingUp,
  TrendingDown,
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
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts';
import { MarketItem } from '@/app/trade/TradePageTemplate';

interface ScatterViewProps {
  data: MarketItem[];
  category: string;
}

type XAxisMetric = 'marketCap' | 'volume' | 'price' | 'volatility';
type YAxisMetric = 'changePercent' | 'change' | 'price';

const metricLabels: Record<string, string> = {
  marketCap: 'Market Cap',
  volume: 'Volume',
  price: 'Price',
  volatility: 'Volatility',
  changePercent: 'Change %',
  change: 'Change',
};

export default function ScatterView({ data, category }: ScatterViewProps) {
  const [xAxisMetric, setXAxisMetric] = useState<XAxisMetric>('marketCap');
  const [yAxisMetric, setYAxisMetric] = useState<YAxisMetric>('changePercent');

  // Prepare scatter data
  const scatterData = useMemo(() => {
    return data
      .filter(item => {
        const xValue = getXValue(item, xAxisMetric);
        const yValue = getYValue(item, yAxisMetric);
        return xValue !== null && yValue !== null && xValue > 0;
      })
      .map(item => {
        const xValue = getXValue(item, xAxisMetric);
        const yValue = getYValue(item, yAxisMetric);
        return {
          ...item,
          x: xValue,
          y: yValue,
        };
      });
  }, [data, xAxisMetric, yAxisMetric]);

  function getXValue(item: MarketItem, metric: XAxisMetric): number | null {
    switch (metric) {
      case 'marketCap':
        return item.metadata?.marketCap || null;
      case 'volume':
        return item.metadata?.volume || null;
      case 'price':
        return item.price;
      case 'volatility':
        return Math.abs(item.changePercent);
      default:
        return null;
    }
  }

  function getYValue(item: MarketItem, metric: YAxisMetric): number | null {
    switch (metric) {
      case 'changePercent':
        return item.changePercent;
      case 'change':
        return item.change;
      case 'price':
        return item.price;
      default:
        return null;
    }
  }

  const formatValue = (value: number, metric: string): string => {
    if (metric === 'marketCap' || metric === 'volume') {
      if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
      if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    }
    if (metric === 'changePercent' || metric === 'change') {
      return value.toFixed(2);
    }
    return value.toLocaleString();
  };

  const getPointColor = (changePercent: number): string => {
    if (changePercent >= 5) return '#16a34a';
    if (changePercent >= 2) return '#22c55e';
    if (changePercent >= 0) return '#86efac';
    if (changePercent >= -2) return '#fca5a5';
    if (changePercent >= -5) return '#ef4444';
    return '#dc2626';
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (scatterData.length === 0) return null;

    const xValues = scatterData.map(d => d.x as number);
    const yValues = scatterData.map(d => d.y as number);

    const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length;
    const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;

    // Calculate correlation
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    scatterData.forEach(d => {
      const x = d.x as number;
      const y = d.y as number;
      sumXY += (x - xMean) * (y - yMean);
      sumX2 += Math.pow(x - xMean, 2);
      sumY2 += Math.pow(y - yMean, 2);
    });

    const correlation = sumX2 > 0 && sumY2 > 0 ? sumXY / Math.sqrt(sumX2 * sumY2) : 0;

    // Find outliers (> 2 standard deviations)
    const xStd = Math.sqrt(sumX2 / xValues.length);
    const yStd = Math.sqrt(sumY2 / yValues.length);

    const outliers = scatterData.filter(d => {
      const x = d.x as number;
      const y = d.y as number;
      return Math.abs(x - xMean) > 2 * xStd || Math.abs(y - yMean) > 2 * yStd;
    });

    return {
      correlation,
      xMean,
      yMean,
      xStd,
      yStd,
      outliers,
      positiveCount: scatterData.filter(d => (d.y as number) > 0).length,
      negativeCount: scatterData.filter(d => (d.y as number) < 0).length,
    };
  }, [scatterData]);

  // Quadrant analysis
  const quadrants = useMemo(() => {
    if (!stats || scatterData.length === 0) return null;

    const xMedian = [...scatterData].sort((a, b) => (a.x as number) - (b.x as number))[
      Math.floor(scatterData.length / 2)
    ]?.x || 0;
    const yMedian = 0; // Use 0 as the y-axis split point

    return {
      q1: scatterData.filter(d => (d.x as number) > xMedian && (d.y as number) > yMedian).length,
      q2: scatterData.filter(d => (d.x as number) <= xMedian && (d.y as number) > yMedian).length,
      q3: scatterData.filter(d => (d.x as number) <= xMedian && (d.y as number) <= yMedian).length,
      q4: scatterData.filter(d => (d.x as number) > xMedian && (d.y as number) <= yMedian).length,
      xMedian,
    };
  }, [stats, scatterData]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <ScatterIcon className="h-5 w-5 text-sky-500" />
            Scatter Plot View
            <Badge variant="secondary" className="ml-2">
              {scatterData.length} items
            </Badge>
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">X:</span>
              <Select value={xAxisMetric} onValueChange={(v) => setXAxisMetric(v as XAxisMetric)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="volatility">Volatility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Y:</span>
              <Select value={yAxisMetric} onValueChange={(v) => setYAxisMetric(v as YAxisMetric)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="changePercent">Change %</SelectItem>
                  <SelectItem value="change">Change</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Scatter Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                dataKey="x"
                name={metricLabels[xAxisMetric]}
                tickFormatter={(value) => formatValue(value, xAxisMetric)}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              >
                <Label
                  value={metricLabels[xAxisMetric]}
                  position="bottom"
                  offset={40}
                  style={{ fontSize: 12, fill: '#6b7280' }}
                />
              </XAxis>
              <YAxis
                type="number"
                dataKey="y"
                name={metricLabels[yAxisMetric]}
                tickFormatter={(value) => formatValue(value, yAxisMetric)}
                tick={{ fontSize: 12 }}
              >
                <Label
                  value={metricLabels[yAxisMetric]}
                  angle={-90}
                  position="left"
                  offset={40}
                  style={{ fontSize: 12, fill: '#6b7280' }}
                />
              </YAxis>
              <RechartsTooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  formatValue(value, name === 'x' ? xAxisMetric : yAxisMetric),
                  name === 'x' ? metricLabels[xAxisMetric] : metricLabels[yAxisMetric],
                ]}
                labelFormatter={(label) => {
                  const item = scatterData.find(d => d.x === label);
                  return item ? `${item.symbol} - ${item.name}` : '';
                }}
              />
              <Scatter name="Assets" data={scatterData} fill="#0ea5e9">
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getPointColor(entry.changePercent)}
                    r={Math.max(4, Math.min(12, Math.log10((entry.metadata?.marketCap || 1000000) / 1000000) * 3))}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-sky-500">
                {stats.correlation.toFixed(3)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Correlation
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-500 flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {stats.positiveCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Gainers
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-500 flex items-center justify-center gap-1">
                <TrendingDown className="h-4 w-4" />
                {stats.negativeCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Losers
              </div>
            </div>
            {quadrants && (
              <>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-emerald-500">
                    {quadrants.q1}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Large + Up
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-amber-500">
                    {quadrants.q2}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Small + Up
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-rose-500">
                    {quadrants.q3 + quadrants.q4}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Down
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Color by Performance:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Positive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Negative</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600 dark:text-gray-400">Size by Market Cap</span>
        </div>

        {/* Interpretation */}
        {stats && (
          <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-950/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Interpretation:</strong>{' '}
                {stats.correlation > 0.3 ? (
                  <>There is a positive correlation between {metricLabels[xAxisMetric].toLowerCase()} and {metricLabels[yAxisMetric].toLowerCase()}, suggesting that higher {metricLabels[xAxisMetric].toLowerCase()} tends to associate with better performance.</>
                ) : stats.correlation < -0.3 ? (
                  <>There is a negative correlation between {metricLabels[xAxisMetric].toLowerCase()} and {metricLabels[yAxisMetric].toLowerCase()}, suggesting that higher {metricLabels[xAxisMetric].toLowerCase()} tends to associate with lower performance.</>
                ) : (
                  <>There is a weak correlation between {metricLabels[xAxisMetric].toLowerCase()} and {metricLabels[yAxisMetric].toLowerCase()}, indicating no strong linear relationship.</>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
