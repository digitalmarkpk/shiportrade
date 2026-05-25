"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Container, Calculator, FileText, TrendingUp,
  Shield, Globe, DollarSign, Boxes, Package,
  ArrowRight, CheckCircle, Zap, Sparkles, ChevronRight,
  Moon, Search, Layers, Radar, Route, FileCheck, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Dynamically import WorldMap with SSR disabled
const WorldMap = dynamic(() => import("@/components/world-map"), { ssr: false });

// Quick pills
const quickPills = [
  { name: "CBM Calculator", icon: Container, href: "/tools/ocean-freight/cbm-calculator" },
  { name: "Container Planner", icon: Boxes, href: "/tools/ocean-freight/container-loading-calculator" },
  { name: "HS Code", icon: Layers, href: "/tools/customs-compliance/hs-code-search" },
  { name: "Port Finder", icon: Globe, href: "/tools/ocean-freight/port-code-finder" },
  { name: "Landed Cost", icon: DollarSign, href: "/tools/international-trade/landed-cost-calculator" },
];

// Trade tools grid
const tradeTools = [
  { name: "Distance & Time", description: "Transit times between ports", icon: Route, href: "#", color: "#0F4C81" },
  { name: "Volumetric Weight", description: "Air freight chargeable weight", icon: Package, href: "#", color: "#8B5CF6" },
  { name: "Freight Rates", description: "Compare shipping rates", icon: TrendingUp, href: "#", color: "#2E8B57" },
  { name: "Currency", description: "Live exchange rates", icon: DollarSign, href: "#", color: "#F59E0B" },
  { name: "Incoterms", description: "Trade terms guide", icon: Globe, href: "#", color: "#EC4899" },
  { name: "Demurrage", description: "Port storage fees", icon: Timer, href: "#", color: "#EF4444" },
  { name: "Tracking", description: "Container tracking", icon: Radar, href: "#", color: "#06B6D4" },
  { name: "Documents", description: "Generate trade docs", icon: FileCheck, href: "#", color: "#10B981" },
];

// Featured calculators
const featuredCalculators = [
  { name: "CBM Calculator", description: "Calculate cubic meters & container fit", icon: Container, href: "#", color: "#0F4C81", features: ["Volume calculation", "Container fit"] },
  { name: "Container Load Planner", description: "Optimize pallet placement", icon: Boxes, href: "#", color: "#2E8B57", features: ["Pallet optimization", "Maximize space"] },
  { name: "HS Code Finder", description: "Find customs codes for products", icon: Layers, href: "#", color: "#8B5CF6", features: ["Product search", "Duty rates"] },
];

// Stats data
const stats = [
  { value: 190, label: "Tools+", icon: Calculator },
  { value: 120, label: "Documents+", icon: FileText },
  { value: 27, label: "Modules", icon: Layers },
  { value: 50, label: "Currencies+", icon: DollarSign },
];

