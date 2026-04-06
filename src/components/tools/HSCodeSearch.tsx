"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Tag,
  FileText,
  Globe,
  ChevronRight,
  BookOpen,
  Layers,
  Package,
  ArrowLeft,
  Filter,
  RotateCcw,
  Download,
  Share2,
  BarChart3,
  HelpCircle,
  Zap,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  Lightbulb,
  Scale,
  Database,
  Hash,
  Info,
  Clock,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area,
} from "recharts";
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
} from "@/lib/constants/hs-codes";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

// FAQ Data
const FAQS = [
  {
    question: "What is an HS Code and why is it important?",
    answer: "An HS Code (Harmonized System Code) is an internationally standardized system of names and numbers to classify traded products. Developed and maintained by the World Customs Organization (WCO), HS codes are used by customs authorities worldwide to identify products for assessing duties and taxes, collecting international trade statistics, and enforcing trade regulations. The HS system covers more than 98% of world trade, with over 200 countries using it as the basis for their customs tariffs. Proper classification is essential because it determines the duty rate, import restrictions, and documentation requirements for your goods.",
  },
  {
    question: "How are HS codes structured and what do the digits mean?",
    answer: "HS codes are hierarchical with varying levels of detail: The first 2 digits identify the Chapter (e.g., Chapter 84 for machinery), representing broad product categories. The first 4 digits form the Heading, providing more specific product identification. The first 6 digits constitute the Subheading, which is the international standard recognized by all WCO member countries. Countries may add additional digits for national tariff purposes - 8 digits are common for national tariffs, and 10+ digits may be used for statistical or administrative purposes. For example, HS code 8471.30.00 breaks down as: Chapter 84 (Machinery), Heading 8471 (Automatic data processing machines), Subheading 8471.30 (Portable digital computers).",
  },
  {
    question: "What is the difference between HS codes and HTS codes?",
    answer: "While often used interchangeably, there is a distinction: HS Code (Harmonized System) refers to the international 6-digit standard maintained by the WCO. All countries use the same 6-digit codes for customs classification. HTS Code (Harmonized Tariff Schedule) is the national extension of the HS system. In the United States, HTS codes are 10 digits long, with the first 6 digits matching the international HS standard and the remaining 4 digits providing US-specific classification. Similarly, other countries have their own extensions - the EU uses 8-digit CN (Combined Nomenclature) codes, China uses 10-digit codes, etc. When trading internationally, always verify the specific code requirements for both the exporting and importing countries.",
  },
  {
    question: "How do I correctly classify my products using HS codes?",
    answer: "Correct HS classification follows a systematic approach: First, identify the essential character of your product - what is it made of, what is its function, and how is it used? Start by reviewing the Section and Chapter Notes in the HS nomenclature, as these provide critical classification rules. Use the General Interpretative Rules (GIRs) which establish the order of precedence when products could fall under multiple headings. Consider the following in order: the product's name, composition, function, and manufacturing process. Utilize official resources like the WCO HS Online, national customs databases, or binding ruling services offered by customs authorities. For complex products, consider requesting a Binding Ruling from your customs authority, which provides a legally binding classification decision before importation. Keep detailed records of your classification rationale for audit purposes.",
  },
  {
    question: "What are the most common HS code classification mistakes?",
    answer: "Common classification errors include: Misapplying the General Interpretative Rules (GIRs), particularly GIR 3 which deals with goods classifiable under multiple headings. Ignoring Chapter Notes and Section Notes that can override apparent classifications. Classifying based on product name alone without considering composition or function. Using outdated HS codes - the HS system is updated every 5 years (HS 2017, HS 2022, etc.). Copying supplier-provided codes without verification, which can lead to errors in duty payments. Over-looking conditionally free provisions or special duty rates that might apply. Not considering the country of origin impact on classification for preferential duty rates. Failing to account for product variations or sets that require special classification treatment. Always verify classifications with official sources and consider consulting a licensed customs broker for complex products.",
  },
  {
    question: "Where can I find official HS codes for my products?",
    answer: "Official sources for HS code research include: The World Customs Organization (WCO) HS Online database, which provides the authoritative 6-digit international HS nomenclature. National customs authority websites - for US imports, use the official HTS search at hts.usitc.gov; for EU trade, use the TARIC database; for other countries, consult their respective customs authorities. Trade associations and industry groups often publish classification guides for specific product categories. Commercial databases like Integration Point, Descartes, or Thomson Reuters ONESOURCE provide advanced search and classification tools. For definitive classification, request a Binding Ruling from your customs authority - in the US, this is done through the Customs Rulings Online Search System (CROSS). Always cross-reference multiple sources and document your classification methodology for compliance purposes.",
  },
  {
    question: "How often do HS codes change and how do I stay updated?",
    answer: "The Harmonized System undergoes major revisions every 5 years, with the most recent being HS 2022 (effective January 1, 2022). These updates reflect changes in technology, trade patterns, and environmental/social policy priorities. The WCO also issues Corrigenda and Council Recommendations between major editions for urgent corrections. National tariff codes may be updated more frequently to reflect trade agreements or policy changes. To stay current: Subscribe to WCO publications and customs authority newsletters; Use classification software that maintains current code databases; Monitor announcements from your national customs authority; Work with a licensed customs broker or trade compliance professional; Schedule periodic reviews of your product classifications, especially for products that may be affected by HS updates. Major HS updates typically provide transition periods, but proactive planning is essential for smooth customs operations.",
  },
];

