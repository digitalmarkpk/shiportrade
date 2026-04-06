"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  ArrowRight,
  Clock,
  Search,
  Ship,
  Plane,
  DollarSign,
  Shield,
  Leaf,
  Zap,
  Truck,
  Briefcase,
  TrendingUp,
  Bell,
  AlertTriangle,
  Globe,
  RefreshCw,
  Loader2,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Eye,
  Filter,
  X,
  Sparkles,
  Landmark,
  Flame,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  Radio,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { newsSources, regions as sourceRegions, type NewsSource, type NewsRegion } from "@/lib/constants/news-sources";

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
  topics?: string[];
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

// Category images with proper Unsplash credits
const categoryConfig: Record<string, { bg: string; text: string; gradient: string; icon: React.ElementType; image: string; imageCredit: string; imageAuthor: string; imageLink: string }> = {
  "All": { 
    bg: "bg-gray-500", 
    text: "text-gray-600", 
    gradient: "from-gray-500 to-slate-500", 
    icon: Newspaper, 
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop", 
    imageCredit: "Photo by Niclas Illg",
    imageAuthor: "Niclas Illg",
    imageLink: "https://unsplash.com/@niclasillg"
  },
  "Ocean Freight": { 
    bg: "bg-blue-500", 
    text: "text-blue-600", 
    gradient: "from-blue-500 to-cyan-500", 
    icon: Ship, 
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop",
    imageCredit: "Photo by Ant Rozetsky",
    imageAuthor: "Ant Rozetsky",
    imageLink: "https://unsplash.com/@anton Rozetsky"
  },
  "Air Freight": { 
    bg: "bg-purple-500", 
    text: "text-purple-600", 
    gradient: "from-purple-500 to-violet-500", 
    icon: Plane, 
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
    imageCredit: "Photo by 张 鑫",
    imageAuthor: "张 鑫",
    imageLink: "https://unsplash.com/@zhang_xinn"
  },
  "Trade Finance": { 
    bg: "bg-emerald-500", 
    text: "text-emerald-600", 
    gradient: "from-emerald-500 to-teal-500", 
    icon: DollarSign, 
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    imageCredit: "Photo by Michael Longmire",
    imageAuthor: "Michael Longmire",
    imageLink: "https://unsplash.com/@mlongmire"
  },
  "Customs": { 
    bg: "bg-rose-500", 
    text: "text-rose-600", 
    gradient: "from-rose-500 to-pink-500", 
    icon: Shield, 
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=300&fit=crop",
    imageCredit: "Photo by Mick Haupt",
    imageAuthor: "Mick Haupt",
    imageLink: "https://unsplash.com/@rojekilian"
  },
  "Technology": { 
    bg: "bg-indigo-500", 
    text: "text-indigo-600", 
    gradient: "from-indigo-500 to-blue-500", 
    icon: Zap, 
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    imageCredit: "Photo by Louis Reed",
    imageAuthor: "Louis Reed",
    imageLink: "https://unsplash.com/@_louisreed"
  },
  "Sustainability": { 
    bg: "bg-green-500", 
    text: "text-green-600", 
    gradient: "from-green-500 to-emerald-500", 
    icon: Leaf, 
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop",
    imageCredit: "Photo by Matt Howard",
    imageAuthor: "Matt Howard",
    imageLink: "https://unsplash.com/@thematthoward"
  },
  "Logistics": { 
    bg: "bg-orange-500", 
    text: "text-orange-600", 
    gradient: "from-orange-500 to-amber-500", 
    icon: Truck, 
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
    imageCredit: "Photo by Kyle Deang",
    imageAuthor: "Kyle Deang",
    imageLink: "https://unsplash.com/@kyledeang"
  },
  "E-Commerce": { 
    bg: "bg-pink-500", 
    text: "text-pink-600", 
    gradient: "from-pink-500 to-rose-500", 
    icon: Briefcase, 
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    imageCredit: "Photo by CardMapr",
    imageAuthor: "CardMapr",
    imageLink: "https://unsplash.com/@cardmapr"
  },
  "Geopolitical": { 
    bg: "bg-red-600", 
    text: "text-red-700", 
    gradient: "from-red-600 to-rose-600", 
    icon: Landmark, 
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop",
    imageCredit: "Photo by Colin Watts",
    imageAuthor: "Colin Watts",
    imageLink: "https://unsplash.com/@colin_watts"
  },
};

