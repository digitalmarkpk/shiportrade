import { Metadata } from "next";
import CargoDamageCalculator from "@/components/tools/CargoDamageCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Shield,
  Package,
  Ship,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  FileWarning,
  TrendingDown,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cargo Damage Calculator | Shiportrade.com",
  description: "Calculate insurance claims for damaged cargo, assess damage value, estimate recovery, and determine claim viability for maritime and logistics insurance.",
};

export default function CargoDamagePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-[#0F4C81]/10 text-[#0F4C81] border-[#0F4C81]/20">
              Insurance Tools
            </Badge>
            <Badge variant="outline" className="bg-[#2E8B57]/10 text-[#2E8B57] border-[#2E8B57]/20">
              Damage Assessment
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Cargo Damage Calculator
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Calculate insurance claims for damaged cargo shipments. Assess damage severity, estimate 
            recoverable value, analyze coverage gaps, and determine claim viability based on your 
            insurance policy terms.
          </p>
        </div>

        {/* Main Calculator */}
        <CargoDamageCalculator />

        {/* Educational Content */}
        <div className="mt-12 space-y-8">
          <Separator />

          {/* Understanding Cargo Damage */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-[#0F4C81]" />
              Understanding Cargo Damage Claims
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#2E8B57]" />
                    Types of Cargo Damage
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Cargo damage encompasses various scenarios including water damage, breakage, 
                    contamination, temperature deviation, theft, and total loss. Each type has 
                    different severity levels and claim implications.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#0F4C81]" />
                    Insurance Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Coverage types range from comprehensive ICC (A) All Risks to basic ICC (C) 
                    coverage. Your policy type determines what damages are covered and the 
                    applicable deductible rates.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#2E8B57]" />
                    Claim Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Claim amounts are calculated based on depreciated value, policy limits, 
                    deductibles, and underinsurance penalties. Understanding these factors 
                    helps maximize your recovery.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Damage Types Reference */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-[#2E8B57]" />
              Damage Types Reference
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 font-medium">Damage Type</th>
                        <th className="text-center p-4 font-medium">Typical Severity</th>
                        <th className="text-left p-4 font-medium">Description</th>
                        <th className="text-center p-4 font-medium">Coverage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-4 font-medium">Total Loss</td>
                        <td className="text-center p-4"><Badge className="bg-red-100 text-red-700">100%</Badge></td>
                        <td className="p-4 text-muted-foreground">Complete destruction or irrecoverable loss</td>
                        <td className="text-center p-4"><CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr className="border-t bg-muted/20">
                        <td className="p-4 font-medium">Severe Water Damage</td>
                        <td className="text-center p-4"><Badge className="bg-orange-100 text-orange-700">80%</Badge></td>
                        <td className="p-4 text-muted-foreground">Extensive water intrusion</td>
                        <td className="text-center p-4"><CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4 font-medium">Contamination</td>
                        <td className="text-center p-4"><Badge className="bg-orange-100 text-orange-700">70%</Badge></td>
                        <td className="p-4 text-muted-foreground">Foreign substance contamination</td>
                        <td className="text-center p-4"><CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr className="border-t bg-muted/20">
                        <td className="p-4 font-medium">Breakage/Crushing</td>
                        <td className="text-center p-4"><Badge className="bg-amber-100 text-amber-700">60%</Badge></td>
                        <td className="p-4 text-muted-foreground">Physical impact damage</td>
                        <td className="text-center p-4"><CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4 font-medium">Temperature Deviation</td>
                        <td className="text-center p-4"><Badge className="bg-amber-100 text-amber-700">55%</Badge></td>
                        <td className="p-4 text-muted-foreground">Improper temperature control</td>
                        <td className="text-center p-4"><CheckCircle2 className="h-4 w-4 text-amber-500 mx-auto" /></td>
                      </tr>
                      <tr className="border-t bg-muted/20">
                        <td className="p-4 font-medium">Moderate Water Damage</td>
                        <td className="text-center p-4"><Badge className="bg-yellow-100 text-yellow-700">50%</Badge></td>
                        <td className="p-4 text-muted-foreground">Partial water intrusion</td>
                        <td className="text-center p-4"><CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4 font-medium">Partial Theft/Pilferage</td>
                        <td className="text-center p-4"><Badge className="bg-yellow-100 text-yellow-700">40%</Badge></td>
                        <td className="p-4 text-muted-foreground">Portion stolen during transit</td>
                        <td className="text-center p-4"><CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr className="border-t bg-muted/20">
                        <td className="p-4 font-medium">Shortage</td>
                        <td className="text-center p-4"><Badge className="bg-green-100 text-green-700">30%</Badge></td>
                        <td className="p-4 text-muted-foreground">Quantity discrepancy</td>
                        <td className="text-center p-4"><CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Underinsurance Warning */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Scale className="h-6 w-6 text-[#0F4C81]" />
              The Underinsurance Penalty (Average Clause)
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    What is Underinsurance?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="mb-4">
                    Underinsurance occurs when your insured value is less than the actual cargo value. 
                    Most policies include an &quot;average clause&quot; that reduces claims proportionally when 
                    cargo is underinsured.
                  </p>
                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                    <p className="font-medium mb-2">Example:</p>
                    <p>Cargo Value: $100,000</p>
                    <p>Insured Value: $80,000 (80%)</p>
                    <p>Damage: $50,000</p>
                    <p className="mt-2 font-medium">Claim Payout: $40,000 (80% of damage)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    How to Avoid Underinsurance
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-green-700 dark:text-green-300">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Insure for CIF value + 10% to cover expenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Update policy values for fluctuating commodity prices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Include all costs: freight, duties, handling fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Review coverage before each shipment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Consider agreed value policies for high-value goods</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Claim Viability Guide */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FileWarning className="h-6 w-6 text-[#2E8B57]" />
              Claim Viability Assessment
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Viable Claims
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-2">
                    <li>Net claim exceeds expenses significantly</li>
                    <li>Damage is covered by policy</li>
                    <li>Documentation is complete</li>
                    <li>Filed within time limits</li>
                    <li>Proper value declaration</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-5 w-5 text-amber-500" />
                    Marginal Claims
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-2">
                    <li>Claim amount close to deductible</li>
                    <li>High claim processing expenses</li>
                    <li>Some documentation gaps</li>
                    <li>Potential coverage disputes</li>
                    <li>Consider negotiation approach</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Non-Viable Claims
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-2">
                    <li>Claim below deductible threshold</li>
                    <li>Damage type excluded from policy</li>
                    <li>Time limits expired</li>
                    <li>Insufficient evidence</li>
                    <li>Cost of claim exceeds recovery</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Pro Tips */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Info className="h-6 w-6 text-[#0F4C81]" />
              Pro Tips for Cargo Damage Claims
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-700 dark:text-green-400">Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Photograph cargo condition at every stage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Note damage on delivery receipt before signing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Report damage within 24 hours of discovery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Preserve damaged goods for inspection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Keep all original shipping documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Request survey report for significant damage</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-700 dark:text-red-400">Common Mistakes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Signing delivery receipt without inspection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Delaying damage notification to insurer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Disposing damaged goods prematurely</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Underinsuring cargo to save premium</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Admitting liability to carriers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Missing policy deadlines</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Related Tools</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#0F4C81]" />
                    Cargo Insurance Quoter
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Get instant cargo insurance quotes with ICC coverage comparison.
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Ship className="h-4 w-4 text-[#2E8B57]" />
                    Cargo Claim Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Calculate carrier liability and claim recovery for cargo damage.
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    General Average Estimator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Estimate general average contributions for maritime incidents.
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#0F4C81]" />
                    Marine Premium Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Calculate marine insurance premiums for different cargo types.
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Disclaimer */}
          <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-semibold mb-2">Disclaimer</p>
                  <p>
                    This cargo damage calculator provides estimates for informational purposes only. Actual claim 
                    amounts, coverage, and recoveries are determined by insurance underwriters based on policy 
                    terms, survey findings, and applicable laws. Damage severity percentages are typical estimates 
                    and may vary significantly based on specific circumstances. Always consult with a licensed 
                    insurance professional for accurate claim assessment and guidance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
