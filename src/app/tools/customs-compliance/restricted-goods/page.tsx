import { Metadata } from "next";
import RestrictedGoodsChecker from "@/components/tools/RestrictedGoodsChecker";
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  HelpCircle,
  Info,
  Package,
  Scale,
  Shield,
  Truck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Restricted Goods Checker | Shiportrade",
  description: "Check import/export restrictions for goods by HS code and product category. Identify prohibited items, license requirements, and compliance obligations for international trade.",
};

export default function RestrictedGoodsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <a href="/tools" className="hover:text-[#0F4C81]">Tools</a>
          <ChevronRight className="h-4 w-4" />
          <a href="/tools/customs-compliance" className="hover:text-[#0F4C81]">Customs & Compliance</a>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Restricted Goods Checker</span>
        </div>
        <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">
          Restricted Goods Checker
        </h1>
        <p className="text-muted-foreground text-lg">
          Verify import/export restrictions for goods by HS code or product category. Identify prohibited items, license requirements, and ensure compliance with international trade regulations.
        </p>
      </div>

      {/* Main Tool */}
      <RestrictedGoodsChecker />

      {/* Educational Content */}
      <div className="mt-12 space-y-8">
        {/* Understanding Restricted Goods */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <Package className="h-5 w-5" />
              Understanding Restricted Goods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Restricted goods are items subject to specific regulations, controls, or prohibitions when being imported, exported, or transported across borders. These restrictions exist to protect national security, public health, the environment, and comply with international agreements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Ban className="h-5 w-5 text-red-500" />
                  <h4 className="font-semibold text-red-700 dark:text-red-400">Prohibited</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Completely banned from import/export under any circumstances
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400">Restricted</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Allowed with specific conditions, permits, or limitations
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400">License Required</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requires prior authorization or license before import/export
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold text-green-700 dark:text-green-400">Allowed</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Generally permitted with standard customs procedures
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Restricted Goods Categories */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <Globe className="h-5 w-5" />
              Common Restricted Goods Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: "⚙️",
                  name: "Dual-Use Goods",
                  hs: "84, 85, 90",
                  desc: "Items with both civilian and military applications",
                  risk: "high",
                },
                {
                  icon: "☢️",
                  name: "Hazardous Materials",
                  hs: "28, 29, 38",
                  desc: "Chemicals, toxic substances, dangerous goods",
                  risk: "high",
                },
                {
                  icon: "🦏",
                  name: "Endangered Species",
                  hs: "01, 02, 05",
                  desc: "Wildlife and products from protected species",
                  risk: "medium",
                },
                {
                  icon: "💊",
                  name: "Pharmaceuticals",
                  hs: "29, 30",
                  desc: "Medicines, controlled substances, precursors",
                  risk: "medium",
                },
                {
                  icon: "🔫",
                  name: "Weapons & Ammunition",
                  hs: "93",
                  desc: "Firearms, ammunition, defense articles",
                  risk: "critical",
                },
                {
                  icon: "☢️",
                  name: "Nuclear Materials",
                  hs: "28.44, 28.45",
                  desc: "Radioactive materials, nuclear equipment",
                  risk: "critical",
                },
                {
                  icon: "🏺",
                  name: "Cultural Artifacts",
                  hs: "97",
                  desc: "Antiquities, artworks, cultural property",
                  risk: "medium",
                },
                {
                  icon: "💎",
                  name: "Precious Materials",
                  hs: "71",
                  desc: "Gold, diamonds, precious metals and stones",
                  risk: "medium",
                },
                {
                  icon: "🌾",
                  name: "Agricultural Products",
                  hs: "01-24",
                  desc: "Plants, seeds, livestock, food products",
                  risk: "low",
                },
              ].map((cat, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#0F4C81] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <h4 className="font-semibold">{cat.name}</h4>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        cat.risk === "critical"
                          ? "border-red-500 text-red-500"
                          : cat.risk === "high"
                          ? "border-amber-500 text-amber-500"
                          : cat.risk === "medium"
                          ? "border-blue-500 text-blue-500"
                          : "border-green-500 text-green-500"
                      }
                    >
                      {cat.risk}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{cat.desc}</p>
                  <p className="text-xs text-muted-foreground font-mono">HS: {cat.hs}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Regulations */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <Scale className="h-5 w-5" />
              Key International Regulations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "EAR (Export Administration Regulations)",
                  country: "United States",
                  desc: "Controls dual-use items under the Commerce Control List (CCL). Administered by the Bureau of Industry and Security (BIS).",
                  url: "https://bis.doc.gov",
                },
                {
                  name: "ITAR (International Traffic in Arms Regulations)",
                  country: "United States",
                  desc: "Controls defense articles, services, and technical data. Administered by the Directorate of Defense Trade Controls (DDTC).",
                  url: "https://pmddtc.state.gov",
                },
                {
                  name: "EU Dual-Use Regulation",
                  country: "European Union",
                  desc: "Harmonized export controls on dual-use items across EU member states. Based on the EU Dual-Use Control List.",
                  url: "https://ec.europa.eu/trade",
                },
                {
                  name: "CITES Convention",
                  country: "International",
                  desc: "Convention on International Trade in Endangered Species. Regulates trade in wildlife and wildlife products.",
                  url: "https://cites.org",
                },
                {
                  name: "UN Sanctions Regimes",
                  country: "United Nations",
                  desc: "Security Council sanctions programs targeting specific countries, entities, and individuals.",
                  url: "https://un.org/sc/suborg/en/sanctions",
                },
                {
                  name: "OFAC Regulations",
                  country: "United States",
                  desc: "Office of Foreign Assets Control administers economic and trade sanctions. Includes SDN List and country programs.",
                  url: "https://treasury.gov/ofac",
                },
              ].map((reg, idx) => (
                <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{reg.name}</h4>
                    <Badge variant="outline">{reg.country}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{reg.desc}</p>
                  <a
                    href={reg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#0F4C81] hover:underline"
                  >
                    Learn more →
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <CheckCircle className="h-5 w-5" />
              Pro Tips for Restricted Goods Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Classify Accurately",
                  desc: "Incorrect HS codes can lead to wrong restriction assessments. Always verify classification with customs authorities.",
                  icon: "📦",
                },
                {
                  title: "Apply Early for Licenses",
                  desc: "License processing can take 30-120 days. Submit applications well before your planned shipment date.",
                  icon: "⏰",
                },
                {
                  title: "Screen All Parties",
                  desc: "Run sanctions screening on manufacturers, shippers, end-users, and financial institutions involved.",
                  icon: "🔍",
                },
                {
                  title: "Document End-Use",
                  desc: "Obtain end-use certificates and statements. Document the final destination and purpose of goods.",
                  icon: "📝",
                },
                {
                  title: "Verify Exemptions",
                  desc: "Some goods may qualify for exemptions (EAR99, temporary exports, humanitarian). Always check if exemptions apply.",
                  icon: "✅",
                },
                {
                  title: "Maintain Records",
                  desc: "Keep all compliance records for at least 5 years. This includes licenses, screening results, and correspondence.",
                  icon: "📁",
                },
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <h4 className="font-semibold">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="border-0 shadow-lg border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  mistake: "Assuming \"commercial use\" means no restrictions",
                  consequence: "Many dual-use items require licenses regardless of intended commercial use",
                  fix: "Always check the Commerce Control List (CCL) for dual-use classification",
                },
                {
                  mistake: "Not screening intermediary parties",
                  consequence: "Transactions can be blocked if any party is sanctioned",
                  fix: "Screen all parties including freight forwarders, banks, and warehouses",
                },
                {
                  mistake: "Ignoring deemed exports",
                  consequence: "Sharing technical data with foreign nationals may require export licenses",
                  fix: "Implement technology control plans for dual-use and controlled technical data",
                },
                {
                  mistake: "Relying on outdated sanctions lists",
                  consequence: "Sanctions programs are updated frequently, and entities are added/removed regularly",
                  fix: "Subscribe to OFAC and BIS updates, screen against current lists",
                },
                {
                  mistake: "Not verifying end-user certificates",
                  consequence: "Fraudulent end-user certificates can result in violations",
                  fix: "Verify certificates with issuing authorities, check for red flags",
                },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-700 dark:text-amber-400">{item.mistake}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Consequence:</span> {item.consequence}
                      </p>
                      <p className="text-sm text-[#2E8B57] mt-1">
                        <span className="font-medium">Fix:</span> {item.fix}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "What is the difference between prohibited and restricted goods?",
                  a: "Prohibited goods are completely banned from import/export under any circumstances. Restricted goods may be imported/exported but require specific conditions to be met, such as obtaining permits, meeting quality standards, or limiting quantities. Prohibited items often carry criminal penalties for violations.",
                },
                {
                  q: "How do I know if my product requires an export license?",
                  a: "First, determine the correct HS code and ECCN (Export Control Classification Number) for your product. Check the Commerce Control List (CCL) for dual-use items or the USML for defense articles. Consider the destination country, end-user, and end-use. If in doubt, request a formal classification from BIS.",
                },
                {
                  q: "What is a dual-use item?",
                  a: "Dual-use items are goods, software, and technology that can be used for both civilian and military applications, or for developing weapons of mass destruction. Examples include certain chemicals, electronics, lasers, and software. These items are subject to export controls under the EAR.",
                },
                {
                  q: "How long does it take to get an export license?",
                  a: "Processing times vary: BIS export licenses typically take 30-90 days, DDTC licenses for defense articles can take 60-120 days, and other permits vary. It is advisable to apply at least 3-4 months before your planned shipment date.",
                },
                {
                  q: "What is the EAR99 classification?",
                  a: "EAR99 items are goods subject to the Export Administration Regulations (EAR) but not specifically listed on the Commerce Control List (CCL). These items generally do not require an export license for most destinations, but may still be restricted for sanctioned countries, end-users, or end-uses.",
                },
                {
                  q: "What are the penalties for export control violations?",
                  a: "Penalties can include civil fines up to $300,000 per violation (or twice the transaction value), criminal penalties up to $1 million and 20 years imprisonment per violation, denial of export privileges, and debarment from government contracts. Companies may also face reputational damage and loss of business opportunities.",
                },
              ].map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
              <Truck className="h-5 w-5" />
              Related Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  name: "HS Code Search",
                  desc: "Find HS codes for products",
                  href: "/tools/customs-compliance/hs-code-search",
                },
                {
                  name: "Sanctions Risk Scorer",
                  desc: "Screen parties against sanctions lists",
                  href: "/tools/customs-compliance/sanctions-risk",
                },
                {
                  name: "FTA Eligibility Checker",
                  desc: "Check free trade agreement eligibility",
                  href: "/tools/customs-compliance/fta-eligibility",
                },
                {
                  name: "Duty Tariff Calculator",
                  desc: "Calculate import duties and tariffs",
                  href: "/tools/customs-compliance/duty-tariff-calculator",
                },
              ].map((tool, idx) => (
                <a
                  key={idx}
                  href={tool.href}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#0F4C81] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <h4 className="font-semibold text-[#0F4C81]">{tool.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{tool.desc}</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-0 shadow-lg bg-slate-50 dark:bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Disclaimer</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  This tool provides general guidance based on publicly available information. It does not constitute legal advice. Export and import regulations are complex and subject to change. Always consult with qualified legal counsel and verify requirements with relevant regulatory authorities before proceeding with any transaction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
