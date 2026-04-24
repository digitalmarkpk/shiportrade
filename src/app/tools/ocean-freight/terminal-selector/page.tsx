import { Metadata } from "next";
import { PortTerminalSelector } from "@/components/tools/PortTerminalSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Anchor,
  ArrowRight,
  BarChart3,
  Clock,
  Container,
  DollarSign,
  Gauge,
  Globe,
  Info,
  MapPin,
  Ship,
  Timer,
  TrendingUp,
  Truck,
  Warehouse,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Star,
  Clock4,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Port Terminal Selector - Shiportrade.com",
  description: "Compare container terminals by rates, capacity, productivity, dwell time, carrier coverage, equipment availability, gate hours, and vessel wait times. Get terminal recommendations for optimal port selection.",
  keywords: "terminal selector, port terminal comparison, container terminal rates, terminal productivity, dwell time, vessel wait time, carrier coverage, THC comparison, terminal recommendation",
};

export default function PortTerminalSelectorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--ocean)]/5 to-background">
      {/* Header */}
      <section className="bg-[var(--ocean)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Ocean Freight Tools
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Port Terminal Selector
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Compare container terminals worldwide by rates, capacity, productivity, and carrier coverage. 
              Get personalized terminal recommendations based on your shipping priorities.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" />
                <span>15+ Major Ports</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Container className="h-4 w-4" />
                <span>20+ Terminals</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4" />
                <span>Multi-Metric Comparison</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4" />
                <span>Smart Recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Reference Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-[var(--ocean)]/10 to-transparent border-[var(--ocean)]/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--ocean)]/20 rounded-lg">
                  <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Productivity Range</p>
                  <p className="font-semibold">25-38 MPH</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[var(--logistics)]/10 to-transparent border-[var(--logistics)]/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--logistics)]/20 rounded-lg">
                  <Timer className="h-5 w-5 text-[var(--logistics)]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Dwell Time</p>
                  <p className="font-semibold">3.5-7.5 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">THC Range</p>
                  <p className="font-semibold">$165-$420/TEU</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Ship className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vessel Wait</p>
                  <p className="font-semibold">2-36 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tool Component */}
        <PortTerminalSelector />

        {/* Educational Content */}
        <div className="mt-12 space-y-8">
          <Separator />

          {/* Understanding Terminal Selection */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="h-6 w-6 text-[var(--ocean)]" />
              Understanding Terminal Selection
            </h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Anchor className="h-5 w-5 text-[var(--ocean)]" />
                    Why Terminal Selection Matters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Container terminals within the same port can have vastly different capabilities, costs, 
                    and performance levels. Selecting the right terminal can significantly impact your 
                    supply chain efficiency and total landed costs.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Cost Optimization</p>
                        <p className="text-sm text-muted-foreground">
                          THC differences of $50-200/TEU between terminals can add up significantly
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Schedule Reliability</p>
                        <p className="text-sm text-muted-foreground">
                          High-productivity terminals reduce vessel delays and maintain schedules
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Carrier Coverage</p>
                        <p className="text-sm text-muted-foreground">
                          Ensure your preferred carriers serve the terminal you select
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                    Key Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: "Productivity", unit: "Moves/Hour", good: ">30", acceptable: "25-30", poor: "<25" },
                      { metric: "Dwell Time", unit: "Days", good: "<4", acceptable: "4-6", poor: ">6" },
                      { metric: "Vessel Wait", unit: "Hours", good: "<8", acceptable: "8-24", poor: ">24" },
                      { metric: "Gate Turn", unit: "Minutes", good: "<45", acceptable: "45-70", poor: ">70" },
                      { metric: "Reliability", unit: "Percentage", good: ">95%", acceptable: "85-95%", poor: "<85%" },
                    ].map((item, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 items-center">
                        <div className="font-medium text-sm">{item.metric}</div>
                        <div className="text-xs p-1.5 bg-[var(--logistics)]/10 text-[var(--logistics)] rounded text-center">
                          {item.good}
                        </div>
                        <div className="text-xs p-1.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 rounded text-center">
                          {item.acceptable}
                        </div>
                        <div className="text-xs p-1.5 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded text-center">
                          {item.poor}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Pro Tips */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-[var(--ocean)]" />
              Pro Tips for Terminal Selection
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Match Terminal to Cargo",
                  icon: Container,
                  tips: [
                    "Verify reefer capacity for perishables",
                    "Check OOG handling for oversized cargo",
                    "Confirm DG storage for hazardous goods",
                  ],
                },
                {
                  title: "Consider Total Landed Cost",
                  icon: DollarSign,
                  tips: [
                    "Include THC, storage, and demurrage",
                    "Factor in trucking distance and costs",
                    "Account for dwell time inventory costs",
                  ],
                },
                {
                  title: "Monitor Congestion Levels",
                  icon: TrendingUp,
                  tips: [
                    "Avoid critical congestion terminals",
                    "Plan alternatives during peak seasons",
                    "Track real-time performance metrics",
                  ],
                },
                {
                  title: "Gate Hours Matter",
                  icon: Clock4,
                  tips: [
                    "24/7 gates offer maximum flexibility",
                    "Extended hours help avoid peak times",
                    "Weekend access critical for some routes",
                  ],
                },
                {
                  title: "Carrier Alignment",
                  icon: Ship,
                  tips: [
                    "Ensure your carrier serves the terminal",
                    "Check service frequency and schedules",
                    "Verify alliance coverage at terminal",
                  ],
                },
                {
                  title: "Reliability First",
                  icon: Star,
                  tips: [
                    "Prioritize terminals with >90% reliability",
                    "Check customer satisfaction ratings",
                    "Review historical performance data",
                  ],
                },
              ].map((card, index) => (
                <Card key={index} className="hover:border-[var(--ocean)]/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <card.icon className="h-5 w-5 text-[var(--ocean)]" />
                      <h3 className="font-semibold">{card.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {card.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Common Mistakes */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              Common Mistakes to Avoid
            </h2>

            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      mistake: "Focusing Only on THC",
                      consequence: "Lower THC may come with higher demurrage rates or longer dwell times",
                      solution: "Calculate total terminal costs including storage and demurrage exposure",
                    },
                    {
                      mistake: "Ignoring Congestion Levels",
                      consequence: "Choosing a congested terminal can cause significant delays",
                      solution: "Check current congestion status and historical patterns before booking",
                    },
                    {
                      mistake: "Not Verifying Carrier Coverage",
                      consequence: "Selected terminal may not be served by your preferred carrier",
                      solution: "Confirm carrier services at terminal before finalizing selection",
                    },
                    {
                      mistake: "Overlooking Gate Hours",
                      consequence: "Limited gate hours can delay pickup and increase demurrage",
                      solution: "Choose terminals with extended or 24/7 gate access when possible",
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
                        <div>
                          <h4 className="font-semibold text-orange-600 dark:text-orange-400">{item.mistake}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Impact:</strong> {item.consequence}
                          </p>
                          <p className="text-sm text-[var(--logistics)] mt-2">
                            <strong>Solution:</strong> {item.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="h-6 w-6 text-[var(--ocean)]" />
              Frequently Asked Questions
            </h2>

            <div className="grid gap-4">
              {[
                {
                  question: "What is Terminal Handling Charge (THC)?",
                  answer: "THC is a fee charged by the terminal for handling containers. It covers loading/unloading from vessels, yard handling, and gate operations. THC varies significantly between terminals and ports, ranging from $150-450 per TEU depending on location and terminal capabilities.",
                },
                {
                  question: "How is terminal productivity measured?",
                  answer: "Terminal productivity is measured in moves per hour (MPH), which counts the number of container moves (loading/unloading) a terminal can perform per hour. Higher MPH indicates faster vessel turnaround. World-class terminals achieve 30-38 MPH, while less efficient terminals may operate at 20-25 MPH.",
                },
                {
                  question: "What causes terminal congestion?",
                  answer: "Terminal congestion occurs when yard capacity is exceeded due to factors like increased cargo volumes, reduced trucker capacity, labor shortages, or equipment breakdowns. Peak shipping seasons (Q3-Q4) often see higher congestion levels. Congestion leads to longer vessel wait times, increased dwell times, and potential demurrage charges.",
                },
                {
                  question: "How do free days work for demurrage?",
                  answer: "Free days are the period after container discharge during which no demurrage charges apply, typically 4-7 days. After free days expire, demurrage is charged per day until pickup. Some terminals offer extended free days for certain cargo types or during low-congestion periods. Planning pickup within free days helps avoid these charges.",
                },
                {
                  question: "Why do some terminals have 24/7 gate operations?",
                  answer: "24/7 gate operations provide maximum flexibility for shippers and help distribute truck traffic more evenly throughout the day. This reduces congestion during peak hours and allows for faster container pickup. Terminals at major transshipment hubs like Singapore and Jebel Ali typically operate 24/7.",
                },
                {
                  question: "How can I find which carriers serve a terminal?",
                  answer: "Our Carrier Coverage tab shows which carriers serve each terminal and the frequency of their services. You can filter by specific carrier to see all terminals they serve. This information is essential for ensuring your preferred carrier can deliver to your selected terminal.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-[var(--ocean)]" />
              Related Tools
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Port Code Finder",
                  description: "Search UN/LOCODE port codes worldwide",
                  href: "/directories/ports",
                  icon: Globe,
                },
                {
                  title: "Port Congestion Tracker",
                  description: "Real-time port congestion status",
                  href: "/tools/ocean-freight/port-congestion",
                  icon: TrendingUp,
                },
                {
                  title: "Demurrage Calculator",
                  description: "Calculate demurrage and detention charges",
                  href: "/tools/ocean-freight/demurrage-calculator",
                  icon: Calculator,
                },
                {
                  title: "Container Tracking",
                  description: "Track containers in real-time",
                  href: "/tools/ocean-freight/container-tracking",
                  icon: Container,
                },
              ].map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="h-full hover:border-[var(--ocean)]/50 transition-all hover:shadow-md cursor-pointer">
                    <CardContent className="p-4">
                      <tool.icon className="h-8 w-8 text-[var(--ocean)] mb-3" />
                      <h3 className="font-semibold mb-1">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Calculator icon component
function Calculator({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}
