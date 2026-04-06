import { Metadata } from "next";
import Link from "next/link";
import {
  Gauge,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Target,
  BarChart3,
  Bell,
  LineChart,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogisticsKPIDashboard } from "@/components/tools/LogisticsKPIDashboard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Logistics KPI Dashboard | Shiportrade.com",
  description: "Monitor and analyze logistics key performance indicators including OTD, fill rate, inventory turnover, and perfect order rate. Track trends, benchmark performance, and get improvement recommendations.",
  keywords: ["logistics KPI", "on-time delivery", "fill rate", "inventory turnover", "perfect order rate", "warehouse metrics", "supply chain dashboard"],
  openGraph: {
    title: "Logistics KPI Dashboard - Performance Monitoring",
    description: "Comprehensive logistics KPI monitoring with trend analysis, benchmarking, alerts, and improvement recommendations.",
    type: "website",
  },
};

// Brand colors constant
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
};

export default function LogisticsKPIDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/warehousing" className="hover:text-foreground">Warehousing</Link>
        <span>/</span>
        <span className="text-foreground">KPI Dashboard</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <Gauge className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Logistics KPI Dashboard</h1>
            <p className="text-muted-foreground">Monitor, analyze, and optimize your logistics performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="gradient-ocean text-white">Free Tool</Badge>
          <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
            Real-time Analytics
          </Badge>
        </div>
      </div>

      {/* Dashboard Component */}
      <LogisticsKPIDashboard />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* What is KPI Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Logistics KPIs</strong> are quantifiable metrics that help measure the effectiveness 
              and efficiency of your supply chain operations. Tracking these indicators enables data-driven 
              decisions to optimize warehouse performance, reduce costs, and improve customer satisfaction.
            </p>
            <p className="text-muted-foreground mt-3">
              Our dashboard monitors eight critical KPIs: On-Time Delivery (OTD), Fill Rate, Inventory 
              Turnover, Perfect Order Rate, Order Accuracy, Warehouse Utilization, Picking Accuracy, 
              and Damages Rate.
            </p>
          </CardContent>
        </Card>

        {/* KPI Definitions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[var(--ocean)]" />
              KPI Definitions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "On-Time Delivery", desc: "Orders delivered by promised date", target: "≥95%" },
              { name: "Fill Rate", desc: "Customer demand met from stock", target: "≥98%" },
              { name: "Inventory Turnover", desc: "Times inventory sold per year", target: "≥12x" },
              { name: "Perfect Order Rate", desc: "Orders with no issues", target: "≥90%" },
            ].map((kpi) => (
              <div key={kpi.name} className="flex items-start justify-between p-2 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{kpi.name}</p>
                  <p className="text-xs text-muted-foreground">{kpi.desc}</p>
                </div>
                <Badge variant="outline" className="text-[var(--logistics)]">{kpi.target}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
              Dashboard Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Real-time Visibility:</strong> Monitor all KPIs in one place
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Trend Analysis:</strong> Identify patterns and seasonality
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Benchmarking:</strong> Compare against industry standards
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Proactive Alerts:</strong> Get notified of performance issues
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Actionable Insights:</strong> Receive improvement recommendations
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Dashboard Features</CardTitle>
          <CardDescription>Comprehensive tools for logistics performance management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { 
                title: "KPI Cards", 
                icon: Gauge,
                description: "Real-time performance metrics with targets",
                color: COLORS.ocean
              },
              { 
                title: "Trend Charts", 
                icon: LineChart,
                description: "Historical performance visualization",
                color: COLORS.logistics
              },
              { 
                title: "Benchmarking", 
                icon: BarChart3,
                description: "Compare against industry standards",
                color: COLORS.ocean
              },
              { 
                title: "Alerts", 
                icon: Bell,
                description: "Proactive performance notifications",
                color: COLORS.warning
              },
              { 
                title: "Insights", 
                icon: Lightbulb,
                description: "AI-powered improvement suggestions",
                color: COLORS.logistics
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5" style={{ color: feature.color }} />
                    <p className="font-medium">{feature.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* KPI Industry Standards */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Industry KPI Benchmarks</CardTitle>
          <CardDescription>Typical performance targets by industry sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Industry</th>
                  <th className="text-center py-3 px-4">OTD Target</th>
                  <th className="text-center py-3 px-4">Fill Rate</th>
                  <th className="text-center py-3 px-4">Turnover</th>
                  <th className="text-center py-3 px-4">Perfect Order</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">E-commerce Retail</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">95-98%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">97-99%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge variant="outline">12-18x</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">92-96%</Badge></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">B2B Distribution</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">92-95%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">95-98%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge variant="outline">8-12x</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">88-92%</Badge></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Pharmaceutical</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">98-99%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">99-99.5%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge variant="outline">6-10x</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">96-99%</Badge></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Automotive</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">97-99%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">96-98%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge variant="outline">15-25x</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">94-98%</Badge></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Food & Beverage</td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">94-97%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--logistics)]">97-99%</Badge></td>
                  <td className="text-center py-3 px-4"><Badge variant="outline">20-30x</Badge></td>
                  <td className="text-center py-3 px-4"><Badge className="bg-[var(--ocean)]">90-94%</Badge></td>
                </tr>
              </tbody>
            </table>
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
                Set realistic targets based on historical performance, not wishful thinking
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Review KPIs weekly and adjust strategies based on trends
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Use benchmarking to identify best practices from top performers
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Focus improvement efforts on KPIs with highest business impact
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Automate data collection to ensure accuracy and timeliness
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--logistics)]">•</span>
                Share KPI results with all stakeholders for accountability
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
                Tracking too many KPIs without clear priorities
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Ignoring the context behind KPI movements
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Setting targets without stakeholder buy-in
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Focusing only on lagging indicators
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not acting on insights from the data
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Using inconsistent measurement methods
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What is the most important logistics KPI?</AccordionTrigger>
              <AccordionContent>
                While all KPIs are important, <strong>Perfect Order Rate</strong> is often considered 
                the most comprehensive because it encompasses on-time delivery, complete orders, 
                undamaged goods, and accurate documentation. However, the "most important" KPI 
                depends on your business priorities - e-commerce may prioritize OTD while 
                manufacturing may focus on fill rate.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How often should I review KPI performance?</AccordionTrigger>
              <AccordionContent>
                Best practice is to review KPIs at multiple frequencies: <strong>daily</strong> for 
                operational issues, <strong>weekly</strong> for trend analysis and team meetings, 
                <strong>monthly</strong> for management reporting, and <strong>quarterly</strong> for 
                strategic planning and target adjustments. Real-time dashboards enable continuous monitoring.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I set realistic KPI targets?</AccordionTrigger>
              <AccordionContent>
                Start with your historical baseline, then consider: 1) Industry benchmarks, 2) 
                Customer requirements, 3) Strategic objectives, 4) Available resources, 5) 
                Improvement capacity. Set targets that are challenging but achievable - typically 
                5-15% improvement over current performance is realistic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What should I do if KPIs are declining?</AccordionTrigger>
              <AccordionContent>
                First, identify the root cause through data analysis. Common causes include: 
                capacity constraints, process changes, supplier issues, seasonality, or data 
                quality problems. Develop an action plan with specific interventions, assign 
                ownership, set timelines, and monitor progress closely. Use the improvement 
                suggestions in the dashboard for guidance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How do warehouse comparisons help improve performance?</AccordionTrigger>
              <AccordionContent>
                Benchmarking warehouses against each other identifies best practices that can be 
                replicated. Top-performing facilities often have optimized processes, better 
                training, or superior technology. By analyzing what makes them successful, 
                you can implement improvements across all locations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>Can I customize the KPIs for my business?</AccordionTrigger>
              <AccordionContent>
                Yes, the dashboard allows you to filter by warehouse location and time period. 
                For fully customized KPIs, you would need to integrate your data sources and 
                adjust the benchmark targets to match your specific business requirements and 
                industry standards.
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
            { name: "Service Level Optimizer", href: "/tools/warehousing/service-level" },
            { name: "Safety Stock Calculator", href: "/tools/warehousing/safety-stock" },
            { name: "EOQ Calculator", href: "/tools/warehousing/eoq-calculator" },
            { name: "Warehouse Cost Calculator", href: "/tools/warehousing/cost-calculator" },
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
