"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  Star,
  Sparkles,
  Globe,
  ShoppingCart,
  Package,
  Truck,
  Ship,
  Plane,
  DollarSign,
  Clock,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Newspaper,
  ExternalLink,
  ChevronRight,
  X,
  CheckCircle,
  Store,
  Briefcase,
  Building2,
  Users,
  Wallet,
  Calculator,
  FileText,
  RefreshCw,
  MapPin,
  AlertCircle,
  Info,
  Bookmark,
  Bell,
  Settings,
  User,
  Layers,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Types
interface UserPreferences {
  userType: 'seller' | 'buyer' | 'both' | null;
  categories: string[];
  regions: string[];
  platforms: string[];
  onboarded: boolean;
}

interface TrendingProduct {
  id: string;
  name: string;
  category: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  platform: string;
  searchVolume: string;
}

interface TradeNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  category: string;
  url: string;
}

interface SearchResult {
  id: string;
  type: 'product' | 'service' | 'logistics';
  title: string;
  description: string;
  platform: string;
  platformLogo: string;
  url: string;
  price?: string;
  rating?: string;
}

// Platform Data
const ecommercePlatforms = [
  { id: 'amazon', name: 'Amazon', logo: '🛒', color: 'from-orange-500 to-amber-500', url: 'https://www.amazon.com' },
  { id: 'alibaba', name: 'Alibaba', logo: '🧡', color: 'from-orange-600 to-red-500', url: 'https://www.alibaba.com' },
  { id: 'ebay', name: 'eBay', logo: '📦', color: 'from-blue-500 to-cyan-500', url: 'https://www.ebay.com' },
  { id: 'etsy', name: 'Etsy', logo: '🎨', color: 'from-orange-400 to-amber-400', url: 'https://www.etsy.com' },
  { id: 'shopify', name: 'Shopify', logo: '🛍️', color: 'from-green-500 to-emerald-500', url: 'https://www.shopify.com' },
  { id: 'walmart', name: 'Walmart', logo: '🏪', color: 'from-blue-600 to-blue-500', url: 'https://www.walmart.com' },
  { id: 'aliexpress', name: 'AliExpress', logo: '🌐', color: 'from-red-500 to-orange-500', url: 'https://www.aliexpress.com' },
  { id: 'madeinchina', name: 'Made-in-China', logo: '🏭', color: 'from-red-600 to-red-500', url: 'https://www.made-in-china.com' },
];

const logisticsPlatforms = [
  { id: 'flexport', name: 'Flexport', logo: '🚢', color: 'from-emerald-500 to-teal-500', url: 'https://www.flexport.com' },
  { id: 'freightos', name: 'Freightos', logo: '✈️', color: 'from-blue-600 to-indigo-600', url: 'https://www.freightos.com' },
  { id: 'maersk', name: 'Maersk', logo: '⚓', color: 'from-blue-700 to-cyan-600', url: 'https://www.maersk.com' },
  { id: 'dhl', name: 'DHL', logo: '📮', color: 'from-yellow-500 to-red-500', url: 'https://www.dhl.com' },
  { id: 'fedex', name: 'FedEx', logo: '📦', color: 'from-purple-600 to-violet-600', url: 'https://www.fedex.com' },
  { id: 'ups', name: 'UPS', logo: '🟤', color: 'from-amber-700 to-yellow-600', url: 'https://www.ups.com' },
];

// Product Categories
const productCategories = [
  'Electronics', 'Fashion & Apparel', 'Home & Garden', 'Industrial Equipment',
  'Handmade & Crafts', 'Food & Beverages', 'Health & Beauty', 'Automotive',
  'Sports & Outdoors', 'Toys & Games', 'Office Supplies', 'Machinery'
];

// Regions
const tradeRegions = [
  'North America', 'Europe', 'Asia Pacific', 'Middle East',
  'South America', 'Africa', 'Central Asia', 'Southeast Asia'
];

