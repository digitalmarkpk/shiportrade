import { Metadata } from "next";
import { CrossDockingCalculator } from "@/components/tools/CrossDockingCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  Warehouse,
  Clock,
  DollarSign,
  Zap,
  ArrowRightLeft,
  Package,
  Timer,
  Users,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingDown,
  Building2,
  Gauge,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cross Docking Calculator | Shiportrade",
  description: "Optimize cross-docking operations with truck scheduling, dock door assignment, labor planning, and cost comparison against traditional warehousing.",
};

const crossDockingBenefits = [
  {
    icon: Clock,
    title: "Reduced Lead Time",
    description: "Eliminate storage time with direct transfer from inbound to outbound trucks, reducing total delivery time by 50-70%.",
  },
  {
    icon: TrendingDown,
    title: "Lower Costs",
    description: "Save 20-40% on warehousing costs by eliminating storage fees and reducing inventory holding costs.",
  },
  {
    icon: Package,
    title: "Fresh Products",
    description: "Ideal for perishable goods, ensuring products reach customers faster with extended shelf life.",
  },
  {
    icon: Gauge,
    title: "Higher Efficiency",
    description: "Streamlined operations with reduced handling, leading to fewer damages and faster throughput.",
  },
];

const crossDockingTypes = [
  {
    type: "Opportunistic Cross-Docking",
    description: "Ad-hoc transfer when inbound truck arrives and outbound truck is available.",
    bestFor: "Low-volume, unpredictable shipments",
    complexity: "Low",
  },
  {
    type: "Planned Cross-Docking",
    description: "Pre-scheduled coordination of inbound and outbound trucks with known arrival times.",
    bestFor: "Regular shipments with predictable schedules",
    complexity: "Medium",
  },
  {
    type: "Flow-Through Cross-Docking",
    description: "Products move directly from inbound to outbound without staging.",
    bestFor: "High-volume, time-sensitive goods",
    complexity: "High",
  },
  {
    type: "Deconsolidation Cross-Docking",
    description: "Large inbound shipments broken down for multiple smaller outbound deliveries.",
    bestFor: "Distribution centers, retail replenishment",
    complexity: "Medium",
  },
];

const proTips = [
  {
    title: "Stagger Truck Arrivals",
    description: "Schedule inbound trucks with 30-60 minute intervals to prevent dock congestion and optimize labor utilization.",
  },
  {
    title: "Prioritize by Departure Time",
    description: "Process cargo based on outbound truck departure times, not inbound arrival order, to meet delivery windows.",
  },
  {
    title: "Use Flexible Dock Doors",
    description: "Designate 20-30% of dock doors as flexible to handle demand fluctuations and peak periods.",
  },
  {
    title: "Pre-Stage Outbound",
    description: "When possible, pre-stage outbound trucks before inbound arrivals to minimize transfer time.",
  },
  {
    title: "Implement Real-Time Tracking",
    description: "Use dock management software to track truck locations, ETAs, and dock assignments in real-time.",
  },
  {
    title: "Cross-Train Workers",
    description: "Train workers on both loading and unloading to provide flexibility during peak demand periods.",
  },
];

const commonMistakes = [
  {
    title: "Insufficient Dock Capacity",
    description: "Not having enough dock doors leads to truck queues and missed departure windows.",
    impact: "Increased wait times, driver detention fees, delayed shipments",
  },
  {
    title: "Poor Scheduling Coordination",
    description: "Inbound and outbound trucks not synchronized, causing storage fallback.",
    impact: "Lost cross-docking benefits, additional handling costs",
  },
  {
    title: "Inadequate Labor Planning",
    description: "Under-staffing during peak periods or over-staffing during slow times.",
    impact: "Bottlenecks, overtime costs, or wasted labor expense",
  },
  {
    title: "Ignoring Product Characteristics",
    description: "Not considering cargo type, handling requirements, or temperature needs.",
    impact: "Product damage, safety issues, compliance violations",
  },
];

const faqs = [
  {
    question: "What is cross-docking in logistics?",
    answer: "Cross-docking is a logistics practice where incoming cargo is directly transferred from inbound trucks to outbound trucks with minimal or no storage time. This reduces handling, storage costs, and delivery lead times while improving supply chain efficiency.",
  },
  {
    question: "How much can I save with cross-docking?",
    answer: "Cross-docking typically reduces logistics costs by 20-40% compared to traditional warehousing. Savings come from eliminated storage fees, reduced inventory holding costs, lower labor for put-away/picking, and faster order fulfillment.",
  },
  {
    question: "What types of products are best suited for cross-docking?",
    answer: "Ideal products include perishable goods (food, pharmaceuticals), high-demand consumer goods, pre-tagged retail items, time-sensitive materials, and products with predictable demand. Items requiring quality inspection or long-term storage are less suitable.",
  },
  {
    question: "How many dock doors do I need for cross-docking?",
    answer: "The number of dock doors depends on truck volume, processing time, and operational hours. A general rule is to have enough doors to handle peak volume plus 20-30% buffer. Our calculator helps determine optimal capacity based on your specific schedule.",
  },
  {
    question: "What is the average truck turnaround time in cross-docking?",
    answer: "Well-optimized cross-docking operations achieve truck turnaround times of 1-3 hours, compared to 4-8+ hours in traditional warehousing. Palletized cargo typically processes faster than floor-loaded shipments.",
  },
  {
    question: "How do I handle delays in cross-docking operations?",
    answer: "Build buffer time into schedules, maintain relationships with backup carriers, use flexible dock doors, and have contingency plans for temporary storage. Real-time tracking and communication with drivers helps manage delays proactively.",
  },
];

