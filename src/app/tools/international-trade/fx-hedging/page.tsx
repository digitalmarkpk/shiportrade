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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FXHedgingCalculator } from "@/components/tools/FXHedgingCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FX Hedging Calculator | Shiportrade.com",
  description: "Plan foreign exchange hedging strategies with forward contracts, options, and swaps. Calculate hedge costs, break-even rates, and P&L scenarios.",
  keywords: ["fx hedging", "currency hedging", "forward contract", "currency option", "fx swap", "foreign exchange risk", "hedging calculator"],
  openGraph: {
    title: "FX Hedging Calculator",
    description: "Comprehensive foreign exchange hedging calculator for international traders. Plan and optimize your currency risk management strategies.",
    type: "website",
  },
};

export default function FXHedgingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">FX Hedging Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <ArrowUpDown className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">FX Hedging Calculator</h1>
            <p className="text-muted-foreground">Plan your foreign exchange risk management strategy</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Advanced Tool</Badge>
          <Badge variant="outline">Trade Finance</Badge>
        </div>
      </div>

      {/* Calculator */}
      <FXHedgingCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is FX Hedging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Why Hedge FX Risk?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Currency fluctuations</strong> can significantly impact the profitability of 
              international trade. A 5% currency move can erase the entire profit margin on a 
              transaction. FX hedging protects against these unpredictable movements.
            </p>
            <p className="text-muted-foreground mt-3">
              By locking in exchange rates today for future transactions, businesses gain 
              certainty in cash flows, protect margins, and can price products competitively 
              without currency risk.
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
                  <strong>Forward Points:</strong> The difference between spot and forward rates
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Premium:</strong> Cost paid for option contracts
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Strike Rate:</strong> The rate at which an option can be exercised
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Break-Even:</strong> The rate where hedge cost equals benefit
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
              When to Use Each
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Forward:</strong> When you have a firm commitment
                </span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Option:</strong> When you want protection with upside
                </span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>FX Swap:</strong> For rolling existing positions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Natural:</strong> When you have matching flows
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
            Hedge Instrument Comparison
          </CardTitle>
          <CardDescription>Detailed comparison of hedging instruments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Feature</th>
                  <th className="text-left p-3 font-medium">Forward Contract</th>
                  <th className="text-left p-3 font-medium">Call/Put Option</th>
                  <th className="text-left p-3 font-medium">FX Swap</th>
                  <th className="text-left p-3 font-medium">Natural Hedge</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Upfront Cost</td>
                  <td className="p-3 text-muted-foreground">None</td>
                  <td className="p-3 text-muted-foreground">Premium</td>
                  <td className="p-3 text-muted-foreground">Swap points</td>
                  <td className="p-3 text-muted-foreground">None</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Upside Potential</td>
                  <td className="p-3 text-muted-foreground">No</td>
                  <td className="p-3 text-muted-foreground">Yes</td>
                  <td className="p-3 text-muted-foreground">Limited</td>
                  <td className="p-3 text-muted-foreground">Yes</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Obligation</td>
                  <td className="p-3 text-muted-foreground">Yes</td>
                  <td className="p-3 text-muted-foreground">No</td>
                  <td className="p-3 text-muted-foreground">Yes</td>
                  <td className="p-3 text-muted-foreground">No</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Flexibility</td>
                  <td className="p-3 text-muted-foreground">Low</td>
                  <td className="p-3 text-muted-foreground">High</td>
                  <td className="p-3 text-muted-foreground">Medium</td>
                  <td className="p-3 text-muted-foreground">Low</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Complexity</td>
                  <td className="p-3 text-muted-foreground">Low</td>
                  <td className="p-3 text-muted-foreground">High</td>
                  <td className="p-3 text-muted-foreground">Medium</td>
                  <td className="p-3 text-muted-foreground">Low</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Best For</td>
                  <td className="p-3 text-muted-foreground">Known future payments</td>
                  <td className="p-3 text-muted-foreground">Uncertain transactions</td>
                  <td className="p-3 text-muted-foreground">Rolling hedges</td>
                  <td className="p-3 text-muted-foreground">Matching flows</td>
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
                Layer hedges over time rather than hedging 100% at once
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Match hedge maturity with underlying transaction timing
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider using options when market direction is uncertain
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review hedge effectiveness monthly and adjust as needed
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Document hedge designations for accounting compliance
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use natural hedges whenever possible to reduce costs
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
                Over-hedging beyond actual exposure
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not considering break-even analysis
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring counterparty credit risk
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Failing to document hedge relationships
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not reviewing hedges regularly
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Speculating instead of hedging
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
              <AccordionTrigger>What is the difference between forward rate and spot rate?</AccordionTrigger>
              <AccordionContent>
                The <strong>spot rate</strong> is the current market exchange rate for immediate settlement. 
                The <strong>forward rate</strong> is the agreed exchange rate for a future date, calculated 
                based on interest rate differentials between the two currencies. Forward rates reflect the 
                cost of carry - the difference in interest rates between currencies over the hedge period.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Should I use forward contracts or options for hedging?</AccordionTrigger>
              <AccordionContent>
                It depends on your risk tolerance and market view. <strong>Forward contracts</strong> are 
                best when you have a firm commitment and want certainty - you lock in a rate but forego 
                any favorable moves. <strong>Options</strong> are better when you want protection but also 
                want to benefit from favorable rate movements. Options cost more upfront (premium) but 
                provide flexibility.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I calculate the hedge cost?</AccordionTrigger>
              <AccordionContent>
                Hedge cost varies by instrument: For <strong>forwards</strong>, it&apos;s the opportunity cost 
                of not benefiting from favorable moves. For <strong>options</strong>, it&apos;s the premium paid. 
                For <strong>FX swaps</strong>, it&apos;s the swap points (difference between near and far leg rates). 
                The calculator shows both absolute cost and percentage of notional amount.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What percentage of exposure should I hedge?</AccordionTrigger>
              <AccordionContent>
                There&apos;s no one-size-fits-all answer, but many companies use a layered approach: hedge 
                50-70% of forecasted exposure at booking, increase to 80-100% as the transaction date 
                approaches. This balances protection with flexibility. Consider your risk tolerance, 
                margin sensitivity, and market volatility when deciding.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What is natural hedging and when should I use it?</AccordionTrigger>
              <AccordionContent>
                <strong>Natural hedging</strong> matches currency inflows with outflows, reducing or 
                eliminating FX exposure without financial instruments. For example, if you receive EUR 
                from European sales and need to pay EUR to European suppliers, the natural offset 
                reduces your net EUR exposure. Use natural hedging whenever you have matching cash flows 
                - it&apos;s cost-free and reduces complexity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How often should I review my hedge positions?</AccordionTrigger>
              <AccordionContent>
                Best practice is to review hedge positions at least <strong>monthly</strong>, or more 
                frequently during volatile market conditions. Reviews should assess: hedge effectiveness 
                against underlying exposure, mark-to-market values, counterparty credit quality, and 
                whether the hedging strategy still aligns with business objectives. Document all reviews 
                for audit purposes.
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
            { name: "Currency Converter", href: "/tools/international-trade/currency-converter" },
            { name: "Landed Cost Calculator", href: "/tools/international-trade/landed-cost-calculator" },
            { name: "Profit Margin Calculator", href: "/tools/international-trade/profit-margin-calculator" },
            { name: "Factoring Cost Calculator", href: "/tools/international-trade/factoring-cost" },
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
