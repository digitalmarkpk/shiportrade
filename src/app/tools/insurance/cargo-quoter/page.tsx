import { Metadata } from "next";
import CargoInsuranceQuoter from "@/components/tools/CargoInsuranceQuoter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Ship,
  Plane,
  Truck,
  Package,
  AlertTriangle,
  Check,
  Info,
  DollarSign,
  Clock,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cargo Insurance Quoter | Shiportrade.com",
  description: "Get instant cargo insurance quotes with ICC coverage comparison, carrier rates, and comprehensive voyage protection options.",
};

export default function CargoInsuranceQuoterPage() {
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
              Instant Quote
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Cargo Insurance Quoter
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Get instant marine cargo insurance quotes with comprehensive coverage options. 
            Compare ICC clauses (A/B/C), carrier rates, and additional coverage for war risk, 
            strikes, and piracy across major trade lanes.
          </p>
        </div>

        {/* Main Calculator */}
        <CargoInsuranceQuoter />

        {/* Educational Content */}
        <div className="mt-12 space-y-8">
          <Separator />

          {/* Understanding Cargo Insurance */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#0F4C81]" />
              Understanding Cargo Insurance
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ship className="h-5 w-5 text-[#2E8B57]" />
                    What is Cargo Insurance?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Cargo insurance protects goods against loss or damage during transit by sea, 
                    air, road, or rail. It covers risks from natural disasters, accidents, theft, 
                    and other perils that can occur during the journey from origin to destination.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                    CIF + 10% Rule
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    It&apos;s standard practice to insure cargo for CIF value (Cost + Insurance + Freight) 
                    plus 10%. This additional margin covers claim processing costs, potential currency 
                    fluctuations, and ensures full recovery in case of total loss.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#2E8B57]" />
                    International Standards
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Marine cargo insurance is governed by Institute Cargo Clauses (ICC), developed 
                    by the Institute of London Underwriters. These standardized clauses ensure 
                    consistent coverage terms across global markets and insurers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ICC Coverage Comparison */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Package className="h-6 w-6 text-[#2E8B57]" />
              ICC Coverage Comparison
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 font-medium">Coverage</th>
                        <th className="text-left p-4 font-medium">ICC (A) All Risks</th>
                        <th className="text-left p-4 font-medium">ICC (B) Intermediate</th>
                        <th className="text-left p-4 font-medium">ICC (C) Basic</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-4">Fire, explosion</td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                      </tr>
                      <tr className="border-t bg-muted/20">
                        <td className="p-4">Sinking, stranding, collision</td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4">Earthquake, volcanic eruption</td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><span className="text-muted-foreground">—</span></td>
                      </tr>
                      <tr className="border-t bg-muted/20">
                        <td className="p-4">Lightning</td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><span className="text-muted-foreground">—</span></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4">Washing overboard</td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><span className="text-muted-foreground">—</span></td>
                      </tr>
                      <tr className="border-t bg-muted/20">
                        <td className="p-4">Water damage</td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><Check className="h-4 w-4 text-amber-500" /></td>
                        <td className="p-4"><span className="text-muted-foreground">—</span></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4">Theft, pilferage, non-delivery</td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><span className="text-muted-foreground">—</span></td>
                        <td className="p-4"><span className="text-muted-foreground">—</span></td>
                      </tr>
                      <tr className="border-t bg-muted/20">
                        <td className="p-4">Breakage, crushing</td>
                        <td className="p-4"><Check className="h-4 w-4 text-[#2E8B57]" /></td>
                        <td className="p-4"><span className="text-muted-foreground">—</span></td>
                        <td className="p-4"><span className="text-muted-foreground">—</span></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-4 font-medium">Typical Premium</td>
                        <td className="p-4"><Badge className="bg-[#0F4C81]">0.15-0.50%</Badge></td>
                        <td className="p-4"><Badge variant="secondary">0.10-0.35%</Badge></td>
                        <td className="p-4"><Badge variant="outline">0.08-0.20%</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Pro Tips */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Info className="h-6 w-6 text-[#0F4C81]" />
              Pro Tips for Cargo Insurance
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700 dark:text-green-400">Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Always insure for CIF + 10% to cover claim expenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Document cargo condition with photos before loading</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Report any damage within 24 hours of discovery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Keep original shipping documents for claims</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Use quality packaging to reduce premiums</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Review war risk areas before selecting routes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700 dark:text-red-400">Common Mistakes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Underinsuring cargo to save on premiums</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Delaying damage reports beyond policy limits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Disposing damaged goods without insurer approval</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Assuming carrier liability covers all losses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Ignoring geopolitical risks on trade routes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Not reading policy exclusions carefully</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Trade Lane Risk Guide */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-[#2E8B57]" />
              Trade Lane Risk Guide
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Low Risk Routes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Intra-Europe</li>
                    <li>• Trans-Pacific</li>
                    <li>• North America - Europe</li>
                  </ul>
                  <Badge variant="outline" className="mt-2 bg-green-50 dark:bg-green-950/30">
                    War Risk: 0.005-0.02%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Moderate Risk Routes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Asia - Americas</li>
                    <li>• Asia - Europe</li>
                    <li>• Intra-Asia</li>
                  </ul>
                  <Badge variant="outline" className="mt-2 bg-amber-50 dark:bg-amber-950/30">
                    War Risk: 0.01-0.02%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">High Risk Routes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Africa Routes</li>
                    <li>• South America Routes</li>
                  </ul>
                  <Badge variant="outline" className="mt-2 bg-orange-50 dark:bg-orange-950/30">
                    War Risk: 0.06-0.08%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Critical Risk Routes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Middle East Routes</li>
                    <li>• Red Sea Transit</li>
                    <li>• Persian Gulf</li>
                  </ul>
                  <Badge variant="outline" className="mt-2 bg-red-50 dark:bg-red-950/30">
                    War Risk: 0.10-0.15%
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-[#0F4C81]" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">What&apos;s the difference between ICC (A), (B), and (C)?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    ICC (A) provides all-risks coverage for any loss or damage except specifically excluded perils. 
                    ICC (B) covers named perils like fire, explosion, sinking, and natural disasters. ICC (C) is 
                    the most basic, covering only major casualties. Choose based on your cargo value and risk tolerance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Do I need war risk coverage for my shipment?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    War risk coverage is essential for shipments passing through or near conflict zones. The Red Sea, 
                    Persian Gulf, and certain African routes currently carry elevated war risk premiums. Even for safer 
                    routes, it&apos;s recommended as the cost is minimal relative to potential losses.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How is the premium rate determined?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Premium rates depend on multiple factors: cargo type and value, packaging quality, transport mode, 
                    route risk level, coverage type (A/B/C), deductible, and claims history. High-value or fragile 
                    cargo typically commands higher rates, while robust goods in quality packaging can secure lower premiums.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">What&apos;s SRCC coverage and when do I need it?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    SRCC (Strikes, Riots, and Civil Commotion) covers losses from labor disputes, political unrest, 
                    and civil disturbances. It&apos;s particularly important for shipments to regions with political 
                    instability or during periods of heightened social tensions. The additional cost is typically 
                    around 0.015% of cargo value.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How quickly must I report a claim?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Most policies require immediate notification of any loss or damage - typically within 24-72 hours 
                    of discovery. Delayed reporting can result in claim denial. Always document the condition of goods 
                    upon receipt and take photographs of any visible damage before signing delivery receipts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">What does a deductible mean for cargo insurance?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    A deductible is the amount you pay out-of-pocket before insurance coverage applies. Higher deductibles 
                    lower your premium but increase your exposure to small losses. For high-value shipments, a lower 
                    deductible is often preferable to ensure full coverage of even partial losses.
                  </p>
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
                    Marine Premium Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Calculate marine insurance premiums for different cargo types and routes.
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Ship className="h-4 w-4 text-[#2E8B57]" />
                    General Average Estimator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Estimate your potential general average contribution in maritime incidents.
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Freight Claims Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Calculate freight claims and liability limits for cargo damage.
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#0F4C81]" />
                    TCOR Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Total Cost of Risk analysis for comprehensive risk management.
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
                    This cargo insurance quoter provides estimates for informational purposes only. Actual premiums, 
                    coverage terms, and conditions are determined by insurance underwriters based on full risk assessment. 
                    Rates shown are indicative and may vary significantly based on claims history, cargo specifics, 
                    carrier qualifications, and current market conditions. Always consult with a licensed insurance 
                    broker for binding quotes and policy terms.
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
