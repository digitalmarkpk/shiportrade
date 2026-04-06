import { Metadata } from "next";
import { LogisticsBenchmarkingTool } from "@/components/tools/LogisticsBenchmarkingTool";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  Truck,
  Warehouse,
  Globe,
  HelpCircle,
  DollarSign,
  Building2,
  Target,
  Award,
  LineChart,
  Zap,
  Shield
} from "lucide-react";

export const metadata: Metadata = {
  title: "Logistics Cost Benchmarking Tool | Shiportrade.com",
  description: "Compare logistics costs across providers, benchmark against industry standards, track KPIs, and get data-driven improvement recommendations for your supply chain.",
  keywords: ["logistics benchmarking", "cost comparison", "supply chain KPIs", "freight benchmarking", "logistics costs", "transportation analytics", "warehousing costs"],
};

const faqData = [
  {
    question: "What is logistics cost benchmarking?",
    answer: "Logistics cost benchmarking is the process of comparing your supply chain costs and performance metrics against industry standards, competitors, and best-in-class operations. It helps identify cost reduction opportunities, performance gaps, and areas for operational improvement across transportation, warehousing, handling, and related logistics functions.",
  },
  {
    question: "How often should I benchmark my logistics costs?",
    answer: "Best practice is to conduct comprehensive benchmarking annually, with quarterly reviews of key metrics. However, in volatile market conditions or during significant operational changes, more frequent benchmarking (monthly or bi-monthly) is recommended to identify trends and respond quickly to cost pressures.",
  },
  {
    question: "What are the most important logistics KPIs to track?",
    answer: "Key logistics KPIs include: Cost per TEU/shipment, On-Time Delivery (OTD) rate, Damage/Freight Claims rate, Transit Time, Inventory Turnover, Fill Rate, Order Accuracy, Warehouse Utilization, and Transportation Cost as % of Revenue. The specific KPIs depend on your industry and business model.",
  },
  {
    question: "How do I interpret benchmark data?",
    answer: "Compare your metrics against three benchmarks: Industry Average (typical performance), Best-in-Class (top 10% performers), and your historical performance. Focus on gaps larger than 10-15% from industry average, as these represent significant improvement opportunities. Consider contextual factors like volume, geography, and service requirements.",
  },
  {
    question: "What factors cause regional cost differences?",
    answer: "Regional logistics costs vary due to: Labor costs and availability, Infrastructure quality (ports, roads, rail), Fuel prices and taxes, Real estate/warehousing costs, Regulatory compliance burden, Distance from major trade lanes, Seasonal demand patterns, and Currency fluctuations. Understanding these factors helps in network optimization decisions.",
  },
  {
    question: "How can I use improvement recommendations effectively?",
    answer: "Prioritize recommendations by impact vs. effort matrix: Quick Wins (high impact, low effort) should be implemented first for immediate ROI. Medium-term initiatives (3-6 months) require planning and resources. Long-term strategic changes (6-12+ months) need executive sponsorship and budget allocation. Track implementation progress and measure actual savings against projections.",
  },
];

const benchmarkMetrics = [
  {
    category: "Transportation",
    icon: Truck,
    metrics: ["Cost per TEU", "Cost per kg", "Freight spend as % of COGS", "Accessorial charges %"],
    benchmark: "$2,500/TEU avg",
  },
  {
    category: "Warehousing",
    icon: Warehouse,
    metrics: ["Cost per pallet position", "Cost per order picked", "Storage utilization %", "Labor productivity"],
    benchmark: "$320/pallet/month",
  },
  {
    category: "Performance",
    icon: Target,
    metrics: ["On-Time Delivery %", "Perfect Order %", "Damage Rate %", "Inventory Accuracy %"],
    benchmark: "90% OTD standard",
  },
  {
    category: "Efficiency",
    icon: Zap,
    metrics: ["Orders per labor hour", "Vehicle utilization %", "Inventory turnover", "Order cycle time"],
    benchmark: "Varies by industry",
  },
];

