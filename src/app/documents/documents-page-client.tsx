"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  FileText,
  ArrowRight,
  Search,
  Star,
  Sparkles,
  Ship,
  Plane,
  Shield,
  FileCheck,
  FileSignature,
  FileSpreadsheet,
  FileWarning,
  FilePlus,
  Download,
  Eye,
  Zap,
  Globe,
  AlertTriangle,
  Leaf,
  Thermometer,
  Building2,
  TrendingUp,
  DollarSign,
  Scale,
  Anchor,
  Truck,
  Calculator,
  MapPin,
  RefreshCw,
  Box,
  Container,
  CheckCircle,
  Warehouse,
  ShoppingBag,
  ShieldCheck,
  Wrench,
  Link as LinkIcon,
  Landmark,
  BarChart,
  CheckSquare,
  Package,
  Calendar,
  Lock,
  Activity,
  RefreshCcw,
  Layers,
  Target,
  Currency,
  PieChart,
  Dice5,
  Wind,
  Route,
  Ruler,
  Weight,
  Tag,
  Train,
  GitCompare,
  Clock,
  Ban,
  ClipboardAlert,
  Droplet,
  Move,
  Fuel,
  LineChart,
  Receipt,
  AlertCircle,
  UserCheck,
  ShoppingCart,
  Percent,
  ArrowUpDown,
  Bell,
  LayoutGrid,
  RotateCcw,
  CreditCard,
  Users,
  UserPlus,
  Blocks,
  FileCode,
  Pill,
  ClipboardList,
  FileBarChart,
  ClipboardCheck,
  Barcode,
  LayoutDashboard,
  Map,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { documentCategories, toolCategories, moduleDocumentMap, Document } from "@/lib/constants/tools";

// Icon map for documents
const documentIconMap: Record<string, React.ElementType> = {
  // Trade Documents
  "commercial-invoice": FileText,
  "pro-forma-invoice": FileSpreadsheet,
  "packing-list": Package,
  "purchase-order": FileSignature,
  "sales-contract": FileCheck,
  "quotation": FileText,
  "indent": FileText,
  "purchase-agreement": FileSignature,
  
  // Shipping Documents
  "bill-of-lading": Ship,
  "air-waybill": Plane,
  "sea-waybill": Ship,
  "multimodal-transport": Truck,
  "truck-waybill": Truck,
  "rail-waybill": Train,
  "delivery-order": FileCheck,
  "shipping-instructions": FileText,
  "shippers-letter-of-instruction": FileText,
  "booking-confirmation": CheckCircle,
  "booking-request": Calendar,
  "cargo-manifest": FileSpreadsheet,
  
  // Customs Documents
  "certificate-of-origin": FileCheck,
  "export-declaration": FileWarning,
  "import-declaration": FileWarning,
  "customs-invoice": FileText,
  "customs-bond": Shield,
  "duty-exemption": FileCheck,
  "re-export-certificate": FileCheck,
  "transit-document": Truck,
  "ata-carnet": FileText,
  "t1-document": FileText,
  
  // Finance Documents
  "letter-of-credit": FileSignature,
  "lc-application": FileText,
  "bank-guarantee": Building2,
  "standby-lc": FileSignature,
  "documentary-collection": FileText,
  "bill-of-exchange": DollarSign,
  "promissory-note": FileSignature,
  "bank-draft": DollarSign,
  "wire-transfer-slip": Receipt,
  "credit-note": FileText,
  "debit-note": FileText,
  
  // Insurance Documents
  "insurance-certificate": Shield,
  "insurance-policy": FileText,
  "insurance-declaration": FileText,
  "claim-form": FileWarning,
  "survey-report": FileCheck,
  "loss-adjuster-report": FileCheck,
  
  // Inspection Documents
  "inspection-certificate": FileCheck,
  "pre-shipment-inspection": CheckCircle,
  "quality-certificate": FileCheck,
  "quantity-certificate": FileCheck,
  "weight-certificate": Scale,
  "analysis-certificate": FileCheck,
  "testing-report": FileCheck,
  
  // Dangerous Goods
  "dangerous-goods-declaration": AlertTriangle,
  "msds": FileWarning,
  "un-certificate": FileCheck,
  "hazard-classification": AlertTriangle,
  "emergency-response": AlertTriangle,
  "multimodal-dg-declaration": AlertTriangle,
  
  // Phytosanitary
  "phytosanitary-certificate": Leaf,
  "fumigation-certificate": Leaf,
  "heat-treatment-certificate": Thermometer,
  "plant-quarantine": Leaf,
  "seed-certificate": Leaf,
  
  // Food Documents
  "health-certificate": FileCheck,
  "halal-certificate": FileCheck,
  "kosher-certificate": FileCheck,
  "organic-certificate": Leaf,
  "haccp-certificate": FileCheck,
  "fda-registration": FileText,
  "veterinary-certificate": FileCheck,
  "catch-certificate": FileCheck,
  
  // Logistics Documents
  "proof-of-delivery": FileCheck,
  "pallet-receipt": Package,
  "temperature-record": Thermometer,
  "loading-plan": Layers,
  "stuffing-report": FileText,
  "devanning-report": FileText,
  "tally-sheet": FileSpreadsheet,
  "damage-report": FileWarning,
  "short-landing-report": FileWarning,
  "over-landing-report": FileWarning,
  "storage-receipt": Warehouse,
  
  // Other Documents
  "power-of-attorney": FileSignature,
  "authorization-letter": FileText,
  "no-objection-certificate": FileCheck,
  "undertaking": FileSignature,
  "affidavit": FileSignature,
  "indemnity-bond": FileSignature,
  "consular-invoice": FileText,
  "legalization": FileText,
  "apostille": FileCheck,
  "certificate-of-conformity": FileCheck,
  "ce-marking": FileCheck,
  "iso-certificate": FileCheck,
  "free-sale-certificate": FileCheck,
  "gmp-certificate": FileCheck,
  "fcc-declaration": FileCheck,
  "rohs-certificate": FileCheck,
  "reach-certificate": FileCheck,
  "test-report": FileCheck,
  "product-data-sheet": FileText,
  "safety-data-sheet": FileWarning,
  "material-certificate": FileCheck,
  "mill-certificate": FileCheck,
  "origin-declaration": FileText,
  "preference-certificate": FileCheck,
  
  // Legal Documents
  "distribution-agreement": FileSignature,
  "agency-agreement": FileSignature,
  "non-disclosure-agreement": FileSignature,
  "license-agreement": FileSignature,
  "franchise-agreement": FileSignature,
  "joint-venture-agreement": FileSignature,
  "supply-agreement": FileSignature,
  "manufacturing-agreement": FileSignature,
  "export-license": FileCheck,
  "import-license": FileCheck,
  "end-user-certificate": FileCheck,
  "import-permit": FileCheck,
};

