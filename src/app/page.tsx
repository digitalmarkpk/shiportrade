// src/app/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { 
  Ship, 
  Calculator, 
  Container, 
  Globe, 
  ArrowRight, 
  Zap,
  BarChart3,
  Anchor,
  Shield,
  Clock,
  Search,
  Package,
  Boxes,
  MapPin,
  Newspaper,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { WebSiteSchema } from "@/components/seo/WebSiteSchema";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shiportrade - Free Global Shipping Tools & Freight Calculators",
  description: "Calculate CBM, plan containers, find HS codes, track carriers. 200+ free tools for logistics professionals worldwide. No signup.",
  keywords: ["shipping tools", "freight calculator", "cbm calculator", "container load planner", "hs code finder", "landed cost calculator", "demurrage calculator", "volumetric weight", "incoterms", "freight rate", "customs duty"],
  alternates: { canonical: "https://shiportrade.com" },
  openGraph: {
    title: "Shiportrade - Free Global Shipping Tools",
    description: "200+ free tools for freight forwarders worldwide",
    url: "https://shiportrade.com",
    siteName: "Shiportrade",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Shiportrade",
  "url": "https://shiportrade.com",
  "description": "200+ free tools for logistics professionals worldwide",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://shiportrade.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const FEATURED_TOOLS = [
  {
    title: "CBM Calculator",
    description: "Instantly calculate cubic meters for sea, air, and road freight with container fit analysis.",
    icon: Container,
    href: "/tools/ocean-freight/cbm-calculator",
    color: "#0ea5e9"
  },
  {
    title: "Container Load Planner",
    description: "Optimize your container space. Plan and visualize cargo loading for maximum efficiency.",
    icon: Boxes,
    href: "/tools/ocean-freight/container-load-planner",
    color: "#14b8a6"
  },
  {
    title: "HS Code Finder",
    description: "Search and classify products using the global Harmonized System for customs compliance.",
    icon: Search,
    href: "/tools/customs-compliance/hs-code-search",
    color: "#8b5cf6"
  }
];

const ALL_TOOLS = [
  { name: "Landed Cost", href: "/tools/international-trade/landed-cost-calculator", icon: Calculator },
  { name: "Freight Index", href: "/tools/ocean-freight/freight-index", icon: BarChart3 },
  { name: "Port Finder", href: "/directories/ports", icon: Anchor },
  { name: "Currency Converter", href: "/tools/international-trade/currency-converter", icon: Globe },
  { name: "Volumetric Weight", href: "/tools/air-freight/volumetric-weight", icon: Package },
  { name: "Incoterms Guide", href: "/tools/international-trade/incoterms-guide", icon: Shield },
  { name: "Demurrage Calc", href: "/tools/ocean-freight/demurrage-calculator", icon: Clock },
  { name: "Distance Finder", href: "/tools/ocean-freight/sea-distance-calculator", icon: MapPin },
];

async function getStats() {
  try {
    // @ts-ignore
    const carriers = (await import('../../../carrier_directory.json')).default
    const ports = (await import('../../../top50_ports.json')).default
    return {
      carriers: Array.isArray(carriers) ? carriers.length : 168,
      ports: Array.isArray(ports) ? ports.length : 500,
      tools: 200
    }
  } catch {
    return { carriers: 168, ports: 500, tools: 200 }
  }
}

async function getGuides() {
  return [
    {
      id: '1',
      title: 'CBM Calculator Guide: How to Calculate Cubic Meters Correctly',
      publishedAt: '2024-01-15',
      excerpt: 'Learn the exact formula freight forwarders use for LCL shipments, with examples for pallets and cartons.',
      slug: 'cbm-calculator-guide'
    },
    {
      id: '2',
      title: '20ft vs 40ft Container: Complete Load Capacity Guide',
      publishedAt: '2024-02-10',
      excerpt: 'Internal dimensions, payload limits, and real-world loading examples for standard containers.',
      slug: 'container-sizes-guide'
    },
    {
      id: '3',
      title: 'HS Code Search: Avoid Customs Delays in 2026',
      publishedAt: '2024-03-05',
      excerpt: 'Step-by-step process to find correct HS codes and reduce clearance time.',
      slug: 'hs-code-avoid-delays'
    }
  ];
}

