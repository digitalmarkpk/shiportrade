"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  Calculator,
  Ship,
  Plane,
  Truck,
  Shield,
  Warehouse,
  ShoppingBag,
  Leaf,
  Globe,
  FileText,
  ArrowRight,
  Search,
  Grid3X3,
  List,
  Star,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toolCategories, totalToolsCount, featuredTools } from "@/lib/constants/tools";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Ship,
  Plane,
  Truck,
  ShieldCheck: Shield,
  Warehouse,
  ShoppingBag,
  Leaf,
  Calculator,
  FileText,
  Wrench: Calculator,
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  "international-trade": { bg: "icon-ocean", text: "text-[var(--ocean)]" },
  "ocean-freight": { bg: "icon-ocean", text: "text-[var(--ocean)]" },
  "air-freight": { bg: "icon-air", text: "text-[var(--accent-purple)]" },
  "road-rail": { bg: "icon-road", text: "text-[var(--accent-orange)]" },
  "customs-compliance": { bg: "icon-customs", text: "text-[var(--accent-rose)]" },
  "warehousing": { bg: "icon-warehouse", text: "text-[var(--accent-cyan)]" },
  "ecommerce": { bg: "icon-ecommerce", text: "text-[var(--accent-amber)]" },
  "insurance": { bg: "icon-insurance", text: "text-[var(--accent-purple)]" },
  "sustainability": { bg: "icon-sustainability", text: "text-[var(--logistics)]" },
  "project-cargo": { bg: "icon-project", text: "text-[var(--accent-blue)]" },
  "documents": { bg: "icon-documents", text: "text-[var(--ocean)]" },
};

// 3D Card Component
function ToolCard({ tool, categorySlug, index }: { tool: any; categorySlug: string; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  
  const colors = categoryColors[categorySlug] || categoryColors["international-trade"];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/tools/${categorySlug}/${tool.slug}`}>
        <Card className="h-full cursor-pointer border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-xl transition-all duration-300 group overflow-hidden">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <CardHeader className="pb-2 relative">
            <div className="flex items-start justify-between mb-2">
              <motion.div 
                className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center shadow-md`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Calculator className="h-5 w-5 text-white" />
              </motion.div>
              {tool.featured && (
                <Badge className="text-xs bg-gradient-to-r from-[var(--accent-amber)]/10 to-[var(--accent-orange)]/10 text-[var(--accent-amber)] border-[var(--accent-amber)]/20 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Popular
                </Badge>
              )}
            </div>
            <CardTitle className="text-base group-hover:text-[var(--ocean)] transition-colors">
              {tool.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <CardDescription className="text-sm line-clamp-2">
              {tool.description}
            </CardDescription>
            <div className="mt-3 flex items-center text-xs text-[var(--ocean)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Try now</span>
              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  
  const filteredCategories = toolCategories.map(category => ({
    ...category,
    tools: category.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.tools.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-transparent to-[var(--logistics)]/5 border-b border-border/40">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[var(--ocean)]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[var(--logistics)]/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 border-[var(--ocean)]/20 text-[var(--ocean)] dark:text-[var(--ocean-light)] font-medium">
                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                <span className="font-bold">{totalToolsCount}</span>
                <span className="ml-1">Smart Calculators</span>
              </Badge>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Trade & Logistics
              <span className="block mt-2 text-gradient-hero">Tools Hub</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Professional-grade calculators for every aspect of global trade and supply chain management. 
              Accurate, reliable, and trusted by thousands of logistics professionals.
            </p>
            
            {/* Search & View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search tools by name or description..." 
                  className="pl-12 h-12 rounded-xl text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === "compact" ? "default" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                  onClick={() => setViewMode("compact")}
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access - Featured Tools */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl icon-logistics flex items-center justify-center">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Quick Access</h2>
            <p className="text-sm text-muted-foreground">Most popular tools</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {featuredTools.slice(0, 8).map((tool, index) => {
            const categorySlug = toolCategories.find(c => c.tools.some(t => t.id === tool.id))?.slug || 'tools';
            const colors = categoryColors[categorySlug] || categoryColors["international-trade"];
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/tools/${categorySlug}/${tool.slug}`}>
                  <Button 
                    variant="outline" 
                    className="h-11 px-5 rounded-xl border-2 hover:border-[var(--ocean)] hover:bg-[var(--ocean)]/5 transition-all"
                  >
                    <Calculator className={`h-4 w-4 mr-2 ${colors.text}`} />
                    {tool.name}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 pb-16">
        {filteredCategories.map((category, categoryIndex) => {
          const Icon = iconMap[category.icon] || Calculator;
          const colors = categoryColors[category.id] || categoryColors["international-trade"];
          
          return (
            <motion.section 
              key={category.id} 
              id={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-16"
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="h-7 w-7 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                <Badge className="text-sm bg-muted">
                  {category.tools.length} tools
                </Badge>
              </div>
              
              {/* Tools Grid */}
              <div className={viewMode === "grid" 
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
                : "grid grid-cols-1 md:grid-cols-2 gap-3"
              }>
                {category.tools.map((tool, index) => (
                  <ToolCard 
                    key={tool.id} 
                    tool={tool} 
                    categorySlug={category.slug}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="border-t border-border/40 bg-gradient-to-r from-[var(--ocean)]/5 via-transparent to-[var(--logistics)]/5">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl icon-ocean mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Can't find what you need?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              We're constantly adding new tools based on user feedback. Let us know what would help your business.
            </p>
            <Button asChild size="lg" className="btn-gradient text-white gap-2 h-14 px-10 text-lg">
              <Link href="/contact">
                <TrendingUp className="h-5 w-5" />
                Request a Tool
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
