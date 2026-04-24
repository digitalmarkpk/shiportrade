"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Ship,
  Plane,
  Shield,
  Warehouse,
  FileText,
  ArrowRight,
  Search,
  TrendingUp,
  Package,
  DollarSign,
  BookOpen,
  Users,
  Zap,
  Award,
  Check,
  ChevronDown,
  Globe,
  Clock,
  Sparkles,
  BarChart3,
  Flame,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Icon Map
const iconMap: Record<string, React.ElementType> = {
  "package": Package,
  "ship": Ship,
  "plane": Plane,
  "search": Search,
  "dollar-sign": DollarSign,
  "book-open": BookOpen,
  "calculator": Calculator,
  "shield": Shield,
  "warehouse": Warehouse,
  "file-text": FileText,
};

// All Tools Data - Extended with more tools
const allTools = [
  { id: 1, name: "CBM Calculator", desc: "Calculate cubic meters for shipping", href: "/tools/ocean-freight/cbm-calculator", icon: "package", category: "Ocean", uses: 45200, trending: true },
  { id: 2, name: "Container Load Planner", desc: "Optimize container space utilization", href: "/tools/ocean-freight/container-loading-calculator", icon: "ship", category: "Ocean", uses: 38100, trending: true },
  { id: 3, name: "Volumetric Weight Calculator", desc: "Air freight chargeable weight calculation", href: "/tools/air-freight/volumetric-weight", icon: "plane", category: "Air", uses: 32400, trending: true },
  { id: 4, name: "Container Tracking", desc: "Track any container worldwide in real-time", href: "/tools/ocean-freight/container-tracking", icon: "ship", category: "Ocean", uses: 29800, trending: false },
  { id: 5, name: "HS Code Finder", desc: "Find customs tariff codes by keyword", href: "/tools/customs-compliance/hs-code-search", icon: "search", category: "Customs", uses: 22100, trending: true },
  { id: 6, name: "Freight Rate Calculator", desc: "Compare ocean and air freight rates", href: "/tools/ocean-freight/freight-rate-calculator", icon: "dollar-sign", category: "Ocean", uses: 19300, trending: false },
  { id: 7, name: "Currency Converter", desc: "Live exchange rates for 150+ currencies", href: "/tools/international-trade/currency-converter", icon: "dollar-sign", category: "Finance", uses: 18200, trending: false },
  { id: 8, name: "Incoterms Guide", desc: "Complete 2020 Incoterms rules explained", href: "/tools/international-trade/incoterms-guide", icon: "book-open", category: "Trade", uses: 16700, trending: false },
  { id: 9, name: "Pallet Calculator", desc: "Calculate pallet loads and stacking", href: "/tools/warehousing/pallet-calculator", icon: "package", category: "Warehouse", uses: 15400, trending: false },
  { id: 10, name: "Duty Calculator", desc: "Calculate import duties and tariffs", href: "/tools/customs-compliance/duty-tariff-calculator", icon: "calculator", category: "Customs", uses: 14200, trending: false },
  { id: 11, name: "Distance & Time", desc: "Port to port transit time calculator", href: "/tools/ocean-freight/transit-time", icon: "ship", category: "Ocean", uses: 13800, trending: false },
  { id: 12, name: "Landed Cost Calculator", desc: "Total cost to door calculation", href: "/tools/international-trade/landed-cost-calculator", icon: "dollar-sign", category: "Finance", uses: 12100, trending: false },
  { id: 13, name: "Demurrage Calculator", desc: "Calculate port storage fees and charges", href: "/tools/ocean-freight/demurrage-calculator", icon: "calculator", category: "Ocean", uses: 11500, trending: false },
  { id: 14, name: "Tracking Portal", desc: "Multi-carrier shipment tracking", href: "/tools/ocean-freight/container-tracking", icon: "ship", category: "Ocean", uses: 10800, trending: false },
  { id: 15, name: "Trade Tariff Checker", desc: "Check import tariffs by country", href: "/tools/customs-compliance/trade-tariff-comparison", icon: "search", category: "Customs", uses: 9800, trending: false },
  { id: 16, name: "Warehousing Cost", desc: "Storage cost calculator for warehouses", href: "/tools/warehousing/warehousing-cost-calculator", icon: "warehouse", category: "Warehouse", uses: 9200, trending: false },
];