export default async function HomePage() {
  const stats = await getStats();
  const guides = await getGuides();

  return (
    <div className="flex flex-col min-h-screen">
      <OrganizationSchema />
      <WebSiteSchema />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="bg-[#0B1E3A] text-white overflow-hidden relative">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 px-4 py-1 text-sm font-semibold rounded-full">
                Global Logistics Tools
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                Ship Smarter. <br />
                <span className="text-teal-400">Calculate Faster.</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
                Access 200+ professional tools for freight forwarders, shippers, and traders worldwide. 
                Everything you need to manage global trade in one place.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600 text-white font-bold h-14 px-8 rounded-2xl shadow-lg shadow-teal-500/20 transition-all hover:scale-105">
                  <Link href="/tools">
                    Explore Tools <Zap className="ml-2 h-5 w-5 fill-current" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-slate-700 hover:bg-slate-800 text-white font-bold h-14 px-8 rounded-2xl transition-all">
                  <Link href="/directories/ports">
                    Port Directory <Anchor className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-8 text-slate-400 border-t border-slate-800/50">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B1E3A] bg-slate-800 flex items-center justify-center">
                      <Ship className="w-5 h-5 text-teal-500" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium">
                  Trusted by <span className="text-white font-bold">3,400+</span> logistics professionals
                </p>
              </div>
            </div>
            <div className="hidden md:flex justify-center items-center relative">
              <div className="relative w-full aspect-square max-w-md">
                <svg viewBox="0 0 400 400" className="w-full h-full text-teal-500/20">
                  <defs>
                    <linearGradient id="shipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <circle cx="200" cy="200" r="180" fill="url(#shipGradient)" />
                  <path d="M100 240 L300 240 L320 200 L80 200 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
                  <rect x="120" y="160" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="170" y="160" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="220" y="160" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED TOOLS */}
      <section className="py-24 bg-background relative z-20 -mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Most Popular Tools</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Professional-grade calculators used by supply chain experts every day.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURED_TOOLS.map((tool) => (
              <Link key={tool.title} href={tool.href} className="group">
                <Card className="h-full border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden hover:-translate-y-2 group-hover:border-teal-500/50">
                  <CardContent className="p-8 space-y-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: `${tool.color}15` }}>
                      <tool.icon className="w-8 h-8" style={{ color: tool.color }} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold group-hover:text-teal-600 transition-colors">{tool.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{tool.description}</p>
                    </div>
                    <div className="pt-4 flex items-center text-teal-600 font-bold">
                      Try Free <ArrowRight className="ml-2 w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div><p className="text-4xl font-black text-[#0B1E3A] dark:text-white">{stats.carriers}</p><p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Global Carriers</p></div>
            <div><p className="text-4xl font-black text-[#0B1E3A] dark:text-white">{stats.ports}+</p><p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Commercial Ports</p></div>
            <div><p className="text-4xl font-black text-[#0B1E3A] dark:text-white">{stats.tools}+</p><p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Free Trade Tools</p></div>
          </div>
        </div>
      </section>

      {/* ALL TOOLS */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div><h3 className="text-3xl font-black tracking-tight">Explore All Tools</h3><p className="text-slate-500">Comprehensive resources for every step of your supply chain.</p></div>
            <Button asChild variant="outline" className="rounded-xl border-slate-200 hover:border-teal-500 font-bold">
              <Link href="/tools">View 200+ Tools <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ALL_TOOLS.map((tool) => (
              <Link key={tool.name} href={tool.href}>
                <Card className="h-full border-slate-100 hover:border-teal-500/50 hover:bg-teal-50/50 transition-all rounded-2xl group">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all">
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-teal-600">{tool.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO CONTENT - ALL TOOLS */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#0B1E3A] mb-6">Free Shipping Calculators Used Daily by Freight Forwarders</h2>
          <div className="prose prose-slate max-w-none space-y-4">
            <p>Shiportrade provides 200+ professional tools for global logistics. Freight forwarders, shippers, and customs brokers use our calculators daily to quote faster and avoid costly mistakes.</p>
            
            <h3 className="text-lg font-semibold mt-6">Most Used Tools Worldwide:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>CBM Calculator</strong> — Calculate cubic meters for LCL shipments, check 20ft/40ft container fit instantly</li>
              <li><strong>Container Load Planner</strong> — Optimize pallet placement and maximize container utilization</li>
              <li><strong>Volumetric Weight Calculator</strong> — Find chargeable weight for air freight (IATA standard)</li>
              <li><strong>Landed Cost Calculator</strong> — Product cost + freight + duty + insurance in one click</li>
              <li><strong>HS Code Finder</strong> — Search 5,000+ Harmonized System codes for customs clearance</li>
              <li><strong>Demurrage & Detention Calculator</strong> — Estimate port storage fees and avoid extra charges</li>
              <li><strong>Freight Rate Estimator</strong> — Compare ocean and air rates across {stats.carriers}+ carriers</li>
              <li><strong>Incoterms Guide</strong> — Understand FOB, CIF, DDP responsibilities and cost differences</li>
              <li><strong>Currency Converter</strong> — Live FX rates for USD, EUR, CNY invoices</li>
              <li><strong>Sea Distance Calculator</strong> — Port-to-port nautical miles and transit time</li>
            </ul>

            <p className="mt-6">All tools are free, no signup required, and built with live data from {stats.carriers}+ carriers and {stats.ports}+ ports. Whether you ship from Shanghai to Rotterdam or Miami to Santos, calculate in seconds.</p>
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-black tracking-tight flex items-center gap-3"><Newspaper className="w-8 h-8 text-teal-500" />Shipping Guides</h3>
            <Link href="/guides" className="text-teal-600 font-bold hover:underline flex items-center gap-2">View all <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {guides.map((item) => (
              <Link key={item.id} href={`/guides/${item.slug}`} className="group">
                <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all rounded-2xl bg-white overflow-hidden">
                  <CardContent className="p-8 space-y-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <h4 className="text-xl font-bold group-hover:text-teal-600 transition-colors leading-tight">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}