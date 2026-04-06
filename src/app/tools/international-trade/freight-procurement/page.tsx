import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Scale,
  DollarSign,
  Award,
  Users,
  FileText,
  MessageSquare,
  Target,
  Clock,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FreightProcurementTool from "@/components/tools/FreightProcurementTool";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Freight Procurement Tool | Shiportrade.com",
  description: "Complete freight procurement solution with RFQ creation, carrier bidding comparison, rate negotiation, contract award recommendations, and bid analysis for shipping professionals.",
  keywords: ["freight procurement", "RFQ management", "carrier bidding", "rate negotiation", "shipping contract", "bid analysis", "freight sourcing"],
  openGraph: {
    title: "Freight Procurement Tool",
    description: "Streamline your freight procurement process with RFQ management, carrier bidding, and intelligent contract award recommendations.",
    type: "website",
  },
};

export default function FreightProcurementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Freight Procurement</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Freight Procurement Tool</h1>
            <p className="text-muted-foreground">RFQ • Carrier Bidding • Negotiation • Contract Awards</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Enterprise Tool</Badge>
          <Badge variant="outline">Procurement</Badge>
          <Badge variant="outline">Contract Management</Badge>
        </div>
      </div>

      {/* Tool */}
      <FreightProcurementTool />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is Freight Procurement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Freight Procurement?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Freight procurement</strong> is the strategic process of sourcing, negotiating, 
              and securing transportation services from carriers. Effective procurement can reduce 
              shipping costs by 15-30% while improving service quality and reliability.
            </p>
            <p className="text-muted-foreground mt-3">
              The procurement cycle includes: RFQ creation, bid collection, analysis, negotiation, 
              contract awarding, and performance monitoring. Each stage requires careful evaluation 
              to ensure optimal carrier selection.
            </p>
          </CardContent>
        </Card>

        {/* RFQ Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-[var(--ocean)]" />
              RFQ Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Clear Specifications:</strong> Define exact requirements, volumes, and service expectations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Multiple Carriers:</strong> Invite 5-10 qualified carriers for competitive bidding
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Standardized Format:</strong> Use consistent templates for easy comparison
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Realistic Deadlines:</strong> Allow 2-4 weeks for carriers to prepare bids
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Evaluation Criteria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="h-5 w-5 text-[var(--ocean)]" />
              Key Evaluation Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Price (35%):</strong> Total cost including all surcharges and fees
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Transit Time (20%):</strong> Speed of delivery and schedule reliability
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Service Quality (20%):</strong> On-time performance and customer service
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong>Terms (10%):</strong> Payment terms, free time, and flexibility
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Procurement Process Steps */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
            Freight Procurement Process
          </CardTitle>
          <CardDescription>The 5-stage procurement cycle for optimal carrier selection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: 1, title: "RFQ Creation", icon: FileText, description: "Define requirements, volumes, routes, and service specifications" },
              { step: 2, title: "Bid Collection", icon: Users, description: "Gather competitive bids from qualified carriers" },
              { step: 3, title: "Analysis", icon: BarChart3, description: "Evaluate bids against weighted criteria" },
              { step: 4, title: "Negotiation", icon: MessageSquare, description: "Negotiate rates and terms with shortlisted carriers" },
              { step: 5, title: "Award", icon: Award, description: "Select carriers and execute contracts" },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <div className="w-10 h-10 rounded-full bg-[var(--ocean)] text-white flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <item.icon className="h-6 w-6 text-[var(--ocean)] mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
                {index < 4 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
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
              Pro Tips for Freight Procurement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Build long-term carrier relationships for better rates and priority service
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Diversify carrier portfolio to reduce dependency risk (60/30/10 split)
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use index-linked pricing mechanisms for transparency on fuel surcharges
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Negotiate volume rebates instead of just per-container discounts
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Include performance penalties and bonuses in contracts
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review carrier performance quarterly and renegotiate annually
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Procurement Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Selecting carriers based solely on lowest price without considering quality
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring surcharges and focusing only on base rates
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Over-committing volume to secure better rates
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not having backup carriers for critical lanes
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Failing to benchmark rates against market indices
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Skipping the negotiation phase and accepting initial offers
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Negotiation Strategies */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[var(--ocean)]" />
            Rate Negotiation Strategies
          </CardTitle>
          <CardDescription>Proven techniques to achieve better freight rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Leverage Competition",
                description: "Share (anonymized) competitive bids to encourage better offers",
                icon: Users,
              },
              {
                title: "Volume Commitment",
                description: "Offer guaranteed volumes in exchange for lower rates",
                icon: BarChart3,
              },
              {
                title: "Long-term Contracts",
                description: "Extended validity periods often yield 5-10% discounts",
                icon: Clock,
              },
              {
                title: "Bundle Services",
                description: "Combine multiple lanes or services for volume discounts",
                icon: Scale,
              },
            ].map((strategy) => (
              <div key={strategy.title} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <strategy.icon className="h-5 w-5 text-[var(--ocean)] mb-2" />
                <h4 className="font-semibold text-sm mb-1">{strategy.title}</h4>
                <p className="text-xs text-muted-foreground">{strategy.description}</p>
              </div>
            ))}
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
              <AccordionTrigger>How many carriers should I invite to bid?</AccordionTrigger>
              <AccordionContent>
                For optimal competition, invite <strong>5-10 qualified carriers</strong> to bid. 
                Fewer carriers limit your options and negotiating power, while too many creates 
                administrative burden. Focus on carriers with relevant experience on your trade 
                lanes, adequate capacity, and proven reliability records.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What should be included in an RFQ?</AccordionTrigger>
              <AccordionContent>
                A comprehensive RFQ should include: <strong>route details</strong> (origin/destination ports), 
                <strong> cargo specifications</strong> (type, weight, volume), <strong>volume commitments</strong> 
                (annual/monthly), <strong>service requirements</strong> (transit time, reliability), 
                <strong>contract terms</strong> (validity, payment terms, free time), and 
                <strong>response format</strong> (standardized template for easy comparison).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I evaluate bids from different carriers?</AccordionTrigger>
              <AccordionContent>
                Use a <strong>weighted scoring model</strong> based on your priorities. Common weights: 
                Price (35%), Transit Time (20%), Service Reliability (20%), Network Coverage (10%), 
                Payment Terms (10%), Sustainability (5%). Score each carrier against each criterion 
                and multiply by weights to get an overall score. Consider both quantitative (rates) 
                and qualitative (service quality) factors.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Should I award to one carrier or multiple?</AccordionTrigger>
              <AccordionContent>
                <strong>Multi-sourcing is recommended</strong> for risk management. A common approach 
                is the 60/30/10 split: primary carrier (60% of volume), secondary (30%), and backup 
                (10%). This ensures competitive rates through your primary carrier while maintaining 
                alternatives for capacity issues or service failures. Single-sourcing may offer 
                better rates but increases risk significantly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How often should I renegotiate freight contracts?</AccordionTrigger>
              <AccordionContent>
                <strong>Annual renegotiation</strong> is standard practice, typically 2-3 months 
                before contract expiry. However, renegotiate immediately if: market rates drop 
                significantly (15%+ below your contract), your volume patterns change dramatically, 
                carrier performance declines, or force majeure events occur. Build quarterly rate 
                review clauses into contracts for flexibility.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>What hidden costs should I watch for in bids?</AccordionTrigger>
              <AccordionContent>
                Watch for <strong>hidden charges</strong> that inflate total costs: peak season 
                surcharges (PSS), equipment imbalance surcharges (EIS), port congestion fees, 
                demurrage/detention charges, documentation fees, currency adjustment factors (CAF), 
                and fuel surcharges (BAF). Always request a complete breakdown and compare 
                all-in rates. Some carriers offer lower base rates but higher surcharges.
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
            { name: "Freight Contract Analyzer", href: "/tools/international-trade/freight-contract" },
            { name: "BAF/CAF Estimator", href: "/tools/ocean-freight/baf-estimator" },
            { name: "Freight Rate Benchmark", href: "/tools/ocean-freight/freight-rate-benchmark" },
            { name: "Demurrage Calculator", href: "/tools/ocean-freight/demurrage-calculator" },
          ].map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-all hover:border-[var(--ocean)]/50 cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium group-hover:text-[var(--ocean)] transition-colors">
                    {tool.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--ocean)] transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
