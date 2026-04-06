"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  ArrowRight,
  Clock,
  Sparkles,
  Landmark,
  FileText,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Users,
  Target,
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

const learningModules = [
  {
    title: "Letters of Credit",
    description: "Master the complexities of LCs including types, documentation requirements, and common discrepancies to avoid.",
    icon: Landmark,
    color: "from-purple-500 to-violet-500",
    lessons: 8,
    duration: "40 min",
    level: "Intermediate",
  },
  {
    title: "Documentary Collections",
    description: "Understand D/P and D/A terms, when to use them, and how they differ from letters of credit.",
    icon: FileText,
    color: "from-blue-500 to-indigo-500",
    lessons: 5,
    duration: "25 min",
    level: "Beginner",
  },
  {
    title: "Trade Finance Instruments",
    description: "Overview of bank guarantees, standby LCs, forfeiting, and factoring in international trade.",
    icon: CreditCard,
    color: "from-emerald-500 to-teal-500",
    lessons: 6,
    duration: "30 min",
    level: "Intermediate",
  },
  {
    title: "Payment Methods & Risk",
    description: "Compare T/T, open account, consignment, and cash in advance with risk assessment frameworks.",
    icon: ShieldCheck,
    color: "from-orange-500 to-amber-500",
    lessons: 7,
    duration: "35 min",
    level: "Beginner",
  },
];

const additionalResources = [
  { title: "LC Discrepancy Analyzer", icon: Target, type: "Tool", href: "/tools/international-trade/lc-discrepancy-analyzer" },
  { title: "LC Confirmation Pricing", icon: DollarSign, type: "Tool", href: "/tools/international-trade/lc-confirmation-pricing" },
  { title: "Factoring Cost Calculator", icon: CreditCard, type: "Tool", href: "/tools/international-trade/factoring-cost" },
  { title: "Credit Risk Scorer", icon: ShieldCheck, type: "Tool", href: "/tools/international-trade/credit-risk-scorer" },
];

export default function TradeFinancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/30 dark:from-slate-950 dark:via-purple-950/10 dark:to-violet-950/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Coming Soon
            </Badge>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <DollarSign className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Trade Finance Fundamentals
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master the essentials of trade finance. From letters of credit to payment methods, 
            build the knowledge to navigate international trade financing with confidence.
          </p>
        </motion.div>

        {/* Main Learning Modules Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16"
        >
          {learningModules.map((module) => (
            <motion.div key={module.title} variants={itemVariants}>
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg`}>
                      <module.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {module.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4">{module.title}</CardTitle>
                  <CardDescription className="text-base">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{module.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{module.duration}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-violet-500 group-hover:text-white transition-all"
                    disabled
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Module Coming Soon
                    <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Related Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Related Tools & Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {additionalResources.map((resource) => (
              <Link key={resource.title} href={resource.href}>
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all h-full cursor-pointer group">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <resource.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold mb-1">{resource.title}</h3>
                    <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Learning Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-purple-500 to-violet-500 border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-8 pb-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Trade Finance Mastery</h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Comprehensive learning modules designed by trade finance experts. 
                From fundamentals to advanced strategies, enhance your expertise.
              </p>
              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-6">
                <div>
                  <div className="text-3xl font-bold">26</div>
                  <div className="text-sm text-white/80">Lessons</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">2.5</div>
                  <div className="text-sm text-white/80">Hours</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4</div>
                  <div className="text-sm text-white/80">Modules</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
                  <Link href="/knowledge">
                    Knowledge Hub
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  <Link href="/tools">
                    Explore Tools
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
