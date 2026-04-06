import { ContainerLeasingROI } from "@/components/tools/ContainerLeasingROI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Calculator,
  TrendingUp,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Ship,
  Thermometer,
  Droplet,
  Box,
} from "lucide-react";
import Link from "next/link";

export default function ContainerLeasingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-ocean text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Ocean Freight Tools</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">Container Leasing ROI Calculator</h1>
            </div>
          </div>
          <p className="text-lg text-white/80 max-w-2xl">
            Analyze the financial viability of buying vs leasing shipping containers. Calculate NPV, IRR,
            payback period, and break-even utilization to make informed investment decisions.
          </p>
        </div>
      </div>

      {/* Main Calculator */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ContainerLeasingROI />
      </div>

      {/* Educational Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Separator className="my-8" />

        {/* Understanding Container Leasing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-[var(--ocean)]" />
            Understanding Container Leasing
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[var(--ocean)]" />
                  Container Ownership
                </CardTitle>
                <CardDescription>Benefits and considerations of buying containers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-[var(--logistics)] mb-2">Advantages</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                        <span>Build equity in tangible assets with residual value</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                        <span>Potential tax benefits through depreciation deductions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                        <span>Lower cost per day at high utilization rates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                        <span>Complete control over container condition and availability</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-destructive mb-2">Considerations</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>Large upfront capital investment required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>Responsible for all maintenance and repairs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>Asset value depreciation over time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>Less flexibility to scale fleet size</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                  Container Leasing
                </CardTitle>
                <CardDescription>Benefits and considerations of leasing containers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-[var(--logistics)] mb-2">Advantages</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                        <span>No large upfront capital expenditure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                        <span>Flexible fleet size to match demand fluctuations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                        <span>Predictable operating costs for budgeting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                        <span>Maintenance often included or managed by lessor</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-destructive mb-2">Considerations</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>No equity or residual value accumulation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>Long-term costs may exceed ownership</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>Dependence on lessor availability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>Potential rate increases at renewal</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Container Types Reference */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Package className="h-6 w-6 text-[var(--ocean)]" />
            Container Types Reference
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                    <Box className="h-6 w-6 text-[var(--ocean)]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Dry Containers</CardTitle>
                    <CardDescription>20GP, 40GP, 40HC</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase Price</span>
                    <span className="font-medium">$2,500 - $4,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Lease</span>
                    <span className="font-medium">$8 - $15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lifespan</span>
                    <span className="font-medium">15 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Share</span>
                    <Badge variant="outline">~80%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                    <Thermometer className="h-6 w-6 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Refrigerated</CardTitle>
                    <CardDescription>Reefer Containers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase Price</span>
                    <span className="font-medium">$18,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Lease</span>
                    <span className="font-medium">$45+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lifespan</span>
                    <span className="font-medium">12 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Share</span>
                    <Badge variant="outline">~10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
                    <Droplet className="h-6 w-6 text-[#F59E0B]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Tank Containers</CardTitle>
                    <CardDescription>ISO Tanks</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase Price</span>
                    <span className="font-medium">$35,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Lease</span>
                    <span className="font-medium">$65+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lifespan</span>
                    <span className="font-medium">20 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Share</span>
                    <Badge variant="outline">~5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Formulas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Financial Formulas</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Annual Depreciation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm mb-4">
                  Depreciation = (Purchase Price - Residual Value) / Useful Life
                </div>
                <p className="text-sm text-muted-foreground">
                  Calculated using straight-line depreciation. Standard containers typically have
                  15-year useful lives with 20-25% residual value.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Break-Even Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm mb-4">
                  BE Utilization = Annual Ownership Cost / (Daily Lease Rate × 365) × 100
                </div>
                <p className="text-sm text-muted-foreground">
                  The utilization rate at which leasing costs equal ownership costs. Above this rate,
                  buying becomes more economical.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Net Present Value (NPV)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm mb-4">
                  NPV = Σ(Cash Flow / (1 + r)<sup>t</sup>) - Initial Investment
                </div>
                <p className="text-sm text-muted-foreground">
                  Sum of all future cash flows discounted to present value. Positive NPV indicates
                  a profitable investment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Internal Rate of Return (IRR)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm mb-4">
                  IRR = rate where NPV = 0
                </div>
                <p className="text-sm text-muted-foreground">
                  The discount rate at which NPV equals zero. Compare IRR to your cost of capital
                  to evaluate investment viability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Pro Tips for Container Investment</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Monitor Utilization",
                description: "Track container utilization monthly. If consistently above 85%, buying becomes increasingly attractive.",
              },
              {
                title: "Hybrid Strategy",
                description: "Consider owning core fleet for steady demand while leasing for seasonal peaks or special containers.",
              },
              {
                title: "Hidden Costs",
                description: "Include repositioning, repairs, certifications, and administrative overhead in your calculations.",
              },
              {
                title: "Market Timing",
                description: "Container prices fluctuate with steel costs and trade cycles. Buy when market prices are low.",
              },
              {
                title: "Negotiate Terms",
                description: "Long-term leases often have better rates. Negotiate maintenance clauses and early return options.",
              },
              {
                title: "Diversify Types",
                description: "Different container types have different ROI profiles. Diversify based on your cargo mix.",
              },
            ].map((tip, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[var(--ocean)]">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                question: "What utilization rate makes buying containers worthwhile?",
                answer: "Generally, buying becomes economical when utilization exceeds 70-80%. The exact break-even point depends on container type, lease rates, and operating costs. Use our calculator to determine your specific break-even utilization.",
              },
              {
                question: "How do I account for container depreciation in my finances?",
                answer: "Containers are depreciated over their useful life (typically 15 years for dry containers) using the straight-line method. The residual value (usually 15-25%) is subtracted from the purchase price before calculating annual depreciation.",
              },
              {
                question: "What are the main costs of container ownership?",
                answer: "Key ownership costs include: depreciation (the largest component), maintenance and repairs (2-5% annually), insurance (0.5-1.5% annually), certification and inspection fees, and repositioning costs when containers need to be moved empty.",
              },
              {
                question: "How does container age affect resale value?",
                answer: "Container value declines predictably over time. Well-maintained containers typically retain 20-25% of original value at end of life. Factors affecting residual value include: maintenance quality, damage history, and market demand for used containers.",
              },
              {
                question: "Should I consider financing when buying containers?",
                answer: "Financing can make container ownership accessible with lower upfront capital. Compare the financing cost (interest rate) against your IRR. If IRR exceeds the financing rate, debt-financed ownership can be attractive.",
              },
              {
                question: "How do I handle container repositioning costs?",
                answer: "Repositioning empty containers is a significant hidden cost. Factor in the cost of moving empty containers to high-demand locations. Some operators minimize this by using one-way leases or participating in container exchange programs.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "FCL Loadability",
                description: "Optimize container loading for FCL shipments",
                href: "/tools/ocean-freight/fcl-loadability",
              },
              {
                title: "Container Validator",
                description: "Validate container numbers and check digits",
                href: "/tools/ocean-freight/container-validator",
              },
              {
                title: "Demurrage Calculator",
                description: "Calculate demurrage and detention charges",
                href: "/tools/ocean-freight/demurrage-calculator",
              },
              {
                title: "BAF/CAF Estimator",
                description: "Estimate bunker and currency adjustment factors",
                href: "/tools/ocean-freight/baf-estimator",
              },
            ].map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card className="hover:shadow-lg transition-all hover:border-[var(--ocean)]/30 cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Ship className="h-5 w-5 text-[var(--ocean)]" />
                      <h4 className="font-medium">{tool.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-sm text-[var(--ocean)]">
                      <span>Open Tool</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
