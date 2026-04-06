import { Metadata } from "next";
import { LastMileCalculator } from "@/components/tools/LastMileCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  Calendar,
  Ruler,
  DollarSign,
  Route,
  Timer,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Last Mile Delivery Calculator | Shiportrade.com",
  description: "Calculate last mile delivery costs for e-commerce and logistics. Compare same-day, next-day, and standard delivery options. Estimate delivery time and optimize costs by zone.",
  keywords: ["last mile delivery", "delivery cost calculator", "same day delivery", "last mile logistics", "e-commerce delivery", "zone pricing", "delivery time estimate"],
};

export default function LastMileDeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Truck className="h-3 w-3 mr-2" />
          Road & Rail Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Last Mile Delivery Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate delivery costs based on zones, distance, package dimensions, and delivery speed.
          Compare options to find the most cost-effective solution for your shipments.
        </p>
      </div>

      {/* Calculator */}
      <LastMileCalculator />

      {/* Educational Content */}
      <div className="mt-12 space-y-6">
        {/* Understanding Last Mile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
              Understanding Last Mile Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Last mile delivery is the final and most critical step in the supply chain journey,
              representing the movement of goods from a distribution center to the end customer.
              It typically accounts for 40-50% of total shipping costs despite being the shortest distance.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Zone-Based Pricing</h4>
                <p className="text-sm text-muted-foreground">
                  Costs vary by delivery zone - urban cores cost less than remote areas due to density.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Timer className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Speed Premiums</h4>
                <p className="text-sm text-muted-foreground">
                  Same-day delivery commands premiums up to 150%, while standard offers best value.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Package className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Size Matters</h4>
                <p className="text-sm text-muted-foreground">
                  Both weight and dimensions affect costs - volumetric weight can override actual weight.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--ocean)]" />
              Delivery Speed Options
            </CardTitle>
            <CardDescription>Choosing the right delivery speed for your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Same-Day */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                    <Zap className="h-6 w-6 text-[var(--ocean)]" />
                  </div>
                  <div>
                    <h4 className="font-medium">Same-Day Delivery</h4>
                    <p className="text-xs text-muted-foreground">Premium speed</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Fastest option for urgent shipments</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Ideal for perishables, medications</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Highest cost (50-150% premium)</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Order cutoff times apply</span>
                  </div>
                </div>
              </div>

              {/* Next-Day */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <h4 className="font-medium">Next-Day Delivery</h4>
                    <p className="text-xs text-muted-foreground">Balanced option</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Good balance of speed and cost</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Often includes discounts vs same-day</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Suitable for most e-commerce</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Weekend delays possible</span>
                  </div>
                </div>
              </div>

              {/* Standard */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Truck className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Standard Delivery</h4>
                    <p className="text-xs text-muted-foreground">Best value</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Most economical option</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Better route optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Lower environmental impact</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>3-5 business days wait</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zone Pricing Formula */}
        <Card className="border-[var(--ocean)]/30 bg-[var(--ocean)]/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-[var(--ocean)]">
              <DollarSign className="h-5 w-5" />
              Last Mile Pricing Formula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The total delivery cost is calculated using a combination of base rates, distance charges,
              and various surcharges:
            </p>

            <div className="p-4 bg-muted/50 rounded-lg font-mono text-center">
              <p className="text-lg mb-2">
                Total Cost = Base Rate + (Distance × Per-Km Rate) + Surcharges
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2">Surcharges Include:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Weight surcharge (per kg over base)</li>
                  <li>• Dimensional/volumetric surcharge</li>
                  <li>• Delivery speed premium/discount</li>
                  <li>• Remote area zone surcharge</li>
                  <li>• Fuel surcharge (percentage of base)</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2">Additional Services:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Priority handling (+$3.00)</li>
                  <li>• Signature required (+$1.50)</li>
                  <li>• Insurance (2% of value, min $2)</li>
                  <li>• Scheduled delivery window</li>
                  <li>• Return handling</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-300">Minimum Charge</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    Most carriers apply a minimum delivery charge (typically $3-5) regardless of calculated cost.
                    This covers basic handling and operational overhead.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Truck className="h-5 w-5 text-[var(--logistics)]" />
              Last Mile Vehicle Types
            </CardTitle>
            <CardDescription>Different vehicles for different delivery needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Vehicle Type</th>
                    <th className="text-right py-3 px-4">Max Weight</th>
                    <th className="text-right py-3 px-4">Cost per km</th>
                    <th className="text-left py-3 px-4">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">🚴 Bicycle/Courier</td>
                    <td className="text-right py-3 px-4">10 kg</td>
                    <td className="text-right py-3 px-4">$0.30</td>
                    <td className="py-3 px-4 text-muted-foreground">Urban documents, small parcels, same-day metro</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">🛵 Electric Scooter</td>
                    <td className="text-right py-3 px-4">20 kg</td>
                    <td className="text-right py-3 px-4">$0.35</td>
                    <td className="py-3 px-4 text-muted-foreground">Urban deliveries, food delivery, eco-friendly</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">🚐 Delivery Van</td>
                    <td className="text-right py-3 px-4">500 kg</td>
                    <td className="text-right py-3 px-4">$0.50</td>
                    <td className="py-3 px-4 text-muted-foreground">Standard parcels, multi-stop routes, suburban</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">🚚 Small Truck</td>
                    <td className="text-right py-3 px-4">2,000 kg</td>
                    <td className="text-right py-3 px-4">$0.70</td>
                    <td className="py-3 px-4 text-muted-foreground">Large items, furniture, bulk deliveries</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
              Cost Optimization Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Optimize Package Dimensions</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Right-size packaging to minimize volumetric weight. Even lightweight but bulky items
                    can cost more due to dimensional weight pricing.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Route className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Zone Selection</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider pickup points or locker locations in Zone A for reduced delivery costs
                    compared to home delivery in distant zones.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Consolidate Orders</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Combine multiple items into single shipments when possible. One larger package
                    often costs less than multiple small ones.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-medium">Flexible Delivery Windows</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Standard delivery offers the best rates. Reserve same-day for truly urgent needs
                    to significantly reduce costs.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-medium">Review Surcharges</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Evaluate if additional services like signature or insurance are necessary.
                    These add up quickly on high-volume shipments.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-medium">Hub Proximity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ship from distribution centers closer to customers when possible.
                    Zone A deliveries cost significantly less than Zone D.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Ignoring Volumetric Weight</h4>
                <p className="text-sm text-muted-foreground">
                  Many shippers focus only on actual weight and are surprised when charged for
                  volumetric weight. Always calculate both and use the higher value.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Over-Insuring Shipments</h4>
                <p className="text-sm text-muted-foreground">
                  Insurance costs are percentage-based. For low-value items, the cumulative
                  insurance cost may exceed potential loss value.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Default Same-Day Selection</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically choosing same-day without evaluating need can double delivery costs.
                  Most customers accept next-day or standard for significant savings.
                </p>
              </div>
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium mb-2">Poor Address Accuracy</h4>
                <p className="text-sm text-muted-foreground">
                  Incorrect or incomplete addresses lead to failed deliveries and re-delivery charges.
                  Validate addresses before shipping to avoid extra costs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Tools</CardTitle>
            <CardDescription>Other road and rail transport calculators you may find useful</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <a href="/tools/road-rail/route-optimizer" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Route className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Route Optimizer</h4>
                <p className="text-xs text-muted-foreground">Optimize multi-stop delivery routes</p>
              </a>
              <a href="/tools/road-rail/fuel-cost-km" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Truck className="h-8 w-8 text-[var(--logistics)] mb-2" />
                <h4 className="font-medium mb-1">Fuel Cost Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate fuel costs per kilometer</p>
              </a>
              <a href="/tools/road-rail/ldm-calculator" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Ruler className="h-8 w-8 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">LDM Calculator</h4>
                <p className="text-xs text-muted-foreground">Calculate loading meters</p>
              </a>
              <a href="/tools/warehousing/cost-calculator" className="p-4 border rounded-lg hover:border-[var(--ocean)] transition-colors">
                <Package className="h-8 w-8 text-[var(--ocean)] mb-2" />
                <h4 className="font-medium mb-1">Warehouse Costs</h4>
                <p className="text-xs text-muted-foreground">Calculate warehousing expenses</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