// Module icons map
const moduleIconMap: Record<string, React.ElementType> = {
  "international-trade": Globe,
  "ocean-freight": Ship,
  "air-freight": Plane,
  "road-rail": Truck,
  "customs-compliance": ShieldCheck,
  "warehousing": Warehouse,
  "ecommerce": ShoppingBag,
  "insurance": Shield,
  "sustainability": Leaf,
  "project-cargo": Wrench,
  "blockchain-digital-supply-chain": LinkIcon,
  "financial-payment": DollarSign,
  "logistics-planning": Map,
  "inventory-management": Package,
  "trade-finance": Landmark,
  "supply-chain-analytics": BarChart,
  "quality-control": CheckSquare,
  "packaging-labeling": Package,
  "last-mile-delivery": Truck,
  "dangerous-goods": AlertTriangle,
  "cold-chain": Thermometer,
  "customs-brokerage": Shield,
  "freight-forwarding": Ship,
  "trade-compliance-advanced": ShieldCheck,
  "vessel-operations": Anchor,
  "port-operations": Anchor,
  "documents": FileText,
};

// Module colors
const moduleColors: Record<string, { bg: string; text: string; gradient: string }> = {
  "international-trade": { bg: "bg-blue-500", text: "text-blue-600", gradient: "from-blue-500 to-indigo-600" },
  "ocean-freight": { bg: "bg-cyan-500", text: "text-cyan-600", gradient: "from-cyan-500 to-blue-600" },
  "air-freight": { bg: "bg-sky-400", text: "text-sky-600", gradient: "from-sky-400 to-blue-500" },
  "road-rail": { bg: "bg-orange-500", text: "text-orange-600", gradient: "from-orange-500 to-amber-500" },
  "customs-compliance": { bg: "bg-red-500", text: "text-red-600", gradient: "from-red-500 to-rose-600" },
  "warehousing": { bg: "bg-violet-500", text: "text-violet-600", gradient: "from-violet-500 to-purple-600" },
  "ecommerce": { bg: "bg-pink-500", text: "text-pink-600", gradient: "from-pink-500 to-rose-500" },
  "insurance": { bg: "bg-teal-500", text: "text-teal-600", gradient: "from-teal-500 to-cyan-600" },
  "sustainability": { bg: "bg-green-500", text: "text-green-600", gradient: "from-green-500 to-emerald-600" },
  "project-cargo": { bg: "bg-slate-500", text: "text-slate-600", gradient: "from-slate-500 to-gray-600" },
  "blockchain-digital-supply-chain": { bg: "bg-purple-500", text: "text-purple-600", gradient: "from-purple-500 to-indigo-600" },
  "financial-payment": { bg: "bg-emerald-500", text: "text-emerald-600", gradient: "from-emerald-500 to-green-600" },
  "logistics-planning": { bg: "bg-blue-400", text: "text-blue-500", gradient: "from-blue-400 to-indigo-500" },
  "inventory-management": { bg: "bg-violet-400", text: "text-violet-500", gradient: "from-violet-400 to-purple-500" },
  "trade-finance": { bg: "bg-emerald-500", text: "text-emerald-600", gradient: "from-emerald-500 to-green-600" },
  "supply-chain-analytics": { bg: "bg-cyan-500", text: "text-cyan-600", gradient: "from-cyan-500 to-blue-600" },
  "quality-control": { bg: "bg-green-500", text: "text-green-600", gradient: "from-green-500 to-emerald-500" },
  "packaging-labeling": { bg: "bg-amber-500", text: "text-amber-600", gradient: "from-amber-500 to-orange-500" },
  "last-mile-delivery": { bg: "bg-pink-400", text: "text-pink-500", gradient: "from-pink-400 to-rose-500" },
  "dangerous-goods": { bg: "bg-red-600", text: "text-red-700", gradient: "from-red-600 to-orange-600" },
  "cold-chain": { bg: "bg-sky-400", text: "text-sky-500", gradient: "from-sky-400 to-cyan-500" },
  "customs-brokerage": { bg: "bg-indigo-500", text: "text-indigo-600", gradient: "from-indigo-500 to-violet-600" },
  "freight-forwarding": { bg: "bg-blue-500", text: "text-blue-600", gradient: "from-blue-500 to-cyan-500" },
  "trade-compliance-advanced": { bg: "bg-purple-600", text: "text-purple-700", gradient: "from-purple-600 to-indigo-600" },
  "vessel-operations": { bg: "bg-blue-600", text: "text-blue-700", gradient: "from-blue-600 to-slate-600" },
  "port-operations": { bg: "bg-teal-500", text: "text-teal-600", gradient: "from-teal-500 to-cyan-500" },
  "documents": { bg: "bg-orange-500", text: "text-orange-600", gradient: "from-orange-500 to-amber-600" },
};

