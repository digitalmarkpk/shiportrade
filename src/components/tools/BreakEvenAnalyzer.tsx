'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Package,
  BarChart3,
  Info,
  RefreshCw,
  AlertTriangle,
  PieChart,
  Download,
  Share2,
  BookOpen,
  HelpCircle,
  Zap,
  LineChart,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Cell,
} from 'recharts';

interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginPercent: number;
  marginOfSafety: number;
  marginOfSafetyPercent: number;
  profitAtTargetSales: number;
  salesNeededForTargetProfit: number;
  sensitivityAnalysis: {
    scenario: string;
    breakEvenUnits: number;
    profit: number;
    change: number;
  }[];
  costBreakdown: {
    fixedCosts: number;
    variableCosts: number;
    totalCosts: number;
  };
  recommendation: string;
}

const FAQS = [
  {
    question: "What is break-even analysis and why is it important for my business?",
    answer: "Break-even analysis is a fundamental financial tool that determines the exact point where your total revenue equals your total costs, resulting in neither profit nor loss. This critical metric tells you the minimum sales volume needed to cover all expenses before generating profit. Understanding your break-even point is essential for pricing decisions, investment planning, and risk assessment. It helps you evaluate the viability of new products, set realistic sales targets, and understand how changes in costs or prices affect your profitability. For international traders, break-even analysis is particularly valuable when negotiating supplier contracts, setting selling prices in different markets, and planning inventory levels.",
  },
  {
    question: "How do I distinguish between fixed and variable costs in my business?",
    answer: "Fixed costs remain constant regardless of your production or sales volume within a relevant range. Examples include rent, insurance premiums, salaries of permanent staff, equipment depreciation, loan interest payments, and property taxes. These costs must be paid even if you produce zero units. Variable costs, on the other hand, change directly in proportion to your production or sales volume. Examples include raw materials, direct labor costs, shipping fees, sales commissions, packaging materials, and import duties. The key distinction is whether the cost would change if you produced one more or one less unit. Some costs are semi-variable (mixed), containing both fixed and variable components, such as utilities with a base charge plus usage fees. For accurate break-even calculations, you must properly separate these mixed costs into their fixed and variable elements.",
  },
  {
    question: "What is contribution margin and how does it affect break-even point?",
    answer: "Contribution margin represents the portion of each sale that contributes to covering fixed costs and generating profit. It is calculated as the selling price per unit minus the variable cost per unit. For example, if you sell a product for $100 and your variable cost is $60, your contribution margin is $40 per unit. The contribution margin ratio (contribution margin divided by selling price) shows what percentage of each sales dollar goes toward fixed costs and profit. A higher contribution margin means you need fewer units to break even. Businesses can improve their contribution margin by increasing prices, reducing variable costs through better supplier negotiations, improving operational efficiency, or focusing on higher-margin products. The break-even point in units equals total fixed costs divided by the contribution margin per unit.",
  },
  {
    question: "What is margin of safety and how should I interpret it?",
    answer: "Margin of safety measures the difference between your actual or expected sales and the break-even point, expressed either in units, revenue, or as a percentage. It indicates how much sales can decline before you start incurring losses. For example, if your break-even point is 5,000 units and you expect to sell 7,000 units, your margin of safety is 2,000 units or 28.6%. A higher margin of safety indicates lower risk and greater resilience to market fluctuations, unexpected competition, or economic downturns. Industry standards vary: a 10-15% margin of safety might be acceptable for stable, mature businesses, while startups and high-risk ventures should target 30-50% or higher. If your margin of safety is too low, consider strategies like reducing fixed costs, improving contribution margins, or diversifying your product portfolio.",
  },
  {
    question: "How can I use break-even analysis for pricing decisions?",
    answer: "Break-even analysis is invaluable for strategic pricing decisions. First, it establishes your minimum viable price - you cannot sustainably price below the point where contribution margin becomes negative. Second, it helps evaluate pricing scenarios: you can model how different price points affect your break-even volume and profit potential. Higher prices increase contribution margin and lower break-even units, but may reduce demand. Third, it supports competitive analysis by calculating the volume needed to compete on price while maintaining profitability. Fourth, it aids in product line decisions by comparing break-even points across different products to optimize your portfolio. Fifth, it helps in promotional planning by calculating the additional volume needed to justify discounts. Always consider market elasticity, competitive positioning, and customer value perception alongside break-even calculations when setting prices.",
  },
  {
    question: "How does break-even analysis apply to service businesses?",
    answer: "Service businesses can absolutely use break-even analysis with some adaptations. Instead of units sold, service businesses typically measure volume in billable hours, project engagements, or customer contracts. Fixed costs often include professional salaries, office overhead, software licenses, and marketing expenses. Variable costs typically include contractor fees, project-specific materials, travel expenses, and payment processing fees. The contribution margin is calculated per billable hour or per project. For example, a consulting firm with $500,000 in annual fixed costs, an average hourly rate of $200, and variable costs of $50 per hour has a contribution margin of $150 per hour and a break-even point of 3,333 billable hours per year. Service businesses should also consider capacity constraints - you cannot exceed available billable hours, which adds another dimension to break-even planning.",
  },
  {
    question: "What are common mistakes to avoid when performing break-even analysis?",
    answer: "Several critical mistakes can undermine break-even analysis accuracy. First, misclassifying costs as fixed or variable leads to incorrect calculations - take time to analyze each cost carefully. Second, ignoring semi-variable costs instead of properly separating them into fixed and variable components distorts results. Third, using outdated cost data fails to reflect current market conditions - update your inputs regularly. Fourth, assuming constant selling prices ignores volume discounts, promotional pricing, and market dynamics. Fifth, neglecting capacity constraints assumes unlimited production capability, which is rarely realistic. Sixth, overlooking the time value of money for long-term break-even projections can lead to poor investment decisions. Seventh, failing to account for changes in efficiency at different production levels ignores economies or diseconomies of scale. Finally, not performing sensitivity analysis leaves you unprepared for variations in key assumptions. Always validate your analysis with multiple scenarios and real-world considerations.",
  },
];

