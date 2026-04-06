"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BillOfLadingGenerator from "@/components/documents/BillOfLadingGenerator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Ship, 
  Download, 
  Eye, 
  ArrowRight,
  BookOpen,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function BillOfLadingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--logistics)]/5 via-transparent to-[var(--ocean)]/5 border-b border-border/40">
        <div className="absolute inset-0 bg-dots-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-[var(--logistics)]/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-12 relative">
          {/* Breadcrumb */}
          <motion.nav 
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/documents" className="hover:text-[var(--logistics)] transition-colors">Documents</Link>
            <span>/</span>
            <Link href="/documents/ocean-freight" className="hover:text-[var(--logistics)] transition-colors">Ocean Freight</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Bill of Lading</span>
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
              <Ship className="h-8 w-8 text-white" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">Bill of Lading Generator</h1>
                <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                Create professional Bills of Lading for ocean freight shipments with vessel and cargo details
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-[var(--logistics)]/10 to-[var(--ocean)]/10">
                <Zap className="h-4 w-4 mr-1.5 text-[var(--accent-amber)]" />
                Free Template
              </Badge>
            </div>
          </motion.div>

          {/* Features Pills */}
          <motion.div 
            className="flex flex-wrap gap-3 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: Eye, text: "Real-time Preview" },
              { icon: Download, text: "PDF/DOCX Export" },
              { icon: Shield, text: "Compliance Ready" },
            ].map((feature) => (
              <div 
                key={feature.text}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-border/50"
              >
                <feature.icon className="h-4 w-4 text-[var(--logistics)]" />
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Generator */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BillOfLadingGenerator />
        </motion.div>
      </section>

      <Separator className="my-8 max-w-7xl mx-auto" />

      {/* Educational Content */}
      <section className="container mx-auto px-4 py-8">
        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* What is B/L */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl icon-ocean flex items-center justify-center">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">What is a Bill of Lading?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  A Bill of Lading (B/L) is a legal document issued by a carrier that details the 
                  type, quantity, and destination of goods being shipped. It serves three essential 
                  functions in international trade:
                </p>
                <ul className="space-y-3">
                  {[
                    { title: "Receipt", desc: "Acknowledges carrier has received the cargo" },
                    { title: "Contract", desc: "Evidence of the carriage agreement" },
                    { title: "Document of Title", desc: "Represents ownership of the goods" },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">{item.title}:</strong> {item.desc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl icon-logistics flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Types of Bills of Lading</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {[
                    { name: "Original B/L", desc: "Negotiable document, required for cargo release" },
                    { name: "Seaway Bill", desc: "Non-negotiable, faster release without original" },
                    { name: "Telex Release", desc: "Electronic release at destination port" },
                    { name: "House B/L", desc: "Issued by freight forwarder to shipper" },
                    { name: "Master B/L", desc: "Issued by carrier to freight forwarder" },
                    { name: "Clean B/L", desc: "No damage or discrepancy remarks" },
                  ].map((type) => (
                    <div key={type.name} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <span className="font-semibold text-foreground">{type.name}:</span>
                      <span className="text-muted-foreground">{type.desc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Important Notes */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 border-[var(--accent-amber)]/30 bg-gradient-to-br from-[var(--accent-amber)]/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-amber)] to-[var(--accent-orange)] flex items-center justify-center shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <AlertTriangle className="h-6 w-6 text-white" />
                </motion.div>
                <div className="text-sm">
                  <p className="font-bold text-lg mb-3 text-foreground">Important Considerations</p>
                  <ul className="space-y-2 text-muted-foreground">
                    {[
                      "Always verify B/L details match the booking confirmation",
                      "Check container and seal numbers against the physical container",
                      "Ensure weight declarations match the VGM submission",
                      "Original B/Ls must be surrendered at destination for cargo release",
                      "Report any discrepancies to the carrier immediately",
                    ].map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--accent-amber)] shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Related Documents */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl icon-air flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Related Documents</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Shipping Instructions", href: "/documents/ocean-freight/shipping-instructions", desc: "Carrier instructions" },
              { name: "Certificate of Origin", href: "/documents/customs/certificate-of-origin", desc: "Origin certification" },
              { name: "Commercial Invoice", href: "/documents/international-trade/commercial-invoice", desc: "Trade document" },
              { name: "VGM Declaration", href: "/documents/ocean-freight/vgm-declaration", desc: "Weight verification" },
            ].map((doc, index) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={doc.href}>
                  <Card className="h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold group-hover:text-[var(--logistics)] transition-colors">
                            {doc.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{doc.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--logistics)] group-hover:translate-x-1 transition-all" />
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

// Star component for popular badge
function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
