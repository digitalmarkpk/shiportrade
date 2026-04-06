"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Warehouse,
  Target,
  BarChart3,
  LineChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  AlertCircle,
  Info,
  Calendar,
  RefreshCw,
  Download,
  Shield,
  CheckSquare,
  XCircle,
  ChevronRight,
  Globe,
  Ship,
  Plane,
  Container,
  HelpCircle,
  Sparkles,
  Zap,
  Award,
  Users,
  Share2,
  RotateCcw,
  BookOpen,
  Settings,
  TrendingUp as TrendingUpIcon,
  PieChart,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  ComposedChart,
  Area,
  AreaChart,
  ReferenceLine,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Brand colors - Ocean Blue and Logistics Green
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  oceanLight: "#3B7CB8",
  logisticsLight: "#4CAF7D",
  oceanDark: "#0A3A61",
  logisticsDark: "#236B43",
  warning: "#F59E0B",
  danger: "#EF4444",
  critical: "#DC2626",
  neutral: "#6B7280",
  background: "#F8FAFC",
};

// Time periods for filtering
const TIME_PERIODS = [
  { id: "7d", name: "Last 7 Days" },
  { id: "30d", name: "Last 30 Days" },
  { id: "90d", name: "Last 90 Days" },
  { id: "12m", name: "Last 12 Months" },
  { id: "ytd", name: "Year to Date" },
] as const;

// Warehouse locations for filtering
const WAREHOUSES = [
  { id: "all", name: "All Warehouses" },
  { id: "shanghai", name: "Shanghai DC" },
  { id: "singapore", name: "Singapore Hub" },
  { id: "rotterdam", name: "Rotterdam Hub" },
  { id: "la", name: "Los Angeles DC" },
  { id: "dubai", name: "Dubai Free Zone" },
] as const;

// KPI Definitions with benchmarks
const KPI_BENCHMARKS = {
  otd: { name: "On-Time Delivery", target: 95, industry: 92, unit: "%", icon: Truck, description: "Percentage of orders delivered by the promised date" },
  fillRate: { name: "Fill Rate", target: 98, industry: 95, unit: "%", icon: Package, description: "Percentage of customer demand met from available stock" },
  inventoryTurnover: { name: "Inventory Turnover", target: 12, industry: 8, unit: "x", icon: RefreshCw, description: "Number of times inventory is sold and replaced per year" },
  perfectOrder: { name: "Perfect Order Rate", target: 90, industry: 85, unit: "%", icon: CheckSquare, description: "Orders delivered on-time, in-full, undamaged, with correct documentation" },
  orderAccuracy: { name: "Order Accuracy", target: 99, industry: 97, unit: "%", icon: Target, description: "Percentage of orders picked, packed, and shipped correctly" },
  warehouseUtilization: { name: "Warehouse Utilization", target: 85, industry: 80, unit: "%", icon: Warehouse, description: "Percentage of available warehouse space being used" },
  pickingAccuracy: { name: "Picking Accuracy", target: 99.5, industry: 98, unit: "%", icon: CheckCircle2, description: "Percentage of items picked correctly from inventory" },
  damagesRate: { name: "Damages Rate (Inverted)", target: 99, industry: 98, unit: "%", icon: Shield, description: "Percentage of shipments delivered without damage" },
};

// Sample KPI Data
const KPI_DATA = {
  current: {
    otd: 94.2,
    fillRate: 96.8,
    inventoryTurnover: 10.5,
    perfectOrder: 87.3,
    orderAccuracy: 98.1,
    warehouseUtilization: 82.4,
    pickingAccuracy: 98.9,
    damagesRate: 99.2,
  },
  previous: {
    otd: 92.8,
    fillRate: 95.5,
    inventoryTurnover: 9.8,
    perfectOrder: 85.1,
    orderAccuracy: 97.5,
    warehouseUtilization: 79.2,
    pickingAccuracy: 98.2,
    damagesRate: 98.8,
  },
  trend: {
    otd: "up" as const,
    fillRate: "up" as const,
    inventoryTurnover: "up" as const,
    perfectOrder: "up" as const,
    orderAccuracy: "up" as const,
    warehouseUtilization: "up" as const,
    pickingAccuracy: "up" as const,
    damagesRate: "up" as const,
  },
};

// Historical trend data (12 months)
const HISTORICAL_TRENDS = [
  { month: "Jan", otd: 91.2, fillRate: 94.5, inventoryTurnover: 8.5, perfectOrder: 82.1, orders: 12500, revenue: 2.1 },
  { month: "Feb", otd: 90.8, fillRate: 94.8, inventoryTurnover: 8.8, perfectOrder: 83.2, orders: 13200, revenue: 2.3 },
  { month: "Mar", otd: 92.1, fillRate: 95.1, inventoryTurnover: 9.1, perfectOrder: 84.5, orders: 14800, revenue: 2.5 },
  { month: "Apr", otd: 91.5, fillRate: 95.3, inventoryTurnover: 9.3, perfectOrder: 83.8, orders: 14100, revenue: 2.4 },
  { month: "May", otd: 92.8, fillRate: 95.6, inventoryTurnover: 9.5, perfectOrder: 84.9, orders: 15500, revenue: 2.6 },
  { month: "Jun", otd: 93.2, fillRate: 95.8, inventoryTurnover: 9.8, perfectOrder: 85.6, orders: 16200, revenue: 2.8 },
  { month: "Jul", otd: 92.5, fillRate: 96.1, inventoryTurnover: 10.0, perfectOrder: 85.2, orders: 15800, revenue: 2.7 },
  { month: "Aug", otd: 93.5, fillRate: 96.3, inventoryTurnover: 10.2, perfectOrder: 86.1, orders: 16500, revenue: 2.9 },
  { month: "Sep", otd: 93.8, fillRate: 96.5, inventoryTurnover: 10.4, perfectOrder: 86.8, orders: 17200, revenue: 3.0 },
  { month: "Oct", otd: 94.0, fillRate: 96.6, inventoryTurnover: 10.3, perfectOrder: 86.5, orders: 16800, revenue: 2.9 },
  { month: "Nov", otd: 93.9, fillRate: 96.7, inventoryTurnover: 10.5, perfectOrder: 87.0, orders: 17500, revenue: 3.1 },
  { month: "Dec", otd: 94.2, fillRate: 96.8, inventoryTurnover: 10.5, perfectOrder: 87.3, orders: 18200, revenue: 3.2 },
];

