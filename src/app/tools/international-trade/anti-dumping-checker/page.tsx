import { Metadata } from "next";
import AntiDumpingDutyChecker from "@/components/tools/AntiDumpingDutyChecker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
  Clock,
  DollarSign,
  Globe,
  FileText,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anti-Dumping Duty Checker | Shiportrade",
  description: "Check anti-dumping and countervailing duties by product, origin country, and destination market. View duty rates, investigation status, and exemption options.",
};

export default function AntiDumpingDutyCheckerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-[#0F4C81]" />
          <h1 className="text-3xl font-bold text-[#0F4C81]">
            Anti-Dumping Duty Checker
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Check anti-dumping and countervailing duties by product, origin country, and destination market.
          View duty rates, investigation status, historical rates, and exemption options.
        </p>
      </div>

      {/* Main Component */}
      <AntiDumpingDutyChecker />

      {/* Educational Content */}
      <div className="mt-12 space-y-8">
        {/* What is Anti-Dumping */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <Info className="h-5 w-5" />
              Understanding Anti-Dumping Duties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>Anti-dumping (AD) duties</strong> are protectionist tariffs imposed on foreign imports
                  believed to be priced below fair market value. These duties are designed to protect domestic
                  industries from unfair competition and can significantly impact your landed costs.
                </p>
                <p className="text-muted-foreground">
                  <strong>Countervailing duties (CVD)</strong> are separate tariffs imposed to offset foreign
                  government subsidies. Many products are subject to both AD and CVD duties simultaneously,
                  resulting in significantly higher total duties.
                </p>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Key Points</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• AD/CVD duties are in addition to normal customs duties</li>
                    <li>• FTAs typically do not override AD/CVD orders</li>
                    <li>• Orders remain in effect for 5+ years</li>
                    <li>• Subject to periodic administrative reviews</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Products Subject to AD Duties */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <FileText className="h-5 w-5" />
              Common Products Subject to Anti-Dumping Duties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Steel Products", hsCode: "7204-7229", duty: "Up to 536%", icon: "🏗️" },
                { name: "Aluminum Products", hsCode: "7601-7616", duty: "Up to 373%", icon: "🔩" },
                { name: "Solar Panels", hsCode: "8541.40", duty: "Up to 239%", icon: "☀️" },
                { name: "Wind Turbines", hsCode: "8502.31", duty: "Up to 215%", icon: "💨" },
                { name: "Automotive Tires", hsCode: "4011", duty: "Up to 88%", icon: "🚗" },
                { name: "Chemicals", hsCode: "2801-2942", duty: "Up to 154%", icon: "🧪" },
              ].map((product, index) => (
                <div
                  key={index}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#0F4C81] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{product.icon}</span>
                    <h4 className="font-semibold">{product.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">HS: {product.hsCode}</p>
                  <Badge variant="destructive" className="text-xs">{product.duty}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Major Markets */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <Globe className="h-5 w-5" />
              Major Markets with AD/CVD Measures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold">Market</th>
                    <th className="text-left py-3 px-4 font-semibold">Authority</th>
                    <th className="text-left py-3 px-4 font-semibold">Active Measures</th>
                    <th className="text-left py-3 px-4 font-semibold">Database</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-slate-700/50">
                    <td className="py-3 px-4 font-medium">United States</td>
                    <td className="py-3 px-4 text-muted-foreground">US DOC / ITC</td>
                    <td className="py-3 px-4"><Badge>600+</Badge></td>
                    <td className="py-3 px-4 text-[#0F4C81]">AD/CVD Search</td>
                  </tr>
                  <tr className="border-b dark:border-slate-700/50">
                    <td className="py-3 px-4 font-medium">European Union</td>
                    <td className="py-3 px-4 text-muted-foreground">European Commission</td>
                    <td className="py-3 px-4"><Badge>150+</Badge></td>
                    <td className="py-3 px-4 text-[#0F4C81]">TRADE Defence</td>
                  </tr>
                  <tr className="border-b dark:border-slate-700/50">
                    <td className="py-3 px-4 font-medium">United Kingdom</td>
                    <td className="py-3 px-4 text-muted-foreground">TRAB UK</td>
                    <td className="py-3 px-4"><Badge>90+</Badge></td>
                    <td className="py-3 px-4 text-[#0F4C81]">Trade Remedies</td>
                  </tr>
                  <tr className="border-b dark:border-slate-700/50">
                    <td className="py-3 px-4 font-medium">Australia</td>
                    <td className="py-3 px-4 text-muted-foreground">Anti-Dumping Commission</td>
                    <td className="py-3 px-4"><Badge>200+</Badge></td>
                    <td className="py-3 px-4 text-[#0F4C81]">Public Register</td>
                  </tr>
                  <tr className="border-b dark:border-slate-700/50">
                    <td className="py-3 px-4 font-medium">India</td>
                    <td className="py-3 px-4 text-muted-foreground">DGTR India</td>
                    <td className="py-3 px-4"><Badge>350+</Badge></td>
                    <td className="py-3 px-4 text-[#0F4C81]">DGTR Database</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Canada</td>
                    <td className="py-3 px-4 text-muted-foreground">CBSA</td>
                    <td className="py-3 px-4"><Badge>150+</Badge></td>
                    <td className="py-3 px-4 text-[#0F4C81]">SIMA Registry</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Investigation Status */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <Clock className="h-5 w-5" />
              Understanding Investigation Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Active</h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Order is in effect and duties are being collected. Subject to periodic reviews.
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">Under Review</h4>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Administrative review in progress. Duty rates may be adjusted retroactively.
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200">Sunset Review</h4>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  5-year review to determine if order should continue. May result in revocation.
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <h4 className="font-semibold text-red-800 dark:text-red-200">New Investigation</h4>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Fresh investigation initiated. Provisional measures may apply during investigation.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Expired</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Order has been revoked or expired. No AD duties currently apply.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <CheckCircle className="h-5 w-5" />
              Pro Tips for AD/CVD Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2E8B57] font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Check Before You Import</h4>
                    <p className="text-sm text-muted-foreground">
                      Always verify AD/CVD status before arranging shipments. Retroactive duties can be financially devastating.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2E8B57] font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Know Your Exporter Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      Individual exporter rates may be significantly lower than country-wide rates. Ask your supplier for their rate.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2E8B57] font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Monitor Administrative Reviews</h4>
                    <p className="text-sm text-muted-foreground">
                      Annual reviews can result in retroactive duty adjustments. Budget for potential increases.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0F4C81] font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Consider Alternative Sourcing</h4>
                    <p className="text-sm text-muted-foreground">
                      Countries without AD measures may offer significant cost advantages. Evaluate total landed cost.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0F4C81] font-semibold">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Explore New Exporter Review</h4>
                    <p className="text-sm text-muted-foreground">
                      New exporters not investigated originally may qualify for individual rates lower than country-wide rates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0F4C81] font-semibold">6</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Work with a Licensed Broker</h4>
                    <p className="text-sm text-muted-foreground">
                      AD/CVD compliance is complex. A licensed customs broker can help navigate the requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="border-0 shadow-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">Assuming FTAs Override AD Duties</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Free Trade Agreement benefits typically do not apply to products subject to AD/CVD orders.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">Ignoring Cumulative Duties</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    AD/CVD duties are in addition to normal duties and any Section 301/232 tariffs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">Not Monitoring Reviews</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Administrative reviews can result in retroactive duty adjustments years after import.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">Misclassifying Products</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Wrong HS codes can lead to unexpected AD duties or penalties for non-compliance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-b dark:border-slate-700 pb-4">
                <h4 className="font-semibold mb-2">How long do anti-dumping orders last?</h4>
                <p className="text-sm text-muted-foreground">
                  Anti-dumping orders typically remain in effect for at least 5 years. However, through
                  sunset reviews, many orders have been in place for decades. The US has AD orders dating
                  back to the 1980s that are still active today.
                </p>
              </div>
              <div className="border-b dark:border-slate-700 pb-4">
                <h4 className="font-semibold mb-2">Can I get an exemption from AD duties?</h4>
                <p className="text-sm text-muted-foreground">
                  Full exemptions are rare. However, new exporters may qualify for individual rates through
                  New Exporter Reviews, which can be significantly lower than country-wide rates. Some
                  products may also be excluded from the scope of an order.
                </p>
              </div>
              <div className="border-b dark:border-slate-700 pb-4">
                <h4 className="font-semibold mb-2">Do FTAs eliminate anti-dumping duties?</h4>
                <p className="text-sm text-muted-foreground">
                  No. Most FTAs explicitly preserve the right to impose anti-dumping duties. AD/CVD measures
                  take precedence over FTA preferences. You cannot claim FTA benefits to avoid AD duties.
                </p>
              </div>
              <div className="border-b dark:border-slate-700 pb-4">
                <h4 className="font-semibold mb-2">What happens during an administrative review?</h4>
                <p className="text-sm text-muted-foreground">
                  During annual reviews, authorities examine actual export data to recalculate dumping margins.
                  This can result in higher or lower duty rates. Importantly, these adjustments are applied
                  retroactively to entries made during the review period.
                </p>
              </div>
              <div className="border-b dark:border-slate-700 pb-4">
                <h4 className="font-semibold mb-2">Who is responsible for paying AD duties?</h4>
                <p className="text-sm text-muted-foreground">
                  The importer of record is ultimately responsible for paying all AD/CVD duties, including
                  any retroactive adjustments after administrative reviews. This liability cannot be
                  transferred to the foreign exporter.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">How can I check if my product has AD duties?</h4>
                <p className="text-sm text-muted-foreground">
                  Use official government databases like the US DOC&apos;s AD/CVD Search, EU&apos;s TRADE Defence
                  Database, or work with a licensed customs broker. This tool provides sample data for
                  common products but should not be used as the sole source for compliance decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-semibold mb-2">Important Disclaimer</p>
                <p>
                  This tool provides sample data for educational purposes only. Anti-dumping duty rates,
                  investigation status, and exporter-specific rates are subject to change. Always verify
                  with official government sources (US DOC, European Commission, TRAB, etc.) or consult
                  with a licensed customs broker before making import decisions. Shiportrade.com is not
                  responsible for any decisions made based on this information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <ArrowRight className="h-5 w-5" />
              Related Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/tools/customs-compliance/fta-eligibility">
                <Card className="h-full hover:border-[#0F4C81] transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-[#0F4C81]" />
                      <h4 className="font-semibold">FTA Eligibility</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Check eligibility for free trade agreement benefits
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/international-trade/landed-cost-calculator">
                <Card className="h-full hover:border-[#0F4C81] transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-[#2E8B57]" />
                      <h4 className="font-semibold">Landed Cost Calculator</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Calculate total landed cost including duties and fees
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/customs-compliance/hs-code-search">
                <Card className="h-full hover:border-[#0F4C81] transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-[#0F4C81]" />
                      <h4 className="font-semibold">HS Code Search</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Find HS codes for product classification
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/international-trade/tariff-comparison">
                <Card className="h-full hover:border-[#0F4C81] transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-[#2E8B57]" />
                      <h4 className="font-semibold">Tariff Comparison</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Compare tariffs across different markets
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
