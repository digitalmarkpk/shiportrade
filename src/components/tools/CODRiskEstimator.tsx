"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Package,
  TrendingUp,
  AlertCircle,
  Info,
  ArrowRight,
  DollarSign,
  BarChart3,
  Clock,
  MapPin,
  User,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Lightbulb,
  Ban,
  CreditCard,
  Truck,
  RotateCcw,
  Target,
  Percent,
  Download,
  Share2,
  BookOpen,
  HelpCircle,
  Zap,
  AlertOctagon,
  Copy,
  Check,
  Phone,
  Smartphone,
  Calendar,
  Warehouse,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants/chartColors";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Region risk data
const regionRiskData = {
  "North America": { baseRisk: 0.08, rejectionRate: 0.05, fraudRate: 0.02, returnRate: 0.08 },
  "Western Europe": { baseRisk: 0.06, rejectionRate: 0.04, fraudRate: 0.015, returnRate: 0.07 },
  "Eastern Europe": { baseRisk: 0.15, rejectionRate: 0.12, fraudRate: 0.05, returnRate: 0.15 },
  "Middle East": { baseRisk: 0.12, rejectionRate: 0.10, fraudRate: 0.04, returnRate: 0.12 },
  "South Asia": { baseRisk: 0.25, rejectionRate: 0.20, fraudRate: 0.08, returnRate: 0.22 },
  "Southeast Asia": { baseRisk: 0.18, rejectionRate: 0.15, fraudRate: 0.06, returnRate: 0.18 },
  "East Asia": { baseRisk: 0.10, rejectionRate: 0.07, fraudRate: 0.03, returnRate: 0.10 },
  "Latin America": { baseRisk: 0.20, rejectionRate: 0.18, fraudRate: 0.07, returnRate: 0.20 },
  "Africa": { baseRisk: 0.28, rejectionRate: 0.25, fraudRate: 0.10, returnRate: 0.25 },
  "Oceania": { baseRisk: 0.07, rejectionRate: 0.05, fraudRate: 0.02, returnRate: 0.06 },
};

// Product category risk factors
const categoryRiskData = {
  "Electronics": { riskMultiplier: 1.5, returnRate: 0.15, fraudRate: 0.06 },
  "Fashion & Apparel": { riskMultiplier: 1.2, returnRate: 0.20, fraudRate: 0.03 },
  "Home & Garden": { riskMultiplier: 1.0, returnRate: 0.10, fraudRate: 0.02 },
  "Health & Beauty": { riskMultiplier: 1.3, returnRate: 0.12, fraudRate: 0.04 },
  "Sports & Outdoors": { riskMultiplier: 1.1, returnRate: 0.10, fraudRate: 0.02 },
  "Toys & Games": { riskMultiplier: 1.2, returnRate: 0.08, fraudRate: 0.03 },
  "Books & Media": { riskMultiplier: 0.8, returnRate: 0.05, fraudRate: 0.01 },
  "Automotive": { riskMultiplier: 1.4, returnRate: 0.12, fraudRate: 0.04 },
  "Jewelry & Watches": { riskMultiplier: 2.0, returnRate: 0.08, fraudRate: 0.10 },
  "Groceries": { riskMultiplier: 0.7, returnRate: 0.03, fraudRate: 0.01 },
};

// COD fee structures by region
const codFeeStructure = {
  "North America": { percentage: 0.02, minimum: 5, currency: "USD" },
  "Western Europe": { percentage: 0.025, minimum: 4, currency: "EUR" },
  "Eastern Europe": { percentage: 0.03, minimum: 3, currency: "EUR" },
  "Middle East": { percentage: 0.025, minimum: 10, currency: "AED" },
  "South Asia": { percentage: 0.02, minimum: 50, currency: "INR" },
  "Southeast Asia": { percentage: 0.025, minimum: 5000, currency: "IDR" },
  "East Asia": { percentage: 0.02, minimum: 200, currency: "JPY" },
  "Latin America": { percentage: 0.03, minimum: 10, currency: "BRL" },
  "Africa": { percentage: 0.035, minimum: 50, currency: "ZAR" },
  "Oceania": { percentage: 0.02, minimum: 5, currency: "AUD" },
};

// Failed delivery cost components
const failedDeliveryCosts = {
  returnShipping: 0.15,
  handling: 0.03,
  restocking: 0.02,
  packaging: 0.01,
  opportunity: 0.05,
};

type Region = keyof typeof regionRiskData;
type Category = keyof typeof categoryRiskData;

interface CODRiskInputs {
  orderValue: number;
  currency: string;
  region: Region;
  category: Category;
  isNewCustomer: boolean;
  customerOrders: number;
  previousCODSuccess: number;
  previousCODFailures: number;
  orderVelocity: number;
  addressVerification: boolean;
  phoneNumberVerified: boolean;
  emailVerified: boolean;
  discountPercentage: number;
  isHighValue: boolean;
}

interface CODRiskResults {
  overallRiskScore: number;
  riskLevel: "low" | "medium" | "high" | "very-high";
  rejectionProbability: number;
  fraudProbability: number;
  returnProbability: number;
  codFee: number;
  codFeePercentage: number;
  expectedFailedDeliveryCost: number;
  totalCODCost: number;
  netRiskExposure: number;
  customerRiskScore: number;
  regionRiskScore: number;
  productRiskScore: number;
  recommendations: string[];
  riskFactors: { factor: string; impact: number; positive: boolean }[];
}

// Calculate customer risk score (0-100)
function calculateCustomerRiskScore(inputs: CODRiskInputs): number {
  let score = 50;
  if (inputs.isNewCustomer) {
    score += 20;
  } else {
    score -= Math.min(inputs.customerOrders * 2, 20);
  }
  const totalCOD = inputs.previousCODSuccess + inputs.previousCODFailures;
  if (totalCOD > 0) {
    const successRate = inputs.previousCODSuccess / totalCOD;
    score -= successRate * 25;
    score += (1 - successRate) * 25;
  }
  if (inputs.orderVelocity > 10) {
    score += 10;
  } else if (inputs.orderVelocity >= 1 && inputs.orderVelocity <= 5) {
    score -= 5;
  }
  if (inputs.addressVerification) score -= 5;
  if (inputs.phoneNumberVerified) score -= 5;
  if (inputs.emailVerified) score -= 3;
  if (inputs.discountPercentage > 30) score += 10;
  else if (inputs.discountPercentage > 20) score += 5;
  return Math.max(0, Math.min(100, score));
}

