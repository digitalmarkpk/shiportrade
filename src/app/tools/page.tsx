"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  TrendingUp,
  Award,
  Users,
  Calculator,
  Zap,
  ArrowRight,
  Package,
  Ship,
  Plane,
  Shield,
  DollarSign,
  BookOpen,
  Warehouse,
  FileText,
  ChevronDown,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

const allTools = [
  { id: 1, name: "CBM Calculator", desc: "Calculate cubic meters for shipping", href: "/tools/ocean-freight/cbm-calculator", icon: "package", category: "Ocean", uses: 45200, trending: true },
  { id: 2, name: "Container Load Planner", desc: "Optimize container space", href: "/tools/ocean-freight/container-loading-calculator", icon: "ship", category: "Ocean", uses: 38100, trending: true },
  { id: 3, name: "Volumetric Weight Calculator", desc: "Air freight chargeable weight", href: "/tools/air-freight/volumetric-weight", icon: "plane", category: "Air", uses: 32400, trending: true },
  { id: 4, name: "Container Tracking", desc: "Track any container worldwide", href: "/tools/ocean-freight/container-tracking", icon: "ship", category: "Ocean", uses: 29800, trending: false },
  { id: 5, name: "HS Code Finder", desc: "Find customs tariff codes", href: "/tools/customs-compliance/hs-code-search", icon: "search", category: "Customs", uses: 22100, trending: true },
  { id: 6, name: "Freight Rate Calculator", desc: "Compare ocean and air rates", href: "/tools/ocean-freight/freight-rate-calculator", icon: "dollar-sign", category: "Ocean", uses: 19300, trending: false },
  { id: 7, name: "Currency Converter", desc: "Live exchange rates", href: "/tools/international-trade/currency-converter", icon: "dollar-sign", category: "Finance", uses: 18200, trending: false },
  { id: 8, name: "Incoterms Guide", desc: "2020 rules explained", href: "/tools/international-trade/incoterms-guide", icon: "book-open", category: "Trade", uses: 16700, trending: false },
  { id: 9, name: "Pallet Calculator", desc: "Calculate pallet loads", href: "/tools/warehousing/pallet-calculator", icon: "package", category: "Warehouse", uses: 15400, trending: false },
  { id: 10, name: "Duty Calculator", desc: "Calculate import duties", href: "/tools/customs-compliance/duty-calculator", icon: "calculator", category: "Customs", uses: 14200, trending: false },
  { id: 11, name: "Distance & Time", desc: "Port to port transit", href: "/tools/ocean-freight/transit-time", icon: "ship", category: "Ocean", uses: 13800, trending: false },
  { id: 12, name: "Landed Cost Calculator", desc: "Total cost to door", href: "/tools/international-trade/landed-cost-calculator", icon: "dollar-sign", category: "Finance", uses: 12100, trending: false },
];

const categories = [
  { name: "Ocean Freight", count: 33, icon: "ship", color: "#0F4C81", tools: ["CBM Calculator", "Container Planner", "Tracking"], slug: "ocean-freight" },
  { name: "Air Cargo", count: 5, icon: "plane", color: "#8B5CF6", tools: ["Volumetric Weight", "Air Tracking"], slug: "air-cargo" },
  { name: "Customs & Trade", count: 14, icon: "shield", color: "#059669", tools: ["HS Code", "Duty Calculator"], slug: "customs-compliance" },
  { name: "Warehousing", count: 22, icon: "warehouse", color: "#EA580C", tools: ["Pallet Calculator", "Storage"], slug: "warehousing" },
  { name: "Finance", count: 18, icon: "dollar-sign", color: "#DC2626", tools: ["Currency", "Landed Cost"], slug: "finance" },
  { name: "Documents", count: 13, icon: "file-text", color: "#4B5563", tools: ["Commercial Invoice", "Packing List"], slug: "documents" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  package: Package,
  ship: Ship,
  plane: Plane,
  shield: Shield,
  "dollar-sign": DollarSign,
  "book-open": BookOpen,
  warehouse: Warehouse,
  "file-text": FileText,
  search: Search,
  calculator: Calculator,
};

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingTools = useMemo(
    () => allTools.filter((tool) => tool.trending).slice(0, 4),
    []
  );

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return allTools.slice(0, 8);
    }
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {!showSearchResults && (
          <>
            <TrendingSection tools={trendingTools} />
            <ToolsGridSection tools={allTools.slice(0, 8)} />
          </>
        )}

        {showSearchResults && (
          <SearchResultsSection tools={filteredTools} query={searchQuery} />
        )}

        <CategoriesSection />

        <SEOBlock />
      </div>
    </div>
  );
}

