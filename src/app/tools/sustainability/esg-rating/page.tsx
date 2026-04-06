import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Leaf,
  Users,
  Building2,
  Target,
  Globe,
  Award,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ESGRiskRatingTool } from "@/components/tools/ESGRiskRatingTool";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "ESG Risk Rating Tool - Environmental, Social, Governance Assessment | Shiportrade.com",
  description: "Comprehensive ESG risk assessment tool for logistics and supply chain. Score Environmental, Social, and Governance performance with industry benchmarking and compliance frameworks.",
  keywords: ["ESG rating", "ESG risk assessment", "environmental social governance", "sustainability scoring", "supply chain ESG", "GRI SASB TCFD compliance"],
  openGraph: {
    title: "ESG Risk Rating Tool - Comprehensive ESG Assessment",
    description: "Assess ESG risks across your supply chain with our comprehensive scoring tool.",
    type: "website",
  },
};

export default function ESGRatingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/sustainability" className="hover:text-foreground">Sustainability</Link>
        <span>/</span>
        <span className="text-foreground">ESG Risk Rating</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--logistics)]/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-[var(--logistics)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">ESG Risk Rating Tool</h1>
            <p className="text-muted-foreground">Comprehensive Environmental, Social, and Governance assessment</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-logistics text-white">Free Tool</Badge>
          <Badge variant="outline">GRI Aligned</Badge>
          <Badge variant="outline">SASB Ready</Badge>
          <Badge variant="outline">TCFD Compatible</Badge>
        </div>
      </div>

      {/* Calculator */}
      <ESGRiskRatingTool />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is ESG */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--logistics)]" />
              What is ESG?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>ESG (Environmental, Social, Governance)</strong> is a framework for 
              evaluating company sustainability and ethical impact. In logistics and supply 
              chain, ESG has become critical for investor relations, customer requirements, 
              and regulatory compliance.
            </p>
            <p className="text-muted-foreground mt-3">
              Strong ESG performance correlates with better risk management, lower cost of 
              capital, and improved operational efficiency. Investors increasingly use ESG 
              scores to assess long-term value creation and risk exposure.
            </p>
          </CardContent>
        </Card>

        {/* ESG Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-[var(--logistics)]" />
              Three Pillars of ESG
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Leaf className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Environmental</p>
                <p className="text-sm text-muted-foreground">
                  Carbon emissions, energy efficiency, waste management, water stewardship, biodiversity
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-[var(--ocean)] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Social</p>
                <p className="text-sm text-muted-foreground">
                  Labor rights, health & safety, diversity & inclusion, community engagement, human rights
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Governance</p>
                <p className="text-sm text-muted-foreground">
                  Board composition, ethics & compliance, risk management, transparency, shareholder rights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why ESG Matters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[var(--logistics)]" />
              Why ESG Matters in Logistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Regulatory Pressure:</strong> CSRD, EU Taxonomy, SEC climate rules
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Customer Requirements:</strong> Shippers demanding supplier ESG data
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Investor Expectations:</strong> ESG funds now exceed $35 trillion globally
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Risk Mitigation:</strong> Avoid reputational and operational risks
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Frameworks */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[var(--ocean)]" />
            ESG Reporting Frameworks
          </CardTitle>
          <CardDescription>Key standards for sustainability disclosure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                name: "GRI Standards",
                description: "Global Reporting Initiative - comprehensive sustainability reporting",
                focus: "Universal applicability",
                color: "var(--logistics)"
              },
              {
                name: "SASB",
                description: "Sustainability Accounting Standards Board - industry-specific metrics",
                focus: "Financial materiality",
                color: "var(--ocean)"
              },
              {
                name: "TCFD",
                description: "Task Force on Climate-related Financial Disclosures",
                focus: "Climate risk",
                color: "#F59E0B"
              },
              {
                name: "CDP",
                description: "Carbon Disclosure Project - environmental disclosure system",
                focus: "Environmental impact",
                color: "#8B5CF6"
              },
              {
                name: "UN SDGs",
                description: "UN Sustainable Development Goals - 17 global goals",
                focus: "Global development",
                color: "#EC4899"
              },
            ].map((framework) => (
              <div
                key={framework.name}
                className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer group"
              >
                <h4 className="font-medium group-hover:text-[var(--ocean)] transition-colors">{framework.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{framework.description}</p>
                <Badge variant="outline" className="mt-2 text-xs">{framework.focus}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Benchmarks */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Industry ESG Benchmarks</CardTitle>
          <CardDescription>Average ESG scores by logistics sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { sector: "Shipping & Maritime", score: 58, trend: "up" },
              { sector: "Logistics & Freight", score: 62, trend: "up" },
              { sector: "Aviation & Air Cargo", score: 55, trend: "stable" },
              { sector: "Warehousing", score: 68, trend: "up" },
              { sector: "Manufacturing", score: 52, trend: "up" },
              { sector: "Retail & E-commerce", score: 65, trend: "up" },
            ].map((item) => (
              <div key={item.sector} className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm font-medium">{item.sector.split(" ")[0]}</p>
                <p className="text-2xl font-bold text-[var(--ocean)]">{item.score}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {item.trend === "up" ? (
                    <ArrowRight className="h-3 w-3 text-[var(--logistics)] rotate-[-45deg]" />
                  ) : (
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground capitalize">{item.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips & Mistakes */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-[var(--logistics)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[var(--logistics)]">
              <Lightbulb className="h-5 w-5" />
              Pro Tips for ESG Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Set science-based targets (SBTi) for credible emission reduction commitments
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Integrate ESG into enterprise risk management frameworks
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Engage stakeholders early in ESG strategy development
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use technology for real-time ESG data collection and monitoring
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Seek third-party verification for sustainability reports
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Extend ESG requirements to Tier 2+ suppliers in your supply chain
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common ESG Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Greenwashing - making claims without substantive action
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Focusing only on environmental, ignoring social and governance
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Treating ESG as a compliance exercise rather than strategy
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not engaging supply chain partners in ESG programs
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Setting unrealistic targets without clear action plans
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring material ESG issues specific to your industry
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ESG in Logistics */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-[var(--ocean)]" />
            ESG Focus Areas for Logistics
          </CardTitle>
          <CardDescription>Key ESG considerations in transportation and supply chain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Leaf className="h-4 w-4 text-[var(--logistics)]" />
                Environmental Priorities
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Carbon footprint reduction across modes</li>
                <li>• Alternative fuels and fleet electrification</li>
                <li>• Warehouse energy efficiency</li>
                <li>• Packaging optimization and waste reduction</li>
                <li>• Modal shift to lower-emission transport</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--ocean)]" />
                Social Priorities
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Driver welfare and fair working conditions</li>
                <li>• Safety culture and incident prevention</li>
                <li>• Diversity in logistics workforce</li>
                <li>• Community impact of operations</li>
                <li>• Human rights in supply chain</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-500" />
                Governance Priorities
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Anti-corruption and ethical business practices</li>
                <li>• Data privacy and cybersecurity</li>
                <li>• Supply chain transparency and traceability</li>
                <li>• ESG-linked executive compensation</li>
                <li>• Climate risk disclosure and scenario analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What is a good ESG score?</AccordionTrigger>
              <AccordionContent>
                ESG scores typically range from 0-100. A score above 70 is considered strong/low risk, 
                50-69 is moderate risk, and below 50 indicates elevated risk. However, what constitutes 
                a "good" score depends on your industry sector and peer comparison. Leading companies 
                in logistics typically score 65-75, while best-in-class performers exceed 80.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How often should ESG assessments be conducted?</AccordionTrigger>
              <AccordionContent>
                ESG assessments should be conducted at least annually to align with reporting cycles. 
                However, continuous monitoring of key ESG metrics is recommended, especially for 
                high-risk areas like safety incidents or environmental compliance. Many companies 
                now provide quarterly ESG updates to stakeholders alongside financial reporting.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Which ESG framework should I use?</AccordionTrigger>
              <AccordionContent>
                The choice depends on your stakeholders and regulatory requirements. For comprehensive 
                sustainability reporting, GRI is widely used. For investor-focused disclosure, SASB 
                provides industry-specific metrics. TCFD is essential for climate risk disclosure, 
                increasingly mandatory in many jurisdictions. Many companies use multiple frameworks 
                to meet different stakeholder needs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How do I improve my supply chain ESG score?</AccordionTrigger>
              <AccordionContent>
                Key steps include: 1) Implement supplier ESG screening and questionnaires, 
                2) Conduct regular supplier audits, 3) Establish clear ESG requirements in contracts, 
                4) Provide capacity building for suppliers, 5) Implement traceability systems, 
                6) Extend due diligence to Tier 2+ suppliers. Start with high-risk suppliers and 
                critical supply chains.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>What are the regulatory ESG requirements for logistics companies?</AccordionTrigger>
              <AccordionContent>
                Key regulations include: EU Corporate Sustainability Reporting Directive (CSRD) 
                requiring detailed ESG disclosure, EU Taxonomy for sustainable activities, 
                IMO regulations for shipping emissions (CII, EEXI), SEC climate disclosure rules 
                for US-listed companies, and various national due diligence laws. The regulatory 
                landscape is evolving rapidly, with increasing mandatory disclosure requirements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>How does ESG impact investor decisions in logistics?</AccordionTrigger>
              <AccordionContent>
                Investors increasingly integrate ESG into investment decisions. Strong ESG performance 
                can lower cost of capital, attract ESG-focused funds, and reduce investment risk. 
                Poor ESG performance may lead to divestment, higher insurance costs, and difficulty 
                accessing capital. ESG funds now manage over $35 trillion globally, making ESG 
                performance a material factor for company valuation.
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
            { name: "Carbon Footprint Calculator", href: "/tools/sustainability/carbon-footprint", icon: Leaf },
            { name: "CII Checker", href: "/tools/sustainability/cii-checker", icon: Target },
            { name: "Carbon Tax Impact Model", href: "/tools/sustainability/carbon-tax", icon: BarChart3 },
            { name: "Supply Chain Risk Scorer", href: "/tools/customs-compliance/sanctions-risk", icon: ShieldCheck },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.name} href={tool.href}>
                <Card className="h-full hover:shadow-md transition-all hover:border-[var(--ocean)]/50 cursor-pointer group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[var(--logistics)]" />
                      <span className="font-medium group-hover:text-[var(--ocean)] transition-colors">
                        {tool.name}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--ocean)] transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