// Calculate overall risk results
function calculateCODRisk(inputs: CODRiskInputs): CODRiskResults {
  const regionRisk = regionRiskData[inputs.region];
  const categoryRisk = categoryRiskData[inputs.category];
  const codFee = codFeeStructure[inputs.region];

  const customerRiskScore = calculateCustomerRiskScore(inputs);
  const regionRiskScore = regionRisk.baseRisk * 100;
  const productRiskScore = categoryRisk.riskMultiplier * 25;

  const overallRiskScore = (
    customerRiskScore * 0.4 +
    regionRiskScore * 0.35 +
    productRiskScore * 0.25
  );

  let rejectionProbability = regionRisk.rejectionRate;
  let fraudProbability = regionRisk.fraudRate;
  let returnProbability = regionRisk.returnRate;

  rejectionProbability *= categoryRisk.riskMultiplier;
  fraudProbability *= categoryRisk.fraudRate / 0.03;
  returnProbability = (returnProbability + categoryRisk.returnRate) / 2;

  if (inputs.isNewCustomer) {
    rejectionProbability *= 1.5;
    fraudProbability *= 1.8;
  }

  if (inputs.previousCODFailures > 0) {
    const failureRate = inputs.previousCODFailures / (inputs.previousCODSuccess + inputs.previousCODFailures + 1);
    rejectionProbability *= (1 + failureRate * 2);
  }

  if (inputs.addressVerification && inputs.phoneNumberVerified) {
    rejectionProbability *= 0.7;
    fraudProbability *= 0.6;
  }

  if (inputs.isHighValue) {
    rejectionProbability *= 1.3;
    fraudProbability *= 1.5;
  }

  rejectionProbability = Math.min(rejectionProbability, 0.95);
  fraudProbability = Math.min(fraudProbability, 0.95);
  returnProbability = Math.min(returnProbability, 0.95);

  const codFeeAmount = Math.max(
    inputs.orderValue * codFee.percentage,
    codFee.minimum
  );

  const failedDeliveryCost = Object.values(failedDeliveryCosts).reduce(
    (sum, rate) => sum + inputs.orderValue * rate,
    0
  );

  const expectedFailedDeliveryCost = failedDeliveryCost * rejectionProbability;
  const totalCODCost = codFeeAmount + expectedFailedDeliveryCost;
  const netRiskExposure = inputs.orderValue * (rejectionProbability + fraudProbability * 0.5);

  let riskLevel: "low" | "medium" | "high" | "very-high";
  if (overallRiskScore < 25) riskLevel = "low";
  else if (overallRiskScore < 50) riskLevel = "medium";
  else if (overallRiskScore < 75) riskLevel = "high";
  else riskLevel = "very-high";

  const recommendations: string[] = [];

  if (overallRiskScore >= 50) {
    if (inputs.isNewCustomer) {
      recommendations.push("Consider pre-payment or partial advance for new customers with high order values");
    }
    if (!inputs.addressVerification) {
      recommendations.push("Require address verification before processing COD order");
    }
    if (!inputs.phoneNumberVerified) {
      recommendations.push("Verify customer phone number via OTP before dispatch");
    }
    if (inputs.discountPercentage > 25) {
      recommendations.push("High discount orders have higher rejection rates - consider reducing COD eligibility");
    }
    if (inputs.orderValue > 500) {
      recommendations.push("For high-value orders, consider alternative payment methods or confirmation call");
    }
  }

  if (rejectionProbability > 0.15) {
    recommendations.push("High rejection region - consider adding delivery confirmation fee");
  }

  if (inputs.previousCODFailures > 2) {
    recommendations.push("Customer has multiple previous COD failures - disable COD option");
  }

  if (inputs.orderVelocity > 10) {
    recommendations.push("Unusual order frequency detected - flag for manual review");
  }

  if (recommendations.length === 0) {
    recommendations.push("Order qualifies for COD - proceed with standard procedures");
  }

  const riskFactors = [
    { factor: "Customer History", impact: customerRiskScore, positive: customerRiskScore < 40 },
    { factor: "Region Risk", impact: regionRiskScore, positive: regionRiskScore < 20 },
    { factor: "Product Category", impact: productRiskScore, positive: productRiskScore < 30 },
    { factor: "Verification Status", impact: inputs.addressVerification && inputs.phoneNumberVerified ? 10 : 40, positive: inputs.addressVerification && inputs.phoneNumberVerified },
    { factor: "Order Value Impact", impact: inputs.isHighValue ? 35 : 15, positive: !inputs.isHighValue },
  ];

  return {
    overallRiskScore,
    riskLevel,
    rejectionProbability,
    fraudProbability,
    returnProbability,
    codFee: codFeeAmount,
    codFeePercentage: codFee.percentage * 100,
    expectedFailedDeliveryCost,
    totalCODCost,
    netRiskExposure,
    customerRiskScore,
    regionRiskScore,
    productRiskScore,
    recommendations,
    riskFactors,
  };
}

// Pro Tips Data
const proTips = [
  {
    title: "Implement Order Confirmation Calls",
    description: "For orders above your risk threshold, make a confirmation call before dispatch. This simple step can reduce failed deliveries by 30-40%. Ask the customer to confirm their availability and payment readiness.",
    icon: Phone,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Use Partial COD for High-Value Orders",
    description: "Collect 20-30% advance payment online for orders exceeding your risk threshold. This demonstrates customer commitment and significantly reduces the likelihood of rejection. It's especially effective for electronics and luxury items.",
    icon: Percent,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Build Customer Risk Profiles",
    description: "Track COD success/failure history for each customer. Create a scoring system that automatically adjusts COD eligibility based on past behavior. Customers with 3+ failed attempts should be moved to prepaid-only status.",
    icon: User,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "Optimize Delivery Time Slots",
    description: "Offer flexible delivery windows and send reminders 24 hours and 2 hours before delivery. Customers who select their preferred time slots are 50% more likely to accept deliveries. Use SMS or WhatsApp for higher engagement.",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    title: "Implement Dynamic COD Limits",
    description: "Set maximum COD order values based on region, customer history, and product category. High-risk regions should have lower COD limits. Use this calculator to determine appropriate thresholds for your business.",
    icon: Target,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    title: "Leverage Digital Payment at Doorstep",
    description: "Equip delivery agents with QR codes and mobile POS devices. Digital payment collection reduces cash handling risks, speeds up transactions, and provides instant payment verification. It's especially valuable in markets with high mobile wallet adoption.",
    icon: Smartphone,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
  },
];

// Common Mistakes Data
const commonMistakes = [
  {
    title: "Offering COD to All Customers Equally",
    description: "Treating new customers the same as loyal repeat customers is a major mistake. New customers have significantly higher rejection rates. Implement tiered COD eligibility based on customer history, order value, and regional risk factors to minimize losses.",
    icon: Users,
    severity: "high",
  },
  {
    title: "Ignoring Regional Risk Variations",
    description: "COD rejection rates vary dramatically by region - sometimes by 300-400%. A one-size-fits-all approach ignores these critical differences. Analyze your delivery data by region and adjust COD policies accordingly. Some regions may require mandatory verification calls or partial advance payments.",
    icon: MapPin,
    severity: "high",
  },
  {
    title: "No Follow-up After Failed Delivery",
    description: "When a COD delivery fails, many merchants simply return the product without follow-up. This misses an opportunity to convert the sale or prevent future issues. Contact the customer to understand why, offer alternative payment options, or reschedule delivery with confirmation.",
    icon: RotateCcw,
    severity: "medium",
  },
  {
    title: "Accepting High Discounts with COD",
    description: "Heavy discounts attract price-sensitive customers who are more likely to refuse delivery. Studies show orders with 30%+ discounts have 2x higher rejection rates. Consider requiring prepaid payment for heavily discounted items or capping discounts for COD orders.",
    icon: AlertOctagon,
    severity: "medium",
  },
  {
    title: "Neglecting Verification Steps",
    description: "Skipping address and phone verification to speed up order processing is costly. Unverified orders have significantly higher failure rates. Implement OTP verification for phone numbers and use address validation APIs to catch fake or incomplete addresses before dispatch.",
    icon: Shield,
    severity: "high",
  },
];

