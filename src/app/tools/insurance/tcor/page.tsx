import { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Shield,
  TrendingDown,
  BarChart3,
  Gauge,
  Target,
  DollarSign,
  PieChart,
  LineChart,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TCORCalculator from "@/components/tools/TCORCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Total Cost of Risk (TCOR) Calculator | Shiportrade.com",
  description: "Calculate and analyze your Total Cost of Risk including insurance premiums, retained losses, risk control costs, and administrative expenses. Benchmark against industry standards and explore risk financing alternatives.",
  keywords: ["total cost of risk", "TCOR calculator", "risk management", "insurance premiums", "retained losses", "risk financing", "captive insurance", "self-insurance", "risk control"],
  openGraph: {
    title: "Total Cost of Risk (TCOR) Calculator",
    description: "Comprehensive TCOR analysis for logistics and trade companies. Calculate, benchmark, and optimize your risk costs.",
    type: "website",
  },
};

export default function TCORCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/insurance" className="hover:text-foreground">Insurance</Link>
        <span>/</span>
        <span className="text-foreground">Total Cost of Risk Calculator</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Calculator className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Total Cost of Risk (TCOR) Calculator</h1>
            <p className="text-muted-foreground">Comprehensive analysis of your organization&apos;s total risk costs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline">Industry Benchmarks</Badge>
          <Badge variant="outline">Risk Financing Analysis</Badge>
        </div>
      </div>

      {/* Calculator */}
      <TCORCalculator />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is TCOR */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              What is Total Cost of Risk?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Total Cost of Risk (TCOR)</strong> is a comprehensive metric that captures all costs 
              associated with managing risk in your organization. It goes beyond just insurance premiums 
              to include retained losses, administrative costs, and opportunity costs.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm mt-4">
              <div>
                <span className="text-[var(--ocean)]">TCOR</span> = Premiums + Retained Losses + Risk Control + Admin + Opportunity
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Understanding your TCOR enables better decisions about risk retention vs. transfer, 
              insurance program design, and resource allocation.
            </p>
          </CardContent>
        </Card>

        {/* TCOR Components */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5 text-[var(--ocean)]" />
              TCOR Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
                <div className="font-medium text-[var(--ocean)]">Insurance Premiums</div>
                <div className="text-muted-foreground">Payments to insurers for risk transfer</div>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="font-medium text-red-600">Retained Losses</div>
                <div className="text-muted-foreground">Deductibles, self-insured, uninsured losses</div>
              </div>
              <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
                <div className="font-medium text-[var(--logistics)]">Risk Control Costs</div>
                <div className="text-muted-foreground">Safety programs, training, security</div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="font-medium text-amber-600">Administrative Costs</div>
                <div className="text-muted-foreground">Claims handling, staff, compliance</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="font-medium text-purple-600">Opportunity Costs</div>
                <div className="text-muted-foreground">Capital tied up, collateral requirements</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why TCOR Matters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[var(--ocean)]" />
              Why TCOR Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Holistic View:</strong> See complete picture of risk costs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Better Decisions:</strong> Optimize retention vs. transfer</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Benchmarking:</strong> Compare against industry peers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Cost Reduction:</strong> Identify savings opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Executive Buy-in:</strong> Communicate risk in financial terms</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Performance Tracking:</strong> Measure risk management ROI</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* TCOR Formula Explained */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
            Understanding Each TCOR Component
          </CardTitle>
          <CardDescription>A detailed breakdown of what goes into your Total Cost of Risk calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Insurance Premiums",
                description: "All payments made to insurance carriers for transferring risk",
                items: ["Property insurance", "General liability", "Cargo/marine insurance", "Workers' compensation", "Auto/fleet insurance", "Professional liability", "Cyber insurance"],
                color: "var(--ocean)"
              },
              {
                icon: TrendingDown,
                title: "Retained Losses",
                description: "Losses that the organization absorbs directly without insurance",
                items: ["Deductibles paid on claims", "Self-insured retentions", "Uninsured losses", "Losses below deductible thresholds", "Excluded losses"],
                color: "#EF4444"
              },
              {
                icon: Settings,
                title: "Risk Control Costs",
                description: "Investments made to prevent and mitigate losses",
                items: ["Safety programs and equipment", "Employee training", "Security systems", "Risk consulting fees", "Loss prevention initiatives", "Quality control"],
                color: "var(--logistics)"
              },
              {
                icon: DollarSign,
                title: "Administrative Costs",
                description: "Internal costs of managing the risk management function",
                items: ["Claims management staff", "Risk management department", "Insurance administration", "Legal and compliance", "Broker fees", "Actuarial services"],
                color: "#F59E0B"
              },
              {
                icon: LineChart,
                title: "Opportunity Costs",
                description: "Hidden costs of capital tied up in risk management",
                items: ["Cost of capital for reserves", "Collateral requirements", "Letters of credit", "Time value of money", "Investment income foregone"],
                color: "#8B5CF6"
              },
              {
                icon: Gauge,
                title: "TCOR Metrics",
                description: "Key performance indicators for risk costs",
                items: ["TCOR as % of revenue", "TCOR per employee", "TCOR per $1000 payroll", "Loss ratio trends", "Premium vs. retained losses ratio"],
                color: "#06B6D4"
              },
            ].map((section) => (
              <div key={section.title} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <section.icon className="h-5 w-5" style={{ color: section.color }} />
                  <h4 className="font-medium" style={{ color: section.color }}>{section.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-[var(--logistics)]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Financing Strategies */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--ocean)]" />
            Risk Financing Strategies
          </CardTitle>
          <CardDescription>Understanding your options for managing and financing risk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-[var(--logistics)] mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Risk Transfer (Insurance)
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Transferring risk to an insurance carrier in exchange for premium payments.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Best for low-frequency, high-severity risks</li>
                <li>• Provides budget certainty</li>
                <li>• Access to insurer claims expertise</li>
                <li>• Market cycles affect pricing</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-[var(--ocean)] mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Risk Retention (Self-Insurance)
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Retaining risk within the organization and paying losses as they occur.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Best for high-frequency, low-severity risks</li>
                <li>• Avoids insurance overhead and profit</li>
                <li>• Retain investment income on reserves</li>
                <li>• Requires strong capital position</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20">
            <h4 className="font-medium text-[var(--ocean)] mb-2">The Optimal Balance</h4>
            <p className="text-sm text-muted-foreground">
              Most organizations use a combination of risk transfer and retention. Higher deductibles 
              can reduce premiums by 15-30%, but require sufficient capital reserves. Large organizations 
              may benefit from captive insurance companies, which can reduce TCOR by 20-35% while 
              providing more control over claims and coverage design.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tips & Mistakes */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-[var(--logistics)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[var(--logistics)]">
              <Lightbulb className="h-5 w-5" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Track all risk costs, not just insurance premiums
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Calculate TCOR as a percentage of revenue for easy benchmarking
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review retention levels annually to optimize the transfer/retain balance
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Consider captive insurance if TCOR exceeds $1M annually
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Include risk control investments - they often have high ROI
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Don&apos;t forget opportunity costs of collateral and capital
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Benchmark against similar companies in your industry
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Focusing only on insurance premiums, ignoring retained losses
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for internal risk management costs
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Over-retaining risk to save premium without proper analysis
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring the impact of loss control investments on TCOR
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not benchmarking against industry peers
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Forgetting opportunity costs of capital and collateral
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Choosing insurance based solely on lowest premium
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Industry Benchmarks Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-[var(--ocean)]" />
            Industry TCOR Benchmarks
          </CardTitle>
          <CardDescription>Typical TCOR as percentage of revenue by industry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Industry</th>
                  <th className="text-center py-3 px-4">TCOR % Range</th>
                  <th className="text-center py-3 px-4">Typical Focus</th>
                  <th className="text-left py-3 px-4">Key Risk Drivers</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Logistics & Transportation</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-amber-500">2.5% - 4.0%</Badge></td>
                  <td className="text-center py-3 px-4">Cargo, Auto, Workers&apos; Comp</td>
                  <td className="py-3 px-4 text-muted-foreground">High cargo values, driver safety, fleet exposure</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Manufacturing</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">2.0% - 3.5%</Badge></td>
                  <td className="text-center py-3 px-4">Property, Workers&apos; Comp</td>
                  <td className="py-3 px-4 text-muted-foreground">Equipment, product liability, workplace safety</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Retail & E-Commerce</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">1.2% - 2.5%</Badge></td>
                  <td className="text-center py-3 px-4">Property, Liability</td>
                  <td className="py-3 px-4 text-muted-foreground">Inventory, premises liability, cyber</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Construction</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-red-500">3.5% - 5.5%</Badge></td>
                  <td className="text-center py-3 px-4">Workers&apos; Comp, Liability</td>
                  <td className="py-3 px-4 text-muted-foreground">Job site accidents, project risks, professional liability</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Technology</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">0.8% - 1.8%</Badge></td>
                  <td className="text-center py-3 px-4">Cyber, Professional Liability</td>
                  <td className="py-3 px-4 text-muted-foreground">Data breach, IP, E&O exposure</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Wholesale Trade</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">1.5% - 2.5%</Badge></td>
                  <td className="text-center py-3 px-4">Property, Cargo</td>
                  <td className="py-3 px-4 text-muted-foreground">Inventory exposure, transportation</td>
                </tr>
              </tbody>
            </table>
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
              <AccordionTrigger>How is TCOR different from just insurance costs?</AccordionTrigger>
              <AccordionContent>
                While insurance premiums are a significant component, TCOR provides a complete picture 
                of all risk-related costs. This includes losses you retain (deductibles, self-insured 
                losses), investments in risk control (safety programs, training), administrative costs 
                of managing risk, and opportunity costs of capital tied up in reserves or collateral. 
                A company might have low premiums but high retained losses, making their TCOR actually 
                higher than expected.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is a good TCOR percentage?</AccordionTrigger>
              <AccordionContent>
                TCOR as a percentage of revenue varies significantly by industry. For logistics and 
                transportation companies, 2.5-4.0% is typical. Manufacturing often runs 2.0-3.5%, while 
                technology companies may be under 2%. Rather than chasing a specific number, focus on: 
                1) How you compare to industry peers, 2) Whether your TCOR is trending up or down, 
                3) Whether you&apos;re getting good value from your risk management investments. A &quot;good&quot; 
                TCOR is one where you&apos;re adequately protected against catastrophic losses while not 
                overpaying for predictable, manageable risks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Should I increase my deductibles to lower TCOR?</AccordionTrigger>
              <AccordionContent>
                Higher deductibles can reduce your insurance premiums by 15-30%, potentially lowering 
                your overall TCOR. However, this only makes sense if: 1) You have sufficient liquid 
                capital to pay the higher deductibles when losses occur, 2) Your retained losses 
                historically have been well below the higher deductible level, 3) You have good loss 
                control programs to minimize the frequency of claims. Run the numbers using this 
                calculator - if premium savings exceed the expected increase in retained losses and 
                capital costs, higher deductibles may be beneficial.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>When does captive insurance make sense?</AccordionTrigger>
              <AccordionContent>
                Captive insurance companies can reduce TCOR by 20-35% for suitable organizations. 
                Consider a captive if: 1) Your annual TCOR exceeds $1-2 million, 2) You have consistent, 
                predictable losses, 3) You want more control over claims handling and coverage terms, 
                4) You can commit the required capital (typically $250K-$2M+), 5) Your risk profile 
                is stable and well-understood. Captives work best for organizations that view risk 
                management as a strategic function and are willing to invest in governance and 
                administration. The &quot;Financing Alternatives&quot; tab can help evaluate if a captive 
                suits your situation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How often should I calculate and review my TCOR?</AccordionTrigger>
              <AccordionContent>
                Best practice is to calculate TCOR annually as part of your insurance renewal cycle. 
                This allows you to: 1) Track year-over-year trends, 2) Evaluate the effectiveness of 
                risk management initiatives, 3) Make informed decisions about retention levels, 
                4) Benchmark against industry data. Some organizations calculate quarterly for more 
                granular tracking, especially those with volatile loss patterns or those implementing 
                significant risk management changes. At minimum, review TCOR before major insurance 
                decisions or strategic planning sessions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>What are the most commonly overlooked TCOR components?</AccordionTrigger>
              <AccordionContent>
                The most frequently missed items are: 1) <strong>Opportunity costs</strong> - the return 
                you could earn on capital tied up in deductibles, collateral, or self-insurance reserves; 
                2) <strong>Internal staff costs</strong> - time spent on claims, insurance administration, 
                and risk management activities; 3) <strong>Uninsured losses</strong> - losses that fall 
                outside policy coverage or below deductibles; 4) <strong>Broker and consulting fees</strong> 
                outside of premium; 5) <strong>Legal costs</strong> for claims handling and disputes; 
                6) <strong>Regulatory compliance costs</strong> for risk-related requirements. Including 
                these gives you a complete picture for better decision-making.
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
            { name: "Expected Loss Calculator", href: "/tools/insurance/expected-loss" },
            { name: "Marine Insurance Calculator", href: "/tools/insurance/marine-premium" },
            { name: "Value at Risk (VaR)", href: "/tools/insurance/var-calculator" },
            { name: "Monte Carlo Simulator", href: "/tools/insurance/monte-carlo" },
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
