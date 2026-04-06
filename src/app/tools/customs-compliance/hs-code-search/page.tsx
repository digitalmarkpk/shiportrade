import { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HSCodeSearch } from "@/components/tools/HSCodeSearch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "HS Code Search Tool | Shiportrade.com",
  description: "Search and classify Harmonized System codes for international trade. AI-powered HS code finder with duty rates and product descriptions.",
  keywords: ["HS code search", "harmonized system", "tariff code", "customs classification", "product classification"],
};

export default function HSCodeSearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/customs-compliance" className="hover:text-foreground">Customs & Compliance</Link>
        <span>/</span>
        <span className="text-foreground">HS Code Search</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Search className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">HS Code Search Tool</h1>
            <p className="text-muted-foreground">Find the right Harmonized System code for your products</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline">AI-Powered</Badge>
        </div>
      </div>

      {/* Search Tool */}
      <HSCodeSearch />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is an HS Code?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              The <strong>Harmonized System (HS)</strong> is an internationally standardized system 
              of names and numbers to classify traded products. Developed by the World Customs 
              Organization (WCO), it's used by over 200 countries for customs tariffs and 
              international trade statistics.
            </p>
            <p className="text-muted-foreground mt-3">
              HS codes consist of 6 digits at the international level. Individual countries may 
              add additional digits for further classification (up to 10 digits in the US).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-[var(--ocean)]" />
              HS Code Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[var(--ocean)] font-bold text-lg">8471.30.00</span>
              </div>
              <div className="space-y-1 text-xs">
                <div><span className="text-[var(--ocean)]">84</span> = Chapter (Machinery)</div>
                <div><span className="text-[var(--ocean)]">71</span> = Heading (Computers)</div>
                <div><span className="text-[var(--ocean)]">30</span> = Subheading (Portable)</div>
                <div><span className="text-[var(--ocean)]">00</span> = National suffix</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              First 6 digits are internationally standardized. Last 2-4 digits are country-specific.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
              Why It Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Duty Rates:</strong> Determines customs duty percentage
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Trade Agreements:</strong> FTA eligibility depends on classification
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Regulations:</strong> Import/export restrictions by product
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Statistics:</strong> Trade data and market analysis
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tips & Mistakes */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-[var(--logistics)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[var(--logistics)]">
              <Lightbulb className="h-5 w-5" />
              Classification Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Start with the General Rules for Interpretation (GRI)
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Read chapter notes carefully—they override headings
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider the essential character for mixed goods
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Get a binding ruling from customs for certainty
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Document your classification rationale
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
                Using only the heading without checking subheadings
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring chapter and section notes
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using different codes for the same product
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not updating codes when products change
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Choosing the code with lowest duty without justification
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>How accurate is the HS code search?</AccordionTrigger>
              <AccordionContent>
                Our AI-powered search provides suggestions based on product descriptions and 
                official HS code databases. However, HS classification can be complex and 
                subject to interpretation. For definitive classification, consult a licensed 
                customs broker or request a binding ruling from your customs authority.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Do HS codes vary by country?</AccordionTrigger>
              <AccordionContent>
                The first 6 digits are standardized internationally by the WCO. Countries 
                may add additional digits (typically 2-4) for national tariff schedules. 
                For example, the US uses 10-digit HTS codes, while the EU uses 8-digit 
                CN codes. Always verify the full code for your specific destination country.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can using the wrong HS code be penalized?</AccordionTrigger>
              <AccordionContent>
                Yes, misclassification can result in penalties, delays, and potential fraud 
                investigations if customs determines it was intentional. Inadvertent errors 
                may result in duty underpayment charges plus interest. Always ensure 
                classifications are supportable and documented.
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
            { name: "Customs Duty Calculator", href: "/tools/customs-compliance/customs-duty" },
            { name: "Landed Cost Calculator", href: "/tools/international-trade/landed-cost-calculator" },
            { name: "FTA Eligibility Checker", href: "/tools/international-trade/fta-eligibility" },
            { name: "Tariff Comparison", href: "/tools/international-trade/tariff-comparison" },
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
