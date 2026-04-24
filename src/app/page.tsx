"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useScroll, useSpring, useInView } from "framer-motion";
import {
  Ship,
  Plane,
  Truck,
  Container,
  Calculator,
  FileText,
  TrendingUp,
  Shield,
  Globe,
  MapPin,
  DollarSign,
  BarChart3,
  Anchor,
  Boxes,
  Package,
  Newspaper,
  ArrowRight,
  Clock,
  Eye,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  AlertTriangle,
  Zap,
  Leaf,
  Briefcase,
  Landmark,
  Sparkles,
  ChevronRight,
  Bell,
  Flame,
  CheckCircle,
  Users,
  Building,
  Star,
  Play,
  Pause,
  Search,
  Moon,
  Sun,
  X,
  MessageCircle,
  Keyboard,
  Lightbulb,
  Cloud,
  CloudSun,
  CloudRain,
  ArrowUp,
  Target,
  Sunrise,
  Sunset,
  Compass,
  Layers,
  Radar,
  ExternalLink,
  Ruler,
  Route,
  FileCheck,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import { useRouter } from 'next/navigation';

// FIXED: Dynamic import with SSR disabled
const GlobalPortsMap = dynamic(() => import('@/components/GlobalPortsMap'), {
  ssr: false,
  loading: () => <div className="h- w-full bg-slate-100 animate-pulse flex items-center justify-center rounded-xl border-slate-200"><span className="text-slate-400">Loading map...</span></div>
});

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Types
interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  category: string;
  publishedAt: string;
  source: string;
  sourceUrl: string;
  originalUrl: string;
  region: string;
  isAlert: boolean;
  trending: boolean;
  imageUrl?: string;
  imageCredit?: string;
  imageSource?: string;
  readTime?: number;
  views?: number;
}

interface NewsResponse {
  success: boolean;
  data: NewsItem[];
  meta: {
    total: number;
    returned: number;
    region: string;
    category: string;
    lastUpdated: string;
  };
}

// Keyboard Shortcuts
const KEYBOARD_SHORTCUTS = [
  { key: "Ctrl+K", action: "Open Search", icon: Search },
  { key: "Ctrl+D", action: "Toggle Dark Mode", icon: Moon },
  { key: "Ctrl+N", action: "Latest News", icon: Newspaper },
  { key: "Ctrl+T", action: "Tools", icon: Calculator },
  { key: "Esc", action: "Close Modal", icon: X },
];

// Quick Access Pills for Hero
const quickPills = [
  { name: "CBM Calculator", icon: Container, href: "/tools/ocean-freight/cbm-calculator" },
  { name: "Container Planner", icon: Boxes, href: "/tools/ocean-freight/container-loading-calculator" },
  { name: "HS Code", icon: Layers, href: "/tools/customs-compliance/hs-code-search" },
  { name: "Port Finder", icon: Anchor, href: "/directories/ports" },
  { name: "Landed Cost", icon: DollarSign, href: "/tools/international-trade/landed-cost-calculator" },
];

// Trade Tools Grid (8 Tools)
const tradeTools = [
  { name: "Distance & Time", description: "Calculate transit times between ports", icon: Route, href: "/tools/ocean-freight/transit-time", color: OCEAN_BLUE },
  { name: "Volumetric Weight", description: "Air freight chargeable weight", icon: Package, href: "/tools/air-freight/volumetric-weight", color: "#8B5CF6" },
  { name: "Freight Rates", description: "Compare shipping rates", icon: TrendingUp, href: "/tools/ocean-freight/freight-rate-calculator", color: LOGISTICS_GREEN },
  { name: "Currency", description: "Live exchange rates", icon: DollarSign, href: "/tools/international-trade/currency-converter", color: "#F59E0B" },
  { name: "Incoterms", description: "Trade terms guide", icon: Globe, href: "/tools/international-trade/incoterms-guide", color: "#EC4899" },
  { name: "Demurrage", description: "Port storage fees", icon: Timer, href: "/tools/ocean-freight/demurrage-calculator", color: "#EF4444" },
  { name: "Tracking", description: "Container tracking", icon: Radar, href: "/tools/ocean-freight/container-tracking", color: "#06B6D4" },
  { name: "Documents", description: "Generate trade docs", icon: FileCheck, href: "/documents", color: "#10B981" },
];

