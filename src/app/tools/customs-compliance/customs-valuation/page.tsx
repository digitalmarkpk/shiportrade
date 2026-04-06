import { Metadata } from "next";
import { CustomsValuationTool } from "@/components/tools/CustomsValuationTool";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Scale, FileText, HelpCircle, AlertTriangle, CheckCircle, Ship, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customs Valuation Tool | Shiportrade.com",
  description: "Calculate customs value using WTO Valuation Agreement methods. Transaction value, CIF calculation, deductive value, computed value, and more.",
  keywords: ["customs valuation", "WTO valuation", "CIF value", "transaction value", "customs duty", "import value", "WTO Agreement"],
};

const WTO_METHODS = [
  {
    id: 1,
    name: "Transaction Value",
    article: "Article 1",
    description: "The price actually paid or payable for goods when sold for export to the country of importation.",
    color: "#0F4C81",
  },
  {
    id: 2,
    name: "Transaction Value of Identical Goods",
    article: "Article 2",
    description: "Based on the transaction value of identical goods sold for export to the same country.",
    color: "#2E8B57",
  },
  {
    id: 3,
    name: "Transaction Value of Similar Goods",
    article: "Article 3",
    description: "Based on the transaction value of similar goods with like characteristics.",
    color: "#F59E0B",
  },
  {
    id: 4,
    name: "Deductive Value",
    article: "Article 5",
    description: "Computed by deducting costs from the unit selling price in the country of import.",
    color: "#8B5CF6",
  },
  {
    id: 5,
    name: "Computed Value",
    article: "Article 6",
    description: "Computed from the cost of production plus profit and general expenses.",
    color: "#EF4444",
  },
  {
    id: 6,
    name: "Fall-back Method",
    article: "Article 7",
    description: "Flexible application of previous methods using reasonable means.",
    color: "#06B6D4",
  },
];

const FAQS = [
  {
    question: "What is the primary method for customs valuation?",
    answer: "The Transaction Value Method (Method 1) is the primary and most commonly used method. It uses the price actually paid or payable for the imported goods when sold for export. This method is used in over 90% of customs transactions worldwide when the conditions are met.",
  },
  {
    question: "When can Transaction Value NOT be used?",
    answer: "Transaction Value cannot be used when: (1) There are restrictions on the buyer's disposition of the goods; (2) The sale or price is subject to conditions that cannot be valued; (3) Part of the proceeds goes to the seller but isn't included in the price; (4) Buyer and seller are related and the relationship influenced the price.",
  },
  {
    question: "What costs must be added to the transaction value?",
    answer: "Under WTO Article 8, the following must be added if not already included: packing costs, selling commissions, assists (goods/services supplied by buyer), royalties and license fees (if condition of sale), proceeds of resale accruing to seller, freight and insurance to port of import, and loading/handling charges.",
  },
  {
    question: "How is CIF value calculated?",
    answer: "CIF (Cost, Insurance, Freight) value = Transaction Value + Freight to port of import + Insurance + Other additions (packing, assists, royalties, etc.). This represents the total value of goods at the point of importation.",
  },
  {
    question: "What is the difference between deductive and computed value?",
    answer: "Deductive Value (Method 4) starts from the resale price in the importing country and works backward by deducting costs. Computed Value (Method 5) starts from production costs and works forward by adding profit and expenses. Both require cooperation from sellers/manufacturers.",
  },
  {
    question: "How are related party transactions handled?",
    answer: "Related party transactions can still use Transaction Value if the relationship did not influence the price. This can be demonstrated through: (1) circumstantial evidence showing the price is comparable to identical/similar goods; (2) showing the price covers all costs plus a profit typical for that industry.",
  },
];

const RELATED_TOOLS = [
  {
    title: "Landed Cost Calculator",
    description: "Calculate total cost including duties, taxes, and fees",
    href: "/tools/international-trade/landed-cost-calculator",
  },
  {
    title: "HS Code Search",
    description: "Find correct HS codes for your products",
    href: "/tools/customs-compliance/hs-code-search",
  },
  {
    title: "Duty & Tariff Calculator",
    description: "Estimate import duties and tariffs",
    href: "/tools/customs-compliance/duty-tariff-calculator",
  },
  {
    title: "FTA Eligibility Checker",
    description: "Check free trade agreement eligibility",
    href: "/tools/customs-compliance/fta-eligibility",
  },
];

