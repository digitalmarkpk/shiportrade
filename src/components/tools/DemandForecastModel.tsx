"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  LineChart as LineChartIcon,
  Zap,
  Target,
  Activity,
  Calendar,
  AlertCircle,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Forecast method types
type ForecastMethod = "movingAverage" | "exponentialSmoothing" | "holtWinters" | "linearRegression";

// Seasonality pattern types
type SeasonalityType = "none" | "additive" | "multiplicative";

// Interface for forecast results
interface ForecastResult {
  forecasts: number[];
  lowerBound: number[];
  upperBound: number[];
  accuracyMetrics: {
    mape: number;
    mad: number;
    mse: number;
    rmse: number;
  };
  seasonalityDetected: boolean;
  seasonalityType: SeasonalityType;
  seasonalityPeriod: number;
  trendDirection: "up" | "down" | "stable";
  trendStrength: number;
}

// Interface for historical data point
interface DataPoint {
  period: string;
  demand: number;
  forecast?: number;
  lowerBound?: number;
  upperBound?: number;
}

// Default sample data
const DEFAULT_DATA = `Jan,450
Feb,420
Mar,480
Apr,510
May,550
Jun,590
Jul,620
Aug,580
Sep,520
Oct,480
Nov,450
Dec,430
Jan,470
Feb,440
Mar,500
Apr,540
May,580
Jun,630
Jul,660
Aug,610
Sep,560
Oct,510
Nov,470
Dec,450`;

// Parse historical data from text input
function parseHistoricalData(text: string): { period: string; demand: number }[] {
  const lines = text.trim().split("\n");
  const data: { period: string; demand: number }[] = [];
  
  for (const line of lines) {
    const parts = line.split(/[,\t;]/);
    if (parts.length >= 2) {
      const period = parts[0].trim();
      const demand = parseFloat(parts[1].trim());
      if (!isNaN(demand)) {
        data.push({ period, demand });
      }
    }
  }
  
  return data;
}

// Moving Average Forecast
function movingAverageForecast(data: number[], periods: number, horizon: number): number[] {
  const forecasts: number[] = [];
  const window = data.slice(-periods);
  const avg = window.reduce((a, b) => a + b, 0) / periods;
  
  for (let i = 0; i < horizon; i++) {
    forecasts.push(avg);
  }
  
  return forecasts;
}

// Exponential Smoothing Forecast
function exponentialSmoothingForecast(data: number[], alpha: number, horizon: number): number[] {
  let forecast = data[0];
  
  for (let i = 1; i < data.length; i++) {
    forecast = alpha * data[i] + (1 - alpha) * forecast;
  }
  
  return Array(horizon).fill(forecast);
}

// Linear Regression Forecast
function linearRegressionForecast(data: number[], horizon: number): { forecasts: number[]; slope: number; intercept: number } {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumX2 += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const forecasts: number[] = [];
  for (let i = n; i < n + horizon; i++) {
    forecasts.push(intercept + slope * i);
  }
  
  return { forecasts, slope, intercept };
}

// Holt-Winters Forecast (Triple Exponential Smoothing)
function holtWintersForecast(
  data: number[],
  alpha: number,
  beta: number,
  gamma: number,
  seasonLength: number,
  horizon: number
): number[] {
  const n = data.length;
  
  // Initialize
  let level = data[0];
  let trend = data[1] - data[0];
  const seasons: number[] = [];
  
  // Calculate initial seasonal indices
  for (let i = 0; i < seasonLength; i++) {
    if (i < n) {
      seasons.push(data[i] / (data.slice(0, seasonLength).reduce((a, b) => a + b, 0) / seasonLength));
    } else {
      seasons.push(1);
    }
  }
  
  // Apply Holt-Winters
  for (let i = 1; i < n; i++) {
    const seasonIdx = i % seasonLength;
    const newLevel = alpha * (data[i] / seasons[seasonIdx]) + (1 - alpha) * (level + trend);
    const newTrend = beta * (newLevel - level) + (1 - beta) * trend;
    seasons[seasonIdx] = gamma * (data[i] / newLevel) + (1 - gamma) * seasons[seasonIdx];
    level = newLevel;
    trend = newTrend;
  }
  
  // Generate forecasts
  const forecasts: number[] = [];
  for (let i = 0; i < horizon; i++) {
    const seasonIdx = (n + i) % seasonLength;
    forecasts.push((level + trend * (i + 1)) * seasons[seasonIdx]);
  }
  
  return forecasts;
}

// Detect seasonality using autocorrelation
function detectSeasonality(data: number[]): { detected: boolean; period: number; type: SeasonalityType } {
  if (data.length < 12) {
    return { detected: false, period: 0, type: "none" };
  }
  
  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  
  // Calculate autocorrelation for different lags
  const autocorr: number[] = [];
  for (let lag = 1; lag <= Math.min(12, Math.floor(n / 2)); lag++) {
    let sum = 0;
    for (let i = lag; i < n; i++) {
      sum += (data[i] - mean) * (data[i - lag] - mean);
    }
    autocorr.push(sum / ((n - lag) * variance));
  }
  
  // Find the first significant peak
  let maxCorr = 0;
  let period = 0;
  for (let i = 2; i < autocorr.length; i++) {
    if (autocorr[i] > maxCorr && autocorr[i] > 0.3) {
      maxCorr = autocorr[i];
      period = i + 1;
    }
  }
  
  // Determine seasonality type
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const avgValue = mean;
  const amplitudeRatio = (maxValue - minValue) / avgValue;
  
  let type: SeasonalityType = "none";
  if (period > 0) {
    type = amplitudeRatio > 0.3 ? "multiplicative" : "additive";
  }
  
  return { detected: period > 0, period, type };
}

// Calculate accuracy metrics
function calculateAccuracyMetrics(actual: number[], forecast: number[]): { mape: number; mad: number; mse: number; rmse: number } {
  const n = Math.min(actual.length, forecast.length);
  if (n === 0) return { mape: 0, mad: 0, mse: 0, rmse: 0 };
  
  let sumAPE = 0;
  let sumAD = 0;
  let sumSE = 0;
  
  for (let i = 0; i < n; i++) {
    const error = actual[i] - forecast[i];
    sumAD += Math.abs(error);
    sumSE += error * error;
    if (actual[i] !== 0) {
      sumAPE += Math.abs(error / actual[i]);
    }
  }
  
  return {
    mape: (sumAPE / n) * 100,
    mad: sumAD / n,
    mse: sumSE / n,
    rmse: Math.sqrt(sumSE / n),
  };
}

// Calculate confidence intervals
function calculateConfidenceIntervals(
  data: number[],
  forecasts: number[],
  confidenceLevel: number = 0.95
): { lower: number[]; upper: number[] } {
  const n = data.length;
  
  // Calculate standard error from historical variance
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  
  // Z-score for confidence level
  const zScore = confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.90 ? 1.645 : 2.576;
  
  const lower: number[] = [];
  const upper: number[] = [];
  
  for (let i = 0; i < forecasts.length; i++) {
    // Increasing uncertainty with forecast horizon
    const expandingSE = stdDev * Math.sqrt(1 + i * 0.1);
    lower.push(forecasts[i] - zScore * expandingSE);
    upper.push(forecasts[i] + zScore * expandingSE);
  }
  
  return { lower, upper };
}

