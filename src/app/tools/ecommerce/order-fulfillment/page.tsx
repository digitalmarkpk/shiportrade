import { Metadata } from "next";
import { OrderFulfillmentCalculator } from "@/components/tools/OrderFulfillmentCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Info,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Package,
  Truck,
  Clock,
  HelpCircle,
  DollarSign,
  Users,
  Gauge,
  Shield,
  Zap,
  Target,
  Activity,
  Warehouse,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Order Fulfillment Calculator | Shiportrade.com",
  description: "Calculate order fulfillment costs, capacity planning, labor requirements, and SLA compliance. Optimize your e-commerce fulfillment operations with picking method analysis.",
  keywords: ["order fulfillment calculator", "fulfillment cost", "picking method", "labor requirements", "capacity planning", "SLA compliance", "ecommerce fulfillment", "warehouse operations"],
};

const faqData = [
  {
    question: "What is order fulfillment and why is it important?",
    answer: "Order fulfillment encompasses the complete process from receiving an order to delivering it to the customer. It includes picking, packing, shipping, and potentially handling returns. Efficient fulfillment directly impacts customer satisfaction, operational costs, and business profitability. Poor fulfillment leads to delays, errors, and customer churn.",
  },
  {
    question: "How do I choose the right picking method?",
    answer: "Picking method selection depends on order volume, SKU count, warehouse size, and order complexity. Discrete picking works for low volumes (<100 orders/day). Batch picking suits medium volumes with similar products. Zone picking excels in large warehouses with diverse SKUs. Wave picking is ideal for time-sensitive operations with carrier integration needs.",
  },
  {
    question: "What is a good fulfillment rate target?",
    answer: "A healthy fulfillment rate is 95%+, meaning you can process 95% or more of daily orders within available capacity. Below 80% indicates you're over capacity and risk delays, overtime costs, and customer complaints. Peak seasons may temporarily push this lower, requiring temporary labor or extended hours.",
  },
  {
    question: "How do I calculate labor requirements for fulfillment?",
    answer: "Labor requirements are calculated by dividing total processing time (pick + pack + setup) by available shift hours. Factor in a 10-15% buffer for breaks, training, and variability. Cross-training workers provides flexibility during peak periods. Consider worker roles: pickers (60%), packers (30%), supervisors (10%).",
  },
  {
    question: "What factors affect cost per order?",
    answer: "Cost per order includes labor costs (picking, packing, quality control), packaging materials, shipping costs, and overhead allocation. Labor is typically 40-50% of fulfillment cost, shipping 30-40%, packaging 10-20%. Automation, picking efficiency, and carrier negotiations can significantly reduce these costs.",
  },
  {
    question: "How do I handle peak season capacity?",
    answer: "Plan for peak volumes 1.5-3x normal levels. Options include: hiring temporary workers (requires 2-4 weeks training), extending shifts with overtime, pre-positioning inventory, implementing wave picking, and partnering with 3PL overflow providers. Start planning 3-4 months before peak season.",
  },
];

