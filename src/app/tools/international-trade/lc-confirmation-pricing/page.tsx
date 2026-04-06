import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  TrendingUp,
  BarChart3,
  Globe,
  DollarSign,
  Building2,
  Percent,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LCConfirmationPricing from "@/components/tools/LCConfirmationPricing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "LC Confirmation Risk Pricing Calculator | Shiportrade.com",
  description: "Calculate Letter of Credit confirmation fees, assess country and bank risk premiums, and compare costs with/without confirmation. Make informed trade finance decisions.",
  keywords: ["LC confirmation", "letter of credit confirmation", "confirmation fee", "bank risk", "country risk", "trade finance", "UCP 600", "silent confirmation"],
  openGraph: {
    title: "LC Confirmation Risk Pricing Calculator",
    description: "Comprehensive LC confirmation pricing tool with risk assessment, fee calculation, and cost comparison for international trade.",
    type: "website",
  },
};

export default function LCConfirmationPricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">LC Confirmation Pricing</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">LC Confirmation Risk Pricing Calculator</h1>
            <p className="text-muted-foreground">Assess risk and calculate confirmation fees for Letters of Credit</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Advanced Tool</Badge>
          <Badge variant="outline">Trade Finance</Badge>
          <Badge variant="outline">Risk Assessment</Badge>
        </div>
      </div>

      {/* Calculator */}
      <LCConfirmationPricing />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is LC Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is LC Confirmation?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>LC Confirmation</strong> is an irrevocable undertaking by a confirming bank 
              (in addition to the issuing bank&apos;s commitment) to honor a complying presentation 
              under a Letter of Credit.
            </p>
            <p className="text-muted-foreground mt-3">
              When an LC is confirmed, the beneficiary has payment security from both the issuing 
              bank and the confirming bank, effectively eliminating the risk of the issuing bank 
              defaulting or the issuing country&apos;s economic or political instability affecting payment.
            </p>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
              <strong className="text-blue-700 dark:text-blue-300">UCP 600 Article 8:</strong>
              <span className="text-muted-foreground ml-1">Confirms the confirming bank&apos;s obligations are identical to the issuing bank&apos;s.</span>
            </div>
          </CardContent>
        </Card>

        {/* Key Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
              Risk Factors Explained
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Country Risk:</strong> Political stability, economic conditions, foreign exchange availability
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Bank Risk:</strong> Credit rating, financial strength, historical performance
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Percent className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Tenor Risk:</strong> Longer terms increase exposure to market and credit changes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Currency Risk:</strong> Non-convertible or volatile currencies add premium
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* When to Confirm */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
              When to Confirm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Issuing bank in a high-risk country (OECD Category 3+)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Unknown or lower-rated issuing bank
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Large transaction value requiring maximum security
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Foreign exchange restrictions in issuing country
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  First-time trade relationship with buyer
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Country Risk Reference Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-[var(--ocean)]" />
            Country Risk Classification Reference
          </CardTitle>
          <CardDescription>OECD-style country risk categories and typical confirmation premiums</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Risk Level</th>
                  <th className="text-left p-3 font-medium">Example Countries</th>
                  <th className="text-right p-3 font-medium">Typical Premium</th>
                  <th className="text-left p-3 font-medium">Confirmation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">0-1</td>
                  <td className="p-3"><span className="text-green-600">Low Risk</span></td>
                  <td className="p-3 text-muted-foreground">US, UK, Germany, Japan, Singapore</td>
                  <td className="p-3 text-right">0.10-0.20%</td>
                  <td className="p-3">Usually not required</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">2</td>
                  <td className="p-3"><span className="text-lime-600">Low-Medium</span></td>
                  <td className="p-3 text-muted-foreground">UAE, China, Thailand, Malaysia</td>
                  <td className="p-3 text-right">0.25-0.45%</td>
                  <td className="p-3">Consider for larger values</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">3</td>
                  <td className="p-3"><span className="text-amber-600">Medium Risk</span></td>
                  <td className="p-3 text-muted-foreground">India, Brazil, Mexico, Indonesia</td>
                  <td className="p-3 text-right">0.50-0.80%</td>
                  <td className="p-3">Recommended</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">4-5</td>
                  <td className="p-3"><span className="text-orange-600">High Risk</span></td>
                  <td className="p-3 text-muted-foreground">Vietnam, South Africa, Egypt, Turkey</td>
                  <td className="p-3 text-right">0.90-1.80%</td>
                  <td className="p-3">Strongly recommended</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">6-7</td>
                  <td className="p-3"><span className="text-red-600">Very High Risk</span></td>
                  <td className="p-3 text-muted-foreground">Russia, Pakistan, Nigeria</td>
                  <td className="p-3 text-right">2.00-3.00%+</td>
                  <td className="p-3">Essential - may require cash collateral</td>
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
                Negotiate confirmation fees - banks have flexibility, especially for regular customers
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider silent confirmation when you want protection without notifying the issuing bank
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Compare multiple confirming banks - rates can vary significantly
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                For recurring LCs from the same bank, negotiate a master confirmation agreement
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Ask the buyer to request confirmation at their bank - they may get better rates
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Monitor country and bank risk ratings - premiums can change rapidly
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
                Assuming LC from any bank is equally secure - always check the issuing bank&apos;s rating
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring country risk - even strong banks in unstable countries face challenges
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not comparing confirmation costs against potential loss exposure
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Waiting too long to request confirmation - banks may decline near expiry
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking the difference between confirmed and advised LCs
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not reading the confirmation terms carefully - some have limitations
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
              <AccordionTrigger>What is the difference between confirmed and advised LC?</AccordionTrigger>
              <AccordionContent>
                An <strong>advised LC</strong> means the advising bank has authenticated the LC and forwarded it 
                to the beneficiary, but assumes no payment obligation. A <strong>confirmed LC</strong> adds the 
                confirming bank&apos;s irrevocable payment undertaking. With confirmation, the beneficiary can 
                present documents to the confirming bank and receive payment even if the issuing bank defaults. 
                Confirmation provides double security but costs extra.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is silent confirmation and when should I use it?</AccordionTrigger>
              <AccordionContent>
                <strong>Silent confirmation</strong> (also called &quot;confirmation without recourse&quot;) is when a bank 
                adds its commitment to pay without informing or seeking approval from the issuing bank. The 
                beneficiary gets protection, but the issuing bank is unaware. This is useful when: (1) the 
                issuing bank might object to confirmation, (2) you want to maintain flexibility, or (3) the 
                issuing bank&apos;s country has restrictions on foreign bank confirmations. Silent confirmation 
                typically costs 20-30% more than standard confirmation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How are confirmation fees calculated?</AccordionTrigger>
              <AccordionContent>
                Confirmation fees are typically calculated as a percentage of the LC amount, based on: 
                (1) <strong>Base rate</strong> - the bank&apos;s standard fee (varies by bank), (2) <strong>Country risk premium</strong> - 
                based on the issuing bank&apos;s country risk category, (3) <strong>Bank risk premium</strong> - based on 
                the issuing bank&apos;s credit rating, (4) <strong>Tenor adjustment</strong> - longer terms incur higher 
                fees, and (5) <strong>Currency adjustment</strong> - non-USD or restricted currencies add cost. 
                Most banks have minimum fees (typically $250-500).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Can confirmation fees be shared or passed to the buyer?</AccordionTrigger>
              <AccordionContent>
                Yes, confirmation costs can be negotiated between buyer and seller. Options include: 
                (1) <strong>Buyer pays all</strong> - buyer requests confirmation at their bank and pays the fee, 
                (2) <strong>Seller pays all</strong> - seller requests confirmation from their bank, (3) <strong>Shared</strong> - 
                costs are split between parties, typically negotiated in the sales contract. For the seller, 
                it&apos;s often worth negotiating for the buyer to arrange and pay for confirmation from a 
                top-tier bank in their country.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What happens if the confirming bank defaults?</AccordionTrigger>
              <AccordionContent>
                While rare, if a confirming bank defaults, the beneficiary still has recourse to the 
                issuing bank under the original LC terms. The LC remains valid and payable by the 
                issuing bank upon complying presentation. This is why confirmation is most valuable 
                when the confirming bank is in a different country and has a stronger credit rating 
                than the issuing bank. If both banks are in the same country, the risk mitigation 
                benefit is reduced.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>Should I always get confirmation for high-risk countries?</AccordionTrigger>
              <AccordionContent>
                For high-risk countries (OECD Category 4+), confirmation is strongly recommended. However, 
                consider these factors: (1) Some banks may <strong>refuse to confirm</strong> LCs from certain 
                countries or banks due to sanctions or excessive risk, (2) If confirmation is available, 
                fees will be high (1.5-3%+), (3) Alternatives include <strong>export credit insurance</strong> 
                or requiring the buyer to open the LC through a <strong>branch of an international bank</strong> 
                in their country. Always weigh the confirmation cost against the transaction size and your 
                risk tolerance.
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
            { name: "LC Discrepancy Analyzer", href: "/tools/international-trade/lc-discrepancy-analyzer" },
            { name: "Credit Risk Scorer", href: "/tools/international-trade/credit-risk-scorer" },
            { name: "FX Hedging Calculator", href: "/tools/international-trade/fx-hedging" },
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