const PRO_TIPS = [
  {
    title: "Review Fixed Costs Regularly",
    description: "Fixed costs can creep up over time. Conduct quarterly reviews to identify opportunities for cost reduction or optimization.",
    icon: TrendingDown,
  },
  {
    title: "Monitor Contribution Margin Trends",
    description: "Track your contribution margin over time. Declining margins often signal pricing pressure or cost increases that need attention.",
    icon: TrendingUp,
  },
  {
    title: "Build Buffer into Projections",
    description: "Add 10-15% buffer to your break-even calculation to account for unexpected costs or market fluctuations.",
    icon: Target,
  },
  {
    title: "Segment by Product Line",
    description: "Calculate break-even points for each product or service line to identify your most and least profitable offerings.",
    icon: Package,
  },
  {
    title: "Consider Cash Flow Impact",
    description: "Break-even focuses on profitability, but ensure you also model cash flow timing, especially for seasonal businesses.",
    icon: DollarSign,
  },
];

export default function BreakEvenAnalyzer() {
  const [sellingPrice, setSellingPrice] = useState('50');
  const [variableCost, setVariableCost] = useState('30');
  const [fixedCosts, setFixedCosts] = useState('100000');
  const [targetSales, setTargetSales] = useState('10000');
  const [targetProfit, setTargetProfit] = useState('50000');
  const [currency, setCurrency] = useState('USD');
  const [activeTab, setActiveTab] = useState('calculator');

  const result = useMemo<BreakEvenResult | null>(() => {
    const price = parseFloat(sellingPrice) || 0;
    const variable = parseFloat(variableCost) || 0;
    const fixed = parseFloat(fixedCosts) || 0;
    const targetUnits = parseFloat(targetSales) || 0;
    const targetProfitAmount = parseFloat(targetProfit) || 0;

    if (price <= variable) {
      return null;
    }

    // Contribution margin per unit
    const contributionMargin = price - variable;
    const contributionMarginPercent = (contributionMargin / price) * 100;

    // Break-even point in units
    const breakEvenUnits = Math.ceil(fixed / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * price;

    // Profit at target sales
    const profitAtTargetSales = (targetUnits * contributionMargin) - fixed;

    // Sales needed for target profit
    const salesNeededForTargetProfit = Math.ceil((fixed + targetProfitAmount) / contributionMargin);

    // Margin of safety
    const marginOfSafety = targetUnits - breakEvenUnits;
    const marginOfSafetyPercent = targetUnits > 0 ? (marginOfSafety / targetUnits) * 100 : 0;

    // Cost breakdown
    const variableCostsAtTarget = targetUnits * variable;
    const totalCosts = fixed + variableCostsAtTarget;

    // Sensitivity analysis
    const sensitivityAnalysis = [
      {
        scenario: 'Price -10%',
        breakEvenUnits: Math.ceil(fixed / (price * 0.9 - variable)),
        profit: ((targetUnits * (price * 0.9 - variable)) - fixed),
        change: 0,
      },
      {
        scenario: 'Price +10%',
        breakEvenUnits: Math.ceil(fixed / (price * 1.1 - variable)),
        profit: ((targetUnits * (price * 1.1 - variable)) - fixed),
        change: 0,
      },
      {
        scenario: 'Variable Cost +10%',
        breakEvenUnits: Math.ceil(fixed / (price - variable * 1.1)),
        profit: ((targetUnits * (price - variable * 1.1)) - fixed),
        change: 0,
      },
      {
        scenario: 'Variable Cost -10%',
        breakEvenUnits: Math.ceil(fixed / (price - variable * 0.9)),
        profit: ((targetUnits * (price - variable * 0.9)) - fixed),
        change: 0,
      },
      {
        scenario: 'Fixed Costs +20%',
        breakEvenUnits: Math.ceil((fixed * 1.2) / contributionMargin),
        profit: ((targetUnits * contributionMargin) - fixed * 1.2),
        change: 0,
      },
    ];

    // Calculate change percentages
    sensitivityAnalysis.forEach((item) => {
      item.change = ((item.breakEvenUnits - breakEvenUnits) / breakEvenUnits) * 100;
    });

    // Generate recommendation
    let recommendation = '';
    if (marginOfSafetyPercent < 10) {
      recommendation = 'Warning: Low margin of safety. Your break-even point is very close to target sales. Consider reducing costs or increasing prices.';
    } else if (marginOfSafetyPercent < 20) {
      recommendation = 'Moderate margin of safety. Consider strategies to improve contribution margin or reduce fixed costs.';
    } else if (contributionMarginPercent < 20) {
      recommendation = 'Low contribution margin. Focus on reducing variable costs or negotiating better selling prices.';
    } else {
      recommendation = 'Healthy break-even position. Continue monitoring costs and market conditions.';
    }

    if (profitAtTargetSales < 0) {
      recommendation = `Current target sales of ${targetUnits.toLocaleString()} units is below break-even. You need to sell at least ${breakEvenUnits.toLocaleString()} units to cover costs.`;
    }

    return {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginPercent,
      marginOfSafety,
      marginOfSafetyPercent,
      profitAtTargetSales,
      salesNeededForTargetProfit,
      sensitivityAnalysis,
      costBreakdown: {
        fixedCosts: fixed,
        variableCosts: variableCostsAtTarget,
        totalCosts,
      },
      recommendation,
    };
  }, [sellingPrice, variableCost, fixedCosts, targetSales, targetProfit]);

  // Chart data
  const breakEvenChartData = useMemo(() => {
    if (!result) return [];
    
    const data = [];
    const maxUnits = Math.max(result.breakEvenUnits * 2, parseFloat(targetSales) * 1.2);
    const price = parseFloat(sellingPrice) || 50;
    const variable = parseFloat(variableCost) || 30;
    const fixed = parseFloat(fixedCosts) || 100000;
    const step = Math.ceil(maxUnits / 10);
    
    for (let units = 0; units <= maxUnits; units += step) {
      const revenue = units * price;
      const totalCost = fixed + (units * variable);
      const profit = revenue - totalCost;
      
      data.push({
        units,
        revenue,
        totalCost,
        profit,
      });
    }
    
    return data;
  }, [result, sellingPrice, variableCost, fixedCosts, targetSales]);

  const costStructureData = useMemo(() => {
    if (!result) return [];
    
    return [
      { name: 'Fixed Costs', value: result.costBreakdown.fixedCosts, fill: '#0F4C81' },
      { name: 'Variable Costs', value: result.costBreakdown.variableCosts, fill: '#2E8B57' },
    ];
  }, [result]);

  const scenarioComparisonData = useMemo(() => {
    if (!result) return [];
    
    return result.sensitivityAnalysis.map(item => ({
      name: item.scenario,
      breakEven: item.breakEvenUnits,
      profit: item.profit,
      change: item.change,
    }));
  }, [result]);

  const resetForm = () => {
    setSellingPrice('50');
    setVariableCost('30');
    setFixedCosts('100000');
    setTargetSales('10000');
    setTargetProfit('50000');
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'CNY' ? '¥' : currency;

  const getSafetyColor = (percent: number) => {
    if (percent < 10) return '#EF4444';
    if (percent < 20) return '#F59E0B';
    if (percent < 30) return '#22C55E';
    return '#10B981';
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[var(--ocean)] text-white">
                <Target className="h-3 w-3 mr-1" />
                Financial Analysis
              </Badge>
              <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                <Zap className="h-3 w-3 mr-1" />
                Business Planning
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Break-Even Analysis Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Calculate your break-even point, margin of safety, and profit projections. 
              Understand cost structures and make informed pricing decisions for your business.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Scenarios</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                    Pricing & Costs
                  </CardTitle>
                  <CardDescription>
                    Enter your unit economics and cost structure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CNY">CNY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice">Selling Price per Unit</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                        <Input
                          id="sellingPrice"
                          type="number"
                          value={sellingPrice}
                          onChange={(e) => setSellingPrice(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variableCost">Variable Cost per Unit</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                        <Input
                          id="variableCost"
                          type="number"
                          value={variableCost}
                          onChange={(e) => setVariableCost(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fixedCosts">Total Fixed Costs (Period)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                      <Input
                        id="fixedCosts"
                        type="number"
                        value={fixedCosts}
                        onChange={(e) => setFixedCosts(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Include rent, salaries, insurance, equipment depreciation, etc.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-[var(--logistics)]" />
                    Targets & Goals
                  </CardTitle>
                  <CardDescription>
                    Set your sales targets and profit goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetSales">Target Sales (Units)</Label>
                      <Input
                        id="targetSales"
                        type="number"
                        value={targetSales}
                        onChange={(e) => setTargetSales(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetProfit">Target Profit</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                        <Input
                          id="targetProfit"
                          type="number"
                          value={targetProfit}
                          onChange={(e) => setTargetProfit(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contribution Margin Preview */}
              {result && (
                <Card className="border-[var(--logistics)]/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Contribution Margin</p>
                        <p className="text-2xl font-bold text-[var(--logistics)]">
                          {currencySymbol}{result.contributionMargin} <span className="text-sm font-normal">per unit</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Margin Ratio</p>
                        <p className="text-2xl font-bold text-[var(--ocean)]">
                          {result.contributionMarginPercent.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card className="overflow-hidden border-2 border-[var(--ocean)]/20">
                <div className="h-2 bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)]" />
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[var(--ocean)]" />
                    Break-Even Analysis
                  </CardTitle>
                  <CardDescription>
                    Your break-even point and safety margin
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {result ? (
                    <>
                      {/* Primary Results */}
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          key={result.breakEvenUnits}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center"
                        >
                          <div className="text-3xl font-bold text-[var(--ocean)]">
                            {result.breakEvenUnits.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Break-Even Units</div>
                        </motion.div>
                        <motion.div
                          key={result.breakEvenRevenue}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center"
                        >
                          <div className="text-3xl font-bold text-[var(--logistics)]">
                            {currencySymbol}{result.breakEvenRevenue.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Break-Even Revenue</div>
                        </motion.div>
                      </div>

                      {/* Margin of Safety */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Margin of Safety</span>
                          <span className="font-medium" style={{ color: getSafetyColor(result.marginOfSafetyPercent) }}>
                            {result.marginOfSafetyPercent.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={Math.min(result.marginOfSafetyPercent, 100)} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{result.marginOfSafety.toLocaleString()} units buffer</span>
                          <span>{result.marginOfSafetyPercent < 10 ? 'High Risk' : result.marginOfSafetyPercent < 20 ? 'Moderate' : 'Healthy'}</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Profit Analysis */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted-foreground">Profit at Target Sales</span>
                          <Badge className={result.profitAtTargetSales >= 0 ? 'bg-[var(--logistics)]' : 'bg-red-500'}>
                            {currencySymbol}{result.profitAtTargetSales.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted-foreground">Units for Target Profit</span>
                          <Badge variant="secondary">{result.salesNeededForTargetProfit.toLocaleString()}</Badge>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className={`rounded-lg p-4 ${
                        result.marginOfSafetyPercent < 10 
                          ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                          : result.marginOfSafetyPercent < 20
                          ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
                          : 'bg-[var(--logistics)]/5 border border-[var(--logistics)]/20'
                      }`}>
                        <div className="flex items-start gap-3">
                          {result.marginOfSafetyPercent < 20 ? (
                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className={`font-semibold text-sm ${
                              result.marginOfSafetyPercent < 10 
                                ? 'text-red-700 dark:text-red-300'
                                : result.marginOfSafetyPercent < 20
                                ? 'text-amber-700 dark:text-amber-300'
                                : 'text-[var(--logistics)]'
                            }`}>
                              Recommendation
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Target className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        Enter valid parameters to see break-even analysis
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Selling price must be greater than variable cost
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              {result && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-[var(--ocean)]" />
                      Cost Structure at Target
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-[var(--ocean)]" />
                          <span className="text-sm">Fixed Costs</span>
                        </div>
                        <span className="font-medium">{currencySymbol}{result.costBreakdown.fixedCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-[var(--logistics)]" />
                          <span className="text-sm">Variable Costs</span>
                        </div>
                        <span className="font-medium">{currencySymbol}{result.costBreakdown.variableCosts.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Total Costs</span>
                        <span className="font-bold text-[var(--ocean)]">{currencySymbol}{result.costBreakdown.totalCosts.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                  Break-Even Chart
                </CardTitle>
                <CardDescription>
                  Revenue vs Total Costs intersection point
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={breakEvenChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="units" 
                        tickFormatter={(value) => value.toLocaleString()}
                        className="text-xs"
                      />
                      <YAxis 
                        tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
                        className="text-xs"
                      />
                      <Tooltip 
                        formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`}
                        labelFormatter={(label) => `${label.toLocaleString()} units`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Revenue"
                        stroke="#0F4C81" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalCost" 
                        name="Total Costs"
                        stroke="#EF4444" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--logistics)]" />
                  Cost Structure
                </CardTitle>
                <CardDescription>
                  Fixed vs Variable cost distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costStructureData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                      <Bar dataKey="value" name="Cost" radius={[0, 4, 4, 0]}>
                        {costStructureData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                  Profit Zones
                </CardTitle>
                <CardDescription>
                  Profit and loss regions across sales volumes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={breakEvenChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="units" 
                        tickFormatter={(value) => value.toLocaleString()}
                        className="text-xs"
                      />
                      <YAxis 
                        tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
                        className="text-xs"
                      />
                      <Tooltip 
                        formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`}
                        labelFormatter={(label) => `${label.toLocaleString()} units`}
                      />
                      <defs>
                        <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2E8B57" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#2E8B57" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="lossGradient" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="profit" 
                        name="Profit/Loss"
                        stroke="#2E8B57"
                        fill="url(#profitGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded bg-[var(--logistics)]" />
                    <span>Profit Zone (Above Break-Even)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded bg-red-400" />
                    <span>Loss Zone (Below Break-Even)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Key Metrics Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[var(--ocean)]">{result.breakEvenUnits.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Break-Even Units</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[var(--logistics)]">{result.marginOfSafetyPercent.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Margin of Safety</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[var(--ocean)]">{result.contributionMarginPercent.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Contribution Ratio</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className={`text-2xl font-bold ${result.profitAtTargetSales >= 0 ? 'text-[var(--logistics)]' : 'text-red-500'}`}>
                      {currencySymbol}{result.profitAtTargetSales.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Projected Profit</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[var(--ocean)]" />
                Sensitivity Analysis
              </CardTitle>
              <CardDescription>
                See how changes in price and costs affect your break-even point
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Scenario</th>
                          <th className="text-center py-3 px-4 font-semibold">Break-Even Units</th>
                          <th className="text-center py-3 px-4 font-semibold">Change</th>
                          <th className="text-center py-3 px-4 font-semibold">Profit Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.sensitivityAnalysis.map((scenario, index) => (
                          <tr key={index} className={`border-b border-border ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                            <td className="py-3 px-4">{scenario.scenario}</td>
                            <td className="text-center py-3 px-4">
                              <Badge variant="outline">{scenario.breakEvenUnits.toLocaleString()}</Badge>
                            </td>
                            <td className="text-center py-3 px-4">
                              <Badge className={scenario.change > 0 ? 'bg-red-500' : scenario.change < 0 ? 'bg-[var(--logistics)]' : 'bg-muted'}>
                                {scenario.change > 0 ? '+' : ''}{scenario.change.toFixed(1)}%
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className={scenario.profit < result.profitAtTargetSales ? 'text-red-600' : 'text-[var(--logistics)]'}>
                                {currencySymbol}{scenario.profit.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={scenarioComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={60} />
                          <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" className="text-xs" />
                          <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" className="text-xs" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="breakEven" name="Break-Even Units" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                          <Line yAxisId="right" type="monotone" dataKey="profit" name="Profit ($)" stroke="#2E8B57" strokeWidth={2} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-[var(--ocean)]/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-[var(--ocean)]" />
                      <p className="font-semibold text-[var(--ocean)]">Key Insights</p>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)]" />
                        A 10% price increase reduces break-even by {((result.sensitivityAnalysis[1].breakEvenUnits - result.breakEvenUnits) / result.breakEvenUnits * -100).toFixed(1)}%
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)]" />
                        A 10% increase in variable costs raises break-even by {((result.sensitivityAnalysis[2].breakEvenUnits - result.breakEvenUnits) / result.breakEvenUnits * 100).toFixed(1)}%
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)]" />
                        Focus on improving contribution margin for maximum impact on profitability
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Run the calculator first to see sensitivity analysis
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  Understanding Break-Even Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Break-even analysis is a fundamental financial tool that determines the exact point where total revenue equals total costs. At this point, a business experiences neither profit nor loss—it simply "breaks even." This critical metric is essential for informed decision-making across pricing, production planning, and investment evaluation.
                </p>
                <p>
                  The break-even point represents the minimum sales volume required to cover all operating expenses. Below this threshold, the business operates at a loss; above it, profits accumulate. Understanding your break-even point helps you set realistic sales targets, evaluate business viability, and make strategic decisions about cost structure and pricing.
                </p>
                <p>
                  For international traders, break-even analysis is particularly valuable when evaluating new markets, negotiating supplier contracts, or setting prices across different currencies and jurisdictions. It provides a clear framework for understanding the relationship between costs, volume, and profitability.
                </p>
                <div className="p-4 bg-muted/50 rounded-lg font-mono text-xs space-y-2">
                  <p className="font-semibold">Key Formulas:</p>
                  <p>Break-Even Units = Fixed Costs ÷ Contribution Margin</p>
                  <p>Contribution Margin = Selling Price - Variable Cost</p>
                  <p>Margin of Safety = Target Sales - Break-Even Units</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[var(--logistics)]" />
                  Fixed vs Variable Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Fixed Costs</strong> remain constant regardless of production or sales volume within a relevant range. These are obligations that must be paid even if you produce zero units. Common fixed costs include rent or lease payments, insurance premiums, salaries of permanent employees, equipment depreciation, loan interest payments, property taxes, and administrative overhead.
                </p>
                <p>
                  <strong className="text-foreground">Variable Costs</strong> change directly in proportion to production or sales volume. These costs increase as you produce more and decrease as you produce less. Common variable costs include raw materials, direct labor costs, shipping and freight charges, sales commissions, packaging materials, import duties, and payment processing fees.
                </p>
                <p>
                  Some costs are <strong className="text-foreground">semi-variable</strong> (mixed), containing both fixed and variable components. Examples include utilities (base charge plus usage), maintenance costs, and certain labor categories with overtime provisions. For accurate break-even calculations, these must be separated into their fixed and variable elements.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
                    <p className="font-semibold text-[var(--ocean)] mb-2">Fixed Examples</p>
                    <ul className="text-xs space-y-1">
                      <li>• Rent & Insurance</li>
                      <li>• Salaries</li>
                      <li>• Equipment Depreciation</li>
                      <li>• Property Taxes</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
                    <p className="font-semibold text-[var(--logistics)] mb-2">Variable Examples</p>
                    <ul className="text-xs space-y-1">
                      <li>• Raw Materials</li>
                      <li>• Direct Labor</li>
                      <li>• Shipping Costs</li>
                      <li>• Sales Commissions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Margin of Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  The margin of safety measures the difference between your actual or expected sales and the break-even point. It represents the "cushion" you have before incurring losses. A higher margin of safety indicates lower business risk and greater resilience to market fluctuations, unexpected competition, or economic downturns.
                </p>
                <p>
                  The margin of safety can be expressed in three ways: absolute units (the number of units above break-even), revenue (the dollar amount above break-even revenue), or as a percentage of expected sales. The percentage form is most useful for comparing across different products or business units of varying sizes.
                </p>
                <p>
                  Industry benchmarks for acceptable margin of safety vary significantly. Stable, mature businesses might operate comfortably with 10-15% margins, while startups and high-risk ventures should target 30-50% or higher. Seasonal businesses need to consider that their margin of safety will fluctuate throughout the year.
                </p>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg text-center">
                    <div className="text-xs font-semibold text-red-600">Below 10%</div>
                    <div className="text-xs text-muted-foreground">High Risk</div>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-center">
                    <div className="text-xs font-semibold text-amber-600">10-20%</div>
                    <div className="text-xs text-muted-foreground">Moderate</div>
                  </div>
                  <div className="p-3 bg-[var(--logistics)]/10 rounded-lg text-center">
                    <div className="text-xs font-semibold text-[var(--logistics)]">Above 20%</div>
                    <div className="text-xs text-muted-foreground">Healthy</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                  Using Break-Even for Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Break-even analysis is invaluable for strategic pricing decisions. First, it establishes your minimum viable price—you cannot sustainably price below the point where contribution margin becomes negative. This sets a floor for pricing negotiations and promotional activities.
                </p>
                <p>
                  Second, break-even analysis helps evaluate pricing scenarios. You can model how different price points affect your break-even volume and profit potential. Higher prices increase contribution margin and lower break-even units, but may reduce market demand. The optimal price balances margin improvement against volume reduction.
                </p>
                <p>
                  Third, it supports competitive analysis by calculating the volume needed to compete on price while maintaining profitability. Fourth, it aids in product line decisions by comparing break-even points across different products to optimize your portfolio. Fifth, it helps in promotional planning by calculating the additional volume needed to justify discounts or special offers.
                </p>
                <div className="p-4 bg-muted/50 rounded-lg mt-4">
                  <p className="font-semibold text-sm mb-2">Pricing Strategy Considerations:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Market price sensitivity and demand elasticity</li>
                    <li>• Competitive positioning and differentiation</li>
                    <li>• Customer value perception</li>
                    <li>• Volume and margin trade-offs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for Break-Even Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PRO_TIPS.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-muted/30 rounded-lg">
                      <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about break-even analysis and cost management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Break-Even Formula</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm">
                  BE Units = FC ÷ (P - VC)
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  FC = Fixed Costs, P = Price, VC = Variable Cost
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Contribution Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm">
                  CM = P - VC
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Amount per unit that covers fixed costs and profit
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Margin of Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm">
                  MOS% = (Actual - BE) ÷ Actual × 100
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Percentage buffer above break-even point
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
