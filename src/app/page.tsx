"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ChevronRight,
  Flame,
  CheckCircle,
  Building,
  Moon,
  Sun,
  X,
  Keyboard,
  Lightbulb,
  Cloud,
  CloudSun,
  CloudRain,
  ArrowUp,
  Target,
  Compass,
  Layers,
  Radar,
  ExternalLink,
  Sun as Sunrise,
  Sunset,
  Search,
  Sparkles,
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

// Did You Know Facts
const tradeFacts = [
  "Around 90% of world trade is carried by the international shipping industry.",
  "The largest container ships can carry over 24,000 containers at once.",
  "The Suez Canal shortcut saves about 7,000 km on a journey from London to Mumbai.",
  "Singapore is the world's busiest transshipment hub, handling over 37 million TEUs annually.",
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
  "Geopolitical": { bg: "bg-red-600", text: "text-red-700", gradient: "from-red-600 to-rose-600", icon: Landmark, image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop", imageCredit: "Photo by Colin Watts" },
};

// News categories - MATCH API CATEGORIES
const newsCategories = [
  { name: "All", filter: "all", icon: Flame },
  { name: "Shipping", filter: "Ocean Freight", icon: Ship },
  { name: "Trade Finance", filter: "Trade Finance", icon: DollarSign },
  { name: "Geopolitical", filter: "Geopolitical", icon: Landmark },
  { name: "Technology", filter: "Technology", icon: TrendingUp },
  { name: "Customs", filter: "Customs", icon: Shield },
  { name: "Sustainability", filter: "Sustainability", icon: Leaf },
];

// Quick Actions
const quickActions = [
  { name: "CBM Calculator", icon: Container, href: "/tools/ocean-freight/cbm-calculator", color: OCEAN_BLUE, shortcut: "Alt+1", modal: "cbm" },
  { name: "Container Tracking", icon: MapPin, href: "/tools/ocean-freight/container-tracking", color: LOGISTICS_GREEN, shortcut: "Alt+2", modal: "tracking" },
  { name: "HS Code Search", icon: Search, href: "/tools/customs-compliance/hs-code-search", color: "#8B5CF6", shortcut: "Alt+3", modal: "hscode" },
  { name: "Currency Converter", icon: DollarSign, href: "/tools/international-trade/currency-converter", color: "#F59E0B", shortcut: "Alt+4", modal: null },
];

// Popular tools - 10 tools for 5-column grid
const popularTools = [
  { name: "CBM Calculator", category: "Ocean Freight", icon: Container, href: "/tools/ocean-freight/cbm-calculator", color: OCEAN_BLUE },
  { name: "Landed Cost", category: "Trade", icon: DollarSign, href: "/tools/international-trade/landed-cost-calculator", color: LOGISTICS_GREEN },
  { name: "HS Code Search", category: "Compliance", icon: Globe, href: "/tools/customs-compliance/hs-code-search", color: "#8B5CF6" },
  { name: "Volumetric Weight", category: "Air Freight", icon: Package, href: "/tools/air-freight/volumetric-weight", color: "#F59E0B" },
  { name: "Incoterms Guide", category: "Trade Terms", icon: MapPin, href: "/tools/international-trade/incoterms-guide", color: "#EC4899" },
  { name: "Container Tracking", category: "Visibility", icon: Radar, href: "/tools/ocean-freight/container-tracking", color: "#06B6D4" },
  { name: "Port Code Finder", category: "Reference", icon: Anchor, href: "/tools/ocean-freight/port-code-finder", color: "#0F4C81" },
  { name: "Currency Converter", category: "Finance", icon: DollarSign, href: "/tools/international-trade/currency-converter", color: "#10B981" },
  { name: "Freight Index", category: "Market Data", icon: BarChart3, href: "/tools/ocean-freight/freight-index", color: "#F97316" },
  { name: "Duty Calculator", category: "Customs", icon: Calculator, href: "/tools/customs-compliance/duty-calculator", color: "#EF4444" },
];

// Freight rate data for FBX chart
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

// BDI Baltic Dry Index data
const bdiData = [
  { month: "Jan", rate: 1540 },
  { month: "Feb", rate: 1620 },
  { month: "Mar", rate: 1580 },
  { month: "Apr", rate: 1720 },
  { month: "May", rate: 1890 },
  { month: "Jun", rate: 1950 },
  { month: "Jul", rate: 1820 },
  { month: "Aug", rate: 1780 },
  { month: "Sep", rate: 1690 },
  { month: "Oct", rate: 1850 },
  { month: "Nov", rate: 1920 },
  { month: "Dec", rate: 1847 },
];

// Currency data for EUR/USD
const currencyData = [
  { month: "Jan", rate: 1.082 },
  { month: "Feb", rate: 1.078 },
  { month: "Mar", rate: 1.085 },
  { month: "Apr", rate: 1.072 },
  { month: "May", rate: 1.088 },
  { month: "Jun", rate: 1.091 },
  { month: "Jul", rate: 1.095 },
  { month: "Aug", rate: 1.099 },
  { month: "Sep", rate: 1.107 },
  { month: "Oct", rate: 1.086 },
  { month: "Nov", rate: 1.078 },
  { month: "Dec", rate: 1.0842 },
];

// Crude Oil (WTI) data - NEW
const crudeOilData = [
  { month: "Apr", price: 78.5 },
  { month: "May", price: 76.2 },
  { month: "Jun", price: 81.4 },
  { month: "Jul", price: 82.8 },
  { month: "Aug", price: 77.3 },
  { month: "Sep", price: 73.6 },
  { month: "Oct", price: 75.9 },
  { month: "Nov", price: 71.2 },
  { month: "Dec", price: 68.4 },
  { month: "Jan", price: 72.8 },
  { month: "Feb", price: 76.5 },
  { month: "Mar", price: 79.2 },
];

// Market indices
const marketIndices = [
  { name: "FBX Index", value: "3,920", change: "+2.4%", up: true },
  { name: "BDI Baltic", value: "1,847", change: "-1.2%", up: false },
  { name: "SCFI", value: "2,156", change: "+3.1%", up: true },
  { name: "WCI", value: "2,890", change: "+1.8%", up: true },
];

// Currencies
const currencies = [
  { pair: "EUR/USD", rate: "1.0842", change: "+0.12%", up: true },
  { pair: "GBP/USD", rate: "1.2658", change: "-0.08%", up: false },
  { pair: "USD/CNY", rate: "7.2456", change: "+0.05%", up: true },
  { pair: "USD/JPY", rate: "149.85", change: "+0.32%", up: true },
];

// Educational content - 6 cards
const educationalContent = [
  {
    title: "Incoterms 2020",
    description: "Understand the 11 international trade terms that define responsibilities.",
    icon: Globe,
    href: "/tools/international-trade/incoterms-guide",
    color: OCEAN_BLUE,
  },
  {
    title: "HS Codes Guide",
    description: "Learn how to classify products for customs declarations.",
    icon: BarChart3,
    href: "/tools/customs-compliance/hs-code-search",
    color: LOGISTICS_GREEN,
  },
  {
    title: "Container Types",
    description: "Complete guide to ISO container specifications and dimensions.",
    icon: Container,
    href: "/tools/ocean-freight/container-guide",
    color: "#8B5CF6",
  },
  {
    title: "Bill of Lading",
    description: "Understanding B/L types, functions, and best practices.",
    icon: FileText,
    href: "/documents/bill-of-lading",
    color: "#F59E0B",
  },
  {
    title: "Customs Valuation",
    description: "Methods and rules for determining customs value.",
    icon: Calculator,
    href: "/tools/customs-compliance/duty-calculator",
    color: "#EC4899",
  },
  {
    title: "Letter of Credit",
    description: "Guide to LC types and international payment security.",
    icon: DollarSign,
    href: "/tools/international-trade/letter-of-credit-guide",
    color: "#06B6D4",
  },
];

// Directories preview
const directoriesPreview = [
  { name: "Global Ports", count: "500+", icon: Anchor, href: "/tools/ocean-freight/port-code-finder" },
  { name: "Shipping Lines", count: "150+", icon: Ship, href: "/directories/shipping-lines" },
  { name: "Freight Forwarders", count: "200+", icon: Truck, href: "/directories/freight-forwarders" },
  { name: "Customs Brokers", count: "100+", icon: Shield, href: "/directories/customs-brokers" },
];

// Weather data for ports
const portWeatherData = [
  { port: "Shanghai", temp: "24°C", condition: "partly-cloudy", humidity: "72%" },
  { port: "Rotterdam", temp: "16°C", condition: "rainy", humidity: "85%" },
  { port: "Singapore", temp: "31°C", condition: "sunny", humidity: "78%" },
  { port: "Los Angeles", temp: "22°C", condition: "sunny", humidity: "45%" },
];

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

// Calculate read time
const calculateReadTime = (text: string): number => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
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
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Length (cm)</label>
              <Input placeholder="100" value={length} onChange={(e) => setLength(e.target.value)} className="h-10 text-center font-mono" type="number" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Width (cm)</label>
              <Input placeholder="50" value={width} onChange={(e) => setWidth(e.target.value)} className="h-10 text-center font-mono" type="number" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Height (cm)</label>
              <Input placeholder="40" value={height} onChange={(e) => setHeight(e.target.value)} className="h-10 text-center font-mono" type="number" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
                {cbm.toFixed(4)} m³
              </p>
            </div>
            {cbm > 0 && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
                <div className="bg-white/50 dark:bg-slate-900/50 rounded p-1.5">
                  <p className="text-muted-foreground">20&apos; GP</p>
                  <p className="font-semibold">{containerFit['20ft']}x</p>
                </div>
                <div className="bg-white/50 dark:bg-slate-900/50 rounded p-1.5">
                  <p className="text-muted-foreground">40&apos; GP</p>
                  <p className="font-semibold">{containerFit['40ft']}x</p>
                </div>
                <div className="bg-white/50 dark:bg-slate-900/50 rounded p-1.5">
                  <p className="text-muted-foreground">40&apos; HC</p>
                  <p className="font-semibold">{containerFit['40hc']}x</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
            <Button asChild className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90">
              <Link href="/tools/ocean-freight/cbm-calculator" onClick={onClose}>
                Full Calculator <ArrowRight className="h-4 w-4 ml-1" />
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
          <DialogDescription>Enter container number to track</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-3">
          <Input placeholder="e.g., MSKU1234567" value={containerNumber} onChange={(e) => setContainerNumber(e.target.value.toUpperCase())} className="h-12 text-lg font-mono text-center" maxLength={11} />
          <div className="flex flex-wrap gap-2">
            {['MAEU', 'MSCU', 'CMAU', 'EGLV', 'HLCU'].map((prefix) => (
              <Button key={prefix} variant="outline" size="sm" onClick={() => setContainerNumber(prefix)} className="text-xs font-mono">{prefix}</Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-[#2E8B57] hover:bg-[#2E8B57]/90" onClick={handleSearch} disabled={!containerNumber || isSearching}>
              {isSearching ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Tracking...</> : <><MapPin className="h-4 w-4 mr-2" />Track Now</>}
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
  const popularSearches = ["Electronics", "Textiles", "Machinery", "Chemicals", "Plastics", "Food Products"];

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
          <DialogDescription>Find Harmonized System codes</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search product or HS code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-12" />
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <Button key={term} variant="outline" size="sm" onClick={() => setSearchTerm(term)} className="text-xs">{term}</Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-600/90">
              <Link href={`/tools/customs-compliance/hs-code-search?q=${encodeURIComponent(searchTerm)}`} onClick={onClose}>
                Search <ArrowRight className="h-4 w-4 ml-1" />
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
    <div className="flex items-center gap-3">
      {shippingHubs.map((hub) => (
        <TooltipProvider key={hub.city}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-xs bg-muted/50 px-2 py-1 rounded-full">
                <span className="text-sm">{hub.flag}</span>
                <span className="font-mono font-medium">{times[hub.city] || '--:--'}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent><p className="font-medium">{hub.city} Local Time</p></TooltipContent>
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
        <div className="space-y-2 mt-3">
          {KEYBOARD_SHORTCUTS.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <shortcut.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{shortcut.action}</span>
              </div>
              <kbd className="px-2 py-1 text-xs font-mono bg-background rounded border">{shortcut.key}</kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Weather Widget Component
function WeatherWidget() {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <CloudSun className="h-4 w-4 text-amber-500" />;
      case 'partly-cloudy': return <Cloud className="h-4 w-4 text-gray-400" />;
      case 'rainy': return <CloudRain className="h-4 w-4 text-blue-400" />;
      default: return <Cloud className="h-4 w-4" />;
    }
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 pb-1">
        {portWeatherData.map((port, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50 flex-shrink-0">
            {getWeatherIcon(port.condition)}
            <div className="text-xs">
              <p className="font-medium">{port.port}</p>
              <p className="text-muted-foreground">{port.temp}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

// News Card Skeleton
function NewsCardSkeleton() {
  return (
    <Card className="h-full border-0 shadow-lg overflow-hidden">
      <Skeleton className="h-36 w-full" />
      <CardContent className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
    </Card>
  );
}

// Back to Top Component
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 z-40 h-10 w-10 rounded-full bg-card border shadow-lg flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4 text-[#0F4C81]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Main Component
export default function HomePage() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedNews, setSavedNews] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Modal states
  const [showCBMModal, setShowCBMModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showHSCodeModal, setShowHSCodeModal] = useState(false);

  const { toast } = useToast();

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Load saved news from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shiportrade-saved-news");
    if (saved) {
      setSavedNews(JSON.parse(saved));
    }
    const theme = localStorage.getItem("shiportrade-theme");
    if (theme) {
      setIsDarkMode(theme === "dark");
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Rotate facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % tradeFacts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
      }
      if (e.key === 'Escape') {
        setShowShortcuts(false);
        setShowCBMModal(false);
        setShowTrackingModal(false);
        setShowHSCodeModal(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        setShowCBMModal(true);
      }
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        setShowTrackingModal(true);
      }
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        setShowHSCodeModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch news from API
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/news?limit=30");
      const data: NewsResponse = await response.json();

      if (data.success) {
        const enhancedData = data.data.map((item) => ({
          ...item,
          readTime: calculateReadTime(item.content || item.excerpt),
          views: Math.floor(Math.random() * 5000) + 100,
          imageUrl: item.imageUrl || categoryConfig[item.category]?.image || categoryConfig["All"].image,
        }));
        setNewsData(enhancedData);
      }
    } catch (err) {
      console.error("News fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("shiportrade-theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
    toast({
      title: newMode ? "Dark Mode Enabled" : "Light Mode Enabled",
      description: "Theme preference saved",
    });
  }, [isDarkMode, toast]);

  // Toggle save news
  const toggleSaveNews = useCallback(
    (newsId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newSaved = savedNews.includes(newsId) ? savedNews.filter((id) => id !== newsId) : [...savedNews, newsId];
      setSavedNews(newSaved);
      localStorage.setItem("shiportrade-saved-news", JSON.stringify(newSaved));
      toast({
        title: savedNews.includes(newsId) ? "Removed from saved" : "Saved for later",
      });
    },
    [savedNews, toast]
  );

  // Remove duplicate news by ID
  const uniqueNewsData = useMemo(() => {
    const seen = new Set<string>();
    return newsData.filter((news) => {
      if (seen.has(news.id)) return false;
      seen.add(news.id);
      return true;
    });
  }, [newsData]);

  // Filter news by category
  const filteredNews = useMemo(() => {
    if (selectedCategory === "all") return uniqueNewsData;
    return uniqueNewsData.filter((news) => news.category === selectedCategory);
  }, [uniqueNewsData, selectedCategory]);

  // Breaking news (alerts)
  const breakingNews = useMemo(() => uniqueNewsData.filter((n) => n.isAlert).slice(0, 5), [uniqueNewsData]);

  // Trending news - show 5
  const trendingNews = useMemo(() => uniqueNewsData.filter((n) => n.trending).slice(0, 5), [uniqueNewsData]);

  // Featured news - ALWAYS return 8 items, padding from other categories if needed
  const featuredNews = useMemo(() => {
    const trendingIds = new Set(trendingNews.map(n => n.id));
    let featured = filteredNews.filter(n => !trendingIds.has(n.id));
    
    // If we don't have enough items, pad with items from other categories
    if (featured.length < 8) {
      const allOther = uniqueNewsData.filter(n => !trendingIds.has(n.id) && !featured.includes(n));
      featured = [...featured, ...allOther].slice(0, 8);
    }
    
    return featured.slice(0, 8);
  }, [filteredNews, trendingNews, uniqueNewsData]);

  // Get last updated time
  const lastUpdated = useMemo(() => {
    if (uniqueNewsData.length > 0) {
      return formatRelativeTime(uniqueNewsData[0].publishedAt);
    }
    return "Just now";
  }, [uniqueNewsData]);

  return (
    <div className="min-h-screen bg-background" role="main">
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
            className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-1.5 relative overflow-hidden"
            role="marquee"
            aria-label="Breaking news"
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 flex-shrink-0 bg-white/20 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="h-3 w-3 animate-pulse" aria-hidden="true" />
                  <span className="font-bold text-xs">BREAKING</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div
                    className={cn(
                      "flex gap-6 animate-marquee whitespace-nowrap text-sm",
                      isTickerPaused && "animation-paused"
                    )}
                    onMouseEnter={() => setIsTickerPaused(true)}
                    onMouseLeave={() => setIsTickerPaused(false)}
                  >
                    {breakingNews.map((news, idx) => (
                      <Link
                        key={`${news.id}-${idx}`}
                        href={`/news/${news.slug}?id=${news.id}`}
                        className="hover:text-white/80 transition-colors font-medium"
                      >
                        {news.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-white/80 hover:text-white flex-shrink-0"
                  onClick={() => setIsTickerPaused(!isTickerPaused)}
                  aria-label={isTickerPaused ? "Play ticker" : "Pause ticker"}
                >
                  {isTickerPaused ? <div className="h-2 w-2" /> : <div className="h-2 w-2" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar - World Clocks */}
      <div className="bg-muted/30 border-b border-border/40 py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <WorldClocks />
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="h-8 w-8" aria-label="Toggle dark mode">
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Toggle theme (Ctrl+D)</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setShowShortcuts(true)} className="h-8 w-8" aria-label="Keyboard shortcuts">
                    <Keyboard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Keyboard shortcuts</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content">
        {/* Trade News Section */}
        <section className="py-4 bg-background" aria-labelledby="news-title">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 id="news-title" className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <Newspaper className="h-6 w-6 text-[#0F4C81]" aria-hidden="true" />
                    Trade News
                  </h2>
                  <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={fetchNews} disabled={isLoading}>
                    <RefreshCw className={cn("h-3 w-3 mr-1", isLoading && "animate-spin")} aria-hidden="true" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Category Tabs */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-4">
                <TabsList className="flex flex-wrap h-auto gap-1.5 bg-transparent p-0" role="tablist">
                  {newsCategories.map((cat) => (
                    <TabsTrigger
                      key={cat.filter}
                      value={cat.filter}
                      className={cn(
                        "data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white rounded-full px-3 py-1.5 text-xs",
                        "border border-border hover:border-[#0F4C81]/50 transition-all"
                      )}
                      role="tab"
                    >
                      <cat.icon className="h-3 w-3 mr-1" aria-hidden="true" />
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Loading State */}
              {isLoading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => (
                    <NewsCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* News Grid - 4x2 Layout */}
              {!isLoading && featuredNews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {featuredNews.map((news, index) => {
                    const config = categoryConfig[news.category] || categoryConfig["Ocean Freight"];
                    const isSaved = savedNews.includes(news.id);

                    return (
                      <motion.div
                        key={`${news.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="h-full"
                      >
                        <Link href={`/news/${news.slug}?id=${news.id}`} className="block h-full">
                          <Card className="h-full min-h-[260px] flex flex-col border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
                            {/* Image */}
                            <div className="relative h-32 flex-shrink-0 overflow-hidden">
                              <Image
                                src={news.imageUrl || config.image}
                                alt={news.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, 25vw"
                                loading="lazy"
                                unoptimized={news.imageUrl ? !news.imageUrl.includes('localhost') : false}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <Badge className={`absolute top-2 left-2 bg-gradient-to-r ${config.gradient} text-white border-0 text-[10px]`}>
                                {news.category}
                              </Badge>
                              {news.isAlert && (
                                <Badge className="absolute top-2 right-2 bg-red-500 text-white animate-pulse border-0 text-[10px]">ALERT</Badge>
                              )}
                            </div>
                            {/* Content */}
                            <CardContent className="p-3 flex flex-col flex-1">
                              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#0F4C81] transition-colors mb-1">
                                {news.title}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex-1">{news.excerpt}</p>
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-auto">
                                <span className="font-medium text-foreground">{news.source}</span>
                                <div className="flex items-center gap-2">
                                  <span>{formatRelativeTime(news.publishedAt)}</span>
                                  <button onClick={(e) => toggleSaveNews(news.id, e)} className="hover:text-[#0F4C81]">
                                    {isSaved ? <BookmarkCheck className="h-3 w-3 text-[#0F4C81]" /> : <Bookmark className="h-3 w-3" />}
                                  </button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && featuredNews.length === 0 && (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">No News Available</h3>
                  <p className="text-sm text-muted-foreground mb-4">Check back later for the latest trade news.</p>
                  <Button onClick={fetchNews} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              )}

              {/* View All Button */}
              {featuredNews.length > 0 && (
                <div className="text-center mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/news">
                      View All News <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Trending News Section - Full Width Images */}
        {trendingNews.length > 0 && (
          <section className="py-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" aria-labelledby="trending-title">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-2">
                  <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
                  <h3 id="trending-title" className="text-xl font-bold">Trending Now</h3>
                </div>
                <p className="text-sm text-muted-foreground">The most talked-about stories in global trade</p>
              </div>
              <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl" role="list">
                  {trendingNews.map((news, idx) => {
                    const config = categoryConfig[news.category] || categoryConfig["Ocean Freight"];
                    return (
                      <motion.div
                        key={`${news.id}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        role="listitem"
                      >
                        <Link href={`/news/${news.slug}?id=${news.id}`} className="block h-full group">
                          <Card className="h-full min-h-[280px] border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-slate-800">
                            {/* Full Width Image */}
                            <div className="relative h-40 w-full overflow-hidden">
                              <Image
                                src={news.imageUrl || config.image}
                                alt={news.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                loading="lazy"
                                unoptimized={news.imageUrl ? !news.imageUrl.includes('localhost') : false}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              {/* Category Badge */}
                              <Badge className={`absolute top-3 left-3 bg-gradient-to-r ${config.gradient} text-white border-0 text-[10px] font-medium shadow-md`}>
                                {news.category}
                              </Badge>
                              {/* Trending Number */}
                              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow-md">
                                <span className="text-xs font-bold text-[#0F4C81]">{idx + 1}</span>
                              </div>
                            </div>
                            {/* Content */}
                            <CardContent className="p-4 flex flex-col flex-1">
                              <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-[#0F4C81] transition-colors mb-2 leading-snug">
                                {news.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{news.excerpt}</p>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
                                <span className="text-[10px] font-medium text-muted-foreground">{news.source}</span>
                                <span className="text-[10px] text-muted-foreground">{formatRelativeTime(news.publishedAt)}</span>
                              </div>
                              {/* Image Credit */}
                              {(news.imageCredit || config.imageCredit) && (
                                <span className="text-[9px] text-muted-foreground/60 mt-1 block truncate">
                                  {news.imageCredit || config.imageCredit}
                                </span>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick Tools Section */}
        <section className="py-4 bg-background" aria-labelledby="tools-title">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 id="tools-title" className="text-lg font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" aria-hidden="true" />
                    Trade Tools
                  </h2>
                  <p className="text-xs text-muted-foreground">Essential calculators and tools</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/tools">
                    All Tools <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>

              {/* 5-column grid of 10 tools */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {popularTools.map((tool, index) => (
                  <motion.div key={tool.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.03 }}>
                    <Link href={tool.href}>
                      <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer group text-center">
                        <CardContent className="p-3">
                          <div className="w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${tool.color}15` }}>
                            <tool.icon className="h-4 w-4" style={{ color: tool.color }} />
                          </div>
                          <h3 className="font-medium text-xs group-hover:text-[#0F4C81]">{tool.name}</h3>
                          <p className="text-[10px] text-muted-foreground">{tool.category}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Market Data Section - 2x2 Chart Grid */}
        <section className="py-4 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5" aria-labelledby="market-title">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 id="market-title" className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                    Trade & Market Data
                  </h2>
                  <p className="text-xs text-muted-foreground">Real-time rates and indices</p>
                </div>
              </div>

              {/* 2x2 Chart Grid */}
              <div className="grid md:grid-cols-2 gap-3">
                {/* Chart 1: FBX Container Freight Index */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#2E8B57]" />
                      FBX Container Freight Index
                    </CardTitle>
                    <CardDescription className="text-xs">12-month trend (USD/FEU)</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={freightRateData}>
                          <defs>
                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={OCEAN_BLUE} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={OCEAN_BLUE} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                          <Area type="monotone" dataKey="rate" stroke={OCEAN_BLUE} strokeWidth={2} fillOpacity={1} fill="url(#colorRate)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-[10px] mt-2 px-1">
                      <span className="text-muted-foreground">Current: <span className="font-semibold text-foreground">$3,920</span></span>
                      <span className="text-green-600">+60.0% YoY</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Chart 2: BDI Baltic Dry Index */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Anchor className="h-4 w-4 text-[#0F4C81]" />
                      BDI Baltic Dry Index
                    </CardTitle>
                    <CardDescription className="text-xs">12-month trend (Index Points)</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={bdiData}>
                          <defs>
                            <linearGradient id="colorBDI" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={LOGISTICS_GREEN} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={LOGISTICS_GREEN} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                          <Area type="monotone" dataKey="rate" stroke={LOGISTICS_GREEN} strokeWidth={2} fillOpacity={1} fill="url(#colorBDI)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-[10px] mt-2 px-1">
                      <span className="text-muted-foreground">Current: <span className="font-semibold text-foreground">1,847</span></span>
                      <span className="text-red-600">-1.2% MoM</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Chart 3: EUR/USD Exchange Rate */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      EUR/USD Exchange Rate
                    </CardTitle>
                    <CardDescription className="text-xs">12-month trend</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={currencyData}>
                          <defs>
                            <linearGradient id="colorEUR" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} domain={['dataMin', 'dataMax']} />
                          <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                          <Area type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorEUR)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-[10px] mt-2 px-1">
                      <span className="text-muted-foreground">Current: <span className="font-semibold text-foreground">1.0842</span></span>
                      <span className="text-green-600">+0.12%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Chart 4: Crude Oil (WTI) */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                      Crude Oil (WTI)
                    </CardTitle>
                    <CardDescription className="text-xs">12-month trend (USD/barrel)</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={crudeOilData}>
                          <defs>
                            <linearGradient id="colorOil" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                          <Area type="monotone" dataKey="price" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorOil)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-[10px] mt-2 px-1">
                      <span className="text-muted-foreground">Current: <span className="font-semibold text-foreground">$79.20</span></span>
                      <span className="text-green-600">+0.9%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Educational Content Section */}
        <section className="py-4 bg-background" aria-labelledby="learn-title">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="mb-3">
                <h2 id="learn-title" className="text-lg font-bold">Trade Knowledge Hub</h2>
                <p className="text-xs text-muted-foreground">Essential guides and resources</p>
              </div>

              {/* 3-column grid of 6 cards */}
              <div className="grid md:grid-cols-3 gap-3">
                {educationalContent.map((item, index) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                    <Link href={item.href}>
                      <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                              <item.icon className="h-4 w-4" style={{ color: item.color }} />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm group-hover:text-[#0F4C81]">{item.title}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Directories Section */}
        <section className="py-4 bg-muted/30" aria-labelledby="directories-title">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="mb-3">
                <h2 id="directories-title" className="text-lg font-bold">Industry Directories</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {directoriesPreview.map((dir, index) => (
                  <motion.div key={dir.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.03 }}>
                    <Link href={dir.href}>
                      <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group text-center">
                        <CardContent className="p-3">
                          <dir.icon className="h-6 w-6 mx-auto mb-1 text-[#0F4C81]" />
                          <h3 className="font-medium text-xs group-hover:text-[#0F4C81]">{dir.name}</h3>
                          <p className="text-sm font-bold text-[#2E8B57]">{dir.count}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Did You Know Strip */}
        <section className="py-2 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-xs">
              <Lightbulb className="h-3 w-3 text-amber-500" />
              <span className="text-muted-foreground">Did you know?</span>
              <AnimatePresence mode="wait">
                <motion.span key={currentFactIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="font-medium">
                  {tradeFacts[currentFactIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-4 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5" aria-labelledby="cta-title">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <h2 id="cta-title" className="text-lg font-bold mb-1">Ready to Optimize Your Trade Operations?</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Access 82+ calculators, real-time market data, and comprehensive trade tools.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button asChild size="sm" className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white">
                  <Link href="/tools">
                    <Calculator className="mr-1 h-4 w-4" /> Explore Tools
                  </Link>
                </Button>
                <Button asChild size="sm" className="bg-[#2E8B57] hover:bg-[#2E8B57]/90 text-white">
                  <Link href="/news">
                    <Newspaper className="mr-1 h-4 w-4" /> Latest News
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Floating Quick Actions Button */}
      <motion.div className="fixed bottom-6 right-6 z-40" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div key={showQuickActions ? 'close' : 'zap'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    {showQuickActions ? <X className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent><p>Quick Actions</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Quick Actions Menu */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-14 right-0 bg-card border rounded-lg shadow-lg p-1.5 min-w-48"
            >
              {quickActions.map((action, i) => (
                <motion.button
                  key={action.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    if (action.modal === 'cbm') setShowCBMModal(true);
                    else if (action.modal === 'tracking') setShowTrackingModal(true);
                    else if (action.modal === 'hscode') setShowHSCodeModal(true);
                    else window.open(action.href, '_blank');
                    setShowQuickActions(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors w-full text-left"
                >
                  <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: `${action.color}20` }}>
                    <action.icon className="h-3 w-3" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-medium">{action.name}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Quick Action Modals */}
      <QuickCBMModal isOpen={showCBMModal} onClose={() => setShowCBMModal(false)} />
      <QuickTrackingModal isOpen={showTrackingModal} onClose={() => setShowTrackingModal(false)} />
      <QuickHSCodeModal isOpen={showHSCodeModal} onClose={() => setShowHSCodeModal(false)} />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Marquee Animation Style */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animation-paused {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
