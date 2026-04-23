// src/app/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  Container,
  Boxes,
  Calculator,
  Anchor,
  Globe,
  Package,
  Shield,
  Clock,
  MapPin,
  BarChart3,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shiportrade - Shipping Tools, Freight Calculators & Port Data",
  description: "Calculate CBM, find HS codes, track containers, check port schedules. 200+ free logistics tools used worldwide.",
  keywords: ["cbm calculator", "container planner", "hs code finder", "freight tools", "shipping calculator", "port finder"],
  alternates: { canonical: "https://shiportrade.com" },
};

const QUICK_TOOLS = [
  { name: "CBM Calculator", href: "/tools/ocean-freight/cbm-calculator", icon: Container },
  { name: "Container Planner", href: "/tools/ocean-freight/container-load-planner", icon: Boxes },
  { name: "HS Code", href: "/tools/customs-compliance/hs-code-search", icon: Search },
  { name: "Port Finder", href: "/directories/ports", icon: Anchor },
  { name: "Landed Cost", href: "/tools/international-trade/landed-cost-calculator", icon: Calculator },
];

const ALL_TOOLS = [
  { name: "Distance & Time", icon: MapPin, href: "/tools/ocean-freight/sea-distance-calculator" },
  { name: "Volumetric Weight", icon: Package, href: "/tools/air-freight/volumetric-weight" },
  { name: "Freight Rates", icon: BarChart3, href: "/tools/ocean-freight/freight-index" },
  { name: "Currency", icon: Globe, href: "/tools/international-trade/currency-converter" },
  { name: "Incoterms", icon: Shield, href: "/tools/international-trade/incoterms-guide" },
  { name: "Demurrage", icon: Clock, href: "/tools/ocean-freight/demurrage-calculator" },
  { name: "Tracking", icon: Search, href: "/tools/tracking" },
  { name: "Documents", icon: FileText, href: "/documents" },
];

async function getStats() {
  try {
    const carriers = (await import('../../../carrier_directory.json')).default
    const ports = (await import('../../../top50_ports.json')).default
    return {
      carriers: Array.isArray(carriers)? carriers.length : 168,
      ports: Array.isArray(ports)? ports.length : 500,
    }
  } catch {
    return { carriers: 168, ports: 500 }
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="bg-white">
      {/* HERO - Searates style */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text- md:text- font-bold text-[#0B1E3A] leading-tight tracking-tight">
              Global Logistics Tools
            </h1>
            <p className="mt-3 text-base md:text-lg text-slate-600">
              Calculate freight, find ports, check HS codes — all in one place
            </p>

            {/* Big Search - like Searates */}
            <div className="mt-8 md:mt-10">
              <form action="/search" className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search for CBM calculator, port name, HS code..."
                    className="w-full h- md:h- pl-12 pr-32 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] text-"
                  />
                  <Button
                    type="submit"
                    className="absolute right-1.5 h- md:h- px-6 bg-[#14B8A6] hover:bg-[#0D9488] text-white font-medium rounded-lg"
                  >
                    Search
                  </Button>
                </div>
              </form>

              {/* Quick links */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {QUICK_TOOLS.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:border-[#14B8A6] hover:bg-teal-50/50 text- font-medium text-slate-700 transition-colors"
                  >
                    <tool.icon className="w-3.5 h-3.5 text-[#0B1E3A]" />
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS GRID - Searates style */}
      <section className="py-12 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
              {ALL_TOOLS.map((tool) => (
                <Link key={tool.name} href={tool.href} className="group">
                  <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-[#14B8A6]/10 flex items-center justify-center mb-3 transition-colors border border-slate-100">
                      <tool.icon className="w-5 h-5 text-[#0B1E3A] group-hover:text-[#14B8A6] transition-colors" />
                    </div>
                    <span className="text- font-medium text-slate-700 leading-snug">{tool.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP - minimal */}
      <section className="py-8 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text- text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0B1E3A]">{stats.carriers}+</span>
              <span>Carriers</span>
            </div>
            <div className="w-px h-4 bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0B1E3A]">{stats.ports}+</span>
              <span>Ports</span>
            </div>
            <div className="w-px h-4 bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0B1E3A]">200+</span>
              <span>Free Tools</span>
            </div>
            <div className="w-px h-4 bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0B1E3A]">No signup</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED - 3 main tools */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/tools/ocean-freight/cbm-calculator" className="group block p-6 rounded-2xl border border-slate-200 hover:border-[#14B8A6]/50 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0B1E3A] flex items-center justify-center flex-shrink-0">
                    <Container className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0B1E3A] group-hover:text-[#14B8A6]">CBM Calculator</h3>
                    <p className="mt-1 text- text-slate-600 leading-snug">Calculate cubic meters, check container fit</p>
                  </div>
                </div>
              </Link>

              <Link href="/tools/ocean-freight/container-load-planner" className="group block p-6 rounded-2xl border border-slate-200 hover:border-[#14B8A6]/50 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0B1E3A] flex items-center justify-center flex-shrink-0">
                    <Boxes className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0B1E3A] group-hover:text-[#14B8A6]">Load Planner</h3>
                    <p className="mt-1 text- text-slate-600 leading-snug">Optimize pallet placement in 20ft/40ft</p>
                  </div>
                </div>
              </Link>

              <Link href="/tools/customs-compliance/hs-code-search" className="group block p-6 rounded-2xl border border-slate-200 hover:border-[#14B8A6]/50 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0B1E3A] flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0B1E3A] group-hover:text-[#14B8A6]">HS Code Finder</h3>
                    <p className="mt-1 text- text-slate-600 leading-snug">Find codes for customs clearance</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}