export default function LogisticsBenchmarkingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <BarChart3 className="h-3 w-3 mr-2" />
          Benchmarking Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Logistics Cost Benchmarking Tool
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Compare your logistics costs against industry benchmarks, analyze provider performance, 
          track KPIs, and get actionable recommendations to optimize your supply chain operations.
        </p>
      </div>

      {/* Tool */}
      <LogisticsBenchmarkingTool />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" style={{ color: "#2B4570" }} />
              Understanding Logistics Benchmarking
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Cost Benchmarking:</strong> Comparing your logistics costs (transportation, 
              warehousing, handling) against industry averages and best-in-class performers. This 
              helps identify cost reduction opportunities and validates your competitive position.
            </p>
            <p>
              <strong>Performance Benchmarking:</strong> Measuring operational KPIs like On-Time 
              Delivery, damage rates, and transit times against industry standards. Performance 
              gaps often correlate with cost inefficiencies.
            </p>
            <p>
              <strong>Provider Benchmarking:</strong> Evaluating logistics service providers on 
              cost, service quality, reliability, and sustainability. This supports procurement 
              decisions and contract negotiations.
            </p>
            <p>
              <strong>Regional Benchmarking:</strong> Understanding geographic cost variations 
              helps optimize network design and identify opportunities for nearshoring or 
              distribution center relocation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: "#4CAF50" }} />
              Benefits of Regular Benchmarking
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#4CAF50" }} />
                <span><strong>Identify Cost Savings:</strong> Typical companies find 10-25% cost reduction opportunities through systematic benchmarking.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#4CAF50" }} />
                <span><strong>Validate Pricing:</strong> Ensure you're paying competitive rates for logistics services and not overpaying.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#4CAF50" }} />
                <span><strong>Set Realistic Targets:</strong> Data-driven goals based on industry performance rather than arbitrary targets.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#4CAF50" }} />
                <span><strong>Support Negotiations:</strong> Leverage benchmark data in carrier and 3PL contract negotiations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#4CAF50" }} />
                <span><strong>Track Improvement:</strong> Monitor progress over time and demonstrate ROI of logistics initiatives.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Benchmark Metrics Grid */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" style={{ color: "#2B4570" }} />
            Key Benchmark Categories
          </CardTitle>
          <CardDescription>
            Essential metrics for comprehensive logistics benchmarking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benchmarkMetrics.map((category) => (
              <div key={category.category} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <category.icon className="h-5 w-5" style={{ color: "#2B4570" }} />
                  <span className="font-medium">{category.category}</span>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {category.metrics.map((metric) => (
                    <li key={metric} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#4CAF50" }} />
                      {metric}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t text-xs">
                  <span className="text-muted-foreground">Industry Benchmark: </span>
                  <span className="font-medium">{category.benchmark}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Provider Evaluation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" style={{ color: "#2B4570" }} />
            Evaluating Logistics Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" style={{ color: "#4CAF50" }} />
                Cost Factors
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Base transportation rates</li>
                <li>• Warehousing and storage fees</li>
                <li>• Handling and terminal charges</li>
                <li>• Documentation and admin costs</li>
                <li>• Insurance premiums</li>
                <li>• Customs clearance fees</li>
                <li>• Accessorial and surcharges</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" style={{ color: "#4CAF50" }} />
                Service Quality
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• On-time delivery performance</li>
                <li>• Damage and claims rate</li>
                <li>• Transit time reliability</li>
                <li>• Shipment tracking accuracy</li>
                <li>• Customer service responsiveness</li>
                <li>• Problem resolution speed</li>
                <li>• Communication quality</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" style={{ color: "#4CAF50" }} />
                Strategic Factors
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Network coverage and reach</li>
                <li>• Capacity and scalability</li>
                <li>• Technology and integration</li>
                <li>• Sustainability credentials</li>
                <li>• Financial stability</li>
                <li>• Industry expertise</li>
                <li>• Innovation and value-adds</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" style={{ color: "#2B4570" }} />
            Pro Tips for Effective Benchmarking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="h-4 w-4" style={{ color: "#4CAF50" }} />
                <span className="font-medium">Compare Apples to Apples</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Normalize data for volume, distance, service level, and product type before 
                comparing. Different contexts can skew benchmark results significantly.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4" style={{ color: "#4CAF50" }} />
                <span className="font-medium">Consider Regional Context</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Labor costs, infrastructure, and regulations vary significantly by region. 
                A global benchmark should be adjusted for local market conditions.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4" style={{ color: "#4CAF50" }} />
                <span className="font-medium">Track Trends Over Time</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Single-point benchmarking provides limited insight. Track metrics quarterly 
                to identify trends, seasonal patterns, and improvement trajectories.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" style={{ color: "#4CAF50" }} />
                <span className="font-medium">Set Actionable Targets</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Translate benchmark gaps into specific improvement targets with timelines 
                and accountability. Gaps without action plans rarely get addressed.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4" style={{ color: "#4CAF50" }} />
                <span className="font-medium">Validate Data Quality</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Ensure benchmark data comes from reliable sources with similar business 
                characteristics. Poor data quality leads to flawed conclusions.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" style={{ color: "#4CAF50" }} />
                <span className="font-medium">Prioritize High-Impact Areas</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Focus benchmarking efforts on cost categories with the largest spend 
                or greatest improvement potential for maximum ROI.
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
            Common Benchmarking Pitfalls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Using outdated benchmarks:</strong> Market conditions change rapidly. 
                Ensure benchmark data is current, ideally from the past 12 months, especially 
                for volatile cost categories like fuel-sensitive transportation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Ignoring service level differences:</strong> Lower costs may reflect 
                lower service levels. Always consider quality and reliability alongside cost 
                when making comparisons.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Over-relying on averages:</strong> Industry averages include both 
                high and low performers. Target best-in-class metrics rather than just 
                beating the average.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Not accounting for hidden costs:</strong> Some providers quote low 
                base rates but add significant accessorials and surcharges. Always calculate 
                total landed cost for fair comparison.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Benchmarking without action:</strong> Collecting data without 
                implementing improvements wastes resources. Tie benchmarking to specific 
                initiatives with clear ownership and timelines.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5" style={{ color: "#2B4570" }} />
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
                This benchmarking tool provides estimates based on industry averages and publicly 
                available data. Actual costs and performance metrics vary significantly based on 
                specific business characteristics, volumes, routes, service requirements, and 
                market conditions. The provider data shown is representative and should be validated 
                with actual quotes and references. Always conduct due diligence and seek professional 
                advice for strategic logistics decisions. Shiportrade.com is not affiliated with 
                any logistics provider listed in this tool.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