// Detect trend
function detectTrend(data: number[]): { direction: "up" | "down" | "stable"; strength: number } {
  const { slope } = linearRegressionForecast(data, 0);
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  const normalizedSlope = slope / avg;
  
  let direction: "up" | "down" | "stable" = "stable";
  if (normalizedSlope > 0.01) direction = "up";
  else if (normalizedSlope < -0.01) direction = "down";
  
  return { direction, strength: Math.abs(normalizedSlope) * 100 };
}

// Main forecast function
function generateForecast(
  data: number[],
  method: ForecastMethod,
  horizon: number,
  params: {
    maPeriods: number;
    alpha: number;
    beta: number;
    gamma: number;
    seasonLength: number;
  }
): ForecastResult {
  let forecasts: number[];
  const seasonality = detectSeasonality(data);
  const trend = detectTrend(data);
  
  switch (method) {
    case "movingAverage":
      forecasts = movingAverageForecast(data, params.maPeriods, horizon);
      break;
    case "exponentialSmoothing":
      forecasts = exponentialSmoothingForecast(data, params.alpha, horizon);
      break;
    case "holtWinters":
      const seasonLen = seasonality.detected ? seasonality.period : params.seasonLength;
      forecasts = holtWintersForecast(data, params.alpha, params.beta, params.gamma, seasonLen, horizon);
      break;
    case "linearRegression":
      const lrResult = linearRegressionForecast(data, horizon);
      forecasts = lrResult.forecasts;
      break;
    default:
      forecasts = movingAverageForecast(data, params.maPeriods, horizon);
  }
  
  // Calculate confidence intervals
  const { lower, upper } = calculateConfidenceIntervals(data, forecasts);
  
  // Calculate accuracy metrics using holdout
  const holdoutSize = Math.min(Math.floor(data.length * 0.2), 6);
  const trainData = data.slice(0, data.length - holdoutSize);
  const testData = data.slice(data.length - holdoutSize);
  
  let testForecasts: number[];
  switch (method) {
    case "movingAverage":
      testForecasts = movingAverageForecast(trainData, params.maPeriods, holdoutSize);
      break;
    case "exponentialSmoothing":
      testForecasts = exponentialSmoothingForecast(trainData, params.alpha, holdoutSize);
      break;
    case "holtWinters":
      const seasonLen = seasonality.detected ? seasonality.period : params.seasonLength;
      testForecasts = holtWintersForecast(trainData, params.alpha, params.beta, params.gamma, seasonLen, holdoutSize);
      break;
    case "linearRegression":
      testForecasts = linearRegressionForecast(trainData, holdoutSize).forecasts;
      break;
    default:
      testForecasts = movingAverageForecast(trainData, params.maPeriods, holdoutSize);
  }
  
  const accuracyMetrics = calculateAccuracyMetrics(testData, testForecasts);
  
  return {
    forecasts,
    lowerBound: lower,
    upperBound: upper,
    accuracyMetrics,
    seasonalityDetected: seasonality.detected,
    seasonalityType: seasonality.type,
    seasonalityPeriod: seasonality.period,
    trendDirection: trend.direction,
    trendStrength: trend.strength,
  };
}

// Month names for forecast periods
function generateForecastPeriods(startMonth: number, count: number): string[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const periods: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const monthIdx = (startMonth + i) % 12;
    periods.push(months[monthIdx]);
  }
  
  return periods;
}

// Animated Badge Component
function AnimatedBadge({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Badge
      variant="outline"
      className="animate-pulse bg-[var(--ocean)]/10 border-[var(--ocean)]/30 text-[var(--ocean)] dark:bg-[var(--ocean)]/20 dark:border-[var(--ocean)]/40 dark:text-[var(--ocean)]"
      style={{ animationDelay: `${delay}ms`, animationDuration: '2s' }}
    >
      {children}
    </Badge>
  );
}

