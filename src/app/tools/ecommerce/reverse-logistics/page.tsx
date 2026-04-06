import { Metadata } from "next";
import { ReverseLogisticsCalculator } from "@/components/tools/ReverseLogisticsCalculator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  Target,
  BarChart3,
  HelpCircle,
  Lightbulb,
  Package,
  Percent,
  Recycle,
  Leaf,
  Truck,
  Factory,
  Zap,
  Gauge,
  ArrowDownCircle,
  ArrowUpCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Reverse Logistics Calculator | Shiportrade.com",
  description: "Calculate and optimize reverse logistics costs, recovery values, and environmental impact. Analyze processing costs, refurbishment, disposal, and net recovery for your e-commerce returns.",
  keywords: ["reverse logistics calculator", "return processing costs", "recovery value", "refurbishment costs", "disposal costs", "net recovery", "environmental impact", "return optimization", "circular economy"],
};

const faqData = [
  {
    question: "What is reverse logistics and why does it matter?",
    answer: "Reverse logistics is the process of moving goods from their final destination back to the manufacturer or distributor for returns, repair, refurbishment, recycling, or disposal. It matters because returns can cost 2-3x more than outbound shipping, and effective reverse logistics can recover significant value while reducing environmental impact.",
  },
  {
    question: "How do I calculate the true cost of processing returns?",
    answer: "The true cost includes return shipping, inspection, sorting, testing, repackaging, refurbishment, disposal, and administrative overhead. Our calculator helps you capture all these costs to understand the full impact. A typical return can cost $15-30 per unit when all factors are included.",
  },
  {
    question: "What is a good recovery rate for returned products?",
    answer: "Recovery rates vary by industry and product type. Electronics typically see 40-50% recovery, apparel 60-70%, and home goods 50-60%. A good target is to recover at least 50% of the original product value through refurbishment, resale, or alternative channels.",
  },
  {
    question: "How can I improve my reverse logistics efficiency?",
    answer: "Key strategies include: (1) Pre-authorize returns with condition requirements, (2) Implement tiered processing based on product value, (3) Partner with refurbishment specialists, (4) Use alternative disposition channels like liquidation or donation, (5) Reduce return rates through better product information.",
  },
  {
    question: "What is the environmental impact of returns?",
    answer: "Returns generate significant CO2 emissions through transportation, processing, and disposal. In the US alone, returns produce over 15 million metric tons of CO2 annually. Implementing recycling, refurbishment, and donation programs can divert waste from landfills and reduce carbon footprint by up to 70%.",
  },
  {
    question: "Should I refurbish or dispose of returned items?",
    answer: "The decision depends on product value, condition, and refurbishment cost. Generally, if refurbishment cost plus resale discount is less than the recovery value, refurbish. High-value items (> $50) almost always warrant refurbishment consideration, while low-value items may be better suited for recycling or donation.",
  },
];

const processingStages = [
  {
    stage: "Return Authorization",
    description: "Customer initiates return, RMA generated",
    costImpact: "Administrative time",
    optimization: "Automate RMA process with condition requirements",
  },
  {
    stage: "Inbound Transportation",
    description: "Product shipped back to warehouse",
    costImpact: "Shipping costs, packaging",
    optimization: "Consolidate returns, use discounted return labels",
  },
  {
    stage: "Inspection & Sorting",
    description: "Quality check and categorization",
    costImpact: "Labor, testing equipment",
    optimization: "Implement AI-powered image inspection",
  },
  {
    stage: "Disposition Decision",
    description: "Determine next steps for each item",
    costImpact: "Decision time, tracking systems",
    optimization: "Use rule-based automation for routing",
  },
  {
    stage: "Processing",
    description: "Refurbish, repackage, or dispose",
    costImpact: "Materials, labor, disposal fees",
    optimization: "Outsource to specialists, negotiate disposal rates",
  },
];

