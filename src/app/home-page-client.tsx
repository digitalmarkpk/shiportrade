"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Container,
  Calculator,
  FileText,
  TrendingUp,
  Shield,
  Globe,
  DollarSign,
  Boxes,
  Package,
  ArrowRight,
  CheckCircle,
  Zap,
  Sparkles,
  ChevronRight,
  Search,
  Layers,
  Radar,
  Route,
  FileCheck,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PLATFORM_STATS } from "@/lib/constants/platform-stats";

const WorldMap = dynamic(() => import("@/components/world-map"), { ssr: false });

const quickPills = [
  { name: "CBM Calculator", icon: Container, href: "/tools/ocean-freight/cbm-calculator" },
  { name: "Container Planner", icon: Boxes, href: "/tools/ocean-freight/container-loading" },
  { name: "HS Code", icon: Layers, href: "/tools/customs-compliance/hs-code-search" },
  { name: "Port Directory", icon: Globe, href: "/directories/ports" },
  { name: "Landed Cost", icon: DollarSign, href: "/tools/international-trade/landed-cost-calculator" },
];

const tradeTools = [
  {
    name: "Distance & Time",
    description: "Transit times between ports",
    icon: Route,
    href: "/tools/international-trade/freight-transit-calculator",
    color: "#0F4C81",
  },
  {
    name: "Volumetric Weight",
    description: "Air freight chargeable weight",
    icon: Package,
    href: "/tools/air-freight/volumetric-weight",
    color: "#8B5CF6",
  },
  {
    name: "Freight Rates",
    description: "Compare shipping rates",
    icon: TrendingUp,
    href: "/tools/ocean-freight/freight-rate-calculator",
    color: "#2E8B57",
  },
  {
    name: "Currency",
    description: "Live exchange rates",
    icon: DollarSign,
    href: "/tools/international-trade/currency-converter",
    color: "#F59E0B",
  },
  {
    name: "Incoterms",
    description: "Trade terms guide",
    icon: Globe,
    href: "/tools/international-trade/incoterms-guide",
    color: "#EC4899",
  },
  {
    name: "Demurrage",
    description: "Port storage fees",
    icon: Timer,
    href: "/tools/ocean-freight/demurrage-calculator",
    color: "#EF4444",
  },
  {
    name: "Tracking",
    description: "Container tracking",
    icon: Radar,
    href: "/tools/ocean-freight/container-tracking",
    color: "#06B6D4",
  },
  {
    name: "Documents",
    description: "Generate trade docs",
    icon: FileCheck,
    href: "/documents",
    color: "#10B981",
  },
];

const featuredCalculators = [
  {
    name: "CBM Calculator",
    description: "Calculate cubic meters & container fit",
    icon: Container,
    href: "/tools/ocean-freight/cbm-calculator",
    color: "#0F4C81",
    features: ["Volume calculation", "Container fit"],
  },
  {
    name: "Container Load Planner",
    description: "Optimize pallet placement",
    icon: Boxes,
    href: "/tools/ocean-freight/container-loading",
    color: "#2E8B57",
    features: ["Pallet optimization", "Maximize space"],
  },
  {
    name: "HS Code Finder",
    description: "Find customs codes for products",
    icon: Layers,
    href: "/tools/customs-compliance/hs-code-search",
    color: "#8B5CF6",
    features: ["Product search", "Duty rates"],
  },
];

const stats = [
  { value: PLATFORM_STATS.tools, label: "Tools", icon: Calculator, href: "/tools" },
  { value: PLATFORM_STATS.documents, label: "Documents", icon: FileText, href: "/documents" },
  { value: PLATFORM_STATS.modules, label: "Modules", icon: Layers, href: "/modules" },
  { value: 50, label: "Currencies+", icon: DollarSign, href: "/tools/international-trade/currency-converter" },
];

const marketIndices = [
  { name: "FBX", value: "3,920", change: "+2.4%", up: true, href: "/trade/freight-index" },
  { name: "BDI", value: "1,847", change: "-1.2%", up: false, href: "/trade/freight-index" },
  { name: "EUR/USD", value: "1.0842", change: "+0.12%", up: true, href: "/trade/currencies" },
  { name: "WTI", value: "$79.20", change: "+0.8%", up: true, href: "/trade/commodities" },
];