// FAQ Data (150+ words each)
const faqData = [
  {
    question: "What is Cash on Delivery (COD) risk and why should e-commerce businesses measure it?",
    answer: `Cash on Delivery risk refers to the financial exposure e-commerce businesses face when offering payment-at-delivery options. Unlike prepaid orders where payment is secured upfront, COD transactions carry multiple risk factors that can significantly impact profitability. The primary risks include delivery rejection (customer refuses to accept the package), payment unavailability (customer doesn't have cash ready), fraudulent orders placed with no intention to pay, and product returns after acceptance.

Measuring COD risk is essential because failed deliveries create a cascade of costs that many businesses underestimate. Beyond the obvious loss of sale, you incur return shipping fees (typically 15-20% of order value), handling and restocking charges, packaging waste, and opportunity cost from inventory being tied up during the round trip. For a typical e-commerce operation, a single failed COD delivery can cost 25-35% of the order value in direct expenses.

Furthermore, COD risk varies significantly based on factors like customer history, geographic region, product category, and order value. Without proper risk measurement, businesses often apply blanket COD policies that either turn away good customers or expose them to excessive losses from high-risk orders. A systematic approach to COD risk assessment allows businesses to make data-driven decisions about when to offer COD, when to require verification, and when to mandate prepaid alternatives.`,
  },
  {
    question: "How do regional differences affect COD risk and what are the best strategies for each region?",
    answer: `Regional variations in COD risk are among the most significant factors affecting e-commerce profitability, yet they're often overlooked by businesses expanding into new markets. Our analysis of global COD patterns reveals stark differences: regions like South Asia and Africa show rejection rates of 20-25%, while Western Europe and Oceania maintain rates below 7%. These disparities stem from multiple cultural, economic, and infrastructure factors.

In emerging markets like South Asia, COD remains the preferred payment method due to lower credit card penetration and higher trust barriers. However, this comes with elevated risk. Successful businesses in these regions implement strategies like mandatory phone verification, partial advance payments for high-value orders, and region-specific COD limits. For example, setting a $100 COD cap in high-risk regions while allowing up to $500 in lower-risk markets.

In contrast, developed markets like Western Europe and North America have lower COD usage but also lower associated risk. Here, COD can be offered as a premium convenience option for trusted customers. The key is to maintain verification protocols while not over-restricting access.

Middle East and Latin American markets present unique challenges with moderate risk levels but high variation within regions. Urban areas typically show better delivery success rates than rural locations. Implementing dynamic policies based on delivery pin codes within the same country can optimize your risk exposure.

The best regional strategy involves continuous data collection and policy adjustment. Track rejection rates by delivery zone, identify patterns, and adjust your COD eligibility thresholds accordingly. Consider partnering with local logistics providers who understand regional nuances and can provide ground-level insights.`,
  },
  {
    question: "What are the key factors that determine whether a COD order will be successfully delivered?",
    answer: `Successful COD delivery depends on a complex interplay of factors spanning customer behavior, order characteristics, and operational processes. Understanding these factors allows businesses to predict outcomes and take preventive action before costly dispatches.

Customer history is the strongest predictor of COD success. Repeat customers with previous successful COD transactions show acceptance rates above 90%, while first-time customers average 70-75%. This gap widens significantly for high-value orders. Tracking customer COD history and creating a trust score enables intelligent routing decisions.

Product category profoundly impacts risk. Electronics and jewelry face rejection rates 2-3x higher than books or groceries. This stems from higher price points and buyer's remorse factors. Fashion and apparel see elevated return rates even after acceptance, creating different but equally costly problems.

Order value creates a non-linear risk curve. Small orders under $25 have relatively stable success rates, while orders exceeding $200 show dramatically increasing rejection probability. The psychological threshold varies by market but represents a critical decision point for requiring alternative payment.

Verification status acts as a powerful risk mitigator. Phone-verified customers show 15-20% higher delivery success rates. Address verification reduces delivery failures from incorrect locations by 40%. Email verification helps with communication and follow-up when issues arise.

Temporal factors also matter. Orders placed late at night or during promotional events show higher cancellation rates. Weekend orders sometimes have better success rates as customers are more likely to be home. Tracking these patterns helps optimize dispatch timing and resource allocation.`,
  },
  {
    question: "How should businesses calculate and budget for COD-related costs?",
    answer: `Calculating the true cost of COD requires looking beyond the obvious COD fee charged by logistics providers. A comprehensive cost model should account for both direct expenses and indirect impacts on your business operations and profitability.

Direct costs start with the COD fee itself, typically 2-3% of order value or a minimum fixed amount. But the significant costs emerge from failed deliveries. Return shipping represents 15-20% of order value when an order is rejected. Add handling charges (3%), restocking costs (2%), and packaging waste (1%), and each failed delivery can cost 25% or more of the order value in direct expenses.

To budget effectively, calculate your expected failed delivery cost using this formula: (Order Value × Failed Delivery Rate × Rejection Probability). For example, a $100 order in a region with 20% rejection probability would have an expected failed delivery cost of $100 × 0.26 (combined cost rate) × 0.20 = $5.20 per order on average.

Your total COD cost per order = COD Fee + Expected Failed Delivery Cost. This figure should be compared against your profit margin to determine if COD is viable for that order type. Many businesses discover they're losing money on COD orders for certain product categories or regions.

Budget planning should include a contingency buffer based on seasonal variations. Festive seasons and sale periods typically see 20-30% higher rejection rates. Maintain reserves and consider tightening COD eligibility during these high-risk periods while still capturing sales through prepaid incentives.`,
  },
  {
    question: "What alternatives to traditional COD can reduce risk while maintaining customer convenience?",
    answer: `Traditional cash-on-delivery, while popular in many markets, creates significant operational challenges and financial risks. Fortunately, several alternative approaches preserve customer convenience while mitigating these drawbacks.

Partial COD (or token advance) has emerged as one of the most effective alternatives. By collecting 20-30% of the order value upfront via digital payment, you create customer commitment while still offering flexibility. This approach reduces rejection rates by 40-50% because customers have skin in the game. It works particularly well for high-value items where full prepaid might face resistance.

Digital payment at doorstep transforms the COD experience while eliminating cash handling risks. Equipping delivery agents with QR codes, mobile POS devices, or payment links allows instant digital collection. Benefits include immediate payment confirmation, no cash management overhead, and reduced theft risk. This approach is gaining rapid adoption in markets with high smartphone penetration.

Hybrid verification models require customers to verify payment readiness before dispatch. This might include a confirmation call where customers confirm they have cash available, or even sending a small test transaction to verify payment capability. While adding an operational step, this significantly reduces failed deliveries.

Buy Now Pay Later (BNPL) integration offers customers payment flexibility without merchant risk. BNPL providers assume the credit risk while paying merchants upfront. This works best for customers with established credit profiles and can be positioned as a premium alternative to COD.

The optimal approach often combines multiple alternatives based on customer segments, order values, and regional preferences. A tiered system might offer full COD to trusted customers, partial COD for moderate-risk orders, and require full prepaid for high-risk scenarios.`,
  },
  {
    question: "How can businesses build an effective COD risk management system?",
    answer: `Building an effective COD risk management system requires a systematic approach combining data infrastructure, scoring models, operational processes, and continuous optimization. Here's a comprehensive framework for implementation.

Start with data foundation. You need to capture and store complete COD transaction history including order details, customer identifiers, delivery outcomes, and cost breakdowns. This data forms the basis for all risk calculations. Implement unique customer identification that links orders across sessions and devices.

Develop a multi-factor risk scoring model. Effective models combine customer history (past COD success rate, order frequency, account age), order characteristics (value, category, discount level), verification status (phone, email, address), and regional factors. Weight these factors based on their predictive power in your specific market.

Create decision rules based on risk scores. Define clear thresholds for when to proceed with COD, when to require verification, when to mandate partial payment, and when to offer prepaid only. These rules should be configurable by region and product category to account for varying risk profiles.

Build operational workflows. High-risk orders flagged by your system should trigger specific actions: verification calls, payment confirmation requests, or routing adjustments. Create scripts for confirmation calls and train staff on risk assessment conversations.

Implement feedback loops. Every delivery outcome should feed back into your system to improve future predictions. Track actual rejection rates versus predicted rates and adjust your model accordingly. Seasonal and market changes require periodic model recalibration.

Measure and report comprehensively. Track key metrics including overall rejection rate, rejection rate by risk score band, cost per failed delivery, and customer satisfaction impact. Report these metrics to stakeholders regularly to maintain visibility and support for risk management initiatives.`,
  },
  {
    question: "What role does customer verification play in reducing COD risk?",
    answer: `Customer verification serves as one of the most cost-effective interventions for reducing COD risk, with studies showing 20-40% reductions in failed deliveries when comprehensive verification is implemented. Understanding the different verification types and their impact helps businesses design effective verification strategies.

Phone number verification via OTP (One-Time Password) is the foundational verification step. It confirms the customer has access to the registered mobile number and provides a reliable contact for delivery coordination. Verified phone numbers enable proactive communication about delivery timing, reducing failed attempts from customer unavailability. The impact on rejection rates is substantial - verified orders show 15-20% lower rejection rates.

Address verification goes beyond confirming location accuracy. Validated addresses reduce delivery failures from incorrect locations, but the verification process itself signals customer intent. Customers who complete address verification have demonstrated commitment to receiving the order. This psychological effect translates to measurably better delivery outcomes.

Email verification, while less directly impactful for delivery logistics, enables effective communication and provides a fallback contact channel. It's particularly valuable for order confirmations, delivery notifications, and post-purchase engagement. Verified email addresses also support future marketing and retention efforts.

The verification effect is cumulative. Customers with multiple verified attributes show progressively better outcomes. An order with phone, email, and address verification might show 30% better success rates than an unverified order.

Implementation strategy matters. Verifying at registration creates a trusted customer pool from the start. For guest checkouts, implement verification during the order process for COD payments. Consider offering small incentives (discounts, faster shipping) for verified customers to encourage completion. Balance verification thoroughness against checkout friction - too many verification steps can increase cart abandonment.`,
  },
  {
    question: "How do product categories impact COD risk and what strategies work for high-risk categories?",
    answer: `Product categories exert a profound influence on COD risk profiles, with rejection and return rates varying by factors of 3-4x across different merchandise types. Understanding these patterns enables businesses to implement category-specific strategies that balance sales conversion with risk management.

Electronics and high-tech products represent the highest-risk category for COD. These orders face elevated rejection rates due to several factors: buyer's remorse during the delivery window, availability of competitive pricing that customers find during shipping time, and the psychological barrier of paying large cash sums at once. For electronics, rejection rates can reach 15-20% in some markets. Strategies for this category include mandatory phone verification, partial advance payment requirements for orders above thresholds, and dynamic pricing that accounts for elevated COD costs.

Jewelry and watches face similar challenges with even higher fraud risk. The combination of high value and easy resale makes this category attractive for fraudulent orders. Consider restricting COD entirely for jewelry above certain value thresholds, requiring in-store pickup with ID verification, or partnering with secure delivery services that include payment verification.

Fashion and apparel presents a different challenge - lower rejection rates but higher return rates after acceptance. Customers may accept the delivery but return items that don't fit or meet expectations. For fashion, focus on accurate sizing information, clear return policies, and consider pre-paid return labels to streamline the process while maintaining customer satisfaction.

Low-risk categories like books, media, and groceries show rejection rates under 5% in most markets. These categories can offer unrestricted COD to maximize conversion, with the understanding that the small percentage of failures is an acceptable cost of doing business.

The optimal strategy involves category-specific policies: unrestricted COD for low-risk items, verification requirements for medium-risk categories, and partial prepaid or full prepaid mandates for high-risk products. Track performance by category continuously and adjust thresholds based on actual outcomes in your specific market.`,
  },
];