// Warehouse comparison data
const WAREHOUSE_COMPARISON = [
  { warehouse: "Shanghai DC", otd: 95.2, fillRate: 97.1, turnover: 11.2, perfectOrder: 88.5, score: 92, volume: 45000 },
  { warehouse: "Singapore Hub", otd: 96.1, fillRate: 98.2, turnover: 12.5, perfectOrder: 90.2, score: 95, volume: 38000 },
  { warehouse: "Rotterdam Hub", otd: 93.5, fillRate: 96.5, turnover: 10.1, perfectOrder: 86.8, score: 88, volume: 32000 },
  { warehouse: "Los Angeles DC", otd: 92.8, fillRate: 95.8, turnover: 9.8, perfectOrder: 85.2, score: 86, volume: 28000 },
  { warehouse: "Dubai Free Zone", otd: 94.5, fillRate: 96.2, turnover: 9.5, perfectOrder: 87.8, score: 89, volume: 22000 },
];

// Transport mode distribution
const TRANSPORT_MODES = [
  { name: "Sea Freight", value: 45, icon: Ship, color: COLORS.ocean },
  { name: "Air Freight", value: 25, icon: Plane, color: COLORS.logistics },
  { name: "Road Transport", value: 20, icon: Truck, color: COLORS.oceanLight },
  { name: "Rail", value: 10, icon: Container, color: COLORS.logisticsLight },
];

// Alerts data
const ALERTS = [
  {
    id: 1,
    type: "warning",
    kpi: "On-Time Delivery",
    message: "OTD at Shanghai DC dropped 2.1% this week due to port congestion",
    severity: "medium",
    timestamp: "2 hours ago",
    warehouse: "Shanghai DC",
  },
  {
    id: 2,
    type: "critical",
    kpi: "Inventory Turnover",
    message: "Slow-moving inventory detected: 15 SKUs with turnover < 2x",
    severity: "high",
    timestamp: "5 hours ago",
    warehouse: "All Warehouses",
  },
  {
    id: 3,
    type: "success",
    kpi: "Fill Rate",
    message: "Fill rate exceeded 98% target at Singapore Hub for 3 consecutive weeks",
    severity: "low",
    timestamp: "1 day ago",
    warehouse: "Singapore Hub",
  },
  {
    id: 4,
    type: "warning",
    kpi: "Perfect Order",
    message: "Documentation errors increased by 1.5% affecting perfect order rate",
    severity: "medium",
    timestamp: "1 day ago",
    warehouse: "Rotterdam Hub",
  },
  {
    id: 5,
    type: "info",
    kpi: "Warehouse Utilization",
    message: "Los Angeles DC approaching 90% capacity, consider redistribution",
    severity: "low",
    timestamp: "2 days ago",
    warehouse: "Los Angeles DC",
  },
];

// Improvement suggestions
const IMPROVEMENT_SUGGESTIONS = [
  {
    priority: "high",
    kpi: "Inventory Turnover",
    current: 10.5,
    target: 12,
    gap: -1.5,
    suggestion: "Implement ABC analysis and liquidate slow-moving inventory",
    impact: "Potential cost savings of $125,000/year in holding costs",
    effort: "Medium",
    timeline: "3-6 months",
  },
  {
    priority: "high",
    kpi: "Perfect Order Rate",
    current: 87.3,
    target: 90,
    gap: -2.7,
    suggestion: "Reduce documentation errors with automated validation system",
    impact: "Customer satisfaction improvement, reduced re-work costs",
    effort: "High",
    timeline: "6-12 months",
  },
  {
    priority: "medium",
    kpi: "On-Time Delivery",
    current: 94.2,
    target: 95,
    gap: -0.8,
    suggestion: "Optimize carrier selection and increase buffer time for congested routes",
    impact: "2% improvement in customer retention",
    effort: "Low",
    timeline: "1-3 months",
  },
  {
    priority: "medium",
    kpi: "Fill Rate",
    current: 96.8,
    target: 98,
    gap: -1.2,
    suggestion: "Increase safety stock for high-demand SKUs and improve demand forecasting",
    impact: "Reduced stockouts by 30%, improved customer loyalty",
    effort: "Medium",
    timeline: "3-6 months",
  },
  {
    priority: "low",
    kpi: "Picking Accuracy",
    current: 98.9,
    target: 99.5,
    gap: -0.6,
    suggestion: "Deploy barcode scanning verification at pack stations",
    impact: "Error reduction of 60%, reduced returns processing",
    effort: "Low",
    timeline: "1-3 months",
  },
];

// Performance summary insights
const PERFORMANCE_SUMMARY = {
  overallScore: 89,
  trend: "improving",
  strengths: [
    "Excellent damages rate control (99.2%)",
    "Strong order accuracy (98.1%)",
    "Consistent improvement trend across all KPIs",
    "Singapore Hub performing above targets",
  ],
  weaknesses: [
    "Inventory turnover below industry best practice",
    "Perfect order rate needs improvement",
    "OTD impacted by port congestion issues",
    "LA DC warehouse utilization approaching capacity",
  ],
  keyInsights: [
    "Overall logistics efficiency improved 3.2% vs last quarter",
    "Fill rate improved 1.3 percentage points YTD",
    "Cost per order reduced by 4.5% through process optimization",
    "Customer complaints decreased 12% due to improved accuracy",
  ],
};

// Radar chart data for overall performance
const RADAR_DATA = [
  { metric: "OTD", value: KPI_DATA.current.otd, target: 95, fullMark: 100 },
  { metric: "Fill Rate", value: KPI_DATA.current.fillRate, target: 98, fullMark: 100 },
  { metric: "Turnover", value: KPI_DATA.current.inventoryTurnover * 8, target: 96, fullMark: 100 },
  { metric: "Perfect Order", value: KPI_DATA.current.perfectOrder, target: 90, fullMark: 100 },
  { metric: "Accuracy", value: KPI_DATA.current.orderAccuracy, target: 99, fullMark: 100 },
  { metric: "Utilization", value: KPI_DATA.current.warehouseUtilization, target: 85, fullMark: 100 },
];

