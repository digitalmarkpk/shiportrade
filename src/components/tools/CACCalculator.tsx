"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  Users,
  Clock,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Megaphone,
  LineChart,
  Layers,
  Download,
  Share2,
  Sparkles,
  Lightbulb,
  XCircle,
  HelpCircle,
  Zap,
  BarChart2,
  TrendingUp as TrendIcon,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  ReferenceLine,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Marketing channels with typical benchmarks
const marketingChannels = [
  { id: "google", name: "Google Ads", color: "#4285F4", avgCac: 45 },
  { id: "facebook", name: "Facebook/Instagram", color: "#1877F2", avgCac: 38 },
  { id: "linkedin", name: "LinkedIn Ads", color: "#0A66C2", avgCac: 85 },
  { id: "tiktok", name: "TikTok Ads", color: "#000000", avgCac: 28 },
  { id: "twitter", name: "Twitter/X Ads", color: "#1DA1F2", avgCac: 52 },
  { id: "youtube", name: "YouTube Ads", color: "#FF0000", avgCac: 65 },
  { id: "pinterest", name: "Pinterest Ads", color: "#E60023", avgCac: 42 },
  { id: "email", name: "Email Marketing", color: "#2E8B57", avgCac: 15 },
  { id: "content", name: "Content Marketing", color: "#0F4C81", avgCac: 35 },
  { id: "referral", name: "Referral Program", color: "#F59E0B", avgCac: 22 },
];

// Customer segments
const customerSegments = [
  { id: "enterprise", name: "Enterprise", avgLtv: 50000, avgCac: 2500, color: "#0F4C81" },
  { id: "midmarket", name: "Mid-Market", avgLtv: 15000, avgCac: 800, color: "#2E8B57" },
  { id: "smb", name: "Small Business", avgLtv: 5000, avgCac: 250, color: "#F59E0B" },
  { id: "consumer", name: "Consumer", avgLtv: 500, avgCac: 45, color: "#8B5CF6" },
];

// Industry benchmarks for CAC
const industryBenchmarks = [
  { industry: "E-Commerce", avgCac: 45, avgLtv: 180, avgRatio: 4.0 },
  { industry: "SaaS B2B", avgCac: 205, avgLtv: 820, avgRatio: 4.0 },
  { industry: "SaaS B2C", avgCac: 95, avgLtv: 285, avgRatio: 3.0 },
  { industry: "Fintech", avgCac: 200, avgLtv: 600, avgRatio: 3.0 },
  { industry: "Healthcare", avgCac: 150, avgLtv: 450, avgRatio: 3.0 },
  { industry: "Travel", avgCac: 85, avgLtv: 255, avgRatio: 3.0 },
  { industry: "Education", avgCac: 175, avgLtv: 525, avgRatio: 3.0 },
  { industry: "Consumer Goods", avgCac: 22, avgLtv: 88, avgRatio: 4.0 },
];

// Pro tips for reducing CAC
const proTips = [
  {
    icon: Target,
    title: "Optimize Audience Targeting",
    description: "Focus your advertising spend on high-intent audiences. Use lookalike audiences based on your best customers and implement detailed demographic and behavioral targeting. This can reduce wasted ad spend by 30-40% while improving conversion rates significantly.",
  },
  {
    icon: BarChart2,
    title: "A/B Test Continuously",
    description: "Never stop testing your landing pages, ad copy, and creative elements. Small improvements in conversion rates compound over time. A 10% improvement in landing page conversion can reduce your effective CAC by the same percentage without any change in ad spend.",
  },
  {
    icon: Users,
    title: "Implement Referral Programs",
    description: "Turn your satisfied customers into advocates. Referral programs typically have the lowest CAC of any channel ($15-25 on average). Even a modest referral incentive can generate significant word-of-mouth growth at minimal cost.",
  },
  {
    icon: Sparkles,
    title: "Leverage Content Marketing",
    description: "Invest in SEO-optimized content that attracts organic traffic. While content marketing has higher upfront costs, it provides compounding returns over time. Content created today can generate leads for years with minimal ongoing investment.",
  },
  {
    icon: Zap,
    title: "Improve Sales Efficiency",
    description: "Equip your sales team with better tools and training. Implement lead scoring to prioritize high-value prospects. Reducing the sales cycle by even a few days can significantly impact your overall CAC and improve cash flow.",
  },
  {
    icon: TrendIcon,
    title: "Focus on Customer Retention",
    description: "While not directly reducing CAC, improving retention dramatically improves LTV:CAC ratios. A 5% increase in customer retention can increase profits by 25-95%. Happy customers also become advocates, reducing future acquisition costs.",
  },
];

// Common mistakes to avoid
const commonMistakes = [
  {
    icon: XCircle,
    title: "Ignoring Attribution Complexity",
    description: "Many businesses incorrectly attribute all conversions to the last touchpoint, leading to poor budget allocation. Implement multi-touch attribution models to understand the true customer journey. A customer might interact with 6-8 touchpoints before converting, and ignoring early-stage channels can lead to diminishing returns over time.",
  },
  {
    icon: XCircle,
    title: "Not Segmenting CAC by Channel",
    description: "Using an aggregate CAC metric hides crucial insights about channel performance. A blended CAC of $50 might include channels with $15 CAC (excellent) and $200 CAC (poor). Without channel-level visibility, you can't optimize your marketing mix effectively and may continue investing in underperforming channels.",
  },
  {
    icon: XCircle,
    title: "Focusing Only on New Customer Acquisition",
    description: "Obsessing over new customer acquisition while neglecting retention is a costly mistake. Existing customers are 60-70% more likely to convert compared to 5-20% for new prospects. Investing in customer success and retention programs often provides better ROI than aggressive acquisition spending.",
  },
  {
    icon: XCircle,
    title: "Not Considering CAC Payback Period",
    description: "A healthy LTV:CAC ratio doesn't guarantee healthy cash flow. If your CAC payback period is 18 months but your average customer churns at 12 months, you're losing money. Always consider payback period alongside LTV:CAC ratio, especially for businesses with significant upfront costs.",
  },
  {
    icon: XCircle,
    title: "Neglecting Brand Building",
    description: "Focusing exclusively on performance marketing at the expense of brand building creates a dependency on paid acquisition. Strong brands have significantly lower CAC because customers seek them out directly. Balance short-term performance marketing with long-term brand investment for sustainable growth.",
  },
];

