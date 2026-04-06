"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ShoppingCart,
  Package,
  TrendingDown,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  BarChart3,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Layers,
  BookOpen,
  HelpCircle,
  Copy,
  Printer,
  FileText,
  Box,
  Truck,
  Lightbulb,
  XCircle,
  AlertCircle,
  Boxes,
  PieChart,
  LineChart as LineChartIcon,
  BarChart,
  AreaChart,
} from "lucide-react";
import {
  LineChart,
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
  ReferenceLine,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart as RechartsAreaChart,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

interface EOQResult {
  eoq: number;
  annualDemand: number;
  orderCostPerOrder: number;
  holdingCostPerUnit: number;
  totalOrdersPerYear: number;
  orderingCostTotal: number;
  holdingCostTotal: number;
  totalInventoryCost: number;
  averageInventory: number;
  reorderPoint: number;
  daysBetweenOrders: number;
  leadTimeDemand: number;
  safetyStock: number;
  costSavingsVsCurrent: number;
}

// Pro Tips Data
const proTips = [
  {
    icon: TrendingUp,
    title: "Review EOQ Quarterly",
    description: "Demand patterns and costs change over time. Recalculate EOQ at least quarterly to ensure your order quantities remain optimal as market conditions evolve.",
  },
  {
    icon: Package,
    title: "Consider Storage Constraints",
    description: "Before implementing EOQ, verify your warehouse can accommodate the calculated order quantity. If space is limited, you may need to order more frequently in smaller quantities.",
  },
  {
    icon: DollarSign,
    title: "Negotiate Volume Discounts",
    description: "Even if quantity discounts complicate EOQ, they often provide greater savings. Calculate total costs at discount tiers and compare with basic EOQ results.",
  },
  {
    icon: Clock,
    title: "Monitor Lead Time Variability",
    description: "Track supplier lead times consistently. If lead times vary significantly, increase your safety stock buffer to maintain service levels during longer lead times.",
  },
  {
    icon: Target,
    title: "Classify Items by ABC Analysis",
    description: "Apply EOQ primarily to 'A' class items (high value, high volume). These items offer the greatest cost reduction potential and justify detailed analysis.",
  },
  {
    icon: Zap,
    title: "Automate Reorder Triggers",
    description: "Integrate your EOQ calculations with inventory management systems to automatically generate purchase orders when stock reaches the reorder point.",
  },
];

// Common Mistakes Data
const commonMistakes = [
  {
    title: "Ignoring Demand Variability",
    description: "Applying basic EOQ to products with highly variable or seasonal demand can lead to stockouts or excess inventory. For variable demand, consider using a modified EOQ model with safety stock or a periodic review system instead.",
    icon: TrendingUp,
  },
  {
    title: "Underestimating Holding Costs",
    description: "Many businesses significantly underestimate true holding costs by only considering warehouse rent. Remember to include cost of capital, obsolescence risk, insurance, taxes, and handling costs. A thorough holding cost analysis often reveals costs 20-30% higher than initially estimated.",
    icon: DollarSign,
  },
  {
    title: "Not Adjusting for Supplier Minimums",
    description: "EOQ might suggest an order quantity below supplier minimum order quantities (MOQs). Always check supplier constraints and adjust your order quantity accordingly, recalculating total costs based on the feasible order size.",
    icon: Package,
  },
  {
    title: "Treating EOQ as Fixed",
    description: "EOQ is not a set-and-forget calculation. Input parameters change over time—demand shifts, costs fluctuate, and supplier relationships evolve. Failing to regularly update EOQ calculations can result in suboptimal ordering decisions that increase costs over time.",
    icon: RefreshCw,
  },
  {
    title: "Overlooking Joint Ordering Opportunities",
    description: "When ordering multiple items from the same supplier, ordering each at its individual EOQ may not be optimal. Consider coordinated replenishment strategies that combine orders to share fixed ordering costs across multiple products.",
    icon: ShoppingCart,
  },
];

// FAQ Data - Comprehensive 150+ words each
const faqData = [
  {
    question: "What is Economic Order Quantity (EOQ) and why is it important for inventory management?",
    answer: "Economic Order Quantity (EOQ) is the optimal order quantity that minimizes total inventory costs, which include ordering costs and holding costs. EOQ is crucial for inventory management because it provides a data-driven approach to determine how much to order and when. By calculating the EOQ, businesses can reduce excess inventory, minimize stockouts, optimize cash flow, and improve overall supply chain efficiency. The EOQ model helps balance the tradeoff between the cost of placing orders and the cost of holding inventory, finding the sweet spot where total costs are minimized. This is especially valuable for businesses with stable demand patterns and consistent lead times, as it provides a scientific basis for purchasing decisions rather than relying on intuition or rough estimates. The formula has been a cornerstone of inventory management since its development in 1913 and continues to be widely used in modern ERP and inventory management systems. Understanding and applying EOQ principles can lead to significant cost savings and operational improvements.",
  },
  {
    question: "What are the key assumptions of the EOQ model and when might they not apply?",
    answer: "The EOQ model relies on several key assumptions that are important to understand for proper application. First, the model assumes constant and known demand rate throughout the year, meaning demand doesn't fluctuate seasonally or due to market conditions. Second, it assumes a fixed and known lead time for order delivery, with no variability in supplier performance. Third, ordering costs are assumed to be constant per order, regardless of order size. Fourth, holding costs are assumed to be proportional to the number of units held in inventory. Fifth, the model assumes instantaneous replenishment - the entire order arrives at once when inventory reaches zero. Sixth, it assumes no quantity discounts are available, meaning the unit price remains constant regardless of order size. Finally, the model assumes no stockouts are allowed and that only one product is considered at a time. Understanding these assumptions helps managers determine when EOQ is appropriate and when modifications or alternative models may be needed. In practice, few real-world situations perfectly match all assumptions, but EOQ still provides a useful baseline for decision-making.",
  },
  {
    question: "How do I calculate the holding cost percentage for my business?",
    answer: "Calculating the holding cost percentage (also called carrying cost rate) requires summing all costs associated with storing and maintaining inventory, then expressing this as a percentage of the inventory value. The main components include: Cost of Capital (typically 10-15%) - the opportunity cost of money tied up in inventory or interest on borrowed funds; Storage Costs (2-5%) - warehouse rent, utilities, insurance, and security; Obsolescence Risk (2-10%) - costs from products becoming outdated, expired, or unsellable; Damage and Deterioration (1-3%) - losses from handling, environmental factors, or spoilage; Taxes (1-2%) - property taxes on inventory; Insurance (0.5-1%) - coverage against theft, fire, or other losses. A typical holding cost percentage ranges from 20-30% of the unit cost per year, but this varies significantly by industry. High-tech products with rapid obsolescence may have rates exceeding 40%, while stable commodities might have rates closer to 15%. To calculate your specific rate, total all these annual costs and divide by your average inventory value. Conducting a thorough analysis of each cost component is essential for accurate EOQ calculations.",
  },
  {
    question: "How should I handle EOQ when demand is variable or seasonal?",
    answer: "When demand is variable or seasonal, the basic EOQ model needs modification to remain useful. For seasonal demand patterns, consider using a seasonal EOQ approach where you calculate different order quantities for different periods based on seasonal demand forecasts. Alternatively, use a Time-Varying Demand model such as the Silver-Meal heuristic or Part Period Balancing, which adjust order timing and quantities based on anticipated demand changes. Another approach is to calculate EOQ based on average annual demand but maintain safety stock buffers that vary by season. For products with highly unpredictable demand, consider implementing a Periodic Review System where inventory levels are checked at fixed intervals and orders are placed to bring inventory up to a target level. You might also consider using a Reorder Point system with dynamic safety stock calculations that adjust for demand variability. In cases where demand uncertainty is high, combining EOQ principles with safety stock analysis and service level targets provides a more robust approach than EOQ alone. The key is to recognize when basic EOQ assumptions don't hold and adapt your approach accordingly.",
  },
  {
    question: "How does quantity discount affect the EOQ calculation?",
    answer: "Quantity discounts complicate EOQ calculations because the unit cost becomes a function of order quantity, affecting holding costs and potentially changing the optimal order quantity. To handle quantity discounts, you need to use a modified approach: First, calculate the EOQ at each price tier using the standard formula. Then, check if each calculated EOQ falls within the quantity range for that price tier - if not, adjust to the nearest boundary quantity. Calculate the total annual cost for each viable quantity, including purchase cost, ordering cost, and holding cost. Finally, compare total costs across all tiers to find the overall minimum. The total cost calculation now becomes: Total Cost = (D × C) + (D/Q × S) + (Q/2 × C × i), where C is the unit cost at each tier and i is the holding cost rate. Often, the optimal quantity with discounts is higher than the basic EOQ because the savings from lower unit costs can offset higher holding costs. However, be cautious about ordering much larger quantities than EOQ just to get discounts, as this ties up capital and increases storage needs.",
  },
  {
    question: "How do I incorporate lead time and safety stock into EOQ?",
    answer: "Integrating lead time and safety stock with EOQ creates a more complete inventory management system. Lead time is handled through the Reorder Point (ROP) calculation: ROP = (Average Daily Demand × Lead Time) + Safety Stock. The EOQ determines how much to order, while the ROP determines when to order. Safety stock provides a buffer against demand variability during lead time and supply uncertainty. To calculate safety stock, you need to consider: the standard deviation of demand during lead time, your desired service level (e.g., 95% or 99%), and the Z-score corresponding to that service level. The formula becomes: Safety Stock = Z × σLT, where σLT is the standard deviation of demand during lead time. For example, with a 95% service level (Z = 1.65), lead time of 7 days, average daily demand of 40 units, and standard deviation of 8 units, Safety Stock = 1.65 × 8 × √7 ≈ 35 units. The complete system works as follows: when inventory drops to the ROP, place an order for the EOQ quantity. The order arrives after lead time, just as safety stock is being utilized. This approach minimizes total costs while maintaining your target service level.",
  },
  {
    question: "When should I NOT use the EOQ model?",
    answer: "While EOQ is a powerful tool, there are several situations where it may not be appropriate or needs significant modification. Don't use basic EOQ when demand is highly unpredictable or has significant seasonal variation, as the model assumes constant demand. It's also not suitable for perishable goods with limited shelf life, where ordering in large quantities leads to spoilage. Avoid EOQ for fashion or trend-driven products that quickly become obsolete, as the holding cost assumptions don't capture the risk of unsellable inventory. If you have significant capacity constraints in storage, the EOQ might suggest quantities you physically cannot store. For JIT (Just-In-Time) manufacturing environments, the philosophy of minimizing inventory conflicts with EOQ's acceptance of holding costs. When suppliers have minimum order quantities that significantly exceed EOQ, the model's recommendations may not be practical. For items with highly variable lead times or unreliable suppliers, the basic model's assumptions break down. Additionally, if ordering costs vary significantly with order size (e.g., volume discounts on shipping), the constant ordering cost assumption fails. In these cases, consider alternatives like JIT systems, Material Requirements Planning (MRP), periodic review systems, or simulation-based approaches.",
  },
  {
    question: "What is the relationship between EOQ and the total cost curve?",
    answer: "The relationship between EOQ and the total cost curve is fundamental to understanding why EOQ works. The total cost curve is the sum of ordering costs and holding costs at each order quantity. Ordering costs decrease hyperbolically as order quantity increases (because fewer orders are needed), while holding costs increase linearly with order quantity (because more inventory is held on average). When you add these two curves together, you get a U-shaped total cost curve. The EOQ represents the exact point at the bottom of this U-curve where total costs are minimized. What's particularly interesting is that the total cost curve is relatively flat near the EOQ point. This means that small deviations from the EOQ have minimal impact on total costs. For example, ordering 10-20% more or less than the EOQ typically increases total costs by less than 5%. This flatness provides practical flexibility - managers can adjust order quantities within a reasonable range around EOQ without significantly impacting costs, allowing them to accommodate practical constraints like supplier minimums or storage limitations.",
  },
];

export function EOQCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");
  const [copied, setCopied] = useState(false);

  // Input parameters
  const [annualDemand, setAnnualDemand] = useState<string>("10000");
  const [orderCost, setOrderCost] = useState<string>("50");
  const [unitCost, setUnitCost] = useState<string>("25");
  const [holdingRate, setHoldingRate] = useState<number>(20); // % of unit cost
  const [leadTime, setLeadTime] = useState<string>("7"); // days
  const [safetyDays, setSafetyDays] = useState<number>(3); // safety stock days
  const [currentOrderQty, setCurrentOrderQty] = useState<string>("500");
  const [workingDays, setWorkingDays] = useState<number>(250);

  // Calculate EOQ
  const result = useMemo((): EOQResult => {
    const D = parseFloat(annualDemand) || 0; // Annual demand
    const S = parseFloat(orderCost) || 0; // Order cost per order
    const C = parseFloat(unitCost) || 0; // Unit cost
    const H = C * (holdingRate / 100); // Holding cost per unit per year
    const L = parseFloat(leadTime) || 0; // Lead time in days
    const SS = safetyDays; // Safety stock days
    const currentQty = parseFloat(currentOrderQty) || 0;
    const WD = workingDays; // Working days per year

    // EOQ formula: sqrt(2 * D * S / H)
    const eoq = Math.sqrt((2 * D * S) / H);

    // Derived metrics
    const totalOrdersPerYear = D / eoq;
    const orderingCostTotal = totalOrdersPerYear * S;
    const holdingCostTotal = (eoq / 2) * H;
    const totalInventoryCost = orderingCostTotal + holdingCostTotal;
    const averageInventory = eoq / 2;

    // Daily demand
    const dailyDemand = D / WD;

    // Reorder point
    const leadTimeDemand = dailyDemand * L;
    const safetyStock = dailyDemand * SS;
    const reorderPoint = leadTimeDemand + safetyStock;

    // Days between orders
    const daysBetweenOrders = WD / totalOrdersPerYear;

    // Current policy cost comparison
    const currentOrdersPerYear = D / currentQty;
    const currentOrderingCost = currentOrdersPerYear * S;
    const currentHoldingCost = (currentQty / 2) * H;
    const currentTotalCost = currentOrderingCost + currentHoldingCost;
    const costSavingsVsCurrent = currentTotalCost - totalInventoryCost;

    return {
      eoq: Math.round(eoq),
      annualDemand: D,
      orderCostPerOrder: S,
      holdingCostPerUnit: H,
      totalOrdersPerYear: parseFloat(totalOrdersPerYear.toFixed(2)),
      orderingCostTotal,
      holdingCostTotal,
      totalInventoryCost,
      averageInventory: Math.round(averageInventory),
      reorderPoint: Math.round(reorderPoint),
      daysBetweenOrders: Math.round(daysBetweenOrders),
      leadTimeDemand: Math.round(leadTimeDemand),
      safetyStock: Math.round(safetyStock),
      costSavingsVsCurrent,
    };
  }, [annualDemand, orderCost, unitCost, holdingRate, leadTime, safetyDays, currentOrderQty, workingDays]);

  // Sensitivity analysis data
  const sensitivityData = useMemo(() => {
    const baseEoq = result.eoq;
    const D = parseFloat(annualDemand) || 0;
    const S = parseFloat(orderCost) || 0;
    const C = parseFloat(unitCost) || 0;
    const H = C * (holdingRate / 100);

    return [-40, -30, -20, -10, 0, 10, 20, 30, 40].map(change => {
      const adjustedEoq = baseEoq * (1 + change / 100);
      const ordersPerYear = D / adjustedEoq;
      const orderingCost = ordersPerYear * S;
      const holdingCost = (adjustedEoq / 2) * H;
      const totalCost = orderingCost + holdingCost;
      const diff = ((totalCost - result.totalInventoryCost) / result.totalInventoryCost) * 100;

      return {
        change: `${change > 0 ? '+' : ''}${change}%`,
        eoq: Math.round(adjustedEoq),
        totalCost: parseFloat(totalCost.toFixed(2)),
        costDiff: parseFloat(diff.toFixed(2)),
      };
    });
  }, [result, annualDemand, orderCost, unitCost, holdingRate]);

  // Cost breakdown chart data - Total Cost Curve
  const totalCostCurveData = useMemo(() => {
    const D = parseFloat(annualDemand) || 0;
    const S = parseFloat(orderCost) || 0;
    const C = parseFloat(unitCost) || 0;
    const H = C * (holdingRate / 100);
    const eoq = result.eoq;

    // Calculate costs at different order quantities around EOQ
    const quantities = [];
    for (let factor = 0.3; factor <= 2.1; factor += 0.1) {
      const q = eoq * factor;
      const ordersPerYear = D / q;
      quantities.push({
        quantity: Math.round(q),
        orderingCost: parseFloat((ordersPerYear * S).toFixed(2)),
        holdingCost: parseFloat(((q / 2) * H).toFixed(2)),
        totalCost: parseFloat(((ordersPerYear * S) + ((q / 2) * H)).toFixed(2)),
        isEOQ: Math.abs(Math.round(q) - eoq) < 5,
      });
    }
    return quantities;
  }, [result, annualDemand, orderCost, unitCost, holdingRate]);

  // Cost breakdown pie chart data
  const costPieData = useMemo(() => [
    { name: "Ordering Cost", value: result.orderingCostTotal, color: "#0F4C81" },
    { name: "Holding Cost", value: result.holdingCostTotal, color: "#2E8B57" },
  ], [result]);

  // Annual cost vs order quantity data
  const annualCostData = useMemo(() => {
    const D = parseFloat(annualDemand) || 0;
    const S = parseFloat(orderCost) || 0;
    const C = parseFloat(unitCost) || 0;
    const H = C * (holdingRate / 100);

    // Different order quantities to compare
    const quantities = [200, 300, 400, 500, 600, 700, 800, result.eoq].sort((a, b) => a - b);
    
    return quantities.map(q => {
      const ordersPerYear = D / q;
      return {
        quantity: q,
        orders: parseFloat((D / q).toFixed(1)),
        annualOrderingCost: parseFloat((ordersPerYear * S).toFixed(2)),
        annualHoldingCost: parseFloat(((q / 2) * H).toFixed(2)),
        totalAnnualCost: parseFloat(((ordersPerYear * S) + ((q / 2) * H)).toFixed(2)),
        isEOQ: q === result.eoq,
      };
    });
  }, [result, annualDemand, orderCost, unitCost, holdingRate]);

  // Inventory cycle visualization
  const inventoryCycleData = useMemo(() => {
    const eoq = result.eoq;
    const demand = parseFloat(annualDemand) || 0;
    const WD = workingDays;
    const cycleDays = Math.round(WD / result.totalOrdersPerYear);
    const dailyDemand = demand / WD;

    const data = [];
    for (let day = 0; day <= cycleDays; day++) {
      const inventory = Math.max(0, eoq - (dailyDemand * day));
      data.push({
        day,
        inventory: Math.round(inventory),
        average: Math.round(eoq / 2),
      });
    }
    return data;
  }, [result, annualDemand, workingDays]);

  // EOQ Variations - Quantity Discount Analysis
  const quantityDiscountData = useMemo(() => {
    const D = parseFloat(annualDemand) || 0;
    const S = parseFloat(orderCost) || 0;
    const baseC = parseFloat(unitCost) || 0;

    const discountTiers = [
      { minQty: 0, maxQty: 499, discount: 0, unitCost: baseC },
      { minQty: 500, maxQty: 999, discount: 5, unitCost: baseC * 0.95 },
      { minQty: 1000, maxQty: 2499, discount: 10, unitCost: baseC * 0.90 },
      { minQty: 2500, maxQty: Infinity, discount: 15, unitCost: baseC * 0.85 },
    ];

    return discountTiers.map(tier => {
      const H = tier.unitCost * (holdingRate / 100);
      const eoqAtTier = Math.sqrt((2 * D * S) / H);
      
      // If calculated EOQ falls within tier, use it; otherwise use boundary
      let orderQty;
      if (eoqAtTier >= tier.minQty && (tier.maxQty === Infinity || eoqAtTier <= tier.maxQty)) {
        orderQty = Math.round(eoqAtTier);
      } else if (eoqAtTier < tier.minQty) {
        orderQty = tier.minQty;
      } else {
        orderQty = tier.maxQty === Infinity ? Math.round(eoqAtTier) : tier.maxQty;
      }

      const ordersPerYear = D / orderQty;
      const orderingCost = ordersPerYear * S;
      const holdingCost = (orderQty / 2) * H;
      const purchaseCost = D * tier.unitCost;
      const totalCost = orderingCost + holdingCost + purchaseCost;

      return {
        tier: `${tier.discount > 0 ? `${tier.discount}% off` : 'No discount'}`,
        minQty: tier.minQty,
        maxQty: tier.maxQty === Infinity ? '∞' : tier.maxQty,
        unitCost: tier.unitCost,
        orderQty,
        orderingCost: parseFloat(orderingCost.toFixed(2)),
        holdingCost: parseFloat(holdingCost.toFixed(2)),
        purchaseCost: parseFloat(purchaseCost.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        isRecommended: tier.discount === 0, // Basic EOQ is baseline
      };
    });
  }, [annualDemand, orderCost, unitCost, holdingRate]);

  // POQ (Production Order Quantity) calculation
  const poqData = useMemo(() => {
    const D = parseFloat(annualDemand) || 0;
    const S = parseFloat(orderCost) || 0;
    const C = parseFloat(unitCost) || 0;
    const H = C * (holdingRate / 100);
    const dailyDemand = D / workingDays;
    
    // Different production rates to compare
    const productionRates = [dailyDemand * 2, dailyDemand * 3, dailyDemand * 5, dailyDemand * 10];
    
    return productionRates.map(p => {
      const poq = Math.sqrt((2 * D * S) / (H * (1 - dailyDemand / p)));
      const productionDays = poq / p;
      const consumptionDuringProduction = dailyDemand * productionDays;
      const maxInventory = poq - consumptionDuringProduction;
      const avgInventory = maxInventory / 2;
      
      return {
        productionRate: Math.round(p),
        poq: Math.round(poq),
        productionDays: parseFloat(productionDays.toFixed(1)),
        maxInventory: Math.round(maxInventory),
        avgInventory: Math.round(avgInventory),
        holdingCost: parseFloat((avgInventory * H).toFixed(2)),
      };
    });
  }, [annualDemand, orderCost, unitCost, holdingRate, workingDays]);

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
  };

  // Reset function
  const handleReset = () => {
    setAnnualDemand("10000");
    setOrderCost("50");
    setUnitCost("25");
    setHoldingRate(20);
    setLeadTime("7");
    setSafetyDays(3);
    setCurrentOrderQty("500");
    setWorkingDays(250);
  };

  // Export function
  const handleExport = () => {
    const exportData = {
      date: new Date().toISOString(),
      inputs: {
        annualDemand,
        orderCost,
        unitCost,
        holdingRate,
        leadTime,
        safetyDays,
        currentOrderQty,
        workingDays,
      },
      results: result,
      currency,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eoq-calculation-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const handleCopy = async () => {
    const text = `EOQ Calculation Results
========================
Economic Order Quantity: ${result.eoq} units
Orders per Year: ${result.totalOrdersPerYear}
Days Between Orders: ${result.daysBetweenOrders}

Annual Costs:
- Ordering Cost: ${formatCurrency(result.orderingCostTotal, currency)}
- Holding Cost: ${formatCurrency(result.holdingCostTotal, currency)}
- Total Cost: ${formatCurrency(result.totalInventoryCost, currency)}

Reorder Point: ${result.reorderPoint} units
Safety Stock: ${result.safetyStock} units

Calculated on: ${new Date().toLocaleDateString()}`;
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Share function
  const handleShare = async () => {
    const shareData = {
      title: "EOQ Calculator Results",
      text: `EOQ: ${result.eoq} units, Total Annual Cost: ${formatCurrency(result.totalInventoryCost, currency)}`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 p-6 md:p-8 border border-border/50">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {/* Animated Badges */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20 px-3 py-1">
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block mr-1.5"
              >
                <Boxes className="h-3.5 w-3.5" />
              </motion.span>
              Inventory Management
            </Badge>
            <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20 px-3 py-1">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                className="inline-block mr-1.5"
              >
                <Calculator className="h-3.5 w-3.5" />
              </motion.span>
              EOQ Model
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-3 py-1">
              <motion.span
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="inline-block mr-1.5"
              >
                <TrendingDown className="h-3.5 w-3.5" />
              </motion.span>
              Cost Optimization
            </Badge>
          </motion.div>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Economic Order Quantity Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Optimize your inventory management by calculating the ideal order quantity that minimizes 
            total inventory costs, including ordering and holding costs. Make data-driven purchasing decisions.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics Display Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                <Package className="h-5 w-5 text-[var(--ocean)]" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">EOQ</p>
                <p className="text-xl font-bold text-foreground">{result.eoq.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">units per order</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                <RefreshCw className="h-5 w-5 text-[var(--logistics)]" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Annual Orders</p>
                <p className="text-xl font-bold text-foreground">{result.totalOrdersPerYear}</p>
                <p className="text-xs text-muted-foreground">orders per year</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Cost</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(result.totalInventoryCost, currency)}</p>
                <p className="text-xs text-muted-foreground">per year</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Tabs - 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-[var(--ocean)]/10 data-[state=active]:text-[var(--ocean)]">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-[var(--logistics)]/10 data-[state=active]:text-[var(--logistics)]">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="sensitivity" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-600">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Sensitivity</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-[var(--ocean)]/10 data-[state=active]:text-[var(--ocean)]">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-[var(--logistics)]/10 data-[state=active]:text-[var(--logistics)]">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-[var(--ocean)]" />
                  EOQ Calculator
                </CardTitle>
                <CardDescription>Economic Order Quantity for inventory optimization</CardDescription>
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
                    <Label htmlFor="annualDemand">Annual Demand (units)</Label>
                    <Input
                      id="annualDemand"
                      type="number"
                      value={annualDemand}
                      onChange={(e) => setAnnualDemand(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="orderCost">Order Cost (per order)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="orderCost"
                        type="number"
                        value={orderCost}
                        onChange={(e) => setOrderCost(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fixed cost per purchase order (admin, shipping, receiving)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="unitCost">Unit Cost</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="unitCost"
                        type="number"
                        step="0.01"
                        value={unitCost}
                        onChange={(e) => setUnitCost(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Holding Cost Rate (% of unit cost)</Label>
                    <div className="mt-2">
                      <Slider
                        value={[holdingRate]}
                        onValueChange={(v) => setHoldingRate(v[0])}
                        min={5}
                        max={50}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5%</span>
                        <span className="font-medium text-[var(--ocean)]">{holdingRate}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="currentOrderQty">Current Order Quantity (for comparison)</Label>
                    <Input
                      id="currentOrderQty"
                      type="number"
                      value={currentOrderQty}
                      onChange={(e) => setCurrentOrderQty(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="border-[var(--logistics)]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[var(--logistics)]" />
                  EOQ Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* EOQ Result */}
                  <div className="p-4 bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/5 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Economic Order Quantity</p>
                    <p className="text-4xl font-bold text-[var(--logistics)]">
                      {result.eoq.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">units per order</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Orders per Year</p>
                      <p className="text-xl font-bold text-foreground">{result.totalOrdersPerYear}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Days Between Orders</p>
                      <p className="text-xl font-bold text-foreground">{result.daysBetweenOrders}</p>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3 text-foreground">Annual Inventory Costs</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ordering Cost</span>
                        <span className="font-medium text-foreground">{formatCurrency(result.orderingCostTotal, currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Holding Cost</span>
                        <span className="font-medium text-foreground">{formatCurrency(result.holdingCostTotal, currency)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-bold">
                        <span className="text-foreground">Total Cost</span>
                        <span className="text-[var(--ocean)]">{formatCurrency(result.totalInventoryCost, currency)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Savings */}
                  {result.costSavingsVsCurrent > 0 && (
                    <div className="p-4 bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-[var(--logistics)]" />
                        <div>
                          <p className="font-medium text-[var(--logistics)]">
                            Potential Savings: {formatCurrency(result.costSavingsVsCurrent, currency)}/year
                          </p>
                          <p className="text-sm text-muted-foreground">
                            By switching from {currentOrderQty} to {result.eoq} units per order
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reorder Point Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Reorder Point Calculation
              </CardTitle>
              <CardDescription>When to place your next order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leadTime">Lead Time (days)</Label>
                  <Input
                    id="leadTime"
                    type="number"
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Safety Stock (days of demand)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[safetyDays]}
                      onValueChange={(v) => setSafetyDays(v[0])}
                      min={0}
                      max={14}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0 days</span>
                      <span className="font-medium text-[var(--ocean)]">{safetyDays} days</span>
                      <span>14 days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/5 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Lead Time Demand</p>
                  <p className="text-2xl font-bold text-[var(--ocean)]">{result.leadTimeDemand}</p>
                  <p className="text-xs text-muted-foreground">units during lead time</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Safety Stock</p>
                  <p className="text-2xl font-bold text-foreground">{result.safetyStock}</p>
                  <p className="text-xs text-muted-foreground">units buffer</p>
                </div>
                <div className="p-4 bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/5 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Reorder Point</p>
                  <p className="text-2xl font-bold text-[var(--logistics)]">{result.reorderPoint}</p>
                  <p className="text-xs text-muted-foreground">place order at this level</p>
                </div>
              </div>

              {/* Inventory Cycle Chart - Area Chart */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2 text-foreground">
                  <AreaChart className="h-4 w-4 text-[var(--ocean)]" />
                  Inventory Cycle Visualization
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart data={inventoryCycleData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                      <XAxis dataKey="day" label={{ value: 'Days', position: 'bottom', offset: -5 }} className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }} 
                      />
                      <ReferenceLine y={result.reorderPoint} stroke={chartColors.danger} strokeDasharray="5 5" label="Reorder Point" />
                      <Area type="monotone" dataKey="inventory" stroke={chartColors.ocean} fill={chartColors.ocean} fillOpacity={0.2} name="Inventory Level" />
                      <Line type="monotone" dataKey="average" stroke={chartColors.logistics} strokeDasharray="5 5" dot={false} name="Average Inventory" />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Total Cost Curve - Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                  Total Cost Curve
                </CardTitle>
                <CardDescription>Shows the minimum total cost at EOQ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={totalCostCurveData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                      <XAxis dataKey="quantity" label={{ value: 'Order Quantity', position: 'bottom', offset: -5 }} className="text-muted-foreground" />
                      <YAxis tickFormatter={(v) => formatCurrency(v, currency)} className="text-muted-foreground" />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value, currency)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="totalCost" fill={chartColors.ocean} fillOpacity={0.2} stroke={chartColors.ocean} name="Total Cost" />
                      <Line type="monotone" dataKey="orderingCost" stroke={chartColors.logistics} strokeWidth={2} name="Ordering Cost" />
                      <Line type="monotone" dataKey="holdingCost" stroke={chartColors.warning} strokeWidth={2} name="Holding Cost" />
                      <ReferenceLine x={result.eoq} stroke={chartColors.danger} strokeDasharray="5 5" label="EOQ" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[var(--logistics)]" />
                  Cost Breakdown at EOQ
                </CardTitle>
                <CardDescription>Proportion of ordering vs holding costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={costPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {costPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value, currency)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/5 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Ordering Cost</p>
                    <p className="text-xl font-bold text-[var(--ocean)]">{formatCurrency(result.orderingCostTotal, currency)}</p>
                  </div>
                  <div className="p-3 bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/5 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Holding Cost</p>
                    <p className="text-xl font-bold text-[var(--logistics)]">{formatCurrency(result.holdingCostTotal, currency)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Quantity vs Annual Cost - Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-[var(--ocean)]" />
                EOQ vs Other Order Quantities
              </CardTitle>
              <CardDescription>Comparing different order quantities and their total costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={annualCostData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                    <XAxis dataKey="quantity" label={{ value: 'Order Quantity', position: 'bottom', offset: -5 }} className="text-muted-foreground" />
                    <YAxis tickFormatter={(v) => formatCurrency(v, currency)} className="text-muted-foreground" />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value, currency)}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="annualOrderingCost" fill={chartColors.ocean} name="Ordering Cost" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="annualHoldingCost" fill={chartColors.logistics} name="Holding Cost" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 text-foreground">EOQ Tradeoff Explained</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Ordering costs</strong> decrease with larger order quantities (fewer orders)</li>
                  <li>• <strong>Holding costs</strong> increase with larger quantities (more inventory)</li>
                  <li>• <strong>EOQ</strong> minimizes total cost where these curves intersect</li>
                  <li>• The total cost curve is relatively flat near EOQ, providing flexibility</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Sensitivity */}
        <TabsContent value="sensitivity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                Sensitivity Analysis
              </CardTitle>
              <CardDescription>Impact of order quantity changes on total cost</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                    <XAxis dataKey="change" label={{ value: 'Deviation from EOQ', position: 'bottom', offset: -5 }} className="text-muted-foreground" />
                    <YAxis tickFormatter={(v) => `${v}%`} className="text-muted-foreground" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "costDiff" ? `${value.toFixed(2)}%` : formatCurrency(value, currency),
                        name === "costDiff" ? "Cost Increase" : "Total Cost"
                      ]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Line type="monotone" dataKey="costDiff" stroke={chartColors.danger} strokeWidth={3} dot={{ fill: chartColors.danger }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3 text-foreground">Order Qty</th>
                      <th className="text-right py-2 px-3 text-foreground">Total Cost</th>
                      <th className="text-right py-2 px-3 text-foreground">Cost Increase</th>
                      <th className="text-left py-2 px-3 text-foreground">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityData.map((row) => (
                      <tr key={row.change} className={`border-b ${row.costDiff === 0 ? "bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/5" : ""}`}>
                        <td className="py-2 px-3 font-medium text-foreground">{row.eoq.toLocaleString()}</td>
                        <td className="text-right py-2 px-3 text-foreground">{formatCurrency(row.totalCost, currency)}</td>
                        <td className={`text-right py-2 px-3 ${row.costDiff > 0 ? "text-destructive" : row.costDiff < 0 ? "text-[var(--logistics)]" : "text-foreground"}`}>
                          {row.costDiff > 0 ? "+" : ""}{row.costDiff.toFixed(2)}%
                        </td>
                        <td className="py-2 px-3">
                          {row.costDiff === 0 ? <Badge className="bg-[var(--logistics)]">Optimal</Badge> :
                           Math.abs(row.costDiff) < 5 ? <Badge variant="outline">Acceptable</Badge> :
                           <span className="text-muted-foreground">Suboptimal</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-amber-500/10 dark:bg-amber-500/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-foreground">
                    <strong>Key Insight:</strong> Total cost is relatively insensitive to small changes in 
                    order quantity. Even a 20% deviation from EOQ typically increases costs by less than 5%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EOQ Variations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--ocean)]" />
                EOQ Variations & Extensions
              </CardTitle>
              <CardDescription>Advanced EOQ models for different scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quantity Discount Analysis */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2 text-foreground">
                  <Box className="h-4 w-4 text-[var(--logistics)]" />
                  EOQ with Quantity Discounts
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-2 px-3 text-foreground">Discount Tier</th>
                        <th className="text-left py-2 px-3 text-foreground">Quantity Range</th>
                        <th className="text-right py-2 px-3 text-foreground">Unit Cost</th>
                        <th className="text-right py-2 px-3 text-foreground">Order Qty</th>
                        <th className="text-right py-2 px-3 text-foreground">Total Annual Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quantityDiscountData.map((row, index) => (
                        <tr key={index} className={`border-b ${index === 0 ? "bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/5" : ""}`}>
                          <td className="py-2 px-3 font-medium text-foreground">{row.tier}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.minQty} - {row.maxQty}</td>
                          <td className="text-right py-2 px-3 text-foreground">{formatCurrency(row.unitCost, currency)}</td>
                          <td className="text-right py-2 px-3 text-foreground">{row.orderQty}</td>
                          <td className="text-right py-2 px-3 font-medium text-foreground">{formatCurrency(row.totalCost, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Compare total annual costs (purchase + ordering + holding) at different discount tiers.
                </p>
              </div>

              <Separator />

              {/* Production Order Quantity */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2 text-foreground">
                  <Truck className="h-4 w-4 text-[var(--ocean)]" />
                  Production Order Quantity (POQ)
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  For manufactured items where production rate exceeds demand rate, POQ adjusts EOQ for the gradual inventory buildup.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-right py-2 px-3 text-foreground">Production Rate (units/day)</th>
                        <th className="text-right py-2 px-3 text-foreground">POQ</th>
                        <th className="text-right py-2 px-3 text-foreground">Production Days</th>
                        <th className="text-right py-2 px-3 text-foreground">Max Inventory</th>
                        <th className="text-right py-2 px-3 text-foreground">Holding Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {poqData.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="text-right py-2 px-3 text-foreground">{row.productionRate}</td>
                          <td className="text-right py-2 px-3 font-medium text-foreground">{row.poq}</td>
                          <td className="text-right py-2 px-3 text-muted-foreground">{row.productionDays}</td>
                          <td className="text-right py-2 px-3 text-foreground">{row.maxInventory}</td>
                          <td className="text-right py-2 px-3 text-foreground">{formatCurrency(row.holdingCost, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-mono text-foreground">
                    POQ = √(2DS / H(1 - d/p))
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Where d = demand rate, p = production rate. Higher production rates result in POQ closer to EOQ.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide - Educational Content */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* What is Economic Order Quantity? */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                What is Economic Order Quantity?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed">
                Economic Order Quantity (EOQ) is a fundamental inventory management formula that determines the optimal order quantity a company should purchase to minimize total inventory costs. First developed by Ford W. Harris in 1913 and later refined by R. H. Wilson, EOQ has become one of the most widely used tools in operations management and supply chain planning. The model provides a quantitative approach to balancing the tradeoff between ordering costs (which decrease with larger, less frequent orders) and holding costs (which increase with larger average inventory levels). By finding the quantity where these opposing cost forces balance, EOQ provides a mathematically optimal purchasing strategy that minimizes total relevant costs while maintaining adequate stock levels.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The beauty of EOQ lies in its simplicity and practical applicability. Despite being over a century old, the model remains relevant because it captures the fundamental economics of inventory management. Modern inventory systems often incorporate EOQ calculations as a baseline, with adjustments for real-world complexities like variable demand, quantity discounts, and supply chain uncertainties. Understanding EOQ provides managers with insights into the cost implications of their purchasing decisions and helps identify opportunities for cost reduction through strategic ordering patterns. The formula serves as an excellent starting point for inventory optimization, providing a baseline from which more sophisticated models can be developed.
              </p>
            </CardContent>
          </Card>

          {/* EOQ Formula and Components */}
          <Card>
            <CardHeader>
              <CardTitle>EOQ Formula and Components</CardTitle>
              <CardDescription>The mathematical foundation of inventory optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-muted/50 rounded-lg text-center mb-6">
                <p className="text-3xl font-mono font-bold text-[var(--ocean)]">
                  EOQ = √(2DS/H)
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Variables Explained:</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/5 rounded-lg">
                      <p className="font-mono font-medium text-[var(--ocean)]">D = Annual Demand</p>
                      <p className="text-sm text-muted-foreground">Total units required per year</p>
                    </div>
                    <div className="p-3 bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/5 rounded-lg">
                      <p className="font-mono font-medium text-[var(--logistics)]">S = Ordering Cost</p>
                      <p className="text-sm text-muted-foreground">Cost per order (admin, shipping, receiving)</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 dark:bg-amber-500/5 rounded-lg">
                      <p className="font-mono font-medium text-amber-600 dark:text-amber-400">H = Holding Cost</p>
                      <p className="text-sm text-muted-foreground">Annual cost to hold one unit in inventory</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Derived Metrics:</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-foreground">Orders per Year = D / EOQ</p>
                      <p className="text-sm text-muted-foreground">How many orders to place annually</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-foreground">Days Between Orders = Working Days / Orders</p>
                      <p className="text-sm text-muted-foreground">Order cycle time</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-foreground">Average Inventory = EOQ / 2</p>
                      <p className="text-sm text-muted-foreground">Average stock level over time</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* When to Use EOQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--logistics)]" />
                When to Use EOQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The EOQ model provides the most value when applied in the right context. Understanding these ideal conditions helps managers determine when to use the basic model and when modifications are needed. EOQ is most effective for items with stable, predictable demand patterns where the costs of ordering and holding are well understood. The model works particularly well for commodity products, maintenance supplies, and standardized components where demand variability is low and lead times are reliable. Organizations should evaluate their inventory characteristics against the model assumptions before implementing EOQ-based ordering policies.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/5 rounded-lg">
                  <h4 className="font-medium text-[var(--logistics)] mb-2">Ideal Conditions</h4>
                  <ul className="text-sm text-foreground space-y-1">
                    <li>✓ Stable demand patterns</li>
                    <li>✓ Reliable suppliers and lead times</li>
                    <li>✓ Well-defined cost structure</li>
                    <li>✓ Adequate storage capacity</li>
                    <li>✓ Standard commodity items</li>
                    <li>✓ Independent demand items</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-500/10 dark:bg-red-500/5 rounded-lg">
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Consider Alternatives When</h4>
                  <ul className="text-sm text-foreground space-y-1">
                    <li>✗ Highly variable demand</li>
                    <li>✗ Perishable or seasonal goods</li>
                    <li>✗ Fashion or trend-driven products</li>
                    <li>✗ JIT manufacturing environments</li>
                    <li>✗ Capacity-constrained storage</li>
                    <li>✗ Highly uncertain lead times</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitations and Extensions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Limitations and Extensions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3 text-foreground">Key Assumptions:</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Constant and known demand rate",
                    "Fixed and known lead time",
                    "Instantaneous replenishment",
                    "Constant ordering cost per order",
                    "Holding cost proportional to quantity",
                    "No quantity discounts available",
                    "No stockouts allowed",
                    "Single product considered"
                  ].map((assumption, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{assumption}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3 text-foreground">Limitations in Practice:</h4>
                <div className="space-y-3">
                  {[
                    { title: "Demand Uncertainty", desc: "Real demand often varies due to seasonality, market conditions, and unforeseen events" },
                    { title: "Variable Lead Times", desc: "Supplier delays and logistics disruptions can make lead times unpredictable" },
                    { title: "Storage Constraints", desc: "Physical warehouse limitations may prevent ordering at EOQ levels" },
                    { title: "Quantity Discounts", desc: "Supplier pricing often incentivizes larger orders, changing the cost calculus" },
                  ].map((limitation, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <p className="font-medium text-sm text-foreground">{limitation.title}</p>
                      <p className="text-sm text-muted-foreground">{limitation.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {proTips.map((tip, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg hover:border-[var(--ocean)]/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/5 rounded-lg shrink-0">
                        <tip.icon className="h-4 w-4 text-[var(--ocean)]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes to Avoid */}
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
                  <div key={index} className="p-4 bg-red-500/5 dark:bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">{mistake.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{mistake.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about EOQ and inventory management</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-foreground">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <FileText className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
