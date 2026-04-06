"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Package,
  TrendingUp,
  AlertCircle,
  Info,
  DollarSign,
  BarChart3,
  Store,
  Globe,
  CreditCard,
  Percent,
  ShoppingCart,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Lightbulb,
  XCircle,
  Copy,
  Check,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart2,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// eBay Store Subscription Types
type StoreSubscription = "none" | "basic" | "premium" | "anchor";

interface StoreSubscriptionInfo {
  name: string;
  monthlyFee: number;
  insertionFeeDiscount: number; // percentage discount
  fvfDiscount: number; // percentage discount
  freeListings: number;
  renewalPrice: number;
}

const storeSubscriptions: Record<StoreSubscription, StoreSubscriptionInfo> = {
  none: {
    name: "No Store Subscription",
    monthlyFee: 0,
    insertionFeeDiscount: 0,
    fvfDiscount: 0,
    freeListings: 0,
    renewalPrice: 0,
  },
  basic: {
    name: "Basic Store",
    monthlyFee: 24.95,
    insertionFeeDiscount: 0.20, // 20% discount on insertion fees
    fvfDiscount: 0.10, // 10% discount on final value fees
    freeListings: 250,
    renewalPrice: 279.95, // annual
  },
  premium: {
    name: "Premium Store",
    monthlyFee: 74.95,
    insertionFeeDiscount: 0.35,
    fvfDiscount: 0.15,
    freeListings: 1000,
    renewalPrice: 839.95,
  },
  anchor: {
    name: "Anchor Store",
    monthlyFee: 349.95,
    insertionFeeDiscount: 0.50,
    fvfDiscount: 0.20,
    freeListings: 10000,
    renewalPrice: 3899.95,
  },
};

// eBay Product Categories with Final Value Fee rates
interface CategoryInfo {
  name: string;
  fvfRate: number; // Final Value Fee percentage
  fvfCap: number; // Maximum fee cap per item
  internationalRate: number; // Additional fee for international sales
}

const categories: Record<string, CategoryInfo> = {
  electronics: {
    name: "Electronics",
    fvfRate: 12.55,
    fvfCap: 750,
    internationalRate: 1.65,
  },
  fashion: {
    name: "Fashion",
    fvfRate: 12.55,
    fvfCap: 750,
    internationalRate: 1.65,
  },
  home_garden: {
    name: "Home & Garden",
    fvfRate: 12.55,
    fvfCap: 750,
    internationalRate: 1.65,
  },
  motors: {
    name: "eBay Motors",
    fvfRate: 10.00,
    fvfCap: 100,
    internationalRate: 1.50,
  },
  collectibles: {
    name: "Collectibles & Art",
    fvfRate: 12.55,
    fvfCap: 750,
    internationalRate: 1.65,
  },
  sports: {
    name: "Sporting Goods",
    fvfRate: 12.55,
    fvfCap: 750,
    internationalRate: 1.65,
  },
  toys: {
    name: "Toys & Hobbies",
    fvfRate: 12.55,
    fvfCap: 750,
    internationalRate: 1.65,
  },
  business: {
    name: "Business & Industrial",
    fvfRate: 11.50,
    fvfCap: 500,
    internationalRate: 1.50,
  },
  books: {
    name: "Books, Movies & Music",
    fvfRate: 14.55,
    fvfCap: 250,
    internationalRate: 2.00,
  },
  jewelry: {
    name: "Jewelry & Watches",
    fvfRate: 15.00,
    fvfCap: 350,
    internationalRate: 2.00,
  },
  health: {
    name: "Health & Beauty",
    fvfRate: 12.55,
    fvfCap: 750,
    internationalRate: 1.65,
  },
  computers: {
    name: "Computers & Tablets",
    fvfRate: 8.00,
    fvfCap: 250,
    internationalRate: 1.00,
  },
  cameras: {
    name: "Cameras & Photo",
    fvfRate: 8.00,
    fvfCap: 250,
    internationalRate: 1.00,
  },
  cell_phones: {
    name: "Cell Phones & Accessories",
    fvfRate: 10.50,
    fvfCap: 300,
    internationalRate: 1.25,
  },
  musical: {
    name: "Musical Instruments",
    fvfRate: 8.00,
    fvfCap: 300,
    internationalRate: 1.00,
  },
};

// Insertion Fee Structure (without store subscription)
const insertionFees = {
  auction1Day: 1.00,
  auction3Day: 1.00,
  auction5Day: 1.00,
  auction7Day: 1.00,
  auction10Day: 2.00,
  fixedPrice30Day: 0.35,
  goodTilCancelled: 0.35,
};

// Payment Processing Fees
const paymentFees = {
  managedPayments: {
    rate: 0.026, // 2.6% for managed payments
    fixedFee: 0.30, // $0.30 per transaction
  },
  paypal: {
    rate: 0.029, // 2.9% for PayPal
    fixedFee: 0.30, // $0.30 per transaction
  },
};

// International Fees
const internationalFees = {
  globalShippingProgram: 0.05, // 5% of item price + shipping
  crossBorderFee: 0.015, // Additional 1.5% for international
};

type ListingType = "auction" | "fixedPrice" | "goodTilCancelled";
type PaymentMethod = "managed" | "paypal";

interface eBayFeeInputs {
  itemPrice: number;
  quantity: number;
  shippingCharge: number;
  category: string;
  storeSubscription: StoreSubscription;
  listingType: ListingType;
  auctionDuration: number;
  isInternational: boolean;
  useGlobalShipping: boolean;
  paymentMethod: PaymentMethod;
  promotedListing: number; // percentage for promoted listings
  listingCount: number; // number of listings this month
}

interface FeeBreakdown {
  insertionFee: number;
  finalValueFee: number;
  paymentFee: number;
  internationalFee: number;
  promotedFee: number;
  storeSubscriptionFee: number;
  totalFees: number;
  grossRevenue: number;
  netProfit: number;
  effectiveFeeRate: number;
}

// Calculate insertion fee
function calculateInsertionFee(inputs: eBayFeeInputs): number {
  const storeInfo = storeSubscriptions[inputs.storeSubscription];
  const listingsUsed = inputs.listingCount;
  const freeListingsRemaining = Math.max(0, storeInfo.freeListings - listingsUsed);
  
  // If there are free listings remaining, no insertion fee
  if (freeListingsRemaining > 0) {
    return 0;
  }
  
  let baseFee = 0;
  if (inputs.listingType === "auction") {
    if (inputs.auctionDuration <= 7) {
      baseFee = insertionFees.auction7Day;
    } else if (inputs.auctionDuration === 10) {
      baseFee = insertionFees.auction10Day;
    }
  } else if (inputs.listingType === "fixedPrice") {
    baseFee = insertionFees.fixedPrice30Day;
  } else {
    baseFee = insertionFees.goodTilCancelled;
  }
  
  // Apply store discount
  return baseFee * (1 - storeInfo.insertionFeeDiscount);
}