// Pro Tips for Logistics KPIs
const PRO_TIPS = [
  {
    icon: Target,
    title: "Set SMART KPI Targets",
    description: "Ensure your KPI targets are Specific, Measurable, Achievable, Relevant, and Time-bound. Avoid setting unrealistic goals that demotivate teams or targets that are too easy and don't drive improvement.",
  },
  {
    icon: TrendingUp,
    title: "Track Leading Indicators",
    description: "Don't just measure outcomes—track leading indicators that predict future performance. For example, monitor order processing time early to predict on-time delivery rates before shipments go out.",
  },
  {
    icon: Users,
    title: "Involve Frontline Teams",
    description: "Share KPI results with warehouse and logistics teams regularly. Frontline workers often have the best insights into root causes and practical solutions for improvement opportunities.",
  },
  {
    icon: Calendar,
    title: "Review Frequency Matters",
    description: "Match review frequency to the KPI's impact level. Critical metrics like fill rate should be reviewed daily, while strategic metrics like inventory turnover can be reviewed monthly.",
  },
  {
    icon: PieChart,
    title: "Contextualize Your Data",
    description: "Always present KPIs with context—comparisons to targets, historical performance, and industry benchmarks. A number without context is just data, not insight.",
  },
  {
    icon: RefreshCw,
    title: "Automate Data Collection",
    description: "Manual data collection is prone to errors and delays. Invest in WMS, TMS, and IoT sensors to capture real-time data automatically and enable proactive decision-making.",
  },
];

// Common Mistakes to Avoid
const COMMON_MISTAKES = [
  {
    icon: XCircle,
    title: "Measuring Too Many KPIs",
    description: "Tracking dozens of metrics leads to analysis paralysis and dilutes focus. Instead, identify 5-8 core KPIs that directly impact business objectives. Additional metrics can be secondary indicators reviewed less frequently. Quality of measurement matters more than quantity.",
  },
  {
    icon: AlertTriangle,
    title: "Ignoring Lagging Indicators",
    description: "Many organizations focus only on lagging indicators (like OTD) that show past performance. Balance these with leading indicators (like order processing time, picking accuracy) that help predict and prevent future issues before they impact customers.",
  },
  {
    icon: Minus,
    title: "Setting Static Targets",
    description: "Markets change, and so should your targets. Review and adjust KPI targets quarterly based on market conditions, capacity changes, and strategic priorities. Static targets become meaningless benchmarks that don't drive real improvement.",
  },
  {
    icon: TrendingDown,
    title: "Celebrating Without Context",
    description: "A KPI hitting target isn't always cause for celebration. Investigate whether the result is sustainable or caused by temporary factors (like reduced volume). Similarly, missing target might reflect strategic investments that will pay off later.",
  },
  {
    icon: AlertCircle,
    title: "Siloing KPI Data",
    description: "KPIs are interconnected—a decision to improve fill rate might increase inventory costs. Always consider trade-offs between metrics and use dashboards that show relationships between KPIs to make informed optimization decisions.",
  },
];

// Educational Content Sections
const EDUCATIONAL_CONTENT = {
  understandingKPIs: {
    title: "Understanding Logistics KPIs",
    content: `Key Performance Indicators (KPIs) in logistics are quantifiable measurements that help organizations track, analyze, and optimize their supply chain operations. Effective logistics KPIs provide visibility into operational efficiency, customer service levels, and cost management across the entire supply chain network. Unlike simple metrics, KPIs are strategically selected measurements that directly align with business objectives and drive decision-making at all levels of the organization.

The most valuable logistics KPIs share several characteristics: they are measurable with available data, actionable with clear improvement pathways, relevant to strategic goals, and timely enough to enable responsive decision-making. When selecting KPIs for your logistics operation, consider both operational metrics (like fill rate and picking accuracy) that measure day-to-day performance, and strategic metrics (like inventory turnover and perfect order rate) that reflect long-term operational health.

Modern logistics operations typically track KPIs across multiple dimensions: customer service (OTD, fill rate), operational efficiency (warehouse utilization, picking accuracy), financial performance (inventory turnover, cost per order), and quality (damages rate, order accuracy). A balanced scorecard approach ensures that improvement in one area doesn't come at the expense of another.`,
  },
  keyMetrics: {
    title: "Key Performance Metrics",
    content: `The eight core logistics KPIs tracked in this dashboard represent industry-standard measurements that cover the critical aspects of logistics performance. On-Time Delivery (OTD) measures the percentage of orders delivered by the promised date, directly impacting customer satisfaction and retention. Fill Rate indicates the ability to meet customer demand from available stock, balancing inventory costs against service levels.

Perfect Order Rate is perhaps the most comprehensive logistics KPI, requiring orders to meet four criteria simultaneously: on-time delivery, complete quantity, correct documentation, and no damage. This metric provides a holistic view of logistics excellence and correlates strongly with customer loyalty. Order Accuracy and Picking Accuracy focus on the warehouse operations, measuring the precision of fulfillment processes.

Inventory Turnover measures how efficiently capital is deployed in inventory, with higher turnover generally indicating better cash flow management and reduced obsolescence risk. Warehouse Utilization helps optimize space and resource allocation, while the Damages Rate inverted metric tracks the percentage of shipments delivered without damage. Together, these metrics provide a complete picture of logistics performance.`,
  },
  settingTargets: {
    title: "Setting KPI Targets",
    content: `Establishing effective KPI targets requires a balanced approach that considers industry benchmarks, historical performance, strategic objectives, and operational constraints. Start by analyzing your current baseline performance over a meaningful period (typically 3-6 months) to understand normal variation and identify seasonal patterns. Compare this baseline against industry benchmarks to identify performance gaps and improvement opportunities.

Target-setting should follow the SMART framework: Specific (exactly what will be measured), Measurable (quantifiable with available data), Achievable (realistic given resources and constraints), Relevant (aligned with business strategy), and Time-bound (with a clear deadline for achievement). Avoid the common mistake of setting targets based solely on industry averages—your specific market position, customer expectations, and competitive advantages should inform target levels.

Consider using a tiered target approach: minimum acceptable performance (below which corrective action is required), target performance (the goal to achieve), and stretch performance (exceptional achievement). This provides clear zones for performance evaluation and creates motivation for continuous improvement beyond simply hitting the basic target.`,
  },
  continuousImprovement: {
    title: "Continuous Improvement Approach",
    content: `Sustainable KPI improvement requires a systematic approach that combines data analysis, root cause identification, and structured problem-solving. Begin with regular performance reviews using visual dashboards that make trends and anomalies immediately apparent. When KPIs deviate from targets, use techniques like the 5 Whys or fishbone diagrams to identify root causes rather than treating symptoms.

Implement improvement initiatives using a structured methodology like DMAIC (Define, Measure, Analyze, Improve, Control) or PDCA (Plan, Do, Check, Act). Start with small pilot projects to test improvements before scaling across the organization. Document lessons learned and best practices to build organizational knowledge and accelerate future improvement efforts.

Technology plays a crucial role in continuous improvement. Warehouse Management Systems (WMS), Transportation Management Systems (TMS), and IoT sensors enable real-time data capture and analysis. Advanced analytics and machine learning can identify patterns and predict issues before they impact KPIs. However, technology investments should be guided by clear KPI improvement objectives, not implemented as ends in themselves. Regular benchmarking against industry leaders and participation in logistics networks provides external perspective on improvement opportunities.`,
  },
};

