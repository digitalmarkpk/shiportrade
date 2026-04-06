'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  Tag,
  ArrowRightLeft,
  TrendingUp,
  Clock,
  X,
  ChevronRight,
  BookOpen,
  Layers,
  Globe,
  Sparkles,
  Copy,
  Check,
  HelpCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  FileText,
  Shield,
  Calculator,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  hsCodes,
  hsChapters,
  searchHSCodes,
  getHSCodesByChapter,
  getHSChapter,
  totalHSCodes,
  totalHSChapters,
  type HSCode,
  type HSChapter,
} from '@/lib/constants/hs-codes';

// Brand colors
const OCEAN_BLUE = '#0F4C81';
const LOGISTICS_GREEN = '#2E8B57';

// Popular search terms for quick access
const popularSearches = [
  { term: 'rice', icon: '🍚' },
  { term: 'wheat', icon: '🌾' },
  { term: 'sugar', icon: '🍬' },
  { term: 'cotton', icon: '👕' },
  { term: 'steel', icon: '🔩' },
  { term: 'plastic', icon: '🧴' },
  { term: 'machinery', icon: '⚙️' },
  { term: 'electronics', icon: '🔌' },
  { term: 'clothing', icon: '👔' },
  { term: 'oil', icon: '🛢️' },
  { term: 'coffee', icon: '☕' },
  { term: 'tea', icon: '🍵' },
];

// Interface for recent search item
interface RecentSearch {
  query: string;
  type: 'code' | 'commodity';
  timestamp: number;
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.03 } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

// Badge animation
const badgeVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.05 },
};

// Chapter distribution data for visualization
const chapterDistribution = [
  { name: 'Animal & Dairy', count: 580, color: OCEAN_BLUE },
  { name: 'Vegetable', count: 720, color: LOGISTICS_GREEN },
  { name: 'Chemicals', count: 1450, color: '#8B5CF6' },
  { name: 'Plastics & Rubber', count: 523, color: '#F59E0B' },
  { name: 'Textiles', count: 987, color: '#EC4899' },
  { name: 'Metals', count: 1567, color: '#6366F1' },
  { name: 'Machinery', count: 1656, color: '#14B8A6' },
  { name: 'Other', count: 854, color: '#64748B' },
];

// Search trend data
const searchTrends = [
  { month: 'Jan', searches: 1250, codes: 890 },
  { month: 'Feb', searches: 1380, codes: 920 },
  { month: 'Mar', searches: 1520, codes: 1050 },
  { month: 'Apr', searches: 1680, codes: 1120 },
  { month: 'May', searches: 1890, codes: 1280 },
  { month: 'Jun', searches: 2100, codes: 1450 },
];

// Top searched codes
const topSearchedCodes = [
  { code: '1006', name: 'Rice', searches: 4520, growth: 12 },
  { code: '2701', name: 'Coal', searches: 3890, growth: 8 },
  { code: '8471', name: 'Computers', searches: 3450, growth: 15 },
  { code: '8517', name: 'Telephones', searches: 3120, growth: 22 },
  { code: '8703', name: 'Motor Cars', searches: 2980, growth: 5 },
  { code: '3901', name: 'Polymers', searches: 2750, growth: 18 },
];

