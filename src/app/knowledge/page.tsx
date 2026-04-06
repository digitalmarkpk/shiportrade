"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Hash,
  FileCheck,
  DollarSign,
  GraduationCap,
  ArrowRight,
  Clock,
  Sparkles,
  Globe,
  Landmark,
  Package,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const knowledgeModules = [
  {
    title: "Incoterms Guide",
    description: "Complete guide to International Commercial Terms (Incoterms 2020). Understand FOB, CIF, DDP, and all 11 trade terms with practical examples.",
    icon: Globe,
    color: "from-amber-500 to-orange-500",
    lessons: 11,
    duration: "45 min",
    href: "/tools/international-trade/incoterms-guide",
    status: "available",
  },
  {
    title: "HS Code Handbook",
    description: "Master the Harmonized System classification. Learn how to correctly classify products for customs declarations worldwide.",
    icon: Hash,
    color: "from-blue-500 to-indigo-500",
    lessons: 8,
    duration: "30 min",
    href: "/tools/customs-compliance/hs-code-search",
    status: "available",
  },
  {
    title: "Import/Export Documentation",
    description: "Comprehensive guide to trade documentation including commercial invoices, packing lists, certificates of origin, and more.",
    icon: FileCheck,
    color: "from-emerald-500 to-teal-500",
    lessons: 15,
    duration: "60 min",
    href: "/documents",
    status: "available",
  },
  {
    title: "Trade Finance Fundamentals",
    description: "Understanding letters of credit, documentary collections, trade finance instruments, and payment methods in international trade.",
    icon: DollarSign,
    color: "from-purple-500 to-violet-500",
    lessons: 12,
    duration: "50 min",
    href: "#",
    status: "coming-soon",
  },
];

const learningPaths = [
  { title: "Letters of Credit Mastery", icon: Landmark, modules: 5 },
  { title: "Freight Forwarding 101", icon: Package, modules: 8 },
  { title: "Customs Procedures", icon: FileText, modules: 6 },
  { title: "Supply Chain Basics", icon: GraduationCap, modules: 10 },
];

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/20 dark:from-slate-950 dark:via-amber-950/10 dark:to-orange-950/10">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Under Development
            </Badge>
          </div>
          
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Knowledge & Education Hub
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guides, tutorials, and resources for international trade professionals.
            Build expertise at your own pace.
          </p>
        </motion.div>

        {/* Main Modules Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16"
        >
          {knowledgeModules.map((module, index) => (
            <motion.div key={module.title} variants={itemVariants}>
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg`}>
                      <module.icon className="h-7 w-7 text-white" />
                    </div>
                    {module.status === "coming-soon" ? (
                      <Badge variant="secondary" className="text-xs">
                        Coming Soon
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-600 dark:border-emerald-700 dark:text-emerald-400">
                        Available
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl mt-4">{module.title}</CardTitle>
                  <CardDescription className="text-base">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{module.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{module.duration}</span>
                    </div>
                  </div>
                  {module.status === "available" ? (
                    <Button asChild className="w-full group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500 transition-all">
                      <Link href={module.href}>
                        Start Learning
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="ghost" className="w-full" disabled>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Learning Paths Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Structured Learning Paths</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningPaths.map((path, index) => (
              <Card
                key={path.title}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <path.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold mb-1">{path.title}</h3>
                  <p className="text-sm text-muted-foreground">{path.modules} modules</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-8 pb-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Knowledge is Power</h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Our Knowledge Hub provides structured learning paths designed by trade experts.
                From beginners to advanced professionals, find resources to enhance your expertise.
              </p>
              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-6">
                <div>
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-white/80">Guides</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">100+</div>
                  <div className="text-sm text-white/80">Articles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">20+</div>
                  <div className="text-sm text-white/80">Courses</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-white/90">
                  <Link href="/tools">
                    Explore Tools
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  <Link href="/documents">
                    Document Templates
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
