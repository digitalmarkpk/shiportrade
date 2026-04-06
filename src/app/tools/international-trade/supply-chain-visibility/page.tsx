import { Metadata } from "next";
import { SupplyChainVisibilityDashboard } from "@/components/tools/SupplyChainVisibilityDashboard";
import {
  Ship,
  Package,
  Building2,
  AlertTriangle,
  Clock,
  Globe,
  TrendingUp,
  Shield,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Supply Chain Visibility Dashboard | Shiportrade",
  description: "End-to-end supply chain visibility dashboard for global trade. Track shipments, monitor inventory levels, assess supplier status, manage risk alerts, and optimize logistics KPIs in real-time.",
};

export default function SupplyChainVisibilityPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="h-8 w-8 text-[#0F4C81]" />
          <h1 className="text-3xl font-bold text-[#0F4C81]">
            Supply Chain Visibility Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          End-to-end visibility across your global supply chain. Track shipments, monitor inventory, assess suppliers, and manage risks in real-time.
        </p>
      </div>

      {/* Main Dashboard Component */}
      <SupplyChainVisibilityDashboard />

      {/* Educational Content */}
      <div className="mt-12 space-y-8">
        {/* What is Supply Chain Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#0F4C81]" />
              What is Supply Chain Visibility?
            </CardTitle>
            <CardDescription>
              Understanding the fundamentals of supply chain transparency
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              Supply chain visibility refers to the ability to track and monitor all components, 
              processes, and activities across the entire supply chain in real-time. It provides 
              businesses with comprehensive insights into the movement of goods, inventory levels, 
              supplier performance, and potential risks.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-lg bg-[#0F4C81]/5">
                <Ship className="h-6 w-6 text-[#0F4C81] mb-2" />
                <h4 className="font-medium mb-1">Shipment Tracking</h4>
                <p className="text-sm text-muted-foreground">Real-time tracking of cargo across all transport modes</p>
              </div>
              <div className="p-4 rounded-lg bg-[#2E8B57]/5">
                <Package className="h-6 w-6 text-[#2E8B57] mb-2" />
                <h4 className="font-medium mb-1">Inventory Monitoring</h4>
                <p className="text-sm text-muted-foreground">Live visibility into stock levels across locations</p>
              </div>
              <div className="p-4 rounded-lg bg-[#0F4C81]/5">
                <Building2 className="h-6 w-6 text-[#0F4C81] mb-2" />
                <h4 className="font-medium mb-1">Supplier Management</h4>
                <p className="text-sm text-muted-foreground">Performance tracking and risk assessment</p>
              </div>
              <div className="p-4 rounded-lg bg-[#2E8B57]/5">
                <Shield className="h-6 w-6 text-[#2E8B57] mb-2" />
                <h4 className="font-medium mb-1">Risk Mitigation</h4>
                <p className="text-sm text-muted-foreground">Proactive identification and management of risks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
              Key Performance Indicators (KPIs)
            </CardTitle>
            <CardDescription>
              Essential metrics for measuring supply chain performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Ship className="h-4 w-4 text-[#0F4C81]" />
                  Delivery Performance
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span><strong>On-Time Delivery (OTD):</strong> Percentage of shipments delivered by promised date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span><strong>Perfect Order Rate:</strong> Orders delivered complete, on-time, undamaged</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span><strong>Transit Time Variance:</strong> Deviation from expected delivery times</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#0F4C81]" />
                  Inventory Metrics
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span><strong>Inventory Accuracy:</strong> Match between physical and recorded stock</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span><strong>Fill Rate:</strong> Percentage of customer demand met from available stock</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span><strong>Stock-Out Rate:</strong> Frequency of inventory shortages</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#0F4C81]" />
                  Supplier Performance
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span><strong>Supplier OTD:</strong> Supplier delivery reliability percentage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span><strong>Quality Rating:</strong> Defect-free delivery percentage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span><strong>Risk Score:</strong> Composite supplier risk assessment</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Alert Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
              Risk Alert Categories
            </CardTitle>
            <CardDescription>
              Understanding different types of supply chain risks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Ship className="h-5 w-5 text-[#0F4C81]" />
                  <h4 className="font-medium">Shipment Risks</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Delays due to weather or port congestion</li>
                  <li>• Container damage or loss</li>
                  <li>• Vessel schedule disruptions</li>
                  <li>• Transshipment issues</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-[#2E8B57]" />
                  <h4 className="font-medium">Inventory Risks</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Stock-outs affecting customer orders</li>
                  <li>• Overstock increasing holding costs</li>
                  <li>• Obsolete or expired inventory</li>
                  <li>• Warehouse capacity constraints</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-[#0F4C81]" />
                  <h4 className="font-medium">Supplier Risks</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Financial instability or bankruptcy</li>
                  <li>• Quality issues or recalls</li>
                  <li>• Geographic/political risks</li>
                  <li>• Capacity constraints</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-[#2E8B57]" />
                  <h4 className="font-medium">Route Risks</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Canal/transit point disruptions</li>
                  <li>• Regional conflicts or sanctions</li>
                  <li>• Seasonal weather patterns</li>
                  <li>• Carrier capacity fluctuations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Pro Tips for Supply Chain Visibility</CardTitle>
            <CardDescription>
              Best practices for maximizing the value of your visibility dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#0F4C81]">1</Badge>
                  <span className="font-medium">Set Up Real-Time Alerts</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure automated alerts for critical events like delays, stock-outs, and supplier issues to enable proactive responses.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#2E8B57]">2</Badge>
                  <span className="font-medium">Integrate Carrier APIs</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect directly with carrier systems for automatic tracking updates and reduced manual data entry.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#0F4C81]">3</Badge>
                  <span className="font-medium">Monitor Lead Time Trends</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track lead time variations to identify seasonal patterns and adjust safety stock levels accordingly.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#2E8B57]">4</Badge>
                  <span className="font-medium">Diversify Supplier Base</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use supplier risk scores to identify concentration risks and develop alternative sourcing strategies.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#0F4C81]">5</Badge>
                  <span className="font-medium">Benchmark Performance</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Compare your KPIs against industry benchmarks to identify improvement opportunities.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#2E8B57]">6</Badge>
                  <span className="font-medium">Regular Risk Reviews</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Conduct weekly reviews of risk alerts and develop mitigation plans for recurring issues.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>What data sources are used for shipment tracking?</AccordionTrigger>
                <AccordionContent>
                  Our dashboard integrates with multiple data sources including carrier APIs (MSC, Maersk, CMA CGM, etc.), 
                  AIS vessel tracking data, port community systems, and customs authorities. This multi-source approach 
                  ensures comprehensive and accurate tracking information across all legs of the journey.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>How are supplier risk scores calculated?</AccordionTrigger>
                <AccordionContent>
                  Supplier risk scores are calculated using a weighted algorithm that considers multiple factors: 
                  country risk (political stability, economic conditions), financial health metrics, delivery 
                  performance history, quality ratings, and compliance records. Scores range from 0-100, with 
                  lower scores indicating lower risk.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>Can I set custom alert thresholds?</AccordionTrigger>
                <AccordionContent>
                  Yes, the dashboard allows you to configure custom alert thresholds for various metrics. You can 
                  set specific triggers for inventory levels, lead time variances, supplier performance drops, 
                  and shipment delays. Alerts can be delivered via email, SMS, or in-app notifications.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>How often is the data refreshed?</AccordionTrigger>
                <AccordionContent>
                  Real-time data feeds from carriers are typically updated every 15-30 minutes. Inventory data 
                  is synchronized in real-time with connected warehouse management systems. Supplier metrics 
                  are recalculated daily based on the latest transaction data. Route performance data is 
                  updated weekly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>What integrations are available?</AccordionTrigger>
                <AccordionContent>
                  The dashboard supports integrations with major ERPs (SAP, Oracle, Microsoft Dynamics), 
                  warehouse management systems, transportation management systems, and leading carrier APIs. 
                  We also offer EDI connectivity and REST APIs for custom integrations with your existing 
                  technology stack.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q6">
                <AccordionTrigger>How can I improve my supply chain visibility?</AccordionTrigger>
                <AccordionContent>
                  Start by mapping your complete supply chain network, including all suppliers, carriers, and 
                  distribution points. Implement tracking technologies like IoT sensors and GPS. Integrate 
                  data from all partners into a centralized platform. Establish clear KPIs and monitoring 
                  processes. Finally, use predictive analytics to anticipate disruptions before they occur.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Tools</CardTitle>
            <CardDescription>
              Explore other tools to enhance your supply chain management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a href="/tools/international-trade/supplier-risk" className="p-4 rounded-lg border hover:border-[#0F4C81] hover:shadow-md transition-all group">
                <Building2 className="h-6 w-6 text-[#0F4C81] mb-2" />
                <h4 className="font-medium group-hover:text-[#0F4C81]">Supplier Risk Assessment</h4>
                <p className="text-sm text-muted-foreground">Evaluate and score supplier risks</p>
              </a>
              <a href="/tools/ocean-freight/container-tracking" className="p-4 rounded-lg border hover:border-[#0F4C81] hover:shadow-md transition-all group">
                <Ship className="h-6 w-6 text-[#0F4C81] mb-2" />
                <h4 className="font-medium group-hover:text-[#0F4C81]">Container Tracking</h4>
                <p className="text-sm text-muted-foreground">Track containers in real-time</p>
              </a>
              <a href="/tools/warehousing/inventory-optimization" className="p-4 rounded-lg border hover:border-[#0F4C81] hover:shadow-md transition-all group">
                <Package className="h-6 w-6 text-[#0F4C81] mb-2" />
                <h4 className="font-medium group-hover:text-[#0F4C81]">Inventory Optimization</h4>
                <p className="text-sm text-muted-foreground">Optimize stock levels and reorder points</p>
              </a>
              <a href="/tools/warehousing/service-level" className="p-4 rounded-lg border hover:border-[#0F4C81] hover:shadow-md transition-all group">
                <TrendingUp className="h-6 w-6 text-[#0F4C81] mb-2" />
                <h4 className="font-medium group-hover:text-[#0F4C81]">Service Level Optimizer</h4>
                <p className="text-sm text-muted-foreground">Balance service levels with costs</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
