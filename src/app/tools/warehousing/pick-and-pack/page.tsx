import { Metadata } from "next";
import { PickAndPackCalculator } from "@/components/tools/PickAndPackCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Boxes, Clock, TrendingUp, Zap, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pick and Pack Calculator | Shiportrade.com",
  description: "Calculate picking and packing labor hours, costs, and throughput. Compare batch, zone, and wave picking methods for warehouse optimization.",
  keywords: ["pick and pack calculator", "warehouse labor cost", "picking methods", "order fulfillment", "warehouse efficiency"],
};

export default function PickAndPackCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Package className="h-3 w-3 mr-2" />
          Warehousing Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Pick and Pack Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Optimize your warehouse fulfillment operations. Calculate labor hours, costs per order, 
          and compare picking methods to maximize throughput efficiency.
        </p>
      </div>

      {/* Calculator */}
      <PickAndPackCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Boxes className="h-5 w-5 text-[var(--logistics)]" />
              Pick Methods Explained
            </CardTitle>
            <CardDescription>
              Choosing the right picking strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <div>
              <strong className="text-[var(--ocean)]">Batch Picking:</strong>
              <p>Collect items for multiple orders in one warehouse pass. Reduces travel time by 25-40% for high-volume operations with similar SKUs.</p>
            </div>
            <div>
              <strong className="text-[var(--logistics)]">Zone Picking:</strong>
              <p>Assign pickers to specific warehouse zones. Orders pass between zones via conveyor or cart. Best for large facilities with diverse inventory.</p>
            </div>
            <div>
              <strong className="text-[var(--ocean)]">Wave Picking:</strong>
              <p>Release orders in timed waves aligned with shipping schedules. Coordinates picking with carrier pickup times for maximum efficiency.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--ocean)]" />
              Labor Cost Factors
            </CardTitle>
            <CardDescription>
              Key variables affecting your costs
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span><strong>Warehouse Layout:</strong> Larger facilities require more travel time per pick</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span><strong>Items per Order:</strong> More items increase pick time but dilute fixed costs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span><strong>Station Count:</strong> More stations increase capacity but require coordination</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span><strong>Labor Rate:</strong> Varies significantly by region and skill level</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--logistics)]">•</span>
                <span><strong>Automation Level:</strong> ROI typically 18-36 months for mid-size operations</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              KPIs to track for optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[var(--ocean)]">•</span>
                <span><strong>Picks Per Hour:</strong> Industry average 150-200 for manual operations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--ocean)]">•</span>
                <span><strong>Cost Per Order:</strong> Target $1.50-$3.00 for standard e-commerce</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--ocean)]">•</span>
                <span><strong>Accuracy Rate:</strong> Target 99.9% for customer satisfaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--ocean)]">•</span>
                <span><strong>Station Utilization:</strong> Optimal range 75-85% for flexibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--ocean)]">•</span>
                <span><strong>Order Cycle Time:</strong> From pick start to ship-ready</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ROI Card */}
      <Card className="mt-6 bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5 border-[var(--logistics)]/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Zap className="h-6 w-6 text-[var(--logistics)] shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-[var(--ocean)] mb-2">Maximize Your ROI</p>
              <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
                <div>
                  <strong>Automation Opportunities:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Pick-to-light systems: 30-50% productivity gain</li>
                    <li>• Voice picking: 20-35% accuracy improvement</li>
                    <li>• Automated sorting: 2-3x throughput increase</li>
                  </ul>
                </div>
                <div>
                  <strong>Process Improvements:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• ABC slotting optimization: 15-25% travel reduction</li>
                    <li>• Batch size optimization: Balance setup vs. efficiency</li>
                    <li>• Cross-training programs: Flexible workforce deployment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Throughput Benchmarks */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
            Industry Throughput Benchmarks
          </CardTitle>
          <CardDescription>
            Compare your operation against industry standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Operation Type</th>
                  <th className="text-center py-3 px-4 font-semibold">Picks/Hour</th>
                  <th className="text-center py-3 px-4 font-semibold">Cost/Order</th>
                  <th className="text-center py-3 px-4 font-semibold">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Manual Picking</td>
                  <td className="text-center py-3 px-4">100-150</td>
                  <td className="text-center py-3 px-4">$2.50-$4.00</td>
                  <td className="text-center py-3 px-4">99.5%</td>
                </tr>
                <tr className="border-b bg-muted/30">
                  <td className="py-3 px-4 font-medium">Batch Picking (Optimized)</td>
                  <td className="text-center py-3 px-4 text-[var(--logistics)]">150-200</td>
                  <td className="text-center py-3 px-4 text-[var(--logistics)]">$1.80-$2.50</td>
                  <td className="text-center py-3 px-4">99.7%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Zone Picking</td>
                  <td className="text-center py-3 px-4">180-250</td>
                  <td className="text-center py-3 px-4">$1.50-$2.20</td>
                  <td className="text-center py-3 px-4">99.8%</td>
                </tr>
                <tr className="border-b bg-muted/30">
                  <td className="py-3 px-4 font-medium">Pick-to-Light</td>
                  <td className="text-center py-3 px-4 text-[var(--ocean)]">250-400</td>
                  <td className="text-center py-3 px-4 text-[var(--ocean)]">$1.00-$1.50</td>
                  <td className="text-center py-3 px-4">99.95%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Full Automation (Goods-to-Person)</td>
                  <td className="text-center py-3 px-4">400-600+</td>
                  <td className="text-center py-3 px-4">$0.50-$1.00</td>
                  <td className="text-center py-3 px-4">99.99%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