const recoveryChannels = [
  {
    channel: "Refurbishment & Resale",
    recoveryRate: "70-90%",
    bestFor: "High-value electronics, furniture",
    description: "Repair and resell through secondary channels",
  },
  {
    channel: "Liquidation",
    recoveryRate: "20-40%",
    bestFor: "Overstock, seasonal items",
    description: "Sell in bulk to liquidators at discounted rates",
  },
  {
    channel: "Donation",
    recoveryRate: "10-25%",
    bestFor: "Gently used items, tax benefits",
    description: "Donate to charities for tax deductions",
  },
  {
    channel: "Recycling",
    recoveryRate: "5-15%",
    bestFor: "Damaged items, electronics",
    description: "Recover materials through recycling programs",
  },
  {
    channel: "Landfill/Disposal",
    recoveryRate: "0%",
    bestFor: "Last resort only",
    description: "Environmental impact, disposal fees",
  },
];

export default function ReverseLogisticsCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Reverse Logistics Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Calculate and optimize the true cost of product returns. Analyze processing costs, 
          recovery values, refurbishment options, disposal methods, and environmental impact 
          to maximize value recovery and minimize waste.
        </p>
      </div>

      {/* Calculator */}
      <ReverseLogisticsCalculator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" style={{ color: "#0F4C81" }} />
              Understanding Reverse Logistics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Processing Costs:</strong> Every return goes through multiple stages - 
              inbound shipping, inspection, sorting, testing, and repackaging. These costs 
              can add up to $15-30 per unit, significantly impacting profitability.
            </p>
            <p>
              <strong>Recovery Value:</strong> Not all returns are losses. Through refurbishment, 
              resale, liquidation, and donation, businesses can recover 20-70% of product value 
              depending on condition and market demand.
            </p>
            <p>
              <strong>Environmental Impact:</strong> Returns contribute to carbon emissions 
              through transportation and disposal. Implementing sustainable disposition methods 
              can reduce CO2 emissions by up to 70% and divert waste from landfills.
            </p>
            <p>
              <strong>Optimization Opportunity:</strong> By understanding reverse flow costs and 
              recovery options, businesses can make informed decisions about return policies, 
              processing efficiency, and sustainable practices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" style={{ color: "#2E8B57" }} />
              Key Metrics to Track
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                <span>
                  <strong>Cost per Return:</strong> Total processing cost divided by return volume - 
                  target under $20 for efficiency.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                <span>
                  <strong>Recovery Rate:</strong> Percentage of original value recovered - 
                  aim for 50%+ through multiple channels.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                <span>
                  <strong>Net Recovery Value:</strong> Recovery value minus total costs - 
                  positive indicates efficient operations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                <span>
                  <strong>Recycling Rate:</strong> Percentage of returns diverted from landfill - 
                  target 60%+ for sustainability.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                <span>
                  <strong>Efficiency Score:</strong> Combined metric of recovery, environmental, 
                  and cost performance.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Processing Stages */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Factory className="h-5 w-5" style={{ color: "#0F4C81" }} />
            Reverse Logistics Processing Stages
          </CardTitle>
          <CardDescription>
            Understanding each stage helps identify optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Stage</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Cost Impact</th>
                  <th className="text-left py-3 px-4">Optimization Tip</th>
                </tr>
              </thead>
              <tbody>
                {processingStages.map((stage, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{stage.stage}</td>
                    <td className="py-3 px-4 text-muted-foreground">{stage.description}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{stage.costImpact}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{stage.optimization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Channels */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: "#2E8B57" }} />
            Recovery Channel Comparison
          </CardTitle>
          <CardDescription>
            Choose the right disposition channel based on product condition and value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {recoveryChannels.map((channel, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {channel.channel === "Refurbishment & Resale" ? (
                    <Factory className="h-4 w-4" style={{ color: "#2E8B57" }} />
                  ) : channel.channel === "Recycling" ? (
                    <Recycle className="h-4 w-4" style={{ color: "#14B8A6" }} />
                  ) : channel.channel === "Landfill/Disposal" ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <DollarSign className="h-4 w-4" style={{ color: "#0F4C81" }} />
                  )}
                  <span className="font-medium text-sm">{channel.channel}</span>
                </div>
                <div className="text-lg font-bold mb-1" style={{ color: channel.recoveryRate === "0%" ? "#EF4444" : "#2E8B57" }}>
                  {channel.recoveryRate}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{channel.description}</p>
                <div className="text-xs">
                  <span className="text-muted-foreground">Best for: </span>
                  <span>{channel.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Pro Tips for Reverse Logistics Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" style={{ color: "#2E8B57" }} />
                <span className="font-medium">Automate Triage</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Use AI-powered image recognition to automatically categorize returns 
                and route them to the appropriate processing stream.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4" style={{ color: "#2E8B57" }} />
                <span className="font-medium">Consolidate Returns</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Batch returns for processing to reduce per-unit handling costs. 
                Schedule pickups on specific days to optimize warehouse operations.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4" style={{ color: "#2E8B57" }} />
                <span className="font-medium">Value-Grade Processing</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Invest more in processing high-value items. Low-value items may 
                be better suited for streamlined donation or recycling.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Recycle className="h-4 w-4" style={{ color: "#2E8B57" }} />
                <span className="font-medium">Build Refurbishment Capacity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                In-house refurbishment capabilities can improve recovery rates by 
                20-30% compared to outsourcing to third parties.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-4 w-4" style={{ color: "#2E8B57" }} />
                <span className="font-medium">Track Environmental KPIs</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitor carbon footprint, waste diversion rate, and circular economy 
                metrics. Many customers prefer sustainable return practices.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" style={{ color: "#2E8B57" }} />
                <span className="font-medium">Negotiate Disposal Rates</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Partner with recyclers and liquidators for volume discounts. 
                A good partnership can reduce disposal costs by 30-50%.
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
                <strong>Underestimating processing costs:</strong> Many businesses only track 
                shipping costs, missing inspection, testing, and repackaging expenses that can 
                double the true cost per return.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Defaulting to disposal:</strong> Sending all unsellable items to landfill 
                wastes potential recovery value and increases environmental impact. Always evaluate 
                refurbishment, donation, and recycling options first.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Ignoring return reason data:</strong> Not analyzing why items are returned 
                means missing opportunities to reduce return rates through product improvements, 
                better descriptions, or quality control.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>One-size-fits-all processing:</strong> Processing all returns the same way 
                wastes resources. Low-value items should have streamlined processing while high-value 
                items warrant detailed inspection and refurbishment.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Not tracking environmental impact:</strong> Carbon footprint and waste metrics 
                are increasingly important for regulatory compliance and customer expectations. 
                Sustainable reverse logistics can be a competitive advantage.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5" style={{ color: "#0F4C81" }} />
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

      {/* Related Tools */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Related Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <a href="/tools/ecommerce/return-impact" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="h-4 w-4" style={{ color: "#0F4C81" }} />
                <span className="font-medium">Return Rate Impact</span>
              </div>
              <p className="text-sm text-muted-foreground">Calculate profit impact of returns</p>
            </a>
            <a href="/tools/ecommerce/fba-calculator" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4" style={{ color: "#0F4C81" }} />
                <span className="font-medium">FBA Calculator</span>
              </div>
              <p className="text-sm text-muted-foreground">Amazon FBA revenue calculator</p>
            </a>
            <a href="/tools/sustainability/carbon-footprint" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-4 w-4" style={{ color: "#0F4C81" }} />
                <span className="font-medium">Carbon Footprint</span>
              </div>
              <p className="text-sm text-muted-foreground">Calculate shipping emissions</p>
            </a>
            <a href="/tools/warehousing/cost-calculator" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4" style={{ color: "#0F4C81" }} />
                <span className="font-medium">Warehouse Costs</span>
              </div>
              <p className="text-sm text-muted-foreground">Warehousing cost calculator</p>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Important Note</p>
              <p>
                This calculator provides estimates based on the inputs provided and industry averages. 
                Actual reverse logistics costs and recovery values may vary based on your specific 
                business model, product categories, return conditions, and local disposal regulations. 
                Environmental impact estimates are based on typical values and may not reflect your 
                specific supply chain. We recommend validating these calculations with your actual 
                operational data and consulting with reverse logistics specialists for detailed analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
