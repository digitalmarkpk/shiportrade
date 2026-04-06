import { Metadata } from "next";
import { PortDwellTimeCalculator } from "@/components/tools/PortDwellTimeCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Ship, AlertTriangle, TrendingUp, Info, Lightbulb, Calendar, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Port Dwell Time Calculator | Shiportrade.com",
  description: "Calculate port dwell times, storage costs, and demurrage charges at major ports worldwide. Optimize container turnaround and reduce costs.",
  keywords: ["port dwell time", "container storage", "demurrage calculator", "port congestion", "free time", "container dwell"],
};

export default function PortDwellTimeCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Ship className="h-3 w-3 mr-2" />
          Ocean Freight Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Port Dwell Time Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Estimate container dwell times, calculate storage costs and demurrage charges at ports 
          worldwide. Get optimization tips to reduce turnaround time and costs.
        </p>
      </div>

      {/* Calculator */}
      <PortDwellTimeCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--logistics)]" />
              What is Dwell Time?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Port dwell time measures how long a container stays at a terminal from vessel 
              discharge until gate-out. It&apos;s a key indicator of port efficiency and directly 
              impacts your logistics costs.
            </p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>&lt;3 days: Efficient</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>3-5 days: Average</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>&gt;5 days: Needs attention</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
              Cost Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Every day beyond free time generates costs. Understanding these fees helps 
              you budget accurately and identify savings opportunities.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span>Storage Fees</span>
                <span className="font-medium">$35-95/day</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span>Demurrage</span>
                <span className="font-medium">$50-150/day</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span>Detention</span>
                <span className="font-medium">$75-200/day</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Common Delays
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Customs documentation issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Terminal congestion during peak seasons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Missing import permits or licenses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Trucking capacity shortages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Inspection holds (USDA, FDA, CBP)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Chassis availability issues</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tips */}
      <Card className="mt-6 bg-[var(--logistics)]/5 border-[var(--logistics)]/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Lightbulb className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-2 text-foreground">Pro Tips for Reducing Dwell Time</p>
              <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Pre-file customs 48+ hours before vessel arrival</li>
                  <li>• Book terminal appointments immediately upon discharge</li>
                  <li>• Maintain accurate and complete documentation</li>
                  <li>• Use chassis pools to ensure equipment availability</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Monitor real-time vessel schedules for accurate planning</li>
                  <li>• Consider off-peak gate hours (nights/weekends)</li>
                  <li>• Negotiate extended free time in service contracts</li>
                  <li>• Use alternative ports during peak congestion</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
            Regional Dwell Time Insights
          </CardTitle>
          <CardDescription>
            Average dwell times and key considerations by region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold mb-2">Asia</div>
              <div className="text-2xl font-bold text-[var(--logistics)] mb-2">2.5-4.5 days</div>
              <p className="text-xs text-muted-foreground">
                Most efficient globally. Singapore, Shanghai, and Busan lead with 
                advanced automation and 24/7 operations.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold mb-2">Europe</div>
              <div className="text-2xl font-bold text-[var(--ocean)] mb-2">2.8-5.0 days</div>
              <p className="text-xs text-muted-foreground">
                Rotterdam and Antwerp highly efficient. UK ports face periodic 
                congestion due to capacity constraints.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold mb-2">North America</div>
              <div className="text-2xl font-bold text-amber-500 mb-2">3.5-6.0 days</div>
              <p className="text-xs text-muted-foreground">
                US West Coast ports often congested. Consider East Coast or 
                Gulf alternatives during peak seasons.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold mb-2">Middle East</div>
              <div className="text-2xl font-bold text-[var(--logistics)] mb-2">3.0-5.5 days</div>
              <p className="text-xs text-muted-foreground">
                Jebel Ali highly efficient. Regional transshipment hub with 
                growing capacity and modern facilities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Statistics */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-semibold mb-2">Industry Statistics</p>
              <p>
                According to the World Bank&apos;s Container Port Performance Index, the global 
                average container dwell time is approximately 4.2 days. Top-performing ports 
                like Yangshan (Shanghai) achieve average dwell times under 2 days, while 
                congested ports can exceed 10 days during peak periods. Reducing dwell time 
                by just 1 day can save shippers $150-300 per container in storage and demurrage fees.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What&apos;s the difference between dwell time and transit time?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Transit time refers to the total time cargo spends in transit from origin to 
              destination, including ocean voyage. Dwell time specifically measures how long 
              a container stays at the port terminal after vessel discharge until it&apos;s picked up.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How is free time calculated?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Free time typically starts when the container becomes available for pickup 
              (after vessel discharge and customs release). Standard free time ranges from 
              3-7 days depending on the port, carrier, and contract terms.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Can I extend my free time?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Yes, free time can often be extended through: (1) Service contract negotiations, 
              (2) Carrier loyalty programs, (3) Pre-booking arrangements, or (4) Premium 
              services for a fee. Contact your carrier representative for options.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Why do some ports have longer dwell times?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Factors include: terminal capacity constraints, labor availability, equipment 
              shortages (chassis, cranes), customs inspection rates, gate hours, vessel 
              bunching, and peak season volumes. Infrastructure investment and automation 
              help reduce dwell times.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What happens if I exceed free time?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Once free time expires, demurrage charges apply for each additional day the 
              container remains at the terminal. Rates typically increase progressively 
              (e.g., days 1-4 at standard rate, days 5+ at higher rate). After pickup, 
              detention charges apply if container return is delayed.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How can I track container dwell time?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Use carrier tracking portals, terminal operating systems, or third-party 
              visibility platforms. Set alerts for: vessel arrival, discharge confirmation, 
              customs release, and free time expiration. Many platforms offer mobile apps 
              for real-time monitoring.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Tools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Tools</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="hover:border-[var(--ocean)] transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <Calendar className="h-6 w-6 text-[var(--ocean)] mb-2" />
              <CardTitle className="text-sm">Demurrage Calculator</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Calculate detailed demurrage and detention charges
            </CardContent>
          </Card>

          <Card className="hover:border-[var(--ocean)] transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <Ship className="h-6 w-6 text-[var(--logistics)] mb-2" />
              <CardTitle className="text-sm">Port Code Finder</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Search UN/LOCODE port codes worldwide
            </CardContent>
          </Card>

          <Card className="hover:border-[var(--ocean)] transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <TrendingUp className="h-6 w-6 text-[var(--ocean)] mb-2" />
              <CardTitle className="text-sm">Port Congestion Monitor</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Real-time port congestion and vessel queuing
            </CardContent>
          </Card>

          <Card className="hover:border-[var(--ocean)] transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <Clock className="h-6 w-6 text-[var(--logistics)] mb-2" />
              <CardTitle className="text-sm">Transit Time Estimator</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Estimate shipping transit times by route
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