// Calculate final value fee
function calculateFinalValueFee(inputs: eBayFeeInputs): number {
  const category = categories[inputs.category];
  const storeInfo = storeSubscriptions[inputs.storeSubscription];
  
  const totalItemPrice = inputs.itemPrice * inputs.quantity;
  
  // Base FVF calculation
  let fvf = (totalItemPrice * category.fvfRate) / 100;
  
  // Apply cap
  fvf = Math.min(fvf, category.fvfCap);
  
  // Apply store discount
  fvf = fvf * (1 - storeInfo.fvfDiscount);
  
  return fvf;
}

// Calculate payment processing fee
function calculatePaymentFee(inputs: eBayFeeInputs): number {
  const totalSalePrice = (inputs.itemPrice + inputs.shippingCharge) * inputs.quantity;
  const paymentInfo = inputs.paymentMethod === "managed" 
    ? paymentFees.managedPayments 
    : paymentFees.paypal;
  
  return (totalSalePrice * paymentInfo.rate) + paymentInfo.fixedFee;
}

// Calculate international fees
function calculateInternationalFee(inputs: eBayFeeInputs): number {
  if (!inputs.isInternational) return 0;
  
  const totalItemPrice = inputs.itemPrice * inputs.quantity;
  const totalShipping = inputs.shippingCharge * inputs.quantity;
  
  let fee = 0;
  
  // Cross-border fee
  fee += totalItemPrice * internationalFees.crossBorderFee;
  
  // Global Shipping Program fee
  if (inputs.useGlobalShipping) {
    fee += (totalItemPrice + totalShipping) * internationalFees.globalShippingProgram;
  }
  
  return fee;
}

// Calculate promoted listing fee
function calculatePromotedFee(inputs: eBayFeeInputs): number {
  if (inputs.promotedListing <= 0) return 0;
  
  const totalItemPrice = inputs.itemPrice * inputs.quantity;
  return (totalItemPrice * inputs.promotedListing) / 100;
}

// Main fee calculation
function calculateFees(inputs: eBayFeeInputs): FeeBreakdown {
  const insertionFee = calculateInsertionFee(inputs);
  const finalValueFee = calculateFinalValueFee(inputs);
  const paymentFee = calculatePaymentFee(inputs);
  const internationalFee = calculateInternationalFee(inputs);
  const promotedFee = calculatePromotedFee(inputs);
  
  // Prorate store subscription fee per listing
  const storeSubscriptionFee = storeSubscriptions[inputs.storeSubscription].monthlyFee / Math.max(inputs.listingCount, 1);
  
  const totalFees = insertionFee + finalValueFee + paymentFee + internationalFee + promotedFee + storeSubscriptionFee;
  const grossRevenue = (inputs.itemPrice + inputs.shippingCharge) * inputs.quantity;
  const netProfit = grossRevenue - totalFees;
  const effectiveFeeRate = grossRevenue > 0 ? (totalFees / grossRevenue) * 100 : 0;
  
  return {
    insertionFee,
    finalValueFee,
    paymentFee,
    internationalFee,
    promotedFee,
    storeSubscriptionFee,
    totalFees,
    grossRevenue,
    netProfit,
    effectiveFeeRate,
  };
}

// Animated Badge Component
function AnimatedBadge({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
        {children}
      </Badge>
    </motion.div>
  );
}

