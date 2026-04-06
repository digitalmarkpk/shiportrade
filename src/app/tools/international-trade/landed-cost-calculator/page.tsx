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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LandedCostCalculator } from "@/components/tools/LandedCostCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Landed Cost Calculator | Shiportrade.com",
  description: "Calculate total landed cost for imported goods including customs duty, VAT/GST, freight, insurance, and other charges. Free and accurate.",
  keywords: ["landed cost calculator", "import duty calculator", "CIF calculator", "customs duty", "total cost of import"],
  openGraph: {
    title: "Landed Cost Calculator - Free Tool",
    description: "Calculate the true cost of your imports with duty, VAT, freight, and insurance.",
    type: "website",
  },
};

export default function LandedCostCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Landed Cost Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Calculator className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Landed Cost Calculator</h1>
            <p className="text-muted-foreground">Calculate the true cost of your imports</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      {/* Calculator */}
      <LandedCostCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Purpose */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Landed Cost?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Landed cost</strong> is the total price of a product once it has arrived at a buyer's door. 
              It includes the original product price, transportation fees (freight), insurance, customs duties, 
              taxes (VAT/GST), and any other charges incurred during the shipping process.
            </p>
            <p className="text-muted-foreground mt-3">
              Understanding landed cost is crucial for importers and exporters to accurately price products, 
              maintain profit margins, and make informed sourcing decisions. Many businesses underestimate 
              their true import costs by focusing only on the product and freight prices.
            </p>
          </CardContent>
        </Card>

        {/* Formula */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-[var(--ocean)]" />
              Calculation Formula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
              <div>
                <span className="text-[var(--ocean)]">CIF Value</span> = Product + Freight + Insurance
              </div>
              <div>
                <span className="text-[var(--logistics)]">Customs Duty</span> = CIF × Duty Rate
              </div>
              <div>
                <span className="text-amber-500">VAT/GST</span> = (CIF + Duty) × VAT Rate
              </div>
              <div className="pt-2 border-t border-border">
                <strong>Landed Cost</strong> = CIF + Duty + VAT + Other
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 inline mr-1" />
              VAT is typically calculated on CIF value plus customs duty. Rates vary by country and product classification.
            </p>
          </CardContent>
        </Card>

        {/* WH Framework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
              When to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Import Planning:</strong> Before placing orders to estimate true costs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Price Setting:</strong> To determine profitable selling prices
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Supplier Comparison:</strong> Compare total costs from different origins
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Budgeting:</strong> Accurate financial planning for imports
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
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Always verify HS codes with a licensed customs broker for accurate duty rates
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Check if your product qualifies for FTA (Free Trade Agreement) preferential rates
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Include handling charges, port fees, and documentation costs in "Other Charges"
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Insurance is typically 0.5-2% of CIF value depending on goods
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Factor in currency fluctuation risk for long transit times
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
                Using incorrect HS codes leading to wrong duty calculations
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting to include insurance costs
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for anti-dumping duties on specific products
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking destination port handling charges
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using outdated duty rates (rates change periodically)
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
              <AccordionTrigger>What is CIF value?</AccordionTrigger>
              <AccordionContent>
                CIF stands for Cost, Insurance, and Freight. It represents the total value of goods 
                including their purchase price, insurance costs, and freight charges to the port of 
                destination. Customs duties are typically calculated based on CIF value.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How is customs duty calculated?</AccordionTrigger>
              <AccordionContent>
                Customs duty is calculated as a percentage of the CIF value. The percentage (duty rate) 
                depends on the HS code classification of the goods and the country of origin. Some 
                products may have specific rates, anti-dumping duties, or preferential rates under 
                Free Trade Agreements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What's the difference between VAT and GST?</AccordionTrigger>
              <AccordionContent>
                VAT (Value Added Tax) and GST (Goods and Services Tax) are similar consumption taxes 
                applied to imported goods. The terminology differs by country. For imports, they're 
                typically calculated on the CIF value plus any customs duties. Rates vary significantly 
                by country, from 0% to 27%.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Where can I find the correct HS code for my product?</AccordionTrigger>
              <AccordionContent>
                You can use our <Link href="/tools/customs-compliance/hs-code-search" className="text-[var(--ocean)] hover:underline">HS Code Search Tool</Link> to 
                find the appropriate code for your product. For definitive classification, consult 
                with a licensed customs broker or your local customs authority, as incorrect 
                classification can lead to penalties.
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
            { name: "Profit Margin Calculator", href: "/tools/international-trade/profit-margin-calculator" },
            { name: "Currency Converter", href: "/tools/international-trade/currency-converter" },
            { name: "HS Code Search", href: "/tools/customs-compliance/hs-code-search" },
            { name: "FTA Eligibility Checker", href: "/tools/international-trade/fta-eligibility" },
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
