import { Metadata } from "next";
import PostClearanceAuditRisk from "@/components/tools/PostClearanceAuditRisk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  BookOpen,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  FileWarning,
  Globe,
  Scale,
  DollarSign,
  Clock,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Post Clearance Audit Risk Model | Shiportrade.com",
  description: "Assess your customs audit risk with our comprehensive risk model. Calculate audit probability, identify risk factors, and get mitigation recommendations.",
  keywords: "customs audit, post clearance audit, CBP audit, compliance risk, import audit, duty audit, customs compliance",
};

export default function PostClearanceAuditRiskPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0F4C81] to-[#0F4C81]/80 text-white py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4 hover:bg-white/30">
              Customs Compliance Tool
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Post Clearance Audit Risk Model
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Assess your customs audit probability, identify risk factors, and develop mitigation strategies for import compliance
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <ShieldCheck className="h-5 w-5" />
                <span>Risk Assessment</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Factor Analysis</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <FileSearch className="h-5 w-5" />
                <span>Audit Probability</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <PostClearanceAuditRisk />
        </div>
      </section>

      {/* Educational Content */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F4C81]">
              Understanding Post Clearance Audits
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* What is PCA */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <FileSearch className="h-5 w-5" />
                    What is a Post Clearance Audit?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A Post Clearance Audit (PCA) is a customs examination conducted after goods have been released. It verifies the accuracy of declarations, valuations, classifications, and compliance with customs regulations.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-1" />
                      <span className="text-sm">Can occur up to 5 years after import</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-1" />
                      <span className="text-sm">Focuses on compliance verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-1" />
                      <span className="text-sm">May result in duty adjustments</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Risk Factors */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <AlertTriangle className="h-5 w-5" />
                    Key Audit Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">High import volume</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">Complex HS code classifications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">High-risk country sourcing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">Related party transactions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileWarning className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">Prior audit findings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#2E8B57]" />
                      <span className="text-sm">FTA utilization</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Outcomes */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <ListChecks className="h-5 w-5" />
                    Potential Audit Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <p className="font-medium text-[#2E8B57]">Compliant</p>
                      <p className="text-sm text-muted-foreground">No issues found, records in order</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <p className="font-medium text-amber-600">Minor Findings</p>
                      <p className="text-sm text-muted-foreground">Small errors requiring corrections</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <p className="font-medium text-red-600">Major Findings</p>
                      <p className="text-sm text-muted-foreground">Significant discrepancies, potential penalties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Categories */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F4C81]">
              Risk Categories & Probability
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <Card className="text-center border-l-4 border-l-[#2E8B57]">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-[#2E8B57]/10 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="h-8 w-8 text-[#2E8B57]" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Low Risk</h3>
                  <p className="text-3xl font-bold text-[#2E8B57] mb-2">0-30</p>
                  <p className="text-sm text-muted-foreground">
                    ~5-10% audit probability
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-l-4 border-l-amber-500">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Medium Risk</h3>
                  <p className="text-3xl font-bold text-amber-500 mb-2">30-50</p>
                  <p className="text-sm text-muted-foreground">
                    ~15-25% audit probability
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <FileWarning className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">High Risk</h3>
                  <p className="text-3xl font-bold text-red-500 mb-2">50-70</p>
                  <p className="text-sm text-muted-foreground">
                    ~35-50% audit probability
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-l-4 border-l-red-800">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-red-800/10 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-red-800" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Critical Risk</h3>
                  <p className="text-3xl font-bold text-red-800 mb-2">70+</p>
                  <p className="text-sm text-muted-foreground">
                    ~50-75% audit probability
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Common Audit Focus Areas */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F4C81]">
              Common Audit Focus Areas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0F4C81]">Valuation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#0F4C81]">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Transaction Value</p>
                        <p className="text-sm text-muted-foreground">Price actually paid for goods</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#0F4C81]">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Assists</p>
                        <p className="text-sm text-muted-foreground">Tools, dies, molds provided by buyer</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#0F4C81]">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Royalties & License Fees</p>
                        <p className="text-sm text-muted-foreground">Payments as condition of sale</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#0F4C81]">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Buying Commissions</p>
                        <p className="text-sm text-muted-foreground">Fees paid to buying agents</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0F4C81]">Classification</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#2E8B57]">1</span>
                      </div>
                      <div>
                        <p className="font-medium">HS Code Accuracy</p>
                        <p className="text-sm text-muted-foreground">Correct classification under HTSUS</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#2E8B57]">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Binding Rulings</p>
                        <p className="text-sm text-muted-foreground">CBP classification decisions</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#2E8B57]">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Duty Rates</p>
                        <p className="text-sm text-muted-foreground">Correct application of rates</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E8B57]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#2E8B57]">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Special Programs</p>
                        <p className="text-sm text-muted-foreground">GSP, AD/CVD applicability</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0F4C81]">Country of Origin</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-amber-500">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Substantial Transformation</p>
                        <p className="text-sm text-muted-foreground">Where goods underwent fundamental change</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-amber-500">2</span>
                      </div>
                      <div>
                        <p className="font-medium">FTA Eligibility</p>
                        <p className="text-sm text-muted-foreground">Qualifying goods for preferential rates</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-amber-500">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Certificates of Origin</p>
                        <p className="text-sm text-muted-foreground">Documentation requirements</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0F4C81]">Special Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-500">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Foreign Trade Zones</p>
                        <p className="text-sm text-muted-foreground">Duty deferral and reduction</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-500">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Duty Drawback</p>
                        <p className="text-sm text-muted-foreground">Refund of duties on exports</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-500">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Bonded Warehouses</p>
                        <p className="text-sm text-muted-foreground">Storage without duty payment</p>
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
              Pro Tips for Audit Preparedness
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Maintain 5-Year Records",
                  description: "Keep all import documentation for at least 5 years from date of entry as required by 19 CFR 163.4",
                  icon: Clock,
                },
                {
                  title: "Document Classification Rationale",
                  description: "Keep records explaining why each HS code was chosen, including binding rulings if applicable",
                  icon: BookOpen,
                },
                {
                  title: "Support Valuation Claims",
                  description: "Maintain documentation for all valuation elements including assists, royalties, and related party adjustments",
                  icon: DollarSign,
                },
                {
                  title: "Obtain Binding Rulings",
                  description: "Request CBP binding rulings for complex classifications to protect against future disputes",
                  icon: Scale,
                },
                {
                  title: "Consider C-TPAT Certification",
                  description: "C-TPAT membership can reduce audit frequency and provides supply chain security benefits",
                  icon: ShieldCheck,
                },
                {
                  title: "Conduct Internal Audits",
                  description: "Regular self-audits help identify and correct issues before CBP discovers them",
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
                  mistake: "Ignoring Transfer Pricing Adjustments",
                  consequence: "Related party transactions require special valuation treatment. Failure to adjust customs value can result in significant duty underpayments",
                },
                {
                  mistake: "Missing FTA Documentation",
                  consequence: "Claiming FTA preference without proper certificates of origin can result in retroactive duty bills and penalties",
                },
                {
                  mistake: "Inconsistent Classifications",
                  consequence: "Classifying the same product under different HS codes creates red flags and increases audit probability",
                },
                {
                  mistake: "Poor Record Keeping",
                  consequence: "Missing or disorganized records make audit defense difficult and can lead to adverse findings",
                },
                {
                  mistake: "Undervaluing Assists",
                  consequence: "Failing to include assists in customs value is a common audit finding that results in duty adjustments",
                },
                {
                  mistake: "Neglecting Prior Audit Findings",
                  consequence: "Not addressing previous audit issues increases scrutiny and demonstrates lack of reasonable care",
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
                  question: "How far back can customs audit my imports?",
                  answer: "Under 19 CFR 163.4, CBP can conduct post clearance audits within 5 years from the date of entry. This is why maintaining 5 years of records is mandatory. In some cases involving fraud or significant non-compliance, CBP may pursue actions beyond this period.",
                },
                {
                  question: "What triggers a post clearance audit?",
                  answer: "Audits can be triggered by various factors including high import volume, complex transactions, prior compliance issues, random selection, industry-wide initiatives, or referrals from other government agencies. Our risk model helps identify which factors apply to your situation.",
                },
                {
                  question: "What happens if audit finds discrepancies?",
                  answer: "If discrepancies are found, CBP may assess additional duties, interest, and potentially penalties. The severity depends on whether errors were negligent, grossly negligent, or fraudulent. You have the right to protest adverse findings through administrative and judicial review processes.",
                },
                {
                  question: "How can I reduce my audit risk?",
                  answer: "Key strategies include implementing robust internal controls, obtaining C-TPAT certification, conducting regular self-audits, maintaining comprehensive documentation, requesting binding rulings for ambiguous classifications, and addressing any prior audit findings promptly.",
                },
                {
                  question: "What is the difference between a focused and comprehensive audit?",
                  answer: "A focused audit examines specific areas such as valuation or classification for selected entries. A comprehensive audit reviews all aspects of your import compliance across multiple entries over several years. Focused audits are more common and typically less resource-intensive.",
                },
                {
                  question: "Should I hire a customs broker or consultant for audit preparation?",
                  answer: "While not required, experienced customs counsel or consultants can help identify compliance gaps before CBP does, prepare you for audit interviews, and represent your interests during the audit process. The investment often pays for itself in reduced penalties and duty assessments.",
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
                  title: "HS Code Search",
                  href: "/tools/customs-compliance/hs-code-search",
                  description: "Find correct HS codes for your products",
                },
                {
                  title: "FTA Eligibility Checker",
                  href: "/tools/customs-compliance/fta-eligibility",
                  description: "Check FTA qualification requirements",
                },
                {
                  title: "Landed Cost Calculator",
                  href: "/tools/international-trade/landed-cost-calculator",
                  description: "Calculate total import costs",
                },
                {
                  title: "Duty Tariff Calculator",
                  href: "/tools/customs-compliance/duty-tariff-calculator",
                  description: "Estimate duty and tariff rates",
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
              <strong>Disclaimer:</strong> This tool provides general guidance and estimates based on industry practices and publicly available information. 
              It does not constitute legal advice. Actual audit risk depends on many factors specific to your situation. 
              Consult with a licensed customs broker or trade attorney for advice on your specific circumstances.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
