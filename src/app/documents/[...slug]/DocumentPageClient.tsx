"use client";

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
  BookOpen,
  Users,
  Target,
  CheckCircle2,
  Info,
  Award,
  Briefcase,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  ThumbsUp,
  Clock,
  Star,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  type DocumentCategory, 
  type Document 
} from "@/lib/constants/tools";
import { 
  type DocumentSEOData,
  generateFAQSchema
} from "@/lib/constants/seoData";

// Category colors
const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
  "trade-documents": { bg: "bg-gradient-to-br from-blue-500 to-cyan-500", text: "text-blue-600", gradient: "from-blue-500 to-cyan-500" },
  "shipping-documents": { bg: "bg-gradient-to-br from-emerald-500 to-teal-500", text: "text-emerald-600", gradient: "from-emerald-500 to-teal-500" },
  "customs-documents": { bg: "bg-gradient-to-br from-rose-500 to-red-500", text: "text-rose-600", gradient: "from-rose-500 to-red-500" },
  "finance-documents": { bg: "bg-gradient-to-br from-amber-500 to-orange-500", text: "text-amber-600", gradient: "from-amber-500 to-orange-500" },
  "insurance-documents": { bg: "bg-gradient-to-br from-purple-500 to-indigo-500", text: "text-purple-600", gradient: "from-purple-500 to-indigo-500" },
  "inspection-documents": { bg: "bg-gradient-to-br from-cyan-500 to-blue-500", text: "text-cyan-600", gradient: "from-cyan-500 to-blue-500" },
  "dangerous-goods-documents": { bg: "bg-gradient-to-br from-red-500 to-rose-500", text: "text-red-600", gradient: "from-red-500 to-rose-500" },
};

interface DocumentPageClientProps {
  category: DocumentCategory;
  moduleSlug: string;
  documentSlug: string | null;
  docSeo: DocumentSEOData | null;
}

export default function DocumentPageClient({ 
  category, 
  moduleSlug, 
  documentSlug, 
  docSeo 
}: DocumentPageClientProps) {
  const colors = categoryColors[category.id] || categoryColors["trade-documents"];
  
  // If there's a document slug, show document detail page
  if (documentSlug) {
    const document = category.documents.find(d => d.slug === documentSlug);
    
    if (!document) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Document Not Found</h1>
            <p className="text-muted-foreground mb-6">The document could not be found.</p>
            <Button asChild>
              <Link href="/documents">Back to Documents</Link>
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <DocumentDetailView 
        category={category} 
        document={document} 
        moduleSlug={moduleSlug}
        docSeo={docSeo}
        colors={colors}
      />
    );
  }
  
  // Show category page with all documents
  return (
    <CategoryDetailView 
      category={category} 
      moduleSlug={moduleSlug}
      colors={colors}
    />
  );
}

// Document Detail View
function DocumentDetailView({ 
  category, 
  document, 
  moduleSlug,
  docSeo,
  colors 
}: { 
  category: DocumentCategory; 
  document: Document; 
  moduleSlug: string;
  docSeo: DocumentSEOData | null;
  colors: { bg: string; text: string; gradient: string };
}) {
  // Generate FAQ structured data
  const faqStructuredData = docSeo?.faq ? generateFAQSchema(docSeo.faq) : null;
  
  return (
    <div className="min-h-screen bg-background">
      {/* FAQ Structured Data */}
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/documents" className="hover:text-foreground transition-colors">Documents</Link>
          <span>/</span>
          <Link href={`/documents/${moduleSlug}`} className="hover:text-foreground transition-colors">{category.name}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{document.name}</span>
        </nav>

        {/* Document Header */}
        <header className="flex flex-col md:flex-row md:items-start gap-4 mb-8">
          <motion.div 
            className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center shadow-lg shrink-0`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <FileText className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{docSeo?.h1 || document.name}</h1>
              {document.featured && (
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground">{docSeo?.introduction || document.description}</p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Document Generator Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-500" />
                  Generate Document
                </CardTitle>
                <CardDescription>
                  Create a professional {document.name} for your trade operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {docSeo?.purpose || `Generate a professional ${document.name.toLowerCase()} for your international trade documentation needs.`}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild className={`bg-gradient-to-r ${colors.gradient} text-white`}>
                    <Link href={`/documents/${moduleSlug}/${document.slug}`}>
                      Open Generator
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/documents/${moduleSlug}`}>
                      View All {category.name}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Key Elements Section */}
            {docSeo?.keyElements && docSeo.keyElements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-emerald-600" />
                    Key Elements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {docSeo.keyElements.map((element, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{element}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* How to Fill Section */}
            {docSeo?.howToFill && docSeo.howToFill.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    How to Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {docSeo.howToFill.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <span className="text-xs text-white font-bold">{index + 1}</span>
                        </div>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Common Mistakes Section */}
            {docSeo?.commonMistakes && docSeo.commonMistakes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Common Mistakes to Avoid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {docSeo.commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* FAQ Section */}
            {docSeo?.faq && docSeo.faq.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HelpCircle className="h-5 w-5 text-amber-600" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {docSeo.faq.map((faq, index) => (
                      <AccordionItem key={index} value={`doc-faq-${index}`}>
                        <AccordionTrigger className="text-left font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Document Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Professional Template</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Compliance Ready</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Quick Generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Export to PDF</span>
                </div>
              </CardContent>
            </Card>

            {/* Category Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Link 
                  href={`/documents/${moduleSlug}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category.documents.length} documents
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>

            {/* Related Documents */}
            {docSeo?.relatedDocuments && docSeo.relatedDocuments.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Related Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.documents
                    .filter(d => docSeo.relatedDocuments.includes(d.slug))
                    .slice(0, 4)
                    .map((relatedDoc) => (
                      <Link 
                        key={relatedDoc.id}
                        href={`/documents/${moduleSlug}/${relatedDoc.slug}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
                            {relatedDoc.name}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Detail View
function CategoryDetailView({ 
  category, 
  moduleSlug,
  colors 
}: { 
  category: DocumentCategory; 
  moduleSlug: string;
  colors: { bg: string; text: string; gradient: string };
}) {
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
              <FileText className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-1" aria-label="Breadcrumb">
                <Link href="/documents" className="hover:text-foreground transition-colors">Documents</Link>
                <span>/</span>
                <span className="text-foreground">{category.name}</span>
              </nav>
              <h1 className="text-3xl font-bold">{category.name}</h1>
            </div>
          </motion.div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            {category.description}
          </p>
          
          <Badge className="text-sm bg-emerald-500 text-white">
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
                <Card className="h-full cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      {document.featured && (
                        <Badge className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base group-hover:text-emerald-600 transition-colors">
                      {document.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm line-clamp-2">
                      {document.description}
                    </CardDescription>
                    <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium">
                      <Download className="h-3 w-3 mr-1" />
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
