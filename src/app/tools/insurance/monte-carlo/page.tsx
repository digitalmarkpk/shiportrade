import { Metadata } from "next";
import Link from "next/link";
import {
  Dice5,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MonteCarloSimulator } from "@/components/tools/MonteCarloSimulator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Monte Carlo Freight Volatility Simulator | Shiportrade.com",
  description: "Simulate freight rate volatility using Monte Carlo methods. Generate probability distributions for shipping costs and risk analysis.",
  keywords: ["monte carlo simulation", "freight volatility", "shipping rate forecast", "risk analysis", "probability simulation"],
  openGraph: {
    title: "Monte Carlo Freight Volatility Simulator",
    description: "Advanced probability simulation for freight rate forecasting and risk management.",
    type: "website",
  },
};

export default function MonteCarloPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/insurance" className="hover:text-foreground">Insurance & Risk</Link>
        <span>/</span>
        <span className="text-foreground">Monte Carlo Simulator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Dice5 className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Monte Carlo Freight Volatility Simulator</h1>
            <p className="text-muted-foreground">Probability-based freight rate forecasting</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Advanced Tool</Badge>
      </div>

      {/* Calculator */}
      <MonteCarloSimulator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Monte Carlo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Monte Carlo?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Monte Carlo simulation</strong> is a computational technique that uses random 
              sampling to model complex systems with uncertainty. By running thousands of simulations, 
              we can understand the range of possible outcomes and their probabilities.
            </p>
            <p className="text-muted-foreground mt-3">
              In freight markets, Monte Carlo methods help quantify risk by showing not just what 
              might happen, but how likely different scenarios are. This enables better budgeting, 
              hedging decisions, and risk management.
            </p>
          </CardContent>
        </Card>

        {/* GBM Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
              The Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
              <div>dS = μS dt + σS dW</div>
              <div className="pt-2 border-t border-border text-xs space-y-1">
                <div>S = Freight rate</div>
                <div>μ = Drift (trend)</div>
                <div>σ = Volatility</div>
                <div>dW = Random shock</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 inline mr-1" />
              Geometric Brownian Motion (GBM) is the standard model for asset prices, 
              ensuring rates stay positive and exhibit realistic volatility patterns.
            </p>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Mean/Median:</strong> Expected future price
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Percentiles:</strong> Range of likely outcomes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Volatility:</strong> Rate variability measure
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Probability:</strong> Likelihood of scenarios
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Trade Lane Volatility */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Trade Lane Volatility Parameters</CardTitle>
          <CardDescription>Historical volatility characteristics by route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { lane: "Asia-Europe", volatility: "35%", drift: "+2%", note: "Moderate" },
              { lane: "Asia-USWC", volatility: "40%", drift: "+3%", note: "High" },
              { lane: "Asia-USEC", volatility: "38%", drift: "+2.5%", note: "High" },
              { lane: "Trans-Atlantic", volatility: "25%", drift: "+1.5%", note: "Lower" },
              { lane: "Intra-Asia", volatility: "30%", drift: "+1%", note: "Moderate" },
            ].map((item) => (
              <div key={item.lane} className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">{item.lane}</p>
                <p className="text-lg font-bold text-[var(--ocean)]">{item.volatility}</p>
                <p className="text-xs text-muted-foreground">Drift: {item.drift}</p>
                <Badge variant="outline" className="mt-2">{item.note}</Badge>
              </div>
            ))}
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
                Run multiple simulations to verify stable results
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use 95th percentile for conservative budgeting
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Compare results across different time horizons
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Adjust volatility for current market conditions
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Combine with fundamental market analysis
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Limitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Model assumes constant volatility (not realistic)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Does not capture sudden market shocks
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignores mean reversion typical in freight
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Cannot predict structural market changes
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Historical parameters may not persist
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
              <AccordionTrigger>How many simulations should I run?</AccordionTrigger>
              <AccordionContent>
                For most purposes, 1,000 simulations provide stable results. Use 5,000-10,000 
                for higher precision or when analyzing tail risks (extreme outcomes). The law 
                of large numbers ensures results converge as simulation count increases.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is volatility and why does it matter?</AccordionTrigger>
              <AccordionContent>
                Volatility (σ) measures how much rates fluctuate over time. Higher volatility 
                means wider potential price swings. A 40% annual volatility means rates could 
                reasonably move 40% in either direction over a year. Trade lanes with higher 
                volatility carry more risk and require larger contingency budgets.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Should I use the mean or median for planning?</AccordionTrigger>
              <AccordionContent>
                The distribution of freight rates tends to be right-skewed (more extreme highs 
                than lows). The median (50th percentile) represents the "typical" outcome, while 
                the mean is pulled higher by extreme scenarios. For budgeting, use the median 
                as a baseline and the 75th-95th percentile for contingency.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How should I use these results for hedging?</AccordionTrigger>
              <AccordionContent>
                Use probability thresholds to decide on hedging: if the probability of rates 
                exceeding your budget is &gt;30%, consider locking in rates with long-term contracts. 
                The simulation shows the potential upside you're giving up by hedging, helping 
                you evaluate if the hedge cost is worthwhile.
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
            { name: "VaR Calculator", href: "/tools/insurance/var-calculator" },
            { name: "Stress Testing Engine", href: "/tools/insurance/stress-testing" },
            { name: "BAF/CAF Estimator", href: "/tools/ocean-freight/baf-estimator" },
            { name: "TCOR Calculator", href: "/tools/insurance/tcor" },
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