const searchIndex = [
  { label: "CBM Calculator", href: "/tools/ocean-freight/cbm-calculator" },
  { label: "Container Load Planner", href: "/tools/ocean-freight/container-loading" },
  { label: "HS Code Finder", href: "/tools/customs-compliance/hs-code-search" },
  { label: "Container Tracking", href: "/tools/ocean-freight/container-tracking" },
  { label: "Landed Cost Calculator", href: "/tools/international-trade/landed-cost-calculator" },
  { label: "Freight Rate Calculator", href: "/tools/ocean-freight/freight-rate-calculator" },
  { label: "Currency Converter", href: "/tools/international-trade/currency-converter" },
  { label: "Incoterms Guide", href: "/tools/international-trade/incoterms-guide" },
  { label: "Demurrage Calculator", href: "/tools/ocean-freight/demurrage-calculator" },
  { label: "Port Directory", href: "/directories/ports" },
  { label: "Commercial Invoice", href: "/documents/commercial-invoice" },
  { label: "Bill of Lading", href: "/documents/bill-of-lading" },
  { label: "All Tools", href: "/tools" },
  { label: "All Documents", href: "/documents" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q.replace(/\s+/g, "-"))
    );
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(searchResults[0].href);
      setShowSearchSuggestions(false);
      return;
    }
    if (searchQuery.trim()) {
      router.push("/tools");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F4C81] via-[#2E8B57] to-[#0F4C81] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81]/5 via-white to-[#2E8B57]/5">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Global Logistics Tools
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
              Calculate freight, find ports, check HS codes — all in one place
            </p>

            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search calculators, tools, ports, HS codes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  className="pl-14 pr-24 h-16 text-lg rounded-2xl border-2 border-[#0F4C81]/20 focus:border-[#0F4C81] bg-white/90 backdrop-blur-md shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-[#0F4C81] text-white px-3 py-1.5 text-sm font-medium hover:bg-[#0F4C81]/90"
                >
                  Search
                </button>
              </div>
              {showSearchSuggestions && searchQuery && searchResults.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-2xl z-50 p-2 text-left list-none">
                  {searchResults.slice(0, 8).map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 text-sm font-medium text-slate-800"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </form>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {quickPills.map((pill) => (
                <Link
                  key={pill.href}
                  href={pill.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#0F4C81]/20 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-sm font-medium transition-colors"
                >
                  <pill.icon className="h-4 w-4 text-[#0F4C81]" />
                  {pill.name}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <Link
                  key={stat.href}
                  href={stat.href}
                  className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg hover:border-[#0F4C81]/30 border border-transparent transition-all"
                >
                  <stat.icon className="h-5 w-5 mx-auto mb-1 text-[#0F4C81]" />
                  <div className="text-xl font-bold text-slate-900">
                    {stat.label.endsWith("+") ? `${stat.value}+` : stat.value}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market strip */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b py-3">
        <div className="container mx-auto px-4 flex justify-center gap-4 md:gap-8 flex-wrap">
          {marketIndices.map((idx) => (
            <Link
              key={idx.name}
              href={idx.href}
              className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm text-slate-500">{idx.name}</span>
              <span className="font-bold text-slate-900">{idx.value}</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  idx.up ? "text-green-600 border-green-600" : "text-red-600 border-red-600"
                )}
              >
                {idx.change}
              </Badge>
            </Link>
          ))}
          <Link
            href="/trade"
            className="text-sm font-medium text-[#0F4C81] hover:underline flex items-center gap-1"
          >
            All markets <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <main>
        {/* Trade tools grid */}
        <section className="py-12 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                  <Calculator className="h-6 w-6 text-[#0F4C81]" />
                  Trade Tools
                </h2>
                <p className="text-slate-600">Essential calculators for logistics professionals</p>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <Link href="/tools">
                  All {PLATFORM_STATS.tools} Tools
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tradeTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="bg-white rounded-xl p-5 shadow-md text-center hover:shadow-xl hover:-translate-y-0.5 transition-all group border border-slate-100"
                >
                  <div
                    className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${tool.color}15` }}
                  >
                    <tool.icon className="h-7 w-7" style={{ color: tool.color }} />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 group-hover:text-[#0F4C81]">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured calculators */}
        <section className="py-12 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-3 bg-[#0F4C81]/10 text-[#0F4C81] border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900">Most Used Calculators</h2>
            <p className="text-slate-600 max-w-xl mx-auto mb-8">
              Tools logistics professionals rely on daily
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCalculators.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group border border-slate-100 text-left"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${calc.color}15` }}
                  >
                    <calc.icon className="h-8 w-8" style={{ color: calc.color }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-[#0F4C81] text-center">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-slate-600 text-center">{calc.description}</p>
                  <div className="mt-4 text-xs space-y-1 text-slate-600">
                    {calc.features.map((f) => (
                      <div key={f}>
                        <CheckCircle className="h-3 w-3 inline text-green-600 mr-1" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-[#0F4C81] font-medium text-center">
                    Open Tool <ArrowRight className="h-4 w-4 inline ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Global map */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                  <Globe className="h-6 w-6 text-[#0F4C81]" />
                  Global Logistics Network
                </h2>
                <p className="text-slate-600">
                  Explore major sea ports, airports, and logistics hubs worldwide
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <Link href="/directories/ports">
                  Explore Port Directory
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <WorldMap />
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 text-center bg-slate-50/80 border-t">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 mb-8">
              <span>
                <Shield className="h-4 w-4 inline text-green-600 mr-1" />
                ISO 27001 Certified
              </span>
              <span>
                <CheckCircle className="h-4 w-4 inline text-green-600 mr-1" />
                SOC 2 Compliant
              </span>
              <span>
                <Globe className="h-4 w-4 inline text-green-600 mr-1" />
                GDPR Ready
              </span>
              <span>
                <Zap className="h-4 w-4 inline text-green-600 mr-1" />
                99.9% Uptime
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">
              Ready to Optimize Your Trade Operations?
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto mb-6">
              Access {PLATFORM_STATS.tools} tools, {PLATFORM_STATS.documents} document generators, and market data — all free.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full px-8">
                <Link href="/tools">Explore Calculators</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8">
                <Link href="/documents">Generate Documents</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