export default function CustomsValuationPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Scale className="h-3 w-3 mr-2" />
          Customs Compliance
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Customs Valuation Tool
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate customs value using WTO Valuation Agreement methods. Supports transaction value, 
          CIF calculation, deductive value, computed value, and method hierarchy analysis.
        </p>
      </div>

      {/* Calculator Tool */}
      <CustomsValuationTool />

      {/* Educational Content */}
      <div className="mt-12 space-y-8">
        {/* WTO Methods Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-[var(--ocean)]" />
              WTO Valuation Agreement Methods
            </CardTitle>
            <CardDescription>
              The Agreement on Implementation of Article VII of GATT 1994 establishes 6 methods applied in sequential order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WTO_METHODS.map((method, index) => (
                <div
                  key={method.id}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: method.color + "40" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: method.color }}
                    >
                      {method.id}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{method.name}</div>
                      <div className="text-xs text-muted-foreground">{method.article}</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                  {index < 5 && (
                    <div className="flex justify-end mt-2">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Understanding CIF Value */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ship className="h-5 w-5 text-[var(--logistics)]" />
                Understanding CIF Value
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                CIF (Cost, Insurance, Freight) represents the total value of goods at the port of destination.
                Most countries use CIF as the basis for calculating customs duties.
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-center font-mono mb-3">
                  CIF = Cost + Insurance + Freight
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost</span>
                    <span>Invoice value of goods</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insurance</span>
                    <span>Marine/cargo insurance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Freight</span>
                    <span>Transport to destination</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--ocean)]" />
                Valuation by Country
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Different countries may use different valuation bases:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[var(--ocean)] flex items-center justify-center text-white text-xs font-bold">
                    US
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">United States</div>
                    <div className="text-xs text-muted-foreground">Uses FOB + additions basis</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[var(--logistics)] flex items-center justify-center text-white text-xs font-bold">
                    EU
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">European Union</div>
                    <div className="text-xs text-muted-foreground">Uses CIF basis for customs value</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                    CN
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">China</div>
                    <div className="text-xs text-muted-foreground">Uses CIF basis with VAT on duty-inclusive value</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additions to Transaction Value */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--ocean)]" />
              Additions to Transaction Value (WTO Article 8)
            </CardTitle>
            <CardDescription>
              The following items must be added to the price actually paid if not already included
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Addition Type</th>
                    <th className="text-left p-3">Description</th>
                    <th className="text-left p-3">Documentation Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Packing Costs</td>
                    <td className="p-3 text-muted-foreground">Labor, materials, containers used for packing</td>
                    <td className="p-3 text-muted-foreground">Packing invoices, work orders</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Selling Commissions</td>
                    <td className="p-3 text-muted-foreground">Commissions paid by seller to agent</td>
                    <td className="p-3 text-muted-foreground">Commission agreements</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Assists</td>
                    <td className="p-3 text-muted-foreground">Goods/services supplied by buyer (tools, dies, engineering)</td>
                    <td className="p-3 text-muted-foreground">Transfer records, agreements</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Royalties & License Fees</td>
                    <td className="p-3 text-muted-foreground">Payments as condition of sale</td>
                    <td className="p-3 text-muted-foreground">License agreements</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Freight to Port</td>
                    <td className="p-3 text-muted-foreground">Transport costs to port of importation</td>
                    <td className="p-3 text-muted-foreground">Freight invoices, B/L</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Insurance</td>
                    <td className="p-3 text-muted-foreground">Insurance costs during transport</td>
                    <td className="p-3 text-muted-foreground">Insurance certificates</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="bg-[var(--ocean)]/5 border-[var(--ocean)]/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[var(--logistics)]" />
              Pro Tips for Customs Valuation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Document Everything",
                  description: "Maintain complete records of all costs, payments, and agreements supporting the declared value.",
                },
                {
                  title: "Related Party Test",
                  description: "For related party transactions, be prepared to demonstrate that the relationship didn't influence the price.",
                },
                {
                  title: "Currency Conversion",
                  description: "Use the official exchange rate on the date of customs declaration, not the payment date.",
                },
                {
                  title: "First Sale Rule",
                  description: "Some countries allow using the first sale price in multi-tier transactions for lower duties.",
                },
                {
                  title: "Assists Documentation",
                  description: "Keep records of any tools, molds, or engineering services provided to the manufacturer.",
                },
                {
                  title: "Royalty Agreements",
                  description: "Review royalty/license agreements to determine if payments are dutiable as condition of sale.",
                },
              ].map((tip, index) => (
                <div key={index} className="p-3 bg-white dark:bg-gray-900 rounded-lg border">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-medium text-sm">{tip.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  mistake: "Omitting assists value",
                  consequence: "Under-valuation penalties and back duties",
                },
                {
                  mistake: "Using wrong Incoterm basis",
                  consequence: "Incorrect freight/insurance calculations",
                },
                {
                  mistake: "Not declaring royalties",
                  consequence: "Penalties for false declaration",
                },
                {
                  mistake: "Incorrect currency conversion date",
                  consequence: "Duty miscalculation",
                },
                {
                  mistake: "Missing first sale documentation",
                  consequence: "Lost opportunity for lower valuation",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <span className="font-medium text-sm">{item.mistake}</span>
                    <p className="text-xs text-muted-foreground">{item.consequence}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Tools</CardTitle>
            <CardDescription>
              Explore other customs and trade compliance tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {RELATED_TOOLS.map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="h-full hover:border-[var(--ocean)]/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
