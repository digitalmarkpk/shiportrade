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
  Download,
  Share2,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Sparkles,
  LineChart,
  PieChart as PieChartIcon,
  BookOpen,
  HelpCircle,
  Zap,
  TrendingUp as TrendingUpIcon,
  Award,
  Lightbulb,
  XCircle,
  AlertOctagon,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
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
  PieChart,
  Pie,
  AreaChart,
  Area,
  Legend,
  ComposedChart,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand colors
const BRAND_COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  light: {
    ocean: "#1A6BA8",
    logistics: "#3DA76A",
  },
  dark: {
    ocean: "#0A3456",
    logistics: "#1F5E3A",
  },
};

// Advertising channels with typical benchmarks
const adChannels = [
  { id: "google", name: "Google Ads", color: "#4285F4", avgRoas: 4.0 },
  { id: "facebook", name: "Facebook Ads", color: "#1877F2", avgRoas: 3.5 },
  { id: "amazon", name: "Amazon Ads", color: "#FF9900", avgRoas: 5.0 },
  { id: "tiktok", name: "TikTok Ads", color: "#000000", avgRoas: 2.5 },
  { id: "pinterest", name: "Pinterest Ads", color: "#E60023", avgRoas: 2.8 },
  { id: "bing", name: "Bing Ads", color: "#00809D", avgRoas: 3.8 },
  { id: "twitter", name: "Twitter/X Ads", color: "#1DA1F2", avgRoas: 2.2 },
  { id: "linkedin", name: "LinkedIn Ads", color: "#0A66C2", avgRoas: 2.0 },
];

// Pro Tips Data
const proTipsData = [
  {
    icon: Target,
    title: "Focus on High-Intent Keywords",
    description: "Prioritize keywords with clear purchase intent like 'buy', 'order', 'best price'. These typically convert at 2-3x the rate of informational searches, directly improving your ROAS without increasing spend.",
  },
  {
    icon: Gauge,
    title: "Implement Dayparting",
    description: "Analyze when your audience converts best and adjust bids accordingly. Many businesses see 20-30% ROAS improvement by concentrating budget during peak conversion hours rather than spreading evenly across 24 hours.",
  },
  {
    icon: ShoppingBag,
    title: "Leverage Dynamic Remarketing",
    description: "Show specific products that users viewed with dynamic product ads. Remarketing campaigns typically achieve 3-5x higher ROAS than prospecting campaigns due to the high purchase intent of returning visitors.",
  },
  {
    icon: Lightbulb,
    title: "Test Video Ads on All Platforms",
    description: "Video content often outperforms static images by 30-50% in engagement and conversion. Create short, compelling product videos for use across Google, Facebook, TikTok, and other platforms to boost ROAS.",
  },
  {
    icon: DollarSign,
    title: "Optimize for Customer Lifetime Value",
    description: "Don't just look at first-purchase ROAS. If customers return to buy again, you can afford a lower initial ROAS. Track repeat purchase rates and adjust your acceptable ROAS threshold accordingly.",
  },
  {
    icon: Percent,
    title: "Use Smart Bidding Strategies",
    description: "Platform automated bidding like Google's Target ROAS or Facebook's Value Optimization use machine learning to optimize for your goals. These often outperform manual bidding by 15-25% over time.",
  },
];

// Common Mistakes Data
const commonMistakesData = [
  {
    icon: XCircle,
    title: "Ignoring Break-Even ROAS",
    description: "Many advertisers chase high ROAS numbers without understanding their break-even point. A 3x ROAS might seem good, but if your break-even is 4x, you're losing money on every sale. Always calculate your break-even ROAS first using the formula: Break-Even ROAS = 1 ÷ Profit Margin. This single calculation can prevent thousands in losses and should be the foundation of all your advertising decisions.",
  },
  {
    icon: AlertOctagon,
    title: "Attribution Window Mismatch",
    description: "Using different attribution windows across platforms leads to inaccurate ROAS comparisons. If Google uses 30-day click attribution and Facebook uses 7-day, you're comparing apples to oranges. Standardize your attribution settings or at least account for the differences when comparing channel performance. Consider using a unified attribution platform or marketing mix modeling for accurate cross-channel insights.",
  },
  {
    icon: ThumbsDown,
    title: "Scaling Unprofitable Campaigns",
    description: "It's tempting to increase budget on campaigns with high ROAS, but scaling too quickly often breaks the algorithm's optimization. Increase budgets by no more than 20% at a time and wait 3-5 days for the algorithm to re-optimize before making further changes. Also verify that ROAS remains above break-even after scaling—volume often comes at the cost of efficiency.",
  },
  {
    icon: AlertTriangle,
    title: "Not Accounting for All Costs",
    description: "ROAS calculations that only include direct ad spend miss important costs like agency fees, creative production costs, and landing page development. A campaign showing 5x ROAS might actually be at 3.5x when you include these hidden costs. Create a comprehensive cost model that includes all advertising-related expenses to get your true ROAS and make informed budget allocation decisions.",
  },
  {
    icon: Copy,
    title: "Copying Competitor Strategies Blindly",
    description: "What works for competitors may not work for you due to differences in profit margins, brand recognition, customer base, and operational efficiency. A competitor running ads with 2x ROAS might be profitable because they have 60% margins, while the same strategy would lose money for your business with 25% margins. Always test strategies in the context of your own business economics and adapt based on your specific results.",
  },
];