// FAQ data
const faqData = [
  {
    question: "What is Customer Acquisition Cost (CAC) and why is it important?",
    answer: "Customer Acquisition Cost (CAC) is a fundamental business metric that measures the total cost incurred to acquire a new customer. This includes all marketing and advertising expenses, sales team salaries and commissions, software tools, content creation costs, and any other direct costs associated with converting prospects into paying customers. CAC is critically important because it serves as a key indicator of business efficiency and scalability. When combined with Customer Lifetime Value (LTV), it reveals whether your business model is fundamentally sound. A company with a CAC higher than its LTV is essentially paying more to acquire customers than they will ever generate in revenue, which is unsustainable in the long run. Understanding and optimizing CAC is essential for making informed decisions about marketing budgets, pricing strategies, and growth investments. It also helps investors evaluate the health and potential of a business, making it a crucial metric for fundraising and business valuation.",
  },
  {
    question: "How do I calculate CAC correctly for my business?",
    answer: "Calculating CAC correctly requires a comprehensive approach that captures all relevant costs over a specific time period. The basic formula is: Total Marketing Costs + Total Sales Costs divided by the Number of New Customers Acquired. However, accuracy depends on properly accounting for all cost components. Marketing costs should include paid advertising (Google Ads, Facebook, LinkedIn, etc.), content marketing and SEO expenses, email marketing platforms, creative and production costs, agency fees, marketing software subscriptions, event and sponsorship costs, and influencer partnerships. Sales costs should encompass sales team salaries, commissions and bonuses, sales training programs, CRM and sales enablement tools, travel and entertainment for client meetings, and sales collateral production. It's important to choose a consistent time period for calculation, typically monthly or quarterly, and ensure the customer count aligns with the same period. For businesses with long sales cycles, you may need to adjust for lag time between marketing spend and customer acquisition. Many companies also calculate CAC by channel, segment, or product line to gain more granular insights into acquisition efficiency.",
  },
  {
    question: "What is a good LTV:CAC ratio and what does it mean?",
    answer: "The LTV:CAC ratio compares the lifetime value of a customer to the cost of acquiring them, providing a clear picture of your unit economics. The generally accepted benchmark for a healthy LTV:CAC ratio is 3:1 or higher, meaning customers generate at least three times their acquisition cost in lifetime value. A ratio below 1:1 indicates a fundamentally broken business model where you're losing money on every customer acquired. Ratios between 1:1 and 3:1 suggest marginal profitability but leave little room for error, unexpected costs, or market fluctuations. The ideal ratio varies by industry and business model. E-commerce businesses often target 4:1 or higher due to typically lower customer lifetime values and competitive margins. SaaS companies frequently aim for 3:1 to 5:1, while enterprise B2B companies with long sales cycles might accept slightly lower ratios if customer values are extremely high. It's worth noting that extremely high ratios (above 8:1) might indicate under-investment in growth, potentially leaving market share on the table. The key is finding the right balance that allows for sustainable, profitable growth.",
  },
  {
    question: "How can I reduce my Customer Acquisition Cost?",
    answer: "Reducing CAC requires a multi-faceted approach addressing both marketing efficiency and sales effectiveness. Start by analyzing your current funnel to identify bottlenecks and inefficiencies. Improve conversion rates at each stage through better landing pages, clearer value propositions, and streamlined checkout or signup processes. Even a 10% improvement in conversion rates directly reduces CAC by the same percentage. Optimize your advertising by focusing on high-intent audiences, using negative keywords to reduce wasted spend, and implementing proper attribution to understand which channels truly drive conversions. Invest in organic channels like content marketing and SEO which have higher upfront costs but lower ongoing CAC as content compounds over time. Implement referral programs, which typically have the lowest CAC of any channel. Improve sales efficiency through better lead scoring, enhanced training, and automation of routine tasks. Consider retargeting campaigns to capture prospects who showed initial interest but didn't convert. Finally, focus on customer retention and satisfaction, as happy customers become advocates who drive organic growth through word-of-mouth referrals.",
  },
  {
    question: "How does CAC differ between B2B and B2C businesses?",
    answer: "CAC differs significantly between B2B and B2C businesses due to fundamental differences in buying behavior, sales cycles, and deal sizes. B2B companies typically have higher CAC due to longer sales cycles (often 3-12 months), multiple decision-makers involved in purchases, requirement for dedicated sales teams, complex products requiring demos and trials, and higher-touch customer acquisition processes. Average B2B CAC ranges from $100-$500 for SMB-focused products to $1,000-$10,000+ for enterprise solutions. B2C businesses generally have lower CAC due to shorter, often impulse-driven purchase decisions, single decision-maker purchases, ability to scale through digital advertising, lower average order values, and more automated sales processes. Average B2C CAC ranges from $10-$50 for e-commerce to $50-$200 for subscription services. However, these differences also affect LTV, with B2B typically having much higher customer values. The key is understanding that different business models require different benchmarks and strategies. A $500 CAC might be excellent for an enterprise software company with $50,000 annual contracts but disastrous for a consumer app with $10 monthly subscriptions.",
  },
  {
    question: "What is CAC payback period and why does it matter?",
    answer: "CAC payback period measures how long it takes to recover your customer acquisition investment through gross profit generated by that customer. The formula is CAC divided by Monthly Gross Profit per Customer (Revenue minus Cost of Goods Sold divided by average customer lifespan in months). This metric is crucial because it reveals the cash flow implications of your growth strategy. Even with a healthy LTV:CAC ratio, a long payback period can create severe cash flow challenges, especially for fast-growing companies. Generally, a payback period under 12 months is considered healthy for most businesses. Under 6 months is excellent and allows for aggressive growth investments. Payback periods over 18 months signal potential cash flow issues and may require significant working capital to sustain growth. This metric is particularly important for startups and investors, as it helps determine capital requirements for scaling. A company with $100 CAC and $20 monthly gross profit has a 5-month payback, while the same CAC with $5 monthly gross profit extends to 20 months. The former can scale quickly with minimal capital; the latter may require substantial external funding.",
  },
  {
    question: "Should I calculate CAC differently for different marketing channels?",
    answer: "Absolutely, calculating channel-specific CAC is essential for optimizing your marketing mix and budget allocation. Different channels have vastly different cost structures, conversion rates, and customer quality. To calculate channel CAC, divide the total spend on a specific channel by the number of customers attributed to that channel. This reveals which channels are most efficient at acquiring customers. For example, you might find that email marketing has a CAC of $15, content marketing $35, Google Ads $50, and LinkedIn Ads $150. However, it's crucial to consider additional factors beyond raw CAC. Customer quality varies by channel, customers acquired through content marketing might have higher retention and LTV than those from paid ads. Attribution complexity means customers often interact with multiple channels before converting, so implement multi-touch attribution models. Some channels serve primarily for awareness while others drive conversions, and undervaluing awareness channels can hurt long-term growth. Calculate blended CAC (total spend divided by total customers) as your primary metric, but use channel-specific CAC for optimization decisions and budget reallocation.",
  },
  {
    question: "How often should I review and optimize my CAC?",
    answer: "CAC should be monitored continuously but reviewed comprehensively on a monthly or quarterly basis depending on your business model and growth stage. For early-stage startups and companies in rapid growth phases, weekly monitoring of key indicators like cost per lead, conversion rates, and channel performance is advisable, with deeper monthly analysis. Established businesses can typically conduct thorough reviews quarterly while monitoring key metrics monthly. During reviews, examine trends over time rather than single data points, as CAC naturally fluctuates due to seasonality, market conditions, and campaign timing. Compare CAC against industry benchmarks, but focus more on your own historical trends and improvement trajectory. Analyze channel-level CAC to identify optimization opportunities and budget reallocation needs. Review CAC alongside related metrics like LTV, payback period, and churn rate for a complete picture of acquisition efficiency. Set specific improvement targets and track progress toward them. When CAC increases unexpectedly, investigate immediately to identify the root cause, whether it's increased competition, declining conversion rates, or market changes. Proactive CAC management is essential for maintaining healthy unit economics and sustainable growth.",
  },
];