function HeroSection({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <section className="mb-16">
      <div className="mb-8 flex items-center justify-center">
        <Badge
          variant="secondary"
          className="gap-2 px-4 py-1.5 text-sm font-medium"
          style={{ backgroundColor: `${OCEAN_BLUE}15`, color: OCEAN_BLUE }}
        >
          <Award className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
          World&apos;s Largest Logistics Toolkit
        </Badge>
      </div>

      <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        190 Free Tools for{" "}
        <span className="text-[#0F4C81]">Global Trade</span>
      </h1>

      <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-slate-600">
        Calculate CBM, plan container loads, find HS codes, track shipments, and more.
        Trusted by 50,000+ freight forwarders worldwide.
      </p>

      <div className="mx-auto mb-10 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search tools (e.g., CBM calculator, HS code, container)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 rounded-xl border-slate-200 pl-12 pr-4 text-base shadow-sm transition-shadow focus:border-slate-300 focus:shadow-md"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
          <span>
            <strong className="text-slate-900">50,247</strong> users this month
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
          <span>
            <strong className="text-slate-900">127K</strong> calculations today
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
          <span>
            <strong className="text-slate-900">Free</strong> forever
          </span>
        </div>
      </div>
    </section>
  );
}

function TrendingSection({ tools }: { tools: typeof allTools }) {
  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="h-6 w-6" style={{ color: OCEAN_BLUE }} />
        <h2 className="text-2xl font-bold text-slate-900">Trending Now</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => {
          const IconComponent = iconMap[tool.icon] || Package;
          return (
            <Link key={tool.id} href={tool.href}>
              <Card className="group h-full cursor-pointer border-slate-200 transition-all hover:border-slate-300 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${OCEAN_BLUE}15` }}
                    >
                      <IconComponent
                        className="h-5 w-5"
                        style={{ color: OCEAN_BLUE }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-600"
                      >
                        HOT
                      </Badge>
                    </div>
                  </div>
                  <h3 className="mb-1 font-semibold text-slate-900 group-hover:text-[#0F4C81]">
                    {tool.name}
                  </h3>
                  <p className="mb-3 text-sm text-slate-500 line-clamp-2">
                    {tool.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {formatNumber(tool.uses)} uses
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#0F4C81]" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ToolsGridSection({ tools }: { tools: typeof allTools }) {
  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Popular Tools</h2>
        <Link href="/tools">
          <Button
            variant="ghost"
            className="text-[#0F4C81] hover:text-[#0F4C81] hover:bg-[#0F4C81]/10"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => {
          const IconComponent = iconMap[tool.icon] || Package;
          return (
            <Link key={tool.id} href={tool.href}>
              <Card className="group flex h-full cursor-pointer items-center gap-4 border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${OCEAN_BLUE}15` }}
                >
                  <IconComponent
                    className="h-6 w-6"
                    style={{ color: OCEAN_BLUE }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-slate-900 group-hover:text-[#0F4C81]">
                    {tool.name}
                  </h3>
                  <p className="truncate text-sm text-slate-500">
                    {tool.desc}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SearchResultsSection({
  tools,
  query,
}: {
  tools: typeof allTools;
  query: string;
}) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {tools.length > 0
            ? `Results for "${query}"`
            : `No results for "${query}"`}
        </h2>
        {tools.length > 0 && (
          <p className="text-sm text-slate-500">
            Found {tools.length} tool{tools.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {tools.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const IconComponent = iconMap[tool.icon] || Package;
            return (
              <Link key={tool.id} href={tool.href}>
                <Card className="group flex h-full cursor-pointer items-center gap-4 border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-sm">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${OCEAN_BLUE}15` }}
                  >
                    <IconComponent
                      className="h-6 w-6"
                      style={{ color: OCEAN_BLUE }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-slate-900 group-hover:text-[#0F4C81]">
                      {tool.name}
                    </h3>
                    <p className="truncate text-sm text-slate-500">
                      {tool.desc}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#0F4C81]" />
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="border-slate-200 p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h3 className="mb-2 text-lg font-medium text-slate-900">
            No tools match your search
          </h3>
          <p className="text-sm text-slate-500">
            Try searching for something else, like &quot;CBM&quot;, &quot;HS code&quot;, or
            &quot;container&quot;
          </p>
        </Card>
      )}
    </section>
  );
}

function CategoriesSection() {
  const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
    ship: Ship,
    plane: Plane,
    shield: Shield,
    "dollar-sign": DollarSign,
    "book-open": BookOpen,
    warehouse: Warehouse,
    "file-text": FileText,
  };

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Browse by Category
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const IconComponent = iconComponents[category.icon] || Package;
          return (
            <Link key={category.name} href={`/tools/${category.slug}`}>
              <Card className="group h-full cursor-pointer border-slate-200 transition-all hover:border-slate-300 hover:shadow-md">
                <CardContent className="p-6">
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <IconComponent
                      className="h-6 w-6"
                      style={{ color: category.color }}
                    />
                  </div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="font-semibold text-slate-900 group-hover:text-[#0F4C81]">
                      {category.name}
                    </h3>
                    <span className="text-sm text-slate-500">
                      {category.count} tools
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {category.tools.join(", ")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SEOBlock() {
  return (
    <section className="border-t border-slate-200 pt-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Free Logistics Calculators for International Shipping
        </h2>

        <div className="prose prose-slate max-w-none">
          <p className="mb-4 text-slate-600">
            Shiportrade offers a comprehensive suite of free logistics calculators
            designed for freight forwarders, customs brokers, and international
            trade professionals. Our tools help you calculate shipping costs,
            plan container loads, and ensure compliance with customs regulations
            across global trade lanes.
          </p>

          <p className="mb-6 text-slate-600">
            Whether you need to calculate CBM for ocean freight, determine
            volumetric weight for air cargo, or find the right HS code for
            customs declaration, our free tools provide accurate results in
            seconds—no signup required.
          </p>

          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Popular Tools Included:
          </h3>
          <ul className="mb-6 space-y-2 text-slate-600">
            <li className="flex items-center gap-2">
              <Calculator className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
              <span>CBM Calculator – Calculate cubic meters for ocean freight</span>
            </li>
            <li className="flex items-center gap-2">
              <Ship className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
              <span>Container Load Planner – Optimize container space utilization</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
              <span>HS Code Finder – Search customs tariff codes by keyword</span>
            </li>
            <li className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
              <span>Freight Rate Calculator – Compare shipping costs across carriers</span>
            </li>
            <li className="flex items-center gap-2">
              <Package className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
              <span>Volumetric Weight Calculator – Determine air freight charges</span>
            </li>
          </ul>

          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Why Use Shiportrade Tools?
          </h3>
          <ul className="mb-8 space-y-2 text-slate-600">
            <li className="flex items-center gap-2">
              <span style={{ color: LOGISTICS_GREEN }}>✓</span>
              <span>100% free with no signup required</span>
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: LOGISTICS_GREEN }}>✓</span>
              <span>Calculations based on industry-standard formulas</span>
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: LOGISTICS_GREEN }}>✓</span>
              <span>Mobile-responsive design works on any device</span>
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: LOGISTICS_GREEN }}>✓</span>
              <span>Trusted by 50,000+ logistics professionals monthly</span>
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: LOGISTICS_GREEN }}>✓</span>
              <span>Updated regularly with new features and tools</span>
            </li>
          </ul>

          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            <details className="group rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900">
                What is a CBM Calculator and why do I need it?
                <ChevronDown className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                CBM (Cubic Meter) is a standard measurement used in shipping to
                calculate the volume of cargo. Our CBM calculator helps you
                determine how much space your shipment will occupy in a
                container, enabling better load planning and cost estimation
                for ocean freight shipments.
              </p>
            </details>

            <details className="group rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900">
                How do I find the correct HS Code for my product?
                <ChevronDown className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                HS Codes (Harmonized System Codes) are international standardized
                numbers used to classify products for customs. Use our HS Code
                Finder tool to search by product name, keyword, or industry to
                locate the correct code for your goods. Always verify with your
                customs broker for accuracy.
              </p>
            </details>

            <details className="group rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900">
                Are these shipping calculators really free to use?
                <ChevronDown className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                Yes! All Shiportrade tools are completely free to use with no
                signup required. We believe in providing accessible resources
                for the logistics community. Our tools are funded by premium
                features and partnerships with industry service providers.
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}