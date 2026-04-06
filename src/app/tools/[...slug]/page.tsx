"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
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
  Wrench,
  DollarSign,
  Map,
  Package,
  BarChart3,
  CheckSquare,
  Thermometer,
  AlertTriangle,
  Anchor,
  Layers,
  Link as LinkIcon,
  Sparkles,
  FileCheck,
  ClipboardList,
  Download,
  ExternalLink,
  BookOpen,
  Users,
  Target,
  CheckCircle2,
  Info,
  Award,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toolCategories, documentCategories, moduleDocumentMap, modulesMetadata } from "@/lib/constants/tools";
import { getModuleContentBySlug } from "@/lib/constants/moduleContent";

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
  Wrench,
  DollarSign,
  Map,
  Package,
  BarChart3,
  CheckSquare,
  Thermometer,
  AlertTriangle,
  Anchor,
  Layers,
  Link: LinkIcon,
};

const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
  "international-trade": { bg: "bg-gradient-to-br from-blue-500 to-indigo-600", text: "text-blue-600", gradient: "from-blue-500 to-indigo-600" },
  "ocean-freight": { bg: "bg-gradient-to-br from-cyan-500 to-blue-600", text: "text-blue-600", gradient: "from-cyan-500 to-blue-600" },
  "air-freight": { bg: "bg-gradient-to-br from-sky-400 to-blue-500", text: "text-purple-600", gradient: "from-sky-400 to-blue-500" },
  "road-rail": { bg: "bg-gradient-to-br from-orange-500 to-amber-500", text: "text-orange-600", gradient: "from-orange-500 to-amber-500" },
  "customs-compliance": { bg: "bg-gradient-to-br from-red-500 to-rose-600", text: "text-rose-600", gradient: "from-red-500 to-rose-600" },
  "warehousing": { bg: "bg-gradient-to-br from-violet-500 to-purple-600", text: "text-cyan-600", gradient: "from-violet-500 to-purple-600" },
  "ecommerce": { bg: "bg-gradient-to-br from-pink-500 to-rose-500", text: "text-amber-600", gradient: "from-pink-500 to-rose-500" },
  "insurance": { bg: "bg-gradient-to-br from-teal-500 to-cyan-600", text: "text-purple-600", gradient: "from-teal-500 to-cyan-600" },
  "sustainability": { bg: "bg-gradient-to-br from-green-500 to-emerald-600", text: "text-emerald-600", gradient: "from-green-500 to-emerald-600" },
  "project-cargo": { bg: "bg-gradient-to-br from-slate-500 to-gray-600", text: "text-slate-600", gradient: "from-slate-500 to-gray-600" },
  "blockchain-digital-supply-chain": { bg: "bg-gradient-to-br from-purple-500 to-indigo-600", text: "text-purple-600", gradient: "from-purple-500 to-indigo-600" },
  "documents": { bg: "bg-gradient-to-br from-orange-500 to-amber-600", text: "text-orange-600", gradient: "from-orange-500 to-amber-600" },
  "financial-payment": { bg: "bg-gradient-to-br from-emerald-500 to-green-600", text: "text-green-600", gradient: "from-emerald-500 to-green-600" },
  "trade-finance": { bg: "bg-gradient-to-br from-emerald-500 to-green-600", text: "text-emerald-600", gradient: "from-emerald-500 to-green-600" },
  "logistics-planning": { bg: "bg-gradient-to-br from-blue-400 to-indigo-500", text: "text-teal-600", gradient: "from-blue-400 to-indigo-500" },
  "inventory-management": { bg: "bg-gradient-to-br from-violet-400 to-purple-500", text: "text-indigo-600", gradient: "from-violet-400 to-purple-500" },
  "supply-chain-analytics": { bg: "bg-gradient-to-br from-cyan-500 to-blue-600", text: "text-violet-600", gradient: "from-cyan-500 to-blue-600" },
  "quality-control": { bg: "bg-gradient-to-br from-green-500 to-emerald-500", text: "text-amber-600", gradient: "from-green-500 to-emerald-500" },
  "packaging-labeling": { bg: "bg-gradient-to-br from-amber-500 to-orange-500", text: "text-pink-600", gradient: "from-amber-500 to-orange-500" },
  "last-mile-delivery": { bg: "bg-gradient-to-br from-pink-400 to-rose-500", text: "text-orange-600", gradient: "from-pink-400 to-rose-500" },
  "dangerous-goods": { bg: "bg-gradient-to-br from-red-600 to-orange-600", text: "text-red-600", gradient: "from-red-600 to-orange-600" },
  "cold-chain": { bg: "bg-gradient-to-br from-sky-400 to-cyan-500", text: "text-cyan-600", gradient: "from-sky-400 to-cyan-500" },
  "customs-brokerage": { bg: "bg-gradient-to-br from-indigo-500 to-violet-600", text: "text-indigo-600", gradient: "from-indigo-500 to-violet-600" },
  "freight-forwarding": { bg: "bg-gradient-to-br from-blue-500 to-cyan-500", text: "text-blue-600", gradient: "from-blue-500 to-cyan-500" },
  "trade-compliance-advanced": { bg: "bg-gradient-to-br from-purple-600 to-indigo-600", text: "text-rose-600", gradient: "from-purple-600 to-indigo-600" },
  "vessel-operations": { bg: "bg-gradient-to-br from-blue-600 to-slate-600", text: "text-blue-600", gradient: "from-blue-600 to-slate-600" },
  "port-operations": { bg: "bg-gradient-to-br from-teal-500 to-cyan-500", text: "text-teal-600", gradient: "from-teal-500 to-cyan-500" },
};