// FAQ Data
const faqData = [
  {
    question: "What are eBay fees and how are they calculated?",
    answer: "eBay fees consist of several components that sellers must understand to accurately price their items and maintain profitability. The primary fees include insertion fees (listing fees), final value fees (selling fees), payment processing fees, and optional fees for promoted listings and international sales. Insertion fees are charged when you create a listing, typically $0.35 for fixed-price listings and $1.00 for auction-style listings. However, many sellers qualify for free listings through store subscriptions or promotional offers. Final value fees are the main selling cost, calculated as a percentage of the total sale amount including shipping. These rates vary by category, ranging from 8% for computers and cameras to 15% for jewelry and watches. Each category also has a maximum fee cap, which means high-value items won't exceed a certain fee amount regardless of the sale price. Payment processing fees through eBay Managed Payments add approximately 2.6% plus $0.30 per transaction. Understanding these fees is crucial for pricing your items correctly and maintaining healthy profit margins in your eBay business."
  },
  {
    question: "How do eBay store subscriptions affect my selling costs?",
    answer: "eBay store subscriptions can significantly reduce your selling costs, but the value depends entirely on your selling volume and listing habits. There are three main subscription tiers: Basic ($24.95/month), Premium ($74.95/month), and Anchor ($349.95/month). Each tier offers increasing benefits including more free listings per month (250 for Basic, 1,000 for Premium, 10,000 for Anchor), discounts on insertion fees (20-50%), and discounts on final value fees (10-20%). To determine if a subscription makes financial sense, calculate your typical monthly listing volume and compare the subscription cost against the fees you would pay without it. For example, if you list 300 items per month at $0.35 each, that's $105 in insertion fees alone. A Basic Store at $24.95 with 250 free listings would reduce that to just $17.50 in fees for the 50 listings over your free allotment, saving you over $60 monthly. Additionally, the 10% final value fee discount compounds your savings, especially for higher-priced items. Store subscribers also receive quarterly listing coupons, access to markdown manager tools, and better visibility in search results, making subscriptions increasingly valuable for active sellers."
  },
  {
    question: "What is the difference between insertion fees and final value fees?",
    answer: "Understanding the distinction between insertion fees and final value fees is fundamental to managing your eBay selling costs effectively. Insertion fees, also known as listing fees, are charged when you create a listing on eBay, regardless of whether the item actually sells. For most sellers, this fee is $0.35 for fixed-price listings (30-day or Good 'Til Cancelled) and $1.00 for auction-style listings lasting 1-7 days, with 10-day auctions costing $2.00. These fees apply each time you list or relist an item, which is why Good 'Til Cancelled listings can be more cost-effective for slow-moving inventory. Final value fees, on the other hand, are only charged when your item sells, calculated as a percentage of the total sale price including shipping charges. The rate varies by product category, typically between 8% and 15%, with each category having a maximum cap. For instance, if you sell electronics for $100, the final value fee would be approximately $12.55 (12.55%), but if you sell a $10,000 piece of jewelry, your fee would be capped at $350 despite the 15% rate theoretically calculating to $1,500. This fee structure incentivizes sellers to price items appropriately and choose the right category, as high-value items benefit significantly from the fee caps while lower-priced items need careful margin calculation to remain profitable."
  },
  {
    question: "How do international sales affect eBay fees?",
    answer: "International sales on eBay incur additional fees that sellers must factor into their pricing strategy when expanding to global markets. When selling to buyers outside your home country, eBay applies an international fee (also called a cross-border fee) of approximately 1.5% on top of the standard final value fee. This fee applies to all international transactions regardless of the shipping method used. Additionally, if you participate in eBay's Global Shipping Program (GSP), which handles international shipping and customs documentation for you, an additional fee of approximately 5% of the item price plus shipping is charged. While this adds to your costs, the GSP can be worth it for sellers who don't want to deal with complex international shipping logistics, customs forms, and varying import regulations. To manage these costs effectively, consider whether your margins can absorb the additional fees or if you should adjust your pricing for international buyers. Some sellers offer free domestic shipping while charging international buyers actual shipping costs plus a small handling fee to offset the international selling fees. It's also important to note that currency conversion fees may apply if your buyer pays in a different currency, typically around 2.5-3% above the wholesale exchange rate, though this varies by payment processor."
  },
  {
    question: "What are promoted listings and are they worth the cost?",
    answer: "Promoted Listings is eBay's advertising platform that allows sellers to boost their items' visibility in search results and across eBay's network in exchange for an ad fee when the item sells through the promoted placement. Unlike traditional advertising where you pay for impressions or clicks, eBay's Promoted Listings uses a pay-per-sale model, meaning you only pay when your promoted item actually sells. Sellers set an ad rate, typically between 1% and 10%, which determines how prominently their items are displayed. When a buyer clicks on your promoted listing and purchases the item, you pay the ad rate percentage on top of your standard final value fee. For example, if you sell a $50 item with a 5% promoted listing rate, you'd pay an additional $2.50 in advertising fees. Whether Promoted Listings are worth it depends on your inventory type and sales velocity. Items that benefit most include competitive categories where your listings might get buried, seasonal products during peak demand, newly listed items trying to gain traction, and higher-margin products where the ad cost is easily absorbed. The key is to start with a conservative ad rate (2-3%) and monitor your return on ad spend (ROAS). If sales increase proportionally more than your ad costs, the promotion is working. Many successful sellers use Promoted Listings selectively for key inventory rather than across their entire store."
  },
  {
    question: "How do category fee differences impact my profitability?",
    answer: "eBay's category-based fee structure means that where you list your item can significantly impact your profitability, sometimes by several percentage points. Categories with lower final value fee rates include Computers & Tablets and Cameras & Photo at 8%, Musical Instruments at 8%, Cell Phones & Accessories at 10.5%, and eBay Motors at 10%. Conversely, higher-fee categories include Books, Movies & Music at 14.55% and Jewelry & Watches at 15%. For a $100 sale, this difference could mean paying $8 in a low-fee category versus $15 in a high-fee category—a $7 difference that directly affects your bottom line. Some products legitimately fit into multiple categories, creating an opportunity for strategic category selection. For example, a designer phone case might fit in both Cell Phones & Accessories (10.5%) and Fashion (12.55%). However, eBay's policy requires that items be listed in the most relevant category, so this strategy should be used ethically and only when genuinely applicable. Beyond fee rates, consider each category's fee cap. High-value items in categories with lower caps (like Cameras at $250 cap) benefit more than those with higher caps. A $5,000 camera sale would only incur a $250 final value fee, effectively just 5%, making high-end electronics and photography equipment particularly attractive categories for expensive inventory."
  },
  {
    question: "What is the best listing type for minimizing eBay fees?",
    answer: "Choosing the right listing type can substantially reduce your eBay fees, but the optimal choice depends on your product, selling volume, and business model. Fixed-price listings with Good 'Til Cancelled (GTC) duration are generally the most cost-effective for most sellers. Here's why: GTC listings automatically renew every 30 days without additional insertion fees if the item doesn't sell, unlike 30-day fixed-price listings that require manual relisting and a new insertion fee each time. This auto-renewal feature means slow-moving items don't accumulate listing fees while waiting for the right buyer. Auction-style listings, while popular for unique or collectible items, typically carry higher insertion fees ($1.00 vs $0.35) and the uncertainty of final sale price makes profit calculation difficult. However, auctions can be effective for items where competitive bidding might drive prices above your expectations, particularly for rare collectibles or highly sought-after items. For sellers with store subscriptions, the equation changes. Store subscribers receive thousands of free listings monthly, making the insertion fee difference between auction and fixed-price less significant. Additionally, store subscribers get discounts on final value fees, which applies regardless of listing type. The strategic approach is to use GTC fixed-price for most inventory, reserve auctions for items where bidding dynamics add value, and consider 30-day fixed-price for seasonal items where auto-renewal doesn't make sense."
  },
  {
    question: "How can I accurately calculate my true profit margin on eBay sales?",
    answer: "Calculating your true profit margin on eBay requires accounting for all fees and costs, not just the obvious final value fee. Start with your item's sale price and shipping charge combined (gross revenue). From this, subtract: the final value fee (varies by category, typically 8-15%), payment processing fee (2.6% + $0.30 for Managed Payments), insertion fee if applicable (or prorated store subscription cost), promoted listing fee if used, international fees if applicable, actual shipping cost, cost of goods sold (COGS), packaging materials, and any handling costs. Many sellers make the mistake of only calculating the final value fee and forgetting that the cumulative fees can reach 15-20% or more of the sale price. For example, a $50 item with $10 shipping might incur: $6.28 FVF (12.55%), $1.56 payment fee, $0.35 insertion fee, and if using a 5% promoted listing, $2.50 ad fee—totaling $10.69 in eBay fees alone, or about 18% of gross revenue. Add your product cost, shipping expenses, and packaging, and you might find your actual profit margin is much thinner than expected. To maintain healthy margins, use this calculator to understand your true costs, then work backward from your desired profit margin to set appropriate prices. Consider that eBay's fee caps help high-value items, while low-priced items carry proportionally higher fee burdens due to the $0.30 payment processing fixed fee."
  }
];