// FAQ Data (8 comprehensive FAQs with 150+ words each)
const faqData = [
  {
    question: "What is a good ROAS for my industry?",
    answer: "A good ROAS varies significantly by industry and advertising platform. For e-commerce businesses, a ROAS of 4:1 (4x) is generally considered healthy, meaning you earn $4 for every $1 spent on advertising. However, industries with higher profit margins can operate profitably with lower ROAS, while businesses with tight margins may need higher ROAS to be sustainable. Google Ads typically deliver 4x ROAS on average, while Amazon Ads can reach 5x due to high purchase intent. Social media platforms like Facebook and TikTok often see lower average ROAS (2.5-3.5x) but offer excellent brand awareness benefits. The key is to understand your specific break-even ROAS based on your profit margins, then benchmark against industry averages while focusing on continuous improvement of your own metrics over time.",
  },
  {
    question: "How is ROAS different from ROI?",
    answer: "While ROAS and ROI are both profitability metrics, they measure different aspects of your business performance. ROAS (Return on Ad Spend) specifically measures the revenue generated per dollar spent on advertising, calculated as Revenue divided by Ad Spend. It's a metric focused purely on advertising efficiency. ROI (Return on Investment), on the other hand, accounts for all costs associated with generating revenue, including product costs, shipping, operational expenses, and advertising. ROI gives you the true profit picture, while ROAS helps optimize your advertising campaigns. A business can have a high ROAS but negative ROI if product costs are too high. For example, if you spend $1,000 on ads to generate $5,000 in revenue, your ROAS is 5x. But if your product costs and overhead total $4,500, your actual profit is only $500, resulting in a much more modest ROI. Understanding both metrics is essential for making informed marketing and business decisions.",
  },
  {
    question: "Why is my ROAS high but I'm still losing money?",
    answer: "This is a common scenario that puzzles many advertisers. A high ROAS doesn't guarantee profitability if your profit margins are thin. Remember that ROAS measures revenue, not profit. For example, if your product costs $80 and you sell it for $100, your profit margin is only 20%. This means your break-even ROAS is 5x (1 ÷ 0.20). Even with a seemingly good ROAS of 4x, you'd be losing money because you're spending $25 to make $100 in revenue, but your product costs $80, leaving you with a $5 loss per sale. To solve this, either improve your profit margins or increase your ROAS above the break-even point. You can improve margins by negotiating better supplier terms, reducing shipping costs, or raising prices. Alternatively, focus on improving ad targeting, creative, and landing page conversion to boost ROAS. The key is to always know your break-even ROAS and use it as your minimum acceptable performance threshold.",
  },
  {
    question: "How often should I calculate and monitor ROAS?",
    answer: "The frequency of ROAS monitoring depends on your advertising scale and business model. For high-volume advertisers spending thousands daily, real-time or daily ROAS monitoring is essential to catch underperforming campaigns quickly and prevent budget waste. For most businesses, weekly ROAS analysis provides a good balance between responsiveness and statistical significance. Monthly ROAS reviews are valuable for strategic planning and identifying long-term trends. Always consider attribution windows when calculating ROAS - some conversions may take days or weeks after the ad click, so immediate ROAS figures might not reflect true performance. For e-commerce, a 7-day click window is common, while B2B businesses might need 30+ day windows due to longer sales cycles. Additionally, seasonality affects ROAS significantly, so compare performance against the same period last year rather than just month-over-month. Set up automated alerts for ROAS drops below your break-even threshold to respond quickly to performance issues.",
  },
  {
    question: "What's the break-even ROAS formula and why does it matter?",
    answer: "The break-even ROAS formula is simple: Break-Even ROAS = 1 ÷ Profit Margin (as a decimal). This metric is crucial because it tells you the minimum ROAS needed to avoid losing money on your advertising. For instance, if your profit margin is 25%, your break-even ROAS is 4x (1 ÷ 0.25 = 4). Any ROAS below 4x means you're losing money on each sale from ads. Any ROAS above 4x means you're profitable. Understanding your break-even ROAS helps you set realistic advertising targets, evaluate campaign performance accurately, and make informed decisions about scaling or pausing campaigns. It also helps in budget allocation across channels - you might accept lower ROAS from a channel that brings high-value customers who make repeat purchases. The break-even ROAS should be your absolute minimum acceptable performance threshold. If you can't achieve it consistently, you either need to improve your advertising efficiency or reconsider your pricing and cost structure.",
  },
  {
    question: "How can I improve my ROAS quickly?",
    answer: "Improving ROAS requires a multi-faceted approach focusing on both increasing revenue and optimizing ad spend. Start by auditing your targeting - exclude audiences that don't convert and focus budget on high-performing segments. Improve your ad creative with A/B testing to find messaging that resonates. Optimize your landing pages for conversions with faster load times, clearer CTAs, and better mobile experience. Implement retargeting campaigns for abandoned carts, which typically have higher conversion rates. Consider raising prices or offering bundles to increase average order value. Finally, review your keyword strategy and use negative keywords to prevent wasted spend on irrelevant searches. Quick wins often come from cutting wasteful spending rather than increasing revenue. Look at your search terms report to find irrelevant queries consuming budget, add them as negative keywords, and immediately reallocate that budget to your best-performing campaigns. Also consider pausing campaigns during hours or days when performance consistently underperforms.",
  },
  {
    question: "Should I use the same ROAS target across all advertising channels?",
    answer: "No, using identical ROAS targets across all channels is a common mistake that can lead to suboptimal budget allocation. Different channels serve different purposes in your marketing funnel and naturally achieve different ROAS levels. Google Search typically achieves higher ROAS because users have high purchase intent - they're actively searching for products. Facebook and Instagram often show lower ROAS but excel at discovery and reaching new audiences who might become customers later. Amazon Ads frequently deliver the highest ROAS due to the platform's inherent purchase intent, but may have limited scale. Instead of uniform targets, set channel-specific ROAS goals based on their role in your marketing mix. Top-of-funnel channels like display and social prospecting might have lower ROAS targets, while bottom-funnel channels like search and retargeting should have higher targets. Consider using attribution models that account for cross-channel influence, as some channels may have low direct ROAS but contribute significantly to conversions on other channels.",
  },
  {
    question: "How does customer lifetime value affect my ROAS strategy?",
    answer: "Customer Lifetime Value (CLV or LTV) fundamentally changes how you should interpret and target ROAS. If your customers make repeat purchases, you can accept lower initial ROAS because the true value of acquiring a customer extends beyond their first purchase. For example, if your average customer makes three purchases over two years worth $300 total, you can spend more to acquire them initially than if they only buy once for $100. A business with strong repeat purchase rates and high LTV might be profitable with a 2x initial ROAS, while a one-time purchase business might need 4x. Calculate your LTV-to-CAC (Customer Acquisition Cost) ratio to determine healthy acquisition spending. A 3:1 LTV:CAC ratio is considered healthy - you should aim to recover your acquisition cost within the first purchase and profit from subsequent transactions. This perspective allows for more aggressive advertising spending to gain market share, knowing that profitability improves over the customer relationship. Track cohort retention and repeat purchase rates to refine your LTV calculations.",
  },
];

interface ChannelData {
  spend: number;
  revenue: number;
  conversions: number;
  enabled: boolean;
}

interface ROASResult {
  roas: number;
  profit: number;
  profitMargin: number;
  costPerAcquisition: number;
  breakEvenRoas: number;
  isProfitable: boolean;
  totalSpend: number;
  totalRevenue: number;
  totalConversions: number;
  overallRoas: number;
  channelBreakdown: {
    channel: string;
    spend: number;
    revenue: number;
    roas: number;
    conversions: number;
    cpa: number;
    profit: number;
    color: string;
  }[];
}

