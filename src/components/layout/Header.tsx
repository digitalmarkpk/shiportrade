"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Search,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  ChevronRight,
  Calculator,
  FileText,
  Globe,
  Newspaper,
  DollarSign,
  User,
  Settings,
  LogIn,
  Sparkles,
  Truck,
  Warehouse,
  ShoppingBag,
  Leaf,
  Plane,
  Shield,
  Zap,
  X,
  Layers,
  Grid3x3,
  Bot,
  Target,
  BarChart3,
  CheckCircle,
  Package,
  Thermometer,
  AlertTriangle,
  Anchor,
  MapPin,
  Container,
  TrendingUp,
  PieChart,
  Boxes,
  Building2,
  FileCheck,
  Landmark,
  Route,
  ClipboardCheck,
  LucideIcon,
  Calendar,
  Coins,
  Store,
  Wrench,
  Users,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currencies, popularCurrencies, regionalCurrencies } from "@/lib/constants/currencies";
import { modulesMetadata, toolCategories, featuredTools, documentCategories } from "@/lib/constants/tools";

// Icon mapping for modules
const moduleIconMap: Record<string, LucideIcon> = {
  "Globe": Globe,
  "Ship": Ship,
  "Plane": Plane,
  "Truck": Truck,
  "ShieldCheck": Shield,
  "Shield": Shield,
  "Warehouse": Warehouse,
  "ShoppingBag": ShoppingBag,
  "FileCheck": FileCheck,
  "Leaf": Leaf,
  "Container": Container,
  "Layers": Layers,
  "DollarSign": DollarSign,
  "Landmark": Landmark,
  "Target": Target,
  "Boxes": Boxes,
  "BarChart": BarChart3,
  "BarChart3": BarChart3,
  "CheckSquare": CheckCircle,
  "Package": Package,
  "Route": Route,
  "AlertTriangle": AlertTriangle,
  "Thermometer": Thermometer,
  "Building2": Building2,
  "TrendingUp": TrendingUp,
  "ClipboardList": ClipboardCheck,
  "Anchor": Anchor,
  "MapPin": MapPin,
  "FileText": FileText,
  "Link": Layers,
  "Wrench": Calculator,
  "Calculator": Calculator,
};

// Display name mapping for shorter names in menu
const displayNameMap: Record<string, string> = {
  "international-trade": "International Trade",
  "ocean-freight": "Ocean Freight",
  "air-freight": "Air Freight",
  "road-rail": "Road & Rail",
  "customs-compliance": "Customs & Compliance",
  "warehousing": "Warehousing",
  "ecommerce": "E-Commerce",
  "insurance": "Insurance",
  "sustainability": "Sustainability",
  "project-cargo": "Project Cargo",
  "blockchain-digital-supply-chain": "Blockchain & Digital",
  "financial-payment": "Financial & Payment",
  "trade-finance": "Trade Finance",
  "logistics-planning": "Logistics Planning",
  "inventory-management": "Inventory Management",
  "supply-chain-analytics": "Supply Chain Analytics",
  "quality-control": "Quality Control",
  "packaging-labeling": "Packaging & Labeling",
  "last-mile-delivery": "Last Mile Delivery",
  "dangerous-goods": "Dangerous Goods",
  "cold-chain": "Cold Chain",
  "customs-brokerage": "Customs Brokerage",
  "freight-forwarding": "Freight Forwarding",
  "trade-compliance-advanced": "Trade Compliance",
  "vessel-operations": "Vessel Operations",
  "port-operations": "Port Operations",
  "documents": "Documents",
};

// Tool categories with their tools for the dropdown
const toolCategoriesForMenu = toolCategories
  .filter(cat => cat.id !== "documents")
  .slice(0, 6)
  .map(cat => ({
    id: cat.id,
    name: displayNameMap[cat.slug] || cat.name,
    slug: cat.slug,
    icon: moduleIconMap[cat.icon] || Calculator,
    tools: cat.tools.slice(0, 4), // Show 4 tools per category
    color: "",
  }));

// Set colors for categories
const categoryColorMap: Record<string, string> = {
  "international-trade": "bg-gradient-to-br from-blue-500 to-indigo-600",
  "ocean-freight": "bg-gradient-to-br from-cyan-500 to-blue-600",
  "air-freight": "bg-gradient-to-br from-sky-400 to-blue-500",
  "road-rail": "bg-gradient-to-br from-orange-500 to-amber-500",
  "customs-compliance": "bg-gradient-to-br from-red-500 to-rose-600",
  "warehousing": "bg-gradient-to-br from-violet-500 to-purple-600",
};

toolCategoriesForMenu.forEach(cat => {
  cat.color = categoryColorMap[cat.id] || "bg-gradient-to-br from-blue-500 to-indigo-600";
});

// Popular tools for quick access
const popularTools = featuredTools.slice(0, 8);

// Document categories with icons for the dropdown
const documentCategoryIconMap: Record<string, LucideIcon> = {
  "trade-documents": FileText,
  "shipping-documents": Ship,
  "customs-documents": Shield,
  "finance-documents": DollarSign,
  "insurance-documents": FileCheck,
  "inspection-documents": CheckCircle,
  "dangerous-goods-documents": AlertTriangle,
  "phytosanitary-documents": Leaf,
  "food-documents": Thermometer,
  "other-documents": FileText,
  "logistics-documents": Truck,
};

