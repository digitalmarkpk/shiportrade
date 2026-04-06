import { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Shield,
  FileText,
  Target,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TransferPricingRiskModel from "@/components/tools/TransferPricingRiskModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Transfer Pricing Risk Model | Shiportrade.com",
  description: "Assess transfer pricing compliance and risk for related party transactions. Calculate arm's length ranges, tax exposure, and audit risk probability.",
  keywords: ["transfer pricing", "OECD guidelines", "arm's length principle", "intercompany pricing", "tax compliance", "related party transactions", "BEPS"],
  openGraph: {
    title: "Transfer Pricing Risk Model",
    description: "Comprehensive transfer pricing risk assessment tool for international trade compliance. Evaluate pricing methods, documentation adequacy, and tax exposure.",
    type: "website",
  },
};

export default function TransferPricingModelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Transfer Pricing Risk Model</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Scale className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Transfer Pricing Risk Model</h1>
            <p className="text-muted-foreground">Evaluate transfer pricing compliance and tax exposure for related party transactions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Advanced Tool</Badge>
          <Badge variant="outline">Tax Compliance</Badge>
          <Badge variant="outline">OECD Guidelines</Badge>
        </div>
      </div>

      {/* Calculator */}
      <TransferPricingRiskModel />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Transfer Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Transfer Pricing?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Transfer pricing</strong> refers to the pricing of transactions between related 
              entities within a multinational enterprise (MNE). This includes goods, services, 
              intellectual property, loans, and other intercompany arrangements.
            </p>
            <p className="text-muted-foreground mt-3">
              The <strong>arm&apos;s length principle</strong> requires that related parties transact 
              at prices that independent parties would agree under similar circumstances. This principle 
              is the foundation of international transfer pricing rules.
            </p>
          </CardContent>
        </Card>

        {/* Key Concepts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[var(--ocean)]" />
              Key Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Arm&apos;s Length Range:</strong> The range of prices from comparable transactions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Interquartile Range:</strong> Middle 50% of comparable results
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>DEMPE Analysis:</strong> Development, Enhancement, Maintenance, Protection, Exploitation of IP
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Comparability Factors:</strong> Functional, contractual, economic characteristics
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* OECD Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-[var(--ocean)]" />
              OECD Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Chapter I:</strong> Arm&apos;s length principle
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Chapter II:</strong> Transfer pricing methods
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Chapter III:</strong> Comparability analysis
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Chapter V:</strong> Documentation
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Methods Comparison Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
            Transfer Pricing Methods Comparison
          </CardTitle>
          <CardDescription>Overview of OECD-accepted transfer pricing methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Method</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Best For</th>
                  <th className="text-left p-3 font-medium">Reliability</th>
                  <th className="text-left p-3 font-medium">Data Required</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">CUP</td>
                  <td className="p-3 text-muted-foreground">Traditional Transaction</td>
                  <td className="p-3 text-muted-foreground">Commodities, standardized goods</td>
                  <td className="p-3"><Badge className="bg-[var(--logistics)]">Highest</Badge></td>
                  <td className="p-3 text-muted-foreground">Comparable uncontrolled prices</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Resale Price</td>
                  <td className="p-3 text-muted-foreground">Traditional Transaction</td>
                  <td className="p-3 text-muted-foreground">Distribution activities</td>
                  <td className="p-3"><Badge variant="secondary">High</Badge></td>
                  <td className="p-3 text-muted-foreground">Resale price, gross margins</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Cost-Plus</td>
                  <td className="p-3 text-muted-foreground">Traditional Transaction</td>
                  <td className="p-3 text-muted-foreground">Manufacturing, simple services</td>
                  <td className="p-3"><Badge variant="secondary">High</Badge></td>
                  <td className="p-3 text-muted-foreground">Costs, mark-ups</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">TNMM</td>
                  <td className="p-3 text-muted-foreground">Transactional Profit</td>
                  <td className="p-3 text-muted-foreground">Routine distributors, manufacturers</td>
                  <td className="p-3"><Badge className="bg-[var(--ocean)]">Very High</Badge></td>
                  <td className="p-3 text-muted-foreground">Net profit margins, financial data</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Profit Split</td>
                  <td className="p-3 text-muted-foreground">Transactional Profit</td>
                  <td className="p-3 text-muted-foreground">Integrated operations, valuable IP</td>
                  <td className="p-3"><Badge className="bg-[var(--logistics)]">Highest</Badge></td>
                  <td className="p-3 text-muted-foreground">Combined profits, contributions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Requirements */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--ocean)]" />
            Three-Tier Documentation Framework
          </CardTitle>
          <CardDescription>BEPS Action 13 documentation requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-[var(--ocean)]">Master File</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Organizational structure</li>
                <li>• Business description</li>
                <li>• Intangibles ownership</li>
                <li>• Intercompany transactions</li>
                <li>• Financial information</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-[var(--logistics)]">Local File</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Local management structure</li>
                <li>• Functional analysis</li>
                <li>• Transaction details</li>
                <li>• Financial information</li>
                <li>• Comparability analysis</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-amber-600">CbC Report</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Revenue (related/unrelated)</li>
                <li>• Profit/loss before tax</li>
                <li>• Income tax paid/accrued</li>
                <li>• Employees & assets</li>
                <li>• Required for €750M+ groups</li>
              </ul>
            </div>
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
                Prepare documentation contemporaneously before tax return filing
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Update benchmarking studies every 3 years or when circumstances change
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider Advance Pricing Agreements (APAs) for high-risk transactions
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Document business reasons for margin deviations from benchmarks
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Maintain separate entity-level financial records for each jurisdiction
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review safe harbor eligibility annually to simplify compliance
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Audit Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Loss-making entities in low-tax jurisdictions
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Significant intangible transfers to related parties
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Mismatch between functions performed and profits earned
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                High intercompany debt-to-equity ratios
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Frequent changes in transfer pricing methods
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Large transactions with minimal documentation
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
              <AccordionTrigger>What is the arm&apos;s length principle?</AccordionTrigger>
              <AccordionContent>
                The <strong>arm&apos;s length principle</strong> is the international standard for transfer 
                pricing. It requires that transactions between related parties be priced as if they were 
                conducted between independent enterprises under similar circumstances. This principle is 
                embodied in Article 9 of the OECD Model Tax Convention and is the foundation of transfer 
                pricing rules in most countries.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Which transfer pricing method should I use?</AccordionTrigger>
              <AccordionContent>
                There is no hierarchy among OECD methods - choose the method that provides the most 
                reliable arm&apos;s length result. <strong>CUP method</strong> is most reliable when quality 
                comparables exist. <strong>TNMM</strong> is most commonly used due to data availability. 
                <strong>Profit split</strong> is best for integrated operations or when both parties contribute 
                valuable IP. Consider data availability, comparability, and the nature of the transaction.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What documentation do I need to maintain?</AccordionTrigger>
              <AccordionContent>
                Under the BEPS three-tier approach: (1) <strong>Master File</strong> - overview of MNE group 
                structure, business, and policies; (2) <strong>Local File</strong> - detailed information about 
                local entity transactions, financial data, and comparability analysis; (3) <strong>Country-by-Country 
                Report</strong> - for groups with consolidated revenue exceeding €750 million. Documentation 
                should be prepared contemporaneously and updated annually.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What are the penalties for transfer pricing non-compliance?</AccordionTrigger>
              <AccordionContent>
                Penalties vary by jurisdiction but can be severe. In the US, penalties range from 20-40% of 
                the adjustment. The UK can impose penalties up to 100% of tax lost. China may impose penalties 
                up to 500% of underpaid tax. India has penalties of 100-300% of tax. Many jurisdictions also 
                charge interest and may impose penalties for failure to maintain documentation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What is a safe harbor and when can I use it?</AccordionTrigger>
              <AccordionContent>
                A <strong>safe harbor</strong> is a provision that simplifies compliance by prescribing 
                outcomes that are deemed arm&apos;s length. Common safe harbors include: low value-adding 
                services (5-10% mark-up), interest rates based on reference rates, and deemed profit 
                margins for routine activities. Safe harbors reduce compliance costs but may not be 
                optimal if actual arm&apos;s length results would be more favorable.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>Should I consider an Advance Pricing Agreement (APA)?</AccordionTrigger>
              <AccordionContent>
                An <strong>APA</strong> is a binding agreement between a taxpayer and tax authority 
                (or multiple authorities) that sets the transfer pricing methodology for future transactions. 
                Consider an APA when: transactions are high-value or complex, there&apos;s significant 
                audit history or dispute risk, you want certainty for planning purposes, or when operating 
                in high-risk jurisdictions. APAs typically take 1-3 years to negotiate but provide 
                certainty for 3-5 years.
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
            { name: "Landed Cost Calculator", href: "/tools/international-trade/landed-cost-calculator" },
            { name: "Duty & Tariff Calculator", href: "/tools/customs-compliance/duty-tariff-calculator" },
            { name: "FTA Eligibility Checker", href: "/tools/customs-compliance/fta-eligibility" },
            { name: "Credit Risk Scorer", href: "/tools/international-trade/credit-risk-scorer" },
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