// Pro Tips
const PRO_TIPS = [
  {
    title: "Start with Chapter Notes",
    description: "Always read the Chapter and Section Notes before classifying. They can override apparent classifications and clarify scope.",
    icon: BookOpen,
  },
  {
    title: "Use GIRs Systematically",
    description: "Apply the General Interpretative Rules in order. GIR 1 is always the starting point, and GIR 3 handles goods fitting multiple headings.",
    icon: Scale,
  },
  {
    title: "Request Binding Rulings",
    description: "For complex products or high-value shipments, get a binding ruling from customs. It provides legal certainty and protects against penalties.",
    icon: FileText,
  },
  {
    title: "Document Your Logic",
    description: "Keep detailed records of your classification rationale. This documentation is invaluable during customs audits and disputes.",
    icon: Database,
  },
  {
    title: "Check for Trade Agreements",
    description: "Even with the same HS code, preferential duties may apply under FTAs. Always verify origin requirements for potential savings.",
    icon: Globe,
  },
];

// Recent searches storage (in-memory)
const recentSearches: string[] = [];
const popularSearches = [
  { term: "electronics", count: 2847 },
  { term: "machinery", count: 2341 },
  { term: "textiles", count: 1987 },
  { term: "plastics", count: 1756 },
  { term: "chemicals", count: 1534 },
  { term: "vehicles", count: 1489 },
  { term: "steel", count: 1324 },
  { term: "food products", count: 1245 },
];

// Chart colors
const CHART_COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  accent: "#F59E0B",
  muted: "#94A3B8",
};

