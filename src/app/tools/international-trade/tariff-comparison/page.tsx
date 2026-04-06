import { Metadata } from "next";
import Link from "next/link";
import {
  GitCompare,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Shield,
  Percent,
  Flag,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TradeTariffComparison from "@/components/tools/TradeTariffComparison";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Trade Tariff Comparison Tool | Shiportrade.com",
  description: "Compare trade tariffs across countries, check FTA eligibility, analyze MFN vs FTA rates, anti-dumping duties, and tariff escalation. Make informed sourcing decisions.",
  keywords: ["tariff comparison", "FTA eligibility", "MFN rate", "anti-dumping duty", "trade tariff", "HS code", "free trade agreement", "tariff escalation"],
  openGraph: {
    title: "Trade Tariff Comparison Tool",
    description: "Comprehensive tariff comparison tool for international traders. Compare duties across countries, check FTA eligibility, and optimize your trade costs.",
    type: "website",
  },
};

export default function TariffComparisonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Trade Tariff Comparison</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <GitCompare className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Trade Tariff Comparison</h1>
            <p className="text-muted-foreground">Compare tariffs, check FTA eligibility, and optimize your trade costs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Advanced Tool</Badge>
          <Badge variant="outline">Customs & Tariffs</Badge>
          <Badge variant="outline">FTA Analysis</Badge>
        </div>
      </div>

      {/* Calculator */}
      <TradeTariffComparison />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What are Trade Tariffs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Trade Tariffs
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Trade tariffs</strong> are taxes imposed on imported goods, calculated as a 
              percentage of the goods&apos; value. They serve multiple purposes: protecting domestic 
              industries, generating government revenue, and regulating international trade.
            </p>
            <p className="text-muted-foreground mt-3">
              The rate applied depends on the product&apos;s HS code classification, country of origin, 
              and any applicable trade agreements. Understanding tariffs is essential for accurate 
              landed cost calculation and competitive pricing.
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
                  <strong>MFN Rate:</strong> Standard WTO tariff applied to member countries
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>FTA Rate:</strong> Preferential rate under free trade agreements
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Anti-Dumping:</strong> Additional duty on unfairly priced imports
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Escalation:</strong> Higher tariffs on more processed goods
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
              When to Use This Tool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Flag className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Comparing sourcing options across countries
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Flag className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Checking FTA eligibility for your products
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Flag className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Identifying anti-dumping risks
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Flag className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Calculating landed costs for pricing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Flag className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Planning supply chain strategies
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tariff Rate Comparison Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-[var(--ocean)]" />
            Sample MFN Duty Rates by Product Category
          </CardTitle>
          <CardDescription>Representative MFN rates for common product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">HS Chapter</th>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-center p-3 font-medium">Typical MFN Rate</th>
                  <th className="text-left p-3 font-medium">FTA Potential</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">84</td>
                  <td className="p-3 text-muted-foreground">Nuclear Reactors, Machinery</td>
                  <td className="p-3 text-center">2.5%</td>
                  <td className="p-3 text-muted-foreground">Often 0% under FTAs</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">85</td>
                  <td className="p-3 text-muted-foreground">Electrical Machinery & Equipment</td>
                  <td className="p-3 text-center">0%</td>
                  <td className="p-3 text-muted-foreground">Already duty-free</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">61-62</td>
                  <td className="p-3 text-muted-foreground">Apparel & Clothing</td>
                  <td className="p-3 text-center">12%</td>
                  <td className="p-3 text-muted-foreground">High FTA savings potential</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">64</td>
                  <td className="p-3 text-muted-foreground">Footwear</td>
                  <td className="p-3 text-center">15%</td>
                  <td className="p-3 text-muted-foreground">Significant FTA savings</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">87</td>
                  <td className="p-3 text-muted-foreground">Vehicles & Auto Parts</td>
                  <td className="p-3 text-center">4%</td>
                  <td className="p-3 text-muted-foreground">0% under USMCA, EU FTAs</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">39</td>
                  <td className="p-3 text-muted-foreground">Plastics & Articles</td>
                  <td className="p-3 text-center">6.5%</td>
                  <td className="p-3 text-muted-foreground">Moderate FTA savings</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">72-73</td>
                  <td className="p-3 text-muted-foreground">Iron, Steel & Articles</td>
                  <td className="p-3 text-center">4-5%</td>
                  <td className="p-3 text-muted-foreground">Watch for anti-dumping</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FTA Benefits Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--ocean)]" />
            Major Free Trade Agreements Overview
          </CardTitle>
          <CardDescription>Key FTAs and their duty elimination benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-[var(--ocean)]/5">
              <h4 className="font-semibold text-[var(--ocean)] mb-2">USMCA (NAFTA 2.0)</h4>
              <p className="text-sm text-muted-foreground mb-2">US, Canada, Mexico</p>
              <div className="text-xs space-y-1">
                <p>• ~100% duty elimination on qualifying goods</p>
                <p>• 75% regional value content for autos</p>
                <p>• Strong rules of origin enforcement</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-[var(--logistics)]/5">
              <h4 className="font-semibold text-[var(--logistics)] mb-2">RCEP</h4>
              <p className="text-sm text-muted-foreground mb-2">15 Asia-Pacific nations</p>
              <div className="text-xs space-y-1">
                <p>• ~92% duty elimination over 20 years</p>
                <p>• 40% regional value content</p>
                <p>• Largest FTA by GDP</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <h4 className="font-semibold text-amber-700 mb-2">CPTPP</h4>
              <p className="text-sm text-muted-foreground mb-2">11 Pacific nations</p>
              <div className="text-xs space-y-1">
                <p>• ~98% duty elimination</p>
                <p>• 40% regional value content</p>
                <p>• High-standard trade rules</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <h4 className="font-semibold text-purple-700 mb-2">EU-Japan EPA</h4>
              <p className="text-sm text-muted-foreground mb-2">EU member states + Japan</p>
              <div className="text-xs space-y-1">
                <p>• ~99% duty elimination</p>
                <p>• 50% regional value content</p>
                <p>• EUR.1 certificate required</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
              <h4 className="font-semibold text-cyan-700 mb-2">ASEAN ATIGA</h4>
              <p className="text-sm text-muted-foreground mb-2">10 ASEAN members</p>
              <div className="text-xs space-y-1">
                <p>• ~99% duty elimination</p>
                <p>• 40% regional value content</p>
                <p>• Form D certificate</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-pink-50 dark:bg-pink-900/20">
              <h4 className="font-semibold text-pink-700 mb-2">EU-UK TCA</h4>
              <p className="text-sm text-muted-foreground mb-2">EU + United Kingdom</p>
              <div className="text-xs space-y-1">
                <p>• 100% duty-free trade</p>
                <p>• 50% regional value content</p>
                <p>• Origin declaration</p>
              </div>
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
              Pro Tips for Tariff Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Always verify HS code classification with a customs broker
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Check FTA eligibility early in the sourcing process
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Maintain detailed records for rules of origin compliance
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Monitor anti-dumping measures - they change frequently
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider semi-processed goods to avoid tariff escalation
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use first-sale valuation when possible for lower duty base
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Incorrect HS code classification leading to wrong duty rates
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Claiming FTA benefits without proper documentation
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring rules of origin requirements
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not checking anti-dumping duties before sourcing
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using outdated tariff rate information
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Assuming all FTAs have the same requirements
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
              <AccordionTrigger>What is the difference between MFN and FTA rates?</AccordionTrigger>
              <AccordionContent>
                <strong>MFN (Most Favored Nation)</strong> rates are standard WTO tariff rates applied to 
                imports from WTO member countries when no preferential agreement exists. <strong>FTA rates</strong> 
                are preferential, often zero, rates available under Free Trade Agreements when goods meet 
                rules of origin requirements. FTAs can eliminate or significantly reduce duties compared to MFN rates.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How do I qualify for FTA preferential rates?</AccordionTrigger>
              <AccordionContent>
                To qualify for FTA preferential rates, your product must meet <strong>rules of origin</strong> 
                requirements, which typically include: (1) goods must be wholly obtained in an FTA member country, 
                or (2) meet a regional value content threshold (often 40-60%), or (3) undergo sufficient 
                transformation (tariff shift). You&apos;ll also need proper documentation like a Certificate of Origin 
                and ensure direct shipment between FTA parties.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What are anti-dumping duties and when do they apply?</AccordionTrigger>
              <AccordionContent>
                <strong>Anti-dumping (AD) duties</strong> are additional tariffs imposed on imports sold below 
                fair market value in the exporting country, which can harm domestic industries. They are 
                product-specific and country-specific, applied on top of regular customs duties. AD duties 
                can be very high (50-300%+) and are determined through investigation by the importing country&apos;s 
                trade authority. Check current AD measures before sourcing from specific countries.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What is tariff escalation and why does it matter?</AccordionTrigger>
              <AccordionContent>
                <strong>Tariff escalation</strong> is the practice of applying progressively higher tariff rates 
                as goods undergo more processing - raw materials have lower rates, semi-processed goods have 
                medium rates, and finished products have the highest rates. This protects domestic processing 
                industries. Understanding escalation helps you evaluate whether importing raw materials for 
                local processing might be more cost-effective than importing finished goods.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How do I find the correct HS code for my product?</AccordionTrigger>
              <AccordionContent>
                Finding the correct HS code requires: (1) Review the Harmonized System structure - first 2 
                digits identify the chapter, (2) Use official customs databases (USITC, TARIC, WTO HS Database), 
                (3) Check the product&apos;s composition, function, and manufacturing process, (4) Consider 
                <strong>consulting a licensed customs broker</strong> for complex products, (5) Request a binding 
                ruling from customs authorities for certainty. Incorrect classification can result in duty 
                underpayments, penalties, or delays.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>Can I claim FTA benefits retroactively?</AccordionTrigger>
              <AccordionContent>
                In many cases, <strong>yes</strong>, but rules vary by country and FTA. The US allows claims 
                within one year of importation (19 CFR 10.114). The EU typically allows 2 years. You&apos;ll need 
                to submit a valid Certificate of Origin and request a refund from customs. However, it&apos;s 
                always better to claim FTA benefits at the time of import to avoid additional paperwork and 
                potential issues. Check specific FTA provisions for retroactive claim deadlines.
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
            { name: "FTA Eligibility Checker", href: "/tools/customs-compliance/fta-eligibility" },
            { name: "Duty Tariff Calculator", href: "/tools/customs-compliance/duty-tariff-calculator" },
            { name: "HS Code Search", href: "/tools/customs-compliance/hs-code-search" },
            { name: "Landed Cost Calculator", href: "/tools/international-trade/landed-cost-calculator" },
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
