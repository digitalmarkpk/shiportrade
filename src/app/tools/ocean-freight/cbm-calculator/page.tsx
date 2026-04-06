"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Ship,
  Calculator,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CBMCalculator } from "@/components/tools/CBMCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CBMCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-transparent to-[var(--logistics)]/5 border-b border-border/40">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[var(--ocean)]/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-12 relative">
          {/* Breadcrumb */}
          <motion.nav 
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/tools" className="hover:text-[var(--ocean)] transition-colors">Tools</Link>
            <span>/</span>
            <Link href="/tools/ocean-freight" className="hover:text-[var(--ocean)] transition-colors">Ocean Freight</Link>
            <span>/</span>
            <span className="text-foreground font-medium">CBM Calculator</span>
          </motion.nav>
          
          <motion.div 
            className="flex flex-col md:flex-row md:items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-16 h-16 rounded-2xl icon-ocean flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Box className="h-8 w-8 text-white" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">CBM Calculator</h1>
                <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                Calculate cubic meters, container loadability, and pallet configurations for ocean freight
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10">
                <Zap className="h-4 w-4 mr-1.5 text-[var(--accent-amber)]" />
                Free Tool
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CBMCalculator />
        </motion.div>
      </section>

      <Separator className="my-8 max-w-7xl mx-auto" />

      {/* Educational Section */}
      <section className="container mx-auto px-4 py-8">
        <motion.div 
          className="grid lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* What is CBM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl icon-ocean flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">What is CBM?</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">CBM (Cubic Meter)</strong> is the standard unit of measurement for volume in international 
                  shipping. It represents the space your cargo occupies and is crucial for calculating freight costs, 
                  especially for Less than Container Load (LCL) shipments.
                </p>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  One cubic meter equals the volume of a cube with each side measuring 1 meter (1m × 1m × 1m). 
                  Understanding CBM helps you optimize container space utilization and accurately estimate 
                  shipping costs.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Formula */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl icon-logistics flex items-center justify-center mb-3">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Calculation Formula</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-5 font-mono text-sm space-y-3">
                  <div className="text-lg">
                    <span className="text-[var(--ocean)] font-bold">CBM</span> = Length × Width × Height
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                    All dimensions in meters
                  </div>
                  <div className="mt-3 text-sm">
                    Example: 100cm × 80cm × 60cm
                  </div>
                  <div className="text-sm">
                    = 1.0m × 0.8m × 0.6m = <span className="text-[var(--logistics)] font-bold">0.48 CBM</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Always convert to meters before calculating: cm ÷ 100 = m
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Container Specs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl icon-air flex items-center justify-center mb-3">
                  <Ship className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Standard Containers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "20' Standard", cbm: "33.2 CBM" },
                    { name: "40' Standard", cbm: "67.7 CBM" },
                    { name: "40' High Cube", cbm: "76.3 CBM", highlight: true },
                    { name: "45' High Cube", cbm: "86.1 CBM" },
                  ].map((container) => (
                    <div 
                      key={container.name} 
                      className={`flex justify-between p-3 rounded-xl transition-colors ${
                        container.highlight 
                          ? "bg-[var(--ocean)]/10 border border-[var(--ocean)]/20" 
                          : "bg-muted/30"
                      }`}
                    >
                      <span className="font-medium">{container.name}</span>
                      <span className={`font-bold ${container.highlight ? "text-[var(--ocean)]" : ""}`}>
                        {container.cbm}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  High Cube containers are 30cm taller than standard containers.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Tips & Mistakes */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-[var(--logistics)]/20 bg-gradient-to-br from-[var(--logistics)]/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl icon-logistics flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-[var(--logistics)]">Pro Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Round up your CBM calculations to account for pallet spacing",
                    "For LCL, freight is charged on CBM or weight (whichever is greater)",
                    "Consider 10-15% loss for practical loading (air gaps, securing)",
                    "Use High Cube containers for voluminous cargo",
                    "Stackable goods can nearly double space efficiency",
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-destructive">Common Mistakes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Forgetting to convert units (cm to m) before calculating",
                    "Not accounting for packaging in dimensions",
                    "Assuming 100% container fill is achievable",
                    "Ignoring weight limits (payload vs. volume capacity)",
                    "Not considering cargo handling requirements",
                  ].map((mistake, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl icon-ocean flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1" className="border-b border-border/50">
                  <AccordionTrigger className="text-left font-medium hover:text-[var(--ocean)]">
                    How do I convert dimensions to CBM?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    To calculate CBM, first convert all dimensions to meters. For centimeters, divide by 100. 
                    Then multiply length × width × height. For example, a box measuring 100cm × 50cm × 40cm 
                    equals 1m × 0.5m × 0.4m = 0.2 CBM.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2" className="border-b border-border/50">
                  <AccordionTrigger className="text-left font-medium hover:text-[var(--ocean)]">
                    Why is CBM important in shipping?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    CBM determines how much space your cargo occupies in a container or vessel. For LCL 
                    (Less than Container Load) shipments, freight charges are typically based on CBM. 
                    It also helps determine how many containers you need for your shipment.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3" className="border-b border-border/50">
                  <AccordionTrigger className="text-left font-medium hover:text-[var(--ocean)]">
                    What's the difference between CBM and Volumetric Weight?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    CBM is the actual volume of cargo (used for sea freight), while volumetric weight is a 
                    calculated weight based on volume (used for air freight). Air freight uses a divisor 
                    (typically 6000) to convert CBM to chargeable weight.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4">
                  <AccordionTrigger className="text-left font-medium hover:text-[var(--ocean)]">
                    How many CBM fits in a container?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    A 20' standard container holds approximately 33.2 CBM, a 40' standard holds about 67.7 CBM, 
                    and a 40' High Cube holds about 76.3 CBM. However, practical loading efficiency is typically 
                    85-90% due to cargo shape, securing requirements, and handling needs.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Related Tools */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl icon-warehouse flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Related Tools</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Volumetric Weight Calculator", href: "/tools/air-freight/volumetric-weight", desc: "Air freight calculations" },
              { name: "FCL Loadability Engine", href: "/tools/ocean-freight/fcl-loadability", desc: "Container optimization" },
              { name: "VGM Calculator", href: "/tools/ocean-freight/vgm-calculator", desc: "Weight verification" },
              { name: "Demurrage Calculator", href: "/tools/ocean-freight/demurrage-calculator", desc: "Port storage fees" },
            ].map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={tool.href}>
                  <Card className="h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold group-hover:text-[var(--ocean)] transition-colors">
                            {tool.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--ocean)] group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

// Import XCircle for mistakes
function XCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

// Import Star for popular badge
function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
