import { Metadata } from "next";
import TradeComplianceChecker from "@/components/tools/TradeComplianceChecker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  AlertTriangle,
  Globe,
  FileText,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Package,
  Scale,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Trade Compliance Checker | Shiportrade",
  description: "Comprehensive trade compliance checker for HS code validation, country restrictions, license requirements, sanctions screening, and compliance scoring.",
};

const complianceAreas = [
  {
    title: "HS Code Check",
    description: "Validate HS codes against international classification databases and identify duty rates",
    icon: Package,
    features: ["Classification verification", "Duty rate lookup", "Special requirements", "Risk assessment"],
  },
  {
    title: "Country Restrictions",
    description: "Check import/export restrictions and trade regulations for specific countries",
    icon: Globe,
    features: ["Import restrictions", "Export controls", "Trade embargoes", "Regulatory requirements"],
  },
  {
    title: "License Requirements",
    description: "Identify required export licenses, permits, and certifications for your transaction",
    icon: FileText,
    features: ["Export licenses", "Import permits", "End-use certificates", "Sanctions exemptions"],
  },
  {
    title: "Sanctions Screening",
    description: "Screen parties against global sanctions lists and identify potential compliance risks",
    icon: ShieldCheck,
    features: ["OFAC screening", "EU sanctions", "UN lists", "Entity verification"],
  },
];

const quickTips = [
  {
    title: "Know Your Customer (KYC)",
    description: "Always verify the identity and legitimacy of your trading partners before proceeding with any transaction.",
  },
  {
    title: "Document Everything",
    description: "Maintain comprehensive records of all compliance checks, decisions, and due diligence for audit purposes.",
  },
  {
    title: "Stay Updated",
    description: "Trade regulations change frequently. Subscribe to regulatory updates from relevant authorities.",
  },
  {
    title: "Seek Expert Advice",
    description: "For complex transactions, consult with trade compliance specialists or legal counsel.",
  },
  {
    title: "Use Technology",
    description: "Leverage automated screening tools to ensure consistent and thorough compliance checks.",
  },
  {
    title: "Train Your Team",
    description: "Ensure all staff involved in trade operations understand compliance requirements and red flags.",
  },
];

const commonViolations = [
  {
    violation: "Unlicensed Exports",
    description: "Exporting controlled goods without required licenses",
    severity: "high",
  },
  {
    violation: "Sanctions Violations",
    description: "Transactions with sanctioned countries, entities, or individuals",
    severity: "critical",
  },
  {
    violation: "Misclassification",
    description: "Incorrect HS code classification leading to wrong duty payments",
    severity: "medium",
  },
  {
    violation: "Undervaluation",
    description: "Declaring lower transaction values to reduce customs duties",
    severity: "high",
  },
  {
    violation: "Document Fraud",
    description: "Falsified certificates, invoices, or other trade documents",
    severity: "critical",
  },
];

const faqItems = [
  {
    question: "What is trade compliance?",
    answer: "Trade compliance refers to the process of ensuring that international trade activities adhere to all applicable laws, regulations, and trade agreements. This includes export controls, import regulations, customs requirements, sanctions compliance, and proper documentation.",
  },
  {
    question: "How often should I screen my trading partners?",
    answer: "Trading partners should be screened before every transaction, even if they have been screened previously. Sanctions lists are updated regularly, and entities can be added or removed at any time. Regular screening ensures ongoing compliance.",
  },
  {
    question: "What is an HS code and why is it important?",
    answer: "The Harmonized System (HS) code is a standardized numerical classification for traded products. It determines duty rates, import/export restrictions, and regulatory requirements. Correct classification is essential for compliance and accurate duty payment.",
  },
  {
    question: "What are dual-use goods?",
    answer: "Dual-use goods are items that have both civilian and military applications. These items are subject to export controls and may require special licenses when exported to certain destinations. Examples include certain electronics, chemicals, and machinery.",
  },
  {
    question: "What penalties can result from trade compliance violations?",
    answer: "Penalties vary by jurisdiction and severity but can include substantial fines (often millions of dollars), criminal prosecution, loss of export privileges, debarment from government contracts, and reputational damage. In severe cases, individuals may face imprisonment.",
  },
  {
    question: "How long should compliance records be maintained?",
    answer: "Most jurisdictions require trade compliance records to be maintained for 5-7 years, though some regulations may require longer retention. Best practice is to keep records for at least 5 years from the date of the transaction or export.",
  },
];

const relatedTools = [
  { name: "HS Code Search", href: "/tools/customs-compliance/hs-code-search", description: "Search and classify HS codes" },
  { name: "Sanctions Risk Scorer", href: "/tools/customs-compliance/sanctions-risk", description: "Assess sanctions risk" },
  { name: "FTA Eligibility Checker", href: "/tools/customs-compliance/fta-eligibility", description: "Check FTA eligibility" },
  { name: "Customs Valuation", href: "/tools/customs-compliance/customs-valuation", description: "Calculate customs value" },
];

export default function TradeCompliancePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0F4C81]">
              Trade Compliance Checker
            </h1>
            <p className="text-muted-foreground text-lg mt-1">
              Comprehensive compliance check for HS codes, country restrictions, licenses, and sanctions
            </p>
          </div>
        </div>
      </div>

      {/* Main Component */}
      <TradeComplianceChecker />

      {/* Compliance Areas */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6 flex items-center gap-2">
          <Scale className="h-6 w-6" />
          Compliance Check Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complianceAreas.map((area, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                    <area.icon className="h-5 w-5 text-[#0F4C81]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{area.title}</CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {area.features.map((feature, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Tips */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Compliance Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTips.map((tip, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-[#2E8B57]/10 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0F4C81]">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Common Violations */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Common Compliance Violations to Avoid
        </h2>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {commonViolations.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    item.severity === "critical"
                      ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                      : item.severity === "high"
                      ? "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={`h-5 w-5 flex-shrink-0 ${
                        item.severity === "critical"
                          ? "text-red-500"
                          : item.severity === "high"
                          ? "text-amber-500"
                          : "text-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.violation}</h4>
                        <Badge
                          variant="outline"
                          className={
                            item.severity === "critical"
                              ? "border-red-300 text-red-600"
                              : item.severity === "high"
                              ? "border-amber-300 text-amber-600"
                              : "border-blue-300 text-blue-600"
                          }
                        >
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6 flex items-center gap-2">
          <AlertCircle className="h-6 w-6" />
          Frequently Asked Questions
        </h2>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="pb-6 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                  <h4 className="font-semibold text-[#0F4C81] mb-2">{item.question}</h4>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Related Tools */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-[#0F4C81] mb-6">Related Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedTools.map((tool, index) => (
            <a
              key={index}
              href={tool.href}
              className="group p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#0F4C81] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold group-hover:text-[#0F4C81] transition-colors">
                  {tool.name}
                </h4>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-[#0F4C81] transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-12">
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Important Disclaimer</h4>
                <p className="text-sm text-amber-600 dark:text-amber-300">
                  This tool provides general guidance for trade compliance and should not be considered legal advice. 
                  Regulations change frequently, and the accuracy of results depends on the information provided. 
                  For complex transactions or high-risk scenarios, always consult with qualified trade compliance 
                  professionals or legal counsel. Shiportrade.com is not liable for compliance decisions made based on this tool.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