// Trending Products Data
const trendingProducts: TrendingProduct[] = [
  { id: '1', name: 'Wireless Earbuds', category: 'Electronics', trend: 'up', change: '+24%', platform: 'Amazon', searchVolume: '125K' },
  { id: '2', name: 'Sustainable Packaging', category: 'Industrial', trend: 'up', change: '+18%', platform: 'Alibaba', searchVolume: '89K' },
  { id: '3', name: 'LED Smart Lights', category: 'Electronics', trend: 'up', change: '+15%', platform: 'Amazon', searchVolume: '156K' },
  { id: '4', name: 'Organic Cotton Textiles', category: 'Fashion', trend: 'up', change: '+22%', platform: 'Alibaba', searchVolume: '67K' },
  { id: '5', name: 'Electric Scooters', category: 'Automotive', trend: 'up', change: '+31%', platform: 'Alibaba', searchVolume: '98K' },
  { id: '6', name: 'Home Fitness Equipment', category: 'Sports', trend: 'stable', change: '+5%', platform: 'Amazon', searchVolume: '203K' },
  { id: '7', name: 'Biodegradable Plastics', category: 'Industrial', trend: 'up', change: '+45%', platform: 'Made-in-China', searchVolume: '45K' },
  { id: '8', name: 'Smart Home Devices', category: 'Electronics', trend: 'up', change: '+28%', platform: 'Amazon', searchVolume: '312K' },
];

// Trade News Data
const tradeNews: TradeNews[] = [
  { id: '1', title: 'New US Tariffs on Chinese Electronics Take Effect', summary: 'The US government implements new tariff rates on consumer electronics imported from China, affecting supply chains globally.', source: 'Reuters', date: '2 hours ago', category: 'Regulations', url: 'https://www.reuters.com' },
  { id: '2', title: 'Suez Canal Traffic Resumes After Delay', summary: 'Maritime traffic through the Suez Canal returns to normal after recent disruptions caused significant shipping delays.', source: 'Maritime News', date: '5 hours ago', category: 'Shipping', url: 'https://www.maritimenews.com' },
  { id: '3', title: 'Amazon Announces New FBA Fee Structure for 2025', summary: 'Major changes to Amazon fulfillment fees announced, impacting seller margins and pricing strategies worldwide.', source: 'Amazon News', date: '8 hours ago', category: 'E-Commerce', url: 'https://www.amazon.com' },
  { id: '4', title: 'EU Introduces Carbon Border Adjustment Mechanism', summary: 'New carbon pricing on imports to the EU takes effect, requiring detailed emissions documentation from exporters.', source: 'EU Commission', date: '1 day ago', category: 'Compliance', url: 'https://ec.europa.eu' },
  { id: '5', title: 'Global Container Shipping Rates Stabilize', summary: 'After months of volatility, container shipping rates show signs of stabilization as capacity normalizes.', source: 'FreightWaves', date: '1 day ago', category: 'Logistics', url: 'https://www.freightwaves.com' },
  { id: '6', title: 'RCEP Trade Agreement Boosts Asia-Pacific Commerce', summary: 'Regional Comprehensive Economic Partnership shows significant increase in intra-regional trade volumes.', source: 'WTO News', date: '2 days ago', category: 'Trade', url: 'https://www.wto.org' },
];

// Quick Tools Data
const quickTools = [
  { id: 'shipping', name: 'Shipping Rate Estimator', icon: Ship, description: 'Compare freight rates', href: '/tools/freight-rate-calculator', color: 'from-blue-500 to-cyan-500' },
  { id: 'duty', name: 'Customs & Duty Calculator', icon: Calculator, description: 'Calculate import duties', href: '/tools/customs-compliance/duty-tariff-calculator', color: 'from-emerald-500 to-teal-500' },
  { id: 'currency', name: 'Currency Converter', icon: DollarSign, description: 'Live exchange rates', href: '/tools/international-trade/currency-converter', color: 'from-amber-500 to-orange-500' },
  { id: 'timezone', name: 'Time Zone Converter', icon: Clock, description: 'World time zones', href: '#timezone', color: 'from-purple-500 to-violet-500' },
  { id: 'cbm', name: 'CBM Calculator', icon: Package, description: 'Calculate volume', href: '/tools/ocean-freight/cbm-calculator', color: 'from-pink-500 to-rose-500' },
  { id: 'hscode', name: 'HS Code Search', icon: Search, description: 'Find product codes', href: '/tools/customs-compliance/hs-code-search', color: 'from-indigo-500 to-blue-500' },
];