// Comprehensive FAQs (150+ words each)
const FAQS = [
  {
    question: "What is On-Time Delivery (OTD) and how is it calculated?",
    answer: `On-Time Delivery (OTD) is a critical logistics KPI that measures the percentage of orders delivered to customers by the promised delivery date. It's calculated as: (Orders delivered on time / Total orders) × 100. This metric directly reflects your ability to meet customer expectations and is one of the most important indicators of logistics performance.

The definition of "on-time" should be clearly established—typically orders delivered within the promised delivery window, whether that's a specific date or a time slot. Some organizations distinguish between "on-time to original promise" and "on-time to revised promise" when delivery commitments are updated. Our target is 95%, and we track this across all warehouses and transport modes to identify bottlenecks in the supply chain.

OTD is influenced by numerous factors including order processing time, warehouse picking and packing efficiency, carrier performance, and external factors like weather and customs delays. Improving OTD often requires addressing multiple process areas simultaneously. Low OTD rates can significantly impact customer satisfaction, repeat purchase rates, and overall business revenue. Regular OTD tracking enables proactive identification of recurring issues and carrier-specific performance patterns.`,
  },
  {
    question: "How does Fill Rate impact customer satisfaction and business performance?",
    answer: `Fill Rate measures the percentage of customer orders fulfilled from available stock without backorders or lost sales. It's calculated as: (Items shipped / Items ordered) × 100 for line fill rate, or (Complete orders shipped / Total orders) × 100 for order fill rate. A high fill rate directly correlates with customer satisfaction as customers receive their complete orders on the first shipment.

Our target fill rate is 98%, meaning we aim to fulfill 98% of ordered items from available stock. Low fill rates lead to partial shipments, backorders, and increased logistics costs from multiple shipments for the same order. Customers who experience frequent partial shipments often switch to competitors, making fill rate a key driver of customer retention and lifetime value.

The trade-off with fill rate is inventory investment—higher fill rates require more safety stock, which increases carrying costs and risk of obsolescence. The optimal fill rate depends on product characteristics, customer expectations, and competitive dynamics. For critical or high-margin items, companies often target 99%+ fill rates, while lower-priority items might have lower targets. Demand forecasting accuracy, supplier reliability, and safety stock optimization are key levers for improving fill rate without excessive inventory investment.`,
  },
  {
    question: "What strategies can improve Inventory Turnover?",
    answer: `Inventory Turnover measures how many times inventory is sold and replaced per year, calculated as: Cost of Goods Sold / Average Inventory Value. Our target is 12x, meaning inventory should turn over monthly. Higher turnover generally indicates efficient inventory management, better cash flow, and reduced obsolescence risk—though extremely high turnover might indicate insufficient safety stock.

To improve Inventory Turnover, implement ABC analysis to prioritize high-velocity items and reduce investment in slow-moving SKUs. Demand forecasting using statistical methods or machine learning can improve accuracy and reduce safety stock requirements. Consider just-in-time ordering for predictable demand items, and establish regular review cycles to identify and liquidate slow-moving inventory through promotions or alternative channels.

Working capital optimization often focuses on inventory turnover as inventory typically represents a significant portion of current assets. However, improvement efforts must balance turnover against service levels—aggressive inventory reduction that causes stockouts will damage customer relationships. Collaborative planning with suppliers, vendor-managed inventory (VMI) programs, and consignment arrangements can improve turnover while maintaining service levels. Regular SKU rationalization reviews help identify items that should be discontinued to improve overall turnover.`,
  },
  {
    question: "How do you calculate and improve Perfect Order Rate?",
    answer: `Perfect Order Rate measures orders that meet all quality standards simultaneously: delivered on time, in full quantity, with correct documentation, and no damage. It's calculated as: (Perfect orders / Total orders) × 100. This metric provides the most comprehensive view of logistics excellence as it requires excellence across multiple dimensions. Our target is 90%, which is challenging but achievable with strong processes.

Improving Perfect Order Rate requires addressing root causes across the order fulfillment process. For on-time delivery issues, examine carrier performance, order cut-off times, and warehouse processing efficiency. Quantity problems often stem from picking errors, inventory discrepancies, or inadequate safety stock. Documentation errors can be reduced through automated systems, templates, and validation checks. Damage prevention requires proper packaging, handling procedures, and carrier selection.

Many organizations find that Perfect Order Rate improves most effectively when individual component metrics are tracked and improved independently first. An order that fails any single criterion counts as imperfect, so addressing the weakest dimension often yields the fastest improvement. Root cause analysis of failed orders typically reveals patterns—certain products, routes, or carriers might have systematically lower perfect order rates that warrant targeted intervention.`,
  },
  {
    question: "What should I do when critical KPI alerts appear?",
    answer: `When critical KPI alerts appear, immediate response and systematic investigation are essential. Start by reviewing the alert details to understand scope and severity—does this affect a single warehouse or the entire network? Is it a sudden spike or a gradual deterioration? This context determines response urgency and escalation level.

For immediate containment, implement workarounds to minimize customer impact while investigating root causes. For example, if fill rate drops due to a supplier shortage, identify alternative suppliers or acceptable substitutes. Document the incident timeline and response actions for later analysis. After immediate containment, use structured problem-solving (5 Whys, fishbone diagrams) to identify root causes and prevent recurrence.

Critical alerts should trigger cross-functional response involving operations, planning, and possibly sales teams. Some alerts indicate systemic issues requiring process changes or capital investment, while others are isolated incidents. Establish escalation protocols that define who should be notified for different severity levels and response time expectations. Post-incident reviews should identify both immediate corrective actions and longer-term preventive measures to reduce future alert frequency.`,
  },
  {
    question: "How often should KPI benchmarks be updated?",
    answer: `KPI benchmarks should be reviewed quarterly and updated annually as part of the strategic planning process. Industry benchmarks are sourced from logistics industry reports, trade associations, and competitor analysis—these should be refreshed when new data becomes available, typically annually. Internal targets should be reviewed quarterly to ensure they remain relevant and achievable given current market conditions.

When updating benchmarks, consider several factors: changes in customer expectations (e.g., Amazon's influence on delivery speed expectations), competitive dynamics in your market, technological capabilities, and strategic priorities. A company pursuing growth might accept lower margins and higher inventory costs, adjusting targets accordingly. Conversely, a cost-optimization strategy might prioritize inventory turnover over fill rate targets.

Best-in-class organizations typically set targets 5-10% above industry average and 15-20% above current performance, creating meaningful stretch while maintaining achievability. Avoid the common mistake of simply raising all targets by a fixed percentage—some KPIs may already be optimized while others have significant improvement potential. Benchmark updates should involve cross-functional input from operations, finance, and customer-facing teams to ensure balanced targets.`,
  },
  {
    question: "What is the optimal warehouse utilization rate?",
    answer: `Warehouse utilization between 80-85% is generally considered optimal for most operations. Below 80% indicates wasted capacity and higher per-unit storage costs—you're paying for space and resources that aren't generating value. Above 90% leads to congestion, slower operations, increased error rates, and difficulty accommodating seasonal spikes or new product introductions.

The optimal utilization rate varies by operation type and business model. E-commerce fulfillment centers with high SKU counts and variable demand typically target 75-80% to maintain flexibility for peak periods. Distribution centers with predictable flow and standardized pallet positions might operate efficiently at 85-90%. Temperature-controlled or specialized storage often justifies higher utilization due to capital investment.

When utilization approaches critical thresholds, several options exist: redistribute inventory across facilities, expand existing capacity, add seasonal third-party storage, or implement more aggressive inventory turnover improvement. The dashboard alerts you when utilization approaches 90% so proactive measures can be taken before operational efficiency suffers. Monitor utilization by zone within the warehouse as well—some areas (like receiving and shipping docks) may be congested while overall utilization appears acceptable.`,
  },
  {
    question: "How can I effectively compare performance across different warehouses?",
    answer: `Comparing warehouse performance requires normalizing for differences in product mix, volume, and operating conditions. Start with standardized KPIs calculated consistently across all facilities—the dashboard provides OTD, Fill Rate, Inventory Turnover, and Perfect Order metrics for each warehouse. Look beyond headline numbers to understand context: a warehouse serving remote regions may have lower OTD due to transit times beyond its control.

The overall score (0-100) provides a composite view that balances multiple KPIs, useful for high-level comparison. However, drill into individual metrics to identify specific strengths and weaknesses. Singapore Hub's 95 score reflects top performance across most dimensions, while Los Angeles DC's 86 score indicates improvement opportunities—particularly in turnover and perfect order rate.

Consider qualitative factors alongside quantitative metrics: facility age, workforce experience, technology investment level, and local labor market conditions. Best practice sharing between facilities often yields faster improvement than external benchmarking—identify what top-performing warehouses do differently and replicate those practices. Set facility-specific targets that account for local constraints while maintaining overall network performance standards.`,
  },
];