// Pro Tips Data
const proTips = [
  {
    icon: Zap,
    title: "Use Good 'Til Cancelled Listings",
    description: "GTC listings auto-renew every 30 days without additional insertion fees. This saves money on slow-moving inventory and builds listing history, which improves search ranking over time."
  },
  {
    icon: Target,
    title: "Price Strategically for Fee Caps",
    description: "For high-value items, understand that fee caps can dramatically reduce your effective fee rate. A $3,000 computer sale only incurs a $250 cap, making it just 8.3% in fees instead of 8% ongoing."
  },
  {
    icon: Store,
    title: "Right-Size Your Store Subscription",
    description: "Review your subscription quarterly. If you're listing 100+ items monthly, a Basic Store pays for itself. Premium becomes valuable at 300+ listings. Don't overpay for capacity you don't use."
  },
  {
    icon: TrendingUp,
    title: "Optimize Promoted Listing Rates",
    description: "Start with 2-3% ad rates and monitor ROAS. Higher rates don't always mean more sales. Test incrementally and focus promotions on competitive items or those with healthy margins."
  },
  {
    icon: Globe,
    title: "Factor International Fees Into Pricing",
    description: "International buyers add 1.5% cross-border fee plus potential GSP fees. Either build this into your pricing or consider whether restricting to domestic sales improves profitability for low-margin items."
  },
  {
    icon: Lightbulb,
    title: "Bundle Items to Reduce Fee Impact",
    description: "The $0.30 payment processing fee hits low-priced items hard. Bundling multiple items into one listing spreads this fixed cost across more revenue, improving your effective margin."
  }
];

// Common Mistakes Data
const commonMistakes = [
  {
    icon: XCircle,
    title: "Ignoring All Fee Components",
    description: "Many sellers only calculate the final value fee and are surprised by their actual profit. Always account for payment processing, insertion fees, and any promotional costs. A 12% FVF becomes 15%+ with payment processing alone."
  },
  {
    icon: XCircle,
    title: "Overpaying for Store Subscriptions",
    description: "Paying for an Anchor Store when you list 50 items monthly wastes hundreds of dollars. Calculate your break-even point and upgrade only when your listing volume justifies the cost. Downgrade if your volume decreases."
  },
  {
    icon: XCircle,
    title: "Setting Unrealistic Shipping Prices",
    description: "Underpricing shipping to make items appear cheaper backfires when eBay calculates FVF on the total (item + shipping). Free shipping strategies can work, but ensure your item price covers both shipping and the fees on that shipping amount."
  },
  {
    icon: XCircle,
    title: "Promoting Unprofitable Items",
    description: "Applying promoted listings across your entire store wastes money on items that already sell well or have margins too thin to absorb ad costs. Be selective and only promote items where the additional visibility translates to profitable sales."
  },
  {
    icon: XCircle,
    title: "Relisting Instead of Using GTC",
    description: "Each time you relist a 30-day listing, you incur a new insertion fee (without free listings). GTC listings renew automatically without additional fees, saving money and maintaining listing history for search optimization."
  }
];

