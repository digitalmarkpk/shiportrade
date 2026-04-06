import { Metadata } from "next";
import { ThreePLCostComparator } from "@/components/tools/ThreePLCostComparator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  Warehouse,
  Truck,
  Package,
  HelpCircle,
  DollarSign,
  Building2,
  Scale,
  Award
} from "lucide-react";

export const metadata: Metadata = {
  title: "3PL Cost Comparator | Shiportrade.com",
  description: "Compare costs across multiple third-party logistics (3PL) providers. Analyze warehousing fees, pick and pack costs, shipping rates, and find the best fulfillment partner for your business.",
  keywords: ["3PL comparison", "fulfillment cost calculator", "third-party logistics", "warehousing costs", "pick and pack fees", "ecommerce fulfillment", "supply chain"],
};

const faqData = [
  {
    question: "What is a 3PL and why do I need one?",
    answer: "A Third-Party Logistics (3PL) provider handles fulfillment operations including warehousing, inventory management, pick and pack, and shipping. Businesses use 3PLs to reduce overhead, scale operations without capital investment, and leverage carrier discounts. For growing ecommerce businesses, 3PLs often become essential when order volume exceeds in-house capacity.",
  },
  {
    question: "How do I choose the right 3PL provider?",
    answer: "Consider order volume, product characteristics, shipping zones, integration requirements, and growth projections. Evaluate providers on: cost structure transparency, technology integration capabilities, fulfillment accuracy rates, shipping speed, customer support quality, and scalability. Start with a pilot program before full commitment.",
  },
  {
    question: "What are the hidden costs in 3PL pricing?",
    answer: "Watch for: minimum monthly fees, account management fees, inventory receiving charges, returns processing fees, kitting/assembly costs, storage overage fees, peak season surcharges, special handling fees for oversized items, and integration/maintenance costs. Always request a detailed rate card with all potential charges.",
  },
  {
    question: "When does it make sense to switch from in-house to 3PL?",
    answer: "Consider 3PL when: order volume exceeds 100-200/day, storage needs outgrow current space, shipping costs become uncompetitive, you need multi-location fulfillment, or operational complexity detracts from core business. The break-even point typically occurs when in-house cost per order exceeds 3PL cost plus management overhead.",
  },
  {
    question: "How accurate are the cost estimates?",
    answer: "This calculator provides estimates based on published rate structures. Actual costs vary based on negotiation, volume discounts, special requirements, and seasonal factors. Use these estimates as a baseline for initial screening, then request detailed quotes from shortlisted providers for accurate budgeting.",
  },
  {
    question: "What integration options do 3PLs typically offer?",
    answer: "Common integration types include: API (real-time, automated order flow), EDI (traditional B2B data exchange), Web Portal (manual order entry), and direct marketplace integrations (Amazon, Shopify, WooCommerce). API integration offers the most automation but may require development resources. Choose based on your technical capability and order volume.",
  },
];