const newsCategories = Object.keys(categoryConfig).map(name => ({
  name,
  icon: categoryConfig[name].icon,
}));

const regions = [
  { id: "global", name: "Global", icon: "🌐" },
  { id: "asia-pacific", name: "Asia Pacific", icon: "🌏" },
  { id: "europe", name: "Europe", icon: "🇪🇺" },
  { id: "americas", name: "Americas", icon: "🌎" },
  { id: "middle-east", name: "Middle East", icon: "🕌" },
  { id: "africa", name: "Africa", icon: "🌍" },
];

const quickFilters = [
  { id: "breaking", name: "Breaking", icon: Flame },
  { id: "hour", name: "This Hour", icon: Clock },
  { id: "today", name: "Today", icon: Calendar },
  { id: "trending", name: "Trending", icon: TrendingUp },
  { id: "saved", name: "Saved", icon: Bookmark },
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

export default function NewsClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("global");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [savedNews, setSavedNews] = useState<string[]>([]);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [sourceSearchQuery, setSourceSearchQuery] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<NewsRegion[]>(['global', 'asia-pacific', 'europe', 'americas', 'middle-east', 'africa']);
  const [sourceFilterOpen, setSourceFilterOpen] = useState(false);
  const { toast } = useToast();

  // Load saved news from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shiportrade-saved-news");
    if (saved) {
      setSavedNews(JSON.parse(saved));
    }
  }, []);

  // Toggle save news
  const toggleSaveNews = useCallback((newsId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newSaved = savedNews.includes(newsId)
      ? savedNews.filter(id => id !== newsId)
      : [...savedNews, newsId];
    
    setSavedNews(newSaved);
    localStorage.setItem("shiportrade-saved-news", JSON.stringify(newSaved));
    
    toast({
      title: savedNews.includes(newsId) ? "Removed from saved" : "Saved for later",
      description: savedNews.includes(newsId) ? "Article removed from your saved list" : "Article added to your saved list",
    });
  }, [savedNews, toast]);

  // Fetch news from API
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        region: selectedRegion,
        category: selectedCategory === "All" ? "all" : selectedCategory,
        limit: "100",
      });

      const response = await fetch(`/api/news?${params}`);
      const data: NewsResponse = await response.json();

      if (data.success) {
        // Add computed fields
        const enhancedData = data.data.map(item => ({
          ...item,
          readTime: calculateReadTime(item.content || item.excerpt),
          views: Math.floor(Math.random() * 5000) + 100,
          imageUrl: item.imageUrl || categoryConfig[item.category]?.image || categoryConfig["All"].image,
          topics: generateTopics(item.title, item.category),
        }));
        setNewsData(enhancedData);
        setLastUpdated(data.meta.lastUpdated);
      } else {
        setError("Failed to load news");
      }
    } catch (err) {
      setError("Unable to fetch news. Please try again.");
      console.error("News fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRegion, selectedCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Generate related topics
  function generateTopics(title: string, category: string): string[] {
    const topics = [category];
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('china')) topics.push('China');
    if (lowerTitle.includes('usa') || lowerTitle.includes('us ')) topics.push('USA');
    if (lowerTitle.includes('red sea') || lowerTitle.includes('redsea')) topics.push('Red Sea');
    if (lowerTitle.includes('panama')) topics.push('Panama Canal');
    if (lowerTitle.includes('suez')) topics.push('Suez Canal');
    if (lowerTitle.includes('port')) topics.push('Ports');
    if (lowerTitle.includes('container')) topics.push('Containers');
    if (lowerTitle.includes('rate') || lowerTitle.includes('price')) topics.push('Rates');
    
    return [...new Set(topics)].slice(0, 4);
  }

  // Filter news
  const filteredNews = useMemo(() => {
    let filtered = newsData;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(news =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Quick filters
    if (activeQuickFilter === "breaking") {
      filtered = filtered.filter(n => n.isAlert);
    } else if (activeQuickFilter === "hour") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      filtered = filtered.filter(n => new Date(n.publishedAt) > oneHourAgo);
    } else if (activeQuickFilter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(n => new Date(n.publishedAt) > today);
    } else if (activeQuickFilter === "trending") {
      filtered = filtered.filter(n => n.trending);
    } else if (activeQuickFilter === "saved") {
      filtered = filtered.filter(n => savedNews.includes(n.id));
    }

    // Source filter
    if (selectedSource) {
      filtered = filtered.filter(n => 
        n.source.toLowerCase().includes(selectedSource.toLowerCase()) ||
        selectedSource.toLowerCase().includes(n.source.toLowerCase())
      );
    }

    return filtered;
  }, [newsData, searchQuery, activeQuickFilter, savedNews, selectedSource]);

  // Alert and trending news
  const alertNews = useMemo(() => filteredNews.filter(n => n.isAlert), [filteredNews]);
  const trendingNews = useMemo(() => filteredNews.filter(n => n.trending), [filteredNews]);
  const mostReadNews = useMemo(() => [...filteredNews].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5), [filteredNews]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: newsData.length };
    newsData.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [newsData]);

  // Source counts from news data
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    newsData.forEach(item => {
      counts[item.source] = (counts[item.source] || 0) + 1;
    });
    return counts;
  }, [newsData]);

  // Group sources by region
  const sourcesByRegion = useMemo(() => {
    const grouped: Record<NewsRegion, NewsSource[]> = {
      'global': [],
      'asia-pacific': [],
      'europe': [],
      'americas': [],
      'middle-east': [],
      'africa': [],
    };

    const filteredSources = sourceSearchQuery
      ? newsSources.filter(s => 
          s.name.toLowerCase().includes(sourceSearchQuery.toLowerCase()) ||
          s.categories.some(c => c.toLowerCase().includes(sourceSearchQuery.toLowerCase()))
        )
      : newsSources;

    filteredSources.forEach(source => {
      if (grouped[source.region]) {
        grouped[source.region].push(source);
      }
    });

    // Sort each group by priority (high first)
    Object.keys(grouped).forEach(region => {
      grouped[region as NewsRegion].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    });

    return grouped;
  }, [sourceSearchQuery]);

  // Toggle region expansion
  const toggleRegion = (region: NewsRegion) => {
    setExpandedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  // Get priority badge color
  const getPriorityStyle = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-amber-400 to-orange-400 text-white';
      case 'medium':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'low':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Get region icon and color
  const getRegionConfig = (region: NewsRegion) => {
    const configs: Record<NewsRegion, { icon: string; color: string; gradient: string }> = {
      'global': { icon: '🌐', color: 'text-blue-600', gradient: 'from-blue-500 to-cyan-500' },
      'asia-pacific': { icon: '🌏', color: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-500' },
      'europe': { icon: '🇪🇺', color: 'text-indigo-600', gradient: 'from-indigo-500 to-violet-500' },
      'americas': { icon: '🌎', color: 'text-orange-600', gradient: 'from-orange-500 to-amber-500' },
      'middle-east': { icon: '🕌', color: 'text-teal-600', gradient: 'from-teal-500 to-cyan-500' },
      'africa': { icon: '🌍', color: 'text-amber-600', gradient: 'from-amber-500 to-yellow-500' },
    };
    return configs[region];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 border-b border-border/40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container mx-auto px-4 py-8 relative">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge className="mb-3 px-4 py-1.5 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300 font-medium">
                <Sparkles className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                Your #1 Source for Global Trade Intelligence
              </Badge>
            </motion.div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              Trade News & Industry
              <span className="block mt-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Insights
              </span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-6">
              Real-time news from <span className="font-semibold text-foreground">40+ trusted sources</span> — maritime, 
              logistics, trade finance, and geopolitical updates.
            </p>

            {/* Search */}
            <div className="flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-lg text-sm"
                />
              </div>
              
              {/* Mobile Source Filter */}
              <Popover open={sourceFilterOpen} onOpenChange={setSourceFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-10 w-10 rounded-lg xl:hidden",
                      selectedSource && "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                    )}
                  >
                    <Radio className="h-4 w-4" />
                    {selectedSource && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-3 border-b border-border/40 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Radio className="h-4 w-4 text-emerald-500" />
                        Filter by Source
                      </h3>
                      <Badge variant="outline" className="text-xs h-5 px-2">
                        {newsSources.length} sources
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    {/* Search Sources */}
                    <div className="relative mb-3">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search sources..."
                        value={sourceSearchQuery}
                        onChange={(e) => setSourceSearchQuery(e.target.value)}
                        className="pl-8 h-8 text-xs rounded-lg"
                      />
                    </div>
                    
                    {/* Quick Buttons */}
                    <div className="flex gap-1.5 mb-3">
                      <Button
                        variant={selectedSource === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSource(null)}
                        className={cn(
                          "h-7 text-[10px] rounded-md flex-1",
                          selectedSource === null && "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0"
                        )}
                      >
                        All Sources
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSourceSearchQuery("Ocean Freight")}
                        className="h-7 text-[10px] rounded-md"
                      >
                        Ocean
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSourceSearchQuery("Logistics")}
                        className="h-7 text-[10px] rounded-md"
                      >
                        Logistics
                      </Button>
                    </div>
                    
                    {/* Selected Source */}
                    {selectedSource && (
                      <div className="mb-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                              {selectedSource}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSource(null);
                              setSourceFilterOpen(false);
                            }}
                            className="h-5 w-5 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Sources by Region */}
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {(['global', 'asia-pacific', 'europe', 'americas', 'middle-east', 'africa'] as NewsRegion[]).map((region) => {
                          const sources = sourcesByRegion[region];
                          if (sources.length === 0) return null;
                          
                          const regionConfig = getRegionConfig(region);
                          const regionName = sourceRegions.find(r => r.id === region)?.name || region;
                          const isExpanded = expandedRegions.includes(region);
                          
                          return (
                            <div key={region}>
                              <Button
                                variant="ghost"
                                onClick={() => toggleRegion(region)}
                                className="w-full justify-between h-7 px-2 hover:bg-muted/50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <span>{regionConfig.icon}</span>
                                  <span className="text-xs font-medium">{regionName}</span>
                                  <Badge variant="outline" className="h-4 px-1 text-[9px]">
                                    {sources.length}
                                  </Badge>
                                </div>
                                <ChevronDown className={cn(
                                  "h-3 w-3 transition-transform",
                                  isExpanded && "rotate-180"
                                )} />
                              </Button>
                              
                              {isExpanded && (
                                <div className="ml-2 mt-1 space-y-0.5">
                                  {sources.slice(0, 5).map((source) => {
                                    const isActive = selectedSource === source.name;
                                    return (
                                      <Button
                                        key={source.id}
                                        variant={isActive ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => {
                                          setSelectedSource(isActive ? null : source.name);
                                          setSourceFilterOpen(false);
                                        }}
                                        className={cn(
                                          "w-full justify-between h-7 px-2 text-xs",
                                          isActive && `bg-gradient-to-r ${regionConfig.gradient} text-white`
                                        )}
                                      >
                                        <span className="truncate">{source.name}</span>
                                        {source.priority === 'high' && !isActive && (
                                          <Star className="h-2.5 w-2.5 text-amber-500 flex-shrink-0" />
                                        )}
                                      </Button>
                                    );
                                  })}
                                  {sources.length > 5 && (
                                    <p className="text-[9px] text-muted-foreground px-2 py-1">
                                      +{sources.length - 5} more sources
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-lg"
                onClick={fetchNews}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Regions - Center Top */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {regions.map((region) => (
              <Button
                key={region.id}
                variant={selectedRegion === region.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedRegion(region.id)}
                className={cn(
                  "rounded-full gap-1.5 h-8 text-xs transition-all",
                  selectedRegion === region.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                    : "hover:bg-muted"
                )}
              >
                <span>{region.icon}</span>
                <span className="hidden sm:inline">{region.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Breaking News Alert Bar */}
      <AnimatePresence>
        {alertNews.length > 0 && (
          <motion.section
            className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border-b border-red-500/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center gap-3 overflow-x-auto">
                <Badge className="bg-red-500 text-white flex-shrink-0 animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  BREAKING
                </Badge>
                <div className="flex gap-6 overflow-x-auto pb-1">
                  {alertNews.slice(0, 5).map((news) => (
                    <Link
                      key={news.id}
                      href={`/news/${news.slug}?id=${news.id}`}
                      className="flex-shrink-0 text-sm hover:text-blue-600 transition-colors whitespace-nowrap font-medium"
                    >
                      {news.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Layout with Sidebar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Vertical Filters */}
          <motion.aside
            initial={false}
            animate={{ width: sidebarCollapsed ? 60 : 220 }}
            className="flex-shrink-0 hidden lg:block"
          >
            <Card className="sticky top-20 border-0 shadow-md overflow-hidden">
              <div className="p-3 border-b border-border/40 flex items-center justify-between bg-muted/30">
                {!sidebarCollapsed && (
                  <span className="text-sm font-semibold">Categories</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="p-2 space-y-1">
                {newsCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.name;
                  const count = categoryCounts[cat.name] || 0;
                  const config = categoryConfig[cat.name];

                  return (
                    <Button
                      key={cat.name}
                      variant={isSelected ? "default" : "ghost"}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={cn(
                        "w-full justify-start gap-2 h-10 transition-all",
                        isSelected && `bg-gradient-to-r ${config.gradient} text-white`,
                        sidebarCollapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left text-sm truncate">{cat.name}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs h-5 px-1.5",
                              isSelected && "bg-white/20 text-white border-white/30"
                            )}
                          >
                            {count}
                          </Badge>
                        </>
                      )}
                    </Button>
                  );
                })}
              </div>

              {/* Quick Filters */}
              {!sidebarCollapsed && (
                <>
                  <div className="p-3 border-t border-border/40 bg-muted/30">
                    <span className="text-sm font-semibold">Quick Filters</span>
                  </div>
                  <div className="p-2 space-y-1">
                    {quickFilters.map((filter) => {
                      const Icon = filter.icon;
                      const isActive = activeQuickFilter === filter.id;

                      return (
                        <Button
                          key={filter.id}
                          variant={isActive ? "default" : "ghost"}
                          onClick={() => setActiveQuickFilter(isActive ? null : filter.id)}
                          className={cn(
                            "w-full justify-start gap-2 h-9",
                            isActive && "bg-blue-600 text-white"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1 text-left text-sm">{filter.name}</span>
                          {filter.id === "saved" && savedNews.length > 0 && (
                            <Badge className="h-5 px-1.5 text-xs">
                              {savedNews.length}
                            </Badge>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </>
              )}
            </Card>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Fetching latest news...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4 text-sm">{error}</p>
                <Button onClick={fetchNews} size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}

            {/* News Content */}
            {!isLoading && !error && (
              <>
                {/* Trending Section */}
                {trendingNews.length > 0 && (
                  <section className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                      <h2 className="font-semibold">Trending Now</h2>
                      {lastUpdated && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          Updated: {new Date(lastUpdated).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {trendingNews.slice(0, 4).map((news) => {
                        const config = categoryConfig[news.category] || categoryConfig["Ocean Freight"];
                        const isSaved = savedNews.includes(news.id);

                        return (
                          <Link
                            key={news.id}
                            href={`/news/${news.slug}?id=${news.id}`}
                            className="flex-shrink-0 w-64"
                          >
                            <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
                              <div className="relative h-32 overflow-hidden">
                                <Image
                                  src={news.imageUrl || config.image}
                                  alt={news.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="256px"
                                  unoptimized={news.imageUrl ? !news.imageUrl.includes('localhost') : false}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {/* Image Credit */}
                                <span 
                                  className="absolute bottom-1 left-1 text-[9px] text-white/60 hover:text-white/90 transition-colors bg-black/30 px-1 rounded"
                                >
                                  📷 {news.imageCredit || `${config.imageAuthor}/Unsplash`}
                                </span>
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <Badge className={`bg-gradient-to-r ${config.gradient} text-white text-xs`}>
                                    {news.category}
                                  </Badge>
                                </div>
                                <button
                                  onClick={(e) => toggleSaveNews(news.id, e)}
                                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                                >
                                  {isSaved ? (
                                    <BookmarkCheck className="h-3.5 w-3.5 text-blue-600" />
                                  ) : (
                                    <Bookmark className="h-3.5 w-3.5 text-gray-600" />
                                  )}
                                </button>
                              </div>
                              <CardContent className="pt-3 pb-2">
                                <p className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                                  {news.title}
                                </p>
                                {/* Short description for SEO */}
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">
                                  {news.excerpt}
                                </p>
                                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatRelativeTime(news.publishedAt)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {news.views}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Main News Grid */}
                <Tabs defaultValue="latest" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="latest" className="gap-1.5 text-sm">
                      <Clock className="h-4 w-4" />
                      Latest (48h)
                    </TabsTrigger>
                    <TabsTrigger value="popular" className="gap-1.5 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      Popular
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="gap-1.5 text-sm">
                      <Bell className="h-4 w-4" />
                      Alerts {alertNews.length > 0 && `(${alertNews.length})`}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="latest">
                    {filteredNews.length === 0 ? (
                      <div className="text-center py-12">
                        <Newspaper className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No news found</p>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory("All");
                            setActiveQuickFilter(null);
                            setSearchQuery("");
                          }}
                        >
                          Clear all filters
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* Featured Article */}
                        {filteredNews[0] && (
                          <Link href={`/news/${filteredNews[0].slug}?id=${filteredNews[0].id}`} className="block mb-6">
                            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                              <div className="grid md:grid-cols-2">
                                <div className="relative h-48 md:h-auto">
                                  <Image
                                    src={filteredNews[0].imageUrl || categoryConfig[filteredNews[0].category]?.image || categoryConfig["All"].image}
                                    alt={filteredNews[0].title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    unoptimized={filteredNews[0].imageUrl ? !filteredNews[0].imageUrl.includes('localhost') : false}
                                  />
                                  {/* Image Credit */}
                                  <span 
                                    className="absolute bottom-2 left-2 text-[10px] text-white/60 hover:text-white/90 transition-colors bg-black/40 px-2 py-0.5 rounded"
                                  >
                                    📷 {filteredNews[0].imageCredit || categoryConfig[filteredNews[0].category]?.imageAuthor || 'Unsplash'}
                                  </span>
                                </div>
                                <CardContent className="p-5 flex flex-col justify-center">
                                  <div className="flex items-center gap-2 flex-wrap mb-3">
                                    {filteredNews[0].isAlert && (
                                      <Badge className="bg-red-500 text-white text-xs animate-pulse">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        ALERT
                                      </Badge>
                                    )}
                                    <Badge className={`bg-gradient-to-r ${categoryConfig[filteredNews[0].category]?.gradient} text-white text-xs`}>
                                      {filteredNews[0].category}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {regions.find(r => r.id === filteredNews[0].region)?.icon} {filteredNews[0].region}
                                    </Badge>
                                  </div>
                                  <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                                    {filteredNews[0].title}
                                  </h2>
                                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{filteredNews[0].excerpt}</p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Globe className="h-3 w-3" />
                                      Source: {filteredNews[0].source}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatRelativeTime(filteredNews[0].publishedAt)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Eye className="h-3 w-3" />
                                      {filteredNews[0].views}
                                    </div>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          </Link>
                        )}

                        {/* News Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredNews.slice(1).map((news, index) => {
                            const config = categoryConfig[news.category] || categoryConfig["Ocean Freight"];
                            const isSaved = savedNews.includes(news.id);

                            return (
                              <motion.div
                                key={news.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                              >
                                <Link href={`/news/${news.slug}?id=${news.id}`}>
                                  <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden">
                                    <div className="relative h-36 overflow-hidden">
                                      <Image
                                        src={news.imageUrl || config.image}
                                        alt={news.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        unoptimized={news.imageUrl ? !news.imageUrl.includes('localhost') : false}
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                      {/* Image Credit */}
                                      <span 
                                        className="absolute bottom-1 left-1 text-[9px] text-white/60 hover:text-white/90 transition-colors bg-black/30 px-1 rounded"
                                      >
                                        📷 {news.imageCredit || `${config.imageAuthor}/Unsplash`}
                                      </span>
                                      <div className="absolute top-2 left-2">
                                        <Badge className={`bg-gradient-to-r ${config.gradient} text-white text-xs`}>
                                          {news.category}
                                        </Badge>
                                      </div>
                                      <button
                                        onClick={(e) => toggleSaveNews(news.id, e)}
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                                      >
                                        {isSaved ? (
                                          <BookmarkCheck className="h-3.5 w-3.5 text-blue-600" />
                                        ) : (
                                          <Bookmark className="h-3.5 w-3.5 text-gray-600" />
                                        )}
                                      </button>
                                    </div>
                                    <CardContent className="pt-3 pb-2">
                                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-1.5">
                                        {news.title}
                                      </h3>
                                      {/* Short description for SEO */}
                                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                        {news.excerpt}
                                      </p>
                                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                          <Globe className="h-3 w-3" />
                                          Source: {news.source}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatRelativeTime(news.publishedAt)}
                                          </span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="popular">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mostReadNews.map((news, index) => {
                        const config = categoryConfig[news.category] || categoryConfig["Ocean Freight"];

                        return (
                          <motion.div
                            key={news.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <Link href={`/news/${news.slug}?id=${news.id}`}>
                              <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                                      {index + 1}
                                    </div>
                                    <TrendingUp className="h-4 w-4 text-orange-500" />
                                    <Badge variant="outline" className={`text-xs ${config.text}`}>
                                      {news.category}
                                    </Badge>
                                  </div>
                                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                                    {news.title}
                                  </h3>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Globe className="h-3 w-3" />
                                      Source: {news.source}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Eye className="h-3 w-3" />
                                      {news.views} views
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="alerts">
                    {alertNews.length === 0 ? (
                      <div className="text-center py-12">
                        <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No active alerts</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {alertNews.map((news, index) => {
                          const config = categoryConfig[news.category] || categoryConfig["Ocean Freight"];

                          return (
                            <motion.div
                              key={news.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              <Link href={`/news/${news.slug}?id=${news.id}`}>
                                <Card className="h-full border-2 border-red-500/30 bg-red-500/5 hover:shadow-lg transition-all cursor-pointer group">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className="bg-red-500 text-white text-xs animate-pulse">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        ALERT
                                      </Badge>
                                      <Badge variant="outline" className={`text-xs ${config.text}`}>
                                        {news.category}
                                      </Badge>
                                    </div>
                                    <h3 className="font-medium group-hover:text-blue-600 transition-colors mb-2">
                                      {news.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{news.excerpt}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Globe className="h-3 w-3" />
                                        Source: {news.source}
                                      </div>
                                      <span>{formatRelativeTime(news.publishedAt)}</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>

          {/* Right Sidebar - Most Read & News Sources */}
          <aside className="flex-shrink-0 hidden xl:block w-64 space-y-4">
            {/* Most Read Card */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  Most Read
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {mostReadNews.slice(0, 5).map((news, index) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.slug}?id=${news.id}`}
                    className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors ${
                      index < 4 ? "border-b border-border/40" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-2 hover:text-blue-600 transition-colors">
                        {news.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>Source: {news.source}</span>
                        <span>•</span>
                        <span>{news.views}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* News Sources Card - Smart Filter */}
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-2 pt-3 px-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Radio className="h-4 w-4 text-emerald-500" />
                    News Sources
                  </CardTitle>
                  <Badge variant="outline" className="text-xs h-5 px-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    {newsSources.length} sources
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-3 px-3 pb-3">
                {/* Selected Source Display */}
                {selectedSource && (
                  <div className="mb-3 p-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          {selectedSource}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSource(null)}
                        className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Search Sources */}
                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search sources..."
                    value={sourceSearchQuery}
                    onChange={(e) => setSourceSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-xs rounded-lg"
                  />
                  {sourceSearchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSourceSearchQuery("")}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  <Button
                    variant={selectedSource === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSource(null)}
                    className={cn(
                      "h-7 text-[10px] rounded-md flex-col gap-0 py-1",
                      selectedSource === null && "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0"
                    )}
                  >
                    <span className="font-semibold">All</span>
                    <span className="text-[9px] opacity-80">{newsSources.length} sources</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourceSearchQuery("Ocean Freight")}
                    className="h-7 text-[10px] rounded-md flex-col gap-0 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <span className="font-semibold text-blue-600">Ocean</span>
                    <span className="text-[9px] opacity-60">Maritime</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourceSearchQuery("Logistics")}
                    className="h-7 text-[10px] rounded-md flex-col gap-0 py-1 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                  >
                    <span className="font-semibold text-orange-600">Logistics</span>
                    <span className="text-[9px] opacity-60">Transport</span>
                  </Button>
                </div>

                {/* Sources by Region */}
                <ScrollArea className="h-[280px] pr-1">
                  <div className="space-y-2">
                    {(['global', 'asia-pacific', 'europe', 'americas', 'middle-east', 'africa'] as NewsRegion[]).map((region) => {
                      const sources = sourcesByRegion[region];
                      if (sources.length === 0) return null;

                      const regionConfig = getRegionConfig(region);
                      const regionName = sourceRegions.find(r => r.id === region)?.name || region;
                      const isExpanded = expandedRegions.includes(region);

                      return (
                        <Collapsible
                          key={region}
                          open={isExpanded}
                          onOpenChange={() => toggleRegion(region)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between h-8 px-2 hover:bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <span>{regionConfig.icon}</span>
                                <span className="text-xs font-medium">{regionName}</span>
                                <Badge 
                                  variant="outline" 
                                  className="h-4 px-1.5 text-[9px]"
                                >
                                  {sources.length}
                                </Badge>
                              </div>
                              <ChevronDown className={cn(
                                "h-3.5 w-3.5 transition-transform",
                                isExpanded && "rotate-180"
                              )} />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-1.5">
                            <div className="space-y-1">
                              {sources.map((source) => {
                                const isActive = selectedSource === source.name;
                                const articleCount = sourceCounts[source.name] || 0;

                                return (
                                  <Button
                                    key={source.id}
                                    variant={isActive ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                      setSelectedSource(isActive ? null : source.name);
                                      setSourceFilterOpen(false);
                                    }}
                                    className={cn(
                                      "w-full justify-between h-8 px-2.5 rounded-lg text-xs group transition-all",
                                      isActive 
                                        ? `bg-gradient-to-r ${regionConfig.gradient} text-white shadow-md` 
                                        : "hover:bg-muted/50"
                                    )}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="truncate font-medium">{source.name}</span>
                                      {source.priority === 'high' && !isActive && (
                                        <Star className="h-3 w-3 text-amber-500 flex-shrink-0" />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {articleCount > 0 && (
                                        <Badge 
                                          variant="outline" 
                                          className={cn(
                                            "h-4 px-1 text-[9px]",
                                            isActive && "bg-white/20 text-white border-white/30"
                                          )}
                                        >
                                          {articleCount}
                                        </Badge>
                                      )}
                                      <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        source.priority === 'high' && "bg-amber-400",
                                        source.priority === 'medium' && "bg-blue-400",
                                        source.priority === 'low' && "bg-gray-400",
                                        isActive && "bg-white/60"
                                      )} />
                                    </div>
                                  </Button>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Legend */}
                <div className="mt-3 pt-2 border-t border-border/40">
                  <p className="text-[9px] text-muted-foreground mb-1.5">Priority Level</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500" />
                      <span className="text-[9px]">High</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-[9px]">Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="text-[9px]">Low</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Mobile Category Filter */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/40 p-3 z-40">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {newsCategories.slice(0, 6).map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            const count = categoryCounts[cat.name] || 0;

            return (
              <Button
                key={cat.name}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.name)}
                className={cn(
                  "rounded-full gap-1 flex-shrink-0",
                  isSelected && "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs">{cat.name}</span>
                <Badge variant="outline" className={cn("text-xs h-4 px-1", isSelected && "bg-white/20 text-white border-white/30")}>
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Newsletter CTA */}
      <section className="border-t border-border/40 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5 mb-16 lg:mb-0">
        <div className="container mx-auto px-4 py-10">
          <motion.div
            className="text-center max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Get Daily Trade Alerts</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to receive breaking news and industry updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="h-10 rounded-lg flex-1 text-sm" />
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white h-10 px-5 rounded-lg gap-2 text-sm">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