// Featured Calculators (3 Cards)
const featuredCalculators = [
  {
    name: "CBM Calculator",
    description: "Calculate cubic meters and container fit",
    icon: Container,
    href: "/tools/ocean-freight/cbm-calculator",
    color: OCEAN_BLUE,
    features: ["Volume calculation", "Container fit", "Multi-package support"]
  },
  {
    name: "Container Load Planner",
    description: "Optimize pallet placement in containers",
    icon: Boxes,
    href: "/tools/ocean-freight/container-loading-calculator",
    color: LOGISTICS_GREEN,
    features: ["Pallet optimization", "Maximize space", "Load visualization"]
  },
  {
    name: "HS Code Finder",
    description: "Find customs codes for products",
    icon: Layers,
    href: "/tools/customs-compliance/hs-code-search",
    color: "#8B5CF6",
    features: ["Product search", "Duty rates", "Trade agreements"]
  },
];

// Quick Actions - For Modal
const quickActions = [
  { name: "CBM Calculator", icon: Container, href: "/tools/ocean-freight/cbm-calculator", color: OCEAN_BLUE, shortcut: "Alt+1", modal: "cbm" },
  { name: "Container Tracking", icon: MapPin, href: "/tools/ocean-freight/container-tracking", color: LOGISTICS_GREEN, shortcut: "Alt+2", modal: "tracking" },
  { name: "HS Code Search", icon: Search, href: "/tools/customs-compliance/hs-code-search", color: "#8B5CF6", shortcut: "Alt+3", modal: "hscode" },
  { name: "Currency Converter", icon: DollarSign, href: "/tools/international-trade/currency-converter", color: "#F59E0B", shortcut: "Alt+4", modal: null },
];

// Statistics data
const stats = [
  { value: 82, label: "Logistics Calculators", icon: Calculator, suffix: "+" },
  { value: 72, label: "Document Generators", icon: FileText, suffix: "+" },
  { value: 40, label: "News Sources", icon: Newspaper, suffix: "+" },
  { value: 50, label: "Currencies Supported", icon: DollarSign, suffix: "+" },
];

// Trust badges
const trustBadges = [
  { icon: Shield, text: "ISO 27001 Certified" },
  { icon: CheckCircle, text: "SOC 2 Compliant" },
  { icon: Globe, text: "GDPR Ready" },
  { icon: Zap, text: "99.9% Uptime" },
];

// Freight rate data for chart
const freightRateData = [
  { month: "Jan", rate: 2450, index: 102 },
  { month: "Feb", rate: 2380, index: 99 },
  { month: "Mar", rate: 2520, index: 105 },
  { month: "Apr", rate: 2680, index: 111 },
  { month: "May", rate: 2850, index: 118 },
  { month: "Jun", rate: 3120, index: 129 },
  { month: "Jul", rate: 3450, index: 143 },
  { month: "Aug", rate: 3280, index: 136 },
  { month: "Sep", rate: 3520, index: 146 },
  { month: "Oct", rate: 3680, index: 153 },
  { month: "Nov", rate: 3850, index: 160 },
  { month: "Dec", rate: 3920, index: 163 },
];

// Market indices - Compact for strip
const marketIndicesStrip = [
  { name: "FBX", value: "3,920", change: "+2.4%", up: true },
  { name: "BDI", value: "1,847", change: "-1.2%", up: false },
  { name: "EUR/USD", value: "1.0842", change: "+0.12%", up: true },
  { name: "WTI", value: "$79.20", change: "+0.8%", up: true },
];

