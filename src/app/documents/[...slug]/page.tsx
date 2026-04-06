"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Ship,
  Shield,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Download,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { documentCategories } from "@/lib/constants/tools";

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Ship,
  Shield,
  DollarSign,
  CheckCircle,
  AlertTriangle,
};

const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
  "trade-documents": { bg: "icon-ocean", text: "text-blue-600", gradient: "from-blue-500 to-cyan-500" },
  "shipping-documents": { bg: "icon-logistics", text: "text-emerald-600", gradient: "from-emerald-500 to-teal-500" },
  "customs-documents": { bg: "icon-customs", text: "text-rose-600", gradient: "from-rose-500 to-red-500" },
  "finance-documents": { bg: "bg-gradient-to-br from-amber-500 to-orange-500", text: "text-amber-600", gradient: "from-amber-500 to-orange-500" },
  "insurance-documents": { bg: "icon-insurance", text: "text-purple-600", gradient: "from-purple-500 to-indigo-500" },
  "inspection-documents": { bg: "bg-gradient-to-br from-cyan-500 to-blue-500", text: "text-cyan-600", gradient: "from-cyan-500 to-blue-500" },
  "dangerous-goods-documents": { bg: "bg-gradient-to-br from-red-500 to-rose-500", text: "text-red-600", gradient: "from-red-500 to-rose-500" },
  "phytosanitary-documents": { bg: "icon-sustainability", text: "text-emerald-600", gradient: "from-emerald-500 to-green-500" },
  "food-agricultural-documents": { bg: "bg-gradient-to-br from-green-500 to-emerald-500", text: "text-green-600", gradient: "from-green-500 to-emerald-500" },
  "other-documents": { bg: "bg-gradient-to-br from-slate-500 to-gray-500", text: "text-slate-600", gradient: "from-slate-500 to-gray-500" },
  "international-trade": { bg: "icon-ocean", text: "text-blue-600", gradient: "from-blue-500 to-cyan-500" },
  "ocean-freight": { bg: "icon-logistics", text: "text-emerald-600", gradient: "from-emerald-500 to-teal-500" },
  "customs": { bg: "icon-customs", text: "text-rose-600", gradient: "from-rose-500 to-red-500" },
};

export default function DocumentModulePage() {
  const params = useParams();
  const slugParts = params.slug as string[];

  const moduleSlug = slugParts[0];
  const documentSlug = slugParts[1];

  // Find the category by slug or id
  const category = documentCategories.find(c => c.slug === moduleSlug || c.id === moduleSlug);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Document Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The category &quot;{moduleSlug}&quot; doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/documents">Back to Documents</Link>
          </Button>
        </div>
      </div>
    );
  }

  const colors = categoryColors[category.slug] || categoryColors[category.id] || categoryColors["trade-documents"];
  const Icon = iconMap[category.id] || FileText;

  // If there's a document slug, show document info
  if (documentSlug) {
    const document = category.documents.find(d => d.slug === documentSlug);

    if (!document) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Document Not Found</h1>
            <p className="text-muted-foreground mb-6">The document &quot;{documentSlug}&quot; doesn&apos;t exist in {category.name}.</p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href={`/documents/${category.slug}`}>View {category.name}</Link>
              </Button>
              <Button asChild>
                <Link href="/documents">All Documents</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Show document page
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/documents" className="hover:text-foreground">Documents</Link>
            <span>/</span>
            <Link href={`/documents/${category.slug}`} className="hover:text-foreground">{category.name}</Link>
            <span>/</span>
            <span className="text-foreground">{document.name}</span>
          </div>

          {/* Document Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.div 
              className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center shadow-lg`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <FileText className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold">{document.name}</h1>
              <p className="text-muted-foreground">{document.description}</p>
            </div>
          </div>

          {/* Document Card */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-500" />
                Document Generator
              </CardTitle>
              <CardDescription>Generate professional {document.name} documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Create a professional {document.name.toLowerCase()} for your international trade operations.
              </p>
              <div className="flex gap-4">
                <Button asChild className={`bg-gradient-to-r ${colors.gradient} text-white`}>
                  <Link href={`/documents/${category.slug}/${document.slug}`}>
                    Generate Document
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/documents/${category.slug}`}>
                    Back to {category.name}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Module index page
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-transparent border-b">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <motion.div 
              className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Icon className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Link href="/documents" className="hover:text-foreground">Documents</Link>
                <span>/</span>
                <span className="text-foreground">{category.name}</span>
              </div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
            </div>
          </motion.div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            {category.description}
          </p>
          
          <Badge className="text-sm">
            {category.documents.length} documents available
          </Badge>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {category.documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/documents/${category.slug}/${document.slug}`}>
                <Card className="h-full cursor-pointer border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="pb-2 relative">
                    <div className="flex items-start justify-between mb-2">
                      <motion.div 
                        className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center shadow-md`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <FileText className="h-5 w-5 text-white" />
                      </motion.div>
                      {document.featured && (
                        <Badge className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base group-hover:text-emerald-600 transition-colors">
                      {document.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-sm line-clamp-2">
                      {document.description}
                    </CardDescription>
                    <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Generate document</span>
                      <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Back to Documents */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <Button asChild variant="outline">
              <Link href="/documents">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                All Documents
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              {category.documents.length} documents in {category.name}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
