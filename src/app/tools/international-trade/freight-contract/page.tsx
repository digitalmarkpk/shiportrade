import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Layers,
  DollarSign,
  Award,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FreightContractAnalyzer from "@/components/tools/FreightContractAnalyzer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Freight Contract Analyzer | Shiportrade.com",
  description: "Analyze freight contracts with rate benchmarking, surcharge breakdown, hidden cost identification, and negotiation recommendations for better shipping agreements.",
  keywords: ["freight contract", "shipping contract analysis", "rate benchmarking", "surcharge analysis", "container shipping rates", "contract negotiation"],
  openGraph: {
    title: "Freight Contract Analyzer",
    description: "Comprehensive freight contract analysis tool for better shipping agreements. Benchmark rates, identify hidden costs, and get negotiation recommendations.",
    type: "website",
  },
};

export default function FreightContractPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Freight Contract Analyzer</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Freight Contract Analyzer</h1>
            <p className="text-muted-foreground">Evaluate, benchmark, and optimize your shipping contracts</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Advanced Tool</Badge>
          <Badge variant="outline">Ocean Freight</Badge>
          <Badge variant="outline">Contract Management</Badge>
        </div>
      </div>

      {/* Calculator */}
      <FreightContractAnalyzer />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Understanding Freight Contracts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Freight Contracts
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              A <strong>freight contract</strong> is a binding agreement between a shipper and carrier 
              that outlines rates, services, and terms for transporting goods. Well-negotiated contracts 
              can reduce shipping costs by 10-25% compared to spot rates.
            </p>
            <p className="text-muted-foreground mt-3">
              Key elements include base rates, surcharges, volume commitments, free time, 
              and performance metrics. Understanding each component helps identify hidden costs 
              and negotiation opportunities.
            </p>
          </CardContent>
        </Card>

        {/* Contract Score Components */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-[var(--ocean)]" />
              Contract Score Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Rate Competitiveness:</strong> How your rates compare to market benchmarks
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Volume Utilization:</strong> Meeting committed volume targets
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Surcharge Transparency:</strong> Clarity and fairness of surcharges
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Hidden Costs:</strong> Unexpected fees and penalties
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
              Key Metrics to Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Cost per TEU:</strong> Total all-in cost per container
                </span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Surcharge Ratio:</strong> Surcharges as % of total cost
                </span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Utilization Rate:</strong> Actual vs committed volume
                </span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Benchmark Variance:</strong> % difference from market rates
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Surcharge Reference Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[var(--ocean)]" />
            Common Freight Surcharges
          </CardTitle>
          <CardDescription>Understanding the various surcharges that affect your total shipping cost</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Code</th>
                  <th className="text-left p-3 font-medium">Surcharge Name</th>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-left p-3 font-medium">Typical Range</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-mono text-[var(--ocean)]">BAF</td>
                  <td className="p-3 font-medium">Bunker Adjustment Factor</td>
                  <td className="p-3 text-muted-foreground">Fuel cost adjustment based on oil prices</td>
                  <td className="p-3 text-muted-foreground">$350 - $600/FEU</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono text-[var(--ocean)]">CAF</td>
                  <td className="p-3 font-medium">Currency Adjustment Factor</td>
                  <td className="p-3 text-muted-foreground">Exchange rate fluctuation adjustment</td>
                  <td className="p-3 text-muted-foreground">$100 - $250/FEU</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono text-[var(--ocean)]">THC</td>
                  <td className="p-3 font-medium">Terminal Handling Charge</td>
                  <td className="p-3 text-muted-foreground">Port terminal operations cost</td>
                  <td className="p-3 text-muted-foreground">$150 - $300/port</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono text-[var(--ocean)]">LSS</td>
                  <td className="p-3 font-medium">Low Sulphur Surcharge</td>
                  <td className="p-3 text-muted-foreground">IMO 2020 compliant fuel cost</td>
                  <td className="p-3 text-muted-foreground">$50 - $120/FEU</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono text-[var(--ocean)]">PSS</td>
                  <td className="p-3 font-medium">Peak Season Surcharge</td>
                  <td className="p-3 text-muted-foreground">High demand period premium</td>
                  <td className="p-3 text-muted-foreground">$200 - $500/FEU</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono text-[var(--ocean)]">ISPS</td>
                  <td className="p-3 font-medium">ISPS Code Surcharge</td>
                  <td className="p-3 text-muted-foreground">International ship/port security</td>
                  <td className="p-3 text-muted-foreground">$40 - $60/FEU</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[var(--ocean)]">EIS</td>
                  <td className="p-3 font-medium">Equipment Imbalance Surcharge</td>
                  <td className="p-3 text-muted-foreground">Container availability premium</td>
                  <td className="p-3 text-muted-foreground">$100 - $300/FEU</td>
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
              Pro Tips for Contract Negotiation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Negotiate fuel index-linked BAF mechanisms for transparency
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Request tiered volume discounts with incremental benefits
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Include performance KPIs with service level guarantees
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Define clear force majeure clauses and free time terms
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Build in quarterly rate review mechanisms
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Request transparency on all surcharge calculations
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Contract Pitfalls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Over-committing volume to get lower rates
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring surcharge clauses that can increase costs
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not reading the fine print on free time and demurrage
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Failing to benchmark rates against market
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Missing auto-renewal clauses in long-term contracts
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not negotiating shortfall penalty terms
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
              <AccordionTrigger>What is a good contract score?</AccordionTrigger>
              <AccordionContent>
                A <strong>contract score of 70+</strong> indicates a competitive agreement. Scores of 
                80+ are excellent, showing rates below market average with favorable terms. Scores 
                below 60 suggest the contract needs renegotiation. The score considers rate 
                competitiveness, volume utilization, surcharge transparency, and hidden cost exposure.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How are benchmark rates determined?</AccordionTrigger>
              <AccordionContent>
                Benchmark rates are derived from <strong>market data</strong> including carrier 
                published tariffs, spot rate indices (like SCFI, WCI), and aggregated contract data 
                from similar trade lanes. We factor in container type, seasonality, and route 
                characteristics to provide relevant comparisons for your specific contract.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What are hidden costs in freight contracts?</AccordionTrigger>
              <AccordionContent>
                <strong>Hidden costs</strong> are charges not immediately apparent in the base rate. 
                These include: above-market surcharges, volume shortfall penalties, demurrage from 
                tight free time, documentation fees, peak season premiums, and equipment imbalance 
                surcharges. Our analyzer identifies these by comparing each component against benchmarks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How much volume commitment is optimal?</AccordionTrigger>
              <AccordionContent>
                The optimal commitment balances <strong>discount benefits</strong> against 
                <strong>penalty risks</strong>. Generally, commit to 80-90% of your forecasted volume 
                to allow flexibility. Higher commitments get better rates but carry shortfall penalty 
                risks. Consider your demand variability and market volatility when setting commitment 
                levels.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What should I negotiate first - base rate or surcharges?</AccordionTrigger>
              <AccordionContent>
                <strong>Focus on base rate first</strong> as it&apos;s the largest component. However, 
                don&apos;t ignore surcharges - they can add 30-50% to total cost. Negotiate BAF 
                transparency (fuel index-linked), cap CAF adjustments, and clarify THC rates at 
                origin/destination. A lower base rate with high surcharges may cost more than a 
                slightly higher base with transparent surcharges.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>When should I renegotiate my freight contract?</AccordionTrigger>
              <AccordionContent>
                Consider renegotiation when: <strong>market rates drop significantly</strong> (10%+ 
                below your contract), your <strong>volume patterns change</strong>, contract score 
                falls below 60, or before auto-renewal clauses activate. Most contracts allow 
                mid-term negotiations for substantial volume changes. Best practice is quarterly 
                rate reviews and annual comprehensive renegotiations.
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
            { name: "BAF/CAF Estimator", href: "/tools/ocean-freight/baf-caf-estimator" },
            { name: "Freight Rate Benchmark", href: "/tools/ocean-freight/freight-rate-benchmark" },
            { name: "FCL Loadability Engine", href: "/tools/ocean-freight/fcl-loadability" },
            { name: "Demurrage Calculator", href: "/tools/ocean-freight/demurrage-calculator" },
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
