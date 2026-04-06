import { Metadata } from "next";
import { InventoryOptimizationTool } from "@/components/tools/InventoryOptimizationTool";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Target, 
  Layers, 
  LineChart, 
  TrendingUp, 
  DollarSign, 
  Info,
  Package,
  BarChart3,
  Zap,
  Database,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Inventory Optimization Tool | Shiportrade.com",
  description: "Comprehensive inventory management suite with safety stock calculation, reorder point optimization, ABC analysis, demand forecasting, turnover analysis, and carrying cost calculations.",
  keywords: [
    "inventory optimization",
    "safety stock calculator",
    "reorder point",
    "ABC analysis",
    "demand forecasting",
    "inventory turnover",
    "carrying cost",
    "inventory management",
    "stock optimization",
    "supply chain tools",
  ],
};

export default function InventoryOptimizationPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Package className="h-3 w-3 mr-2" />
          Inventory Management Suite
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[#2B4570] to-[#4CAF50] bg-clip-text text-transparent">
          Inventory Optimization Tool
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          A comprehensive suite of inventory management tools to optimize stock levels, 
          reduce carrying costs, and improve supply chain efficiency.
        </p>
      </div>

      {/* Main Tool */}
      <InventoryOptimizationTool />

      {/* Feature Cards */}
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-[#2B4570]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" style={{ color: "#2B4570" }} />
              Safety Stock Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Statistical and simple methods</li>
              <li>• Service level optimization (90-99.9%)</li>
              <li>• Demand variability analysis</li>
              <li>• Lead time uncertainty handling</li>
              <li>• Holding cost estimation</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#4CAF50]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" style={{ color: "#4CAF50" }} />
              Reorder Point Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Lead time demand calculation</li>
              <li>• Review period optimization</li>
              <li>• Maximum inventory planning</li>
              <li>• Average inventory estimation</li>
              <li>• Automated trigger points</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2B4570]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5" style={{ color: "#2B4570" }} />
              ABC Analysis Visualization
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Pareto principle application</li>
              <li>• Category A/B/C classification</li>
              <li>• Value distribution charts</li>
              <li>• Cumulative value analysis</li>
              <li>• Item prioritization</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#4CAF50]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="h-5 w-5" style={{ color: "#4CAF50" }} />
              Demand Forecasting
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Multiple forecasting methods</li>
              <li>• Growth trend projection</li>
              <li>• Seasonality adjustment</li>
              <li>• Confidence intervals</li>
              <li>• Historical vs forecast comparison</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2B4570]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: "#2B4570" }} />
              Inventory Turnover Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Turnover ratio calculation</li>
              <li>• Days inventory outstanding</li>
              <li>• Gross margin analysis</li>
              <li>• GMROI measurement</li>
              <li>• Performance benchmarking</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#4CAF50]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" style={{ color: "#4CAF50" }} />
              Carrying Cost Calculations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Storage cost analysis</li>
              <li>• Insurance & obsolescence</li>
              <li>• Cost of capital</li>
              <li>• Handling cost breakdown</li>
              <li>• Total carrying cost summary</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="mt-6 bg-gradient-to-r from-[#2B4570]/10 to-[#4CAF50]/10 border-[#2B4570]/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#2B4570" }} />
            <div className="text-sm">
              <p className="font-semibold mb-2" style={{ color: "#2B4570" }}>
                About Inventory Optimization
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Effective inventory optimization balances service levels with holding costs</li>
                <li>• ABC analysis helps prioritize management attention on high-value items</li>
                <li>• Regular review of safety stock ensures alignment with changing demand patterns</li>
                <li>• Carrying costs typically range from 15-35% of inventory value annually</li>
                <li>• Higher turnover ratios generally indicate better inventory management efficiency</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Colors Legend */}
      <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#2B4570" }}></div>
          <span>Ocean Blue (#2B4570)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#4CAF50" }}></div>
          <span>Sustainability Green (#4CAF50)</span>
        </div>
      </div>
    </div>
  );
}