export default function OrderFulfillmentPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Order Fulfillment Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate fulfillment costs, capacity requirements, labor needs, and SLA compliance.
          Optimize your picking method and plan for peak demand scenarios.
        </p>
      </div>

      {/* Calculator */}
      <OrderFulfillmentCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Fulfillment Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Fulfillment Rate:</strong> The percentage of orders your operation can process
              within a given period. A high fulfillment rate (95%+) indicates adequate capacity,
              while lower rates suggest bottlenecks or understaffing.
            </p>
            <p>
              <strong>SLA Compliance:</strong> Measures your ability to meet Service Level Agreement
              targets for order processing time. Critical for customer satisfaction and B2B contracts
              where penalties may apply for missed deadlines.
            </p>
            <p>
              <strong>Cost Per Order:</strong> Total fulfillment cost divided by order count. Includes
              labor, packaging, shipping, and overhead. Industry benchmark is $2.50-$5.00 for
              standard e-commerce orders.
            </p>
            <p>
              <strong>Capacity Utilization:</strong> Ratio of actual orders to maximum processing
              capacity. Optimal is 80-85% - higher risks delays during spikes, lower wastes resources.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Orders Per Hour:</strong> Total throughput rate. Benchmark: 150-200 picks/hour/worker, 25-40 orders/hour/station.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Pick Accuracy:</strong> Percentage of correctly picked items. Target 99.5%+ to minimize costly returns.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Cycle Time:</strong> Time from order receipt to shipment. Same-day should complete in 4-6 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Perfect Order Rate:</strong> Orders delivered on-time, complete, undamaged. Target 95%+.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Labor Efficiency:</strong> Productive time vs. total time. Benchmark 75-85% after accounting for breaks and travel.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Picking Methods Comparison */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-[var(--ocean)]" />
            Picking Methods Comparison
          </CardTitle>
          <CardDescription>
            Choose the optimal picking strategy based on your operation characteristics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📦</span>
                <span className="font-medium">Discrete Picking</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                One order at a time, single picker completes entire order.
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-medium">Base (1.0x)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best for:</span>
                  <span className="font-medium">&lt;100 orders/day</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-[var(--logistics)]/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📦</span>
                <span className="font-medium">Batch Picking</span>
                <Badge variant="secondary" className="ml-auto text-xs">Popular</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Pick multiple orders in one warehouse pass.
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-medium text-[var(--logistics)]">+35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best for:</span>
                  <span className="font-medium">100-500 orders/day</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏭</span>
                <span className="font-medium">Zone Picking</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Dedicated pickers in assigned warehouse zones.
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-medium text-[var(--logistics)]">+50%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best for:</span>
                  <span className="font-medium">500+ orders/day</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌊</span>
                <span className="font-medium">Wave Picking</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Scheduled waves coordinated with carrier pickups.
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-medium text-[var(--logistics)]">+45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best for:</span>
                  <span className="font-medium">Time-sensitive</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Components */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
            Cost Per Order Components
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-[var(--ocean)]" />
                <span className="font-medium">Labor</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Picking, packing, and quality control time. Typically 40-50% of total fulfillment
                cost. Optimize through efficient pick paths and batch processing.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Packaging</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Boxes, mailers, void fill, labels, and tape. Usually 10-20% of cost. Right-sizing
                packaging reduces both material costs and dimensional shipping charges.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Shipping</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Carrier charges based on weight, dimensions, and zones. The largest component at
                30-40%. Negotiate volume discounts and optimize zone coverage.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Warehouse className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Overhead</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Warehouse rent, utilities, equipment, and technology systems. Often 5-15% of per-order
                cost. Spread across higher volumes to reduce per-unit impact.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-[var(--ocean)]" />
            Pro Tips for Fulfillment Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">ABC Slotting</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Place fast-moving "A" items near pack stations, "B" items in middle zones, and slow
                "C" items in back areas. Can reduce pick time by 20-30%.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Wave Scheduling</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Align pick waves with carrier pickup times. This ensures orders are ready when trucks
                arrive, reducing staging space and improving on-time shipping rates.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Quality Checkpoints</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Implement scanning at pack stations to verify correct items. This catches 95%+ of
                picking errors before shipment, reducing costly returns and complaints.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Capacity Buffer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Maintain 15-20% capacity buffer for demand variability. Operating at 100% leaves no
                room for spikes, equipment issues, or worker absences.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Cut-off Time Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Set order cut-offs 2-3 hours before carrier pickups. This provides adequate processing
                time while maximizing same-day shipping for customer orders.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Cross-Training</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Train workers on multiple stations. This flexibility allows rapid rebalancing when
                bottlenecks occur or when workers are absent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Common Mistakes to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Ignoring peak season planning:</strong> Seasonal spikes can be 2-5x normal volume.
                Start hiring and training temporary workers 4-6 weeks before peak season begins.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Over-optimizing for one metric:</strong> Focusing solely on speed can increase
                error rates. Balance throughput with accuracy and cost metrics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Underestimating SKU complexity:</strong> More SKUs mean longer pick times and
                more errors. Factor SKU count into capacity planning and consider product slotting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Neglecting returns processing:</strong> Returns can be 5-30% of orders. Allocate
                labor and space for processing returns, which have different requirements than outbound.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Wrong picking method for volume:</strong> Using discrete picking for high volumes
                wastes labor, while complex zone systems for low volumes add unnecessary overhead.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* SLA Compliance Guide */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--ocean)]" />
            SLA Compliance Guide
          </CardTitle>
          <CardDescription>
            Understanding and meeting Service Level Agreement targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-[var(--ocean)]">Common SLA Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span>Order Processing Time</span>
                  <span className="font-medium">4-24 hours</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span>On-Time Shipping Rate</span>
                  <span className="font-medium">98%+</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span>Order Accuracy</span>
                  <span className="font-medium">99.5%+</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span>Response Time (Issues)</span>
                  <span className="font-medium">&lt;4 hours</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[var(--logistics)]">Improvement Strategies</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span>Implement real-time order tracking and alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span>Use automated prioritization for expedited orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span>Build buffer time into processing estimates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span>Monitor KPIs with dashboards and set alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span>Review and adjust SLAs quarterly based on capability</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">{faq.question}</h4>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Important Disclaimer</p>
              <p>
                This calculator provides estimates based on typical fulfillment operations and industry
                benchmarks. Actual costs and capacity will vary based on your specific warehouse layout,
                product mix, order complexity, and operational efficiency. Use these estimates as a
                starting point for planning and consult with fulfillment experts for detailed analysis
                of your specific operation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