export default function ModuleOrToolPage() {
  const params = useParams();
  const slugParts = params.slug as string[];
  const [activeTab, setActiveTab] = useState("tools");

  const moduleSlug = slugParts[0];
  const toolSlug = slugParts[1];

  // Find the category/module
  const category = toolCategories.find(c => c.slug === moduleSlug);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Module Not Found</h1>
          <p className="text-muted-foreground mb-6">The module &quot;{moduleSlug}&quot; doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/tools">Back to Tools</Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[category.icon] || Calculator;
  const colors = categoryColors[category.id] || categoryColors["international-trade"];
  
  // Get educational content for this module
  const moduleContent = getModuleContentBySlug(moduleSlug);

  // Get related documents for this module
  const relatedDocCategorySlugs = moduleDocumentMap[moduleSlug] || [];
  const relatedDocuments = relatedDocCategorySlugs.flatMap(catSlug => {
    const docCat = documentCategories.find(dc => dc.slug === catSlug);
    return docCat ? docCat.documents.map(doc => ({ ...doc, categorySlug: catSlug })) : [];
  });

  // If there's a tool slug, show tool info
  if (toolSlug) {
    const tool = category.tools.find(t => t.slug === toolSlug);

    if (!tool) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
            <p className="text-muted-foreground mb-6">The tool &quot;{toolSlug}&quot; doesn&apos;t exist in {category.name}.</p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href={`/tools/${moduleSlug}`}>View {category.name}</Link>
              </Button>
              <Button asChild>
                <Link href="/tools">All Tools</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Show tool page
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/tools" className="hover:text-foreground">Tools</Link>
            <span>/</span>
            <Link href={`/tools/${moduleSlug}`} className="hover:text-foreground">{category.name}</Link>
            <span>/</span>
            <span className="text-foreground">{tool.name}</span>
          </div>

          {/* Tool Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.div 
              className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center shadow-lg`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <Icon className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold">{tool.name}</h1>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
          </div>

          {/* Tool Card */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Tool Available
              </CardTitle>
              <CardDescription>This tool is available in the {category.name} module.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                The {tool.name} helps you with {tool.description.toLowerCase()}.
              </p>
              <div className="flex gap-4">
                <Button asChild className={`bg-gradient-to-r ${colors.gradient} text-white`}>
                  <Link href={`/tools/${moduleSlug}/${tool.slug}`}>
                    Open Tool
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/tools/${moduleSlug}`}>
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

  // Module index page - Show both Tools and Documents
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-transparent border-b">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl" />
        
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
                <Link href="/modules" className="hover:text-foreground">Modules</Link>
                <span>/</span>
                <span className="text-foreground">{category.name}</span>
              </div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
            </div>
          </motion.div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            {category.description}
          </p>
          
          <div className="flex items-center gap-4 flex-wrap">
            <Badge className={`text-sm ${colors.bg} text-white`}>
              <Calculator className="h-3 w-3 mr-1" />
              {category.tools.length} Tools
            </Badge>
            {relatedDocuments.length > 0 && (
              <Badge className="text-sm bg-emerald-500 text-white">
                <FileText className="h-3 w-3 mr-1" />
                {relatedDocuments.length} Documents
              </Badge>
            )}
            {moduleContent?.certificationPath && (
              <Badge className="text-sm bg-amber-500 text-white">
                <Award className="h-3 w-3 mr-1" />
                Certification Path
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* About Module Section */}
      {moduleContent && (
        <section className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* About Module */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  About This Module
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {moduleContent.aboutModule}
                </p>
                {moduleContent.certificationPath && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-600" />
                      <span className="font-medium text-amber-700 dark:text-amber-400">
                        Certification Path: {moduleContent.certificationPath}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  Who Should Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {moduleContent.targetAudience.slice(0, 5).map((audience, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      <span className="text-muted-foreground">{audience}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Key Features & Learning Outcomes */}
      {moduleContent && (
        <section className="container mx-auto px-4 pb-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {moduleContent.keyFeatures.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <span className="text-xs text-white font-bold">{index + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Learning Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-blue-600" />
                  Learning Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {moduleContent.learningOutcomes.slice(0, 6).map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Industry Applications */}
      {moduleContent && (
        <section className="container mx-auto px-4 pb-8">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-orange-600" />
                Industry Applications
              </CardTitle>
              <CardDescription>How this module is used in real-world scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {moduleContent.industryApplications.map((application, index) => (
                  <div key={index} className="p-3 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground">{application}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <Separator className="container mx-auto" />

      {/* Tabs Section */}
      <section className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Tools ({category.tools.length})
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents ({relatedDocuments.length})
            </TabsTrigger>
          </TabsList>

          {/* Tools Tab */}
          <TabsContent value="tools">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.tools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link 
                    href={`/tools/${category.slug}/${tool.slug}`}
                    className="block h-full"
                  >
                    <Card className="h-full cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 group">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                            <Calculator className="h-5 w-5 text-white" />
                          </div>
                          {tool.featured && (
                            <Badge className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm line-clamp-2">
                          {tool.description}
                        </CardDescription>
                        <div className="mt-3 flex items-center text-xs text-blue-600 font-medium">
                          <span>Open tool</span>
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            {relatedDocuments.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {relatedDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link 
                      href={`/documents/${doc.categorySlug}/${doc.slug}`}
                      className="block h-full"
                    >
                      <Card className="h-full cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            {doc.featured && (
                              <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-base group-hover:text-emerald-600 transition-colors">
                            {doc.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm line-clamp-2">
                            {doc.description}
                          </CardDescription>
                          <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium">
                            <Download className="h-3 w-3 mr-1" />
                            <span>View template</span>
                            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Documents Available</h3>
                <p className="text-muted-foreground mb-6">
                  Documents for this module are coming soon. Check back later!
                </p>
                <Button asChild variant="outline">
                  <Link href="/documents">
                    Browse All Documents
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Back Navigation */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline">
                <Link href="/modules">
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  All Modules
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/tools">
                  All Tools
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/documents">
                  All Documents
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {category.tools.length} tools & {relatedDocuments.length} documents in {category.name}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