// Educational content for Guide tab
const educationalContent = {
  whatIsCODRisk: {
    title: "What is Cash on Delivery Risk?",
    content: `Cash on Delivery (COD) is a payment method where customers pay for their orders at the time of delivery rather than at the point of purchase. While this payment option can significantly increase conversion rates—sometimes by 20-30% in markets with low credit card penetration—it introduces substantial financial risk for e-commerce businesses.

COD risk encompasses multiple potential negative outcomes: delivery rejection (the customer refuses to accept the package), payment unavailability (the customer isn't home or doesn't have cash ready), fraudulent orders (placed with no intention to pay), and product returns after acceptance. Each of these outcomes creates financial losses beyond just the lost sale.

When a COD delivery fails, the merchant bears the cost of outbound shipping, return shipping (often 15-20% of order value), handling and restocking fees, packaging materials, and the opportunity cost of inventory being tied up during transit. For a typical order, these combined costs can reach 25-35% of the order value—even though no sale was completed.

The key to managing COD risk lies in understanding that it's not uniform across all orders. Factors like customer history, product category, order value, regional location, and verification status create vastly different risk profiles. A $50 order from a repeat customer with verified contact details in a low-risk region carries minimal risk, while a $500 electronics order from a new customer in a high-risk region could represent a significant loss probability.

Successful e-commerce businesses implement dynamic COD policies that assess each order's risk profile and apply appropriate measures—from automatic approval for low-risk orders to verification requirements, partial payment requests, or prepaid mandates for higher-risk scenarios.`,
  },
  factors: {
    title: "Factors Affecting COD Risk",
    content: `Multiple interconnected factors determine the risk level of any COD transaction. Understanding these factors and their relative impact enables businesses to build effective risk assessment systems and make informed decisions about order processing.

**Customer History (40% Impact)**: The strongest predictor of COD success is the customer's track record. New customers inherently carry higher risk due to unknown payment behavior. Repeat customers with successful COD history show acceptance rates above 90%, while those with previous failures demonstrate elevated risk. Customer account age, order frequency, and average order value also contribute to the risk profile.

**Regional Factors (35% Impact)**: Geographic location dramatically affects COD outcomes. Rejection rates vary from under 7% in developed markets like Western Europe to over 25% in emerging markets. Within countries, urban versus rural locations show different patterns. Infrastructure quality, cultural attitudes toward prepayment, and local economic conditions all influence regional risk.

**Product Category (25% Impact)**: What you sell matters as much as who you sell to. Electronics and luxury goods face 2-3x higher rejection rates than books or groceries. Perishable items have time-sensitive delivery requirements that increase failure risk. Products with high return rates (fashion, shoes) create different but costly problems.

**Order Characteristics**: Order value creates non-linear risk curves. Higher-value orders face greater rejection probability due to the psychological barrier of large cash payments. Heavy discounts attract price-sensitive customers who show higher rejection rates. Order timing (late night purchases during sales) correlates with elevated cancellation risk.

**Verification Status**: Verification acts as a risk mitigator rather than a predictor. Phone-verified customers show 15-20% better outcomes. Address verification reduces delivery failures. Email verification supports communication. Each verification step reduces risk incrementally while adding some customer friction.`,
  },
  bestPractices: {
    title: "Industry Best Practices for COD Management",
    content: `Leading e-commerce businesses have developed sophisticated approaches to COD management that balance conversion optimization with risk mitigation. These best practices represent proven strategies for sustainable COD operations.

**Tiered Customer Management**: Implement customer segmentation based on COD history. Create categories like New (limited COD access), Bronze (3+ successful COD orders, standard limits), Silver (10+ successful orders, higher limits), and Gold (20+ orders, premium COD privileges with highest limits). Automatically adjust policies based on real-time performance.

**Dynamic COD Limits**: Set maximum COD order values that vary by customer tier, product category, and delivery region. A Gold customer ordering books might have a $500 COD limit, while a New customer ordering electronics might face a $50 limit or prepaid requirement. Update these limits based on performance data.

**Mandatory Verification Protocols**: Require phone verification for all COD orders. Implement address verification for orders above regional thresholds. Consider video KYC for very high-value COD orders. Make verification seamless through OTP and instant validation APIs.

**Confirmation Call Workflows**: For orders above risk thresholds, implement confirmation calls before dispatch. Train agents to confirm payment readiness, delivery availability, and product understanding. Create scripts that identify potential issues without alienating customers.

**Partial Payment Options**: Offer 20-30% advance payment for high-risk orders. Position this as a benefit (order priority, faster processing) rather than a restriction. Use digital payment links for convenient advance collection.

**Post-Failure Recovery**: Don't abandon failed COD orders. Contact customers within 24 hours to understand issues. Offer alternative payment options or delivery rescheduling. Convert rejections into prepaid orders when possible.

**Performance Monitoring**: Track rejection rates, cost per failed delivery, and customer satisfaction by risk segment. Set targets and hold teams accountable. Use data to continuously refine risk models and policies.`,
  },
  regionalConsiderations: {
    title: "Regional Considerations for COD Strategy",
    content: `COD strategy must adapt to regional realities. Markets differ dramatically in COD adoption, risk levels, and effective mitigation approaches. A global e-commerce business needs region-specific policies that account for local conditions.

**South Asia (India, Pakistan, Bangladesh)**: COD dominates with 60-80% of e-commerce orders. High rejection rates (20-25%) are offset by massive market size. Success requires mandatory phone verification, regional limit variations (metro vs. non-metro), partial payment for high-value items, and partnerships with local logistics providers who understand regional nuances.

**Southeast Asia (Indonesia, Philippines, Vietnam)**: Mixed payment landscape with growing digital adoption. COD remains important for market expansion into less developed areas. Implement dynamic switching between COD and digital options based on customer profile and delivery location. Consider digital wallet integration at delivery.

**Middle East (UAE, Saudi Arabia, Egypt)**: Varies widely by country. Gulf states show lower COD usage and risk; North African markets remain COD-heavy. Adjust policies accordingly. Cash-on-delivery with digital payment options (QR codes) is gaining acceptance.

**Latin America (Brazil, Mexico, Argentina)**: Complex payment landscape with strong installment preferences. COD works best for specific demographics. Focus on Boleto bancário integration for Brazil, OXXO cash payments for Mexico. COD remains secondary to local payment methods.

**Africa (Nigeria, Kenya, South Africa)**: High COD usage in Nigeria and Kenya, lower in South Africa. Mobile money integration (M-Pesa) provides alternative. Implement strict verification for high-risk regions. Consider agent delivery networks for cash collection.

**Developed Markets (North America, Western Europe, Oceania)**: COD is niche but can be offered as premium convenience. Focus on verified, high-value customers. Lower risk allows higher limits. Position as white-glove service rather than standard option.

Regional strategy should include local team input, continuous market monitoring, partnership with regional logistics experts, and flexible systems that can adapt policies by geography without technical changes.`,
  },
};

