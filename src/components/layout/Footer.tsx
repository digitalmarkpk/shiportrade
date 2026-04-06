"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Ship,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Mail,
  Globe,
  Sparkles,
  Calculator,
  FileText,
  ArrowRight,
  Heart,
  Layers,
  Plane,
  Truck,
  Shield,
  Warehouse,
  ShoppingBag,
  Leaf,
  Instagram,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Custom TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// Custom Pinterest Icon
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

// All 12 modules for the footer
const modules = [
  { name: "International Trade", slug: "international-trade", icon: Globe },
  { name: "Ocean Freight", slug: "ocean-freight", icon: Ship },
  { name: "Air Freight", slug: "air-freight", icon: Plane },
  { name: "Road & Rail", slug: "road-rail", icon: Truck },
  { name: "Customs & Compliance", slug: "customs-compliance", icon: Shield },
  { name: "Warehousing", slug: "warehousing", icon: Warehouse },
  { name: "E-Commerce", slug: "ecommerce", icon: ShoppingBag },
  { name: "Insurance", slug: "insurance", icon: Shield },
  { name: "Sustainability", slug: "sustainability", icon: Leaf },
  { name: "Project Cargo", slug: "project-cargo", icon: Calculator },
  { name: "Blockchain", slug: "blockchain-digital-supply-chain", icon: Layers },
  { name: "Documents", slug: "documents", icon: FileText },
];

const footerLinks = {
  tools: [
    { name: "Landed Cost Calculator", href: "/tools/international-trade/landed-cost-calculator" },
    { name: "CBM Calculator", href: "/tools/ocean-freight/cbm-calculator" },
    { name: "Currency Converter", href: "/tools/international-trade/currency-converter" },
    { name: "HS Code Search", href: "/tools/customs-compliance/hs-code-search" },
    { name: "Volumetric Weight", href: "/tools/air-freight/volumetric-weight" },
    { name: "Demurrage Calculator", href: "/tools/ocean-freight/demurrage-calculator" },
  ],
  documents: [
    { name: "Commercial Invoice", href: "/documents/international-trade/commercial-invoice" },
    { name: "Proforma Invoice", href: "/documents/international-trade/pro-forma-invoice" },
    { name: "Packing List", href: "/documents/international-trade/packing-list" },
    { name: "Bill of Lading", href: "/documents/ocean-freight/bill-of-lading" },
    { name: "Certificate of Origin", href: "/documents/customs/certificate-of-origin" },
    { name: "Air Waybill", href: "/documents/air-freight/air-waybill" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/news" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Academy", href: "/tradeflow-hub" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Brand Assets", href: "/logo" },
  ],
  resources: [
    { name: "Help Center", href: "/help" },
    { name: "API Documentation", href: "/api-docs" },
    { name: "Incoterms® 2020 Guide", href: "/tools/international-trade/incoterms-guide" },
    { name: "HS Code Handbook", href: "/tools/customs-compliance/hs-code-search" },
    { name: "Port Directory", href: "/directories/ports" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR Compliance", href: "/gdpr" },
  ],
};

// Social media links with brand colors
const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/shiportrade", hoverBg: "hover:bg-[#0A66C2]", hoverText: "hover:text-white" },
  { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/@Shiportrade", hoverBg: "hover:bg-[#FF0000]", hoverText: "hover:text-white" },
  { name: "X", icon: Twitter, href: "https://x.com/shiportrade", hoverBg: "hover:bg-black", hoverText: "hover:text-white" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/shiportrade", hoverBg: "hover:bg-[#1877F2]", hoverText: "hover:text-white" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/shiportrade", hoverBg: "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737]", hoverText: "hover:text-white" },
  { name: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@shiportrade", hoverBg: "hover:bg-black", hoverText: "hover:text-white" },
  { name: "Pinterest", icon: PinterestIcon, href: "https://au.pinterest.com/shiportrade", hoverBg: "hover:bg-[#E60023]", hoverText: "hover:text-white" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50">
      {/* Newsletter Section */}
      <div className="border-b border-border/40 bg-gradient-to-r from-[var(--ocean)]/5 via-transparent to-[var(--logistics)]/5">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl icon-logistics flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Stay Updated</h3>
                  <p className="text-muted-foreground">Get the latest freight rates & insights</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Join 75,000+ logistics professionals receiving weekly updates on trade regulations, 
                freight rates, and supply chain insights.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 rounded-xl text-base"
              />
              <Button className="btn-gradient text-white gap-2 h-12 px-8">
                <Sparkles className="h-4 w-4" />
                Subscribe
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-5">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.08 }}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg shadow-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)'
                }}
              >
                <Ship className="h-6 w-6 text-white relative z-10" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Shiportrade
                </span>
                <p className="text-xs text-muted-foreground font-medium">Global Supply Chain Intelligence</p>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              The ultimate Global Supply Chain Intelligence Hub. 150+ calculators, 120+ document generators, 
              and comprehensive trade intelligence across 12 industry modules.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 ${social.hoverBg} ${social.hoverText} hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg`}
                    title={social.name}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-[var(--ocean)]" />
              Tools
            </h4>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-[var(--ocean)] font-medium hover:underline inline-flex items-center gap-1"
                >
                  View All 150+ <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Documents */}
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--logistics)]" />
              Documents
            </h4>
            <ul className="space-y-3">
              {footerLinks.documents.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/documents"
                  className="text-sm text-[var(--logistics)] font-medium hover:underline inline-flex items-center gap-1"
                >
                  View All 120+ <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Modules */}
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[var(--accent-purple)]" />
              Modules
            </h4>
            <ul className="space-y-3">
              {modules.slice(0, 6).map((module) => (
                <li key={module.slug}>
                  <Link
                    href={`/tools/${module.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block"
                  >
                    {module.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-[var(--accent-purple)] font-medium hover:underline inline-flex items-center gap-1"
                >
                  All 12 Modules <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="font-bold mb-4 mt-6">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                Made with <Heart className="h-4 w-4 text-[var(--accent-rose)] fill-[var(--accent-rose)]" /> for logistics professionals
              </span>
              <span className="hidden sm:inline">•</span>
              <span>© {new Date().getFullYear()} Shiportrade.com</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4 text-[var(--ocean)]" />
              <span>Powered by 20+ Years Logistics Expertise</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