// Categories Data
const categories = [
  { name: "Ocean Freight", count: 33, icon: "ship", color: "#0F4C81", slug: "ocean-freight", tools: ["CBM Calculator", "Container Planner", "Tracking"] },
  { name: "Air Cargo", count: 5, icon: "plane", color: "#8B5CF6", slug: "air-freight", tools: ["Volumetric Weight", "Air Tracking"] },
  { name: "Customs & Trade", count: 14, icon: "shield", color: "#059669", slug: "customs-compliance", tools: ["HS Code", "Duty Calculator"] },
  { name: "Warehousing", count: 22, icon: "warehouse", color: "#EA580C", slug: "warehousing", tools: ["Pallet Calculator", "Storage"] },
  { name: "Finance", count: 18, icon: "dollar-sign", color: "#DC2626", slug: "international-trade", tools: ["Currency", "Landed Cost"] },
  { name: "Documents", count: 13, icon: "file-text", color: "#4B5563", slug: "documents", tools: ["Commercial Invoice", "Packing List"] },
];

// Format number helper
const formatNumber = (num: number): string => {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return num.toString();
};

// ============ COMPONENTS ============

// Trending Card Component
function TrendingCard({ tool, index }: { tool: typeof allTools[0]; index: number }) {
  const Icon = iconMap[tool.icon] || Calculator;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={tool.href}>
        <Card className="h-full bg-white border-2 border-slate-200 hover:border-[#0F4C81] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${OCEAN_BLUE}15` }}
              >
                <Icon className="h-6 w-6" style={{ color: OCEAN_BLUE }} />
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold border-0">
                  HOT
                </Badge>
              </div>
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#0F4C81] transition-colors mb-2">
              {tool.name}
            </h3>
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{tool.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                {formatNumber(tool.uses)} uses
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F4C81] group-hover:translate-x-1 transition-all" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// Tool Item Component (Compact)
function ToolItem({ tool, index }: { tool: typeof allTools[0]; index: number }) {
  const Icon = iconMap[tool.icon] || Calculator;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
    >
      <Link href={tool.href}>
        <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-[#0F4C81] hover:shadow-md transition-all duration-200 group cursor-pointer">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${OCEAN_BLUE}10` }}
          >
            <Icon className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 group-hover:text-[#0F4C81] transition-colors truncate">
              {tool.name}
            </h3>
            <p className="text-sm text-slate-500 truncate">{tool.desc}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#0F4C81] group-hover:translate-x-1 transition-all shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}

// Category Card Component
function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const Icon = iconMap[category.icon] || Calculator;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/tools/${category.slug}`}>
        <Card className="h-full bg-white border-2 border-slate-200 hover:border-[#0F4C81] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <Icon className="h-7 w-7" style={{ color: category.color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#0F4C81] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-500">{category.count} tools</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-[#0F4C81] group-hover:translate-x-1 transition-all" />
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Popular tools:</p>
              <p className="text-sm text-slate-600">{category.tools.join(", ")}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-2 border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
      <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-slate-50 transition-colors list-none">
        <span className="font-semibold text-slate-900 pr-4">{question}</span>
        <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180 shrink-0" />
      </summary>
      <div className="p-5 pt-0 bg-white border-t border-slate-100">
        <p className="text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </details>
  );
}

// ============ SECTION COMPONENTS ============

// Hero Section
function HeroSection({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <section className="relative py-20 bg-gradient-to-br from-white via-slate-50 to-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0F4C81]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2E8B57]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-slate-100 to-transparent rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F4C81] to-[#0d4473] text-white px-5 py-2.5 rounded-full mb-8 shadow-lg"
          >
            <Award className="h-5 w-5 text-amber-400" />
            <span className="font-semibold">World's Largest Logistics Toolkit</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6"
          >
            190 Free Tools for{" "}
            <span className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Global Trade
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-lg md:text-xl text-slate-600 mb-4 max-w-2xl mx-auto"
          >
            Calculate CBM, plan container loads, find HS codes, track shipments, and more.
            Professional tools trusted by 50,000+ freight forwarders worldwide.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-sm text-slate-500 mb-10 flex items-center justify-center gap-2"
          >
            <Users className="h-4 w-4" />
            Trusted by 50,000+ freight forwarders worldwide
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
              <Input
                placeholder="Search tools (e.g., CBM calculator, HS code, container)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 pl-14 pr-6 text-lg bg-white border-2 border-slate-200 rounded-2xl shadow-lg focus:border-[#0F4C81] focus:ring-4 focus:ring-[#0F4C81]/10 transition-all"
              />
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#0F4C81]" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-900">50,247</p>
                <p className="text-sm text-slate-500">users this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#2E8B57]/10 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-[#2E8B57]" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-900">127K</p>
                <p className="text-sm text-slate-500">calculations today</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-amber-500" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-900">Free</p>
                <p className="text-sm text-slate-500">forever</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Trending Section
function TrendingSection({ tools }: { tools: typeof allTools }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-16 bg-slate-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Trending Now</h2>
            <p className="text-sm text-slate-500">Most popular tools this week</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <TrendingCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// Popular Tools Section
function PopularToolsSection({ tools }: { tools: typeof allTools }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Popular Tools</h2>
            <p className="text-sm text-slate-500">Start with our most-used tools</p>
          </div>
          <Link href="/tools/all">
            <Button
              variant="ghost"
              className="text-[#0F4C81] hover:text-[#0F4C81] hover:bg-[#0F4C81]/10 font-medium"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool, index) => (
            <ToolItem key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Search Results Section
function SearchResultsSection({ tools, query }: { tools: typeof allTools; query: string }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {tools.length > 0 ? `Results for "${query}"` : `No results for "${query}"`}
          </h2>
          {tools.length > 0 && (
            <p className="text-sm text-slate-500">
              Found {tools.length} tool{tools.length !== 1 ? "s" : ""} matching your search
            </p>
          )}
        </div>

        {tools.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <ToolItem key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-slate-50 border-slate-200">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tools match your search</h3>
            <p className="text-slate-500 mb-6">
              Try searching for something else, like &quot;CBM&quot;, &quot;HS code&quot;, or &quot;container&quot;
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["CBM Calculator", "Container Tracking", "HS Code"].map((term) => (
                <Badge
                  key={term}
                  variant="outline"
                  className="cursor-pointer hover:bg-slate-100"
                >
                  {term}
                </Badge>
              ))}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}

// Categories Section
function CategoriesSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Browse by Category</h2>
          <p className="text-lg text-slate-600">Find the right tool for your logistics needs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// SEO/Educational Block Section
function SEOBlock() {
  const faqData = [
    {
      question: "What is a CBM Calculator and why do I need it?",
      answer:
        "CBM (Cubic Meter) is a standard measurement used in shipping to calculate the volume of cargo. Our CBM calculator helps you determine how much space your shipment will occupy in a container, enabling better load planning and cost estimation for ocean freight shipments.",
    },
    {
      question: "How do I find the correct HS Code for my product?",
      answer:
        "HS Codes (Harmonized System Codes) are international standardized numbers used to classify products for customs. Use our HS Code Finder tool to search by product name, keyword, or industry to locate the correct code for your goods. Always verify with your customs broker for accuracy.",
    },
    {
      question: "Are these shipping calculators really free to use?",
      answer:
        "Yes! All 190+ tools on Shiportrade are completely free to use with no registration required. We believe in making logistics calculations accessible to everyone in the trade industry. Our tools are funded by premium features and partnerships with industry service providers.",
    },
    {
      question: "How accurate are the freight calculations?",
      answer:
        "Our calculators use industry-standard formulas and are regularly updated with current rates. While we strive for accuracy, actual shipping costs may vary based on carrier, route, and market conditions. We recommend using these tools as estimates and confirming with carriers for final pricing.",
    },
    {
      question: "Can I use these tools for commercial purposes?",
      answer:
        "Absolutely. Our tools are designed for freight forwarders, logistics companies, and trade professionals. Feel free to use them for your daily operations, quotations, and client communications. No attribution required.",
    },
  ];

  const popularToolsList = [
    { name: "CBM Calculator", desc: "Calculate cubic meters for ocean freight", icon: Calculator },
    { name: "Container Load Planner", desc: "Optimize container space utilization", icon: Ship },
    { name: "HS Code Finder", desc: "Search customs tariff codes by keyword", icon: Shield },
    { name: "Freight Rate Calculator", desc: "Compare shipping costs across carriers", icon: DollarSign },
    { name: "Volumetric Weight Calculator", desc: "Determine air freight charges", icon: Package },
  ];

  const benefits = [
    "100% free with no registration required",
    "Calculations based on industry-standard formulas",
    "Mobile-responsive design works on any device",
    "Trusted by 50,000+ logistics professionals monthly",
    "Updated regularly with new features and tools",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Free Logistics Calculators for International Shipping
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Shiportrade offers a comprehensive suite of free logistics calculators designed for freight forwarders,
              customs brokers, and international trade professionals.
            </p>
          </div>

          {/* Description */}
          <div className="prose prose-lg max-w-none text-slate-600 mb-12">
            <p className="mb-6">
              Shiportrade provides the most comprehensive collection of free logistics and trade calculators available
              online. Our tools are designed by industry experts to help freight forwarders, logistics managers, and
              trade professionals make accurate calculations quickly and efficiently. From CBM calculations to customs
              duty estimates, our toolkit covers every aspect of international shipping.
            </p>
          </div>

          {/* Popular Tools List */}
          <div className="bg-slate-50 rounded-2xl p-8 mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-[#2E8B57]" />
              Popular Tools Included
            </h3>
            <ul className="space-y-3">
              {popularToolsList.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <li key={index} className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 shrink-0" style={{ color: LOGISTICS_GREEN }} />
                    <span className="text-slate-700">
                      <strong className="text-slate-900">{item.name}</strong> – {item.desc}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Why Use Section */}
          <div className="bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 rounded-2xl p-8 mb-12 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Check className="h-6 w-6 text-[#2E8B57]" />
              Why Use Shiportrade Tools?
            </h3>
            <ul className="space-y-4">
              {benefits.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: LOGISTICS_GREEN }}
                  >
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-600">
              <Shield className="h-5 w-5 text-[#2E8B57]" />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Globe className="h-5 w-5 text-[#0F4C81]" />
              <span className="text-sm font-medium">Used in 150+ Countries</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-5 w-5 text-[#0F4C81]" />
              <span className="text-sm font-medium">24/7 Available</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="h-5 w-5 text-[#2E8B57]" />
              <span className="text-sm font-medium">50K+ Users</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57]" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Can&apos;t find what you need?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            We&apos;re constantly adding new tools. Let us know what would help your business.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="h-14 px-8 bg-white text-[#0F4C81] hover:bg-slate-100 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Request a Tool
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============ MAIN PAGE COMPONENT ============

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Trending tools - filter tools marked as trending
  const trendingTools = useMemo(() => {
    return allTools.filter((tool) => tool.trending).slice(0, 4);
  }, []);

  // Filtered tools based on search query
  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allTools.slice(0, 8);

    return allTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.desc.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const showSearchResults = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Trending Section - Only show when not searching */}
      <AnimatePresence>
        {!showSearchResults && (
          <TrendingSection tools={trendingTools} />
        )}
      </AnimatePresence>

      {/* Tools Grid - Show Popular or Search Results */}
      <AnimatePresence mode="wait">
        {showSearchResults ? (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SearchResultsSection tools={filteredTools} query={searchQuery} />
          </motion.div>
        ) : (
          <motion.div
            key="popular"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PopularToolsSection tools={filteredTools} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Section */}
      <CategoriesSection />

      {/* SEO/Educational Block */}
      <SEOBlock />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}