// Document category colors
const documentCategoryColorMap: Record<string, string> = {
  "trade-documents": "bg-gradient-to-br from-blue-500 to-indigo-600",
  "shipping-documents": "bg-gradient-to-br from-cyan-500 to-blue-600",
  "customs-documents": "bg-gradient-to-br from-red-500 to-rose-600",
  "finance-documents": "bg-gradient-to-br from-emerald-500 to-teal-600",
  "insurance-documents": "bg-gradient-to-br from-violet-500 to-purple-600",
  "inspection-documents": "bg-gradient-to-br from-amber-500 to-orange-600",
  "dangerous-goods-documents": "bg-gradient-to-br from-red-600 to-red-700",
  "phytosanitary-documents": "bg-gradient-to-br from-green-500 to-emerald-600",
  "food-documents": "bg-gradient-to-br from-lime-500 to-green-600",
  "other-documents": "bg-gradient-to-br from-gray-500 to-slate-600",
  "logistics-documents": "bg-gradient-to-br from-orange-500 to-amber-600",
};

// Featured documents (most important/common)
const featuredDocuments = [
  { id: "commercial-invoice", name: "Commercial Invoice", category: "trade-documents", slug: "commercial-invoice" },
  { id: "bill-of-lading", name: "Bill of Lading", category: "shipping-documents", slug: "bill-of-lading" },
  { id: "certificate-of-origin", name: "Certificate of Origin", category: "customs-documents", slug: "certificate-of-origin" },
  { id: "letter-of-credit", name: "Letter of Credit", category: "finance-documents", slug: "letter-of-credit" },
  { id: "packing-list", name: "Packing List", category: "trade-documents", slug: "packing-list" },
  { id: "air-waybill", name: "Air Waybill", category: "shipping-documents", slug: "air-waybill" },
  { id: "insurance-certificate", name: "Insurance Certificate", category: "insurance-documents", slug: "insurance-certificate" },
  { id: "dangerous-goods-declaration", name: "DG Declaration", category: "dangerous-goods-documents", slug: "dangerous-goods-declaration" },
];

// Document categories for menu (first 6 with top documents)
const documentCategoriesForMenu = documentCategories.slice(0, 6).map(cat => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  icon: documentCategoryIconMap[cat.id] || FileText,
  documents: cat.documents.slice(0, 4),
  color: documentCategoryColorMap[cat.id] || "bg-gradient-to-br from-blue-500 to-indigo-600",
}));

// All modules from single source of truth
const allModules = modulesMetadata.map(m => ({
  id: m.id,
  name: displayNameMap[m.slug] || m.name,
  slug: m.slug,
  icon: moduleIconMap[m.icon] || Globe,
  tools: m.tools,
  documents: m.documents,
  color: m.color,
}));

// Popular modules (most used/important)
const popularModules = [
  allModules.find(m => m.slug === "ocean-freight")!,
  allModules.find(m => m.slug === "international-trade")!,
  allModules.find(m => m.slug === "customs-compliance")!,
  allModules.find(m => m.slug === "air-freight")!,
  allModules.find(m => m.slug === "trade-finance")!,
  allModules.find(m => m.slug === "logistics-planning")!,
].filter(Boolean);