// 3D Card Component
function DocumentCard({ 
  doc, 
  moduleSlug, 
  index 
}: { 
  doc: Document & { categorySlug: string }; 
  moduleSlug: string; 
  index: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  
  const colors = moduleColors[moduleSlug] || moduleColors["documents"];
  const DocIcon = documentIconMap[doc.slug] || FileText;

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
      <Link href={`/documents/${doc.categorySlug}/${doc.slug}`}>
        <Card className="h-full cursor-pointer border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-xl transition-all duration-300 group overflow-hidden">
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          <CardHeader className="pb-2 relative">
            <div className="flex items-start justify-between mb-2">
              <motion.div 
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <DocIcon className="h-5 w-5 text-white" />
              </motion.div>
              {doc.featured && (
                <Badge className="text-xs bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-500/20 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </Badge>
              )}
            </div>
            <CardTitle className="text-base group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#0F4C81] group-hover:to-[#2E8B57] transition-all">
              {doc.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <CardDescription className="text-sm line-clamp-2">
              {doc.description}
            </CardDescription>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center text-xs text-[#2E8B57] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </div>
              <div className="flex items-center text-xs text-[#0F4C81] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="h-3 w-3 mr-1" />
                Export
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get all documents with their category slugs
  const allDocuments = documentCategories.flatMap(cat => 
    cat.documents.map(doc => ({ ...doc, categorySlug: cat.slug }))
  );
  
  // Filter documents by module mapping
  const getModuleDocuments = (moduleSlug: string): (Document & { categorySlug: string })[] => {
    const relatedCategories = moduleDocumentMap[moduleSlug] || [];
    const docs: (Document & { categorySlug: string })[] = [];
    
    relatedCategories.forEach(catSlug => {
      const category = documentCategories.find(c => c.slug === catSlug);
      if (category) {
        category.documents.forEach(doc => {
          // Avoid duplicates
          if (!docs.find(d => d.slug === doc.slug)) {
            docs.push({ ...doc, categorySlug: catSlug });
          }
        });
      }
    });
    
    return docs;
  };
  
  // Filter modules based on search
  const filteredModules = toolCategories
    .filter(module => module.slug !== 'documents') // Exclude the documents module itself
    .map(module => ({
      ...module,
      documents: getModuleDocuments(module.slug).filter(doc => 
        searchQuery === "" || 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(module => module.documents.length > 0);
  
  // Get featured documents for quick access
  const featuredDocuments = allDocuments.filter(doc => doc.featured).slice(0, 10);
  
  const totalDocuments = allDocuments.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--logistics)]/5 via-transparent to-[var(--ocean)]/5 border-b border-border/40">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-dots-pattern opacity-30" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[var(--logistics)]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[var(--ocean)]/10 to-transparent rounded-full blur-3xl" />
        
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
              <Badge className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-[var(--logistics)]/10 to-[var(--ocean)]/10 border-[var(--logistics)]/20 text-[var(--logistics)] dark:text-[var(--logistics-light)] font-medium">
                <FileText className="h-4 w-4 mr-2 text-[var(--logistics)]" />
                <span className="font-bold">{totalDocuments}</span>
                <span className="ml-1">Document Templates</span>
              </Badge>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Document
              <span className="block mt-2 text-gradient-hero">Generators</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Generate professional trade documents in minutes. Fill in the details, preview in real-time, 
              and export to PDF, DOCX, or XLSX.
            </p>
            
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search documents..." 
                  className="pl-12 h-12 rounded-xl text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access - Popular Documents */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Popular Documents</h2>
            <p className="text-sm text-muted-foreground">Most used templates</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {featuredDocuments.map((doc, index) => {
            const colors = moduleColors['documents'];
            const DocIcon = documentIconMap[doc.slug] || FileText;
            return (
              <motion.div
                key={`${doc.categorySlug}-${doc.slug}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/documents/${doc.categorySlug}/${doc.slug}`}>
                  <Button 
                    variant="outline" 
                    className="h-11 px-5 rounded-xl border-2 hover:border-[var(--logistics)] hover:bg-[var(--logistics)]/5 transition-all"
                  >
                    <DocIcon className={`h-4 w-4 mr-2 text-[var(--ocean)]`} />
                    {doc.name}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Modules Grid */}
      <div className="container mx-auto px-4 pb-16">
        {filteredModules.map((module, moduleIndex) => {
          const Icon = moduleIconMap[module.slug] || FileText;
          const colors = moduleColors[module.slug] || moduleColors["documents"];
          
          return (
            <motion.section 
              key={module.id} 
              id={module.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-16"
            >
              {/* Module Header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="h-7 w-7 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{module.name}</h2>
                  <p className="text-muted-foreground">{module.description}</p>
                </div>
                <Badge className="text-sm bg-muted">
                  {module.documents.length} docs
                </Badge>
              </div>
              
              {/* Documents Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {module.documents.map((doc, index) => (
                  <DocumentCard 
                    key={doc.slug} 
                    doc={doc} 
                    moduleSlug={module.slug}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Features Section */}
      <section className="border-t border-border/40 bg-gradient-to-r from-[var(--logistics)]/5 via-transparent to-[var(--ocean)]/5">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 border-[var(--ocean)]/20">
              <Zap className="h-4 w-4 mr-1.5 text-amber-500" />
              Features
            </Badge>
            <h2 className="text-3xl font-bold">Why Use Our Document Generators?</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Eye, title: "Real-time Preview", description: "See changes instantly as you fill in the form", color: "from-blue-500 to-indigo-600" },
              { icon: Download, title: "Multiple Export Formats", description: "Export to PDF, DOCX, or XLSX formats", color: "from-emerald-500 to-green-600" },
              { icon: Globe, title: "Compliance Ready", description: "Templates designed to meet international standards", color: "from-cyan-500 to-blue-600" },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mx-auto mb-4 flex items-center justify-center shadow-lg`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--logistics)] to-[var(--ocean)] mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Need a Custom Template?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              We're constantly adding new document templates. Let us know what you need for your business.
            </p>
            <Button asChild size="lg" className="btn-gradient text-white gap-2 h-14 px-10 text-lg">
              <Link href="/contact">
                Request a Template
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
