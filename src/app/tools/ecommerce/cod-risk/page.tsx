import { Metadata } from "next";
import { CODRiskEstimator } from "@/components/tools/CODRiskEstimator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Info,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Target,
  DollarSign,
  BarChart3,
  Shield,
  MapPin,
  User,
  Package,
  Lightbulb,
} from "lucide-react";

export const metadata: Metadata = {
  title: "COD Risk Estimator | Shiportrade.com",
  description:
    "Estimate Cash on Delivery (COD) risk for your e-commerce orders. Analyze rejection rates, fraud probability, return risk, and get mitigation recommendations for smarter COD decisions.",
  keywords: [
    "COD risk estimator",
    "cash on delivery risk",
    "COD rejection rate",
    "COD fraud detection",
    "e-commerce risk management",
    "delivery failure cost",
    "COD mitigation",
    "payment risk assessment",
    "order risk analysis",
    "e-commerce fraud prevention",
  ],
};

export default function CODRiskEstimatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          COD Risk Estimator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Assess the risk of Cash on Delivery orders with comprehensive analysis of rejection
          probability, fraud risk, return rates, and failed delivery costs. Make informed
          decisions about COD eligibility and protect your e-commerce business.
        </p>
      </div>

      {/* Calculator */}
      <CODRiskEstimator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[#0F4C81]" />
              What is COD Risk?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Cash on Delivery (COD)</strong> is a payment method where customers pay for
              their order upon delivery. While popular in many markets, COD carries inherent risks
              that can significantly impact e-commerce profitability.
            </p>
            <p>
              COD risk encompasses several factors: <strong>rejection risk</strong> (customer
              refuses delivery), <strong>fraud risk</strong> (fake orders or identity theft), and
              <strong>return risk</strong> (product returned after acceptance). Understanding these
              risks helps merchants make smarter decisions about which orders to accept as COD.
            </p>
            <div className="bg-muted/50 p-3 rounded-lg mt-4">
              <p className="font-mono text-center text-xs">
                Total COD Risk = Rejection + Fraud + Return + Operational Costs
              </p>
            </div>
            <p>
              Industry data shows COD rejection rates range from 5% in developed markets to over
              25% in emerging markets. Each failed delivery can cost 20-30% of the order value in
              logistics and handling expenses.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-[#2E8B57]" />
              Why Risk Assessment Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Every COD order represents a <strong>risk-reward tradeoff</strong>. While COD can
              increase conversion rates by 20-50%, each failed delivery erodes profit margins and
              operational efficiency.
            </p>
            <div className="bg-muted/50 p-3 rounded-lg mt-4">
              <p className="font-mono text-center text-xs">Failed Delivery Cost = Return Shipping + Handling + Restocking + Opportunity</p>
            </div>
            <ul className="space-y-2 mt-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span>
                  <strong>Reduce losses</strong> - Identify high-risk orders before dispatch
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span>
                  <strong>Optimize logistics</strong> - Route resources to orders more likely to succeed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Protect margins</strong> - Prevent failed delivery costs from eating into profits
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Improve customer experience</strong> - Offer COD to reliable customers
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
            Key COD Risk Factors
          </CardTitle>
          <CardDescription>The factors that influence your COD risk score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-[#0F4C81]" />
                <span className="font-medium">Region Risk</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Geographic location significantly impacts rejection rates. South Asia and Africa
                have the highest COD rejection rates, while Western Europe and Oceania have the
                lowest. Consider regional patterns when accepting COD orders.
              </p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-[#2E8B57]" />
                <span className="font-medium">Customer History</span>
              </div>
              <p className="text-xs text-muted-foreground">
                New customers carry higher risk than established ones. Previous COD success/failure
                ratio is a strong predictor. Verification status (address, phone, email) reduces
                risk significantly. Reward loyal customers with COD privileges.
              </p>
            </div>
            <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-teal-500" />
                <span className="font-medium">Product Category</span>
              </div>
              <p className="text-xs text-muted-foreground">
                High-value items like electronics and jewelry have elevated fraud risk. Fashion has
                high return rates. Groceries and books have the lowest risk. Adjust COD eligibility
                by product category risk profile.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Order Value</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Higher order values correlate with increased rejection and fraud risk. Consider
                pre-payment or partial advance for orders above your risk threshold. Set maximum
                COD limits based on your risk tolerance.
              </p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Discount Level</span>
              </div>
              <p className="text-xs text-muted-foreground">
                High discount orders often indicate deal-seeking behavior with higher cancellation
                rates. Orders with discounts above 25% show measurably higher rejection rates.
                Consider requiring pre-payment for heavily discounted orders.
              </p>
            </div>
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-800">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-rose-500" />
                <span className="font-medium">Verification Status</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Verified customers have significantly lower rejection and fraud rates. Phone
                verification via OTP is most effective. Address and email verification add
                additional layers of confidence. Require verification for higher-risk orders.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mitigation Strategies */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#2E8B57]" />
            COD Risk Mitigation Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span>
                  <strong>Implement verification</strong> - Require phone OTP verification for all COD
                  orders above a threshold value. Address verification reduces failed deliveries by
                  up to 40%.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span>
                  <strong>Set order limits</strong> - Establish maximum COD order values by customer
                  segment. New customers should have lower limits than established ones.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span>
                  <strong>Confirmation calls</strong> - Call customers before dispatch for high-value
                  or high-risk orders. This simple step can reduce rejections by 20-30%.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span>
                  <strong>Partial advance</strong> - Request partial payment (10-30%) upfront for
                  high-value orders. This filters out non-serious buyers.
                </span>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span>
                  <strong>Dynamic COD eligibility</strong> - Use risk scores to automatically enable
                  or disable COD at checkout. Offer alternative payment methods for high-risk orders.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span>
                  <strong>Track customer history</strong> - Maintain COD success/failure history per
                  customer. Disable COD for customers with multiple previous failures.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span>
                  <strong>Delivery confirmation fee</strong> - Charge a small confirmation fee for
                  high-risk regions. This offsets failed delivery costs and filters unserious orders.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span>
                  <strong>Incentivize pre-payment</strong> - Offer discounts for prepaid orders to
                  shift customers away from COD while maintaining conversion rates.
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-semibold mb-3">Common COD Management Mistakes</p>
              <ul className="space-y-2">
                <li>
                  <strong>One-size-fits-all policy:</strong> Applying the same COD rules to all
                  customers ignores risk variations. New customers, high-value orders, and
                  high-risk regions require different treatment.
                </li>
                <li>
                  <strong>Ignoring regional differences:</strong> COD behavior varies dramatically
                  by geography. What works in North America may not work in South Asia. Adapt
                  policies to regional risk profiles.
                </li>
                <li>
                  <strong>No customer-level tracking:</strong> Failing to track individual COD
                  history means you miss patterns. Customers with multiple failures should have
                  COD disabled or restricted.
                </li>
                <li>
                  <strong>Underestimating costs:</strong> Failed delivery costs go beyond return
                  shipping. Include handling, restocking, packaging, and opportunity costs in
                  your calculations.
                </li>
                <li>
                  <strong>Not incentivizing pre-payment:</strong> Many customers prefer COD due to
                  trust issues. Offer discounts for prepaid orders and build trust to shift
                  behavior over time.
                </li>
                <li>
                  <strong>Skipping verification:</strong> The cost of verification is far lower than
                  the cost of failed deliveries. Always verify for high-value or high-risk orders.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-[#0F4C81]" />
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What is a good COD risk score?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A risk score below 25 is considered low risk, indicating the order is safe for COD.
              Scores between 25-50 are moderate risk, where verification is recommended. Above 50
              is high risk, and alternative payment methods should be considered. Above 75 is very
              high risk, where COD should typically be declined.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How is rejection probability calculated?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Rejection probability combines regional base rejection rates, product category risk
              multipliers, customer history factors, and verification status. Regional data comes
              from industry averages, while customer factors adjust based on individual history and
              verification status.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What costs are included in failed delivery?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Failed delivery costs include: return shipping (typically 15% of order value),
              handling fees (3%), restocking costs (2%), packaging materials (1%), and opportunity
              cost of lost sale (5%). Total costs can reach 25-30% of order value per failed
              delivery.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Should I disable COD for high-risk orders?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Not necessarily. Instead of disabling COD completely, consider mitigation strategies:
              require verification, request partial advance payment, make confirmation calls, or
              charge a delivery confirmation fee. The goal is to reduce risk while maintaining
              conversion for customers who prefer COD.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How often should I recalculate risk thresholds?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Review COD risk thresholds quarterly or when significant changes occur in your
              business (new markets, product categories, or logistics partners). Monitor rejection
              rates and adjust thresholds based on actual performance data from your operations.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How does verification reduce risk?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Verification reduces risk by confirming customer identity and intent. Phone OTP
              verification typically reduces rejection rates by 30-40%. Address verification
              ensures deliverability. Email verification provides a communication channel. Combined
              verification can cut fraud risk by over 50%.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="mt-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Important Note</p>
              <p>
                This COD Risk Estimator provides estimates based on industry averages and standard
                risk models. Actual rejection rates and fraud risk vary based on your specific
                market, product mix, customer base, and operational factors. Use this tool as a
                starting point and adjust thresholds based on your actual performance data. For
                high-volume operations, consider implementing machine learning models trained on
                your historical order data for more accurate predictions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