// Helper functions
const getScoreColor = (value: number, target: number): string => {
  const ratio = value / target;
  if (ratio >= 1) return COLORS.logistics;
  if (ratio >= 0.9) return COLORS.ocean;
  if (ratio >= 0.8) return COLORS.warning;
  return COLORS.danger;
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <ArrowUpRight className="h-4 w-4" style={{ color: COLORS.logistics }} />;
    case "down":
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

const getTrendColor = (current: number, previous: number): string => {
  if (current > previous) return COLORS.logistics;
  if (current < previous) return COLORS.danger;
  return COLORS.neutral;
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "critical":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "success":
      return <CheckCircle2 className="h-5 w-5" style={{ color: COLORS.logistics }} />;
    default:
      return <Info className="h-5 w-5" style={{ color: COLORS.ocean }} />;
  }
};

const getAlertBadgeStyle = (severity: string): string => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  }
};

// Calculate percentage change
const getPercentChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// KPI Card Component
function KPICard({
  id,
  data,
}: {
  id: keyof typeof KPI_BENCHMARKS;
  data: typeof KPI_DATA.current;
}) {
  const benchmark = KPI_BENCHMARKS[id];
  const currentValue = data[id];
  const previousValue = KPI_DATA.previous[id];
  const trend = KPI_DATA.trend[id];
  const Icon = benchmark.icon;
  const percentChange = getPercentChange(currentValue, previousValue);
  const isOnTarget = currentValue >= benchmark.target;
  const isAboveIndustry = currentValue >= benchmark.industry;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: isOnTarget ? COLORS.logistics : COLORS.ocean }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${COLORS.ocean}15` }}
            >
              <Icon className="h-5 w-5" style={{ color: COLORS.ocean }} />
            </div>
            <CardTitle className="text-sm font-medium">{benchmark.name}</CardTitle>
          </div>
          {getTrendIcon(trend)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <span
              className="text-3xl font-bold"
              style={{ color: getScoreColor(currentValue, benchmark.target) }}
            >
              {currentValue.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-lg ml-1">{benchmark.unit}</span>
          </div>
          <div className="text-right">
            <Badge
              variant={isOnTarget ? "default" : "secondary"}
              className={isOnTarget ? "text-white" : ""}
              style={isOnTarget ? { backgroundColor: COLORS.logistics } : {}}
            >
              {isOnTarget ? "On Target" : "Below Target"}
            </Badge>
          </div>
        </div>

        <Progress
          value={(currentValue / benchmark.target) * 100}
          className="h-2"
        />

        <div className="flex justify-between text-xs">
          <div>
            <span className="text-muted-foreground">Target: </span>
            <span className="font-medium">{benchmark.target}{benchmark.unit}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Industry: </span>
            <span
              className="font-medium"
              style={{ color: isAboveIndustry ? COLORS.logistics : COLORS.warning }}
            >
              {benchmark.industry}{benchmark.unit}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs pt-1 border-t">
          <span
            className="font-medium"
            style={{ color: getTrendColor(currentValue, previousValue) }}
          >
            {percentChange > 0 ? "+" : ""}
            {percentChange.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">vs previous period</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Hero Section Component with Animated Badges
function HeroSection({ onReset, onExport, onShare }: { 
  onReset: () => void; 
  onExport: () => void; 
  onShare: () => void;
}) {
  const animatedBadges = [
    { label: "KPI Tracking", icon: Activity },
    { label: "Performance Dashboard", icon: BarChart3 },
    { label: "Logistics Analytics", icon: LineChart },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl p-8 mb-8 bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 border border-border/50">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill={COLORS.ocean} d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.3,-40.8C83.5,-26,87.6,-10.2,85.8,4.8C84,19.8,76.2,34,66.3,46.1C56.4,58.2,44.4,68.2,30.7,74.5C17,80.8,1.6,83.4,-12.8,80.8C-27.2,78.2,-40.6,70.4,-51.8,59.8C-63,49.2,-72,35.8,-76.6,21.1C-81.2,6.4,-81.4,-9.6,-76.5,-23.9C-71.6,-38.2,-61.6,-50.8,-49.1,-58.1C-36.6,-65.4,-21.6,-67.4,-6.5,-69.8C8.6,-72.2,32.5,-83.3,45.7,-76.3Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            {/* Animated Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {animatedBadges.map((badge, index) => (
                <Badge
                  key={badge.label}
                  className="animate-pulse backdrop-blur-sm border transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    backgroundColor: index === 0 ? `${COLORS.ocean}20` : index === 1 ? `${COLORS.logistics}20` : `${COLORS.oceanLight}20`,
                    color: index === 0 ? COLORS.ocean : index === 1 ? COLORS.logistics : COLORS.oceanLight,
                    borderColor: index === 0 ? COLORS.ocean : index === 1 ? COLORS.logistics : COLORS.oceanLight,
                  }}
                >
                  <badge.icon className="h-3 w-3 mr-1" />
                  {badge.label}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] bg-clip-text text-transparent">
              Logistics KPI Dashboard
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Real-time performance monitoring across 5 global distribution centers.
              Track key metrics, identify trends, and optimize your supply chain operations.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <Button variant="outline" size="sm" onClick={onReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Warehouse className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Warehouses</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: COLORS.ocean }}>5</span>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Monthly Orders</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: COLORS.ocean }}>18.2K</span>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Ship className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Shipments</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: COLORS.logistics }}>165K</span>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Score</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: COLORS.logistics }}>{PERFORMANCE_SUMMARY.overallScore}/100</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex flex-wrap gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: COLORS.logistics }} />
              <span>Performance trending up 3.2%</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>1,240 active users</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last sync: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ Section Component
function FAQSection() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" style={{ color: COLORS.ocean }} />
          Frequently Asked Questions
        </CardTitle>
        <CardDescription>
          Learn more about logistics KPIs and how to interpret the dashboard data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: COLORS.ocean }}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-8 whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

// Pro Tips Section
function ProTipsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" style={{ color: COLORS.logistics }} />
          Pro Tips for KPI Management
        </CardTitle>
        <CardDescription>Best practices for effective logistics performance tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRO_TIPS.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-lg border border-border/50 hover:border-border hover:shadow-md transition-all duration-300 bg-card/50"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg shrink-0"
                    style={{ backgroundColor: `${COLORS.ocean}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Common Mistakes Section
function CommonMistakesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Common Mistakes to Avoid
        </CardTitle>
        <CardDescription>Pitfalls that can undermine your KPI program</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {COMMON_MISTAKES.map((mistake, index) => {
            const Icon = mistake.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50/50 dark:bg-yellow-900/10"
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">{mistake.title}</h4>
                    <p className="text-sm text-muted-foreground">{mistake.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Educational Content Section
function EducationalContentSection() {
  return (
    <div className="space-y-6">
      {Object.entries(EDUCATIONAL_CONTENT).map(([key, section]) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5" style={{ color: COLORS.ocean }} />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
              {section.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Metrics Definition Section
function MetricsDefinitionSection() {
  return (
    <div className="space-y-4">
      {Object.entries(KPI_BENCHMARKS).map(([key, benchmark]) => {
        const Icon = benchmark.icon;
        const currentValue = KPI_DATA.current[key as keyof typeof KPI_DATA.current];
        
        return (
          <Card key={key} className="hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-lg shrink-0"
                  style={{ backgroundColor: `${COLORS.ocean}15` }}
                >
                  <Icon className="h-6 w-6" style={{ color: COLORS.ocean }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{benchmark.name}</h4>
                    <Badge
                      style={{ backgroundColor: COLORS.ocean, color: "white" }}
                    >
                      Current: {typeof currentValue === "number" ? currentValue.toFixed(1) : currentValue}{benchmark.unit}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{benchmark.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Target:</span>
                      <span className="ml-1 font-medium" style={{ color: COLORS.logistics }}>
                        {benchmark.target}{benchmark.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Industry Avg:</span>
                      <span className="ml-1 font-medium">{benchmark.industry}{benchmark.unit}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Best-in-Class:</span>
                      <span className="ml-1 font-medium">{(benchmark.target + 3)}{benchmark.unit}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-1 font-medium" style={{ color: currentValue >= benchmark.target ? COLORS.logistics : COLORS.warning }}>
                        {currentValue >= benchmark.target ? "On Target" : "Improvement Needed"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress
                      value={(currentValue / benchmark.target) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface LogisticsKPIDashboardProps {
  onWarehouseSelect?: (warehouse: string) => void;
}

export function LogisticsKPIDashboard({ onWarehouseSelect }: LogisticsKPIDashboardProps) {
  const [timePeriod, setTimePeriod] = useState<string>("30d");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [showExportToast, setShowExportToast] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Export functionality
  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      timePeriod,
      selectedWarehouse,
      currentKPIs: KPI_DATA.current,
      previousKPIs: KPI_DATA.previous,
      performanceSummary: PERFORMANCE_SUMMARY,
      warehouseComparison: WAREHOUSE_COMPARISON,
      alerts: ALERTS,
      improvementSuggestions: IMPROVEMENT_SUGGESTIONS,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `logistics-kpi-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  // Share functionality
  const handleShare = () => {
    const shareData = {
      title: 'Logistics KPI Dashboard Report',
      text: `Overall Score: ${PERFORMANCE_SUMMARY.overallScore}/100 - ${PERFORMANCE_SUMMARY.trend}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  // Reset functionality
  const handleReset = () => {
    setTimePeriod("30d");
    setSelectedWarehouse("all");
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen p-4 lg:p-6 bg-background">
      {/* Toast notifications */}
      {showExportToast && (
        <div className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-2 animate-in fade-in slide-in-from-right">
          <CheckCircle2 className="h-5 w-5" style={{ color: COLORS.logistics }} />
          <span>Report exported successfully!</span>
        </div>
      )}
      {showShareToast && (
        <div className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-2 animate-in fade-in slide-in-from-right">
          <CheckCircle2 className="h-5 w-5" style={{ color: COLORS.logistics }} />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection onReset={handleReset} onExport={handleExport} onShare={handleShare} />

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Warehouse className="h-5 w-5 text-muted-foreground" />
          <Select
            value={selectedWarehouse}
            onValueChange={(v) => {
              setSelectedWarehouse(v);
              onWarehouseSelect?.(v);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WAREHOUSES.map((wh) => (
                <SelectItem key={wh.id} value={wh.id}>
                  {wh.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" title="Refresh Data">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={handleExport} title="Export Report">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Tabs - 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="dashboard" className="text-sm font-medium">
            <Activity className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-sm font-medium">
            <LineChart className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="metrics" className="text-sm font-medium">
            <BarChart3 className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="guide" className="text-sm font-medium">
            <BookOpen className="h-4 w-4 mr-2" />
            Guide
          </TabsTrigger>
          <TabsTrigger value="faq" className="text-sm font-medium">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab - Overview of all KPIs */}
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          {/* Overall Score Card */}
          <Card className="border-l-4" style={{ borderLeftColor: COLORS.ocean }}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="relative">
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center"
                    style={{
                      background: `conic-gradient(${COLORS.logistics} ${PERFORMANCE_SUMMARY.overallScore * 3.6}deg, oklch(0.93 0.005 240) 0deg)`,
                    }}
                  >
                    <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center">
                      <div className="text-center">
                        <span
                          className="text-3xl font-bold"
                          style={{ color: COLORS.logistics }}
                        >
                          {PERFORMANCE_SUMMARY.overallScore}
                        </span>
                        <p className="text-xs text-muted-foreground">/ 100</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">Overall Logistics Performance</h3>
                    <Badge className="text-white" style={{ backgroundColor: COLORS.logistics }}>
                      {PERFORMANCE_SUMMARY.trend === "improving" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {PERFORMANCE_SUMMARY.trend}
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: COLORS.logistics }}>Strengths</h4>
                      <ul className="space-y-1">
                        {PERFORMANCE_SUMMARY.strengths.slice(0, 3).map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: COLORS.logistics }} />
                            <span className="text-muted-foreground">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-500 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        {PERFORMANCE_SUMMARY.weaknesses.slice(0, 3).map((weakness, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard id="otd" data={KPI_DATA.current} />
            <KPICard id="fillRate" data={KPI_DATA.current} />
            <KPICard id="inventoryTurnover" data={KPI_DATA.current} />
            <KPICard id="perfectOrder" data={KPI_DATA.current} />
          </div>

          {/* Secondary KPIs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard id="orderAccuracy" data={KPI_DATA.current} />
            <KPICard id="warehouseUtilization" data={KPI_DATA.current} />
            <KPICard id="pickingAccuracy" data={KPI_DATA.current} />
            <KPICard id="damagesRate" data={KPI_DATA.current} />
          </div>

          {/* Performance Radar and Transport Distribution */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Performance Radar
                </CardTitle>
                <CardDescription>Current performance vs targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid strokeDasharray="3 3" opacity={0.3} />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Current"
                        dataKey="value"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Target"
                        dataKey="target"
                        stroke={COLORS.logistics}
                        fill="transparent"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Transport Mode Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Transport Mode Distribution
                </CardTitle>
                <CardDescription>Shipments by transport type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={TRANSPORT_MODES}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {TRANSPORT_MODES.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {TRANSPORT_MODES.map((mode, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <mode.icon className="h-4 w-4" style={{ color: mode.color }} />
                      <span className="text-muted-foreground">{mode.name}:</span>
                      <span className="font-medium">{mode.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Recent Alerts
              </CardTitle>
              <CardDescription>Latest performance notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72">
                <div className="space-y-3">
                  {ALERTS.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{alert.kpi}</span>
                          <Badge className={getAlertBadgeStyle(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{alert.timestamp}</span>
                          <span>•</span>
                          <span>{alert.warehouse}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab - Trend analysis, benchmarks */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Combined Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" style={{ color: COLORS.ocean }} />
                KPI Trends Over Time
              </CardTitle>
              <CardDescription>12-month performance trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={HISTORICAL_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="fillRate"
                      name="Fill Rate %"
                      stroke={COLORS.logistics}
                      fill={COLORS.logistics}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="otd"
                      name="OTD %"
                      stroke={COLORS.ocean}
                      strokeWidth={2}
                      dot={{ fill: COLORS.ocean }}
                    />
                    <Line
                      type="monotone"
                      dataKey="perfectOrder"
                      name="Perfect Order %"
                      stroke={COLORS.warning}
                      strokeWidth={2}
                      dot={{ fill: COLORS.warning }}
                    />
                    <ReferenceLine y={95} stroke={COLORS.logistics} strokeDasharray="5 5" label="Target OTD" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Order Volume & Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: COLORS.logistics }} />
                Order Volume & Revenue
              </CardTitle>
              <CardDescription>Monthly order count and revenue ($M)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={HISTORICAL_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orders" name="Orders" fill={COLORS.ocean} radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($M)" stroke={COLORS.logistics} strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Individual KPI Trend Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* OTD Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-4 w-4" style={{ color: COLORS.ocean }} />
                  On-Time Delivery Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HISTORICAL_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis domain={[88, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="otd"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.2}
                      />
                      <ReferenceLine y={95} stroke={COLORS.logistics} strokeDasharray="3 3" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Fill Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" style={{ color: COLORS.logistics }} />
                  Fill Rate Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HISTORICAL_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis domain={[92, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="fillRate"
                        stroke={COLORS.logistics}
                        fill={COLORS.logistics}
                        fillOpacity={0.2}
                      />
                      <ReferenceLine y={98} stroke={COLORS.ocean} strokeDasharray="3 3" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Turnover Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" style={{ color: COLORS.warning }} />
                  Inventory Turnover Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HISTORICAL_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis domain={[6, 14]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="inventoryTurnover"
                        stroke={COLORS.warning}
                        fill={COLORS.warning}
                        fillOpacity={0.2}
                      />
                      <ReferenceLine y={12} stroke={COLORS.ocean} strokeDasharray="3 3" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Perfect Order Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" style={{ color: COLORS.danger }} />
                  Perfect Order Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HISTORICAL_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis domain={[78, 95]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="perfectOrder"
                        stroke={COLORS.danger}
                        fill={COLORS.danger}
                        fillOpacity={0.2}
                      />
                      <ReferenceLine y={90} stroke={COLORS.logistics} strokeDasharray="3 3" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warehouse Benchmarking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Warehouse Performance Comparison
              </CardTitle>
              <CardDescription>Benchmark warehouses against each other</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={WAREHOUSE_COMPARISON} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="warehouse" type="category" tick={{ fontSize: 12 }} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="otd" name="OTD %" fill={COLORS.ocean} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="fillRate" name="Fill Rate %" fill={COLORS.logistics} />
                    <Bar dataKey="perfectOrder" name="Perfect Order %" fill={COLORS.warning} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Score Cards by Warehouse */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {WAREHOUSE_COMPARISON.map((wh) => (
              <Card key={wh.warehouse} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm mb-3">{wh.warehouse}</h4>
                  <div className="relative mb-3">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                      style={{
                        background: `conic-gradient(${getScoreColor(wh.score, 90)} ${wh.score * 3.6}deg, oklch(0.93 0.005 240) 0deg)`,
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
                        <span
                          className="text-lg font-bold"
                          style={{ color: getScoreColor(wh.score, 90) }}
                        >
                          {wh.score}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">OTD:</span>
                      <span className="font-medium">{wh.otd}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fill Rate:</span>
                      <span className="font-medium">{wh.fillRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Turnover:</span>
                      <span className="font-medium">{wh.turnover}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume:</span>
                      <span className="font-medium">{(wh.volume / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Improvement Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Improvement Recommendations
              </CardTitle>
              <CardDescription>Prioritized actions to improve performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {IMPROVEMENT_SUGGESTIONS.map((suggestion, i) => (
                  <div key={i} className="p-4 rounded-lg border hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            suggestion.priority === "high"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : suggestion.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }
                        >
                          {suggestion.priority}
                        </Badge>
                        <h4 className="font-medium">{suggestion.kpi}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          Gap:{" "}
                          <span className="font-medium text-red-500">
                            {suggestion.gap > 0 ? "+" : ""}
                            {suggestion.gap.toFixed(1)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.suggestion}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" style={{ color: COLORS.logistics }} />
                        <span className="text-muted-foreground">Impact:</span>
                        <span className="font-medium">{suggestion.impact}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" style={{ color: COLORS.ocean }} />
                        <span className="text-muted-foreground">Effort:</span>
                        <span className="font-medium">{suggestion.effort}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Timeline:</span>
                        <span className="font-medium">{suggestion.timeline}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Current:</span>
                        <Badge variant="outline">{suggestion.current}</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Target:</span>
                        <Badge className="text-white" style={{ backgroundColor: COLORS.logistics }}>{suggestion.target}</Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        Create Action Plan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab - Detailed metric definitions */}
        <TabsContent value="metrics" className="space-y-6 mt-6">
          <MetricsDefinitionSection />
        </TabsContent>

        {/* Guide Tab - Educational content about logistics KPIs */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          <EducationalContentSection />
          <ProTipsSection />
          <CommonMistakesSection />
        </TabsContent>

        {/* FAQ Tab - Comprehensive FAQs */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <FAQSection />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 mt-8 border-t">
        <span>Last updated: {new Date().toLocaleString()}</span>
        <span className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.ocean }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.logistics }} />
          Logistics KPI Dashboard
        </span>
      </div>
    </div>
  );
}
