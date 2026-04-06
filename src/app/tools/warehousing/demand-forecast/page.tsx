import { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Target,
  LineChart,
  BarChart3,
  Calculator,
  Calendar,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DemandForecastModel } from "@/components/tools/DemandForecastModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Demand Forecast Model | Shiportrade.com",
  description: "Generate accurate demand forecasts using Moving Average, Exponential Smoothing, Holt-Winters, and Linear Regression methods. Calculate MAPE, MAD, MSE accuracy metrics.",
  keywords: ["demand forecast", "forecasting model", "moving average", "exponential smoothing", "holt winters", "linear regression", "MAPE", "demand planning"],
  openGraph: {
    title: "Demand Forecast Model - Inventory Planning Tool",
    description: "Generate accurate demand forecasts with multiple methods. Analyze seasonality, trends, and accuracy metrics.",
    type: "website",
  },
};

export default function DemandForecastPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/warehousing" className="hover:text-foreground">Warehousing</Link>
        <span>/</span>
        <span className="text-foreground">Demand Forecast Model</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Demand Forecast Model</h1>
            <p className="text-muted-foreground">Predict future demand with statistical forecasting methods</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <DemandForecastModel />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Demand Forecasting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Demand Forecasting?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Demand forecasting</strong> is the process of predicting future customer demand 
              for a product or service using historical data and statistical methods. Accurate 
              forecasting helps businesses optimize inventory levels, production planning, and 
              resource allocation.
            </p>
            <p className="text-muted-foreground mt-3">
              Effective demand forecasting reduces both stockouts (lost sales) and overstock 
              situations (excess inventory costs), directly impacting profitability and customer 
              satisfaction.
            </p>
          </CardContent>
        </Card>

        {/* Forecast Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[var(--ocean)]" />
              Forecast Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <BarChart3 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Moving Average:</strong> Averages recent periods, best for stable demand
                </span>
              </li>
              <li className="flex items-start gap-2">
                <LineChart className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Exponential Smoothing:</strong> Weighted average favoring recent data
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Activity className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Holt-Winters:</strong> Handles trend and seasonality together
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Linear Regression:</strong> Projects trend line for consistent patterns
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Accuracy Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-[var(--ocean)]" />
              Accuracy Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>MAPE:</strong> Mean Absolute Percentage Error - scale-independent accuracy
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>MAD:</strong> Mean Absolute Deviation - error in actual units
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>MSE:</strong> Mean Squared Error - penalizes large errors
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>RMSE:</strong> Root MSE - in same units as demand
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Method Selection Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Forecast Method Selection Guide</CardTitle>
          <CardDescription>Choose the right method based on your demand pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Demand Pattern</th>
                  <th className="text-left py-3 px-4">Recommended Method</th>
                  <th className="text-left py-3 px-4">Key Parameters</th>
                  <th className="text-left py-3 px-4">Accuracy Expectation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Stable, no trend</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-[var(--ocean)]">Moving Average</Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">3-6 periods</td>
                  <td className="py-3 px-4 text-muted-foreground">High (MAPE &lt;10%)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Recent trend visible</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-[var(--logistics)]">Exponential Smoothing</Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">α = 0.2-0.4</td>
                  <td className="py-3 px-4 text-muted-foreground">Good (MAPE 10-15%)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Clear upward/downward trend</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-amber-500">Linear Regression</Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">12+ data points</td>
                  <td className="py-3 px-4 text-muted-foreground">Good for trend, poor for seasonality</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Seasonal + trend</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-purple-500">Holt-Winters</Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">α, β, γ + season length</td>
                  <td className="py-3 px-4 text-muted-foreground">Best for complex patterns</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">New product (limited data)</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">Judgmental/Analogy</Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">Similar products</td>
                  <td className="py-3 px-4 text-muted-foreground">Variable, improve over time</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tips & Mistakes */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-[var(--logistics)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[var(--logistics)]">
              <Lightbulb className="h-5 w-5" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use at least 12-24 months of historical data for reliable forecasts
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Clean data before forecasting - remove outliers and correct errors
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Test multiple methods and compare MAPE to find the best fit
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Adjust forecasts for known events (promotions, holidays, new products)
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Update forecasts regularly - at least monthly for fast-moving items
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use confidence intervals to plan safety stock levels
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using one method for all products regardless of demand pattern
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forecasting too far ahead (accuracy drops significantly after 12 months)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring seasonality in products with clear seasonal patterns
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not tracking forecast accuracy over time
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Failing to adjust for one-time events (stockouts, promotions)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using forecasts without understanding confidence intervals
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Seasonality Detection */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[var(--ocean)]" />
            Understanding Seasonality
          </CardTitle>
          <CardDescription>Recognizing and handling seasonal demand patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium mb-3">Types of Seasonality</p>
              <div className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-[var(--ocean)]">Additive Seasonality</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seasonal fluctuations are constant regardless of demand level. 
                    Example: Sales increase by 500 units every December, whether base demand is 1000 or 5000.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-[var(--logistics)]">Multiplicative Seasonality</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seasonal fluctuations scale with demand level. 
                    Example: Sales increase by 20% every December, so seasonal effect grows with base demand.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="font-medium mb-3">Common Seasonality Patterns</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Retail & E-commerce</p>
                    <p className="text-xs text-muted-foreground">Holiday shopping season</p>
                  </div>
                  <Badge className="bg-[var(--ocean)]">Q4 Peak</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Beverages & Ice Cream</p>
                    <p className="text-xs text-muted-foreground">Weather-dependent consumption</p>
                  </div>
                  <Badge className="bg-[var(--logistics)]">Summer Peak</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Heating Equipment</p>
                    <p className="text-xs text-muted-foreground">Temperature-driven demand</p>
                  </div>
                  <Badge variant="outline">Winter Peak</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Apparel & Fashion</p>
                    <p className="text-xs text-muted-foreground">Seasonal collections</p>
                  </div>
                  <Badge variant="outline">Multi-peak</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MAPE Interpretation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>MAPE Interpretation Guide</CardTitle>
          <CardDescription>Understanding forecast accuracy benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-[var(--logistics)]">&lt;10%</p>
              <p className="text-sm font-medium mt-1">Excellent</p>
              <p className="text-xs text-muted-foreground mt-1">Highly accurate forecast</p>
            </div>
            <div className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-[var(--ocean)]">10-20%</p>
              <p className="text-sm font-medium mt-1">Good</p>
              <p className="text-xs text-muted-foreground mt-1">Acceptable for most planning</p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-amber-500">20-30%</p>
              <p className="text-sm font-medium mt-1">Fair</p>
              <p className="text-xs text-muted-foreground mt-1">Consider method improvements</p>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-destructive">&gt;30%</p>
              <p className="text-sm font-medium mt-1">Poor</p>
              <p className="text-xs text-muted-foreground mt-1">Review data and methods</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <Info className="h-4 w-4 inline mr-1 text-[var(--ocean)]" />
              <strong>Note:</strong> MAPE benchmarks vary by industry. Retail typically sees 15-30% MAPE, 
              while manufacturing may achieve &lt;10% for stable products. Compare against your historical 
              accuracy rather than absolute benchmarks.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>How much historical data do I need for accurate forecasting?</AccordionTrigger>
              <AccordionContent>
                Minimum: 12 months for basic methods, 24+ months for seasonal analysis. More data 
                generally improves accuracy, but very old data may not reflect current demand patterns. 
                For Holt-Winters with 12-month seasonality, you need at least 2-3 full seasonal cycles 
                (24-36 months) to properly estimate seasonal factors.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Which forecasting method should I use?</AccordionTrigger>
              <AccordionContent>
                It depends on your demand pattern: Use <strong>Moving Average</strong> for stable demand 
                without trends. Use <strong>Exponential Smoothing</strong> when recent trends matter more 
                than older data. Use <strong>Holt-Winters</strong> when you have both trend and seasonality. 
                Use <strong>Linear Regression</strong> for consistent upward/downward trends. Test multiple 
                methods and compare MAPE to find the best fit for your data.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What is the difference between MAPE, MAD, and RMSE?</AccordionTrigger>
              <AccordionContent>
                <strong>MAPE</strong> (Mean Absolute Percentage Error) shows error as a percentage, 
                making it easy to compare across products. <strong>MAD</strong> (Mean Absolute Deviation) 
                shows error in actual units, useful for safety stock calculations (MAD × 1.25 ≈ standard 
                deviation). <strong>RMSE</strong> (Root Mean Squared Error) penalizes large errors more 
                heavily, useful when big forecasting mistakes are costly. Use all three for a complete 
                accuracy picture.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How far ahead should I forecast?</AccordionTrigger>
              <AccordionContent>
                Forecast accuracy decreases significantly beyond 12-18 months. For operational planning, 
                use 3-12 month horizons. For strategic planning (capacity, contracts), use 12-24 months 
                but expect higher uncertainty. Update short-term forecasts monthly and long-term forecasts 
                quarterly. The confidence interval width shows how uncertainty grows with forecast horizon.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How do I handle outliers in historical data?</AccordionTrigger>
              <AccordionContent>
                Identify outliers by looking for data points more than 3 standard deviations from the 
                mean or visually on a chart. Determine the cause: one-time events (stockouts, promotions), 
                data errors, or real demand spikes. For one-time events, adjust the data point to reflect 
                &quot;normal&quot; demand. For errors, correct them. For real spikes, keep them but consider 
                their impact on trend detection. Document all adjustments.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>Can I use this for new products with no history?</AccordionTrigger>
              <AccordionContent>
                Statistical methods require historical data. For new products: 1) Use <strong>analogy 
                forecasting</strong> - base forecasts on similar products&apos; demand patterns. 2) Use 
                <strong> judgmental forecasting</strong> - combine sales team estimates with market 
                research. 3) Start with simple methods and update as actual data comes in. Switch to 
                statistical methods once you have 6+ months of actual demand data.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Related Tools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Safety Stock Calculator", href: "/tools/warehousing/safety-stock", desc: "Calculate buffer inventory" },
            { name: "EOQ Calculator", href: "/tools/warehousing/eoq-calculator", desc: "Optimize order quantities" },
            { name: "Reorder Point Calculator", href: "/tools/reorder-point-calculator", desc: "Set replenishment triggers" },
            { name: "Service Level Optimizer", href: "/tools/warehousing/service-level", desc: "Balance costs and service" },
          ].map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-all hover:border-[var(--ocean)]/50 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium group-hover:text-[var(--ocean)] transition-colors">
                      {tool.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--ocean)] transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