// Educational content
const educationalContent = [
  {
    title: "Incoterms 2020",
    description: "Understand the 11 international trade terms that define responsibilities between buyers and sellers.",
    icon: Globe,
    href: "/tools/international-trade/incoterms-guide",
    color: OCEAN_BLUE,
  },
  {
    title: "HS Codes Guide",
    description: "Learn how to classify products for customs declarations and duty calculations.",
    icon: BarChart3,
    href: "/tools/customs-compliance/hs-code-search",
    color: LOGISTICS_GREEN,
  },
  {
    title: "Container Types",
    description: "Complete guide to ISO container specifications, dimensions, and applications.",
    icon: Container,
    href: "/tools/ocean-freight/container-guide",
    color: "#8B5CF6",
  },
];

// Directories preview
const directoriesPreview = [
  { name: "Global Ports", count: "11,247", icon: Anchor, href: "/directories/ports" },
  { name: "Shipping Lines", count: "150+", icon: Ship, href: "/directories/shipping-lines" },
  { name: "Freight Forwarders", count: "200+", icon: Truck, href: "/directories/freight-forwarders" },
  { name: "Customs Brokers", count: "100+", icon: Shield, href: "/directories/customs-brokers" },
];

// Shipping Hub Timezones
const shippingHubs = [
  { city: "Shanghai", timezone: "Asia/Shanghai", flag: "🇨🇳" },
  { city: "Rotterdam", timezone: "Europe/Amsterdam", flag: "🇳🇱" },
  { city: "Singapore", timezone: "Asia/Singapore", flag: "🇸🇬" },
  { city: "Los Angeles", timezone: "America/Los_Angeles", flag: "🇺🇸" },
];

