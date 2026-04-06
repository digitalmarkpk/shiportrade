import { Metadata } from "next";
import { StressTestingEngine } from "@/components/tools/StressTestingEngine";
import {
  Zap,
  AlertTriangle,
  Shield,
  BarChart3,
  Network,
  Clock,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Stress Testing Engine | Shiportrade.com",
  description:
    "Comprehensive supply chain stress testing tool to simulate extreme scenarios, assess financial impacts, and plan risk mitigation strategies.",
};

export default function StressTestingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-[var(--ocean)]/10">
            <Zap className="h-8 w-8 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--ocean)]">
              Stress Testing Engine
            </h1>
            <p className="text-muted-foreground">
              Simulate extreme scenarios and assess supply chain resilience
            </p>
          </div>
        </div>
      </div>

      {/* Main Calculator */}
      <StressTestingEngine />

      {/* Educational Content */}
      <div className="mt-12 space-y-8">
        {/* Quick Reference */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-[var(--ocean)]/5 to-transparent border-[var(--ocean)]/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Risk Score Scale
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--logistics)]">0-30</span>
                  <span>Low Risk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F59E0B]">30-50</span>
                  <span>Moderate Risk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F97316]">50-70</span>
                  <span>High Risk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#EF4444]">70-100</span>
                  <span>Critical Risk</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--logistics)]/5 to-transparent border-[var(--logistics)]/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-[var(--logistics)]" />
                Severity Multipliers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Mild</span>
                  <Badge className="bg-[#F59E0B]">0.5x</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Moderate</span>
                  <Badge className="bg-[#F97316]">1.0x</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Severe</span>
                  <Badge className="bg-[#EF4444]">1.5x</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Extreme</span>
                  <Badge className="bg-[#991B1B]">2.0x</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Recovery Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Mild</span>
                  <span>&lt;1 month</span>
                </div>
                <div className="flex justify-between">
                  <span>Moderate</span>
                  <span>1-3 months</span>
                </div>
                <div className="flex justify-between">
                  <span>Severe</span>
                  <span>3-6 months</span>
                </div>
                <div className="flex justify-between">
                  <span>Extreme</span>
                  <span>6+ months</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
              Pro Tips for Stress Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Start with Historical Scenarios</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use past disruptions as baseline scenarios. The COVID-19 pandemic and Suez Canal
                  blockage provide valuable real-world data points.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Consider Correlation Effects</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Multiple risk factors often occur together. A pandemic can trigger both supply
                  chain disruption AND demand shock simultaneously.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Update Assumptions Regularly</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Business conditions change. Re-run stress tests quarterly or after significant
                  changes to your supply chain structure.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Develop Action Plans</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Don&apos;t just identify risks - create specific mitigation strategies with clear
                  ownership, timelines, and success metrics.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Include Supply Chain Partners</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Collaborate with key suppliers and logistics providers to understand their
                  vulnerabilities and contingency plans.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-[var(--ocean)]">Test Recovery Strategies</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Run scenarios that test your mitigation strategies. Are they effective under
                  extreme conditions? What are the gaps?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="shrink-0 p-2 rounded-full bg-destructive/10">
                  <span className="text-destructive font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Underestimating Correlation</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Risk factors rarely occur in isolation. Ignoring correlations can significantly
                    underestimate total impact. Always consider compound scenarios.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="shrink-0 p-2 rounded-full bg-destructive/10">
                  <span className="text-destructive font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Using Only Optimistic Scenarios</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    It&apos;s tempting to test only scenarios you think are manageable. Include extreme
                    but plausible scenarios - they reveal hidden vulnerabilities.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="shrink-0 p-2 rounded-full bg-destructive/10">
                  <span className="text-destructive font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Ignoring Recovery Time</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Financial impact is only part of the picture. Recovery time affects working
                    capital, customer relationships, and market position.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="shrink-0 p-2 rounded-full bg-destructive/10">
                  <span className="text-destructive font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium">Failing to Act on Results</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Stress testing is worthless without action. Develop clear mitigation plans
                    based on findings and track implementation progress.
                  </p>
                </div>
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
            <div className="space-y-6">
              <div>
                <p className="font-medium text-[var(--ocean)]">
                  How often should I run stress tests on my supply chain?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Best practice is to conduct comprehensive stress tests at least quarterly, with
                  additional tests after significant changes to your supply chain (new suppliers,
                  new routes, major contracts). You should also test after major global events that
                  could affect your operations.
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--ocean)]">
                  What&apos;s the difference between stress testing and risk assessment?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Risk assessment identifies and evaluates individual risks. Stress testing takes it
                  further by simulating specific scenarios and quantifying their combined impact.
                  Think of risk assessment as identifying vulnerabilities, and stress testing as
                  testing how your supply chain performs under pressure.
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--ocean)]">
                  How do I determine appropriate severity levels?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Severity levels should be based on historical data, industry benchmarks, and expert
                  judgment. Look at past disruptions in your industry - how severe were they? What
                  was the financial impact? Use this data to calibrate your severity scales.
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--ocean)]">
                  Should I share stress test results with suppliers?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Strategic sharing can strengthen partnerships. Consider sharing relevant findings
                  with key suppliers to collaborate on risk mitigation. However, be selective about
                  what you share and ensure confidentiality agreements are in place.
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--ocean)]">
                  How do I translate stress test results into action?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create a prioritized action plan based on: 1) Highest impact scenarios, 2) Most
                  likely scenarios, 3) Quickest wins for mitigation. Assign ownership, set
                  timelines, and establish success metrics. Review progress monthly.
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--ocean)]">
                  Can stress testing help with insurance decisions?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Absolutely. Stress test results can help you: determine appropriate coverage
                  levels, identify specific risks to insure against, negotiate better premiums by
                  demonstrating risk awareness, and prioritize which risks to retain vs. transfer.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-[var(--ocean)]" />
              Related Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/tools/insurance/var-calculator">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 flex flex-col items-center gap-2"
                >
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  <span className="text-sm">VaR Calculator</span>
                </Button>
              </Link>
              <Link href="/tools/insurance/monte-carlo">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 flex flex-col items-center gap-2"
                >
                  <Zap className="h-5 w-5 text-[var(--logistics)]" />
                  <span className="text-sm">Monte Carlo Simulator</span>
                </Button>
              </Link>
              <Link href="/tools/insurance/expected-loss">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 flex flex-col items-center gap-2"
                >
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span className="text-sm">Expected Loss</span>
                </Button>
              </Link>
              <Link href="/tools/insurance/marine-premium">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 flex flex-col items-center gap-2"
                >
                  <Shield className="h-5 w-5 text-[var(--ocean)]" />
                  <span className="text-sm">Marine Insurance</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Badge component used in the severity table
function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${className}`}>
      {children}
    </span>
  );
}