export function HSCodeSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("search");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchHSCodes(searchQuery, 100);
  }, [searchQuery]);

  // Chapter codes
  const chapterCodes = useMemo(() => {
    if (!selectedChapter) return [];
    return getHSCodesByChapter(selectedChapter);
  }, [selectedChapter]);

  // Chart data - Search results distribution by chapter
  const chapterDistributionData = useMemo(() => {
    if (!searchResults.length) return [];
    const chapterCounts: Record<string, number> = {};
    searchResults.forEach((code) => {
      chapterCounts[code.chapter] = (chapterCounts[code.chapter] || 0) + 1;
    });
    return Object.entries(chapterCounts)
      .map(([chapter, count]) => {
        const chapterInfo = getHSChapter(chapter);
        return {
          name: `Ch. ${chapter}`,
          fullName: chapterInfo?.name || `Chapter ${chapter}`,
          count,
          color: chapterInfo?.color || "from-gray-500 to-gray-600",
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [searchResults]);

  // Chart data - Duty rates by category
  const dutyRatesData = useMemo(() => {
    const categories = [
      { name: "Electronics", avgRate: 2.5, range: "0-8%" },
      { name: "Machinery", avgRate: 3.2, range: "0-12%" },
      { name: "Textiles", avgRate: 8.5, range: "2-25%" },
      { name: "Chemicals", avgRate: 4.8, range: "0-15%" },
      { name: "Food", avgRate: 12.3, range: "5-35%" },
      { name: "Steel", avgRate: 6.2, range: "0-25%" },
      { name: "Vehicles", avgRate: 5.5, range: "0-10%" },
      { name: "Plastics", avgRate: 4.1, range: "0-12%" },
    ];
    return categories;
  }, []);

  // Chart data - Chapter sizes
  const chapterSizeData = useMemo(() => {
    return hsChapters.slice(0, 15).map((ch) => ({
      name: `Ch. ${ch.chapter}`,
      codeCount: ch.codeCount,
      fullName: ch.name,
    }));
  }, []);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setHasSearched(true);
      setSelectedChapter(null);
      // Add to recent searches
      if (!recentSearches.includes(searchQuery.trim())) {
        recentSearches.unshift(searchQuery.trim());
        if (recentSearches.length > 10) recentSearches.pop();
      }
    }
  }, [searchQuery]);

  const handleChapterClick = useCallback((chapter: string) => {
    setSelectedChapter(chapter);
    setHasSearched(false);
    setSearchQuery("");
  }, []);

  const handleBack = useCallback(() => {
    setSelectedChapter(null);
    setHasSearched(false);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchQuery("");
    setHasSearched(false);
    setSelectedChapter(null);
  }, []);

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  // Render HS Code Card
  const renderHSCodeCard = (code: HSCode, index: number) => (
    <motion.div
      key={code.code}
      variants={scaleIn}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.02 }}
    >
      <Card className="hover:shadow-lg transition-all hover:border-[var(--ocean)]/50 group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => handleCopy(code.code)}
                  className="text-2xl font-bold bg-gradient-to-r from-[var(--ocean)] to-cyan-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-1"
                >
                  {code.code}
                  {copiedCode === code.code ? (
                    <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
                <Badge variant="outline" className="text-xs">
                  Ch. {code.chapter}
                </Badge>
                {code.unit && (
                  <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)] dark:bg-[var(--logistics)]/20 dark:text-[var(--logistics)] text-xs">
                    {code.unit}
                  </Badge>
                )}
                {code.dutyRate && (
                  <Badge variant="secondary" className="text-xs">
                    Duty: {code.dutyRate}
                  </Badge>
                )}
              </div>
              <p className="text-foreground mb-3 font-medium">{code.description}</p>

              {code.keywords && code.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {code.keywords.slice(0, 5).map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {code.examples && code.examples.length > 0 && (
                <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Examples:</p>
                  <p className="text-sm text-foreground">{code.examples.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Render Chapter Card
  const renderChapterCard = (chapter: HSChapter) => (
    <motion.div
      key={chapter.chapter}
      variants={scaleIn}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={() => handleChapterClick(chapter.chapter)}
    >
      <Card className="h-full hover:shadow-xl transition-all overflow-hidden group border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50">
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${chapter.color}`} />
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{chapter.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-foreground">
                  Chapter {chapter.chapter}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {chapter.codeCount} codes
                </Badge>
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-[var(--ocean)] transition-colors">
                {chapter.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {chapter.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs font-mono">
                  {chapter.codeRange}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-[var(--ocean)] text-white">
                  <Scale className="h-3 w-3 mr-1" />
                  Customs & Compliance
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                  <Zap className="h-3 w-3 mr-1" />
                  Trade Tools
                </Badge>
              </motion.div>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl lg:text-3xl font-bold tracking-tight"
            >
              HS Code Search & Classification
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground max-w-2xl"
            >
              Search the Harmonized System database for accurate product classification. Find duty rates,
              explore chapters, and ensure compliance with international trade regulations.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2"
          >
            <Button variant="outline" size="sm" onClick={resetSearch}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[var(--ocean)] to-cyan-600 text-white border-0">
          <CardContent className="pt-4 pb-3 text-center">
            <div className="text-3xl font-bold">{totalHSChapters}</div>
            <div className="text-sm opacity-90">Chapters</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="pt-4 pb-3 text-center">
            <div className="text-3xl font-bold">{totalHSCodes.toLocaleString()}+</div>
            <div className="text-sm opacity-90">HS Codes</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[var(--logistics)] to-teal-600 text-white border-0">
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

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Browse</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          {/* Search Box */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Search className="h-5 w-5 text-[var(--ocean)]" />
                HS Code Search
              </CardTitle>
              <CardDescription>
                Search by HS code number or product description. Powered by WCO Harmonized System 2022.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter HS code (e.g., 8471) or product name (e.g., laptop, smartphone, coffee)"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim()) {
                        setHasSearched(true);
                      }
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-6 bg-gradient-to-r from-[var(--ocean)] to-cyan-600 hover:from-[var(--ocean)]/90 hover:to-cyan-600/90 text-white"
                >
                  Search
                </Button>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Popular searches:</span>
                {["rice", "wheat", "sugar", "oil", "cotton", "steel", "plastic", "machinery"].map(
                  (term) => (
                    <Button
                      key={term}
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(term);
                        setHasSearched(true);
                      }}
                      className="h-7"
                    >
                      {term}
                    </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          <AnimatePresence mode="wait">
            {hasSearched && searchQuery.trim() && (
              <motion.div
                key="search-results"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
                    {searchResults.length >= 100 && " (showing first 100)"}
                  </h3>
                  <Badge variant="secondary" className="gap-1">
                    <Tag className="h-3 w-3" />
                    WCO 2022
                  </Badge>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {searchResults.map((code, index) => renderHSCodeCard(code, index))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground">
                      Try a different search term or browse by chapter
                    </p>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Initial State - Popular Chapters */}
          {!hasSearched && !searchQuery.trim() && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--ocean)]" />
                Popular Chapters
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["84", "85", "87", "39", "72", "90"].map((ch) => {
                  const chapter = getHSChapter(ch);
                  return chapter ? renderChapterCard(chapter) : null;
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {selectedChapter ? (
            // Show codes for selected chapter
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Chapters
                </Button>
              </div>

              {(() => {
                const chapter = getHSChapter(selectedChapter);
                if (!chapter) return null;

                return (
                  <>
                    <Card className="overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${chapter.color}`} />
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">{chapter.icon}</span>
                          <div>
                            <CardTitle className="text-2xl">
                              Chapter {chapter.chapter}: {chapter.name}
                            </CardTitle>
                            <CardDescription className="text-base mt-1">
                              {chapter.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <Badge variant="outline" className="font-mono">
                            {chapter.codeRange}
                          </Badge>
                          <Badge variant="secondary">{chapter.codeCount} codes in database</Badge>
                        </div>
                      </CardHeader>
                    </Card>

                    <h3 className="font-semibold text-lg">
                      HS Codes in this Chapter ({chapterCodes.length} shown)
                    </h3>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {chapterCodes.map((code, index) => renderHSCodeCard(code, index))}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          ) : (
            // Show all chapters
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  All {totalHSChapters} HS Chapters
                </h3>
                <Badge variant="outline">Click to browse</Badge>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {hsChapters.map((chapter) => renderChapterCard(chapter))}
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Search Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                  Popular Search Queries
                </CardTitle>
                <CardDescription>Most searched terms in HS code database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={popularSearches} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="term" type="category" width={80} />
                      <Tooltip formatter={(value: number) => [`${value} searches`, "Count"]} />
                      <Bar dataKey="count" name="Searches" fill={CHART_COLORS.ocean} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chapter Size Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-[var(--logistics)]" />
                  Chapter Size Distribution
                </CardTitle>
                <CardDescription>Number of codes per chapter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chapterSizeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === "codeCount" ? `${value} codes` : value,
                          name === "codeCount" ? "Code Count" : name,
                        ]}
                      />
                      <Bar dataKey="codeCount" name="Code Count" fill={CHART_COLORS.logistics} radius={[4, 4, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Duty Rates by Category */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-[var(--ocean)]" />
                  Average Duty Rates by Category
                </CardTitle>
                <CardDescription>Typical duty rate ranges for major product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dutyRatesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 15]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Avg Duty Rate"]} />
                      <Bar dataKey="avgRate" name="Average Duty Rate" fill={CHART_COLORS.ocean} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Results Distribution (when available) */}
          {chapterDistributionData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-[var(--logistics)]" />
                  Current Search Results by Chapter
                </CardTitle>
                <CardDescription>Distribution of your search results across HS chapters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chapterDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="name"
                      >
                        {chapterDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? CHART_COLORS.ocean : CHART_COLORS.logistics} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value} results`, "Count"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[var(--ocean)]" />
                  Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(term);
                        setHasSearched(true);
                        setActiveTab("search");
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          {/* What are HS Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--ocean)]" />
                What are HS Codes?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                The Harmonized System (HS) is an internationally standardized system of names and numbers
                to classify traded products. Developed and maintained by the World Customs Organization
                (WCO), an intergovernmental organization based in Brussels, the HS system has become the
                universal economic language and code for goods. It was introduced in 1988 and is currently
                used by more than 200 countries and economic unions worldwide as the basis for their
                customs tariffs and the collection of international trade statistics.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The HS system covers over 5,000 commodity groups, each identified by a six-digit code.
                The system is arranged in a logical structure with well-defined rules to achieve uniform
                classification throughout the world. The first two digits identify the chapter the goods
                fall under, the next two digits identify groupings within that chapter, and the final two
                digits provide even more specific detail. Over 98% of merchandise in international trade
                is classified using the HS system, making it essential knowledge for importers, exporters,
                customs brokers, and trade compliance professionals.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The primary purposes of HS codes include: determining applicable customs duty rates,
                collecting international trade statistics, applying rules of origin, monitoring controlled
                goods, enforcing trade regulations, and facilitating customs clearance procedures. Proper
                classification is crucial not only for compliance but also for ensuring accurate duty
                payments and avoiding costly delays or penalties at the border.
              </p>
            </CardContent>
          </Card>

          {/* HS Code Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--logistics)]" />
                HS Code Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[var(--ocean)]/10 border border-[var(--ocean)]/20">
                  <div className="text-2xl font-bold text-[var(--ocean)] mb-1">6 Digits</div>
                  <div className="text-sm font-medium text-foreground mb-2">International Standard</div>
                  <p className="text-xs text-muted-foreground">
                    The core HS code recognized worldwide. First 2 digits = Chapter, next 2 = Heading,
                    last 2 = Subheading. All WCO member countries use identical 6-digit codes.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">8 Digits</div>
                  <div className="text-sm font-medium text-foreground mb-2">National Tariff Level</div>
                  <p className="text-xs text-muted-foreground">
                    Country-specific extensions for national tariff purposes. The first 6 digits are
                    standard, while digits 7-8 provide additional national classification detail.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--logistics)]/10 border border-[var(--logistics)]/20">
                  <div className="text-2xl font-bold text-[var(--logistics)] mb-1">10 Digits</div>
                  <div className="text-sm font-medium text-foreground mb-2">Statistical Reporting</div>
                  <p className="text-xs text-muted-foreground">
                    Extended codes for detailed trade statistics and import/export reporting. Used by
                    customs authorities for granular data collection and analysis.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">WCO</div>
                  <div className="text-sm font-medium text-foreground mb-2">Governing Body</div>
                  <p className="text-xs text-muted-foreground">
                    The World Customs Organization maintains the HS system. Updates occur every 5 years
                    with the most recent being HS 2022, effective January 1, 2022.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-3">Example: HS Code 8471.30.00</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-16 justify-center">
                      84
                    </Badge>
                    <span>Chapter 84 - Nuclear Reactors, Boilers, Machinery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-16 justify-center">
                      8471
                    </Badge>
                    <span>Heading - Automatic Data Processing Machines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-16 justify-center">
                      8471.30
                    </Badge>
                    <span>Subheading - Portable Digital Computers (Laptops)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-16 justify-center">
                      8471.30.00
                    </Badge>
                    <span>National suffix - Further classification</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classification Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[var(--ocean)]" />
                Classification Rules (General Interpretative Rules)
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                The General Interpretative Rules (GIRs) provide the legal framework for HS classification.
                These six rules must be applied in sequential order and are essential for achieving
                consistent classification results. Understanding and correctly applying these rules is
                fundamental to proper HS code determination and forms the basis of customs compliance.
              </p>
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-[var(--ocean)]">GIR 1 - Classification by Terms</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Classification is determined legally by the terms of headings and relevant Section
                    or Chapter Notes. When goods can be classified under multiple headings, GIR 1 is
                    the starting point for analysis.
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-[var(--logistics)]">GIR 2 - Incomplete/Unfinished Goods</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Covers incomplete or unfinished articles that have the essential character of the
                    complete article. Also applies to mixtures and combinations of materials.
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-purple-600 dark:text-purple-400">GIR 3 - Multiple Headings</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    When goods are classifiable under two or more headings: (a) most specific description
                    takes precedence; (b) essential character determines classification; (c) heading
                    occurring last in numerical order applies.
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-amber-600 dark:text-amber-400">GIR 4-6 - Special Cases</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    GIR 4 provides for goods not classified elsewhere. GIR 5 covers containers and
                    packaging. GIR 6 establishes rules for classification at subheading level.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips for Accurate Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--logistics)]" />
                Tips for Accurate Classification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PRO_TIPS.map((tip, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                    <tip.icon className="h-5 w-5 text-[var(--ocean)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about HS codes, classification, and international trade compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
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

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-[var(--logistics)]" />
                Official Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="https://www.wcoomd.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Globe className="h-5 w-5 text-[var(--ocean)]" />
                  <div>
                    <div className="font-medium">World Customs Organization</div>
                    <div className="text-sm text-muted-foreground">Official HS system maintainer</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                </a>
                <a
                  href="https://hts.usitc.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Database className="h-5 w-5 text-[var(--logistics)]" />
                  <div>
                    <div className="font-medium">US HTS Database</div>
                    <div className="text-sm text-muted-foreground">Official US tariff codes</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                </a>
                <a
                  href="https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Globe className="h-5 w-5 text-[var(--ocean)]" />
                  <div>
                    <div className="font-medium">EU TARIC Database</div>
                    <div className="text-sm text-muted-foreground">EU tariff classification</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                </a>
                <a
                  href="https://rulings.cbp.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-[var(--logistics)]" />
                  <div>
                    <div className="font-medium">US Customs Rulings</div>
                    <div className="text-sm text-muted-foreground">Binding classification rulings</div>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* HS Chapter Reference Guide */}
      <Card className="bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5 border-[var(--ocean)]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-[var(--ocean)]" />
            Quick Reference: HS Code Structure
          </CardTitle>
          <CardDescription>Understanding the Harmonized System classification at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-white/50 dark:bg-white/5">
              <div className="text-2xl font-bold text-[var(--ocean)] mb-1">6 Digits</div>
              <div className="text-sm text-muted-foreground">International standard</div>
              <div className="text-xs mt-2">
                First 2 = Chapter, Next 2 = Heading, Last 2 = Subheading
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/50 dark:bg-white/5">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">8 Digits</div>
              <div className="text-sm text-muted-foreground">National tariff</div>
              <div className="text-xs mt-2">Country-specific subdivisions for import/export</div>
            </div>
            <div className="p-4 rounded-lg bg-white/50 dark:bg-white/5">
              <div className="text-2xl font-bold text-[var(--logistics)] mb-1">10 Digits</div>
              <div className="text-sm text-muted-foreground">Statistical suffix</div>
              <div className="text-xs mt-2">Used for detailed trade statistics reporting</div>
            </div>
            <div className="p-4 rounded-lg bg-white/50 dark:bg-white/5">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">WCO</div>
              <div className="text-sm text-muted-foreground">Standard body</div>
              <div className="text-xs mt-2">World Customs Organization maintains the HS system</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