// Category config with images
const categoryConfig: Record<string, { bg: string; text: string; gradient: string; icon: React.ElementType; image: string; imageCredit: string }> = {
  "All": { bg: "bg-gray-500", text: "text-gray-600", gradient: "from-gray-500 to-slate-500", icon: Newspaper, image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop", imageCredit: "Photo by Niclas Illg" },
  "Ocean Freight": { bg: "bg-blue-500", text: "text-blue-600", gradient: "from-blue-500 to-cyan-500", icon: Ship, image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop", imageCredit: "Photo by Ant Rozetsky" },
  "Air Freight": { bg: "bg-purple-500", text: "text-purple-600", gradient: "from-purple-500 to-violet-500", icon: Plane, image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop", imageCredit: "Photo by 张 鑫" },
  "Trade Finance": { bg: "bg-emerald-500", text: "text-emerald-600", gradient: "from-emerald-500 to-teal-500", icon: DollarSign, image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop", imageCredit: "Photo by Michael Longmire" },
  "Customs": { bg: "bg-rose-500", text: "text-rose-600", gradient: "from-rose-500 to-pink-500", icon: Shield, image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=300&fit=crop", imageCredit: "Photo by Mick Haupt" },
  "Technology": { bg: "bg-indigo-500", text: "text-indigo-600", gradient: "from-indigo-500 to-blue-500", icon: Zap, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop", imageCredit: "Photo by Louis Reed" },
  "Sustainability": { bg: "bg-green-500", text: "text-green-600", gradient: "from-green-500 to-emerald-500", icon: Leaf, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop", imageCredit: "Photo by Matt Howard" },
  "Logistics": { bg: "bg-orange-500", text: "text-orange-600", gradient: "from-orange-500 to-amber-500", icon: Truck, image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop", imageCredit: "Photo by Kyle Deang" },
  "E-Commerce": { bg: "bg-pink-500", text: "text-pink-600", gradient: "from-pink-500 to-rose-500", icon: Briefcase, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop", imageCredit: "Photo by CardMapr" },
  "Geopolitical": { bg: "bg-red-600", text: "text-red-700", gradient: "from-red-600 to-rose-600", icon: Landmark, image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop", imageCredit: "Photo by Colin Watts" },
};

// Format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
};

// Get greeting based on time
const getDefaultGreeting = () => ({ text: "Welcome", icon: Sun });
const getGreeting = () => {
  if (typeof window === 'undefined') return getDefaultGreeting();
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", icon: Sunrise };
  if (hour < 18) return { text: "Good Afternoon", icon: CloudSun };
  return { text: "Good Evening", icon: Sunset };
};

// Animated Counter Component
function AnimatedCounter({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const increment = end / (duration * 60);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

// Enhanced Search Suggestions Component
function SearchSuggestions({ query, onClose }: { query: string; onClose: () => void }) {
  const suggestions = useMemo(() => {
    if (!query) return [];
    const allItems = [
     ...tradeTools.map(t => ({ type: 'tool' as const, name: t.name, href: t.href, category: 'Tool' })),
     ...featuredCalculators.map(t => ({ type: 'tool' as const, name: t.name, href: t.href, category: 'Calculator' })),
      { type: 'news' as const, name: 'Latest Shipping News', href: '/news', category: 'News' },
      { type: 'document' as const, name: 'Commercial Invoice Generator', href: '/documents/commercial-invoice', category: 'Documents' },
      { type: 'document' as const, name: 'Bill of Lading Generator', href: '/documents/bill-of-lading', category: 'Documents' },
    ];
    return allItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }, [query]);

  if (suggestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden p-4"
      >
        <p className="text-sm text-muted-foreground text-center">No results found for "{query}"</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      <ScrollArea className="max-h-80">
        {suggestions.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group"
          >
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
              item.type === 'tool' && 'bg-[#0F4C81]/10',
              item.type === 'news' && 'bg-[#2E8B57]/10',
              item.type === 'document' && 'bg-amber-500/10'
            )}>
              {item.type === 'tool' && <Calculator className="h-4 w-4 text-[#0F4C81]" />}
              {item.type === 'news' && <Newspaper className="h-4 w-4 text-[#2E8B57]" />}
              {item.type === 'document' && <FileText className="h-4 w-4 text-amber-600" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm group-hover:text-[#0F4C81] transition-colors">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </ScrollArea>
      <div className="border-t border-border px-4 py-2 bg-muted/30">
        <p className="text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text- mr-1">Enter</kbd> to select •
          <kbd className="px-1.5 py-0.5 bg-muted rounded text- mx-1">Esc</kbd> to close
        </p>
      </div>
    </motion.div>
  );
}

// Quick CBM Calculator Modal
function QuickCBMModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("1");

  const cbm = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const qty = parseInt(quantity) || 1;
    return (l * w * h * qty) / 1000000;
  }, [length, width, height, quantity]);

  const containerFit = useMemo(() => {
    const cbmPer20ft = 33;
    const cbmPer40ft = 67;
    const cbmPer40hc = 76;
    return {
      '20ft': Math.floor(cbmPer20ft / (cbm || 1)),
      '40ft': Math.floor(cbmPer40ft / (cbm || 1)),
      '40hc': Math.floor(cbmPer40hc / (cbm || 1)),
    };
  }, [cbm]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center">
              <Container className="h-4 w-4 text-[#0F4C81]" />
            </div>
            Quick CBM Calculator
          </DialogTitle>
          <DialogDescription>Calculate cubic meters instantly</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Length (cm)</label>
              <Input
                placeholder="100"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="h-10 text-center font-mono"
                type="number"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Width (cm)</label>
              <Input
                placeholder="50"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="h-10 text-center font-mono"
                type="number"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Height (cm)</label>
              <Input
                placeholder="40"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="h-10 text-center font-mono"
                type="number"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
            <Input
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-10 text-center font-mono"
              type="number"
            />
          </div>

          <div className="bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-xl p-4">
            <div className="text-center mb-3">
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
                {cbm.toFixed(4)} m³
              </p>
            </div>
            {cbm > 0 && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-2">
                  <p className="text-muted-foreground">20&apos; GP</p>
                  <p className="font-semibold">{containerFit['20ft']}x</p>
                </div>
                <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-2">
                  <p className="text-muted-foreground">40&apos; GP</p>
                  <p className="font-semibold">{containerFit['40ft']}x</p>
                </div>
                <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-2">
                  <p className="text-muted-foreground">40&apos; HC</p>
                  <p className="font-semibold">{containerFit['40hc']}x</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button asChild className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90">
              <Link href="/tools/ocean-freight/cbm-calculator" onClick={onClose}>
                Full Calculator
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick Container Tracking Modal
function QuickTrackingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [containerNumber, setContainerNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!containerNumber) return;
    setIsSearching(true);
    setTimeout(() => {
      window.open(`/tools/ocean-freight/container-tracking?container=${containerNumber}`, '_blank');
      setIsSearching(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2E8B57]/10 flex items-center justify-center">
              <Radar className="h-4 w-4 text-[#2E8B57]" />
            </div>
            Container Tracking
          </DialogTitle>
          <DialogDescription>Enter container number to track your shipment</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Container Number</label>
            <Input
              placeholder="e.g., MSKU1234567"
              value={containerNumber}
              onChange={(e) => setContainerNumber(e.target.value.toUpperCase())}
              className="h-12 text-lg font-mono text-center"
              maxLength={11}
            />
            <p className="text-xs text-muted-foreground mt-1">Format: 4 letters + 7 digits</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['MAEU', 'MSCU', 'CMAU', 'EGLV', 'HLCU'].map((prefix) => (
              <Button
                key={prefix}
                variant="outline"
                size="sm"
                onClick={() => setContainerNumber(prefix)}
                className="text-xs font-mono"
              >
                {prefix}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#2E8B57] hover:bg-[#2E8B57]/90"
              onClick={handleSearch}
              disabled={!containerNumber || isSearching}
            >
              {isSearching? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Track Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick HS Code Search Modal
function QuickHSCodeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");

  const popularSearches = [
    "Electronics", "Textiles", "Machinery", "Chemicals",
    "Plastics", "Food Products", "Automotive Parts"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Layers className="h-4 w-4 text-purple-600" />
            </div>
            HS Code Search
          </DialogTitle>
          <DialogDescription>Find Harmonized System codes for your products</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search product or HS code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm(term)}
                  className="text-xs"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-600/90">
              <Link href={`/tools/customs-compliance/hs-code-search?q=${encodeURIComponent(searchTerm)}`} onClick={onClose}>
                Search
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// World Clocks Component
function WorldClocks() {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, string> = {};
      shippingHubs.forEach(hub => {
        try {
          newTimes[hub.city] = new Date().toLocaleTimeString('en-US', {
            timeZone: hub.timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        } catch {
          newTimes[hub.city] = '--:--';
        }
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {shippingHubs.map((hub) => (
        <TooltipProvider key={hub.city}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="flex items-center gap-1.5 text-xs bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-full backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm">{hub.flag}</span>
                <span className="font-mono font-medium">{times[hub.city] || '--:--'}</span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{hub.city} Local Time</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

// Keyboard Shortcuts Modal
function KeyboardShortcutsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-[#0F4C81]" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>Navigate faster with these shortcuts</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {KEYBOARD_SHORTCUTS.map((shortcut, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <shortcut.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{shortcut.action}</span>
              </div>
              <kbd className="px-2 py-1 text-xs font-mono bg-background rounded border">
                {shortcut.key}
              </kbd>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Back to Top Component
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setProgress(value * 100);
      setIsVisible(value > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 h-12 w-12 rounded-full bg-card border-2 border-border shadow-lg hover:shadow-xl transition-all flex items-center justify-center group overflow-hidden"
          aria-label="Back to top"
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted/30"
            />
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${progress * 1.38} 138`}
              className="transition-all duration-150"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={OCEAN_BLUE} />
                <stop offset="100%" stopColor={LOGISTICS_GREEN} />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp className="h-5 w-5 text-[#0F4C81] group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// News Card Skeleton
function NewsCardSkeleton() {
  return (
    <Card className="h-full border-0 shadow-lg overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

// Main Component
export default function HomePage() {
  const router = useRouter();
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedNews, setSavedNews] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // FIXED: Add ports state
  const [ports, setPorts] = useState<any[]>([]);

  // Modal states
  const [showCBMModal, setShowCBMModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showHSCodeModal, setShowHSCodeModal] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Greeting
  const [greeting, setGreeting] = useState(getDefaultGreeting());

  // Breaking news state
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([]);
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  // FIXED: Fetch ports data
  useEffect(() => {
    fetch('/data/ports-full.json')
    .then(r => r.json())
    .then(data => setPorts(data.filter((p: any) => p.annual_teu > 500000).slice(0, 200)))
    .catch(() => setPorts([]));
  }, []);

  // Set greeting on mount
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  // Load saved news from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedNews");
    if (saved) {
      try {
        setSavedNews(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  // Fetch news
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/news?limit=8");
      const data: NewsResponse = await response.json();
      if (data.success && data.data) {
        setNewsData(data.data);
        setBreakingNews(data.data.filter((n: NewsItem) => n.isAlert || n.trending).slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Toggle save news
  const toggleSaveNews = useCallback((newsId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedNews(prev => {
      const updated = prev.includes(newsId)
       ? prev.filter(id => id!== newsId)
        : [...prev, newsId];
      localStorage.setItem("savedNews", JSON.stringify(updated));
      return updated;
    });
    toast({
      title: savedNews.includes(newsId)? "Removed from saved" : "Saved for later",
      description: savedNews.includes(newsId)? "Article removed from your saved list" : "Article added to your saved list",
    });
  }, [savedNews, toast]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode =!prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("darkMode", String(newMode));
      return newMode;
    });
  }, []);

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        toggleDarkMode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcuts(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setShowShortcuts(false);
        setShowCBMModal(false);
        setShowTrackingModal(false);
        setShowHSCodeModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleDarkMode]);

  // Featured news (limit to 3 for tools-focused homepage)
  const featuredNews = useMemo(() => {
    return newsData.slice(0, 3);
  }, [newsData]);

  return (
    <div className="min-h-screen bg-background" role="main">
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F4C81] via-[#2E8B57] to-[#0F4C81] z-50 origin-left"
        style={{ scaleX }}
        aria-hidden="true"
      />

      {/* Breaking News Ticker */}
      <AnimatePresence>
        {breakingNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-2 relative overflow-hidden"
            role="marquee"
            aria-label="Breaking news"
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-shrink-0 bg-white/20 px-3 py-1 rounded-full">
                  <AlertTriangle className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  <span className="font-bold text-sm">BREAKING</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div
                    className={cn(
                      "flex gap-8 animate-marquee whitespace-nowrap",
                      isTickerPaused && "animation-paused"
                    )}
                    onMouseEnter={() => setIsTickerPaused(true)}
                    onMouseLeave={() => setIsTickerPaused(false)}
                  >
                    {breakingNews.map((news, idx) => (
                      <Link
                        key={`${news.id}-${idx}`}
                        href={`/news/${news.slug}?id=${news.id}`}
                        className="hover:text-white/80 transition-colors font-medium text-sm"
                      >
                        {news.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white/80 hover:text-white flex-shrink-0"
                  onClick={() => setIsTickerPaused(!isTickerPaused)}
                  aria-label={isTickerPaused? "Play ticker" : "Pause ticker"}
                >
                  {isTickerPaused? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero and other sections... [TRUNCATED FOR BREVITY - KEEP ALL YOUR EXISTING CODE] */}

      {/* Main Content */}
      <main id="main-content">
        {/* SECTION: MAP (FIXED) */}
        <section className="py-10 bg-background" aria-labelledby="map-title">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 id="map-title" className="text-2xl font-bold flex items-center gap-2">
                    <Globe className="h-6 w-6 text-[#0F4C81]" />
                    Global Port Activity
                  </h2>
                  <p className="text-muted-foreground">Live view of major shipping hubs worldwide</p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/directories/ports">
                    Explore 11,247 Ports →
                  </Link>
                </Button>
              </div>
              {/* FIXED: Use ports state instead of portsData */}
              <GlobalPortsMap
                ports={ports}
                height="520px"
                maxMarkers={200}
                onSelect={(port) => router.push(`/directories/ports?port=${port.unlocode}`)}
              />
            </motion.div>
          </div>
        </section>

        {/* REST OF YOUR SECTIONS... KEEP EVERYTHING ELSE EXACTLY AS IS */}

      </main>

      {/* All modals and other components... KEEP AS IS */}
    </div>
  );
}