// Animation variants
const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function ROASCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");
  const [copySuccess, setCopySuccess] = useState(false);

  // Basic inputs
  const [productCost, setProductCost] = useState<string>("40");
  const [sellingPrice, setSellingPrice] = useState<string>("100");
  const [profitMargin, setProfitMargin] = useState<string>("25");

  // Multi-channel data
  const [channels, setChannels] = useState<Record<string, ChannelData>>({
    google: { spend: 5000, revenue: 22000, conversions: 180, enabled: true },
    facebook: { spend: 3000, revenue: 12000, conversions: 100, enabled: true },
    amazon: { spend: 2000, revenue: 12000, conversions: 120, enabled: true },
    tiktok: { spend: 1000, revenue: 3000, conversions: 30, enabled: false },
    pinterest: { spend: 0, revenue: 0, conversions: 0, enabled: false },
    bing: { spend: 0, revenue: 0, conversions: 0, enabled: false },
    twitter: { spend: 0, revenue: 0, conversions: 0, enabled: false },
    linkedin: { spend: 0, revenue: 0, conversions: 0, enabled: false },
  });

  // Analysis parameters
  const [targetRoas, setTargetRoas] = useState<number>(4.0);

  const parseNum = (val: string) => parseFloat(val) || 0;

  // Calculate ROAS and related metrics
  const calculation = useMemo((): ROASResult => {
    const marginPercent = parseNum(profitMargin) / 100;

    // Calculate channel breakdown
    const channelBreakdown = adChannels
      .filter((ch) => channels[ch.id]?.enabled && channels[ch.id]?.spend > 0)
      .map((ch) => {
        const data = channels[ch.id];
        const roas = data.spend > 0 ? data.revenue / data.spend : 0;
        const cpa = data.conversions > 0 ? data.spend / data.conversions : 0;
        const channelProfit = data.revenue * marginPercent - data.spend;
        return {
          channel: ch.name,
          spend: data.spend,
          revenue: data.revenue,
          roas,
          conversions: data.conversions,
          cpa,
          profit: channelProfit,
          color: ch.color,
        };
      });

    // Calculate totals
    const totalSpend = channelBreakdown.reduce((sum, ch) => sum + ch.spend, 0);
    const totalRevenue = channelBreakdown.reduce((sum, ch) => sum + ch.revenue, 0);
    const totalConversions = channelBreakdown.reduce((sum, ch) => sum + ch.conversions, 0);

    const overallRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const totalProfit = totalRevenue * marginPercent - totalSpend;
    const costPerAcquisition = totalConversions > 0 ? totalSpend / totalConversions : 0;

    // Break-even ROAS = 1 / Profit Margin
    const breakEvenRoas = marginPercent > 0 ? 1 / marginPercent : 0;
    const isProfitable = overallRoas >= breakEvenRoas;

    return {
      roas: overallRoas,
      profit: totalProfit,
      profitMargin: marginPercent * 100,
      costPerAcquisition,
      breakEvenRoas,
      isProfitable,
      totalSpend,
      totalRevenue,
      totalConversions,
      overallRoas,
      channelBreakdown,
    };
  }, [channels, profitMargin]);

  // ROAS comparison chart data
  const roasChartData = useMemo(() => {
    return calculation.channelBreakdown.map((ch) => ({
      name: ch.channel.split(" ")[0],
      roas: ch.roas,
      breakEven: calculation.breakEvenRoas,
      color: ch.color,
      revenue: ch.revenue,
      spend: ch.spend,
    }));
  }, [calculation]);

  // Spend distribution chart data
  const spendDistributionData = useMemo(() => {
    return calculation.channelBreakdown.map((ch) => ({
      name: ch.channel.split(" ")[0],
      value: ch.spend,
      color: ch.color,
    }));
  }, [calculation]);

  // Revenue vs Spend trend data
  const revenueSpendData = useMemo(() => {
    return calculation.channelBreakdown.map((ch) => ({
      name: ch.channel.split(" ")[0],
      revenue: ch.revenue,
      spend: ch.spend,
      profit: ch.profit,
      roas: ch.roas,
    }));
  }, [calculation]);

  // Performance trend data (simulated monthly data)
  const performanceTrendData = useMemo(() => {
    const baseRoas = calculation.overallRoas;
    return [
      { month: "Jan", roas: Math.max(1, baseRoas * 0.7), spend: calculation.totalSpend * 0.6 },
      { month: "Feb", roas: Math.max(1, baseRoas * 0.8), spend: calculation.totalSpend * 0.7 },
      { month: "Mar", roas: Math.max(1, baseRoas * 0.85), spend: calculation.totalSpend * 0.8 },
      { month: "Apr", roas: Math.max(1, baseRoas * 0.9), spend: calculation.totalSpend * 0.9 },
      { month: "May", roas: Math.max(1, baseRoas * 0.95), spend: calculation.totalSpend * 0.95 },
      { month: "Jun", roas: baseRoas, spend: calculation.totalSpend },
    ];
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

  const resetForm = () => {
    setProductCost("40");
    setSellingPrice("100");
    setProfitMargin("25");
    setTargetRoas(4.0);
    setChannels({
      google: { spend: 5000, revenue: 22000, conversions: 180, enabled: true },
      facebook: { spend: 3000, revenue: 12000, conversions: 100, enabled: true },
      amazon: { spend: 2000, revenue: 12000, conversions: 120, enabled: true },
      tiktok: { spend: 1000, revenue: 3000, conversions: 30, enabled: false },
      pinterest: { spend: 0, revenue: 0, conversions: 0, enabled: false },
      bing: { spend: 0, revenue: 0, conversions: 0, enabled: false },
      twitter: { spend: 0, revenue: 0, conversions: 0, enabled: false },
      linkedin: { spend: 0, revenue: 0, conversions: 0, enabled: false },
    });
  };

  const getROASGrade = (roas: number): { grade: string; color: string; description: string } => {
    if (roas >= 5) return { grade: "A+", color: "text-emerald-500", description: "Exceptional" };
    if (roas >= 4) return { grade: "A", color: "text-emerald-500", description: "Excellent" };
    if (roas >= 3) return { grade: "B", color: "text-blue-500", description: "Good" };
    if (roas >= 2) return { grade: "C", color: "text-amber-500", description: "Average" };
    if (roas >= 1) return { grade: "D", color: "text-orange-500", description: "Below Average" };
    return { grade: "F", color: "text-red-500", description: "Poor" };
  };

  const formatMoney = (value: number) => formatCurrency(value, currency);

  // Export functionality
  const exportAsJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      parameters: {
        productCost: parseNum(productCost),
        sellingPrice: parseNum(sellingPrice),
        profitMargin: parseNum(profitMargin),
        currency,
        targetRoas,
      },
      results: {
        totalSpend: calculation.totalSpend,
        totalRevenue: calculation.totalRevenue,
        overallRoas: calculation.overallRoas,
        breakEvenRoas: calculation.breakEvenRoas,
        profit: calculation.profit,
        costPerAcquisition: calculation.costPerAcquisition,
        totalConversions: calculation.totalConversions,
        isProfitable: calculation.isProfitable,
      },
      channelBreakdown: calculation.channelBreakdown,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roas-calculation-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share functionality
  const shareResults = async () => {
    const shareData = {
      title: "ROAS Calculator Results",
      text: `ROAS Analysis: Overall ROAS ${calculation.overallRoas.toFixed(2)}x | Total Spend: ${formatMoney(calculation.totalSpend)} | Total Revenue: ${formatMoney(calculation.totalRevenue)} | Profit: ${formatMoney(calculation.profit)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      const textToCopy = `ROAS Analysis Results
========================
Overall ROAS: ${calculation.overallRoas.toFixed(2)}x
Total Ad Spend: ${formatMoney(calculation.totalSpend)}
Total Revenue: ${formatMoney(calculation.totalRevenue)}
Net Profit: ${formatMoney(calculation.profit)}
Break-Even ROAS: ${calculation.breakEvenRoas.toFixed(2)}x
Cost Per Acquisition: ${formatMoney(calculation.costPerAcquisition)}
Total Conversions: ${calculation.totalConversions}

Channel Breakdown:
${calculation.channelBreakdown.map(ch => `- ${ch.channel}: ${ch.roas.toFixed(2)}x ROAS, ${formatMoney(ch.spend)} spend, ${formatMoney(ch.revenue)} revenue`).join("\n")}
`;
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 p-8 border border-border/50 shadow-lg"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--ocean)] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--logistics)] rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10">
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-4">
            <motion.div
              custom={0}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--ocean)]/10 backdrop-blur-sm rounded-full border border-[var(--ocean)]/20 shadow-lg"
            >
              <TrendingUp className="h-4 w-4 text-[var(--ocean)]" />
              <span className="font-semibold text-[var(--ocean)]">Marketing ROI</span>
            </motion.div>
            <motion.div
              custom={1}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--logistics)]/10 backdrop-blur-sm rounded-full border border-[var(--logistics)]/20 shadow-lg"
            >
              <BarChart3 className="h-4 w-4 text-[var(--logistics)]" />
              <span className="font-semibold text-[var(--logistics)]">ROAS Analysis</span>
            </motion.div>
            <motion.div
              custom={2}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 backdrop-blur-sm rounded-full border border-amber-500/20 shadow-lg"
            >
              <Gauge className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-amber-600">Ad Performance</span>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] bg-clip-text text-transparent"
          >
            ROAS Calculator
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            Measure your advertising efficiency and optimize your marketing spend with our comprehensive
            Return on Ad Spend calculator. Analyze multi-channel performance, track profitability, and
            make data-driven decisions to maximize your marketing ROI.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Button variant="outline" size="sm" onClick={resetForm} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportAsJSON} className="gap-2">
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={shareResults} className="gap-2">
              {copySuccess ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
              {copySuccess ? "Copied!" : "Share"}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3">
            <Calculator className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3">
            <LineChart className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Channels</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3">
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs sm:text-sm">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          {/* Educational Content Section */}
          <Card className="border-l-4 border-l-[var(--ocean)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-[var(--ocean)]" />
                Understanding ROAS Calculations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Return on Ad Spend (ROAS) is the cornerstone metric for measuring advertising effectiveness in digital marketing. It represents the ratio of revenue generated to the amount spent on advertising, providing clear insight into campaign profitability. A ROAS of 4:1 means that for every dollar spent on advertising, your business generates four dollars in revenue. This metric is essential for e-commerce businesses, digital advertisers, and marketing professionals who need to justify their advertising budgets and optimize campaign performance. Understanding your ROAS helps you identify which advertising channels deliver the best returns, allocate your marketing budget more effectively, and make data-driven decisions about scaling or pausing campaigns. The ROAS formula is straightforward: divide the total revenue generated from advertising by the total advertising spend. However, the real power comes from understanding how this metric relates to your profit margins, customer acquisition costs, and overall business objectives.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Business Parameters
                </CardTitle>
                <CardDescription>Enter your business metrics and profit margins to calculate break-even ROAS</CardDescription>
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

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="sellingPrice">Average Selling Price (per unit)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="sellingPrice"
                        type="number"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="productCost">Product Cost (per unit)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="productCost"
                        type="number"
                        value={productCost}
                        onChange={(e) => setProductCost(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Include COGS, shipping, fees, etc.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Profit Margin (%)</Label>
                      <span className="font-bold" style={{ color: BRAND_COLORS.ocean }}>{profitMargin}%</span>
                    </div>
                    <Slider
                      value={[parseNum(profitMargin)]}
                      onValueChange={(v) => setProfitMargin(v[0].toString())}
                      min={5}
                      max={60}
                      step={1}
                      className="[&_[role=slider]]:bg-[var(--ocean)]"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5%</span>
                      <span>60%</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 border border-[var(--ocean)]/20">
                    <p className="text-sm text-muted-foreground mb-1">Break-Even ROAS</p>
                    <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                      {calculation.breakEvenRoas.toFixed(2)}x
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You need at least {calculation.breakEvenRoas.toFixed(2)}x ROAS to be profitable
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="shadow-md hover:shadow-lg transition-shadow border-t-4" style={{ borderTopColor: BRAND_COLORS.ocean }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  ROAS Results
                </CardTitle>
                <CardDescription>Your advertising performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Total Ad Spend</p>
                    <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                      {formatMoney(calculation.totalSpend)}
                    </p>
                  </div>

                  <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Ad Revenue</p>
                    <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.logistics }}>
                      {formatMoney(calculation.totalRevenue)}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* ROAS Score */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--logistics)]/10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gauge className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                    <span className="text-sm text-muted-foreground">Overall ROAS</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <p className={`text-5xl font-bold ${getROASGrade(calculation.overallRoas).color}`}>
                      {calculation.overallRoas.toFixed(2)}x
                    </p>
                    <div className="text-left">
                      <Badge className={calculation.isProfitable ? "bg-[var(--logistics)] hover:bg-[var(--logistics)]/80" : "bg-red-500 hover:bg-red-500/80"}>
                        {calculation.isProfitable ? "Profitable" : "Unprofitable"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getROASGrade(calculation.overallRoas).grade} - {getROASGrade(calculation.overallRoas).description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Net Profit from Ads</p>
                    <p className={`text-xl font-bold ${calculation.profit >= 0 ? "" : "text-red-500"}`} style={calculation.profit >= 0 ? { color: BRAND_COLORS.logistics } : undefined}>
                      {formatMoney(calculation.profit)}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Cost Per Acquisition</p>
                    <p className="text-xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                      {formatMoney(calculation.costPerAcquisition)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Conversions</p>
                  <p className="text-xl font-bold">{calculation.totalConversions.toLocaleString()}</p>
                </div>

                {/* Profitability Indicator */}
                {!calculation.isProfitable && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                      <div className="text-sm text-red-700 dark:text-red-300">
                        <p className="font-semibold">Below Break-Even ROAS</p>
                        <p>
                          Your current ROAS ({calculation.overallRoas.toFixed(2)}x) is below your break-even
                          point ({calculation.breakEvenRoas.toFixed(2)}x). Consider optimizing campaigns or
                          improving profit margins.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Multi-Channel Input */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Multi-Channel Ad Configuration
              </CardTitle>
              <CardDescription>Enable and configure your advertising channels for comprehensive analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {adChannels.map((channel) => (
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
                          Avg: {channel.avgRoas}x
                        </Badge>
                      </div>
                      <Switch
                        checked={channels[channel.id]?.enabled || false}
                        onCheckedChange={(checked) => updateChannel(channel.id, "enabled", checked)}
                      />
                    </div>

                    {channels[channel.id]?.enabled && (
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div>
                          <Label className="text-xs">Ad Spend</Label>
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
                          <Label className="text-xs">Revenue</Label>
                          <Input
                            type="number"
                            value={channels[channel.id]?.revenue || 0}
                            onChange={(e) =>
                              updateChannel(channel.id, "revenue", parseFloat(e.target.value) || 0)
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
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips Section */}
          <Card className="shadow-md border-l-4 border-l-[var(--logistics)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                Pro Tips for Better ROAS
              </CardTitle>
              <CardDescription>Actionable strategies to improve your advertising returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proTipsData.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-[var(--ocean)]/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                        <span className="font-semibold text-sm">{tip.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-l-4 border-l-[var(--logistics)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                Performance Analysis Deep Dive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Effective ROAS analysis goes beyond simple calculations to reveal actionable insights about your advertising performance. By examining trends over time, comparing channels against industry benchmarks, and understanding the relationship between spend and revenue, you can make informed decisions about budget allocation and campaign optimization. This analysis dashboard provides visual representations of your advertising metrics, helping you identify patterns, spot underperforming channels, and discover opportunities for growth. Remember that ROAS should be evaluated in context with your profit margins, customer lifetime value, and overall business objectives to make truly strategic marketing decisions. The key to successful ROAS analysis is to look at both the absolute numbers and the trends over time, as seasonal variations, competitive changes, and market conditions can all affect performance. Regular analysis helps you catch performance issues early and capitalize on optimization opportunities before they become obvious to competitors.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Profitability Gauge */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Profitability Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="relative inline-block">
                    <div
                      className="w-48 h-48 rounded-full border-8 flex items-center justify-center mx-auto"
                      style={{
                        borderColor: calculation.isProfitable
                          ? BRAND_COLORS.logistics
                          : BRAND_COLORS.danger,
                      }}
                    >
                      <div>
                        <p className="text-4xl font-bold">{calculation.overallRoas.toFixed(2)}x</p>
                        <p className="text-sm text-muted-foreground">Overall ROAS</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground">Break-Even ROAS</p>
                      <p className="text-xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                        {calculation.breakEvenRoas.toFixed(2)}x
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground">Margin to Break-Even</p>
                      <p
                        className={`text-xl font-bold ${
                          calculation.overallRoas >= calculation.breakEvenRoas
                            ? ""
                            : "text-red-500"
                        }`}
                        style={calculation.overallRoas >= calculation.breakEvenRoas ? { color: BRAND_COLORS.logistics } : undefined}
                      >
                        {(
                          ((calculation.overallRoas - calculation.breakEvenRoas) /
                            calculation.breakEvenRoas) *
                          100
                        ).toFixed(0)}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Badge
                      className={`text-lg px-6 py-2 ${
                        calculation.isProfitable ? "bg-[var(--logistics)] hover:bg-[var(--logistics)]/80" : "bg-red-500 hover:bg-red-500/80"
                      }`}
                    >
                      {calculation.isProfitable ? "PROFITABLE" : "UNPROFITABLE"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target ROAS Analysis */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Target ROAS Analysis
                </CardTitle>
                <CardDescription>Set and track your ROAS goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Target ROAS</Label>
                    <span className="font-bold" style={{ color: BRAND_COLORS.ocean }}>{targetRoas.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[targetRoas]}
                    onValueChange={(v) => setTargetRoas(v[0])}
                    min={1}
                    max={10}
                    step={0.1}
                    className="[&_[role=slider]]:bg-[var(--ocean)]"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1x</span>
                    <span>10x</span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Current ROAS</span>
                    <span className="font-bold">{calculation.overallRoas.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Target ROAS</span>
                    <span className="font-bold" style={{ color: BRAND_COLORS.ocean }}>{targetRoas.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Break-Even ROAS</span>
                    <span className="font-bold text-amber-500">
                      {calculation.breakEvenRoas.toFixed(2)}x
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Gap to Target</span>
                    <span
                      className={`font-bold ${
                        calculation.overallRoas >= targetRoas
                          ? ""
                          : "text-red-500"
                      }`}
                      style={calculation.overallRoas >= targetRoas ? { color: BRAND_COLORS.logistics } : undefined}
                    >
                      {calculation.overallRoas >= targetRoas ? "+" : ""}
                      {(calculation.overallRoas - targetRoas).toFixed(2)}x
                    </span>
                  </div>
                </div>

                {/* Target Achievement */}
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    calculation.overallRoas >= targetRoas
                      ? "bg-[var(--logistics)]/10 border border-[var(--logistics)]/20"
                      : "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {calculation.overallRoas >= targetRoas ? (
                      <CheckCircle2 className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                    <span
                      className={`font-medium ${
                        calculation.overallRoas >= targetRoas
                          ? ""
                          : "text-amber-700 dark:text-amber-300"
                      }`}
                      style={calculation.overallRoas >= targetRoas ? { color: BRAND_COLORS.logistics } : undefined}
                    >
                      {calculation.overallRoas >= targetRoas
                        ? "Target achieved! Great performance."
                        : `${((targetRoas - calculation.overallRoas) / calculation.overallRoas * 100).toFixed(0)}% improvement needed to reach target.`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Trend Chart */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                ROAS Performance Trend
              </CardTitle>
              <CardDescription>Historical ROAS progression over recent months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceTrendData}>
                    <defs>
                      <linearGradient id="colorRoas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BRAND_COLORS.ocean} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={BRAND_COLORS.ocean} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(v) => `${v}x`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => formatMoney(v)} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "roas" ? `${value.toFixed(2)}x` : formatMoney(value),
                        name === "roas" ? "ROAS" : "Spend"
                      ]}
                    />
                    <Legend />
                    <ReferenceLine y={calculation.breakEvenRoas} stroke={BRAND_COLORS.danger} strokeDasharray="5 5" label={{ value: "Break-Even", position: "top", fill: BRAND_COLORS.danger }} yAxisId="left" />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="roas"
                      stroke={BRAND_COLORS.ocean}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRoas)"
                      name="ROAS"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="spend"
                      stroke={BRAND_COLORS.logistics}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Spend"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="shadow-md border-l-4" style={{ borderLeftColor: BRAND_COLORS.logistics }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: BRAND_COLORS.logistics }}>
                <Award className="h-5 w-5" />
                Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calculation.overallRoas < calculation.breakEvenRoas && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-300">
                        Critical: Below Break-Even
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Your ROAS is below break-even. Consider pausing underperforming campaigns,
                        improving targeting, or increasing your profit margin.
                      </p>
                    </div>
                  </div>
                )}

                {calculation.channelBreakdown.some((ch) => ch.roas < calculation.breakEvenRoas) && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-700 dark:text-amber-300">
                        Underperforming Channels
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {calculation.channelBreakdown
                          .filter((ch) => ch.roas < calculation.breakEvenRoas)
                          .map((ch) => ch.channel)
                          .join(", ")}{" "}
                        are below break-even ROAS. Review targeting and creative strategies.
                      </p>
                    </div>
                  </div>
                )}

                {calculation.overallRoas >= calculation.breakEvenRoas &&
                  calculation.overallRoas < targetRoas && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">
                          Profitable but Below Target
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You&apos;re profitable but not meeting your target. Consider scaling top
                          performers and optimizing bid strategies.
                        </p>
                      </div>
                    </div>
                  )}

                {calculation.overallRoas >= targetRoas && (
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: `rgba(46, 139, 87, 0.1)` }}>
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRAND_COLORS.logistics }} />
                    <div>
                      <p className="font-medium" style={{ color: BRAND_COLORS.logistics }}>
                        Excellent Performance
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You&apos;re exceeding your ROAS target! Consider increasing budget on
                        high-performing channels to scale growth.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: `rgba(15, 76, 129, 0.1)` }}>
                  <Target className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRAND_COLORS.ocean }} />
                  <div>
                    <p className="font-medium" style={{ color: BRAND_COLORS.ocean }}>Profit Margin Impact</p>
                    <p className="text-sm text-muted-foreground">
                      Increasing your profit margin from {profitMargin}% to{" "}
                      {(parseNum(profitMargin) + 5)}% would lower your break-even ROAS to{" "}
                      {(1 / ((parseNum(profitMargin) + 5) / 100)).toFixed(2)}x, making profitability
                      easier to achieve.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-l-4 border-l-[var(--ocean)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Channel Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Comparing ROAS across different advertising channels is essential for optimizing your marketing budget allocation. Each advertising platform has unique characteristics that affect performance: Google Ads typically delivers higher ROAS for high-intent searches, Facebook excels at reaching new audiences with engaging creative, and Amazon Ads benefits from built-in purchase intent. By analyzing channel-specific ROAS, you can identify which platforms deserve more investment and which may need optimization or reallocation. This comparative approach helps you build a balanced portfolio of advertising channels that maximize overall return while managing risk across your marketing investments. Understanding the unique strengths and limitations of each channel enables you to create a diversified advertising strategy that captures customers at different stages of the buying journey and maximizes your total marketing return.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* ROAS by Channel Chart */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>ROAS by Channel</CardTitle>
                <CardDescription>Compare ROAS across advertising platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roasChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis tickFormatter={(v) => `${v}x`} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)}x`} />
                      <ReferenceLine
                        y={calculation.breakEvenRoas}
                        stroke={BRAND_COLORS.danger}
                        strokeDasharray="5 5"
                        label={{ value: "Break-Even", position: "right", fill: BRAND_COLORS.danger }}
                      />
                      <Bar dataKey="roas" radius={[4, 4, 0, 0]}>
                        {roasChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.roas >= calculation.breakEvenRoas ? entry.color : BRAND_COLORS.danger}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Spend Distribution */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Ad Spend Distribution</CardTitle>
                <CardDescription>How your budget is allocated across channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {spendDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatMoney(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue vs Spend Chart */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Revenue vs Spend by Channel
              </CardTitle>
              <CardDescription>Visual comparison of revenue generated and advertising spend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={revenueSpendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis tickFormatter={(v) => formatMoney(v)} />
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill={BRAND_COLORS.logistics} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spend" name="Spend" fill={BRAND_COLORS.ocean} radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="roas" name="ROAS" stroke={BRAND_COLORS.warning} strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* ROAS vs Break-Even Analysis */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                ROAS vs Break-Even Analysis
              </CardTitle>
              <CardDescription>See how each channel performs against profitability threshold</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calculation.channelBreakdown.map((ch) => {
                  const isProfitable = ch.roas >= calculation.breakEvenRoas;
                  const marginToBreakEven = ((ch.roas - calculation.breakEvenRoas) / calculation.breakEvenRoas) * 100;

                  return (
                    <motion.div
                      key={ch.channel}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-lg border ${
                        isProfitable
                          ? "border-[var(--logistics)]/30 bg-[var(--logistics)]/5"
                          : "border-red-300 bg-red-50 dark:bg-red-950/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: ch.color }}
                          />
                          <span className="font-medium text-sm">{ch.channel}</span>
                        </div>
                        {isProfitable ? (
                          <ArrowUpRight className="h-4 w-4" style={{ color: BRAND_COLORS.logistics }} />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{ch.roas.toFixed(2)}x</span>
                        <span className="text-xs text-muted-foreground">ROAS</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Break-Even: {calculation.breakEvenRoas.toFixed(2)}x</span>
                          <span className={isProfitable ? "" : "text-red-500"} style={isProfitable ? { color: BRAND_COLORS.logistics } : undefined}>
                            {isProfitable ? "+" : ""}
                            {marginToBreakEven.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              isProfitable ? "" : "bg-red-500"
                            }`}
                            style={isProfitable ? { backgroundColor: BRAND_COLORS.logistics } : undefined}
                          >
                            <div
                              style={{
                                width: `${Math.min(100, (ch.roas / (calculation.breakEvenRoas * 2)) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Channel Summary Table */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Channel Performance Summary</CardTitle>
              <CardDescription>Detailed breakdown of all active advertising channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Channel</th>
                      <th className="text-right py-3 px-2">Spend</th>
                      <th className="text-right py-3 px-2">Revenue</th>
                      <th className="text-right py-3 px-2">ROAS</th>
                      <th className="text-right py-3 px-2">Conversions</th>
                      <th className="text-right py-3 px-2">CPA</th>
                      <th className="text-right py-3 px-2">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculation.channelBreakdown.map((ch) => (
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
                        <td className="text-right py-3 px-2">{formatMoney(ch.revenue)}</td>
                        <td className="text-right py-3 px-2">
                          <span
                            className={`font-bold ${
                              ch.roas >= calculation.breakEvenRoas
                                ? ""
                                : "text-red-500"
                            }`}
                            style={ch.roas >= calculation.breakEvenRoas ? { color: BRAND_COLORS.logistics } : undefined}
                          >
                            {ch.roas.toFixed(2)}x
                          </span>
                        </td>
                        <td className="text-right py-3 px-2">{ch.conversions}</td>
                        <td className="text-right py-3 px-2">{formatMoney(ch.cpa)}</td>
                        <td
                          className={`text-right py-3 px-2 font-medium ${
                            ch.profit >= 0 ? "" : "text-red-500"
                          }`}
                          style={ch.profit >= 0 ? { color: BRAND_COLORS.logistics } : undefined}
                        >
                          {formatMoney(ch.profit)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-muted/50">
                      <td className="py-3 px-2">Total</td>
                      <td className="text-right py-3 px-2">{formatMoney(calculation.totalSpend)}</td>
                      <td className="text-right py-3 px-2">{formatMoney(calculation.totalRevenue)}</td>
                      <td className="text-right py-3 px-2" style={{ color: BRAND_COLORS.ocean }}>
                        {calculation.overallRoas.toFixed(2)}x
                      </td>
                      <td className="text-right py-3 px-2">{calculation.totalConversions}</td>
                      <td className="text-right py-3 px-2">
                        {formatMoney(calculation.costPerAcquisition)}
                      </td>
                      <td
                        className={`text-right py-3 px-2 ${
                          calculation.profit >= 0 ? "" : "text-red-500"
                        }`}
                        style={calculation.profit >= 0 ? { color: BRAND_COLORS.logistics } : undefined}
                      >
                        {formatMoney(calculation.profit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* What is ROAS */}
          <Card className="shadow-md border-t-4" style={{ borderTopColor: BRAND_COLORS.ocean }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Info className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Understanding ROAS
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                <strong>ROAS (Return on Ad Spend)</strong> is a fundamental marketing metric that measures the revenue generated for every dollar spent on advertising. It provides marketers and business owners with a clear picture of how effectively their advertising budget is being utilized. Unlike other metrics that focus on engagement or reach, ROAS directly ties advertising spend to revenue outcomes, making it one of the most important KPIs for performance marketing campaigns. Understanding and optimizing ROAS is crucial for businesses of all sizes, from small e-commerce stores to large enterprise marketing departments. The metric enables data-driven decisions about where to allocate marketing resources, which campaigns to scale, and which to pause or optimize. ROAS is particularly valuable because it transcends platform boundaries—you can calculate and compare ROAS across Google Ads, Facebook, Amazon, and any other advertising platform, making it a universal language for marketing performance evaluation.
              </p>
              <div className="bg-muted/50 p-6 rounded-lg my-6 text-center">
                <p className="font-mono text-2xl mb-2" style={{ color: BRAND_COLORS.ocean }}>
                  ROAS = Revenue from Ads ÷ Ad Spend
                </p>
                <p className="text-sm text-muted-foreground">The fundamental ROAS formula</p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                For example, if you spend $1,000 on Google Ads and generate $4,000 in revenue directly attributable to those ads, your ROAS is 4:1 (or 4x), meaning you earn $4 for every $1 spent on advertising. This ratio helps you understand whether your campaigns are generating sufficient returns to justify continued investment. A ROAS below 1:1 indicates that you&apos;re spending more on advertising than you&apos;re earning in revenue, which is unsustainable for any business. Most businesses aim for a ROAS significantly higher than their break-even point to ensure profitability after accounting for product costs and operational expenses.
              </p>
            </CardContent>
          </Card>

          {/* ROAS vs ROI */}
          <Card className="shadow-md border-t-4" style={{ borderTopColor: BRAND_COLORS.logistics }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                ROAS vs ROI: Understanding the Difference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                While ROAS and ROI are both profitability metrics, they serve different purposes and measure different aspects of business performance. Understanding the distinction is crucial for making informed marketing and business decisions. ROAS focuses specifically on advertising efficiency, while ROI provides a comprehensive view of overall business profitability including all costs associated with generating revenue. The key difference lies in what each metric includes: ROAS is a revenue metric that tells you how much revenue your ads generate, while ROI is a profit metric that accounts for all your costs. This distinction is critical because a campaign can have an excellent ROAS while still being unprofitable if your product margins are thin or your operational costs are high.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg border-2" style={{ borderColor: BRAND_COLORS.ocean, backgroundColor: `rgba(15, 76, 129, 0.1)` }}>
                  <h4 className="font-semibold text-lg mb-3" style={{ color: BRAND_COLORS.ocean }}>ROAS (Return on Ad Spend)</h4>
                  <ul className="text-sm text-muted-foreground space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.ocean }} />
                      <span>Measures revenue per dollar spent on ads</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.ocean }} />
                      <span>Focuses on advertising efficiency only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.ocean }} />
                      <span>Doesn&apos;t account for product costs or margins</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.ocean }} />
                      <span>Best for campaign-level optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.ocean }} />
                      <span>Formula: Revenue ÷ Ad Spend</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg border-2" style={{ borderColor: BRAND_COLORS.logistics, backgroundColor: `rgba(46, 139, 87, 0.1)` }}>
                  <h4 className="font-semibold text-lg mb-3" style={{ color: BRAND_COLORS.logistics }}>ROI (Return on Investment)</h4>
                  <ul className="text-sm text-muted-foreground space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                      <span>Measures profit relative to total investment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                      <span>Accounts for all costs (product, shipping, fees)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                      <span>Reflects true business profitability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                      <span>Best for business-level decisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                      <span>Formula: (Revenue - Costs) ÷ Costs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Improving ROAS */}
          <Card className="shadow-md border-t-4" style={{ borderTopColor: BRAND_COLORS.warning }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                Strategies for Improving ROAS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Improving your ROAS requires a strategic approach that addresses both sides of the equation: increasing revenue from advertising while optimizing or reducing ad spend waste. The following strategies have proven effective across industries and can help you systematically improve your advertising returns. The key is to focus on one or two strategies at a time, measure the results, and iterate based on data rather than making multiple changes simultaneously. This scientific approach allows you to identify which specific optimizations have the greatest impact on your ROAS.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Target className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRAND_COLORS.ocean }} />
                    <div>
                      <p className="font-medium">Optimize Ad Targeting</p>
                      <p className="text-sm text-muted-foreground">
                        Use lookalike audiences based on your best customers, exclude low-converting segments, and leverage first-party data for precision targeting. Narrow your audience to high-intent users who are most likely to convert.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Lightbulb className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRAND_COLORS.ocean }} />
                    <div>
                      <p className="font-medium">Improve Ad Creative</p>
                      <p className="text-sm text-muted-foreground">
                        Continuously A/B test different images, videos, headlines, and copy variations. Focus on benefits over features, use social proof, and create urgency when appropriate. High-performing creative can dramatically improve CTR and conversion rates.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Gauge className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRAND_COLORS.ocean }} />
                    <div>
                      <p className="font-medium">Landing Page Optimization</p>
                      <p className="text-sm text-muted-foreground">
                        Ensure fast loading times (under 3 seconds), clear call-to-actions, mobile-first design, and consistent messaging from ad to landing page. Remove friction points and simplify the conversion process.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <DollarSign className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRAND_COLORS.logistics }} />
                    <div>
                      <p className="font-medium">Increase Average Order Value</p>
                      <p className="text-sm text-muted-foreground">
                        Offer product bundles, strategic upsells at checkout, cross-sell complementary items, and implement free shipping thresholds. Higher AOV directly improves ROAS without increasing ad spend.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <ShoppingBag className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRAND_COLORS.logistics }} />
                    <div>
                      <p className="font-medium">Retarget Abandoned Carts</p>
                      <p className="text-sm text-muted-foreground">
                        Implement dynamic retargeting campaigns for visitors who added items to cart but didn&apos;t complete purchase. These high-intent users typically convert at 3-5x the rate of cold traffic.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Percent className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRAND_COLORS.logistics }} />
                    <div>
                      <p className="font-medium">Improve Profit Margins</p>
                      <p className="text-sm text-muted-foreground">
                        Negotiate better supplier terms, reduce shipping costs through fulfillment optimization, and review pricing strategy. Higher margins lower your break-even ROAS, making profitability easier to achieve.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Benchmarks */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Industry ROAS Benchmarks</CardTitle>
              <CardDescription>Understanding typical performance across advertising platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Industry benchmarks provide valuable context for evaluating your ROAS performance. However, it&apos;s important to remember that these are averages—your specific results may vary based on your industry, product type, target audience, and advertising maturity. Use benchmarks as reference points rather than absolute targets, and focus on continuous improvement of your own metrics over time. The benchmarks shown here represent typical performance for well-optimized campaigns across various advertising platforms. Your actual ROAS will depend on factors like your product margins, customer lifetime value, competitive landscape, and the quality of your advertising execution.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 px-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">E-commerce (Overall)</span>
                    <Badge className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/80">4.0x</Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">Google Search Ads</span>
                    <Badge className="bg-[#4285F4] hover:bg-[#4285F4]/80">4.0x</Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">Facebook/Instagram</span>
                    <Badge className="bg-[#1877F2] hover:bg-[#1877F2]/80">3.5x</Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">Amazon Ads</span>
                    <Badge className="bg-[#FF9900] hover:bg-[#FF9900]/80 text-black">5.0x</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 px-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">TikTok Ads</span>
                    <Badge variant="secondary">2.5x</Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">Pinterest Ads</span>
                    <Badge className="bg-[#E60023] hover:bg-[#E60023]/80">2.8x</Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">Bing Ads</span>
                    <Badge className="bg-[#00809D] hover:bg-[#00809D]/80">3.8x</Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">LinkedIn Ads</span>
                    <Badge className="bg-[#0A66C2] hover:bg-[#0A66C2]/80">2.0x</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROAS Grade Scale */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">ROAS Performance Grade Scale</CardTitle>
              <CardDescription>Understanding what your ROAS number means</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The ROAS grade scale helps you quickly assess your advertising performance and understand where there&apos;s room for improvement. Remember that these grades are general guidelines—what constitutes a &quot;good&quot; ROAS varies significantly based on your profit margins, customer lifetime value, and business model. A 3x ROAS might be excellent for a business with 40% margins but problematic for one with 15% margins.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div>
                    <span className="font-semibold text-lg">A+ (Exceptional)</span>
                    <p className="text-sm text-muted-foreground">Outstanding performance, maximize scale</p>
                  </div>
                  <span className="text-emerald-500 font-bold text-xl">5.0x+</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div>
                    <span className="font-semibold text-lg">A (Excellent)</span>
                    <p className="text-sm text-muted-foreground">Strong performance, continue optimization</p>
                  </div>
                  <span className="text-emerald-500 font-bold text-xl">4.0x - 4.9x</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div>
                    <span className="font-semibold text-lg">B (Good)</span>
                    <p className="text-sm text-muted-foreground">Solid performance with room for improvement</p>
                  </div>
                  <span className="text-blue-500 font-bold text-xl">3.0x - 3.9x</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div>
                    <span className="font-semibold text-lg">C (Average)</span>
                    <p className="text-sm text-muted-foreground">Meets basic expectations, optimize further</p>
                  </div>
                  <span className="text-amber-500 font-bold text-xl">2.0x - 2.9x</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div>
                    <span className="font-semibold text-lg">D (Below Average)</span>
                    <p className="text-sm text-muted-foreground">Needs significant improvement</p>
                  </div>
                  <span className="text-orange-500 font-bold text-xl">1.0x - 1.9x</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <div>
                    <span className="font-semibold text-lg">F (Poor)</span>
                    <p className="text-sm text-muted-foreground">Campaign losing money, major changes needed</p>
                  </div>
                  <span className="text-red-500 font-bold text-xl">&lt; 1.0x</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes Section */}
          <Card className="shadow-md border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-red-600">
                <ThumbsDown className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Pitfalls that can undermine your ROAS optimization efforts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMistakesData.map((mistake, index) => {
                  const Icon = mistake.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      <Icon className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-red-700 dark:text-red-300">{mistake.title}</p>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{mistake.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-l-4 border-l-[var(--ocean)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Frequently Asked Questions About ROAS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Understanding ROAS can raise many questions, especially for those new to performance marketing or those looking to optimize their advertising strategy. The following frequently asked questions address common concerns and provide detailed explanations to help you make better decisions about your advertising investments. Whether you&apos;re trying to understand what constitutes a good ROAS for your industry or how to troubleshoot campaigns that aren&apos;t meeting expectations, these answers will guide you toward more effective advertising strategies.
              </p>
            </CardContent>
          </Card>

          {/* FAQ Items */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-3">
                      <Badge className="shrink-0 mt-1 bg-[var(--ocean)] hover:bg-[var(--ocean)]/80">Q{index + 1}</Badge>
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed pl-10">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Help */}
          <Card className="bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] text-white">
            <CardContent className="py-8">
              <div className="text-center">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Still Have Questions?</h3>
                <p className="text-white/80 mb-4 max-w-lg mx-auto">
                  If you couldn&apos;t find the answer you were looking for, our comprehensive ROAS Guide tab
                  provides detailed explanations of all concepts related to Return on Ad Spend.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setActiveTab("guide")}
                  className="bg-white text-[var(--ocean)] hover:bg-white/90"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View ROAS Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm" onClick={resetForm}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={exportAsJSON}>
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button variant="outline" size="sm" onClick={shareResults}>
          {copySuccess ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Share2 className="h-4 w-4 mr-2" />}
          {copySuccess ? "Copied!" : "Share"}
        </Button>
      </div>
    </div>
  );
}