// Knowledge Base Articles
const knowledgeArticles = [
  { title: 'Complete Guide to Incoterms 2020', category: 'Trade Basics', readTime: '8 min', slug: 'incoterms-guide' },
  { title: 'How to Calculate Landed Cost', category: 'Finance', readTime: '6 min', slug: 'landed-cost' },
  { title: 'Amazon FBA Fee Breakdown 2024', category: 'E-Commerce', readTime: '10 min', slug: 'fba-fees' },
  { title: 'Understanding Import Duties & Taxes', category: 'Compliance', readTime: '7 min', slug: 'import-duties' },
  { title: 'Choosing the Right Freight Forwarder', category: 'Logistics', readTime: '5 min', slug: 'freight-forwarder' },
  { title: 'Export Documentation Checklist', category: 'Documents', readTime: '4 min', slug: 'export-docs' },
];

// Currency exchange rates (mock)
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24,
  INR: 83.12,
  AED: 3.67,
  SGD: 1.34,
  AUD: 1.53,
  CAD: 1.36,
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
};

export default function TradeFlowHubPage() {
  // State - using lazy initializers to avoid SSR issues
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') {
      return { userType: null, categories: [], regions: [], platforms: [], onboarded: false };
    }
    const savedPrefs = localStorage.getItem('tradeflow-preferences');
    if (savedPrefs) {
      return JSON.parse(savedPrefs);
    }
    return { userType: null, categories: [], regions: [], platforms: [], onboarded: false };
  });
  
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === 'undefined') return false;
    const savedPrefs = localStorage.getItem('tradeflow-preferences');
    if (savedPrefs) {
      const parsed = JSON.parse(savedPrefs);
      return !parsed.onboarded;
    }
    return true;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Currency Converter State
  const [currencyAmount, setCurrencyAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  
  // Time Zone Converter State
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [fromTimezone, setFromTimezone] = useState('America/New_York');
  const [toTimezone, setToTimezone] = useState('Asia/Shanghai');
  
  // Save preferences to localStorage
  const savePreferences = useCallback((prefs: UserPreferences) => {
    localStorage.setItem('tradeflow-preferences', JSON.stringify(prefs));
    setPreferences(prefs);
  }, []);
  
  // Handle onboarding completion
  const completeOnboarding = () => {
    const newPrefs = { ...preferences, onboarded: true };
    savePreferences(newPrefs);
    setShowOnboarding(false);
  };
  
  // Currency conversion using useMemo instead of useEffect
  const convertedAmount = useMemo(() => {
    const amount = parseFloat(currencyAmount) || 0;
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    const result = (amount / fromRate) * toRate;
    return result.toFixed(2);
  }, [currencyAmount, fromCurrency, toCurrency]);
  
  // Smart search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate AI-powered search
    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();
    
    // E-commerce results
    if (queryLower.includes('wireless') || queryLower.includes('earbuds') || queryLower.includes('headphone')) {
      results.push({
        id: '1', type: 'product', title: 'Wireless Earbuds & Headphones',
        description: 'Find wireless earbuds, Bluetooth headphones, and audio accessories',
        platform: 'Amazon', platformLogo: '🛒',
        url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
        rating: '4.5+'
      });
      results.push({
        id: '2', type: 'product', title: 'Wholesale Wireless Earbuds',
        description: 'Bulk wireless earbuds from verified suppliers',
        platform: 'Alibaba', platformLogo: '🧡',
        url: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query)}`,
        price: '$2-15/piece'
      });
    }
    
    if (queryLower.includes('ship') || queryLower.includes('freight') || queryLower.includes('container')) {
      results.push({
        id: '3', type: 'logistics', title: 'Ocean Freight Services',
        description: 'Compare container shipping rates and book freight',
        platform: 'Flexport', platformLogo: '🚢',
        url: 'https://www.flexport.com'
      });
      results.push({
        id: '4', type: 'logistics', title: 'Freight Rate Comparison',
        description: 'Compare rates from multiple carriers',
        platform: 'Freightos', platformLogo: '✈️',
        url: `https://www.freightos.com/freight-resources/shipping-rates/`
      });
    }
    
    // Generic searches
    if (results.length === 0) {
      results.push({
        id: '5', type: 'product', title: `${query} on Amazon`,
        description: `Search for ${query} on the world's largest marketplace`,
        platform: 'Amazon', platformLogo: '🛒',
        url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`
      });
      results.push({
        id: '6', type: 'product', title: `${query} Wholesale`,
        description: `Find ${query} suppliers and manufacturers`,
        platform: 'Alibaba', platformLogo: '🧡',
        url: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query)}`
      });
      results.push({
        id: '7', type: 'product', title: `${query} on eBay`,
        description: `Find deals on ${query}`,
        platform: 'eBay', platformLogo: '📦',
        url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`
      });
    }
    
    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };
  
  // Get user's preferred platforms
  const getPreferredPlatforms = () => {
    if (preferences.platforms.length === 0) {
      return ecommercePlatforms.slice(0, 4);
    }
    return ecommercePlatforms.filter(p => preferences.platforms.includes(p.id));
  };
  
  // Get trending for user's category
  const getTrendingForUser = () => {
    if (preferences.categories.length === 0) {
      return trendingProducts.slice(0, 6);
    }
    return trendingProducts.filter(p => 
      preferences.categories.some(c => p.category.toLowerCase().includes(c.toLowerCase()))
    ).slice(0, 6);
  };
  
  // Get filtered news
  const getFilteredNews = () => {
    return tradeNews.slice(0, 4);
  };
  
  // Time zone conversion
  const convertTimezone = () => {
    const time = selectedTime.split(':');
    const hours = parseInt(time[0]);
    const minutes = parseInt(time[1]);
    
    // Simplified conversion (in real app, use proper timezone library)
    const timezoneOffsets: Record<string, number> = {
      'America/New_York': -5,
      'America/Los_Angeles': -8,
      'Europe/London': 0,
      'Europe/Berlin': 1,
      'Asia/Shanghai': 8,
      'Asia/Tokyo': 9,
      'Asia/Singapore': 8,
      'Asia/Dubai': 4,
    };
    
    const fromOffset = timezoneOffsets[fromTimezone] || 0;
    const toOffset = timezoneOffsets[toTimezone] || 0;
    const diff = toOffset - fromOffset;
    
    let newHours = hours + diff;
    if (newHours >= 24) newHours -= 24;
    if (newHours < 0) newHours += 24;
    
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Schema.org structured data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "TradeFlow Hub - Shiportrade",
          "description": "Personalized global trade intelligence hub for e-commerce sellers, buyers, and logistics professionals",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        })
      }} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/10 via-teal-500/5 to-transparent rounded-full blur-3xl" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 px-5 py-2.5 text-sm bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border-blue-500/20">
              <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
              Your Personalized Trade Intelligence Hub
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                TradeFlow Hub
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover products, find suppliers, compare logistics — all in one intelligent dashboard tailored for global trade.
            </p>
          </motion.div>
          
          {/* Universal Search Bar */}
          <motion.div 
            className="max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-background rounded-2xl shadow-2xl border">
                <div className="flex items-center p-2">
                  <Search className="h-6 w-6 text-muted-foreground ml-4" />
                  <Input
                    type="text"
                    placeholder="Find Products, Services, or Logistics Solutions – Globally!"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 h-14 text-lg border-0 bg-transparent focus-visible:ring-0 px-4"
                  />
                  <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl">
                    <Zap className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
                
                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border-t p-4"
                    >
                      <ScrollArea className="max-h-96">
                        <div className="space-y-3">
                          {searchResults.map((result) => (
                            <a
                              key={result.id}
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors group"
                            >
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl flex-shrink-0">
                                {result.platformLogo}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold group-hover:text-blue-600 transition-colors">
                                    {result.title}
                                  </span>
                                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-sm text-muted-foreground">{result.description}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <Badge variant="secondary" className="text-xs">{result.platform}</Badge>
                                  {result.price && <span className="text-xs text-emerald-600 font-medium">{result.price}</span>}
                                  {result.rating && <span className="text-xs text-amber-600">⭐ {result.rating}</span>}
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="border-t mt-4 pt-4 text-center">
                        <Button variant="outline" className="gap-2">
                          <Globe className="h-4 w-4" />
                          Search "{searchQuery}" on All Platforms
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {['Wireless Earbuds', 'LED Lights', 'Shipping Rates', 'Customs Duty'].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full text-xs"
                  onClick={() => handleSearch(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </motion.div>
          
          {/* Preference Setup Button */}
          {!preferences.onboarded && (
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="outline" 
                className="gap-2 border-dashed border-2 h-12 px-6"
                onClick={() => setShowOnboarding(true)}
              >
                <Settings className="h-5 w-5" />
                Personalize Your Dashboard
                <Badge variant="secondary" className="ml-2">2 min setup</Badge>
              </Button>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Main Content Tabs */}
      <section className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 h-14">
            <TabsTrigger value="dashboard" className="gap-2 text-base">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="discover" className="gap-2 text-base">
              <Globe className="h-5 w-5" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2 text-base">
              <Calculator className="h-5 w-5" />
              Tools
            </TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Preferred Marketplaces */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Store className="h-5 w-5 text-blue-500" />
                        My Preferred Marketplaces
                      </CardTitle>
                      <CardDescription>Quick access to your favorite trading platforms</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowOnboarding(true)}>
                      <Settings className="h-4 w-4 mr-1" />
                      Customize
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getPreferredPlatforms().map((platform) => (
                      <a
                        key={platform.id}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <Card className="h-full cursor-pointer hover:shadow-lg transition-all border-0 bg-white dark:bg-gray-900 overflow-hidden">
                          <div className={`h-2 bg-gradient-to-r ${platform.color}`} />
                          <CardContent className="pt-4 pb-4 text-center">
                            <div className="text-3xl mb-2">{platform.logo}</div>
                            <p className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                              {platform.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              Visit
                            </p>
                          </CardContent>
                        </Card>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Trending Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      Trending Products
                      {preferences.categories.length > 0 && (
                        <Badge variant="secondary" className="ml-2">Personalized</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {preferences.categories.length > 0 
                        ? `Based on your interests: ${preferences.categories.slice(0, 2).join(', ')}`
                        : 'Top trending products across platforms'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-3">
                        {getTrendingForUser().map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                              <Package className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate group-hover:text-blue-600 transition-colors">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">{product.category}</Badge>
                                <span className="text-xs text-muted-foreground">{product.searchVolume} searches</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={`${
                                product.trend === 'up' 
                                  ? 'bg-emerald-500/10 text-emerald-600' 
                                  : 'bg-amber-500/10 text-amber-600'
                              }`}>
                                {product.trend === 'up' ? '↑' : '→'} {product.change}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">{product.platform}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Trade News */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Newspaper className="h-5 w-5 text-blue-500" />
                      Latest Trade News & Insights
                    </CardTitle>
                    <CardDescription>Stay updated with global trade developments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-4">
                        {getFilteredNews().map((news) => (
                          <a
                            key={news.id}
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                                  {news.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {news.summary}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">{news.category}</Badge>
                                  <span className="text-xs text-muted-foreground">{news.source}</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">{news.date}</span>
                                </div>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Top Deals Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Star className="h-5 w-5 text-amber-500" />
                    Top Deals for You
                  </CardTitle>
                  <CardDescription>Curated deals from your preferred platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { platform: 'Amazon', title: 'Electronics Week', discount: 'Up to 40% off', logo: '🛒', color: 'from-orange-500 to-amber-500' },
                      { platform: 'Alibaba', title: 'Bulk Orders', discount: 'MOQ from 1 piece', logo: '🧡', color: 'from-orange-600 to-red-500' },
                      { platform: 'eBay', title: 'Daily Deals', discount: 'Free shipping', logo: '📦', color: 'from-blue-500 to-cyan-500' },
                      { platform: 'Shopify', title: 'Summer Sale', discount: 'Up to 50% off', logo: '🛍️', color: 'from-green-500 to-emerald-500' },
                    ].map((deal, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="block p-4 rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{deal.logo}</span>
                          <div>
                            <p className="font-medium text-sm">{deal.platform}</p>
                            <p className="text-xs text-muted-foreground">{deal.title}</p>
                          </div>
                        </div>
                        <Badge className={`bg-gradient-to-r ${deal.color} text-white`}>
                          {deal.discount}
                        </Badge>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-8">
            {/* Platform Categories */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* E-commerce Platforms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <ShoppingCart className="h-5 w-5 text-blue-500" />
                      E-Commerce Marketplaces
                    </CardTitle>
                    <CardDescription>Find products and suppliers worldwide</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {ecommercePlatforms.map((platform) => (
                        <a
                          key={platform.id}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group"
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-xl`}>
                            {platform.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm group-hover:text-blue-600 transition-colors">{platform.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              Open
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Logistics Platforms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Truck className="h-5 w-5 text-emerald-500" />
                      Logistics & Freight Services
                    </CardTitle>
                    <CardDescription>Compare shipping rates and book freight</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {logisticsPlatforms.map((platform) => (
                        <a
                          key={platform.id}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group"
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-xl`}>
                            {platform.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm group-hover:text-emerald-600 transition-colors">{platform.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              Open
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Browse by Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Layers className="h-5 w-5 text-purple-500" />
                    Browse by Category
                  </CardTitle>
                  <CardDescription>Discover products and services by industry</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {productCategories.map((category) => (
                      <Button
                        key={category}
                        variant="outline"
                        className="h-auto py-4 flex flex-col gap-2 hover:border-blue-500 hover:text-blue-600"
                        onClick={() => handleSearch(category)}
                      >
                        <Package className="h-5 w-5" />
                        <span className="text-xs">{category}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-8">
            {/* Quick Tools Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Quick Tools
                  </CardTitle>
                  <CardDescription>Essential calculators and converters at your fingertips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link key={tool.id} href={tool.href}>
                          <Card className="h-full cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 group overflow-hidden">
                            <div className={`h-1.5 bg-gradient-to-r ${tool.color}`} />
                            <CardContent className="pt-5 pb-4">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                  <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold group-hover:text-blue-600 transition-colors">{tool.name}</p>
                                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Currency Converter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                    Live Currency Converter
                  </CardTitle>
                  <CardDescription>Real-time exchange rates for 180+ currencies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={currencyAmount}
                        onChange={(e) => setCurrencyAmount(e.target.value)}
                        className="h-12 text-lg"
                      />
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(exchangeRates).map((code) => (
                            <SelectItem key={code} value={code}>{code}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        onClick={() => {
                          const temp = fromCurrency;
                          setFromCurrency(toCurrency);
                          setToCurrency(temp);
                        }}
                      >
                        <RefreshCw className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Converted Amount</Label>
                      <div className="h-12 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center">
                        <span className="text-2xl font-bold text-emerald-600">{convertedAmount}</span>
                        <span className="ml-2 text-lg text-muted-foreground">{toCurrency}</span>
                      </div>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(exchangeRates).map((code) => (
                            <SelectItem key={code} value={code}>{code}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {['USD', 'EUR', 'GBP', 'CNY', 'JPY', 'INR'].map((code) => (
                      <Button
                        key={code}
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => setToCurrency(code)}
                      >
                        {code}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Time Zone Converter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              id="timezone"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Time Zone Converter
                  </CardTitle>
                  <CardDescription>Schedule meetings across time zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="h-12 text-lg"
                      />
                      <Select value={fromTimezone} onValueChange={setFromTimezone}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">New York (EST)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Los Angeles (PST)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                          <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                          <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                          <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Converted Time</Label>
                      <div className="h-12 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg flex items-center">
                        <span className="text-2xl font-bold text-blue-600">{convertTimezone()}</span>
                      </div>
                      <Select value={toTimezone} onValueChange={setToTimezone}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">New York (EST)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Los Angeles (PST)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                          <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                          <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                          <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Knowledge Base */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/5 to-violet-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Trade Knowledge Base
                  </CardTitle>
                  <CardDescription>Expert guides and resources for global trade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {knowledgeArticles.map((article, idx) => (
                      <Link key={idx} href={`/guides/${article.slug}`}>
                        <Card className="h-full cursor-pointer hover:shadow-md transition-all border-0 bg-white dark:bg-gray-900 group">
                          <CardContent className="pt-4 pb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-sm line-clamp-2 group-hover:text-purple-600 transition-colors">
                                  {article.title}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">{article.category}</Badge>
                                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="outline" className="gap-2" asChild>
                      <Link href="/guides">
                        View All Guides
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              Personalize Your TradeFlow Hub
            </DialogTitle>
            <DialogDescription>
              Tell us about your trading needs to get personalized recommendations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* User Type */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Are you a Seller or Buyer?</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'seller', label: 'Seller', icon: ShoppingCart, desc: 'I sell products' },
                  { id: 'buyer', label: 'Buyer', icon: Package, desc: 'I buy products' },
                  { id: 'both', label: 'Both', icon: Briefcase, desc: 'I do both' },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setPreferences(prev => ({ ...prev, userType: type.id as any }))}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        preferences.userType === type.id 
                          ? 'border-blue-500 bg-blue-500/5' 
                          : 'border-muted hover:border-muted-foreground/50'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mb-2 ${preferences.userType === type.id ? 'text-blue-500' : 'text-muted-foreground'}`} />
                      <p className="font-medium">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Product Categories */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">What product categories interest you?</Label>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
              <div className="grid grid-cols-3 gap-2">
                {productCategories.map((category) => (
                  <div
                    key={category}
                    onClick={() => {
                      setPreferences(prev => ({
                        ...prev,
                        categories: prev.categories.includes(category)
                          ? prev.categories.filter(c => c !== category)
                          : [...prev.categories, category]
                      }));
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                      preferences.categories.includes(category)
                        ? 'border-emerald-500 bg-emerald-500/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                  >
                    <span className="text-sm">{category}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Regions */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Which regions are you interested in?</Label>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
              <div className="grid grid-cols-4 gap-2">
                {tradeRegions.map((region) => (
                  <div
                    key={region}
                    onClick={() => {
                      setPreferences(prev => ({
                        ...prev,
                        regions: prev.regions.includes(region)
                          ? prev.regions.filter(r => r !== region)
                          : [...prev.regions, region]
                      }));
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                      preferences.regions.includes(region)
                        ? 'border-purple-500 bg-purple-500/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                  >
                    <Globe className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-xs">{region}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Platforms */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Preferred e-commerce platforms?</Label>
              <p className="text-sm text-muted-foreground">Select the platforms you use or are interested in</p>
              <div className="grid grid-cols-4 gap-2">
                {ecommercePlatforms.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => {
                      setPreferences(prev => ({
                        ...prev,
                        platforms: prev.platforms.includes(platform.id)
                          ? prev.platforms.filter(p => p !== platform.id)
                          : [...prev.platforms, platform.id]
                      }));
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                      preferences.platforms.includes(platform.id)
                        ? 'border-amber-500 bg-amber-500/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                  >
                    <span className="text-2xl">{platform.logo}</span>
                    <p className="text-xs mt-1">{platform.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowOnboarding(false)}>
              Skip for Now
            </Button>
            <Button 
              onClick={completeOnboarding}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* CTA Banner */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Optimize Your Global Trade?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
              Join thousands of businesses using Shiportrade for smarter sourcing, shipping, and trade decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-10 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 shadow-2xl">
                <Link href="/tools">
                  <Zap className="h-5 w-5 mr-2" />
                  Explore All 82+ Tools
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg font-semibold bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white">
                <Link href="/directories/ports">
                  <Globe className="h-5 w-5 mr-2" />
                  Port Directory
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