// FAQ data
const faqData = [
  {
    question: 'What is an HS Code and why is it important?',
    answer: 'An HS Code (Harmonized System Code) is a standardized numerical method of classifying traded products. It is used by customs authorities worldwide to identify products for assessing duties and taxes, collecting statistics, and enforcing trade regulations. The HS Code system is maintained by the World Customs Organization (WCO) and is used by over 200 countries. Understanding and correctly classifying your products under the appropriate HS Code is crucial for ensuring compliance with import/export regulations, calculating accurate duty rates, avoiding penalties for misclassification, and facilitating smooth customs clearance processes.',
  },
  {
    question: 'How do I find the correct HS Code for my product?',
    answer: 'Finding the correct HS Code requires a systematic approach. Start by identifying the main material or component of your product, then determine its function or intended use. Browse through the 97 HS chapters to find the most relevant section, and narrow down to the specific heading (first 4 digits) and subheading (6 digits). Consider factors such as the product composition, manufacturing process, and end use. If uncertain, consult with a licensed customs broker, review official tariff schedules, or request a binding ruling from your local customs authority. Remember that some countries may have additional digits beyond the international 6-digit standard for further classification specificity.',
  },
  {
    question: 'What is the difference between HS Code, HTS, and Schedule B?',
    answer: 'While these terms are often used interchangeably, they have distinct meanings. The HS Code (Harmonized System Code) is the international 6-digit standard maintained by the WCO and used globally for product classification. The HTS (Harmonized Tariff Schedule) is the US-specific extension of the HS Code, typically 10 digits, used for imports into the United States and administered by US Customs and Border Protection. Schedule B is another US-specific classification system, also 10 digits, used for exports from the United States and maintained by the US Census Bureau. The first 6 digits of all three systems should be identical, with additional digits providing country-specific classification detail.',
  },
  {
    question: 'How often do HS Codes change?',
    answer: 'HS Codes are reviewed and updated by the World Customs Organization approximately every 5 years to reflect changes in technology, trade patterns, and product innovations. Major revisions occurred in 1996, 2002, 2007, 2012, 2017, and most recently in 2022. These updates may introduce new codes for emerging products, delete obsolete codes, merge or split existing codes, or amend code descriptions. Between major revisions, the WCO may issue classification opinions and amendments to address specific issues. It is essential to stay current with HS Code changes as they can affect duty rates, trade agreements, and regulatory requirements for your products.',
  },
  {
    question: 'Can a product have multiple HS Codes?',
    answer: 'Generally, each product should have only one correct HS Code for customs purposes. However, there are scenarios where multiple classifications might seem applicable. Composite goods, sets, and products with multiple functions require careful analysis using General Interpretative Rules (GIRs) to determine the primary classification. Components may have separate codes from finished products. The same product may also be classified differently in different countries due to national tariff extensions beyond the 6-digit level. If you believe multiple codes apply, consult with customs experts and consider requesting a binding ruling to ensure consistent treatment across shipments.',
  },
  {
    question: 'What are the consequences of HS Code misclassification?',
    answer: 'HS Code misclassification can lead to significant consequences including underpayment or overpayment of duties, penalties and fines from customs authorities, delays in customs clearance, potential seizure of goods, loss of import privileges, and audits that may extend to previous shipments. Underpayment may result in back duties, interest, and penalties that can reach several times the duty amount. Overpayment results in lost revenue that may be recoverable through protest procedures but takes time and resources. Misclassification can also affect eligibility for preferential trade programs, drawback claims, and trade statistics accuracy. Establishing robust classification procedures and seeking expert guidance helps mitigate these risks.',
  },
];

