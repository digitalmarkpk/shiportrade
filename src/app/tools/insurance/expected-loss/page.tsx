import { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Shield,
  TrendingDown,
  BarChart3,
  Gauge,
  Target,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ExpectedLossCalculator from "@/components/tools/ExpectedLossCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Expected Loss Calculator | Shiportrade.com",
  description: "Calculate expected loss, Value at Risk (VaR), total cost of risk, and optimize risk retention vs insurance. Monte Carlo simulation for risk analysis.",
  keywords: ["expected loss calculator", "value at risk", "VaR", "risk management", "insurance premium", "risk retention", "monte carlo simulation", "total cost of risk"],
  openGraph: {
    title: "Expected Loss Calculator - Risk Management",
    description: "Calculate expected loss, VaR, total cost of risk, and optimize your insurance strategy with Monte Carlo simulation.",
    type: "website",
  },
};

export default function ExpectedLossCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/insurance" className="hover:text-foreground">Insurance</Link>
        <span>/</span>
        <span className="text-foreground">Expected Loss Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Calculator className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Expected Loss Calculator</h1>
            <p className="text-muted-foreground">Comprehensive risk quantification and insurance optimization</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline">Monte Carlo Simulation</Badge>
        </div>
      </div>

      {/* Calculator */}
      <ExpectedLossCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Expected Loss */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Expected Loss?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Expected Loss (EL)</strong> is the average amount you anticipate losing over a given 
              period, calculated as the product of the probability of a loss event and the severity 
              of that loss when it occurs.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm mt-4">
              <div>
                <span className="text-[var(--ocean)]">EL</span> = P × S × N
              </div>
              <div className="pt-2 border-t border-border text-xs mt-2 space-y-1">
                <div><span className="text-[var(--logistics)]">P</span> = Probability of loss occurrence</div>
                <div><span className="text-[var(--logistics)]">S</span> = Expected severity (mean loss amount)</div>
                <div><span className="text-[var(--logistics)]">N</span> = Number of exposure units</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Value at Risk */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="h-5 w-5 text-[var(--ocean)]" />
              Value at Risk (VaR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              VaR answers: "What is the maximum loss I might face with X% confidence?" It provides 
              a single number summarizing the risk of a portfolio or exposure.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>VaR 95%:</strong> Loss exceeded only 5% of the time</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>CVaR:</strong> Average loss when exceeding VaR threshold</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Use Case:</strong> Capital allocation, risk limits</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Total Cost of Risk */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gauge className="h-5 w-5 text-[var(--ocean)]" />
              Total Cost of Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The Total Cost of Risk (TCoR) captures all costs associated with managing risk, 
              not just expected losses.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span>Expected Loss</span>
                <span className="text-[var(--ocean)]">P × S</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span>Risk Margin</span>
                <span className="text-[var(--logistics)]">Capital buffer</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span>Cost of Capital</span>
                <span className="text-amber-500">Opportunity cost</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span>Admin Costs</span>
                <span className="text-purple-500">Management fees</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Severity Distributions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
            Severity Distributions Explained
          </CardTitle>
          <CardDescription>Choosing the right distribution for your loss severity model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                name: "Normal (Gaussian)", 
                description: "Symmetric bell curve distribution",
                use: "Moderate, predictable losses with consistent severity",
                pros: "Simple, well-understood, symmetric",
                cons: "Allows negative values, underestimates tail risk"
              },
              { 
                name: "Log-Normal", 
                description: "Right-skewed, always positive values",
                use: "Insurance losses, financial returns",
                pros: "Always positive, captures skewness",
                cons: "Cannot model zero losses, moderate tail"
              },
              { 
                name: "Exponential", 
                description: "Memoryless, decreasing probability",
                use: "Time between events, small frequent losses",
                pros: "Simple parameter, good for frequency",
                cons: "Underestimates extreme losses"
              },
              { 
                name: "Pareto", 
                description: "Heavy-tailed, extreme value distribution",
                use: "Catastrophic losses, natural disasters",
                pros: "Captures extreme tail events",
                cons: "Requires more data for parameter estimation"
              },
            ].map((dist) => (
              <div key={dist.name} className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-[var(--ocean)] mb-2">{dist.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{dist.description}</p>
                <p className="text-xs"><span className="text-[var(--logistics)]">Use:</span> {dist.use}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Retention vs Transfer */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--ocean)]" />
            Risk Retention vs Risk Transfer
          </CardTitle>
          <CardDescription>Deciding how much risk to retain and how much to transfer via insurance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-[var(--logistics)] mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                When to Retain Risk
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• High frequency, low severity losses</li>
                <li>• Strong financial position to absorb losses</li>
                <li>• Premium exceeds expected loss significantly</li>
                <li>• Losses are predictable and budgetable</li>
                <li>• Want to avoid claim process overhead</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-[var(--ocean)] mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                When to Transfer Risk
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Low frequency, high severity losses</li>
                <li>• Catastrophic or ruin potential</li>
                <li>• Regulatory or contractual requirements</li>
                <li>• Access to insurer expertise and services</li>
                <li>• Peace of mind and budget certainty</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20">
            <h4 className="font-medium text-[var(--ocean)] mb-2">Optimal Retention Strategy</h4>
            <p className="text-sm text-muted-foreground">
              The optimal retention level minimizes the total cost of risk. Higher retention reduces 
              premiums but increases volatility. Use the Retention Analysis tab to find the sweet spot 
              for your organization based on expected losses and premium savings at different 
              deductible levels.
            </p>
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
                Use historical claims data to calibrate probability and severity
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider multiple severity distributions and compare results
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Run Monte Carlo simulations for complex risk portfolios
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review and update risk parameters annually
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider correlation between different risk exposures
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use CVaR (not just VaR) to understand tail risk exposure
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
                Using only expected loss without considering volatility
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring tail risk (rare but catastrophic events)
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Assuming normal distribution for heavy-tailed losses
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not considering administrative costs of risk management
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Over-relying on historical data without adjustments
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring correlation between exposures
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Risk Matrix Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[var(--ocean)]" />
            Risk Matrix Reference
          </CardTitle>
          <CardDescription>Understanding probability-severity combinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Risk Category</th>
                  <th className="text-center py-3 px-4">Probability</th>
                  <th className="text-center py-3 px-4">Severity</th>
                  <th className="text-left py-3 px-4">Example</th>
                  <th className="text-left py-3 px-4">Treatment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">High Freq / Low Sev</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-amber-500">High (&gt;50%)</Badge></td>
                  <td className="text-center py-3 px-4"><Badge variant="secondary">Low (&lt;$10K)</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">Minor cargo damage, documentation errors</td>
                  <td className="py-3 px-4 text-muted-foreground">Retain, self-insure, process improvement</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Medium / Medium</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">Med (10-50%)</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">Med ($10K-$100K)</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">Equipment failure, delays</td>
                  <td className="py-3 px-4 text-muted-foreground">Partial transfer, deductible optimization</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Low Freq / High Sev</td>
                  <td className="text-center py-3 px-4"><Badge variant="secondary">Low (1-10%)</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-red-500">High ($100K-$1M)</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">Major accidents, cargo theft</td>
                  <td className="py-3 px-4 text-muted-foreground">Full insurance transfer</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Rare / Catastrophic</td>
                  <td className="text-center py-3 px-4"><Badge variant="secondary">&lt;1%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-red-700">&gt;$1M</Badge></td>
                  <td className="py-3 px-4 text-muted-foreground">Vessel total loss, natural disaster</td>
                  <td className="py-3 px-4 text-muted-foreground">Essential insurance, contingency plans</td>
                </tr>
              </tbody>
            </table>
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
              <AccordionTrigger>How do I estimate the probability of loss?</AccordionTrigger>
              <AccordionContent>
                Start with historical data: count the number of loss events over a period and 
                divide by total exposure. For example, if you had 15 losses out of 100 shipments, 
                the probability is 15%. Adjust for: 1) Changes in risk controls, 2) Market conditions, 
                3) New routes or cargo types, 4) Industry benchmarks. When data is limited, use 
                expert judgment combined with industry statistics.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Which severity distribution should I use?</AccordionTrigger>
              <AccordionContent>
                <strong>Log-normal</strong> is the default choice for insurance losses - it&apos;s always positive 
                and naturally captures the right-skew typical of loss data. Use <strong>Pareto</strong> when 
                modeling catastrophic risks with heavy tails (extreme events are more likely than 
                normal distribution suggests). Use <strong>Normal</strong> only for well-behaved, moderate 
                severity losses with symmetric distribution. <strong>Exponential</strong> works for simple 
                models where all you know is the mean severity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What's the difference between VaR and Expected Loss?</AccordionTrigger>
              <AccordionContent>
                <strong>Expected Loss</strong> is the average loss you anticipate - the mean of the distribution. 
                It&apos;s useful for budgeting and pricing. <strong>VaR</strong> is a threshold value - the loss 
                that will not be exceeded with a certain confidence (e.g., 95%). VaR tells you about 
                worst-case scenarios and is used for capital allocation and risk limits. A company 
                might budget for expected loss but hold capital for VaR-level losses.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How many Monte Carlo simulations should I run?</AccordionTrigger>
              <AccordionContent>
                <strong>1,000 simulations</strong> gives quick results but may have sampling error. 
                <strong>10,000 simulations</strong> is recommended for most applications, providing 
                stable estimates with reasonable computation time. <strong>50,000+ simulations</strong> 
                may be needed for: 1) High confidence levels (99.5%+), 2) Heavy-tailed distributions 
                like Pareto, 3) Regulatory capital calculations. The law of large numbers means 
                results converge as simulations increase.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>When is insurance worth the premium?</AccordionTrigger>
              <AccordionContent>
                Insurance is financially rational when: 1) The premium is less than your expected 
                loss plus risk margin (the cost of holding capital), 2) You cannot absorb the 
                potential loss without significant distress, 3) Regulatory or contractual requirements 
                mandate coverage, 4) The insurer provides value-added services (claims handling, 
                risk engineering). Even if premium exceeds expected loss, insurance may be valuable 
                for the volatility reduction it provides.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>What is CVaR and why does it matter?</AccordionTrigger>
              <AccordionContent>
                <strong>CVaR (Conditional VaR)</strong> or Expected Shortfall is the average loss 
                when losses exceed the VaR threshold. While VaR tells you &quot;losses won&apos;t exceed X 
                95% of the time&quot;, CVaR tells you &quot;when losses do exceed X, the average will be Y.&quot; 
                CVaR is important because: 1) It captures tail risk that VaR ignores, 2) It&apos;s 
                required under some regulatory frameworks (Basel III), 3) It&apos;s a coherent risk 
                measure (VaR is not always coherent), 4) It helps plan for worst-case scenarios.
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
            { name: "Marine Insurance Calculator", href: "/tools/insurance/marine-premium" },
            { name: "Monte Carlo Simulator", href: "/tools/insurance/monte-carlo" },
            { name: "General Average Estimator", href: "/tools/insurance/general-average" },
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