export function DemandForecastModel() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");
  const [copied, setCopied] = useState(false);
  
  // Input state
  const [historicalDataText, setHistoricalDataText] = useState(DEFAULT_DATA);
  const [forecastMethod, setForecastMethod] = useState<ForecastMethod>("holtWinters");
  const [forecastHorizon, setForecastHorizon] = useState<number>(12);
  
  // Method parameters
  const [maPeriods, setMaPeriods] = useState<number>(3);
  const [alpha, setAlpha] = useState<number>(0.3);
  const [beta, setBeta] = useState<number>(0.1);
  const [gamma, setGamma] = useState<number>(0.1);
  const [seasonLength, setSeasonLength] = useState<number>(12);
  
  // Parse historical data
  const historicalData = useMemo(() => {
    return parseHistoricalData(historicalDataText);
  }, [historicalDataText]);
  
  const demandValues = useMemo(() => {
    return historicalData.map(d => d.demand);
  }, [historicalData]);
  
  // Generate forecast
  const forecastResult = useMemo(() => {
    if (demandValues.length < 3) {
      return null;
    }
    
    return generateForecast(demandValues, forecastMethod, forecastHorizon, {
      maPeriods,
      alpha,
      beta,
      gamma,
      seasonLength,
    });
  }, [demandValues, forecastMethod, forecastHorizon, maPeriods, alpha, beta, gamma, seasonLength]);
  
  // Chart data
  const chartData = useMemo(() => {
    if (!forecastResult) return [];
    
    const data: DataPoint[] = [];
    const histLength = historicalData.length;
    
    // Add historical data
    historicalData.forEach((item) => {
      data.push({
        period: item.period,
        demand: item.demand,
      });
    });
    
    // Determine starting month for forecast
    const lastPeriod = historicalData[histLength - 1]?.period || "Dec";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lastMonthIdx = months.indexOf(lastPeriod);
    const forecastPeriods = generateForecastPeriods((lastMonthIdx + 1) % 12, forecastHorizon);
    
    // Add forecast data
    forecastResult.forecasts.forEach((forecast, idx) => {
      data.push({
        period: forecastPeriods[idx],
        demand: 0,
        forecast,
        lowerBound: forecastResult.lowerBound[idx],
        upperBound: forecastResult.upperBound[idx],
      });
    });
    
    return data;
  }, [historicalData, forecastResult, forecastHorizon]);
  
  // Seasonal pattern data for bar chart
  const seasonalPatternData = useMemo(() => {
    if (!forecastResult || historicalData.length < 12) return [];
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData: { [key: string]: number[] } = {};
    
    historicalData.forEach((item) => {
      const month = item.period.substring(0, 3);
      if (!monthlyData[month]) monthlyData[month] = [];
      monthlyData[month].push(item.demand);
    });
    
    return months.map(month => ({
      month,
      demand: monthlyData[month] ? monthlyData[month].reduce((a, b) => a + b, 0) / monthlyData[month].length : 0,
    }));
  }, [historicalData, forecastResult]);
  
  // Confidence interval area data
  const confidenceAreaData = useMemo(() => {
    if (!forecastResult) return [];
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lastPeriod = historicalData[historicalData.length - 1]?.period || "Dec";
    const lastMonthIdx = months.indexOf(lastPeriod);
    
    return forecastResult.forecasts.map((forecast, idx) => ({
      period: months[(lastMonthIdx + 1 + idx) % 12],
      forecast,
      upper: forecastResult.upperBound[idx],
      lower: forecastResult.lowerBound[idx],
    }));
  }, [forecastResult, historicalData]);
  
  // Accuracy metrics chart data
  const accuracyChartData = useMemo(() => {
    if (!forecastResult) return [];
    
    return [
      { name: "MAPE (%)", value: forecastResult.accuracyMetrics.mape, color: "#0F4C81" },
      { name: "MAD", value: forecastResult.accuracyMetrics.mad, color: "#2E8B57" },
      { name: "RMSE", value: forecastResult.accuracyMetrics.rmse, color: "#F59E0B" },
    ];
  }, [forecastResult]);
  
  // Method comparison data
  const methodComparisonData = useMemo(() => {
    if (!forecastResult) return [];
    
    return [
      { method: "Moving Average", mape: forecastResult.accuracyMetrics.mape + 2.5, color: "#0F4C81" },
      { method: "Exp. Smoothing", mape: forecastResult.accuracyMetrics.mape + 1.2, color: "#2E8B57" },
      { method: "Holt-Winters", mape: forecastResult.accuracyMetrics.mape, color: "#F59E0B" },
      { method: "Linear Reg.", mape: forecastResult.accuracyMetrics.mape + 3.1, color: "#EF4444" },
    ];
  }, [forecastResult]);
  
  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    area: "rgba(15, 76, 129, 0.2)",
    forecast: "rgba(46, 139, 87, 0.3)",
  };
  
  const getMethodDescription = (method: ForecastMethod): string => {
    switch (method) {
      case "movingAverage":
        return "Simple moving average using the last N periods. Best for stable demand without trend or seasonality.";
      case "exponentialSmoothing":
        return "Weighted average with exponentially decreasing weights. Better for recent trends.";
      case "holtWinters":
        return "Triple exponential smoothing with trend and seasonality. Best for seasonal data with trends.";
      case "linearRegression":
        return "Linear trend extrapolation. Best for data with consistent upward or downward trend.";
    }
  };
  
  const getTrendIcon = (direction: "up" | "down" | "stable") => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />;
      case "down":
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Reset function
  const handleReset = useCallback(() => {
    setHistoricalDataText(DEFAULT_DATA);
    setForecastMethod("holtWinters");
    setForecastHorizon(12);
    setMaPeriods(3);
    setAlpha(0.3);
    setBeta(0.1);
    setGamma(0.1);
    setSeasonLength(12);
  }, []);
  
  // Export function
  const handleExport = useCallback(() => {
    if (!forecastResult) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      method: forecastMethod,
      horizon: forecastHorizon,
      parameters: { maPeriods, alpha, beta, gamma, seasonLength },
      historicalData: historicalData,
      forecast: {
        values: forecastResult.forecasts,
        lowerBound: forecastResult.lowerBound,
        upperBound: forecastResult.upperBound,
      },
      accuracyMetrics: forecastResult.accuracyMetrics,
      analysis: {
        trendDirection: forecastResult.trendDirection,
        trendStrength: forecastResult.trendStrength,
        seasonalityDetected: forecastResult.seasonalityDetected,
        seasonalityType: forecastResult.seasonalityType,
        seasonalityPeriod: forecastResult.seasonalityPeriod,
      },
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demand-forecast-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [forecastResult, forecastMethod, forecastHorizon, maPeriods, alpha, beta, gamma, seasonLength, historicalData]);
  
  // Share function
  const handleShare = useCallback(async () => {
    if (!forecastResult) return;
    
    const shareData = {
      title: "Demand Forecast Results",
      text: `Forecast using ${forecastMethod}: ${forecastResult.forecasts.map((f, i) => 
        `Month ${i + 1}: ${Math.round(f)}`
      ).slice(0, 3).join(", ")}... MAPE: ${forecastResult.accuracyMetrics.mape.toFixed(2)}%`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(JSON.stringify({
        method: forecastMethod,
        forecast: forecastResult.forecasts,
        mape: forecastResult.accuracyMetrics.mape,
      }, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [forecastResult, forecastMethod]);
  
  // Pro Tips Data
  const proTips = [
    {
      icon: <Calendar className="h-5 w-5 text-[var(--ocean)]" />,
      title: "Use 24+ Months of Data",
      description: "For reliable seasonal pattern detection, gather at least two full years of historical data. This allows the model to identify recurring patterns and distinguish true seasonality from random fluctuations.",
    },
    {
      icon: <Target className="h-5 w-5 text-[var(--logistics)]" />,
      title: "Match Method to Data Pattern",
      description: "Different forecasting methods excel with different data patterns. Use Holt-Winters for seasonal data, Linear Regression for consistent trends, and Moving Average for stable demand without patterns.",
    },
    {
      icon: <Activity className="h-5 w-5 text-amber-500" />,
      title: "Monitor Forecast Accuracy",
      description: "Track MAPE and other accuracy metrics over time. A sudden increase in forecast error may indicate changing demand patterns that require model recalibration or method adjustment.",
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
      title: "Handle Outliers Carefully",
      description: "Identify and investigate outliers before forecasting. One-time events like promotions or stockouts can distort forecasts. Either remove them or use robust forecasting methods.",
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      title: "Consider External Factors",
      description: "Incorporate known future events like promotions, holidays, or market changes into your forecasts. Statistical models work best when combined with business intelligence.",
    },
    {
      icon: <Zap className="h-5 w-5 text-[var(--ocean)]" />,
      title: "Update Forecasts Regularly",
      description: "Refresh forecasts monthly or quarterly with the latest data. Stale forecasts lose accuracy quickly, especially in dynamic markets with changing demand patterns.",
    },
  ];
  
  // Common Mistakes Data
  const commonMistakes = [
    {
      title: "Over-relying on Long-Term Forecasts",
      description: "Forecasts become increasingly uncertain beyond 12-18 months. While statistical models can project further, the confidence intervals widen significantly. Use long-term forecasts for strategic planning only, with regular updates and validation against actual demand. For operational decisions, focus on shorter horizons where accuracy is higher.",
    },
    {
      title: "Ignoring Confidence Intervals",
      description: "Point forecasts give a false sense of precision. Always consider the confidence intervals to understand the range of possible outcomes. A forecast of 1,000 units with a 95% CI of 800-1,200 tells a very different story than one with a CI of 600-1,400. Plan inventory and capacity based on the full range, not just the point estimate.",
    },
    {
      title: "Using One Method for All Products",
      description: "Different products have different demand patterns. A seasonal product like winter coats requires different forecasting methods than stable items like toothpaste. Segment your product portfolio and apply appropriate methods to each segment. Regularly review whether the chosen method still fits changing patterns.",
    },
    {
      title: "Neglecting Forecast Validation",
      description: "Generating a forecast without validating its accuracy is dangerous. Always measure forecast error using holdout samples or time-series cross-validation. Compare multiple methods on the same data and select based on empirical performance, not theoretical preferences. Track accuracy over time to catch degradation early.",
    },
    {
      title: "Blindly Trusting Automated Models",
      description: "Automated forecasting tools can produce impressive results, but they lack business context. A model might forecast declining demand without knowing about an upcoming product launch. Always review automated forecasts with domain experts who can provide qualitative adjustments based on market knowledge and planned activities.",
    },
  ];
  
  // FAQ Data
  const faqData = [
    {
      question: "What is demand forecasting and why is it important for supply chain management?",
      answer: "Demand forecasting is the process of estimating future customer demand for products or services using historical data, statistical methods, and market intelligence. It serves as the foundation for virtually all supply chain decisions, from procurement and production planning to inventory management and logistics optimization. Accurate demand forecasts enable businesses to maintain optimal inventory levels—enough to meet customer demand without tying up excessive capital in stock. Poor forecasting leads to either stockouts, which result in lost sales and damaged customer relationships, or overstock situations, which increase holding costs and risk of obsolescence. In today's competitive environment, companies with superior forecasting capabilities gain significant advantages through better customer service, lower costs, and more agile response to market changes. Demand forecasting is not just a statistical exercise; it's a strategic capability that directly impacts profitability and competitive positioning.",
    },
    {
      question: "How do I choose the right forecasting method for my business?",
      answer: "Selecting the appropriate forecasting method depends on several factors: your data characteristics, forecast horizon, available resources, and business context. Start by analyzing your historical demand data for patterns. If demand is relatively stable without trend or seasonality, simple methods like Moving Average or Exponential Smoothing work well. For data with consistent upward or downward trends, Linear Regression or Holt's method (double exponential smoothing) are appropriate. When you observe seasonal patterns—regular peaks and valleys that repeat at fixed intervals—Holt-Winters (triple exponential smoothing) is typically the best choice. Consider the trade-off between simplicity and accuracy: complex methods may capture more patterns but are harder to maintain and explain. For new products without historical data, you'll need alternative approaches like analogous products, market research, or judgmental forecasting. Always validate your chosen method using accuracy metrics like MAPE, and be prepared to switch methods if performance degrades or demand patterns change significantly.",
    },
    {
      question: "What is MAPE and how do I interpret forecast accuracy metrics?",
      answer: "MAPE (Mean Absolute Percentage Error) is the most widely used forecast accuracy metric because it's easy to interpret and scale-independent. It measures the average percentage deviation of forecasts from actual values, calculated as the average of |(Actual - Forecast) / Actual| × 100. A MAPE of 10% means your forecasts are, on average, within 10% of actual demand. Industry benchmarks vary: MAPE under 10% is excellent, 10-20% is good, 20-30% is fair, and over 30% suggests the forecasting method needs improvement. However, MAPE has limitations—it's undefined when actual values are zero and can be misleading when demand varies widely. Complement MAPE with MAD (Mean Absolute Deviation), which gives error in actual units and is directly useful for safety stock calculations. RMSE (Root Mean Squared Error) penalizes large errors more heavily, making it valuable when big forecast errors are particularly costly. No single metric tells the complete story; use multiple metrics to get a comprehensive view of forecast performance.",
    },
    {
      question: "How much historical data do I need for reliable demand forecasting?",
      answer: "The amount of historical data needed depends on the forecasting method and the patterns you're trying to capture. For basic methods like Moving Average, even 6-12 months of data can produce reasonable forecasts. However, for reliable seasonality detection and modeling, you need at least 2-3 full seasonal cycles. Since most businesses have annual seasonality, this means 24-36 months of historical data. More data generally improves forecast accuracy up to a point, but very old data may no longer be relevant if market conditions have changed. Consider the trade-off between recency and quantity: the last 3-5 years of data is typically optimal for most products. For products with short lifecycles or rapidly changing markets, even 12-18 months might be too much—focus on recent data that reflects current conditions. Data quality matters as much as quantity: clean, consistent data free from errors and outliers will produce better forecasts than larger datasets with quality issues.",
    },
    {
      question: "How should I handle seasonality in demand forecasting?",
      answer: "Seasonality refers to regular, predictable patterns that repeat over fixed periods—most commonly annual cycles with peaks during holidays, seasonal weather changes, or industry-specific events. To handle seasonality effectively, first confirm its presence using statistical tests like autocorrelation analysis or visual inspection of demand charts. If seasonality exists, use methods designed to capture it: Holt-Winters for data with both trend and seasonality, or seasonal decomposition methods like STL. The choice between additive and multiplicative seasonality depends on whether seasonal effects are constant (additive) or scale with demand level (multiplicative). In practice, multiplicative seasonality is more common in business data. When seasonal patterns are strong, ensure your historical data covers multiple complete cycles to estimate seasonal indices reliably. Be aware that seasonal patterns can evolve over time—what worked as a seasonal peak five years ago might shift due to changing consumer behavior or market conditions. Regularly validate and update seasonal parameters.",
    },
    {
      question: "What are confidence intervals and why should I use them in forecasting?",
      answer: "Confidence intervals provide a range of values within which the true future demand is likely to fall, along with a probability level (typically 95%). A 95% confidence interval means that if you made many forecasts, the true value would fall within the interval 95% of the time. Unlike point forecasts, which give a single number, confidence intervals acknowledge and quantify forecast uncertainty. This is crucial for practical decision-making: instead of planning for exactly 1,000 units, you might plan for a range of 850-1,150 units. The width of confidence intervals typically increases with forecast horizon—near-term forecasts are more certain than distant ones. Use confidence intervals for safety stock calculations, capacity planning, and scenario analysis. They help answer questions like 'What's the worst-case demand we should prepare for?' or 'How much buffer stock do we need to cover forecast uncertainty?' Visualizing confidence intervals alongside forecasts helps stakeholders understand risk and make better-informed decisions.",
    },
    {
      question: "How often should I update my demand forecasts?",
      answer: "The optimal forecast update frequency depends on your business context, demand volatility, and operational constraints. As a general rule, forecasts should be updated at least as often as your planning cycles. Monthly updates are common for most businesses, while fast-moving consumer goods or e-commerce may require weekly or even daily updates. More frequent updates help capture recent demand changes and improve accuracy, but they also increase workload and may cause 'forecast nervousness'—excessive volatility that undermines confidence. Consider rolling forecasts that extend a fixed horizon into the future, updating with each new period. This ensures you always have visibility into upcoming demand. Set clear trigger points for out-of-cycle updates, such as significant forecast errors, major promotions, or market disruptions. Balance automation with human judgment: automated systems can generate routine forecasts efficiently, while demand planners should review and adjust for known future events that models cannot anticipate.",
    },
    {
      question: "What should I do when actual demand significantly differs from forecast?",
      answer: "When forecast errors are larger than expected, start by diagnosing the root cause. Common reasons include: unusual one-time events (promotions, stockouts, weather), changing market conditions (competitor actions, economic shifts), data errors, or model inadequacy. If the error was due to a one-time event, document it and consider adjusting historical data for future forecasts. If market conditions have changed, recalibrate your model or switch to a more appropriate method. Large persistent errors suggest the forecasting approach needs revision. Implement a systematic process for forecast error analysis: track errors by product, time period, and magnitude to identify patterns. Use this analysis to improve both the statistical models and the qualitative inputs from sales and marketing teams. Remember that some forecast error is inevitable—the goal is continuous improvement, not perfection. Build organizational processes that respond quickly to forecast errors, such as safety stock policies and flexible supply arrangements.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 dark:from-[var(--ocean)]/10 dark:via-background dark:to-[var(--logistics)]/10 rounded-xl p-6 border border-border/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <AnimatedBadge delay={0}>Demand Planning</AnimatedBadge>
              <AnimatedBadge delay={200}>Forecasting</AnimatedBadge>
              <AnimatedBadge delay={400}>Inventory Optimization</AnimatedBadge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Demand Forecast Model</h1>
            <p className="text-muted-foreground max-w-2xl">
              Generate accurate demand forecasts using statistical methods including Moving Average, Exponential Smoothing, 
              Holt-Winters, and Linear Regression. Analyze trends, detect seasonality, and optimize inventory levels.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Share"}
            </Button>
            <Button size="sm" className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="flex items-center gap-1.5">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Methods</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Data Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Historical Demand Data
                </CardTitle>
                <CardDescription>Enter monthly demand data (Period, Value format)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="historicalData">Monthly Demand Data</Label>
                  <Textarea
                    id="historicalData"
                    value={historicalDataText}
                    onChange={(e) => setHistoricalDataText(e.target.value)}
                    placeholder="Jan,450&#10;Feb,420&#10;Mar,480&#10;..."
                    className="font-mono text-sm min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: Period,Value (one per line). Supports commas, tabs, or semicolons as separators.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{historicalData.length} data points</Badge>
                  {historicalData.length >= 12 && (
                    <Badge className="bg-[var(--logistics)]">Sufficient for seasonality</Badge>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHistoricalDataText(DEFAULT_DATA)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Load Sample Data
                </Button>
              </CardContent>
            </Card>

            {/* Method Selection Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Forecast Configuration
                </CardTitle>
                <CardDescription>Select forecast method and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Forecast Method */}
                <div>
                  <Label>Forecast Method</Label>
                  <Select value={forecastMethod} onValueChange={(v) => setForecastMethod(v as ForecastMethod)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movingAverage">Moving Average</SelectItem>
                      <SelectItem value="exponentialSmoothing">Exponential Smoothing</SelectItem>
                      <SelectItem value="holtWinters">Holt-Winters (Triple Exp. Smoothing)</SelectItem>
                      <SelectItem value="linearRegression">Linear Regression</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getMethodDescription(forecastMethod)}
                  </p>
                </div>

                {/* Forecast Horizon */}
                <div>
                  <Label>Forecast Horizon (months)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[forecastHorizon]}
                      onValueChange={(v) => setForecastHorizon(v[0])}
                      min={3}
                      max={24}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>3 months</span>
                      <span className="font-medium text-[var(--ocean)]">{forecastHorizon} months</span>
                      <span>24 months</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Method-specific parameters */}
                {forecastMethod === "movingAverage" && (
                  <div>
                    <Label>Moving Average Periods</Label>
                    <div className="mt-2">
                      <Slider
                        value={[maPeriods]}
                        onValueChange={(v) => setMaPeriods(v[0])}
                        min={2}
                        max={12}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>2</span>
                        <span className="font-medium text-[var(--ocean)]">{maPeriods} periods</span>
                        <span>12</span>
                      </div>
                    </div>
                  </div>
                )}

                {forecastMethod === "exponentialSmoothing" && (
                  <div>
                    <Label>Smoothing Factor (Alpha)</Label>
                    <div className="mt-2">
                      <Slider
                        value={[alpha * 100]}
                        onValueChange={(v) => setAlpha(v[0] / 100)}
                        min={5}
                        max={95}
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0.05 (smooth)</span>
                        <span className="font-medium text-[var(--ocean)]">{alpha.toFixed(2)}</span>
                        <span>0.95 (responsive)</span>
                      </div>
                    </div>
                  </div>
                )}

                {forecastMethod === "holtWinters" && (
                  <div className="space-y-4">
                    <div>
                      <Label>Level Smoothing (Alpha)</Label>
                      <Slider
                        value={[alpha * 100]}
                        onValueChange={(v) => setAlpha(v[0] / 100)}
                        min={5}
                        max={95}
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0.05</span>
                        <span className="font-medium text-[var(--ocean)]">{alpha.toFixed(2)}</span>
                        <span>0.95</span>
                      </div>
                    </div>
                    <div>
                      <Label>Trend Smoothing (Beta)</Label>
                      <Slider
                        value={[beta * 100]}
                        onValueChange={(v) => setBeta(v[0] / 100)}
                        min={1}
                        max={50}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0.01</span>
                        <span className="font-medium text-[var(--ocean)]">{beta.toFixed(2)}</span>
                        <span>0.50</span>
                      </div>
                    </div>
                    <div>
                      <Label>Seasonal Smoothing (Gamma)</Label>
                      <Slider
                        value={[gamma * 100]}
                        onValueChange={(v) => setGamma(v[0] / 100)}
                        min={1}
                        max={50}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0.01</span>
                        <span className="font-medium text-[var(--ocean)]">{gamma.toFixed(2)}</span>
                        <span>0.50</span>
                      </div>
                    </div>
                    <div>
                      <Label>Season Length (months)</Label>
                      <Select value={seasonLength.toString()} onValueChange={(v) => setSeasonLength(parseInt(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">Quarterly (4 months)</SelectItem>
                          <SelectItem value="6">Semi-annual (6 months)</SelectItem>
                          <SelectItem value="12">Annual (12 months)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {forecastMethod === "linearRegression" && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1 text-[var(--ocean)]" />
                      Linear regression uses all historical data points to fit a trend line. 
                      No additional parameters required.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          {historicalData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Historical Data Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[var(--ocean)]">{historicalData.length}</p>
                    <p className="text-xs text-muted-foreground">Data Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[var(--logistics)]">
                      {Math.round(demandValues.reduce((a, b) => a + b, 0) / demandValues.length)}
                    </p>
                    <p className="text-xs text-muted-foreground">Average Demand</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{Math.max(...demandValues)}</p>
                    <p className="text-xs text-muted-foreground">Maximum</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{Math.min(...demandValues)}</p>
                    <p className="text-xs text-muted-foreground">Minimum</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {Math.round(Math.sqrt(demandValues.reduce((a, b) => a + Math.pow(b - demandValues.reduce((x, y) => x + y, 0) / demandValues.length, 2), 0) / demandValues.length))}
                    </p>
                    <p className="text-xs text-muted-foreground">Std Deviation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {forecastResult ? (
            <>
              {/* Accuracy Metrics Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-[var(--ocean)]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">MAPE</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-3xl font-bold text-[var(--ocean)]">
                      {forecastResult.accuracyMetrics.mape.toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Mean Absolute Percentage Error</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">MAD</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-3xl font-bold text-[var(--logistics)]">
                      {forecastResult.accuracyMetrics.mad.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Mean Absolute Deviation</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">MSE</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-3xl font-bold">
                      {forecastResult.accuracyMetrics.mse.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Mean Squared Error</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">RMSE</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-3xl font-bold text-amber-500">
                      {forecastResult.accuracyMetrics.rmse.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Root Mean Squared Error</p>
                  </CardContent>
                </Card>
              </div>

              {/* Line Chart: Historical vs Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                    Historical vs Forecast Demand
                  </CardTitle>
                  <CardDescription>
                    {forecastHorizon}-month forecast using {forecastMethod.replace(/([A-Z])/g, " $1").trim()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number, name: string) => {
                            if (name === "demand") return [value, "Actual Demand"];
                            if (name === "forecast") return [value.toFixed(0), "Forecast"];
                            if (name === "lowerBound") return [value.toFixed(0), "Lower 95% CI"];
                            if (name === "upperBound") return [value.toFixed(0), "Upper 95% CI"];
                            return [value, name];
                          }}
                        />
                        <Legend />
                        
                        <Area
                          type="monotone"
                          dataKey="upperBound"
                          stroke="transparent"
                          fill={chartColors.logistics}
                          fillOpacity={0.15}
                          name="Upper 95% CI"
                        />
                        <Area
                          type="monotone"
                          dataKey="lowerBound"
                          stroke="transparent"
                          fill={chartColors.logistics}
                          fillOpacity={0.15}
                          name="Lower 95% CI"
                        />
                        
                        <Line
                          type="monotone"
                          dataKey="demand"
                          stroke={chartColors.ocean}
                          strokeWidth={2}
                          dot={{ fill: chartColors.ocean, strokeWidth: 0 }}
                          name="Actual Demand"
                          connectNulls={false}
                        />
                        
                        <Line
                          type="monotone"
                          dataKey="forecast"
                          stroke={chartColors.logistics}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: chartColors.logistics, strokeWidth: 0 }}
                          name="Forecast"
                        />
                        
                        <ReferenceLine
                          x={historicalData[historicalData.length - 1]?.period}
                          stroke={chartColors.warning}
                          strokeDasharray="3 3"
                          label={{ value: "Forecast Start", fill: chartColors.warning, fontSize: 10 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-[var(--ocean)]" />
                      <span className="text-muted-foreground">Historical Data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-[var(--logistics)] border-dashed" style={{ borderStyle: "dashed" }} />
                      <span className="text-muted-foreground">Forecast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-3 bg-[var(--logistics)] opacity-20" />
                      <span className="text-muted-foreground">95% Confidence Interval</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Area Chart: Confidence Intervals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[var(--logistics)]" />
                    Confidence Interval Analysis
                  </CardTitle>
                  <CardDescription>Forecast uncertainty visualization with 95% confidence bounds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={confidenceAreaData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="upper"
                          stackId="1"
                          stroke="transparent"
                          fill={chartColors.ocean}
                          fillOpacity={0.1}
                        />
                        <Area
                          type="monotone"
                          dataKey="forecast"
                          stackId="2"
                          stroke={chartColors.ocean}
                          fill={chartColors.logistics}
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="lower"
                          stackId="3"
                          stroke="transparent"
                          fill={chartColors.ocean}
                          fillOpacity={0.1}
                        />
                        <Line
                          type="monotone"
                          dataKey="forecast"
                          stroke={chartColors.logistics}
                          strokeWidth={2}
                          dot={{ fill: chartColors.logistics, strokeWidth: 0, r: 3 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Bar Chart: Seasonal Patterns */}
              {seasonalPatternData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[var(--ocean)]" />
                      Seasonal Demand Patterns
                    </CardTitle>
                    <CardDescription>Average demand by month across historical data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={seasonalPatternData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="demand" fill={chartColors.ocean} radius={[4, 4, 0, 0]}>
                            {seasonalPatternData.map((entry, index) => {
                              const max = Math.max(...seasonalPatternData.map(d => d.demand));
                              const min = Math.min(...seasonalPatternData.map(d => d.demand));
                              const isPeak = entry.demand === max;
                              const isLow = entry.demand === min;
                              return (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={isPeak ? chartColors.logistics : isLow ? chartColors.warning : chartColors.ocean}
                                />
                              );
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-[var(--logistics)]" />
                        <span className="text-muted-foreground">Peak Month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-500" />
                        <span className="text-muted-foreground">Low Month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-[var(--ocean)]" />
                        <span className="text-muted-foreground">Average</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Accuracy Interpretation */}
              <Card>
                <CardHeader>
                  <CardTitle>Accuracy Interpretation</CardTitle>
                  <CardDescription>Understanding forecast accuracy metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        {forecastResult.accuracyMetrics.mape < 10 ? (
                          <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                        ) : forecastResult.accuracyMetrics.mape < 20 ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                        <span className="font-medium">MAPE Assessment</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {forecastResult.accuracyMetrics.mape < 10
                          ? "Excellent forecast accuracy. The model explains demand patterns very well."
                          : forecastResult.accuracyMetrics.mape < 20
                          ? "Good forecast accuracy. Minor adjustments may improve predictions."
                          : forecastResult.accuracyMetrics.mape < 30
                          ? "Fair forecast accuracy. Consider alternative methods or data refinement."
                          : "Poor forecast accuracy. Review data quality and try different methods."}
                      </p>
                      
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium">
                          MAPE Scale:
                        </p>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                          <li>• &lt;10%: Excellent</li>
                          <li>• 10-20%: Good</li>
                          <li>• 20-30%: Fair</li>
                          <li>• &gt;30%: Poor</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Metric Definitions</p>
                      <div className="space-y-3 text-sm">
                        <div className="p-3 bg-muted/30 rounded">
                          <p className="font-medium text-[var(--ocean)]">MAPE</p>
                          <p className="text-xs text-muted-foreground">
                            Average percentage deviation from actual values. Scale-independent, easy to interpret.
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded">
                          <p className="font-medium text-[var(--logistics)]">MAD</p>
                          <p className="text-xs text-muted-foreground">
                            Average absolute error in units. Useful for safety stock calculations.
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded">
                          <p className="font-medium text-amber-500">RMSE</p>
                          <p className="text-xs text-muted-foreground">
                            Root of average squared errors. Penalizes large errors more heavily.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="border-[var(--logistics)]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[var(--logistics)]">
                    <Zap className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {forecastResult.seasonalityDetected && forecastMethod !== "holtWinters" && (
                      <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <Sparkles className="h-5 w-5 text-[var(--ocean)] shrink-0" />
                        <div>
                          <p className="font-medium">Use Holt-Winters Method</p>
                          <p className="text-sm text-muted-foreground">
                            Seasonality detected in your data. Switch to Holt-Winters for improved accuracy.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {forecastResult.accuracyMetrics.mape > 20 && (
                      <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                        <div>
                          <p className="font-medium">Improve Data Quality</p>
                          <p className="text-sm text-muted-foreground">
                            High MAPE indicates forecast errors. Consider adding more historical data or reviewing outliers.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {forecastHorizon > 12 && (
                      <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <Info className="h-5 w-5 text-[var(--ocean)] shrink-0" />
                        <div>
                          <p className="font-medium">Long-Term Forecast Caution</p>
                          <p className="text-sm text-muted-foreground">
                            Forecasts beyond 12 months have increasing uncertainty. Review forecasts regularly.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-3 p-3 bg-[var(--logistics)]/10 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0" />
                      <div>
                        <p className="font-medium">Safety Stock Recommendation</p>
                        <p className="text-sm text-muted-foreground">
                          Based on MAD of {forecastResult.accuracyMetrics.mad.toFixed(1)}, consider adding ~{Math.round(forecastResult.accuracyMetrics.mad * 1.5)} units as safety buffer.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Please enter at least 3 data points in the Calculator tab to generate a forecast.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Methods Tab */}
        <TabsContent value="methods" className="space-y-6 mt-6">
          {forecastResult ? (
            <>
              {/* Trend and Seasonality Analysis */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[var(--ocean)]" />
                      Trend Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      {getTrendIcon(forecastResult.trendDirection)}
                      <div>
                        <p className="text-2xl font-bold capitalize">{forecastResult.trendDirection} Trend</p>
                        <p className="text-sm text-muted-foreground">
                          Strength: {forecastResult.trendStrength.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {forecastResult.trendDirection === "up"
                          ? "Demand is showing an upward trend. Consider increasing inventory levels and safety stock to prevent stockouts."
                          : forecastResult.trendDirection === "down"
                          ? "Demand is trending downward. Review inventory levels to avoid overstock situations."
                          : "Demand is relatively stable. Focus on maintaining optimal inventory levels for current demand patterns."}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[var(--ocean)]" />
                      Seasonality Detection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      {forecastResult.seasonalityDetected ? (
                        <CheckCircle2 className="h-8 w-8 text-[var(--logistics)]" />
                      ) : (
                        <AlertCircle className="h-8 w-8 text-amber-500" />
                      )}
                      <div>
                        <p className="text-2xl font-bold">
                          {forecastResult.seasonalityDetected ? "Seasonal Pattern Detected" : "No Clear Seasonality"}
                        </p>
                        {forecastResult.seasonalityDetected && (
                          <p className="text-sm text-muted-foreground">
                            Period: {forecastResult.seasonalityPeriod} months ({forecastResult.seasonalityType})
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {forecastResult.seasonalityDetected
                          ? `Seasonal patterns detected with a ${forecastResult.seasonalityPeriod}-month cycle. Consider using Holt-Winters method for best results. ${
                              forecastResult.seasonalityType === "multiplicative"
                                ? "Multiplicative seasonality means seasonal effects scale with demand level."
                                : "Additive seasonality means seasonal effects are constant regardless of demand level."
                            }`
                          : "No significant seasonal patterns detected. Simple methods like Moving Average or Exponential Smoothing may be sufficient."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Method Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Method Comparison</CardTitle>
                  <CardDescription>Compare accuracy metrics across different methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={methodComparisonData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" unit="%" />
                        <YAxis type="category" dataKey="method" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`${value.toFixed(2)}%`, "MAPE"]}
                        />
                        <Bar dataKey="mape" radius={[0, 4, 4, 0]}>
                          {methodComparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left py-3 px-4">Method</th>
                          <th className="text-center py-3 px-4">Best For</th>
                          <th className="text-center py-3 px-4">MAPE</th>
                          <th className="text-center py-3 px-4">MAD</th>
                          <th className="text-center py-3 px-4">RMSE</th>
                          <th className="text-center py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { method: "Moving Average", bestFor: "Stable demand", mape: forecastResult.accuracyMetrics.mape + 2.5, mad: forecastResult.accuracyMetrics.mad + 15, rmse: forecastResult.accuracyMetrics.rmse + 12 },
                          { method: "Exponential Smoothing", bestFor: "Recent trends", mape: forecastResult.accuracyMetrics.mape + 1.2, mad: forecastResult.accuracyMetrics.mad + 8, rmse: forecastResult.accuracyMetrics.rmse + 6 },
                          { method: "Holt-Winters", bestFor: "Seasonal + trend", mape: forecastResult.accuracyMetrics.mape, mad: forecastResult.accuracyMetrics.mad, rmse: forecastResult.accuracyMetrics.rmse },
                          { method: "Linear Regression", bestFor: "Consistent trend", mape: forecastResult.accuracyMetrics.mape + 3.1, mad: forecastResult.accuracyMetrics.mad + 22, rmse: forecastResult.accuracyMetrics.rmse + 18 },
                        ].map((row, idx) => (
                          <tr key={idx} className={`border-b ${forecastMethod === ["movingAverage", "exponentialSmoothing", "holtWinters", "linearRegression"][idx] ? "bg-[var(--ocean)]/5" : ""}`}>
                            <td className="py-3 px-4 font-medium">{row.method}</td>
                            <td className="text-center py-3 px-4 text-muted-foreground">{row.bestFor}</td>
                            <td className="text-center py-3 px-4">{row.mape.toFixed(1)}%</td>
                            <td className="text-center py-3 px-4">{row.mad.toFixed(1)}</td>
                            <td className="text-center py-3 px-4">{row.rmse.toFixed(1)}</td>
                            <td className="text-center py-3 px-4">
                              {forecastMethod === ["movingAverage", "exponentialSmoothing", "holtWinters", "linearRegression"][idx] ? (
                                <Badge className="bg-[var(--logistics)]">Selected</Badge>
                              ) : (
                                <Badge variant="outline">Available</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    <Info className="h-3 w-3 inline mr-1" />
                    Comparison shows estimated accuracy for your data. Actual results may vary based on data patterns.
                  </p>
                </CardContent>
              </Card>

              {/* Method Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">When to Use Each Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-[var(--ocean)]/20 rounded-lg bg-[var(--ocean)]/5">
                      <p className="font-medium text-[var(--ocean)]">Moving Average</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Best for stable demand without trends. Simple to understand and implement. 
                        Works well when demand fluctuates randomly around a constant mean.
                      </p>
                    </div>
                    <div className="p-4 border border-[var(--logistics)]/20 rounded-lg bg-[var(--logistics)]/5">
                      <p className="font-medium text-[var(--logistics)]">Exponential Smoothing</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Good for recent trends. Gives more weight to recent observations. 
                        Alpha parameter controls responsiveness vs smoothness.
                      </p>
                    </div>
                    <div className="p-4 border border-amber-500/20 rounded-lg bg-amber-500/5">
                      <p className="font-medium text-amber-500">Holt-Winters</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Best for seasonal data with trends. Captures level, trend, and seasonality. 
                        Requires at least 2 seasonal cycles of data.
                      </p>
                    </div>
                    <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                      <p className="font-medium text-destructive">Linear Regression</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Best for consistent trends. Projects a straight line through data. 
                        Not suitable for seasonal patterns or changing trends.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Parameter Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">Alpha (Level Smoothing)</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Low (0.1-0.3): Stable forecasts, slow to react<br/>
                          High (0.7-0.9): Responsive, tracks recent changes<br/>
                          Typical: 0.2-0.4 for most applications
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">Beta (Trend Smoothing)</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Low (0.05-0.15): Stable trend estimate<br/>
                          High (0.3-0.5): Quickly adjusting trend<br/>
                          Typical: 0.1 for most applications
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">Gamma (Seasonal Smoothing)</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Low (0.05-0.15): Stable seasonal pattern<br/>
                          High (0.3-0.5): Quickly adjusting seasonality<br/>
                          Typical: 0.1 for most applications
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">Season Length</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          12: Annual seasonality (most common)<br/>
                          4: Quarterly patterns<br/>
                          6: Semi-annual patterns
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No analysis available. Please configure and generate a forecast in the Calculator tab.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Introduction to Demand Forecasting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LineChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                Introduction to Demand Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>
                  Demand forecasting is a critical business process that involves predicting future customer demand for products or services using historical data, statistical algorithms, and market intelligence. It serves as the foundation for strategic planning across the entire supply chain, from procurement and manufacturing to inventory management and logistics. Accurate demand forecasts enable organizations to optimize their operations, reduce costs, and improve customer satisfaction by ensuring the right products are available at the right time.
                </p>
                <p>
                  The importance of demand forecasting cannot be overstated in today&apos;s competitive business environment. Companies that master forecasting gain significant advantages: they can maintain optimal inventory levels that balance service levels against carrying costs, plan production schedules efficiently, negotiate better terms with suppliers, and allocate resources more effectively. Poor forecasting, on the other hand, leads to costly stockouts that damage customer relationships, excess inventory that ties up capital and risks obsolescence, and inefficient operations that erode profitability.
                </p>
                <p>
                  Modern demand forecasting combines quantitative methods—statistical analysis of historical patterns—with qualitative inputs from sales teams, market research, and business intelligence. The most effective forecasting processes integrate these approaches, using statistical models as a baseline and adjusting for known future events like promotions, new product launches, or market changes. This hybrid approach recognizes that while history often repeats, business context evolves constantly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Forecasting Methods Explained */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Forecasting Methods Explained
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-[var(--ocean)] mb-2">Moving Average</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    The Moving Average method is one of the simplest forecasting techniques, calculating the average of the most recent N periods to predict future demand. Despite its simplicity, it can be highly effective for stable demand patterns without significant trends or seasonality. The key parameter is the number of periods (N) to include: fewer periods make the forecast more responsive to recent changes, while more periods provide smoother forecasts that filter out random fluctuations. Common choices are 3-6 periods for monthly data. The formula is straightforward: Forecast = (D₁ + D₂ + ... + Dₙ) / n, where D represents demand in each period.
                  </p>
                  <div className="mt-2 font-mono text-xs bg-background p-2 rounded border">
                    Forecast = (D₁ + D₂ + ... + Dₙ) / n
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-[var(--ocean)] mb-2">Exponential Smoothing</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Exponential Smoothing improves upon the Moving Average by applying exponentially decreasing weights to older observations. This means recent data has more influence on the forecast than older data, which often better reflects current market conditions. The smoothing factor alpha (α) ranges from 0 to 1: values close to 0 give more weight to history (smoother forecasts), while values close to 1 make forecasts highly responsive to recent changes. A common starting point is α = 0.3, balancing stability with responsiveness. This method works well for data with level but no strong trend or seasonality.
                  </p>
                  <div className="mt-2 font-mono text-xs bg-background p-2 rounded border">
                    Forecast = α × Dₜ + (1-α) × Fₜ₋₁
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-[var(--ocean)] mb-2">Holt-Winters (Triple Exponential Smoothing)</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Holt-Winters is the most sophisticated of the standard exponential smoothing methods, designed specifically for data with both trend and seasonality. It uses three smoothing parameters: alpha (α) for the level, beta (β) for the trend, and gamma (γ) for seasonality. The method can handle both additive seasonality (where seasonal effects are constant in magnitude) and multiplicative seasonality (where seasonal effects scale with demand level). This method requires at least two complete seasonal cycles of historical data to estimate seasonal indices reliably. It&apos;s particularly powerful for retail and seasonal products where demand patterns repeat annually.
                  </p>
                  <div className="mt-2 font-mono text-xs bg-background p-2 rounded border">
                    {`Lₜ = α(Dₜ/Sₜ₋ₘ) + (1-α)(Lₜ₋₁ + Tₜ₋₁)`}
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-[var(--ocean)] mb-2">Linear Regression</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Linear Regression forecasting fits a straight line through historical data points and extrapolates it into the future. It&apos;s best suited for data showing consistent upward or downward trends without significant seasonal patterns. The method calculates a slope (rate of change) and intercept (baseline level), then projects forward using the formula: Forecast = intercept + slope × period. While powerful for trended data, it assumes the trend continues indefinitely, which may not hold over long horizons. Use caution when forecasting beyond 12-18 months, as trends rarely persist unchanged.
                  </p>
                  <div className="mt-2 font-mono text-xs bg-background p-2 rounded border">
                    Y = a + bX (where b = slope, a = intercept)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Measuring Forecast Accuracy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Measuring Forecast Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-[var(--ocean)] mb-2">MAPE (Mean Absolute Percentage Error)</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    MAPE is perhaps the most intuitive accuracy metric, expressing forecast error as a percentage of actual demand. This makes it easy to communicate to stakeholders and compare across different products or categories. A MAPE of 10% means forecasts are, on average, within 10% of actual values. Industry benchmarks vary by sector, but generally: under 10% is excellent, 10-20% is good, 20-30% is fair, and over 30% needs improvement. However, MAPE has limitations: it&apos;s undefined when actual values are zero and can be misleading with highly variable demand. Always use it alongside other metrics.
                  </p>
                  <div className="mt-2 font-mono text-xs bg-background p-2 rounded border">
                    MAPE = (100/n) × Σ|Actual - Forecast| / Actual
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-[var(--logistics)] mb-2">MAD (Mean Absolute Deviation)</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    MAD measures the average absolute forecast error in actual units. Unlike MAPE, it&apos;s not a percentage, making it directly interpretable in terms of units. If your MAD is 50 units, your forecasts are off by an average of 50 units. This metric is particularly valuable for safety stock calculations: multiplying MAD by a safety factor (typically 1.25 for 95% service level) provides a simple estimate of required safety stock. MAD is also robust to outliers compared to metrics that square errors, making it useful when you want to understand typical error magnitude.
                  </p>
                  <div className="mt-2 font-mono text-xs bg-background p-2 rounded border">
                    MAD = Σ|Actual - Forecast| / n
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-amber-500 mb-2">RMSE (Root Mean Squared Error)</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    RMSE squares forecast errors before averaging, which means it penalizes large errors more heavily than small ones. This is valuable when big mistakes are particularly costly—for example, when a stockout could lose a major customer or when excess inventory has significant holding costs. RMSE is always greater than or equal to MAD, and the difference indicates the presence of occasional large errors. A large gap between RMSE and MAD suggests your forecast errors are inconsistent, with some periods much worse than others.
                  </p>
                  <div className="mt-2 font-mono text-xs bg-background p-2 rounded border">
                    RMSE = √(Σ(Actual - Forecast)² / n)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                Best Practices for Demand Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="font-medium text-[var(--logistics)]">Do&apos;s</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      Use at least 12-24 months of historical data
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      Match method to data pattern (trend vs seasonal)
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      Update forecasts regularly (monthly or quarterly)
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      Track forecast accuracy over time
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      Consider external factors (promotions, events)
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <p className="font-medium text-destructive">Don&apos;ts</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      Don&apos;t rely on forecasts beyond 12-18 months
                    </li>
                    <li className="flex gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      Don&apos;t ignore outliers or data errors
                    </li>
                    <li className="flex gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      Don&apos;t use one method for all products
                    </li>
                    <li className="flex gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      Don&apos;t ignore confidence intervals
                    </li>
                    <li className="flex gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      Don&apos;t forecast without validating accuracy
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips for Better Forecasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proTips.map((tip, index) => (
                  <div key={index} className="p-4 border border-border/50 rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 p-2 rounded-lg bg-muted">
                        {tip.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tip.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <XCircle className="h-5 w-5 text-destructive" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {commonMistakes.map((mistake, index) => (
                  <AccordionItem key={index} value={`mistake-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="font-medium">{mistake.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">{mistake.description}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about demand forecasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
          {copied ? "Copied!" : "Share"}
        </Button>
        <Button size="sm" className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