export function Header() {
  const { theme, setTheme } = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg shadow-lg overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)'
              }}
            >
              <Ship className="h-6 w-6 text-white relative z-10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
                initial={{ x: '-100%', y: '-100%' }}
                whileHover={{ x: '100%', y: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Shiportrade
              </span>
              <span className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block font-medium">
                Global Supply Chain Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Position 1: Modules Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-10 px-4 text-sm font-medium text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 dark:text-gray-200 dark:hover:text-cyan-400 dark:hover:bg-cyan-950 transition-colors rounded-xl">
                  <Layers className="h-4 w-4" />
                  Modules
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-[900px] p-6 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900"
                sideOffset={12}
              >
                {/* Popular Modules Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Popular Modules
                  </h4>
                  <div className="grid grid-cols-6 gap-2">
                    {popularModules.map((module) => {
                      const Icon = module.icon;
                      return (
                        <Link
                          key={module.id}
                          href={`/tools/${module.slug}`}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                        >
                          <div className={`w-10 h-10 rounded-xl ${module.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-xs font-medium text-center truncate w-full">{module.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <DropdownMenuSeparator className="my-4" />

                {/* Modules with Tools & Documents */}
                <div className="grid grid-cols-3 gap-4">
                  {allModules.slice(0, 9).map((module) => {
                    const Icon = module.icon;
                    const categoryData = toolCategories.find(c => c.slug === module.slug);
                    const topTools = categoryData?.tools.slice(0, 3) || [];
                    
                    return (
                      <div key={module.id} className="space-y-2">
                        <Link
                          href={`/tools/${module.slug}`}
                          className="flex items-center gap-2 font-semibold hover:text-[var(--ocean)] transition-colors group"
                        >
                          <div className={`w-8 h-8 rounded-lg ${module.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm">{module.name}</span>
                          <Badge variant="outline" className="text-[10px] ml-auto">
                            {module.tools}T / {module.documents}D
                          </Badge>
                        </Link>
                        <div className="pl-10 space-y-1">
                          {topTools.map((tool) => (
                            <Link
                              key={tool.id}
                              href={`/tools/${module.slug}/${tool.slug}`}
                              className="block text-xs text-muted-foreground hover:text-[var(--ocean)] hover:translate-x-1 transition-all"
                            >
                              {tool.name}
                            </Link>
                          ))}
                          <Link
                            href={`/tools/${module.slug}`}
                            className="block text-xs text-cyan-500 hover:underline"
                          >
                            View all →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <DropdownMenuSeparator className="my-4" />
                <Link
                  href="/modules"
                  className="flex items-center justify-center text-sm font-semibold text-cyan-600 hover:underline gap-1 py-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950 transition-colors"
                >
                  <Grid3x3 className="h-4 w-4" />
                  View All 27 Modules
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Position 2: News - Simple Link */}
            <Button variant="ghost" asChild className="h-10 px-4 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-200 dark:hover:text-emerald-400 dark:hover:bg-emerald-950 transition-colors rounded-xl">
              <Link href="/news" className="gap-2">
                <Newspaper className="h-4 w-4" />
                News
              </Link>
            </Button>

            {/* Position 3: Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-10 px-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-blue-950 transition-colors rounded-xl">
                  <Calculator className="h-4 w-4" />
                  Tools
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-[800px] p-6 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900"
                sideOffset={12}
              >
                {/* Popular Tools Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Popular Tools
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {popularTools.map((tool) => {
                      const category = toolCategories.find(c => c.tools.some(t => t.id === tool.id));
                      return (
                        <Link
                          key={tool.id}
                          href={`/tools/${category?.slug}/${tool.slug}`}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <Calculator className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                          <span className="text-sm truncate">{tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <DropdownMenuSeparator className="my-4" />

                {/* Tools by Industry */}
                <div className="grid grid-cols-3 gap-4">
                  {toolCategoriesForMenu.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.id} className="space-y-2">
                        <Link
                          href={`/tools/${category.slug}`}
                          className="flex items-center gap-2 font-semibold hover:text-[var(--ocean)] transition-colors group"
                        >
                          <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm">{category.name}</span>
                        </Link>
                        <div className="pl-10 space-y-1">
                          {category.tools.map((tool) => (
                            <Link
                              key={tool.id}
                              href={`/tools/${category.slug}/${tool.slug}`}
                              className="block text-xs text-muted-foreground hover:text-[var(--ocean)] hover:translate-x-1 transition-all"
                            >
                              {tool.name}
                            </Link>
                          ))}
                          <Link
                            href={`/tools/${category.slug}`}
                            className="block text-xs text-blue-500 hover:underline"
                          >
                            View all →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <DropdownMenuSeparator className="my-4" />
                <Link
                  href="/tools"
                  className="flex items-center justify-center text-sm font-semibold text-[var(--ocean)] hover:underline gap-1 py-2 rounded-lg hover:bg-[var(--ocean)]/5 transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  View All 150+ Tools
                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Position 4: Documents Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-10 px-4 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 dark:text-gray-200 dark:hover:text-orange-400 dark:hover:bg-orange-950 transition-colors rounded-xl">
                  <FileText className="h-4 w-4" />
                  Documents
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-[800px] p-6 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900"
                sideOffset={12}
              >
                {/* Featured Documents Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Featured Documents
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {featuredDocuments.map((doc) => (
                      <Link
                        key={doc.id}
                        href={`/documents/${doc.slug}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <FileText className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm truncate">{doc.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <DropdownMenuSeparator className="my-4" />

                {/* Documents by Category */}
                <div className="grid grid-cols-3 gap-4">
                  {documentCategoriesForMenu.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.id} className="space-y-2">
                        <Link
                          href="/documents"
                          className="flex items-center gap-2 font-semibold hover:text-[var(--logistics)] transition-colors group"
                        >
                          <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm">{category.name}</span>
                        </Link>
                        <div className="pl-10 space-y-1">
                          {category.documents.map((doc) => (
                            <Link
                              key={doc.id}
                              href={`/documents/${doc.slug}`}
                              className="block text-xs text-muted-foreground hover:text-[var(--logistics)] hover:translate-x-1 transition-all"
                            >
                              {doc.name}
                            </Link>
                          ))}
                          <Link
                            href="/documents"
                            className="block text-xs text-orange-500 hover:underline"
                          >
                            View all →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <DropdownMenuSeparator className="my-4" />
                <Link
                  href="/documents"
                  className="flex items-center justify-center text-sm font-semibold text-[var(--logistics)] hover:underline gap-1 py-2 rounded-lg hover:bg-[var(--logistics)]/5 transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  View All 120+ Documents
                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Position 5: Directories */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-10 px-4 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-200 dark:hover:text-purple-400 dark:hover:bg-purple-950 transition-colors rounded-xl">
                  <Globe className="h-4 w-4" />
                  Directories
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-[750px] p-6 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900"
                sideOffset={12}
              >
                {/* Featured Directories Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Featured Directories
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    <Link
                      href="/directories/ports"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Anchor className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-center">Port Directory</span>
                      <span className="text-xs text-muted-foreground">5,000+ ports</span>
                    </Link>
                    <Link
                      href="/directories/shipping-lines"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-cyan-200 dark:hover:border-cyan-800"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Ship className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-center">Shipping Lines</span>
                      <span className="text-xs text-muted-foreground">320+ carriers</span>
                    </Link>
                    <Link
                      href="/directories"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-center">Freight Forwarders</span>
                      <span className="text-xs text-muted-foreground">Verified partners</span>
                    </Link>
                    <Link
                      href="/directories"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-center">Customs Brokers</span>
                      <span className="text-xs text-muted-foreground">Licensed agents</span>
                    </Link>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-4" />

                {/* Directories by Category */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Maritime Services */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                        <Ship className="h-3.5 w-3.5 text-white" />
                      </div>
                      Maritime Services
                    </h5>
                    <div className="space-y-1.5 pl-9">
                      <Link href="/directories/ports" className="block text-sm text-muted-foreground hover:text-purple-600 hover:translate-x-1 transition-all">
                        Global Ports
                      </Link>
                      <Link href="/directories/shipping-lines" className="block text-sm text-muted-foreground hover:text-purple-600 hover:translate-x-1 transition-all">
                        Shipping Lines
                      </Link>
                      <Link href="/directories" className="block text-sm text-muted-foreground hover:text-purple-600 hover:translate-x-1 transition-all">
                        Port Agents
                      </Link>
                      <Link href="/directories" className="block text-sm text-muted-foreground hover:text-purple-600 hover:translate-x-1 transition-all">
                        Ship Chandlers
                      </Link>
                      <Link href="/directories" className="block text-xs text-purple-500 hover:underline mt-2">
                        View all →
                      </Link>
                    </div>
                  </div>

                  {/* Logistics Partners */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <Truck className="h-3.5 w-3.5 text-white" />
                      </div>
                      Logistics Partners
                    </h5>
                    <div className="space-y-1.5 pl-9">
                      <Link href="/directories" className="block text-sm text-muted-foreground hover:text-blue-600 hover:translate-x-1 transition-all">
                        Freight Forwarders
                      </Link>
                      <Link href="/directories" className="block text-sm text-muted-foreground hover:text-blue-600 hover:translate-x-1 transition-all">
                        NVOCCs
                      </Link>
                      <Link href="/directories" className="block text-sm text-muted-foreground hover:text-blue-600 hover:translate-x-1 transition-all">
                        Air Cargo Agents
                      </Link>
                      <Link href="/directories" className="block text-sm text-muted-foreground hover:text-blue-600 hover:translate-x-1 transition-all">
                        Trucking Companies
                      </Link>
                      <Link href="/directories" className="block text-xs text-blue-500 hover:underline mt-2">
                        View all →
                      </Link>
                    </div>
                  </div>

                  {/* Trade Services */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <Building2 className="h-3.5 w-3.5 text-white" />
                      </div>
                      Trade Services
                    </h5>
                    <div className="space-y-1.5 pl-9">
                      <Link href="/directories" className="block text-sm text-muted-foreground hover:text-emerald-600 hover:translate-x-1 transition-all">
                        Customs Brokers
                      </Link>
                      <Link href="/directories" className="block text-sm text-muted-foreground hover:text-emerald-600 hover:translate-x-1 transition-all">
                        Trade Consultants
                      </Link>
                      <Link href="/directories" className="block text-sm text-muted-foreground hover:text-emerald-600 hover:translate-x-1 transition-all">
                        Trade Finance
                      </Link>
                      <Link href="/directories" className="block text-sm text-muted-foreground hover:text-emerald-600 hover:translate-x-1 transition-all">
                        Insurance Providers
                      </Link>
                      <Link href="/directories" className="block text-xs text-emerald-500 hover:underline mt-2">
                        View all →
                      </Link>
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-4" />
                
                {/* Bottom Links */}
                <div className="flex items-center justify-between">
                  <Link
                    href="/directories"
                    className="flex items-center text-sm font-semibold text-purple-600 hover:underline gap-1 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    View All Directories
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Verified Companies
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-blue-500" />
                      Global Coverage
                    </span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Position 6: Trade Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-10 px-4 text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-200 dark:hover:text-amber-400 dark:hover:bg-amber-950 transition-colors rounded-xl">
                  <TrendingUp className="h-4 w-4" />
                  Trade
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-[600px] p-6 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900"
                sideOffset={12}
              >
                {/* Trade Categories Grid */}
                <div className="grid grid-cols-4 gap-3">
                  <Link
                    href="/trade/commodities"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">Commodities</span>
                    <span className="text-xs text-muted-foreground text-center">Oil, Gold, Silver</span>
                  </Link>
                  <Link
                    href="/trade/indexes"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">Indexes</span>
                    <span className="text-xs text-muted-foreground text-center">S&P, NASDAQ, DOW</span>
                  </Link>
                  <Link
                    href="/trade/shares"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">Shares</span>
                    <span className="text-xs text-muted-foreground text-center">Top Stocks</span>
                  </Link>
                  <Link
                    href="/trade/currencies"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">Currencies</span>
                    <span className="text-xs text-muted-foreground text-center">Forex Rates</span>
                  </Link>
                  <Link
                    href="/trade/crypto"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">Crypto</span>
                    <span className="text-xs text-muted-foreground text-center">Bitcoin, ETH</span>
                  </Link>
                  <Link
                    href="/trade/bonds"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Landmark className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">Bonds</span>
                    <span className="text-xs text-muted-foreground text-center">Treasury Yields</span>
                  </Link>
                  <Link
                    href="/trade/earnings"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">Earnings</span>
                    <span className="text-xs text-muted-foreground text-center">Company Reports</span>
                  </Link>
                  <Link
                    href="/trade/freight-index"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Ship className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">Freight Index</span>
                    <span className="text-xs text-muted-foreground text-center">BDI, FBX, SCFI</span>
                  </Link>
                </div>

                <DropdownMenuSeparator className="my-4" />
                <Link
                  href="/trade"
                  className="flex items-center justify-center text-sm font-semibold text-amber-600 hover:underline gap-1 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                >
                  <Grid3x3 className="h-4 w-4" />
                  View All Markets
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Position 7: Marketplace Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-10 px-4 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-200 dark:hover:text-emerald-400 dark:hover:bg-emerald-950 transition-colors rounded-xl">
                  <Store className="h-4 w-4" />
                  Marketplace
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-[950px] p-6 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900"
                sideOffset={12}
              >
                {/* 9 Categories in 3-Column Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Column 1: Containers, Freight & Shipping, Transport & Trucking */}
                  <div className="space-y-5">
                    {/* 1. Containers */}
                    <div className="space-y-2">
                      <Link
                        href="/marketplace/containers"
                        className="flex items-center gap-2 font-semibold hover:text-emerald-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Container className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm">Containers</span>
                      </Link>
                      <div className="pl-10 space-y-1">
                        <Link href="/marketplace/containers/buy" className="block text-xs text-muted-foreground hover:text-emerald-600 hover:translate-x-1 transition-all">Buy Containers</Link>
                        <Link href="/marketplace/containers/sell" className="block text-xs text-muted-foreground hover:text-emerald-600 hover:translate-x-1 transition-all">Sell Containers</Link>
                        <Link href="/marketplace/containers/lease" className="block text-xs text-muted-foreground hover:text-emerald-600 hover:translate-x-1 transition-all">Lease Containers</Link>
                        <Link href="/marketplace/containers/reefer" className="block text-xs text-muted-foreground hover:text-emerald-600 hover:translate-x-1 transition-all">Reefer Containers</Link>
                        <Link href="/marketplace/containers/special" className="block text-xs text-muted-foreground hover:text-emerald-600 hover:translate-x-1 transition-all">Special Containers</Link>
                      </div>
                    </div>
                    
                    {/* 2. Freight & Shipping */}
                    <div className="space-y-2">
                      <Link
                        href="/marketplace/freight"
                        className="flex items-center gap-2 font-semibold hover:text-cyan-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Ship className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm">Freight & Shipping</span>
                      </Link>
                      <div className="pl-10 space-y-1">
                        <Link href="/marketplace/freight/quote" className="block text-xs text-muted-foreground hover:text-cyan-600 hover:translate-x-1 transition-all">Get Freight Quote</Link>
                        <Link href="/marketplace/freight/post" className="block text-xs text-muted-foreground hover:text-cyan-600 hover:translate-x-1 transition-all">Post Shipment (RFQ)</Link>
                        <Link href="/marketplace/freight/forwarders" className="block text-xs text-muted-foreground hover:text-cyan-600 hover:translate-x-1 transition-all">Find Freight Forwarder</Link>
                        <Link href="/marketplace/freight/book" className="block text-xs text-muted-foreground hover:text-cyan-600 hover:translate-x-1 transition-all">Book Shipment</Link>
                      </div>
                    </div>
                    
                    {/* 3. Transport & Trucking */}
                    <div className="space-y-2">
                      <Link
                        href="/marketplace/transport"
                        className="flex items-center gap-2 font-semibold hover:text-orange-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Truck className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm">Transport & Trucking</span>
                      </Link>
                      <div className="pl-10 space-y-1">
                        <Link href="/marketplace/transport/trucks" className="block text-xs text-muted-foreground hover:text-orange-600 hover:translate-x-1 transition-all">Find Truck</Link>
                        <Link href="/marketplace/transport/post-load" className="block text-xs text-muted-foreground hover:text-orange-600 hover:translate-x-1 transition-all">Post Load</Link>
                        <Link href="/marketplace/transport/available" className="block text-xs text-muted-foreground hover:text-orange-600 hover:translate-x-1 transition-all">Available Trucks</Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Column 2: Warehousing, Vessel & Chartering, Logistics Services */}
                  <div className="space-y-5">
                    {/* 4. Warehousing */}
                    <div className="space-y-2">
                      <Link
                        href="/marketplace/warehousing"
                        className="flex items-center gap-2 font-semibold hover:text-violet-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Warehouse className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm">Warehousing</span>
                      </Link>
                      <div className="pl-10 space-y-1">
                        <Link href="/marketplace/warehousing/find" className="block text-xs text-muted-foreground hover:text-violet-600 hover:translate-x-1 transition-all">Find Warehouse</Link>
                        <Link href="/marketplace/warehousing/list" className="block text-xs text-muted-foreground hover:text-violet-600 hover:translate-x-1 transition-all">List Warehouse</Link>
                        <Link href="/marketplace/warehousing/cold-storage" className="block text-xs text-muted-foreground hover:text-violet-600 hover:translate-x-1 transition-all">Cold Storage</Link>
                        <Link href="/marketplace/warehousing/fulfillment" className="block text-xs text-muted-foreground hover:text-violet-600 hover:translate-x-1 transition-all">Fulfillment Centers</Link>
                      </div>
                    </div>
                    
                    {/* 5. Vessel & Chartering */}
                    <div className="space-y-2">
                      <Link
                        href="/marketplace/vessels"
                        className="flex items-center gap-2 font-semibold hover:text-blue-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Anchor className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm">Vessel & Chartering</span>
                      </Link>
                      <div className="pl-10 space-y-1">
                        <Link href="/marketplace/vessels/charter" className="block text-xs text-muted-foreground hover:text-blue-600 hover:translate-x-1 transition-all">Charter Vessel</Link>
                        <Link href="/marketplace/vessels/list" className="block text-xs text-muted-foreground hover:text-blue-600 hover:translate-x-1 transition-all">List Vessel</Link>
                        <Link href="/marketplace/vessels/cargo" className="block text-xs text-muted-foreground hover:text-blue-600 hover:translate-x-1 transition-all">Cargo for Vessel</Link>
                      </div>
                    </div>
                    
                    {/* 6. Logistics Services */}
                    <div className="space-y-2">
                      <Link
                        href="/marketplace/services"
                        className="flex items-center gap-2 font-semibold hover:text-rose-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Handshake className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm">Logistics Services</span>
                      </Link>
                      <div className="pl-10 space-y-1">
                        <Link href="/marketplace/services/customs" className="block text-xs text-muted-foreground hover:text-rose-600 hover:translate-x-1 transition-all">Customs Clearance</Link>
                        <Link href="/marketplace/services/forwarders" className="block text-xs text-muted-foreground hover:text-rose-600 hover:translate-x-1 transition-all">Freight Forwarders</Link>
                        <Link href="/marketplace/services/inspection" className="block text-xs text-muted-foreground hover:text-rose-600 hover:translate-x-1 transition-all">Inspection Services</Link>
                        <Link href="/marketplace/services/insurance" className="block text-xs text-muted-foreground hover:text-rose-600 hover:translate-x-1 transition-all">Insurance Providers</Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Column 3: Equipment & Machinery, Marine Spare Parts, B2B Trade */}
                  <div className="space-y-5">
                    {/* 7. Equipment & Machinery */}
                    <div className="space-y-2">
                      <Link
                        href="/marketplace/equipment"
                        className="flex items-center gap-2 font-semibold hover:text-slate-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Wrench className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm">Equipment & Machinery</span>
                      </Link>
                      <div className="pl-10 space-y-1">
                        <Link href="/marketplace/equipment/port" className="block text-xs text-muted-foreground hover:text-slate-600 hover:translate-x-1 transition-all">Port Equipment</Link>
                        <Link href="/marketplace/equipment/cranes" className="block text-xs text-muted-foreground hover:text-slate-600 hover:translate-x-1 transition-all">Cranes</Link>
                        <Link href="/marketplace/equipment/handling" className="block text-xs text-muted-foreground hover:text-slate-600 hover:translate-x-1 transition-all">Material Handling</Link>
                      </div>
                    </div>
                    
                    {/* 8. Marine Spare Parts */}
                    <div className="space-y-2">
                      <Link
                        href="/marketplace/parts"
                        className="flex items-center gap-2 font-semibold hover:text-sky-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Wrench className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm">Marine Spare Parts</span>
                      </Link>
                      <div className="pl-10 space-y-1">
                        <Link href="/marketplace/parts/engine" className="block text-xs text-muted-foreground hover:text-sky-600 hover:translate-x-1 transition-all">Engine Parts</Link>
                        <Link href="/marketplace/parts/equipment" className="block text-xs text-muted-foreground hover:text-sky-600 hover:translate-x-1 transition-all">Ship Equipment</Link>
                        <Link href="/marketplace/parts/navigation" className="block text-xs text-muted-foreground hover:text-sky-600 hover:translate-x-1 transition-all">Navigation Systems</Link>
                      </div>
                    </div>
                    
                    {/* 9. B2B Trade */}
                    <div className="space-y-2">
                      <Link
                        href="/marketplace/b2b"
                        className="flex items-center gap-2 font-semibold hover:text-indigo-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm">B2B Trade</span>
                      </Link>
                      <div className="pl-10 space-y-1">
                        <Link href="/marketplace/b2b/buyers" className="block text-xs text-muted-foreground hover:text-indigo-600 hover:translate-x-1 transition-all">Find Buyers</Link>
                        <Link href="/marketplace/b2b/suppliers" className="block text-xs text-muted-foreground hover:text-indigo-600 hover:translate-x-1 transition-all">Find Suppliers</Link>
                        <Link href="/marketplace/b2b/commodities" className="block text-xs text-muted-foreground hover:text-indigo-600 hover:translate-x-1 transition-all">Commodity Listings</Link>
                        <Link href="/marketplace/b2b/rfqs" className="block text-xs text-muted-foreground hover:text-indigo-600 hover:translate-x-1 transition-all">RFQs</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-4" />
                <div className="flex items-center justify-between">
                  <Link
                    href="/marketplace"
                    className="flex items-center text-sm font-semibold text-emerald-600 hover:underline gap-1 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                  >
                    <Store className="h-4 w-4" />
                    Browse Full Marketplace
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Verified Listings
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-blue-500" />
                      Global Network
                    </span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Position 8: TradeFlow Hub - Lighter Ghost Style */}
            <Button variant="ghost" asChild className="h-10 px-4 text-sm font-medium text-gray-700 hover:text-emerald-500 hover:bg-emerald-50/50 dark:text-gray-300 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/50 transition-colors rounded-xl">
              <Link href="/tradeflow-hub" className="gap-2">
                <Sparkles className="h-4 w-4" />
                TradeFlow Hub
                <Badge className="ml-1 px-1.5 py-0 text-[10px] bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 border-0">NEW</Badge>
              </Link>
            </Button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex gap-2 h-10 px-3 text-sm rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-blue-950">
                  <DollarSign className="h-4 w-4" />
                  {selectedCurrency}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-0 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900" sideOffset={8}>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search currencies..." 
                      className="pl-9 h-9 text-sm"
                      onChange={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.dataset.searchQuery = input.value.toLowerCase();
                      }}
                    />
                  </div>
                </div>
                <ScrollArea className="h-[350px]">
                  {/* Popular Currencies */}
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Popular</div>
                    {popularCurrencies.slice(0, 8).map((code) => {
                      const currency = currencies.find((c) => c.code === code);
                      if (!currency) return null;
                      return (
                        <DropdownMenuItem
                          key={code}
                          onClick={() => setSelectedCurrency(code)}
                          className={`cursor-pointer rounded-lg py-2.5 ${selectedCurrency === code ? "bg-[var(--ocean)]/10 text-[var(--ocean)]" : ""}`}
                        >
                          <span className="text-lg mr-2">{currency.flag}</span>
                          <span className="w-10 font-semibold">{code}</span>
                          <span className="text-muted-foreground text-xs flex-1">{currency.country}</span>
                          <span className="font-medium text-sm">{currency.symbol}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>

                  {/* All Currencies by Region */}
                  {Object.entries(regionalCurrencies).map(([region, codes]) => (
                    <div key={region} className="p-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{region}</div>
                      {codes.map((code) => {
                        const currency = currencies.find((c) => c.code === code);
                        if (!currency) return null;
                        return (
                          <DropdownMenuItem
                            key={code}
                            onClick={() => setSelectedCurrency(code)}
                            className={`cursor-pointer rounded-lg py-2.5 ${selectedCurrency === code ? "bg-[var(--ocean)]/10 text-[var(--ocean)]" : ""}`}
                          >
                            <span className="text-lg mr-2">{currency.flag}</span>
                            <span className="w-10 font-semibold">{code}</span>
                            <span className="text-muted-foreground text-xs flex-1">{currency.country}</span>
                            <span className="font-medium text-sm">{currency.symbol}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  ))}
                </ScrollArea>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="px-2 py-1 text-xs text-muted-foreground text-center">
                    {currencies.length}+ currencies supported
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            {mounted && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-10 w-10 rounded-xl text-gray-700 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-200 dark:hover:text-amber-400 dark:hover:bg-amber-950">
                  <AnimatePresence mode="wait" initial={false}>
                    {theme === "dark" ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="h-5 w-5 text-[var(--accent-amber)]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex h-10 w-10 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-blue-950">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-3 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900" sideOffset={8}>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2.5 focus:bg-[var(--ocean)]/5">
                  <Link href="/login" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <LogIn className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">Sign In</span>
                      <p className="text-xs text-muted-foreground">Access your account</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2.5 focus:bg-[var(--logistics)]/5">
                  <Link href="/register" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg icon-logistics flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="font-medium">Create Free Account</span>
                      <p className="text-xs text-muted-foreground">Get started today</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2.5">
                  <Link href="/profile" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Settings className="h-4 w-4" />
                    </div>
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-blue-950">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[340px] sm:w-[400px] p-0 border-0">
                <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl icon-ocean flex items-center justify-center">
                        <Ship className="h-5 w-5 text-white" />
                      </div>
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-6">
                    <nav className="flex flex-col gap-2">
                      {/* AI Search Engine - Featured */}
                      <Link
                        href="/ai-search"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/80 to-cyan-500/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold text-blue-600 transition-colors flex items-center gap-2">
                            AI Search
                            <Badge className="text-[10px] bg-blue-500 text-white border-0">NEW</Badge>
                          </span>
                          <p className="text-xs text-muted-foreground">Quantum AI intelligence</p>
                        </div>
                      </Link>
                      {/* TradeFlow Hub - Featured */}
                      <Link
                        href="/tradeflow-hub"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/80 to-teal-500/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold text-emerald-600 transition-colors flex items-center gap-2">
                            TradeFlow Hub
                            <Badge className="text-[10px] bg-emerald-500 text-white border-0">NEW</Badge>
                          </span>
                          <p className="text-xs text-muted-foreground">Your personalized dashboard</p>
                        </div>
                      </Link>
                      {[
                        { icon: Layers, label: "Modules", href: "/modules", color: "bg-gradient-to-br from-cyan-500 to-blue-500", desc: "27 categories" },
                        { icon: Newspaper, label: "News", href: "/news", color: "bg-gradient-to-br from-emerald-500 to-teal-500", desc: "Latest updates" },
                        { icon: Calculator, label: "Tools", href: "/tools", color: "icon-ocean", desc: "150+ calculators" },
                        { icon: FileText, label: "Documents", href: "/documents", color: "icon-logistics", desc: "120+ templates" },
                        { icon: Globe, label: "Directories", href: "/directories/ports", color: "icon-air", desc: "Global ports" },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors group"
                          >
                            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <span className="font-semibold group-hover:text-[var(--ocean)] transition-colors">
                                {item.label}
                              </span>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                  <div className="p-6 border-t bg-muted/30">
                    <Button className="w-full btn-gradient text-white gap-2 h-14 text-lg" asChild>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Sparkles className="h-5 w-5" />
                        Get Started Free
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Command Palette Search */}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput placeholder="Search tools, documents, modules, features..." />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found. Try a different search term.</CommandEmpty>
          
          <CommandGroup heading="⭐ Featured">
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/ai-search"; }}>
              <Bot className="mr-3 h-4 w-4 text-blue-500" />
              AI Search Engine
              <Badge className="ml-2 text-[10px] bg-blue-500 text-white border-0">NEW</Badge>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/tradeflow-hub"; }}>
              <Sparkles className="mr-3 h-4 w-4 text-emerald-500" />
              TradeFlow Hub
              <Badge className="ml-2 text-[10px] bg-emerald-500 text-white border-0">NEW</Badge>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/modules"; }}>
              <Layers className="mr-3 h-4 w-4 text-cyan-500" />
              All Modules
              <span className="ml-2 text-xs text-muted-foreground">27 learning paths</span>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/tools"; }}>
              <Grid3x3 className="mr-3 h-4 w-4 text-cyan-500" />
              All Tools
              <span className="ml-2 text-xs text-muted-foreground">150+ calculators</span>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/documents"; }}>
              <FileText className="mr-3 h-4 w-4 text-emerald-500" />
              All Documents
              <span className="ml-2 text-xs text-muted-foreground">120+ templates</span>
            </CommandItem>
          </CommandGroup>
          
          <CommandGroup heading="🔧 Popular Tools">
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/tools/international-trade/landed-cost-calculator"; }}>
              <Calculator className="mr-3 h-4 w-4 text-[var(--ocean)]" />
              Landed Cost Calculator
              <span className="ml-2 text-xs text-muted-foreground">Import costs</span>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/tools/ocean-freight/cbm-calculator"; }}>
              <Ship className="mr-3 h-4 w-4 text-[var(--logistics)]" />
              CBM Calculator
              <span className="ml-2 text-xs text-muted-foreground">Cargo volume</span>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/tools/ocean-freight/fcl-loadability"; }}>
              <Ship className="mr-3 h-4 w-4 text-blue-500" />
              FCL Loadability
              <span className="ml-2 text-xs text-muted-foreground">Container fit</span>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/tools/ocean-freight/container-tracking"; }}>
              <Ship className="mr-3 h-4 w-4 text-purple-500" />
              Container Tracking
              <span className="ml-2 text-xs text-muted-foreground">Real-time</span>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/tools/international-trade/currency-converter"; }}>
              <DollarSign className="mr-3 h-4 w-4 text-[var(--accent-emerald)]" />
              Currency Converter
              <span className="ml-2 text-xs text-muted-foreground">180+ currencies</span>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/tools/customs-compliance/hs-code-search"; }}>
              <Search className="mr-3 h-4 w-4 text-[var(--accent-purple)]" />
              HS Code Search
              <span className="ml-2 text-xs text-muted-foreground">Classification</span>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/tools/international-trade/incoterms-guide"; }}>
              <Globe className="mr-3 h-4 w-4 text-indigo-500" />
              Incoterms Guide
              <span className="ml-2 text-xs text-muted-foreground">2020 rules</span>
            </CommandItem>
            <CommandItem onSelect={() => { setIsSearchOpen(false); window.location.href = "/tools/sustainability/carbon-footprint"; }}>
              <Leaf className="mr-3 h-4 w-4 text-green-500" />
              Carbon Footprint
              <span className="ml-2 text-xs text-muted-foreground">CO2 emissions</span>
            </CommandItem>
          </CommandGroup>
          
          <CommandGroup heading="📦 Modules">
            {allModules.slice(0, 8).map((module) => {
              const Icon = module.icon;
              return (
                <CommandItem 
                  key={module.id}
                  onSelect={() => { setIsSearchOpen(false); window.location.href = `/tools/${module.slug}`; }}
                >
                  <Icon className="mr-3 h-4 w-4 text-muted-foreground" />
                  {module.name}
                  <span className="ml-2 text-xs text-muted-foreground">{module.tools} tools</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </motion.header>
  );
}