interface ChannelData {
  spend: number;
  conversions: number;
  enabled: boolean;
}

interface SegmentData {
  customers: number;
  ltv: number;
  cac: number;
  enabled: boolean;
}

interface CACResult {
  totalMarketingSpend: number;
  totalSalesCost: number;
  totalCost: number;
  newCustomers: number;
  cac: number;
  channelBreakdown: {
    channel: string;
    spend: number;
    conversions: number;
    cac: number;
    color: string;
  }[];
  paybackPeriod: number;
  ltvCacRatio: number;
  isHealthy: boolean;
  monthlyCohorts: { month: string; cac: number; customers: number; ltv: number }[];
}

export function CACCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Marketing channel data
  const [channels, setChannels] = useState<Record<string, ChannelData>>({
    google: { spend: 15000, conversions: 320, enabled: true },
    facebook: { spend: 12000, conversions: 280, enabled: true },
    linkedin: { spend: 8000, conversions: 85, enabled: true },
    tiktok: { spend: 5000, conversions: 150, enabled: false },
    twitter: { spend: 0, conversions: 0, enabled: false },
    youtube: { spend: 0, conversions: 0, enabled: false },
    pinterest: { spend: 0, conversions: 0, enabled: false },
    email: { spend: 3000, conversions: 180, enabled: true },
    content: { spend: 5000, conversions: 120, enabled: true },
    referral: { spend: 2000, conversions: 90, enabled: true },
  });

  // Sales team costs
  const [salesSalaries, setSalesSalaries] = useState<string>("45000");
  const [salesCommissions, setSalesCommissions] = useState<string>("12000");
  const [salesTools, setSalesTools] = useState<string>("3000");
  const [salesTraining, setSalesTraining] = useState<string>("1500");

  // Customer metrics
  const [newCustomers, setNewCustomers] = useState<string>("1225");
  const [averageLtv, setAverageLtv] = useState<string>("850");
  const [averageRevenue, setAverageRevenue] = useState<string>("150");
  const [grossMargin, setGrossMargin] = useState<string>("70");

  // Segment data for comparison
  const [segments, setSegments] = useState<Record<string, SegmentData>>({
    enterprise: { customers: 25, ltv: 55000, cac: 2800, enabled: true },
    midmarket: { customers: 120, ltv: 18000, cac: 950, enabled: true },
    smb: { customers: 380, ltv: 5500, cac: 280, enabled: true },
    consumer: { customers: 700, ltv: 450, cac: 38, enabled: true },
  });

  // Target metrics
  const [targetLtvCacRatio, setTargetLtvCacRatio] = useState<number>(3.0);
  const [targetPaybackMonths, setTargetPaybackMonths] = useState<number>(12);

  const parseNum = (val: string) => parseFloat(val) || 0;

  // Calculate CAC and related metrics
  const calculation = useMemo((): CACResult => {
    // Channel breakdown
    const channelBreakdown = marketingChannels
      .filter((ch) => channels[ch.id]?.enabled && channels[ch.id]?.spend > 0)
      .map((ch) => {
        const data = channels[ch.id];
        const cac = data.conversions > 0 ? data.spend / data.conversions : 0;
        return {
          channel: ch.name,
          spend: data.spend,
          conversions: data.conversions,
          cac,
          color: ch.color,
        };
      });

    // Total marketing spend
    const totalMarketingSpend = channelBreakdown.reduce((sum, ch) => sum + ch.spend, 0);

    // Total sales costs
    const totalSalesCost =
      parseNum(salesSalaries) + parseNum(salesCommissions) + parseNum(salesTools) + parseNum(salesTraining);

    // Total cost
    const totalCost = totalMarketingSpend + totalSalesCost;

    // CAC calculation
    const customers = parseNum(newCustomers);
    const cac = customers > 0 ? totalCost / customers : 0;

    // LTV:CAC Ratio
    const ltv = parseNum(averageLtv);
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;

    // Payback period (months)
    const arpu = parseNum(averageRevenue);
    const margin = parseNum(grossMargin) / 100;
    const monthlyGrossProfit = arpu * margin;
    const paybackPeriod = monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : 0;

    // Healthy LTV:CAC is typically 3:1 or higher
    const isHealthy = ltvCacRatio >= 3;

    // Monthly cohort simulation (for trend visualization)
    const monthlyCohorts = [
      { month: "Jan", cac: cac * 1.15, customers: Math.round(customers * 0.08), ltv: ltv * 0.95 },
      { month: "Feb", cac: cac * 1.08, customers: Math.round(customers * 0.08), ltv: ltv * 0.97 },
      { month: "Mar", cac: cac * 1.02, customers: Math.round(customers * 0.09), ltv: ltv * 0.98 },
      { month: "Apr", cac: cac * 0.98, customers: Math.round(customers * 0.09), ltv: ltv * 1.0 },
      { month: "May", cac: cac * 0.95, customers: Math.round(customers * 0.08), ltv: ltv * 1.02 },
      { month: "Jun", cac: cac, customers: Math.round(customers * 0.08), ltv: ltv * 1.05 },
    ];

    return {
      totalMarketingSpend,
      totalSalesCost,
      totalCost,
      newCustomers: customers,
      cac,
      channelBreakdown,
      paybackPeriod,
      ltvCacRatio,
      isHealthy,
      monthlyCohorts,
    };
  }, [
    channels,
    salesSalaries,
    salesCommissions,
    salesTools,
    salesTraining,
    newCustomers,
    averageLtv,
    averageRevenue,
    grossMargin,
  ]);

  // Pie chart data for cost breakdown
  const costBreakdownData = useMemo(() => {
    const marketingData = calculation.channelBreakdown.map((ch) => ({
      name: ch.channel.split(" ")[0],
      value: ch.spend,
      color: ch.color,
      type: "Marketing",
    }));

    if (calculation.totalSalesCost > 0) {
      marketingData.push({
        name: "Sales Team",
        value: calculation.totalSalesCost,
        color: "#0F4C81",
        type: "Sales",
      });
    }

    return marketingData;
  }, [calculation]);

  // Channel CAC comparison data
  const channelCacData = useMemo(() => {
    return calculation.channelBreakdown.map((ch) => ({
      name: ch.channel.split(" ")[0],
      cac: ch.cac,
      conversions: ch.conversions,
      color: ch.color,
    }));
  }, [calculation]);

  // Segment comparison data
  const segmentComparisonData = useMemo(() => {
    return customerSegments
      .filter((seg) => segments[seg.id]?.enabled)
      .map((seg) => {
        const data = segments[seg.id];
        const ratio = data.cac > 0 ? data.ltv / data.cac : 0;
        return {
          name: seg.name,
          ltv: data.ltv,
          cac: data.cac,
          ratio,
          customers: data.customers,
          color: seg.color,
        };
      });
  }, [segments]);

  // LTV vs CAC trend data
  const ltvCacTrendData = useMemo(() => {
    return calculation.monthlyCohorts.map((cohort) => ({
      month: cohort.month,
      cac: cohort.cac,
      ltv: cohort.ltv,
      ratio: cohort.cac > 0 ? cohort.ltv / cohort.cac : 0,
    }));
  }, [calculation]);

  const updateChannel = (channelId: string, field: keyof ChannelData, value: number | boolean) => {
    setChannels((prev) => ({
      ...prev,
      [channelId]: {
        ...prev[channelId],
        [field]: value,
      },
    }));
  };

  const updateSegment = (segmentId: string, field: keyof SegmentData, value: number | boolean) => {
    setSegments((prev) => ({
      ...prev,
      [segmentId]: {
        ...prev[segmentId],
        [field]: value,
      },
    }));
  };

  const resetForm = () => {
    setChannels({
      google: { spend: 15000, conversions: 320, enabled: true },
      facebook: { spend: 12000, conversions: 280, enabled: true },
      linkedin: { spend: 8000, conversions: 85, enabled: true },
      tiktok: { spend: 5000, conversions: 150, enabled: false },
      twitter: { spend: 0, conversions: 0, enabled: false },
      youtube: { spend: 0, conversions: 0, enabled: false },
      pinterest: { spend: 0, conversions: 0, enabled: false },
      email: { spend: 3000, conversions: 180, enabled: true },
      content: { spend: 5000, conversions: 120, enabled: true },
      referral: { spend: 2000, conversions: 90, enabled: true },
    });
    setSalesSalaries("45000");
    setSalesCommissions("12000");
    setSalesTools("3000");
    setSalesTraining("1500");
    setNewCustomers("1225");
    setAverageLtv("850");
    setAverageRevenue("150");
    setGrossMargin("70");
  };

  const getCACGrade = (ratio: number): { grade: string; color: string; description: string } => {
    if (ratio >= 5) return { grade: "A+", color: "text-emerald-500", description: "Exceptional" };
    if (ratio >= 4) return { grade: "A", color: "text-emerald-500", description: "Excellent" };
    if (ratio >= 3) return { grade: "B", color: "text-blue-500", description: "Good" };
    if (ratio >= 1) return { grade: "C", color: "text-amber-500", description: "Needs Improvement" };
    return { grade: "D", color: "text-red-500", description: "Unprofitable" };
  };

  const getPaybackGrade = (months: number): { status: string; color: string } => {
    if (months <= 6) return { status: "Excellent", color: "text-emerald-500" };
    if (months <= 12) return { status: "Good", color: "text-blue-500" };
    if (months <= 18) return { status: "Acceptable", color: "text-amber-500" };
    return { status: "High Risk", color: "text-red-500" };
  };

  const formatMoney = (value: number) => formatCurrency(value, currency);

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
  };

  // Export functionality
  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      currency,
      summary: {
        totalMarketingSpend: calculation.totalMarketingSpend,
        totalSalesCost: calculation.totalSalesCost,
        totalCost: calculation.totalCost,
        newCustomers: calculation.newCustomers,
        cac: calculation.cac,
        ltvCacRatio: calculation.ltvCacRatio,
        paybackPeriod: calculation.paybackPeriod,
      },
      channelBreakdown: calculation.channelBreakdown,
      customerMetrics: {
        averageLtv: parseNum(averageLtv),
        averageRevenue: parseNum(averageRevenue),
        grossMargin: parseNum(grossMargin),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cac-analysis-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share functionality
  const shareResults = async () => {
    const shareText = `CAC Analysis Results:
• Total Cost: ${formatMoney(calculation.totalCost)}
• New Customers: ${calculation.newCustomers.toLocaleString()}
• CAC: ${formatMoney(calculation.cac)}
• LTV:CAC Ratio: ${calculation.ltvCacRatio.toFixed(1)}:1
• Payback Period: ${calculation.paybackPeriod.toFixed(1)} months

Calculated using Shiportrade CAC Calculator`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "CAC Analysis Results",
          text: shareText,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  // Animated badges for hero section
  const heroBadges = [
    { label: "E-Commerce", icon: BarChart3 },
    { label: "Marketing ROI", icon: TrendingUp },
    { label: "Customer Acquisition", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 md:p-8 border border-[var(--ocean)]/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {heroBadges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge
                    variant="secondary"
                    className="px-3 py-1.5 bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20 hover:bg-[var(--ocean)]/20 transition-colors"
                  >
                    <badge.icon className="h-3.5 w-3.5 mr-1.5" />
                    {badge.label}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Customer Acquisition Cost Calculator
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Calculate and analyze your customer acquisition cost (CAC), compare LTV:CAC ratios, and optimize your marketing spend across channels for maximum ROI.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={resetForm} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" onClick={exportResults} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={shareResults} className="gap-2 bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="guide">Guide</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                  CAC Parameters
                </CardTitle>
                <CardDescription>Enter your marketing spend and sales costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Label className="shrink-0">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.slice(0, 15).map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-[var(--logistics)]" />
                    Total Marketing Spend
                  </h4>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-[var(--logistics)]">
                      {formatMoney(calculation.totalMarketingSpend)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Across {calculation.channelBreakdown.length} channels
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[var(--ocean)]" />
                    Sales Team Costs (Monthly)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Salaries</Label>
                      <Input
                        type="number"
                        value={salesSalaries}
                        onChange={(e) => setSalesSalaries(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Commissions</Label>
                      <Input
                        type="number"
                        value={salesCommissions}
                        onChange={(e) => setSalesCommissions(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Tools & Software</Label>
                      <Input
                        type="number"
                        value={salesTools}
                        onChange={(e) => setSalesTools(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Training</Label>
                      <Input
                        type="number"
                        value={salesTraining}
                        onChange={(e) => setSalesTraining(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Sales Costs</p>
                    <p className="text-xl font-bold text-[var(--ocean)]">
                      {formatMoney(calculation.totalSalesCost)}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-[var(--logistics)]" />
                    Customer Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">New Customers Acquired</Label>
                      <Input
                        type="number"
                        value={newCustomers}
                        onChange={(e) => setNewCustomers(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Average LTV</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={averageLtv}
                          onChange={(e) => setAverageLtv(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Monthly Revenue/Customer</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={averageRevenue}
                          onChange={(e) => setAverageRevenue(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Gross Margin %</Label>
                      <div className="relative mt-1">
                        <Input
                          type="number"
                          value={grossMargin}
                          onChange={(e) => setGrossMargin(e.target.value)}
                          className="pr-8"
                        />
                        <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="border-[var(--ocean)]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  CAC Results
                </CardTitle>
                <CardDescription>Your customer acquisition cost analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold text-[var(--ocean)]">
                      {formatMoney(calculation.totalCost)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">New Customers</p>
                    <p className="text-2xl font-bold text-[var(--logistics)]">
                      {calculation.newCustomers.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* CAC Score */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--logistics)]/10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                    <span className="text-sm text-muted-foreground">Customer Acquisition Cost</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-5xl font-bold text-[var(--ocean)]">
                      {formatMoney(calculation.cac)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total Spend ÷ New Customers
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">LTV:CAC Ratio</p>
                    <div className="flex items-baseline gap-2">
                      <p
                        className={`text-2xl font-bold ${
                          calculation.isHealthy ? "text-[var(--logistics)]" : "text-red-500"
                        }`}
                      >
                        {calculation.ltvCacRatio.toFixed(1)}:1
                      </p>
                      {calculation.isHealthy ? (
                        <ArrowUpRight className="h-4 w-4 text-[var(--logistics)]" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <Badge
                      className={`mt-2 ${calculation.isHealthy ? "bg-emerald-500" : "bg-amber-500"}`}
                    >
                      {getCACGrade(calculation.ltvCacRatio).grade} -{" "}
                      {getCACGrade(calculation.ltvCacRatio).description}
                    </Badge>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Payback Period</p>
                    <div className="flex items-baseline gap-1">
                      <p className={`text-2xl font-bold ${getPaybackGrade(calculation.paybackPeriod).color}`}>
                        {calculation.paybackPeriod.toFixed(1)}
                      </p>
                      <span className="text-muted-foreground">months</span>
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {getPaybackGrade(calculation.paybackPeriod).status}
                    </Badge>
                  </div>
                </div>

                {/* Warning */}
                {!calculation.isHealthy && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        <p className="font-semibold">LTV:CAC Ratio Below 3:1</p>
                        <p>
                          A ratio below 3:1 indicates you&apos;re spending too much to acquire customers
                          relative to their lifetime value. Consider reducing acquisition costs or
                          increasing customer value.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-[var(--ocean)]/10 to-transparent border-[var(--ocean)]/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[var(--ocean)]">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">CAC</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{formatMoney(calculation.cac)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Per customer</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-[var(--logistics)]/10 to-transparent border-[var(--logistics)]/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[var(--logistics)]">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">LTV:CAC</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{calculation.ltvCacRatio.toFixed(1)}:1</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {calculation.isHealthy ? "Healthy" : "Needs improvement"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Payback</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{calculation.paybackPeriod.toFixed(1)} mo</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getPaybackGrade(calculation.paybackPeriod).status}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-500">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Customers</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{calculation.newCustomers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Acquired</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[var(--ocean)]" />
                  Cost Breakdown by Channel
                </CardTitle>
                <CardDescription>How your acquisition costs are distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatMoney(value)}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))", 
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px" 
                        }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Channel CAC Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--logistics)]" />
                  Channel CAC Comparison
                </CardTitle>
                <CardDescription>Compare acquisition costs across channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={channelCacData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis tickFormatter={(v) => `$${v}`} />
                      <Tooltip 
                        formatter={(value: number) => formatMoney(value)}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))", 
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px" 
                        }}
                      />
                      <Bar dataKey="cac" name="CAC" radius={[4, 4, 0, 0]}>
                        {channelCacData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CAC Trend Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                CAC Trends Over Time
              </CardTitle>
              <CardDescription>Simulated monthly CAC progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={calculation.monthlyCohorts}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(v) => `$${v}`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "cac" ? formatMoney(value) : value,
                        name === "cac" ? "CAC" : "Customers",
                      ]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px" 
                      }}
                    />
                    <ReferenceLine
                      yAxisId="left"
                      y={calculation.cac}
                      stroke={chartColors.ocean}
                      strokeDasharray="5 5"
                      label={{ value: "Current CAC", position: "top", fill: chartColors.ocean }}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="customers"
                      fill={`${chartColors.logistics}20`}
                      stroke={chartColors.logistics}
                      name="customers"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="cac"
                      stroke={chartColors.ocean}
                      strokeWidth={3}
                      dot={{ fill: chartColors.ocean, strokeWidth: 2 }}
                      name="cac"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* LTV vs CAC Ratio Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                CAC vs LTV Ratio Analysis
              </CardTitle>
              <CardDescription>Understanding your ratio health over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={ltvCacTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "ratio" ? `${value.toFixed(1)}:1` : formatMoney(value),
                        name === "ratio" ? "LTV:CAC Ratio" : name.toUpperCase(),
                      ]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px" 
                      }}
                    />
                    <ReferenceLine
                      y={3}
                      stroke={chartColors.danger}
                      strokeDasharray="5 5"
                      label={{ value: "Min Healthy (3:1)", position: "right", fill: chartColors.danger }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ratio"
                      stroke={chartColors.logistics}
                      fill={`${chartColors.logistics}30`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* LTV:CAC Ratio Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--logistics)]" />
                LTV:CAC Ratio Health Assessment
              </CardTitle>
              <CardDescription>Understanding your ratio health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-1">
                    Below 1:1
                  </p>
                  <p className="text-3xl font-bold text-red-500">Unprofitable</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    You&apos;re losing money on every customer
                  </p>
                </div>
                <div className="p-6 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mb-1">
                    1:1 - 3:1
                  </p>
                  <p className="text-3xl font-bold text-amber-500">Marginal</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    Profitable but need optimization
                  </p>
                </div>
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium mb-1">
                    3:1 or Higher
                  </p>
                  <p className="text-3xl font-bold text-emerald-500">Healthy</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                    Good unit economics, can scale
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Your LTV:CAC Ratio</span>
                  <span className="text-2xl font-bold">{calculation.ltvCacRatio.toFixed(1)}:1</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      calculation.ltvCacRatio >= 3
                        ? "bg-[var(--logistics)]"
                        : calculation.ltvCacRatio >= 1
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, (calculation.ltvCacRatio / 5) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0:1</span>
                  <span>1:1</span>
                  <span>3:1</span>
                  <span>5:1+</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Target Goals
              </CardTitle>
              <CardDescription>Set and track your CAC targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Target LTV:CAC Ratio</Label>
                    <span className="font-bold text-[var(--ocean)]">
                      {targetLtvCacRatio.toFixed(1)}:1
                    </span>
                  </div>
                  <Slider
                    value={[targetLtvCacRatio]}
                    onValueChange={(v) => setTargetLtvCacRatio(v[0])}
                    min={1}
                    max={6}
                    step={0.1}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Target Payback (Months)</Label>
                    <span className="font-bold text-[var(--ocean)]">{targetPaybackMonths}</span>
                  </div>
                  <Slider
                    value={[targetPaybackMonths]}
                    onValueChange={(v) => setTargetPaybackMonths(v[0])}
                    min={3}
                    max={24}
                    step={1}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div
                  className={`p-4 rounded-lg ${
                    calculation.ltvCacRatio >= targetLtvCacRatio
                      ? "bg-[var(--logistics)]/10 border border-[var(--logistics)]/20"
                      : "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {calculation.ltvCacRatio >= targetLtvCacRatio ? (
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                    <span
                      className={`font-medium ${
                        calculation.ltvCacRatio >= targetLtvCacRatio
                          ? "text-[var(--logistics)]"
                          : "text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      LTV:CAC Target
                    </span>
                  </div>
                  <p className="text-sm mt-2">
                    Current: {calculation.ltvCacRatio.toFixed(1)}:1 | Target: {targetLtvCacRatio.toFixed(1)}:1
                  </p>
                  {calculation.ltvCacRatio < targetLtvCacRatio && (
                    <p className="text-xs mt-1">
                      Need to improve by{" "}
                      {(
                        ((targetLtvCacRatio - calculation.ltvCacRatio) / calculation.ltvCacRatio) *
                        100
                      ).toFixed(0)}
                      %
                    </p>
                  )}
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    calculation.paybackPeriod <= targetPaybackMonths
                      ? "bg-[var(--logistics)]/10 border border-[var(--logistics)]/20"
                      : "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {calculation.paybackPeriod <= targetPaybackMonths ? (
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                    <span
                      className={`font-medium ${
                        calculation.paybackPeriod <= targetPaybackMonths
                          ? "text-[var(--logistics)]"
                          : "text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      Payback Target
                    </span>
                  </div>
                  <p className="text-sm mt-2">
                    Current: {calculation.paybackPeriod.toFixed(1)}mo | Target: {targetPaybackMonths}mo
                  </p>
                  {calculation.paybackPeriod > targetPaybackMonths && (
                    <p className="text-xs mt-1">
                      Need to reduce by{" "}
                      {(
                        ((calculation.paybackPeriod - targetPaybackMonths) /
                          calculation.paybackPeriod) *
                        100
                      ).toFixed(0)}
                      %
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-[var(--ocean)]" />
                Marketing Channel Performance
              </CardTitle>
              <CardDescription>Configure and compare marketing channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {marketingChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className={`p-4 rounded-lg border transition-all ${
                      channels[channel.id]?.enabled
                        ? "border-[var(--ocean)]/30 bg-muted/30"
                        : "border-border/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: channel.color }}
                        />
                        <span className="font-medium">{channel.name}</span>
                        <Badge variant="outline" className="text-xs">
                          Avg CAC: ${channel.avgCac}
                        </Badge>
                      </div>
                      <Switch
                        checked={channels[channel.id]?.enabled || false}
                        onCheckedChange={(checked) => updateChannel(channel.id, "enabled", checked)}
                      />
                    </div>

                    {channels[channel.id]?.enabled && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <Label className="text-xs">Spend</Label>
                          <Input
                            type="number"
                            value={channels[channel.id]?.spend || 0}
                            onChange={(e) =>
                              updateChannel(channel.id, "spend", parseFloat(e.target.value) || 0)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Conversions</Label>
                          <Input
                            type="number"
                            value={channels[channel.id]?.conversions || 0}
                            onChange={(e) =>
                              updateChannel(channel.id, "conversions", parseInt(e.target.value) || 0)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Channel CAC</Label>
                          <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center">
                            <span className="font-bold">
                              {formatMoney(
                                (channels[channel.id]?.conversions || 0) > 0
                                  ? (channels[channel.id]?.spend || 0) /
                                      (channels[channel.id]?.conversions || 1)
                                  : 0
                              )}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">vs Benchmark</Label>
                          <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center">
                            <span
                              className={`font-bold ${
                                (channels[channel.id]?.conversions || 0) > 0 &&
                                (channels[channel.id]?.spend || 0) /
                                  (channels[channel.id]?.conversions || 1) <
                                  channel.avgCac
                                  ? "text-[var(--logistics)]"
                                  : "text-amber-500"
                              }`}
                            >
                              {channels[channel.id]?.conversions &&
                              channels[channel.id]?.conversions > 0 ? (
                                <>
                                  {(
                                    ((channels[channel.id]?.spend || 0) /
                                      (channels[channel.id]?.conversions || 1) -
                                      channel.avgCac) /
                                    channel.avgCac
                                  ).toFixed(0)}
                                  %
                                </>
                              ) : (
                                "N/A"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Channel Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Channel CAC Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Channel</th>
                      <th className="text-right py-3 px-2">Spend</th>
                      <th className="text-right py-3 px-2">Conversions</th>
                      <th className="text-right py-3 px-2">CAC</th>
                      <th className="text-right py-3 px-2">Benchmark</th>
                      <th className="text-right py-3 px-2">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculation.channelBreakdown.map((ch) => {
                      const channel = marketingChannels.find((c) => c.name === ch.channel);
                      const benchmark = channel?.avgCac || 0;
                      const performance = benchmark > 0 ? ((benchmark - ch.cac) / benchmark) * 100 : 0;

                      return (
                        <tr key={ch.channel} className="border-b">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: ch.color }}
                              />
                              {ch.channel}
                            </div>
                          </td>
                          <td className="text-right py-3 px-2">{formatMoney(ch.spend)}</td>
                          <td className="text-right py-3 px-2">{ch.conversions}</td>
                          <td className="text-right py-3 px-2 font-bold">{formatMoney(ch.cac)}</td>
                          <td className="text-right py-3 px-2 text-muted-foreground">
                            ${benchmark}
                          </td>
                          <td className="text-right py-3 px-2">
                            <Badge
                              className={
                                performance > 0
                                  ? "bg-[var(--logistics)]"
                                  : performance > -20
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }
                            >
                              {performance > 0 ? "+" : ""}
                              {performance.toFixed(0)}%
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="font-bold bg-muted/50">
                      <td className="py-3 px-2">Total</td>
                      <td className="text-right py-3 px-2">
                        {formatMoney(calculation.totalMarketingSpend)}
                      </td>
                      <td className="text-right py-3 px-2">
                        {calculation.channelBreakdown.reduce((sum, ch) => sum + ch.conversions, 0)}
                      </td>
                      <td className="text-right py-3 px-2 text-[var(--ocean)]">
                        {formatMoney(calculation.cac)}
                      </td>
                      <td className="text-right py-3 px-2">-</td>
                      <td className="text-right py-3 px-2">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Industry Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--ocean)]" />
                Industry CAC Benchmarks
              </CardTitle>
              <CardDescription>Compare your CAC against industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Industry</th>
                      <th className="text-right py-3 px-2">Avg CAC</th>
                      <th className="text-right py-3 px-2">Avg LTV</th>
                      <th className="text-right py-3 px-2">Avg LTV:CAC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {industryBenchmarks.map((bench) => (
                      <tr key={bench.industry} className="border-b">
                        <td className="py-3 px-2 font-medium">{bench.industry}</td>
                        <td className="text-right py-3 px-2">${bench.avgCac}</td>
                        <td className="text-right py-3 px-2">${bench.avgLtv}</td>
                        <td className="text-right py-3 px-2">
                          <Badge variant="outline">{bench.avgRatio.toFixed(1)}:1</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* What is CAC */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                What is Customer Acquisition Cost (CAC)?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                Customer Acquisition Cost (CAC) is one of the most critical metrics for any business seeking sustainable growth. It represents the total cost incurred to acquire a new customer, encompassing all marketing and sales expenses over a specific period. Understanding CAC is fundamental to evaluating the efficiency of your growth strategy and determining whether your business model is economically viable. Without a clear grasp of CAC, companies risk spending more to acquire customers than those customers will ever generate in revenue, leading to a fundamentally unsustainable business model that will eventually collapse under its own weight.
              </p>
              <p>
                The CAC formula is straightforward but requires comprehensive data collection: CAC equals Total Marketing Costs plus Total Sales Costs, divided by the Number of New Customers Acquired during the measurement period. However, the simplicity of this formula belies the complexity of accurately capturing all relevant costs. Many businesses underestimate their true CAC by omitting hidden costs such as marketing software subscriptions, sales training expenses, content creation costs, and the allocated overhead of marketing and sales teams. A thorough CAC calculation should include advertising spend across all channels, content marketing and SEO investments, email marketing platform costs, creative and production expenses, agency fees and contractor costs, sales team salaries and commissions, CRM and sales enablement tools, and any other direct costs associated with customer acquisition.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-mono text-center text-lg">
                  CAC = (Total Marketing + Sales Costs) ÷ Number of New Customers
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-[var(--ocean)]/10 rounded-lg border border-[var(--ocean)]/20">
                  <h4 className="font-medium text-[var(--ocean)] mb-2">Marketing Costs Include:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Paid advertising (Google, Facebook, LinkedIn, etc.)</li>
                    <li>• Content marketing and SEO investments</li>
                    <li>• Email marketing platforms and tools</li>
                    <li>• Marketing automation software</li>
                    <li>• Creative and production costs</li>
                    <li>• Agency fees and contractor payments</li>
                    <li>• Event sponsorships and trade shows</li>
                  </ul>
                </div>
                <div className="p-4 bg-[var(--logistics)]/10 rounded-lg border border-[var(--logistics)]/20">
                  <h4 className="font-medium text-[var(--logistics)] mb-2">Sales Costs Include:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Sales team salaries and benefits</li>
                    <li>• Commissions and performance bonuses</li>
                    <li>• Sales training and development programs</li>
                    <li>• CRM and sales enablement tools</li>
                    <li>• Travel and entertainment expenses</li>
                    <li>• Sales collateral and presentations</li>
                    <li>• Onboarding and customer success costs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why CAC Matters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--logistics)]" />
                Why CAC Matters for Your Business
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                Customer Acquisition Cost serves as a critical health indicator for any business, providing insights that extend far beyond simple cost accounting. At its core, CAC reveals whether your business model is fundamentally sound and scalable. When analyzed alongside Customer Lifetime Value (LTV), it tells you whether each new customer represents a profitable investment or a growing liability. This relationship between acquisition cost and customer value determines the viability of your growth strategy and influences everything from pricing decisions to marketing budget allocation.
              </p>
              <p>
                The strategic importance of CAC extends to investor relations and fundraising. Sophisticated investors scrutinize CAC metrics to assess business efficiency and growth potential. A company with a high CAC relative to LTV may struggle to raise capital, as investors recognize the inherent limitations of such a model. Conversely, businesses with efficient customer acquisition often command premium valuations and attract growth capital more easily. Beyond fundraising, CAC directly impacts cash flow and working capital requirements. High CAC businesses need substantial capital to fund growth, as customer acquisition investments must be made months or years before the resulting revenue materializes. This creates a significant barrier to scaling and can trap businesses in a cycle of perpetual fundraising.
              </p>
              <p>
                Understanding your CAC also enables data-driven optimization of marketing spend. By calculating CAC at the channel level, you can identify which acquisition strategies deliver the best return on investment and reallocate budgets accordingly. This granularity reveals opportunities to reduce overall CAC by shifting resources from underperforming channels to those delivering efficient customer acquisition. Additionally, tracking CAC trends over time helps identify market shifts, competitive pressures, or operational inefficiencies before they become critical problems. Rising CAC often signals increasing competition, market saturation, or declining marketing effectiveness, allowing proactive intervention.
              </p>
            </CardContent>
          </Card>

          {/* CAC vs LTV Relationship */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                The Critical CAC vs LTV Relationship
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                The relationship between Customer Acquisition Cost and Customer Lifetime Value represents the cornerstone of sustainable business economics. While CAC tells you how much you spend to acquire a customer, LTV reveals how much revenue that customer will generate over their entire relationship with your business. The ratio between these two metrics provides a clear verdict on your unit economics and determines whether growth creates or destroys value. This relationship is so fundamental that it has become the primary lens through which investors and analysts evaluate business models.
              </p>
              <p>
                The industry-standard benchmark for a healthy LTV:CAC ratio is 3:1, meaning customers should generate at least three times their acquisition cost in lifetime value. This ratio provides sufficient margin to cover operational costs, generate profit, and fund future growth. Ratios below 3:1 may indicate marginal profitability but leave little room for error or market fluctuations. More concerning, ratios below 1:1 indicate a fundamentally broken business model where you lose money on every customer acquired. Such businesses cannot grow their way to profitability, as each new customer increases losses rather than profits.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-1">
                    Below 1:1
                  </p>
                  <p className="text-xl font-bold text-red-500">Danger Zone</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    You&apos;re losing money on every customer. The business model needs fundamental restructuring.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mb-1">
                    1:1 - 3:1
                  </p>
                  <p className="text-xl font-bold text-amber-500">Needs Improvement</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    You&apos;re profitable but margins are thin. Focus on reducing CAC or increasing LTV.
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium mb-1">
                    3:1 or Higher
                  </p>
                  <p className="text-xl font-bold text-emerald-500">Healthy</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    Strong unit economics. You can confidently invest in growth and scale.
                  </p>
                </div>
              </div>
              <p className="mt-4">
                It&apos;s worth noting that optimal LTV:CAC ratios vary by industry and business model. E-commerce businesses often target 4:1 or higher due to typically lower customer lifetime values and competitive margins. SaaS companies frequently aim for 3:1 to 5:1, while enterprise B2B companies with long sales cycles might accept slightly lower ratios if customer values are extremely high. However, extremely high ratios (above 8:1) might indicate under-investment in growth, potentially leaving market share on the table. The key is finding the right balance that allows for sustainable, profitable growth.
              </p>
            </CardContent>
          </Card>

          {/* Industry Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--logistics)]" />
                Industry Benchmarks and Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                Understanding industry benchmarks helps contextualize your CAC performance and set realistic targets. Different industries have vastly different customer acquisition economics due to variations in customer value, sales complexity, and competitive dynamics. E-commerce businesses typically see CAC ranging from $10 to $50, while SaaS companies often report CAC between $100 and $500 depending on target market. Enterprise software companies may have CAC exceeding $10,000 due to long sales cycles and high-touch sales processes. These differences underscore the importance of benchmarking against industry peers rather than applying generic standards.
              </p>
              <p>
                Beyond raw CAC numbers, industry benchmarks reveal important patterns in LTV:CAC ratios and payback periods. Subscription businesses typically target 12-month payback periods, while e-commerce companies often expect immediate profitability on first purchase. Understanding these norms helps you identify whether your acquisition efficiency is competitive within your market. However, benchmarks should serve as starting points for analysis rather than absolute targets. Your optimal CAC depends on your specific business model, pricing strategy, customer retention rates, and growth objectives. The most successful companies use benchmarks to identify improvement opportunities while recognizing that superior performance comes from optimizing for their unique circumstances.
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Industry</th>
                      <th className="text-right py-2">Typical CAC</th>
                      <th className="text-right py-2">Avg LTV:CAC</th>
                      <th className="text-right py-2">Payback Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">E-Commerce</td>
                      <td className="text-right py-2">$10 - $50</td>
                      <td className="text-right py-2">3:1 - 5:1</td>
                      <td className="text-right py-2">Immediate</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">SaaS (SMB)</td>
                      <td className="text-right py-2">$100 - $300</td>
                      <td className="text-right py-2">3:1 - 4:1</td>
                      <td className="text-right py-2">6-12 months</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">SaaS (Enterprise)</td>
                      <td className="text-right py-2">$1,000 - $10,000+</td>
                      <td className="text-right py-2">3:1 - 5:1</td>
                      <td className="text-right py-2">12-18 months</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Fintech</td>
                      <td className="text-right py-2">$100 - $400</td>
                      <td className="text-right py-2">3:1 - 4:1</td>
                      <td className="text-right py-2">6-12 months</td>
                    </tr>
                    <tr>
                      <td className="py-2">Consumer Apps</td>
                      <td className="text-right py-2">$1 - $10</td>
                      <td className="text-right py-2">2:1 - 4:1</td>
                      <td className="text-right py-2">Varies</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips for Reducing CAC
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
                    className="p-4 bg-muted/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-start gap-3">
                      <tip.icon className="h-5 w-5 text-[var(--ocean)] mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
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
                <XCircle className="h-5 w-5 text-red-500" />
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
                    className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/50"
                  >
                    <div className="flex items-start gap-3">
                      <mistake.icon className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-700 dark:text-red-300">{mistake.title}</h4>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{mistake.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
              <CardDescription>Everything you need to know about Customer Acquisition Cost</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqData.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-lg px-4 bg-muted/30"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-[var(--ocean)]">{index + 1}</span>
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-11">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--logistics)]" />
                Quick Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">CAC Formula</h4>
                  <p className="font-mono text-sm bg-background p-2 rounded">
                    CAC = (Marketing + Sales Costs) ÷ New Customers
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">LTV:CAC Benchmark</h4>
                  <p className="text-2xl font-bold text-[var(--logistics)]">3:1</p>
                  <p className="text-xs text-muted-foreground">Minimum healthy ratio</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Payback Period</h4>
                  <p className="text-2xl font-bold text-[var(--ocean)]">12 mo</p>
                  <p className="text-xs text-muted-foreground">Maximum recommended</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t">
        <Button variant="outline" onClick={resetForm} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset Calculator
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportResults} className="gap-2">
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
          <Button onClick={shareResults} className="gap-2 bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
}