export function EBayFeeCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  
  const [inputs, setInputs] = useState<eBayFeeInputs>({
    itemPrice: 100,
    quantity: 1,
    shippingCharge: 10,
    category: "electronics",
    storeSubscription: "none",
    listingType: "fixedPrice",
    auctionDuration: 7,
    isInternational: false,
    useGlobalShipping: false,
    paymentMethod: "managed",
    promotedListing: 0,
    listingCount: 10,
  });
  
  const results = useMemo(() => calculateFees(inputs), [inputs]);
  
  const updateInput = <K extends keyof eBayFeeInputs>(field: K, value: eBayFeeInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };
  
  // Fee breakdown for pie chart
  const feeBreakdownData = useMemo(() => {
    return [
      { name: "Final Value Fee", value: results.finalValueFee, color: "#0F4C81" },
      { name: "Payment Fee", value: results.paymentFee, color: "#2E8B57" },
      { name: "Insertion Fee", value: results.insertionFee, color: "#F59E0B" },
      { name: "International Fee", value: results.internationalFee, color: "#8B5CF6" },
      { name: "Promoted Listing", value: results.promotedFee, color: "#EC4899" },
      { name: "Store Subscription", value: results.storeSubscriptionFee, color: "#6366F1" },
    ].filter(item => item.value > 0);
  }, [results]);
  
  // Category comparison data
  const categoryComparisonData = useMemo(() => {
    return Object.entries(categories).map(([key, category]) => {
      const testInputs = { ...inputs, category: key };
      const testResults = calculateFees(testInputs);
      return {
        category: category.name,
        fvfRate: category.fvfRate,
        fvfCap: category.fvfCap,
        totalFees: testResults.totalFees,
        netProfit: testResults.netProfit,
        effectiveRate: testResults.effectiveFeeRate,
        isCurrent: key === inputs.category,
      };
    }).sort((a, b) => a.totalFees - b.totalFees);
  }, [inputs]);
  
  // Store subscription comparison
  const storeComparisonData = useMemo(() => {
    return Object.entries(storeSubscriptions).map(([key, store]) => {
      const testInputs = { ...inputs, storeSubscription: key as StoreSubscription };
      const testResults = calculateFees(testInputs);
      const breakEvenListings = store.monthlyFee > 0 
        ? Math.ceil(store.monthlyFee / (calculateFees({ ...inputs, storeSubscription: "none" }).totalFees - testResults.totalFees || 1))
        : 0;
      
      return {
        subscription: store.name,
        monthlyFee: store.monthlyFee,
        freeListings: store.freeListings,
        totalFees: testResults.totalFees + (store.monthlyFee / Math.max(inputs.listingCount, 1)),
        netProfit: testResults.netProfit - (store.monthlyFee / Math.max(inputs.listingCount, 1)),
        breakEvenListings,
        isCurrent: key === inputs.storeSubscription,
      };
    });
  }, [inputs]);
  
  // Price sensitivity data
  const priceSensitivityData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const price = inputs.itemPrice * (0.5 + i * 0.1);
      const testInputs = { ...inputs, itemPrice: price };
      const testResults = calculateFees(testInputs);
      return {
        price,
        totalFees: testResults.totalFees,
        netProfit: testResults.netProfit,
        effectiveRate: testResults.effectiveFeeRate,
      };
    });
  }, [inputs]);
  
  const formatMoney = (value: number) => formatCurrency(value, "USD");
  
  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    purple: "#8B5CF6",
    pink: "#EC4899",
    indigo: "#6366F1",
  };
  
  const resetCalculator = () => {
    setInputs({
      itemPrice: 100,
      quantity: 1,
      shippingCharge: 10,
      category: "electronics",
      storeSubscription: "none",
      listingType: "fixedPrice",
      auctionDuration: 7,
      isInternational: false,
      useGlobalShipping: false,
      paymentMethod: "managed",
      promotedListing: 0,
      listingCount: 10,
    });
  };
  
  // Export functionality
  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      inputs: {
        itemPrice: inputs.itemPrice,
        quantity: inputs.quantity,
        shippingCharge: inputs.shippingCharge,
        category: categories[inputs.category].name,
        storeSubscription: storeSubscriptions[inputs.storeSubscription].name,
        listingType: inputs.listingType,
        isInternational: inputs.isInternational,
        paymentMethod: inputs.paymentMethod,
        promotedListing: inputs.promotedListing,
      },
      results: {
        grossRevenue: results.grossRevenue,
        totalFees: results.totalFees,
        netProfit: results.netProfit,
        effectiveFeeRate: results.effectiveFeeRate,
        feeBreakdown: {
          finalValueFee: results.finalValueFee,
          paymentFee: results.paymentFee,
          insertionFee: results.insertionFee,
          internationalFee: results.internationalFee,
          promotedFee: results.promotedFee,
          storeSubscriptionFee: results.storeSubscriptionFee,
        },
      },
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ebay-fee-calculation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };
  
  // Share functionality
  const shareResults = async () => {
    const shareText = `eBay Fee Calculation:
Item Price: ${formatMoney(inputs.itemPrice)}
Category: ${categories[inputs.category].name}
Gross Revenue: ${formatMoney(results.grossRevenue)}
Total Fees: ${formatMoney(results.totalFees)}
Net Profit: ${formatMoney(results.netProfit)}
Effective Fee Rate: ${results.effectiveFeeRate.toFixed(2)}%`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "eBay Fee Calculation",
          text: shareText,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 md:p-8 border border-border/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <AnimatedBadge delay={0}>E-Commerce</AnimatedBadge>
              <AnimatedBadge delay={0.1}>eBay Fees</AnimatedBadge>
              <AnimatedBadge delay={0.2}>Profit Calculator</AnimatedBadge>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">eBay Fee Calculator</h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Calculate all eBay selling fees including insertion fees, final value fees, payment processing, 
                and international charges. Optimize your pricing strategy and maximize profitability.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={resetCalculator}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportResults}>
                {exported ? <Check className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                {exported ? "Exported!" : "Export"}
              </Button>
              <Button variant="outline" size="sm" onClick={shareResults}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Share"}
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="p-4 bg-background rounded-lg border border-border shadow-sm">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Quick Summary</div>
                <div className="text-3xl font-bold text-[var(--ocean)]">{results.effectiveFeeRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Effective Fee Rate</div>
                <Separator className="my-3" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-[var(--logistics)]">{formatMoney(results.netProfit)}</div>
                    <div className="text-xs text-muted-foreground">Net Profit</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[var(--ocean)]">{formatMoney(results.totalFees)}</div>
                    <div className="text-xs text-muted-foreground">Total Fees</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="flex items-center gap-1">
            <Calculator className="h-4 w-4 hidden sm:inline" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1">
            <PieChartIcon className="h-4 w-4 hidden sm:inline" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4 hidden sm:inline" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4 hidden sm:inline" />
            Guide
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4 hidden sm:inline" />
            FAQ
          </TabsTrigger>
        </TabsList>
        
        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Item Details
                  </CardTitle>
                  <CardDescription>
                    Enter item price, quantity, and shipping charges
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Item Price */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Item Price (USD)
                    </Label>
                    <Input
                      type="number"
                      value={inputs.itemPrice}
                      onChange={(e) => updateInput("itemPrice", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      value={inputs.quantity}
                      onChange={(e) => updateInput("quantity", parseInt(e.target.value) || 1)}
                      min={1}
                    />
                  </div>
                  
                  {/* Shipping Charge */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Shipping Charge (USD)
                    </Label>
                    <Input
                      type="number"
                      value={inputs.shippingCharge}
                      onChange={(e) => updateInput("shippingCharge", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Product Category
                    </Label>
                    <Select
                      value={inputs.category}
                      onValueChange={(v) => updateInput("category", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categories).map(([key, category]) => (
                          <SelectItem key={key} value={key}>
                            {category.name} ({category.fvfRate}% FVF)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Store className="h-5 w-5 text-[var(--logistics)]" />
                    Listing Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Store Subscription */}
                  <div className="space-y-2">
                    <Label>Store Subscription</Label>
                    <Select
                      value={inputs.storeSubscription}
                      onValueChange={(v) => updateInput("storeSubscription", v as StoreSubscription)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Subscription</SelectItem>
                        <SelectItem value="basic">Basic Store ($24.95/mo)</SelectItem>
                        <SelectItem value="premium">Premium Store ($74.95/mo)</SelectItem>
                        <SelectItem value="anchor">Anchor Store ($349.95/mo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Listing Type */}
                  <div className="space-y-2">
                    <Label>Listing Type</Label>
                    <Select
                      value={inputs.listingType}
                      onValueChange={(v) => updateInput("listingType", v as ListingType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auction">Auction Style</SelectItem>
                        <SelectItem value="fixedPrice">Fixed Price (30 days)</SelectItem>
                        <SelectItem value="goodTilCancelled">Good &apos;Til Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Auction Duration */}
                  {inputs.listingType === "auction" && (
                    <div className="space-y-2">
                      <Label>Auction Duration</Label>
                      <Select
                        value={inputs.auctionDuration.toString()}
                        onValueChange={(v) => updateInput("auctionDuration", parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Day</SelectItem>
                          <SelectItem value="3">3 Days</SelectItem>
                          <SelectItem value="5">5 Days</SelectItem>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="10">10 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Method
                    </Label>
                    <Select
                      value={inputs.paymentMethod}
                      onValueChange={(v) => updateInput("paymentMethod", v as PaymentMethod)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="managed">Managed Payments (2.6% + $0.30)</SelectItem>
                        <SelectItem value="paypal">PayPal (2.9% + $0.30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Promoted Listing */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Promoted Listing Rate (%)
                    </Label>
                    <Input
                      type="number"
                      value={inputs.promotedListing}
                      onChange={(e) => updateInput("promotedListing", parseFloat(e.target.value) || 0)}
                      min={0}
                      max={100}
                      step={0.5}
                    />
                    <p className="text-xs text-muted-foreground">Ad fee charged only when item sells</p>
                  </div>
                  
                  {/* Monthly Listing Count */}
                  <div className="space-y-2">
                    <Label>Monthly Listing Count (for fee prorating)</Label>
                    <Input
                      type="number"
                      value={inputs.listingCount}
                      onChange={(e) => updateInput("listingCount", parseInt(e.target.value) || 1)}
                      min={1}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[var(--ocean)]" />
                    International Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>International Sale</Label>
                      <p className="text-xs text-muted-foreground">Selling to buyers outside your country</p>
                    </div>
                    <Switch
                      checked={inputs.isInternational}
                      onCheckedChange={(v) => updateInput("isInternational", v)}
                    />
                  </div>
                  
                  {inputs.isInternational && (
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Use Global Shipping Program</Label>
                        <p className="text-xs text-muted-foreground">eBay handles international shipping</p>
                      </div>
                      <Switch
                        checked={inputs.useGlobalShipping}
                        onCheckedChange={(v) => updateInput("useGlobalShipping", v)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Fee Calculation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Gross Revenue */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Gross Revenue</div>
                      <div className="text-2xl font-bold text-[var(--logistics)]">
                        {formatMoney(results.grossRevenue)}
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Net Profit</div>
                      <div className="text-2xl font-bold text-[var(--ocean)]">
                        {formatMoney(results.netProfit)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Effective Fee Rate */}
                  <motion.div
                    key={results.effectiveFeeRate}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-6 rounded-xl bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--logistics)]/10"
                  >
                    <div className="text-sm text-muted-foreground mb-1">Effective Fee Rate</div>
                    <div className="text-4xl font-bold text-[var(--ocean)]">
                      {results.effectiveFeeRate.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatMoney(results.totalFees)} total fees
                    </div>
                  </motion.div>
                  
                  {/* Fee Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Fee Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Percent className="h-3 w-3" />
                          Final Value Fee ({categories[inputs.category].fvfRate}%)
                        </span>
                        <span className="font-medium">{formatMoney(results.finalValueFee)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <CreditCard className="h-3 w-3" />
                          Payment Processing
                        </span>
                        <span className="font-medium">{formatMoney(results.paymentFee)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Package className="h-3 w-3" />
                          Insertion Fee
                        </span>
                        <span className="font-medium">{formatMoney(results.insertionFee)}</span>
                      </div>
                      {inputs.isInternational && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            International Fee
                          </span>
                          <span className="font-medium text-purple-600">{formatMoney(results.internationalFee)}</span>
                        </div>
                      )}
                      {inputs.promotedListing > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-3 w-3" />
                            Promoted Listing Fee
                          </span>
                          <span className="font-medium text-pink-600">{formatMoney(results.promotedFee)}</span>
                        </div>
                      )}
                      {inputs.storeSubscription !== "none" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Store className="h-3 w-3" />
                            Store Subscription (prorated)
                          </span>
                          <span className="font-medium text-indigo-600">{formatMoney(results.storeSubscriptionFee)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total Fees</span>
                        <span className="text-[var(--ocean)]">{formatMoney(results.totalFees)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={resetCalculator} className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportResults} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={shareResults} className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Store Subscription Benefits */}
              {inputs.storeSubscription !== "none" && (
                <Card className="bg-[var(--logistics)]/5 border-[var(--logistics)]/20">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">
                          {storeSubscriptions[inputs.storeSubscription].name} Benefits
                        </p>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• {storeSubscriptions[inputs.storeSubscription].freeListings} free listings per month</li>
                          <li>• {(storeSubscriptions[inputs.storeSubscription].insertionFeeDiscount * 100).toFixed(0)}% off insertion fees</li>
                          <li>• {(storeSubscriptions[inputs.storeSubscription].fvfDiscount * 100).toFixed(0)}% off final value fees</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Category Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="h-4 w-4 text-[var(--ocean)]" />
                    Category Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">FVF Rate:</span>
                      <span className="ml-2 font-medium">{categories[inputs.category].fvfRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">FVF Cap:</span>
                      <span className="ml-2 font-medium">{formatMoney(categories[inputs.category].fvfCap)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Int&apos;l Rate:</span>
                      <span className="ml-2 font-medium">{categories[inputs.category].internationalRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pie Chart - Fee Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                  Fee Composition
                </CardTitle>
                <CardDescription>
                  Visual breakdown of all eBay fees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={feeBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        labelLine={true}
                      >
                        {feeBreakdownData.map((entry, index) => (
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 space-y-2">
                  {feeBreakdownData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{formatMoney(item.value)}</span>
                        <span className="text-muted-foreground">
                          {((item.value / results.totalFees) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Line Chart - Price Sensitivity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-[var(--logistics)]" />
                  Price Sensitivity Analysis
                </CardTitle>
                <CardDescription>
                  How fees change with different item prices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={priceSensitivityData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                      <XAxis 
                        dataKey="price" 
                        tickFormatter={(v) => `$${v.toFixed(0)}`}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis 
                        yAxisId="left" 
                        tickFormatter={(v) => `$${v}`}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip 
                        formatter={(value: number, name) => [
                          name === "effectiveRate" ? `${value.toFixed(2)}%` : formatMoney(value),
                          name === "totalFees" ? "Total Fees" : name === "netProfit" ? "Net Profit" : "Fee Rate"
                        ]}
                        labelFormatter={(label) => `Item Price: $${label.toFixed(2)}`}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="totalFees" name="Total Fees" fill={chartColors.ocean} opacity={0.8} />
                      <Line yAxisId="left" dataKey="netProfit" name="Net Profit" stroke={chartColors.logistics} strokeWidth={2} />
                      <Line yAxisId="right" dataKey="effectiveRate" name="Fee Rate %" stroke={chartColors.warning} strokeWidth={2} strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Insight:</strong> The effective fee rate varies with price. Higher-priced items 
                    benefit from the FVF cap, resulting in lower percentage fees for expensive items.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Detailed Fee Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Fee Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-5 w-5 text-[var(--ocean)]" />
                    <span className="font-medium">Final Value Fee</span>
                  </div>
                  <p className="text-2xl font-bold mb-2">{formatMoney(results.finalValueFee)}</p>
                  <p className="text-xs text-muted-foreground">
                    {categories[inputs.category].fvfRate}% of item price (capped at {formatMoney(categories[inputs.category].fvfCap)})
                    {inputs.storeSubscription !== "none" && (
                      <span className="text-[var(--logistics)]">
                        {" "}with {(storeSubscriptions[inputs.storeSubscription].fvfDiscount * 100).toFixed(0)}% store discount
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-[var(--logistics)]" />
                    <span className="font-medium">Payment Processing</span>
                  </div>
                  <p className="text-2xl font-bold mb-2">{formatMoney(results.paymentFee)}</p>
                  <p className="text-xs text-muted-foreground">
                    {inputs.paymentMethod === "managed" ? "2.6%" : "2.9%"} + $0.30 per transaction
                    via {inputs.paymentMethod === "managed" ? "Managed Payments" : "PayPal"}
                  </p>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-[var(--warning)]" />
                    <span className="font-medium">Insertion Fee</span>
                  </div>
                  <p className="text-2xl font-bold mb-2">{formatMoney(results.insertionFee)}</p>
                  <p className="text-xs text-muted-foreground">
                    {results.insertionFee === 0 
                      ? `Covered by ${storeSubscriptions[inputs.storeSubscription].freeListings} free monthly listings`
                      : `${inputs.listingType === "auction" ? "Auction" : "Fixed Price"} listing fee`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profit Margin Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Profit Margin Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Gross Margin</div>
                  <div className="text-2xl font-bold text-[var(--logistics)]">
                    {((results.netProfit / results.grossRevenue) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Fee Ratio</div>
                  <div className="text-2xl font-bold text-[var(--ocean)]">
                    {results.effectiveFeeRate.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Revenue per Item</div>
                  <div className="text-2xl font-bold text-[var(--logistics)]">
                    {formatMoney(results.grossRevenue / inputs.quantity)}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Profit per Item</div>
                  <div className="text-2xl font-bold text-[var(--ocean)]">
                    {formatMoney(results.netProfit / inputs.quantity)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab 3: Comparison */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          {/* Bar Chart - Category Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-[var(--ocean)]" />
                Category Fee Comparison
              </CardTitle>
              <CardDescription>
                Compare fees across different eBay product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                    <XAxis type="number" tickFormatter={(v) => formatMoney(v)} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip 
                      formatter={(value: number) => formatMoney(value)}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="totalFees" name="Total Fees" fill={chartColors.ocean} radius={[0, 4, 4, 0]}>
                      {categoryComparisonData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isCurrent ? chartColors.logistics : chartColors.ocean}
                          opacity={entry.isCurrent ? 1 : 0.6}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-right py-3 px-4">FVF Rate</th>
                      <th className="text-right py-3 px-4">FVF Cap</th>
                      <th className="text-right py-3 px-4">Total Fees</th>
                      <th className="text-right py-3 px-4">Net Profit</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryComparisonData.map((row) => (
                      <tr 
                        key={row.category}
                        className={`border-b ${row.isCurrent ? "bg-[var(--logistics)]/10" : ""}`}
                      >
                        <td className="py-3 px-4 font-medium">{row.category}</td>
                        <td className="text-right py-3 px-4">{row.fvfRate}%</td>
                        <td className="text-right py-3 px-4">{formatMoney(row.fvfCap)}</td>
                        <td className="text-right py-3 px-4">{formatMoney(row.totalFees)}</td>
                        <td className="text-right py-3 px-4 font-medium">{formatMoney(row.netProfit)}</td>
                        <td className="text-center py-3 px-4">
                          {row.isCurrent ? (
                            <Badge className="bg-[var(--logistics)]">Selected</Badge>
                          ) : (
                            <Badge variant="outline">-</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Store Subscription Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-[var(--ocean)]" />
                Store Subscription Comparison
              </CardTitle>
              <CardDescription>
                Compare costs and benefits across eBay store subscription levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={storeComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                    <XAxis dataKey="subscription" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickFormatter={(v) => formatMoney(v)} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip 
                      formatter={(value: number) => formatMoney(v)}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="monthlyFee" name="Monthly Fee" fill={chartColors.warning} />
                    <Bar dataKey="totalFees" name="Per-Listing Fees" fill={chartColors.ocean} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Subscription</th>
                      <th className="text-right py-3 px-4">Monthly Fee</th>
                      <th className="text-right py-3 px-4">Free Listings</th>
                      <th className="text-right py-3 px-4">FVF Discount</th>
                      <th className="text-right py-3 px-4">Break-Even Listings</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeComparisonData.map((row) => (
                      <tr 
                        key={row.subscription}
                        className={`border-b ${row.isCurrent ? "bg-[var(--logistics)]/10" : ""}`}
                      >
                        <td className="py-3 px-4 font-medium">{row.subscription}</td>
                        <td className="text-right py-3 px-4">{formatMoney(row.monthlyFee)}</td>
                        <td className="text-right py-3 px-4">{row.freeListings.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          {storeSubscriptions[row.subscription.toLowerCase().split(" ")[0] as StoreSubscription]?.fvfDiscount !== undefined
                            ? `${(storeSubscriptions[row.subscription.toLowerCase().split(" ")[0] as StoreSubscription].fvfDiscount * 100).toFixed(0)}%`
                            : "-"
                          }
                        </td>
                        <td className="text-right py-3 px-4">{row.breakEvenListings} listings</td>
                        <td className="text-center py-3 px-4">
                          {row.isCurrent ? (
                            <Badge className="bg-[var(--logistics)]">Selected</Badge>
                          ) : (
                            <Badge variant="outline">-</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Store Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(storeSubscriptions).map(([key, store]) => (
              <Card 
                key={key}
                className={`${inputs.storeSubscription === key ? "border-[var(--logistics)] border-2" : ""}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{store.name}</CardTitle>
                  <div className="text-2xl font-bold text-[var(--ocean)]">
                    {formatMoney(store.monthlyFee)}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                      {store.freeListings.toLocaleString()} free listings/mo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                      {(store.insertionFeeDiscount * 100).toFixed(0)}% off insertion fees
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                      {(store.fvfDiscount * 100).toFixed(0)}% off FVF
                    </li>
                  </ul>
                  {key !== "none" && (
                    <div className="mt-4 text-xs text-muted-foreground">
                      Annual: {formatMoney(store.renewalPrice)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                Understanding eBay Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-muted-foreground">
                eBay fees represent the cost of doing business on one of the world&apos;s largest online marketplaces. 
                Understanding these fees is crucial for any seller who wants to maintain profitability and make 
                informed pricing decisions. The fee structure has evolved significantly over the years, with eBay 
                now managing payments directly through their Managed Payments system rather than relying on PayPal 
                as the primary payment processor. This shift has simplified the fee structure for most sellers while 
                introducing new considerations for pricing strategy. The primary fee components include insertion fees 
                (charged when listing an item), final value fees (charged when an item sells), payment processing fees, 
                and optional fees for services like promoted listings and international shipping programs. Each of these 
                components affects your bottom line differently, and smart sellers learn to optimize each one. 
                Understanding the interplay between these fees and your pricing decisions can mean the difference 
                between a profitable eBay business and one that struggles to maintain margins.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Percent className="h-5 w-5 text-[var(--logistics)]" />
                Fee Structure Explained
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-muted-foreground">
                eBay&apos;s fee structure consists of several distinct components that together determine your total 
                selling costs. Insertion fees, also known as listing fees, are charged when you create a listing. 
                For most sellers, fixed-price listings cost $0.35 per listing, while auction-style listings cost 
                $1.00 for 1-7 day durations and $2.00 for 10-day auctions. However, many sellers qualify for free 
                listings through store subscriptions or promotional offers. Final value fees are the primary selling 
                cost, calculated as a percentage of the total sale amount including shipping. These rates vary by 
                category, ranging from 8% for computers and cameras to 15% for jewelry and watches. Each category 
                has a maximum fee cap, which limits the total final value fee regardless of the sale price. Payment 
                processing fees through eBay Managed Payments add approximately 2.6% plus $0.30 per transaction, 
                though rates may vary based on your seller metrics and transaction volume. Optional fees include 
                promoted listings (ad rates you set, typically 1-10%), international selling fees (1.5% cross-border 
                fee plus optional Global Shipping Program fees), and store subscription fees for sellers who want 
                discounted rates and additional benefits. Understanding how each of these fees applies to your 
                specific selling situation is essential for accurate profit calculation and strategic pricing.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Optimizing Pricing Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-muted-foreground">
                Effective pricing on eBay requires balancing competitive positioning with profitability, and 
                understanding the fee structure is fundamental to this balance. Start by calculating your total 
                cost of goods sold, including acquisition cost, shipping to you, storage, and any preparation or 
                refurbishment expenses. Add your desired profit margin, then calculate the fees you&apos;ll pay at 
                various price points. Remember that eBay&apos;s final value fee applies to the total sale amount 
                including shipping, so offering free shipping means you&apos;ll pay fees on that shipping amount too. 
                Consider the category fee differences when listing items that could fit multiple categories. For 
                example, a phone case might fit in both Cell Phones & Accessories (10.5% FVF) and Fashion (12.55% FVF). 
                The category you choose should be the most relevant, but when items legitimately fit multiple categories, 
                the fee difference might influence your decision. High-value items benefit from fee caps, so selling 
                a $5,000 camera incurs only $250 in final value fees despite the 8% rate. This makes high-value items 
                in low-fee categories particularly attractive for sellers. Consider using Good &apos;Til Cancelled listings 
                for inventory that sells consistently but slowly, as these auto-renew without additional insertion fees 
                and build listing history that can improve search visibility over time.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--warning)]" />
                Fee Reduction Strategies
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-muted-foreground">
                Strategic sellers employ multiple tactics to reduce their eBay fees and improve profitability. 
                Store subscriptions offer significant savings for active sellers, with benefits including free 
                monthly listings, discounts on insertion fees, and reductions on final value fees. Calculate 
                your break-even point by comparing your current listing costs against subscription prices. 
                A Basic Store at $24.95/month with 250 free listings can pay for itself quickly if you 
                regularly list 50 or more items monthly. Category selection can reduce fees by 2-7% for 
                items that legitimately fit multiple categories. Always prioritize relevance to buyer search 
                behavior, but when items fit equally well in multiple categories, choose the one with lower 
                fees. Good &apos;Til Cancelled listings eliminate repeated insertion fees for slow-moving inventory 
                and build listing history that improves search ranking over time. Promoted listings should 
                be used strategically rather than across your entire inventory. Set moderate ad rates (2-3%) 
                for items where additional visibility translates to faster sales, and avoid promoting items 
                with thin margins where ad costs erode profitability. Consider international selling carefully, 
                as additional cross-border fees and potential GSP costs can add 6.5% or more to your selling 
                costs. For some products, focusing on domestic sales while optimizing pricing locally may be 
                more profitable than expanding globally with the added fee burden.
              </p>
            </CardContent>
          </Card>
          
          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--ocean)]" />
                Pro Tips & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {proTips.map((tip, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <tip.icon className="h-5 w-5 text-[var(--ocean)]" />
                      <span className="font-medium">{tip.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMistakes.map((mistake, index) => (
                  <div key={index} className="flex gap-3 p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                    <mistake.icon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">{mistake.title}</span>
                      <p className="text-sm text-muted-foreground mt-1">{mistake.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Fee Structure Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">eBay Fee Structure Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="insertion">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[var(--ocean)]" />
                      <span>Insertion Fees (Listing Fees)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        Insertion fees are charged when you list an item for sale, regardless of whether it sells.
                      </p>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Listing Type</th>
                            <th className="text-right py-2">Fee</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="py-2">Auction (1-7 days)</td>
                            <td className="text-right">$1.00</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Auction (10 days)</td>
                            <td className="text-right">$2.00</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Fixed Price (30 days)</td>
                            <td className="text-right">$0.35</td>
                          </tr>
                          <tr>
                            <td className="py-2">Good &apos;Til Cancelled</td>
                            <td className="text-right">$0.35</td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="text-xs text-muted-foreground">
                        Note: Store subscribers get discounts on insertion fees and free monthly listings.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="fvf">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-[var(--logistics)]" />
                      <span>Final Value Fees (Selling Fees)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        Final Value Fees are charged when your item sells. The fee is a percentage of the 
                        total sale amount (item price + shipping) with a maximum cap per category.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Category</th>
                              <th className="text-right py-2">Rate</th>
                              <th className="text-right py-2">Cap</th>
                            </tr>
                          </thead>
                          <tbody className="text-muted-foreground">
                            {Object.entries(categories).map(([key, cat]) => (
                              <tr key={key} className="border-b">
                                <td className="py-2">{cat.name}</td>
                                <td className="text-right">{cat.fvfRate}%</td>
                                <td className="text-right">{formatMoney(cat.fvfCap)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="payment">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-500" />
                      <span>Payment Processing Fees</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        eBay&apos;s Managed Payments is now the default. PayPal is still available but 
                        with slightly higher fees.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium mb-2">Managed Payments</h4>
                          <p className="text-xl font-bold">2.6% + $0.30</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Standard rate for most sellers. Rates may vary based on seller metrics.
                          </p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium mb-2">PayPal</h4>
                          <p className="text-xl font-bold">2.9% + $0.30</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Higher rate, but PayPal offers buyer/seller protections.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="international">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-pink-500" />
                      <span>International Selling Fees</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        Selling internationally incurs additional fees on top of standard fees.
                      </p>
                      <div className="space-y-3">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium mb-2">Cross-Border Fee</h4>
                          <p className="text-xl font-bold">1.5% additional</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Applied to all international sales regardless of shipping method.
                          </p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium mb-2">Global Shipping Program</h4>
                          <p className="text-xl font-bold">5% of item + shipping</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Optional program where eBay handles international shipping and customs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="promoted">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-500" />
                      <span>Promoted Listings</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        Promoted listings increase visibility. You set an ad rate (typically 1-10%) 
                        and only pay when the item sells through the promoted placement.
                      </p>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium mb-2">How It Works</h4>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• Set ad rate from 0.5% to 100%</li>
                          <li>• Higher rates = better placement</li>
                          <li>• Fee charged only on promoted sales</li>
                          <li>• Typical range: 2-5% for best ROI</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common eBay fee questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2 text-left">
                        <Badge variant="outline" className="shrink-0">Q{index + 1}</Badge>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed pt-2">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