const relatedTools = [
  {
    title: "Warehouse Slotting Tool",
    href: "/tools/warehousing/slotting-optimization",
    description: "Optimize warehouse layout and slot assignments",
  },
  {
    title: "Labor Planning Calculator",
    href: "/tools/warehousing/labor-planning",
    description: "Plan workforce requirements for operations",
  },
  {
    title: "Dock Door Scheduler",
    href: "/tools/warehousing/dock-scheduling",
    description: "Schedule and manage dock appointments",
  },
  {
    title: "Throughput Calculator",
    href: "/tools/warehousing/throughput",
    description: "Calculate warehouse throughput capacity",
  },
];

export default function CrossDockingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-[var(--ocean)]">Warehousing</Badge>
          <Badge variant="outline">Operations</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ArrowRightLeft className="h-8 w-8 text-[var(--ocean)]" />
          Cross Docking Calculator
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Optimize cross-docking operations with truck scheduling, dock door assignment, labor planning,
          and comprehensive cost comparison against traditional warehousing.
        </p>
      </div>

      {/* Calculator Component */}
      <CrossDockingCalculator />

      {/* Educational Content */}
      <div className="mt-12 space-y-8">
        {/* What is Cross-Docking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Cross-Docking
            </CardTitle>
            <CardDescription>
              A logistics strategy that eliminates storage time and reduces handling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Cross-docking is a supply chain management technique where products are unloaded from
              incoming trucks (or railcars) and loaded directly onto outbound vehicles with little or
              no storage in between. This approach minimizes inventory holding time, reduces warehousing
              costs, and accelerates order fulfillment.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-[var(--ocean)]/5 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[var(--ocean)]" />
                  Traditional Warehousing Flow
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">1</div>
                    <span>Receive inbound truck</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">2</div>
                    <span>Unload and store in warehouse</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">3</div>
                    <span>Hold inventory (days/weeks)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">4</div>
                    <span>Pick and pack orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">5</div>
                    <span>Load outbound truck</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--logistics)]/5 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-[var(--logistics)]" />
                  Cross-Docking Flow
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--logistics)]/20 flex items-center justify-center text-xs">1</div>
                    <span>Receive inbound truck</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--logistics)]/20 flex items-center justify-center text-xs">2</div>
                    <span>Unload to staging area</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--logistics)]/20 flex items-center justify-center text-xs">3</div>
                    <span>Sort by destination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--logistics)]/20 flex items-center justify-center text-xs">4</div>
                    <span>Load outbound truck</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--logistics)] mt-3">
                  ✓ Reduces 5+ steps to 4 steps with no storage time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Key Benefits of Cross-Docking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {crossDockingBenefits.map((benefit, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <benefit.icon className="h-8 w-8 text-[var(--ocean)] mb-3" />
                  <h4 className="font-semibold mb-2">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Types of Cross-Docking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[var(--ocean)]" />
              Types of Cross-Docking Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">Best For</th>
                    <th className="text-left py-3 px-4">Complexity</th>
                  </tr>
                </thead>
                <tbody>
                  {crossDockingTypes.map((type, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 font-medium">{type.type}</td>
                      <td className="py-3 px-4 text-muted-foreground">{type.description}</td>
                      <td className="py-3 px-4 text-muted-foreground">{type.bestFor}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            type.complexity === "Low"
                              ? "default"
                              : type.complexity === "Medium"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {type.complexity}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[var(--logistics)]" />
              Pro Tips for Cross-Docking Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {proTips.map((tip, index) => (
                <div key={index} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[var(--ocean)]">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="p-4 border border-amber-200 dark:border-amber-900 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{mistake.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{mistake.description}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                        <strong>Impact:</strong> {mistake.impact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-[var(--ocean)]" />
              Key Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-[var(--ocean)]/5 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="h-5 w-5 text-[var(--ocean)]" />
                  <span className="font-semibold">Truck Turnaround</span>
                </div>
                <p className="text-3xl font-bold text-[var(--ocean)]">1-3 hrs</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: Under 2 hours for optimal efficiency
                </p>
              </div>

              <div className="p-4 bg-[var(--logistics)]/5 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Warehouse className="h-5 w-5 text-[var(--logistics)]" />
                  <span className="font-semibold">Dock Utilization</span>
                </div>
                <p className="text-3xl font-bold text-[var(--logistics)]">70-85%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Optimal range: Avoid congestion while maximizing capacity
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold">Cost Savings</span>
                </div>
                <p className="text-3xl font-bold text-amber-500">20-40%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  vs traditional warehousing costs
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Additional Metrics to Track</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[var(--logistics)]" />
                    <span>Throughput per hour (pallets)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[var(--logistics)]" />
                    <span>Labor productivity (pallets/worker/hour)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[var(--logistics)]" />
                    <span>On-time departure rate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[var(--logistics)]" />
                    <span>Cargo damage rate</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Benchmarks by Industry</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--ocean)]" />
                    <span>Retail: 25-35 pallets/door/hour</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--ocean)]" />
                    <span>Food & Beverage: 20-30 pallets/door/hour</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--ocean)]" />
                    <span>Pharmaceuticals: 15-20 pallets/door/hour</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--ocean)]" />
                    <span>E-commerce: 30-40 pallets/door/hour</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Related Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((tool, index) => (
                <a
                  key={index}
                  href={tool.href}
                  className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors"
                >
                  <h4 className="font-semibold text-sm">{tool.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
