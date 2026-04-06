import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpDown,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  TrendingUp,
  BarChart3,
  Shield,
  Globe,
  DollarSign,
  Droplets,
  Coins,
  Wheat,
  Coffee,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CommodityHedgingCalculator } from "@/components/tools/CommodityHedgingCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Commodity Hedging Calculator | Shiportrade.com",
  description: "Plan commodity hedging strategies with futures, options, and swaps. Calculate forward prices, hedge costs, and P&L scenarios for oil, metals, agricultural, and soft commodities.",
  keywords: ["commodity hedging", "futures trading", "commodity options", "commodity swaps", "forward price", "hedging calculator", "oil hedging", "metals trading"],
  openGraph: {
    title: "Commodity Hedging Calculator",
    description: "Comprehensive commodity hedging calculator for international traders. Plan and optimize your commodity risk management strategies.",
    type: "website",
  },
};

export default function CommodityHedgingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Commodity Hedging Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Commodity Hedging Calculator</h1>
            <p className="text-muted-foreground">Plan your commodity price risk management strategy</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Advanced Tool</Badge>
          <Badge variant="outline">Risk Management</Badge>
          <Badge variant="outline">Trade Finance</Badge>
        </div>
      </div>

      {/* Calculator */}
      <CommodityHedgingCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Why Hedge Commodities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Why Hedge Commodities?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Commodity price volatility</strong> can significantly impact business profitability. 
              A 20% price swing in oil, metals, or agricultural products can mean millions in 
              unexpected costs or lost revenue. Hedging provides certainty in uncertain markets.
            </p>
            <p className="text-muted-foreground mt-3">
              For importers and exporters, commodity hedging protects margins, enables stable 
              pricing for customers, and provides predictable cash flows for financial planning.
            </p>
          </CardContent>
        </Card>

        {/* Key Concepts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
              Key Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Forward Price:</strong> Cost-of-carry model incorporating storage and convenience yield
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Contango/Backwardation:</strong> Market structure affecting hedge costs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Basis Risk:</strong> Mismatch between hedge instrument and exposure
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Roll Yield:</strong> Gain/loss from rolling futures positions
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Commodity Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
              Commodity Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Droplets className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Oil & Energy:</strong> Brent, WTI, Natural Gas
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Coins className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Metals:</strong> Gold, Silver, Copper, Aluminum
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Wheat className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Agricultural:</strong> Corn, Wheat, Soybeans, Rice
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Coffee className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Softs:</strong> Coffee, Sugar, Cocoa, Cotton
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Instrument Comparison Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-[var(--ocean)]" />
            Hedging Instrument Comparison
          </CardTitle>
          <CardDescription>Detailed comparison of commodity hedging instruments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Feature</th>
                  <th className="text-left p-3 font-medium">Futures Contracts</th>
                  <th className="text-left p-3 font-medium">Commodity Options</th>
                  <th className="text-left p-3 font-medium">Commodity Swaps</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Upfront Cost</td>
                  <td className="p-3 text-muted-foreground">Margin deposit (5-15%)</td>
                  <td className="p-3 text-muted-foreground">Premium payment</td>
                  <td className="p-3 text-muted-foreground">None (credit line)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Price Certainty</td>
                  <td className="p-3 text-muted-foreground">High - locked in price</td>
                  <td className="p-3 text-muted-foreground">Medium - floor or cap</td>
                  <td className="p-3 text-muted-foreground">High - fixed price</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Upside Potential</td>
                  <td className="p-3 text-muted-foreground">No - fully committed</td>
                  <td className="p-3 text-muted-foreground">Yes - one-sided protection</td>
                  <td className="p-3 text-muted-foreground">No - fully committed</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Contract Size</td>
                  <td className="p-3 text-muted-foreground">Standardized (e.g., 1,000 BBL)</td>
                  <td className="p-3 text-muted-foreground">Standardized</td>
                  <td className="p-3 text-muted-foreground">Fully customizable</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Liquidity</td>
                  <td className="p-3 text-muted-foreground">High (exchange-traded)</td>
                  <td className="p-3 text-muted-foreground">Medium</td>
                  <td className="p-3 text-muted-foreground">Low (OTC)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Daily Settlement</td>
                  <td className="p-3 text-muted-foreground">Yes - mark-to-market</td>
                  <td className="p-3 text-muted-foreground">No - premium paid</td>
                  <td className="p-3 text-muted-foreground">No - settlement at maturity</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Best For</td>
                  <td className="p-3 text-muted-foreground">Known production/consumption</td>
                  <td className="p-3 text-muted-foreground">Uncertain volume needs</td>
                  <td className="p-3 text-muted-foreground">Large, long-term exposure</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Commodity Reference Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-[var(--ocean)]" />
            Commodity Characteristics Reference
          </CardTitle>
          <CardDescription>Key parameters affecting hedging decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Commodity</th>
                  <th className="text-left p-3 font-medium">Typical Volatility</th>
                  <th className="text-left p-3 font-medium">Storage Cost</th>
                  <th className="text-left p-3 font-medium">Convenience Yield</th>
                  <th className="text-left p-3 font-medium">Market Structure</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Crude Oil</td>
                  <td className="p-3 text-muted-foreground">25-35%</td>
                  <td className="p-3 text-muted-foreground">4-5%</td>
                  <td className="p-3 text-muted-foreground">1-3%</td>
                  <td className="p-3 text-muted-foreground">Often contango</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Gold</td>
                  <td className="p-3 text-muted-foreground">12-18%</td>
                  <td className="p-3 text-muted-foreground">0.5%</td>
                  <td className="p-3 text-muted-foreground">0%</td>
                  <td className="p-3 text-muted-foreground">Contango typical</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Copper</td>
                  <td className="p-3 text-muted-foreground">18-25%</td>
                  <td className="p-3 text-muted-foreground">1-2%</td>
                  <td className="p-3 text-muted-foreground">0-1%</td>
                  <td className="p-3 text-muted-foreground">Varies</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Corn/Wheat</td>
                  <td className="p-3 text-muted-foreground">20-30%</td>
                  <td className="p-3 text-muted-foreground">3-4%</td>
                  <td className="p-3 text-muted-foreground">1-2%</td>
                  <td className="p-3 text-muted-foreground">Seasonal patterns</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Coffee</td>
                  <td className="p-3 text-muted-foreground">30-40%</td>
                  <td className="p-3 text-muted-foreground">2-3%</td>
                  <td className="p-3 text-muted-foreground">0.5-1%</td>
                  <td className="p-3 text-muted-foreground">Weather sensitive</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Natural Gas</td>
                  <td className="p-3 text-muted-foreground">40-60%</td>
                  <td className="p-3 text-muted-foreground">8-12%</td>
                  <td className="p-3 text-muted-foreground">2-5%</td>
                  <td className="p-3 text-muted-foreground">Strong seasonality</td>
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
                Match hedge duration with underlying transaction timing
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider market structure (contango vs backwardation) for timing
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use options when volume is uncertain or you want upside potential
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Layer hedges over time rather than all at once (averaging)
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Monitor basis risk between hedge instrument and physical commodity
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider using collars (buy put, sell call) to reduce premium costs
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review positions regularly and adjust for changing market conditions
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
                Over-hedging beyond actual physical exposure (speculation)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring margin requirements and potential margin calls
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for basis risk between grades/locations
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting roll costs when rolling futures positions
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using complex structures without understanding the risks
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not documenting hedge relationships for accounting purposes
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Neglecting counterparty credit risk in OTC contracts
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>How is the forward price calculated for commodities?</AccordionTrigger>
              <AccordionContent>
                The <strong>forward price</strong> for commodities uses the cost-of-carry model: 
                F = S × e<sup>(r + u - y) × T</sup>, where S is the spot price, r is the risk-free rate, 
                u is the storage cost, y is the convenience yield, and T is time to maturity. This formula 
                accounts for the costs and benefits of holding the physical commodity versus a futures contract.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the difference between contango and backwardation?</AccordionTrigger>
              <AccordionContent>
                <strong>Contango</strong> occurs when futures prices are higher than spot prices, typically 
                due to storage costs. In contango, rolling futures positions costs money (negative roll yield). 
                <strong>Backwardation</strong> is when futures prices are below spot prices, often indicating 
                supply tightness. In backwardation, rolling futures generates positive roll yield. Understanding 
                market structure is crucial for hedging cost optimization.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Should I use futures or options for commodity hedging?</AccordionTrigger>
              <AccordionContent>
                <strong>Futures</strong> are best when you have firm commitments and want price certainty 
                with no upfront premium. They&apos;re ideal for producers locking in sales prices or consumers 
                locking in costs. <strong>Options</strong> are better when volume is uncertain or you want 
                protection with upside potential. Options cost more upfront but provide flexibility - you can 
                benefit from favorable price moves while being protected from adverse ones.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What is basis risk and how does it affect hedging?</AccordionTrigger>
              <AccordionContent>
                <strong>Basis risk</strong> is the risk that the price of your hedging instrument doesn&apos;t 
                perfectly correlate with your physical exposure. This can arise from: different commodity grades 
                (WTI vs Brent), different locations (Houston vs Rotterdam), or different contract specifications. 
                To minimize basis risk, choose hedging instruments that closely match your physical exposure in 
                grade, location, and timing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How do I determine the optimal hedge percentage?</AccordionTrigger>
              <AccordionContent>
                The optimal hedge percentage depends on several factors: your risk tolerance, price volatility, 
                margin sensitivity, and market conditions. A common approach is <strong>layered hedging</strong>: 
                start with 30-50% coverage when exposure is forecasted, increase to 70-80% as commitment firms up, 
                and reach 90-100% near delivery. This balances protection with flexibility and avoids locking in 
                unfavorable prices too early.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>What are the accounting implications of commodity hedging?</AccordionTrigger>
              <AccordionContent>
                Under <strong>IFRS 9 and ASC 815</strong>, companies can apply hedge accounting to reduce 
                earnings volatility. Requirements include: formal documentation at inception, demonstrating 
                hedge effectiveness (80-125% range), and ongoing effectiveness testing. Without hedge accounting, 
                derivatives are marked-to-market through P&amp;L, creating earnings volatility. Consult your 
                accounting team to ensure proper hedge documentation and designation.
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
            { name: "FX Hedging Calculator", href: "/tools/international-trade/fx-hedging" },
            { name: "Profit Margin Calculator", href: "/tools/international-trade/profit-margin-calculator" },
            { name: "Landed Cost Calculator", href: "/tools/international-trade/landed-cost-calculator" },
            { name: "Monte Carlo Simulator", href: "/tools/insurance/monte-carlo" },
          ].map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-all hover:border-[var(--ocean)]/50 cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium group-hover:text-[var(--ocean)] transition-colors">
                    {tool.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--ocean)] transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
