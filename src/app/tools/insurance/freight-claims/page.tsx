import { Metadata } from "next";
import FreightClaimsCalculator from "@/components/tools/FreightClaimsCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { 
  Scale, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileCheck,
  Gavel,
  Shield,
  HelpCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Freight Claims Calculator | Shiportrade.com",
  description: "Calculate carrier liability, insurance recovery, and total claim amount for damaged cargo. Understand international liability regimes and documentation requirements.",
  keywords: ["freight claims", "cargo claims", "carrier liability", "Hague-Visby", "marine insurance", "cargo damage", "shipping claims"],
};

export default function FreightClaimsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Scale className="h-3 w-3 mr-2" />
          Insurance Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Freight Claims Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate carrier liability limits, insurance recovery, and total claim amounts for damaged or lost cargo. 
          Understand your rights under international conventions and get the documentation you need.
        </p>
      </div>

      {/* Calculator */}
      <FreightClaimsCalculator />

      {/* Educational Content */}
      <div className="mt-12 space-y-6">
        {/* Quick Reference Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-[var(--ocean)]/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Gavel className="h-5 w-5 text-[var(--ocean)]" />
                Carrier Liability Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div className="flex justify-between">
                <span>Hague Rules</span>
                <Badge variant="outline">SDR 500/kg</Badge>
              </div>
              <div className="flex justify-between">
                <span>Hague-Visby</span>
                <Badge variant="outline">SDR 666.67/kg</Badge>
              </div>
              <div className="flex justify-between">
                <span>Hamburg Rules</span>
                <Badge variant="outline">SDR 835/kg</Badge>
              </div>
              <div className="flex justify-between">
                <span>Rotterdam Rules</span>
                <Badge variant="outline">SDR 875/kg</Badge>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span>Montreal (Air)</span>
                <Badge variant="outline">SDR 22/kg</Badge>
              </div>
              <div className="flex justify-between">
                <span>CMR (Road)</span>
                <Badge variant="outline">SDR 8.33/kg</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--logistics)]/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--logistics)]" />
                Critical Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div className="flex justify-between">
                <span>Sea (Hague-Visby)</span>
                <Badge variant="outline">3 days</Badge>
              </div>
              <div className="flex justify-between">
                <span>Hamburg Rules</span>
                <Badge variant="outline">15 days</Badge>
              </div>
              <div className="flex justify-between">
                <span>Rotterdam Rules</span>
                <Badge variant="outline">21 days</Badge>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span>Air (Montreal)</span>
                <Badge variant="outline">21 days</Badge>
              </div>
              <div className="flex justify-between">
                <span>Road (CMR)</span>
                <Badge variant="outline">7 days</Badge>
              </div>
              <p className="text-xs text-red-600 mt-2">
                Missing deadlines may void your claim!
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-600" />
                Insurance Coverage Types
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div className="flex justify-between items-center">
                <span>ICC (A) - All Risks</span>
                <Badge className="bg-[var(--logistics)]">Best</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>ICC (B) - Intermediate</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>ICC (C) - Basic</span>
                <Badge variant="outline">Limited</Badge>
              </div>
              <p className="text-xs mt-2">
                ICC (A) covers temperature damage, theft, and most perils not specifically excluded.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Understanding Freight Claims */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Freight Claims
            </CardTitle>
            <CardDescription>
              A comprehensive guide to claiming for damaged or lost cargo
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">What is a Freight Claim?</h4>
              <p className="text-sm text-muted-foreground">
                A freight claim is a legal demand for compensation when cargo is lost, damaged, 
                or delayed during transportation. Claims can be made against the carrier, 
                freight forwarder, or insurance company depending on the circumstances.
              </p>
              <h4 className="font-semibold">Who Can File?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-1.5 text-[var(--logistics)]" />
                  <span>The cargo owner (consignee)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-1.5 text-[var(--logistics)]" />
                  <span>The shipper (if they retain title)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-1.5 text-[var(--logistics)]" />
                  <span>The insurance company (subrogation)</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Types of Claims</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                  <span><strong>Total Loss:</strong> Complete loss of cargo during transit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                  <span><strong>Partial Loss:</strong> Part of shipment damaged or lost</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                  <span><strong>Shortage:</strong> Quantity delivered less than shipped</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                  <span><strong>Damage:</strong> Physical harm to goods (water, breakage, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                  <span><strong>Delay:</strong> Late delivery causing economic loss</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-[var(--ocean)]/5 border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--ocean)]" />
                Pro Tips for Successful Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span><strong>Act Immediately:</strong> Note damage on delivery receipt before signing. Take photos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span><strong>Written Notice:</strong> Send formal written notice to carrier within deadline.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span><strong>Hire Surveyor:</strong> For major claims, get independent survey report.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span><strong>Document Everything:</strong> Keep copies of all documents and correspondence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span><strong>File Insurance Claim:</strong> Don&apos;t wait for carrier response - notify insurer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span><strong>Preserve Evidence:</strong> Keep damaged goods until claim is resolved.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-3">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span><strong>Signing Clean Receipt:</strong> Signing without noting damage waives your rights.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span><strong>Missing Deadlines:</strong> Late notice can void your claim entirely.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span><strong>Poor Documentation:</strong> Insufficient evidence leads to claim denial.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span><strong>Accepting First Offer:</strong> Initial settlement offers are often low.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span><strong>Under-insuring:</strong> Coverage below actual value leaves gap.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>
                  What is the difference between carrier liability and cargo insurance?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    <strong>Carrier liability</strong> is the legal responsibility of the transport company 
                    for loss or damage to cargo, typically limited by international conventions (e.g., 
                    SDR 666.67/kg under Hague-Visby Rules). Carriers can also use various defenses 
                    to limit or deny liability.
                  </p>
                  <p className="mt-2">
                    <strong>Cargo insurance</strong> is a separate policy you purchase that covers 
                    the full value of your goods, regardless of carrier liability limits or defenses. 
                    It provides much broader protection and is essential for high-value cargo.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2">
                <AccordionTrigger>
                  What happens if I miss the notice deadline?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    Missing the written notice deadline (typically 3-21 days depending on the 
                    applicable convention) can be fatal to your claim. However, some jurisdictions 
                    may still allow claims if you can prove the carrier was otherwise notified 
                    or actually knew of the damage.
                  </p>
                  <p className="mt-2">
                    Insurance claims typically have different deadlines (usually 30 days), so 
                    even if you miss the carrier deadline, you should still notify your insurer 
                    immediately.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3">
                <AccordionTrigger>
                  Can I claim for delay-related losses?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    Generally, <strong>no</strong>. Most international conventions and standard 
                    cargo insurance policies exclude claims for delay, even if the delay was 
                    caused by a covered peril. This is a standard exclusion in ICC (A), (B), 
                    and (C) clauses.
                  </p>
                  <p className="mt-2">
                    However, if the delay results in physical damage to goods (e.g., spoilage 
                    of perishables), you may be able to claim for that damage, but not for 
                    purely economic losses from the delay itself.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q4">
                <AccordionTrigger>
                  How is SDR converted to actual currency?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    SDR (Special Drawing Rights) is an international reserve asset created by 
                    the IMF. Carrier liability limits are expressed in SDR because it provides 
                    a stable, internationally recognized unit of account.
                  </p>
                  <p className="mt-2">
                    The SDR-to-currency conversion rate fluctuates daily. As of recent rates, 
                    1 SDR ≈ $1.35 USD (varies). Your claim will be converted at the rate 
                    applicable on the date of judgment or settlement.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q5">
                <AccordionTrigger>
                  Do I need a lawyer for a freight claim?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    For small claims below carrier liability limits with clear documentation, 
                    you may be able to handle it yourself. However, consider legal help if:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Claim value exceeds $25,000</li>
                    <li>Carrier disputes liability</li>
                    <li>Multiple parties are involved</li>
                    <li>Carrier raises exclusion defenses</li>
                    <li>You need to file a lawsuit</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q6">
                <AccordionTrigger>
                  What if the carrier is insolvent?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    Carrier insolvency is typically excluded from standard cargo insurance 
                    policies. However, you may have options:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>File as a creditor in bankruptcy proceedings</li>
                    <li>Check if freight forwarder has liability</li>
                    <li>Consider trade credit insurance for future shipments</li>
                    <li>Some jurisdictions have carrier liability insurance pools</li>
                  </ul>
                  <p className="mt-2">
                    This highlights the importance of choosing financially stable carriers 
                    and maintaining comprehensive cargo insurance.
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
            <CardDescription>
              Other tools that may help with your freight and insurance needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:border-[var(--ocean)]/50 transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <Shield className="h-8 w-8 text-[var(--logistics)] mb-2" />
                  <h4 className="font-medium text-sm">Marine Insurance Calculator</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimate cargo insurance premiums
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:border-[var(--ocean)]/50 transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <Gavel className="h-8 w-8 text-[var(--ocean)] mb-2" />
                  <h4 className="font-medium text-sm">Liability Limit Calculator</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculate carrier liability limits
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:border-[var(--ocean)]/50 transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <AlertTriangle className="h-8 w-8 text-amber-600 mb-2" />
                  <h4 className="font-medium text-sm">General Average Calculator</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimate general average contribution
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:border-[var(--ocean)]/50 transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <FileCheck className="h-8 w-8 text-purple-600 mb-2" />
                  <h4 className="font-medium text-sm">LC Discrepancy Analyzer</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check LC documentation issues
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-semibold mb-2">Important Disclaimer</p>
                <p>
                  This calculator provides estimates based on standard international conventions 
                  and typical insurance terms. Actual liability and recovery amounts may vary 
                  based on specific contract terms, jurisdiction, case law, and policy wording. 
                  Always consult with a qualified maritime lawyer or insurance professional for 
                  specific claims advice. The SDR exchange rate used is approximate and may differ 
                  from official IMF rates on any given day.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