// Market strip data
const marketIndices = [
  { name: "FBX", value: "3,920", change: "+2.4%", up: true },
  { name: "BDI", value: "1,847", change: "-1.2%", up: false },
  { name: "EUR/USD", value: "1.0842", change: "+0.12%", up: true },
  { name: "WTI", value: "$79.20", change: "+0.8%", up: true },
];

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", String(newMode));
  };

  const searchSuggestions = ["CBM Calculator", "HS Code Finder", "Container Tracking", "Ocean Freight Rates", "Port Directory"].filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Reading Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F4C81] via-[#2E8B57] to-[#0F4C81] z-50 origin-left" style={{ scaleX }} />

      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81]/5 via-white to-[#2E8B57]/5 dark:via-slate-900">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3 md:gap-4">{/* World clocks can be added later */}</div>
            <div className="flex items-center gap-2">
              <button onClick={toggleDarkMode} className="rounded-full p-2 hover:bg-white/50"><Moon className="h-5 w-5 text-slate-700 dark:text-slate-200" /></button>
            </div>
          </div>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">Global Logistics Tools</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">Calculate freight, find ports, check HS codes — all in one place</p>
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input ref={searchInputRef} placeholder="Search calculators, tools, ports, HS codes..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setShowSearchSuggestions(true); }} onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)} className="pl-14 pr-24 h-16 text-lg rounded-2xl border-2 border-[#0F4C81]/20 focus:border-[#0F4C81] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2"><kbd className="px-2 py-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 rounded-lg border">Ctrl+K</kbd></div>
              </div>
              {showSearchSuggestions && searchQuery && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border rounded-xl shadow-2xl z-50 p-2">
                  {searchSuggestions.map(s => <Link key={s} href="#" className="block p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">{s}</Link>)}
                </div>
              )}
            </div>
            {/* Quick Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {quickPills.map((pill, idx) => (
                <Link key={idx} href={pill.href} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#0F4C81]/20 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-sm font-medium"><pill.icon className="h-4 w-4 text-[#0F4C81]" />{pill.name}</Link>
              ))}
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center p-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl shadow-md"><stat.icon className="h-5 w-5 mx-auto mb-1 text-[#0F4C81]" /><div className="text-xl font-bold">{stat.label === "Modules" ? stat.value : `${stat.value}+`}</div><div className="text-xs text-slate-500">{stat.label}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market Data Strip */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b py-3">
        <div className="container mx-auto px-4 flex justify-center gap-6 flex-wrap">
          {marketIndices.map((idx, i) => (
            <div key={i} className="flex items-center gap-2"><span className="text-sm text-slate-500">{idx.name}</span><span className="font-bold">{idx.value}</span><Badge variant="outline" className={cn("text-xs", idx.up ? "text-green-600 border-green-600" : "text-red-600 border-red-600")}>{idx.change}</Badge></div>
          ))}
        </div>
      </div>

      <main>
        {/* SECTION: TRADE TOOLS GRID */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-bold flex items-center gap-2"><Calculator className="h-6 w-6 text-[#0F4C81]" /> Trade Tools</h2><p className="text-muted-foreground">Essential calculators for logistics professionals</p></div><Button asChild variant="outline"><Link href="/tools">All 190+ Tools →</Link></Button></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tradeTools.map((tool, idx) => (
                <Link key={idx} href="#" className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md text-center hover:shadow-xl transition group">
                  <div className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${tool.color}15` }}><tool.icon className="h-7 w-7" style={{ color: tool.color }} /></div>
                  <h3 className="font-semibold text-sm group-hover:text-[#0F4C81]">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: FEATURED CALCULATORS */}
        <section className="py-12 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-3 bg-[#0F4C81]/10 text-[#0F4C81]"><Sparkles className="h-3 w-3 mr-1" /> Featured</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Most Used Calculators</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">Tools logistics professionals rely on daily</p>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCalculators.map((calc, idx) => (
                <Link key={idx} href="#" className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${calc.color}15` }}><calc.icon className="h-8 w-8" style={{ color: calc.color }} /></div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-[#0F4C81]">{calc.name}</h3>
                  <p className="text-sm text-muted-foreground">{calc.description}</p>
                  <div className="mt-4 text-left text-xs space-y-1">{calc.features.map((f, i) => (<div key={i}><CheckCircle className="h-3 w-3 inline text-green-600 mr-1" />{f}</div>))}</div>
                  <div className="mt-4 text-[#0F4C81] font-medium">Open Tool <ArrowRight className="h-4 w-4 inline ml-1" /></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: GLOBAL MAP */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div><h2 className="text-2xl font-bold flex items-center gap-2"><Globe className="h-6 w-6 text-[#0F4C81]" /> Global Logistics Network</h2><p className="text-muted-foreground">1,354+ sea ports, 50+ airports, 30+ dry ports — all verified</p></div>
              <Button asChild variant="outline"><Link href="/tools/ocean-freight/port-code-finder">Explore All <ChevronRight className="h-4 w-4 ml-1" /></Link></Button>
            </div>
            <WorldMap />
          </div>
        </section>

        {/* Trust Badges & CTA */}
        <section className="py-10 text-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 mb-8"><div><Shield className="h-4 w-4 inline text-green-600 mr-1" /> ISO 27001 Certified</div><div><CheckCircle className="h-4 w-4 inline text-green-600 mr-1" /> SOC 2 Compliant</div><div><Globe className="h-4 w-4 inline text-green-600 mr-1" /> GDPR Ready</div><div><Zap className="h-4 w-4 inline text-green-600 mr-1" /> 99.9% Uptime</div></div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Optimize Your Trade Operations?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">Access 190+ tools, 120+ document generators, and real-time market data — all free.</p>
            <div className="flex gap-4 justify-center"><Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full">Explore Calculators</Button><Button variant="outline" className="rounded-full">Generate Documents</Button></div>
          </div>
        </section>
      </main>
    </div>
  );
}