export default function ThreePLComparisonPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Calculator className="h-3 w-3 mr-2" />
          E-Commerce Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          3PL Cost Comparator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Compare fulfillment costs across multiple 3PL providers. Analyze warehousing, pick and pack, 
          shipping rates, integration fees, and find the best partner for your ecommerce business.
        </p>
      </div>

      {/* Calculator */}
      <ThreePLCostComparator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--ocean)]" />
              Understanding 3PL Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong>Warehousing Fees:</strong> Charged per pallet position or cubic foot of storage 
              space used. Rates vary by location, with coastal and urban fulfillment centers typically 
              costing more than rural locations.
            </p>
            <p>
              <strong>Pick and Pack Fees:</strong> Per-order base fee plus per-item charges. Complex 
              orders with multiple SKUs or special packaging requirements may incur additional fees. 
              Some providers offer volume discounts.
            </p>
            <p>
              <strong>Shipping Costs:</strong> 3PLs negotiate carrier discounts that they may or may 
              not pass on to clients. Zone-based pricing means your customer distribution significantly 
              impacts total shipping costs.
            </p>
            <p>
              <strong>Integration Costs:</strong> One-time setup fees plus ongoing maintenance. API 
              integrations require development resources but offer the most automation. Portal-based 
              systems work for lower volumes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
              Key Selection Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Fulfillment Accuracy:</strong> Look for 99.5%+ accuracy rates. Each error costs $15-50 in customer service and reshipping.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Shipping Speed:</strong> Same-day or next-day shipping capabilities impact customer satisfaction and repeat purchase rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Network Coverage:</strong> Multiple fulfillment centers reduce shipping zones and delivery times to your customer base.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Technology Stack:</strong> Real-time inventory visibility, order tracking, and returns management integration.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Scalability:</strong> Can they handle peak seasons and growth without service degradation?</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Cost Components */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
            3PL Cost Components Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Warehouse className="h-4 w-4 text-[var(--ocean)]" />
                <span className="font-medium">Warehousing</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Storage fees based on pallet positions or cubic feet. Typically 10-20% of total 
                fulfillment costs. Peak season (Q4) may have higher rates.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Pick & Pack</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Per-order and per-item fees for order assembly. Usually 20-30% of costs. 
                Kitting, gift wrapping, and special handling add extra charges.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-[var(--warning)]" />
                <span className="font-medium">Shipping</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Carrier rates passed through with markup or discount. The largest cost component 
                at 40-60% of total. Zone distribution and package weight are key factors.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-[var(--purple)]" />
                <span className="font-medium">Integration & Setup</span>
              </div>
              <p className="text-sm text-muted-foreground">
                One-time onboarding, API integration, and monthly platform fees. Often overlooked 
                but can be $500-2000+ upfront plus $50-200/month ongoing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-[var(--ocean)]" />
            Pro Tips for 3PL Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Negotiate Everything</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Published rates are starting points. Volume commitments, contract length, and 
                competitive quotes are leverage for discounts of 10-30%.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Pilot First</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Never commit to a full transition without a pilot program. Test with 100-500 orders 
                to evaluate accuracy, speed, and communication quality.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Plan for Peak Season</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Q4 volume can be 3-5x normal. Ensure your 3PL has capacity guarantees and 
                understand peak season surcharges before committing.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Multi-Location Strategy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                If 40%+ of customers are 3+ zones away from a single fulfillment center, consider 
                a multi-location strategy to reduce shipping costs and delivery times.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-[var(--logistics)]" />
                <span className="font-medium">Returns Processing</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Understand returns handling costs and capabilities. Some 3PLs offer refurbishment, 
                others only basic restocking. Returns can be 5-30% of orders depending on category.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Exit Strategy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Include termination clauses and transition assistance in contracts. Getting your 
                inventory back and switching providers can take 30-90 days and cost thousands.
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
                <strong>Ignoring minimum monthly fees:</strong> If your order volume drops below 
                expectations, you may still owe the minimum. Negotiate grace periods or lower minimums.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Underestimating integration complexity:</strong> API integrations can take 
                weeks to months. Factor in development time and potential delays in your timeline.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Not considering total landed cost:</strong> Low storage fees might be offset 
                by higher shipping costs if the fulfillment center is far from your customer base.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Overlooking customer support quality:</strong> When issues arise, responsive 
                support is invaluable. Test support responsiveness during the pilot phase.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Forgetting about inventory receiving:</strong> Some 3PLs charge for receiving 
                shipments, especially if they require special handling or arrive outside business hours.
              </span>
            </li>
          </ul>
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
                This calculator provides estimates based on publicly available 3PL pricing information 
                and typical rate structures. Actual costs vary significantly based on negotiation, 
                volume discounts, special requirements, and provider-specific pricing models. 
                Provider ratings and features are based on publicly available information and may 
                not reflect current capabilities. Always request detailed quotes and conduct due 
                diligence before making business decisions. Shiportrade.com is not affiliated with 
                any 3PL provider listed in this tool.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
