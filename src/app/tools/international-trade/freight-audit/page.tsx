import { Metadata } from "next";
import FreightAuditTool from "@/components/tools/FreightAuditTool";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileSearch,
  TrendingDown,
  Shield,
  Copy,
  DollarSign,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  Target,
  Layers,
  Calculator,
  AlertTriangle,
  BookOpen,
  Upload,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Freight Audit Tool | Shiportrade.com",
  description: "Audit freight invoices, verify rates, validate surcharges, detect duplicates, and identify savings opportunities with our comprehensive freight audit tool.",
  keywords: "freight audit, invoice audit, rate verification, surcharge validation, duplicate detection, freight savings, logistics cost reduction",
};

export default function FreightAuditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0F4C81] to-[#0F4C81]/80 text-white py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4 hover:bg-white/30">
              International Trade Tool
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Freight Audit Tool
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Audit freight invoices, verify rates, validate surcharges, detect duplicates, and identify savings opportunities
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Upload className="h-5 w-5" />
                <span>Invoice Upload</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Target className="h-5 w-5" />
                <span>Rate Verification</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Layers className="h-5 w-5" />
                <span>Surcharge Validation</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <TrendingDown className="h-5 w-5" />
                <span>Savings Finder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <FreightAuditTool />
        </div>
      </section>

      {/* Educational Content */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F4C81]">
              Understanding Freight Audit
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* What is Freight Audit */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <FileSearch className="h-5 w-5" />
                    What is Freight Audit?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Freight audit is the systematic review of freight invoices to verify accuracy, identify billing errors, and ensure charges align with contracted rates and services.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-1" />
                      <span className="text-sm">Validates carrier invoices against contracts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-1" />
                      <span className="text-sm">Identifies billing discrepancies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-1" />
                      <span className="text-sm">Recovers overcharges and duplicate payments</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Rate Verification */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Target className="h-5 w-5" />
                    Rate Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Comparing billed rates against negotiated contract rates to identify overcharges:
                    </p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">Contract rate comparison</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">Market rate benchmarking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">Volume discount validation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">Peak season surcharge checks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Surcharge Validation */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Layers className="h-5 w-5" />
                    Surcharge Validation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Validating accessorial charges against industry standards:
                    </p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">BAF/CAF verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">THC validation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">Demurrage/Detention checks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">Security surcharge review</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Score Grading */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F4C81]">
              Audit Score Grading System
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
              <Card className="text-center border-l-4 border-l-[#22C55E]">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-[#22C55E]">A</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Excellent</h3>
                  <p className="text-3xl font-bold text-[#22C55E] mb-2">90-100</p>
                  <p className="text-sm text-muted-foreground">
                    Minimal issues found
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-l-4 border-l-[#2E8B57]">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-[#2E8B57]/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-[#2E8B57]">B</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Good</h3>
                  <p className="text-3xl font-bold text-[#2E8B57] mb-2">80-89</p>
                  <p className="text-sm text-muted-foreground">
                    Minor issues only
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-l-4 border-l-[#F59E0B]">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-[#F59E0B]">C</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Fair</h3>
                  <p className="text-3xl font-bold text-[#F59E0B] mb-2">70-79</p>
                  <p className="text-sm text-muted-foreground">
                    Moderate issues found
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-l-4 border-l-[#0F4C81]">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-[#0F4C81]/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-[#0F4C81]">D</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Poor</h3>
                  <p className="text-3xl font-bold text-[#0F4C81] mb-2">60-69</p>
                  <p className="text-sm text-muted-foreground">
                    Significant issues
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-l-4 border-l-[#EF4444]">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-[#EF4444]/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-[#EF4444]">F</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Critical</h3>
                  <p className="text-3xl font-bold text-[#EF4444] mb-2">&lt;60</p>
                  <p className="text-sm text-muted-foreground">
                    Major discrepancies
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F4C81]">
              Common Freight Billing Issues
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0F4C81]">Rate-Related Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#0F4C81]">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Contract Rate Overcharges</p>
                        <p className="text-sm text-muted-foreground">Billed rates exceed negotiated contract rates</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#0F4C81]">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Incorrect Currency Conversion</p>
                        <p className="text-sm text-muted-foreground">Wrong exchange rates applied to invoices</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#0F4C81]">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Missing Volume Discounts</p>
                        <p className="text-sm text-muted-foreground">Eligible discounts not applied</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#0F4C81]">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Wrong Service Level Pricing</p>
                        <p className="text-sm text-muted-foreground">Premium rates for standard service</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0F4C81]">Surcharge Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#2E8B57]">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Excessive BAF Charges</p>
                        <p className="text-sm text-muted-foreground">Fuel surcharges above published rates</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#2E8B57]">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Unjustified Accessorial Fees</p>
                        <p className="text-sm text-muted-foreground">Charges for services not rendered</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#2E8B57]">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Demurrage Calculation Errors</p>
                        <p className="text-sm text-muted-foreground">Incorrect free time or per-day rates</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#2E8B57]">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Duplicate Surcharges</p>
                        <p className="text-sm text-muted-foreground">Same charge billed under different codes</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0F4C81]">Duplicate Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-amber-500">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Same Invoice, Multiple Submissions</p>
                        <p className="text-sm text-muted-foreground">Identical invoice submitted twice</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-amber-500">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Split Shipment Double Billing</p>
                        <p className="text-sm text-muted-foreground">Full and partial charges for same shipment</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-amber-500">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Correction Invoice Errors</p>
                        <p className="text-sm text-muted-foreground">Original not reversed when correction issued</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0F4C81]">Documentation Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-500">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Missing Proof of Delivery</p>
                        <p className="text-sm text-muted-foreground">Cannot verify service completion</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-500">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Incomplete Invoice Details</p>
                        <p className="text-sm text-muted-foreground">Missing shipment or charge references</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-500">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Weight/Measurement Discrepancies</p>
                        <p className="text-sm text-muted-foreground">Billed weight differs from actual</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F4C81]">
              Pro Tips for Freight Audit
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Audit Within 30 Days",
                  description: "Review invoices promptly to meet carrier dispute deadlines and improve recovery rates",
                  icon: CheckCircle,
                },
                {
                  title: "Maintain Contract Database",
                  description: "Keep all carrier contracts digitized and easily accessible for quick rate verification",
                  icon: BookOpen,
                },
                {
                  title: "Track Surcharges Monthly",
                  description: "Monitor surcharge trends to identify unusual patterns and negotiate better terms",
                  icon: TrendingDown,
                },
                {
                  title: "Automate Duplicate Detection",
                  description: "Use automated matching on BL numbers, amounts, and dates to catch duplicate billings",
                  icon: Copy,
                },
                {
                  title: "Benchmark Against Market",
                  description: "Compare contracted rates against current market rates to ensure competitiveness",
                  icon: Target,
                },
                {
                  title: "Document All Disputes",
                  description: "Keep detailed records of all disputes and resolutions for future reference",
                  icon: FileSearch,
                },
              ].map((tip, idx) => (
                <Card key={idx} className="border-0 shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                        <tip.icon className="h-5 w-5 text-[#0F4C81]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F4C81]">
              Common Mistakes to Avoid
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  mistake: "Auto-Approving Without Review",
                  consequence: "Small errors compound over time, leading to significant overcharges that go undetected",
                },
                {
                  mistake: "Ignoring Small Discrepancies",
                  consequence: "Minor billing errors often indicate systematic issues that result in larger losses",
                },
                {
                  mistake: "Not Validating Surcharges",
                  consequence: "Surcharges can represent 30-50% of freight costs and are frequently overbilled",
                },
                {
                  mistake: "Missing Dispute Deadlines",
                  consequence: "Carriers have strict timelines for disputes; late claims are typically rejected",
                },
                {
                  mistake: "Relying Only on Carrier Audit",
                  consequence: "Carrier self-audits rarely catch all errors; independent verification is essential",
                },
                {
                  mistake: "Not Tracking Recovery Rates",
                  consequence: "Without metrics, you cannot measure audit effectiveness or identify improvement areas",
                },
              ].map((item, idx) => (
                <Card key={idx} className="border-l-4 border-l-red-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-600">{item.mistake}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.consequence}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F4C81]">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How often should freight invoices be audited?",
                  answer: "Best practice is to audit all invoices within 30 days of receipt. For high-volume shippers, consider weekly or bi-weekly audit cycles to catch errors promptly and meet carrier dispute deadlines.",
                },
                {
                  question: "What percentage of freight invoices contain errors?",
                  answer: "Industry studies indicate 5-15% of freight invoices contain billing errors. Common issues include incorrect rates, excessive surcharges, duplicate billings, and calculation mistakes. Systematic auditing can recover 2-5% of total freight spend.",
                },
                {
                  question: "How long do I have to dispute a freight invoice?",
                  answer: "Dispute timelines vary by carrier and mode. Ocean carriers typically allow 30-90 days, air freight 7-30 days, and trucking 15-60 days. Always check your contract terms and dispute promptly.",
                },
                {
                  question: "What is the difference between pre-audit and post-audit?",
                  answer: "Pre-audit occurs before payment approval, catching errors before money leaves your account. Post-audit reviews paid invoices, identifying issues for recovery. Both are valuable; pre-audit prevents overpayment while post-audit catches what was missed.",
                },
                {
                  question: "Should I use an automated freight audit service?",
                  answer: "Automated services can be cost-effective for shippers with $1M+ annual freight spend. They offer faster processing, higher accuracy, and dedicated dispute resolution. For smaller volumes, in-house auditing may be more economical.",
                },
                {
                  question: "What information do I need to audit freight invoices?",
                  answer: "Essential documents include: carrier contracts with rate tables, bills of lading, proof of delivery, purchase orders, and historical invoice data. Having digital access to these documents streamlines the audit process significantly.",
                },
              ].map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left font-medium hover:text-[#0F4C81]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F4C81]">
              Related Tools
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Freight Rate Calculator",
                  href: "/tools/freight-rate-calculator",
                  description: "Calculate freight rates across modes",
                },
                {
                  title: "BAF/CAF Estimator",
                  href: "/tools/ocean-freight/baf-estimator",
                  description: "Estimate bunker adjustment factors",
                },
                {
                  title: "Demurrage Calculator",
                  href: "/tools/ocean-freight/demurrage-calculator",
                  description: "Calculate demurrage and detention",
                },
                {
                  title: "Freight Rate Benchmark",
                  href: "/tools/ocean-freight/freight-rate-benchmark",
                  description: "Compare rates across carriers",
                },
              ].map((tool, idx) => (
                <Link key={idx} href={tool.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-0 shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{tool.title}</h3>
                        <ArrowRight className="h-4 w-4 text-[#0F4C81]" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-slate-100 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> This tool provides estimates and guidance based on industry practices and sample data. 
              Actual invoice discrepancies depend on specific carrier contracts, service terms, and individual circumstances. 
              Consult with freight audit professionals for comprehensive invoice analysis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