export function SmartHSCodeSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<HSCode | null>(null);
  const [activeTab, setActiveTab] = useState('search');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load recent searches from localStorage - using lazy initialization
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('hs-code-recent-searches');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // ignore parse errors
      }
    }
    return [];
  });

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((query: string, type: 'code' | 'commodity') => {
    const newSearch: RecentSearch = { query, type, timestamp: Date.now() };
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.query.toLowerCase() !== query.toLowerCase());
      const updated = [newSearch, ...filtered].slice(0, 10);
      localStorage.setItem('hs-code-recent-searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Debounce search query
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (searchQuery.trim()) {
        setShowSuggestions(true);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Detect search type (code or commodity)
  const searchType = useMemo(() => {
    const cleaned = searchQuery.replace(/[\s.-]/g, '');
    return /^\d+$/.test(cleaned) ? 'code' : 'commodity';
  }, [searchQuery]);

  // Search results with autocomplete
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return searchHSCodes(debouncedQuery, 50);
  }, [debouncedQuery]);

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!debouncedQuery.trim() || !showSuggestions) return [];
    const query = debouncedQuery.toLowerCase();

    // If it's a code search, suggest matching codes
    if (searchType === 'code') {
      return hsCodes
        .filter((c) => c.code.startsWith(query.replace(/\D/g, '')))
        .slice(0, 8);
    }

    // If commodity search, suggest from keywords and descriptions
    return hsCodes
      .filter((c) => {
        const descMatch = c.description.toLowerCase().includes(query);
        const keywordMatch = c.keywords?.some((k) => k.toLowerCase().includes(query));
        return descMatch || keywordMatch;
      })
      .slice(0, 8);
  }, [debouncedQuery, searchType, showSuggestions]);

  // Copy to clipboard
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // ignore copy errors
    }
  };

  // Handle search submit
  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim(), searchType);
      setShowSuggestions(false);
      if (searchResults.length > 0) {
        setSelectedResult(searchResults[0]);
        setActiveTab('results');
      }
    }
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('hs-code-recent-searches');
  };

  // Handle suggestion click
  const handleSuggestionClick = (code: HSCode) => {
    setSearchQuery(code.code);
    setSelectedResult(code);
    saveRecentSearch(code.code, 'code');
    setShowSuggestions(false);
    setActiveTab('results');
  };

  // Render result card
  const renderResultCard = (code: HSCode, index: number, isCompact = false) => (
    <motion.div
      key={code.code}
      variants={scaleIn}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.02 }}
      onClick={() => {
        setSelectedResult(code);
        setActiveTab('results');
      }}
      className={`cursor-pointer ${selectedResult?.code === code.code ? 'ring-2 ring-[#0F4C81]' : ''}`}
    >
      <Card className="hover:shadow-lg transition-all hover:border-[#0F4C81]/50 group">
        <CardContent className={isCompact ? 'p-3' : 'p-5'}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent font-mono">
                  {code.code}
                </span>
                <Badge variant="outline" className="text-xs">
                  Ch. {code.chapter}
                </Badge>
                {code.unit && (
                  <Badge className="bg-[#2E8B57]/20 text-[#2E8B57] dark:bg-[#2E8B57]/30 dark:text-[#2E8B57] text-xs">
                    {code.unit}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(code.code);
                  }}
                >
                  {copiedCode === code.code ? (
                    <Check className="h-3 w-3 text-[#2E8B57]" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <p className="text-foreground font-medium">{code.description}</p>

              {!isCompact && code.keywords && code.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {code.keywords.slice(0, 5).map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Render chapter card
  const renderChapterCard = (chapter: HSChapter) => (
    <motion.div
      key={chapter.chapter}
      variants={scaleIn}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={() => {
        setSearchQuery(chapter.chapter);
      }}
    >
      <Card className="h-full hover:shadow-xl transition-all overflow-hidden group border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50">
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${chapter.color}`} />
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{chapter.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-foreground">Chapter {chapter.chapter}</span>
                <Badge variant="secondary" className="text-xs">
                  {chapter.codeCount} codes
                </Badge>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-[#0F4C81] transition-colors">
                {chapter.name}
              </h3>
              <Badge variant="outline" className="text-xs font-mono">
                {chapter.codeRange}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] p-8 text-white"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          {/* Animated Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ duration: 0.3 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-sm gap-2">
                <Zap className="h-4 w-4" />
                AI-Powered Search
              </Badge>
            </motion.div>
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-sm gap-2">
                <Shield className="h-4 w-4" />
                Customs Compliant
              </Badge>
            </motion.div>
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-sm gap-2">
                <Globe className="h-4 w-4" />
                WCO Standard 2022
              </Badge>
            </motion.div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Smart HS Code Search
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-6">
            Instantly find the correct Harmonized System code for your products with our intelligent search engine. 
            Access comprehensive customs classification data for over {totalHSCodes.toLocaleString()} products across {totalHSChapters} chapters.
          </p>

          {/* Quick Search in Hero */}
          <div className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
              <Input
                placeholder="Search by code or product name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedResult(null);
                }}
                onKeyDown={handleKeyDown}
                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg backdrop-blur-sm focus:bg-white/20"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-14 px-8 bg-white text-[#0F4C81] hover:bg-white/90 font-semibold"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white border-0">
          <CardContent className="pt-4 pb-3 text-center">
            <div className="text-3xl font-bold">{totalHSChapters}</div>
            <div className="text-sm opacity-90">Chapters</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white border-0">
          <CardContent className="pt-4 pb-3 text-center">
            <div className="text-3xl font-bold">{totalHSCodes.toLocaleString()}</div>
            <div className="text-sm opacity-90">HS Codes</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="pt-4 pb-3 text-center">
            <div className="text-3xl font-bold">97</div>
            <div className="text-sm opacity-90">Categories</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
          <CardContent className="pt-4 pb-3 text-center">
            <div className="text-3xl font-bold">WCO</div>
            <div className="text-sm opacity-90">Standard</div>
          </CardContent>
        </Card>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-14">
          <TabsTrigger value="search" className="gap-2 text-sm">
            <Search className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2 text-sm">
            <FileText className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2 text-sm">
            <BookOpen className="h-4 w-4" />
            Guide
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2 text-sm">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="mt-6 space-y-6">
          {/* Main Search Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-lg">
                  <Search className="h-5 w-5 text-white" />
                </div>
                Smart HS Code Lookup
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                Enter HS Code to find commodity, or enter commodity name to find HS Code
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search Input with Autocomplete */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter HS code (e.g., 1006) or commodity (e.g., rice, steel, cotton)"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedResult(null);
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="pl-10 h-12 text-base"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedResult(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="h-12 px-6 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:from-[#0F4C81]/90 hover:to-[#2E8B57]/90 text-white"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Search Type Indicator */}
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-2"
                  >
                    <Badge
                      variant={searchType === 'code' ? 'default' : 'secondary'}
                      className="gap-1"
                      style={searchType === 'code' ? { backgroundColor: OCEAN_BLUE } : {}}
                    >
                      {searchType === 'code' ? (
                        <>
                          <Tag className="h-3 w-3" />
                          Searching by HS Code
                        </>
                      ) : (
                        <>
                          <Package className="h-3 w-3" />
                          Searching by Commodity
                        </>
                      )}
                    </Badge>
                  </motion.div>
                )}

                {/* Autocomplete Suggestions */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-gray-900 border rounded-lg shadow-xl overflow-hidden"
                    >
                      <ScrollArea className="max-h-80">
                        {suggestions.map((code) => (
                          <div
                            key={code.code}
                            className="p-3 hover:bg-[#0F4C81]/10 dark:hover:bg-[#0F4C81]/20 cursor-pointer border-b last:border-0 flex items-center justify-between"
                            onClick={() => handleSuggestionClick(code)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-[#0F4C81]">{code.code}</span>
                              <span className="text-sm text-muted-foreground line-clamp-1">
                                {code.description}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Ch. {code.chapter}
                            </Badge>
                          </div>
                        ))}
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Popular Searches & Recent Searches */}
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                {/* Popular Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((item) => (
                      <Button
                        key={item.term}
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(item.term);
                          saveRecentSearch(item.term, 'commodity');
                        }}
                        className="gap-1.5"
                      >
                        <span>{item.icon}</span>
                        {item.term}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#0F4C81]" />
                        <span className="text-sm font-medium">Recent Searches</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearRecentSearches}>
                        Clear
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.slice(0, 6).map((search, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery(search.query)}
                          className="gap-1.5"
                        >
                          {search.type === 'code' ? (
                            <Tag className="h-3 w-3" />
                          ) : (
                            <Package className="h-3 w-3" />
                          )}
                          {search.query}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Browse by Chapter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#0F4C81]" />
                Browse by Chapter
              </CardTitle>
              <CardDescription>
                Explore HS codes organized by classification chapter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div variants={staggerContainer} initial="initial" animate="animate">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {hsChapters.slice(0, 12).map((chapter) => renderChapterCard(chapter))}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="mt-6 space-y-6">
          <AnimatePresence mode="wait">
            {searchQuery.trim() && searchResults.length > 0 && !selectedResult && (
              <motion.div key="results" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {searchResults.length} Results for &quot;{searchQuery}&quot;
                      </CardTitle>
                      <Badge variant="secondary">WCO 2022</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-[500px]">
                      <div className="space-y-3 pr-4">
                        {searchResults.map((code, index) => renderResultCard(code, index))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {selectedResult && (
              <motion.div key="detail" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
                {/* Selected Result Detail */}
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 rounded-xl px-4 py-2">
                          <span className="text-4xl font-mono font-bold">{selectedResult.code}</span>
                        </div>
                        <div>
                          <Badge className="bg-white/20 text-white mb-2">
                            Chapter {selectedResult.chapter}
                          </Badge>
                          <p className="text-white/80 text-sm">{selectedResult.chapterName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => copyToClipboard(selectedResult.code)}
                        >
                          {copiedCode === selectedResult.code ? (
                            <>
                              <Check className="h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copy Code
                            </>
                          )}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedResult(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{selectedResult.description}</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Unit */}
                        {selectedResult.unit && (
                          <div className="p-4 bg-[#2E8B57]/10 dark:bg-[#2E8B57]/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Globe className="h-4 w-4 text-[#2E8B57]" />
                              <span className="font-medium text-sm">Standard Unit</span>
                            </div>
                            <p className="text-2xl font-bold text-[#2E8B57]">{selectedResult.unit}</p>
                          </div>
                        )}

                        {/* Keywords */}
                        {selectedResult.keywords && selectedResult.keywords.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedResult.keywords.map((kw, i) => (
                                <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery(kw)}>
                                  {kw}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Examples */}
                        {selectedResult.examples && selectedResult.examples.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Examples
                            </h4>
                            <div className="space-y-1">
                              {selectedResult.examples.map((ex, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <ChevronRight className="h-3 w-3" />
                                  {ex}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Chapter Info */}
                      <div>
                        {(() => {
                          const chapter = getHSChapter(selectedResult.chapter);
                          if (!chapter) return null;
                          return (
                            <Card className="h-full">
                              <div className={`h-2 bg-gradient-to-r ${chapter.color}`} />
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl">{chapter.icon}</span>
                                  <div>
                                    <CardTitle className="text-lg">Chapter {chapter.chapter}</CardTitle>
                                    <CardDescription>{chapter.name}</CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-3">{chapter.description}</p>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="font-mono">
                                    {chapter.codeRange}
                                  </Badge>
                                  <Badge variant="secondary">{chapter.codeCount} codes</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Codes */}
                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Other Codes in Chapter {selectedResult.chapter}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-[300px]">
                      <div className="space-y-2 pr-4">
                        {getHSCodesByChapter(selectedResult.chapter)
                          .filter((c) => c.code !== selectedResult.code)
                          .slice(0, 10)
                          .map((code, index) => renderResultCard(code, index, true))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {searchQuery.trim() && searchResults.length === 0 && (
              <motion.div key="no-results" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
                <Card className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try a different search term or browse by chapter
                  </p>
                </Card>
              </motion.div>
            )}

            {!searchQuery.trim() && !selectedResult && (
              <Card className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Enter a search term</h3>
                <p className="text-muted-foreground">
                  Search by HS code or commodity name to see results
                </p>
              </Card>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Chapter Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[#0F4C81]" />
                  HS Code Distribution by Category
                </CardTitle>
                <CardDescription>
                  Overview of HS codes across major product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chapterDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {chapterDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Searched Codes Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                  Top Searched HS Codes
                </CardTitle>
                <CardDescription>
                  Most frequently searched codes this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topSearchedCodes} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="code" type="category" width={50} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number, _name: string, props: { payload: { name: string; growth: number } }) => [
                          `${value.toLocaleString()} searches`,
                          'Searches',
                        ]}
                        labelFormatter={(_label: string, payload: { payload: { name: string; growth: number } }[]) => 
                          payload[0]?.payload?.name || ''
                        }
                      />
                      <Bar dataKey="searches" fill={OCEAN_BLUE} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Trends Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                Search Trends Over Time
              </CardTitle>
              <CardDescription>
                Monthly search volume and HS code lookups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={searchTrends}>
                    <defs>
                      <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={OCEAN_BLUE} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={OCEAN_BLUE} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorCodes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={LOGISTICS_GREEN} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={LOGISTICS_GREEN} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="searches"
                      stroke={OCEAN_BLUE}
                      fillOpacity={1}
                      fill="url(#colorSearches)"
                      name="Total Searches"
                    />
                    <Area
                      type="monotone"
                      dataKey="codes"
                      stroke={LOGISTICS_GREEN}
                      fillOpacity={1}
                      fill="url(#colorCodes)"
                      name="Codes Found"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Growth Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                Top Growing Categories
              </CardTitle>
              <CardDescription>
                HS code categories with highest search growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSearchedCodes.map((item, index) => (
                  <div key={item.code} className="flex items-center gap-4">
                    <div className="w-8 text-sm text-muted-foreground">#{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-mono font-bold text-[#0F4C81]">{item.code}</span>
                          <span className="ml-2 text-sm text-muted-foreground">{item.name}</span>
                        </div>
                        <Badge className="bg-[#2E8B57]/20 text-[#2E8B57]">
                          +{item.growth}%
                        </Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.searches / topSearchedCodes[0].searches) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] rounded-full"
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right text-sm text-muted-foreground">
                      {item.searches.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="mt-6 space-y-6">
          {/* What is HS Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#0F4C81]" />
                Understanding HS Codes
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                The Harmonized System (HS) is an internationally standardized system of names and numbers 
                for classifying traded products. Developed and maintained by the World Customs Organization 
                (WCO), this system serves as the foundation for customs tariffs and international trade 
                statistics across more than 200 countries and economies. The HS Code system was first 
                implemented in 1988 and has since undergone several revisions, with the most recent version 
                being HS 2022. The system is designed to provide a logical, hierarchical structure that 
                allows customs authorities, statisticians, and traders to classify goods consistently 
                across borders, facilitating international trade and ensuring accurate duty collection.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Each HS Code consists of a minimum of 6 digits, which represent the international 
                standard classification. The first two digits identify the chapter, the next two digits 
                identify the heading within that chapter, and the final two digits identify the subheading. 
                Many countries extend this system with additional digits for more detailed national 
                classification. For example, the United States uses a 10-digit system called the 
                Harmonized Tariff Schedule (HTS) for imports and Schedule B for exports. Understanding 
                this structure is essential for anyone involved in international trade, as correct 
                classification directly impacts duty rates, trade compliance, and customs clearance efficiency.
              </p>
            </CardContent>
          </Card>

          {/* HS Code Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#2E8B57]" />
                HS Code Structure
              </CardTitle>
              <CardDescription>
                Breaking down the components of an HS Code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20">
                  <div className="text-2xl font-bold text-[#0F4C81] mb-1">6 Digits</div>
                  <div className="text-sm text-muted-foreground mb-2">International standard</div>
                  <div className="text-xs text-muted-foreground">First 2 = Chapter, Next 2 = Heading, Last 2 = Subheading</div>
                </div>
                <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <div className="text-2xl font-bold text-purple-600 mb-1">8 Digits</div>
                  <div className="text-sm text-muted-foreground mb-2">National tariff</div>
                  <div className="text-xs text-muted-foreground">Country-specific subdivisions for import/export</div>
                </div>
                <div className="p-4 rounded-lg bg-[#2E8B57]/10 dark:bg-[#2E8B57]/20">
                  <div className="text-2xl font-bold text-[#2E8B57] mb-1">10 Digits</div>
                  <div className="text-sm text-muted-foreground mb-2">Statistical suffix</div>
                  <div className="text-xs text-muted-foreground">Used for detailed trade statistics reporting</div>
                </div>
                <div className="p-4 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <div className="text-2xl font-bold text-amber-600 mb-1">WCO</div>
                  <div className="text-sm text-muted-foreground mb-2">Standard body</div>
                  <div className="text-xs text-muted-foreground">World Customs Organization maintains the HS system</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classification Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#0F4C81]" />
                Classification Process
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Properly classifying goods under the HS system requires a systematic approach that 
                considers multiple factors. The first step is to identify the essential character 
                of the product - what is it made of, what is its primary function, and how is it 
                used? Next, consult the General Interpretative Rules (GIRs) which provide guidance 
                for classifying complex products, sets, and mixtures. The GIRs establish a 
                hierarchical approach to classification when multiple headings might apply to a 
                single product. Understanding these rules is crucial for accurate classification 
                and can significantly impact duty rates and regulatory requirements.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                After identifying the potential headings, examine the chapter notes and section 
                notes which may provide specific guidance or exclusions for certain products. 
                These notes can override general classification principles and are essential for 
                correct classification. If uncertainty remains after consulting these resources, 
                consider seeking a binding ruling from the relevant customs authority. A binding 
                ruling provides legal certainty regarding the classification of your product and 
                protects you from potential penalties or disputes. Many countries offer online 
                ruling databases where you can research similar products that have received 
                classification rulings.
              </p>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#2E8B57]" />
                Classification Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-[#2E8B57]/30 bg-[#2E8B57]/5">
                  <h4 className="font-semibold text-[#2E8B57] mb-2">Do&apos;s</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#2E8B57] mt-0.5" />
                      <span>Research similar products in official databases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#2E8B57] mt-0.5" />
                      <span>Consult chapter and section notes carefully</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#2E8B57] mt-0.5" />
                      <span>Request binding rulings for uncertain classifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#2E8B57] mt-0.5" />
                      <span>Document your classification rationale</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#2E8B57] mt-0.5" />
                      <span>Stay updated on HS code changes</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                  <h4 className="font-semibold text-red-600 mb-2">Don&apos;ts</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Assume old classifications remain valid</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Ignore country-specific requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Copy classifications from competitors blindly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Overlook product modifications or updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Neglect to review classification periodically</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapter Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#0F4C81]" />
                Quick Chapter Reference
              </CardTitle>
              <CardDescription>
                Overview of HS chapters and their coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="grid sm:grid-cols-2 gap-2 pr-4">
                  {hsChapters.map((chapter) => (
                    <div
                      key={chapter.chapter}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSearchQuery(chapter.chapter);
                        setActiveTab('search');
                      }}
                    >
                      <span className="text-lg">{chapter.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#0F4C81]">
                            {chapter.chapter}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {chapter.name}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {chapter.codeCount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about HS codes and classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium hover:text-[#0F4C81]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 border-[#0F4C81]/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[#0F4C81]/10">
                  <AlertCircle className="h-6 w-6 text-[#0F4C81]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Need More Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you can&apos;t find the answer to your question, our team of customs classification 
                    experts is here to help. We can provide guidance on complex classification scenarios, 
                    binding ruling requests, and compliance strategies.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                      Contact Support
                    </Button>
                    <Button variant="outline">
                      View Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#2E8B57]" />
                Pro Tips for HS Code Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Search className="h-4 w-4 text-[#0F4C81]" />
                    Use Specific Keywords
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Instead of searching for general terms like &quot;metal,&quot; try specific terms like 
                    &quot;stainless steel pipe&quot; or &quot;aluminum extrusion&quot; for more accurate results.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#2E8B57]" />
                    Know the Code Structure
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The first 2 digits indicate the chapter. If you know the chapter, you can narrow 
                    down your search significantly by including it in your query.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#0F4C81]" />
                    Consider Product Use
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Some products may fall under multiple classifications. Consider the primary 
                    function and material composition to determine the most appropriate code.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#2E8B57]" />
                    Check Country Variations
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Remember that the 6-digit code is international, but individual countries may 
                    have extended codes. Always verify with the destination country&apos;s customs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