export function CODRiskEstimator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const [inputs, setInputs] = useState<CODRiskInputs>({
    orderValue: 150,
    currency: "USD",
    region: "North America",
    category: "Electronics",
    isNewCustomer: false,
    customerOrders: 5,
    previousCODSuccess: 3,
    previousCODFailures: 0,
    orderVelocity: 2,
    addressVerification: true,
    phoneNumberVerified: true,
    emailVerified: true,
    discountPercentage: 10,
    isHighValue: false,
  });

  const results = useMemo(() => calculateCODRisk(inputs), [inputs]);

  const updateInput = <K extends keyof CODRiskInputs>(field: K, value: CODRiskInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Risk level colors
  const riskLevelColors = {
    low: LOGISTICS_GREEN,
    medium: "#F59E0B",
    high: "#EF4444",
    "very-high": "#991B1B",
  };

  // Cost breakdown data
  const costBreakdownData = useMemo(() => [
    { name: "COD Fee", value: results.codFee, color: OCEAN_BLUE },
    { name: "Expected Failed Delivery", value: results.expectedFailedDeliveryCost, color: "#EF4444" },
  ], [results]);

  // Risk distribution data
  const riskDistributionData = useMemo(() => [
    { name: "Rejection Risk", value: results.rejectionProbability * 100, color: "#EF4444" },
    { name: "Fraud Risk", value: results.fraudProbability * 100, color: "#F59E0B" },
    { name: "Return Risk", value: results.returnProbability * 100, color: "#8B5CF6" },
    { name: "Safe", value: (1 - Math.max(results.rejectionProbability, results.fraudProbability, results.returnProbability)) * 100, color: LOGISTICS_GREEN },
  ], [results]);

  // Radar chart data
  const radarData = useMemo(() => [
    { factor: "Customer Risk", score: results.customerRiskScore, fullMark: 100 },
    { factor: "Region Risk", score: results.regionRiskScore, fullMark: 100 },
    { factor: "Product Risk", score: results.productRiskScore, fullMark: 100 },
    { factor: "Rejection Prob", score: results.rejectionProbability * 100, fullMark: 100 },
    { factor: "Fraud Prob", score: results.fraudProbability * 100, fullMark: 100 },
    { factor: "Return Prob", score: results.returnProbability * 100, fullMark: 100 },
  ], [results]);

  // Risk level comparison data for bar chart
  const riskLevelComparisonData = useMemo(() => [
    { name: "Customer", score: results.customerRiskScore, fill: results.customerRiskScore < 40 ? LOGISTICS_GREEN : results.customerRiskScore < 60 ? "#F59E0B" : "#EF4444" },
    { name: "Region", score: results.regionRiskScore, fill: results.regionRiskScore < 20 ? LOGISTICS_GREEN : results.regionRiskScore < 40 ? "#F59E0B" : "#EF4444" },
    { name: "Product", score: results.productRiskScore, fill: results.productRiskScore < 30 ? LOGISTICS_GREEN : results.productRiskScore < 50 ? "#F59E0B" : "#EF4444" },
    { name: "Overall", score: results.overallRiskScore, fill: riskLevelColors[results.riskLevel] },
  ], [results]);

  // Region comparison data
  const regionComparisonData = useMemo(() => 
    Object.entries(regionRiskData).map(([region, data]) => ({
      region,
      baseRisk: data.baseRisk * 100,
      rejection: data.rejectionRate * 100,
      fraud: data.fraudRate * 100,
      isCurrent: region === inputs.region,
    })), [inputs.region]
  );

  // Category comparison data
  const categoryComparisonData = useMemo(() => 
    Object.entries(categoryRiskData).map(([category, data]) => ({
      category: category.length > 15 ? category.substring(0, 15) + "..." : category,
      fullCategory: category,
      riskMultiplier: data.riskMultiplier * 25,
      returnRate: data.returnRate * 100,
      isCurrent: category === inputs.category,
    })), [inputs.category]
  );

  const formatMoney = (value: number) => {
    return formatCurrency(value, inputs.currency);
  };

  const resetCalculator = () => {
    setInputs({
      orderValue: 150,
      currency: "USD",
      region: "North America",
      category: "Electronics",
      isNewCustomer: false,
      customerOrders: 5,
      previousCODSuccess: 3,
      previousCODFailures: 0,
      orderVelocity: 2,
      addressVerification: true,
      phoneNumberVerified: true,
      emailVerified: true,
      discountPercentage: 10,
      isHighValue: false,
    });
  };

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      inputs: inputs,
      results: {
        overallRiskScore: results.overallRiskScore.toFixed(2),
        riskLevel: results.riskLevel,
        rejectionProbability: (results.rejectionProbability * 100).toFixed(2) + "%",
        fraudProbability: (results.fraudProbability * 100).toFixed(2) + "%",
        returnProbability: (results.returnProbability * 100).toFixed(2) + "%",
        codFee: formatMoney(results.codFee),
        codFeePercentage: results.codFeePercentage + "%",
        expectedFailedDeliveryCost: formatMoney(results.expectedFailedDeliveryCost),
        totalCODCost: formatMoney(results.totalCODCost),
        netRiskExposure: formatMoney(results.netRiskExposure),
        recommendations: results.recommendations,
      },
      riskFactors: results.riskFactors.map(f => ({
        factor: f.factor,
        impact: f.impact.toFixed(0),
        status: f.positive ? "Low Risk" : "High Risk"
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cod-risk-assessment-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    const shareText = `COD Risk Assessment Results:
Risk Score: ${results.overallRiskScore.toFixed(0)} (${results.riskLevel.toUpperCase()})
Order Value: ${formatMoney(inputs.orderValue)}
Region: ${inputs.region}
Category: ${inputs.category}

Rejection Probability: ${(results.rejectionProbability * 100).toFixed(1)}%
Fraud Probability: ${(results.fraudProbability * 100).toFixed(1)}%
Total COD Cost: ${formatMoney(results.totalCODCost)}

Generated using Shiportrade COD Risk Estimator`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "COD Risk Assessment",
          text: shareText,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch {
        // User cancelled or error - fall back to clipboard
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {["E-Commerce", "Risk Assessment", "COD Management"].map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="px-3 py-1 text-sm font-medium bg-[var(--ocean)]/10 text-[var(--ocean)] dark:bg-[var(--ocean)]/20 dark:text-[var(--ocean)]"
                  >
                    {badge}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              COD Risk Estimator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Assess and manage Cash on Delivery risk for your e-commerce orders. Calculate rejection probabilities, 
              estimate costs, and get actionable recommendations to minimize losses.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={resetCalculator}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={shareResults}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : shareSuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Shared!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
          <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
          <TabsTrigger value="guide">Guide</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              {/* Order Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Order Details
                  </CardTitle>
                  <CardDescription>
                    Enter order information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Order Value</Label>
                      <Input
                        type="number"
                        value={inputs.orderValue}
                        onChange={(e) => updateInput("orderValue", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={inputs.currency}
                        onValueChange={(v) => updateInput("currency", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.slice(0, 15).map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.code} ({c.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select
                      value={inputs.region}
                      onValueChange={(v) => updateInput("region", v as Region)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(regionRiskData).map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Category</Label>
                    <Select
                      value={inputs.category}
                      onValueChange={(v) => updateInput("category", v as Category)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(categoryRiskData).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Discount Applied</Label>
                      <span className="text-sm text-muted-foreground">{inputs.discountPercentage}%</span>
                    </div>
                    <Slider
                      value={[inputs.discountPercentage]}
                      onValueChange={(v) => updateInput("discountPercentage", v[0])}
                      min={0}
                      max={50}
                      step={5}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>High Value Order</Label>
                      <p className="text-xs text-muted-foreground">Orders above threshold</p>
                    </div>
                    <Switch
                      checked={inputs.isHighValue}
                      onCheckedChange={(v) => updateInput("isHighValue", v)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Customer Risk Factors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-[var(--logistics)]" />
                    Customer Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Customer</Label>
                      <p className="text-xs text-muted-foreground">First time buyer</p>
                    </div>
                    <Switch
                      checked={inputs.isNewCustomer}
                      onCheckedChange={(v) => updateInput("isNewCustomer", v)}
                    />
                  </div>

                  {!inputs.isNewCustomer && (
                    <>
                      <div className="space-y-2">
                        <Label>Total Previous Orders</Label>
                        <Input
                          type="number"
                          value={inputs.customerOrders}
                          onChange={(e) => updateInput("customerOrders", parseInt(e.target.value) || 0)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-green-600 dark:text-green-400">COD Success</Label>
                          <Input
                            type="number"
                            value={inputs.previousCODSuccess}
                            onChange={(e) => updateInput("previousCODSuccess", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-red-600 dark:text-red-400">COD Failures</Label>
                          <Input
                            type="number"
                            value={inputs.previousCODFailures}
                            onChange={(e) => updateInput("previousCODFailures", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Orders per Month</Label>
                        <Input
                          type="number"
                          value={inputs.orderVelocity}
                          onChange={(e) => updateInput("orderVelocity", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Verification Status</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Address Verified</span>
                        <Switch
                          checked={inputs.addressVerification}
                          onCheckedChange={(v) => updateInput("addressVerification", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Phone Verified</span>
                        <Switch
                          checked={inputs.phoneNumberVerified}
                          onCheckedChange={(v) => updateInput("phoneNumberVerified", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Verified</span>
                        <Switch
                          checked={inputs.emailVerified}
                          onCheckedChange={(v) => updateInput("emailVerified", v)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Risk Score Card */}
              <Card className="border-2" style={{ borderColor: riskLevelColors[results.riskLevel] + "40" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="h-5 w-5" style={{ color: riskLevelColors[results.riskLevel] }} />
                      COD Risk Assessment
                    </span>
                    <Badge
                      style={{ backgroundColor: riskLevelColors[results.riskLevel] }}
                      className="text-white"
                    >
                      {results.riskLevel.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Risk Score Gauge - Semicircular */}
                  <motion.div
                    key={results.overallRiskScore}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className="relative inline-block">
                      {/* Semicircular Gauge */}
                      <svg width="200" height="120" viewBox="0 0 200 120" className="mx-auto">
                        {/* Background arc */}
                        <path
                          d="M 20 100 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="16"
                          strokeLinecap="round"
                          className="text-muted/30"
                        />
                        {/* Colored segments */}
                        {/* Low risk (0-25%) - Green */}
                        <path
                          d="M 20 100 A 80 80 0 0 1 40 45"
                          fill="none"
                          stroke={LOGISTICS_GREEN}
                          strokeWidth="16"
                          strokeLinecap="round"
                          opacity={results.overallRiskScore <= 25 ? 1 : 0.3}
                        />
                        {/* Medium risk (25-50%) - Amber */}
                        <path
                          d="M 40 45 A 80 80 0 0 1 100 20"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="16"
                          strokeLinecap="round"
                          opacity={results.overallRiskScore > 25 && results.overallRiskScore <= 50 ? 1 : 0.3}
                        />
                        {/* High risk (50-75%) - Orange/Red */}
                        <path
                          d="M 100 20 A 80 80 0 0 1 160 45"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="16"
                          strokeLinecap="round"
                          opacity={results.overallRiskScore > 50 && results.overallRiskScore <= 75 ? 1 : 0.3}
                        />
                        {/* Very high risk (75-100%) - Dark red */}
                        <path
                          d="M 160 45 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="#991B1B"
                          strokeWidth="16"
                          strokeLinecap="round"
                          opacity={results.overallRiskScore > 75 ? 1 : 0.3}
                        />
                        {/* Needle */}
                        <motion.g
                          initial={{ rotate: -90 }}
                          animate={{ rotate: -90 + (results.overallRiskScore / 100) * 180 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{ transformOrigin: "100px 100px" }}
                        >
                          <line
                            x1="100"
                            y1="100"
                            x2="100"
                            y2="35"
                            stroke={riskLevelColors[results.riskLevel]}
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <circle cx="100" cy="100" r="8" fill={riskLevelColors[results.riskLevel]} />
                        </motion.g>
                      </svg>
                      {/* Score display below gauge */}
                      <div className="flex flex-col items-center -mt-2">
                        <span className="text-4xl font-bold" style={{ color: riskLevelColors[results.riskLevel] }}>
                          {results.overallRiskScore.toFixed(0)}
                        </span>
                        <span className="text-sm text-muted-foreground">Risk Score</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Risk Components */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Customer</div>
                      <div className="text-xl font-bold">{results.customerRiskScore.toFixed(0)}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Region</div>
                      <div className="text-xl font-bold">{results.regionRiskScore.toFixed(0)}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Product</div>
                      <div className="text-xl font-bold">{results.productRiskScore.toFixed(0)}</div>
                    </div>
                  </div>

                  {/* Probabilities */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Rejection Probability</span>
                        <span className="font-medium">{(results.rejectionProbability * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={results.rejectionProbability * 100} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Fraud Probability</span>
                        <span className="font-medium">{(results.fraudProbability * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={results.fraudProbability * 100} className="h-2 [&>div]:bg-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Return Probability</span>
                        <span className="font-medium">{(results.returnProbability * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={results.returnProbability * 100} className="h-2 [&>div]:bg-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                    COD Cost Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">COD Fee</div>
                      <div className="text-2xl font-bold text-[var(--ocean)]">{formatMoney(results.codFee)}</div>
                      <div className="text-xs text-muted-foreground">{results.codFeePercentage}% of order</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Expected Loss</div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatMoney(results.expectedFailedDeliveryCost)}</div>
                      <div className="text-xs text-muted-foreground">From failed deliveries</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total COD Cost</span>
                      <span className="text-2xl font-bold text-[var(--ocean)]">{formatMoney(results.totalCODCost)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                      <span>Net Risk Exposure</span>
                      <span>{formatMoney(results.netRiskExposure)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Recommendations */}
              {results.recommendations.length > 0 && (
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Top Recommendation</p>
                        <p className="text-amber-600 dark:text-amber-400">{results.recommendations[0]}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Risk Level Comparison Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Risk Level Comparison
                </CardTitle>
                <CardDescription>
                  Compare risk scores across different dimensions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskLevelComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(0)}%`} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {riskLevelComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Risk Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of risk probabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Risk Factor Analysis
                </CardTitle>
                <CardDescription>
                  Multi-dimensional risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Risk Score"
                        dataKey="score"
                        stroke={OCEAN_BLUE}
                        fill={OCEAN_BLUE}
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Factor Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.riskFactors.map((factor, index) => (
                    <motion.div
                      key={factor.factor}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${
                        factor.positive
                          ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{factor.factor}</span>
                        {factor.positive ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={factor.impact}
                          className={`h-2 flex-1 ${
                            factor.positive ? "[&>div]:bg-green-500" : "[&>div]:bg-red-500"
                          }`}
                        />
                        <div className="text-lg font-bold w-10 text-right">{factor.impact.toFixed(0)}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Region Comparison */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--ocean)]" />
                  Regional Risk Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="region" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                      <Legend />
                      <Bar dataKey="baseRisk" name="Base Risk" fill={OCEAN_BLUE} />
                      <Bar dataKey="rejection" name="Rejection Rate" fill="#EF4444" />
                      <Bar dataKey="fraud" name="Fraud Rate" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mitigation Tab */}
        <TabsContent value="mitigation" className="space-y-6 mt-6">
          {/* Risk Mitigation Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Risk Mitigation Recommendations
              </CardTitle>
              <CardDescription>
                Actionable steps to reduce COD risk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0 ${
                      index === 0 ? "bg-amber-500" : "bg-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm">{rec}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Prevention Strategies */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--logistics)]" />
                  Prevention Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="verification">
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Customer Verification
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm text-muted-foreground space-y-2 pl-6">
                        <li>Implement OTP-based phone verification</li>
                        <li>Use address validation services</li>
                        <li>Require email confirmation before COD</li>
                        <li>Cross-reference with fraud databases</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="confirmation">
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        Order Confirmation
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm text-muted-foreground space-y-2 pl-6">
                        <li>Call confirmation for orders above threshold</li>
                        <li>Send SMS/WhatsApp delivery reminders</li>
                        <li>Get delivery time confirmation from customer</li>
                        <li>Confirm payment readiness before dispatch</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="limits">
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        <Ban className="h-4 w-4 text-red-600" />
                        Risk-Based Limits
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm text-muted-foreground space-y-2 pl-6">
                        <li>Set maximum COD order value by region</li>
                        <li>Disable COD for high-risk categories</li>
                        <li>Limit COD attempts for failed customers</li>
                        <li>Require partial payment for high-value orders</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[var(--ocean)]" />
                  Alternative Payment Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="partial">
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-purple-600" />
                        Partial COD
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm text-muted-foreground space-y-2 pl-6">
                        <li>Collect 20-30% advance payment online</li>
                        <li>Reduces rejection risk significantly</li>
                        <li>Shows customer commitment to purchase</li>
                        <li>Common practice for high-value electronics</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="digital">
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-green-600" />
                        Digital Wallets
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm text-muted-foreground space-y-2 pl-6">
                        <li>Offer mobile wallet payment at delivery</li>
                        <li>QR code payments reduce cash handling</li>
                        <li>Instant payment verification</li>
                        <li>Lower risk than pure cash on delivery</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="bnpl">
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Buy Now Pay Later
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm text-muted-foreground space-y-2 pl-6">
                        <li>Partner with BNPL providers for creditworthy customers</li>
                        <li>Provider assumes non-payment risk</li>
                        <li>Better customer experience than COD</li>
                        <li>Higher conversion rates for premium products</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* COD Eligibility Decision Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">COD Eligibility Decision Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Risk Level</th>
                      <th className="text-left py-3 px-4">Order Value</th>
                      <th className="text-left py-3 px-4">Recommended Action</th>
                      <th className="text-left py-3 px-4">Alternative</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-green-50 dark:bg-green-950/30">
                      <td className="py-3 px-4">
                        <Badge className="bg-green-600">Low Risk</Badge>
                      </td>
                      <td className="py-3 px-4">Any</td>
                      <td className="py-3 px-4">Proceed with COD</td>
                      <td className="py-3 px-4 text-muted-foreground">-</td>
                    </tr>
                    <tr className="border-b bg-amber-50 dark:bg-amber-950/30">
                      <td className="py-3 px-4">
                        <Badge className="bg-amber-600">Medium Risk</Badge>
                      </td>
                      <td className="py-3 px-4">&lt; $200</td>
                      <td className="py-3 px-4">Proceed with verification call</td>
                      <td className="py-3 px-4">Digital payment option</td>
                    </tr>
                    <tr className="border-b bg-orange-50 dark:bg-orange-950/30">
                      <td className="py-3 px-4">
                        <Badge className="bg-orange-600">High Risk</Badge>
                      </td>
                      <td className="py-3 px-4">&lt; $100</td>
                      <td className="py-3 px-4">Require partial payment (20%)</td>
                      <td className="py-3 px-4">Prepaid only</td>
                    </tr>
                    <tr className="bg-red-50 dark:bg-red-950/30">
                      <td className="py-3 px-4">
                        <Badge className="bg-red-600">Very High Risk</Badge>
                      </td>
                      <td className="py-3 px-4">Any</td>
                      <td className="py-3 px-4">Do not offer COD</td>
                      <td className="py-3 px-4">Prepaid only with verification</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Pro Tips for COD Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {proTips.map((tip, index) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${tip.bgColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <tip.icon className={`h-5 w-5 shrink-0 ${tip.color}`} />
                      <div>
                        <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-red-500" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMistakes.map((mistake, index) => (
                  <motion.div
                    key={mistake.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                      <mistake.icon className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{mistake.title}</h4>
                        <Badge variant={mistake.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                          {mistake.severity} impact
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{mistake.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Educational Content Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                {educationalContent.whatIsCODRisk.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {educationalContent.whatIsCODRisk.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                {educationalContent.factors.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {educationalContent.factors.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[var(--logistics)]" />
                {educationalContent.bestPractices.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {educationalContent.bestPractices.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[var(--ocean)]" />
                {educationalContent.regionalConsiderations.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {educationalContent.regionalConsiderations.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Region Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Regional Risk Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Region</th>
                      <th className="text-right py-3 px-4">Base Risk</th>
                      <th className="text-right py-3 px-4">Rejection Rate</th>
                      <th className="text-right py-3 px-4">Fraud Rate</th>
                      <th className="text-right py-3 px-4">COD Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(regionRiskData).map(([region, data]) => {
                      const fee = codFeeStructure[region as keyof typeof codFeeStructure];
                      return (
                        <tr key={region} className="border-b hover:bg-muted/30">
                          <td className="py-3 px-4 font-medium">{region}</td>
                          <td className="text-right py-3 px-4">{(data.baseRisk * 100).toFixed(0)}%</td>
                          <td className="text-right py-3 px-4">{(data.rejectionRate * 100).toFixed(0)}%</td>
                          <td className="text-right py-3 px-4">{(data.fraudRate * 100).toFixed(0)}%</td>
                          <td className="text-right py-3 px-4">{(fee.percentage * 100).toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Category Risk Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[var(--logistics)]" />
                Product Category Risk Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-right py-3 px-4">Risk Multiplier</th>
                      <th className="text-right py-3 px-4">Return Rate</th>
                      <th className="text-right py-3 px-4">Fraud Rate</th>
                      <th className="text-center py-3 px-4">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(categoryRiskData).map(([category, data]) => {
                      const riskLevel = data.riskMultiplier < 1 ? "Low" : data.riskMultiplier < 1.3 ? "Medium" : data.riskMultiplier < 1.8 ? "High" : "Very High";
                      const riskColor = riskLevel === "Low" ? "bg-green-600" : riskLevel === "Medium" ? "bg-amber-600" : riskLevel === "High" ? "bg-orange-600" : "bg-red-600";
                      return (
                        <tr key={category} className="border-b hover:bg-muted/30">
                          <td className="py-3 px-4 font-medium">{category}</td>
                          <td className="text-right py-3 px-4">{data.riskMultiplier.toFixed(1)}x</td>
                          <td className="text-right py-3 px-4">{(data.returnRate * 100).toFixed(0)}%</td>
                          <td className="text-right py-3 px-4">{(data.fraudRate * 100).toFixed(0)}%</td>
                          <td className="text-center py-3 px-4">
                            <Badge className={riskColor}>{riskLevel}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about COD risk management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="border rounded-lg px-4 bg-card"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <div className="prose prose-sm dark:prose-invert max-w-none pt-2">
                        {faq.answer.split('\n\n').map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions Bar */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={resetCalculator}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" onClick={exportResults}>
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button onClick={shareResults}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Helper icon components
function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
