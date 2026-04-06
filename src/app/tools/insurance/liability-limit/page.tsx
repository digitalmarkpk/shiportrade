import { Metadata } from "next";
import { LiabilityLimitCalculator } from "@/components/tools/LiabilityLimitCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Scale,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle2,
  Ship,
  Plane,
  Truck,
  Train,
  ArrowRight,
  Clock,
  FileWarning,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Carrier Liability Limit Calculator | Shiportrade.com",
  description:
    "Calculate carrier liability limits under international conventions (Hague-Visby, Montreal, CMR, CIM). Analyze coverage gaps and get insurance recommendations.",
  keywords: [
    "carrier liability",
    "liability limit",
    "Hague-Visby",
    "Montreal Convention",
    "CMR",
    "CIM",
    "cargo insurance",
    "SDR",
    "coverage gap",
  ],
};

export default function LiabilityLimitPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Scale className="h-3 w-3 mr-2" />
          Insurance Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Carrier Liability Limit Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate carrier liability limits under international conventions. Understand your
          coverage gap and get insurance recommendations for complete cargo protection.
        </p>
      </div>

      {/* Calculator */}
      <LiabilityLimitCalculator />

      {/* Educational Content */}
      <div className="mt-12 space-y-6">
        {/* Quick Reference Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5">
            <CardContent className="pt-6">
              <Ship className="h-8 w-8 text-[#0F4C81] mb-3" />
              <h3 className="font-semibold mb-1">Sea Freight</h3>
              <p className="text-sm text-muted-foreground">
                Hague-Visby: 2 SDR/kg<br />
                Hamburg: 2.5 SDR/kg
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#2E8B57]/10 to-[#2E8B57]/5">
            <CardContent className="pt-6">
              <Plane className="h-8 w-8 text-[#2E8B57] mb-3" />
              <h3 className="font-semibold mb-1">Air Freight</h3>
              <p className="text-sm text-muted-foreground">
                Montreal: 22 SDR/kg<br />
                Warsaw: 17 SDR/kg
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
            <CardContent className="pt-6">
              <Truck className="h-8 w-8 text-amber-500 mb-3" />
              <h3 className="font-semibold mb-1">Road Transport</h3>
              <p className="text-sm text-muted-foreground">
                CMR: 8.33 SDR/kg<br />
                European standard
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardContent className="pt-6">
              <Train className="h-8 w-8 text-purple-500 mb-3" />
              <h3 className="font-semibold mb-1">Rail Transport</h3>
              <p className="text-sm text-muted-foreground">
                CIM: 17 SDR/kg<br />
                SMGS: 15 SDR/kg
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Carrier Liability is Limited */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-[#0F4C81]" />
                Why Carrier Liability is Limited
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                International conventions limit carrier liability to balance the interests of
                all parties involved in cargo transportation:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                  <span>
                    <strong>Predictability:</strong> Carriers know their maximum exposure
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                  <span>
                    <strong>Affordable Rates:</strong> Lower freight costs due to limited liability
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                  <span>
                    <strong>Insurance Solution:</strong> Encourages cargo insurance for full coverage
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                  <span>
                    <strong>Uniform Rules:</strong> Standardized international framework
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileWarning className="h-5 w-5 text-[#2E8B57]" />
                Carrier Defenses
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Carriers may limit or avoid liability entirely by proving certain defenses:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>Act of God:</strong> Natural disasters, extreme weather
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>Inherent Vice:</strong> Natural deterioration of goods
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>Shipper Fault:</strong> Improper packaging or declaration
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>Negligent Navigation:</strong> Errors in vessel management (sea only)
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Time Limits and Procedures */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#0F4C81]" />
              Critical Time Limits
            </CardTitle>
            <CardDescription>
              Acting within time limits is essential for preserving your rights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-600 mb-2">Written Notice</h4>
                <p className="text-2xl font-bold text-red-600 mb-1">3-21 days</p>
                <p className="text-sm text-muted-foreground">
                  From delivery date. Varies by convention. Essential for preserving claims.
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                <h4 className="font-semibold text-amber-600 mb-2">Legal Action</h4>
                <p className="text-2xl font-bold text-amber-600 mb-1">1-2 years</p>
                <p className="text-sm text-muted-foreground">
                  Statute of limitations. Claims time-barred after this period.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                <h4 className="font-semibold text-[#0F4C81] mb-2">Insurance Notice</h4>
                <p className="text-2xl font-bold text-[#0F4C81] mb-1">30 days</p>
                <p className="text-sm text-muted-foreground">
                  Typical requirement. Check your policy for specific deadlines.
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                <h4 className="font-semibold text-[#2E8B57] mb-2">Survey Report</h4>
                <p className="text-2xl font-bold text-[#2E8B57] mb-1">3-7 days</p>
                <p className="text-sm text-muted-foreground">
                  Arrange joint survey promptly. Independent survey strengthens your case.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pro Tips for Cargo Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Always Insure High-Value Cargo",
                  description:
                    "Carrier liability rarely covers full cargo value. Insurance fills the gap.",
                },
                {
                  title: "Declare Correct Value",
                  description:
                    "Under-declaration may reduce carrier liability and void insurance coverage.",
                },
                {
                  title: "Inspect Upon Receipt",
                  description:
                    "Check cargo immediately and note any damage on the delivery receipt.",
                },
                {
                  title: "Document Everything",
                  description:
                    "Photos, survey reports, and correspondence are crucial for claims.",
                },
                {
                  title: "Understand Your Convention",
                  description:
                    "Different conventions apply different limits and notice periods.",
                },
                {
                  title: "Consider Package Count",
                  description:
                    "For sea freight, liability may be per package - count matters.",
                },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <ArrowRight className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>
                  What is SDR and why is it used for liability limits?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Special Drawing Rights (SDR) is an international reserve asset created by the IMF.
                    Using SDR for liability limits provides a stable, internationally recognized unit
                    of account that is not subject to the fluctuations of any single currency. This
                    ensures consistent liability limits across different jurisdictions and over time.
                    The SDR value is calculated based on a basket of major currencies (USD, EUR, GBP,
                    JPY, CNY).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2">
                <AccordionTrigger>
                  Can carriers be held liable for more than the convention limit?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Yes, carriers may lose the right to limit liability in certain circumstances:
                    <br /><br />
                    <strong>1.</strong> If the carrier acted with intent to cause damage or recklessly
                    and with knowledge that damage would probably result.
                    <br />
                    <strong>2.</strong> If the carrier&apos;s contract of carriage provides for higher
                    limits voluntarily.
                    <br />
                    <strong>3.</strong> If the carrier fails to prove they took all reasonable steps
                    to avoid the damage (under some conventions).
                    <br /><br />
                    Additionally, carriers may agree to higher liability limits through declared value
                    clauses in bills of lading, though this typically requires additional freight
                    charges.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3">
                <AccordionTrigger>
                  How is the &quot;package&quot; defined for liability calculations?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Under Hague-Visby Rules, a &quot;package&quot; is generally interpreted as:
                    <br /><br />
                    <strong>1.</strong> Any physical package (box, crate, drum, etc.) as shipped.
                    <br />
                    <strong>2.</strong> In containerized shipments, if the number of packages is
                    stated on the bill of lading, each counts as a package. If not stated, the
                    container itself may be considered a single package.
                    <br />
                    <strong>3.</strong> For unitized cargo (palletized, etc.), interpretation varies
                    by jurisdiction.
                    <br /><br />
                    This is why it&apos;s crucial to accurately state the number of packages on
                    shipping documents - it directly affects potential recovery limits.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q4">
                <AccordionTrigger>
                  What happens if the carrier denies liability entirely?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    If a carrier denies liability (e.g., claiming an exception or defense), you have
                    several options:
                    <br /><br />
                    <strong>1.</strong> <strong>Insurance Claim:</strong> File with your cargo insurer
                    first. They will pay your claim and may pursue subrogation against the carrier.
                    <br />
                    <strong>2.</strong> <strong>Legal Action:</strong> Sue the carrier to prove they
                    are liable. Success depends on evidence and applicable law.
                    <br />
                    <strong>3.</strong> <strong>Alternative Dispute Resolution:</strong> Many shipping
                    contracts require arbitration.
                    <br /><br />
                    This is why cargo insurance is so important - it provides first-party coverage
                    regardless of carrier liability disputes.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q5">
                <AccordionTrigger>
                  Does declared value on a bill of lading affect liability limits?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Yes, declaring a higher value on the bill of lading can affect liability limits:
                    <br /><br />
                    <strong>1.</strong> Most conventions allow carriers to charge additional freight
                    for accepting higher liability limits.
                    <br />
                    <strong>2.</strong> If you declare a value and pay the additional freight, the
                    carrier&apos;s liability is typically limited to that declared value rather than
                    the convention&apos;s per-kg or per-package limits.
                    <br />
                    <strong>3.</strong> However, this is contractual - the carrier must agree to
                    accept the declared value.
                    <br /><br />
                    This can be useful for high-value, low-weight cargo where the per-kg limit would
                    otherwise be inadequate.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q6">
                <AccordionTrigger>
                  What&apos;s the difference between Hague and Hague-Visby Rules?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    The Hague-Visby Rules (1968) are an updated version of the original Hague Rules
                    (1924):
                    <br /><br />
                    <strong>Liability Limits:</strong> Hague: £100 per package; Hague-Visby: 666.67
                    SDR per package or 2 SDR per kg (whichever is higher).
                    <br />
                    <strong>Currency:</strong> Hague uses gold francs/pounds sterling; Hague-Visby
                    uses SDR for international consistency.
                    <br />
                    <strong>Containerization:</strong> Hague-Visby specifically addresses containerized
                    cargo, defining when containers count as packages.
                    <br />
                    <strong>Adoption:</strong> Hague-Visby is now the most widely adopted convention
                    for sea carriage. The original Hague Rules are largely obsolete but may still
                    apply in some jurisdictions.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Marine Insurance Calculator", href: "/tools/insurance/marine-premium", icon: Shield },
                { name: "Cargo Claim Calculator", href: "/tools/cargo-claim-calculator", icon: Scale },
                { name: "General Average Calculator", href: "/tools/insurance/general-average", icon: Ship },
                { name: "Expected Loss Calculator", href: "/tools/insurance/expected-loss", icon: AlertTriangle },
              ].map((tool, index) => (
                <a
                  key={index}
                  href={tool.href}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <tool.icon className="h-5 w-5 text-[#0F4C81]" />
                  <span className="text-sm font-medium">{tool.name}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-semibold mb-2">Important Disclaimer</p>
                <p>
                  This calculator provides estimates based on standard convention limits and approximate
                  SDR exchange rates. Actual liability may vary based on contract terms, jurisdiction,
                  and specific circumstances. For precise legal advice or claims, consult with a
                  maritime lawyer or insurance professional. SDR rates fluctuate daily - verify current
                  rates with the IMF for precise calculations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
